let functions = require('firebase-functions');
let admin = require('firebase-admin');
admin.initializeApp();
exports.createUser = functions.https.onRequest((req, res) => {
    admin.auth().createUser({
        email: req.body.email,
        emailVerified: false,
        password: req.body.password,
        displayName: "John Doe",
    }).then(function (userRecord) {
        // See the UserRecord reference doc for the contents of userRecord.
        console.log("Successfully created new user:", userRecord.uid);
        let user = req.body;
        user.uid = userRecord.uid;
        delete user.password;
        return admin.database('users/' + user.uid).set(user);
    })
        .catch(function (error) {
            console.log("Error creating new user:", error);
        });
});
exports.updateMedidores = functions.https.onRequest((req, res) => {
    const parentRef = admin.database().ref("forms");
    return parentRef.once('value').then(snapshot => {
        const updates = {};
        snapshot.forEach(function (child) {
            admin.database().ref("medidores/nest2/" + child.value().medidor).once('value').then(medidor => {
                admin.database().ref('forms/' + child.value().uid + '/geolocation').set({lat: medidor.lat, lng: medidor.lng});
            })
        });
        return parentRef.update(updates);
    });
});
exports.cleanForms = functions.https.onRequest((req, res) => {
    const parentRef = admin.database().ref("forms");
    parentRef.once('value')
        .then(snapshot => {
            const promises = [];
            snapshot.forEach(child => {
                promises.push(admin.database().ref('forms/' + child.key + '/user/forms').set(null));
            });
            return Promise.all(promimises)
                .then(results => {
                    response.send({result: results.length + ' node(s) deleted'});
                })
                .catch(error => {
                    response.status(500).send(error);
                });
        });
});
exports.inyectSerie = functions.database.ref('forms/{pushId}/serie').onCreate(event => {
    if (!admin.apps.length) {
        admin.initializeApp();
    }
    return admin.database().ref('series/' + event.val() + '/serie').set(event.val());
});
exports.inyectMedidor = functions.database.ref('forms/{pushId}/medidor').onCreate(event => {
    if (!admin.apps.length) {
        admin.initializeApp();
    }
    return admin.database().ref('medidores_usados/' + event.val() + '/medidor').set(event.val());
});
exports.inyectForm = functions.database.ref('forms/{pushId}').onCreate(event => {
    if (!admin.apps.length) {
        admin.initializeApp();
    }
    let form = event.val();
    let formData = {
        calle: form.calle,
        coloria: form.colonia,
        ciudad: form.ciudad,
        uid: form.uid,
        nombre: form.nombre,
        medidor: form.medidor,
        rpu: form.rpu
    };
    admin.database().ref('forms/' + formData.uid + '/user/forms').set(null);
    return admin.database().ref('users/' + form.user.uid + '/forms/' + formData.uid).set(formData);
});
exports.inyectFallida = functions.database.ref('fallidas/{pushId}').onWrite(event => {
    if (!admin.apps.length) {
        admin.initializeApp();
    }
    let form = event.after.val();
    let key = event.after.key;
    admin.database().ref('users/' + form.user.uid + '/fallidas/' + key).set(form);
});
/*exports.sendNewFormEmail = functions.database.ref('forms/{pushId}').onCreate(event => {
    if (!admin.apps.length) {
        admin.initializeApp();
    }
    console.log(event.val());
    let form = event.val();
    let formData = {
        calle: form.calle,
        numero: form.numero,
        coloria: form.colonia,
        ciudad: form.ciudad,
        uid: form.uid,
        nombre: form.nombre,
        medidor: form.medidor,
        rpu: form.rpu
    };
    admin.database().ref('users/'+form.user.uid+'/forms/'+formData.uid).set(formData);
    let data = {
        from: 'app@app.com',
        subject: '¡Nuevo Formulario!',
        html: `<p>Buen día! ${form.user.name} ${form.user.last_name} ha dado de alta un nuevo formulario con id #${form.uid}, para el medidor ${form.medidor}. Si desea verificar detalles, favor de ingresar al sistema con su usuario y contraseña para ver el nuevo registro.</p><p>Gracias</p>`,
        'h:Reply-To': 'app@app.com',
        to: 'eduardoibarra904@gmail.com'
    };
    mailgun.messages().send(data, function (error, body) {
        console.log(body)
    });
});

exports.inyectSerie = functions.database.ref('forms/{pushId}').onCreate(event => {
    if (!admin.apps.length) {
        admin.initializeApp();
    }
    console.log(event.val());
    let form = event.val();
    let formData = {
        serie: form.serie
    };
    admin.database().ref('series/'+form.serie).set(formData);
});

exports.inyectFallida = functions.database.ref('fallidas/{pushId}').onWrite(event => {
    if (!admin.apps.length) {
        admin.initializeApp();
    }
    console.log(event.after.val());
    let form = event.after.val();
    let key = event.after.key;
    admin.database().ref('users/'+form.user.uid+'/fallidas/'+key).set(form);
});*/


/*TOTALES*/

exports.totalFallida = functions.database.ref('fallidas/{pushId}').onWrite(change => {
    if (!admin.apps.length) {
        admin.initializeApp();
    }
    const collectionRef = change.after.ref.parent;
    const countRef = collectionRef.parent.child('/totals/fallidas');
    let increment;
    if (change.after.exists() && !change.before.exists()) {
        increment = 1;
    } else if (!change.after.exists() && change.before.exists()) {
        increment = -1;
    } else {
        return null;
    }
    countRef.transaction((current) => {
        return (current || 0) + increment;
    });
    return null;
});


exports.totalForm = functions.database.ref('forms/{pushId}').onCreate((snapshot) => {
    let form = snapshot.val();
    const getTotalForms = admin.database().ref('/totals/forms');
    return getTotalForms.once('value', (res => {
        const totalForm = res.val() + 1;
        return getTotalForms.set(totalForm)
    })).then(() => {
        //Set varillas totals
        if (form && form.varilla && form.varilla === 'si') {
            const getTotalVarillas = admin.database().ref('/totals/varillas');
            return getTotalVarillas.once('value', (res => {
                const totalVarilla = res.val() + 1;
                return getTotalVarillas.set(totalVarilla)
            }));
        } else {
            return null;
        }
    }).then(() => {
        //total subcontratistas
        const getTotalSubcontratistas = admin.database().ref(`/totals/subcontratistas/${form.user.company.id}`);

        return getTotalSubcontratistas.once('value', (snap) => {

            let newTotal = {
                id: form.user.company.id,
                total: null
            };

            if (snap.exists()) {
                let sub = snap.val();
                newTotal.total = sub.total + 1;
            } else {
                newTotal.total = 1;
            }
            return getTotalSubcontratistas.set(newTotal);
        })
    }).then(() => {
        //Totals materiales

        console.log(form.current_materials);

        form.current_materials.forEach((mat) => {
            if (!mat.current_quantity || parseFloat(mat.current_quantity)<= 0) return;

            const getTotalMaterials = admin.database().ref(`/totals/materials/${mat.id}`);

            let newTotalMaterial = {
                total: null,
                id: mat.id,
                descripcion: mat.descripcion
            };

           return getTotalMaterials.once('value', (snap) => {

               console.log(mat.id + ' exists:' +  snap.exists());
                if (snap.exists()) {
                    newTotalMaterial.total += parseFloat(mat.current_quantity);
                }else{
                    newTotalMaterial.total = parseFloat(mat.current_quantity);
                }

               return getTotalMaterials.set(newTotalMaterial)
            });
        });


    })
});



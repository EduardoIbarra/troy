var functions = require('firebase-functions');
var admin = require('firebase-admin');
admin.initializeApp();
exports.createUser = functions.https.onRequest((req, res) => {
    admin.auth().createUser({
        email: req.body.email,
        emailVerified: false,
        password: req.body.password,
        displayName: "John Doe",
    }).then(function(userRecord) {
        // See the UserRecord reference doc for the contents of userRecord.
        console.log("Successfully created new user:", userRecord.uid);
        var user = req.body;
        user.uid = userRecord.uid;
        delete user.password;
        return admin.database('users/' + user.uid).set(user);
    })
        .catch(function(error) {
            console.log("Error creating new user:", error);
        });
});
exports.cleanForms = functions.https.onRequest((req, res) => {
    const parentRef = admin.database().ref("forms");
    parentRef.once('value')
        .then(snapshot => {
            const promises = [];
            snapshot.forEach(child => {
                promises.push(admin.database().ref('forms/'+child.key+'/user/forms').set(null));
            });
            return Promise.all(promises)
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
    return admin.database().ref('series/'+event.val()+'/serie').set(event.val());
});
exports.inyectMedidor = functions.database.ref('forms/{pushId}/medidor').onCreate(event => {
    if (!admin.apps.length) {
        admin.initializeApp();
    }
    return admin.database().ref('medidores_usados/'+event.val()+'/medidor').set(event.val());
});
exports.inyectForm = functions.database.ref('forms/{pushId}').onCreate(event => {
    if (!admin.apps.length) {
        admin.initializeApp();
    }
    var form = event.val();
    var formData = {
        calle: form.calle,
        coloria: form.colonia,
        ciudad: form.ciudad,
        uid: form.uid,
        nombre: form.nombre,
        medidor: form.medidor,
        rpu: form.rpu
    };
    admin.database().ref('forms/'+formData.uid+'/user/forms').set(null);
    return admin.database().ref('users/'+form.user.uid+'/forms/'+formData.uid).set(formData);
});
exports.inyectFallida = functions.database.ref('fallidas/{pushId}').onWrite(event => {
    if (!admin.apps.length) {
        admin.initializeApp();
    }
    var form = event.after.val();
    var key = event.after.key;
    admin.database().ref('users/'+form.user.uid+'/fallidas/'+key).set(form);
});
/*exports.sendNewFormEmail = functions.database.ref('forms/{pushId}').onCreate(event => {
    if (!admin.apps.length) {
        admin.initializeApp();
    }
    console.log(event.val());
    var form = event.val();
    var formData = {
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
    var data = {
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
    var form = event.val();
    var formData = {
        serie: form.serie
    };
    admin.database().ref('series/'+form.serie).set(formData);
});

exports.inyectFallida = functions.database.ref('fallidas/{pushId}').onWrite(event => {
    if (!admin.apps.length) {
        admin.initializeApp();
    }
    console.log(event.after.val());
    var form = event.after.val();
    var key = event.after.key;
    admin.database().ref('users/'+form.user.uid+'/fallidas/'+key).set(form);
});*/
var functions = require('firebase-functions');
var mailgun = require('mailgun-js')({apiKey: '4e869d235f34af00f2258d0ec231ec9f-6b60e603-c1913bf0', domain: 'troy.eduardoibarra.com'});
var admin = require('firebase-admin');

exports.sendNewFormEmail = functions.database.ref('forms/{pushId}').onCreate(event => {
    console.log(event.val());
    admin.initializeApp();
    if (!admin.apps.length && admin.apps.length === 0) {
        admin.initializeApp();
    }
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
    console.log(event.val());
    admin.initializeApp();
    if (!admin.apps.length && admin.apps.length === 0) {
        admin.initializeApp();
    }
    var form = event.val();
    var formData = {
        serie: form.serie
    };
    admin.database().ref('series/'+form.serie).set(formData);
});
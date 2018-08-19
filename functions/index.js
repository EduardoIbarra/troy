var functions = require('firebase-functions')
var mailgun = require('mailgun-js')({apiKey, domain})

exports.sendNewFormEmail = functions.database.ref('forms/{uid}').onWrite(event => {
    if (!event.data.exists() || event.data.previous.exists()) {
        return
    }

    var form = event.data.val()
    var {email} = 'eduardoibarra904@gmail.com'

    var data = {
        from: 'app@app.com',
        subject: 'Welcome!',
        html: `<p>Buen día! ${form.user.name} ${form.user.last_name} ha dado de alta un nuevo formulario con id #${form.uid}. Si desea verificar detalles, favor de ingresar al sistema con su usuario y contraseña para ver el nuevo registro.</p><p>Gracias</p>`,
        'h:Reply-To': 'app@app.com',
        to: email
    }

    mailgun.messages().send(data, function (error, body) {
        console.log(body)
    })
})
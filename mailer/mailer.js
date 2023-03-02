const nodemailer = require('nodemailer')

//mailer function
const mailer = (enteredEmail, myLink) => {
     const transporter = nodemailer.createTransport({
          host: 'smtp.gmail.com',
          port: 465,
          secure: true,
          auth: {
               user: 'zibbleweb@gmail.com',
               pass: 'nrllmavnsjiyziik'
          }
          // ,
          // tls: {
          // 	rejectUnauthorized: false
          // }
     })

     var mailOptions = {
          from: 'zibbleweb@gmail.com',
          to: enteredEmail,
          subject: "Account Registration",
          html: myLink
     }

     transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
               console.log(error)
          } else {
               console.log('Email sent: ' + info.response)
          }
     })
}
module.exports = { mailer }


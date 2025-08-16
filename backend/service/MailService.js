import nodemailer from 'nodemailer'


class MailService {
    constructor(){
        this.transporter=nodemailer.createTransport(
        {
            host:process.env.SMTP_HOST,
            port:process.env.SMTP_PORT,
            secure:true, // true для 465 порта,
            auth: {
  type: 'LOGIN', // или 'PLAIN'
  user: process.env.SMTP_USER,
  pass: process.env.SMTP_PASSWORD
},
tls: {
                // Дополнительная защита от ошибок SSL
                rejectUnauthorized: false // Только для тестов! В продакшене удалите
            }
        }
    )
    }
async sendActivationMail(to, link){
    await this.transporter.sendMail({
        from: process.env.SMTP_USER,
        to,
        subject:"Активация на аккаунт"+process.env.API_URL,
        text:"",
        html:`<div>
        <h1>Для активации перейдите по ссылке</h1>
        <a href="${link}">${link}</a>`
    })
}
async sendActivationMail(to, link){
    await this.transporter.sendMail({
        from: process.env.SMTP_USER,
        to,
        subject:"Активация на аккаунт"+process.env.API_URL,
        text:"",
        html:`<div>
        <h1>Для активации перейдите по ссылке</h1>
        <a href="${link}">${link}</a>`
    })
}
async sendDeletionCodeMail(to, code) {
    await this.transporter.sendMail({
        from: process.env.SMTP_USER,
        to,
        subject: 'Код подтверждения удаления аккаунта',
        html: `
            <div>
                <h1>Подтверждение удаления аккаунта</h1>
                <p>Ваш код подтверждения: <strong>${code}</strong></p>
                <p>Код действителен в течение 15 минут.</p>
                <p>Если вы не запрашивали удаление аккаунта, проигнорируйте это письмо.</p>
            </div>
        `
    });
}
}


export default new MailService
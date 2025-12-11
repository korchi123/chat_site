import { Resend } from 'resend';

class ResendService {
    constructor() {
        this.resend = new Resend(process.env.RESEND_API_KEY);
    }

    async sendActivationMail(to, link) {
        try {
            console.log('Sending activation email to:', to);
            
            const { data, error } = await this.resend.emails.send({
                from: 'onboarding@resend.dev', // Используйте верифицированный домен позже
                to: [to],
                subject: 'Активация аккаунта',
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h1 style="color: #333;">Добро пожаловать!</h1>
                        <p>Для активации вашего аккаунта перейдите по ссылке:</p>
                        <a href="${link}" style="display: inline-block; padding: 12px 24px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px; margin: 15px 0;">Активировать аккаунт</a>
                        <p style="color: #666; font-size: 14px;">Или скопируйте ссылку: ${link}</p>
                        <p style="color: #999; font-size: 12px;">Если вы не регистрировались, проигнорируйте это письмо.</p>
                    </div>
                `,
            });

            if (error) {
                console.error('Resend error:', error);
                throw new Error(`Email error: ${error.message}`);
            }

            console.log('Email sent successfully:', data?.id);
            return data;
        } catch (error) {
            console.error('Error sending activation email:', error);
            throw error;
        }
    }

    async sendDeletionCodeMail(to, code) {
        try {
            console.log('Sending deletion code to:', to);
            
            const { data, error } = await this.resend.emails.send({
                from: 'onboarding@resend.dev',
                to: [to],
                subject: 'Код подтверждения удаления аккаунта',
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h2 style="color: #dc3545;">Подтверждение удаления аккаунта</h2>
                        <p>Ваш код подтверждения:</p>
                        <div style="font-size: 32px; font-weight: bold; color: #dc3545; margin: 20px 0; padding: 15px; background-color: #f8f9fa; border-radius: 8px; text-align: center; border: 2px dashed #dc3545;">
                            ${code}
                        </div>
                        <p style="color: #666;">Код действителен в течение 15 минут.</p>
                        <p style="color: #dc3545; font-weight: bold;">Если вы не запрашивали удаление аккаунта, немедленно смените пароль!</p>
                    </div>
                `,
            });

            if (error) {
                console.error('Resend error:', error);
                throw new Error(`Email error: ${error.message}`);
            }

            console.log('Deletion code email sent successfully:', data?.id);
            return data;
        } catch (error) {
            console.error('Error sending deletion code email:', error);
            throw error;
        }
    }
}

export default new ResendService();
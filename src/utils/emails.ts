import * as nodemailer from 'nodemailer';
import * as path from 'path';
import * as emailTemplates from 'email-templates';

class Email {
    public transporter: nodemailer.Transporter;
    public email: emailTemplates;

    private host: string = process.env.EMAIL_PORT;
    private port: number = parseInt(process.env.EMAIL_PORT);
    private user: string = process.env.EMAIL_USER;
    private pass: string = process.env.EMAIL_PASS;

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: this.host,
            port: this.port,
            secure: false,
            auth: { user: this.user, pass: this.pass }
        });

        this.email = new emailTemplates({
            message: { form: this.user },
            transport: this.transporter,
            views: { options: { extension: 'handlebars' } }
        });
    }

    public async sendEmail(to: string, data: object, template: string) {
        try {
            const sent = await this.email.send({ template, message: { to }, locals: data });
            return sent;
        } catch (err) {
            return err;
        }
    }
}

export default new Email();

import * as nodemailer from 'nodemailer';
import * as path from 'path';
import * as emailTemplates from 'email-templates';

class Email {
    public transporter: nodemailer.Transporter;
    public email: emailTemplates;

    private host: string = process.env.EMAIL_HOST;
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

    public sendEmail(to: string, data: object, template: string) {
        const self = this;

        return new Promise(function (resolve, reject) {
            return self.email.send({ template, message: { to }, locals: data })
                .then(() => resolve())
                .catch((e) => reject(new Error(e)));
        });
    }
}

export default new Email();

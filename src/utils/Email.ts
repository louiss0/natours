import nodemailer from "nodemailer"
import Mail from "nodemailer/lib/mailer";
import UserTypes from "../types/UserTypes";

export default class Email {

    private to
    private from
    private firstName
    constructor(
        private user: UserTypes.UserDocument,
        private url: string) {
        this.to = user.email;
        this.firstName = user.name.split(' ')[0];
        this.from = `Shelton Louis < ${process.env.EMAIL_FROM}>`;
    }

    newTransport() {
        const {
            SENDGRID_USERNAME,
            SENDGRID_PASSWORD,
            EMAIL_HOST,
            EMAIL_PORT,
            EMAIL_USERNAME,
            EMAIL_PASSWORD
        } = process.env

        if (process.env.NODE_ENV === 'production' &&
            SENDGRID_USERNAME &&
            SENDGRID_PASSWORD) {

            // Sendgrid
            return nodemailer.createTransport({
                service: 'SendGrid',
                auth: {
                    user: SENDGRID_USERNAME,
                    pass: SENDGRID_PASSWORD
                }
            });
        }

        else if (process.env.NODE_ENV === 'development') {
            return nodemailer.createTransport({
                host: EMAIL_HOST,
                port: EMAIL_PORT,
                auth: {
                    user: EMAIL_USERNAME,
                    pass: EMAIL_PASSWORD
                }
            });

        }
    }

    // Send the actual email
    async send(subject: string): Promise<void> {
        // 1) Render HTML based on a pug template


        // 2) Define email options
        const mailOptions: Mail.Options = {
            from: this.from,
            to: this.to,
            subject,
            html: `

                <h2> Hello ${this.firstName} <h2>
            <p>${subject}  ${this.url} <p>
            `
        };

        // 3) Create a transport and send email
        const transport = this.newTransport()

        if (transport) {
            transport.sendMail(mailOptions);

        }

    }

    async sendWelcome(): Promise<void> {
        await this.send('Welcome to the Natours Family!');
    }

    async sendPasswordReset(): Promise<void> {
        await this.send(
            'Use the link to reset your password Your password reset token (valid for only 10 minutes)'
        );
    }
};
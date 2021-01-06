import nodemailer from "nodemailer"
import Mail from "nodemailer/lib/mailer";
import UserTypes from "../types/UserTypes";
import pug from "pug"
import htmlToText from "html-to-text"
export default class Email {

    private to
    private from
    private firstName
    constructor(
        private user: UserTypes.UserDocument,
        private url: string) {
        this.to = this.user.email;
        this.firstName = this.user.name.split(' ')[0];
        this.from = `${process.env.EMAIL_FROM}`;
    }

    newTransport() {
        const {
            SEND_GRID_USERNAME,
            SEND_GRID_PASSWORD,
            EMAIL_HOST,
            EMAIL_PORT,
            EMAIL_USERNAME,
            EMAIL_PASSWORD,
            SEND_GRID_EMAIL_FROM
        } = process.env

        const stringifiedCredentials = JSON.stringify({
            SEND_GRID_USERNAME,
            SEND_GRID_PASSWORD,
            EMAIL_HOST,
            EMAIL_PORT,
            EMAIL_USERNAME,
            EMAIL_PASSWORD,
            SEND_GRID_EMAIL_FROM

        }, null, 2)

        if (
            !(
                SEND_GRID_USERNAME &&
                SEND_GRID_EMAIL_FROM &&
                SEND_GRID_PASSWORD &&
                EMAIL_HOST &&
                EMAIL_PORT &&
                EMAIL_USERNAME &&
                EMAIL_PASSWORD
            )) {
            return console.error(
                'You are missing the proper credentials',
                stringifiedCredentials)
        }



        if (process.env.NODE_ENV === 'production') {

            // Send_grid
            this.from = SEND_GRID_EMAIL_FROM
            return nodemailer.createTransport({
                service: 'Send_Grid',
                auth: {
                    user: SEND_GRID_USERNAME,
                    pass: SEND_GRID_PASSWORD

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

    /**  Send_ the actual email

    @param template  template file that you are using
    
    @param subject  the topic of the email in a sentence

    */
    async send(template: string, subject: string): Promise<void> {
        // 1) Render HTML based on a pug template

        const { from, firstName, to, url } = this

        const html = pug.renderFile(
            `${__dirname}/../../views/emails/${template}.pug`,
            { firstName, url, subject }
        )

        const text = htmlToText.htmlToText(html, {
            preserveNewlines: true
        })

        // 2) Define email options

        const mailOptions: Mail.Options = {
            from,
            to,
            subject,
            html,
            text
        };

        // 3) Create a transport and send_ email
        const transport = this.newTransport()

        if (transport) {
            await transport.sendMail(mailOptions);

        } else {

            console.log(transport)
        }

    }

    async sendWelcome(): Promise<void> {
        await this.send("welcome", 'Welcome to the Natours Family!');
    }

    async sendPasswordReset(): Promise<void> {
        await this.send("password",
            'Use the link to reset your password Your password reset token (valid for only 10 minutes)'
        );
    }
};
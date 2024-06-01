import "dotenv/config";
import nodemailer from "nodemailer";

const transport = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
        user: process.env.MAILTRAP_USERNAME,
        pass: process.env.MAILTRAP_PASSWORD,
    },
});

export const sendMail = ({ to, verificationToken }) => {
    const message = {
        to,
        from: process.env.EMAIL_SENDER,
        subject: "Welcome to our service!",
        html:
            `<h2 style="color: #000000; font-family: Arial;">To complete your registration and activate your account, <span style="color: #FF0000;">please</span> click on the following link:
                <a href="${process.env.LOCAL_HOST}/users/verify/${verificationToken}"> link </a>
            </h2>
                <p style="font-size: 22px; font-family: Arial; color: #000000; font-weight: 600;text-align: center;">Nice to meet you ✅</p>`,
        text: `To complete your registration and activate your account, please click on the following link:
            <a href="${process.env.LOCAL_HOST}/users/verify/${verificationToken}"</a>`
    };
    return transport.sendMail(message);
};








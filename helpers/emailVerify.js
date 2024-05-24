import nodemailer from "nodemailer";
import "dotenv/config";

const transport = nodemailer.createTransport({
    host: "sandbox.smtp.maitrap.io",
    port: 2525,
    auth: {
        user: process.env.MAILTRAP_USERNAME,
        pass: process.env.MAILTRAP_PASSWORD,
    },
});

export const sendMail = (message) => {
    return transport.sendMail(message);
};





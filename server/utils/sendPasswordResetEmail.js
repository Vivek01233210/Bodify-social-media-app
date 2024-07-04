import nodemailer from "nodemailer";

export const sendPasswordResetEmail = async (to, token) => {
    try {
        //1. Create transporter
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: "vivek3553.vr@gmail.com",
                pass: "lwol nqwm plgf vgjz",
            },
        });
        //create the message
        const message = {
            to,
            subject: "Password",
            html: `
        <p>Please click on the following link, or paste this into your browser to complete the process:
        </p>
        <p>http://localhost:5173/reset-password/${token}</p>
        <p>If you did not request this, please ignore this email and your   password will remain unchanged.
        </p>
        `,
        };

        //send the email
        const info = await transporter.sendMail(message);
        console.log("Email sent", info.messageId);
        return info;
    } catch (error) {
        console.log(error);
        res.status(500).json({error})
    }
};

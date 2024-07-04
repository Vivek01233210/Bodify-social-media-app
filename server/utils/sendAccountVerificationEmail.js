import nodemailer from 'nodemailer';

export const sendAccountVerificationEmail = async (to, token) => {
    try {
        // create transporter
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            post: 587,
            secure: false,
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_PASS
            }
        });

        // create the email data
        const mailData = {
            from: process.env.GMAIL_USER || "",
            to,
            subject: "Account Verification",
            html: `<p>Click the link to verify your account: ${process.env.BONDIFY_APP_URL}/dashboard/account-verification/${token}</p>
            <p>If you didn't request this please ignore this email</p>`
        };

        //send the email
        const info = await transporter.sendMail(mailData);
        console.log("Email sent: ", info.messageId)
        return info;

    } catch (error) {
        console.log("Error sending email: ", error);        
    }
}
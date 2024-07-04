import nodemailer from 'nodemailer';

export const sendEmailNotification = async (to, postId) => {
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
            subject: "New Post Created",
            html: `<p>A new post has been created on our site Mern-Blog</p>
            <p>Click <a href="${process.env.BONDIFY_APP_URL}/posts/${postId}">here</a> to view the post.</p>`
        };

        //send the email
        const info = await transporter.sendMail(mailData);
        console.log("Email sent: ", info.messageId)
        return info;

    } catch (error) {
        console.log("Error sending email: ", error);        
    }
}
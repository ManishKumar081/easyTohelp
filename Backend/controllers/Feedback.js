import nodemailer from "nodemailer";

const sendFeedback = async (req, res) => {
    try {

        const { Name, email, contactNo, Subject, message } = req.body;
        console.log("Feedback... ", req.body);

        // Validate details
        if (!Name || !email || !message || !Subject) {
            return res.status(403).json({
                success: false,
                message: "Please fill all the necessary Details"
            });
        }

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        // 1️⃣ Email to Admin
        const adminMail = {
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER,
            subject: "New Feedback Received",
            text: `
                Name: ${Name}
                Email: ${email}
                Contact No: ${contactNo}
                Subject: ${Subject}
                Message: ${message}
                `
        };

        const info = await transporter.sendMail(adminMail);
        console.log("Admin Email sent: " + info.response);

        // 2️⃣ Auto Reply to User
        const userMail = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Thank you for contacting EasyToHelp",
            text: `
                Hello ${Name},

                Thank you for your feedback. 
                Our team will contact you soon.

                Regards,
                EasyToHelp Team
                `
        };

        await transporter.sendMail(userMail);
        console.log("Auto reply sent to user");

        return res.status(200).json({
            success: true,
            message: "Feedback submitted successfully"
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Message wasn't sent. Please try again.",
        });

    }
};

export { sendFeedback };
import nodemailer from "nodemailer";

export const sendEmailToken = async (toEmail, token) => {
	try {
		let transporter = nodemailer.createTransport({
			host: "smtp.gmail.com",
			port: 587,
			auth: {
				user: process.env.EMAIL,
				pass: process.env.PASSWORD,
			},
			authentication: "plain",
			enable_starttls_auto: true,
		});

		const message = `your one-time password: ${token}`;

		let sendingEmail = {
			from: process.env.EMAIL,
			to: toEmail,
			subject: "your one-time password",
			text: message,
		};

		return await transporter.sendMail(sendingEmail);
	} catch (error) {
		console.log(error);
	}
};

import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import { Router } from "express";

const router = Router();
const prisma = new PrismaClient();

const EMAIL_TOKEN_EXPIRATION_MINUTES = 10;
const AUTHENTICATION_EXPIRATION_HOURS = 12;
const JWT_SECRET = process.env.JWT_SECRET || "rahasia";

// random 8 digit
const generateEmailToken = () => {
	return Math.floor(Math.random() * 90000000 + 10000000).toString();
};

const generateAuthToken = (tokenId) => {
	const jwtPayload = { tokenId };

	return jwt.sign(jwtPayload, JWT_SECRET, {
		algorithm: "HS256",
		noTimestamp: true,
	});
};

// create
router.post("/login", async (req, res) => {
	const { email } = req.body;

	const emailToken = generateEmailToken();
	const expiration = new Date(
		new Date().getTime() + EMAIL_TOKEN_EXPIRATION_MINUTES * 60 * 1000
	);

	try {
		const createToken = await prisma.token.create({
			data: {
				type: "EMAIL",
				emailToken,
				expiration,
				user: {
					connectOrCreate: {
						where: { email },
						create: { email },
					},
				},
			},
		});

		console.log(createToken);
		res.status(201).json({ data: "Token EMAIL login created" });
	} catch (error) {
		console.log(error);
		res.status(400).json({
			error: "couldn't start the authentication process",
		});
	}
});

// validate the emailToken
// generated a long-lived jwt token
router.post("/authenticate", async (req, res) => {
	const { email, emailToken } = req.body;

	const dbEmailTokenResult = await prisma.token.findUnique({
		where: {
			emailToken,
		},
		include: {
			user: true,
		},
	});

	if (!dbEmailTokenResult || !dbEmailTokenResult.valid) {
		return res.sendStatus(401);
	}

	if (dbEmailTokenResult.expiration < new Date()) {
		return res.status(401).json({ error: "Token expired!" });
	}

	if (dbEmailTokenResult?.user?.email !== email) {
		return res.sendStatus(401);
	}

	// generate an API token
	const expiration = new Date(
		new Date().getTime() + AUTHENTICATION_EXPIRATION_HOURS * 60 * 60 * 1000
	);

	const apiTokenResult = await prisma.token.create({
		data: {
			type: "API",
			expiration,
			user: {
				connect: {
					email,
				},
			},
		},
	});

	// invalidate the email
	await prisma.token.update({
		where: { id: dbEmailTokenResult.id },
		data: { valid: false },
	});

	// generate the jwt token
	const authToken = generateAuthToken(apiTokenResult.id);

	res.status(201).json({ authToken });
});

export default router;

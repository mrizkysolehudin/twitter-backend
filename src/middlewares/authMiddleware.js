import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const JWT_SECRET = "rahasia";
const prisma = new PrismaClient();

export const authenticateToken = async (req, res, next) => {
	const authHeader = req.headers["authorization"];
	const jwtToken = authHeader?.split(" ")[1]; // memisahkan bearer dan token, kemudian mengambil token yg ada di indeks 1

	if (!jwtToken) {
		return res.sendStatus(401);
	}

	try {
		const payload = await jwt.verify(jwtToken, JWT_SECRET);

		const dbTokenResult = await prisma.token.findUnique({
			where: { id: payload.tokenId },
			include: { user: true },
		});

		if (!dbTokenResult?.valid || dbTokenResult?.expiration < new Date()) {
			return res.status(401).json({ error: "API token expired" });
		}

		req.user = dbTokenResult.user;
	} catch (error) {
		return res.sendStatus(401);
	}

	next();
};

import { PrismaClient } from "@prisma/client";
import { Router } from "express";

const router = Router();
const prisma = new PrismaClient();

// create
router.post("/", async (req, res) => {
	const { content, image } = req.body;

	const user = req.user;

	try {
		const result = await prisma.tweet.create({
			data: {
				content,
				image,
				userId: user.id,
			},
			include: { user: true },
		});

		res.status(201).json(result);
	} catch (error) {
		res.status(400).json({ error: "username and email should be unique" });
	}
});

// get all tweet
router.get("/", async (req, res) => {
	const result = await prisma.tweet.findMany({
		include: {
			user: {
				select: {
					id: true,
					name: true,
					username: true,
					image: true,
				},
			},
		},
	});

	res.status(200).json(result);
});

// get one tweet
router.get(`/:id`, async (req, res) => {
	const { id } = req.params;

	const tweet = await prisma.tweet.findUnique({
		where: { id: Number(id) },
		include: { user: true },
	});

	if (!tweet) {
		return res.status(400).json({ error: "Tweet not found!" });
	}

	res.status(200).json(tweet);
});

// update tweet
router.put(`/:id`, (req, res) => {
	const { id } = req.params;

	res.status(501).json({ error: `Not implemented: ${id}` });
});

// delete
router.delete(`/:id`, async (req, res) => {
	const { id } = req.params;
	await prisma.tweet.delete({
		where: { id: Number(id) },
	});

	res.status(200).json({ data: "Deleted success" });
});

export default router;

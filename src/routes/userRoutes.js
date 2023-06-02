import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();

// create
router.post("/", async (req, res) => {
	const { email, name, username } = req.body;

	try {
		const result = await prisma.user.create({
			data: {
				email,
				name,
				username,
				bio: "hello, i am batman",
			},
		});

		res.status(201).json(result);
	} catch (error) {
		res.status(400).json({ error: "username and email should be unique" });
	}
});

// get all users
router.get("/", async (req, res) => {
	const allUsers = await prisma.user.findMany();
	res.status(200).json(allUsers);
});

// get one user
router.get(`/:id`, async (req, res) => {
	const { id } = req.params;
	const user = await prisma.user.findUnique({
		where: {
			id: Number(id),
		},
		include: {
			tweets: true,
		},
	});

	res.status(200).json(user);
});

// update user
router.put(`/:id`, async (req, res) => {
	const { id } = req.params;
	const { bio, name, image } = req.body;

	try {
		const result = await prisma.user.update({
			where: { id: Number(id) },
			data: { bio, name, image },
		});

		res.status(200).json(result);
	} catch (error) {
		res.status(400).json({ error: "Failed to update the user" });
	}
});

// delete
router.delete(`/:id`, async (req, res) => {
	const { id } = req.params;

	await prisma.user.delete({
		where: { id: Number(id) },
	});
	res.status(200).json({ data: "Deleted success" });
});

export default router;

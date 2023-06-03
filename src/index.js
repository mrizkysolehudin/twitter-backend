import express from "express";
import userRoutes from "./routes/userRoutes.js";
import tweetRoutes from "./routes/tweetRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import { authenticateToken } from "./middlewares/authMiddleware.js";

const PORT = 5000;
const app = express();
app.use(express.json());

// routes
app.use("/user", authenticateToken, userRoutes);
app.use("/tweet", authenticateToken, tweetRoutes);
app.use("/auth", authRoutes);

app.get("/", (req, res) => {
	res.send("Helloooooo");
});

app.listen(PORT, () => {
	console.log(`Server berjalan di port: ${PORT}`);
});

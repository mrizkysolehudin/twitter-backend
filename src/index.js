import express from "express";
import userRouter from "./routes/userRoutes.js";
import tweetRouter from "./routes/tweetRoutes.js";

const PORT = 5000;
const app = express();
app.use(express.json());

// routes
app.use("/user", userRouter);
app.use("/tweet", tweetRouter);

app.get("/", (req, res) => {
	res.send("Helloooooo");
});

app.listen(PORT, () => {
	console.log(`Server berjalan di port: ${PORT}`);
});

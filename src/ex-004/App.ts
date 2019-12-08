import express from "express";

const app = express();
const router = express.Router();

router.get("/", async (req, res) => {
    res.send("Hello, World!");
});
router.get("/with", async (req, res) => {
    res.send("With AWS-Serverless-Express!");
});

app.use("/", router);
export default app;

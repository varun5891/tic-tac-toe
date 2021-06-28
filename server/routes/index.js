import express from "express";

const router = express.Router();

router.get('/', (req, res) => {
    res.json({ message: "Welcome to tic-tae-toe application." });
});

router.get('/user', (req, res) => {
    res.send("User Logged in");
});


router.get("/api", (req, res) => {
    res.json({ message: "Hello from server!" });
});


export default router;
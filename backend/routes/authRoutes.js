import express from "express";
import bcrypt from "bcryptjs";
import generateTokenSetCookie from "../utils/generateTokenSetCookie.js";
import protectRoute from "../middleware/authmiddleware.js"
import prisma from "../db.js";

const router = express.Router();

router.post('/signup', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const existingUser = await prisma.user.findUnique({ where: { email } });

        if (existingUser) {
            return res.status(409).json({ message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
            },
        });

        const token = generateTokenSetCookie(user.id, res);

        return res.status(201).json({
            id: user.id,
            name: user.name,
            email: user.email,
            token,
        });

    } catch (error) {
        console.error("Error in Signup Controller:", error.message);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(400).json({ message: 'Invalid email or password' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid email or password' });

    const token = generateTokenSetCookie(user.id, res);

    return res.status(201).json({
        id: user.id,
        name: user.name,
        email: user.email,
        token,
    });
});

router.post("/logout", async (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 });
        res.status(200).json({ mesage: "Logged Out Successfully" });
    }
    catch (error) {
        console.log("Error in logout controller", error.message);
        res.status(500).json({ error: "Invalid User Data" });
    };
})

router.get("/me", protectRoute, async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      res.json(req.user);
    } catch (error) {
      console.error("Error in getCurrentUser Controller:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });
  
export default router;

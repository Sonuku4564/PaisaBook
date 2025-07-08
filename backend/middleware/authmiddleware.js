import jwt from "jsonwebtoken";
import prisma from "../db.js";

const SECRET = 'Enter your secret';

// Middleware to check if user is authenticated via Authorization header
const protectRoute = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: "No token provided" });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, SECRET);

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId }
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    req.user = user; // Attach user to request
    next();
  } catch (error) {
    console.error("Error in protectRoute middleware:", error.message);
    res.status(401).json({ error: "Invalid or expired token" });
  }
};

// Role-based access middlewares
export const isAdmin = (req, res, next) => {
  if (req.user?.role === 'ADMIN') return next();
  res.status(403).json({ message: 'Access denied. Admins only.' });
};

export const isRetailer = (req, res, next) => {
  if (req.user?.role === 'RETAILER') return next();
  res.status(403).json({ message: 'Access denied. Retailers only.' });
};

export default protectRoute;

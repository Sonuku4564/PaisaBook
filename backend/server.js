import express from "express";
import "dotenv/config";
import cors from "cors"
import cookieParser from "cookie-parser";
import path from "path";


// importing routes
import authRoutes from "./routes/authRoutes.js"
import retailerRoutes from "./routes/retailerRoutes.js"
import productRoutes from "./routes/productRoute.js"
import orderRoutes from "./routes/orderRoutes.js"
import analyticsRoutes from "./routes/analyticsRoutes.js"

const app = express();
const PORT = 3000;

const _dirname = path.resolve();

app.use(express.json())

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,              
}));
  
app.use(cookieParser()); 

// rotues
app.use('/api/auth', authRoutes);
app.use("/api/users", retailerRoutes)
app.use("/api/route/", productRoutes)
app.use("/api/sell/", orderRoutes)
app.use("/api/analytics", analyticsRoutes)

app.use(express.static(path.join(_dirname, "/frontend/dist")))
app.get(/^\/(?!api).*/, (req,res)=>{
    res.sendFile(path.resolve(_dirname, "frontend", "dist", "index.html"));
});


app.listen(PORT, () => {
    console.log(`🚀 Server is running at: http://localhost:${PORT}/`);
});

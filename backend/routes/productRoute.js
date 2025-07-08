import express from "express"
import  protectRoute from "../middleware/authmiddleware.js";
import { isAdmin } from "../middleware/authmiddleware.js";
import prisma from "../db.js";

const router = express.Router()

// Create New Product 
router.post("/products", protectRoute, isAdmin, async(req, res)=>{
    const{name, price, stock} = req.body;
    const adminId = req.user.id;

    try {
        const newProduct = await prisma.product.create({
            data:{
                name,
                price,
                stock,
                adminId
            }
        })
        res.status(201).json(newProduct);
    } catch (error) {
        console.error("Error creating product:", error.message);
        res.status(500).json({ message: "Failed to create product" }); 
    }

})

// Fetch all products
router.get("/products", protectRoute, isAdmin, async(req,res) =>{
    try {
        const allProducts = await prisma.product.findMany();
        res.status(200).json(allProducts);
    } catch (error) {
        console.error("Error Fetching product:", err);
        res.status(500).json({ message: "Failed to Fetching  product" });  
    }
})

// Update product
router.put("/products/:id", protectRoute, isAdmin, async(req,res) =>{
    const {id} = req.params;
    const {name, price, stock} = req.body;

    try {
        const existingProduct = await prisma.product.findUnique({
            where:{id: parseInt(id)},
        })

        if(!existingProduct){
            return res.status(404).json({ error: `Product with ID ${id} not found.` });
        }
        const updateProduct = await prisma.product.update({
            where: { id: parseInt(id) },
            data: {
              name,
              price,
              stock,
            },
        })
        res.status(201).json(updateProduct)
    } catch (error) {
        console.error("Error Updating product:", err);
        res.status(500).json({ message: "Failed to Updating product" });    
    }
})

router.delete("/products/:id", protectRoute, isAdmin, async (req, res) => {
    const { id } = req.params;
  
    try {
      const productId = parseInt(id);
  
      const existingProduct = await prisma.product.findUnique({
        where: { id: productId },
      });
  
      if (!existingProduct) {
        return res.status(404).json({ error: `Product with ID ${id} not found.` });
      }
  
      // 🧹 Delete related records first (e.g., order items referencing this product)
      await prisma.orderItem.deleteMany({
        where: { productId },
      });
  
      // ✅ Now it's safe to delete the product
      await prisma.product.delete({
        where: { id: productId },
      });
  
      res.json({ message: `Product with ID ${id} deleted successfully.` });
  
    } catch (error) {
      console.error(`Error deleting product with ID ${id}:`, error);
      res.status(500).json({ error: 'Failed to delete product.' });
    }
  });
  
export default router;
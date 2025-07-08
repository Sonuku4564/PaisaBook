import express from "express"
import  protectRoute from "../middleware/authmiddleware.js";
import { isAdmin } from "../middleware/authmiddleware.js";
import prisma from "../db.js";


const router = express.Router()

// Create a Retailer
router.post('/retailers', protectRoute, isAdmin, async (req, res) => {
    const { name, phone, address} = req.body;
    const adminId = req.user.id;
  
    try {
      const retailer = await prisma.retailer.create({
        data: {
          name,
          phone,
          address,
          adminId
        }
      });
      res.status(201).json(retailer);
    } catch (err) {
      console.error("Error creating retailer:", err);
      res.status(500).json({ message: "Failed to create retailer" });
    }
  });
  
  // GET All Retailers
  router.get('/retailers', /* protectRoute, */ async (req, res) => {
    try {
      const allRetailers = await prisma.retailer.findMany();
      res.status(200).json(allRetailers);
    } catch (error) {
      console.error('Error fetching retailers:', error);
      res.status(500).json({ error: 'Failed to fetch retailers.' });
    }

    // Update particular retailer
    
  });

  router.put('/retailers/:id',  protectRoute, isAdmin, async (req, res) => {
    const { id } = req.params;
    const { name, phone, address } = req.body;
  
    try {
      // Check if the retailer exists
      const existingRetailer = await prisma.retailer.findUnique({
        where: { id: parseInt(id) },
      });
  
      if (!existingRetailer) {
        return res.status(404).json({ error: `Retailer with ID ${id} not found.` });
      }
  
      // Update the retailer
      const updatedRetailer = await prisma.retailer.update({
        where: { id: parseInt(id) },
        data: {
          name,
          phone,
          address,
        },
      });
  
      res.status(200).json(updatedRetailer);
    } catch (error) {
      console.error(`Error updating retailer with ID ${id}:`, error);
      res.status(500).json({ error: 'Failed to update retailer.' });
    }
  });

  // Delete a particular retailer

  router.delete('/retailers/:id', protectRoute, isAdmin, async (req, res) => {
    const { id } = req.params;
  
    try {
      // Check if the retailer exists
      const existingRetailer = await prisma.retailer.findUnique({
        where: { id: parseInt(id) },
      });
  
      if (!existingRetailer) {
        return res.status(404).json({ error: `Retailer with ID ${id} not found.` });
      }
      // Delete the retailer
      await prisma.retailer.delete({
        where: { id: parseInt(id) },
      });
  
      res.status(200).json({ message: `Retailer with ID ${id} deleted successfully.` });
    } catch (error) {
      console.error(`Error deleting retailer with ID ${id}:`, error);
      res.status(500).json({ error: 'Failed to delete retailer.' });
    }
  });
  

export default router;
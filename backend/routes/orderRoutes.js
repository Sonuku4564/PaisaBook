// routes/retailer.js
import express from 'express';
import prisma from '../db.js';
import { isAdmin } from '../middleware/authmiddleware.js';
import protectRoute  from '../middleware/authmiddleware.js';

const router = express.Router();

// Place Order
router.post('/orders', protectRoute, isAdmin, async (req, res) => {
  const { retailerId, items, isPaid, note} = req.body;
  let total = 0;

  if (!retailerId || !items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Invalid request. Missing retailerId or items.' });
  }

  const productsMap = {};

  for (const item of items) {
    if (!item.productId || !item.quantity || typeof item.quantity !== 'number' || item.quantity <= 0) {
      return res.status(400).json({ error: 'Each item must have a valid productId and quantity.' });
    }

    const product = await prisma.product.findUnique({ where: { id: item.productId } });

    if (!product) {
      return res.status(404).json({ error: `Product with ID ${item.productId} not found.` });
    }

    productsMap[item.productId] = product;
    total += product.price * item.quantity;
  }

  try {
    const order = await prisma.order.create({
      data: {
        retailerId,
        totalAmount: total,
        isPaid,
        note: note || '',
        orderItems: {
          create: items.map(i => ({
            productId: i.productId,
            quantity: i.quantity,
            price: productsMap[i.productId].price, // Secure, server-side price
          })),
        },
      },
      include: { orderItems: true },
    });

    res.status(201).json(order);
  } catch (error) {
    console.error('Order creation failed:', error);
    res.status(500).json({ error: 'Failed to create order.' });
  }
});


// fetch all order details
router.get('/orders', protectRoute, isAdmin, async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      orderBy: {
        createdAt: 'desc', // Sort by creation date (latest first)
      },
      include: {
        retailer: true,
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    });

    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: 'Failed to fetch orders.' });
  }
});

 // update particular order status 
router.put("/order/:id", protectRoute, isAdmin, async (req, res) => {
  const { id } = req.params;
  const { isPaid, note } = req.body;

  try {
    const order = await prisma.order.update({
      where: { id: parseInt(id) },
      data: {
        ...(typeof isPaid === "boolean" && { isPaid }),
        ...(note !== undefined && { note }),
      },
    });

    res.status(200).json({ message: "Order updated", order });
  } catch (error) {
    console.error("Error updating order:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


  // Delete Specific Order
  router.delete("/orders/:id", protectRoute, async (req, res) => {
    const { id } = req.params;
  
    try {
      const order = await prisma.order.findUnique({ where: { id: parseInt(id) } });
  
      if (!order) return res.status(404).json({ message: "Order not found" });
  
      // Delete order and its items
      await prisma.orderItem.deleteMany({ where: { orderId: parseInt(id) } });
      await prisma.order.delete({ where: { id: parseInt(id) } });
  
      res.status(200).json({ message: "Order deleted successfully" });
    } catch (error) {
      console.error("Error deleting order:", error.message);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });
export default router;

import express from "express";
import { isAdmin} from "../middleware/authmiddleware.js";
import protectRoute from "../middleware/authmiddleware.js";
import prisma from "../db.js";

const router = express.Router()

// Overall Analytics Summary
router.get('/summary', protectRoute, isAdmin, async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: { orderItems: true },
    });

    let totalRevenue = 0;
    let totalDues = 0;
    let totalOrders = orders.length;

    for (const order of orders) {
      const orderTotal = order.orderItems.reduce((sum, item) => {
        return sum + item.price * item.quantity;
      }, 0);

      if (order.isPaid) totalRevenue += orderTotal;
      else totalDues += orderTotal;
    }

    const totalSalesAmount = totalRevenue + totalDues;

    res.json({
      totalRevenue: Number(totalRevenue.toFixed(2)),
      totalDues: Number(totalDues.toFixed(2)),
      totalOrders,
      totalSalesAmount: Number(totalSalesAmount.toFixed(2)),
    });
  } catch (err) {
    console.error("Error fetching summary analytics:", err);
    res.status(500).json({ message: 'Error getting summary' });
  }
});

  router.get('/daily', protectRoute, isAdmin, async (req, res) => {
    try {
      const today = new Date();
      const startOfDay = new Date(today.setHours(0, 0, 0, 0));
      const endOfDay = new Date(today.setHours(23, 59, 59, 999));
  
      const orders = await prisma.order.findMany({
        where: {
          createdAt: {
            gte: startOfDay,
            lte: endOfDay,
          },
        },
        include: { items: true },
      });
  
      let dailyRevenue = 0;
      let dailyDues = 0;
      let dailySales = 0;
      let dailyOrders = orders.length;
  
      for (const order of orders) {
        const total = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        if (order.isPaid) dailyRevenue += total;
        else dailyDues += total;
      }
      dailySales = dailyRevenue + dailyDues;
  
      res.json({ dailyRevenue, dailyDues, dailyOrders, dailySales });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ message: 'Error getting daily analytics' });
    }
  });

  router.get('/monthly', protectRoute, isAdmin, async (req, res) => {
    try {
      const now = new Date();
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
      const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
  
      const orders = await prisma.order.findMany({
        where: {
          createdAt: {
            gte: firstDay,
            lte: lastDay,
          },
        },
        include: { items: true },
      });
  
      let monthlyRevenue = 0;
      let monthlyDues = 0;
      let monthlySales = 0;
      let monthlyOrders = orders.length;
  
      for (const order of orders) {
        const total = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        if (order.isPaid) monthlyRevenue += total;
        else monthlyDues += total;
      }
      monthlySales = monthlyRevenue + monthlyDues;
  
      res.json({ monthlyRevenue, monthlyDues, monthlyOrders, monthlyOrders });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ message: 'Error getting monthly analytics' });
    }
  });

  router.get('/retailer-dues', protectRoute, isAdmin, async (req, res) => {
    try {
      const retailers = await prisma.retailer.findMany({
        include: {
          orders: {
            include: { orderItems: true },
          },
        },
      });
  
      const result = retailers.map((retailer) => {
        let due = 0;
        for (const order of retailer.orders) {
          if (order.isPaid) continue;
          for (const item of order.orderItems) {
            due += item.price * item.quantity;
          }
        }
        return {
          retailerId: retailer.id,
          retailerName: retailer.name,
          totalDue: due,
        };
      });
  
      res.json(result);
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ message: 'Error getting retailer dues' });
    }
  });



export default router;
import React, { useEffect, useState } from "react";
import axios from "axios";

const OrderTable = () => {
  const [orders, setOrders] = useState([]);
  const [retailers, setRetailers] = useState([]);
  const [products, setProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const [noteModalOpen, setNoteModalOpen] = useState(false);
  const [noteInput, setNoteInput] = useState("");
  const [noteOrderId, setNoteOrderId] = useState(null);

  const [selectedOrder, setSelectedOrder] = useState({
    id: null,
    retailerId: "",
    isPaid: false,
    items: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const [ordersRes, retailersRes, productsRes] = await Promise.all([
          axios.get("http://localhost:3000/api/sell/orders", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:3000/api/users/retailers", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:3000/api/route/products", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        setOrders(ordersRes.data);
        setRetailers(retailersRes.data);
        setProducts(productsRes.data);
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };
    fetchData();
  }, []);

  const handleAddOrder = () => {
    setIsUpdateMode(false);
    setSelectedOrder({ id: null, retailerId: "", isPaid: false, items: [] });
    setIsModalOpen(true);
  };

  const handleUpdateOrder = (orderId) => {
    const order = orders.find((o) => o.id === orderId);
    if (!order) return;

    const items = order.orderItems.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
      price: item.price,
    }));

    setSelectedOrder({
      id: order.id,
      retailerId: order.retailerId,
      isPaid: order.isPaid,
      items,
    });
    setIsUpdateMode(true);
    setIsModalOpen(true);
  };

  const handleItemChange = (productId, quantity) => {
    const product = products.find((p) => p.id === productId);
    const price = product?.price || 0;

    setSelectedOrder((prev) => {
      const existing = prev.items.find((i) => i.productId === productId);
      const newItems = existing
        ? prev.items.map((i) =>
            i.productId === productId ? { ...i, quantity, price } : i
          )
        : [...prev.items, { productId, quantity, price }];
      return { ...prev, items: newItems };
    });
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  const { id, retailerId, isPaid, items } = selectedOrder;

  if (!retailerId || items.length === 0) {
    alert("Please select a retailer and add at least one product with quantity.");
    return;
  }

  const token = localStorage.getItem("token");

  try {
    if (isUpdateMode) {
      const res = await axios.put(
        `http://localhost:3000/api/sell/order/${id}`,
        { isPaid },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOrders(
        orders.map((o) =>
          o.id === id ? { ...o, isPaid: res.data.order.isPaid } : o
        )
      );
    } else {
      // Create new order
      await axios.post(
        "http://localhost:3000/api/sell/orders",
        { retailerId, isPaid, items },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Refetch full updated list of orders to ensure new order is fully populated
      const ordersRes = await axios.get("http://localhost:3000/api/sell/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(ordersRes.data);
    }

    setIsModalOpen(false);
  } catch (error) {
    console.error("Submit failed:", error.response?.data || error.message);
  }
};


  const handleDeleteOrder = async (orderId) => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`http://localhost:3000/api/sell/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(orders.filter((order) => order.id !== orderId));
    } catch (error) {
      console.error("Error deleting order:", error.message);
    }
  };

  const handleOpenNoteModal = (order) => {
    setNoteInput(order.note || "");
    setNoteOrderId(order.id);
    setNoteModalOpen(true);
  };

  const handleSubmitNote = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.put(
        `http://localhost:3000/api/sell/order/${noteOrderId}`,
        { note: noteInput },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOrders(
        orders.map((o) =>
          o.id === noteOrderId ? { ...o, note: res.data.order.note } : o
        )
      );
      setNoteModalOpen(false);
    } catch (error) {
      console.error("Failed to update note:", error.message);
    }
  };

  return (
    <div className="p-4 overflow-x-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Orders</h2>
        <button
          onClick={handleAddOrder}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Create Order
        </button>
      </div>

      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th className="px-4 py-2 text-left">Retailer</th>
            <th className="px-4 py-2 text-left">Items</th>
            <th className="px-4 py-2 text-left">Total</th>
            <th className="px-4 py-2 text-left">Paid</th>
            <th className="px-4 py-2 text-left">Date</th>
            <th className="px-4 py-2 text-left">Note</th>
            <th className="px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {orders.map((order) => (
            <tr key={order.id}>
              <td className="px-4 py-2">{order.retailer?.name || "Unknown"}</td>
              <td className="px-4 py-2 space-y-1">
                {order.orderItems.map((item) => (
                  <div key={item.id}>
                    {item.product?.name || "Product"} × {item.quantity}
                  </div>
                ))}
              </td>
              <td className="px-4 py-2">₹{order.totalAmount.toFixed(2)}</td>
              <td className="px-4 py-2">{order.isPaid ? "Yes" : "No"}</td>
              <td className="px-4 py-2">{new Date(order.createdAt).toLocaleString()}</td>
              <td className="px-4 py-2">
                {order.note && <div className="text-sm text-gray-700">{order.note}</div>}
                <button
                  onClick={() => handleOpenNoteModal(order)}
                  className="text-blue-600 underline text-sm"
                >
                  {order.note ? "Edit Note" : "Add Note"}
                </button>
              </td>
              <td className="px-4 py-2">
                <button
                  onClick={() => handleUpdateOrder(order.id)}
                  className="bg-blue-600 text-white px-4 py-1 rounded"
                >
                  Update
                </button>
                <button
                  onClick={() => handleDeleteOrder(order.id)}
                  className="bg-red-600 text-white px-4 py-1 rounded ml-4"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isModalOpen && (
        <div className="fixed inset-0 flex justify-center items-center z-50 bg-gray-100 bg-opacity-30">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">
              {isUpdateMode ? "Update Order Payment" : "Create Order"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              {!isUpdateMode && (
                <>
                  <select
                    className="w-full border p-2 rounded"
                    value={selectedOrder.retailerId}
                    onChange={(e) =>
                      setSelectedOrder({
                        ...selectedOrder,
                        retailerId: parseInt(e.target.value),
                      })
                    }
                  >
                    <option value="">Select Retailer</option>
                    {retailers.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name}
                      </option>
                    ))}
                  </select>

                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {products.map((p) => (
                      <div key={p.id} className="flex justify-between items-center">
                        <label className="w-2/3">{p.name} (₹{p.price})</label>
                        <input
                          type="number"
                          min="0"
                          className="border p-1 rounded w-20"
                          placeholder="Qty"
                          onChange={(e) =>
                            handleItemChange(p.id, parseInt(e.target.value) || 0)
                          }
                        />
                      </div>
                    ))}
                  </div>
                </>
              )}

              <div className="flex items-center gap-2">
                <label className="text-sm">Is Paid?</label>
                <input
                  type="checkbox"
                  className="size-5"
                  checked={selectedOrder.isPaid}
                  onChange={(e) =>
                    setSelectedOrder({
                      ...selectedOrder,
                      isPaid: e.target.checked,
                    })
                  }
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-300 px-4 py-1 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-1 rounded"
                >
                  {isUpdateMode ? "Update" : "Submit Order"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {noteModalOpen && (
        <div className="fixed inset-0 flex justify-center items-center z-50 bg-gray-100 bg-opacity-30">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">Update Note</h2>
            <textarea
              className="w-full border p-2 rounded h-24"
              value={noteInput}
              onChange={(e) => setNoteInput(e.target.value)}
            />
            <div className="flex justify-end gap-2 mt-4">
              <button
                type="button"
                onClick={() => setNoteModalOpen(false)}
                className="bg-gray-300 px-4 py-1 rounded"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmitNote}
                className="bg-green-600 text-white px-4 py-1 rounded"
              >
                Save Note
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderTable;

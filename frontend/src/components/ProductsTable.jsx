import React, { useEffect, useState } from "react";
import axios from "axios";

const UsersTable = () => {
  const [products, setProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const storedToken = localStorage.getItem("token");
        const res = await axios.get(
          "http://localhost:3000/api/route/products",
          {
            headers: {
              Authorization: `Bearer ${storedToken}`,
            },
          }
        );
        setProducts(res.data);
      } catch (error) {
        console.log("Error Fetching products", error.message);
      }
    };

    fetchProduct();
  }, []);

  const handleAdd = () => {
    setSelectedProduct({ name: "", price: "", stock: "" });
    setIsEditMode(false);
    setIsModalOpen(true);
  };

  const handleUpdate = (product) => {
    setSelectedProduct(product);  // <== fix here
    setIsEditMode(true);
    setIsModalOpen(true);
  };
  

  const handleDelete = async (productId) => {
    try {
      const storedToken = localStorage.getItem("token");
      await axios.delete(`http://localhost:3000/api/route/products/${productId}`, {
        headers: { Authorization: `Bearer ${storedToken}` },
      });
      setProducts(products.filter(product => product.id !== productId));
    } catch (error) {
      console.log("Error Deleting User", error.message);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const storedToken = localStorage.getItem("token");

      if (isEditMode) {
        // UPDATE
        await axios.put(
          `http://localhost:3000/api/route/products/${selectedProduct.id}`,
          selectedProduct,
          {
            headers: {
              Authorization: `Bearer ${storedToken}`,
            },
          }
        );
        setProducts(
          products.map((p) =>
            p.id === selectedProduct.id ? selectedProduct : p
          )
        );
      } else {
        // CREATE
        const res = await axios.post(
          "http://localhost:3000/api/route/products",
          selectedProduct,
          {
            headers: {
              Authorization: `Bearer ${storedToken}`,
            },
          }
        );
        setProducts([...products, res.data]);
      }

      setIsModalOpen(false);
    } catch (error) {
      console.log("Error Submitting Form", error.message);
    }
  };

  return (
    <div className="overflow-x-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">products</h2>
        <button
          onClick={handleAdd}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Add product
        </button>
      </div>

      <table className="min-w-full divide-y-2 divide-gray-200">
        <thead className="ltr:text-left rtl:text-right">
          <tr className="*:font-medium *:text-gray-900">
            <th className="px-3 py-2 whitespace-nowrap">Serial No</th>
            <th className="px-3 py-2 whitespace-nowrap">Name</th>
            <th className="px-3 py-2 whitespace-nowrap">Rate</th>
            <th className="px-3 py-2 whitespace-nowrap">Stock</th>
            <th className="px-3 py-2 whitespace-nowrap">Actions</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-200 *:even:bg-gray-50">
          {products.map((product, idx) => (
            <tr
              key={product.id || idx}
              className="*:text-gray-900 *:first:font-medium"
            >
              <td className="px-3 py-2 whitespace-nowrap">{idx + 1}</td>
              <td className="px-3 py-2 whitespace-nowrap">{product.name}</td>
              <td className="px-3 py-2 whitespace-nowrap">{product.price}</td>
              <td className="px-3 py-2 whitespace-nowrap">{product.stock}</td>
              <td className="px-3 py-2 whitespace-nowrap space-x-2">
                <button
                  onClick={() => handleUpdate(product)}
                  className="bg-blue-500 text-white px-2 py-1 rounded text-sm"
                >
                  Update
                </button>
                <button
                  onClick={() => handleDelete(product.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded text-sm"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal */}
      {isModalOpen && selectedProduct && (
        <div className="fixed inset-0 shadow-md flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md space-y-4">
            <h2 className="text-lg font-semibold">
              {isEditMode ? "Update product" : "Add product"}
            </h2>

            <form onSubmit={handleFormSubmit} className="space-y-3">
              <input
                className="w-full border p-2 rounded"
                type="text"
                placeholder="Name"
                value={selectedProduct.name}
                onChange={(e) =>
                  setSelectedProduct({
                    ...selectedProduct,
                    name: e.target.value,
                  })
                }
              />
              <input
                className="w-full border p-2 rounded"
                type="number"
                placeholder="Price"
                value={selectedProduct.price}
                onChange={(e) =>
                  setSelectedProduct({
                    ...selectedProduct,
                    price: parseFloat(e.target.value),
                  })
                }
              />

              <input
                className="w-full border p-2 rounded"
                type="number"
                placeholder="Stock"
                value={selectedProduct.stock}
                onChange={(e) =>
                  setSelectedProduct({
                    ...selectedProduct,
                    stock: parseInt(e.target.value),
                  })
                }
              />

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  className="bg-gray-300 text-black px-3 py-1 rounded"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-1 rounded"
                >
                  {isEditMode ? "Save Changes" : "Add product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersTable;

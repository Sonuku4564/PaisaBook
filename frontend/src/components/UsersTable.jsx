import React, { useEffect, useState } from "react";
import axios from "axios";


const UsersTable = () => {
  const [retailers, setRetailers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRetailer, setSelectedRetailer] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false); // NEW

  useEffect(() => {
    const fetchRetailer = async () => {
      try {
        const storedToken = localStorage.getItem("token");
        const res = await axios.get("http://localhost:3000/api/users/retailers", {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        });
        setRetailers(res.data);
      } catch (error) {
        console.log("Error Fetching Retailers", error.message);
      }
    };

    fetchRetailer();
  }, []);

  const handleAdd = () => {
    setSelectedRetailer({ name: "", phone: "", address: "" });
    setIsEditMode(false);
    setIsModalOpen(true);
  };

  const handleUpdate = (retailer) => {
    setSelectedRetailer(retailer);
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const handleDelete = async (retailerId) => {
    try {
      const storedToken = localStorage.getItem("token"); 
      await axios.delete(`http://localhost:3000/api/users/retailers/${retailerId}`,{
        headers: {
          Authorization: `Bearer ${storedToken}`,
        }}
      );
      setRetailers(retailers.filter(retailer => retailer.id !== retailerId));
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
          `http://localhost:3000/api/users/retailers/${selectedRetailer.id}`,
          selectedRetailer,
          {
            headers: {
              Authorization: `Bearer ${storedToken}`,
            },
          }
        );
        setRetailers(retailers.map(r => (r.id === selectedRetailer.id ? selectedRetailer : r)));
      } else {
        // CREATE
        const res = await axios.post(
          "http://localhost:3000/api/users/retailers",
          selectedRetailer,
          {
            headers: {
              Authorization: `Bearer ${storedToken}`,
            },
          }
        );
        setRetailers([...retailers, res.data]);
      }

      setIsModalOpen(false);
    } catch (error) {
      console.log("Error Submitting Form", error.message);
    }
  };

  return (
    <div className="overflow-x-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Retailers</h2>
        <button
          onClick={handleAdd}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Add Retailer
        </button>
      </div>

      <table className="min-w-full divide-y-2 divide-gray-200">
        <thead className="ltr:text-left rtl:text-right">
          <tr className="*:font-medium *:text-gray-900">
            <th className="px-3 py-2 whitespace-nowrap">Serial No</th>
            <th className="px-3 py-2 whitespace-nowrap">Name</th>
            <th className="px-3 py-2 whitespace-nowrap">Phone</th>
            <th className="px-3 py-2 whitespace-nowrap">Address</th>
            <th className="px-3 py-2 whitespace-nowrap">Actions</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-200 *:even:bg-gray-50">
          {retailers.map((retailer, idx) => (
            <tr key={retailer.id || idx} className="*:text-gray-900 *:first:font-medium">
              <td className="px-3 py-2 whitespace-nowrap">{idx + 1}</td>
              <td className="px-3 py-2 whitespace-nowrap">{retailer.name}</td>
              <td className="px-3 py-2 whitespace-nowrap">{retailer.phone}</td>
              <td className="px-3 py-2 whitespace-nowrap">{retailer.address}</td>
              <td className="px-3 py-2 whitespace-nowrap space-x-2">
                <button
                  onClick={() => handleUpdate(retailer)}
                  className="bg-blue-500 text-white px-2 py-1 rounded text-sm"
                >
                  Update
                </button>
                <button
                  onClick={() => handleDelete(retailer.id)}
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
      {isModalOpen && selectedRetailer && (
        <div className="fixed inset-0 shadow-md flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md space-y-4">
            <h2 className="text-lg font-semibold">
              {isEditMode ? "Update Retailer" : "Add Retailer"}
            </h2>

            <form onSubmit={handleFormSubmit} className="space-y-3">
              <input
                className="w-full border p-2 rounded"
                type="text"
                placeholder="Name"
                value={selectedRetailer.name}
                onChange={(e) =>
                  setSelectedRetailer({ ...selectedRetailer, name: e.target.value })
                }
              />
              <input
                className="w-full border p-2 rounded"
                type="text"
                placeholder="Phone"
                value={selectedRetailer.phone}
                onChange={(e) =>
                  setSelectedRetailer({ ...selectedRetailer, phone: e.target.value })
                }
              />
              <input
                className="w-full border p-2 rounded"
                type="text"
                placeholder="Address"
                value={selectedRetailer.address}
                onChange={(e) =>
                  setSelectedRetailer({ ...selectedRetailer, address: e.target.value })
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
                  {isEditMode ? "Save Changes" : "Add Retailer"}
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

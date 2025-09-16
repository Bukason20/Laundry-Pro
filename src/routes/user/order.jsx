import React, { useEffect, useState } from "react";
import { FaPeopleGroup, FaPlus } from "react-icons/fa6";
import { ID, Query, Permission, Role } from "appwrite";
import { databases } from "../../lib/appwrite";
import { useAuth } from "../../context/authContext";
import { Link, useNavigate } from "react-router-dom";
import { MdDelete } from "react-icons/md";
import { SiBookstack } from "react-icons/si";

function Orders() {
  const { user } = useAuth();
  const navigate = useNavigate()
  const [addOrder, setAddOrder] = useState(false);
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  

  // form states
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [clothes, setClothes] = useState([]);
  const [price, setPrice] = useState("");
  const [status, setStatus] = useState("collected");

  // IDs
  const databaseId = "68b88587000b66a7186b"; // same database
  const ordersCollection = "orders";
  const customersCollection = "customers";

  // fetch user orders
  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;
      try {
        const response = await databases.listDocuments(
          databaseId,
          ordersCollection,
          [Query.equal("userId", user.$id)]
        );
        setOrders(response.documents);
      } catch (err) {
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [user]);

  // fetch customers for dropdown
  useEffect(() => {
    const fetchCustomers = async () => {
      if (!user) return;
      try {
        const response = await databases.listDocuments(
          databaseId,
          customersCollection,
          [Query.equal("userId", user.$id)]
        );
        setCustomers(response.documents);
      } catch (err) {
        console.error("Error fetching customers:", err);
      }
    };
    fetchCustomers();
  }, [user]);

  // add a new order
  const handleAddOrder = async (e) => {
    e.preventDefault();
    setLoading(true)
    if (!user || !selectedCustomer) return;

    try {
      const newOrder = await databases.createDocument(
        databaseId,
        ordersCollection,
        ID.unique(),
        {
          userId: user.$id,
          customerId: selectedCustomer,
          clothes: JSON.stringify(clothes),
          price: parseInt(price, 10),
          status,
        },
        [
          Permission.read(Role.user(user.$id)),
          Permission.update(Role.user(user.$id)),
          Permission.delete(Role.user(user.$id)),
        ]
      );

      setOrders((prev) => [...prev, newOrder]);
      setAddOrder(false);
      setSelectedCustomer("");
      setClothes([]);
      setPrice("");
      setStatus("collected");
    } catch (err) {
      console.error("Error adding order:", err);
    } finally {
      setLoading(false)
    }
  };

  // add new cloth row
  const addClothRow = () => {
    setClothes([...clothes, { type: "", quantity: 1, services: [] }]);
    console.log(clothes)
  };

  const removeClothRow = (index) => {
    setClothes((prev) => prev.filter((_, i) => i !== index));
  };
  // update cloth details
  const updateCloth = (index, field, value) => {
    const updated = [...clothes];
    updated[index][field] = value;
    setClothes(updated);
  };

  // toggle services
  const toggleService = (index, service) => {
    const updated = [...clothes];
    if (updated[index].services.includes(service)) {
      updated[index].services = updated[index].services.filter((s) => s !== service);
    } else {
      updated[index].services.push(service);
    }
    setClothes(updated);
  };

  // create lookup map for customers
  const customerMap = Object.fromEntries(customers.map((c) => [c.$id, c.fullName]));

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-blue-400">
          {addOrder ? "Add Order" : "Orders"}
        </h1>

        <button
          className="bg-blue-400 p-2 w-fit cursor-pointer text-white font-bold flex items-center rounded-md"
          onClick={() => setAddOrder(!addOrder)}
        >
          {addOrder ? <SiBookstack /> : <FaPlus />}
          <p>{addOrder ? "View Orders" : "Add Order"}</p>
        </button>
      </div>

      {/* Orders List */}
      {!addOrder && (
        <div className="my-6">
          {loading ? (
            <p>Loading orders...</p>
          ) : orders.length === 0 ? (
            <p>No orders found</p>
          ) : (
            <table className="text-center w-full">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border-y border-x-0 border-blue-200 p-4">Customer</th>
                  <th className="border-y border-x-0 border-blue-200 p-4">Clothes</th>
                  <th className="border-y border-x-0 border-blue-200 p-4">Price</th>
                  <th className="border-y border-x-0 border-blue-200 p-4">Status</th>
                  <th className="border-y border-x-0 border-blue-200 p-4"></th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => {
                  const clothesData = order.clothes ? JSON.parse(order.clothes) : [];
                  return (
                    <tr key={order.$id} onClick={() => navigate(`/u/orders-details/${order.$id}`)} className="bg-gray-100 cursor-default">
                      <td className="border-y border-x-0 border-blue-200 p-4 font-semibold">
                        {customerMap[order.customerId] || "Unknown"}
                      </td>
                      <td className="border-y border-x-0 border-blue-200 p-4 font-semibold">
                        {clothesData.map((c, i) => (
                          <div key={i}>
                            {c.quantity} × {c.type} ({c.services.join(", ")})
                          </div>
                        ))}
                      </td>
                      <td className="border-y border-x-0 border-blue-200 p-4 font-semibold">₦{order.price}</td>
                      <td className="border-y border-x-0 border-blue-200 p-4 font-semibold">{order.status}</td>
                      <td onClick={() => navigate(`/u/orders-details/${order.$id}`)} className="border-y border-x-0 border-blue-200 p-4 font-semibold">
                        <p className="bg-blue-400 w-fit text-white px-3 py-1 text-sm rounded-2xl cursor-pointer">See details</p>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Add New Order Form */}
      {addOrder && (
        <div className="flex flex-col items-center justify-center min-h-[70vh] mt-4">
        <form
          onSubmit={handleAddOrder}
          className="bg-white p-7 mt-5 w-[60%] rounded-lg shadow-md"
        >
          <h2 className="text-xl font-bold mb-4">Create New Order</h2>

          {/* Customer */}
          <label className="block mb-2">Customer</label>
          <select
            value={selectedCustomer}
            onChange={(e) => setSelectedCustomer(e.target.value)}
            className="block w-full p-2 border rounded mb-4"
            required
          >
            <option value="">Select Customer</option>
            {customers.map((c) => (
              <option key={c.$id} value={c.$id}>
                {c.fullName}
              </option>
            ))}
          </select>

          {/* Clothes */}
          <div className="mb-4">
            <h3 className="font-semibold mb-2">Clothes</h3>
            {clothes.map((cloth, index) => (
              <div key={index} className="flex gap-3 mb-3 items-center justify-between">
                <input
                  type="text"
                  placeholder="Cloth type"
                  value={cloth.type}
                  onChange={(e) => updateCloth(index, "type", e.target.value)}
                  className="p-2 border rounded w-1/3"
                  required
                />
                <input
                  type="number"
                  min="1"
                  value={cloth.quantity}
                  onChange={(e) => updateCloth(index, "quantity", e.target.value)}
                  className="p-2 border rounded w-1/6"
                  required
                />
                <div className="flex gap-2 items">
                  {["Wash", "Iron", "Dry Clean"].map((service) => (
                    <label key={service} className="flex items-center gap-1">
                      <input
                        type="checkbox"
                        checked={cloth.services.includes(service)}
                        onChange={() => toggleService(index, service)}
                      />
                      {service}
                    </label>
                  ))}
                </div>

                <div onClick={() => removeClothRow(index)} className="cursor-pointer text-red-400">
                  <MdDelete />
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={addClothRow}
              className="bg-green-400 text-white px-3 py-1 rounded"
            >
              + Add Cloth
            </button>
          </div>

          {/* Price */}
          <label className="block mb-2">Price (₦)</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="p-2 border rounded w-full mb-4"
            required
          />

          {/* Status */}
          <label className="block mb-2">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="p-2 border rounded w-full mb-4"
          >
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="completed">Completed</option>
            <option value="delivered">Delivered</option>
          </select>

          <button
            type="submit"
            className="bg-blue-400 px-4 py-2 text-white font-bold rounded"
          >
            {loading ? "Saving Order" : "Save Order" }
          </button>
        </form>
        </div>
      )}
    </div>
  );
}

export default Orders;

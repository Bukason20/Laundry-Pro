import React, { useEffect, useState } from "react";
import { FaPeopleGroup, FaPlus } from "react-icons/fa6";
import { ID, Query, Permission, Role } from "appwrite";
import { databases } from "../../lib/appwrite";
import { useAuth } from "../../context/authContext";
import { Link, useNavigate } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  const databaseId = "68b88587000b66a7186b"; 
  const ordersCollection = "orders";
  const customersCollection = "customers";

  // Fetch orders
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

  // Fetch customers
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

  // Build chart data: count orders per customer
  const chartData = customers.map((customer) => {
    const orderCount = orders.filter(
      (order) => order.customerId === customer.$id
    ).length;
    return { name: customer.name, orders: orderCount };
  });

  return (
    <div>
      <h1 className="text-3xl font-bold text-blue-400 mb-8">Dashboard</h1>

      {!loading ? (
        <>
          {/* Stats Cards */}
          <div className="flex justify-between gap-3">
            <div className="bg-white w-full rounded-lg p-5 shadow-md">
              <p className="text-sm text-gray-400 font-semibold">Total Customers</p>
              <h2 className="text-3xl font-bold">{customers.length || 0}</h2>
            </div>

            <div className="bg-white w-full rounded-lg p-5 shadow-md">
              <p className="text-sm text-gray-400 font-semibold">Total Orders</p>
              <h2 className="text-3xl font-bold">{orders.length || 0}</h2>
            </div>

            <div className="bg-white w-full rounded-lg p-5 shadow-md">
              <p className="text-sm text-gray-400 font-semibold">Completed Orders</p>
              <h2 className="text-3xl font-bold">
                {orders.filter((order) => order.status === "completed").length || 0}
              </h2>
            </div>

            <div className="bg-white w-full rounded-lg p-5 shadow-md">
              <p className="text-sm text-gray-400 font-semibold">Pending Orders</p>
              <h2 className="text-3xl font-bold">
                {orders.filter((order) => order.status === "pending").length || 0}
              </h2>
            </div>
          </div>

          {/* Orders per customer chart */}
          <div className="bg-white mt-10 p-5 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Orders per Customer</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData} margin={{ top: 20, right: 20, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="orders" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      ) : (
        "Loading..."
      )}
    </div>
  );
}

export default Dashboard;

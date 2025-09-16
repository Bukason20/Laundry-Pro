import React, { useEffect, useState } from "react";
import { FaPeopleGroup, FaPlus } from "react-icons/fa6";
import { ID, Query, Permission, Role } from "appwrite";
import { databases } from "../../lib/appwrite";
import { useAuth } from "../../context/authContext";
import { Link, useNavigate } from "react-router-dom";

function Dashboard() {
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
  return (
    <div>

    </div>
  )
}

export default Dashboard
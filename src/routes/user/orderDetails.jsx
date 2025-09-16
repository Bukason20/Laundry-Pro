import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { databases } from "../../lib/appwrite"; 
import { Query } from "appwrite";
import { useAuth } from "../../context/authContext";

const databaseId = "68b88587000b66a7186b";
const ordersCollection = "orders";

function OrderDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;
      try {
        const response = await databases.listDocuments(
          databaseId,
          ordersCollection,
          [Query.equal("userId", user.$id)]
        );

        const foundOrder = response.documents.find((o) => o.$id === id);
        setOrder(foundOrder || null);
      } catch (err) {
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [id, user]);

  if (loading) return <p>Loading...</p>;
  if (!order) return <p>No order found</p>;

  // ✅ Calculate total quantity here
  const clothes = JSON.parse(order.clothes);
  const totalQuantity = clothes.reduce((sum, cloth) => sum + Number(cloth.quantity), 0);

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] mt-4">
      <div className="bg-white p-7 mt-5 w-[60%] rounded-lg shadow-md">
        <div className="flex justify-between border-b py-3 border-gray-300">
          <div>
            <p className="text-2xl font-semibold">Order #{order.$id.slice(-5)}</p>
            <p className="text-gray-500">
              Placed on{" "}
              {new Date(order.$createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p> 
          </div>
          
          <div className="flex flex-col items-center justify-center">
            <p>Status</p>
            <p className="bg-blue-500 rounded-2xl text-white text-sm px-3 py-1">{order.status}</p>
          </div>
        </div>
      
        <div className="my-3">
          <h3 className="text-xl font-semibold">Order Details</h3>
          <div className="shadow-blue-100 py-3">
            <p className="font-bold">Service</p>
            {clothes.map((cloth, idx) => (
              <div 
                key={idx}
                className="flex justify-between bg-gray-100 mt-1 text-sm p-2 rounded-md border-gray-100"
              >
                <p>{cloth.quantity} x {cloth.type}</p>
                <p>{cloth.services.join(", ")}</p>
              </div>
            ))}
          </div>

          <div className="mt-3 flex justify-between gap-3">
            <div className="w-full">
              <p className="font-bold">Total Quantity</p>
              <p className="flex justify-between bg-gray-100 mt-1 text-sm p-2 rounded-md border-gray-100">{totalQuantity}</p>
            </div>

            <div className="w-full">
              <p className="font-bold">Price</p>
              <p className="flex justify-between bg-gray-100 mt-1 text-sm p-2 rounded-md border-gray-100">₦{order.price}</p>  
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderDetails;

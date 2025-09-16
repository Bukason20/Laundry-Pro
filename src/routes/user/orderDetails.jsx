import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { databases } from "../../lib/appwrite"; 
import { Query, Permission, Role } from "appwrite";
import { useAuth } from "../../context/authContext";

const databaseId = "68b88587000b66a7186b";
const ordersCollection = "orders";

function OrderDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updateStatus, setUpdateStatus] = useState(false);
  const [status, setStatus] = useState("");

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
        if (foundOrder) {
          setStatus(foundOrder.status);
        }
      } catch (err) {
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [id, user]);

  const handleProgress = async () => {
    if (!order || !user) return;
    try {
      const updated = await databases.updateDocument(
        databaseId,
        ordersCollection,
        order.$id,
        { status },
        [
          Permission.read(Role.user(user.$id)),
          Permission.update(Role.user(user.$id)),
          Permission.delete(Role.user(user.$id)),
        ]
      );
      setOrder(updated); // update state with new order
      setUpdateStatus(false); // hide dropdown again
    } catch (err) {
      console.error("Error updating status:", err);
      alert("Failed to update order: " + err.message);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!order) return <p>No order found</p>;

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
            <p className="bg-blue-500 rounded-2xl text-white text-sm px-3 py-1">
              {order.status}
            </p>
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
                <p>
                  {cloth.quantity} x {cloth.type}
                </p>
                <p>{cloth.services.join(", ")}</p>
              </div>
            ))}
          </div>

          <div className="mt-3 flex justify-between gap-3">
            <div className="w-full">
              <p className="font-bold">Total Quantity</p>
              <p className="flex justify-between bg-gray-100 mt-1 text-sm p-2 rounded-md border-gray-100">
                {totalQuantity}
              </p>
            </div>

            <div className="w-full">
              <p className="font-bold">Price</p>
              <p className="bg-gray-100 mt-1 text-sm p-2 rounded-md border-gray-100">
                ₦{order.price}
              </p>
            </div>
          </div>

          {!updateStatus ? (
            <div className="mt-3">
              <p className="font-bold">Status</p>
              <p className="flex justify-between bg-gray-100 mt-1 text-sm p-2 rounded-md border-gray-100">
                {order.status}
              </p>
            </div>
          ) : (
            <div className="mt-3">
              <p className="font-bold">Update Status</p>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="p-2 rounded-md bg-gray-100 w-full border-0 outline-0 mt-1"
              >
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="completed">Completed</option>
                <option value="delivered">Delivered</option>
              </select>
            </div>
          )}
        </div>
      </div>

      <button
        className="bg-blue-500 text-white text-sm rounded-lg w-[150px] font-bold py-2 mt-8"
        onClick={() => {
          if (updateStatus) {
            handleProgress();
          } else {
            setUpdateStatus(true);
          }
        }}
      >
        {updateStatus ? "Save Progress" : "Update Progress"}
      </button>
    </div>
  );
}

export default OrderDetails;

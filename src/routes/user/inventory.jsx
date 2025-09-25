import React, { useEffect, useState } from "react";
import { FaPeopleGroup, FaPlus } from "react-icons/fa6";
import { ID, Query, Permission, Role } from "appwrite";
import { databases } from "../../lib/appwrite";
import { useAuth } from "../../context/authContext";

function Inventory() {
  const { user } = useAuth();
  const [addLaundrySupply, setAddLaundrySupply] = useState(false);
  const [supplies, setSupplies] = useState([]);
  const [loading, setLoading] = useState(true);

  // search state
  const [searchTerm, setSearchTerm] = useState("");

  // form states
  const [itemName, setItemName] = useState("");
  const [itemQuantity, setItemQuantity] = useState();
  const [itemUnit, setItemUnit] = useState("");

  const databaseId = "68b88587000b66a7186b";
  const tableId = "inventories";

  // ✅ fetch only this user's supplies
  useEffect(() => {
    const fetchSupplies = async () => {
      if (!user) return;

      try {
        const response = await databases.listDocuments(
          databaseId,
          tableId,
          [Query.equal("userId", user.$id)]
        );
        setSupplies(response.documents);
      } catch (error) {
        console.error("Error fetching supplies:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSupplies();
  }, [user]);

  // ✅ add new customer
  const handleAddLaundrySupply = async (e) => {
    e.preventDefault();
    if (!user) return;

    try {
      const newSupply = await databases.createDocument(
        databaseId,
        tableId,
        ID.unique(),
        {
          itemName,
          itemQuantity: parseInt(itemQuantity),
          itemUnit,
          userId: user.$id,
        },
        [
          Permission.read(Role.user(user.$id)),
          Permission.update(Role.user(user.$id)),
          Permission.delete(Role.user(user.$id)),
        ]
      );

      setSupplies((prev) => [...prev, newSupply]);
      setAddLaundrySupply(false);
      setItemName("");
      setItemQuantity("");
      setItemUnit("");
    } catch (error) {
      console.error("Error adding customer:", error);
    }
  };

  // ✅ filter supplies
  const filteredsupplies = supplies.filter((customer) =>
    customer.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.itemQuantity.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.itemUnit.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-blue-400">
          {addLaundrySupply ? "Add New Laundry" : "Laundry Supplies"}
        </h1>

        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Search Customer"
            className="bg-white p-2 rounded-md outline-0 border border-gray-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)} // ✅ update searchTerm
          />
          <button
            className="bg-blue-400 p-2 w-fit cursor-pointer text-white font-bold flex items-center rounded-md"
            onClick={() => setAddLaundrySupply(!addLaundrySupply)}
          >
            {addLaundrySupply ? <FaPeopleGroup /> : <FaPlus />}
            <p>{addLaundrySupply ? "View Supplies" : "Add Supply"}</p>
          </button>
        </div>
      </div>

      {/* Show customer list */}
      {!addLaundrySupply && (
        <div className="my-6">
          {loading ? (
            <p>Loading supplies...</p>
          ) : filteredsupplies.length === 0 ? (
            <p>No supplies found</p>
          ) : (
            <table className="text-center w-full">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border-y border-x-0 border-blue-200 p-4">Item Name</th>
                  <th className="border-y border-x-0 border-blue-200 p-4">Item Quantity</th>
                  <th className="border-y border-x-0 border-blue-200 p-4">item Unit</th>
                </tr>
              </thead>
              <tbody>
                {filteredsupplies.map((customer) => (
                  <tr key={customer.$id} className="bg-gray-100">
                    <td className="border-y border-x-0 border-blue-200 p-4 font-semibold">
                      {customer.itemName}
                    </td>
                    <td className="border-y border-x-0 border-blue-200 p-4">
                      {customer.itemQuantity}
                    </td>
                    <td className="border-y border-x-0 border-blue-200 p-4">
                      {customer.itemUnit}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Add new customer form */}
      {addLaundrySupply && (
        <div className="flex flex-col items-center justify-center min-h-[70vh] mt-4">
          <form
            onSubmit={handleAddLaundrySupply}
            className="bg-white p-7 w-[50%] rounded-lg shadow-md"
          >
            <h2 className="text-2xl">Item Supply</h2>

            <div className="my-4">
              <label htmlFor="name" className="text-sm text-gray-500">
                Item Name
              </label>
              <input
                type="text"
                placeholder="e.g. Liquid Detergent"
                id="itemName"
                className="block w-full bg-blue-200 p-2 rounded-md mt-1 outline-0"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                required
              />
            </div>

            <div className="my-4">
              <label htmlFor="itemQuantity" className="text-sm text-gray-500">
                Item Quantity
              </label>
              <input
                type="number"
                placeholder="0"
                id="itemQuantity"
                className="block w-full bg-blue-200 p-2 rounded-md mt-1 outline-0"
                value={itemQuantity}
                onChange={(e) => setItemQuantity(e.target.value)}
                required
              />
            </div>

            <div className="my-4">
              <label htmlFor="itemUnit" className="text-sm text-gray-500">
                Item Unit
              </label>
              <input
                type="text"
                placeholder="e.g. Gallons, lbs, Units"
                id="itemUnit"
                className="block w-full bg-blue-200 p-2 rounded-md mt-1 outline-0"
                value={itemUnit}
                onChange={(e) => setItemUnit(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="w-fit ml-auto mt-6 block bg-blue-400 p-2 cursor-pointer text-white font-bold rounded-md"
            >
              Save Supply
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default Inventory;

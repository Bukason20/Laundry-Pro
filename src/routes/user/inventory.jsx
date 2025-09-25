import React, { useEffect, useState } from "react";
import { FaPeopleGroup, FaPlus, FaTrash } from "react-icons/fa6";
import { ID, Query, Permission, Role } from "appwrite";
import { databases } from "../../lib/appwrite";
import { useAuth } from "../../context/authContext";

function Inventory() {
  const { user } = useAuth();
  const [addLaundrySupply, setAddLaundrySupply] = useState(false);
  const [supplies, setSupplies] = useState([]);
  const [loading, setLoading] = useState(true);

  // editing state
  const [updateIndex, setUpdateIndex] = useState(null);
  const [editName, setEditName] = useState("");
  const [editQuantity, setEditQuantity] = useState("");
  const [editUnit, setEditUnit] = useState("");

  // search state
  const [searchTerm, setSearchTerm] = useState("");

  // form states (for adding)
  const [itemName, setItemName] = useState("");
  const [itemQuantity, setItemQuantity] = useState("");
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

  // ✅ add new supply
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
      console.error("Error adding supply:", error);
    }
  };

  // ✅ update supply
  const handleUpdateSupply = async (supplyId) => {
    try {
      const updated = await databases.updateDocument(
        databaseId,
        tableId,
        supplyId,
        {
          itemName: editName,
          itemQuantity: parseInt(editQuantity),
          itemUnit: editUnit,
        }
      );

      setSupplies((prev) =>
        prev.map((s) => (s.$id === supplyId ? updated : s))
      );

      setUpdateIndex(null);
      setEditName("");
      setEditQuantity("");
      setEditUnit("");
    } catch (error) {
      console.error("Error updating supply:", error);
    }
  };

  // ✅ delete supply
  const handleDeleteSupply = async (supplyId) => {
    try {
      await databases.deleteDocument(databaseId, tableId, supplyId);

      setSupplies((prev) => prev.filter((s) => s.$id !== supplyId));
    } catch (error) {
      console.error("Error deleting supply:", error);
    }
  };

  // filter supplies
  const filteredsupplies = supplies.filter(
    (supply) =>
      supply.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(supply.itemQuantity)
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      supply.itemUnit.toLowerCase().includes(searchTerm.toLowerCase())
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
            placeholder="Search Supply"
            className="bg-white p-2 rounded-md outline-0 border border-gray-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
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

      {/* Show supplies list */}
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
                  <th className="border-y border-x-0 border-blue-200 p-4">
                    Item Name
                  </th>
                  <th className="border-y border-x-0 border-blue-200 p-4">
                    Item Quantity
                  </th>
                  <th className="border-y border-x-0 border-blue-200 p-4">
                    Item Unit
                  </th>
                  <th className="border-y border-x-0 border-blue-200 p-4">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredsupplies.map((supply, id) => (
                  <tr key={supply.$id} className="bg-gray-100">
                    <td className="border-y border-x-0 border-blue-200 p-4 font-semibold">
                      {updateIndex !== id ? (
                        supply.itemName
                      ) : (
                        <input
                          type="text"
                          className="text-center border border-blue-300 rounded-md"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                        />
                      )}
                    </td>
                    <td className="border-y border-x-0 border-blue-200 p-4">
                      {updateIndex !== id ? (
                        supply.itemQuantity
                      ) : (
                        <input
                          type="number"
                          className="text-center border border-blue-300 rounded-md"
                          value={editQuantity}
                          onChange={(e) => setEditQuantity(e.target.value)}
                        />
                      )}
                    </td>
                    <td className="border-y border-x-0 border-blue-200 p-4">
                      {updateIndex !== id ? (
                        supply.itemUnit
                      ) : (
                        <input
                          type="text"
                          className="text-center border border-blue-300 rounded-md"
                          value={editUnit}
                          onChange={(e) => setEditUnit(e.target.value)}
                        />
                      )}
                    </td>
                    <td className="flex items-center justify-center gap-2 py-2">
                      {updateIndex === id ? (
                        <>
                          <button
                            className="bg-green-500 w-fit text-white px-3 py-1 text-sm rounded-2xl cursor-pointer"
                            onClick={() => handleUpdateSupply(supply.$id)}
                          >
                            Save
                          </button>
                          <button
                            className="bg-gray-400 w-fit text-white px-3 py-1 text-sm rounded-2xl cursor-pointer"
                            onClick={() => setUpdateIndex(null)}
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            className="bg-blue-400 w-fit text-white px-3 py-1 text-sm rounded-2xl cursor-pointer"
                            onClick={() => {
                              setUpdateIndex(id);
                              setEditName(supply.itemName);
                              setEditQuantity(supply.itemQuantity);
                              setEditUnit(supply.itemUnit);
                            }}
                          >
                            Update
                          </button>
                          <button
                            onClick={() => handleDeleteSupply(supply.$id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <FaTrash />
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Add new supply form */}
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

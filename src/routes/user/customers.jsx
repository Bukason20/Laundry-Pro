import React, { useEffect, useState } from "react";
import { FaPeopleGroup, FaPlus } from "react-icons/fa6";
import { ID, Query, Permission, Role } from "appwrite";
import { databases } from "../../lib/appwrite";
import { useAuth } from "../../context/authContext";

function Customers() {
  const { user } = useAuth();
  const [addCustomer, setAddCustomers] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  // search state
  const [searchTerm, setSearchTerm] = useState("");

  // form states
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");

  const databaseId = "68b88587000b66a7186b";
  const tableId = "customers";

  // ✅ fetch only this user's customers
  useEffect(() => {
    const fetchCustomers = async () => {
      if (!user) return;

      try {
        const response = await databases.listDocuments(
          databaseId,
          tableId,
          [Query.equal("userId", user.$id)]
        );
        setCustomers(response.documents);
      } catch (error) {
        console.error("Error fetching customers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, [user]);

  // ✅ add new customer
  const handleAddCustomer = async (e) => {
    e.preventDefault();
    if (!user) return;

    try {
      const newCustomer = await databases.createDocument(
        databaseId,
        tableId,
        ID.unique(),
        {
          fullName,
          phoneNumber,
          address,
          userId: user.$id,
        },
        [
          Permission.read(Role.user(user.$id)),
          Permission.update(Role.user(user.$id)),
          Permission.delete(Role.user(user.$id)),
        ]
      );

      setCustomers((prev) => [...prev, newCustomer]);
      setAddCustomers(false);
      setFullName("");
      setPhoneNumber("");
      setAddress("");
    } catch (error) {
      console.error("Error adding customer:", error);
    }
  };

  // ✅ filter customers
  const filteredCustomers = customers.filter((customer) =>
    customer.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phoneNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-blue-400">
          {addCustomer ? "Add Customer" : "Customers"}
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
            onClick={() => setAddCustomers(!addCustomer)}
          >
            {addCustomer ? <FaPeopleGroup /> : <FaPlus />}
            <p>{addCustomer ? "View Customers" : "Add Customer"}</p>
          </button>
        </div>
      </div>

      {/* Show customer list */}
      {!addCustomer && (
        <div className="my-6">
          {loading ? (
            <p>Loading customers...</p>
          ) : filteredCustomers.length === 0 ? (
            <p>No customers found</p>
          ) : (
            <table className="text-center w-full">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border-y border-x-0 border-blue-200 p-4">Name</th>
                  <th className="border-y border-x-0 border-blue-200 p-4">Phone Number</th>
                  <th className="border-y border-x-0 border-blue-200 p-4">Address</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.map((customer) => (
                  <tr key={customer.$id} className="bg-gray-100">
                    <td className="border-y border-x-0 border-blue-200 p-4 font-semibold">
                      {customer.fullName}
                    </td>
                    <td className="border-y border-x-0 border-blue-200 p-4">
                      {customer.phoneNumber}
                    </td>
                    <td className="border-y border-x-0 border-blue-200 p-4">
                      {customer.address}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Add new customer form */}
      {addCustomer && (
        <div className="flex flex-col items-center justify-center min-h-[70vh] mt-4">
          <form
            onSubmit={handleAddCustomer}
            className="bg-white p-7 w-[50%] rounded-lg shadow-md"
          >
            <h2 className="text-2xl">Customer Registration</h2>

            <div className="my-4">
              <label htmlFor="name" className="text-sm text-gray-500">
                Full Name
              </label>
              <input
                type="text"
                placeholder="e.g. John Doe"
                id="name"
                className="block w-full bg-blue-200 p-2 rounded-md mt-1 outline-0"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>

            <div className="my-4">
              <label htmlFor="phoneNumber" className="text-sm text-gray-500">
                Phone Number
              </label>
              <input
                type="text"
                placeholder="e.g. 08023499009"
                id="phoneNumber"
                className="block w-full bg-blue-200 p-2 rounded-md mt-1 outline-0"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
              />
            </div>

            <div className="my-4">
              <label htmlFor="address" className="text-sm text-gray-500">
                Address
              </label>
              <input
                type="text"
                placeholder="e.g. Uyo"
                id="address"
                className="block w-full bg-blue-200 p-2 rounded-md mt-1 outline-0"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="w-fit ml-auto mt-6 block bg-blue-400 p-2 cursor-pointer text-white font-bold rounded-md"
            >
              Save Customer
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default Customers;

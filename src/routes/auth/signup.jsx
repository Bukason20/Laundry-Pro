import { useState } from "react";
import { account } from "../../lib/appwrite"; // adjust path if needed
import { ID } from "appwrite";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContext";

function AuthSignup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const {signup, loading, error} = useAuth()


  const handleSubmit = async (e) => {
    e.preventDefault();
    signup(email, password, name)
  };

  return (
    <div className='flex flex-col items-center justify-center h-[85vh]'>
      <h2 className='text-3xl font-bold'>Create Accpunt</h2>
      <p className='text-sm text-blue-300'>Sign up to manage your Laundry</p>
      <form onSubmit={handleSubmit} className='bg-white w-[35%] px-8 py-5 rounded-md my-5'>
        <input
          type="text"
          placeholder="Full Name"
          className='w-full border border-gray-200 bg-gray-300 p-2 rounded-md my-2 outline-0'
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="email"
          placeholder="Email Address"
          className='w-full border border-gray-200 bg-gray-300 p-2 rounded-md my-2 outline-0'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password (min 8 chars)"
          className='w-full border border-gray-200 bg-gray-300 p-2 rounded-md my-2 outline-0'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button 
          type="submit" 
          disabled={loading}
          className='block bg-blue-400 w-full py-2 mt-5 rounded-md text-white text-center font-semibold cursor-pointer'
        >
          {loading ? "Signing up..." : "Sign Up"}
        </button>
        <p className='text-center text-sm mt-3'>Already have an Account? <Link to="/auth/login" className="cursor-pointer text-blue-400">Sign in</Link></p>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default AuthSignup;

import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await API.post("/auth/login", form);
      localStorage.setItem("token", res.data.token);
      navigate("/");
    } catch {
      alert("User not found → Redirecting to Register");
      navigate("/register");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <h2 className="text-2xl font-bold text-gray-800 text-center">
          Welcome Back
        </h2>
        <p className="text-sm text-gray-500 text-center mt-1 mb-6">
          Login to continue
        </p>

        <input
          type="email"
          placeholder="Email"
          className="w-full mb-3 px-4 py-2.5 border border-gray-200 rounded-lg 
                     focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400
                     transition"
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

      
        <input
          type="password"
          placeholder="Password"
          className="w-full mb-5 px-4 py-2.5 border border-gray-200 rounded-lg 
                     focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400
                     transition"
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
        />

        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium
                     hover:bg-blue-700 active:scale-[0.98] transition"
        >
          Login
        </button>

        <p className="text-sm text-center text-gray-500 mt-5">
          Don’t have an account?{" "}
          <span
            onClick={() => navigate("/register")}
            className="text-blue-600 font-medium cursor-pointer hover:underline"
          >
            Sign up
          </span>
        </p>

      </div>
    </div>
  );
} 
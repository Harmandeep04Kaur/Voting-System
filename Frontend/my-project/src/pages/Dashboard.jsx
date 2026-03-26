import { useEffect, useState } from "react";
import API from "../services/api";
import PollCard from "../components/PollCard";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [polls, setPolls] = useState([]);
  const [filter, setFilter] = useState("all");
  const navigate = useNavigate();

  const fetchPolls = async () => {
    const res = await API.get("/polls");
    setPolls(res.data);
  };

  useEffect(() => {
    fetchPolls();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  const filteredPolls = polls.filter((poll) => {
    const now = new Date();

    if (filter === "active") {
      return poll.expiresAt ? new Date(poll.expiresAt) > now : true;
    }
    if (filter === "expired") {
      return poll.expiresAt ? new Date(poll.expiresAt) <= now : false;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-indigo-50 to-purple-100">
      <div className="flex justify-between items-center px-6 py-4 bg-white shadow-sm border-b">
        
        <h1 className="text-xl font-bold text-indigo-600">
         Poll System
        </h1>

        <div className="flex gap-2">
          <button
            onClick={() => navigate("/create")}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium
                       hover:bg-indigo-700 active:scale-95 transition"
          >
            + Create
          </button>

          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-medium
                       hover:bg-red-600 active:scale-95 transition"
          >
            Logout
          </button>
        </div>
      </div>

   
      <div className="text-center mt-8 px-4">
        <h2 className="text-3xl font-bold text-gray-800">
          Explore Polls
        </h2>
        <p className="text-gray-500 mt-1">
          Vote, create and share opinions
        </p>

        
        <div className="flex justify-center gap-3 mt-5 flex-wrap">

          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition
              ${filter === "all"
                ? "bg-indigo-600 text-white shadow-md"
                : "bg-white text-gray-700 border hover:bg-gray-50"
              }`}
          >
            All
          </button>

          <button
            onClick={() => setFilter("active")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition
              ${filter === "active"
                ? "bg-green-600 text-white shadow-md"
                : "bg-white text-gray-700 border hover:bg-gray-50"
              }`}
          >
            Active
          </button>

          <button
            onClick={() => setFilter("expired")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition
              ${filter === "expired"
                ? "bg-red-500 text-white shadow-md"
                : "bg-white text-gray-700 border hover:bg-gray-50"
              }`}
          >
            Expired
          </button>

        </div>
      </div>


      <div className="p-6 grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">

        {filteredPolls.length > 0 ? (
          filteredPolls.map((poll) => (
            <div
              key={poll._id}
              className="transform hover:scale-[1.02] transition duration-200"
            >
              <PollCard poll={poll} refresh={fetchPolls} />
            </div>
          ))
        ) : (
          <div className="col-span-full text-center mt-10">
            <p className="text-gray-500 text-lg">No polls available</p>
          </div>
        )}

      </div>
    </div>
  );
}
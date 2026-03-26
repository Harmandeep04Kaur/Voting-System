import PollCard from "../components/PollCard";
import { useEffect, useState } from "react";
import API from "../services/api";

export default function Home() {
  const [polls, setPolls] = useState([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    API.get("/polls").then((res) => setPolls(res.data));
  }, []);

 
  const now = new Date();
  const filteredPolls = polls.filter((p) => {
    const isExpired = new Date(p.expiresAt) <= now;

    if (filter === "all") return true;
    if (filter === "active") return !isExpired;
    if (filter === "expired") return isExpired;

    return true;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-100 px-6 py-10">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-gray-800">
          Live Polls
        </h1>

        <p className="text-gray-500 mt-2 text-sm">
          Discover, vote and see what people think in real time
        </p>
      </div>
      <div className="flex justify-center gap-3 mb-8">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-1 rounded-full border ${
            filter === "all" ? "bg-indigo-500 text-white" : "bg-white"
          }`}
        >
          All
        </button>

        <button
          onClick={() => setFilter("active")}
          className={`px-4 py-1 rounded-full border ${
            filter === "active" ? "bg-green-500 text-white" : "bg-white"
          }`}
        >
          Active
        </button>

        <button
          onClick={() => setFilter("expired")}
          className={`px-4 py-1 rounded-full border ${
            filter === "expired" ? "bg-red-500 text-white" : "bg-white"
          }`}
        >
          Expired
        </button>
      </div>

      <div className="grid gap-7 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">

        {filteredPolls.length > 0 ? (
          filteredPolls.map((p) => (
            <div
              key={p._id}
              className="transform transition-all duration-300 hover:scale-[1.03] hover:-translate-y-1 hover:shadow-2xl"
            >
              <PollCard poll={p} />
            </div>
          ))
        ) : (
          <div className="col-span-full flex justify-center mt-12">
            <div className="bg-white p-8 rounded-2xl shadow-md text-center max-w-sm">
              <h2 className="text-lg font-semibold text-gray-700">
                No polls found
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Try switching filter or create a new poll
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

export default function CreatePoll() {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [expiresAt, setExpiresAt] = useState("");
  const navigate = useNavigate();

  const createPoll = async () => {
    try {
      if (!question || !expiresAt) {
        alert("Please fill all fields");
        return;
      }

      const cleanOptions = options.filter((opt) => opt.trim() !== "");

      if (cleanOptions.length < 2) {
        alert("At least 2 options required");
        return;
      }

      const localDate = new Date(expiresAt);
      const utcDate = new Date(localDate.getTime() - localDate.getTimezoneOffset() * 60000);
      const expiresAtISO = utcDate.toISOString();

      await API.post("/polls/postspoll", {
        question,
        options: cleanOptions,
        expiresAt: expiresAtISO,
      });

      navigate("/");
    } catch (err) {
      alert(err.response?.data?.error || "Failed to create poll");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center 
      bg-gradient-to-br from-slate-100 via-indigo-100 to-purple-100 px-4">


      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100 p-7">


        <h2 className="text-3xl font-bold text-center text-gray-800">
          Create Poll
        </h2>
        <p className="text-center text-gray-500 text-sm mt-1 mb-6">
          Share your question with the world
        </p>
        <input
          placeholder="Enter your question..."
          onChange={(e) => setQuestion(e.target.value)}
          className="w-full p-3 mb-4 border border-gray-200 rounded-xl
                     focus:outline-none focus:ring-2 focus:ring-indigo-400
                     focus:border-indigo-400 transition shadow-sm"
        />
        {options.map((opt, i) => (
          <input
            key={i}
            placeholder={`Option ${i + 1}`}
            onChange={(e) => {
              const newOpt = [...options];
              newOpt[i] = e.target.value;
              setOptions(newOpt);
            }}
            className="w-full p-3 mb-3 border border-gray-200 rounded-xl
                       focus:outline-none focus:ring-2 focus:ring-indigo-400
                       focus:border-indigo-400 transition shadow-sm"
          />
        ))}

        <button
          onClick={() => setOptions([...options, ""])}
          className="mb-4 text-sm text-indigo-600 hover:underline"
        >
          + Add another option
        </button>
        <input
          type="datetime-local"
          onChange={(e) => setExpiresAt(e.target.value)}
          className="w-full p-3 mb-5 border border-gray-200 rounded-xl
                     focus:outline-none focus:ring-2 focus:ring-indigo-400
                     focus:border-indigo-400 transition shadow-sm"
        />
        <button
          onClick={createPoll}
          className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold
                     hover:bg-indigo-700 active:scale-[0.98]
                     transition duration-200 shadow-md"
        >
          Create Poll
        </button>

      </div>
    </div>
  );
}
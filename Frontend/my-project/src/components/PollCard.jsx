import { useState, useEffect } from "react";
import API from "../services/api";

export default function PollCard({ poll }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [voted, setVoted] = useState(false);
  const [selected, setSelected] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);

  const isExpired = poll?.expiresAt
    ? new Date(poll.expiresAt).getTime() <= Date.now()
    : false;


  useEffect(() => {
    const savedVote = localStorage.getItem(`vote_${poll._id}`);
    if (savedVote !== null) {
      setVoted(true);
      setSelected(Number(savedVote));
    }
  }, [poll._id]);

  
  useEffect(() => {
    if (!poll?.expiresAt) return;

    const endTime = new Date(poll.expiresAt).getTime();

    const interval = setInterval(() => {
      const diff = endTime - Date.now();
      setTimeLeft(diff > 0 ? diff : 0);

      if (diff <= 0) clearInterval(interval);
    }, 1000);

    return () => clearInterval(interval);
  }, [poll.expiresAt]);


  const formatTime = (ms) => {
    if (ms <= 0) return "00:00";

    const totalSeconds = Math.floor(ms / 1000);
    const min = Math.floor(totalSeconds / 60);
    const sec = totalSeconds % 60;

    return `${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  };


  const vote = async (index) => {
    if (loading || voted || isExpired) return;

    try {
      setLoading(true);
      setError("");
      setSelected(index);

      await API.post(`/polls/${poll._id}/vote`, {
        optionIndex: index,
      });

      setVoted(true);
      localStorage.setItem(`vote_${poll._id}`, index);
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong");

      if (err.response?.data?.error === "You have already voted") {
        setVoted(true);
        localStorage.setItem(`vote_${poll._id}`, index);
      }

      setSelected(null);
    } finally {
      setLoading(false);
    }
  };

  const isLast10Seconds = timeLeft > 0 && timeLeft <= 10000;

  return (
    <div className="bg-white rounded-2xl p-5 shadow-md border">
      <h2 className="text-lg font-bold text-gray-800">
        {poll.question}
      </h2>
      <p className={`text-xs mt-1 font-semibold ${
        isExpired ? "text-red-500" : "text-green-600"
      }`}>
        {isExpired ? "Expired Poll" : "Active Poll"}
      </p>
      <p className={`text-sm mt-2 font-bold ${
        isExpired ? "text-red-500" : "text-indigo-600"
      } ${isLast10Seconds ? "animate-pulse text-red-600" : ""}`}>
        Time Left: {formatTime(timeLeft)}
      </p>
      {error && (
        <div className="mt-3 text-sm text-red-600 bg-red-50 p-2 rounded">
          {error}
        </div>
      )}

      <div className="space-y-3 mt-4">
        {poll.options.map((opt, i) => {
          const isSelected = selected === i;

          return (
            <div key={i}>
              <button
                onClick={() => vote(i)}
                disabled={loading || voted || isExpired}
                className={`w-full px-4 py-3 rounded-xl border transition-all
                  ${
                    voted
                      ? isSelected
                        ? "bg-green-500 text-white border-green-500"
                        : "bg-gray-100 text-gray-400"
                      : "bg-white hover:bg-indigo-50 border-gray-200"
                  }
                  ${(loading || voted || isExpired)
                    ? "opacity-60 cursor-not-allowed"
                    : "cursor-pointer"
                  }
                `}
              >
                {opt.text}
              </button>

              <div className="flex justify-between text-xs mt-1 px-1 text-gray-500">
                <span>Votes</span>
                <span className="font-semibold text-gray-700">
                  {opt.votes}
                </span>
              </div>
            </div>
          );
        })}
      </div>
      {voted && (
        <p className="text-green-600 text-sm mt-4 font-semibold">
           You already voted
        </p>
      )}

      {isExpired && (
        <p className="text-red-500 text-sm mt-4 font-semibold">
         Poll Expired
        </p>
      )}
    </div>
  );
}
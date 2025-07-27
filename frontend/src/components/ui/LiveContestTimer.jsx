import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Timer } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllContests } from "../../features/contest/contestThunks";

function LiveContestTimer({ problemId, contestId }) {
  const [now, setNow] = useState(new Date());
  const { contests } = useSelector((state) => state.contests);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAllContests());
  }, [dispatch, problemId, contestId]);

  const contest = contests.find((c) => c._id === contestId);

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  if (!contest) return <div className="text-white">Contest not found</div>;

  const startTime = new Date(contest.startTime);
  const endTime = new Date(contest.endTime);

  const formatDuration = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const h = Math.floor(totalSeconds / 3600)
      .toString()
      .padStart(2, "0");
    const m = Math.floor((totalSeconds % 3600) / 60)
      .toString()
      .padStart(2, "0");
    const s = (totalSeconds % 60).toString().padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  let timeText = "";
  let color = "";

  if (now < startTime) {
    timeText = formatDuration(startTime - now);
    color = "text-yellow-400!  group-hover:text-white!";
  } else if (now >= startTime && now <= endTime) {
    timeText = formatDuration(endTime - now);
    color = "text-green-400! group-hover:text-white!";
  } else {
    timeText = formatDuration(now - endTime);
    color = "text-red-400! group-hover:text-white!";
  }

  return (
    <div className="flex items-center group gap-2 btn btn-dash btn-error h-8 rounded-xl font-mono shadow-md">
      <Timer className={`${color}`} size={18} />
      <div className="text-sm">
        <span className={`font-semibold ${color}`}>{timeText}</span>
      </div>
    </div>
  );
}

export default LiveContestTimer;

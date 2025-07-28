import { Code2 } from "lucide-react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchSolvedProblems,
  getAllSubmissions,
} from "../../features/problem/problemThunks";
import UserProgress from "./UserProgress";
import RecentActivity from "./RecentActivity";
import FavoriteProblems from "../ui/FavoriteProblems";
import StreakWidget from "../ui/StreakWidget";

function Dashboard() {
  const { allSubmission } = useSelector((state) => state.problems);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllSubmissions());
    dispatch(fetchSolvedProblems());
  }, [dispatch]);

  return (
    <div className="h-full py-2 flex flex-col gap-2">
      <div className="text-black text-3xl pl-5 py-3 dark:text-white">
        All info{" "}
      </div>
        <UserProgress allSubmission={allSubmission} />
      <div className="flex justify-center gap-2">
        <RecentActivity allSubmission={allSubmission} />
        <div className="md:w-[50%] pb-2">
        <StreakWidget streak={user.streak} />
        </div>
      </div>
        <div className="border border-white/20 rounded-2xl">
          <FavoriteProblems />
        </div>
    </div>
  );
}

export default Dashboard;

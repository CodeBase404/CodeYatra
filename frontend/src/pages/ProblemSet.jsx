import { useDispatch, useSelector } from "react-redux";
import Calendar from "../components/ui/Calender";
import DailyProblem from "../components/ui/DailyProblem";
import ProblemsList from "../components/ui/ProblemsList";
import { getAllSubmissions, fetchAllProblems } from "../features/problem/problemThunks";
import { useEffect, useState } from "react";
import StreakWidget from "../components/ui/StreakWidget";

function ProblemSet() {
  const [selectedDate, setSelectedDate] = useState(null);
  const { allSubmission } = useSelector((state) => state.problems);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllSubmissions());
    dispatch(fetchAllProblems());
  }, [dispatch]);

  return (
    <div className="min-h-screen pb-10 px-2 w-full pt-16 md:pt-20 dark:bg-neutral/10">
      <div className="lg:w-[95%] mx-auto">
        <div className="flex md:flex-row flex-col items-center md:justify-between gap-5 w-full pb-1">
          <div className="hidden md:block w-full">
          <DailyProblem />
          </div>
          <div className="hidden lg:block w-full">
            <StreakWidget streak={user?.streak}/>
          </div>
          <div className="w-full flex items-center justify-center">
          <Calendar
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
            allSubmission={allSubmission}
          />
          </div>
        </div>
        <ProblemsList />
      </div>
    </div>
  );
}

export default ProblemSet;

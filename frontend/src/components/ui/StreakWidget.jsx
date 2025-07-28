import { Flame, Calendar, Star, TrendingUp } from "lucide-react";
import { format } from "date-fns";

const StreakWidget = ({ streak }) => {
  if (!streak) return null;

  const isActiveStreak = streak.count > 0;
  const streakPercentage = Math.min((streak.count / streak.highestStreak) * 100, 100);

  return (
    <div className="group relative">
      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-red-500/5 to-yellow-500/10 rounded-3xl" />
      
      <div className="relative px-6 py-3 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm border border-orange-200/20 dark:border-orange-500/20 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] space-y-6">
        
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent flex items-center gap-3">
            <div className={`p-2 rounded-xl ${isActiveStreak ? 'bg-orange-500/20 animate-pulse' : 'bg-gray-200 dark:bg-zinc-700'} transition-all duration-300`}>
              <Flame className={`w-6 h-6 ${isActiveStreak ? 'text-orange-500' : 'text-gray-400'} transition-colors duration-300`} />
            </div>
            Streak Dashboard
          </h2>
          <div className="flex items-center gap-2 px-3 py-1 bg-orange-100 dark:bg-orange-500/20 rounded-full">
            <TrendingUp className="w-4 h-4 text-orange-600 dark:text-orange-400" />
            <span className="text-sm font-medium text-orange-700 dark:text-orange-300">Active</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          <div className="relative group/card">
            <div className="p-4 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-500/10 dark:to-red-500/10 rounded-2xl border border-orange-200/50 dark:border-orange-500/20 hover:border-orange-300 dark:hover:border-orange-400 transition-all duration-300">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-orange-500/20 rounded-lg">
                  <Flame className="w-5 h-5 text-orange-500" />
                </div>
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Current Streak</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                  {streak.count}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">days</span>
              </div>
              
              <div className="mt-3 h-2 bg-gray-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-orange-400 to-red-400 transition-all duration-700 ease-out"
                  style={{ width: `${streakPercentage}%` }}
                />
              </div>
            </div>
          </div>

          <div className="relative group/card">
            <div className="p-4 bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-500/10 dark:to-amber-500/10 rounded-2xl border border-yellow-200/50 dark:border-yellow-500/20 hover:border-yellow-300 dark:hover:border-yellow-400 transition-all duration-300">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-yellow-500/20 rounded-lg">
                  <Star className="w-5 h-5 text-yellow-500" />
                </div>
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Highest Streak</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
                  {streak.highestStreak}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">days</span>
              </div>
              
              {streak.count === streak.highestStreak && streak.count > 0 && (
                <div className="mt-2 inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 dark:bg-yellow-500/20 rounded-full">
                  <Star className="w-3 h-3 text-yellow-600 dark:text-yellow-400" />
                  <span className="text-xs font-medium text-yellow-700 dark:text-yellow-300">Personal Best!</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-500/10 dark:to-indigo-500/10 rounded-2xl border border-blue-200/50 dark:border-blue-500/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Calendar className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300 block">Last Activity</span>
                <span className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                  {streak.lastSolvedDate
                    ? format(new Date(streak.lastSolvedDate), "MMM dd, yyyy")
                    : "No activity yet"}
                </span>
              </div>
            </div>
            
            {streak.lastSolvedDate && (
              <div className="text-right">
                <span className="text-xs text-gray-500 dark:text-gray-400 block">
                  {Math.floor((Date.now() - new Date(streak.lastSolvedDate).getTime()) / (1000 * 60 * 60 * 24))} days ago
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="text-center">
          {isActiveStreak ? (
            <p className="text-sm text-gray-600 dark:text-gray-300">
              🎉 Keep it up! You're on a roll!
            </p>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              💪 Ready to start a new streak?
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default StreakWidget;
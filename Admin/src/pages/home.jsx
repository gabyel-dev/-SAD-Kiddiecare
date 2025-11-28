import { useEffect, useState } from "react";
import {
  FiCalendar,
  FiCheckCircle,
  FiUserPlus,
  FiUsers,
  FiPlus,
  FiUser,
  FiUserCheck,
  FiUserX,
} from "react-icons/fi";
import AddChild from "../components/AddChild";
import { useChildren } from "../hooks/useChildren";
import { useAttendance } from "../hooks/useAttendance";

export default function HomeDashboard({ setActiveTab, activeTab }) {
  const { getTodayAttendance } = useAttendance();
  const [checkedInCount, setCheckedInCount] = useState(0);
  const [open, setOpen] = useState(false);
  const { isLoading, childrenCount } = useChildren();

  useEffect(() => {
    const loadTodayAttendance = async () => {
      try {
        const todayRecords = await getTodayAttendance();
        const presentCount = todayRecords.filter(
          (record) => record.status === "present"
        ).length;
        setCheckedInCount(presentCount);
      } catch (error) {
        console.error("Error loading today's attendance:", error);
      }
    };

    loadTodayAttendance();
  }, [getTodayAttendance]);

  const absentCount = childrenCount - checkedInCount;

  return (
    <div className="min-h-screen bg-gray-50 pb-6 rounded-2xl overflow-hidden relative  z-3">
      {open && <AddChild open={open} setOpen={setOpen} />}

      {/* Header */}
      <div className="px-4 pt-5 pb-3 flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <div className="flex items-center text-gray-500 mt-1.5">
            <FiCalendar className="w-3.5 h-3.5 mr-1.5 text-indigo-500" />
            <span className="text-xs font-medium">
              {new Date().toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>
        </div>
      </div>

      {/* Stats Cards - Compact Layout */}
      <div className="px-4 py-2 grid grid-cols-2 gap-3">
        {/* Total Children */}
        <div className="bg-white rounded-xl p-3.5 shadow-xs border border-gray-100/80">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide">
                Total Children
              </p>
              <div className="flex space-x-1.5 items-center mt-1.5">
                <div className="w-7 h-7 bg-blue-50 rounded-full flex items-center justify-center">
                  <FiUsers className="w-3.5 h-3.5 text-blue-600" />
                </div>
                <p className="text-xl font-bold text-gray-900">
                  {isLoading ? "..." : childrenCount}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Present Today */}
        <div className="bg-white rounded-xl p-3.5 shadow-xs border border-gray-100/80">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide">
                Present
              </p>
              <p className="text-xl font-bold text-gray-900 mt-1.5">
                {checkedInCount}
              </p>
            </div>
            <div className="w-9 h-9 bg-green-50 rounded-full flex items-center justify-center">
              <FiUserCheck className="w-4.5 h-4.5 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Today's Summary - Enhanced */}
      <div className="px-4 py-2">
        <div className="bg-white rounded-xl p-4 shadow-xs border border-gray-100/80">
          <h3 className="font-bold text-gray-900 text-sm mb-3.5 flex items-center">
            <FiCalendar className="w-3.5 h-3.5 mr-2 text-indigo-500" />
            Today's Summary
          </h3>

          <div className="space-y-3">
            {/* Present */}
            <div className="flex items-center justify-between py-1.5">
              <div className="flex items-center">
                <div className="w-6 h-6 bg-green-50 rounded-md flex items-center justify-center mr-2.5">
                  <FiUserCheck className="w-3 h-3 text-green-600" />
                </div>
                <span className="text-xs font-medium text-gray-600">
                  Present
                </span>
              </div>
              <div className="flex items-center">
                <span className="text-sm font-bold text-gray-900 mr-1.5">
                  {checkedInCount}
                </span>
                <span className="text-[10px] text-gray-400 font-medium">
                  children
                </span>
              </div>
            </div>

            {/* Absent */}
            <div className="flex items-center justify-between py-1.5">
              <div className="flex items-center">
                <div className="w-6 h-6 bg-red-50 rounded-md flex items-center justify-center mr-2.5">
                  <FiUserX className="w-3 h-3 text-red-500" />
                </div>
                <span className="text-xs font-medium text-gray-600">
                  Absent
                </span>
              </div>
              <div className="flex items-center">
                <span className="text-sm font-bold text-gray-900 mr-1.5">
                  {absentCount}
                </span>
                <span className="text-[10px] text-gray-400 font-medium">
                  children
                </span>
              </div>
            </div>

            {/* Total */}
            <div className="flex items-center justify-between py-1.5 border-t border-gray-100 pt-3">
              <div className="flex items-center">
                <div className="w-6 h-6 bg-blue-50 rounded-md flex items-center justify-center mr-2.5">
                  <FiUsers className="w-3 h-3 text-blue-600" />
                </div>
                <span className="text-xs font-medium text-gray-600">
                  Total Registered
                </span>
              </div>
              <div className="flex items-center">
                <span className="text-sm font-bold text-gray-900 mr-1.5">
                  {isLoading ? "..." : childrenCount}
                </span>
                <span className="text-[10px] text-gray-400 font-medium">
                  children
                </span>
              </div>
            </div>
          </div>

          {/* Summary Bar */}
          {childrenCount > 0 && (
            <div className="mt-4 pt-3 border-t border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-medium text-gray-500">
                  Attendance Rate
                </span>
                <span className="text-[10px] font-bold text-gray-700">
                  {Math.round((checkedInCount / childrenCount) * 100)}%
                </span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-1.5">
                <div
                  className="bg-gradient-to-r from-green-500 to-green-400 h-1.5 rounded-full transition-all duration-500"
                  style={{
                    width: `${(checkedInCount / childrenCount) * 100}%`,
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-4 py-3">
        <div className="grid grid-cols-1 gap-2 bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-full p-3 shadow-md">
          <button
            onClick={() => setOpen(true)}
            className="flex items-center justify-center gap-2 hover:bg-white/30 backdrop-blur-sm rounded-lg text-white transition-colors active:scale-95"
          >
            <FiUserPlus className="w-4 h-4" />
            <span className="text-xs font-medium">Add Child</span>
          </button>
        </div>
      </div>
    </div>
  );
}

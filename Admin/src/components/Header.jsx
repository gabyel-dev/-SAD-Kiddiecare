import { FiCalendar, FiLogOut, FiUser } from "react-icons/fi";
import { useAdmin } from "../hooks/useAdmin";

export default function Header({ onLogout }) {
  const { getAdminInfo } = useAdmin();

  return (
    <header className="bg-gradient-to-r from-indigo-600 to-indigo-500 px-6 py-6 h-48 absolute top-0 left-0 right-0 shadow-lg border-b border-indigo-400/30 safe-area-inset-top w-full z-1">
      <div className="flex justify-between items-center w-full">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/30">
            <span className="text-white font-bold text-lg">K</span>
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight">
            Kiddiecare
          </h1>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/20">
            <FiUser className="w-4 h-4 text-white/80" />
            <span className="text-white text-xs font-medium">
              {getAdminInfo?.username || "Admin"}
            </span>
          </div>

          <button
            onClick={onLogout}
            className="p-2.5 text-white hover:text-red-200 hover:bg-white/15 rounded-xl transition-all duration-200 active:scale-95 backdrop-blur-sm border border-white/20 hover:border-white/30 shadow-sm"
            title="Logout"
          >
            <FiLogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="pt-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1 tracking-tight">
              Welcome back! 👋
            </h1>

            <div className="flex items-center space-x-2 text-white/70">
              <FiCalendar className="w-4 h-4" />
              <span className="text-xs font-medium">
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

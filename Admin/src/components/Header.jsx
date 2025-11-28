import { BsFilterRight } from "react-icons/bs";
import { FiLogOut, FiUsers } from "react-icons/fi";
import { useChildren } from "../hooks/useChildren";
import { useAttendance } from "../hooks/useAttendance";
import { useAdmin } from "../hooks/useAdmin";

export default function Header({ onLogout }) {
  const { childrenCount, isLoading } = useChildren();
  const { getAdminInfo } = useAdmin();

  return (
    <header className="bg-gradient-to-r from-indigo-600 to-indigo-500 px-4 py-4 h-40 absolute top-0 left-0 right-0 shadow-sm border-b border-indigo-400/30 safe-area-inset-top w-full z-1">
      <div className="flex justify-between items-center w-full ">
        <div className="flex items-center space-x-3">
          <h1 className="text-lg font-bold text-white">Kiddiecare</h1>
        </div>

        <button
          onClick={onLogout}
          className="p-2 text-white hover:text-red-200 hover:bg-white/10 rounded-lg transition-colors active:scale-95"
          title="Logout"
        >
          <FiLogOut className="w-5 h-5" />
        </button>
      </div>

      <div className="pt-3">
        <h1 className="text-xl font-bold text-white">
          Welcome, {getAdminInfo?.username || "Admin"}!
        </h1>
      </div>
    </header>
  );
}

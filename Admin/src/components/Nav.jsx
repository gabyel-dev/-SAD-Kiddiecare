import {
  FiHome,
  FiCalendar,
  FiUsers,
  FiBarChart2,
  FiCheckSquare,
  FiUser,
  FiPieChart,
} from "react-icons/fi";

export default function Nav({ setActiveTab, activeTab }) {
  const navItems = [
    {
      id: "home",
      label: "Home",
      icon: FiHome,
      activeIcon: FiHome,
    },
    {
      id: "attendance",
      label: "Attendance",
      icon: FiCheckSquare,
      activeIcon: FiCalendar,
    },
    {
      id: "profiles",
      label: "Profiles",
      icon: FiUser,
      activeIcon: FiUsers,
    },
    {
      id: "reports",
      label: "Reports",
      icon: FiPieChart,
      activeIcon: FiBarChart2,
    },
  ];

  return (
    <nav className="fixed bottom-0 z-4 left-0 right-0 bg-white border-t border-gray-200 shadow-lg safe-area-inset-bottom">
      <ul className="flex justify-around items-center h-16 px-2">
        {navItems.map((item) => {
          const IconComponent =
            activeTab === item.id ? item.activeIcon : item.icon;
          const isActive = activeTab === item.id;

          return (
            <li key={item.id} className="flex-1">
              <button
                onClick={() => setActiveTab(item.id)}
                className={`
                  w-full flex flex-col items-center justify-center py-2
                  transition-all duration-300 ease-in-out
                  ${
                    isActive
                      ? "text-blue-600"
                      : "text-gray-500 hover:text-gray-700"
                  }
                `}
              >
                <div
                  className={`
                  relative p-2 rounded-full transition-all duration-300
                  ${isActive ? "bg-blue-50 scale-110" : "hover:bg-gray-100"}
                `}
                >
                  <IconComponent
                    size={20}
                    className={isActive ? "text-blue-600" : "text-gray-500"}
                  />
                  {isActive && (
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-600 rounded-full"></div>
                  )}
                </div>
                <span
                  className={`
                  text-xs font-medium mt-1 transition-all duration-300
                  ${isActive ? "text-blue-600 scale-105" : "text-gray-600"}
                `}
                >
                  {item.label}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

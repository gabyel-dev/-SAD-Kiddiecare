import { useState } from "react";
import Nav from "../components/Nav";
import Header from "../components/Header";
import HomeDashboard from "./home";
import DailyAttendance from "./attendance";
import Login from "./login";
import { useAdmin } from "../hooks/useAdmin";

export default function Layout() {
  const [activeTab, setActiveTab] = useState("home");
  const { currentAdmin, isAuthenticated, login, logout } = useAdmin();

  const handleLogin = async (adminData) => {
    try {
      await login(adminData.username, adminData.password);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const handleLogout = () => {
    logout();
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }
  return (
    <main>
      <Header onLogout={handleLogout} />
      <div className="px-4 py-2 pt-36">
        {activeTab === "home" && <HomeDashboard />}{" "}
        {activeTab === "attendance" && <DailyAttendance />}
      </div>
      <Nav setActiveTab={setActiveTab} activeTab={activeTab} />
    </main>
  );
}

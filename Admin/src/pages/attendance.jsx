import {
  FiSearch,
  FiCheck,
  FiX,
  FiSave,
  FiClock,
  FiUsers,
  FiArrowLeft,
  FiUserCheck,
  FiUserX,
  FiCalendar,
} from "react-icons/fi";
import { useState, useEffect } from "react";
import { useChildren } from "../hooks/useChildren";
import { useAttendance } from "../hooks/useAttendance";
import { db } from "../db/db";

export default function DailyAttendance() {
  const { getAllChildren } = useChildren();
  const { getTodayAttendance, addAttendance, updateAttendance } =
    useAttendance();

  const [children, setChildren] = useState([]);
  const [filteredChildren, setFilteredChildren] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [attendance, setAttendance] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  // Load children and today's attendance
  useEffect(() => {
    loadChildrenAndAttendance();
  }, []);

  const loadChildrenAndAttendance = async () => {
    try {
      // Load children
      const childrenData = await getAllChildren();
      setChildren(childrenData);
      setFilteredChildren(childrenData);

      // Load today's attendance
      const todayAttendance = await getTodayAttendance();

      // Initialize attendance state
      const initialAttendance = {};
      const today = new Date().toISOString().split("T")[0];

      childrenData.forEach((child) => {
        const existingRecord = todayAttendance.find(
          (record) => record.childId === child.id && record.date === today
        );

        if (existingRecord) {
          // Use existing attendance record
          initialAttendance[child.id] = existingRecord;
        } else {
          // Create new attendance record
          initialAttendance[child.id] = {
            childId: child.id,
            childName: child.name,
            date: today,
            status: "present", // default status
            checkInTime: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            checkOutTime: null,
            createdAt: new Date(),
          };
        }
      });

      setAttendance(initialAttendance);
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  // Search functionality
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredChildren(children);
    } else {
      const filtered = children.filter(
        (child) =>
          child.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          child.guardian?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredChildren(filtered);
    }
  }, [searchTerm, children]);

  const handleStatusChange = (childId, status) => {
    setAttendance((prev) => ({
      ...prev,
      [childId]: {
        ...prev[childId],
        status,
        checkInTime:
          status === "present"
            ? new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })
            : prev[childId].checkInTime,
        checkOutTime: status === "absent" ? null : prev[childId].checkOutTime,
        updatedAt: new Date(),
      },
    }));
  };

  const handleSaveAttendance = async () => {
    setIsSaving(true);
    try {
      const today = new Date().toISOString().split("T")[0];

      // Save each attendance record
      const savePromises = Object.values(attendance).map(
        async (attendanceRecord) => {
          // Check if record already exists for today
          const existingRecords = await db.attendance
            .where(["childId", "date"])
            .equals([attendanceRecord.childId, today])
            .toArray();

          if (existingRecords.length > 0) {
            // Update existing record
            const existingId = existingRecords[0].id;
            return await updateAttendance(existingId, attendanceRecord);
          } else {
            // Create new record
            return await addAttendance(attendanceRecord);
          }
        }
      );

      await Promise.all(savePromises);
      alert("Attendance saved successfully!");
    } catch (error) {
      console.error("Error saving attendance:", error);
      alert("Failed to save attendance. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="h-fit bg-gray-50 rounded-2xl pt-5 px-4 pb-6 relative z-3 mb-15">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-sans uppercase">
            Attendance
          </h1>
          <p className="text-xs font-semibold text-indigo-800 opacity-50">
            View and Manage Attendance
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="rounded-xl shadow-xs border border-gray-100 mb-3">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search children..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>
      </div>

      {/* Attendance List */}
      <div className="p-3 b bg-indigo-500 border border-indigo-600  rounded-t-xl">
        <h2 className="text-sm font-bold text-gray-100 flex items-center">
          <FiUsers className="w-4 h-4 mr-2 text-gray-100" />
          Children List
          <span className="ml-2 text-xs bg-gray-100 rounded-full text-gray-600 px-1.5 py-0.5 ">
            {filteredChildren.length}
          </span>
        </h2>
      </div>

      <div className="__attendance_list__ max-h-60 overflow-auto bg-white rounded-b-xl shadow-xs border border-gray-200 mb-4">
        <div className="divide-y divide-gray-100">
          {filteredChildren.map((child) => (
            <div key={child.id} className="p-3">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 text-sm truncate">
                    {child.name}
                  </h3>

                  {attendance[child.id]?.checkInTime &&
                    attendance[child.id]?.status === "present" && (
                      <div className="flex items-center text-[11px] text-green-600 mt-1">
                        <FiClock className="w-3 h-3 mr-1" />
                        Checked in at {attendance[child.id].checkInTime}
                      </div>
                    )}
                </div>

                <div className="flex items-center space-x-1 ml-3">
                  {/* Present Button */}
                  <button
                    onClick={() => handleStatusChange(child.id, "present")}
                    className={`p-1.5 rounded-lg transition-all ${
                      attendance[child.id]?.status === "present"
                        ? "bg-green-100 text-green-700 shadow-xs"
                        : "text-gray-400 hover:bg-gray-100"
                    }`}
                    title="Mark Present"
                  >
                    <FiCheck className="w-4 h-4" />
                  </button>

                  {/* Absent Button */}
                  <button
                    onClick={() => handleStatusChange(child.id, "absent")}
                    className={`p-1.5 rounded-lg transition-all ${
                      attendance[child.id]?.status === "absent"
                        ? "bg-red-100 text-red-700 shadow-xs"
                        : "text-gray-400 hover:bg-gray-100"
                    }`}
                    title="Mark Absent"
                  >
                    <FiX className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Status Badge */}
              <div className="flex justify-between items-center mt-2">
                <div
                  className={`inline-flex items-center px-2 py-1 rounded-full text-[10px] font-medium ${
                    attendance[child.id]?.status === "present"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {attendance[child.id]?.status === "present" ? (
                    <>
                      <FiUserCheck className="w-2.5 h-2.5 mr-1" />
                      Present
                    </>
                  ) : (
                    <>
                      <FiUserX className="w-2.5 h-2.5 mr-1" />
                      Absent
                    </>
                  )}
                </div>

                {attendance[child.id]?.updatedAt && (
                  <span className="text-[10px] text-gray-400">Updated</span>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredChildren.length === 0 && (
          <div className="text-center py-8">
            <FiUsers className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">No children found</p>
            <p className="text-xs text-gray-400 mt-1">
              {searchTerm
                ? "Try different search terms"
                : "No children registered"}
            </p>
          </div>
        )}
      </div>

      {/* Save Button - Sticky */}
      <div className="sticky bottom-2 mt-4">
        <button
          onClick={handleSaveAttendance}
          disabled={isSaving || children.length === 0}
          className="w-full bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-3.5 px-6 rounded-full font-semibold flex items-center justify-center transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
        >
          {isSaving ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              <span className="text-sm">Saving...</span>
            </>
          ) : (
            <>
              <FiSave className="w-4 h-4 mr-2" />
              <span className="text-xs font-medium">Save Attendance</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

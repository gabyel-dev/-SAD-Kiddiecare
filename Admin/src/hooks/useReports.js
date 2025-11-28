import { db } from "../db/db";

export const useReports = () => {
  /**
   * Generate a report between startDate and endDate
   * @param {string} startDate - format "YYYY-MM-DD"
   * @param {string} endDate - format "YYYY-MM-DD"
   * @returns {Promise<Array>} - Array of report objects {name, date, status}
   */
  const generateReport = async (startDate, endDate) => {
    if (!startDate || !endDate) return [];

    // Get all attendance records
    const allAttendance = await db.attendance.toArray();
    const allChildren = await db.children.toArray();

    // Filter by date range
    const filtered = allAttendance.filter((record) => {
      const recordDate = new Date(record.date);
      return (
        recordDate >= new Date(startDate) && recordDate <= new Date(endDate)
      );
    });

    // Map childId to child name
    const report = filtered.map((r) => {
      const child = allChildren.find((c) => c.id === r.childId);
      return {
        name: child ? child.name : "Unknown",
        date: r.date,
        status: r.status,
      };
    });

    return report; // ready to display or export
  };

  return { generateReport };
};

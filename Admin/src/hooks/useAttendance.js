// hooks/useAttendance.js
import { useState, useEffect } from "react";
import { db } from "../db/db";

export function useAttendance() {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const getAllAttendance = async () => {
    try {
      return await db.attendance.toArray();
    } catch (err) {
      setError(err);
      throw err;
    }
  };

  const getTodayAttendance = async () => {
    try {
      const today = new Date().toISOString().split("T")[0];
      return await db.attendance.where("date").equals(today).toArray();
    } catch (err) {
      setError(err);
      throw err;
    }
  };

  const addAttendance = async (attendanceRecord) => {
    setIsLoading(true);
    setError(null);
    try {
      const id = await db.attendance.add(attendanceRecord);
      await refreshAttendance();
      return id;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateAttendance = async (id, updatedRecord) => {
    setIsLoading(true);
    try {
      await db.attendance.update(id, updatedRecord);
      await refreshAttendance();
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const removeAttendance = async (id) => {
    setIsLoading(true);
    try {
      await db.attendance.delete(id);
      await refreshAttendance();
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const refreshAttendance = async () => {
    try {
      const records = await getAllAttendance();
      setAttendanceRecords(records);
      setError(null);
    } catch (err) {
      setError(err);
    }
  };

  useEffect(() => {
    refreshAttendance();
  }, []);

  return {
    getAllAttendance,
    getTodayAttendance,
    addAttendance,
    updateAttendance,
    removeAttendance,
    attendanceRecords,
    isLoading,
    error,
  };
}

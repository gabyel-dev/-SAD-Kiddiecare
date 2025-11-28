import Dexie from "dexie";

export const db = new Dexie("AdminDatabase");

db.version(2).stores({
  adminData: "++id, username, role, password",
  children: "++id, name, age, guardian, contact, createdAt, isActive",
  attendance:
    "++id, childId, childName, date, status, checkInTime, checkOutTime, createdAt, updatedAt, [childId+date]",
  reports: "++id, date, type, data, startDate, endDate",
});

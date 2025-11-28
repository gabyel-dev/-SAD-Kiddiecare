import {
  FiUser,
  FiCalendar,
  FiUsers,
  FiPhone,
  FiSave,
  FiArrowLeft,
} from "react-icons/fi";
import { useState } from "react";
import { useChildren } from "../hooks/useChildren"; // Adjust path as needed

export default function AddChild({ onBack, onSuccess, setOpen, open }) {
  const { add } = useChildren();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    guardian: "",
    contact: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Prepare child data for IndexedDB
      const childData = {
        name: formData.name.trim(),
        age: parseInt(formData.age),
        guardian: formData.guardian.trim(),
        contact: formData.contact.trim(),
        createdAt: new Date(),
        isActive: true,
        lastCheckIn: null,
      };

      // Add to IndexedDB
      await add(childData);

      // Reset form
      setFormData({
        name: "",
        age: "",
        guardian: "",
        contact: "",
      });

      // Show success and callback
      if (onSuccess) {
        onSuccess(childData);
      }
    } catch (error) {
      console.error("Error adding child:", error);
      alert("Failed to add child. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="h-screen w-full bg-gray-300  px-4  absolute">
      {/* Header */}
      <div className="flex items-center mb-6 absolute">
        <button
          onClick={() => setOpen(false)}
          className="p-2 mr-3 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
        >
          <FiArrowLeft className="w-5 h-5" />
        </button>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
      >
        {/* Name Field */}
        <div className="mb-6">
          <label className="flex items-center text-sm font-medium text-gray-700 mb-3">
            <FiUser className="w-4 h-4 mr-2 text-gray-500" />
            Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter child's full name"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
            required
            disabled={isLoading}
          />
        </div>

        {/* Age Field */}
        <div className="mb-6">
          <label className="flex items-center text-sm font-medium text-gray-700 mb-3">
            <FiCalendar className="w-4 h-4 mr-2 text-gray-500" />
            Age
          </label>
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
            placeholder="Enter age in years"
            min="0"
            max="12"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
            required
            disabled={isLoading}
          />
        </div>

        {/* Guardian Field */}
        <div className="mb-6">
          <label className="flex items-center text-sm font-medium text-gray-700 mb-3">
            <FiUsers className="w-4 h-4 mr-2 text-gray-500" />
            Guardian
          </label>
          <input
            type="text"
            name="guardian"
            value={formData.guardian}
            onChange={handleChange}
            placeholder="Enter guardian's name"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
            required
            disabled={isLoading}
          />
        </div>

        {/* Contact Field */}
        <div className="mb-8">
          <label className="flex items-center text-sm font-medium text-gray-700 mb-3">
            <FiPhone className="w-4 h-4 mr-2 text-gray-500" />
            Contact
          </label>
          <input
            type="tel"
            name="contact"
            value={formData.contact}
            onChange={handleChange}
            placeholder="Enter phone number"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
            required
            disabled={isLoading}
          />
        </div>

        {/* Save Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 px-6 rounded-xl font-medium flex items-center justify-center transition-colors shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Saving...
            </>
          ) : (
            <>
              <FiSave className="w-5 h-5 mr-2" />
              Save Child
            </>
          )}
        </button>
      </form>

      {/* Additional Info */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-2xl p-4">
        <div className="flex items-start">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
            <FiUser className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-blue-900">
              Quick Registration
            </p>
            <p className="text-xs text-blue-700 mt-1">
              Child will be added to the system immediately and available for
              attendance tracking.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

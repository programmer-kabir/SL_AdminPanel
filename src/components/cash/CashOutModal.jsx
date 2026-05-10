import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  FaCalendarAlt,
  FaUser,
  FaMoneyBillWave,
  FaHashtag,
} from "react-icons/fa";
import { MdCategory, MdNotes } from "react-icons/md";
import { toast } from "react-toastify";

const CashOutModal = ({ isOpen, onClose }) => {
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    date: "",
    source: "",
    amount: "",
    category: "expense",
    purpose: "",
  });

  // auto date
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      date: new Date().toISOString().split("T")[0],
    }));
  }, []);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.amount || !formData.purpose) {
      toast.error("Amount লাগবে!");
      return;
    }

    try {
      setLoading(true);
      const API = import.meta.env.VITE_LOCALHOST_KEY;

      const res = await axios.post(
        `${import.meta.env.VITE_LOCALHOST_KEY}/cash/cashOut.php`,
        {
          ...formData,
          amount: Number(formData.amount),
        },
      );

      if (!res.data?.success) {
        toast.error(res.data?.message || "Failed!");
        return;
      }

      toast.success("Cash Out Success ✅");

      setFormData({
        date: new Date().toISOString().split("T")[0],
        amount: "",
        category: "expense",
        remarks: "",
      });

      onClose();
    } catch (err) {
      toast.error("Error submitting!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-3">
      <div
        className="w-full max-w-xl bg-[#0F172A] rounded-2xl border border-white/10 shadow-2xl 
                      max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-white/10">
          <h2 className="text-white text-lg font-semibold">ক্যাশ আউট</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            ✕
          </button>
        </div>

        <div className="overflow-y-auto p-6">
          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <FormGroup
              label="তারিখ"
              icon={<FaCalendarAlt className="text-red-400" />}
            >
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="input-dark date-fix"
              />
            </FormGroup>

            <FormGroup
              label="পরিমাণ (Amount)"
              icon={<FaMoneyBillWave className="text-red-400" />}
            >
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                placeholder="উদাহরণ: 1500"
                className="input-dark"
              />
            </FormGroup>

            <FormGroup
              label="ক্যাটাগরি"
              icon={<MdCategory className="text-orange-400" />}
            >
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="input-dark"
              >
                <option className="bg-[#0F172A]" value="salary">
                  বেতন
                </option>
                <option className="bg-[#0F172A]" value="purchase">
                  কেনাকাটা
                </option>
                <option className="bg-[#0F172A]" value="rent">
                  ভাড়া
                </option>

                <option className="bg-[#0F172A]" value="bill">
                  বিল (বিদ্যুৎ/ইন্টারনেট)
                </option>

                <option className="bg-[#0F172A]" value="office-expense">
                  অফিস খরচ
                </option>

                <option className="bg-[#0F172A]" value="others">
                  অন্যান্য
                </option>
              </select>
            </FormGroup>

            <FormGroup
              label="খরচের বিবরণ (Purpose)"
              icon={<MdNotes className="text-pink-400" />}
            >
              <textarea
                rows="3"
                name="purpose"
                value={formData.purpose}
                onChange={handleChange}
                placeholder="যেমন: অফিস খরচ, বাজার..."
                className="input-dark resize-none"
              />
            </FormGroup>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl"
            >
              {loading ? "Saving..." : "⬇ খরচ সেভ করুন"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CashOutModal;

/* 🔹 FormGroup */

const FormGroup = ({ label, icon, children }) => {
  return (
    <div>
      <label className="flex items-center gap-2 text-sm text-gray-300 mb-2">
        {icon}
        {label}
      </label>
      {children}
    </div>
  );
};

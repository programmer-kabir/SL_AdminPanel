import React, { useMemo, useState } from "react";
import { toast } from "react-toastify";
import useCompanyExpenses from "../../../utils/Hooks/Expenses/useCompanyExpenses";
import { FaTrashAlt, FaEdit } from "react-icons/fa";

const pad2 = (n) => String(n).padStart(2, "0");
const todayYMD = () => {
  const d = new Date();
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
};

const formatMoney = (n) =>
  new Intl.NumberFormat("en-BD", { style: "currency", currency: "BDT" }).format(
    Number(n || 0)
  );

export default function CompanyExpenses() {
  const {
    companyExpenses,
    isCompanyExpensesError,
    isCompanyExpensesLoading,
    refetch,
  } = useCompanyExpenses();
  const [form, setForm] = useState({
    expense_date: todayYMD(),
    title: "",
    details: "",
    amount: "",
  });
  const [touched, setTouched] = useState({});
  const [saving, setSaving] = useState(false);

  const [q, setQ] = useState("");

  const errors = useMemo(() => {
    const e = {};
    if (!form.expense_date) e.expense_date = "Expense date is required.";
    if (!form.title.trim()) e.title = "Title is required.";
    if (form.amount === "" || form.amount === null)
      e.amount = "Amount is required.";
    else if (Number.isNaN(Number(form.amount)))
      e.amount = "Amount must be a number.";
    else if (Number(form.amount) <= 0)
      e.amount = "Amount must be greater than 0.";
    return e;
  }, [form]);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return companyExpenses;
    return companyExpenses.filter((x) => {
      return (
        String(x.id).includes(s) ||
        (x.title || "").toLowerCase().includes(s) ||
        (x.details || "").toLowerCase().includes(s) ||
        (x.expense_date || "").toLowerCase().includes(s)
      );
    });
  }, [companyExpenses, q]);

  const total = useMemo(
    () => filtered.reduce((sum, x) => sum + Number(x.amount || 0), 0),
    [filtered]
  );

  const handleChange = (key) => (e) =>
    setForm((p) => ({ ...p, [key]: e.target.value }));

  const handleBlur = (key) => () => setTouched((p) => ({ ...p, [key]: true }));

  const resetForm = () => {
    setForm({ expense_date: todayYMD(), title: "", details: "", amount: "" });
    setTouched({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({
      expense_date: true,
      title: true,
      details: true,
      amount: true,
    });
    if (Object.keys(errors).length) return;

    try {
      setSaving(true);

      // এখানে আপনার API POST দিবেন
      const payload = {
        expense_date: form.expense_date,
        title: form.title.trim(),
        details: form.details.trim(),
        amount: Number(form.amount),
      };
      const res = await fetch(
        `${
          import.meta.env.VITE_LOCALHOST_KEY
        }/company_expenses/company_expenses_create.php`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();
      if (data.success === true) {
        toast.success("Item added");
        resetForm();
        await refetch();
      } else {
        toast.error(data.message || "Something went wrong");
        resetForm();
      }
      resetForm();
    } finally {
      setSaving(false);
    }
  };
  const truncate = (text = "", len = 15) =>
    text.length > len ? text.slice(0, len) + "..." : text;

  const [openModal, setOpenModal] = useState(false);
  const [modalText, setModalText] = useState("");
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    id: null,
    expense_date: "",
    title: "",
    details: "",
    amount: "",
  });

  const openEditModal = (row) => {
    setEditForm({
      id: row.id,
      expense_date: row.expense_date || todayYMD(),
      title: row.title || "",
      details: row.details || "",
      amount: row.amount ?? "",
    });
    setIsEditOpen(true);
  };

  const handleDelete = async (id) => {
    // if (!window.confirm("Are you sure you want to delete this expense?"))
    //   return;

    try {
      const res = await fetch(
        `${
          import.meta.env.VITE_LOCALHOST_KEY
        }/company_expenses/company_expenses_delete.php`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        }
      );

      const data = await res.json();

      if (data.success) {
        toast.success("Expense deleted");
        await refetch(); // ✅ list refresh
      } else {
        toast.error(data.message || "Delete failed");
      }
    } catch (err) {
      toast.error("Server error");
    }
  };
  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!editForm.id) return;

    const payload = {
      id: editForm.id,
      expense_date: editForm.expense_date,
      title: editForm.title.trim(),
      details: editForm.details.trim(), // optional
      amount: Number(editForm.amount),
    };

    try {
      const res = await fetch(
        `${
          import.meta.env.VITE_LOCALHOST_KEY
        }/company_expenses/company_expenses_update.php`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();

      if (data.success) {
        toast.success("Updated successfully");
        setIsEditOpen(false);
        await refetch();
      } else {
        toast.error(data.message || "Update failed");
      }
    } catch (err) {
      toast.error("Server error");
    }
  };

  return (
    <div className="w-full">
      {/* Page Title */}
      <div className="flex flex-col gap-1 mb-4">
        <h1 className="text-xl md:text-2xl font-semibold text-white">
          Company Expenses
        </h1>
        <p className="text-sm text-white/60">
          Add and track company running costs (Rent, Bills, Salary, Transport,
          etc.)
        </p>
      </div>

      {/* Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Left: Form */}
        <div className="xl:col-span-1">
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md shadow-xl">
            <div className="px-5 py-4 border-b border-white/10">
              <h2 className="text-lg font-semibold text-white">Add Expense</h2>
              <p className="text-sm text-white/60">Fill the form and save.</p>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              {/* Date */}
              <div>
                <label className="block text-sm text-white/70 mb-1">
                  Expense Date
                </label>
                <input
                  type="date"
                  value={form.expense_date}
                  onChange={handleChange("expense_date")}
                  onBlur={handleBlur("expense_date")}
                  className="w-full rounded-xl date-fix bg-black/30 border border-white/10 px-3 py-2 text-white outline-none focus:ring-2 focus:ring-white/20"
                />
                {touched.expense_date && errors.expense_date && (
                  <p className="mt-1 text-xs text-red-400">
                    {errors.expense_date}
                  </p>
                )}
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm text-white/70 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={handleChange("title")}
                  onBlur={handleBlur("title")}
                  placeholder="e.g. Office Rent, Electricity Bill"
                  className="w-full rounded-xl bg-black/30 border border-white/10 px-3 py-2 text-white placeholder:text-white/30 outline-none focus:ring-2 focus:ring-white/20"
                />
                {touched.title && errors.title && (
                  <p className="mt-1 text-xs text-red-400">{errors.title}</p>
                )}
              </div>

              {/* Amount */}
              <div>
                <label className="block text-sm text-white/70 mb-1">
                  Amount
                </label>
                <input
                  type="number"
                  inputMode="decimal"
                  value={form.amount}
                  onChange={handleChange("amount")}
                  onBlur={handleBlur("amount")}
                  placeholder="e.g. 2500"
                  className="w-full rounded-xl bg-black/30 border border-white/10 px-3 py-2 text-white placeholder:text-white/30 outline-none focus:ring-2 focus:ring-white/20"
                />
                {touched.amount && errors.amount && (
                  <p className="mt-1 text-xs text-red-400">{errors.amount}</p>
                )}
              </div>

              {/* Details */}
              <div>
                <label className="block text-sm text-white/70 mb-1">
                  Details
                </label>
                <textarea
                  rows={4}
                  value={form.details}
                  onChange={handleChange("details")}
                  onBlur={handleBlur("details")}
                  placeholder="Optional details (voucher, note, etc.)"
                  className="w-full rounded-xl bg-black/30 border border-white/10 px-3 py-2 text-white placeholder:text-white/30 outline-none focus:ring-2 focus:ring-white/20 resize-none"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-1">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 rounded-xl bg-white text-black font-medium px-4 py-2 hover:bg-white/90 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {saving ? "Saving..." : "Save Expense"}
                </button>

                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-xl border border-white/15 text-white px-4 py-2 hover:bg-white/10"
                >
                  Reset
                </button>
              </div>

            
            </form>
          </div>
        </div>

        {/* Right: List */}
        <div className="xl:col-span-2">
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md shadow-xl">
            {/* Header */}
            <div className="px-5 py-4 border-b border-white/10 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-white">
                  Recent Expenses
                </h2>
                <p className="text-sm text-white/60">
                  Showing:{" "}
                  <span className="text-white/80">{filtered.length}</span> items
                  • Total:{" "}
                  <span className="text-white font-medium">
                    {formatMoney(total)}
                  </span>
                </p>
              </div>

              {/* Search */}
              <div className="w-full md:w-72">
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search by title / date / details..."
                  className="w-full rounded-xl bg-black/30 border border-white/10 px-3 py-2 text-white placeholder:text-white/30 outline-none focus:ring-2 focus:ring-white/20"
                />
              </div>
            </div>

            {/* Table */}
            <div className="p-5">
              <div className="overflow-x-auto rounded-xl border border-white/10">
                <table className="min-w-full text-sm">
                  <thead className="bg-white/5 text-white/70">
                    <tr>
                      <th className="text-left px-4 py-3">#</th>
                      <th className="text-left px-4 py-3">Date</th>
                      <th className="text-left px-4 py-3">Title</th>
                      <th className="text-left px-4 py-3">Details</th>
                      <th className="text-right px-4 py-3">Amount</th>
                      <th className="text-right px-4 py-3">Action</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-white/10">
                    {filtered.length === 0 ? (
                      <tr>
                        <td
                          colSpan={6}
                          className="px-4 py-10 text-center text-white/60"
                        >
                          No expenses found.
                        </td>
                      </tr>
                    ) : (
                      filtered.map((row, idx) => (
                        <tr
                          key={row.id}
                          className="text-white/85 hover:bg-white/5"
                        >
                          <td className="px-4 py-3">{idx + 1}</td>
                          <td className="px-4 py-3">{row.expense_date}</td>
                          <td className="px-4 py-3 font-medium text-white">
                            {row.title.length > 15 ? (
                              <button
                                onClick={() => {
                                  setModalText(row.title);
                                  setOpenModal(true);
                                }}
                                className="text-left hover:underline hover:text-white"
                              >
                                {truncate(row.title, 15)}
                              </button>
                            ) : (
                              row.title
                            )}
                          </td>

                          <td className="px-4 py-3 text-white/70 max-w-[420px]">
                            {row.details && row.details.length > 15 ? (
                              <button
                                onClick={() => {
                                  setModalText(row.details);
                                  setOpenModal(true);
                                }}
                                className="text-left hover:underline hover:text-white/90"
                              >
                                {truncate(row.details, 15)}
                              </button>
                            ) : (
                              row.details || "-"
                            )}
                          </td>

                          <td className="px-4 py-3 text-right font-semibold">
                            {formatMoney(row.amount)}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <div className="inline-flex items-center gap-2">
                              {/* Edit */}
                              <button
                                onClick={() => openEditModal(row)}
                                className="rounded-lg border border-white/15 p-2 text-white/80 hover:bg-white/10 hover:text-white"
                                title="Update"
                                type="button"
                              >
                                <FaEdit className="text-sm" />
                              </button>

                              {/* Delete */}
                              <button
                                onClick={() => handleDelete(row.id)}
                                className="rounded-lg border border-red-400/30 p-2 text-red-300 hover:bg-red-500/20 hover:text-red-200"
                                title="Delete"
                                type="button"
                              >
                                <FaTrashAlt className="text-sm" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              
            </div>
          </div>
        </div>
      </div>
      {openModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-[#0f172a] rounded-xl w-full max-w-md p-5 border border-white/10 shadow-xl">
            <h3 className="text-lg font-semibold text-white mb-2">Full Text</h3>

            <p className="text-white/80 break-words">{modalText}</p>

            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setOpenModal(false)}
                className="px-4 py-2 rounded-lg bg-white text-black hover:bg-white/90"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      {isEditOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-3">
          <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#0b1220] shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
              <div>
                <h3 className="text-lg font-semibold text-white">
                  Update Expense
                </h3>
                <p className="text-sm text-white/60">Edit and save changes</p>
              </div>
              <button
                onClick={() => setIsEditOpen(false)}
                className="rounded-lg border border-white/15 px-3 py-1.5 text-white/80 hover:bg-white/10"
                type="button"
              >
                Close
              </button>
            </div>

            {/* Body */}
            <form onSubmit={handleUpdate} className="p-5 space-y-4">
              <div>
                <label className="block text-sm text-white/70 mb-1">
                  Expense Date
                </label>
                <input
                  type="date"
                  value={editForm.expense_date}
                  onChange={(e) =>
                    setEditForm((p) => ({ ...p, expense_date: e.target.value }))
                  }
                  className="w-full rounded-xl bg-black/30 border border-white/10 px-3 py-2 text-white outline-none focus:ring-2 focus:ring-white/20"
                />
              </div>

              <div>
                <label className="block text-sm text-white/70 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(e) =>
                    setEditForm((p) => ({ ...p, title: e.target.value }))
                  }
                  className="w-full rounded-xl bg-black/30 border border-white/10 px-3 py-2 text-white outline-none focus:ring-2 focus:ring-white/20"
                />
              </div>

              <div>
                <label className="block text-sm text-white/70 mb-1">
                  Amount
                </label>
                <input
                  type="number"
                  value={editForm.amount}
                  onChange={(e) =>
                    setEditForm((p) => ({ ...p, amount: e.target.value }))
                  }
                  className="w-full rounded-xl bg-black/30 border border-white/10 px-3 py-2 text-white outline-none focus:ring-2 focus:ring-white/20"
                />
              </div>

              <div>
                <label className="block text-sm text-white/70 mb-1">
                  Details (optional)
                </label>
                <textarea
                  rows={4}
                  value={editForm.details}
                  onChange={(e) =>
                    setEditForm((p) => ({ ...p, details: e.target.value }))
                  }
                  className="w-full rounded-xl bg-black/30 border border-white/10 px-3 py-2 text-white outline-none focus:ring-2 focus:ring-white/20 resize-none"
                />
              </div>

              {/* Footer */}
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-white text-black font-medium px-4 py-2 hover:bg-white/90"
                >
                  Update
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditOpen(false)}
                  className="rounded-xl border border-white/15 text-white px-4 py-2 hover:bg-white/10"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

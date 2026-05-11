import React from "react";
import useCashReports from "../../../utils/Hooks/cash/useCashReports";
import Loader from "../../../components/Loader/Loader";

const CashIn = () => {
  const { CashReports, isCashReportsError, isCashReportsLoading } =
    useCashReports();
const [selectedDate, setSelectedDate] = React.useState("");
const [selectedMonth, setSelectedMonth] = React.useState("");
const [selectedYear, setSelectedYear] = React.useState("");
const [startDate, setStartDate] = React.useState("");
const [endDate, setEndDate] = React.useState("");
  // only cash in
  const AllCashIn = Array.isArray(CashReports)
    ? CashReports.filter((cash) => cash.type === "in")
    : [];


  // category bangla
  const categoryName = (category) => {
    switch (category) {
      case "invest":
        return "বিনিয়োগ";

      case "installment":
        return "কিস্তি";

      case "downpayment":
        return "ডাউন পেমেন্ট";

      case "loan":
        return "লোন";

      default:
        return "অন্যান্য";
    }
  };

  // category style
  const categoryStyle = (category) => {
    switch (category) {
      case "invest":
        return "bg-blue-500/20 text-blue-400 border border-blue-500/20";

      case "installment":
        return "bg-green-500/20 text-green-400 border border-green-500/20";

      case "downpayment":
        return "bg-yellow-500/20 text-yellow-400 border border-yellow-500/20";

      case "loan":
        return "bg-red-500/20 text-red-400 border border-red-500/20";

      default:
        return "bg-gray-500/20 text-gray-300 border border-gray-500/20";
    }
  };
  const currentYear = new Date().getFullYear();

const years = [];

for (let year = 2025; year <= currentYear; year++) {
  years.push(year);
}
const FilteredCashIn = AllCashIn.filter((cash) => {

  const cashDate = new Date(cash.date);

  const cashYear = cashDate.getFullYear().toString();

  const cashMonth = `${cashDate.getFullYear()}-${String(
    cashDate.getMonth() + 1
  ).padStart(2, "0")}`;

  // single day
  if (selectedDate && cash.date !== selectedDate) {
    return false;
  }

  // month
  if (selectedMonth && cashMonth !== selectedMonth) {
    return false;
  }

  // year
  if (selectedYear && cashYear !== selectedYear) {
    return false;
  }

  // range
  if (startDate && endDate) {

    const current = new Date(cash.date).getTime();

    const start = new Date(startDate).getTime();

    const end = new Date(endDate).getTime();

    if (current < start || current > end) {
      return false;
    }
  }

  return true;
});
  // total cash in
  const totalCashIn = FilteredCashIn.reduce(
    (total, item) => total + Number(item.amount),
    0,
  );

  // category totals
  const investTotal = FilteredCashIn.filter(
    (item) => item.category === "invest",
  ).reduce((sum, item) => sum + Number(item.amount), 0);

  const installmentTotal = FilteredCashIn.filter(
    (item) => item.category === "installment",
  ).reduce((sum, item) => sum + Number(item.amount), 0);

  const downpaymentTotal = FilteredCashIn.filter(
    (item) => item.category === "downpayment",
  ).reduce((sum, item) => sum + Number(item.amount), 0);

  const loanTotal = FilteredCashIn.filter((item) => item.category === "loan").reduce(
    (sum, item) => sum + Number(item.amount),
    0,
  );

  const otherTotal = FilteredCashIn.filter(
    (item) =>
      !["invest", "installment", "downpayment", "loan"].includes(item.category),
  ).reduce((sum, item) => sum + Number(item.amount), 0);

  if (isCashReportsLoading || isCashReportsError)
    return (
      <div className="h-screen flex items-center justify-center bg-[#0f172a]">
        <Loader />
      </div>
    );

  return (
    <div className=" min-h-screen text-white">
        {/* filters */}
<div className="bg-[#111827] border border-gray-800 rounded-3xl p-4 md:p-5 mb-5">

  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">

    {/* single date */}
    <div>

      <label className="text-xs text-gray-400 mb-2 block">
        নির্দিষ্ট দিন
      </label>

      <input
        type="date"
        value={selectedDate}
        onChange={(e) => setSelectedDate(e.target.value)}
        className="w-full bg-[#0f172a] border border-gray-700 rounded-xl px-4 py-3 text-sm outline-none focus:border-green-500 date-fix"
      />

    </div>

    {/* month */}
    <div>

      <label className="text-xs text-gray-400 mb-2 block">
        মাস নির্বাচন
      </label>

      <input
        type="month"
        value={selectedMonth}
        onChange={(e) => setSelectedMonth(e.target.value)}
        className="w-full bg-[#0f172a] border border-gray-700 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 date-fix"
      />

    </div>

    {/* year */}
    <div>

      <label className="text-xs text-gray-400 mb-2 block">
        বছর নির্বাচন
      </label>

     <select
  value={selectedYear}
  onChange={(e) => setSelectedYear(e.target.value)}
  className="w-full bg-[#0f172a] border border-gray-700 rounded-xl px-4 py-3 text-sm outline-none focus:border-yellow-500 text-white"
>

  <option value="">
    সকল বছর
  </option>

  {years.map((year) => (

    <option
      key={year}
      value={year}
    >
      {year}
    </option>

  ))}

</select>

    </div>

    {/* start */}
    <div>

      <label className="text-xs text-gray-400 mb-2 block">
        শুরুর তারিখ
      </label>

      <input
        type="date"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
        className="w-full bg-[#0f172a] border border-gray-700 rounded-xl px-4 py-3 text-sm outline-none focus:border-cyan-500 date-fix"
      />

    </div>

    {/* end */}
    <div>

      <label className="text-xs text-gray-400 mb-2 block">
        শেষ তারিখ
      </label>

      <input
        type="date"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
        className="w-full bg-[#0f172a] border border-gray-700 rounded-xl px-4 py-3 text-sm outline-none focus:border-red-500 date-fix"
      />

    </div>

  </div>

  {/* clear */}
  <div className="mt-4">

    <button
      onClick={() => {
        setSelectedDate("");
        setSelectedMonth("");
        setSelectedYear("");
        setStartDate("");
        setEndDate("");
      }}
      className="bg-red-500/20 text-red-400 border border-red-500/20 px-5 py-2 rounded-xl text-sm font-medium hover:bg-red-500/30 transition"
    >
      Clear Filters
    </button>

  </div>

</div>
      {/* top cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-7 gap-3 md:gap-4 mb-5">
        {/* total */}
        <div className="relative overflow-hidden rounded-2xl border border-green-500/20 bg-[#111827] p-4 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-green-400 font-medium">
                Total Cash In
              </p>

              <h2 className="text-lg md:text-2xl font-bold mt-1 md:mt-2 text-white break-words">
                ৳ {totalCashIn.toLocaleString()}
              </h2>
            </div>

            <div className=" bg-green-500/20 w-9 h-9 md:w-11 md:h-11 rounded-xl flex items-center justify-center text-base md:text-lg">
              💰
            </div>
          </div>
        </div>

        {/* transactions */}
        <div className="relative overflow-hidden rounded-2xl border border-gray-800 bg-[#111827] p-3 md:p-4 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-cyan-400 font-medium">Transactions</p>

              <h2 className="text-lg md:text-2xl font-bold mt-1 md:mt-2 text-white break-words">
                {FilteredCashIn.length}
              </h2>
            </div>

            <div className=" bg-cyan-500/20 w-9 h-9 md:w-11 md:h-11 rounded-xl flex items-center justify-center text-base md:text-lg">
              📊
            </div>
          </div>
        </div>

        {/* invest */}
        <div className=" border-blue-500/20 relative overflow-hidden rounded-2xl border  bg-[#111827] p-3 md:p-4 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-blue-400 font-medium">বিনিয়োগ</p>

              <h2 className="text-lg md:text-2xl font-bold mt-1 md:mt-2 text-white break-words">
                ৳ {investTotal.toLocaleString()}
              </h2>
            </div>

            <div className=" bg-blue-500/20 w-9 h-9 md:w-11 md:h-11 rounded-xl flex items-center justify-center text-base md:text-lg">
              💵
            </div>
          </div>
        </div>

        {/* installment */}
        <div className=" relative overflow-hidden rounded-2xl border border-green-500/20 bg-[#111827] p-3 md:p-4 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-green-400 font-medium">কিস্তি</p>

              <h2 className="text-lg md:text-2xl font-bold mt-1 md:mt-2 text-white break-words">
                ৳ {installmentTotal.toLocaleString()}
              </h2>
            </div>

            <div className=" bg-green-500/20 w-9 h-9 md:w-11 md:h-11 rounded-xl flex items-center justify-center text-base md:text-lg">
              📈
            </div>
          </div>
        </div>

        {/* downpayment */}
        <div className="relative overflow-hidden rounded-2xl border border-yellow-500/20 bg-[#111827] p-3 md:p-4 shadow-lg ">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-yellow-400 font-medium">
                ডাউন পেমেন্ট
              </p>

              <h2 className="text-lg md:text-2xl font-bold mt-1 md:mt-2 text-white break-words">
                ৳ {downpaymentTotal.toLocaleString()}
              </h2>
            </div>

            <div className=" bg-yellow-500/20 w-9 h-9 md:w-11 md:h-11 rounded-xl flex items-center justify-center text-base md:text-lg">
              🏦
            </div>
          </div>
        </div>

        {/* loan */}
        <div className="relative overflow-hidden rounded-2xl border border-red-500/20 bg-[#111827] p-3 md:p-4 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-red-400 font-medium">লোন</p>

              <h2 className="text-lg md:text-2xl font-bold mt-1 md:mt-2 text-white break-words">
                ৳ {loanTotal.toLocaleString()}
              </h2>
            </div>

            <div className=" bg-red-500/20 w-9 h-9 md:w-11 md:h-11 rounded-xl flex items-center justify-center text-base md:text-lg">
              💳
            </div>
          </div>
        </div>
        {/* others */}
<div className="relative overflow-hidden rounded-2xl border border-gray-600/30 bg-[#111827] p-3 md:p-4 shadow-lg">

  <div className="flex items-center justify-between">

    <div>
      <p className="text-xs text-gray-300 font-medium">
        অন্যান্য
      </p>

      <h2 className="text-lg md:text-2xl font-bold mt-1 md:mt-2 text-white break-words">
        ৳ {otherTotal.toLocaleString()}
      </h2>
    </div>

    <div className="bg-gray-500/20 w-9 h-9 md:w-11 md:h-11 rounded-xl flex items-center justify-center text-base md:text-lg">
      📦
    </div>

  </div>

</div>
      </div>

      {/* table section */}
      <div className="bg-[#111827] border border-gray-800 rounded-3xl overflow-hidden shadow-2xl">
        {/* header */}
        <div className="px-6 py-5 border-b border-gray-800">
          <h2 className="text-2xl font-bold text-white">Cash In Report</h2>

          <p className="text-gray-400 text-sm mt-1">
            সকল ক্যাশ ইন লেনদেনের তালিকা
          </p>
        </div>

        {/* table */}
        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-700">
          <table className="w-full">
            <thead className="bg-[#1f2937] text-gray-300 text-xs md:text-sm">
              <tr>
                <th className="px-5 py-4 text-left">#</th>

                <th className="px-5 py-4 text-left">Source</th>

                <th className="px-5 py-4 text-left">Category</th>

                <th className="px-5 py-4 text-left">Amount</th>

                <th className="px-5 py-4 text-left">Date</th>
              </tr>
            </thead>

            <tbody>
              {FilteredCashIn.map((cash, index) => (
                <tr
                  key={cash.id}
                  className="border-t border-gray-800 hover:bg-[#1e293b] transition duration-200"
                >
                  {/* serial */}
                  <td className="px-4 md:py-3 py-2 text-gray-300 font-medium">
                    {index + 1}
                  </td>

                  {/* source */}
                  <td className="px-4 md:py-3 py-2">
                    <p className="font-medium text-white text-xs md:text-sm whitespace-nowrap">
                      {" "}
                      {cash.source || "N/A"}
                    </p>
                  </td>

                  {/* category */}
                  <td className="px-4 md:py-3 py-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${categoryStyle(
                        cash.category,
                      )}`}
                    >
                      {categoryName(cash.category)}
                    </span>
                  </td>

                  {/* amount */}
                  <td className="px-4 md:py-3 py-2">
                    <span className="bg-green-500/20 text-green-400 border border-green-500/20 md:px-4 md:py-1 px-3 py-1 rounded-full text-xs md:text-sm font-bold whitespace-nowrap">
                      ৳ {Number(cash.amount).toLocaleString()}
                    </span>
                  </td>

                  {/* date */}
                  <td className="px-4 md:py-3 py-2 whitespace-nowrap">
                    {" "}
                    {cash.date}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CashIn;

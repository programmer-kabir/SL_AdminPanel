import React from "react";
import useCashReports from "../../../utils/Hooks/cash/useCashReports";
import Loader from "../../../components/Loader/Loader";

const CashOut = () => {

  const {
    CashReports,
    isCashReportsError,
    isCashReportsLoading,
  } = useCashReports();
  const [selectedDate, setSelectedDate] = React.useState("");
  const [selectedMonth, setSelectedMonth] = React.useState("");
  const [selectedYear, setSelectedYear] = React.useState("");
  const [startDate, setStartDate] = React.useState("");
  const [endDate, setEndDate] = React.useState("");
  // only cash out
  const AllCashOut = Array.isArray(CashReports)
    ? CashReports.filter((cash) => cash.type === "out")
    : [];
  const currentYear = new Date().getFullYear();

const years = [];

for (let year = 2025; year <= currentYear; year++) {
  years.push(year);
}
const FilteredCashOut = AllCashOut.filter((cash) => {

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
  // total
  const totalCashOut = FilteredCashOut.reduce(
    (sum, item) => sum + Number(item.amount),
    0
  );

  // category totals
  const salaryTotal = FilteredCashOut
    .filter((item) => item.category?.trim() === "salary")
    .reduce((sum, item) => sum + Number(item.amount), 0);

  const purchaseTotal = FilteredCashOut
    .filter((item) => item.category?.trim() === "purchase")
    .reduce((sum, item) => sum + Number(item.amount), 0);

  const rentTotal = FilteredCashOut
    .filter((item) => item.category?.trim() === "rent")
    .reduce((sum, item) => sum + Number(item.amount), 0);

  const billTotal = FilteredCashOut
    .filter((item) => item.category?.trim() === "bill")
    .reduce((sum, item) => sum + Number(item.amount), 0);

  const officeExpenseTotal = FilteredCashOut
    .filter((item) => item.category?.trim() === "office-expense")
    .reduce((sum, item) => sum + Number(item.amount), 0);

  const loanRepaymentTotal = FilteredCashOut
    .filter((item) => item.category?.trim() === "loan-repayment")
    .reduce((sum, item) => sum + Number(item.amount), 0);

  const otherTotal = FilteredCashOut
    .filter(
      (item) =>
        ![
          "salary",
          "purchase",
          "rent",
          "bill",
          "office-expense",
          "loan-repayment",
        ].includes(item.category)
    )
    .reduce((sum, item) => sum + Number(item.amount), 0);

  // category bangla
  const categoryName = (category) => {

    switch (category) {

      case "salary":
        return "বেতন";

      case "purchase":
        return "কেনাকাটা";

      case "rent":
        return "ভাড়া";

      case "bill":
        return "বিল";

      case "office-expense":
        return "অফিস খরচ";

      case "loan-repayment":
        return "লোন পরিশোধ";

      default:
        return "অন্যান্য";
    }
  };

  // category style
  const categoryStyle = (category) => {

    switch (category) {

      case "salary":
        return "bg-blue-500/20 text-blue-400 border border-blue-500/20";

      case "purchase":
        return "bg-green-500/20 text-green-400 border border-green-500/20";

      case "rent":
        return "bg-yellow-500/20 text-yellow-400 border border-yellow-500/20";

      case "bill":
        return "bg-red-500/20 text-red-400 border border-red-500/20";

      case "office-expense":
        return "bg-purple-500/20 text-purple-400 border border-purple-500/20";

      case "loan-repayment":
        return "bg-cyan-500/20 text-cyan-400 border border-cyan-500/20";

      default:
        return "bg-gray-500/20 text-gray-300 border border-gray-500/20";
    }
  };

  if (isCashReportsLoading || isCashReportsError)
    return (
      <div className="h-screen flex items-center justify-center bg-[#0f172a]">
        <Loader />
      </div>
    );

  return (

    <div className="min-h-screen text-white">
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
        <div className="relative overflow-hidden rounded-2xl border border-red-500/20 bg-[#111827] p-3 md:p-4 shadow-lg">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-xs text-red-400 font-medium">
                Total Cash Out
              </p>

              <h2 className="text-lg md:text-2xl font-bold mt-1 md:mt-2 text-white break-words">
                ৳ {totalCashOut.toLocaleString()}
              </h2>
            </div>

            <div className="bg-red-500/20 w-9 h-9 md:w-11 md:h-11 rounded-xl flex items-center justify-center text-base md:text-lg">
              💸
            </div>

          </div>
        </div>
 {/* transactions */}
        <div className="relative overflow-hidden rounded-2xl border border-gray-800 bg-[#111827] p-3 md:p-4 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-cyan-400 font-medium">Transactions</p>

              <h2 className="text-lg md:text-2xl font-bold mt-1 md:mt-2 text-white break-words">
                {FilteredCashOut.length}
              </h2>
            </div>

            <div className=" bg-cyan-500/20 w-9 h-9 md:w-11 md:h-11 rounded-xl flex items-center justify-center text-base md:text-lg">
              📊
            </div>
          </div>
        </div>
        {/* salary */}
        <div className="relative overflow-hidden rounded-2xl border border-blue-500/20 bg-[#111827] p-3 md:p-4 shadow-lg">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-xs text-blue-400 font-medium">
                বেতন
              </p>

              <h2 className="text-lg md:text-2xl font-bold mt-1 md:mt-2 text-white break-words">
                ৳ {salaryTotal.toLocaleString()}
              </h2>
            </div>

            <div className="bg-blue-500/20 w-9 h-9 md:w-11 md:h-11 rounded-xl flex items-center justify-center">
              👨‍💼
            </div>

          </div>
        </div>

        {/* purchase */}
        <div className="relative overflow-hidden rounded-2xl border border-green-500/20 bg-[#111827] p-3 md:p-4 shadow-lg">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-xs text-green-400 font-medium">
                কেনাকাটা
              </p>

              <h2 className="text-lg md:text-2xl font-bold mt-1 md:mt-2 text-white break-words">
                ৳ {purchaseTotal.toLocaleString()}
              </h2>
            </div>

            <div className="bg-green-500/20 w-9 h-9 md:w-11 md:h-11 rounded-xl flex items-center justify-center">
              🛒
            </div>

          </div>
        </div>

        {/* rent */}
        <div className="relative overflow-hidden rounded-2xl border border-yellow-500/20 bg-[#111827] p-3 md:p-4 shadow-lg">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-xs text-yellow-400 font-medium">
                ভাড়া
              </p>

              <h2 className="text-lg md:text-2xl font-bold mt-1 md:mt-2 text-white break-words">
                ৳ {rentTotal.toLocaleString()}
              </h2>
            </div>

            <div className="bg-yellow-500/20 w-9 h-9 md:w-11 md:h-11 rounded-xl flex items-center justify-center">
              🏠
            </div>

          </div>
        </div>

        {/* bill */}
        <div className="relative overflow-hidden rounded-2xl border border-red-500/20 bg-[#111827] p-3 md:p-4 shadow-lg">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-xs text-red-400 font-medium">
                বিল
              </p>

              <h2 className="text-lg md:text-2xl font-bold mt-1 md:mt-2 text-white break-words">
                ৳ {billTotal.toLocaleString()}
              </h2>
            </div>

            <div className="bg-red-500/20 w-9 h-9 md:w-11 md:h-11 rounded-xl flex items-center justify-center">
              ⚡
            </div>

          </div>
        </div>

        {/* office */}
        <div className="relative overflow-hidden rounded-2xl border border-purple-500/20 bg-[#111827] p-3 md:p-4 shadow-lg">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-xs text-purple-400 font-medium">
                অফিস খরচ
              </p>

              <h2 className="text-lg md:text-2xl font-bold mt-1 md:mt-2 text-white break-words">
                ৳ {officeExpenseTotal.toLocaleString()}
              </h2>
            </div>

            <div className="bg-purple-500/20 w-9 h-9 md:w-11 md:h-11 rounded-xl flex items-center justify-center">
              🏢
            </div>

          </div>
        </div>

        {/* loan repayment */}
        <div className="relative overflow-hidden rounded-2xl border border-cyan-500/20 bg-[#111827] p-3 md:p-4 shadow-lg">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-xs text-cyan-400 font-medium">
                লোন পরিশোধ
              </p>

              <h2 className="text-lg md:text-2xl font-bold mt-1 md:mt-2 text-white break-words">
                ৳ {loanRepaymentTotal.toLocaleString()}
              </h2>
            </div>

            <div className="bg-cyan-500/20 w-9 h-9 md:w-11 md:h-11 rounded-xl flex items-center justify-center">
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

            <div className="bg-gray-500/20 w-9 h-9 md:w-11 md:h-11 rounded-xl flex items-center justify-center">
              📦
            </div>

          </div>
        </div>

      </div>

      {/* table section */}
      <div className="bg-[#111827] border border-gray-800 rounded-3xl overflow-hidden shadow-2xl">

        {/* header */}
        <div className="px-6 py-5 border-b border-gray-800">

          <h2 className="text-2xl font-bold text-white">
            Cash Out Report
          </h2>

          <p className="text-gray-400 text-sm mt-1">
            সকল ক্যাশ আউট লেনদেনের তালিকা
          </p>

        </div>

        {/* table */}
        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-700">

          <table className="w-full">

            <thead className="bg-[#1f2937] text-gray-300 text-xs md:text-sm">

              <tr>

                <th className="px-5 py-4 text-left">
                  #
                </th>

                <th className="px-5 py-4 text-left">
                  Purpose
                </th>

                <th className="px-5 py-4 text-left">
                  Category
                </th>

                <th className="px-5 py-4 text-left">
                  Amount
                </th>

                <th className="px-5 py-4 text-left">
                  Date
                </th>

              </tr>

            </thead>

            <tbody>

              {FilteredCashOut.map((cash, index) => (

                <tr
                  key={cash.id}
                  className="border-t border-gray-800 hover:bg-[#1e293b] transition duration-200"
                >

                  <td className="px-4 md:py-3 py-2 text-gray-300 font-medium">
                    {index + 1}
                  </td>

                  <td className="px-4 md:py-3 py-2">

                    <p className="font-medium text-white text-xs md:text-sm whitespace-nowrap">
                      {cash.purpose || "N/A"}
                    </p>

                  </td>

                  <td className="px-4 md:py-3 py-2">

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${categoryStyle(
                        cash.category
                      )}`}
                    >
                      {categoryName(cash.category)}
                    </span>

                  </td>

                  <td className="px-4 md:py-3 py-2">

                    <span className="bg-red-500/20 text-red-400 border border-red-500/20 md:px-4 md:py-1 px-3 py-1 rounded-full text-xs md:text-sm font-bold whitespace-nowrap">
                      ৳ {Number(cash.amount).toLocaleString()}
                    </span>

                  </td>

                  <td className="px-4 md:py-3 py-2 whitespace-nowrap text-gray-400">
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

export default CashOut;
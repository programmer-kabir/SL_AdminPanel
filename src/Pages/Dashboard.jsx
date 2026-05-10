import React, { useEffect, useState } from "react";
import StatCard from "../components/Dashboard/StatCard";
import ChartCard from "../components/Dashboard/ChartCard";
import { MONTHS } from "../../public/month";
import useDashboardData from "../utils/Hooks/dashboard/useDashboardData";
import { applyPreset, getChartData, sumBy } from "../utils/dashboardUtils";
import DashboardFilter from "../components/Dashboard/DashboardFilter";
import DashboardChart from "../components/Dashboard/DashboardChart";
import { calculateGrowth, generateAlerts } from "../utils/analyticsUtils";
import PendingInvestWithdraw from "../components/Dashboard/PendingInvestWithdraw";
import NextClosedCardProfit from "../components/Dashboard/NextClosedCardProfit";
import StateCardCopy from "../components/Dashboard/StateCardCopy";
const Dashboard = () => {
  const [filterType, setFilterType] = useState("daily");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [activePreset, setActivePreset] = useState("");


  const {
    customerInstallmentCards,
    customerInstallmentPayments,
    investInstallments,
    companyExpenses,
    dailyInstallments,
    isLoading,
    isError,
        investorWithdrawApplications,
    withdrawApplicationsRefetch,
    users,
     roleStats
  } = useDashboardData();

  const currentYear = new Date().getFullYear();

  const yearOptions = Array.from(
    { length: currentYear - 2024 + 1 },
    (_, i) => currentYear - i,
  );
  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    setSelectedDate(today);
  }, []);


  const matchDate = (itemDate) => {
    if (!itemDate) return false;

    const cleanDate = itemDate.split(" ")[0];

    if (filterType === "daily") {
      return cleanDate === (selectedDate || today);
    }

    if (filterType === "monthly" && selectedMonth) {
      return cleanDate.startsWith(selectedMonth);
    }

    if (filterType === "yearly" && selectedYear) {
      return cleanDate.startsWith(selectedYear);
    }

    return true;
  };
  const filteredPayments = customerInstallmentPayments?.filter((p) => {
    const isPaid = p.status === "Paid";
    const isMatchedDate = matchDate(p.paid_date);

    return isPaid && isMatchedDate;
  });
  const filteredInvestments = investInstallments?.filter((i) =>
    matchDate(i.investment_date),
  );

  const filteredDailyInstallments = dailyInstallments?.filter((d) =>
    matchDate(d.date),
  );

  const filteredSales = customerInstallmentCards?.filter((c) =>
    matchDate(c.delivery_date),
  );
  const filteredExpenses = companyExpenses?.filter((c) =>
    matchDate(c.expense_date),
  );

  const totalSalesAmount = sumBy(filteredSales, "sale_price");
  const totalInstallmentAmount = sumBy(filteredPayments, "due_amount");
  const totalInvestmentAmount = sumBy(filteredInvestments, "amount");
  const totalExpenseAmount = sumBy(filteredExpenses, "amount");
  const totalDailyInstallmentAmount = sumBy(
    filteredDailyInstallments,
    "amount",
  );

  const chartConfig = (data, field, dateField) =>
    getChartData({
      data,
      field,
      dateField,
      startDate,
      endDate,
      activePreset,
      MONTHS,
    });
  const salesChart = chartConfig(
    customerInstallmentCards,
    "sale_price",
    "delivery_date",
  );
  const installmentChart = chartConfig(
    customerInstallmentPayments,
    "due_amount",
    "paid_date",
  );

  const investmentChart = chartConfig(
    investInstallments,
    "amount",
    "investment_date",
  );

  const dailyInstallmentChart = chartConfig(
    dailyInstallments,
    "amount",
    "date",
  );

  const expenseChart = chartConfig(companyExpenses, "amount", "expense_date");
  const handlePreset = (type) => {
    const { startDate, endDate, activePreset } = applyPreset(type);

    setStartDate(startDate);
    setEndDate(endDate);
    setActivePreset(activePreset);
  };
  useEffect(() => {
    handlePreset("7d");
  }, []);

  return (
    <>
<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-3 mt-4 pb-7">
  <StateCardCopy title="Total Users" value={roleStats.total} />
  <StateCardCopy title="Customers" value={roleStats.customer} />
  <StateCardCopy title="Investors" value={roleStats.investor} />
  <StateCardCopy title="Staff" value={roleStats.staff} />
  <StateCardCopy title="Managers" value={roleStats.manager} />
  <StateCardCopy title="Admins" value={roleStats.admin} />
  <StateCardCopy title="Developers" value={roleStats.developer} />
</div>
      <div className="border border-gray-700 p-2 rounded-2xl">
        <h2 className="text-4xl font-semibold text-center py-2">Company Overview Chart</h2>
        <DashboardFilter
          filterType={filterType}
          setFilterType={setFilterType}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          selectedMonth={selectedMonth}
          setSelectedMonth={setSelectedMonth}
          selectedYear={selectedYear}
          setSelectedYear={setSelectedYear}
          yearOptions={yearOptions}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
          <StatCard title={"Total Sales"} value={totalSalesAmount}/>
          <StatCard
            title={"Total Installments"}
            value={totalInstallmentAmount}
          />
          <StatCard title={"Total Investment"} value={totalInvestmentAmount} />
          <StatCard
            title={"Total Daily Installments"}
            value={totalDailyInstallmentAmount}
          />
          <StatCard
            title={"Total Company Expense"}
            value={totalExpenseAmount}
          />
         
        </div>


        <DashboardChart
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        handlePreset={handlePreset}
        salesChart={salesChart}
        installmentChart={installmentChart}
        investmentChart={investmentChart}
        dailyInstallmentChart={dailyInstallmentChart}
        expenseChart={expenseChart}
        activePreset={activePreset}
        setActivePreset={setActivePreset}
      />
      </div>
      <PendingInvestWithdraw investorWithdrawApplications={investorWithdrawApplications} withdrawApplicationsRefetch={withdrawApplicationsRefetch}/>
    <NextClosedCardProfit />
    </>
  );
};

export default Dashboard;

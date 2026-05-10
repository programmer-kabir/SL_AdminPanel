import {
  HiOutlineHome,
  HiOutlineCube,
  HiOutlineUserGroup,
} from "react-icons/hi2";

import {
  FaBuilding,
  FaUser,
  FaUserPlus,
  FaBoxOpen,
  FaCartShopping,
  FaCashRegister,
} from "react-icons/fa6";
import { FaTasks } from "react-icons/fa";

import {
  TbUsers,
  TbFilePlus,
  TbShoppingCartPlus,
  TbCashBanknote,
  TbClipboardList,
  TbWallet,
  TbShoppingCart,
  TbChartBar,
  TbReport,
  TbClock,
} from "react-icons/tb";

import { RiBankCardLine, RiBankCard2Line } from "react-icons/ri";
import { MdDeveloperMode, MdInventory, MdOutlineDashboard, MdOutlineInventory2, MdPayments, MdProductionQuantityLimits, MdShowChart } from "react-icons/md";
import { GiReceiveMoney, GiPayMoney } from "react-icons/gi";
import { IoStatsChart } from "react-icons/io5";
import { BsBank, BsGraphUpArrow, BsClipboardData, BsCashStack } from "react-icons/bs";
import { AiFillCloseCircle, AiOutlineUserAdd } from "react-icons/ai";

export const sidebarMenu = [
  // DASHBOARD
  {
    label: "Dashboard",
    path: "/",
    icon: MdOutlineDashboard,
    roles: ["admin", "developer", "manager", "staff"],
  },

  // WORK & ATTENDANCE
  {
    label: "Assign Task",
    path: "/assign_task",
    icon: TbClipboardList,
    roles: ["admin", "developer", "manager", "staff"],
  },
  {
    label: "Cash Management",
    path: "/cash/cash-menage",
    icon: BsCashStack,
    roles: ["admin", "developer", "manager", "staff"],
  },

{
  type: "collapse",
  label: "Work & Attendance",
  icon: TbClipboardList, // main group icon (change চাইলে পারো)
  roles: ["admin", "developer", "manager", "staff"],
  children: [
    {
      label: "Employer Work Sessions",
      path: "/staff/employer_work_record",
      icon: TbClock,
      roles: ["admin", "developer", "manager", "staff"],
    },
    {
      label: "Attendance Logs",
      path: "/staff/employer_attendance_logs",
      icon: TbReport,
      roles: ["admin", "developer", "manager", "staff"],
    },
  ],
},

  // SUBMIT FORMS
  // {
  //   type: "collapse",
  //   label: "Submit Forms",
  //   icon: TbFilePlus,
  //   roles: ["admin", "developer", "manager", "staff"],
  //   children: [
  //     {
  //       label: "Product Purchase Request",
  //       path: "/applications/product-purchase_request",
  //       icon: TbShoppingCartPlus,
  //       roles: ["admin", "developer", "manager", "staff"],
  //     },
      
  //   ],
  // },

  // USERS
  {
    type: "collapse",
    label: "Users",
    icon: TbUsers,
    roles: ["admin", "developer", "manager", "staff"],
    children: [
      {
        label: "All Users",
        path: "/all_users",
        icon: FaUser,
        roles: ["admin", "developer", "manager", "staff"],
      },
      {
        label: "Add User",
        path: "/add_user",
        icon: AiOutlineUserAdd,
        roles: ["admin", "developer", "manager", "staff"],
      },
      {
        label: "Add Roles",
        path: "/add_roles",
        icon: FaUserPlus,
        roles: ["admin", "developer", "manager", "staff"],
      },
      {
        label: "Assign Guarantor",
        path: "/customers/customer_guarantor_assign",
        icon: HiOutlineUserGroup,
        roles: ["admin", "developer", "manager", "staff"],
      },
    ],
  },

  // CUSTOMERS
  {
    type: "collapse",
    label: "Customers",
    icon: HiOutlineUserGroup,
    roles: ["admin", "developer", "manager", "staff"],
    children: [
      {
        label: "Customer List",
        path: "/customers/all_customer",
        icon: FaUser,
        roles: ["admin", "developer", "manager", "staff"],
      },
      {
        label: "Installment Cards",
        path: "/customers/installment_cards",
        icon: RiBankCardLine,
        roles: ["admin", "developer", "manager", "staff"],
      },
      {
        label: "Create Installment Cards",
        path: "/customers/create_installment_cards",
        icon: RiBankCard2Line,
        roles: ["admin", "developer", "manager"],
      },
      {
        label: "Installment Analytics",
        path: "/customers/monthly_installment_overviews",
        icon: MdShowChart,
        roles: ["admin", "developer", "manager", "staff"],
      },
      {
        label: "Monthly Installment Reports",
        path: "/customers/monthly_installment_reports",
        icon: TbChartBar,
        roles: ["admin", "developer", "manager", "staff"],
      },
      {
        label: "Monthly Installment Print",
        path: "/customers/monthly_installment_overview",
        icon: TbChartBar,
        roles: ["admin", "developer", "manager", "staff"],
      },
    ],
  },
  {
    type: "collapse",
    label: "Regular Installments",
    icon: HiOutlineUserGroup,
    roles: ["admin", "developer", "manager", "staff"],
    children: [
      {
        label: "Regular Installment  List",
        path: "/DailyInstallments/daily_installments_users",
        icon: TbUsers,
        roles: ["admin", "developer", "manager", "staff"],
      },
      {
        label: "Daily Installments Reports",
        path: "/DailyInstallments/daily_installments_reports",
        icon: TbReport,
        roles: ["admin", "developer", "manager", "staff"],
      },
    ],
  },

  // INVESTORS
  {
    type: "collapse",
    label: "Investors",
    icon: GiReceiveMoney,
    roles: ["admin", "developer", "manager", "staff"],
    children: [
      {
        label: "Investor List",
        path: "/investors/all_investors",
        icon: TbUsers,
        roles: ["admin", "developer", "manager", "staff"],
      },
      {
        label: "Investment Cards",
        path: "/investors/investment_cards",
        icon: RiBankCardLine,
        roles: ["admin", "developer", "manager", "staff"],
      },
      {
        label: "Create Investment Cards",
        path: "/investor/create_investment_card",
        icon: RiBankCard2Line,
        roles: ["admin", "developer", "manager", "staff"],
      },
      {
        label: "Daily Investment Summary",
        path: "/investors/daily_investment_reports",
        icon: TbChartBar,
        roles: ["admin", "developer", "manager", "staff"],
      },
      {
        label: "Monthly Investment Summary",
        path: "/investors/monthly_investment_reports",
        icon: TbReport,
        roles: ["admin", "developer", "manager", "staff"],
      },
      {
        label: "Up Coming Close Card",
        path: "/investors/upComingCloseCard",
        icon: AiFillCloseCircle,
        roles: ["admin", "developer", "manager", "staff"],
      },
    ],
  },

  // PROFIT
  {
    type: "collapse",
    label: "Profit History",
    icon: BsGraphUpArrow,
    roles: ["admin", "developer", "manager"],
    children: [
      {
        label: "Card Close History",
        path: "/profit/card-close-history",
        icon: MdShowChart,
        roles: ["admin", "developer", "manager"],
      },
      {
        label: "Profit Analytics",
        path: "/profit/profit-analytics",
        icon: MdShowChart,
        roles: ["admin", "developer", "manager"],
      },
      {
        label: "Monthly Profit Distributor",
        path: "/profit/monthly_profit_distributor",
        icon: TbCashBanknote,
        roles: ["admin", "developer", "manager"],
      },
    ],
  },

  // WITHDRAW
  {
    type: "collapse",
    label: "Withdraw",
    icon: BsBank,
    roles: ["admin", "developer", "manager"],
    children: [
      {
        label: "Withdraw Action",
        path: "/profit/withdraw-action",
        icon: GiPayMoney,
        roles: ["admin", "developer", "manager"],
      },
      {
        label: "Profit Action History",
        path: "/profit/profit_action_history",
        icon: TbClipboardList,
        roles: ["admin", "developer", "manager"],
      },
    ],
  },

  // MANAGER
  {
    type: "collapse",
    label: "Manager",
    icon: BsClipboardData,
    roles: ["manager", "developer"],
    children: [
      {
        label: "Manager Reports",
        path: "/manager/staff_reports",
        icon: TbReport,
        roles: ["manager", "developer"],
      },
    ],
  },

  // PRODUCTS
  {
    type: "collapse",
    label: "Products",
    icon: HiOutlineCube,
    roles: ["admin", "developer", "manager", "staff"],
    children: [
      {
        label: "Products Summary",
        path: "/products_summery",
        icon: FaBoxOpen,
        roles: ["admin", "developer", "manager", "staff"],
      },
      // {
      //   label: "Sales Product List",
      //   path: "/products/sales_products",
      //   icon: FaCartShopping,
      //   roles: ["admin", "developer", "manager", "staff"],
      // },
    ],
  },
  {
    type: "collapse",
    label: "Stock Inventory",
    icon: MdInventory,
    roles: ["admin", "developer", "manager", "staff"],
    children: [
      {
        label: "Inventory List",
        path: "inventory/inventory_list",
        icon: MdOutlineInventory2,
        roles: ["admin", "developer", "manager", "staff"],
      },
      {
        label: "Supplier Payments",
        path: "inventory/supplier_payments",
        icon: MdPayments,
        roles: ["admin", "developer", "manager", "staff"],
      }
    ],
  },

  // COMPANY
  {
    label: "Company Expenses",
    path: "/company_expenses",
    icon: FaBuilding,
    roles: ["admin", "developer", "manager", "staff"],
  },
  {
    label: "Finance Overview",
    path: "/finance_overview",
    icon: IoStatsChart,
    roles: ["admin", "developer", "manager", "staff"],
  },

  // DEVELOPER
  {
    type: "collapse",
    label: "Developer",
    icon: MdDeveloperMode,
    roles: ["developer"],
    children: [
      {
        label: "Staff Activity",
        path: "/developer/staff_activity",
        icon: TbClock,
        roles: ["developer"],
      },
    ],
  },

  // SUBMITTED APPLICATIONS
  {
    type: "collapse",
    label: "Submitted Applications",
    icon: TbClipboardList,
    roles: ["admin", "developer", "manager"],
    children: [
      {
        label: "Investment Withdraw Request",
        path: "/applications/invest_withdraw_request",
        icon: TbCashBanknote,
        roles: ["admin", "developer", "manager", "staff"],
      },
      {
        label: "Investment Withdraw Applications",
        path: "/applications/all_invest_withdraw",
        icon: TbWallet,
        roles: ["admin", "developer", "manager"],
      },
    ],
  },
];

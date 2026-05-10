import React, { useMemo } from "react";
import { useSearchParams, Navigate } from "react-router-dom";
import useUsers from "../../../utils/Hooks/useUsers";
import useInvestInstallment from "../../../utils/Investors/useInvestInstallment";
import useInvestmentCards from "../../../utils/Investors/useInvestmentCards";
import NoDataFound from "../../../components/NoData/NoDataFound";
import Loader from "../../../components/Loader/Loader";
import BackButton from "../../../components/BackButton/BackButton";

const toNum = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

const getInstallmentCardNo = (row) => {
  return (
    row?.investment_card_no ??
    row?.card_id ??
    row?.investment_card_id ??
    row?.invest_card_id ??
    row?.card_no
  );
};

const InvestorDetails = () => {
  const [searchParams] = useSearchParams();
  const cardIdRaw = searchParams.get("card_id");
  const cardId = Number(cardIdRaw);

  const { isUsersLoading, users = [], isUsersError } = useUsers();
  const {
    inInvestInstallmentsLoading,
    investInstallments = [],
    isInvestInstallmentsError,
  } = useInvestInstallment();

  const {
    investmentCards = [],
    isInvestmentCardsError,
    isInvestmentCardsLoading,
  } = useInvestmentCards();

  const isLoading =
    isUsersLoading || inInvestInstallmentsLoading || isInvestmentCardsLoading;

  const isError =
    isUsersError || isInvestInstallmentsError || isInvestmentCardsError;

  // ✅ 1) investorCard (safe)
  const investorCard = useMemo(() => {
    if (!cardId || Number.isNaN(cardId)) return null;
    return investmentCards.find((c) => Number(c?.id) === Number(cardId)) || null;
  }, [investmentCards, cardId]);

  // ✅ 2) investor (safe)
  const investor = useMemo(() => {
    if (!investorCard?.investor_id) return null;

    const investors = users.filter(
      (u) => Array.isArray(u?.roles) && u.roles.includes("investor")
    );

    return (
      investors.find(
        (inv) => String(inv?.id) === String(investorCard?.investor_id)
      ) || null
    );
  }, [users, investorCard]);

  // ✅ 3) cardPayments (always returns array)
  const cardPayments = useMemo(() => {
    if (!cardId || Number.isNaN(cardId)) return [];
    return investInstallments.filter(
      (row) => Number(getInstallmentCardNo(row)) === Number(cardId)
    );
  }, [investInstallments, cardId]);

  // ✅ 4) deposit
  const deposit = useMemo(() => {
    return cardPayments.reduce((sum, row) => sum + toNum(row?.amount), 0);
  }, [cardPayments]);

  // ✅ 5) rank among all cards by total deposit
  const rank = useMemo(() => {
    if (!cardId || Number.isNaN(cardId)) return 0;

    const totalsMap = new Map(); // cardNo -> total
    investInstallments.forEach((row) => {
      const cNo = Number(getInstallmentCardNo(row));
      if (!cNo) return;
      totalsMap.set(cNo, (totalsMap.get(cNo) || 0) + toNum(row?.amount));
    });

    const totalsArr = Array.from(totalsMap.entries()).map(([cNo, total]) => ({
      cardNo: cNo,
      total,
    }));

    if (!totalsArr.length) return 0;

    totalsArr.sort((a, b) => b.total - a.total);
    const idx = totalsArr.findIndex((x) => Number(x.cardNo) === Number(cardId));
    return idx === -1 ? 0 : idx + 1;
  }, [investInstallments, cardId]);

  /* ---------------- AFTER ALL HOOKS: returns ---------------- */

  // invalid cardId
  if (!cardIdRaw || !cardId || Number.isNaN(cardId)) {
    return <Navigate to="/not-found" replace />;
  }

  if (isLoading) {
    return (
      <div className="min-h-[60vh] w-full flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (isError) {
    return (
      <NoDataFound
        message="ডাটা লোড করা যায়নি"
        subMessage="পরে আবার চেষ্টা করুন"
      />
    );
  }

  if (!investorCard) {
    return (
      <NoDataFound
        message="Investment card not found"
        subMessage={`card_id: ${cardId}`}
      />
    );
  }

  if (!investor) {
    return (
      <NoDataFound
        message="Investor not found"
        subMessage={`investor_id: ${investorCard?.investor_id}`}
      />
    );
  }
const normalizeStatus = (s) => String(s ?? "").toLowerCase().trim();
  return (
    <div className="mx-auto">
      <BackButton />
      <div className="flex items-center justify-center pt-4">
        <div className="w-full rounded-2xl bg-slate-900/80 backdrop-blur border border-white/10 shadow-2xl p-8 text-white">
          <h1 className="text-2xl font-bold mb-6">Investor Details</h1>

          <div className="flex items-center gap-5 mb-8">
         <div className="w-20 h-20 rounded-full p-[2px] bg-white/20">
  <img
    className="w-full h-full object-cover rounded-full"
    src={`https://app.supplylinkbd.com/${investor?.photo}`}
    alt=""
  />
</div>

            <div>
              <h2 className="text-xl font-semibold">{investor.name}</h2>
              <p className="text-sm text-slate-400">{investor.mobile}</p>

             {(() => {
  const status = normalizeStatus(investorCard?.status);
  const isClosed = status === "closed" || status === "close";

  return (
    <span
      className={`inline-block mt-2 px-3 py-1 text-xs rounded-full border ${
        isClosed
          ? "bg-rose-500/10 text-rose-300 border-rose-500/30"
          : "bg-emerald-500/10 text-emerald-300 border-emerald-500/30"
      }`}
    >
      {isClosed ? "Closed Card" : "Active Investor"}
    </span>
  );
})()}


              <p className="mt-2 text-xs text-white/50">
                Card: {investorCard?.card_name ?? investorCard?.id} (ID: {cardId})
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Info label="Investor ID" value={investor.id} />
            <Info label="Card Rank" value={rank ? `#${rank}` : "-"} highlight />
            <Info
              label="Total Deposit (This Card)"
              value={`৳ ${deposit.toLocaleString()}`}
              highlight
            />
            <Info
              label="Committed Amount"
              value={`৳ ${toNum(investorCard?.investment_amount).toLocaleString()}`}
            />
            <Info label="NID" value={investor.id_number ?? "-"} />
            <Info label="Address" value={investor.address ?? "-"} />
            <Info
              label="Roles"
              value={Array.isArray(investor.roles) ? investor.roles.join(", ") : "-"}
            />
          </div>

          <p className="mt-6 text-sm text-white/60">
            Payments found for this card: {cardPayments.length}
          </p>
        </div>
      </div>
    </div>
  );
};

const Info = ({ label, value, highlight }) => (
  <div
    className={`rounded-xl p-4 border transition ${
      highlight
        ? "bg-indigo-500/10 border-indigo-500/30"
        : "bg-slate-800/60 border-white/5"
    }`}
  >
    <p className="text-xs text-slate-400 mb-1">{label}</p>
    <p className="text-lg font-medium break-words">{value}</p>
  </div>
);

export default InvestorDetails;

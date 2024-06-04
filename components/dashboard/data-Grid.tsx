"use client";

import DataCard, { DataCardLoading } from "@/components/dashboard/data-Card";
import { useGetSummary } from "@/hooks/summary/api/use-Get-Summary";
import { FaArrowTrendUp, FaArrowTrendDown } from "react-icons/fa6";
import { useSearchParams } from "next/navigation";
import { formatDateRange } from "@/lib/utils";
import { FaPiggyBank } from "react-icons/fa";

const DataGrid = () => {
  const { data, isLoading } = useGetSummary();

  const params = useSearchParams();
  const to = params.get("to") || undefined;
  const from = params.get("from") || undefined;

  const dateRangeLabel = formatDateRange({ to, from });

  if (isLoading) {
    return (
      <div className="mb-8 grid grid-cols-1 gap-8 pb-2 lg:grid-cols-3">
        <DataCardLoading />
        <DataCardLoading />
        <DataCardLoading />
      </div>
    );
  }

  return (
    <div className="mb-8 grid grid-cols-1 gap-8 pb-2 lg:grid-cols-3">
      <DataCard
        title="Remaining"
        value={data?.remainingAmount}
        percentageChange={data?.remainingChange}
        icon={FaPiggyBank}
        variant="default"
        dateRange={dateRangeLabel}
      />

      <DataCard
        title="Income"
        value={data?.incomeAmount}
        percentageChange={data?.incomeChange}
        icon={FaArrowTrendUp}
        variant="default"
        dateRange={dateRangeLabel}
      />

      <DataCard
        title="Expenses"
        value={data?.expensesAmount}
        percentageChange={data?.expensesChange}
        icon={FaArrowTrendDown}
        variant="default"
        dateRange={dateRangeLabel}
      />
    </div>
  );
};

export default DataGrid;

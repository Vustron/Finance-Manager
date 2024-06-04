import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/utils";
import { format } from "date-fns";

const CustomTooltip = ({ active, payload }: any) => {
  if (!active) return null;

  const date = payload[0].payload.date;
  const income = payload[0].value;
  const expenses = payload[1].value;

  return (
    <div className="overflow-hidden rounded-sm border bg-white shadow-sm">
      <div>{format(date, "MMM dd, yyyy")}</div>

      <Separator />

      <div className="space-y-1 p-2 px-3">
        <div className="flex items-center justify-between gap-x-4">
          <div className="flex items-center gap-x-2">
            <div className="size-1.5 rounded-full bg-blue-500" />

            <span className="text-sm text-muted-foreground">Income</span>
          </div>

          <span className="text-right text-sm font-medium">
            {formatCurrency(income)}
          </span>
        </div>

        <div className="flex items-center justify-between gap-x-4">
          <div className="flex items-center gap-x-2">
            <div className="size-1.5 rounded-full bg-rose-500" />

            <span className="text-sm text-muted-foreground">Expenses</span>
          </div>

          <span className="text-right text-sm font-medium">
            {formatCurrency(expenses * -1)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CustomTooltip;

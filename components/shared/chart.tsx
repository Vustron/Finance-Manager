import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectValue,
  SelectItem,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileSearch, AreaChart, LineChart, BarChart3 } from "lucide-react";
import LineVariant from "@/components/shared/lineVariant";
import AreaVariant from "@/components/shared/areaVariant";
import BarVariant from "@/components/shared/barVariant";
import { useState } from "react";

type Props = {
  data?: {
    date: string;
    income: number;
    expenses: number;
  }[];
};

const Chart = ({ data = [] }: Props) => {
  const [chartType, setChartType] = useState("area");

  const onChangeType = (type: string) => {
    // TODO: add paywall
    setChartType(type);
  };

  return (
    <Card className="border-none drop-shadow-sm">
      <CardHeader className="flex justify-between space-y-2 lg:flex-row lg:items-center lg:space-y-0">
        <CardTitle className="line-clamp-1 text-xl">Transactions</CardTitle>

        <Select defaultValue={chartType} onValueChange={onChangeType}>
          <SelectTrigger className="h-9 rounded-md px-3 lg:w-auto">
            <SelectValue placeholder={chartType} />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="area">
              <div className="flex items-center">
                <AreaChart className="mr-2 size-4 shrink-0" />
                <p className="line-clamp-1">Area Chart</p>
              </div>
            </SelectItem>

            <SelectItem value="line">
              <div className="flex items-center">
                <LineChart className="mr-2 size-4 shrink-0" />
                <p className="line-clamp-1">Line Chart</p>
              </div>
            </SelectItem>

            <SelectItem value="bar">
              <div className="flex items-center">
                <BarChart3 className="mr-2 size-4 shrink-0" />
                <p className="line-clamp-1">Bar Chart</p>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>

      <CardContent>
        {data.length === 0 ? (
          <div className="flex h-[350px] w-full flex-col items-center justify-center gap-y-4">
            <FileSearch className="size-6 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              No data for this period
            </span>
          </div>
        ) : (
          <>
            {chartType === "line" && <LineVariant data={data} />}
            {chartType === "area" && <AreaVariant data={data} />}
            {chartType === "bar" && <BarVariant data={data} />}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default Chart;

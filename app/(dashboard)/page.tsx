import DataCharts from "@/components/dashboard/data-Charts";
import DataGrid from "@/components/dashboard/data-Grid";

export default function DashboardPage() {
  return (
    <div className="mx-auto -mt-24 w-full max-w-screen-2xl pb-10">
      <DataGrid />
      <DataCharts />  
    </div>
  );
}

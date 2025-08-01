import AnalyticsCards from "./analyticCards";
import DealsGeoChartComponent from "./deals";
import ApiHealth from "./health";

export default function DashboardPage() {
  return (
    <div className="p-6">
      <ApiHealth />
      <p className="m-10"></p>
<DealsGeoChartComponent/>   
      <p className="m-10"></p>

<AnalyticsCards/>   

        </div>
  );
}

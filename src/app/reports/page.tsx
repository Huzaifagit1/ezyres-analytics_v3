import NegotiationMarginChart from "./negotiation";
import RepeatSellersChart from "./repeat-sellers";
export default function ReportsPage() {
return(
<div>
    <div className="mt-10">
    <RepeatSellersChart/>
</div>
<div className="mt-10">
<NegotiationMarginChart/>
</div></div>
);


}
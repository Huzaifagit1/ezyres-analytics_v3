import NegotiationMarginChart from "./negotiation";
import RepeatSellersChart from "./repeat-sellers";
export default function ReportsPage() {
return(
<div>
<div>
<NegotiationMarginChart/>
</div><div>
    <RepeatSellersChart/>
</div></div>
);


}
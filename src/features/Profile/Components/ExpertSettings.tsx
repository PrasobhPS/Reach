import { Heading } from "../../../components/Heading/Heading";
import { CallRates } from "./CallRate";
import { UnavailableDate } from "./UnavailableDate";
import { WorkingHour } from "./WorkingHour";

type DaysOfWeekMap = {
    [key: number]: string;
};
export function ExpertSettings() {


    return (
        <div className="col-md-12 col-12 py-2 General-Settings">
            <Heading tag="h3">Expert</Heading>
            <WorkingHour />
            <UnavailableDate />
            <CallRates />
        </div>
    );
}

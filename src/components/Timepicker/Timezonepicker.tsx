import moment from "moment";
import { ChangeEvent, useEffect, useState } from "react";

interface Timezone {
    zone: string;
    time: string;
}

interface TimezonepickerProps {
    onSelectTimezone?: (timezone: string) => void;
}

export const Timezonepicker = ({ onSelectTimezone }: TimezonepickerProps) => {
    const [timezones, setTimezones] = useState([
        { zone: "Europe/London", gmt: "(GMT+00:00)", name: "London" },
    ]);

    const [currentTimeInTimezones, setCurrentTimeInTimezones] = useState<Timezone[]>([]);
    const [SelectedTimezone, setSelectedTimezone] = useState<string>("Europe/London");

    useEffect(() => {
        const fetchCurrentTimeInTimezones = async () => {
            const currentTimeInTimezones = await Promise.all(
                timezones.map(async (timezone) => {
                    const formattedTime = new Intl.DateTimeFormat("en-US", {
                        timeStyle: "medium",
                        timeZone: timezone.zone,
                    }).format(new Date());

                    // Use moment to convert to 24-hour format
                    const timeIn24HourFormat = moment(formattedTime, ["h:mm:ss A"]).format("HH:mm");

                    return { zone: timezone.zone, time: timeIn24HourFormat };
                })
            );
            setCurrentTimeInTimezones(currentTimeInTimezones);
        };

        const interval = setInterval(fetchCurrentTimeInTimezones, 1000);

        return () => clearInterval(interval);
    }, [timezones]);

    const handleSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
        const selectedTimezone = event.target.value;
        setSelectedTimezone(selectedTimezone);
        if (onSelectTimezone) {
            onSelectTimezone(selectedTimezone);
        }
    };

    return (
        <div className="duration-select">
            <select className="form-control" value={SelectedTimezone} onChange={handleSelectChange}>
                {currentTimeInTimezones.map((timezone) => (
                    <option key={timezone.zone} value={timezone.zone}>
                        {timezone.zone} Time: ({timezone.time})
                    </option>
                ))}
            </select>
        </div>
    );
};

import moment from 'moment';
import './Timepicker.scss'
import { useEffect, useState } from 'react';
import { Timezonepicker } from './Timezonepicker';

interface TimepickerProps {
    handleChange?: (value: string) => void;
    handleTimezoneChange?: (timezone: string) => void;
    bookedTimes: string[];
    selectedTime: string | null | undefined;
    selectedDate: Date | null;
    timezoneTime: string | null | undefined;
}


export const Timepicker = (props: TimepickerProps) => {

    const today = moment().toDate();
    const { handleChange, bookedTimes, selectedTime, selectedDate, timezoneTime } = props;
    const [times, setTimes] = useState<string[]>([]);
    const [selectTime, setSelectTime] = useState<string>('');
    const [displayedItems, setDisplayedItems] = useState<number>(6); // State to track the number of initially displayed items

    const getTimes = () => {
        setSelectTime('');
        const startTime = moment('00:00', 'HH:mm');
        const endTime = moment('23:59', 'HH:mm'); // Ensures times up to the end of the day
        const interval = 60; // 60 minutes interval
        const _times: string[] = [];
        const timezone = timezoneTime ? timezoneTime : Intl.DateTimeFormat().resolvedOptions().timeZone;

        // Current time in the selected timezone
        const nowTime = moment().tz(timezone).format('HH:mm');
        let currentTime = moment(nowTime, 'HH:mm');

        // Reset currentTime for dates other than today
        if (moment(selectedDate).format('DD/MM/YY') !== moment(today).format('DD/MM/YY')) {
            currentTime = startTime.clone();
        }

        // Adjust to next hour if current time's minutes are non-zero
        const minutes = currentTime.minutes();
        if (minutes > 0) {
            currentTime.minutes(0).add(1, 'hours');
        }

        // Generate time slots
        while (currentTime.isBefore(endTime)) {
            _times.push(currentTime.format('HH:mm'));
            currentTime.add(interval, 'minutes');
        }

        setTimes(_times);
    };


    useEffect(() => {
        getTimes();
    }, [selectedDate, timezoneTime]);
    const returnTime = (data: string) => {
        setSelectTime(data);
        if (props.handleChange) { // Check if handleChange is defined before calling it
            props.handleChange(data);
        }
    }

    const handleMoreButtonClick = () => {
        // Display 6 more items on each "More" button click
        setDisplayedItems(prev => prev + 6);
    }


    return (
        <div>
            <p className="duration-select">Select a 60 min time slot</p>
            <Timezonepicker onSelectTimezone={props.handleTimezoneChange} />
            {
                times.slice(0, displayedItems).map((item, index) => (
                    <button
                        className={`duration-btn ${props.bookedTimes.includes(item) ? 'booked' : ''} ${selectTime === item ? 'currentBooked' : ''}`}
                        key={index}
                        onClick={props.bookedTimes.includes(item) ? undefined : () => returnTime(item)} // Conditionally render onClick
                        disabled={props.bookedTimes.includes(item)} // Disable button if booked
                    >
                        {item.toLowerCase()}
                    </button>

                ))
            }
            {displayedItems < times.length && <button className="button-link" onClick={handleMoreButtonClick}>More times</button>}
        </div >
    );
}

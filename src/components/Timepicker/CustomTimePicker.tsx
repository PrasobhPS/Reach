import moment from 'moment';
import 'moment-timezone'; // Import moment-timezone
import './Timepicker.scss';
import { useEffect, useState } from 'react';
import { useGetAvailableTimeMutation } from '../../features/Specialist/SpecialistApiSlice';
import { Timezonepicker } from './Timezonepicker';
import { useGetInterviewAvailableTimeMutation } from '../../features/Cruz/Api/InterviewApiSlice';

interface TimepickerProps {
    handleChange?: (value: string) => void;
    specialist_id?: string;
    selectedTime: string | null | undefined;
    selectedDate: Date | null;
    timezoneTime: string | null | undefined;
    changeTimeSlot?: (value: any) => void;
    from?: string;
    isRearrange?: boolean;
    timeSlot?: '1 hour' | '1hr' | '30 min';
}

export const CustomTimePicker = (props: TimepickerProps) => {
    const today = moment().toDate();
    const { handleChange, specialist_id, selectedTime, selectedDate, timezoneTime, changeTimeSlot, from, isRearrange, timeSlot } = props;
    const [bookedTimes, setBookedTimes] = useState<string[]>([]);
    const [unAvailableTimes, setUnAvailableTimes] = useState<string[]>([]);
    const [times, setTimes] = useState<string[]>([]);
    const [selectTime, setSelectTime] = useState<string>('');
    const [displayedItems, setDisplayedItems] = useState<number>(10);
    const [timeSlotDuration, setTimeSlotDuration] = useState<'1 hour' | '1hr' | '30 min'>(timeSlot ? timeSlot : '1 hour');
    const [timezone, setTimezone] = useState<string>('Europe/London');
    const [availableTime] = useGetAvailableTimeMutation();
    const [isLoading, setIsLoading] = useState(false);
    const [interviewAvailbaleTime] = useGetInterviewAvailableTimeMutation();
    const fetchAvailableTime = async () => {
        setIsLoading(true);
        try {
            const formattedDate = moment(selectedDate).format('YYYY-MM-DD');
            if (from !== 'interview') {

                const response = await availableTime({
                    specialist_id: specialist_id,
                    call_scheduled_date: formattedDate,
                    timeSlot: timeSlotDuration,
                });
                if ('error' in response) {
                    throw new Error('Failed to fetch specialist list');
                }
                const data = response.data.available_time_slots;
                if (data.length === 0) {
                    returnTime('');
                }
                setTimes(data);
                const booked = response.data.schedule_time;
                setBookedTimes(booked);
            } else {
                const response = await interviewAvailbaleTime({
                    member_id: specialist_id,
                    interview_date: formattedDate,
                });
                if ('error' in response) {
                    throw new Error('Failed to fetch specialist list');
                }
                const data = response.data.available_time_slots;
                setTimes(data);
                const booked = response.data.schedule_time;
                setBookedTimes(booked);
            }
        } catch (error) {
            console.error('Failed to fetch specialist list:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (selectedDate) {
            setUnAvailableTimes([]);
            returnTime('');
            fetchAvailableTime();
        }
    }, [selectedDate]);

    useEffect(() => {
        fetchAvailableTime();
    }, [timeSlotDuration]); // Fetch when timeSlotDuration changes


    useEffect(() => {
        if (timeSlot) {
            setTimeSlotDuration(timeSlot as '1 hour' | '1hr' | '30 min');
        } else {
            setTimeSlotDuration('1 hour');
        }
    }, [timeSlot]);

    const returnTime = (data: string) => {
        setSelectTime(data);
        if (props.handleChange) {
            props.handleChange(data);
        }
    };

    const handleMoreButtonClick = () => {
        setDisplayedItems((prev) => prev + 6);
    };

    const toggleTimeSlotDuration = () => {
        returnTime('');
        setUnAvailableTimes([]);
        const newDuration = timeSlotDuration === '1 hour' ? '30 min' : '1 hour';
        setTimeSlotDuration(newDuration);
        if (changeTimeSlot) {
            changeTimeSlot(newDuration); // Pass the updated duration directly
        }
    };

    const filteredTimes = times.filter((time) => {
        const currentTimeInTimezone = moment.tz(timezone);
        const timeInTimezone = moment.tz(time, 'HH:mm', timezone);
        const selectformattedDate = moment(selectedDate).format('YYYY-MM-DD');
        const todayformattedDate = moment(today).format('YYYY-MM-DD');

        if (selectformattedDate === todayformattedDate && timeInTimezone.isBefore(currentTimeInTimezone)) {
            return false;
        }

        if (timeSlotDuration === '1 hour') {
            return timeInTimezone.minute() === 0; // Only show full hour slots for 1-hour duration
        }

        return true;
    });

    return (
        <div>
            {from !== 'interview' && !isRearrange && (
                <div className="time-picker-box">
                    <p className="duration-select">Select a time slot</p>
                    <div className="switch-toggle">
                        <input
                            className="switch-toggle-checkbox"
                            onClick={toggleTimeSlotDuration}
                            type="checkbox"
                            id="pricing-plan-switch"
                        />
                        <label className="switch-toggle-label" htmlFor="pricing-plan-switch">
                            <span>1 hour</span>
                            <span>30 Min</span>
                        </label>
                    </div>
                </div>
            )}
            <Timezonepicker />
            {filteredTimes.slice(0, displayedItems).map((item, index) => {
                // Adjusted booked comparison using moment
                const isBooked = bookedTimes.some((bookedTime) =>
                    moment(bookedTime, 'HH:mm').isSame(moment(item, 'HH:mm'))
                );

                return (
                    <button
                        className={`duration-btn ${isBooked ? 'booked' : ''} ${selectTime === item ? 'currentBooked' : ''}`}
                        key={index}
                        onClick={isBooked ? undefined : () => returnTime(item)}
                        disabled={isBooked}
                    >
                        {item.toLowerCase()}
                    </button>
                );
            })}
            {displayedItems < filteredTimes.length && (
                <button className="button-link" onClick={handleMoreButtonClick}>
                    More times
                </button>
            )}
        </div>
    );
};

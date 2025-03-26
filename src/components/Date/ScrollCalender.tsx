import { useState, useEffect } from 'react';
import moment, { Moment } from 'moment';
import { Date } from './Date';
import ScrollMenu from 'react-horizontal-scroll-menu';
import './HorizontalCalender.scss';

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

interface CalenderProps {
    onSelectDate: (date: Date) => void;  // Handle a single date selection
    selected: Date | null;  // Only one selected date
    highlightDates?: Date[];  // Array of dates to highlight
}

export const ScrollCalender = (props: CalenderProps) => {
    const { onSelectDate, selected, highlightDates = [] } = props;
    const [dates, setDates] = useState<Moment[]>([]);
    const today = moment().startOf("day").add(1, 'days');
    const [selectedDate, setSelectedDate] = useState<string | null>(null);

    const getDates = (startDate: Moment) => {
        const _dates: Moment[] = [];
        for (let i = 0; i < 30; i++) {
            const date = startDate.clone().add(i, "days");
            _dates.push(date);
        }
        setDates(_dates);
    };

    useEffect(() => {
        if (selected) {
            setSelectedDate(moment(selected).format("YYYY-MM-DD"));
        }
    }, [selected]);

    useEffect(() => {
        getDates(today);
    }, [today]);

    const toggleDateSelection = (date: Moment) => {
        const formattedDate = moment(date).format("YYYY-MM-DD");
        if (selectedDate === formattedDate) {
            setSelectedDate(null);  // Deselect if the same date is clicked
        } else {
            setSelectedDate(formattedDate);  // Update with the new selected date
        }

        // Pass the updated date back to the parent component
        onSelectDate(date.toDate());
    };

    // Helper function to check if a date should be highlighted
    const isHighlighted = (date: Moment) => {
        return highlightDates.some(highlightDate => moment(highlightDate).isSame(date, 'day'));
    };

    const dateComponents = dates.map((date, index) => {
        const isActive = selectedDate === moment(date).format('YYYY-MM-DD');
        const isDisabled = date.isBefore(today, "day");
        const isHighlightedDate = isHighlighted(date);  // Check if date is in the highlightDates array

        return (
            <Date
                key={index}
                date={date.toDate()}
                onSelectDate={() => toggleDateSelection(date)}
                selected={selected ? [selected] : []}  // Wrap the selected date in an array to pass it down
                active={isActive}  // Mark the date as active if it's the selected date
                disabled={isDisabled}
                highlighted={isHighlightedDate}  // Pass down if the date is highlighted
            />
        );
    });

    return (
        <div>
            <div className="horizontal-calendar">
                <div className="horizontalMenuWrapper horizontalCalenderSize">
                    <ScrollMenu
                        data={dateComponents}
                        wheel={false}
                        alignCenter={false}
                        scrollToSelected={true}
                    />
                </div>
            </div>
        </div>
    );
};

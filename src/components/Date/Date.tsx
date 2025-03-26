import moment from 'moment';
import React from 'react';

interface DateProps {
  onSelectDate?: (date: Date) => void;
  selected: Date[] | Date | null;
  date: Date | null;
  active?: boolean;
  disabled?: boolean;
  highlighted?: boolean; // Added for highlight state
}

export const Date = (props: DateProps) => {
  const { date, onSelectDate, active, disabled, highlighted } = props;

  if (!date) {
    return null; // Return null if date is null
  }

  // Format day of the week or show 'Today' if it's today
  const day = moment(date).isSame(moment(), 'day') ? 'Today' : moment(date).format('ddd');

  // Get the day number and month abbreviation
  const dayNumber = moment(date).format('D');
  const month = moment(date).format('MMM');

  // Convert the date to a full Date object to use in onSelectDate
  const fullDate = moment(date).toDate();

  // Handle the button click, trigger only if not disabled
  const handleClick = () => {
    if (!disabled && onSelectDate) {
      onSelectDate(fullDate);
    }
  };

  return (
    <div className="date-container">
      <p className="day">{day}</p>
      <button
        className={`date-button ${active ? "active" : ""} ${highlighted ? "highlighted" : ""}`}
        onClick={handleClick}
        disabled={disabled} // Disable button if date is disabled
      >
        <span className="day-number">{dayNumber}</span>
        <span className="month">{month}</span>
      </button>
    </div>
  );
};

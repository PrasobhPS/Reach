import { useState, useEffect, useMemo } from 'react'
import moment, { Moment } from 'moment'
import { Date } from './Date'
import ScrollMenu from 'react-horizontal-scroll-menu'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendarAlt } from "@fortawesome/free-solid-svg-icons"
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './HorizontalCalender.scss'

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

interface CalenderProps {
  onSelectDate: (date: Date) => void;
  selected: Date | null;
}


export const HorizontalCalender = (props: CalenderProps) => {
  const { onSelectDate, selected } = props;
  const [dates, setDates] = useState<Moment[]>([]); // Specify the type explicitly
  const [enabled, setEnabled] = useState(false);
  //const [value, onChange] = useState<Value>(moment().toDate());
  const today = moment().startOf("day");
  const initialDate = selected ? moment(selected).startOf("day") : today;
  const [minDate, setMinDate] = useState(today);

  useEffect(() => {
    if (initialDate.isAfter(today.clone().add(5, 'days'))) {
      const minimumDate = initialDate.clone().subtract(2, 'days');
      setMinDate(minimumDate);
    } else {
      setMinDate(today);
    }
  }, [initialDate, today]);
  const [value, onChange] = useState<Value>(selected ? moment(selected).toDate() : moment().toDate());

  // get the dates from today to 10 days from now, format them as strings and store them in state
  const getDates = (startDate: Moment) => {
    const _dates: Moment[] = [];
    for (let i = 0; i < 6; i++) {
      // Generate 30 days from the start date
      const date = startDate.clone().add(i, "days");
      _dates.push(date);
    }
    setDates(_dates);
  };

  useEffect(() => {
    getDates(minDate);
  }, [minDate]);


  const dateComponents = useMemo(() => dates.map((date, index) => {
    const dateMilliseconds = date.startOf("day").valueOf();
    const selectedMilliseconds = initialDate.valueOf();
    // Compare the time values
    const activeDate = dateMilliseconds === selectedMilliseconds;
    const isDisabled = date.isBefore(today, "day");

    return (
      <Date
        key={index}
        date={date.toDate()}
        onSelectDate={!isDisabled ? onSelectDate : undefined} // Conditionally pass onSelectDate
        selected={selected}
        active={activeDate}
        disabled={isDisabled}
      />
    );
  }), [dates, initialDate]);

  const onSelect = (event: any) => {
  }

  // Function to handle date selection in the Calendar component
  const handleCalendarChange = (date: Value) => {
    setEnabled(!enabled)
    onChange(date);
    // If date is not an array, call onSelectDate with the selected date
    if (!Array.isArray(date)) {
      onSelectDate(date as Date);
    }
  };
  return (
    <div>
      <p className="select-date">Select Date</p>
      <div className="horizontal-calendar">
        <div className="horizontalMenuWrapper">
          {!enabled ? (
            <ScrollMenu
              data={dateComponents}
              selected={initialDate.toISOString()}
              onSelect={onSelect}
              wheel={false}
              alignCenter={false}
              scrollToSelected={true}
            />
          ) : (
            <div>
              <Calendar
                onChange={handleCalendarChange}
                value={value}
                minDate={today.toDate()}
              />
            </div>
          )}
        </div>
        <button onClick={() => setEnabled(!enabled)}>
          <FontAwesomeIcon icon={faCalendarAlt} />
        </button>
      </div>
    </div>
  ); // Ensure to return JSX content
}

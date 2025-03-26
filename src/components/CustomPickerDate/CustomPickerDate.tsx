import React, { useState } from 'react';

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const years = Array.from(new Array(100), (x, i) => new Date().getFullYear() - i);

export const MonthYearPicker = () => {
 const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedMonth(Number(e.target.value)); // Convert the string to a number
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedYear(Number(e.target.value)); // Convert the string to a number
  };

  return (
     <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <select
        value={selectedMonth}
        onChange={handleMonthChange}
        style={{ margin: '10px', fontSize: '1rem', width: '80%' }}
      >
        {months.map((month, index) => (
          <option key={index} value={index}>
            {month}
          </option>
        ))}
      </select>
      <select
        value={selectedYear}
        onChange={handleYearChange}
        style={{ margin: '10px', fontSize: '1rem', width: '80%' }}
      >
        {years.map(year => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>
    </div>
  );
};
export default MonthYearPicker;

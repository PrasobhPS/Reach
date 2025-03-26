import { Fragment, useCallback, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import Picker, { PickerValue } from 'react-mobile-picker';
import "./CustomPickerDate.scss";

function getDayArray(year: number, month: number) {
  const dayCount = new Date(year, month, 0).getDate();
  return Array.from({ length: dayCount }, (_, i) => String(i + 1).padStart(2, '0'));
}

// const monthNames = [
//   'January', 'February', 'March', 'April', 'May', 'June',
//   'July', 'August', 'September', 'October', 'November', 'December'
// ];
const monthNames = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));

interface FormValues {
  [key: string]: any;
}

export const MyPicker: React.FC<{
  initialValues?: string;
  name?: string;
  yearCurrent?: string;
  formValues: FormValues;
  startDate: Date | null | undefined;
  setValue: (name: string, value: any) => void;
}> = ({
  initialValues = "",
  name = "dob",
  yearCurrent = "no",
  formValues,
  startDate,
  setValue
}) => {
    let today = new Date();
    if (startDate) {
      today = startDate;
    }

    const currentYear = String(today.getFullYear());
    const currentMonth = monthNames[today.getMonth()];
    const currentDay = String(today.getDate()).padStart(2, '0');
    const [isOpen, setIsOpen] = useState(false);
    const [pickerValue, setPickerValue] = useState<PickerValue>({
      year: currentYear,
      month: currentMonth,
      day: currentDay,
    });


    const handlePickerChange = useCallback((newValue: PickerValue, key: string) => {
      if (key === 'day') {
        setPickerValue(newValue);
        return;
      }

      const { year, month } = newValue;
      const monthIndex = monthNames.indexOf(String(month));
      const newDayArray = getDayArray(Number(year), monthIndex + 1);
      const newDay = newDayArray.includes(String(newValue.day)) ? newValue.day : newDayArray[newDayArray.length - 1];
      setPickerValue({ ...newValue, day: newDay });
    }, []);

    const formatDate = (pickerValue: PickerValue) => {
      const year = pickerValue.year;
      const month = String(monthNames.indexOf(String(pickerValue.month)) + 1).padStart(2, '0');
      const day = pickerValue.day;
      return `${year}-${month}-${day}`;
    };

    const handleDoneClick = () => {
      const formattedDate = formatDate(pickerValue);
      setValue(name, formattedDate);  // Assuming setValue is used to update the form value
      setIsOpen(false);
    };
    return (
      <>
        <div className='customModalDate'>
          <div className='row'>
            <div className='form-input d-flex px-0'>
              <div className='Day col'>
                <label>Day</label>
                <input type="text" name={`dob.dobDay`} value={pickerValue.day} onClick={() => setIsOpen(true)} readOnly className='form-control' />
              </div>
              <div className='Month col'>
                <label>Month</label>
                <input type="text" name={`dob.dobMonth`} value={pickerValue.month} onChange={() => { }} onClick={() => setIsOpen(true)} className='form-control' />
              </div>
              <div className='Year col'>
                <label>Year</label>
                <input type="text" name={`dob.dobYear`} value={pickerValue.year} onChange={() => { }} onClick={() => setIsOpen(true)} className='form-control' />
              </div>
            </div>
          </div>
          <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={() => setIsOpen(false)}>
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="fixed inset-0 bg-black bg-opacity-25" />
              </Transition.Child>

              <div className="fixed inset-0 overflow-y-auto">
                <div className="flex min-h-full items-center justify-center p-0 text-center">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0 scale-95"
                    enterTo="opacity-100 scale-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100 scale-100"
                    leaveTo="opacity-0 scale-95"
                  >
                    <Dialog.Panel className="modal-picker w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                      <div className="mt-2 testdate">
                        <Picker
                          value={pickerValue}
                          onChange={handlePickerChange}
                          wheelMode="natural"
                        >
                          <Picker.Column name="day">
                            {getDayArray(Number(pickerValue.year), monthNames.indexOf(String(pickerValue.month)) + 1).map((day) => (
                              <Picker.Item key={day} value={day}>
                                {({ selected }) => (
                                  <div className={selected ? 'current-date font-semibold text-neutral-900' : 'text-neutral-400 date-over'}>{day}</div>
                                )}
                              </Picker.Item>
                            ))}
                          </Picker.Column>
                          <Picker.Column name="month">
                            {monthNames.map((month) => (
                              <Picker.Item key={month} value={month}>
                                {({ selected }) => (
                                  <div className={selected ? 'current-date font-semibold text-neutral-900' : 'text-neutral-400 date-over'}>{month}</div>
                                )}
                              </Picker.Item>
                            ))}
                          </Picker.Column>


                          <Picker.Column name="year">
                            {Array.from({ length: 200 }, (_, i) => `${1947 + i}`).map((year) => (
                              <Picker.Item key={year} value={year}>
                                {({ selected }) => (
                                  <div className={selected ? 'current-date font-semibold text-neutral-900' : 'text-neutral-400 date-over'}>{year}</div>
                                )}
                              </Picker.Item>
                            ))}
                          </Picker.Column>
                        </Picker>
                      </div>
                      <div className="mt-4 click-to-select">
                        <button
                          type="button"
                          className=" inline-flex click-to-proceed"
                          onClick={handleDoneClick}
                        >
                          Done
                        </button>
                      </div>
                    </Dialog.Panel>
                  </Transition.Child>
                </div>
              </div>
            </Dialog>
          </Transition>
        </div>
      </>
    );
  }

export default MyPicker;

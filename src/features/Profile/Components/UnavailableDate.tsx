import { SetStateAction, useEffect, useState } from "react";
import moment, { Moment } from 'moment';
import 'react-calendar/dist/Calendar.css';
import { Button } from "../../../components/Button/Button";
import { ScrollCalender } from "../../../components/Date/ScrollCalender";
import { faEdit, faPlus, faSave, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { useSaveUnavailableHoursMutation, useGetUnavailableHoursQuery, useDeleteUnavailableHoursMutation } from "../profileApiSlice";
import Calendar from "react-calendar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarAlt } from "@fortawesome/free-solid-svg-icons";
import "./Profile.scss";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../../../components/ReactDatePicker/customDatePicker.scss";
import Swal from "sweetalert2";

interface TimeBlock {
    startTime: string;
    endTime: string;
    availableTimes?: string[]; // Optional property
}

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

interface UnavailableTimeEntry {
    id: number;
    timeRange: string[];
}

interface UnavailableTimes {
    [date: string]: UnavailableTimeEntry[];
}

type TimeSlot = {
    startTime: string;
    endTime: string;
};

type EditDaySelection = {
    id: number;
    date: string | string[];
    times: string[];
};

export function UnavailableDate() {
    const today = moment().add(1, 'days').toDate();
    const [selectedDate, setSelectedDate] = useState<Date | null>(today); // Single date
    const [times, setTimes] = useState<string[]>([]);
    // const [unavailableTimes, setUnavailableTimes] = useState<Record<string, string[]>>({});
    const [timeBlocks, setTimeBlocks] = useState<TimeBlock[]>([{ startTime: "", endTime: "" }]);
    const [highlightDates, setHighlightDates] = useState<Date[]>([]);
    const [deleteId, setDeleteId] = useState<Record<string, number>>({});
    const [cleared, setCleared] = useState<boolean>(false);
    const [enabled, setEnabled] = useState(false);
    const [saveUnavailableHours] = useSaveUnavailableHoursMutation();
    const [deleteUnavailableHours] = useDeleteUnavailableHoursMutation();
    const { data: unavailableData, isLoading, isSuccess, refetch } = useGetUnavailableHoursQuery({});
    const [unavailableTimes, setUnavailableTimes] = useState<UnavailableTimes>({});
    const [selectedDates, setSelectedDates] = useState<Date[]>([]);
    const [editSelectedDates, setEditSelectedDates] = useState<Record<string, number | null>>({});
    const [dateError, setDateError] = useState<string>('');
    interface UnavailableDateTimes {
        [date: string]: {
            id: number;
            times: string[];
        };
    }


    const addUnavailableTime = (date: string, id: number, timeRange: string[]) => {
        setUnavailableTimes((prev) => {
            const existingEntries = prev[date] || [];
            return {
                ...prev,
                [date]: [...existingEntries, { id, timeRange }],
            };
        });
    };

    useEffect(() => {
        if (isSuccess && unavailableData) {
            const data = unavailableData as { dates: UnavailableDateTimes };

            const datesArray: SetStateAction<Date[]> = [];
            const initialUnavailableTimes: Record<string, string[]> = {};
            const getDeleteId: Record<string, number> = {};
            Object.entries(data.dates).forEach(([date, dateInfo]) => {
                initialUnavailableTimes[date] = dateInfo.times;
                getDeleteId[date] = dateInfo.id;
                datesArray.push(new Date(date));

                addUnavailableTime(date, dateInfo.id, dateInfo.times);

            });
            // setSelectedDates(datesArray);
            setDeleteId(getDeleteId);
            // setUnavailableTimes(initialUnavailableTimes);

            const unavailableDates = Object.keys(data.dates).map(date => moment(date).toDate());
            setHighlightDates(unavailableDates); // Set highlighted dates

            if (selectedDate) {
                const formattedDate = moment(selectedDate).format('YYYY-MM-DD');
                if (initialUnavailableTimes[formattedDate]) {
                    const blocks = initialUnavailableTimes[formattedDate].map((timeRange) => {
                        const [startTime, endTime] = timeRange.split('-');
                        return { startTime, endTime };
                    });
                    setTimeBlocks(blocks);
                }
            }
        }

    }, [unavailableData, isSuccess, selectedDate]);


    const getTimes = () => {
        const startTime = moment('00:00', 'HH:mm');
        const endTime = moment().endOf('day');
        const interval = 60;
        const _times: string[] = [];
        let currentTime = moment(startTime);

        while (currentTime.isBefore(endTime)) {
            _times.push(currentTime.format('HH:mm'));
            currentTime.add(interval, 'minutes');
        }

        setTimes(_times);
    };
    const handleAddTime = () => {
        const lastTimeBlock = timeBlocks[0];
        const lastEndTime = moment(lastTimeBlock.endTime, 'hh:mm A');

        const availableTimes = times.filter(time => {
            const timeMoment = moment(time, 'hh:mm A');
            return timeMoment.isAfter(lastEndTime);
        });
        setCleared(true);
        setTimeBlocks([{ startTime: "", endTime: "", availableTimes }, ...timeBlocks]);
    };

    const handleSaveTime = async () => {

        const updatedUnavailableTimes: Record<string, string[]> = {};
        if (selectedDates.length > 0) {
            setDateError('');
            const formattedSelectedDates = selectedDates.map(date =>
                moment(date).format('YYYY-MM-DD')
            );

            const selectedDatesSet = new Set(selectedDates.map(date => moment(date).format("YYYY-MM-DD")));
            const datesToDelete = Object.keys(editSelectedDates).filter(date => !selectedDatesSet.has(date));
            selectedDates.map((date, index) => (
                timeBlocks.forEach(({ startTime, endTime }) => {
                    if (startTime && endTime && date) {
                        const timeRange = `${startTime}-${endTime}`;
                        const formattedDate = moment(date).format('YYYY-MM-DD');
                        if (updatedUnavailableTimes[formattedDate]) {
                            updatedUnavailableTimes[formattedDate] = [
                                timeRange,
                                ...updatedUnavailableTimes[formattedDate],
                            ];
                        } else {
                            updatedUnavailableTimes[formattedDate] = [timeRange];
                        }
                    }
                })

            ))
            const formData = {
                dates: updatedUnavailableTimes,
                excluded_dates: datesToDelete,
            };
            const response = await saveUnavailableHours(formData);

            if ("error" in response) {
                console.error("Error logging in:", response.error);
            } else {
                Swal.fire({
                    title: "Saved!",
                    text: "The unavailable date and time saved successfully",
                    icon: "success",
                    timer: 3000,
                    showConfirmButton: false,
                    backdrop: `
            rgba(255, 255, 255, 0.5)
            left top
            no-repeat
            filter: blur(5px);
        `,
                    background: '#fff',
                });
                if (refetch) {
                    refetch();
                } else {
                    console.warn("Refetch is null, cannot refetch data.");
                }
            }

            setEnabled(!enabled);


            // Clear timeBlocks and reset after saving
            setUnavailableTimes({});
            setTimeBlocks([{ startTime: "", endTime: "" }]);
            setSelectedDates([]);
            refetch();
        } else {
            setDateError('Please select date');
        }
    };

    const handleTimeChange = (index: number, field: "startTime" | "endTime", value: string) => {
        const updatedTimeBlocks = [...timeBlocks];
        updatedTimeBlocks[index][field] = value;

        if (field === "startTime" && updatedTimeBlocks[index].endTime) {
            const selectedStartTime = moment(value, "HH:mm");
            const selectedEndTime = moment(updatedTimeBlocks[index].endTime, "HH:mm");

            if (!selectedEndTime.isAfter(selectedStartTime)) {
                updatedTimeBlocks[index].endTime = ""; // Reset endTime if invalid
            }
        }

        setTimeBlocks(updatedTimeBlocks);
        setDateError('');
    };

    const renderEndTimeOptions = (index: number) => {
        const selectedStartTime = moment(timeBlocks[index].startTime, "HH:mm");
        return times
            .filter((time) => {
                const timeMoment = moment(time, "HH:mm");
                return selectedStartTime.isValid() && timeMoment.isAfter(selectedStartTime);
            })
            .map((time) => (
                <option key={time} value={time}>
                    {time}
                </option>
            ));
    };

    const handleClearTime = () => {
        if (selectedDate) {
            const formattedDate = moment(selectedDate).format('YYYY-MM-DD');
            const updatedUnavailableTimes = { ...unavailableTimes };
            if (updatedUnavailableTimes[formattedDate]) {
                updatedUnavailableTimes[formattedDate] = [];
            }
            setCleared(true);
            setUnavailableTimes(updatedUnavailableTimes);
            setTimeBlocks([{ startTime: "", endTime: "" }]); // Reset time blocks
        }
        setDateError('');
    };

    const cancelEdit = () => {
        setTimeBlocks([{ startTime: "", endTime: "" }]);
        setSelectedDates([]);
    }

    useEffect(() => {
        getTimes();
    }, []);

    let lastTimeBlockValid = timeBlocks[0]?.startTime && timeBlocks[0]?.endTime;
    if (lastTimeBlockValid === '' && cleared) {
        lastTimeBlockValid = '1';
    }
    const onChange = (dates: Date[] | null) => {
        if (dates && dates.length > 0) {
            setSelectedDates(dates);
        } else {
            setSelectedDates([]);
        }
    };


    const listUnavailableTimes = (
        unavailableTimes: { [date: string]: { id: number; timeRange: string[] }[]; }
    ) => {
        if (Object.keys(unavailableTimes).length === 0) {
            return [];
        }

        const result: { ids: number[]; date: string; times: string[] }[] = [];
        const dates = Object.keys(unavailableTimes).sort();

        let rangeStart = dates[0];
        let rangeEnd = dates[0];
        let previousTimeRanges = unavailableTimes[rangeStart]?.[0]?.timeRange || [];
        let ids: number[] = [unavailableTimes[rangeStart]?.[0]?.id || 0];

        for (let i = 1; i < dates.length; i++) {
            const currentDate = dates[i];
            const currentEntry = unavailableTimes[currentDate]?.[0];
            const currentTimeRanges = currentEntry?.timeRange || [];
            const currentId = currentEntry?.id;

            const isConsecutiveDate = moment(currentDate).diff(moment(rangeEnd), "days") === 1;
            const isSameTimeRanges = JSON.stringify(currentTimeRanges) === JSON.stringify(previousTimeRanges);

            if (isConsecutiveDate && isSameTimeRanges) {
                rangeEnd = currentDate;
                if (currentId !== undefined) {
                    ids.push(currentId);
                }
            } else {
                rangeStart = moment(rangeStart).format('D/M/YYYY');
                rangeEnd = moment(rangeEnd).format('D/M/YYYY');
                result.push({
                    ids: ids,
                    date: rangeStart === rangeEnd ? rangeStart : `${rangeStart} to ${rangeEnd}`,
                    times: previousTimeRanges,
                });

                // Reset for the next range
                rangeStart = currentDate;
                rangeEnd = currentDate;
                previousTimeRanges = currentTimeRanges;
                ids = [currentId || 0];
            }
        }

        // Add the last range
        rangeStart = moment(rangeStart).format('D/M/YYYY');
        rangeEnd = moment(rangeEnd).format('D/M/YYYY');
        result.push({
            ids: ids,
            date: rangeStart === rangeEnd ? rangeStart : `${rangeStart} to ${rangeEnd}`,
            times: previousTimeRanges,
        });

        return result;
    };

    const unavailableRanges = listUnavailableTimes(unavailableTimes);

    const handleEdit = async (item: { ids: number[]; date: string; times: string[]; }) => {
        if (!item.date) {
            console.error("Date is undefined or invalid.");
            return;
        }

        const [startDate, endDate] = item.date.includes("to")
            ? item.date.split(" to ").map(date => date.trim())
            : [item.date, item.date];

        const trimmedStartDate = moment(startDate, "D/M/YYYY", true);
        const trimmedEndDate = moment(endDate, "D/M/YYYY", true);

        if (!trimmedStartDate.isValid() || !trimmedEndDate.isValid()) {
            console.error("Start date or end date is invalid.");
            return;
        }

        const dates: Date[] = [];
        let currentDate = moment(trimmedStartDate);

        while (currentDate.isSameOrBefore(trimmedEndDate)) {
            dates.push(currentDate.toDate());
            currentDate.add(1, "days");
        }

        setSelectedDates(dates);

        const editSelectedDates = dates.reduce((acc, date, index) => {
            const formattedDate = moment(date).format("YYYY-MM-DD");
            acc[formattedDate] = item.ids[index] || null;
            return acc;
        }, {} as Record<string, number | null>);

        setEditSelectedDates(editSelectedDates);

        const blocks: TimeBlock[] = (item.times || []).map(range => {
            if (!range.includes("-")) {
                console.error("Time range format is invalid.");
                return { startTime: "", endTime: "" };
            }

            const [startTime, endTime] = range.split("-");
            return {
                startTime: moment(startTime.trim(), "HH:mm", true).format("HH:mm"),
                endTime: moment(endTime.trim(), "HH:mm", true).format("HH:mm")
            };
        }).filter(block => block.startTime && block.endTime); // Filter out any empty blocks

        setTimeBlocks(blocks);
    };

    const handleDelete = async (item: { ids: number[]; date: string; times: string[]; }) => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'This action will permanently Delete the unavailable date and time.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, Delete it!',
            cancelButtonText: 'Cancel',
            backdrop: `
          rgba(255, 255, 255, 0.5)
          left top
          no-repeat
          filter: blur(5px);
        `,
            background: '#fff',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const formData = {
                        id: item.ids,
                    };
                    const response = await deleteUnavailableHours(formData);
                    if ("error" in response) {
                        console.error("Error logging in:", response.error);
                    } else {
                        Swal.fire({
                            title: "Deleted!",
                            text: "The unavailable date and time deleted successfully",
                            icon: "success",
                            timer: 3000,
                            showConfirmButton: false,
                            backdrop: `
                    rgba(255, 255, 255, 0.5)
                    left top
                    no-repeat
                    filter: blur(5px);
                  `,
                            background: '#fff',
                        });
                        if (refetch) {
                            refetch();
                        } else {
                            console.warn("Refetch is null, cannot refetch data.");
                        }
                    }
                } catch (error) {
                    console.error("Error archiving campaign:", error);
                }
            }
        });

        setUnavailableTimes({});
        setTimeBlocks([{ startTime: "", endTime: "" }]);
        setSelectedDates([]);
        refetch();
    }
    return (
        <div className="general-setting-text unavailableDate-text">
            <div className="mb-4">
                <h5 className="mb-4 d-block customHeading">Set Unavailable Dates</h5>
                <div className="horizontal-calendar">
                    <DatePicker
                        selectedDates={selectedDates}
                        selectsMultiple
                        onChange={onChange}
                        minDate={new Date(Date.now() + 24 * 60 * 60 * 1000)}
                        inline
                    />

                </div>

            </div>
            <div className="mb-4">
                {unavailableRanges.length > 0 && (
                    <div className="table-workingHours">
                        <table className="table">
                            <tbody>
                                {unavailableRanges.map((item, index) => (
                                    <tr key={index}>
                                        <td>
                                            {item.date}
                                        </td>
                                        <td className="text-center">
                                            {item.times.join(", ")}
                                        </td>
                                        <td>
                                            <div className="action-area">
                                                <Button
                                                    onClick={() => handleEdit(item)}
                                                    text=""
                                                    icon={true}
                                                    iconname={faEdit}
                                                    theme="light"
                                                    className="time-save-btn"
                                                />
                                                <Button
                                                    onClick={() => handleDelete(item)}
                                                    text=""
                                                    icon={true}
                                                    iconname={faTrashAlt}
                                                    theme="light"
                                                    className="time-save-btn"
                                                />
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
            <div className="time-block-parent">
                <div className="row">
                    <div className="col-md-8 col-12">
                        <div className="time-selection d-block">
                            {timeBlocks.map((timeBlock, index) => (
                                <div key={index} className="row w-100 d-flex">
                                    <div className="col-md-6 col-6">
                                        <div className="action-box">
                                            <select
                                                className="form-select"
                                                value={timeBlock.startTime}
                                                onChange={(e) => handleTimeChange(index, "startTime", e.target.value)}
                                            >
                                                <option value="">Select Time</option>
                                                {times.map((time) => (
                                                    <option key={time} value={time}>
                                                        {time}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-md-6 col-6">
                                        <div className="action-box">
                                            <select
                                                className="form-select"
                                                value={timeBlock.endTime}
                                                onChange={(e) => handleTimeChange(index, "endTime", e.target.value)}
                                            >
                                                <option value="">Select Time</option>
                                                {renderEndTimeOptions(index)}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="col-md-4 col-12">
                        <div className="d-flex time-save-btn-div">
                            {lastTimeBlockValid && (
                                <>
                                    <Button
                                        onClick={handleAddTime}
                                        text="Add"
                                        icon={true}
                                        iconname={faPlus}
                                        theme="dark"
                                        className="time-add-btn"
                                    />
                                    <Button
                                        onClick={handleClearTime}
                                        text="Clear all"
                                        icon={true}
                                        theme="dark"
                                        className="clear-btn"
                                    />
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <div className="time-selection">
                {dateError !== '' && (
                    <div style={{ color: "red" }}>* {dateError}</div>
                )}
                <div className="save-action time-save-btn-div contentEnd">
                    {lastTimeBlockValid && (
                        <Button
                            onClick={handleSaveTime}
                            text="Save"
                            icon={true}
                            theme="dark"
                            className=""
                        />
                    )}
                    {lastTimeBlockValid && (
                        <Button
                            onClick={cancelEdit}
                            text="Cancel"
                            icon={true}
                            theme="dark"
                            className="mx-2"
                        />
                    )}
                </div>
            </div>
        </div >
    );
}

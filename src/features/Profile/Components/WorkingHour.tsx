import { useState, useEffect } from "react";
import { Button } from "../../../components/Button/Button";
import moment from "moment";
import { useSaveWorkingHoursMutation, useGetWorkingHoursQuery, useUpdateWorkingHoursMutation, useDeleteWorkingHoursMutation } from "../profileApiSlice";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import Swal from "sweetalert2";
import { idText } from "typescript";
// Types
type TimeSlot = {
    startTime: string;
    endTime: string;
};

type DaySelection = {
    day: string;
    times: TimeSlot[];
};
type EditDaySelection = {
    id: number;
    day: string | string[];
    times: TimeSlot[];
};
type DisabledDays = {
    day: string[];
};
export function WorkingHour() {
    const daysOfWeek: string[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const [selectedDays, setSelectedDays] = useState<DaySelection[]>([]);
    const [showDays, setShowDays] = useState<EditDaySelection[]>([]);
    const [disabledDays, setDisabledDays] = useState<DisabledDays[]>([]);
    const [startTime, setStartTime] = useState<string>("");
    const [endTime, setEndTime] = useState<string>("");
    const [times, setTimes] = useState<string[]>([]);
    const [isEditing, setIsEditing] = useState<number | null>(null);

    const [saveWorkingHours] = useSaveWorkingHoursMutation();
    const [updateWorkingHours] = useUpdateWorkingHoursMutation();
    const [deleteWorkingHours] = useDeleteWorkingHoursMutation();
    const { data: workingHourData, isSuccess, isLoading, refetch } = useGetWorkingHoursQuery({});

    useEffect(() => {
        if (isSuccess && workingHourData && isEditing === null) {
            const existingData = workingHourData.working_hours;
            const parsedData: [] = existingData.flatMap((item: { time: { split: (arg0: string) => [any, any]; }[]; days: any[]; }) => {
                return {
                    day: item.days,
                }

            });
            const showParsedData = existingData.map((item: { id: number, time: { split: (arg0: string) => [any, any]; }[]; days: any; }) => {
                // Extract start and end times from the "time" string
                const [startTime, endTime] = item.time[0].split("-");

                // Return an object where "day" is an array of the days
                return {
                    id: item.id,
                    day: item.days, // Combine all days into an array
                    times: [{ startTime, endTime }] // Assuming you still need the times as well
                };
            });
            setShowDays(showParsedData);
            setDisabledDays(parsedData);
            //setSelectedDays(workingHourData);

        }
    }, [isSuccess, workingHourData, refetch, isEditing]);

    // Fetch available times (from 08:00 AM to end of the day with 60 min interval)
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
    // Handle day selection (toggle on/off)
    const handleDayClick = (day: string) => {
        if (!disabledDays.some(disabled => disabled.day.includes(day))) {
            if (!selectedDays.some(d => d.day === day)) {
                setSelectedDays([...selectedDays, { day, times: [] }]);
            } else {
                const updatedDays = selectedDays.filter(d => d.day !== day);
                setSelectedDays(updatedDays);
            }
        }
    };

    // Handle time saving (associate time slots with selected days)
    const handleSaveTime = async () => {
        const updatedDays = selectedDays.map(day => {
            if (day.times.length === 0) {
                return { ...day, times: [{ startTime, endTime }] };
            }
            return day;
        });
        setSelectedDays(updatedDays);

        // Clear time selection for next
        setStartTime("");
        setEndTime("");

        const workingHours = updatedDays.reduce((acc: any[], current) => {
            const time = `${current.times[0].startTime}-${current.times[0].endTime}`;
            const existing = acc.find(item => item.time[0] === time);

            if (existing) {
                existing.days.push(current.day);
            } else {
                acc.push({
                    days: [current.day],
                    time: [time],
                });
            }
            return acc;
        }, []);

        if (isEditing) {

            const data = {
                id: isEditing,
                working_hours: workingHours,
            };
            await updateWorkingHours(data).unwrap().then(response => console.log(response, 'Update SUCCESS')).catch(error => console.log(error, 'Error Response'));
        } else {
            const data = {
                working_hours: workingHours,
            };
            await saveWorkingHours(data).unwrap().then(response => console.log(response, 'SUCCESS RESPONSE')).catch(error => console.log(error, 'ERROR RESPONSE'));
        }

        refetch();
        setSelectedDays([]);
        setIsEditing(null);
    };

    useEffect(() => {
        getTimes();
        refetch();
    }, []);

    const handleRemoveDays = (disabledDays: { day: string[] }[], editDays: string[]) => {
        const updatedDisabledDays = disabledDays.map((item) => ({
            day: item.day.filter((day) => !editDays.includes(day))
        }));

        const filteredDisabledDays = updatedDisabledDays.filter((item) => item.day.length > 0);

        return filteredDisabledDays;
    };

    const handleEdit = async (item: EditDaySelection) => {
        let editDays = item.day;
        let times = item.times;
        setStartTime(times[0].startTime);
        setEndTime(times[0].endTime);
        if (typeof editDays === 'string') {
            editDays = editDays.split(',');
        }

        const updatedDays = editDays.map((day: string) => ({
            day,
            times: []
        }));
        setSelectedDays(updatedDays);

        // Remove the selected item from the showDays list
        const updatedShowDays = showDays.filter(showDay => showDay.id !== item.id);
        setShowDays(updatedShowDays);

        const result = handleRemoveDays(disabledDays, editDays);
        setDisabledDays(result);

        setIsEditing(item.id);
    };

    const handleDelete = async (id: number) => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'This action will permanently Delete the day and working hours.',
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
                    const data = {
                        id: id,
                    };
                    const response = await deleteWorkingHours(data);
                    if ("error" in response) {
                        console.error("Error logging in:", response.error);
                    } else {
                        Swal.fire({
                            title: "Deleted!",
                            text: "The day and working hours deleted successfully",
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
    }
    return (
        <div className="general-setting-text">
            <div className="mb-4">
                <h5 className="mb-4 d-block customHeading">Set Working Hours</h5>
                {daysOfWeek.map((day) => (
                    <div
                        className={`weeklyDiv ${selectedDays.some(d => d.day === day) ? 'active' : ""} ${disabledDays.some(disabled => disabled.day.includes(day)) ? 'disabled' : ""}`}
                        key={day}
                        onClick={() => handleDayClick(day)}
                    >
                        <span>{day}</span>
                    </div>
                ))}
            </div>
            {selectedDays.length > 0 && (
                <div className="time-selection d-flex">
                    <div className="row w-100">
                        <div className="col-md-4 col-12">
                            <div className="action-box">
                                <label>Start Time:</label>
                                <select
                                    className="form-select"
                                    value={startTime}
                                    onChange={(e) => {
                                        setStartTime(e.target.value);
                                        setEndTime("");
                                    }}
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
                        <div className="col-md-4 col-12">
                            <div className="action-box">
                                <label>End Time:</label>
                                <select
                                    className="form-select"
                                    value={endTime}
                                    onChange={(e) => setEndTime(e.target.value)}
                                    disabled={!startTime}
                                >
                                    <option value="">Select Time</option>
                                    {times
                                        .filter((time) => startTime && moment(time, "HH:mm").isAfter(moment(startTime, "HH:mm")))
                                        .map((time) => (
                                            <option key={time} value={time}>
                                                {time}
                                            </option>
                                        ))}
                                </select>
                            </div>
                        </div>
                        <div className="col-md-4 col-12 px-2">
                            <div className="d-flex time-save-btn-div">
                                {startTime && endTime && (
                                    <Button
                                        onClick={handleSaveTime}
                                        text="Save"
                                        icon={true}
                                        theme="dark"
                                        className="working-hours"
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </div>

            )}
            <div className="row">
                <div className="col-md-12 col-sm-12 px-0">
                    <div className="time-selection time-selection-block d-block mb-10">
                        <div className="working-hours-row row mx-0">
                            <div className="col-md-12 col-12">
                                <div className="table-workingHours">
                                    <table className="table">
                                        <tbody>
                                            {showDays.map((item, index) => (
                                                <tr key={index}>
                                                    <td>
                                                        {(Array.isArray(item.day) ? item.day.join(", ") : item.day)}
                                                    </td>
                                                    <td className="text-center">
                                                        {item.times[0].startTime} - {item.times[0].endTime}
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
                                                                disabled={isEditing !== null && isEditing !== item.id}
                                                            />
                                                            <Button
                                                                onClick={() => handleDelete(item.id)}
                                                                text=""
                                                                icon={true}
                                                                iconname={faTrashAlt}
                                                                theme="light"
                                                                className="time-save-btn"
                                                                disabled={isEditing !== null}
                                                            />
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


        </div>
    );
}

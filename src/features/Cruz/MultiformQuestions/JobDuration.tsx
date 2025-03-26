import { useEffect, useState } from "react";
import { useGetJobDurationQuery } from "../Api/CruzApiSlice";

export const JobDuration = () => {
    const { data, error, isLoading, isSuccess } = useGetJobDurationQuery({});
    const [jobDuration, setJobDuration] = useState<string[]>([]);

    useEffect(() => {
        if (data && isSuccess) {
            setJobDuration(data.data);
        }
    }, [data, isSuccess]);

    return { jobDuration };
};
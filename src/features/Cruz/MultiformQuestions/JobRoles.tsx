import { useEffect, useState } from 'react';
import { useGetJobRoleQuery } from '../Api/CruzApiSlice';

export const JobRoles = () => {
    const { data, error, isLoading, isSuccess } = useGetJobRoleQuery({});
    const [jobRoles, setJobRoles] = useState<string[]>([]);

    useEffect(() => {
        if (isSuccess && data) {
            setJobRoles(data.data);
        }
    }, [data, isSuccess]);

    return { jobRoles, error, isLoading };
};

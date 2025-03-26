import { useEffect, useState } from "react";
import { useGetBoatTypeQuery } from "../Api/CruzApiSlice";

export const BoatTypes = () => {
    const { data, error, isLoading, isSuccess } = useGetBoatTypeQuery({});
    const [boatType, setBoatType] = useState<string[]>([]);

    useEffect(() => {
        if (data && isSuccess) {
            setBoatType(data.data);
        }
    }, [data, isSuccess]);

    return { boatType, error, isLoading };
};
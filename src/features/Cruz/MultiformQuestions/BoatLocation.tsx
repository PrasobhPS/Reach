import { useEffect, useState } from "react";
import { useGetBoatLocationQuery } from "../Api/CruzApiSlice";

export const BoatLocation = () => {
    const { data, error, isLoading, isSuccess } = useGetBoatLocationQuery({});
    const [boatLocation, setBoatLocation] = useState<string[]>([]);

    useEffect(() => {
        if (data && isSuccess) {
            setBoatLocation(data.data);
        }
    }, [data, isSuccess]);

    return { boatLocation };
};
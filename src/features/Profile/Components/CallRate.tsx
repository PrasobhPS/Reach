import { Button } from "../../../components/Button/Button";
import CustomInput from "../../../components/CustomInput/CustomInput";
import { FormProvider, useForm } from "react-hook-form";
import { useSaveCallRateMutation, useGetCallRateQuery } from "../profileApiSlice";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

interface CallRateData {
    rate: {
        extra_GBP: number;
        half_GBP: number;
        one_GBP: number;
        extra_EUR: number;
        half_EUR: number;
        one_EUR: number;
        extra_USD: number;
        half_USD: number;
        one_USD: number;
    };
}

export function CallRates() {
    const [callRateData, setCallRateData] = useState<CallRateData | null>(null);
    const { data, isLoading, isSuccess } = useGetCallRateQuery({});

    // useForm initialization
    const form = useForm<CallRateData>({
        defaultValues: {
            rate: { extra_GBP: 0, half_GBP: 0, one_GBP: 0, extra_EUR: 0, half_EUR: 0, one_EUR: 0, extra_USD: 0, half_USD: 0, one_USD: 0 }
        }
    });

    const { handleSubmit, getValues, reset } = form;
    const [saveRate] = useSaveCallRateMutation();

    // Update form values when the data is fetched successfully
    useEffect(() => {
        if (isSuccess && data) {
            setCallRateData(data);
            reset(data); // Reset the form values with the fetched data
        }
    }, [isSuccess, data, reset]);

    const onSubmit = async () => {
        // Retrieve form values
        const formValues = getValues();

        const userData = await saveRate(formValues);

        Swal.fire({
            title: "Rate Updated!",
            text: "You have updated the Call Rates.",
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
        // Call your API with the data
    };

    return (
        <div className="general-setting-text">
            <div className="mb-2">
                <h5 className="mb-3  d-block customHeading ">Set Call Rates</h5>
            </div>
            <div className="form-content">
                <FormProvider {...form}>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="half-hourRate">
                            <div className="row">
                                <div className="label-heading">
                                    <label className="w-100 d-flex justify-content-start">Half hour Rate</label>
                                </div>
                                <div className="col-md-4 col-4">
                                    <div className="input-box d-flex align-items-start">
                                        <div className="Symbol mt-10">
                                            <span>£</span>
                                        </div>
                                        <div className="input-content">
                                            <CustomInput
                                                name="rate.half_GBP"
                                                placeholder=""
                                                type="number"
                                                registerConfig={{
                                                    required: { value: true, message: "Half hour rate is required" },
                                                }}
                                                className="input-block"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-4 col-4">
                                    <div className="input-box d-flex align-items-start">
                                        <div className="Symbol mt-10">
                                            <span>€</span>
                                        </div>
                                        <CustomInput
                                            name="rate.half_EUR"
                                            placeholder=""
                                            type="number"
                                            registerConfig={{
                                                required: { value: true, message: "Half hour rate is required" },
                                            }}
                                            className="input-block"
                                        />
                                    </div>
                                </div>
                                <div className="col-md-4 col-4">
                                    <div className="input-box d-flex align-items-start">
                                        <div className="Symbol mt-10">
                                            <span>$</span>
                                        </div>
                                        <CustomInput
                                            name="rate.half_USD"
                                            placeholder=""
                                            type="number"
                                            registerConfig={{
                                                required: { value: true, message: "Half hour rate is required" },
                                            }}
                                            className="input-block"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="input-box">
                                <div className="row">
                                    <div className="label-heading">
                                        <label className="w-100 d-flex justify-content-start">One Hour Call Rate</label>
                                    </div>
                                    <div className="col-md-4 col-4">
                                        <div className="input-box d-flex align-items-start">
                                            <div className="Symbol mt-10">
                                                <span>£</span>
                                            </div>
                                            <div className="input-content">
                                                <CustomInput
                                                    name="rate.one_GBP"
                                                    placeholder=""
                                                    type="number"
                                                    registerConfig={{
                                                        required: { value: true, message: "One hour rate is required" },
                                                    }}
                                                    className="input-block"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-4 col-4">
                                        <div className="input-box d-flex align-items-start">
                                            <div className="Symbol mt-10">
                                                <span>€</span>
                                            </div>
                                            <div className="input-content">
                                                <CustomInput
                                                    name="rate.one_EUR"
                                                    placeholder=""
                                                    type="number"
                                                    registerConfig={{
                                                        required: { value: true, message: "One hour rate is required" },
                                                    }}
                                                    className="input-block"
                                                />
                                            </div>
                                        </div>

                                    </div>
                                    <div className="col-md-4 col-4">
                                        <div className="input-box d-flex align-items-start">
                                            <div className="Symbol mt-10">
                                                <span>$</span>
                                            </div>
                                            <div className="input-content">
                                                <CustomInput
                                                    name="rate.one_USD"
                                                    placeholder=""
                                                    type="number"
                                                    registerConfig={{
                                                        required: { value: true, message: "One hour rate is required" },
                                                    }}
                                                    className="input-block"
                                                />
                                            </div>
                                        </div>

                                    </div>
                                </div>

                            </div>
                            <div className="input-box">
                                <div className="row">
                                    <div className="label-heading">
                                        <label className="d-flex justify-content-start w-100">Extra Time Call Rate</label>
                                    </div>
                                    <div className="col-md-4 col-4">
                                        <div className="input-box d-flex align-items-start">
                                            <div className="Symbol mt-10">
                                                <span>£</span>
                                            </div>
                                            <CustomInput
                                                name="rate.extra_GBP"
                                                placeholder=""
                                                type="number"
                                                registerConfig={{
                                                    required: { value: true, message: "Extra time rate is required" },
                                                }}
                                                className="input-block"
                                            />
                                        </div>

                                    </div>
                                    <div className="col-md-4 col-4">
                                        <div className="input-box d-flex align-items-start">
                                            <div className="Symbol mt-10">
                                                <span>€</span>
                                            </div>
                                            <CustomInput
                                                name="rate.extra_EUR"
                                                placeholder=""
                                                type="number"
                                                registerConfig={{
                                                    required: { value: true, message: "Extra time rate is required" },
                                                }}
                                                className="input-block"
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-4 col-4">
                                        <div className="input-box d-flex align-items-start">
                                            <div className="Symbol mt-10">
                                                <span>$</span>
                                            </div>
                                            <CustomInput
                                                name="rate.extra_USD"
                                                placeholder=""
                                                type="number"
                                                registerConfig={{
                                                    required: { value: true, message: "Extra time rate is required" },
                                                }}
                                                className="input-block"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </FormProvider>
            </div>
            <div className="save-action p-0">
                <Button
                    onClick={handleSubmit(onSubmit)}
                    text="Save"
                    icon={true}
                    theme="dark"
                    className="call-rate"
                />
            </div>
        </div>
    );
}

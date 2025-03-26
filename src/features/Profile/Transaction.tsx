import React, { useEffect, useState, ChangeEvent } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { Button } from "../../components/Button/Button";
import './Transaction.scss';
import { CDBCard, CDBCardBody, CDBDataTable, CDBContainer, CDBRow, CDBCol } from 'cdbreact';
import { useCreateStripeAccountMutation, useGetTransactionQuery, useRedeemAmountMutation } from "./profileApiSlice";
import { getUserData } from "../../utils/Utils";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import DataTable from 'react-data-table-component';

interface TransactionData {
    members_id: number;
    amount_paid: string;
    members_email: string;
    members_fname: string;
    members_lname: string;
    payment_type: string;
    transaction_type: string;
    payment_date: string;
    status: string;
    from_currency: string;
    to_currency: string;
    stripe_url: string;
    stripe_varify: boolean;
    withdraw: string;
    description: string;
    transaction_id: string;
    original_amount: string;
    actual_amount: string;
    reduced_amount: string;
    converted_original_amount: string;
    converted_reduced_amount: string;
    converted_actual_amount: string;
    connected_member: connected_member;
    member: connected_member;
    type: string;
    rate: string;
    connected_member_id: number | null;
}

interface connected_member {
    id: number;
    members_fname: string;
    members_lname: string;
}

interface CurrencyAmounts {
    [key: string]: number;
}

interface CreateStripeResponse {
    success: boolean;
    account_link: string;
    message: string;
}

interface convertedAmount {
    currency: string;
    amount: GLfloat;
    rate: string;
    converted_amount: GLfloat;
}

export const Transaction = () => {
    const [totalRewards, setTotalRewards] = useState<number>(0);
    const [availableRewards, setAvailableRewards] = useState<number>(0);
    const [transactionDetails, setTransactionDetails] = useState<TransactionData[]>([]);
    const [stripeVarify, setStripeVarify] = useState<boolean>(false);
    const { data: transactionData, isLoading, isSuccess, refetch } = useGetTransactionQuery({});
    const [totalEarned, setTotalEarned] = useState<GLfloat>(0);
    const [escrowBalance, setEscrowBalance] = useState<GLfloat>(0);
    const [redeemAmount, setRedeemAmount] = useState<GLfloat>(0);
    const [stripeUrl, setStripeUrl] = useState('');
    const [convertedAmount, setConvertedAmount] = useState<convertedAmount[]>([]);
    const [loading, setLoading] = useState(false);
    const [expandedRows, setExpandedRows] = useState<string[]>([]);
    const [currentPage, setCurrentPage] = useState(1); // Track current page

    const [createStripe] = useCreateStripeAccountMutation({});

    const userData = getUserData("userData");
    const navigate = useNavigate();
    const currencySymbols: { [key: string]: string } = {
        USD: "$",
        EUR: "€",
        GBP: "£",
    };
    let token = "";
    let memberType = "";
    let currencySymbol = "GBP";
    try {
        if (userData !== null) {
            token = userData.Token;
            memberType = userData.Member_type;
            currencySymbol = userData.currency ? userData.currency : "GBP";
        } else {
            console.error("User data not found in local storage");
        }
    } catch (error) {
        console.error("Error parsing user data:", error);
    }

    useEffect(() => {
        refetch();
    }, []);

    useEffect(() => {
        if (isSuccess && transactionData) {
            setTransactionDetails(transactionData.data);
            setEscrowBalance(transactionData.escrow_balance);
            setRedeemAmount(transactionData.redeem_amount);
            setTotalEarned(transactionData.total_earned);
            setTotalRewards(transactionData.total_rewards);
            setAvailableRewards(transactionData.available_rewards);
            if (transactionData.converted_amount) {
                setConvertedAmount(transactionData.converted_amount);
            }
            setStripeVarify(transactionData.stripe_verified);
            setStripeUrl(transactionData.stripe_url);
        }
    }, [isSuccess, transactionData]);

    const formatDate = (dateString: string): string => {
        if (!dateString) {
            return 'N/A';
        }
        const [year, month, day] = dateString.split('-');
        return `${day}-${month}-${year}`;
    };

    const toggleRowExpansion = (transactionId: string) => {
        setExpandedRows((prev) =>
            prev.includes(transactionId)
                ? prev.filter((id) => id !== transactionId)
                : [...prev, transactionId]
        );
    };

    const data = () => {
        const rows = transactionDetails.flatMap((item: TransactionData) => {
            const isExpanded = expandedRows.includes(item.transaction_id);
            let classToShow = 'status-pending';
            let addSymbol = '+';
            if (item.transaction_type === "Debit") {
                classToShow = 'status-completed';
                addSymbol = '-';
                if (item.status === 'Withdraw') {
                    classToShow = 'status-pending';
                    addSymbol = '+';
                }
            }
            return [
                {
                    name: item.payment_date || "N/A",
                    transaction: item.transaction_id,
                    description: item.type,
                    amount: (
                        <span
                            className={classToShow}
                        >
                            {addSymbol}{currencySymbols[currencySymbol]}{item.converted_actual_amount
                                ? parseFloat(item.converted_actual_amount).toFixed(2)
                                : "0.00"}
                        </span>
                    ),
                    expand: (
                        <button
                            className="btn btn-light btn-sm"
                            onClick={() => toggleRowExpansion(item.transaction_id)}
                        >
                            {isExpanded ? <i className="fas fa-chevron-up"></i> : <i className="fas fa-chevron-down"></i>}
                        </button>
                    ),
                },

                ...(isExpanded
                    ? [
                        {
                            name: "",
                            transaction: "",
                            description: (

                                <div>
                                    {
                                        item.status === 'Completed' && item.type === 'Withdraw' ? (
                                            <>
                                                <p>
                                                    Withdrawal of available to redeem amount :

                                                </p>

                                            </>
                                        ) : ''
                                    }

                                    {
                                        item.status === 'Completed' && item.type === 'Book A Call' ? (
                                            <>
                                                <p>
                                                    Paid to {item.connected_member.members_fname} {item.connected_member.members_lname} for expert call :

                                                </p>

                                            </>
                                        ) : ''
                                    }
                                    {
                                        item.status === 'Withdraw' && item.type === 'Book A Call' ? (
                                            <>
                                                <p>
                                                    Paid by {item.connected_member.members_fname} {item.connected_member.members_lname} for expert call :
                                                    <span className="status-pending">
                                                        {'+'}{currencySymbols[item.from_currency]}{parseFloat(item.original_amount).toFixed(2)}
                                                    </span>
                                                </p>
                                                <p>
                                                    Fee for boat :
                                                    <span className="status-completed">
                                                        {'-'}{currencySymbols[item.from_currency]}{parseFloat(item.reduced_amount).toFixed(2)}
                                                    </span>
                                                </p>
                                                <p>
                                                    Exchange Rate ($)
                                                </p>
                                                <p>
                                                    Withdrawal request :
                                                    <span className="status-completed">
                                                        {'-'}{currencySymbols[item.from_currency]}{parseFloat(item.actual_amount).toFixed(2)}
                                                    </span>
                                                </p>
                                            </>
                                        ) : ''
                                    }


                                    {
                                        item.type === 'Refunded' ? (
                                            <>
                                                <p>
                                                    Paid to {item.connected_member.members_fname} {item.connected_member.members_lname} for expert call :
                                                    <span className="status-completed">
                                                        {'-'}{currencySymbols[item.from_currency]}{parseFloat(item.original_amount).toFixed(2)}
                                                    </span>
                                                </p>
                                                <p>
                                                    Fee for boat :
                                                    <span className="status-pending">
                                                        {'+'}{currencySymbols[item.from_currency]}{parseFloat(item.reduced_amount).toFixed(2)}
                                                    </span>
                                                </p>
                                                <p>
                                                    Refund request :
                                                    <span className="status-pending">
                                                        {'+'}{currencySymbols[item.from_currency]}{parseFloat(item.actual_amount).toFixed(2)}
                                                    </span>
                                                </p>
                                            </>
                                        ) : ''
                                    }

                                    {
                                        item.type === 'Referral' ? (
                                            <>
                                                <p>
                                                    Referred {item.connected_member.members_fname} {item.connected_member.members_lname} :
                                                    <span className="status-pending">{'('}{'+'}{currencySymbols[item.from_currency]}{parseFloat(item.actual_amount).toFixed(2)}{')'}</span>
                                                </p>
                                                <p> Exchange Rate :</p>
                                            </>
                                        ) : ""}
                                    {item.type === 'Membership' ? (
                                        <>
                                            <p> Membership Fee:</p>
                                            <p> Referral Discount {item.connected_member_id ? `(Referred By -  ${item.connected_member.members_fname} ${item.connected_member.members_lname})` : ''}:</p>
                                            <p> Amount Paid:</p>
                                        </>
                                    ) : ""}
                                </div >

                            ),
                            amount: (
                                <div>
                                    {
                                        item.status === 'Completed' && item.type === 'Withdraw' ? (
                                            <>
                                                <p className="status-completed">{'-'}{currencySymbols[currencySymbol]}{parseFloat(item.converted_original_amount).toFixed(2)}</p>
                                            </>
                                        ) : ''
                                    }
                                    {
                                        item.status === 'Completed' && item.type === 'Book A Call' ? (
                                            <p className="status-completed">{'-'}{currencySymbols[currencySymbol]}{parseFloat(item.converted_original_amount).toFixed(2)}</p>
                                        ) : ''
                                    }

                                    {
                                        item.status === 'Withdraw' && item.type === 'Book A Call' ? (
                                            <>
                                                <p className="status-pending">{'+'}{currencySymbols[currencySymbol]}{parseFloat(item.converted_original_amount).toFixed(2)}</p>
                                                <p className="status-completed">{'-'}{currencySymbols[currencySymbol]}{parseFloat(item.converted_reduced_amount).toFixed(2)}</p>
                                                <p className="status-pending">{currencySymbols[currencySymbol]}{parseFloat(item.rate).toFixed(2)}</p>
                                                <p className="status-completed">{'-'}{currencySymbols[currencySymbol]}{parseFloat(item.converted_actual_amount).toFixed(2)}</p>
                                            </>
                                        ) : ""}
                                    {
                                        item.type === 'Refunded' ? (
                                            <>
                                                <p className="status-completed">{'-'}{currencySymbols[currencySymbol]}{parseFloat(item.converted_original_amount).toFixed(2)}</p>
                                                <p className="status-pending">{'+'}{currencySymbols[currencySymbol]}{parseFloat(item.converted_reduced_amount).toFixed(2)}</p>
                                                <p className="status-pending">{'+'}{currencySymbols[currencySymbol]}{parseFloat(item.converted_actual_amount).toFixed(2)}</p>
                                            </>
                                        ) : ""}
                                    {item.type === 'Referral' ? (
                                        <>
                                            <p className="status-pending">{'+'}{currencySymbols[currencySymbol]}{parseFloat(item.converted_original_amount).toFixed(2)}</p>
                                            <p className="status-completed">{'-'}{currencySymbols[currencySymbol]}{parseFloat(item.converted_reduced_amount).toFixed(2)}</p>
                                            <p className="status-completed">{currencySymbols[currencySymbol]}{parseFloat(item.rate).toFixed(2)}</p>
                                            <p className="status-completed">{'-'}{currencySymbols[currencySymbol]}{parseFloat(item.converted_actual_amount).toFixed(2)}</p>
                                        </>
                                    ) : ""}
                                    {item.type === 'Membership' ? (
                                        <>
                                            <p className="status-completed">{'-'}{currencySymbols[currencySymbol]}{parseFloat(item.converted_original_amount).toFixed(2)}</p>
                                            <p className="status-pending">{'+'}{currencySymbols[currencySymbol]}{parseFloat(item.converted_reduced_amount).toFixed(2)}</p>
                                            <p className="status-completed">{'-'}{currencySymbols[currencySymbol]}{parseFloat(item.converted_actual_amount).toFixed(2)}</p>
                                        </>
                                    ) : ""}
                                </div>
                            ),
                            expand: "",
                        },
                    ]
                    : []),
            ];
        });

        return {
            columns: [
                { name: "Date", selector: (row: { name: any; }) => row.name, width: "150px", sortable: false },
                { name: "Transaction", selector: (row: { transaction: any; }) => row.transaction, width: "150px", sortable: false },
                { name: "Description", selector: (row: { description: any; }) => row.description, width: "300px", sortable: false },
                { name: "Amount", selector: (row: { amount: any; }) => row.amount, width: "150px", sortable: false },
                { name: "", selector: (row: { expand: any; }) => row.expand, width: "50px", sortable: false },
            ],
            rows,
        };
    };

    const handleFilter = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const filterVal = event.target.value;
        const filterdData = transactionData.data.filter((item: { type: string; }, index: any) => (
            item.type?.toLowerCase() === filterVal.toLowerCase()
        ));
        if (filterVal === 'All') {
            setTransactionDetails(transactionData.data);
        } else {
            setTransactionDetails(filterdData);
        }
    };

    const handleSearchChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        const searchQuery = event.target.value as string;
        if (searchQuery !== '') {
            const filterdData = transactionData.data.filter(
                (item: { members_fname: string }) =>
                    item.members_fname.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setTransactionDetails(filterdData);
        } else {
            setTransactionDetails(transactionData.data);
        }
    };

    const handleSubmit = async () => {
        if (!stripeVarify && stripeUrl !== '') {
            //console.log('test-----');
        } else {
            setLoading(true);
            try {
                const response: CreateStripeResponse = await createStripe({}).unwrap();
                if (response.success && response.account_link) {
                    setLoading(false);
                    window.location.replace(response.account_link);
                } else {
                    console.error("Failed to create Stripe account:", response.message);
                }
            } catch (error) {
                console.error("Error fetching available jobs:", error);
            } finally {
                setLoading(false);
            }
        }
    };

    const [withdrawAmount] = useRedeemAmountMutation();
    const handleRedeem = async () => {
        if (redeemAmount > 25) {
            setLoading(true);
            try {
                let formData = {
                    withdraw_amount: redeemAmount,
                    currency: currencySymbol
                };
                const response = await withdrawAmount(formData).unwrap();
                if (response.status) {
                    Swal.fire({
                        title: "Withdraw Success",
                        text: "The amount has been withdrawn to your account",
                        icon: "success",
                        showConfirmButton: true,
                        backdrop: `
                            rgba(255, 255, 255, 0.5)
                            left top
                            no-repeat
                            filter: blur(5px);
                        `,
                        background: '#fff',
                    });
                    refetch();
                }
            } catch (error) {
                console.error("Error fetching available jobs:", error);
            } finally {
                setLoading(false);
            }
        } else {
            Swal.fire({
                title: "",
                text: "You need a minimum amount of 25 to redeem",
                icon: "warning",
                showConfirmButton: true,
                backdrop: `
                    rgba(255, 255, 255, 0.5)
                    left top
                    no-repeat
                    filter: blur(5px);
                `,
                background: '#fff',
            });
        }
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page); // Update current page
    };

    return (
        <div className="transaction-contents">
            {loading ? (
                <div className="page-loader">
                    <div className="page-innerLoader">
                        <div className="spinner-border" role="status">
                            <img src={require("../../assets/images/cruz/Frame.png")} alt="" className="img-fluid" />
                        </div>
                    </div>
                </div>
            ) : (
                <div className="container">
                    <div className="Transaction-details">
                        <div className="redeemcard">
                            <div className="card-content">
                                <div className="card-content-head">
                                    <div className="heading">
                                        <div className="content-head">
                                            <label className="title">Escrow Balance</label>
                                            <h3 className="customHeading text-start">{currencySymbols[currencySymbol]}{escrowBalance}</h3>
                                        </div>
                                        <div className="content-head AvailabletoRedeem">
                                            <label className="title">Available to Redeem</label>
                                            <h3 className="customHeading text-start">{currencySymbols[currencySymbol]}{redeemAmount}</h3>
                                        </div>
                                    </div>
                                </div>
                                <div className="card-content-head total-earned">
                                    <div className="heading">
                                        <div className="content-head">
                                            <label className="title">Total Earned</label>
                                            <h3 className="customHeading text-start">{currencySymbols[currencySymbol]}{totalEarned}</h3>
                                        </div>
                                    </div>
                                </div>
                                <div className="redeem-option">
                                    {stripeVarify ? (
                                        <Button
                                            onClick={() => handleRedeem()}
                                            text="Redeem Reward"
                                            icon={true}
                                            theme="light"
                                            className="w-100"
                                        />
                                    ) : (!stripeVarify && stripeUrl !== '') ? (
                                        <Button
                                            onClick={() => handleSubmit()}
                                            text="Connect Stripe Account"
                                            icon={true}
                                            theme="light"
                                            className="w-100"
                                        />
                                    ) : (
                                        <Button
                                            onClick={() => handleSubmit()}
                                            text="Connect Stripe Account"
                                            icon={true}
                                            theme="light"
                                            className="w-100"
                                        />
                                    )}
                                </div>
                                {convertedAmount.length > 0 && (
                                    <div className="RedemptionRequirement">
                                        <h2 className="customHeading">Your Earnings</h2>
                                        <ul className="px-4 px-sm-0">
                                            {convertedAmount.map((item, index) => (
                                                <div style={{ display: "flex", justifyContent: "space-between", color: "white" }}>
                                                    <div className="col-4 p-1 currency-item">{currencySymbols[item.currency]}{item.amount}</div>
                                                    <div className="col-4 text-center currency-rate">{item.rate}</div>
                                                    <div className="col-4 text-end currencySymbol">{currencySymbols[currencySymbol]}{item.converted_amount}</div>
                                                </div>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                                <div className="divider"></div>
                                <div className="RedemptionRequirement">
                                    <h2 className="customHeading">Withdrawal Requirement</h2>
                                    <p>A minimum of {currencySymbols[currencySymbol]}25 is required to withdraw your funds.</p>
                                </div>
                                <div className="divider"></div>
                            </div>
                        </div>
                    </div>
                    <div className="history-status">
                        <h2 className="customHeading">Transaction History</h2>
                    </div>
                    <div className="transactionHistory-Table">
                        <div className="card">
                            <div className="select_dropDown">
                                <div className="selectDiv">
                                    <select className="form-select" onChange={handleFilter}>
                                        <option value="All">All</option>
                                        <option value="Book A Call">Book A Call</option>
                                        <option value="Membership">Membership</option>
                                        <option value="Referral">Referral</option>
                                        <option value="Refunded">Refund</option>
                                    </select>
                                </div>
                                <div className="searchDiv">
                                    <input
                                        placeholder="Search"
                                        type="text"
                                        name="search"
                                        className="form-control"
                                        onChange={handleSearchChange}
                                    />
                                </div>
                            </div>
                            <DataTable
                                columns={data().columns}
                                data={data().rows}
                                pagination
                                paginationServer
                                paginationTotalRows={transactionDetails.length}
                                onChangePage={handlePageChange} // This will work in react-data-table-component
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Transaction;
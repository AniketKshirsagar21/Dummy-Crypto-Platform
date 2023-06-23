import { useEffect } from "react";
import React from "react";
import { useSharedState } from "../../context/ContextProvider";
import { FaRupeeSign  , FaUserAlt} from 'react-icons/fa';

const UserDashboard = (props) => {

    const { updateAvailableBalance, available_balance } = useSharedState();
    const { updateTotalProfit, total_profit } = useSharedState();

    useEffect(() => {
        if (available_balance == undefined) {
            updateAvailableBalance(props.data.available_balance)
        }
        if (total_profit == undefined) {
            updateTotalProfit(props.data.total_profit)
        }
        console.log("set")
    }, [available_balance, total_profit]);

    return (<>
        <div className="col-md-6 col-xl-3 mb-4">
            <div
                className="card shadow border-start-primary py-2"
                style={{ backgroundColor: "#ffffff" }}
            >
                <div className="card-body">
                    <div className="row align-items-center no-gutters">
                        <div className="col me-2">
                            <div className="text-uppercase text-success fw-bold text-xs mb-1">
                                <span style={{ color: 'rgb(23 163 12)' }}>
                                    Username
                                </span>
                            </div>
                            <div className="row">
                                <div className="col">
                                    <div className="text-dark fw-bold h5 mb-0">
                                        <span style={{ color: 'black' }}>
                                            {props.data.username}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-auto">
                            <FaUserAlt style={{ color: "black", fontSize: "2.3rem" }} />
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div className="col-md-6 col-xl-3 mb-4">
            <div
                className="card shadow border-start-primary py-2"
                style={{ backgroundColor: "#ffffff" }}
            >
                <div className="card-body">
                    <div className="row align-items-center no-gutters">
                        <div className="col me-2">
                            <div className="text-uppercase text-success fw-bold text-xs mb-1">
                                <span style={{ color: 'rgb(23 163 12)' }}>
                                    Name
                                </span>
                            </div>
                            <div className="row">
                                <div className="col">
                                    <div className="text-dark fw-bold h5 mb-0">
                                        <span style={{ color: 'black' }}>
                                            {props.data.current_name}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-auto">
                            <FaUserAlt style={{ color: "black", fontSize: "2.3rem" }} />
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div className="col-md-6 col-xl-3 mb-4">
            <div
                className="card shadow border-start-primary py-2"
                style={{ backgroundColor: "#ffffff" }}
            >
                <div className="card-body">
                    <div className="row align-items-center no-gutters">
                        <div className="col me-2">
                            <div className="text-uppercase text-success fw-bold text-xs mb-1">
                                <span style={{ color: 'rgb(23 163 12)' }}>
                                    Available Balance
                                </span>
                            </div>
                            <div className="row">
                                <div className="col">
                                    <div className="text-dark fw-bold h5 mb-0">
                                        <span style={{ color: 'black' }}>
                                            {available_balance}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-auto">
                            <FaRupeeSign style={{ color: "black", fontSize: "2.3rem" }} />
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div className="col-md-6 col-xl-3 mb-4">
            <div
                className="card shadow border-start-primary py-2"
                style={{ backgroundColor: "#ffffff" }}
            >
                <div className="card-body">
                    <div className="row align-items-center no-gutters">
                        <div className="col me-2">
                            <div className="text-uppercase text-success fw-bold text-xs mb-1">
                                <span style={{ color: 'rgb(23 163 12)' }}>
                                    Total Profit
                                </span>
                            </div>
                            <div className="row">
                                <div className="col">
                                    <div className="text-dark fw-bold h5 mb-0">
                                        <span style={{ color: 'black' }}>
                                            {total_profit}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-auto">
                            <FaRupeeSign style={{ color: "black", fontSize: "2.3rem" }} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>)
}
export default UserDashboard;
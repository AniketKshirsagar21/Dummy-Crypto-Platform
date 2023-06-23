import React from "react";

const Marquee = (props) => {
    console.log("temp = ", props);
    if (props.data == undefined || props.data.market_cap_change_24h == undefined) {
        return (<></>)
    }
    return (
        <section className="marqueesection">
            <marquee
                id="marq"
                behavior="alternate"
                direction="left"
                className="marqueestyle" style={{
                    background: "black",
                    color: "#dbe0d5",
                    fontSize: "1rem",
                    padding: "3px",
                    margin: "5px"
                }}
            >
                <span className="marqueetext">
                    {props.data.market_cap_change_24h < 0 ? (
                        <>
                            Market Cap = ₹
                            <strong style={{ color: "red" }}>
                                {props.data.market_cap_usd} Trillion
                            </strong>
                            , 24 h Volume = {props.data.market_cap_change_24h}
                            <strong style={{ color: "red" }}></strong>, Bitcoin Dominance Percentage = {props.data.bitcoin_dominance_percentage}%
                        </>
                    ) : (
                        <>
                            <strong style={{ color: "green" }}>
                                ₹ {props.data.market_cap_usd} Trillion ({props.data.market_cap_change_24h} %){" "}
                            </strong>
                            , 24 h Volume ={" "}
                            <strong style={{ color: "green" }}>
                                ₹ {props.data.volume_24h_usd} Trillion{" "}
                            </strong>
                            , Bitcoin Dominance Percentage = {props.data.bitcoin_dominance_percentage}%
                        </>
                    )}
                </span>
            </marquee>
        </section>
    )
}

export default Marquee;
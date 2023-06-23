import React, { useEffect, useState } from 'react';
import { Button, Table } from 'react-bootstrap';
import Header from '../Header_Footer/Header';
import { HistoryPageData } from '../../Services/API'
const History = () => {
  const [data, setData] = useState();
  const [userdata, setUserData] = useState();
  useEffect(() => {
    const getData = async () => {
      const ReqData = await HistoryPageData();
      console.log("ReqData", ReqData)
      if (ReqData) {
        setData(ReqData.History.reverse());
        setUserData({ username: ReqData.username, total_profit: ReqData.total_profit })
        console.log("History -> ", ReqData);
      }
      else {
        console.log("Unable to get HistoryPageData => ", ReqData)
      }
    }
    getData();
  }, [])
  const formatDate = (utcDateString) => {
    const utcDate = new Date(utcDateString);
    const istDate = new Date(utcDate.getTime() + 5.5 * 60 * 60 * 1000); // Adding 5.5 hours (IST offset)

    const options = {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: true,
    };

    const istDateString = utcDate.toLocaleString("en-US", options);
    return istDateString
  }
  return (
    <div>
      {userdata != undefined ?
        <Header user={{ username: userdata.username, total_profit: userdata.total_profit }} />
        :
        <div className="loader">Loading...</div>
      }
      <Table className="table" style={{ width: "70%", margin: "40px auto", border: "1px solid black" }}>
        <thead>
          <tr>
            <th style={{ border: "1px solid black" }}>Symbol</th>
            <th style={{ border: "1px solid black" }}>Name</th>
            <th style={{ border: "1px solid black" }}>Coin Image</th>
            <th style={{ border: "1px solid black" }}>Date</th>
            <th style={{ border: "1px solid black" }}>Status</th>
            <th style={{ border: "1px solid black" }}>Coin Price</th>
            <th style={{ border: "1px solid black" }}>Buy Amount</th>
            <th style={{ border: "1px solid black" }}>Sold Amount</th>
            <th style={{ border: "1px solid black" }}>Invested Amount</th>
            <th style={{ border: "1px solid black" }}>Profit Gain</th>
            <th style={{ border: "1px solid black" }}>Account Balance</th>
          </tr>
        </thead>
        <tbody>
          {data != null &&
            data.map((item, index) => (
              <tr key={index} style={{ backgroundColor: item.status === "Buy" ? '#ffa59c' : '#c3ffc3', border: "1px solid black" }}>
                <td style={{ border: "1px solid black" }}>{item.symbol || '-'}</td>
                <td style={{ border: "1px solid black" }}>{item.name || '-'}</td>
                <td style={{ border: "1px solid black" }}>
                  {item.coinImg ? <img
                    style={{ width: "40px" }}
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                    src={item.coinImg}
                    alt="Logo"
                    className="coin-logo"
                  /> : '-'}
                </td>
                <td style={{ border: "1px solid black" }}>{item.date != undefined ?
                  formatDate(item.date)
                  :
                  '-'
                }</td>
                <td style={{ border: "1px solid black" }}>{item.status || '-'}</td>

                <td style={{ border: "1px solid black" }}>
                  {item.status == "Buy" ?
                    item.buy_coin_Price || '-'
                    :
                    item.sell_coin_Price || '-'

                  }
                </td>
                <td style={{ border: "1px solid black" }}>{item.buy_amaount || '-'}</td>
                <td style={{ border: "1px solid black" }}>{item.sell_amount || '-'}</td>
                <td style={{ border: "1px solid black" }}>{item.sell_coin_invested_amount || '-'}</td>
                <td style={{ border: "1px solid black" }}>{item.sell_profit_gain || '-'}</td>
                <td style={{ border: "1px solid black" }}>{item.current_balance.toFixed(2) || '-'}</td>
              </tr>
            ))}
        </tbody>
      </Table>

    </div>
  );
};

export default History;

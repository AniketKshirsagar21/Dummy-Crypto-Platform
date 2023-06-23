import React, { useEffect, useState } from 'react';
import { useSharedState } from '../../context/ContextProvider';
import { Toast } from 'react-bootstrap';
import { Selling_coin } from '../../Services/API';

const MP = (props) => {
  const { Holdings, updateHoldings } = useSharedState();
  const { updateAvailableBalance, available_balance } = useSharedState();
  const { updateTotalProfit, total_profit } = useSharedState();

  console.log('Rendering Component1');
  const [sellData, setSellData] = useState();

  const sellCoin = async (coin_symbol, coin_current) => {
    let data = {
      coin_symbol: coin_symbol,
      coin_current: coin_current
    }

    const ReqData = await Selling_coin(data);
    console.log("ReqData", ReqData)
    if (ReqData) {
      console.log("Sell Coin -> ", ReqData);
      if (ReqData.error == 0) {
        updateHoldings(ReqData.Holdings)
        updateAvailableBalance(ReqData.available_balance)
        updateTotalProfit(ReqData.total_profit)
      }
      else if (ReqData.error == 1) {
        console.log("sell error :- ", ReqData.msg)
        setSellData(ReqData);
      }
    }
    else {
      console.log("Unable to get HomePageData => ", ReqData)
    }

  }
  useEffect(() => {
    if (Holdings == undefined) {
      updateHoldings(props.data.Holdings)
      console.log("set")
    }
  }, [Holdings, available_balance, total_profit, sellCoin]);



  return (
    <div className="card shadow mb-4">
      <div
        className="card-header "
        style={{ textAlign: 'center', background: 'white' }}
      >
        <div className="row">

          {sellData != undefined && sellData.error == 1 ?

            <div className="justify-content-center align-items-center h-100" style={{ marginTop: '30px' }}>
              <div className="alert alert-danger" role="alert" >
                <h4 className="alert-heading">{sellData.msg}</h4>
                <button
                  className="btn btn-success btn-lg btn-block"
                  style={{ backgroundColor: '#b10707' }}
                  onClick={() => { setSellData() }}
                  type="submit"
                >
                  OK
                </button>
                <hr />
              </div>
            </div>
            :
            null
          }



          <div className="col">
            <h4 className="fw-bold m-0" style={{ color: 'red' }}>
              My Portfolio
            </h4>
          </div>
          <div className="col">
            <div className="row">
              <div className="col-8" style={{ alignSelf: 'center' }}>
                <h6 style={{ margin: 'auto' }}>Notifications are :- </h6>
              </div>
              <div className="col-4">
                {/* <form action="/emailOnOff" method="post"> */}
                <button type="submit" className="btn btn-secondary">
                  {/* {data.emailStatus} */}
                  noti
                </button>
                {/* </form> */}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="card-body padd">
        <div>
          <div className="row mainDiv2">
            <div className="col">
              <div className="table-responsive">
                <table className="table">
                  <thead className="text-center">
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Current Price</th>
                      <th>Invested Price</th>
                      <th>Profit Gained</th>
                      <th>Sell</th>
                    </tr>
                  </thead>
                  <tbody id="tbody2" className="text-center">
                    {Holdings == undefined ? null : (
                      <>
                        {Holdings.map((post) => (
                          <tr
                            key={post.coin_symbol}
                            style={{
                              backgroundColor: 'white',
                              color: post.coin_profit < 0 ? 'red' : 'green',
                            }}
                          >
                            <td>{post.coin_symbol}</td>
                            <td>
                              <strong>{post.coin_name}</strong>
                            </td>
                            <td>{post.coin_current}</td>
                            <td>{post.coin_invested_amount}</td>
                            <td>
                              <strong>{post.coin_profit}</strong>
                            </td>
                            <td>
                              <div>
                                <button
                                  onClick={() => sellCoin(post.coin_symbol, post.coin_current)}
                                  className="btn btn-success btn-lg"
                                  type="submit"
                                  name="arrayIndex"
                                >
                                  SELL
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}

                      </>
                    )}
                  </tbody>
                  {/* {
                    :
                    <tfoot className="text-center" style={{
                      borderTop: '1.5px solid black',
                      color: 'rgb(0, 0, 0)',
                      backgroundColor: 'rgb(226 226 226)'
                    }}>
                      {myPortfolio_total_profit > 0 ? (
                        <>
                          <td></td>
                          <td></td>
                          <td style={{ color: 'red' }}>{myPortfolio_total_Current}</td>
                          <td style={{ color: 'red' }}>{myPortfolio_total_invested}</td>
                          <td style={{ color: 'red' }}>{myPortfolio_total_profit}</td>
                          <td></td>
                        </>
                      ) : (
                        <>
                          <td></td>
                          <td></td>
                          <td style={{ color: 'rgb(52, 202, 52)' }}>{myPortfolio_total_Current}</td>
                          <td style={{ color: 'rgb(52, 202, 52)' }}>{myPortfolio_total_invested}</td>
                          <td style={{ color: 'rgb(52, 202, 52)' }}>{myPortfolio_total_profit}</td>
                          <td></td>
                        </>
                      )}
                    </tfoot>
                    
                  } */}
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


export default MP;

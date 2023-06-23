import React, { useState, useEffect } from 'react';
import Header from '../Header_Footer/Header';
import CMP from '../Dashboard/CMP'
import Marquee from '../Header_Footer/marquee';
import UserDashboard from '../Dashboard/userDashboard';
import 'bootstrap/dist/css/bootstrap.min.css';
import jwt_decode from 'jwt-decode';
import AllUsers from './AllUsers';

import { SharedStateProvider } from '../../context/ContextProvider';

const Contest = () => {
  const [data, setData] = useState({});

  useEffect(() => {
    let mytoken = localStorage.getItem('mytoken');
    console.log("Contest = ", mytoken)

    fetch("http://localhost:8880/contest", {
      method: "GET",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${mytoken}`
      },
    })
      .then((resp) => resp.json())
      .then((result) => {
        setData(result);
        console.log("result -> ", result);
        // localStorage.setItem("mytoken" , result.token)

      })
      .catch((e) => console.log("aniket ", e));
  }, []);

  return (
    <>
      <div id="content">
        {data.dashboard_data == undefined ?
          null
          :
          <Header user={{ username: data.username, total_profit: data.dashboard_data.total_profit }} />
        }

        <div className="container-fluid">

          {data.marquee && 1 ? (
            <Marquee data={data.marquee} />
          ) :
            <h1>Marquee Loading</h1>
          }

          <div className="row">
            <div className="row" style={{ marginTop: 30 }}>

              <SharedStateProvider>
                <>
                  {data.dashboard_data != undefined ? (
                    <UserDashboard data={data.dashboard_data} />
                  ) :
                    <h1>Dashboard Loading</h1>
                  }

                  <div className="col-lg-5 col-xl-6">
                    <div className="row padd">
                      {data.contest_data != undefined ?
                        <CMP data={data.contest_data} />
                        :
                        <h3>Contest data Loading</h3>

                      }
                    </div>
                  </div>

                </>
              </SharedStateProvider>



              <div className="col-lg-7 col-xl-6 padd">
                {data.all_user_data != undefined ?

                  <AllUsers data={{ all_user_data: data.all_user_data, username: data.username }} />
                  :
                  <h3>Api data Loading</h3>}

              </div>
            </div>
          </div>
        </div>
      </div>

    </>
  );
}

export default Contest;

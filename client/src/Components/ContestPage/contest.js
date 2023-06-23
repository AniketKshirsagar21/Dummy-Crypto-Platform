import React, { useState, useEffect } from 'react';
import Header from '../Header_Footer/Header';
import CMP from '../Dashboard/CMP'
import Marquee from '../Header_Footer/marquee';
import UserDashboard from '../Dashboard/userDashboard';
import 'bootstrap/dist/css/bootstrap.min.css';
import jwt_decode from 'jwt-decode';
import AllUsers from './AllUsers';

import { SharedStateProvider } from '../../context/ContextProvider';
import { ContestPageData } from '../../Services/API';

const Contest = () => {
  const [data, setData] = useState({});

  useEffect(() => {

    const getData = async () => {
      const ReqData = await ContestPageData();
      console.log("ReqData", ReqData)
      if (ReqData) {
        setData(ReqData);
        localStorage.setItem("mytoken", ReqData.token)
      }
      else {
        console.log("Unable to get ContestPageData => ", ReqData)
      }
    }
    getData();

  }, []);

  return (
    <>
      <div id="content">
        {data.dashboard_data == undefined ?
          <div className="loader">Loading...</div>
          :
          <Header user={{ username: data.username, total_profit: data.dashboard_data.total_profit }} />
        }

        <div className="container-fluid">

          {data.marquee && 1 ? (
            <Marquee data={data.marquee} />
          ) :
            null
          }

          <div className="row">
            <div className="row" style={{ marginTop: 30 }}>

              <SharedStateProvider>
                <>
                  {data.dashboard_data != undefined ? (
                    <UserDashboard data={data.dashboard_data} />
                  ) :
                    null
                  }

                  <div className="col-lg-5 col-xl-6">
                    <div className="row padd">
                      {data.contest_data != undefined ?
                        <CMP data={data.contest_data} />
                        :
                        null

                      }
                    </div>
                  </div>

                </>
              </SharedStateProvider>



              <div className="col-lg-7 col-xl-6 padd">
                {data.all_user_data != undefined ?

                  <AllUsers data={{ all_user_data: data.all_user_data, username: data.username }} />
                  :
                  null
                }

              </div>
            </div>
          </div>
        </div>
      </div>

    </>
  );
}

export default Contest;

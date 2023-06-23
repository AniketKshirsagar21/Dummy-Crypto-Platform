import React, { useState, useEffect } from 'react';
import MP from '../Dashboard/MP.js'
import ApiData from '../API/apiData'
import Marquee from '../Header_Footer/marquee.js';
import UserDashboard from '../Dashboard/userDashboard';
// import '../Header_Footer/loader-animation.css'
// import 'bootstrap/dist/css/bootstrap.min.css';
import jwt_decode from 'jwt-decode';

import Header from '../Header_Footer/Header.js';

import { SharedStateProvider } from '../../context/ContextProvider';
import { HomePageData } from '../../Services/API.js';

const Home = () => {
  const [data, setData] = useState({});
  useEffect(() => {
    const getData = async () => {
      const ReqData = await HomePageData();
      if (ReqData) {
        setData(ReqData);
        localStorage.setItem("mytoken", ReqData.token)
      }
      else{
        console.log("Unable to get HomePageData => ", ReqData)
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

                      {data.main_data != undefined ?
                        <MP data={data.main_data} />
                        :
                        null
                      }

                    </div>
                  </div>
                </>
              </SharedStateProvider>

              <div className="col-lg-7 col-xl-6 padd">
                {data.apidata != undefined ?

                  <ApiData data={{ apidata: data.apidata, username: data.username }} />
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

export default Home;

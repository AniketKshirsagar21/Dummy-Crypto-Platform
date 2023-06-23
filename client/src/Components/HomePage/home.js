import React, { useState, useEffect } from 'react';
import MP from '../Dashboard/MP.js'
import ApiData from '../API/apiData'
import Marquee from '../Header_Footer/marquee.js';
import UserDashboard from '../Dashboard/userDashboard';
import './home.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import jwt_decode from 'jwt-decode';

import Header from '../Header_Footer/Header.js';

import { SharedStateProvider } from '../../context/ContextProvider';

const Home = () => {
  const [data, setData] = useState({});

  useEffect(() => {
    let mytoken = localStorage.getItem('mytoken');
    console.log("Home = ", mytoken)

    fetch("http://localhost:8880/", {
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
        localStorage.setItem("mytoken", result.token)

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

                      {data.main_data != undefined ?
                        <MP data={data.main_data} />
                        :
                        <h3>Main data Loading</h3>
                      }

                    </div>
                  </div>
                </>
              </SharedStateProvider>

              <div className="col-lg-7 col-xl-6 padd">
                {data.apidata != undefined ?

                  <ApiData data={{ apidata: data.apidata, username: data.username }} />
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

export default Home;

app.get("/contest", verifyToken, async (req, res) => {
    try {
        let apiData = [];
        const apiReq = await fetch(
            `https://api.coinpaprika.com/v1/tickers?quotes=INR`
        )
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                for (let i = 0; i < 300; i++) {
                    let n = data[i].quotes.INR.price.toFixed(2);
                    let tempObj = {
                        id: `${data[i].id}`,
                        idx: i,
                        rank: `${data[i].rank}`,
                        symbol: `${data[i].symbol}`,
                        name: `${data[i].name}`,
                        currentPrice: `${n}`,
                        percent: `${data[i].quotes.INR.percent_change_24h}`,
                        coinImg: `https://static.coinpaprika.com/coin/${data[i].id}/logo.png?rev=10588339`
                    }
                    apiData.push(tempObj);
                }
                apidatas = apiData;
            })
            .catch((errr) => {
                console.log('API Error' + errr);
            });

        const all_user_data = [];
        const all = await cryptoPortfolio.find({}, { username: 1, C_total_profit: 1, fname: 1, lname: 1 }).toArray(function (err, docs) {
            if (err) {
                console.log('Error retrieving documents:', err);
                return;
            }
            // Store the selected fields in the 'data' variable
            all_user_data = docs.map(doc => ({
                username: doc.username,
                C_total_profit: doc.C_total_profit,
                name: doc.fname + " " + doc.lname
            }));
            console.log("all = ",all_user_data)
        })

        let market_cap_usd = 40;
        let market_cap_change_24h = 40;
        let bitcoin_dominance_percentage = 40;
        let volume_24h_usd = 40;
        // const apiReq2 = await fetch(
        //     `https://api.coinpaprika.com/v1/global`
        // )
        //     .then((res) => {
        //         return res.json();
        //     })
        //     .then((data) => {
        //         market_cap_usd = (((data.market_cap_usd) * 75) / 1000000000000).toFixed(2);
        //         bitcoin_dominance_percentage = internationalNumberFormat.format(data.bitcoin_dominance_percentage);
        //         volume_24h_usd = (((data.volume_24h_usd) * 75) / 1000000000000).toFixed(2);
        //         market_cap_change_24h = data.market_cap_change_24h;
        //     })
        //     .catch((errr) => {
        //         console.log('API Error' + errr);
        //     });

        var userData = undefined;
        if (req.username && req.token != "expired") {
            userData = await cryptoPortfolio.findOne({ username: req.username })
        }

        if (userData == undefined || !req.username || req.token == "expired") {
            console.log("In Contest :- User Not found/Expired");
            res.send({
                token: "no",
                all_user_data : all_user_data,
                username: "--", //???????????????????????
                total_profit: 0, //???????????????????????
                marque_data: {
                    market_cap_usd: market_cap_usd,
                    market_cap_change_24h: market_cap_change_24h,
                    bitcoin_dominance_percentage: bitcoin_dominance_percentage,
                    volume_24h_usd: volume_24h_usd,
                },
                dashboard_data: {
                    username: "--",
                    available_balance: 10000,
                    total_profit: 0.00,
                    current_name: "--"
                },
                contest_data: {
                    contestHoldings: [],
                    C_myPortfolio_total_invested: 0,
                    C_myPortfolio_total_Current: 0,
                    C_myPortfolio_total_profit: 0
                },
            })
        }
        else {
            let C_myPortfolio_total_invested = 0;
            let C_myPortfolio_total_Current = 0;
            let C_myPortfolio_total_profit = 0;
            let l = 300;
            if (apidatas.length < 300) l = apidatas.length
            for (let i = 0; i < l; i++) {
                let n = apidatas[i].currentPrice;
                for (let k = 0; k < userData.contestHolding.length; k++) {
                    if (userData.contestHolding[k].coin_symbol == apidatas[i].symbol) {
                        ccval1 = (n * userData.contestHolding[k].coin_number).toFixed(2);
                        userData.contestHolding[k].coin_current = ccval1;
                        userData.contestHolding[k].coin_profit = (ccval1 - userData.contestHolding[k].coin_invested_amount).toFixed(2);

                        C_myPortfolio_total_invested += userData.contestHolding[k].coin_invested_amount;
                        C_myPortfolio_total_Current += userData.contestHolding[k].coin_current;
                        C_myPortfolio_total_profit += userData.contestHolding[k].coin_profit;
                    }
                }
            }

            cname = userData.fname + " " + userData.lname;
            res.send({
                // apidata: apidatas,
                all_user_data : all_user_data,
                token: req.token,
                username: req.username,
                total_profit: userData.C_total_profit, //???????????????????????
                contest_data: {
                    contestHoldings: userData.contestHolding,
                    C_myPortfolio_total_invested: C_myPortfolio_total_invested.toFixed(2),
                    C_myPortfolio_total_Current: C_myPortfolio_total_Current.toFixed(2),
                    C_myPortfolio_total_profit: C_myPortfolio_total_profit.toFixed(2),
                },
                dashboard_data: {
                    username: req.username,
                    available_balance: (userData.C_available_balance).toFixed(2),
                    total_profit: (userData.C_total_profit).toFixed(2),
                    current_name: cname
                },
                marquee: {
                    market_cap_usd: market_cap_usd,
                    market_cap_change_24h: market_cap_change_24h,
                    bitcoin_dominance_percentage: bitcoin_dominance_percentage,
                    volume_24h_usd: volume_24h_usd
                }
            });
        }
    }
    catch (err) {
        res.send(err);
    }
})
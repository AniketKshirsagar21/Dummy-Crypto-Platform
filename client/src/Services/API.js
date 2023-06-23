// const url = "http://localhost:8880"
// const url = "https://dummycryptobackend.onrender.com"
const url = process.env.REACT_APP_BACKEND_URL
console.log("env = ", url)
export const HomePageData = async () => {
    try {
        let mytoken = localStorage.getItem("mytoken")
        if (mytoken == undefined) mytoken = "no";
        let data;
        const y = await fetch(`${url}/`, {
            method: "GET",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${mytoken}`
            },
        })
            .then((resp) => resp.json())
            .then((result) => {
                console.log("***********(Services)Home Page Data loaded successfully - ", result.token)
                data = result;
            })
            .catch((e) => {
                console.log("(Services)Unable to make request at get /")
            });
        return data;

    } catch (error) {
        console.log("(Services)Unable to make request at get /")
        return error;
    }
}

export const BuyPageData = async (obj) => {
    try {
        let mytoken = localStorage.getItem("mytoken")
        if (mytoken == undefined) mytoken = "no";
        let data;
        const p = await fetch(`${url}/buydatapage`, {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${mytoken}`
            },
            body: JSON.stringify(obj)
        })
            .then((resp) => resp.json())
            .then((result) => {
                console.log("(Services)Buy Page Data loaded successfully - ", result)
                data = result
            })
            .catch((e) => console.log("error in getting info from buydatapage ", e));
        return data;

    } catch (error) {
        console.log("(Services)Unable to make request at get /buydatapage")
        return error;
    }
}

export const BuyThatCoin = async (obj) => {
    try {
        let mytoken = localStorage.getItem("mytoken")
        if (mytoken == undefined) mytoken = "no";
        let data;
        const y = await fetch(`${url}/buyCoin`, {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${mytoken}`
            },
            body: JSON.stringify(obj)
        })
            .then((resp) => resp.json())
            .then((result) => {
                console.log("(Services)Buy Page Data loaded successfully -  -> ", result);
                data = result;
            })
            .catch((e) => console.log("error in getting info from buydatapage ", e));

        return data;

    } catch (error) {
        console.log("(Services)Unable to make request at get /")
        return error;
    }
}

export const BuyThatCoinForContest = async (obj) => {
    try {
        let mytoken = localStorage.getItem("mytoken")
        if (mytoken == undefined) mytoken = "no";
        let data;
        const y = await fetch(`${url}/buyCoinContest`, {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${mytoken}`
            },
            body: JSON.stringify(obj)
        })
            .then((resp) => resp.json())
            .then((result) => {
                console.log("(Services)Buy Page Data loaded successfully -  -> ", result);
                data = result;
            })
            .catch((e) => console.log("error in getting info from buydatapage ", e));

        return data;

    } catch (error) {
        console.log("(Services)Unable to make request at get /")
        return error;
    }
}

export const HistoryPageData = async () => {
    try {
        let mytoken = localStorage.getItem("mytoken")
        if (mytoken == undefined) mytoken = "no";
        let data;
        const y = await fetch(`${url}/history`, {
            method: "GET",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${mytoken}`
            },
        })
            .then((resp) => resp.json())
            .then((result) => {
                console.log("(Services)History Page Data loaded successfully - ", result)
                data = result;

            })
            .catch((e) => console.log("History error ", e));
        return data;

    } catch (error) {
        console.log("(Services)Unable to make request at get /History")
        return error;
    }
}

export const ContestPageData = async () => {
    try {
        let mytoken = localStorage.getItem("mytoken")
        if (mytoken == undefined) mytoken = "no";
        let data;
        const y = await fetch(`${url}/contest`, {
            method: "GET",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${mytoken}`
            },
        })
            .then((resp) => resp.json())
            .then((result) => {
                console.log("(Services)Contest Page Data loaded successfully - ", result)
                data = result;
            })
            .catch((e) => {
                console.log("(Services)Unable to make request at get /Contest")
            });
        return data;

    } catch (error) {
        console.log("(Services)Unable to make request at get /Contest")
        return error;
    }
}

export const Selling_coin = async (obj) => {
    try {
        let mytoken = localStorage.getItem("mytoken")
        if (mytoken == undefined) mytoken = "no";
        let data;
        const y = await fetch(`${url}/selling_coin`, {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${mytoken}`
            },
            body: JSON.stringify(obj)
        })
            .then((resp) => resp.json())
            .then((result) => {
                console.log("(Services)Sell Data loaded successfully -  -> ", result);
                data = result;
            })
            .catch((e) => console.log("error in getting info from sell data ", e));

        return data;

    } catch (error) {
        console.log("(Services)Unable to make request at get /selling_coin")
        return error;
    }
}

export const Contest_Selling_coin = async (obj) => {
    try {
        let mytoken = localStorage.getItem("mytoken")
        if (mytoken == undefined) mytoken = "no";
        let data;
        const y = await fetch(`${url}/contest_selling_coin`, {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${mytoken}`
            },
            body: JSON.stringify(obj)
        })
            .then((resp) => resp.json())
            .then((result) => {
                console.log("(Services)Sell Data loaded successfully -  -> ", result);
                data = result;
            })
            .catch((e) => console.log("error in getting info from sell data ", e));

        return data;

    } catch (error) {
        console.log("(Services)Unable to make request at get /selling_coin")
        return error;
    }
}

export const LoginApi = async (obj) => {
    try {
        let mytoken = localStorage.getItem("mytoken")
        if (mytoken == undefined) mytoken = "no";
        let data;
        const y = await fetch(`${url}/Login`, {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${mytoken}`
            },
            body: JSON.stringify(obj)
        })
            .then((resp) => resp.json())
            .then((result) => {
                console.log("(Services)Login Data loaded successfully -  -> ", result);
                data = result;
            })
            .catch((e) => console.log("error in getting info from Login  data ", e));

        return data;

    } catch (error) {
        console.log("(Services)Unable to make request at get /Login")
        return error;
    }
}

export const RegisterApi = async (obj) => {
    try {
        let mytoken = localStorage.getItem("mytoken")
        if (mytoken == undefined) mytoken = "no";
        let data;
        const y = await fetch(`${url}/register`, {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${mytoken}`
            },
            body: JSON.stringify(obj)
        })
            .then((resp) => resp.json())
            .then((result) => {
                console.log("(Services)Login Data loaded successfully -  -> ", result);
                data = result;
            })
            .catch((e) => console.log("error in getting info from Login  data ", e));

        return data;

    } catch (error) {
        console.log("(Services)Unable to make request at get /Login")
        return error;
    }
}
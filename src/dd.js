const express = require('express');
const app = express();


app.get("/", async (req, res) => {
    try {
        res.send("hello");
    }
    catch (err) {
        res.send(err);
    }
})


const port = process.env.PORT || '8880';
app.listen(port, ["192.168.56.1", "localhost"], () => {
    console.log(("listened on port ", port));
})

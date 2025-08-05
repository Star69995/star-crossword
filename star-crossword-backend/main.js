const express = require("express")
const morgan = require("morgan")
const mongoose = require("mongoose")
const cors = require("cors")
require("dotenv").config()
const app = express()

app.use(express.json());

app.use(morgan("dev"))

const port = process.env.PORT ?? 3000


// Add this before your routes:
app.use(cors({
    origin: 'http://localhost:5173', // Or '*' for development, but see note below!
    credentials: true, // If you use cookies for auth
}));


app.use("/api/users", require("./routes/user"))
app.use("/api/login", require("./routes/auth"))
app.use("/api/crosswords", require("./routes/crossword"))
app.use("/api/wordlists", require("./routes/wordList"))


mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log("connected to database");
    app.listen(port, () => {
        console.log(`listening on port ${port}`);
    })
}).catch((err) => {
    console.log(err);
})

app.all(/.*/, (req, res) => {
    console.log(req.method + " " + req.url);
    res.send("no action matched");
})




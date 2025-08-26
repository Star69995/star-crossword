const express = require("express")
const morgan = require("morgan")
const mongoose = require("mongoose")
const cors = require("cors")
require("dotenv").config()
const app = express()

app.use(express.json());

app.use(morgan("dev"))

const port = process.env.PORT ?? 3000


const allowedOrigins = [
    "http://localhost:5173",  // local dev
    "https://star-crossword.vercel.app"
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);

        // ✅ Allow official domain + localhost
        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }

        // ✅ Allow ALL preview deployments from Vercel (*.vercel.app)
        if (origin.endsWith(".vercel.app")) {
            return callback(null, true);
        }

        // ❌ Otherwise block
        return callback(new Error("CORS not allowed for this origin: " + origin), false);
    },
    credentials: true
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




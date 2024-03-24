/*
 * Module dependencies
 */
const express = require("express");
const cors = require("cors");
const colors = require("colors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const query = require("./data/queryUser");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

// dotenv config
dotenv.config();

// rest object
const app = express();

// To control CORSS-ORIGIN-RESOURCE-SHARING( CORS )
app.use(cors());
app.options("*", cors());

// To parse encoded data
app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(
    bodyParser.urlencoded({
        // to support URL-encoded bodies
        extended: true,
    })
);
app.use(morgan("dev"));
app.use(cookieParser(process.env.SECRET_KEY));

// routes
app.use("/api/v1/user", require("./routes/userRoutes"));

// test route
// app.get("/", function (req, res) {
//     query
//         .main(req.query)
//         .then((result) => console.log(result))
//         .catch((err) => {
//             console.error({ err });
//         });
// });

// port
const port = process.env.PORT || 8080;

app.listen(port, () => {
    console.log(
        `Server is running on ${process.env.NODE_MODE} mode at port ${process.env.PORT}`
            .bgCyan.white
    );
});
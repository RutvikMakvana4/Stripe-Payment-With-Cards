import "dotenv/config";
import express from "express";
import path from "path";
import mainRouter from "./routers/index";
import swaggerSetup from "./src/common/swagger";
import session from "express-session";
import flash from "connect-flash";
import { JWT } from "./src/common/constants/constants";
import "./src/common/config/jwtPassport";
import dbConnection from "./src/common/config/dbConnection";

const app = express();
const PORT = process.env.PORT || 2004;

dbConnection();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
    name: 'Stripe Payment',
    secret: JWT.SECRET,
    resave: false,
    saveUninitialized: true,
}));

app.use(flash());
app.use(function (req, res, next) {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});


app.use(swaggerSetup);
app.use(mainRouter);

app.use(express.static(path.join(__dirname + "/public")))
app.use(require("./src/common/middleware/error")); // Throw new error automatically


app.listen(PORT, () => {
    console.log(`server running on http://${process.env.HOST}:${process.env.PORT}`)
})


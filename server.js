const express = require("express");
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const { customersRouter } = require("./routers/customersRouter");
const { suppliersRouter } = require("./routers/suppliersRouter");
const { ratingsRouter } = require("./routers/ratingsRouter");
const { authRouter } = require('./routers/authRouter');
const { userRouter } = require('./routers/authRouter');
const logger = require("./logger/logger");
const port = process.env.PORT || 3200;
const app = express();
const originUrl='http://localhost:3000';

app.use(cookieParser());
const corsOptions = {
origin:[/^http:.*/],
  credentials: true,            //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Weddingly application." });
});

app.use('/weddingly/auth', authRouter);
app.use('/weddingly/customers', customersRouter);

app.use('/weddingly/suppliers', suppliersRouter);

app.use('/weddingly/ratings', ratingsRouter);

app.use((req, res) => {
  logger.error('Something is broken!');
  res.status(400).send('Something is broken!');
});

app.listen(port, () => console.log((`Express server is running on port ${port}`)));
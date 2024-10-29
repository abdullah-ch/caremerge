const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const app = express();

require('dotenv').config();
const port = process.env.PORT || 5001;

app.use(
  cors({
    credentials: true,
    origin: true,
  })
);
app.use(express.json());
app.use(cookieParser());



app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
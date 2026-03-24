const express = require('express');
const cors = require('cors');
const path = require('path');

require('dotenv').config();
const dbConnect = require('./models/dbconnect');

const app = express();
dbConnect();

app.use(cors());
app.use(express.json());
const authRouter = require('./Routes/authRoutes');
app.use("/api/auth", authRouter);
const favoriteRouter = require('./Routes/favoriteRoutes');
app.use("/api/favorites", favoriteRouter);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.get('/', (req, res) => {
    res.send('Server is running!');
});

app.listen(process.env.PORT, () => {
    console.log(`Server running successfully @ ${process.env.PORT}`);
});

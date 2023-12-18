const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const colors = require('colors')
const morgan = require('morgan')
const connectDB = require('./config/db')

dotenv.config()

connectDB();

const app = express()

app.use(cors())
app.use(express.json())
app.use(morgan('dev'))

const PORT = process.env.PORT || 4000


app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Welcome to News App',
    })
});

app.use('/api/v1/auth', require('./routes/userRoutes'))
app.use('/api/v1/post', require('./routes/postRoutes'))

app.listen(PORT, () => { console.log(`Server running at ${PORT}`.bgGreen.white) })


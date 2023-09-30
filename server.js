const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // Import the cors middleware
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const { User, Booking } = require('./models/user');
const Table = require('./models/table');
const { EmailSubscription } = require('./models/emailSubscriptions'); 


const app = express();
const PORT = process.env.PORT || 3000;
// Enable CORS for all routes
app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('public'));

mongoose.connect('mongodb://localhost:27017/restaurant_webiste', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/home.html');
});

app.get('/menu.html', (req, res) => {
    res.sendFile(__dirname + '/public/menu.html');
});

// Define an array of available tables (adjust the table numbers as needed)
const availableTables = [
    { tableNumber: 1, date: '09-18-2023', time: '18:00:AM', isBooked: false },
    { tableNumber: 2, date: '09-18-2023', time: '18:00:AM', isBooked: false },
    { tableNumber: 3, date: '09-18-2023', time: '18:00:AM', isBooked: false },
    { tableNumber: 4, date: '09-18-2023', time: '18:00:AM', isBooked: false },
    { tableNumber: 5, date: '09-18-2023', time: '18:00:AM', isBooked: false },
    { tableNumber: 6, date: '09-18-2023', time: '18:00:AM', isBooked: false },
    { tableNumber: 7, date: '09-18-2023', time: '18:00:AM', isBooked: false },
    { tableNumber: 8, date: '09-18-2023', time: '18:00:AM', isBooked: false },
    { tableNumber: 9, date: '09-18-2023', time: '18:00:AM', isBooked: false },
    { tableNumber: 10, date: '09-18-2023', time: '18:00:AM', isBooked: false },
    // Add more tables as needed
];

// Insert the available tables into the table collection
async function initializeTables() {
    try {
        const existingTable = await Table.findOne({ tableNumber: 1 });
        if (!existingTable) {
            const result = await Table.insertMany(availableTables);
            console.log('Tables initialized successfully:', result);
        }
    } catch (error) {
        console.error('Error initializing tables:', error);
    }
}

// Call the function to initialize tables
initializeTables();

app.get('/register', (req, res) => {
    res.sendFile(__dirname + '/public/register.html');
});

app.post('/register', async (req, res) => {
    try {
        const { username, password, email } = req.body;
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).send('Username already exists.');
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            username,
            password: hashedPassword,
            email,
        });
        await newUser.save();
        res.redirect('/login?registration=success');
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred during registration.');
    }
});

app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/public/login.html');
});

app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).send('Authentication failed: User not found.');
        }
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (passwordMatch) {
            res.redirect('/Booking.html');
        } else {
            console.log('Password does not match');
            return res.status(401).send('Authentication failed: Incorrect password.');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Login failed: An error occurred.');
    }
});

app.get('/Booking.html', (req, res) => {
    res.sendFile(__dirname + '/Booking.html');
});

// Handle table booking
app.post('/book-table', async (req, res) => {
    try {
        console.log('Received request data:', req.body); // Log the request data for debugging

        const { tableNumber, date, time, username, numberOfPersons } = req.body;
        console.log('Received tableNumber:', tableNumber);
        console.log('Received date:', date);
        console.log('Received time:', time);
        console.log('Received username:', username);
        console.log('Received numberOfPersons:', numberOfPersons);
        const table = await Table.findOne({ tableNumber, date, isBooked: false });
        console.log('Found table:', table); // Log the table object for debugging

        if (table) {
            // Count the number of booked tables for the selected date and time
            const bookedTableCount = await Table.countDocuments({ date, time, isBooked: true });
            console.log('Found table:', table); // Log the table object for debugging

            if (bookedTableCount >= 10) {
                // The maximum number of tables for this time slot is already booked
                res.status(400).json({ error: 'Maximum tables booked for this time slot.' });
            } else {
                // The table is available, mark it as booked
                table.isBooked = true;
                await table.save();

                // Insert the booking record into the database
                const booking = new Booking({
                    username,
                    numberOfPersons,
                    tableNumber,
                    date,
                    time,
                });
                await booking.save();

                // Return a success message
                res.status(200).json({ message: 'Table booked successfully' });
            }
        } else {
            // The table is already booked for the selected date and time
            res.status(400).json({ error: 'Table is not available' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred during booking' });
    }
});

app.get('/check-availability', async (req, res) => {
    try {
        const availableTables = await Table.find({ isBooked: false });
        res.status(200).json(availableTables);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while checking availability' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// Handle email subscription
app.post('/subscribe', async (req, res) => {
    try {
        const { email } = req.body;
        const existingSubscription = await EmailSubscription.findOne({ email });

        if (existingSubscription) {
            return res.status(400).send('Email already subscribed.');
        }

        const newSubscription = new EmailSubscription({ email });
        await newSubscription.save();
        res.status(200).send('Subscription successful.');
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred during subscription.');
    }
});






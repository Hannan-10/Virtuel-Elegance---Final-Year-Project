const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const serviceaccount = require('./firebasesdk.json');
const app = express();



// app.get('/' , function(req,res){
//     res.send("this is backend")
// })
// app.get('/login' , function(req,res){
//     res.send("this is login backend")
// })
// app.get('/signup', function(req,res){
//     res.send("this is log234in backend")
// })

admin.initializeApp({
    credential: admin.credential.cert(serviceaccount),
    databaseURL: 'https://virtuelelegance-default-rtdb.firebaseio.com/',
});

const database = admin.database();

app.use(express.json());
app.use(cors({   //192.168.18.142 HOME IP    
    origin: 'http://192.168.43.29:8081',    //192.168.43.29 Mobile IP
    credentials: true
}));

// Endpoint to authenticate user and set session cookie
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Validation
  if (!email || !password) {
    return res.status(400).send({ error: 'Email and password are required.' });
  }

  try {
    // Query the Realtime Database for the user with the given email
    const usersRef = database.ref('users');
    const snapshot = await usersRef.orderByChild('email').equalTo(email).once('value');

    if (!snapshot.exists()) {
      return res.status(404).send({ error: 'User not found.' });
    }

    // Fetch the user data
    let user;
    snapshot.forEach(childSnapshot => {
      user = childSnapshot.val();
    });

    // Compare the password
    if (user.password === password) {
      // Set a session cookie
      res.cookie('session', JSON.stringify({ username: user.username, email: user.email }), {
        httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
        secure: false, // Set to true in production with HTTPS
        maxAge: 86400000, // 1 day in milliseconds
      });

      res.status(200).send({ message: 'User authenticated successfully!', user });
    } else {
      res.status(401).send({ error: 'Invalid credentials.' });
    }
  } catch (error) {
    console.error('Error during authentication:', error);
    res.status(500).send({ error: 'Error during authentication', details: error.message });
  }
});

app.post('/create', async (req, res) => {
  const { email, password, firstName, lastName } = req.body;

  // Validation
  if (!email || !password || !firstName || !lastName) {
    return res.status(400).send({ error: 'Email, password, first name, and last name are required.' });
  }

  const newUser = { email, password, firstName, lastName };

  try {
    // Save user to Realtime Database
    const userRef = database.ref('users');
    const newUserRef = userRef.push();
    await newUserRef.set(newUser);

    console.log('User created with ID:', newUserRef.key);
    res.status(201).send({ id: newUserRef.key, ...newUser });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).send({ error: 'Failed to create user', details: error.message });
  }
});


app.post('/logout', (req, res) => {
  try {
    console.log("HELLL");
    // Clear session or authentication cookies
    res.clearCookie('session'); // Adjust cookie name if different
    res.status(200).send({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Error during logout:', error);
    res.status(500).send({ error: 'Failed to logout' });
  }
});


  

app.listen(3000);
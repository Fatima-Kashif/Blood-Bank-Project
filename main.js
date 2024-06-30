// for server initialize 
import mysql from "mysql2";
import express from "express";
// import  bodyParser from "body-parser";
const app = express()
const port = 3000
// ye ek middleware ha middleware basically fn hota ha isse ham public folder access krte hain
app.use(express.static('public')) 
//aacept json body 
app.use(express.json());
// app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

// Database connection pool
const connection = mysql.createPool({
  host: "156.67.73.151",
  user: "u481156254_khan",
  password: "#Xm8OmLB",
  database:"u481156254_BloodBank",
  port:"3306",
  waitForConnections: true,
  connectionLimit : 10,
  queueLimit:0

});


// app.get('/', (req, res) => {
//     res.render("test")
//   }) //routing point for testing purpose
app.get('/login', (req, res) => {
  res.render("login")
})

app.post('/login', (req, res) => {
  const { email, password } = req.body; // extract email and password from req body

  // Query to check email and password in both tables
  // SELECT * FROM ADMIN WHERE A_EMAIL = ? AND A_PSWD = ?
  //     UNION
  const query = `
      SELECT * FROM PATIENT WHERE P_EMAIL = ? AND P_PSWD = ?
      UNION
      SELECT * FROM DONOR WHERE D_EMAIL = ? AND D_PSWD = ?
  `;

  connection.query(query, [email, password, email, password], (err, results) => {
    if (err) throw err;

    if (results.length > 0) {
      // Successful login
      res.redirect('/form');
    } else {
      // Unsuccessful login
      res.send('Invalid email or password');
    }
  });
});

// Route for displaying form page
app.get('/form', (req, res) => {
  res.render('form');
});

// Route for displaying form page
app.get('/submit', (req, res) => {
  res.render('clock');
});


  
//trying gpt code to send data from the form to database

// Route for handling form submission
app.post('/submit', (req, res) => {
  const { email, units, blood_group } = req.body; // Extract form data

  console.log("req.body",req.body)

  // Query to find if user is a patient or donor
  const query = `
    SELECT 'PATIENT' AS role, PATIENT_ID AS id FROM PATIENT WHERE P_EMAIL = ?
    UNION
    SELECT 'DONOR' AS role, DONOR_ID AS id FROM DONOR WHERE D_EMAIL = ?
    `
  ;

  connection.query(query, [email, email], (err, results) => {
    if (err) throw err;

    console.log(results)
    // if (results.length > 0) {
    //   const user = results[0];

    //   if (user.role === 'PATIENT') {
    //     // User is a patient, insert into REQUEST table
    //     const insertRequestQuery = `
    //       INSERT INTO REQUEST (PATIENT_ID, UNITS, BLOOD_GRP_REQ, TO_DATE, STATUS)
    //       VALUES (?, ?, ?, NOW(), 'pending')
    //       `
    //     ;

    //     connection.query(insertRequestQuery, [user.id, units, blood_group], (err, results) => {
    //       if (err) throw err;
    //       console.log("Request table updated: ", results);
    //       res.send("Request has been submitted.");
    //     });
    //   } else if (user.role === 'DONOR') {
    //     // User is a donor, insert into DONOR_RECORD table
    //     const insertDonorRecordQuery = `
    //       INSERT INTO DONOR_RECORD (DONOR_ID, D_DATE_DON, D_UNITS)
    //       VALUES (?, NOW(), ?)
    //       `
    //     ;

    //     connection.query(insertDonorRecordQuery, [user.id, units], (err, results) => {
    //       if (err) throw err;
    //       console.log("Donor record updated: ", results);
    //       res.send("Donor record has been updated.");
    //     });
    //   }
    // } else {
    //   res.send('User not found.');
    // }
  });
});



// connection.query('SELECT * FROM DONOR', (error, results, fields) => {
//   if (error) {
//     console.error('Error connecting to MySQL:', error);
//     return;
//   }
//   console.log('Query results:', results);
// });

  app.listen(port, () => {
    console.log("Example app listening on port ${port}")
  }) 


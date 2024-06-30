// for server initialize 
import mysql from "mysql2";
import express from "express";
import  bodyParser from "body-parser";
const app = express()
const port = 3000
app.use(express.static('public')) // ye ek middleware ha middleware basically fn hota ha isse ham public folder access krte hain
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');


// app.get('/', (req, res) => {
//     res.render("test")
//   }) //routing point for testing purpose
  app.get('/login', (req, res) => {
    res.render("login")
  })
  // Route for handling login form submission
app.post('/login', (req, res) => {
  const { email, password } = req.body; // extract email and password from req body

// Route for displaying form page
app.get('/form', (req, res) => {
  res.render('form');
});


  let connection = mysql.createPool({
    host: "156.67.73.151",
      user: "u481156254_khan",
      password: "#Xm8OmLB",
      database:"u481156254_BloodBank",
      port:"3306",
      waitForConnections: true,
      connectionLimit : 10,
      queueLimit:0
    
  });
  


  // Query to check email and password in both tables
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






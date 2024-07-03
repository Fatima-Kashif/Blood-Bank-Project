// for server initialize
import mysql from "mysql2";
import express from "express";
import bodyParser from "body-parser";
const app = express();
const port = 3000;
// ye ek middleware ha middleware basically fn hota ha isse ham public folder access krte hain
app.use(express.static("public"));
//aacept json body
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

// Database connection pool
const connection = mysql.createPool({
  host: "156.67.73.151",
  user: "u481156254_khan",
  password: "#Xm8OmLB",
  database: "u481156254_BloodBank",
  port: "3306",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});
let logindetails = [];
let donorDetails = [];
let patientsDetails = [];

const patientUnionDonor = "SELECT * FROM PATIENT UNION SELECT * FROM DONOR";
const donorDetailsSql = "SELECT * FROM DONOR";
const patientsDetailsSql = "SELECT * FROM PATIENT";
const getAllRequest = "SELECT * FROM REQUEST";
const getAllDonors = "SELECT * FROM DONOR_RECORD";
connection.query(patientUnionDonor, (error, results, fields) => {
  if (error) {
    console.error("Error connecting to MySQL:", error);
    return;
  }
  logindetails = results;
  // console.log('Query results:', logindetails);
});

connection.query(donorDetailsSql, (error, results, fields) => {
  if (error) {
    console.error("Error connecting to MySQL:", error);
    return;
  }
  donorDetails = results;
  // console.log('Query results:', donorDetails);
});

connection.query(patientsDetailsSql, (error, results, fields) => {
  if (error) {
    console.error("Error connecting to MySQL:", error);
    return;
  }
  patientsDetails = results;
  // console.log('Query results:', logindetails);
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/", (req, res) => {
  res.render("welcome");
});

// app.post('/loginapi', (req, res) => {
//   let userEmail  req.body.email
//   let userPass = req.body.password

//   donorDetails.forEach(element => {
//     if(element.D_EMAIL == userEmail && element.D_PSWD == userPass){
//       // res.render("form")
//       res.render("formpatient",{email:element.D_EMAIL.toLowerCase(),donorID:element.DONOR_ID,d:"Donor"})

//     }
//   });

//   patientsDetails.forEach(e => {
//     if(e.P_EMAIL == userEmail && e.P_PSWD == userPass){
//       // res.render("form")
//       res.render("formpatient",{email:e.P_EMAIL.toLowerCase(),patientID:e.PATIENT_ID,p:"Patient"})

//     }
//   });
// });
app.post("/loginapi", (req, res) => {
  let userEmail = req.body.email;
  let userPass = req.body.password;

  donorDetails.forEach((element) => {
    if (element.D_EMAIL == userEmail && element.D_PSWD == userPass) {
      // res.render("form")
      res.render("formpatient", {
        email: element.D_EMAIL.toLowerCase(),
        donorID: element.DONOR_ID,
        d: "Donor",
        formAction: "/donorapi",
      });
    }
  });

  patientsDetails.forEach((e) => {
    if (e.P_EMAIL == userEmail && e.P_PSWD == userPass) {
      // res.render("form")
      res.render("formpatient", {
        email: e.P_EMAIL.toLowerCase(),
        patientID: e.PATIENT_ID,
        p: "Patient",
        formAction: "/patientapi",
      });
    }
  });
  app.post("/patientapi", (req, res) => {
    let bld_grp = req.body.bld_grp;
    let units = req.body.units;
    let date;
    let PT_ID = req.body.PT_ID;
    // ab ham patient ka data request me put kraha hain
    console.log(req.body);
    let patientReqSql =
      "INSERT INTO REQUEST (PATIENT_ID,UNITS,BLOOD_GRP_REQ,TO_DATE,STATUS) VALUES(?,?,?,?,?)";
    let curDate = "SELECT curdate() FROM DUAL;";
    connection.query(curDate, (error, results, fields) => {
      if (error) {
        console.error("Error connecting to MySQL:", error);
        return;
      }
      date = results;
    });

    connection.query(
      patientReqSql,
      [ parseInt(PT_ID), units, bld_grp, date, "Pending"],
      (error, results, fields) => {
        if (error) {
          console.error("Error connecting to MySQL:", error);
          return;
        }
        console.log(results, fields, "results, fields");
      }
    );

    res.render("clock");
  });

  app.post("/donorapi", (req, res) => {
    let bld_grp = req.body.bld_grp;
    let units = req.body.units;
    let date;
    let DONOR_ID = req.body.DONOR_ID;
    // ab ham patient ka data request me put kraha hain
    console.log(req.body);
    let donorReqSql =
      "INSERT INTO DONOR_RECORD (DONOR_ID,D_UNITS,D_DATE_DON) VALUES(?,?,?)";
    let curDate = "SELECT curdate() FROM DUAL;";
    connection.query(curDate, (error, results, fields) => {
      if (error) {
        console.error("Error connecting to MySQL:", error);
        return;
      }
      date = results;
    });

    connection.query(
      donorReqSql,
      [parseInt(DONOR_ID), units, new Date()],
      (error, results, fields) => {
        if (error) {
          console.error("Error connecting to MySQL:", error);
    res.render("error", {
      errorMessage: error?.message
    });
    return;
        }
        console.log(results, fields, "results, fields");
    res.render("clock");
  }
    );

  });
  // connection.query(query, [email, password, email, password], (err, results) => {
  //   if (err) throw err;

  //   if (results.length > 0) {
  //     // Successful login
  //     res.redirect('/form');
  //   } else {
  //     // Unsuccessful login
  //     res.send('Invalid email or password');
  //   }
  // });
});

// Route for displaying form page
app.get("/form", (req, res) => {
  res.render("formpatient");
}); 

app.get("/signup", (req, res) => {
  res.render("signup");
});


// Route for displaying form page
app.get("/submit", (req, res) => {
  res.render("clock");
});

app.get("/get-all-requests", (req, res) => {
  connection.query(getAllRequest, (error, results, fields) => {
    if (error) {
      console.error("Error connecting to MySQL:", error);
      return;
    }
    res.json(results);
    // console.log('Query results:', logindetails);
  });
});

app.get("/get-all-donors", (req, res) => {
  connection.query(getAllDonors, (error, results, fields) => {
    if (error) {
      console.error("Error connecting to MySQL:", error);
      return;
    }
    res.json(results);
    // console.log('Query results:', logindetails);
  });
});

//trying gpt code to send data from the form to database

// Route for handling form submission
app.post("/submit", (req, res) => {
  const { email, units, blood_group } = req.body; // Extract form data

  console.log("req.body", req.body);

  // Query to find if user is a patient or donor
  const query = `
    SELECT 'PATIENT' AS role, PATIENT_ID AS id FROM PATIENT WHERE P_EMAIL = ?
    UNION
    SELECT 'DONOR' AS role, DONOR_ID AS id FROM DONOR WHERE D_EMAIL = ?
    `;
  connection.query(query, [email, email], (err, results) => {
    if (err) throw err;

    console.log(results);
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
  console.log(`Example app listening on port ${port}`);
});

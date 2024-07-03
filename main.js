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
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/", (req, res) => {
  res.render("welcome");
});

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
  });
});

app.post("/signupform", (req, res) => {
  let Firstname = req.body.Firstname;
  let Lastname = req.body.Lastname;
  let Number = req.body.Number;
  let gender = req.body.gender;
  let user = req.body.user;
  let email = req.body.email;
  let password = req.body.password;
  let repassword = req.body.repassword;
  let address = req.body.address;
  let DOB = req.body.DOB;
  console.log("User:", user);
  console.log(req.body)
  
  // ab ham user ka data respective table me put kraha hain
  if (user==="patient") {
    let userSql = "INSERT INTO PATIENT (P_FIRST_NAME, P_LAST_NAME, P_CONTACT_NO, P_GENDER, P_EMAIL, P_PSWD, P_ADDRESS, P_DOB) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    connection.query(userSql,[Firstname, Lastname, Number, gender, email, password, address, DOB],(error, results, fields) => {
        if (error) {
          console.error("Error in inserting the query:", error);
    res.render("error", {
      errorMessage: error?.message
    });
    return;
        }
        console.log("Insertionresults:",results);
    res.render("formpatient",{ formAction: "/patientapi" });
  }
    );
    
  }else if (user === "donor") {
    const userSql = "INSERT INTO DONOR (D_FIRST_NAME, D_LAST_NAME, D_CONTACT_NO, D_GENDER, D_EMAIL, D_PSWD, D_ADDRESS, D_DOB) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    connection.query(userSql, [Firstname, Lastname, Number, gender, email, password, address, DOB], (error, results, fields) => {
      if (error) {
        console.error("Error in inserting the query:", error);
        res.render("error", { errorMessage: error.message });
        return;
      }
      console.log("Insertion results:", results);
      res.render("formpatient");
    });
  }
  console.log(req.body);

});
const patienttable = "SELECT * FROM PATIENT";
app.get("/Patienttable", (req, res) => {
  connection.query(patienttable, (error, results, fields) => {
    if (error) {
      console.error("Error connecting to MySQL:", error);
      return;
    }
    res.json(results);
    console.log('Query results:', results);
  });
});
const donortable = "SELECT * FROM DONOR";
app.get("/DonorTable", (req, res) => {
  connection.query(donortable, (error, results, fields) => {
    if (error) {
      console.error("Error connecting to MySQL:", error);
      return;
    }
    res.json(results);
    console.log('Query results:', results);
  });
});
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

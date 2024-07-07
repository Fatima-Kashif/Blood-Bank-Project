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
let stock  = [];
let requests=[]
let totalDonor, totalRequest;
let totalUnits;
let count=0;
// Fetch maximum donor ID
connection.query("SELECT MAX(DONOR_ID) AS maxDonorID FROM DONOR", (error, results) => {
  if (error) {
    console.error("Error connecting to MySQL:", error);
    return;
  }
  totalDonor = results[0].maxDonorID;
  console.log(results);
});

// Fetch maximum patient ID
connection.query("SELECT MAX(REQ_ID) AS maxPatientID FROM REQUEST", (error, results) => {
  if (error) {
    console.error("Error connecting to MySQL:", error);
    return;
  }
  totalRequest = results[0].maxPatientID;
  console.log(results);
});
let total_units;

// SQL query to get the sum of all units in the stock table
const getTotalUnitsSql = "SELECT SUM(TOT_UNIT) AS total_units FROM STOCK";

// Function to fetch total units
// function fetchTotalUnits() {
  connection.query(getTotalUnitsSql, (error, results) => {
    if (error) {
      console.error("Error retrieving total units from MySQL:", error);
      return;
    }
    total_units = results[0].total_units || 0;
    // console.log(results);
  });

app.get("/stock", (req, res) => {
  res.render("stock",  {totalDonor : totalDonor, totalRequest:  totalRequest,total_units:total_units});
});

const patientUnionDonor = "SELECT * FROM PATIENT UNION SELECT * FROM DONOR";
const donorDetailsSql = "SELECT * FROM DONOR";
const patientsDetailsSql = "SELECT * FROM PATIENT";
const getAllRequest = "SELECT * FROM REQUEST";
const getAllDonors = "SELECT * FROM DONOR_RECORD";
const getallstock= "SELECT * FROM STOCK";
const adminID= "admin@gmail.com"
const adminpswd="bloodbank"
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
// connection.query("SELECT * FROM STOCK", (error, results, fields) => {
//   if (error) {
//     console.error("Error connecting to MySQL:", error);
//     return;
//   }
//   stock = results;

//   const bloodUnits = {};

//   // Iterate through the array and save total units for each blood group in a variable
//   stock.forEach(item => {
//     bloodUnits[item.BLOOD_GROUP] = item.TOT_UNIT;
//   });

//   // Now you can access the total units of each blood group using the bloodUnits object
//   const totalAPlusUnits = bloodUnits['A+'];
//   const totalAMinusUnits = bloodUnits['A-'];
//   const totalABPlusUnits = bloodUnits['AB+'];
//   const totalABMinusUnits = bloodUnits['AB-'];
//   const totalBPlusUnits = bloodUnits['B+'];
//   const totalBMinusUnits = bloodUnits['B-'];
//   const totalOPlusUnits = bloodUnits['O+'];
//   const totalOMinusUnits = bloodUnits['O-'];

  // console.log('Total units of A+:', totalAPlusUnits);
  // console.log('Total units of A-:', totalAMinusUnits);
  // console.log('Total units of AB+:', totalABPlusUnits);
  // console.log('Total units of AB-:', totalABMinusUnits);
  // console.log('Total units of B+:', totalBPlusUnits);
  // console.log('Total units of B-:', totalBMinusUnits);
  // console.log('Total units of O+:', totalOPlusUnits);
  // console.log('Total units of O-:', totalOMinusUnits);

  // Any code that relies on the bloodUnits object should be placed here or called from here
// });


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

app.get("/admin", (req, res) => {
  res.render("admin");
});

app.get("/stock", (req, res) => {
  res.render("stock");
});


app.get("/showStock", (req, res) => {

    connection.query("SELECT * FROM STOCK", (error, results, fields) => {
      if (error) {
        console.error("Error connecting to MySQL:", error);
        return;
      }
      stock = results;
      console.log(stock);
    
      const bloodUnits = {};
    
      // Iterate through the array and save total units for each blood group in a variable
      stock.forEach(item => {
        bloodUnits[item.BLOOD_GROUP] = item.TOT_UNIT;
      });
    
      // Now you can access the total units of each blood group using the bloodUnits object
      const totalAPlusUnits = bloodUnits['A+'];
      const totalAMinusUnits = bloodUnits['A-'];
      const totalABPlusUnits = bloodUnits['AB+'];
      const totalABMinusUnits = bloodUnits['AB-'];
      const totalBPlusUnits = bloodUnits['B+'];
      const totalBMinusUnits = bloodUnits['B-'];
      const totalOPlusUnits = bloodUnits['O+'];
      const totalOMinusUnits = bloodUnits['O-'];
    
      // console.log('Total units of A+:', totalAPlusUnits);
      // console.log('Total units of A-:', totalAMinusUnits);
      // console.log('Total units of AB+:', totalABPlusUnits);
      // console.log('Total units of AB-:', totalABMinusUnits);
      // console.log('Total units of B+:', totalBPlusUnits);
      // console.log('Total units of B-:', totalBMinusUnits);
      // console.log('Total units of O+:', totalOPlusUnits);
      // console.log('Total units of O-:', totalOMinusUnits);

      res.json({totalAPlusUnits,
      totalAMinusUnits,
      totalABPlusUnits,
        totalABMinusUnits,
        totalBPlusUnits,
        totalBMinusUnits,
        totalOPlusUnits,
        totalOMinusUnits})
  
      
    });
});


app.post("/loginapi", (req, res) => {
  let userEmail = req.body.email;
  let userPass = req.body.password;
  
  if (userEmail === adminID && userPass === adminpswd) {
    res.render("admin")
  }


  donorDetails.forEach((element) => {
    if (element.D_EMAIL == userEmail && element.D_PSWD == userPass) {
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
      res.render("formpatient", {
        email: e.P_EMAIL.toLowerCase(),
        patientID: e.PATIENT_ID,
        p: "Patient",
        formAction: "/patientapi",
      });
    }
  });
})
  // app.post("/patientapi", (req, res) => {
  //   let bld_grp = req.body.bld_grp;
  //   let units = req.body.units;
  //   let reqdate;
  //   let PT_ID = req.body.PT_ID;
  //   // ab ham patient ka data request me put kraha hain
  //   console.log(req.body);
  //   let patientReqSql =
  //     "INSERT INTO REQUEST (PATIENT_ID,UNITS,BLOOD_GRP_REQ,TO_DATE,STATUS) VALUES(?,?,?,?,?)";
  //   let curDate = "SELECT curdate() FROM DUAL;";
  //   connection.query(curDate, (error, results, fields) => {
  //     if (error) {
  //       console.error("Error connecting to MySQL:", error);
  //       return;
  //     }
  //     reqdate = results;
  //     console.log(reqdate);
  //   });
  // // Query to get the existing blood group requests for the patient
  // let getPatientBloodGroupsSql = "SELECT BLOOD_GRP_REQ FROM REQUEST WHERE PATIENT_ID = ?";
  
  // connection.query(getPatientBloodGroupsSql, [PT_ID], (error, results) => {
  //   if (error) {
  //     console.error("Error querying patient's blood group requests:", error);
  //     res.render("error", {
  //       errorMessage: "An error occurred while processing your request. Please try again later."
  //     });
  //     return;
  //   }

  //   // Check if there are previous requests and if they match the current blood group request
  //   if (results.length > 0) {
  //     const previousBloodGroups = results.map(row => row.BLOOD_GRP_REQ);
  //     const uniqueBloodGroups = new Set(previousBloodGroups);
  //     if (uniqueBloodGroups.size > 1 || (uniqueBloodGroups.size === 1 && !uniqueBloodGroups.has(bld_grp))) {
  //       // Patient has requested different blood groups
  //       res.render("error", {
  //         errorMessage: "You have previously requested a different blood group. Patients cannot request different blood groups."
  //       });
  //       return;
  //     }
  //   }
  //   let ptstock;
  //   stock.forEach(element => {
  //     if(element.BLOOD_GROUP == bld_grp){
  //       ptstock = element.TOT_UNIT
  //       if (ptstock==0 || ptstock<units){
  //         console.log("Your request has been rejected");
  //       }
  //     }
  //   });

  //   let ptdcStock = `UPDATE STOCK SET TOT_UNIT = ? WHERE BLOOD_GROUP  = ?`;
  //   connection.query(ptdcStock,[ptstock-parseInt(units),bld_grp], (error, results, fields) => 
  //     {
  //     if (error) {
  //       console.error("Error connecting to MySQL:", error);
  //       return;
  //     }
  //     else{
  //        count=count+1;
  //     }
  //   });
  //   app.get("/stock", (req, res) => {
  //     res.render("stock",  {count:count});
  //   });

  //   connection.query(
  //     patientReqSql,
  //     [ parseInt(PT_ID), units, bld_grp, reqdate, "Pending"],
  //     (error, results, fields) => {
  //       if (error) {
  //         console.error("Error connecting to MySQL:", error);
  //         return;
  //       }
  //       console.log(results, fields, "results, fields");
  //     }
  //   );

  //   res.render("clock");
  // });
  app.post("/patientapi", (req, res) => {
    let bld_grp = req.body.bld_grp;
    let units = req.body.units;
    let reqdate;
    let PT_ID = req.body.PT_ID;
  
    // Query to get the existing blood group requests for the patient
    let getPatientBloodGroupsSql = "SELECT BLOOD_GRP_REQ FROM REQUEST WHERE PATIENT_ID = ?";
    
    connection.query(getPatientBloodGroupsSql, [PT_ID], (error, results) => {
      if (error) {
        console.error("Error querying patient's blood group requests:", error);
        res.render("error", {
          errorMessage: "An error occurred while processing your request. Please try again later.1"
        });
        return;
      }
  
      // Check if there are previous requests and if they match the current blood group request
      if (results.length > 0) {
        const previousBloodGroups = results.map(row => row.BLOOD_GRP_REQ);
        const uniqueBloodGroups = new Set(previousBloodGroups);
        if (uniqueBloodGroups.size > 1 || (uniqueBloodGroups.size === 1 && !uniqueBloodGroups.has(bld_grp))) {
          // Patient has requested different blood groups
          res.render("error", {
            errorMessage: "You have previously requested a different blood group. Patients cannot request different blood groups."
          });
          return;
        }
      } 
      
  
      // Continue with the request as the blood group matches
      let patientReqSql = "INSERT INTO REQUEST (PATIENT_ID, UNITS, BLOOD_GRP_REQ, TO_DATE, STATUS) VALUES(?, ?, ?, ?, ?)";
      // let curDate = "SELECT DATE_FORMAT(CURDATE(), '%Y-%m-%d') AS currentDate;";
      // connection.query(curDate, (error, results) => {
      //   if (error) {
      //     console.error("Error fetching current date:", error);
      //     res.render("error", {
      //       errorMessage: "An error occurred while processing your request. Please try again later.2"
      //     });
      //     return;
      //   }
        let reqdate = new Date();
        let hasError = false; // Add a flag to indicate an error
        let ptstock;
        
        connection.query("SELECT * FROM STOCK", (error, results, fields) => {
          if (error) {
            console.error("Error connecting to MySQL:", error);
            return;
          }
        stock = results;
        console.log("stock",stock)
        stock.forEach(element =>{
          console.log("element",element)
          if (element.BLOOD_GROUP == bld_grp) {
            console.log(element.BLOOD_GROUP)
            ptstock = element.TOT_UNIT;}
            if (ptstock == 0 || ptstock < units) {
              console.log("Your request has been rejected");
              hasError = true; //
              connection.query(
                patientReqSql,
                [parseInt(PT_ID), units, bld_grp, reqdate, "Rejected"],
                (error, results) => {
                  if (error) {
                    console.error("Error inserting patient request:", error);
                    res.render("error", {
                      errorMessage: "You cannot make more than one request in a day."
                    });
                    return;
                  }
                  res.render("clock");
                }
              );
            return res.render("error", {
                errorMessage: "Insufficient stock for the requested blood group."
              });
            }
          
        });
       
        if (hasError) {
          return; // Exit the function if there was an error
        }
  
        let ptdcStock = `UPDATE STOCK SET TOT_UNIT = ? WHERE BLOOD_GROUP = ?`;
        connection.query(ptdcStock, [ptstock - parseInt(units), bld_grp], (error, results) => {
          console.log("results",results)
          if (error) {
            console.error("Error updating stock:", error);
            res.render("error", {
              errorMessage: "An error occurred while processing your request. Please try again later.3"
            });
            return;
          }
          count++;
          app.get("/stock", (req, res) => {
            res.render("stock", { count: count });
          });
  
          connection.query(
            patientReqSql,
            [parseInt(PT_ID), units, bld_grp, reqdate, "Approved"],
            (error, results) => {
              if (error) {
                console.error("Error inserting patient request:", error);
                res.render("error", {
                  errorMessage: "An error occurred while processing your request. Please try again later4."
                });
                return;
              }
              res.render("clock");
            }
          );
        });
      });
    });
    });

  
  app.post("/donorapi", (req, res) => {
    let bld_grp = req.body.bld_grp;
    let units = req.body.units;
    let date;
    let DONOR_ID = req.body.DONOR_ID;
    let flagGrp,flagStk
    stock.forEach(element => {
      if(element.BLOOD_GROUP == bld_grp){
        flagGrp = bld_grp
        flagStk = element.TOT_UNIT
      }
      // console.log(flagGrp)
      // console.log(flagStk)
      
    });
    let getDonorBloodGroupSql = "SELECT D_BLOOD_GROUP FROM DONOR_RECORD WHERE DONOR_ID = ?";
    
    connection.query(getDonorBloodGroupSql, [DONOR_ID], (error, results) => {
      if (error) {
        console.error("Error querying patient's blood group requests:", error);
        res.render("error", {
          errorMessage: "An error occurred while processing your request. Please try again later."
        });
        return;
      }
  
      // Check if there are previous requests and if they match the current blood group request
      if (results.length > 0) {
        const previousBloodGrps = results.map(row => row.D_BLOOD_GROUP);
        const uniqueBloodGrps = new Set(previousBloodGrps);
        if (uniqueBloodGrps.size > 1 || (uniqueBloodGrps.size === 1 && !uniqueBloodGrps.has(bld_grp))) {
          // Patient has requested different blood groups
          res.render("error", {
            errorMessage: "You have previously requested a different blood group. Donors cannot donate different blood groups."
          });
          return;
        }
      } 
    // ab ham donor ka data donor record me put kraha hain
    console.log(req.body);
    let donorReqSql =
      "INSERT INTO DONOR_RECORD (DONOR_ID,D_UNITS,D_DATE_DON,D_BLOOD_GROUP) VALUES(?,?,?,?)";
    let curDate = "SELECT curdate() FROM DUAL;";
    connection.query(curDate, (error, results, fields) => {
      if (error) {
        console.error("Error connecting to MySQL:", error);
        return;
      }
      date = results;
    });
    let dbincStock = `UPDATE STOCK SET TOT_UNIT = ? WHERE BLOOD_GROUP  = ?`;
    connection.query(dbincStock,[flagStk+parseInt(units),flagGrp], (error, results, fields) => {
      if (error) {
        console.error("Error connecting to MySQL:", error);
        return;
      }
    });
    connection.query(
      donorReqSql,
      [parseInt(DONOR_ID), units, new Date(),bld_grp],
      (error, results, fields) => {
        if (error) {
          console.error("Error connecting to MySQL:", error);
    res.render("error", {errorMessage: "You cannot donate more than one time in a day."
    });
    return;
        }
        console.log(results, fields, "results, fields");
    res.render("clock");
  }
    );

  });

});
// this is the API FOR STOCK
app.post("/stock", (req, res) => {
  res.json(stock)
}); 

app.get("/donorRecord", (req, res) => {
  connection.query(donorDetailsSql, (error, results, fields) => {
    if (error) {
      console.error("Error connecting to MySQL:", error);
      return;
    }
    res.render('donorRecord',{donorDetails : results})
  });
});

app.get("/donationrecords", (req, res) => {
  connection.query(getAllDonors, (error, results, fields) => {
    if (error) {
      console.error("Error connecting to MySQL:", error);
      return;
    }
    res.render('donationrec',{donation: results})
  });
});

app.get("/patient", (req, res) => {
  connection.query(patientsDetailsSql, (error, results, fields) => {
    if (error) {
      console.error("Error connecting to MySQL:", error);
      return;
    }
    res.render('patientRecord',{patientsDetails: results})
  });
});

app.get("/request", (req, res) => {
  
  connection.query(getAllRequest, (error, results, fields) => {
    if (error) {
      console.error("Error connecting to MySQL:", error);
      return;
    }
    res.render('request',{requests: results})
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

app.get("/getallstock", (req, res) => {
  connection.query(getallstock, (error, results, fields) => {
    if (error) {
      console.error("Error connecting to MySQL:", error);
      return;
    }
    res.json(results);
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
    // console.log('Query results:', results);
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
    // console.log('Query results:', results);
  });
});
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

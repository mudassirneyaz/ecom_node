const cors = require("cors");
const express = require("express");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const app = express();
app.use(bodyParser.json());
const db = require("./dbConfig");
const { hashPassword, comparePassword } = require("./bcrypt");
app.use(cors({ origin: "*" }));

// app.get("/test", (req, res) => {
//   return res.send({
//     name: "Mudassir",
//     email: "puranamail@gmail.com",
//     phone: "8603842059",
//   });
// });

app.post("/signup", async (req, res) => {
    const body = req.body;
    console.log(body);
    body.password = await hashPassword(body.password);
    console.log("Inserting to database:", body);
    const query = db.query(
      "INSERT INTO users SET ?",
      body,
      (err, res, field) => {
        if (err) {
          console.log("Query Error", err);
          return res.send({
            error: err.message
        })
        }
      }
    );
    console.log(query.sql);
    return res.send({
      msg: "Data saved successfully",
    });
     
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  db.query(
    "SELECT * FROM `users` WHERE `email` = ?",
    [email],
    async function (error, results, fields) {
      if (error) {
        console.log("Query error while login");
      }
      if (!results.length) {
        return res.send({
          msg: "User " + email + " not found",
        });
      }
      console.log(results);
      console.log(results[0].password);
      const hashPassword = results[0].password;
      const comparePass = await comparePassword(password, hashPassword);
      console.log(comparePass);
      if (!comparePass) {
        return res.send({
          msg: "Incorrect username or password",
        });
      }
      const user = {
        id: results[0].id,
        email: results[0].email,
      };
      const token = jwt.sign(user, "mfkndslgh5485");
      return res.send({
        msg: "Logged in successfully",
        token: token,
        data: results[0],
      });
    }
  );
});

app.listen(3000, () => {
  console.log("server running at 3000");
});

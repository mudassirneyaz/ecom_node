const cors = require("cors");
const express = require("express");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const multipart = require("connect-multiparty");
const app = express();
const path = require("path");
app.use(bodyParser.json());
const db = require("./dbConfig");
const multipartMiddleware = multipart();
const { hashPassword, comparePassword } = require("./bcrypt");
const fs = require("fs");
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
  const query = db.query("INSERT INTO users SET ?", body, (err, res, field) => {
    if (err) {
      console.log("Query Error", err);
      return res.send({
        error: err.message,
      });
    }
  });
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

app.get("/getUser/:id", async (req, resp) => {
  const { id } = req.params;
  db.query(
    "select * from users where id = ?",
    [id],
    async function (error, results, fields) {
      if (error) {
        console.log("Some error occured");
      }
      return resp.send({
        data: results,
        msg: "Fetched Successfully",
      });
    }
  );
});

app.post("/product", async (req, res) => {
  const body = req.body;
  console.log(body);
  const query = db.query(
    "INSERT INTO product SET ?",
    body,
    (err, res, field) => {
      if (err) {
        console.log("Query Error", err);
        return res.send({
          error: err.message,
        });
      }
    }
  );
  console.log(query.sql);
  return res.send({
    msg: "Data saved successfully",
  });
});

app.post("/uploadproduct", multipartMiddleware, function (req, resp) {
  // console.log(req.body, req.files);
  // don't forget to delete all req.files when done
  const file = req.files["image"];
  const extn = path.extname(file.name);
  console.log(file);
  const oldpath = file.path;
  const newpath =
    `C:\\Users\\Afsar\\Desktop\\LearmingExperience\\ecom_node\\images\\` +
    Date.now()+extn;
  fs.rename(oldpath, newpath, function (err) {
    if (err) throw err;
    fs.unlink(file.path,()=>
    {
      console.log("Deleted")
    });
    return resp.send({
      msg: "Data uploaded successfully",
      data: Date.now() + extn,
    });
  });
});

app.get("/getProduct", async (req, resp) => {
  db.query(
    "select * from product",
    async function (error, results, fields) {
      if (error) {
        console.log("Some error occured");
      }
      return resp.send({
        data: results,
        msg: "Fetched Successfully",
      });
    }
  );
});

app.get("/getProduct/:id", async (req, resp) => {
  const { id } = req.params;
  db.query(
    "select * from product where id = ?", [id],
    async function (error, results, fields) {
      if (error) {
        console.log("Some error occured");
      }
      return resp.send({
        data: results[0],
        msg: "Fetched Successfully",
      });
    }
  );
});

app.post("/editProduct", async (req, resp) => {
  const body = req.body;  
  db.query(
    "UPDATE product SET product = ?, price = ?, quantity = ?, thumbnail = ?, photo = ? , desccription = ? WHERE id = ?", [body.product, body.price, body.quantity, body.thumbnail, body.photo, body.desccription, body.id],
    async function (error, results, fields) {
      if (error) {
        console.log("Some error occured");
      }
      return resp.send({
        data: results,
        msg: "Edited Successfully",
      });
    }
  );
});

app.listen(3000, () => {
  console.log("server running at 3000");
});

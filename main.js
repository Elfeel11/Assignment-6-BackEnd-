const express = require("express");
const fs = require("fs");
const path = require("path");

port = 3000;

const app = express();

app.use(express.json());

const usersPath = path.resolve("./users.json");
const users = JSON.parse(fs.readFileSync(usersPath, { encoding: "utf-8" }));

app.post("/addUser", (req, res) => {
  const body = req.body;
  const userExit = users.find((value) => {
    return value.email == body.email;
  });

  if (userExit) {
    res.status(409).json({ message: `Email ${body.email} already exist.` });
    return;
  }

  users.push(body);
  fs.writeFileSync(usersPath, JSON.stringify(users));
  res
    .status(201)
    .json({ message: `User added successfully.`, allUusers: users });
  return;
});

app.patch("/updateUserAge/:id", (req, res) => {
  const { id } = req.params;
  const { age } = req.body;
  const userById = users.find((value) => {
    return value.id == id;
  });
  if (!userById) {
    res.status(404).json({ message: "User ID is not found" });
    return;
  }
  userById.age = age;
  fs.writeFileSync(usersPath, JSON.stringify(users));
  res.status(200).json({ message: `User age updated successfully.`, userById });
  return;
});

app.delete("/deleteUser{/:id}", (req, res) => {
  const { id } = req.params;
  const userIndex = users.findIndex((value) => {
    return value.id == id;
  });
  if (userIndex == -1) {
    res.status(404).json({ message: "User ID is not found" });
    return;
  }
  users.splice(userIndex, 1);
  fs.writeFileSync(usersPath, JSON.stringify(users));
  res.status(200).json({ message: `User Deleted Successfully.`, users });
  return;
});

app.get("/getUserByName", (req, res) => {
  const { name } = req.query;
  const userByName = users.find((value) => {
    return value.userName == name;
  });
  if (!userByName) {
    res.status(404).json({ message: "Username is not found" });
    return;
  }
  res.status(200).json({ userByName });
  return;
});

app.get("/allUsers", (req, res) => {
  res.status(200).json({ users });
  return;
});

app.get("/users/filter", (req, res) => {
  const { minAge } = req.query;

  const usersAge = users.filter((value) => {
    return value.age >= minAge;
  });
  console.log(usersAge);

  if (usersAge) {
    res.json(usersAge);
    return;
  }

  res.json({ message: "No Users Found" });

  res.status(200).json({ users });
  return;
});

app.get("/getUser/:id", (req, res) => {
  const { id } = req.params;
  const userById = users.find((value) => {
    return value.id == id;
  });
  if (!userById) {
    res.status(404).json({ message: "User ID is not found" });
    return;
  }
  res.status(200).json({ userById });
  return;
});

app.listen(port, () => {
  console.log(`server run on ${port} `);
  return;
});

app.all("{/*e}", (req, res) => {
  res.status(404).json({ message: "invalid URL or Method" });
  return;
});

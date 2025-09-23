const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { supabase } = require("../config/supabase");

const router = express.Router();

// POST /auth/signup
router.post("/signup", async (req, res) => {
  try {
    const { firstName, lastName, email, password, dateOfBirth, mobile } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ error: "All required fields must be provided" });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // insert into Supabase
    const { data, error } = await supabase.from("users").insert([
      {
        first_name: firstName,
        last_name: lastName,
        email,
        password: hashedPassword,
        date_of_birth: dateOfBirth,
        mobile_number: mobile,
      },
    ]);

    if (error) return res.status(400).json({ error: error.message });

    return res.status(201).json({ message: "User registered successfully", user: data[0] });
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

// POST /auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const { data: users, error } = await supabase.from("users").select("*").eq("email", email);

    if (error || users.length === 0) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) return res.status(401).json({ error: "Invalid email or password" });

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    return res.json({ message: "Login successful", token });
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;

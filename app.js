// Basic imports
require('dotenv').config();
const express = require("express");
const cors = require("cors");
const { MongoClient } = require('mongodb');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Database setup
const dbUrl = process.env.MONGODB_URI || "mongodb+srv://amiraashraf0210:amiraashraf0210@cluster0.u3m2tfe.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const dbName = "students_db";
const client = new MongoClient(dbUrl);

// Connect to database
let db;
client.connect()
    .then(() => {
        console.log("Connected to database");
        db = client.db(dbName);
    })
    .catch(err => {
        console.error("Database connection error:", err);
        process.exit(1);
    });

// Demo student
app.get("/add-hardcoded-student", async (req, res) => {
    try {
        const student = {
            name: "student",
            age: 20,
            level: "Junior",
            address: "123 Main St"
        };

        await db.collection("students").insertOne(student);
        res.send("Test student added successfully");
    } catch (error) {
        console.error("Error adding demo student:", error);
        res.status(500).send("Could not add test student");
    }
});

// Students APIs
app.post("/add-student", async (req, res) => {
    try {
        await db.collection("students").insertOne(req.body);
        res.send("Student added successfully");
    } catch (error) {
        console.error("Error adding student:", error);
        res.status(500).send("Could not add student");
    }
});

app.get("/fetch-students", async (req, res) => {
    try {
        const studentsList = await db.collection("students").find().toArray();
        res.send(studentsList);
    } catch (error) {
        console.error("Error fetching students:", error);
        res.status(500).send("Could not get students list");
    }
});

app.delete("/delete-student", async (req, res) => {
    try {
        await db.collection("students").deleteOne({ name: req.query.name });
        res.send("Student removed successfully");
    } catch (error) {
        console.error("Error deleting student:", error);
        res.status(500).send("Could not remove student");
    }
});

app.put("/update-student", async (req, res) => {
    try {
        const result = await db.collection("students").updateOne(
            { name: req.body.name },
            { $set: req.body }
        );
        if (result.matchedCount === 0) {
            return res.status(404).json({ error: "Student not found" });
        }
        res.json({ message: "Student updated successfully" });
    } catch (error) {
        console.error("Error updating student:", error);
        res.status(500).json({ error: "Could not update student" });
    }
});

// Doctors APIs
app.get("/add-doctor", async (req, res) => {
    try {
        const doctor = {
            name: req.query.name,
            age: parseInt(req.query.age),
            phone: req.query.phone
        };
        await db.collection("doctors").insertOne(doctor);
        res.send("Doctor added successfully");
    } catch (error) {
        console.error("Error adding doctor:", error);
        res.status(500).send("Could not add doctor");
    }
});

app.get("/fetch-doctors", async (req, res) => {
    try {
        const doctorsList = await db.collection("doctors").find().toArray();
        res.send(doctorsList);
    } catch (error) {
        console.error("Error fetching doctors:", error);
        res.status(500).send("Could not get doctors list");
    }
});

app.delete("/delete-doctor", async (req, res) => {
    try {
        await db.collection("doctors").deleteOne({ name: req.query.name });
        res.send("Doctor removed successfully");
    } catch (error) {
        console.error("Error deleting doctor:", error);
        res.status(500).send("Could not remove doctor");
    }
});

app.put("/update-doctor", async (req, res) => {
    try {
        const result = await db.collection("doctors").updateOne(
            { name: req.body.name },
            { $set: req.body }
        );
        if (result.matchedCount === 0) {
            return res.status(404).json({ error: "Doctor not found" });
        }
        res.json({ message: "Doctor updated successfully" });
    } catch (error) {
        console.error("Error updating doctor:", error);
        res.status(500).json({ error: "Could not update doctor" });
    }
});

app.put("/update-doctor-full", async (req, res) => {
    try {
        await db.collection("doctors").updateOne(
            { name: req.body.name },
            { $set: req.body }
        );
        res.send("Doctor updated successfully");
    } catch (error) {
        console.error("Error updating doctor:", error);
        res.status(500).send("Could not update doctor");
    }
});

// Get all data
app.get("/fetch-all", async (req, res) => {
    try {
        const [studentsList, doctorsList] = await Promise.all([
            db.collection("students").find().toArray(),
            db.collection("doctors").find().toArray()
        ]);
        res.send({
            students: studentsList,
            doctors: doctorsList
        });
    } catch (error) {
        console.error("Error fetching all data:", error);
        res.status(500).send("Could not get data");
    }
});

app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`);
});
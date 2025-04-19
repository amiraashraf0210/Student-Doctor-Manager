const express = require("express");
const cors = require("cors");
const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize empty arrays
let students = [];
let doctors = [];

// Helper function to find a student by name
const findStudentByName = (name) => students.find(s => s.name === name);

// Helper function to find a doctor by name
const findDoctorByName = (name) => doctors.find(d => d.name === name);

// 1. Add a New Student (Hardcoded)
app.get("/add-hardcoded-student", (req, res) => {
    try {
        const hardcodedStudent = {
            name: "Ahmed",
            age: 20,
            level: "Junior",
            address: "123 Main St"
        };
        students.push(hardcodedStudent);
        res.json({ message: "Hardcoded student added successfully", student: hardcodedStudent });
    } catch (error) {
        console.error("Error adding hardcoded student:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// 2. Add a New Student (From Request Body)
app.post("/add-student", (req, res) => {
    const { name, age, level, address } = req.body;
    if (!name || !age || !level || !address) {
        return res.status(400).json({ error: "All fields are required" });
    }
    const student = { name, age: Number(age), level, address };
    students.push(student);
    res.json({ message: "Student added successfully", student });
});

// 3. Add a New Doctor (From Query Parameters)
app.get("/add-doctor", (req, res) => {
    const { name, age, phone } = req.query;
    if (!name || !age || !phone) {
        return res.status(400).json({ error: "All fields are required" });
    }
    const doctor = { name, age: Number(age), phone };
    doctors.push(doctor);
    res.json({ message: "Doctor added successfully", doctor });
});

// 4. Fetch All Students
app.get("/fetch-students", (req, res) => {
    res.json(students);
});

// 5. Delete a Student
app.delete("/delete-student", (req, res) => {
    const { name } = req.query;
    const index = students.findIndex(s => s.name === name);
    if (index === -1) {
        return res.status(404).json({ error: "Student not found" });
    }
    students.splice(index, 1);
    res.json({ message: "Student deleted successfully" });
});

// 6. Update a Doctor's Name
app.put("/update-doctor-name", (req, res) => {
    const { oldName, newName } = req.query;
    const doctor = doctors.find(d => d.name === oldName);
    if (!doctor) {
        return res.status(404).json({ error: "Doctor not found" });
    }
    doctor.name = newName;
    res.json({ message: "Doctor name updated successfully", doctor });
});

// 7. Fetch Both Lists
app.get("/fetch-all", (req, res) => {
    try {
        res.json({ students, doctors });
    } catch (error) {
        console.error("Error fetching all data:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Additional endpoints for the frontend
app.get("/fetch-doctors", (req, res) => {
    res.json(doctors);
});

app.get("/search-student", (req, res) => {
    const { name } = req.query;
    const student = students.find(s => s.name === name);
    if (!student) {
        return res.status(404).json({ error: "Student not found" });
    }
    res.json(student);
});

app.get("/search-doctor", (req, res) => {
    const { name } = req.query;
    const doctor = doctors.find(d => d.name === name);
    if (!doctor) {
        return res.status(404).json({ error: "Doctor not found" });
    }
    res.json(doctor);
});

app.put("/update-student", (req, res) => {
    const { name, age, level, address } = req.body;
    const index = students.findIndex(s => s.name === name);
    if (index === -1) {
        return res.status(404).json({ error: "Student not found" });
    }
    students[index] = { name, age: Number(age), level, address };
    res.json({ message: "Student updated successfully", student: students[index] });
});

app.put("/update-doctor-full", (req, res) => {
    const { name, age, phone } = req.body;
    const index = doctors.findIndex(d => d.name === name);
    if (index === -1) {
        return res.status(404).json({ error: "Doctor not found" });
    }
    doctors[index] = { name, age: Number(age), phone };
    res.json({ message: "Doctor updated successfully", doctor: doctors[index] });
});

// Delete a doctor
app.delete("/delete-doctor", (req, res) => {
    const { name } = req.query;
    const index = doctors.findIndex(d => d.name === name);
    if (index === -1) {
        return res.status(404).json({ error: "Doctor not found" });
    }
    doctors.splice(index, 1);
    res.json({ message: "Doctor deleted successfully" });
});

app.listen(port, () => {
    console.log(`Server is running on localhost:${port}`);
});
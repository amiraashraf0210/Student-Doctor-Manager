const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGODB_URI = "mongodb+srv://amiraashraf0210:amiraashraf0210@cluster0.u3m2tfe.mongodb.net/students_db?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(MONGODB_URI)
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.error("Could not connect to MongoDB:", err));

// Student Schema
const studentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    age: { type: Number, required: true },
    level: { type: String, required: true },
    address: { type: String, required: true }
});

const Student = mongoose.model("Student", studentSchema);

// Doctor Schema
const doctorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    age: { type: Number, required: true },
    phone: { type: String, required: true }
});

const Doctor = mongoose.model("Doctor", doctorSchema);

// 1. Add a New Student (Hardcoded)
app.get("/add-hardcoded-student", async (req, res) => {
    try {
        const hardcodedStudent = new Student({
            name: "student",
            age: 20,
            level: "Junior",
            address: "123 Main St"
        });

        const savedStudent = await hardcodedStudent.save();
        res.json({ message: "Hardcoded student added successfully", student: savedStudent });
    } catch (error) {
        console.error("Error adding hardcoded student:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// 2. Add a New Student (From Request Body)
app.post("/add-student", async (req, res) => {
    try {
        const { name, age, level, address } = req.body;
        if (!name || !age || !level || !address) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const student = new Student({
            name,
            age: Number(age),
            level,
            address
        });

        const savedStudent = await student.save();
        res.json({ message: "Student added successfully", student: savedStudent });
    } catch (error) {
        console.error("Error adding student:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// 3. Add a New Doctor (From Query Parameters)
app.get("/add-doctor", async (req, res) => {
    try {
        const { name, age, phone } = req.query;
        if (!name || !age || !phone) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const doctor = new Doctor({
            name,
            age: Number(age),
            phone
        });

        const savedDoctor = await doctor.save();
        res.json({ message: "Doctor added successfully", doctor: savedDoctor });
    } catch (error) {
        console.error("Error adding doctor:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// 4. Fetch All Students
app.get("/fetch-students", async (req, res) => {
    try {
        const students = await Student.find();
        res.json(students);
    } catch (error) {
        console.error("Error fetching students:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// 5. Delete a Student
app.delete("/delete-student", async (req, res) => {
    try {
        const { name } = req.query;
        const result = await Student.deleteOne({ name });
        if (result.deletedCount === 0) {
            return res.status(404).json({ error: "Student not found" });
        }
        res.json({ message: "Student deleted successfully" });
    } catch (error) {
        console.error("Error deleting student:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// 6. Update a Doctor's Name
app.put("/update-doctor-name", async (req, res) => {
    try {
        const { oldName, newName } = req.query;
        const result = await Doctor.findOneAndUpdate(
            { name: oldName },
            { name: newName },
            { new: true }
        );
        if (!result) {
            return res.status(404).json({ error: "Doctor not found" });
        }
        res.json({ message: "Doctor name updated successfully", doctor: result });
    } catch (error) {
        console.error("Error updating doctor name:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// 7. Fetch Both Lists
app.get("/fetch-all", async (req, res) => {
    try {
        const students = await Student.find();
        const doctors = await Doctor.find();
        res.json({ students, doctors });
    } catch (error) {
        console.error("Error fetching all data:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Additional endpoints
app.get("/fetch-doctors", async (req, res) => {
    try {
        const doctors = await Doctor.find();
        res.json(doctors);
    } catch (error) {
        console.error("Error fetching doctors:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.put("/update-student", async (req, res) => {
    try {
        const { name, age, level, address } = req.body;
        const result = await Student.findOneAndUpdate(
            { name },
            { name, age: Number(age), level, address },
            { new: true }
        );
        if (!result) {
            return res.status(404).json({ error: "Student not found" });
        }
        res.json({ message: "Student updated successfully", student: result });
    } catch (error) {
        console.error("Error updating student:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.put("/update-doctor-full", async (req, res) => {
    try {
        const { name, age, phone } = req.body;
        const result = await Doctor.findOneAndUpdate(
            { name },
            { name, age: Number(age), phone },
            { new: true }
        );
        if (!result) {
            return res.status(404).json({ error: "Doctor not found" });
        }
        res.json({ message: "Doctor updated successfully", doctor: result });
    } catch (error) {
        console.error("Error updating doctor:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.delete("/delete-doctor", async (req, res) => {
    try {
        const { name } = req.query;
        const result = await Doctor.deleteOne({ name });
        if (result.deletedCount === 0) {
            return res.status(404).json({ error: "Doctor not found" });
        }
        res.json({ message: "Doctor deleted successfully" });
    } catch (error) {
        console.error("Error deleting doctor:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.listen(port, () => {
    console.log(`Server is running on localhost:${port}`);
});
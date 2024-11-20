const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Route to fetch and render data
app.get('/', (req, res) => {
    console.log("Received request for the home page");

    // Read the summary.json file
    fs.readFile('./summary.json', 'utf8', (err, data) => {
        if (err) {
            console.error("Error reading summary.json:", err);
            return res.status(500).send('Error loading data');
        }

        const summary = JSON.parse(data);

        // Log the parsed summary data
        console.log("Parsed summary data:", summary);

        // Extract startDate and endDate from the summary or your data
        const startDate = summary.startDate; 
        const endDate = summary.endDate;

        // Log the startDate and endDate
        console.log("Start Date:", startDate);
        console.log("End Date:", endDate);

        // Extract subjects and student counts
        const subjects = summary.details.subjects.map(subject => subject.subject);
        const studentCounts = summary.details.subjects.map(subject => subject.studentCount);

        // Log the subjects and student counts
        console.log("Subjects:", subjects);
        console.log("Student Counts:", studentCounts);

        // Pass the data to the EJS template
        res.render('index', {
            title: "BBM",
            studentQuantity: summary.totalStudents,
            teacherQuantity: summary.totalTeachers,
            subjectQuantity: summary.totalSubjects,
            startDate: startDate, // Make sure startDate is passed
            endDate: endDate,     // Make sure endDate is passed
            details: summary.details,
            subjects: subjects,   // Passing subjects data
            studentCounts: studentCounts // Passing studentCounts data
        });
    });
});

// Start the server
app.listen(PORT, () => {
    console.log("Baanbaimai dashboard is running on", PORT);
});
const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    fs.readFile('./summary.json', 'utf8', (err, data) => {
        if (err) {
            console.error("Error reading summary.json:", err);
            return res.status(500).send('Error loading data');
        }

        const summary = JSON.parse(data);

        // Pagination setup
        const page = parseInt(req.query.page) || 1; // Default to page 1 if not provided
        const itemsPerPage = 10;
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const totalPages = Math.ceil(summary.details.students.length / itemsPerPage);

        const paginatedStudents = summary.details.students.slice(startIndex, endIndex);

        res.render('index', {
            title: "BBM",
            studentQuantity: summary.totalStudents,
            teacherQuantity: summary.totalTeachers,
            subjectQuantity: summary.totalSubjects,
            startDate: summary.startDate,
            endDate: summary.endDate,
            details: {
                ...summary.details,
                students: paginatedStudents
            },
            subjects: summary.details.subjects.map(subject => subject.subject),
            studentCounts: summary.details.subjects.map(subject => subject.studentCount),
            pagination: {
                current: page,
                total: totalPages
            }
        });
    });
});

app.get('/api/students', (req, res) => {
    fs.readFile('./summary.json', 'utf8', (err, data) => {
        if (err) {
            console.error("Error reading summary.json:", err);
            return res.status(500).send('Error loading data');
        }

        const summary = JSON.parse(data);

        // Extract query parameters
        const page = parseInt(req.query.page) || 1;
        const itemsPerPage = 10;
        const search = req.query.search ? req.query.search.toLowerCase() : '';
        const subject = req.query.subject || '';

        // Filter students
        let filteredStudents = summary.details.students.filter(student => {
            const nameMatch = student.name.toLowerCase().includes(search);
            const subjectMatch = !subject || student.classes.includes(subject);
            return nameMatch && subjectMatch;
        });

        // Pagination
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
        const paginatedStudents = filteredStudents.slice(startIndex, endIndex);

        // Map students to include teacher data
        const studentsWithTeachers = paginatedStudents.map(student => ({
            ...student,
            teachers: summary.details.teachers.filter(teacher =>
                teacher.students.includes(student.id)
            ).map(teacher => teacher.name)
        }));

        res.json({
            students: studentsWithTeachers,
            totalStudents: filteredStudents.length,
            pagination: {
                current: page,
                total: totalPages
            }
        });
    });
});

app.get('/api/teachers', (req, res) => {
    fs.readFile('./summary.json', 'utf8', (err, data) => {
        if (err) {
            console.error("Error reading summary.json:", err);
            return res.status(500).send('Error loading data');
        }

        const summary = JSON.parse(data);

        // Map teachers with their subjects and students
        const teachers = summary.details.teachers.map(teacher => ({
            id: teacher.id,
            name: teacher.name,
            subjects: teacher.subjects, // List of subjects they teach
            students: summary.details.students.filter(student =>
                teacher.students.includes(student.id) // Students assigned to this teacher
            )
        }));

        res.json({ teachers });
    });
});

app.get('/api/subjects', (req, res) => {
    fs.readFile('./summary.json', 'utf8', (err, data) => {
        if (err) {
            console.error("Error reading summary.json:", err);
            return res.status(500).send('Error loading data');
        }

        const summary = JSON.parse(data);

        const subjects = summary.details.subjects.map(subject => ({
            name: subject.subject,
            studentCount: subject.studentCount,
            teachers: summary.details.teachers
                .filter(teacher => teacher.subjects.includes(subject.subject))
                .map(teacher => ({
                    id: teacher.id,
                    name: teacher.name
                })),
            students: summary.details.students
                .filter(student => student.classes.includes(subject.subject))
                .map(student => ({
                    id: student.id,
                    name: student.name
                }))
        }));

        res.json({ subjects });
    });
});

// Start the server
app.listen(PORT, () => {
    console.log("Baanbaimai dashboard is running on", PORT);
});
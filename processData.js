const fs = require('fs');

// Load the JSON file
const data = require('./bbm_nov.json');

// Initialize counts and sets for unique values and arrays to store more details
let uniqueStudents = new Map();
let uniqueTeachers = new Map(); // Changed to store teacher details along with subjects they teach and students they teach
let subjectStudentCount = new Map(); // To track the count of students per subject
let subjectTeacherCount = new Map(); // To track the count of teachers per subject
let uniqueSubjects = new Set();
let eventDates = []; // Array to store event dates for finding the min and max date

data.events.forEach(event => {
    // Add the date to the eventDates array
    eventDates.push(new Date(event.date));

    event.hours.forEach(hour => {
        hour.students.forEach(student => {
            // Add student details to a Map (student_id as key)
            if (!uniqueStudents.has(student.student_id)) {
                uniqueStudents.set(student.student_id, {
                    student_id: student.student_id,  // Store student_id here
                    name: student.title,              // Assuming 'title' is the student's name
                    classes: new Set()                // Store subjects/classes the student is enrolled in (class_name)
                });
            }
            // Add the student's class_name to their entry
            uniqueStudents.get(student.student_id).classes.add(student.class_name);
            
            // Add subject information to count the students
            if (!subjectStudentCount.has(student.class_name)) {
                subjectStudentCount.set(student.class_name, new Set());
            }
            subjectStudentCount.get(student.class_name).add(student.student_id);

            // Add subject information to the teacher map
            uniqueSubjects.add(student.class_name); // Add unique subjects

            // Add teacher details to the teacher map (with subjects they teach and students they teach)
            if (!uniqueTeachers.has(student.teacher_id)) {
                uniqueTeachers.set(student.teacher_id, {
                    teacher_id: student.teacher_id,
                    teacher_name: student.teacher_name, // Assuming 'teacher_name' exists in your data
                    subjects: new Set(),                // Store the subjects each teacher is teaching
                    students: new Set()                 // Store the students each teacher is teaching
                });
            }
            // Add the class_name (subject) to the teacher's list
            uniqueTeachers.get(student.teacher_id).subjects.add(student.class_name);
            // Add student to the teacher's list
            uniqueTeachers.get(student.teacher_id).students.add(student.student_id);

            // Add teacher to subjectTeacherCount map
            if (!subjectTeacherCount.has(student.class_name)) {
                subjectTeacherCount.set(student.class_name, new Set());
            }
            subjectTeacherCount.get(student.class_name).add(student.teacher_id);
        });
    });
});

// Calculate the start and end date (earliest and latest date)
const startDate = new Date(Math.min(...eventDates));
const endDate = new Date(Math.max(...eventDates));

// Function to format the date as DD/MM/YYYY
const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is zero-indexed
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
};

// Prepare the summary object with total counts and formatted dates
const summary = {
    totalStudents: uniqueStudents.size,
    totalTeachers: uniqueTeachers.size,
    totalSubjects: uniqueSubjects.size,
    totalEvents: data.events.length, // Count of events
    startDate: formatDate(startDate), // Format as DD/MM/YYYY
    endDate: formatDate(endDate),     // Format as DD/MM/YYYY
    details: {
        students: Array.from(uniqueStudents.values()).map(student => ({
            id: student.student_id,   // Add student_id here
            name: student.name,       // Pass the student's name
            classes: Array.from(student.classes) // Convert Set to Array for easier viewing
        })),
        teachers: Array.from(uniqueTeachers.values()).map(teacher => ({
            id: teacher.teacher_id,     // Add teacher_id
            name: teacher.teacher_name, // Add teacher_name
            subjects: Array.from(teacher.subjects), // Convert Set to Array to show the subjects
            students: Array.from(teacher.students)  // Convert Set to Array to show the students the teacher is teaching
        })),
        subjects: Array.from(uniqueSubjects).map(subject => ({
            subject: subject,
            studentCount: subjectStudentCount.get(subject).size, // Count of students for the subject
            teacherCount: subjectTeacherCount.get(subject).size  // Count of teachers teaching the subject
        }))
    }
};

// Export the summary as a JSON file
fs.writeFileSync('./summary.json', JSON.stringify(summary, null, 2));

console.log('Summary exported to summary.json');
const fs = require('fs');

class DataProcessor {
    constructor(jsonFilePath) {
        this.data = require(jsonFilePath);
        this.uniqueStudents = new Map();
        this.uniqueTeachers = new Map();
        this.subjectStudentCount = new Map();
        this.subjectTeacherCount = new Map();
        this.uniqueSubjects = new Set();
        this.eventDates = [];
    }

    processData() {
        this.data.events.forEach(event => {
            // Add the date to the eventDates array
            this.eventDates.push(new Date(event.date));

            event.hours.forEach(hour => {
                hour.students.forEach(student => {
                    this._processStudent(student);
                });
            });
        });

        return this._generateSummary();
    }

    _processStudent(student) {
        // Process student details
        if (!this.uniqueStudents.has(student.student_id)) {
            this.uniqueStudents.set(student.student_id, {
                student_id: student.student_id,
                name: student.title,
                classes: new Set()
            });
        }
        
        const studentEntry = this.uniqueStudents.get(student.student_id);
        studentEntry.classes.add(student.class_name);
        
        // Track subject student counts
        if (!this.subjectStudentCount.has(student.class_name)) {
            this.subjectStudentCount.set(student.class_name, new Set());
        }
        this.subjectStudentCount.get(student.class_name).add(student.student_id);

        // Track unique subjects
        this.uniqueSubjects.add(student.class_name);

        // Process teacher details
        this._processTeacher(student);
    }

    _processTeacher(student) {
        if (!this.uniqueTeachers.has(student.teacher_id)) {
            this.uniqueTeachers.set(student.teacher_id, {
                teacher_id: student.teacher_id,
                teacher_name: student.teacher_name,
                subjects: new Set(),
                students: new Set()
            });
        }

        const teacherEntry = this.uniqueTeachers.get(student.teacher_id);
        teacherEntry.subjects.add(student.class_name);
        teacherEntry.students.add(student.student_id);

        // Track subject teacher counts
        if (!this.subjectTeacherCount.has(student.class_name)) {
            this.subjectTeacherCount.set(student.class_name, new Set());
        }
        this.subjectTeacherCount.get(student.class_name).add(student.teacher_id);
    }

    _formatDate(date) {
        return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
    }

    _generateSummary() {
        const startDate = new Date(Math.min(...this.eventDates));
        const endDate = new Date(Math.max(...this.eventDates));

        return {
            totalStudents: this.uniqueStudents.size,
            totalTeachers: this.uniqueTeachers.size,
            totalSubjects: this.uniqueSubjects.size,
            totalEvents: this.data.events.length,
            startDate: this._formatDate(startDate),
            endDate: this._formatDate(endDate),
            details: {
                students: Array.from(this.uniqueStudents.values()).map(student => ({
                    id: student.student_id,
                    name: student.name,
                    classes: Array.from(student.classes)
                })),
                teachers: Array.from(this.uniqueTeachers.values()).map(teacher => ({
                    id: teacher.teacher_id,
                    name: teacher.teacher_name,
                    subjects: Array.from(teacher.subjects),
                    students: Array.from(teacher.students)
                })),
                subjects: Array.from(this.uniqueSubjects).map(subject => ({
                    subject: subject,
                    studentCount: this.subjectStudentCount.get(subject).size,
                    teacherCount: this.subjectTeacherCount.get(subject).size
                }))
            }
        };
    }

    exportSummary(outputPath = './summary.json') {
        const summary = this.processData();
        fs.writeFileSync(outputPath, JSON.stringify(summary, null, 2));
        console.log(`Summary exported to ${outputPath}`);
        return summary;
    }
}

// Usage
const processor = new DataProcessor('./bbm_nov.json');
const summary = processor.exportSummary();
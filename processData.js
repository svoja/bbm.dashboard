const fs = require('fs');

class DataProcessor {
    constructor(jsonFilePath) {
        const jsonData = require(jsonFilePath);
        this.data = jsonData.data.events;
        
        this.uniqueStudents = new Map();
        this.uniqueTeachers = new Map();
        this.subjectStudentCount = new Map();
        this.subjectTeacherCount = new Map();
        this.uniqueSubjects = new Set();
        this.eventDates = [];
    }

    checkData() {
        console.log("=== First Event Sample ===");
        console.log(JSON.stringify(this.data[0], null, 2));
        
        console.log("\n=== Data Length ===");
        console.log(this.data.length);
    }

    processData() {
        this.data.forEach(event => {
            const [day, month, year] = event.date.split('/');
            const dateStr = `20${year}-${month}-${day}`;
            this.eventDates.push(new Date(dateStr));

            event.hours.forEach(hour => {
                if (hour.students && hour.students.length > 0) {
                    hour.students.forEach(student => {
                        this._processStudent(student);
                    });
                }
            });
        });

        return this._generateSummary();
    }

    _processStudent(student) {
        // Changed to use bbm_id instead of student_id
        if (!this.uniqueStudents.has(student.bbm_id)) {
            this.uniqueStudents.set(student.bbm_id, {
                bbm_id: student.bbm_id,
                name: student.title || `Student ${student.bbm_id}`,
                classes: new Set()
            });
        }
        
        const studentEntry = this.uniqueStudents.get(student.bbm_id);
        if (student.class_name) {
            studentEntry.classes.add(student.class_name);
            
            if (!this.subjectStudentCount.has(student.class_name)) {
                this.subjectStudentCount.set(student.class_name, new Set());
            }
            this.subjectStudentCount.get(student.class_name).add(student.bbm_id);

            this.uniqueSubjects.add(student.class_name);
        }

        if (student.teacher_id) {
            this._processTeacher(student);
        }
    }

    _processTeacher(student) {
        if (!this.uniqueTeachers.has(student.teacher_id)) {
            this.uniqueTeachers.set(student.teacher_id, {
                teacher_id: student.teacher_id,
                teacher_name: student.teacher_name || `Teacher ${student.teacher_id}`,
                subjects: new Set(),
                students: new Set()
            });
        }

        const teacherEntry = this.uniqueTeachers.get(student.teacher_id);
        if (student.class_name) {
            teacherEntry.subjects.add(student.class_name);
        }
        // Changed to use bbm_id
        teacherEntry.students.add(student.bbm_id);

        if (student.class_name) {
            if (!this.subjectTeacherCount.has(student.class_name)) {
                this.subjectTeacherCount.set(student.class_name, new Set());
            }
            this.subjectTeacherCount.get(student.class_name).add(student.teacher_id);
        }
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
            totalEvents: this.data.length,
            startDate: this._formatDate(startDate),
            endDate: this._formatDate(endDate),
            details: {
                students: Array.from(this.uniqueStudents.values()).map(student => ({
                    bbm_id: student.bbm_id,  // Changed from id to bbm_id
                    name: student.name,
                    classes: Array.from(student.classes)
                })),
                teachers: Array.from(this.uniqueTeachers.values()).map(teacher => ({
                    id: teacher.teacher_id,
                    name: teacher.teacher_name,
                    subjects: Array.from(teacher.subjects),
                    students: Array.from(teacher.students)  // These are now bbm_ids
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
const processor = new DataProcessor('./data_19-24.json');
processor.checkData();
const summary = processor.exportSummary();
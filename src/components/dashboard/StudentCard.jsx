import React, { useState, useMemo } from 'react';
import { Search, ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import StudentDetailModal from './StudentDetailModal';

const ITEMS_PER_PAGE = 10;

// Thai translations
const translations = {
  studentOverview: 'ภาพรวมนักเรียน',
  searchPlaceholder: 'ค้นหานักเรียน...',
  allSubjects: 'วิชาทั้งหมด',
  allTeachers: 'ครูทั้งหมด',
  id: 'รหัส',
  name: 'ชื่อ',
  subjects: 'วิชา',
  teachers: 'ครูผู้สอน',
  showing: 'แสดง',
  to: 'ถึง',
  of: 'จาก',
  entries: 'รายการ',
  page: 'หน้า',
};

const StudentCard = ({ data }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedTeacher, setSelectedTeacher] = useState('all');
  const [selectedStudent, setSelectedStudent] = useState(null);

  const processStudentData = useMemo(() => {
    const studentMap = new Map();
    const subjects = new Set();
    const teachers = new Set();

    if (data?.data?.events) {
      data.data.events.forEach(day => {
        day.hours.forEach(hour => {
          hour.students.forEach(student => {
            if (!student.bbm_id) return;

            const studentId = student.bbm_id;
            if (!studentMap.has(studentId)) {
              studentMap.set(studentId, {
                id: studentId,
                name: student.title || 'No Name',
                subjects: new Set([student.class_name]),
                teachers: new Set([student.teacher_name]),
                details: []
              });
            }
            
            const studentData = studentMap.get(studentId);
            if (student.class_name) studentData.subjects.add(student.class_name);
            if (student.teacher_name) studentData.teachers.add(student.teacher_name);
            studentData.details.push({
              subject: student.class_name || 'No Subject',
              teacher: student.teacher_name || 'No Teacher',
              time: `${student.day_hours || ''} (${student.day || ''})`
            });

            if (student.class_name) subjects.add(student.class_name);
            if (student.teacher_name) teachers.add(student.teacher_name);
          });
        });
      });
    }

    // Safe sorting function
    const sortedStudents = Array.from(studentMap.values()).sort((a, b) => {
      if (!a.id && !b.id) return 0;
      if (!a.id) return 1;
      if (!b.id) return -1;

      // Try numeric sorting first
      const numA = parseInt(a.id);
      const numB = parseInt(b.id);
      if (!isNaN(numA) && !isNaN(numB)) {
        return numA - numB;
      }

      // Fall back to string comparison
      return a.id.toString().localeCompare(b.id.toString(), undefined, { numeric: true });
    });

    return {
      students: sortedStudents,
      subjects: Array.from(subjects),
      teachers: Array.from(teachers)
    };
  }, [data]);

  const filteredStudents = useMemo(() => {
    return processStudentData.students.filter(student => {
      const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          student.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSubject = selectedSubject === 'all' || 
                            Array.from(student.subjects).includes(selectedSubject);
      const matchesTeacher = selectedTeacher === 'all' || 
                            Array.from(student.teachers).includes(selectedTeacher);
      
      return matchesSearch && matchesSubject && matchesTeacher;
    });
  }, [processStudentData.students, searchTerm, selectedSubject, selectedTeacher]);

  const totalPages = Math.ceil(filteredStudents.length / ITEMS_PER_PAGE);
  const paginatedStudents = filteredStudents.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const getSubjectColor = (subject) => {
    const colors = [
      'bg-blue-100 text-blue-800',
      'bg-green-100 text-green-800',
      'bg-purple-100 text-purple-800',
      'bg-yellow-100 text-yellow-800',
      'bg-pink-100 text-pink-800'
    ];
    const index = processStudentData.subjects.indexOf(subject) % colors.length;
    return colors[index];
  };

  const getTeacherColor = (teacher) => {
    const colors = [
      'bg-red-100 text-red-800',
      'bg-indigo-100 text-indigo-800',
      'bg-orange-100 text-orange-800',
      'bg-teal-100 text-teal-800',
      'bg-cyan-100 text-cyan-800'
    ];
    const index = processStudentData.teachers.indexOf(teacher) % colors.length;
    return colors[index];
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{translations.studentOverview}</CardTitle>
        <div className="flex flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder={translations.searchPlaceholder}
              className="pl-10 pr-4 py-2 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex gap-2">
            <div className="relative">
              <Filter className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <select
                className="pl-10 pr-4 py-2 border rounded-lg appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
              >
                <option value="all">{translations.allSubjects}</option>
                {processStudentData.subjects.map(subject => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
              </select>
            </div>

            <div className="relative">
              <Filter className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <select
                className="pl-10 pr-4 py-2 border rounded-lg appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedTeacher}
                onChange={(e) => setSelectedTeacher(e.target.value)}
              >
                <option value="all">{translations.allTeachers}</option>
                {processStudentData.teachers.map(teacher => (
                  <option key={teacher} value={teacher}>{teacher}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2 font-semibold">{translations.id}</th>
                <th className="text-left p-2 font-semibold">{translations.name}</th>
                <th className="text-left p-2 font-semibold">{translations.subjects}</th>
                <th className="text-left p-2 font-semibold">{translations.teachers}</th>
              </tr>
            </thead>
            <tbody>
              {paginatedStudents.map((student) => (
                <tr key={student.id} className="border-b hover:bg-gray-50" onClick={() => setSelectedStudent(student)}>
                  <td className="p-2 font-medium">{student.id}</td>
                  <td className="p-2">{student.name}</td>
                  <td className="p-2">
                    <div className="flex flex-wrap gap-1">
                      {Array.from(student.subjects).map((subject) => (
                        <span
                          key={subject}
                          className={`px-3 py-1 rounded-full text-xs font-medium ${getSubjectColor(subject)}`}
                        >
                          {subject}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="p-2">
                    <div className="flex flex-wrap gap-1">
                      {Array.from(student.teachers).map((teacher) => (
                        <span
                          key={teacher}
                          className={`px-3 py-1 rounded-full text-xs font-medium ${getTeacherColor(teacher)}`}
                        >
                          {teacher}
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-gray-600">
            {translations.showing} {(currentPage - 1) * ITEMS_PER_PAGE + 1} {translations.to}{' '}
            {Math.min(currentPage * ITEMS_PER_PAGE, filteredStudents.length)} {translations.of}{' '}
            {filteredStudents.length} {translations.entries}
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="p-2 border rounded-lg disabled:opacity-50 hover:bg-gray-50"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="px-4 py-2">
              {translations.page} {currentPage} {translations.of} {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="p-2 border rounded-lg disabled:opacity-50 hover:bg-gray-50"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </CardContent>
      {selectedStudent && (
        <StudentDetailModal
          student={selectedStudent}
          onClose={() => setSelectedStudent(null)}
        />
      )}
    </Card>
  );
};

export default StudentCard;
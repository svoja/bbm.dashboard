import React, { useState, useMemo } from 'react';
import { Search, ChevronLeft, ChevronRight, Filter, Users, BookOpen, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import TeacherDetailModal from './TeacherDetailModal';

const ITEMS_PER_PAGE = 10;

// Thai translations
const translations = {
  teacherOverview: 'ภาพรวมครูผู้สอน',
  searchPlaceholder: 'ค้นหาครู...',
  allSubjects: 'วิชาทั้งหมด',
  id: 'รหัส',
  name: 'ชื่อ',
  subjects: 'วิชาที่สอน',
  studentCount: 'จำนวนนักเรียน',
  scheduleToday: 'ตารางสอนวันนี้',
  showing: 'แสดง',
  to: 'ถึง',
  of: 'จาก',
  entries: 'รายการ',
  page: 'หน้า',
  totalHours: 'จำนวนชั่วโมงสอน',
  schedule: 'ตารางสอน',
  hours: 'ชั่วโมง',
  students: 'นักเรียน'
};

const TeacherCard = ({ data }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedTeacher, setSelectedTeacher] = useState(null);

  // Process teacher data
  const processTeacherData = useMemo(() => {
    const teacherMap = new Map();
    const subjects = new Set();

    if (data?.data?.events) {
      data.data.events.forEach(day => {
        day.hours.forEach(hour => {
          hour.students.forEach(student => {
            const teacherId = student.teacher_id;
            const teacherName = student.teacher_name;
            
            if (!teacherMap.has(teacherId)) {
              teacherMap.set(teacherId, {
                id: teacherId,
                name: teacherName,
                subjects: new Set([student.class_name]),
                students: new Set([student.title]),
                schedule: [],
                totalHours: 0
              });
            }

            const teacherData = teacherMap.get(teacherId);
            teacherData.subjects.add(student.class_name);
            teacherData.students.add(student.title);
            teacherData.schedule.push({
              date: student.day,
              time: student.day_hours,
              subject: student.class_name,
              student: student.title,
              status: student.leave_conditions_session
            });
            teacherData.totalHours += 1;

            if (student.class_name) subjects.add(student.class_name);
          });
        });
      });
    }

    return {
      teachers: Array.from(teacherMap.values()),
      subjects: Array.from(subjects)
    };
  }, [data]);

  // Filter and search logic
  const filteredTeachers = useMemo(() => {
    return processTeacherData.teachers.filter(teacher => {
      const matchesSearch = teacher.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSubject = selectedSubject === 'all' || 
                            Array.from(teacher.subjects).includes(selectedSubject);
      
      return matchesSearch && matchesSubject;
    });
  }, [processTeacherData.teachers, searchTerm, selectedSubject]);

  // Pagination
  const totalPages = Math.ceil(filteredTeachers.length / ITEMS_PER_PAGE);
  const paginatedTeachers = filteredTeachers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Color generator for badges
  const getSubjectColor = (subject) => {
    const colors = [
      'bg-blue-100 text-blue-800',
      'bg-green-100 text-green-800',
      'bg-purple-100 text-purple-800',
      'bg-yellow-100 text-yellow-800',
      'bg-pink-100 text-pink-800'
    ];
    const index = processTeacherData.subjects.indexOf(subject) % colors.length;
    return colors[index];
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{translations.teacherOverview}</CardTitle>
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

          <div className="relative">
            <Filter className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <select
              className="pl-10 pr-4 py-2 border rounded-lg appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
            >
              <option value="all">{translations.allSubjects}</option>
              {processTeacherData.subjects.map(subject => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </select>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 gap-6">
          {paginatedTeachers.map((teacher) => (
            <div key={teacher.id} className="border rounded-lg p-4 hover:bg-gray-50"   onClick={() => setSelectedTeacher(teacher)}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Teacher Info */}
                <div className="space-y-3">
                  <h3 className="font-medium text-lg">{teacher.name}</h3>
                  <div className="flex flex-wrap gap-2">
                    {Array.from(teacher.subjects).map((subject) => (
                      <span
                        key={subject}
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getSubjectColor(subject)}`}
                      >
                        {subject}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Stats */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Users className="h-4 w-4" />
                    <span>{translations.students}: {teacher.students.size}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <BookOpen className="h-4 w-4" />
                    <span>{translations.subjects}: {teacher.subjects.size}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock className="h-4 w-4" />
                    <span>{translations.totalHours}: {teacher.totalHours}</span>
                  </div>
                </div>
                  
                {/* NO USE YET */}
                {/* Today's Schedule
                <div>
                  <h4 className="font-medium mb-2">{translations.scheduleToday}</h4>
                  <div className="space-y-2">
                    {teacher.schedule
                      .filter(session => session.date === new Date().toLocaleDateString())
                      .map((session, index) => (
                        <div key={index} className="text-sm bg-gray-100 rounded p-2">
                          <div className="font-medium">{session.time}</div>
                          <div className="text-gray-600">{session.student} - {session.subject}</div>
                        </div>
                      ))}
                  </div>
                </div> */}

              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-gray-600">
            {translations.showing} {(currentPage - 1) * ITEMS_PER_PAGE + 1} {translations.to}{' '}
            {Math.min(currentPage * ITEMS_PER_PAGE, filteredTeachers.length)} {translations.of}{' '}
            {filteredTeachers.length} {translations.entries}
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
      {selectedTeacher && (
          <TeacherDetailModal
            teacher={selectedTeacher}
            onClose={() => setSelectedTeacher(null)}
          />
        )}
    </Card>
  );
};

export default TeacherCard;
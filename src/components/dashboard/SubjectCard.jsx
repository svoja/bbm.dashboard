import React, { useState, useMemo } from 'react';
import { Search, ChevronLeft, ChevronRight, Users, GraduationCap, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { X } from 'lucide-react';

const ITEMS_PER_PAGE = 10;

// Thai translations
const translations = {
  subjectOverview: 'ภาพรวมวิชา',
  searchPlaceholder: 'ค้นหาวิชา...',
  name: 'ชื่อวิชา',
  teachers: 'ครูผู้สอน',
  students: 'นักเรียน',
  totalHours: 'จำนวนชั่วโมงสอน',
  showing: 'แสดง',
  to: 'ถึง',
  of: 'จาก',
  entries: 'รายการ',
  page: 'หน้า',
  hours: 'ชั่วโมง'
};

const SubjectDetailModal = ({ subject, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-2xl font-semibold">{subject.name}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-6 w-6" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="space-y-6">
            {/* Teachers */}
            <div>
              <h3 className="text-lg font-medium mb-3">ครูผู้สอน</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Array.from(subject.teachers).map((teacher) => (
                  <div key={teacher} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <GraduationCap className="h-5 w-5 text-blue-500" />
                    <span>{teacher}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Students */}
            <div>
              <h3 className="text-lg font-medium mb-3">นักเรียน</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from(subject.students).map((student) => (
                  <div key={student} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <Users className="h-5 w-5 text-green-500" />
                    <span>{student}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 border rounded-lg">
                <div className="text-sm text-gray-500">จำนวนครู</div>
                <div className="text-2xl font-semibold">{subject.teachers.size}</div>
              </div>
              <div className="p-4 border rounded-lg">
                <div className="text-sm text-gray-500">จำนวนนักเรียน</div>
                <div className="text-2xl font-semibold">{subject.students.size}</div>
              </div>
              <div className="p-4 border rounded-lg">
                <div className="text-sm text-gray-500">จำนวนชั่วโมงเรียน</div>
                <div className="text-2xl font-semibold">{subject.totalHours}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SubjectCard = ({ data }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSubject, setSelectedSubject] = useState(null);

  // Process subject data
  const processSubjectData = useMemo(() => {
    const subjectMap = new Map();

    if (data?.data?.events) {
      data.data.events.forEach(day => {
        day.hours.forEach(hour => {
          hour.students.forEach(student => {
            const subjectName = student.class_name;
            
            if (!subjectMap.has(subjectName)) {
              subjectMap.set(subjectName, {
                name: subjectName,
                teachers: new Set([student.teacher_name]),
                students: new Set([student.title]),
                totalHours: 0,
                schedule: []
              });
            }

            const subjectData = subjectMap.get(subjectName);
            subjectData.teachers.add(student.teacher_name);
            subjectData.students.add(student.title);
            subjectData.totalHours += 1;
            subjectData.schedule.push({
              date: student.day,
              time: student.day_hours,
              teacher: student.teacher_name,
              student: student.title
            });
          });
        });
      });
    }

    return Array.from(subjectMap.values());
  }, [data]);

  // Filter and search logic
  const filteredSubjects = useMemo(() => {
    return processSubjectData.filter(subject =>
      subject.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [processSubjectData, searchTerm]);

  // Pagination
  const totalPages = Math.ceil(filteredSubjects.length / ITEMS_PER_PAGE);
  const paginatedSubjects = filteredSubjects.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{translations.subjectOverview}</CardTitle>
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder={translations.searchPlaceholder}
            className="pl-10 pr-4 py-2 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 gap-6">
          {paginatedSubjects.map((subject) => (
            <div
              key={subject.name}
              onClick={() => setSelectedSubject(subject)}
              className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <h3 className="font-medium text-lg">{subject.name}</h3>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <GraduationCap className="h-4 w-4" />
                  <span>{translations.teachers}: {subject.teachers.size}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Users className="h-4 w-4" />
                  <span>{translations.students}: {subject.students.size}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Clock className="h-4 w-4" />
                  <span>{translations.totalHours}: {subject.totalHours}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-gray-600">
            {translations.showing} {(currentPage - 1) * ITEMS_PER_PAGE + 1} {translations.to}{' '}
            {Math.min(currentPage * ITEMS_PER_PAGE, filteredSubjects.length)} {translations.of}{' '}
            {filteredSubjects.length} {translations.entries}
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

      {selectedSubject && (
        <SubjectDetailModal
          subject={selectedSubject}
          onClose={() => setSelectedSubject(null)}
        />
      )}
    </Card>
  );
};

export default SubjectCard;
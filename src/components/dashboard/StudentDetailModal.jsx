import React from 'react';
import { X, Calendar, Clock, CheckCircle2, XCircle } from 'lucide-react';

// Thai translations for the modal
const modalTranslations = {
  studentDetails: 'ข้อมูลนักเรียน',
  studentId: 'รหัสนักเรียน',
  name: 'ชื่อ',
  subjects: 'วิชาที่เรียน',
  teachers: 'ครูผู้สอน',
  schedule: 'ตารางเรียน',
  attendance: 'การเข้าเรียน',
  date: 'วันที่',
  time: 'เวลา',
  subject: 'วิชา',
  teacher: 'ครูผู้สอน',
  status: 'สถานะ',
  checkinTime: 'เวลาเข้าเรียน',
  checkoutTime: 'เวลาเลิกเรียน',
  close: 'ปิด'
};

const StudentDetailModal = ({ student, onClose }) => {
  // Sort sessions by date and time
  const sortedSessions = [...student.details].sort((a, b) => {
    return new Date(a.time) - new Date(b.time);
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden relative">
        {/* Header */}
        <div className="p-6 border-b flex justify-between items-center bg-gray-50">
          <h2 className="text-2xl font-semibold text-gray-800">
            {modalTranslations.studentDetails}
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-200 rounded-full transition-colors"
          >
            <X className="h-6 w-6 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="space-y-2">
              <p className="text-sm text-gray-500">{modalTranslations.studentId}</p>
              <p className="text-lg font-medium">{student.id}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-gray-500">{modalTranslations.name}</p>
              <p className="text-lg font-medium">{student.name}</p>
            </div>
          </div>

          {/* Subjects and Teachers */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="space-y-3">
              <h3 className="font-medium text-gray-700">{modalTranslations.subjects}</h3>
              <div className="flex flex-wrap gap-2">
                {Array.from(student.subjects).map((subject) => (
                  <span
                    key={subject}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                  >
                    {subject}
                  </span>
                ))}
              </div>
            </div>
            <div className="space-y-3">
              <h3 className="font-medium text-gray-700">{modalTranslations.teachers}</h3>
              <div className="flex flex-wrap gap-2">
                {Array.from(student.teachers).map((teacher) => (
                  <span
                    key={teacher}
                    className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm"
                  >
                    {teacher}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Schedule and Attendance */}
          <div className="space-y-4">
            <h3 className="font-medium text-gray-700 mb-4">{modalTranslations.schedule}</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="text-left p-3 font-medium text-gray-500">{modalTranslations.date}</th>
                    <th className="text-left p-3 font-medium text-gray-500">{modalTranslations.time}</th>
                    <th className="text-left p-3 font-medium text-gray-500">{modalTranslations.subject}</th>
                    <th className="text-left p-3 font-medium text-gray-500">{modalTranslations.teacher}</th>
                    <th className="text-left p-3 font-medium text-gray-500">{modalTranslations.status}</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedSessions.map((session, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span>{session.time.split(' ')[1]}</span>
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-gray-400" />
                          <span>{session.time.split(' ')[0]}</span>
                        </div>
                      </td>
                      <td className="p-3">{session.subject}</td>
                      <td className="p-3">{session.teacher}</td>
                      <td className="p-3">
                        {session.checkinTime ? (
                          <div className="flex items-center gap-2 text-green-600">
                            <CheckCircle2 className="h-4 w-4" />
                            <span>เข้าเรียน</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 text-red-600">
                            <XCircle className="h-4 w-4" />
                            <span>ขาดเรียน</span>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t p-6 bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            {modalTranslations.close}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentDetailModal;
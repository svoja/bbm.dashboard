import React from 'react';
import { X } from 'lucide-react';

const modalTranslations = {
  teacherDetails: 'ข้อมูลครูผู้สอน',
  teacherId: 'รหัสครู',
  name: 'ชื่อ',
  subjects: 'วิชาที่สอน',
  studentList: 'รายชื่อนักเรียน',
  close: 'ปิด',
  student: 'นักเรียน',
  subject: 'วิชา',
  time: 'เวลาเรียน',
  status: 'สถานะ'
};

const TeacherDetailModal = ({ teacher, onClose }) => {
  // Group sessions by student
  const studentSessions = Array.from(teacher.students).map(studentName => {
    const sessions = teacher.schedule.filter(session => session.student === studentName);
    return {
      name: studentName,
      sessions: sessions
    };
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden relative">
        {/* Header */}
        <div className="p-6 border-b flex justify-between items-center bg-gray-50">
          <h2 className="text-2xl font-semibold text-gray-800">
            {modalTranslations.teacherDetails}
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
              <p className="text-sm text-gray-500">{modalTranslations.teacherId}</p>
              <p className="text-lg font-medium">{teacher.id}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-gray-500">{modalTranslations.name}</p>
              <p className="text-lg font-medium">{teacher.name}</p>
            </div>
          </div>

          {/* Subjects */}
          <div className="mb-8">
            <h3 className="font-medium text-gray-700 mb-3">{modalTranslations.subjects}</h3>
            <div className="flex flex-wrap gap-2">
              {Array.from(teacher.subjects).map((subject) => (
                <span
                  key={subject}
                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                >
                  {subject}
                </span>
              ))}
            </div>
          </div>

          {/* Student List */}
          <div className="space-y-4">
            <h3 className="font-medium text-gray-700 mb-4">{modalTranslations.studentList}</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="text-left p-3 font-medium text-gray-500">{modalTranslations.student}</th>
                    <th className="text-left p-3 font-medium text-gray-500">{modalTranslations.subject}</th>
                    <th className="text-left p-3 font-medium text-gray-500">{modalTranslations.time}</th>
                    <th className="text-left p-3 font-medium text-gray-500">{modalTranslations.status}</th>
                  </tr>
                </thead>
                <tbody>
                  {studentSessions.map((studentData, index) => (
                    <React.Fragment key={index}>
                      {studentData.sessions.map((session, sessionIndex) => (
                        <tr key={`${index}-${sessionIndex}`} className="border-b hover:bg-gray-50">
                          <td className="p-3 font-medium">{session.student}</td>
                          <td className="p-3">{session.subject}</td>
                          <td className="p-3">{`${session.date} ${session.time}`}</td>
                          <td className="p-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              session.status === 'เรียนเสร็จ' 
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {session.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </React.Fragment>
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

export default TeacherDetailModal;
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import StudentCard from './StudentCard';
import TeacherCard from './TeacherCard';
import SubjectCard from './SubjectCard';

// Thai translations
const translations = {
  totalStudents: 'จำนวนนักเรียนทั้งหมด',
  totalSubjects: 'จำนวนวิชาทั้งหมด',
  totalTeachers: 'จำนวนครูทั้งหมด',
};

const Dashboard = ({ data }) => {
  // Get quick stats
  const getStats = () => {
    const students = new Set();
    const subjects = new Set();
    const teachers = new Set();

    if (data?.data?.events) {
      data.data.events.forEach(day => {
        day.hours.forEach(hour => {
          hour.students.forEach(student => {
            students.add(student.bbm_id);
            subjects.add(student.class_name);
            teachers.add(student.teacher_name);
          });
        });
      });
    }

    return {
      studentCount: students.size,
      subjectCount: subjects.size,
      teacherCount: teachers.size
    };
  };

  const stats = getStats();

  return (
    <div className="container mx-auto px-4">
      {/* Header */}
      <header className="mt-5">
        <div className="text-center">
          <h2 className="font-bold text-2xl">BAANBAIMAI DASHBOARD</h2>
          <p className="bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text">Made by Phanu</p>
          <p className="text-gray-500 text-sm mt-3">
            ข้อมูลจากวันที่ {data?.data?.events[0]?.date} ถึง {data?.data?.events[data?.data?.events.length - 1]?.date}
          </p>
        </div>
      </header>

      <div className="py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>{translations.totalStudents}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stats.studentCount}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{translations.totalSubjects}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stats.subjectCount}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{translations.totalTeachers}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stats.teacherCount}</p>
            </CardContent>
          </Card>
        </div>

        {/* Student Card */}
        <div className="mb-8">
          <StudentCard data={data} />
        </div>

        {/* Teacher Card */}
        <div className="mb-8">
          <TeacherCard data={data} />
        </div>

        {/* Subject Card */}
        <div>
          <SubjectCard data={data} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
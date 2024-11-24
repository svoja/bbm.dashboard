import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import StudentCard from './StudentCard';
import TeacherCard from './TeacherCard';
import SubjectCard from './SubjectCard';

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
    <div className="p-4 space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Students</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.studentCount}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Subjects</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.subjectCount}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Teachers</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.teacherCount}</p>
          </CardContent>
        </Card>
      </div>

      {/* Student Card */}
      <StudentCard data={data} />

      <TeacherCard data={data} />

      <SubjectCard data={data} />
    </div>
  );
};

export default Dashboard;
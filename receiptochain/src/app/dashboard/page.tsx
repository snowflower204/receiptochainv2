'use client';

import Sidebar from '@/app/sidebar';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';

// Register the necessary chart.js components
ChartJS.register(ArcElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function Dashboard() {
  // Pie Chart Data (Number of students who have paid)
  const paidData = {
    labels: ['Paid', 'Unpaid'],
    datasets: [
      {
        data: [70, 30], // 70 students paid, 30 students haven't
        backgroundColor: ['#34D399', '#F87171'],
        hoverOffset: 4,
      },
    ],
  };

  // Pie Chart Data (Paid students by course)
  const courseData = {
    labels: ['Math 101', 'CS 201', 'Bio 301', 'Eng 101'], // Courses
    datasets: [
      {
        data: [50, 30, 15, 20], // Example data: Number of paid students in each course
        backgroundColor: ['#6EE7B7', '#F9A8D4', '#38BDF8', '#34D399'],
        hoverOffset: 4,
      },
    ],
  };

  // Pie Chart Options
  const pieChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
  };

  // Data for students per year level and semester
  const studentData = {
    yearLevels: [
      { year: 'Year 1', students: 100 },
      { year: 'Year 2', students: 80 },
      { year: 'Year 3', students: 90 },
      { year: 'Year 4', students: 70 },
    ],
    semesters: [
      { semester: 'Spring', students: 120 },
      { semester: 'Fall', students: 220 },
    ],
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content area */}
      <div className="flex-1 ml-0 md:ml-64 p-8 space-y-8 transition-all duration-300">
        <h1 className="text-4xl font-semibold text-gray-800 mb-6">Dashboard</h1>

        {/* Total Money Collected Section */}
        <div className="bg-white shadow-xl rounded-xl p-6 mb-8 hover:shadow-2xl transition-shadow duration-300">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Total Money Collected</h2>
          <div className="text-5xl font-bold text-green-600">$15,200</div>
        </div>

        {/* Row for Pie Charts: Total Paid vs. Paid by Course */}
        <div className="flex space-x-8 mb-8">
          {/* Left Pie Chart: Total Paid vs Unpaid */}
          <div className="w-1/2 bg-white shadow-xl rounded-xl p-6 hover:shadow-2xl transition-shadow duration-300">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Total Students Paid</h2>
            <div className="h-80">
              <Pie data={paidData} options={pieChartOptions} />
            </div>
          </div>

          {/* Right Pie Chart: Paid Students by Course */}
          <div className="w-1/2 bg-white shadow-xl rounded-xl p-6 hover:shadow-2xl transition-shadow duration-300">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Paid Students by Course</h2>
            <div className="h-80">
              <Pie data={courseData} options={pieChartOptions} />
            </div>
          </div>
        </div>

        {/* Students per Year Level Section */}
        <div className="bg-white shadow-xl rounded-xl p-6 mb-8 hover:shadow-2xl transition-shadow duration-300">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Students per Year Level</h2>
          <div>
            {studentData.yearLevels.map((item) => (
              <div key={item.year} className="flex justify-between text-gray-600 mb-2">
                <span>{item.year}</span>
                <span className="font-semibold text-gray-900">{item.students} students</span>
              </div>
            ))}
          </div>
        </div>

        {/* Students per Semester Section */}
        <div className="bg-white shadow-xl rounded-xl p-6 mb-8 hover:shadow-2xl transition-shadow duration-300">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Students per Semester</h2>
          <div>
            {studentData.semesters.map((item) => (
              <div key={item.semester} className="flex justify-between text-gray-600 mb-2">
                <span>{item.semester}</span>
                <span className="font-semibold text-gray-900">{item.students} students</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

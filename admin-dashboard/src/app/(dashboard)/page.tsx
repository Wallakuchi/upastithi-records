"use client";

import { useEffect, useState } from "react";
import { attendanceApi } from "@/lib/api";
import { StatusBadge } from "@/components/StatusBadge";
import { Users, UserCheck, UserX, Clock, MapPin } from "lucide-react";

interface AttendanceStats {
  totalEmployees: number;
  presentToday: number;
  absentToday: number;
  lateArrivals: number;
  outsideOffice: number;
}

interface AttendanceLog {
  id: string;
  employee_name: string;
  check_in_time: string;
  check_out_time?: string;
  status: string;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<AttendanceStats | null>(null);
  const [logs, setLogs] = useState<AttendanceLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // LOCAL DATE (India-safe)
        const today = new Date().toLocaleDateString("en-CA");

        const response = await attendanceApi.getReport(today, today);

        if (response?.data) {
          const data = response.data;

          setStats({
            totalEmployees: data.totalEmployees || 0,
            presentToday: data.present || 0,
            absentToday: data.absent || 0,
            lateArrivals: data.late || 0,
            outsideOffice: data.outside_office || 0,
          });

          const formattedLogs =
            data.records?.map((item: any) => ({
              id: item.id,
              employee_name: item.employee?.name || "Unknown",
              check_in_time: item.check_in_time,
              check_out_time: item.check_out_time,
              status: item.attendance_status,
            })) || [];

          setLogs(formattedLogs.slice(0, 10));
        }

        setError(null);
      } catch (err) {
        console.error("Attendance fetch error:", err);
        setError("Failed to fetch attendance data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Total Employees"
          value={stats?.totalEmployees || 0}
          icon={<Users className="w-6 h-6" />}
          bgColor="bg-blue-50"
          textColor="text-blue-600"
        />
        <StatCard
          title="Present Today"
          value={stats?.presentToday || 0}
          icon={<UserCheck className="w-6 h-6" />}
          bgColor="bg-green-50"
          textColor="text-green-600"
        />
        <StatCard
          title="Absent Today"
          value={stats?.absentToday || 0}
          icon={<UserX className="w-6 h-6" />}
          bgColor="bg-red-50"
          textColor="text-red-600"
        />
        <StatCard
          title="Late Arrivals"
          value={stats?.lateArrivals || 0}
          icon={<Clock className="w-6 h-6" />}
          bgColor="bg-yellow-50"
          textColor="text-yellow-600"
        />
        <StatCard
          title="Outside Office"
          value={stats?.outsideOffice || 0}
          icon={<MapPin className="w-6 h-6" />}
          bgColor="bg-purple-50"
          textColor="text-purple-600"
        />
      </div>

      {/* Recent Attendance Logs */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-slate-900 mb-4">
          Recent Attendance Logs
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-left font-semibold text-slate-700">
                  Employee Name
                </th>
                <th className="px-6 py-3 text-left font-semibold text-slate-700">
                  Check-in Time
                </th>
                <th className="px-6 py-3 text-left font-semibold text-slate-700">
                  Check-out Time
                </th>
                <th className="px-6 py-3 text-left font-semibold text-slate-700">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {logs.length > 0 ? (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 text-slate-900">
                      {log.employee_name}
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {new Date(log.check_in_time).toLocaleTimeString()}
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {log.check_out_time
                        ? new Date(log.check_out_time).toLocaleTimeString()
                        : "-"}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={log.status} size="md" />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-4 text-center text-slate-500"
                  >
                    No attendance records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
  bgColor,
  textColor,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  bgColor: string;
  textColor: string;
}) {
  return (
    <div className={`${bgColor} rounded-lg p-6 border border-slate-200`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-slate-600 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-slate-900 mt-2">{value}</p>
        </div>
        <div className={`${textColor}`}>{icon}</div>
      </div>
    </div>
  );
}
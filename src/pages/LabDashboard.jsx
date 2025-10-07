import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import adminApi from '../services/api';
import { computeStats } from '../services/demo';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function LabDashboard() {
  const [stats, setStats] = useState({ totalPatients: 0, pendingReports: 0, completedReports: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const r = await adminApi.stats.get();
        setStats(r.data);
      } catch {
        setStats(computeStats());
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const chartData = useMemo(() => {
    const pending = stats.pendingReports || 0;
    const completed = stats.completedReports || 0;
    return {
      labels: ['Pending', 'Completed'],
      datasets: [
        {
          data: [pending, completed],
          backgroundColor: ['#f59e0b', '#10b981'],
          borderWidth: 0,
        },
      ],
    };
  }, [stats]);

  const chartOptions = useMemo(
    () => ({
      plugins: {
        legend: { display: true, position: 'bottom' },
      },
      cutout: '65%',
      responsive: true,
      maintainAspectRatio: false,
    }),
    []
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Lab Dashboard</h1>
          <div className="flex gap-2">
            <Link to="/patients/new" className="px-3 py-2 bg-white rounded shadow text-sm hover:bg-gray-50">New Patient</Link>
            <Link to="/reports/new" className="px-3 py-2 bg-red-600 text-white rounded shadow text-sm hover:bg-red-700">New Report</Link>
            <Link to="/reports" className="px-3 py-2 bg-white rounded shadow text-sm hover:bg-gray-50">View Reports</Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <StatCard label="Total Patients" value={stats.totalPatients} />
          <StatCard label="Pending Reports" value={stats.pendingReports} accent="text-yellow-700" />
          <StatCard label="Completed Reports" value={stats.completedReports} accent="text-green-700" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded shadow p-4 md:col-span-2">
            <div className="font-semibold mb-3">Workload Overview</div>
            <div className="h-64">
              <Doughnut data={chartData} options={chartOptions} />
            </div>
            <div className="flex justify-center gap-6 mt-4 text-sm">
              <div><span className="inline-block w-3 h-3 bg-yellow-500 rounded-sm mr-2" />Pending: <b>{stats.pendingReports}</b></div>
              <div><span className="inline-block w-3 h-3 bg-green-500 rounded-sm mr-2" />Completed: <b>{stats.completedReports}</b></div>
            </div>
          </div>
          <div className="bg-white rounded shadow p-4">
            <div className="font-semibold mb-3">Quick Actions</div>
            <ul className="space-y-2 text-sm">
              <li><Link to="/patients/new" className="text-red-600 hover:underline">Create new patient</Link></li>
              <li><Link to="/reports/new" className="text-red-600 hover:underline">Create new report</Link></li>
              <li><Link to="/reports" className="text-red-600 hover:underline">Manage reports</Link></li>
            </ul>
            <div className="mt-4 text-xs text-gray-500">Data shown combines live and local demo data when offline.</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, accent = '' }) {
  return (
    <div className="bg-white p-4 rounded shadow">
      <div className="text-gray-500">{label}</div>
      <div className={`text-3xl font-semibold ${accent}`}>{value}</div>
    </div>
  );
}



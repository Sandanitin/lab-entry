import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { reportsApi, statsApi } from '../services/api';
import { getReports, computeStats } from '../services/demo';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';

export default function Reports() {
  const [reports, setReports] = useState([]);
  const [stats, setStats] = useState({ totalPatients: 0, pendingReports: 0, completedReports: 0 });

  useEffect(() => {
    reportsApi.getAll().then((r) => setReports(r.data)).catch(() => setReports(getReports()));
    statsApi.get().then((r) => setStats(r.data)).catch(() => setStats(computeStats()));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-semibold">Reports</h1>
          <div className="flex gap-2">
            <Link to="/patients/new"><Button variant="outline">New Patient</Button></Link>
            <Link to="/reports/new"><Button>New Report</Button></Link>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
          <Card><CardContent> Total Patients: <b>{stats.totalPatients}</b></CardContent></Card>
          <Card><CardContent> Pending Reports: <b className="text-yellow-700">{stats.pendingReports}</b></CardContent></Card>
          <Card><CardContent> Completed Reports: <b className="text-green-700">{stats.completedReports}</b></CardContent></Card>
        </div>
        <Card>
          <CardHeader><CardTitle>All Reports</CardTitle></CardHeader>
          <CardContent className="overflow-x-auto">
            <table className="min-w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">Patient</th>
                <th className="text-left p-2">Category</th>
                <th className="text-left p-2">Status</th>
                <th className="text-left p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((r) => (
                <tr key={r._id} className="border-b hover:bg-gray-50">
                  <td className="p-2">{r.patient?.name}</td>
                  <td className="p-2">{r.category}</td>
                    <td className="p-2">
                      <Badge variant={r.status === 'completed' ? 'success' : 'warning'}>{r.status}</Badge>
                    </td>
                  <td className="p-2">
                      <button onClick={() => reportsApi.openPdf(r._id)} className="px-2 py-1 border rounded">View PDF</button>
                  </td>
                </tr>
              ))}
            </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}



import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { patientsApi, reportsApi } from '../services/api';
import { getPatients, addReport } from '../services/demo';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import Label from '../components/ui/Label';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Button from '../components/ui/Button';

export default function ReportForm() {
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [form, setForm] = useState({
    patient: '',
    category: 'Haematology',
    tests: [{ name: 'Hemoglobin', result: '', unit: 'g/dL', referenceRange: '13-17' }],
    status: 'pending',
    notes: '',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    patientsApi.getAll().then((r) => setPatients(r.data)).catch(() => setPatients(getPatients()));
  }, []);

  const addTest = () => setForm((p) => ({ ...p, tests: [...p.tests, { name: '', result: '', unit: '', referenceRange: '' }] }));
  const removeTest = (idx) => setForm((p) => ({ ...p, tests: p.tests.filter((_, i) => i !== idx) }));
  const updateTest = (idx, key, value) => setForm((p) => ({ ...p, tests: p.tests.map((t, i) => (i === idx ? { ...t, [key]: value } : t)) }));

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      try {
        await reportsApi.create(form);
      } catch {
        const patient = getPatients().find(p => p._id === form.patient);
        addReport({ ...form, patient });
      }
      navigate('/reports');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>New Lab Report</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={submit} className="space-y-4">
              <div>
                <Label htmlFor="patient">Patient</Label>
                <Select id="patient" name="patient" value={form.patient} onChange={(e) => setForm({ ...form, patient: e.target.value })} required>
                  <option value="">Select patient</option>
                  {patients.map((p) => (
                    <option key={p._id} value={p._id}>{p.name} ({p.age}/{p.gender})</option>
                  ))}
                </Select>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select id="category" name="category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                    <option>Haematology</option>
                    <option>Urine</option>
                    <option>Biochemistry</option>
                    <option>Other</option>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select id="status" name="status" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                  </Select>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <h2 className="font-medium">Tests</h2>
                  <Button type="button" variant="outline" onClick={addTest}>Add Test</Button>
                </div>
                <div className="space-y-3">
                  {form.tests.map((t, idx) => (
                    <div key={idx} className="grid grid-cols-1 md:grid-cols-4 gap-2">
                      <Input value={t.name} onChange={(e) => updateTest(idx, 'name', e.target.value)} placeholder="Test name" required />
                      <Input value={t.result} onChange={(e) => updateTest(idx, 'result', e.target.value)} placeholder="Result" required />
                      <Input value={t.unit} onChange={(e) => updateTest(idx, 'unit', e.target.value)} placeholder="Unit" />
                      <div className="flex gap-2">
                        <Input value={t.referenceRange} onChange={(e) => updateTest(idx, 'referenceRange', e.target.value)} placeholder="Reference" className="flex-1" />
                        <Button type="button" variant="outline" onClick={() => removeTest(idx)}>Remove</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="notes">Notes</Label>
                <textarea id="notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Notes" className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-red-500" rows={3} />
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => navigate(-1)}>Cancel</Button>
                <Button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save Report'}</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}



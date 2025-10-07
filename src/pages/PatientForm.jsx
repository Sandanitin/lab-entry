import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { patientsApi } from '../services/api';
import { addPatient } from '../services/demo';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import Label from '../components/ui/Label';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Button from '../components/ui/Button';

export default function PatientForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    age: '',
    gender: 'Male',
    doctor: '',
    contact: { phone: '', email: '' },
    address: '',
  });
  const [saving, setSaving] = useState(false);

  const onChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('contact.')) {
      const k = name.split('.')[1];
      setForm((p) => ({ ...p, contact: { ...p.contact, [k]: value } }));
    } else {
      setForm((p) => ({ ...p, [name]: value }));
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form, age: Number(form.age) };
      try {
        await patientsApi.create(payload);
      } catch {
        addPatient(payload);
      }
      navigate('/reports/new');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Patient Registration</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={submit} className="space-y-4">
              <div>
                <Label htmlFor="name">Full name</Label>
                <Input id="name" name="name" value={form.name} onChange={onChange} placeholder="Full name" required />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="age">Age</Label>
                  <Input id="age" name="age" type="number" value={form.age} onChange={onChange} placeholder="Age" required />
                </div>
                <div>
                  <Label htmlFor="gender">Gender</Label>
                  <Select id="gender" name="gender" value={form.gender} onChange={onChange}>
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="doctor">Referring doctor</Label>
                <Input id="doctor" name="doctor" value={form.doctor} onChange={onChange} placeholder="Doctor" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" name="contact.phone" value={form.contact.phone} onChange={onChange} placeholder="Phone" />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="contact.email" value={form.contact.email} onChange={onChange} placeholder="Email" />
                </div>
              </div>
              <div>
                <Label htmlFor="address">Address</Label>
                <Input id="address" name="address" value={form.address} onChange={onChange} placeholder="Address" />
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => navigate(-1)}>Cancel</Button>
                <Button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save'}</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}



const PKEY = 'demoPatients';
const RKEY = 'demoReports';

export function getPatients() {
  try {
    return JSON.parse(localStorage.getItem(PKEY) || '[]');
  } catch {
    return [];
  }
}

export function addPatient(patient) {
  const list = getPatients();
  const withId = { ...patient, _id: crypto.randomUUID(), createdAt: new Date().toISOString() };
  localStorage.setItem(PKEY, JSON.stringify([...list, withId]));
  return withId;
}

export function getReports() {
  try {
    return JSON.parse(localStorage.getItem(RKEY) || '[]');
  } catch {
    return [];
  }
}

export function addReport(report) {
  const list = getReports();
  const withId = { ...report, _id: crypto.randomUUID(), createdAt: new Date().toISOString() };
  localStorage.setItem(RKEY, JSON.stringify([...list, withId]));
  return withId;
}

export function computeStats() {
  const patients = getPatients();
  const reports = getReports();
  const pendingReports = reports.filter(r => r.status === 'pending').length;
  const completedReports = reports.filter(r => r.status === 'completed').length;
  return { totalPatients: patients.length, pendingReports, completedReports };
}



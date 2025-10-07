export default function ReportTemplate({ report }) {
  const patient = report.patient || {};
  const format = (d) => (d ? new Date(d).toLocaleString() : '-');

  return (
    <div className="bg-white text-gray-900 w-full md:max-w-[794px] mx-auto shadow print:shadow-none relative overflow-hidden p-3 md:p-0">
      {/* subtle watermark */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.04] flex items-center justify-center">
        <img src="/images/logo.png" alt="wm" className="w-[70%] max-w-[520px]" />
      </div>

      {/* Top colored bar */}
      <div className="h-1 w-full bg-orange-500" />

      {/* Top hospital header */}
      <div className="relative border-b">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <img src="/images/logo.png" alt="Hospital" className="h-8 md:h-10 w-auto" />
            <div>
              <div className="text-[9px] md:text-[10px] uppercase tracking-wider text-gray-600">DEPARTMENT OF LABORATORY MEDICINE</div>
              <div className="text-sm md:text-base font-semibold tracking-wide">CLINICAL PATHOLOGY REPORT</div>
            </div>
          </div>
          <div className="text-right text-[10px] md:text-[11px] leading-4">
            <div><span className="text-gray-500">Age</span> : {patient.age || '-'} <span className="ml-2"><span className="text-gray-500">Gender</span>: {patient.gender || '-'}</span></div>
            <div><span className="text-gray-500">Report Status</span> : <span className="font-semibold">{report.status?.toUpperCase() || '-'}</span></div>
            <div><span className="text-gray-500">Reported on</span> : {format(report.reportedAt)}</div>
          </div>
        </div>
        {/* Patient meta block */}
        <div className="px-4 pb-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[10px] md:text-[11px]">
            <div className="space-y-1">
              <Meta label="Patient Name" value={<span className="font-medium uppercase">{patient.name || '-'}</span>} />
              <Meta label="YH No." value={patient.yhNo || '-'} />
              <Meta label="Diag.No." value={patient.diagNo || '-'} />
              <Meta label="IP No." value={patient.ipNo || 'N/A'} />
              <Meta label="Specimen Type" value={report.category || '-'} />
              <Meta label="Ref.Doctor" value={patient.doctor || '-'} />
            </div>
            <div className="space-y-1">
              <Meta label="Billed on" value={format(patient.billedOn)} />
              <Meta label="Collected on" value={format(patient.collectedOn)} />
              <Meta label="Received on" value={format(patient.receivedOn)} />
              <Meta label="Reported on" value={format(report.reportedAt)} />
              <Meta label="Location" value={patient.location || 'OPD'} />
              <Meta label="Status" value={report.status || '-'} />
            </div>
          </div>
        </div>
      </div>

      {/* Section title */}
      <div className="text-center font-semibold text-[13px] tracking-wide py-2">CLINICAL PATHOLOGY</div>

      {/* Results table */}
      <div className="px-4 pb-4 relative">
        <div className="overflow-x-auto">
        <table className="w-full text-[10px] md:text-[11px] border border-gray-300 min-w-[520px]">
          <thead>
            <tr className="bg-gray-50">
              <Th className="w-1/2">Test</Th>
              <Th className="w-1/4">Results</Th>
              <Th className="w-1/4">Reference Range</Th>
            </tr>
          </thead>
          <tbody>
            {report.tests?.length ? (
              report.tests.map((t, i) => (
                <tr key={i} className={i % 2 ? 'bg-white' : 'bg-gray-50/40'}>
                  <Td>{t.name}</Td>
                  <Td>{t.result}{t.unit ? ` ${t.unit}` : ''}</Td>
                  <Td className="text-gray-600">{t.referenceRange || 'Nohpf'}</Td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="border p-2 text-gray-500" colSpan={3}>No tests added</td>
              </tr>
            )}
          </tbody>
        </table>
        </div>

        {report.notes ? (
          <div className="mt-4 text-[10px] md:text-[11px]"><span className="text-gray-600">Impression</span>: {report.notes}</div>
        ) : null}
      </div>

      {/* Footer / signature */}
      <div className="px-4 py-6 text-[11px] text-gray-600 border-t flex items-end justify-between">
        <div>Kindly co-relate results with clinical findings.</div>
        <div className="text-right">
          <div className="h-10" />
          <div className="font-medium">Consultant Pathologist</div>
        </div>
      </div>
    </div>
  );
}

function Meta({ label, value }) {
  return (
    <div>
      <span className="text-gray-600">{label}</span> : {value}
    </div>
  );
}

function Th({ children, className = '' }) {
  return (
    <th className={`border border-gray-300 p-2 text-left ${className}`}>{children}</th>
  );
}

function Td({ children, className = '' }) {
  return (
    <td className={`border border-gray-300 p-2 align-top ${className}`}>{children}</td>
  );
}



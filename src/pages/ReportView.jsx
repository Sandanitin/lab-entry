import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { reportsApi } from '../services/api';
import { getReports } from '../services/demo';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import ReportTemplate from '../components/ReportTemplate';

export default function ReportView() {
  const { id } = useParams();
  const [report, setReport] = useState(null);
  const printRef = useRef(null);

  useEffect(() => {
    reportsApi.getById(id)
      .then((r) => setReport(r.data))
      .catch(() => {
        // Fallback to demo/local storage
        const demo = getReports().find((x) => x._id === id);
        if (demo) setReport(demo);
      });
  }, [id]);

  const printLocal = () => {
    if (!printRef.current) return;
    const content = printRef.current.innerHTML;
    const w = window.open('', 'printwin');
    if (!w) return;
    w.document.write(`<!doctype html><html><head><title>Report</title>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="stylesheet" href="/index.css" />
      <style>@page{size:A4;margin:12mm} body{background:#fff} .no-print{display:none}</style>
    </head><body>${content}</body></html>`);
    w.document.close();
    w.focus();
    w.print();
    w.close();
  };
  const downloadPdf = () => {
    reportsApi.downloadPdf(id).catch(async () => {
      // Fallback: generate PDF from current report payload via backend
      if (!report) return printLocal();
      try {
        const data = await reportsApi.generatePdf(report, { download: true });
        const blob = new Blob([data], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `report-${id}.pdf`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(() => URL.revokeObjectURL(url), 60_000);
      } catch {
        // Final fallback: create a PDF from the on-screen template so layout matches exactly
        await downloadFromDom();
      }
    });
  };

  const ensureLib = (url, globalCheck) =>
    new Promise((resolve, reject) => {
      if (globalCheck()) return resolve();
      const s = document.createElement('script');
      s.src = url;
      s.async = true;
      s.onload = () => resolve();
      s.onerror = () => reject(new Error('Failed to load ' + url));
      document.body.appendChild(s);
    });

  const downloadFromDom = async () => {
    if (!printRef.current) return printLocal();
    // Load html2canvas and jsPDF from CDN only when needed
    await ensureLib('https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js', () => window.html2canvas);
    await ensureLib('https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js', () => window.jspdf || (window.jsPDF && true));

    const html2canvas = window.html2canvas;
    const { jsPDF } = window.jspdf || window;

    const node = printRef.current;
    const canvas = await html2canvas(node, { scale: 2, backgroundColor: '#ffffff' });
    const imgData = canvas.toDataURL('image/png');

    // A4 dimensions in mm
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    // Calculate image dimensions to fit width while preserving aspect
    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let position = 0;
    let remainingHeight = imgHeight;

    // Add pages if content is taller than one page
    const addPageWithSlice = (yOffsetPx) => {
      const pageCanvas = document.createElement('canvas');
      const pageScale = imgWidth / canvas.width;
      const pageCanvasHeightPx = Math.floor((pageHeight / pageScale) * window.devicePixelRatio);
      pageCanvas.width = canvas.width;
      pageCanvas.height = Math.min(pageCanvasHeightPx, canvas.height - yOffsetPx);
      const ctx = pageCanvas.getContext('2d');
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);
      ctx.drawImage(canvas, 0, -yOffsetPx);
      const pageImg = pageCanvas.toDataURL('image/png');
      if (position > 0) pdf.addPage();
      pdf.addImage(pageImg, 'PNG', 0, 0, imgWidth, (pageCanvas.height * imgWidth) / pageCanvas.width);
    };

    if (imgHeight <= pageHeight) {
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    } else {
      let y = 0;
      while (y < canvas.height) {
        addPageWithSlice(y);
        const pixelsPerMm = canvas.width / imgWidth;
        const pageHeightPx = Math.floor(pageHeight * pixelsPerMm);
        y += pageHeightPx;
        position += 1;
      }
    }

    pdf.save(`report-${id}.pdf`);
  };

  if (!report) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-end mb-3 gap-2">
          <Button onClick={downloadPdf}>Download PDF</Button>
        </div>
        <div ref={printRef}>
          <ReportTemplate report={report} />
        </div>
      </div>
    </div>
  );
}



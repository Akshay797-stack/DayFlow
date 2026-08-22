import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { PayrollRecord, Employee } from '../types';

export const generatePayslipPDF = (payroll: PayrollRecord, employee?: Employee) => {
  const doc = new jsPDF();

  // Primary Theme Colors (Odoo Plum & Dark Slate)
  const primaryColor = [113, 75, 103]; // #714B67
  const tealColor = [0, 160, 157]; // #00A09D
  const darkTextColor = [30, 41, 59]; // #1E293B

  // 1. Header Banner
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(0, 0, 210, 32, 'F');

  // Company Name
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('DAYFLOW', 14, 18);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('HUMAN RESOURCE MANAGEMENT SYSTEM', 14, 25);

  // Payslip Tag on Top Right
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('PAYSLIP / SALARY STATEMENT', 196, 18, { align: 'right' });
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Period: ${payroll.month} ${payroll.year}`, 196, 25, { align: 'right' });

  // 2. Employee & Company Info Grid
  doc.setTextColor(darkTextColor[0], darkTextColor[1], darkTextColor[2]);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Employee Information', 14, 42);

  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.5);
  doc.line(14, 45, 196, 45);

  const empDetails: string[][] = [
    ['Employee Name:', payroll.employeeName, 'Employee ID:', payroll.employeeId],
    ['Designation:', employee?.designation || 'Software Professional', 'Department:', employee?.department || 'Operations'],
    ['Joining Date:', employee?.joiningDate || '2023-01-01', 'Payment Status:', payroll.status],
    ['Payment Date:', payroll.paymentDate || '2026-08-28', 'Bank Reference:', `DF-TXN-${payroll.id.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(-8)}`],
  ];

  autoTable(doc, {
    startY: 48,
    theme: 'plain',
    body: empDetails,
    styles: { fontSize: 9, cellPadding: 2.5, textColor: [51, 65, 85] },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 35 },
      1: { cellWidth: 60 },
      2: { fontStyle: 'bold', cellWidth: 35 },
      3: { cellWidth: 60 },
    },
  });

  const currentY = ((doc as any).lastAutoTable?.finalY || 80) + 8;

  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(darkTextColor[0], darkTextColor[1], darkTextColor[2]);
  doc.text('Earnings & Deductions Breakdown', 14, currentY);

  const combinedTable = [
    ['Basic Salary', `$${payroll.basic.toLocaleString()}`, 'Provident Fund (PF)', `$${payroll.pf.toLocaleString()}`],
    ['House Rent Allowance (HRA)', `$${payroll.hra.toLocaleString()}`, 'Professional Tax / Withholding', `$${payroll.tax.toLocaleString()}`],
    ['Special & Conveyance Allowances', `$${payroll.allowances.toLocaleString()}`, 'Health & Insurance', '$0.00'],
    ['Performance Bonus', `$${payroll.bonus.toLocaleString()}`, 'Other Deductions', '$0.00'],
    ['Gross Earnings', `$${payroll.grossSalary.toLocaleString()}`, 'Total Deductions', `$${payroll.totalDeductions.toLocaleString()}`],
  ];

  autoTable(doc, {
    startY: currentY + 4,
    head: [['Earnings', 'Amount ($)', 'Deductions', 'Amount ($)']],
    body: combinedTable,
    headStyles: {
      fillColor: [113, 75, 103],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 9.5
    },
    bodyStyles: {
      fontSize: 9,
      cellPadding: 3.5,
      textColor: [51, 65, 85]
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252]
    },
    columnStyles: {
      0: { cellWidth: 60 },
      1: { cellWidth: 35, halign: 'right' },
      2: { cellWidth: 55 },
      3: { cellWidth: 35, halign: 'right' },
    },
  });

  // 4. Net Salary Highlight Box
  const summaryY = ((doc as any).lastAutoTable?.finalY || 160) + 10;

  // Box Background
  doc.setFillColor(240, 253, 250); // Light emerald/teal
  doc.setDrawColor(tealColor[0], tealColor[1], tealColor[2]);
  doc.roundedRect(14, summaryY, 182, 24, 3, 3, 'FD');

  doc.setTextColor(tealColor[0], tealColor[1], tealColor[2]);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('NET TAKE-HOME PAYABLE:', 22, summaryY + 15);

  doc.setFontSize(16);
  doc.text(`$${payroll.netPay.toLocaleString()}`, 188, summaryY + 16, { align: 'right' });

  // 5. Footer & Signatures
  const footerY = summaryY + 36;

  doc.setTextColor(100, 116, 139);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text('This is a computer-generated salary slip and does not require a physical signature.', 14, footerY);
  doc.text('For queries regarding payroll or tax computations, please contact hr-payroll@dayflow.dev', 14, footerY + 5);

  // Authorized Stamp text
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text('Authorized by: Dayflow HR Department', 196, footerY + 5, { align: 'right' });

  // Save the PDF
  doc.save(`Payslip_${payroll.employeeId}_${payroll.month}_${payroll.year}.pdf`);
};

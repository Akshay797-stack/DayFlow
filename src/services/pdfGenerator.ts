import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { PayrollRecord, Employee } from '../types';

export const generatePayslipPDF = (payroll: PayrollRecord, employee?: Employee) => {
  const doc = new jsPDF();

  // Primary Theme Colors (Odoo Plum & Dark Slate)
  const primaryColor = [113, 75, 103]; // #714B67
  const tealColor = [0, 160, 157]; // #00A09D
  const darkTextColor = [30, 41, 59]; // #1E293B

  const totalWorkingDays = payroll.totalWorkingDays || 22;
  const presentDays = payroll.presentDays || (totalWorkingDays - (payroll.unpaidDays || 0) - (payroll.paidLeaveDays || 2));
  const paidLeaveDays = payroll.paidLeaveDays || 2;
  const unpaidDays = payroll.unpaidDays || 0;
  const payableDays = payroll.payableDays || (totalWorkingDays - unpaidDays);
  const lopDeduction = payroll.lopDeduction || 0;

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
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Employee Information', 14, 40);

  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.5);
  doc.line(14, 43, 196, 43);

  const empDetails: string[][] = [
    ['Employee Name:', payroll.employeeName, 'Employee ID:', payroll.employeeId],
    ['Designation:', employee?.designation || 'Software Professional', 'Department:', employee?.department || 'Operations'],
    ['Joining Date:', employee?.joiningDate || '2023-01-01', 'Payment Status:', payroll.status],
    ['Payment Date:', payroll.paymentDate || '2026-08-28', 'Bank Reference:', `DF-TXN-${payroll.id.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(-8)}`],
  ];

  autoTable(doc, {
    startY: 45,
    theme: 'plain',
    body: empDetails,
    styles: { fontSize: 8.5, cellPadding: 2, textColor: [51, 65, 85] },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 35 },
      1: { cellWidth: 60 },
      2: { fontStyle: 'bold', cellWidth: 35 },
      3: { cellWidth: 60 },
    },
  });

  // 3. Attendance & Payable Days Grid (Wireframe Requirement)
  const attY = ((doc as any).lastAutoTable?.finalY || 70) + 4;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(darkTextColor[0], darkTextColor[1], darkTextColor[2]);
  doc.text('Attendance & Payable Days Summary', 14, attY);

  const attDetails: string[][] = [
    ['Working Days Scheduled:', `${totalWorkingDays} days`, 'Days Present:', `${presentDays} days`],
    ['Paid Leaves Approved:', `${paidLeaveDays} days`, 'Unpaid / Missing (LOP):', `${unpaidDays} days`],
    ['Total Payable Days:', `${payableDays} / ${totalWorkingDays} days`, 'Loss of Pay Deduction:', `$${lopDeduction.toLocaleString()}`],
  ];

  autoTable(doc, {
    startY: attY + 3,
    theme: 'grid',
    body: attDetails,
    styles: { fontSize: 8.5, cellPadding: 2.5, textColor: [51, 65, 85] },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 45, fillColor: [248, 250, 252] },
      1: { cellWidth: 50 },
      2: { fontStyle: 'bold', cellWidth: 45, fillColor: [248, 250, 252] },
      3: { cellWidth: 42 },
    },
  });

  // 4. Earnings & Deductions Breakdown
  const currentY = ((doc as any).lastAutoTable?.finalY || 105) + 6;

  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(darkTextColor[0], darkTextColor[1], darkTextColor[2]);
  doc.text('Earnings & Deductions Breakdown', 14, currentY);

  const combinedTable = [
    ['Basic Salary', `$${payroll.basic.toLocaleString()}`, 'Provident Fund (PF)', `$${payroll.pf.toLocaleString()}`],
    ['House Rent Allowance (HRA)', `$${payroll.hra.toLocaleString()}`, 'Professional Tax / Withholding', `$${payroll.tax.toLocaleString()}`],
    ['Special & Conveyance Allowances', `$${payroll.allowances.toLocaleString()}`, 'Loss of Pay (LOP Deductions)', `$${lopDeduction.toLocaleString()}`],
    ['Performance Bonus', `$${payroll.bonus.toLocaleString()}`, 'Other Deductions', '$0.00'],
    ['Gross Earnings', `$${payroll.grossSalary.toLocaleString()}`, 'Total Deductions', `$${payroll.totalDeductions.toLocaleString()}`],
  ];

  autoTable(doc, {
    startY: currentY + 3,
    head: [['Earnings Component', 'Amount ($)', 'Deductions Component', 'Amount ($)']],
    body: combinedTable,
    headStyles: {
      fillColor: [113, 75, 103],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 9
    },
    bodyStyles: {
      fontSize: 8.5,
      cellPadding: 3,
      textColor: [51, 65, 85]
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252]
    },
    columnStyles: {
      0: { cellWidth: 60 },
      1: { cellWidth: 35, halign: 'right' },
      2: { cellWidth: 55 },
      3: { cellWidth: 32, halign: 'right' },
    },
  });

  // 5. Net Salary Highlight Box
  const summaryY = ((doc as any).lastAutoTable?.finalY || 165) + 8;

  doc.setFillColor(240, 253, 250); // Light emerald/teal
  doc.setDrawColor(tealColor[0], tealColor[1], tealColor[2]);
  doc.roundedRect(14, summaryY, 182, 22, 3, 3, 'FD');

  doc.setTextColor(tealColor[0], tealColor[1], tealColor[2]);
  doc.setFontSize(10.5);
  doc.setFont('helvetica', 'bold');
  doc.text('NET TAKE-HOME PAYABLE:', 22, summaryY + 14);

  doc.setFontSize(15);
  doc.text(`$${payroll.netPay.toLocaleString()}`, 188, summaryY + 15, { align: 'right' });

  // 6. Footer & Signatures
  const footerY = summaryY + 32;

  doc.setTextColor(100, 116, 139);
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.text('This is a computer-generated salary slip based on verified attendance and leave logs.', 14, footerY);
  doc.text('For queries regarding payroll, attendance days, or tax withholdings, contact hr-payroll@dayflow.dev', 14, footerY + 4);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text('Authorized by: Dayflow HR & Payroll Operations', 196, footerY + 4, { align: 'right' });

  // Save the PDF
  doc.save(`Payslip_${payroll.employeeId}_${payroll.month}_${payroll.year}.pdf`);
};

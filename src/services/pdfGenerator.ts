import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Transaction, User, ShopConfig } from '../types';

interface GeneratePdfParams {
  transactions: Transaction[];
  user: User;
  shopConfig: ShopConfig;
  selectedDate: string;
}

export const generateDailySalesReportDoc = ({
  transactions,
  user,
  shopConfig,
  selectedDate,
}: GeneratePdfParams): jsPDF => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;

  // Calculate totals
  const totalGpay = transactions.reduce((acc, t) => acc + (t.gpayAmount || 0), 0);
  const totalCash = transactions.reduce((acc, t) => acc + (t.cashAmount || 0), 0);
  const grandTotal = totalGpay + totalCash;
  const billCount = transactions.length;

  // Header Background Banner
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, pageWidth, 36, 'F');

  // Emerald Accent Line
  doc.setFillColor(16, 185, 129); // emerald-500
  doc.rect(0, 36, pageWidth, 2, 'F');

  // Shop Name & Subtitle
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.text(shopConfig.name.toUpperCase(), margin, 15);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(203, 213, 225); // slate-300
  doc.text('DAILY EARNINGS & PAYMENT REGISTER (G-PAY & HAND CASH)', margin, 22);

  if (shopConfig.address || shopConfig.phone) {
    const contactText = [shopConfig.address, shopConfig.phone].filter(Boolean).join(' | ');
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(contactText, margin, 29);
  }

  // Right-aligned Date & Cashier
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(255, 255, 255);
  doc.text(`DATE: ${selectedDate}`, pageWidth - margin, 15, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(203, 213, 225);
  doc.text(`User: ${user.displayName || 'Owner'}`, pageWidth - margin, 22, { align: 'right' });
  doc.text(`Total Bills: ${billCount}`, pageWidth - margin, 28, { align: 'right' });

  // Summary KPI Boxes
  const boxY = 44;
  const boxHeight = 22;
  const gap = 4;
  const boxWidth = (pageWidth - margin * 2 - gap * 2) / 3;

  // Box 1: G-Pay (UPI)
  doc.setFillColor(239, 246, 255); // blue-50
  doc.setDrawColor(191, 219, 254);
  doc.roundedRect(margin, boxY, boxWidth, boxHeight, 2, 2, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(30, 64, 175);
  doc.text('TOTAL G-PAY EARNINGS', margin + 5, boxY + 7);
  doc.setFont('courier', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(29, 78, 216);
  doc.text(`INR ${totalGpay.toFixed(2)}`, margin + 5, boxY + 16);

  // Box 2: Hand Cash
  const box2X = margin + boxWidth + gap;
  doc.setFillColor(240, 253, 244); // emerald-50
  doc.setDrawColor(187, 247, 208);
  doc.roundedRect(box2X, boxY, boxWidth, boxHeight, 2, 2, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(22, 101, 52);
  doc.text('TOTAL HAND CASH', box2X + 5, boxY + 7);
  doc.setFont('courier', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(21, 128, 61);
  doc.text(`INR ${totalCash.toFixed(2)}`, box2X + 5, boxY + 16);

  // Box 3: Grand Total
  const box3X = margin + (boxWidth + gap) * 2;
  doc.setFillColor(254, 252, 232); // amber-50
  doc.setDrawColor(254, 240, 138);
  doc.roundedRect(box3X, boxY, boxWidth, boxHeight, 2, 2, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(146, 64, 14);
  doc.text('GRAND TOTAL TODAY', box3X + 5, boxY + 7);
  doc.setFont('courier', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(180, 83, 9);
  doc.text(`INR ${grandTotal.toFixed(2)}`, box3X + 5, boxY + 16);

  const startY = boxY + boxHeight + 8;

  // Transactions Table
  const tableRows = transactions.map((tx, idx) => [
    (idx + 1).toString(),
    tx.timeStr || new Date(tx.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    tx.description || 'Sale / Purchase',
    tx.gpayAmount > 0 ? `INR ${tx.gpayAmount.toFixed(2)}` : '-',
    tx.cashAmount > 0 ? `INR ${tx.cashAmount.toFixed(2)}` : '-',
    `INR ${tx.totalAmount.toFixed(2)}`,
  ]);

  autoTable(doc, {
    startY: startY,
    head: [['#', 'Time', 'Bill / Description', 'G-Pay', 'Hand Cash', 'Total Bill']],
    body: tableRows.length > 0 ? tableRows : [['-', '-', 'No transactions logged today', '-', '-', '-']],
    foot: [
      [
        'Total',
        '',
        `${billCount} transactions recorded`,
        `INR ${totalGpay.toFixed(2)}`,
        `INR ${totalCash.toFixed(2)}`,
        `INR ${grandTotal.toFixed(2)}`,
      ],
    ],
    theme: 'striped',
    headStyles: {
      fillColor: [16, 185, 129], // emerald-600
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8.5,
    },
    footStyles: {
      fillColor: [241, 245, 249],
      textColor: [15, 23, 42],
      fontStyle: 'bold',
      fontSize: 9,
    },
    styles: {
      fontSize: 8.5,
      cellPadding: 2.5,
    },
    columnStyles: {
      0: { halign: 'center', cellWidth: 12 },
      1: { halign: 'center', cellWidth: 22 },
      2: { cellWidth: 'auto' },
      3: { font: 'courier', halign: 'right', cellWidth: 32 },
      4: { font: 'courier', halign: 'right', cellWidth: 32 },
      5: { font: 'courier', fontStyle: 'bold', halign: 'right', cellWidth: 34 },
    },
    margin: { left: margin, right: margin, bottom: 20 },
    didDrawPage: (data) => {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184);
      doc.text(
        `KiranaTrack Daily Report | Generated: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()} | Sent to WhatsApp: 6380412552 | Page ${data.pageNumber}`,
        margin,
        pageHeight - 8
      );
    },
  });

  return doc;
};

export const downloadDailySalesReport = (params: GeneratePdfParams): void => {
  const doc = generateDailySalesReportDoc(params);
  const safeShopName = params.shopConfig.name.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
  doc.save(`${safeShopName}_daily_report_${params.selectedDate}.pdf`);
};

/**
 * Automatically triggers PDF download AND sends structured report directly to WhatsApp number 6380412552
 */
export const sendReportToWhatsApp = async (params: GeneratePdfParams): Promise<void> => {
  const { transactions, user, shopConfig, selectedDate } = params;
  const totalGpay = transactions.reduce((acc, t) => acc + (t.gpayAmount || 0), 0);
  const totalCash = transactions.reduce((acc, t) => acc + (t.cashAmount || 0), 0);
  const grandTotal = totalGpay + totalCash;
  const billCount = transactions.length;

  // 1. Download the PDF file locally
  const doc = generateDailySalesReportDoc(params);
  const pdfBlob = doc.output('blob');
  const fileName = `${shopConfig.name.replace(/[^a-zA-Z0-9]/g, '_')}_Daily_Report_${selectedDate}.pdf`;
  doc.save(fileName);

  // 2. Format WhatsApp message
  const targetNumber = shopConfig.whatsappNumber || '6380412552';
  // Clean phone number format for WhatsApp API (defaults to India 91 country code if 10 digits)
  const cleanPhone = targetNumber.replace(/\D/g, '');
  const finalPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;

  let message = `📊 *DAILY EARNINGS REPORT - ${shopConfig.name.toUpperCase()}*\n`;
  message += `📅 *Date:* ${selectedDate}\n`;
  message += `👤 *Cashier:* ${user.displayName || 'Owner'}\n`;
  message += `📝 *Total Bills:* ${billCount}\n\n`;
  message += `━━━━━━━━━━━━━━━━━━━━━\n`;
  message += `💳 *Total G-Pay (UPI):* ₹${totalGpay.toFixed(2)}\n`;
  message += `💵 *Total Hand Cash:* ₹${totalCash.toFixed(2)}\n`;
  message += `💰 *GRAND TOTAL:* ₹${grandTotal.toFixed(2)}\n`;
  message += `━━━━━━━━━━━━━━━━━━━━━\n\n`;

  if (transactions.length > 0) {
    message += `*Recent Entries:*\n`;
    transactions.slice(0, 10).forEach((tx, idx) => {
      message += `${idx + 1}. [${tx.timeStr}] ${tx.description} - ₹${tx.totalAmount.toFixed(0)} (G-Pay: ₹${tx.gpayAmount}, Cash: ₹${tx.cashAmount})\n`;
    });
    if (transactions.length > 10) {
      message += `...and ${transactions.length - 10} more transactions.\n`;
    }
  } else {
    message += `_No transactions logged for this date._\n`;
  }

  message += `\n📄 _Daily PDF report generated and downloaded._`;

  // 3. If Web Share API with files is supported (mobile devices), prompt to share directly to WhatsApp
  if (navigator.canShare && navigator.canShare({ files: [new File([pdfBlob], fileName, { type: 'application/pdf' })] })) {
    try {
      const pdfFile = new File([pdfBlob], fileName, { type: 'application/pdf' });
      await navigator.share({
        title: `${shopConfig.name} Daily Report - ${selectedDate}`,
        text: message,
        files: [pdfFile],
      });
      return;
    } catch (shareErr) {
      console.log('Native share declined or canceled, falling back to WhatsApp link:', shareErr);
    }
  }

  // 4. Open WhatsApp Web or Mobile App directly targeted to the WhatsApp number
  const whatsappUrl = `https://api.whatsapp.com/send?phone=${finalPhone}&text=${encodeURIComponent(message)}`;
  
  // Open directly in a new window/tab
  window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
};

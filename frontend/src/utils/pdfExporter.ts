import jsPDF from 'jspdf';

interface PDFUser {
  fullName?: string;
  username?: string;
  email?: string;
  mxpBalance?: number;
}

/**
 * Format helper for PDF headers
 */
const addPDFHeader = (doc: jsPDF, title: string, subtitle?: string) => {
  // Top Banner
  doc.setFillColor(24, 26, 38); // Dark background
  doc.rect(0, 0, 210, 32, 'F');

  // Brand Title (No 'W' icon box)
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text('wagr.io', 14, 17);

  // Subtitle: THE FUTURE HAS ODDS
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(168, 85, 247); // Brand purple
  doc.text('THE FUTURE HAS ODDS', 14, 23);

  // Document Title Right
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text(title.toUpperCase(), 196, 17, { align: 'right' });

  if (subtitle) {
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(156, 163, 175);
    doc.text(subtitle, 196, 23, { align: 'right' });
  }

  // Divider Line
  doc.setDrawColor(168, 85, 247);
  doc.setLineWidth(0.8);
  doc.line(0, 32, 210, 32);
};

/**
 * Format helper for PDF footers
 */
const addPDFFooter = (doc: jsPDF, pageNum: number) => {
  const pageHeight = doc.internal.pageSize.height || 297;
  doc.setDrawColor(229, 231, 235);
  doc.setLineWidth(0.3);
  doc.line(14, pageHeight - 12, 196, pageHeight - 12);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(156, 163, 175);
  doc.text(`Wagr.io Official Document • Generated on ${new Date().toLocaleDateString()}`, 14, pageHeight - 6);
  doc.text(`Page ${pageNum}`, 196, pageHeight - 6, { align: 'right' });
};

/**
 * Detailed platform information section added at the end of every PDF document
 */
const addWagrDetailedInfo = (doc: jsPDF, currentY: number) => {
  let y = currentY + 8;
  if (y > 230) {
    addPDFFooter(doc, doc.getNumberOfPages());
    doc.addPage();
    addPDFHeader(doc, 'About Wagr.io', 'Platform Specifications & Ecosystem');
    y = 42;
  }

  // Container Card
  doc.setFillColor(245, 247, 250);
  doc.roundedRect(14, y, 182, 45, 3, 3, 'F');

  doc.setDrawColor(168, 85, 247);
  doc.setLineWidth(0.5);
  doc.roundedRect(14, y, 182, 45, 3, 3, 'S');

  // Title
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(168, 85, 247);
  doc.text('ABOUT WAGR.IO — THE FUTURE HAS ODDS', 18, y + 8);

  // Body Description
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(55, 65, 81);

  const aboutText = 'Wagr.io is an AI-powered social prediction exchange designed for next-generation event forecasting and real-time probability analytics. Operating on a risk-free virtual economy using Market Exchange Points (MXP), Wagr empowers users to predict real-world outcomes across Technology, Finance, World Politics, Culture, and Crypto with zero financial liability.';
  const splitAbout = doc.splitTextToSize(aboutText, 174);
  doc.text(splitAbout, 18, y + 14);

  // Key Features Bullet Points
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(31, 41, 55);
  doc.text('Key Platform Features:', 18, y + 27);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(75, 85, 99);
  doc.text('• Automated AI Market Curation  • Real-Time News Context Linking  • Virtual MXP Sandbox  • Gamified Leaderboards', 18, y + 33);
  doc.text('• Zero Financial Risk Guarantee  • Community Forum & Insight Stream  • Transparent Price History Logs', 18, y + 38);

  return y + 50;
};

/**
 * 1. Export Bets & Trade History PDF
 */
export const exportBetsHistoryPDF = (user: PDFUser, positions: any[]) => {
  const doc = new jsPDF('p', 'mm', 'a4');
  addPDFHeader(doc, 'Bets & Trading History', `Account: @${user?.username || 'user'}`);

  let y = 42;

  // User Card Details
  doc.setFillColor(245, 247, 250);
  doc.roundedRect(14, y, 182, 20, 2, 2, 'F');

  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(31, 41, 55);
  doc.text(`Trader Name: ${user?.fullName || 'N/A'}`, 18, y + 8);
  doc.text(`Username: @${user?.username || 'N/A'}`, 18, y + 14);

  doc.text(`Email: ${user?.email || 'N/A'}`, 110, y + 8);
  doc.text(`Total Records: ${positions.length} Bets Listed`, 110, y + 14);

  y += 28;

  // Table Headers
  doc.setFillColor(31, 41, 55);
  doc.rect(14, y, 182, 8, 'F');

  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);

  doc.text('MARKET TITLE', 18, y + 5.5);
  doc.text('CHOICE', 115, y + 5.5);
  doc.text('AMOUNT', 135, y + 5.5);
  doc.text('PROB', 160, y + 5.5);
  doc.text('STATUS', 180, y + 5.5);

  y += 10;

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');

  positions.forEach((pos, idx) => {
    if (y > 230) {
      addPDFFooter(doc, doc.getNumberOfPages());
      doc.addPage();
      addPDFHeader(doc, 'Bets & Trading History', `Account: @${user?.username || 'user'}`);
      y = 42;
    }

    if (idx % 2 === 0) {
      doc.setFillColor(249, 250, 251);
      doc.rect(14, y - 4, 182, 8, 'F');
    }

    const title = pos.market?.title || pos.title || 'Market Position';
    const truncatedTitle = title.length > 55 ? title.substring(0, 52) + '...' : title;
    const choice = pos.outcome || pos.choice || 'YES';
    const amount = pos.investedAmount ? `${pos.investedAmount.toLocaleString()} MXP` : 'N/A';
    const prob = pos.entryProbability ? `${pos.entryProbability}%` : 'N/A';
    const status = pos.status || 'Open';

    doc.setTextColor(31, 41, 55);
    doc.text(truncatedTitle, 18, y);

    if (choice === 'YES') {
      doc.setTextColor(147, 51, 234);
    } else {
      doc.setTextColor(37, 99, 235);
    }
    doc.text(choice, 115, y);

    doc.setTextColor(31, 41, 55);
    doc.text(amount, 135, y);
    doc.text(prob, 160, y);

    if (status === 'Resolved' || status === 'WON') {
      doc.setTextColor(16, 185, 129);
    } else {
      doc.setTextColor(107, 114, 128);
    }
    doc.text(status, 180, y);

    y += 8;
  });

  // Append Wagr Detailed Info Section
  addWagrDetailedInfo(doc, y);

  addPDFFooter(doc, doc.getNumberOfPages());
  doc.save(`Wagr_Bets_History_${user?.username || 'user'}.pdf`);
};

/**
 * 2. Export MXP Balance & Admin Request History PDF
 */
export const exportMxpHistoryPDF = (user: PDFUser, requests: any[]) => {
  const doc = new jsPDF('p', 'mm', 'a4');
  addPDFHeader(doc, 'MXP Wallet & Credit Log', `Current Balance: ${(user?.mxpBalance || 0).toLocaleString()} MXP`);

  let y = 42;

  // Account Card
  doc.setFillColor(245, 247, 250);
  doc.roundedRect(14, y, 182, 20, 2, 2, 'F');

  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(31, 41, 55);
  doc.text(`Account Holder: ${user?.fullName || 'N/A'} (@${user?.username || 'user'})`, 18, y + 8);
  doc.text(`Email: ${user?.email || 'N/A'}`, 18, y + 14);

  doc.text(`Available MXP Balance: ${(user?.mxpBalance || 0).toLocaleString()} MXP`, 110, y + 8);
  doc.text(`Total Credit Submissions: ${requests.length} Requests`, 110, y + 14);

  y += 28;

  // Table Headers
  doc.setFillColor(31, 41, 55);
  doc.rect(14, y, 182, 8, 'F');

  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);

  doc.text('DATE', 18, y + 5.5);
  doc.text('REQUESTED AMOUNT', 55, y + 5.5);
  doc.text('STATUS', 100, y + 5.5);
  doc.text('REASON / ADMIN NOTE', 135, y + 5.5);

  y += 10;

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');

  requests.forEach((req, idx) => {
    if (y > 230) {
      addPDFFooter(doc, doc.getNumberOfPages());
      doc.addPage();
      addPDFHeader(doc, 'MXP Wallet & Credit Log', `Current Balance: ${(user?.mxpBalance || 0).toLocaleString()} MXP`);
      y = 42;
    }

    if (idx % 2 === 0) {
      doc.setFillColor(249, 250, 251);
      doc.rect(14, y - 4, 182, 8, 'F');
    }

    const dateStr = req.createdAt ? new Date(req.createdAt).toLocaleDateString() : 'N/A';
    const amountStr = `+${(req.amount || 0).toLocaleString()} MXP`;
    const status = req.status || 'Pending';
    const note = (req.adminNote || req.reason || 'N/A').substring(0, 38);

    doc.setTextColor(31, 41, 55);
    doc.text(dateStr, 18, y);
    doc.text(amountStr, 55, y);

    if (status === 'Approved') {
      doc.setTextColor(16, 185, 129);
    } else if (status === 'Rejected') {
      doc.setTextColor(239, 68, 68);
    } else {
      doc.setTextColor(217, 119, 6);
    }
    doc.text(status, 100, y);

    doc.setTextColor(107, 114, 128);
    doc.text(note, 135, y);

    y += 8;
  });

  // Append Wagr Detailed Info Section
  addWagrDetailedInfo(doc, y);

  addPDFFooter(doc, doc.getNumberOfPages());
  doc.save(`Wagr_MXP_Wallet_Log_${user?.username || 'user'}.pdf`);
};

/**
 * 3. Export Privacy Policy Document PDF
 */
export const exportPrivacyPolicyPDF = () => {
  const doc = new jsPDF('p', 'mm', 'a4');
  addPDFHeader(doc, 'Privacy Policy', 'Official Legal Specification • July 2026');

  let y = 42;

  const sections = [
    {
      title: '1. EXECUTIVE PRIVACY STATEMENT & DATA CLASSIFICATION',
      body: 'Wagr.io operates strictly as a virtual sandbox prediction marketplace. We collect account identity credentials (Full Name, Username, Email, Encrypted Password Hash) solely to deliver electronic service features. Because Wagr operates on non-financial Market Exchange Points (MXP), we do NOT collect, process, or store credit cards, bank accounts, or financial records.',
    },
    {
      title: '2. PURPOSE & LEGAL BASIS FOR PROCESSING',
      body: 'User credentials are processed to authenticate sign-in sessions via JSON Web Tokens (JWT), track virtual MXP balances, compute dynamic leaderboard rankings, and prevent automated account abuse. Passwords undergo salted Bcrypt hashing prior to storage.',
    },
    {
      title: '3. COOKIES, LOCAL STORAGE & ZERO TRACKERS',
      body: 'We store an encrypted JWT authentication token in browser local storage to maintain session continuity. Wagr.io strictly disables third-party advertising cookies, retargeting pixels, and tracking analytics packages.',
    },
    {
      title: '4. AI SENTIMENT API DATA ANONYMIZATION',
      body: 'When communicating with external AI inference services (such as Groq APIs), only generic public event titles and category strings are transmitted. Zero personal identifiers, email addresses, or IP logs are shared with AI providers.',
    },
    {
      title: '5. DATA SECURITY & ERASURE RIGHTS',
      body: 'All data traffic is encrypted via 256-bit TLS/SSL transport protocols. Users reserve the right to access, update, or request permanent erasure of their account data. Account deletion purges user records within 14 business days.',
    },
  ];

  sections.forEach((sec) => {
    if (y > 220) {
      addPDFFooter(doc, doc.getNumberOfPages());
      doc.addPage();
      addPDFHeader(doc, 'Privacy Policy', 'Official Legal Specification • July 2026');
      y = 42;
    }

    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(168, 85, 247);
    doc.text(sec.title, 14, y);

    y += 6;

    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(55, 65, 81);

    const splitText = doc.splitTextToSize(sec.body, 182);
    doc.text(splitText, 14, y);

    y += splitText.length * 4.5 + 6;
  });

  // Append Wagr Detailed Info Section
  addWagrDetailedInfo(doc, y);

  addPDFFooter(doc, doc.getNumberOfPages());
  doc.save('Wagr_Privacy_Policy.pdf');
};

/**
 * 4. Export Terms & Conditions Document PDF
 */
export const exportTermsConditionsPDF = () => {
  const doc = new jsPDF('p', 'mm', 'a4');
  addPDFHeader(doc, 'Terms & Conditions', 'Binding Usage Agreement • July 2026');

  let y = 42;

  const sections = [
    {
      title: '1. ZERO REAL MONEY VALUE & VIRTUAL CURRENCY GUARANTEE',
      body: 'Wagr.io operates exclusively as a simulated forecasting marketplace. Market Exchange Points (MXP) serve as virtual point tokens. MXP holds zero cash value, cannot be redeemed for fiat currency or real-world assets, and cannot be transferred between accounts.',
    },
    {
      title: '2. AI SENTIMENT ENGINE & AUTONOMOUS SIMULATION DECLARATION',
      body: 'To provide realistic liquidity depth, automated AI background jobs may adjust YES/NO liquidity pools within controlled bounds prior to market expiration. AI sentiment algorithms do NOT resolve final market outcomes. Final event resolutions depend strictly on real-world verification.',
    },
    {
      title: '3. MARKET SETTLEMENTS & ADMINISTRATIVE CANCELLATIONS',
      body: 'Designated administrators verify primary news sources upon market expiration to resolve contracts. If an event is cancelled or ambiguous, the market is cancelled and all original MXP stakes are refunded in full.',
    },
    {
      title: '4. USER CODE OF CONDUCT & ANTI-ABUSE POLICIES',
      body: 'Prohibited actions include posting hateful speech, creating duplicate accounts for MXP farming, or exploiting software bugs. Violations result in immediate account suspension or banishment.',
    },
    {
      title: '5. LIMITATION OF LIABILITY',
      body: 'Wagr.io is provided on an "AS IS" basis without warranties. Developers carry zero liability for virtual point adjustments, downtime, or forecasting probability fluctuations displayed on the exchange.',
    },
  ];

  sections.forEach((sec) => {
    if (y > 220) {
      addPDFFooter(doc, doc.getNumberOfPages());
      doc.addPage();
      addPDFHeader(doc, 'Terms & Conditions', 'Binding Usage Agreement • July 2026');
      y = 42;
    }

    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(239, 68, 68);
    doc.text(sec.title, 14, y);

    y += 6;

    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(55, 65, 81);

    const splitText = doc.splitTextToSize(sec.body, 182);
    doc.text(splitText, 14, y);

    y += splitText.length * 4.5 + 6;
  });

  // Append Wagr Detailed Info Section
  addWagrDetailedInfo(doc, y);

  addPDFFooter(doc, doc.getNumberOfPages());
  doc.save('Wagr_Terms_and_Conditions.pdf');
};

const fs = require('fs');
const path = require('path');

// Simple certificate generator (you can enhance this with libraries like PDFKit or jsPDF)
const generateCertificateHTML = (certificateData) => {
  const {
    studentName,
    courseTitle,
    instructorName,
    completionDate,
    certificateId,
    courseDuration,
    grade = 'Pass'
  } = certificateData;

  const formattedDate = new Date(completionDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Certificate of Completion</title>
      <style>
        @page {
          size: A4 landscape;
          margin: 0;
        }
        
        body {
          margin: 0;
          padding: 40px;
          font-family: 'Georgia', serif;
          background: linear-gradient(135deg, #f6f9fc 0%, #ffffff 100%);
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .certificate {
          width: 100%;
          max-width: 800px;
          background: white;
          border: 12px solid #667eea;
          border-radius: 20px;
          padding: 60px;
          text-align: center;
          position: relative;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        }
        
        .certificate::before {
          content: '';
          position: absolute;
          top: 20px;
          left: 20px;
          right: 20px;
          height: 4px;
          background: linear-gradient(90deg, #667eea, #764ba2, #667eea);
          border-radius: 2px;
        }
        
        .certificate::after {
          content: '';
          position: absolute;
          bottom: 20px;
          left: 20px;
          right: 20px;
          height: 4px;
          background: linear-gradient(90deg, #667eea, #764ba2, #667eea);
          border-radius: 2px;
        }
        
        .header {
          margin-bottom: 40px;
        }
        
        .logo {
          font-size: 2.5rem;
          font-weight: bold;
          background: linear-gradient(45deg, #667eea, #764ba2);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 10px;
        }
        
        .title {
          font-size: 3rem;
          font-weight: bold;
          color: #2d3748;
          margin: 20px 0;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
        }
        
        .subtitle {
          font-size: 1.2rem;
          color: #718096;
          margin-bottom: 40px;
        }
        
        .recipient {
          margin: 40px 0;
        }
        
        .recipient-label {
          font-size: 1.1rem;
          color: #718096;
          margin-bottom: 10px;
        }
        
        .recipient-name {
          font-size: 2.5rem;
          font-weight: bold;
          color: #2d3748;
          border-bottom: 3px solid #e2e8f0;
          padding-bottom: 10px;
          margin-bottom: 20px;
          display: inline-block;
          min-width: 400px;
        }
        
        .completion-text {
          font-size: 1.2rem;
          color: #4a5568;
          margin: 20px 0;
        }
        
        .course-title {
          font-size: 2rem;
          font-weight: bold;
          color: #667eea;
          margin: 30px 0;
          text-decoration: underline;
          text-decoration-color: #764ba2;
        }
        
        .details {
          display: flex;
          justify-content: space-between;
          margin: 40px 0;
          font-size: 1rem;
          color: #4a5568;
        }
        
        .detail-item {
          text-align: center;
          flex: 1;
        }
        
        .detail-label {
          font-weight: bold;
          color: #2d3748;
          display: block;
          margin-bottom: 5px;
        }
        
        .signatures {
          display: flex;
          justify-content: space-between;
          margin-top: 60px;
          padding-top: 20px;
        }
        
        .signature {
          text-align: center;
          flex: 1;
        }
        
        .signature-line {
          border-top: 2px solid #2d3748;
          width: 200px;
          margin: 0 auto 10px;
        }
        
        .signature-name {
          font-weight: bold;
          color: #2d3748;
          margin-bottom: 5px;
        }
        
        .signature-title {
          font-size: 0.9rem;
          color: #718096;
        }
        
        .certificate-id {
          position: absolute;
          bottom: 10px;
          right: 20px;
          font-size: 0.8rem;
          color: #a0aec0;
        }
        
        .grade-badge {
          position: absolute;
          top: 30px;
          right: 30px;
          background: linear-gradient(45deg, #48bb78, #38a169);
          color: white;
          padding: 10px 20px;
          border-radius: 25px;
          font-weight: bold;
          font-size: 1.1rem;
        }
        
        .decorative-elements {
          position: absolute;
          top: 50%;
          left: 20px;
          right: 20px;
          transform: translateY(-50%);
          opacity: 0.05;
          font-size: 8rem;
          color: #667eea;
          z-index: -1;
          pointer-events: none;
        }
      </style>
    </head>
    <body>
      <div class="certificate">
        <div class="decorative-elements">🎓</div>
        <div class="grade-badge">Grade: ${grade}</div>
        
        <div class="header">
          <div class="logo">LearnHub</div>
          <h1 class="title">Certificate of Completion</h1>
          <p class="subtitle">This is to certify that</p>
        </div>
        
        <div class="recipient">
          <div class="recipient-name">${studentName}</div>
          <p class="completion-text">has successfully completed the course</p>
          <h2 class="course-title">${courseTitle}</h2>
        </div>
        
        <div class="details">
          <div class="detail-item">
            <span class="detail-label">Instructor</span>
            ${instructorName}
          </div>
          <div class="detail-item">
            <span class="detail-label">Duration</span>
            ${courseDuration}
          </div>
          <div class="detail-item">
            <span class="detail-label">Completion Date</span>
            ${formattedDate}
          </div>
        </div>
        
        <div class="signatures">
          <div class="signature">
            <div class="signature-line"></div>
            <div class="signature-name">LearnHub</div>
            <div class="signature-title">Learning Platform</div>
          </div>
          <div class="signature">
            <div class="signature-line"></div>
            <div class="signature-name">${instructorName}</div>
            <div class="signature-title">Course Instructor</div>
          </div>
        </div>
        
        <div class="certificate-id">Certificate ID: ${certificateId}</div>
      </div>
    </body>
    </html>
  `;
};

// Generate certificate file
const generateCertificate = async (certificateData) => {
  try {
    const html = generateCertificateHTML(certificateData);
    const fileName = `certificate-${certificateData.certificateId}.html`;
    const filePath = path.join(process.env.UPLOAD_PATH || './uploads', 'certificates', fileName);
    
    // Ensure certificates directory exists
    const certificatesDir = path.dirname(filePath);
    if (!fs.existsSync(certificatesDir)) {
      fs.mkdirSync(certificatesDir, { recursive: true });
    }
    
    // Write HTML file
    fs.writeFileSync(filePath, html);
    
    return {
      success: true,
      filePath,
      fileName,
      url: `/uploads/certificates/${fileName}`
    };
  } catch (_error) {
    console.error('Error generating certificate:', err);
    throw new Error('Certificate generation failed');
  }
};

// Verify certificate
const verifyCertificate = async (certificateId, verificationCode) => {
  try {
    const Certificate = require('../models/Certificate');
    const certificate = await Certificate.verifyCertificate(certificateId, verificationCode);
    
    if (!certificate) {
      return {
        valid: false,
        message: 'Certificate not found or invalid'
      };
    }
    
    return {
      valid: true,
      certificate: {
        id: certificate.certificateId,
        studentName: certificate.metadata.studentName,
        courseTitle: certificate.metadata.courseTitle,
        instructorName: certificate.metadata.instructorName,
        completionDate: certificate.completionDate,
        issuedAt: certificate.issuedAt,
        grade: certificate.grade
      }
    };
  } catch (err) {
    return {
      valid: false,
      message: 'Certificate not found or invalid'
    };
  }
};

module.exports = {
  generateCertificate,
  generateCertificateHTML,
  verifyCertificate
};

import { Modal, Button } from 'react-bootstrap';
import { formatDate } from '../utils/helpers';

function CertificateViewer({ show, onHide, certificate }) {
  if (!certificate) return null;

  const handleDownload = () => {
    // TODO: Connect to backend certificate download API
    console.log('Downloading certificate:', certificate.id);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton className="border-0">
        <Modal.Title>Course Certificate</Modal.Title>
      </Modal.Header>
      
      <Modal.Body className="p-0">
        <div className="certificate-container">
          <div 
            className="certificate-content p-5"
            style={{
              background: 'linear-gradient(135deg, #f6f9fc 0%, #ffffff 100%)',
              border: '8px solid #667eea',
              borderRadius: '16px',
              margin: '20px',
              textAlign: 'center',
              position: 'relative'
            }}
          >
            {/* Decorative Elements */}
            <div 
              className="certificate-decoration"
              style={{
                position: 'absolute',
                top: '20px',
                left: '20px',
                right: '20px',
                height: '4px',
                background: 'linear-gradient(90deg, #667eea, #764ba2, #667eea)',
                borderRadius: '2px'
              }}
            />
            
            {/* Header */}
            <div className="certificate-header mb-4">
              <h1 
                className="certificate-title"
                style={{
                  fontSize: '2.5rem',
                  fontWeight: '800',
                  background: 'linear-gradient(45deg, #667eea, #764ba2)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  marginBottom: '0.5rem'
                }}
              >
                Certificate of Completion
              </h1>
              <p className="text-muted">This certifies that</p>
            </div>

            {/* Student Name */}
            <div className="certificate-recipient mb-4">
              <h2 
                className="student-name"
                style={{
                  fontSize: '2rem',
                  fontWeight: '700',
                  color: '#2d3748',
                  borderBottom: '2px solid #e2e8f0',
                  paddingBottom: '0.5rem',
                  marginBottom: '1rem'
                }}
              >
                {certificate.studentName}
              </h2>
              <p className="completion-text">
                has successfully completed the course
              </p>
            </div>

            {/* Course Details */}
            <div className="certificate-course mb-4">
              <h3 
                className="course-title"
                style={{
                  fontSize: '1.5rem',
                  fontWeight: '600',
                  color: '#667eea',
                  marginBottom: '1rem'
                }}
              >
                {certificate.courseTitle}
              </h3>
              <div className="course-details">
                <p className="mb-1">
                  <strong>Instructor:</strong> {certificate.instructorName}
                </p>
                <p className="mb-1">
                  <strong>Duration:</strong> {certificate.courseDuration}
                </p>
                <p className="mb-1">
                  <strong>Completion Date:</strong> {formatDate(certificate.completionDate)}
                </p>
              </div>
            </div>

            {/* Signature Section */}
            <div className="certificate-signature mt-5">
              <div className="row">
                <div className="col-6">
                  <div className="signature-line">
                    <div 
                      style={{
                        borderTop: '2px solid #2d3748',
                        width: '200px',
                        margin: '0 auto 0.5rem'
                      }}
                    />
                    <p className="mb-0"><strong>LearnHub</strong></p>
                    <small className="text-muted">Platform</small>
                  </div>
                </div>
                <div className="col-6">
                  <div className="signature-line">
                    <div 
                      style={{
                        borderTop: '2px solid #2d3748',
                        width: '200px',
                        margin: '0 auto 0.5rem'
                      }}
                    />
                    <p className="mb-0"><strong>{certificate.instructorName}</strong></p>
                    <small className="text-muted">Instructor</small>
                  </div>
                </div>
              </div>
            </div>

            {/* Certificate ID */}
            <div className="certificate-id mt-4">
              <small className="text-muted">
                Certificate ID: {certificate.id}
              </small>
            </div>
          </div>
        </div>
      </Modal.Body>
      
      <Modal.Footer className="border-0">
        <Button variant="outline-secondary" onClick={handlePrint}>
          Print Certificate
        </Button>
        <Button variant="primary" onClick={handleDownload}>
          Download PDF
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default CertificateViewer;

import { Modal, Button } from 'react-bootstrap';
import { CheckCircle, CreditCard } from 'lucide-react';
import './GlassCard.css';
import './ModalStyles.css';

export const PaymentPage = ({ show, onHide, bookingSummary, onPaymentSuccess, onBookNowPayLater, points, onUsePoints }: any) => {
  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header closeButton className="border-0">
        <Modal.Title className="fw-bold">Finalize Your Booking</Modal.Title>
      </Modal.Header>
      <Modal.Body className="glass-card p-4">
        <div className="glass-card mb-4 p-3 rounded">
          <h6 className="fw-bold mb-2">Booking Summary</h6>
          <div className="d-flex justify-content-between small">
            <span>Service: {bookingSummary.services.map((s: any) => s.name).join(', ')}</span>
            <span className="fw-bold">₹{bookingSummary.amount}</span>
          </div>
          <div className="small text-muted mt-1">
            {bookingSummary.date} at {bookingSummary.time}
          </div>
        </div>

          <div className="glass-card mb-4">
            <h6 className="fw-bold mb-2 text-white">Ritual Required</h6>
            <p className="mb-0 text-white/70">Please confirm that you have completed the necessary ritual before proceeding.</p>
          </div>
          {/* Identity Verified */}
<div className="glass-card mb-4"><h6 className="fw-bold mb-2 text-white">Identity Verified</h6><p className="mb-0 text-white/70">Your identity has been verified. You may continue with the payment.</p></div>
          {points > 0 && (
            <div className="mb-4 p-3 border border-warning rounded bg-warning bg-opacity-10">
              <h6 className="fw-bold mb-2">Loyalty Points</h6>
              <p className="small mb-2">You have {points} points. Use them for a discount!</p>
              <div className="d-flex gap-2">
                <input type="number" className="form-control form-control-sm" placeholder="Points to use" />
                <Button variant="warning" size="sm" onClick={() => onUsePoints(50, 5)}>Apply</Button>
              </div>
            </div>
          )}

        <div className="d-grid gap-3">
          <Button variant="primary" size="lg" className="d-flex align-items-center justify-content-center gap-2" onClick={() => onPaymentSuccess({ transactionId: 'TXN' + Math.random().toString(36).substr(2, 9), amount: bookingSummary.amount, paymentMethod: 'Card' })}>
            <CreditCard size={20} /> Pay Now Online
          </Button>
          <Button variant="outline-dark" size="lg" onClick={() => onBookNowPayLater({ branch: 'Main', address: 'User Address' })}>
            Book Now, Pay Later
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export const ConfirmationPage = ({ show, onHide, transactionId, amount, paymentMethod, onDone }: any) => {
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Body className="text-center p-5">
        <CheckCircle size={64} className="text-success mb-4" />
        <h2 className="fw-bold mb-3">Booking Confirmed!</h2>
        <p className="text-muted mb-4">Your appointment has been successfully scheduled.</p>
        
        <div className="bg-light p-3 rounded text-start mb-4">
          <div className="d-flex justify-content-between mb-2">
            <span className="text-muted">Transaction ID:</span>
            <span className="fw-bold">{transactionId || 'N/A'}</span>
          </div>
          <div className="d-flex justify-content-between mb-2">
            <span className="text-muted">Amount Paid:</span>
            <span className="fw-bold">₹{amount}</span>
          </div>
          <div className="d-flex justify-content-between">
            <span className="text-muted">Payment Method:</span>
            <span className="fw-bold">{paymentMethod || 'Pay at Salon'}</span>
          </div>
        </div>

        <Button variant="primary" className="w-100 py-3" onClick={onDone}>
          Done
        </Button>
      </Modal.Body>
    </Modal>
  );
};

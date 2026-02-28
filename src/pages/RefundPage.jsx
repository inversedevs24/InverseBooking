import React from 'react'

export default function RefundPage() {
  return (
    <div className="static-page">
      <div className="container">
        <h1 className="page-title">Cancellation &amp; Refund Policy</h1>
        <div className="static-card">
          <h3 className="static-h">User Cancellations</h3>
          <ul>
            <li>Urgent Rides: Free if cancelled within 5 minutes and driver not dispatched</li>
            <li>Scheduled Rides: Free if cancelled more than 24 hours before pickup</li>
            <li>Cancellations after driver dispatch may incur charges</li>
          </ul>

          <h3 className="static-h">InverseRide Cancellations</h3>
          <ul>
            <li>If we are unable to fulfill your booking, it will be cancelled and fully refunded</li>
          </ul>

          <h3 className="static-h">Refund Processing</h3>
          <ul>
            <li>Any approved refunds will be processed and settled within 15 working days from the date of confirmation, in accordance with our refund policy</li>
            <li>Cancellations made within 24 hours of pickup are non-refundable</li>
            <li>No refund if cancellation is due to incorrect flight details provided by the customer</li>
            <li>No refund for weather conditions or forecasts</li>
            <li>No refund for any reasons beyond our control (airline issues, delays, force majeure)</li>
            <li>Processed to the original payment method</li>
            <li>No refunds for no-shows or cancellations outside allowed windows</li>
            <li>Disputes must be reported within 48 hours of the ride</li>
          </ul>

          <h3 className="static-h">How to Request a Refund</h3>
          <ul>
            <li>Contact us at info@InverseRide.com with your booking ID</li>
            <li>Explain the reason for your cancellation or refund request</li>
            <li>Our team will review and respond within 2 business days</li>
          </ul>

          <h3 className="static-h">Dispute Resolution</h3>
          <ul>
            <li>All disputes must be reported within 48 hours of the completed or cancelled ride</li>
            <li>Provide booking reference and relevant details when contacting support</li>
            <li>InverseRide's decision on disputes is final, subject to applicable laws</li>
          </ul>

          <h3 className="static-h">Contact Us</h3>
          <ul>
            <li>Email: info@InverseRide.com</li>
            <li>Phone: +971 66 666 6666</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

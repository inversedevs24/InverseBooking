import React from 'react'

export default function BookingConditionsPage() {
  return (
    <div className="static-page">
      <div className="container">
        <h1 className="page-title">Booking Conditions</h1>
        <div className="static-card">
          <h3 className="static-h">Booking Types</h3>
          <ul>
            <li>Urgent Rides – For immediate pickup</li>
            <li>Scheduled Rides – Reserved in advance for specific date/time</li>
            <li>Services available for both types:
              <ul>
                <li>Transfers – One-way travel between fixed points</li>
                <li>Hourly Chauffeur – Vehicle with driver by the hour</li>
              </ul>
            </li>
          </ul>

          <h3 className="static-h">How to Book</h3>
          <ul>
            <li>Booking channels:
              <ul>
                <li>InverseRide mobile application</li>
                <li>Official website (www.InverseRide.com)</li>
              </ul>
            </li>
            <li>User requirements:
              <ul>
                <li>Provide accurate pickup/drop-off locations</li>
                <li>Choose vehicle type</li>
                <li>Select booking time (urgent/scheduled)</li>
                <li>Confirm fare and agree to terms</li>
              </ul>
            </li>
          </ul>

          <h3 className="static-h">Booking Confirmation</h3>
          <ul>
            <li>Confirmation occurs when:
              <ul>
                <li>You receive app/email notification</li>
                <li>Driver is assigned (urgent rides)</li>
              </ul>
            </li>
            <li>InverseRide may decline/cancel bookings if:
              <ul>
                <li>No driver available</li>
                <li>Incorrect/incomplete details</li>
                <li>Violates service rules or laws</li>
              </ul>
            </li>
          </ul>

          <h3 className="static-h">Driver Arrival &amp; Waiting Time</h3>
          <ul>
            <li>Urgent Rides: 30-60 minute estimated arrival</li>
            <li>Scheduled Rides: Arrival around booked time</li>
            <li>Waiting allowances:
              <ul>
                <li>15 minutes — standard pickups</li>
                <li>60 minutes — airport pickups</li>
              </ul>
            </li>
            <li>Extra waiting time may incur charges</li>
          </ul>

          <h3 className="static-h">Passenger Responsibilities</h3>
          <ul>
            <li>Arrive on time at the pickup location</li>
            <li>Keep phone available for driver contact</li>
            <li>Provide clear access for pickup/drop-off</li>
            <li>Ensure all information provided is accurate</li>
          </ul>

          <h3 className="static-h">Modifications</h3>
          <ul>
            <li>Scheduled rides may be modified up to 24 hours before pickup</li>
            <li>Urgent rides cannot be modified once confirmed</li>
            <li>Modifications subject to vehicle availability</li>
          </ul>

          <h3 className="static-h">Support &amp; Assistance</h3>
          <ul>
            <li>Email: info@InverseRide.com</li>
            <li>Phone: +971 66 666 6666</li>
            <li>Available 24/7 for urgent booking issues</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

/**
 * Admin Tour Started Email Template
 * Clean, professional design for admin notifications
 */


/**
 * Customer Tour Started Email Template
 * Welcoming, engaging design for customer notifications
 */
export function customerMail(tourData) {
  const {
    customerEmail = "customer@email.com",
    customerName = "Valued Customer",
    tourName = "Your Tour",
    tourId = "N/A",
    startTime = new Date().toLocaleString(),
    duration = "Please check with your guide",
    participantCount = 1,
    location = "As discussed",
    guideInfo = "",
    supportPhone = "+1-800-TOURS",
    supportEmail = "support@tours.com",
    tourTrackingUrl = "#",
  } = tourData;

  const participantText = participantCount > 1 ? "s" : "";

  return {
    to: customerEmail,
    from: "tours@company.com",
    subject: `Your Tour Has Started! - ${tourName}`,
    html: `<!DOCTYPE html>
    <html lang="en" style="background: #f7fafc; margin:0;">
      <head>
        <meta charset="UTF-8" />
        <title>Your Tour Has Started!</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <style>
          body {
            background: #f7fafc !important;
            font-family: 'Segoe UI', 'Arial', sans-serif;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 520px;
            background: #fff;
            margin: 56px auto;
            border-radius: 12px;
            box-shadow: 0 8px 24px rgba(44,62,80,0.09);
            padding: 32px 32px 28px 32px;
          }
          .header {
            background: linear-gradient(135deg, #27ae60 0%, #2ecc71 100%);
            color: #fff;
            padding: 24px;
            border-radius: 8px;
            margin-bottom: 24px;
            text-align: center;
          }
          .header h1 {
            margin: 0;
            font-size: 1.4rem;
            font-weight: 600;
          }
          .header .emoji {
            font-size: 1.8rem;
            margin-right: 8px;
          }
          h2 {
            font-size: 1.2rem;
            color: #2d3748;
            margin: 0 0 16px 0;
          }
          p {
            color: #4a5568;
            margin-bottom: 20px;
            line-height: 1.5;
          }
          .tour-card {
            background: linear-gradient(135deg, #f8fafc 0%, #edf2f7 100%);
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            padding: 24px;
            margin: 24px 0;
            position: relative;
            overflow: hidden;
          }
          .tour-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 4px;
            background: linear-gradient(90deg, #27ae60 0%, #2ecc71 100%);
          }
          .tour-title {
            color: #27ae60;
            font-size: 1.1rem;
            font-weight: 600;
            margin: 0 0 16px 0;
            display: flex;
            align-items: center;
          }
          .tour-title .emoji {
            margin-right: 8px;
          }
          .detail-row {
            display: flex;
            margin-bottom: 10px;
          }
          .detail-row:last-child {
            margin-bottom: 0;
          }
          .label {
            font-weight: 600;
            color: #2d3748;
            min-width: 120px;
            margin-right: 12px;
          }
          .value {
            color: #4a5568;
            flex: 1;
          }
          .highlight {
            background: linear-gradient(135deg, #e8f5e8 0%, #d5f4d5 100%);
            border-left: 4px solid #27ae60;
            border-radius: 6px;
            padding: 20px;
            margin: 24px 0;
          }
          .highlight h4 {
            color: #1a5a1a;
            margin: 0 0 12px 0;
            font-size: 1rem;
            display: flex;
            align-items: center;
          }
          .highlight .emoji {
            margin-right: 8px;
          }
          .highlight ul {
            margin: 0;
            padding-left: 20px;
            color: #2d5a2d;
          }
          .highlight li {
            margin-bottom: 6px;
          }
          .buttons {
            text-align: center;
            margin: 28px 0;
          }
          .cta-btn {
            display: inline-block;
            background: linear-gradient(90deg, #27ae60 0%, #2ecc71 100%);
            color: #fff !important;
            text-decoration: none;
            font-weight: 600;
            border-radius: 6px;
            padding: 12px 24px;
            font-size: 0.95rem;
            margin: 8px 6px;
            letter-spacing: 0.02em;
            transition: background 0.2s;
          }
          .cta-btn:hover {
            background: linear-gradient(90deg, #2ecc71 0%, #27ae60 100%);
          }
          .cta-btn.secondary {
            background: linear-gradient(90deg, #3498db 0%, #2980b9 100%);
          }
          .cta-btn.secondary:hover {
            background: linear-gradient(90deg, #2980b9 0%, #3498db 100%);
          }
          .divider {
            margin: 32px 0 20px 0;
            border: none;
            border-top: 1px solid #e2e8f0;
          }
          .footer {
            color: #a0aec0;
            font-size: 12px;
            text-align: center;
            margin-top: 28px;
          }
          .footer a {
            color: #27ae60;
            text-decoration: none;
          }
          .attribution {
            color: #a0aec0;
            font-size: 11px;
            text-align: center;
            margin: 10px 0 0 0;
          }
          @media (max-width: 600px){
            .container { 
              padding: 18px 4% 20px 4%; 
              margin: 20px auto;
            }
            .detail-row {
              flex-direction: column;
            }
            .label {
              min-width: auto;
              margin-bottom: 4px;
            }
            .cta-btn {
              display: block;
              margin: 12px 0;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1><span class="emoji">🎉</span>Your Tour Has Started!</h1>
          </div>
          
          <h2>Hello ${customerName},</h2>
          <p>Great news! Your tour experience has officially begun. Get ready for an amazing journey!</p>
          
          <div class="tour-card">
            <h3 class="tour-title">
              <span class="emoji">📍</span>${tourName}
            </h3>
            
            <div class="detail-row">
              <span class="label">Tour ID:</span>
              <span class="value">${tourId}</span>
            </div>
            <div class="detail-row">
              <span class="label">Started At:</span>
              <span class="value">${startTime}</span>
            </div>
            <div class="detail-row">
              <span class="label">Duration:</span>
              <span class="value">${duration}</span>
            </div>
            <div class="detail-row">
              <span class="label">Meeting Point:</span>
              <span class="value">${location}</span>
            </div>
            <div class="detail-row">
              <span class="label">Group Size:</span>
              <span class="value">${participantCount} participant${participantText}</span>
            </div>
            ${
              guideInfo
                ? `
            <div class="detail-row">
              <span class="label">Your Guide:</span>
              <span class="value">${guideInfo}</span>
            </div>
            `
                : ""
            }
          </div>
          
          <div class="highlight">
            <h4><span class="emoji">🔥</span>Important Reminders:</h4>
            <ul>
              <li>Stay with your group and follow your guide's instructions</li>
              <li>Keep your booking confirmation handy</li>
              <li>Bring any required items mentioned in your booking</li>
              <li>Feel free to ask questions and enjoy the experience!</li>
            </ul>
          </div>
          
          <p>Need assistance during your tour?</p>
          
          <div class="buttons">
            <a href="tel:${supportPhone}" class="cta-btn">📞 Call Support</a>
            <a href="${tourTrackingUrl}" class="cta-btn secondary">📱 Track Tour</a>
          </div>
          
          <p>We hope you have an incredible experience! Don't forget to share your moments with us.</p>
          
          <hr class="divider" />
          <div class="footer">
            Thank you for choosing our tours! 🌟<br>
            Questions? Contact us at <a href="mailto:${supportEmail}">${supportEmail}</a>
          </div>
          <div class="attribution">
            &copy; 2025 Tour Company. All rights reserved.
          </div>
        </div>
      </body>
    </html>`,
  };
}

/**
 * Convenience function to send both tour started emails
 */
export async function sendTourStartedNotifications(tourData, emailSender) {
  try {
    const adminEmail = AdminTourStartedEmail(tourData);
    const customerEmail = CustomerTourStartedEmail(tourData);

    const results = await Promise.allSettled([
      emailSender(adminEmail),
      emailSender(customerEmail),
    ]);

    return {
      success: true,
      adminEmailResult: results[0],
      customerEmailResult: results[1],
      message: "Tour started notifications sent successfully",
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      message: "Failed to send tour started notifications",
    };
  }
}

// Usage Examples:
/*
// Example tour data
const tourData = {
  tourId: 'TOUR-2024-001',
  tourName: 'Historic City Walking Tour',
  customerName: 'John Smith',
  customerEmail: 'john.smith@email.com',
  adminEmail: 'admin@toursystem.com',
  startTime: new Date().toLocaleString(),
  duration: '2 hours',
  participantCount: 4,
  location: 'City Hall Main Entrance',
  guideInfo: 'Sarah Johnson - Licensed Tour Guide',
  supportPhone: '+1-555-TOURS',
  supportEmail: 'support@tours.com',
  adminDashboardUrl: 'https://admin.dashboard.com/tours/TOUR-2024-001',
  tourTrackingUrl: 'https://track.tours.com/TOUR-2024-001'
};

// Generate admin email
const adminEmail = AdminTourStartedEmail(tourData);
console.log(adminEmail.subject); // "Tour Started: Historic City Walking Tour - ID: TOUR-2024-001"

// Generate customer email  
const customerEmail = CustomerTourStartedEmail(tourData);
console.log(customerEmail.subject); // "Your Tour Has Started! - Historic City Walking Tour"

// Send both emails
await sendTourStartedNotifications(tourData, yourEmailSenderFunction);
*/

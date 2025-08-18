export function AdminMail(tourData) {
  // let { tourDetails, userDetails } = tourData;
  const {
    adminEmail = `${tourData.createdBy.name}`,
    tourName = `${tourData.name}`,
    // tourId = "N/A",
    customerName = userDetails.name,
    customerEmail = userDetails.email,
    // startTime = new Date().toLocaleString(),
    duration = `${tourDetails?.days}`,
    participantCount = userDetails.length,
    location = tourDetails.location,
    // adminDashboardUrl = "#",
  } = tourData;

  return {
    to: userDetails.mail,
    from: "noreply@toursystem.com",
    subject: `Tour Started: ${tourName} - ID: ${tourId}`,
    html: `<!DOCTYPE html>
    <html lang="en" style="background: #f7fafc; margin:0;">
      <head>
        <meta charset="UTF-8" />
        <title>Tour Started - Admin Notification</title>
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
            background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
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
          .tour-details {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
          }
          .detail-row {
            display: flex;
            margin-bottom: 12px;
          }
          .detail-row:last-child {
            margin-bottom: 0;
          }
          .label {
            font-weight: 600;
            color: #2d3748;
            min-width: 110px;
            margin-right: 12px;
          }
          .value {
            color: #4a5568;
            flex: 1;
          }
          .cta-btn {
            display: inline-block;
            background: linear-gradient(90deg, #3498db 0%, #2980b9 100%);
            color: #fff !important;
            text-decoration: none;
            font-weight: 600;
            border-radius: 6px;
            padding: 12px 28px;
            font-size: 0.95rem;
            margin: 20px 0;
            letter-spacing: 0.02em;
            transition: background 0.2s;
          }
          .cta-btn:hover {
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
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1><span class="emoji">🚀</span>Tour Started</h1>
          </div>
          
          <h2>Hello Admin,</h2>
          <p>A tour you created has been started successfully. Here are the details:</p>
          
          <div class="tour-details">
            <div class="detail-row">
              <span class="label">Tour Name:</span>
              <span class="value">${tourName}</span>
            </div>
            <div class="detail-row">
              <span class="label">Tour ID:</span>
              <span class="value">${tourId}</span>
            </div>
            <div class="detail-row">
              <span class="label">Started By:</span>
              <span class="value">${customerName}</span>
            </div>
            <div class="detail-row">
              <span class="label">Email:</span>
              <span class="value">${customerEmail}</span>
            </div>
            <div class="detail-row">
              <span class="label">Start Time:</span>
              <span class="value">${startTime}</span>
            </div>
            <div class="detail-row">
              <span class="label">Duration:</span>
              <span class="value">${duration}</span>
            </div>
            <div class="detail-row">
              <span class="label">Participants:</span>
              <span class="value">${participantCount}</span>
            </div>
            <div class="detail-row">
              <span class="label">Location:</span>
              <span class="value">${location}</span>
            </div>
          </div>
          
          <p>You can monitor this tour's progress through your admin dashboard.</p>
          
          <a href="${adminDashboardUrl}" class="cta-btn">View Dashboard</a>
          
          <hr class="divider" />
          <div class="footer">
            This is an automated notification from your Tour Management System.
          </div>
          <div class="attribution">
            &copy; 2025 Tour System. All rights reserved.
          </div>
        </div>
      </body>
    </html>`,
  };
}

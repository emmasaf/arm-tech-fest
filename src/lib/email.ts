import nodemailer from 'nodemailer'

// SMTP Configuration - These are fake configs until you add real ones
const emailConfig = {
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER || 'your-email@gmail.com',
    pass: process.env.SMTP_PASS || 'your-app-password',
  },
}

const fromEmail = process.env.FROM_EMAIL || 'noreply@armeventhub.com'
const adminEmails = process.env.ADMIN_EMAILS?.split(',') || ['admin@armeventhub.com']

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransporter(emailConfig)
}

// Email templates
const emailTemplates = {
  eventRequestSubmitted: {
    subject: 'New Event Registration Request',
    getHtml: (eventRequest: any) => `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Event Registration Request</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
          .event-details { background: white; padding: 20px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #667eea; }
          .detail-row { display: flex; justify-content: space-between; margin: 10px 0; padding: 8px 0; border-bottom: 1px solid #eee; }
          .label { font-weight: bold; color: #555; }
          .button { display: inline-block; background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 5px; }
          .button:hover { background: #5a6fd8; }
          .footer { text-align: center; color: #666; font-size: 12px; margin-top: 30px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 New Event Registration Request</h1>
            <p>A new event has been submitted for review</p>
          </div>
          
          <div class="content">
            <div class="event-details">
              <h2>${eventRequest.eventName}</h2>
              
              <div class="detail-row">
                <span class="label">Organizer:</span>
                <span>${eventRequest.organizerName}</span>
              </div>
              
              <div class="detail-row">
                <span class="label">Organization:</span>
                <span>${eventRequest.organizationName}</span>
              </div>
              
              <div class="detail-row">
                <span class="label">Email:</span>
                <span>${eventRequest.organizerEmail}</span>
              </div>
              
              <div class="detail-row">
                <span class="label">Phone:</span>
                <span>${eventRequest.organizerPhone}</span>
              </div>
              
              <div class="detail-row">
                <span class="label">Event Date:</span>
                <span>${new Date(eventRequest.startDate).toLocaleDateString()} - ${new Date(eventRequest.endDate).toLocaleDateString()}</span>
              </div>
              
              <div class="detail-row">
                <span class="label">Venue:</span>
                <span>${eventRequest.venueName}, ${eventRequest.city}, ${eventRequest.state}</span>
              </div>
              
              <div class="detail-row">
                <span class="label">Expected Attendance:</span>
                <span>${eventRequest.expectedAttendance}</span>
              </div>
              
              <div class="detail-row">
                <span class="label">Ticket Price:</span>
                <span>${eventRequest.isFree ? 'Free Event' : `$${eventRequest.ticketPrice}`}</span>
              </div>
              
              <div class="detail-row">
                <span class="label">Submitted:</span>
                <span>${new Date(eventRequest.submittedAt).toLocaleString()}</span>
              </div>
            </div>
            
            <div style="text-align: center; margin-top: 30px;">
              <p><strong>Please review this request in the admin dashboard.</strong></p>
              <a href="${process.env.NEXTAUTH_URL}/dashboard/moderator/event-requests" class="button">
                Review Request
              </a>
            </div>
            
            <div class="event-details">
              <h3>Event Description:</h3>
              <p>${eventRequest.eventDescription}</p>
              
              ${eventRequest.organizationDescription ? `
                <h3>Organization Description:</h3>
                <p>${eventRequest.organizationDescription}</p>
              ` : ''}
              
              ${eventRequest.specialRequirements ? `
                <h3>Special Requirements:</h3>
                <p>${eventRequest.specialRequirements}</p>
              ` : ''}
            </div>
          </div>
          
          <div class="footer">
            <p>This is an automated message from ArmEventHub</p>
            <p>Request ID: ${eventRequest.id}</p>
          </div>
        </div>
      </body>
      </html>
    `,
  },
  
  eventRequestApproved: {
    subject: 'Event Registration Approved! 🎉',
    getHtml: (eventRequest: any) => `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Event Registration Approved</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
          .success-box { background: #ecfdf5; border: 1px solid #10b981; padding: 20px; border-radius: 6px; margin: 20px 0; }
          .event-details { background: white; padding: 20px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #10b981; }
          .button { display: inline-block; background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 5px; }
          .button:hover { background: #059669; }
          .footer { text-align: center; color: #666; font-size: 12px; margin-top: 30px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Congratulations!</h1>
            <p>Your event registration has been approved</p>
          </div>
          
          <div class="content">
            <div class="success-box">
              <h2>✅ ${eventRequest.eventName} - APPROVED</h2>
              <p>Great news! Your event registration has been reviewed and approved by our team.</p>
            </div>
            
            <div class="event-details">
              <h3>Event Details:</h3>
              <p><strong>Event:</strong> ${eventRequest.eventName}</p>
              <p><strong>Date:</strong> ${new Date(eventRequest.startDate).toLocaleDateString()} - ${new Date(eventRequest.endDate).toLocaleDateString()}</p>
              <p><strong>Venue:</strong> ${eventRequest.venueName}, ${eventRequest.city}, ${eventRequest.state}</p>
              <p><strong>Approved on:</strong> ${new Date(eventRequest.reviewedAt).toLocaleString()}</p>
              
              ${eventRequest.reviewNotes ? `
                <div style="background: #f0f9ff; border-left: 4px solid #0ea5e9; padding: 15px; margin: 15px 0;">
                  <h4>Review Notes:</h4>
                  <p>${eventRequest.reviewNotes}</p>
                </div>
              ` : ''}
            </div>
            
            <div style="text-align: center; margin-top: 30px;">
              <p><strong>What's Next?</strong></p>
              <ul style="text-align: left; display: inline-block;">
                <li>Your event is now live on our platform</li>
                <li>Users can discover and purchase tickets</li>
                <li>You'll receive notifications for ticket sales</li>
                <li>Access your organizer dashboard to manage your event</li>
              </ul>
              
              <a href="${process.env.NEXTAUTH_URL}/dashboard/organizer/events" class="button">
                Manage My Events
              </a>
              <a href="${process.env.NEXTAUTH_URL}/events" class="button">
                View Event Listing
              </a>
            </div>
          </div>
          
          <div class="footer">
            <p>Thank you for choosing ArmEventHub!</p>
            <p>Request ID: ${eventRequest.id}</p>
          </div>
        </div>
      </body>
      </html>
    `,
  },
  
  eventRequestRejected: {
    subject: 'Event Registration Update',
    getHtml: (eventRequest: any) => `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Event Registration Update</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
          .rejection-box { background: #fef2f2; border: 1px solid #ef4444; padding: 20px; border-radius: 6px; margin: 20px 0; }
          .event-details { background: white; padding: 20px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #ef4444; }
          .button { display: inline-block; background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 5px; }
          .button:hover { background: #5a6fd8; }
          .footer { text-align: center; color: #666; font-size: 12px; margin-top: 30px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Event Registration Update</h1>
            <p>Regarding your event: ${eventRequest.eventName}</p>
          </div>
          
          <div class="content">
            <div class="rejection-box">
              <h2>Application Status: Not Approved</h2>
              <p>Thank you for your interest in hosting an event on ArmEventHub. After careful review, we're unable to approve your current application.</p>
            </div>
            
            <div class="event-details">
              <h3>Event Details:</h3>
              <p><strong>Event:</strong> ${eventRequest.eventName}</p>
              <p><strong>Submitted:</strong> ${new Date(eventRequest.submittedAt).toLocaleDateString()}</p>
              <p><strong>Reviewed:</strong> ${new Date(eventRequest.reviewedAt).toLocaleString()}</p>
              
              ${eventRequest.rejectionReason ? `
                <div style="background: #fef2f2; border-left: 4px solid #ef4444; padding: 15px; margin: 15px 0;">
                  <h4>Reason for Decision:</h4>
                  <p>${eventRequest.rejectionReason}</p>
                </div>
              ` : ''}
              
              ${eventRequest.reviewNotes ? `
                <div style="background: #f0f9ff; border-left: 4px solid #0ea5e9; padding: 15px; margin: 15px 0;">
                  <h4>Additional Notes:</h4>
                  <p>${eventRequest.reviewNotes}</p>
                </div>
              ` : ''}
            </div>
            
            <div style="text-align: center; margin-top: 30px;">
              <p><strong>What You Can Do:</strong></p>
              <ul style="text-align: left; display: inline-block;">
                <li>Review our event guidelines and policies</li>
                <li>Address the concerns mentioned above</li>
                <li>Submit a new application with updated information</li>
                <li>Contact our support team if you have questions</li>
              </ul>
              
              <a href="${process.env.NEXTAUTH_URL}/register-event" class="button">
                Submit New Application
              </a>
              <a href="${process.env.NEXTAUTH_URL}/contact" class="button">
                Contact Support
              </a>
            </div>
          </div>
          
          <div class="footer">
            <p>We appreciate your understanding and look forward to working with you in the future.</p>
            <p>Request ID: ${eventRequest.id}</p>
          </div>
        </div>
      </body>
      </html>
    `,
  },
}

// Email sending functions
export async function sendEventRequestNotification(eventRequest: any) {
  try {
    const transporter = createTransporter()
    const template = emailTemplates.eventRequestSubmitted
    
    // Send to all admin emails
    const emailPromises = adminEmails.map(adminEmail => 
      transporter.sendMail({
        from: fromEmail,
        to: adminEmail,
        subject: template.subject,
        html: template.getHtml(eventRequest),
      })
    )
    
    await Promise.all(emailPromises)
    console.log(`Event request notification sent to ${adminEmails.length} admins`)
    
  } catch (error) {
    console.error('Failed to send event request notification:', error)
    throw error
  }
}

export async function sendEventRequestStatusEmail(eventRequest: any) {
  try {
    const transporter = createTransporter()
    
    let template
    switch (eventRequest.status) {
      case 'APPROVED':
        template = emailTemplates.eventRequestApproved
        break
      case 'REJECTED':
        template = emailTemplates.eventRequestRejected
        break
      default:
        throw new Error(`Unknown status: ${eventRequest.status}`)
    }
    
    await transporter.sendMail({
      from: fromEmail,
      to: eventRequest.organizerEmail,
      subject: template.subject,
      html: template.getHtml(eventRequest),
    })
    
    console.log(`Status email sent to ${eventRequest.organizerEmail} for status: ${eventRequest.status}`)
    
  } catch (error) {
    console.error('Failed to send status email:', error)
    throw error
  }
}

// Test email function (for development)
export async function sendTestEmail(to: string) {
  try {
    const transporter = createTransporter()
    
    await transporter.sendMail({
      from: fromEmail,
      to,
      subject: 'Test Email from ArmEventHub',
      html: `
        <h1>Test Email</h1>
        <p>If you're receiving this email, your SMTP configuration is working correctly!</p>
        <p>Sent at: ${new Date().toISOString()}</p>
      `,
    })
    
    console.log(`Test email sent to ${to}`)
    return true
    
  } catch (error) {
    console.error('Failed to send test email:', error)
    return false
  }
}
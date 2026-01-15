// Updated with green theme

export const passwordChangedEmailTemplate = (userName, timestamp, deviceInfo = "Unknown Device") => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Update Confirmation - EcoTrack Security Notice</title>
    <style>
        body {
            font-family: 'Georgia', 'Times New Roman', serif;
            line-height: 1.8;
            color: #1a202c;
            margin: 0;
            padding: 20px;
            background-color: #f8f9fa;
        }
        .official-container {
            max-width: 650px;
            margin: 0 auto;
            background: white;
            border: 1px solid #d1fae5;
            box-shadow: 0 4px 6px rgba(5, 150, 105, 0.1);
        }
        .security-header {
            background: linear-gradient(to right, #059669, #10b981);
            color: white;
            padding: 30px;
            border-bottom: 4px solid #047857;
        }
        .security-seal {
            display: inline-block;
            width: 80px;
            height: 80px;
            background: white;
            border-radius: 50%;
            text-align: center;
            line-height: 80px;
            font-weight: bold;
            color: #059669;
            border: 3px solid white;
            margin-bottom: 20px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .security-title {
            font-size: 22px;
            font-weight: bold;
            margin: 10px 0 5px 0;
            letter-spacing: 1px;
        }
        .security-subtitle {
            font-size: 14px;
            opacity: 0.9;
            font-weight: normal;
        }
        .content-section {
            padding: 40px;
        }
        .confirmation-box {
            background: #f0fdf4;
            border: 2px solid #86efac;
            padding: 25px;
            margin: 25px 0;
            border-radius: 8px;
        }
        .activity-log {
            background: #f8fafc;
            border: 1px solid #d1fae5;
            padding: 20px;
            margin: 25px 0;
            font-family: 'Courier New', monospace;
            font-size: 14px;
        }
        .security-checklist {
            background: #f0fdf4;
            border-left: 4px solid #10b981;
            padding: 20px;
            margin: 25px 0;
        }
        .action-required {
            background: #fffbeb;
            border: 2px solid #fbbf24;
            padding: 20px;
            margin: 25px 0;
            border-radius: 8px;
        }
        .official-stamp {
            text-align: center;
            margin: 30px 0;
            padding: 20px;
            border-top: 2px solid #d1fae5;
            border-bottom: 2px solid #d1fae5;
        }
        .stamp {
            font-size: 16px;
            color: #059669;
            font-weight: bold;
            padding: 10px 30px;
            border: 2px solid #059669;
            display: inline-block;
            border-radius: 4px;
            background: #f0fdf4;
        }
        .footer {
            background: #065f46;
            color: white;
            padding: 30px 40px;
        }
        .security-contact {
            margin-top: 15px;
            line-height: 1.6;
            color: #a7f3d0;
        }
        .emergency-notice {
            background: #dc2626;
            color: #fecaca;
            padding: 15px;
            margin-top: 20px;
            border-radius: 4px;
            font-size: 12px;
        }
    </style>
</head>
<body>
    <div class="official-container">
        <div class="security-header">
            <div class="security-seal">🔒</div>
            <div class="security-title">SECURITY NOTIFICATION: PASSWORD UPDATED</div>
            <div class="security-subtitle">ECO-TRACK ENVIRONMENTAL MONITORING SYSTEM</div>
        </div>

        <div class="content-section">
            <div style="margin-bottom: 25px; padding-bottom: 15px; border-bottom: 2px solid #d1fae5;">
                <div style="font-size: 18px; font-weight: bold; color: #065f46;">SECURITY ALERT: ACCOUNT CREDENTIALS MODIFIED</div>
                <div style="color: #6b7280; margin-top: 5px;">Reference: SEC-${Date.now().toString().slice(-8)}</div>
                <div style="color: #6b7280; margin-top: 5px;">Time: ${timestamp}</div>
            </div>

            <div class="confirmation-box">
                <strong style="color: #065f46; font-size: 18px;">CONFIRMATION: PASSWORD SUCCESSFULLY CHANGED</strong>
                <p style="margin: 15px 0; color: #1f2937;">This is an official confirmation that the password for your EcoTrack account has been successfully updated.</p>
            </div>

            <p>Dear <strong style="color: #065f46;">${userName}</strong>,</p>

            <p style="color: #4b5563;">This notification confirms that your EcoTrack account password was successfully changed as requested. This is a standard security notification sent for all credential modifications.</p>

            <div class="activity-log">
                <div style="color: #6b7280; margin-bottom: 10px; font-weight: bold;">SECURITY EVENT DETAILS:</div>
                <div style="color: #374151;">▸ Event: Password Change</div>
                <div style="color: #374151;">▸ Status: <span style="color: #059669; font-weight: bold;">COMPLETED</span></div>
                <div style="color: #374151;">▸ Time: ${timestamp}</div>
                <div style="color: #374151;">▸ Account: ${userName}</div>
                <div style="color: #374151;">▸ Device: ${deviceInfo}</div>
                <div style="color: #374151;">▸ IP Address: [REDACTED FOR SECURITY]</div>
                <div style="color: #374151;">▸ Location: [AUTO-DETECTED]</div>
            </div>

            <div class="security-checklist">
                <strong style="color: #065f46; font-size: 16px;">SECURITY CHECKLIST - RECOMMENDED ACTIONS:</strong>
                <ul style="margin: 15px 0; padding-left: 20px; color: #374151;">
                    <li>✓ Your password has been updated successfully</li>
                    <li>✓ All active sessions except this one have been terminated</li>
                    <li>✓ Security alerts have been reset</li>
                    <li>✓ Account recovery options remain unchanged</li>
                </ul>
            </div>

            <div class="action-required">
                <strong style="color: #92400e; font-size: 16px;">ACTION REQUIRED IF YOU DID NOT MAKE THIS CHANGE:</strong>
                <p style="margin: 10px 0; color: #78350f;">If you did not initiate this password change, take immediate action:</p>
                <ol style="margin: 10px 0; padding-left: 20px; color: #78350f;">
                    <li>Use the "Forgot Password" feature to regain access</li>
                    <li>Contact EcoTrack Security immediately</li>
                    <li>Review recent account activity</li>
                    <li>Update your security questions</li>
                </ol>
            </div>

            <div class="official-stamp">
                <div class="stamp">SECURITY EVENT LOGGED & CONFIRMED</div>
                <div style="margin-top: 10px; color: #6b7280; font-size: 14px;">
                    This event has been recorded in the EcoTrack Security Log (Entry #${Date.now().toString().slice(-10)})
                </div>
            </div>

            <p style="color: #4b5563;"><strong>Important Security Reminder:</strong> For your protection, never share your password with anyone. EcoTrack officials will never ask for your password via email, phone, or in person.</p>

            <p><strong style="color: #065f46;">Respectfully,</strong><br>
            EcoTrack Security Division<br>
            Department of Environmental Protection</p>
        </div>

        <div class="footer">
            <strong style="font-size: 16px; color: #a7f3d0;">EcoTrack Security Division</strong><br>
            <div class="security-contact">
                Department of Environmental Protection<br>
                📍 123 Environmental Plaza, Government District<br>
                📞 Security Hotline: (555) 123-SECU (7328)<br>
                📧 security@ecotrack.gov<br>
                🌐 https://ecotrack.gov/security
            </div>

            <div class="emergency-notice">
                <strong>EMERGENCY CONTACT:</strong> If you believe your account has been compromised, contact security immediately at (555) 123-SECU (7328) or email security-emergency@ecotrack.gov
            </div>

            <div style="margin-top: 25px; font-size: 11px; color: #86efac;">
                This is an automated security notification from the EcoTrack system.<br>
                Do not reply to this email. For assistance, use the contact information above.<br>
                All security events are logged and monitored 24/7.
            </div>
        </div>
    </div>
</body>
</html>
`;
export const welcomeEmailTemplate = (userName, communityName = "your local community") => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to EcoTrack - Official Registration</title>
    <style>
        body {
            font-family: 'Georgia', 'Times New Roman', serif;
            line-height: 1.8;
            color: #1a202c;
            margin: 0;
            padding: 20px;
            background-color: #f8f9fa;
        }
        .official-container {
            max-width: 650px;
            margin: 0 auto;
            background: white;
            border: 1px solid #d1fae5;
            box-shadow: 0 4px 6px rgba(5, 150, 105, 0.1);
        }
        .welcome-header {
            background: linear-gradient(to right, #059669, #10b981);
            color: white;
            padding: 40px;
            border-bottom: 4px solid #047857;
            text-align: center;
        }
        .welcome-seal {
            width: 100px;
            height: 100px;
            background: white;
            border-radius: 50%;
            margin: 0 auto 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 48px;
            color: #059669;
            border: 4px solid white;
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }
        .welcome-title {
            font-size: 28px;
            font-weight: bold;
            margin: 10px 0;
            letter-spacing: 1px;
        }
        .welcome-subtitle {
            font-size: 16px;
            opacity: 0.9;
            font-weight: normal;
        }
        .content-section {
            padding: 40px;
        }
        .recipient-info {
            margin-bottom: 25px;
            padding-bottom: 15px;
            border-bottom: 2px solid #d1fae5;
        }
        .official-body {
            font-size: 16px;
            margin: 20px 0;
        }
        .welcome-box {
            background: #f0fdf4;
            border: 2px solid #86efac;
            padding: 25px;
            margin: 25px 0;
            border-radius: 8px;
        }
        .next-steps {
            background: #f0fdf4;
            border-left: 4px solid #10b981;
            padding: 20px;
            margin: 25px 0;
        }
        .credentials-box {
            background: #f8fafc;
            border: 1px dashed #d1fae5;
            padding: 20px;
            margin: 25px 0;
            font-family: 'Courier New', monospace;
        }
        .official-stamp {
            text-align: center;
            margin: 30px 0;
            padding: 20px;
            border-top: 2px solid #d1fae5;
            border-bottom: 2px solid #d1fae5;
        }
        .stamp-image {
            font-size: 14px;
            color: #059669;
            font-weight: bold;
            padding: 10px 20px;
            border: 2px solid #059669;
            display: inline-block;
            border-radius: 4px;
            background: #f0fdf4;
        }
        .footer {
            background: #065f46;
            color: white;
            padding: 30px 40px;
            text-align: center;
        }
        .contact-info {
            margin-top: 15px;
            line-height: 1.6;
            color: #a7f3d0;
        }
        .quick-links {
            margin-top: 20px;
        }
        .quick-links a {
            color: #86efac;
            text-decoration: none;
            margin: 0 10px;
        }
    </style>
</head>
<body>
    <div class="official-container">
        <div class="welcome-header">
            <div class="welcome-seal">✓</div>
            <div class="welcome-title">WELCOME TO ECO-TRACK</div>
            <div class="welcome-subtitle">ENVIRONMENTAL MONITORING & COMMUNITY PROTECTION SYSTEM</div>
        </div>

        <div class="content-section">
            <div class="recipient-info">
                <div style="font-size: 18px; font-weight: bold; color: #065f46;">OFFICIAL REGISTRATION CONFIRMATION</div>
                <div style="color: #6b7280; margin-top: 5px;">Registration ID: EC-${Date.now().toString().slice(-8)}</div>
                <div style="color: #6b7280; margin-top: 5px;">Date: ${new Date().toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                })}</div>
            </div>

            <div class="official-body">
                <p>Dear <strong style="color: #065f46;">${userName}</strong>,</p>

                <p style="color: #4b5563;">On behalf of the Department of Environmental Protection, we are pleased to officially welcome you to the EcoTrack Environmental Monitoring System. Your registration has been successfully processed and verified.</p>

                <div class="welcome-box">
                    <strong style="color: #065f46; font-size: 18px;">YOUR REGISTRATION DETAILS</strong>
                    <ul style="margin: 15px 0; padding-left: 20px; color: #374151;">
                        <li>Registration Status: <strong style="color: #059669;">ACTIVE</strong></li>
                        <li>Account Type: <strong>Community Environmental Monitor</strong></li>
                        <li>Assigned Community: <strong>${communityName}</strong></li>
                        <li>Access Level: <strong>Level 1 - Environmental Reporter</strong></li>
                        <li>Verification Status: <strong style="color: #059669;">VERIFIED</strong></li>
                    </ul>
                </div>

                <p style="color: #4b5563;">As a registered member of EcoTrack, you are now part of a nationwide initiative to monitor, report, and protect our environment through community-driven efforts.</p>

                <div class="next-steps">
                    <strong style="color: #065f46; font-size: 18px;">YOUR NEXT STEPS:</strong>
                    <ol style="margin: 15px 0; padding-left: 20px; color: #374151;">
                        <li>Complete your profile setup in the EcoTrack dashboard</li>
                        <li>Review the Environmental Reporting Guidelines</li>
                        <li>Join your local community discussions</li>
                        <li>Submit your first environmental report</li>
                        <li>Attend the virtual orientation (optional)</li>
                    </ol>
                </div>

                <div class="credentials-box">
                    <div style="margin-bottom: 10px; color: #6b7280;">IMPORTANT: Keep this information secure</div>
                    <div style="color: #374151;">• Your account is linked to: ${userName}</div>
                    <div style="color: #374151;">• Registration confirmed for: ${communityName}</div>
                    <div style="color: #374151;">• Official start date: ${new Date().toLocaleDateString()}</div>
                </div>

                <div class="official-stamp">
                    <div class="stamp-image">REGISTERED & VERIFIED</div>
                    <div style="margin-top: 10px; color: #6b7280; font-size: 14px;">
                        This registration has been officially recorded in the EcoTrack database
                    </div>
                </div>

                <p style="color: #4b5563;">Thank you for joining this important environmental initiative. Together, we can make a significant impact on preserving our natural resources for future generations.</p>

                <p><strong style="color: #065f46;">Respectfully,</strong><br>
                The EcoTrack Registration Committee<br>
                Department of Environmental Protection</p>
            </div>
        </div>

        <div class="footer">
            <strong style="font-size: 16px; color: #a7f3d0;">EcoTrack Environmental Monitoring System</strong><br>
            <div class="contact-info">
                Department of Environmental Protection<br>
                Government Environmental Initiative<br>
                📍 123 Environmental Plaza, Government District<br>
                📞 Environmental Hotline: (555) 123-ENVI (3684)<br>
                📧 support@ecotrack.gov<br>
                🕒 Support Hours: Mon-Fri, 8:00 AM - 6:00 PM EST
            </div>
            <div class="quick-links">
                <a href="https://ecotrack.gov/guide">User Guide</a> |
                <a href="https://ecotrack.gov/community">Community</a> |
                <a href="https://ecotrack.gov/report">Report Issue</a> |
                <a href="https://ecotrack.gov/contact">Contact</a>
            </div>
            <div style="margin-top: 25px; font-size: 11px; color: #86efac;">
                This is an official communication from the Department of Environmental Protection.<br>
                Unauthorized distribution or reproduction is prohibited.
            </div>
        </div>
    </div>
</body>
</html>
`;
export const resetPasswordEmailTemplate = (userName, resetLink, expiresIn = '60') => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset - EcoTrack Environmental Monitoring System</title>
    <style>
        body {
            font-family: 'Georgia', 'Times New Roman', serif;
            line-height: 1.8;
            color: #1a202c;
            margin: 0;
            padding: 20px;
            background-color: #f8f9fa;
        }
        .official-container {
            max-width: 650px;
            margin: 0 auto;
            background: white;
            border: 1px solid #d1fae5;
            box-shadow: 0 4px 6px rgba(5, 150, 105, 0.1);
        }
        .official-header {
            background: linear-gradient(to right, #059669, #10b981);
            color: white;
            padding: 30px;
            border-bottom: 4px solid #047857;
        }
        .agency-seal {
            display: inline-block;
            width: 80px;
            height: 80px;
            background: white;
            border-radius: 50%;
            text-align: center;
            line-height: 80px;
            font-weight: bold;
            color: #059669;
            border: 3px solid white;
            margin-bottom: 20px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .agency-title {
            font-size: 22px;
            font-weight: bold;
            margin: 10px 0 5px 0;
            letter-spacing: 1px;
        }
        .agency-subtitle {
            font-size: 14px;
            opacity: 0.9;
            font-weight: normal;
        }
        .content-section {
            padding: 40px;
            border-bottom: 1px solid #d1fae5;
        }
        .recipient-info {
            margin-bottom: 25px;
            padding-bottom: 15px;
            border-bottom: 2px solid #d1fae5;
        }
        .recipient-name {
            font-size: 18px;
            font-weight: bold;
            color: #065f46;
        }
        .date-stamp {
            text-align: right;
            color: #6b7280;
            font-size: 14px;
            margin-top: 5px;
        }
        .subject-line {
            font-size: 20px;
            font-weight: bold;
            color: #065f46;
            margin: 25px 0 15px 0;
        }
        .official-body {
            font-size: 16px;
            margin: 20px 0;
        }
        .security-notice {
            background: #fffbeb;
            border-left: 4px solid #fbbf24;
            padding: 15px;
            margin: 25px 0;
            font-size: 14px;
            color: #78350f;
        }
        .action-button {
            display: inline-block;
            background: linear-gradient(to right, #059669, #10b981);
            color: white;
            padding: 12px 30px;
            text-decoration: none;
            border-radius: 6px;
            font-weight: bold;
            margin: 20px 0;
            border: none;
            cursor: pointer;
            font-size: 16px;
            transition: all 0.3s ease;
            box-shadow: 0 4px 6px rgba(5, 150, 105, 0.2);
        }
        .action-button:hover {
            background: linear-gradient(to right, #047857, #059669);
            transform: translateY(-2px);
            box-shadow: 0 6px 8px rgba(5, 150, 105, 0.3);
        }
        .disclaimer {
            font-size: 12px;
            color: #6b7280;
            margin-top: 30px;
            padding-top: 15px;
            border-top: 1px solid #d1fae5;
        }
        .footer {
            background: #065f46;
            padding: 25px 40px;
            text-align: center;
            font-size: 13px;
            color: #a7f3d0;
        }
        .contact-info {
            margin-top: 15px;
            line-height: 1.6;
        }
    </style>
</head>
<body>
    <div class="official-container">
        <div class="official-header">
            <div class="agency-seal">ECS</div>
            <div class="agency-title">ECO-TRACK ENVIRONMENTAL MONITORING SYSTEM</div>
            <div class="agency-subtitle">DEPARTMENT OF ENVIRONMENTAL PROTECTION</div>
        </div>

        <div class="content-section">
            <div class="recipient-info">
                <div class="recipient-name">${userName}</div>
                <div class="date-stamp">Date: ${new Date().toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                })}</div>
            </div>

            <div class="subject-line">PASSWORD RESET REQUEST - OFFICIAL NOTIFICATION</div>

            <div class="official-body">
                <p>Dear <strong style="color: #065f46;">${userName}</strong>,</p>

                <p style="color: #4b5563;">This official communication is in response to your password reset request for the EcoTrack Environmental Monitoring System.</p>

                <p style="color: #4b5563;">To proceed with resetting your account credentials, please click the button below within the next ${expiresIn} minutes:</p>

                <div style="text-align: center; margin: 30px 0;">
                    <a href="${resetLink}" class="action-button">RESET PASSWORD</a>
                </div>

                <p style="color: #4b5563;">If you did not initiate this password reset request, please disregard this email or contact our security team immediately.</p>

                <div class="security-notice">
                    <strong>SECURITY NOTICE:</strong><br>
                    • This link expires in ${expiresIn} minutes<br>
                    • Do not share this email or link with anyone<br>
                    • Ensure you are on the official EcoTrack website<br>
                    • Our team will never ask for your password via email
                </div>

                <p style="color: #4b5563;">For security reasons, this request has been logged with the following information:</p>
                <ul style="color: #4b5563;">
                    <li>Request Time: ${new Date().toLocaleTimeString()}</li>
                    <li>Request IP: [SECURED]</li>
                    <li>Device Type: [AUTO-DETECTED]</li>
                </ul>
            </div>

            <div class="disclaimer">
                <strong>OFFICIAL DISCLAIMER:</strong><br>
                This is an automated message from the EcoTrack Environmental Monitoring System.
                Please do not reply to this email. For assistance, use the contact information below.
            </div>
        </div>

        <div class="footer">
            <strong style="color: #a7f3d0;">EcoTrack Environmental Monitoring System</strong><br>
            Department of Environmental Protection<br>
            <div class="contact-info">
                📍 123 Environmental Plaza, Government District<br>
                📞 (555) 123-ENVI (3684)<br>
                📧 security@ecotrack.gov<br>
                🌐 https://ecotrack.gov/support
            </div>
            <div style="margin-top: 20px; font-size: 11px; color: #86efac;">
                This message contains confidential information intended only for the addressee.<br>
                Unauthorized access, distribution, or copying is strictly prohibited.
            </div>
        </div>
    </div>
</body>
</html>
`;
export const adminWelcomeEmailTemplate = (adminName, adminId, accessLevel, department = "Environmental Protection Department") => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Portal Access Granted - EcoTrack Environmental System</title>
    <style>
        body {
            font-family: 'Georgia', 'Times New Roman', serif;
            line-height: 1.8;
            color: #1a202c;
            margin: 0;
            padding: 20px;
            background-color: #f8f9fa;
        }
        .official-container {
            max-width: 700px;
            margin: 0 auto;
            background: white;
            border: 2px solid #059669;
            box-shadow: 0 8px 16px rgba(5, 150, 105, 0.1);
        }
        .admin-header {
            background: linear-gradient(135deg, #047857 0%, #059669 100%);
            color: white;
            padding: 40px;
            border-bottom: 4px solid #fbbf24;
            text-align: center;
        }
        .admin-badge {
            width: 100px;
            height: 100px;
            background: white;
            border-radius: 50%;
            margin: 0 auto 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 42px;
            color: #059669;
            border: 4px solid #fbbf24;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
        .admin-title {
            font-size: 28px;
            font-weight: bold;
            margin: 10px 0;
            letter-spacing: 1.5px;
        }
        .admin-subtitle {
            font-size: 16px;
            opacity: 0.95;
            font-weight: normal;
            margin-top: 5px;
        }
        .content-section {
            padding: 40px;
        }
        .security-clearance {
            background: linear-gradient(to right, #fef3c7, #fde68a);
            border: 2px solid #f59e0b;
            padding: 25px;
            margin: 25px 0;
            border-radius: 8px;
            position: relative;
        }
        .clearance-stamp {
            position: absolute;
            top: -15px;
            right: 20px;
            background: #dc2626;
            color: white;
            padding: 8px 15px;
            border-radius: 4px;
            font-weight: bold;
            font-size: 14px;
        }
        .admin-credentials {
            background: #f8fafc;
            border: 2px dashed #d1fae5;
            padding: 25px;
            margin: 30px 0;
            font-family: 'Courier New', monospace;
            font-size: 14px;
        }
        .access-levels {
            background: #f0fdf4;
            border-left: 4px solid #10b981;
            padding: 25px;
            margin: 30px 0;
        }
        .responsibilities {
            background: #f0fdf4;
            border: 2px solid #10b981;
            padding: 25px;
            margin: 30px 0;
            border-radius: 8px;
        }
        .security-notice {
            background: #fef2f2;
            border: 2px solid #dc2626;
            padding: 25px;
            margin: 30px 0;
            border-radius: 8px;
        }
        .official-signature {
            margin: 40px 0;
            padding-top: 30px;
            border-top: 2px solid #d1fae5;
        }
        .signature-stamp {
            display: inline-block;
            padding: 15px 25px;
            background: #047857;
            color: white;
            border-radius: 4px;
            font-weight: bold;
            margin-top: 15px;
        }
        .footer {
            background: #065f46;
            color: white;
            padding: 40px;
        }
        .admin-resources {
            margin-top: 25px;
            padding-top: 25px;
            border-top: 1px solid #047857;
        }
        .emergency-line {
            background: #dc2626;
            color: #fecaca;
            padding: 20px;
            margin-top: 25px;
            border-radius: 6px;
            text-align: center;
        }
        .icon-list {
            list-style: none;
            padding: 0;
            margin: 20px 0;
        }
        .icon-list li {
            margin: 12px 0;
            padding-left: 30px;
            position: relative;
            color: #374151;
        }
        .icon-list li:before {
            content: "✓";
            position: absolute;
            left: 0;
            color: #059669;
            font-weight: bold;
            font-size: 18px;
        }
        .badge-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
            margin: 25px 0;
        }
        .badge-item {
            background: white;
            border: 1px solid #d1fae5;
            padding: 15px;
            border-radius: 6px;
            text-align: center;
            box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        }
        .badge-icon {
            font-size: 24px;
            margin-bottom: 10px;
            color: #059669;
        }
        .quick-links a {
            color: #86efac;
            text-decoration: none;
            margin: 0 8px;
        }
    </style>
</head>
<body>
    <div class="official-container">
        <div class="admin-header">
            <div class="admin-badge">⚡</div>
            <div class="admin-title">ADMINISTRATOR ACCESS GRANTED</div>
            <div class="admin-subtitle">ECO-TRACK ENVIRONMENTAL MONITORING SYSTEM</div>
            <div style="margin-top: 15px; font-size: 14px; opacity: 0.9;">${department}</div>
        </div>

        <div class="content-section">
            <div style="margin-bottom: 30px; padding-bottom: 20px; border-bottom: 3px solid #059669;">
                <div style="font-size: 20px; font-weight: bold; color: #047857;">OFFICIAL ADMINISTRATOR APPOINTMENT</div>
                <div style="color: #6b7280; margin-top: 10px;">
                    Appointment ID: ADM-${Date.now().toString().slice(-8)}<br>
                    Effective Date: ${new Date().toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    })}
                </div>
            </div>

            <p>Dear <strong style="color: #047857;">Administrator ${adminName}</strong>,</p>

            <p style="color: #4b5563;">On behalf of the Department of Environmental Protection, you are hereby granted administrative access to the EcoTrack Environmental Monitoring System. This appointment signifies the trust placed in you to oversee and manage critical environmental data and community reporting systems.</p>

            <div class="security-clearance">
                <div class="clearance-stamp">LEVEL ${accessLevel} CLEARANCE</div>
                <strong style="color: #92400e; font-size: 18px;">SECURITY CLEARANCE CONFIRMED</strong>
                <p style="margin: 15px 0; color: #78350f;">Your security background check has been completed and you have been granted Level ${accessLevel} administrative clearance.</p>
                <div style="display: flex; align-items: center; gap: 10px; margin-top: 15px;">
                    <span style="font-weight: bold; color: #78350f;">Clearance Status:</span>
                    <span style="background: #059669; color: white; padding: 5px 15px; border-radius: 20px; font-size: 14px;">ACTIVE & VERIFIED</span>
                </div>
            </div>

            <div class="admin-credentials">
                <div style="color: #6b7280; margin-bottom: 15px; font-size: 13px;">YOUR ADMINISTRATOR CREDENTIALS:</div>
                <div style="color: #374151;">• Administrator ID: <strong>${adminId}</strong></div>
                <div style="color: #374151;">• Access Level: <strong>Level ${accessLevel} Administrator</strong></div>
                <div style="color: #374151;">• Department: <strong>${department}</strong></div>
                <div style="color: #374151;">• Account Status: <strong style="color: #059669;">ACTIVE</strong></div>
                <div style="color: #374151;">• Initial Access: <strong>${new Date().toLocaleDateString()}</strong></div>
                <div style="color: #374151;">• Security Clearance: <strong style="color: #dc2626;">RESTRICTED ACCESS GRANTED</strong></div>
            </div>

            <div class="access-levels">
                <strong style="color: #047857; font-size: 18px;">GRANTED ADMINISTRATIVE PRIVILEGES:</strong>
                <div class="badge-grid">
                    <div class="badge-item">
                        <div class="badge-icon">📊</div>
                        <div><strong style="color: #065f46;">Data Management</strong></div>
                        <div style="font-size: 12px; color: #6b7280;">Full database access</div>
                    </div>
                    <div class="badge-item">
                        <div class="badge-icon">👥</div>
                        <div><strong style="color: #065f46;">User Administration</strong></div>
                        <div style="font-size: 12px; color: #6b7280;">User account management</div>
                    </div>
                    <div class="badge-item">
                        <div class="badge-icon">🚨</div>
                        <div><strong style="color: #065f46;">Emergency Access</strong></div>
                        <div style="font-size: 12px; color: #6b7280;">Priority system access</div>
                    </div>
                    <div class="badge-item">
                        <div class="badge-icon">📈</div>
                        <div><strong style="color: #065f46;">Reporting Tools</strong></div>
                        <div style="font-size: 12px; color: #6b7280;">Advanced analytics</div>
                    </div>
                </div>
            </div>

            <div class="responsibilities">
                <strong style="color: #047857; font-size: 18px;">ADMINISTRATOR RESPONSIBILITIES:</strong>
                <ul class="icon-list">
                    <li>Monitor and validate environmental reports from citizens</li>
                    <li>Coordinate with local government agencies on issue resolution</li>
                    <li>Manage user accounts and community permissions</li>
                    <li>Generate official environmental status reports</li>
                    <li>Respond to emergency environmental situations</li>
                    <li>Ensure data accuracy and system integrity</li>
                    <li>Conduct periodic security audits of the platform</li>
                    <li>Provide technical support to community leaders</li>
                </ul>
            </div>

            <div class="security-notice">
                <strong style="color: #dc2626; font-size: 18px;">IMPORTANT SECURITY PROTOCOLS:</strong>
                <ul style="margin: 15px 0; padding-left: 20px; color: #7f1d1d;">
                    <li>Never share your administrator credentials with anyone</li>
                    <li>Use the provided VPN for remote access</li>
                    <li>Enable two-factor authentication immediately</li>
                    <li>Log all administrative actions in the system log</li>
                    <li>Report any suspicious activity to security immediately</li>
                    <li>Complete mandatory security training within 7 days</li>
                </ul>
                <div style="margin-top: 20px; padding: 15px; background: #fecaca; border-radius: 4px; color: #7f1d1d;">
                    <strong>⚠️ SECURITY BREACH PROTOCOL:</strong> If you suspect unauthorized access, immediately contact the Security Division at (555) 123-SECU (7328)
                </div>
            </div>

            <div class="official-signature">
                <p><strong style="color: #047857;">This appointment has been approved by:</strong></p>
                <div style="margin-top: 20px;">
                    <div style="font-weight: bold; color: #047857;">Director of Environmental Operations</div>
                    <div style="color: #4b5563;">Department of Environmental Protection</div>
                    <div style="margin-top: 10px; color: #6b7280;">
                        <em>"Safeguarding our environment through responsible data management"</em>
                    </div>
                </div>
                <div class="signature-stamp">APPOINTMENT APPROVED</div>
            </div>

            <p style="color: #4b5563;">Your first administrative briefing is scheduled for <strong>${new Date(Date.now() + 86400000).toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric'
            })}</strong>. Attendance is mandatory.</p>

            <p><strong style="color: #047857;">Respectfully,</strong><br>
            EcoTrack Administrator Appointments Committee<br>
            Department of Environmental Protection</p>
        </div>

        <div class="footer">
            <strong style="font-size: 18px; color: #a7f3d0;">EcoTrack Administrative Portal</strong><br>
            <div style="margin-top: 15px; color: #a7f3d0;">
                Department of Environmental Protection<br>
                Government Environmental Administration System
            </div>

            <div class="admin-resources">
                <strong style="color: #86efac;">ADMINISTRATOR RESOURCES:</strong><br>
                <div style="margin-top: 15px; display: flex; flex-wrap: wrap; gap: 15px; justify-content: center;">
                    <a href="https://admin.ecotrack.gov/portal" class="quick-links">📋 Admin Portal</a>
                    <a href="https://admin.ecotrack.gov/training" class="quick-links">🎓 Training Modules</a>
                    <a href="https://admin.ecotrack.gov/manuals" class="quick-links">📚 Admin Manuals</a>
                    <a href="https://admin.ecotrack.gov/security" class="quick-links">🔒 Security Guidelines</a>
                    <a href="https://admin.ecotrack.gov/support" class="quick-links">🆘 Admin Support</a>
                </div>
            </div>

            <div class="emergency-line">
                <strong>🚨 ADMINISTRATOR EMERGENCY LINE:</strong><br>
                <div style="margin-top: 10px; font-size: 18px;">(555) 123-ADMN (2366)</div>
                <div style="font-size: 12px; margin-top: 5px;">Available 24/7 for critical system issues</div>
            </div>

            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #047857; font-size: 11px; color: #86efac;">
                <strong>CONFIDENTIAL & RESTRICTED:</strong> This email contains sensitive information intended only for the appointed administrator.<br>
                Unauthorized access, distribution, or reproduction is strictly prohibited and may result in legal action.<br>
                All administrative actions are monitored and logged for security purposes.
            </div>
        </div>
    </div>
</body>
</html>
`;
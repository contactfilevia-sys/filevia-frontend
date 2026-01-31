# Email Setup Guide for Contact Form

The contact form sends emails to `contact.filevia@gmail.com` using Gmail SMTP.

## Setup Instructions

### 1. Install Nodemailer

```bash
cd backend
npm install nodemailer
```

### 2. Configure Gmail App Password

Since Gmail requires App Passwords for SMTP authentication:

1. Go to your Google Account: https://myaccount.google.com/
2. Enable **2-Step Verification** (if not already enabled)
3. Go to **App Passwords**: https://myaccount.google.com/apppasswords
4. Generate a new App Password:
   - Select "Mail" as the app
   - Select "Other (Custom name)" as the device
   - Enter "Filevia Backend" as the name
   - Click "Generate"
5. Copy the 16-character password (it will look like: `abcd efgh ijkl mnop`)

### 3. Configure Environment Variables

Create or update your `.env` file in the `backend` directory:

```env
# Email Configuration
EMAIL_USER=your-gmail-address@gmail.com
EMAIL_PASSWORD=your-16-character-app-password
CONTACT_EMAIL=contact.filevia@gmail.com
SITE_NAME=Filevia
```

**Important:**
- `EMAIL_USER`: Your Gmail address (the one you'll send emails from)
- `EMAIL_PASSWORD`: The 16-character App Password (remove spaces if any)
- `CONTACT_EMAIL`: The email address where contact form submissions will be sent (contact@filevia.com)
- `SITE_NAME`: Your site name (Filevia)

### 4. Restart Backend

After configuring, restart your backend server:

```bash
npm run dev
```

You should see:
```
✅ Email service configured. Contact emails will be sent to: contact.filevia@gmail.com
```

### 5. Test the Contact Form

1. Go to the contact page on your frontend
2. Fill out and submit the form
3. Check the `contact.filevia@gmail.com` inbox for the email

## Troubleshooting

### Email not sending?

1. **Check backend console** for error messages
2. **Verify App Password** is correct (16 characters, no spaces)
3. **Check 2-Step Verification** is enabled on your Google Account
4. **Verify email addresses** in `.env` are correct
5. **Check Gmail** for security alerts (Google may block sign-ins from new locations)

### Common Errors

- **"Invalid login"**: App Password is incorrect
- **"Less secure app access"**: Use App Password instead of regular password
- **"Connection timeout"**: Check firewall/network settings

## Security Notes

- Never commit `.env` file to git (it's already in `.gitignore`)
- App Passwords are safer than regular passwords
- Each App Password can be revoked individually
- Use different App Passwords for different applications

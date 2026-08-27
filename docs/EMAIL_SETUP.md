# PetAdopt Email Setup Guide

## Quick Start

### 1. Choose Your Email Provider

PetAdopt supports three email providers in priority order. Choose one based on your needs:

#### Option 1: Resend (Recommended ⭐)
- **Best for:** Developers and startups
- **Cost:** Free tier available, $20/month paid
- **Features:** Modern API, great documentation, webhook support
- **Setup time:** ~2 minutes

1. Sign up at https://resend.com
2. Generate an API key from the dashboard
3. Add to `.env`:
```bash
RESEND_API_KEY="re_xxxxxxxxxxxxxxxxxxxx"
```

#### Option 2: SendGrid
- **Best for:** Enterprise organizations
- **Cost:** Free tier (100 emails/day), paid plans available
- **Features:** Advanced analytics, template builder
- **Setup time:** ~5 minutes

1. Sign up at https://sendgrid.com
2. Create an API key: Settings → API Keys → Create API Key
3. Add to `.env`:
```bash
SENDGRID_API_KEY="SG.xxxxxxxxxxxxxxxxxxxx"
```

#### Option 3: SMTP (Any Provider)
- **Best for:** Self-hosted or custom solutions
- **Examples:** Gmail, AWS SES, Postmark, etc.
- **Setup time:** ~10 minutes

Gmail example:
```bash
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
SMTP_SECURE="false"
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env` and fill in your provider details:

```bash
# Email Service (choose one provider)
RESEND_API_KEY="your-api-key"
# OR
SENDGRID_API_KEY="your-api-key"
# OR SMTP settings above

# Required for all emails
EMAIL_FROM="noreply@petadopt.com"  # Change to your domain
APP_URL="http://localhost:3000"     # Your app base URL
```

### 3. Test Email Delivery

#### Development Mode (No Provider)
If no provider is configured, emails log to console:

```bash
[EMAIL-DEV] Would send email to user@example.com
Subject: Adoption Request
Content preview: <!DOCTYPE html>...
```

No API keys needed! Perfect for local development.

#### Test Sending Email

```bash
# Run the app
npm run dev

# Trigger an action that sends email:
# 1. Register a new user account
# 2. Submit an adoption request
# 3. Approve/reject adoption

# Check console for email logs
```

## Configuration Details

### Email Provider Priority

The service automatically selects the first configured provider:

1. **Resend** - If `RESEND_API_KEY` is set
2. **SendGrid** - If `SENDGRID_API_KEY` is set
3. **SMTP** - If `SMTP_HOST` is set
4. **Development** - If none of above are set (console logging)

### Email Configuration

| Variable | Required | Example |
|----------|----------|---------|
| RESEND_API_KEY | No | `re_xxxxxxxxxxxxxxxxxxxx` |
| SENDGRID_API_KEY | No | `SG.xxxxxxxxxxxxxxxxxxxx` |
| SMTP_HOST | No | `smtp.gmail.com` |
| SMTP_PORT | No | `587` |
| SMTP_USER | No | `user@example.com` |
| SMTP_PASS | No | `password` |
| SMTP_SECURE | No | `false` or `true` |
| EMAIL_FROM | Yes | `noreply@petadopt.com` |
| APP_URL | Yes | `http://localhost:3000` |

### Email Deliverability

Best practices for high delivery rates:

1. **Use a professional domain email**
   ```bash
   # Good
   EMAIL_FROM="noreply@petadopt.com"
   
   # Avoid
   EMAIL_FROM="no-reply@gmail.com"
   ```

2. **Set up SPF, DKIM, DMARC**
   - Instructions provided by your email provider
   - Critical for production deployments

3. **Monitor bounce rates**
   - Most providers have bounce notification webhooks
   - Keep bounce rate < 2%

4. **List unsubscribe headers**
   - All PetAdopt emails include unsubscribe links
   - Improves inbox placement

## Email Templates

### Available Email Types

1. **Welcome Email** - New user registration
2. **Adoption Request** - Pet owner notification
3. **Adoption Approved** - Adopter approval notification
4. **Adoption Rejected** - Adopter rejection notification
5. **Pet Matching** - New pet matching adopter preferences

### Template Customization

To customize email templates:

1. Edit `/src/lib/email.js`
2. Modify the template functions:
   - `getWelcomeEmailTemplate()`
   - `getAdoptionRequestEmailTemplate()`
   - `getAdoptionApprovedEmailTemplate()`
   - `getAdoptionRejectedEmailTemplate()`
   - `getPetMatchingEmailTemplate()`

3. Update styling in `buildEmailTemplate()` CSS section

### Branding

Current brand colors (can be customized):
- Primary Orange: `#FF8C42`
- Primary Blue: `#4A90E2`
- Success Green: `#2ECC71`

## Monitoring & Debugging

### View Email Logs

All email operations are logged to console:

```bash
# Successful send
[EMAIL] Successfully sent to user@example.com (MessageID: abc123def456)

# Retry attempt
[EMAIL] Send email to user@example.com via Resend failed on attempt 1/3: Connection timeout

# Final failure
[EMAIL] Failed to send email to user@example.com after 3 attempts: Service unavailable
```

### Debug Specific Emails

Enable Node.js debugging:

```bash
DEBUG=* npm run dev
```

### Monitor Delivery Status

Resend and SendGrid provide delivery status in their dashboards:

**Resend Dashboard:**
- https://resend.com/emails

**SendGrid Dashboard:**
- https://app.sendgrid.com/email_activity

## Troubleshooting

### Emails Not Sending

**Check 1: Provider is configured**
```bash
# Verify in .env
echo $RESEND_API_KEY  # Should show your key, not be empty
```

**Check 2: API key is valid**
- Test provider connection from their CLI/dashboard
- Resend: `npx resend list-emails`
- SendGrid: Visit dashboard and check recent activity

**Check 3: Email format is valid**
```javascript
// Valid
user@example.com
john.doe@company.co.uk

// Invalid
user@example  // missing TLD
@example.com  // missing username
user example@test.com  // space in email
```

**Check 4: APP_URL is set correctly**
```bash
# Should match your application URL
APP_URL="http://localhost:3000"  # development
APP_URL="https://app.petadopt.com"  # production
```

### High Retry Rates

If you see many retry attempts:

1. **Check provider status** - Visit provider's status page
2. **Check network** - Verify internet connectivity
3. **Check rate limits** - May have exceeded provider quota
4. **Check credentials** - May be using wrong API key

Example retry log:
```
[EMAIL] Send email to user@example.com via Resend failed on attempt 1/3: 429 Too Many Requests
[EMAIL] Send email to user@example.com via Resend failed on attempt 2/3: 429 Too Many Requests
[EMAIL] Failed to send email to user@example.com after 3 attempts: 429 Too Many Requests
```

Solution: Contact provider support or upgrade plan.

### SMTP Connection Issues

If using SMTP:

```bash
# Common error: "Invalid login credentials"
# Solution: Check username/password

# Common error: "Port connection refused"
# Solution: Verify port number (usually 587 or 465)

# Common error: "TLS required"
# Solution: Set SMTP_SECURE="true" and use port 465
```

Gmail-specific setup:
1. Enable "Less secure app access" or use App Password
2. Use app password instead of account password
3. Recommended: Use SMTP_SECURE="true" with port 465

## Production Deployment

### Pre-deployment Checklist

- [ ] Email provider account created and funded
- [ ] API key generated and stored securely
- [ ] All environment variables configured
- [ ] Send test emails to verify delivery
- [ ] SPF/DKIM/DMARC records added to domain
- [ ] Monitoring/alerts configured
- [ ] Fallback plan if email service goes down

### Setting Environment Variables

**Vercel:**
1. Go to Project Settings → Environment Variables
2. Add `RESEND_API_KEY` (or your chosen provider key)
3. Add `EMAIL_FROM` with your domain
4. Add `APP_URL` with production URL

**Docker:**
```dockerfile
ENV RESEND_API_KEY=${RESEND_API_KEY}
ENV EMAIL_FROM="noreply@petadopt.com"
ENV APP_URL="https://app.petadopt.com"
```

**Local Server:**
```bash
export RESEND_API_KEY="re_xxxxxxxxxxxxxxxxxxxx"
npm run start
```

### Cost Estimation

- **Resend**: ~$0 - $20/month depending on volume
- **SendGrid**: ~$0 - $30/month depending on volume
- **SMTP (Gmail)**: ~$0 (free account) or $9.99+ (Google Workspace)

## Additional Resources

- [Resend Documentation](https://resend.com/docs)
- [SendGrid Documentation](https://docs.sendgrid.com)
- [SMTP Guide](https://nodemailer.com/smtp/)
- [Email Best Practices](https://www.emailonacid.com/blog/article/email-best-practices)
- [SPF/DKIM/DMARC Setup](https://mxtoolbox.com/)

## Support

For help with email setup:

1. Check PetAdopt documentation
2. Review provider's documentation
3. Check console logs for error messages
4. Contact provider support
5. Open issue in PetAdopt repository

---

**Last Updated:** 2024-01-15  
**Email Service Version:** 2.0 (Resend + Retry Logic)

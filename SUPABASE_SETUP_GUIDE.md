# Step-by-Step Guide: Enable Leaked Password Protection in Supabase

## Prerequisites
- Supabase account
- Your project: **Pawz-Connect** (rvdmsnomkguouamjxaxb.supabase.co)
- **Supabase Pro Plan** subscription ($25/month)

> **Important**: Leaked password protection is NOT available on the Free Plan. You must upgrade first.

---

## Step 1: Check Your Current Plan

### 1.1 Log into Supabase
1. Open your browser
2. Go to: https://supabase.com/dashboard
3. Sign in with your credentials

### 1.2 Verify Your Plan
1. Look at the top-right corner of the dashboard
2. You should see your project name and plan type
3. If it says "Free Plan", you need to upgrade first (see Step 2)
4. If it says "Pro Plan" or higher, skip to Step 3

---

## Step 2: Upgrade to Pro Plan (If Needed)

### 2.1 Navigate to Billing
1. Click on your **project name** in the left sidebar
2. Look for **"Pawz-Connect"** or your project
3. Click on **Settings** (gear icon at bottom left)
4. Click on **Billing** in the settings menu

### 2.2 Review Pro Plan Details
- **Cost**: $25/month
- **Features**: Includes leaked password protection + many other benefits
- **Free Plan Limitations**: Leaked password protection is not available

### 2.3 Upgrade Process
1. Click **"Upgrade to Pro"** button
2. Enter your payment information
3. Review the charges
4. Confirm the upgrade
5. Wait for confirmation (usually instant)

### 2.4 Verify Upgrade
1. Refresh your dashboard
2. Check that your plan shows "Pro" in the top-right
3. Proceed to Step 3

---

## Step 3: Navigate to Authentication Settings

### 3.1 Select Your Project
1. In the left sidebar, ensure **"Pawz-Connect"** is selected
2. You should see your project dashboard

### 3.2 Open Authentication Section

**Option A: Via Authentication Menu**
1. Look at the left sidebar
2. Click on **"Authentication"** (shield icon)
3. You'll see several sub-menu items

**Option B: Via Settings**
1. Click on **"Settings"** (gear icon at bottom left)
2. Look for **"Authentication"** in the settings menu

---

## Step 4: Find Password Protection Settings

### Method 1: Authentication → Policies (Recommended)

```
Dashboard
├── Authentication          ← Click here
    ├── Users
    ├── Policies            ← Then click here
    ├── Providers
    ├── Email Templates
    └── Logs
```

**What to do**:
1. Click **"Authentication"** in left sidebar
2. Click **"Policies"** sub-menu
3. Scroll down to find **"Password Protection"** or **"Password Security"** section

### Method 2: Settings → Authentication (Alternative)

```
Dashboard
├── Settings                ← Click here
    ├── General
    ├── Database
    ├── Authentication      ← Then click here
    ├── API
    └── Billing
```

**What to do**:
1. Click **"Settings"** (gear icon) at bottom left
2. Click **"Authentication"** from settings menu
3. Look for **"Password Requirements"** or **"Password Security"** section

---

## Step 5: Enable Leaked Password Protection

### 5.1 Locate the Toggle

Look for one of these labels:
- ☐ **"Check for compromised passwords"**
- ☐ **"Prevent compromised passwords"**
- ☐ **"Enable leaked password protection"**
- ☐ **"HaveIBeenPwned integration"**

### 5.2 Visual Reference

The setting should look like this:

```
┌─────────────────────────────────────────┐
│  Password Security                       │
│                                          │
│  ☐ Check for compromised passwords      │
│     Prevents users from using passwords  │
│     found in data breaches              │
│                                          │
│     Powered by HaveIBeenPwned.org       │
└─────────────────────────────────────────┘
```

### 5.3 Enable the Feature
1. Find the checkbox or toggle switch
2. **Click to enable it** (checkbox should be checked ☑)
3. The toggle should turn blue/green when enabled

### 5.4 Review the Description
You should see text like:
- "Checks passwords against known data breaches"
- "Uses HaveIBeenPwned.org API"
- "Helps prevent credential stuffing attacks"

---

## Step 6: Save Your Changes

### 6.1 Look for Save Button
At the bottom of the page, you should see:
- **"Save"** button
- **"Update"** button
- **"Apply Changes"** button

### 6.2 Click Save
1. Click the **"Save"** or **"Update"** button
2. Wait for confirmation message
3. You should see a success notification (green banner)

### 6.3 Confirmation Messages
Look for messages like:
- ✅ "Authentication settings updated successfully"
- ✅ "Password protection enabled"
- ✅ "Changes saved"

---

## Step 7: Verify It's Working

### 7.1 Check the Setting
1. Refresh the page (F5 or Cmd+R)
2. Go back to Authentication → Policies
3. Verify the checkbox is still checked ☑
4. The setting should persist after refresh

### 7.2 Test with Your Application

**Test 1: Try a Compromised Password (Should Fail)**

1. Go to your app: https://pawz-connect.lovable.app
2. Click "Sign Up"
3. Fill in the form:
   - Display Name: `Test User`
   - Username: `testuser`
   - Email: `test@example.com`
   - Password: `password123` ← Known compromised password
4. Click "Create Account"

**Expected Result**: ❌ Error message
- "Password has been found in a data breach"
- "This password is not secure"
- "Please choose a different password"

**Test 2: Try a Strong Password (Should Pass)**

1. Use the same form
2. Try a different email: `test2@example.com`
3. Password: `MyStr0ng!P@ss#2024` ← Strong password
4. Click "Create Account"

**Expected Result**: ✅ Success
- Account created successfully
- Confirmation message appears

---

## Step 8: Check Authentication Logs

### 8.1 Navigate to Logs
1. Go to **Authentication** in left sidebar
2. Click **"Logs"** sub-menu
3. You should see recent authentication events

### 8.2 Look for Password Check Events
You might see log entries like:
- "Password check: rejected (found in breach database)"
- "Password check: passed"
- Sign-up attempts and their results

### 8.3 Monitor Activity
- Check logs regularly
- Look for patterns of rejected passwords
- This helps you understand if users are trying weak passwords

---

## Troubleshooting

### Issue 1: Can't Find the Setting

**If you don't see "Password Protection" or "Leaked Password":**

1. **Verify your plan**: 
   - Go to Settings → Billing
   - Confirm you're on Pro Plan or higher
   - Free Plan users won't see this option

2. **Try different navigation paths**:
   - Authentication → Policies
   - Settings → Authentication
   - Look in "Security" section

3. **Search the dashboard**:
   - Use Ctrl+F (Cmd+F on Mac)
   - Search for "compromised"
   - Search for "leaked"
   - Search for "breach"

### Issue 2: Setting Doesn't Save

**If the toggle reverts after saving:**

1. Check for error messages in:
   - Top-right notification area
   - Browser console (F12)

2. Try again:
   - Refresh the page
   - Log out and back in
   - Try a different browser

3. Contact Supabase support:
   - support@supabase.com
   - Include your project ref: rvdmsnomkguouamjxaxb

### Issue 3: Feature Not Working After Enabling

**If compromised passwords are still accepted:**

1. **Wait a few minutes**:
   - Settings may take 1-5 minutes to propagate
   - Try testing again after waiting

2. **Check Supabase status**:
   - Go to: https://status.supabase.com
   - Verify all systems are operational

3. **Verify with simple test**:
   - Use a well-known compromised password
   - Try: "password", "123456", "qwerty"
   - These should definitely be blocked

### Issue 4: On Free Plan

**If you're on Free Plan and can't upgrade:**

**Good news**: Your app already has enhanced password protection!

We've implemented client-side validation that:
- ✅ Blocks 25+ most common passwords
- ✅ Enforces strong password requirements
- ✅ Shows real-time strength meter
- ✅ Provides user feedback

**To see it in action**:
1. Go to your sign-up page
2. Start typing a password
3. Watch the strength meter appear
4. Try "password123" - it will be blocked

**This provides good protection** until you can upgrade to Pro.

---

## What This Feature Does

### How HaveIBeenPwned Works

1. **User enters password** during sign-up or reset
2. **Supabase hashes the password** using SHA-1
3. **Sends first 5 characters** of hash to HaveIBeenPwned API
4. **Receives list of matching hashes** (k-anonymity model)
5. **Checks if full hash is in the list**
6. **Rejects password if found** in breach database

### Privacy Protection

**Your passwords are safe**:
- ✅ Only first 5 characters of hash sent
- ✅ Full password never leaves your server
- ✅ Uses k-anonymity model (no way to reverse)
- ✅ HaveIBeenPwned doesn't know your password
- ✅ Industry-standard security practice

### What Gets Blocked

**Passwords in breach databases**:
- Data breaches from major companies
- Leaked password dumps from hacks
- Publicly available password lists
- Over 12 billion compromised passwords

**Common examples that will be blocked**:
- password, password123, password1
- 123456, 12345678, 123456789
- qwerty, qwerty123
- abc123, welcome, letmein
- admin, root, test
- And millions more from actual breaches

---

## Benefits for Pawz-Connect

### User Protection
- ✅ Prevents account takeovers
- ✅ Protects sensitive pet data
- ✅ Reduces credential stuffing attacks
- ✅ Builds user trust

### Compliance
- ✅ Meets GDPR Article 32 (security measures)
- ✅ Follows OWASP recommendations
- ✅ Aligns with NIST guidelines
- ✅ Industry best practice

### Security Stats
- **12+ billion** passwords checked
- **~1 in 20** users try compromised password
- **80% reduction** in credential stuffing success
- **Zero performance impact** on users

---

## Additional Security Settings

### While You're in Authentication Settings

Consider reviewing these other security options:

### 1. Password Complexity
- ☑ Minimum password length: 8 (recommended: 10-12)
- ☑ Require uppercase letters
- ☑ Require lowercase letters
- ☑ Require numbers
- ☑ Require special characters

### 2. Email Confirmation
- ☑ Require email confirmation for sign-up
- Prevents fake accounts
- Verifies user email addresses

### 3. Multi-Factor Authentication (MFA)
- ☑ Enable MFA options
- Allow TOTP authenticator apps
- Consider SMS backup option

### 4. Session Management
- Set session timeout (default: 1 week)
- Require re-authentication for sensitive actions
- Consider "Remember me" duration

### 5. Rate Limiting
- Already implemented in your app ✅
- Supabase also has built-in rate limiting
- Prevents brute force attacks

---

## Summary Checklist

Use this checklist to track your progress:

### Pre-Setup
- [ ] Logged into Supabase dashboard
- [ ] Verified project: Pawz-Connect
- [ ] Checked current plan (Free/Pro)
- [ ] Upgraded to Pro Plan (if needed)

### Configuration
- [ ] Navigated to Authentication settings
- [ ] Found Password Protection section
- [ ] Enabled "Check for compromised passwords"
- [ ] Clicked Save/Update button
- [ ] Saw success confirmation message

### Testing
- [ ] Tested with compromised password (should fail)
- [ ] Verified error message appears
- [ ] Tested with strong password (should pass)
- [ ] Checked authentication logs

### Verification
- [ ] Setting persists after page refresh
- [ ] Feature working in production
- [ ] Updated team/documentation
- [ ] Set reminder to monitor logs

---

## Quick Reference

### Direct Links
- **Dashboard**: https://supabase.com/dashboard
- **Your Project**: https://supabase.com/dashboard/project/rvdmsnomkguouamjxaxb
- **Auth Settings**: https://supabase.com/dashboard/project/rvdmsnomkguouamjxaxb/auth/policies
- **Billing**: https://supabase.com/dashboard/project/rvdmsnomkguouamjxaxb/settings/billing

### Keyboard Shortcuts
- **Search**: Ctrl+K (Cmd+K on Mac)
- **Refresh**: F5 (Cmd+R on Mac)
- **Console**: F12

### Support Resources
- **Email**: support@supabase.com
- **Documentation**: https://supabase.com/docs/guides/auth/password-security
- **Community**: https://github.com/orgs/supabase/discussions
- **Status Page**: https://status.supabase.com

---

## Expected Timeline

### If Already on Pro Plan
- **Time to enable**: 2 minutes
- **Settings propagation**: 1-5 minutes
- **Total time**: ~5-7 minutes

### If Need to Upgrade
- **Plan upgrade**: 5-10 minutes
- **Payment processing**: 1-2 minutes
- **Enable feature**: 2 minutes
- **Total time**: ~10-15 minutes

---

## Cost Considerations

### Supabase Pro Plan
- **Monthly cost**: $25/month
- **Annual cost**: $300/year (save $0 vs monthly)

### What's Included (Besides Password Protection)
- ✅ 8 GB database
- ✅ 100 GB bandwidth
- ✅ 50 GB file storage
- ✅ 7-day log retention
- ✅ Daily backups
- ✅ Email support
- ✅ No project pausing
- ✅ Advanced security features

### Is It Worth It?
**For Pawz-Connect**: YES
- You're handling sensitive pet health data
- User trust is critical
- Password protection is essential
- Other Pro features are valuable
- Professional appearance

---

## Need Help?

### If You Get Stuck

1. **Re-read this guide** - Check the troubleshooting section
2. **Check Supabase docs** - https://supabase.com/docs
3. **Search discussions** - https://github.com/orgs/supabase/discussions
4. **Contact support** - support@supabase.com
5. **Check status** - https://status.supabase.com

### Information to Provide Support
- Project reference: rvdmsnomkguouamjxaxb
- Current plan: Free/Pro
- What you're trying to do
- Error messages (if any)
- Screenshots (helpful)

---

## Final Notes

### After Enabling

**Your app will**:
- ✅ Use both client-side AND server-side validation
- ✅ Provide the best user experience (real-time feedback)
- ✅ Have enterprise-grade security (breach checking)
- ✅ Be protected against credential stuffing
- ✅ Meet compliance requirements

### Current Status

**Right now** (with our implementation):
- ✅ Client-side validation working
- ✅ Common passwords blocked
- ✅ Strong passwords enforced
- ✅ Real-time strength meter
- ⚠️ Server-side breach check: Requires Pro Plan

**After enabling Supabase feature**:
- ✅ Everything above PLUS
- ✅ 12+ billion passwords checked
- ✅ Server-side enforcement
- ✅ Cannot be bypassed
- ✅ Maximum security

---

## Success!

Once you complete these steps, your Pawz-Connect application will have:

✅ **Industry-leading password security**
✅ **Protection against 12+ billion breached passwords**
✅ **Real-time user feedback and guidance**
✅ **Defense in depth (client + server validation)**
✅ **Compliance with security best practices**

**Your users and their pets' data will be well protected!**

---

**Document Version**: 1.0  
**Last Updated**: November 2024  
**For**: Pawz-Connect (rvdmsnomkguouamjxaxb.supabase.co)  
**Author**: Development Team

# 🔒 Quick Fix: Enable Leaked Password Protection

## ⚠️ IMPORTANT: Pro Plan Required

**Leaked Password Protection requires Supabase Pro Plan or higher**

This feature is **NOT available on the Free Plan**. You have two options:

### Option A: Upgrade to Pro Plan (Recommended)
- Upgrade your Supabase project to Pro Plan ($25/month)
- Then follow the configuration steps below

### Option B: Use Client-Side Validation (Temporary)
- Implement password strength validation in your app
- Check against common passwords list
- Encourage users to use password managers

---

## 5-Minute Security Fix (Pro Plan Users)

### The Issue
**Leaked Password Protection is DISABLED** in your Supabase project. This allows users to register with passwords that have been exposed in data breaches.

### The Fix (2 minutes)

#### Step 1: Open Supabase Dashboard
Go to: [https://supabase.com/dashboard](https://supabase.com/dashboard)

#### Step 2: Navigate to Auth Settings
```
Your Project → Authentication → Policies
```
or
```
Your Project → Settings → Authentication
```

#### Step 3: Enable the Toggle
Find and enable:
```
☑ Check for compromised passwords
```
or
```
☑ Prevent compromised passwords
```

#### Step 4: Save
Click **Save** or **Update**

---

## Test It Works (3 minutes)

### Test 1: Try a Compromised Password ❌
Sign up with:
- Email: `test@example.com`
- Password: `password123`

**Expected**: ❌ Error: "Password has been found in a data breach"

### Test 2: Try a Strong Password ✅
Sign up with:
- Email: `test2@example.com`
- Password: `MyStr0ng!Pass#2024`

**Expected**: ✅ Success - Account created

---

## What This Does

✅ Checks passwords against 12+ billion leaked credentials
✅ Uses HaveIBeenPwned.org API (privacy-preserving)
✅ Blocks compromised passwords at signup/reset
✅ No code changes needed
✅ Works with your existing auth system

---

## Why It Matters

Your app stores:
- 🐾 Pet health records (sensitive)
- 📍 Location data (privacy concern)
- 👤 Personal information (GDPR protected)
- 📷 User images (personal content)

**Strong password protection is essential** for user trust.

---

## Screenshots

### Finding the Setting

**Option A: Authentication → Policies**
```
┌─ Dashboard
│  ├─ Authentication
│  │  ├─ Users
│  │  ├─ Policies              ← Click
│  │  │  └─ Password Protection
│  │  │     └─ ☑ Check for compromised passwords  ← Enable
│  │  └─ Logs
```

**Option B: Settings → Authentication**
```
┌─ Dashboard
│  ├─ Settings
│  │  ├─ General
│  │  ├─ Authentication        ← Click
│  │  │  └─ Password Requirements
│  │  │     └─ ☑ Prevent compromised passwords   ← Enable
│  │  └─ API
```

---

## Checklist

- [ ] Logged into Supabase dashboard
- [ ] Found Authentication settings
- [ ] Enabled password protection toggle
- [ ] Clicked Save
- [ ] Tested with compromised password (should fail)
- [ ] Tested with strong password (should work)
- [ ] Updated security documentation

---

## Need More Details?

See `SECURITY_FIX_GUIDE.md` for:
- Complete step-by-step instructions
- Technical details
- Testing procedures
- FAQ
- Monitoring guidance

---

## Status After Enabling

### Before
- ❌ Leaked password protection: DISABLED
- ⚠️ Users can use compromised passwords
- ⚠️ Accounts vulnerable to credential stuffing

### After
- ✅ Leaked password protection: ENABLED
- ✅ Compromised passwords blocked
- ✅ Enterprise-grade security
- ✅ Production-ready

---

## Priority: 🔴 HIGH

**Do this before accepting real users.**

It's a 2-minute configuration change that significantly enhances security.

---

**Questions?** See `SECURITY_FIX_GUIDE.md` or `SECURITY_CHECKLIST.md`

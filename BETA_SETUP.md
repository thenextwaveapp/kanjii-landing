# Kanjii Beta System — Setup Guide

The beta application system has been installed. Complete the steps below to activate the full email automation flow.

## ✅ What's Already Done

- **Frontend**: Beta application pages installed at `/beta/[token]`, `/beta/applied`
- **Database Schema**: SQL file created at `supabase/beta-schema.sql` (needs to be run)
- **Edge Functions**: Three functions created in `supabase/functions/` (need to be deployed)
- **Environment**: `.env.example` updated with required variables

---

## 📋 Setup Checklist

### 1. Run the Database Migration

In your Supabase dashboard:

1. Go to **SQL Editor** → **New query**
2. Copy the contents of `supabase/beta-schema.sql`
3. Paste and **Run** the query
4. Verify the changes in **Database** → **Tables**:
   - `waitlist_signups` should have new columns: `beta_token`, `status`, `invited_at`, `approved_at`
   - New table `beta_applications` should exist
   - Check **Database** → **Functions** for `get_signup_by_token`

### 2. Set Up Resend for Email

1. **Sign up** at [resend.com](https://resend.com)
2. **Add your domain**: Dashboard → Domains → Add Domain
   - Enter `kanjii.app`
   - You'll get DNS records (SPF, DKIM, DMARC)
3. **Add DNS records** to your domain provider (where you manage kanjii.app DNS):
   ```
   TXT  @           v=spf1 include:_spf.resend.com ~all
   TXT  resend._domainkey  [DKIM value from Resend]
   TXT  _dmarc      v=DMARC1; p=none; [value from Resend]
   ```
4. **Wait for verification** (usually < 10 minutes)
5. **Create API key**: Settings → API Keys → Create
6. **(Optional)** Set up email addresses:
   - Create `hello@kanjii.app` as sending address
   - Set up `support@kanjii.app` for notifications

### 3. Deploy Edge Functions

Using the Supabase CLI:

```bash
# Install Supabase CLI if you haven't
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project (find project ref in dashboard URL)
supabase link --project-ref your-project-ref

# Deploy all three functions
supabase functions deploy on-waitlist-signup
supabase functions deploy submit-beta-application
supabase functions deploy on-beta-approved
```

Or manually upload via Supabase Dashboard → Edge Functions → Deploy new function.

### 4. Set Edge Function Secrets

In Supabase dashboard → **Project Settings** → **Edge Functions** → **Secrets**, add:

```bash
RESEND_API_KEY=re_xxxxxxxxxxxx                          # From Resend dashboard
FROM_EMAIL=Kanjii <hello@kanjii.app>                    # Your verified sending address
SUPPORT_EMAIL=support@kanjii.app                        # Where to receive notifications
SITE_URL=https://kanjii.app                             # Your production domain
TESTFLIGHT_URL=https://testflight.apple.com/join/XXXXX  # Your TestFlight public link
WEBHOOK_SECRET=<generate random string>                 # Use: openssl rand -hex 32
```

**Note**: `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are auto-injected — don't set these manually.

### 5. Configure Database Webhooks

In Supabase dashboard → **Database** → **Webhooks**:

#### Webhook 1: On New Signup
- **Name**: `on_waitlist_signup`
- **Table**: `waitlist_signups`
- **Events**: ✓ Insert
- **Type**: Supabase Edge Function
- **Edge Function**: `on-waitlist-signup`
- **HTTP Headers**:
  ```
  x-webhook-secret: <same value as WEBHOOK_SECRET above>
  ```

#### Webhook 2: On Beta Approval
- **Name**: `on_beta_approved`
- **Table**: `waitlist_signups`
- **Events**: ✓ Update
- **Type**: Supabase Edge Function
- **Edge Function**: `on-beta-approved`
- **HTTP Headers**:
  ```
  x-webhook-secret: <same value as WEBHOOK_SECRET above>
  ```

### 6. Update Your Environment Variables

Add to your `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key              # Add this if missing
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

Get these from: Supabase Dashboard → **Project Settings** → **API**

### 7. Deploy to Production

```bash
# Build and test locally first
npm run build
npm run dev

# Deploy to Vercel
git add .
git commit -m "Add beta application system"
git push

# Or manually deploy via Vercel dashboard
```

---

## 🧪 Testing the Complete Flow

### Test Signup → Application → Approval Flow

1. **Insert a test signup** (or use the existing waitlist form):
   ```sql
   INSERT INTO waitlist_signups (email) VALUES ('your-test-email@example.com');
   ```

2. **Check your inbox** — you should receive:
   - Subject: "You're on the Kanjii waitlist 🎌"
   - Contains a unique beta application link

3. **Check support email** — you should receive notification of the signup

4. **Click the beta link** and fill out the application form

5. **Check support email again** — you should receive the application details with SQL to approve

6. **Approve the application**:
   ```sql
   UPDATE waitlist_signups
   SET status = 'approved', approved_at = now()
   WHERE email = 'your-test-email@example.com';
   ```

7. **Check your inbox again** — you should receive:
   - Subject: "You're approved for the Kanjii beta! 🎉"
   - Contains the TestFlight link

### Debugging

If emails aren't sending:
- Check **Edge Functions** → **Logs** in Supabase dashboard
- Verify webhook secrets match between webhooks and Edge Function secrets
- Check Resend dashboard → **Logs** for delivery status
- Ensure DNS records are verified in Resend

---

## 🎯 How to Approve Beta Testers

When you receive a "New beta application" email:

### Option 1: Via SQL Editor
```sql
UPDATE waitlist_signups
SET status = 'approved', approved_at = now()
WHERE id = '<signup_id_from_email>';
```

### Option 2: Via Table Editor
1. Go to **Database** → **Tables** → `waitlist_signups`
2. Find the row by email
3. Change `status` column to `approved`
4. Save

The `on-beta-approved` webhook will automatically fire and send the TestFlight email.

---

## 📊 Monitoring Beta Applications

### View all applications:
```sql
SELECT
  ws.email,
  ws.status,
  ws.created_at as signed_up,
  ws.invited_at,
  ws.approved_at,
  ba.full_name,
  ba.ios_device,
  ba.experience_level,
  ba.why_beta
FROM waitlist_signups ws
LEFT JOIN beta_applications ba ON ba.signup_id = ws.id
ORDER BY ws.created_at DESC;
```

### Count by status:
```sql
SELECT status, COUNT(*)
FROM waitlist_signups
GROUP BY status;
```

---

## 🔐 Security Notes

- The `WEBHOOK_SECRET` prevents unauthorized webhook calls
- The `SUPABASE_SERVICE_ROLE_KEY` bypasses RLS — keep it private
- Beta tokens are UUIDs, making them unguessable
- The RPC function `get_signup_by_token` is granted to `anon` role for public access

---

## 📧 Email Template Customization

To customize email templates, edit the HTML in:
- `supabase/functions/on-waitlist-signup/index.ts`
- `supabase/functions/on-beta-approved/index.ts`

After editing, redeploy:
```bash
supabase functions deploy on-waitlist-signup
supabase functions deploy on-beta-approved
```

---

## ✨ You're All Set!

Once you complete these steps, your beta system will be fully automated:

1. User signs up → Gets welcome email with beta link
2. User applies → You get notified
3. You approve → User gets TestFlight link

Questions? Issues? Check the Edge Function logs in your Supabase dashboard.

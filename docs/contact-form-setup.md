# Contact form — setup & monitoring

The contact form on `/contact` writes to **two places at once**:

| Path | Purpose | Fails how? |
|------|---------|-----------|
| **Web3Forms** → David's Gmail | Delivers the message | Visibly — the visitor sees an error with phone + email |
| **Apps Script** → Google Sheet | Permanent searchable log | Silently — by design, it never blocks the send |

Two independent writes means a single outage never loses an inquiry. Email
delivery can fail and the Sheet still has the record; the Sheet can fail and
the email still arrives.

Both need one value from David. Until they are filled in, **the form still
loads and validates** — it just cannot send, so do not ship to production
before step 1 is done.

---

## Step 1 — Web3Forms access key (required)

1. Go to <https://web3forms.com>
2. Enter **coopertowndogwalking@gmail.com** and submit
3. Confirm the verification email — the access key arrives in the inbox
4. In [`src/contact.html`](../src/contact.html), replace `DAVID_ACCESS_KEY_HERE`:

   ```html
   <input type="hidden" name="access_key" value="PASTE-KEY-HERE">
   ```

No account or password is created. The key only permits sending to the
address it was issued to, which is why it is safe to leave visible in the
page source — it cannot be used to mail anyone else.

Free tier: 250 submissions/month, unlimited forms, spam filtering.

## Step 2 — Gmail filter (required, do this first)

The single most likely failure is a real inquiry landing in spam. Prevent it
before the first one arrives.

In Gmail → **Settings → Filters and Blocked Addresses → Create a new filter**:

- **From:** `web3forms.com`
- Then: ☑ **Never send it to Spam** · ☑ **Apply the label:** `Website Inquiries`
- ☑ Also apply to matching conversations

That label is the permanent email archive. Gmail keeps it indefinitely and
it is fully searchable — better retention than any form service's dashboard.

## Step 3 — Google Sheet log (recommended)

1. Create a new Google Sheet named **Dog Walkin — Inquiries**
2. **Extensions → Apps Script**
3. Delete the placeholder code, paste the contents of
   [`inquiry-log.gs`](inquiry-log.gs), and save
4. **Deploy → New deployment → Web app**
   - Execute as: **Me**
   - Who has access: **Anyone**   ← required; the website posts anonymously
5. Copy the `/exec` URL it produces
6. In [`src/contact.html`](../src/contact.html), replace `DAVID_APPS_SCRIPT_URL_HERE`
   in the `CONFIG` block with that URL

The `Inquiries` tab and its headers are created automatically on the first
submission.

> Re-deploying after any script edit produces a **new** `/exec` URL. Use
> **Deploy → Manage deployments → Edit → New version** to keep the existing
> URL instead.

---

## Monitoring

The reason a contact form is dangerous is that **silence looks exactly like a
quiet week**. These checks turn "I think it's working" into something
verifiable.

### Health check (10 seconds)

Open the Apps Script `/exec` URL in a browser:

```json
{ "ok": true, "count": 34, "lastReceived": "2026-08-21T14:02:11.000Z" }
```

If `lastReceived` is older than you would expect given normal traffic,
something upstream is broken.

### Monthly canary

Submit a real test inquiry through the live form and confirm it (a) arrives
in Gmail under the `Website Inquiries` label and (b) appears as a new Sheet
row. A recurring Google Calendar reminder is enough — no automation needed at
this volume.

### Reconciliation

Three counts that should agree:

| Source | Where |
|--------|-------|
| Gmail | `Website Inquiries` label count |
| Sheet | `count` from the health check |
| Web3Forms | dashboard (last 30 days only) |

A mismatch localizes the break to a specific hop — e.g. Sheet rows but no
email means delivery broke; email but no rows means the Apps Script
deployment expired.

### What breaks, and what catches it

| Failure | Likelihood | Caught by |
|---------|-----------|-----------|
| Email lands in spam | High | Step 2 prevents it; Sheet logs it regardless |
| 250/month cap hit | Low | Visitor sees the error panel; Sheet still logs |
| Access key broken by an edit | Low | Canary; visitor sees the error panel |
| Web3Forms outage | Low | Visitor sees phone + email fallback |
| Apps Script deployment expired | Medium | Health check `lastReceived` goes stale |

In every case except a total Apps Script failure, **the Sheet still captures
the inquiry** — which is the whole point of writing twice.

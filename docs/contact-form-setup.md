# Contact form — setup & monitoring

The contact form on `/contact` writes to **two places at once**:

| Path | Purpose | Fails how? |
|------|---------|-----------|
| **Web3Forms** → David's Gmail | Delivers the message | Visibly — the visitor sees an error with phone + email |
| **Apps Script** → Google Sheet | Permanent searchable log | Silently — by design, it never blocks the send |

Two independent writes means a single outage never loses an inquiry. Email
delivery can fail and the Sheet still has the record; the Sheet can fail and
the email still arrives.

Step 1 is **done** — the access key is in place and the form can send. Step 3
is still open; the form works without it, but there is no durable log until it
is deployed.

---

## Step 1 — Web3Forms access key ✅ done

The key issued to **coopertowndogwalking@gmail.com** is live in
[`src/contact.html`](../src/contact.html) as of 2026-09-21.

To reissue it later, request a new key at <https://web3forms.com> for the same
address and replace the `access_key` value on the form.

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

### Whose Drive it lives in

**David must own the Sheet and run the deployment from his own account** —
signed in as **coopertowndogwalking@gmail.com**, not a developer's account.

Two reasons, and neither is about tidiness:

- The deployment runs as whoever clicked **Deploy** and approved the
  authorization ("Execute as: Me"). If that is a developer's account, every
  row is written by them and the log dies silently the day their access ends
  — precisely the failure the two-write design exists to prevent.
- The log accumulates client PII: names, emails, and free-text messages that
  routinely say when an apartment will be empty. That record belongs in the
  business owner's account and should not outlive anyone's involvement in the
  project.

It can still live in a **shared project folder** — in Drive, a file's owner
and its location are independent. Share the folder with David as **Editor**,
have him create the Sheet *inside it*, and he owns it while everyone keeps
full access.

Building it in a developer account first to test is fine, and is a good way
to walk the authorization screen before talking David through it. Plan to
redo it in his account rather than transferring later: moving a Sheet's
ownership carries the bound script along, but the deployment's authorization
stays with the original account, so it needs a fresh deploy regardless.

### Steps

1. Create a new Google Sheet named **Dog Walkin — Inquiries**
2. **Extensions → Apps Script**
3. Delete the placeholder `myFunction()` code, paste the entire contents of
   [`inquiry-log.gs`](inquiry-log.gs), and save. Nothing in the script needs
   editing.
4. **Deploy → New deployment → Web app**
   - Execute as: **Me**
   - Who has access: **Anyone**   ← must be exactly this, **not** "Anyone with
     a Google account." The website posts anonymously, so the stricter setting
     rejects every submission silently.
5. Approve the authorization prompts — see below
6. Copy the `/exec` URL it produces
7. In [`src/contact.html`](../src/contact.html), replace `DAVID_APPS_SCRIPT_URL_HERE`
   in the `CONFIG` block with that URL

The `Inquiries` tab and its headers are created automatically on the first
submission, so an empty Sheet immediately after setup is expected.

### The authorization warning is expected

On the first deploy Google interrupts with **"Authorization required"**, then
**"Google hasn't verified this app."** That is not a sign anything went wrong
— the "app" is this script, in David's own account, and Google shows that
screen for every unpublished script.

Click **Advanced → Go to Dog Walkin — Inquiries (unsafe) → Allow**.

Most people stop at the red warning and assume they broke something. There is
no way to avoid the screen; it has to be clicked through.

> **Re-deploying after any script edit produces a new `/exec` URL** and
> silently orphans the old one — the form keeps posting into the void and the
> log goes quiet with no visible error. To keep the existing URL, use
> **Deploy → Manage deployments → Edit → New version**. This is the most
> likely way the log dies months from now.

> The `/exec` URL is mildly sensitive: anyone holding it can append rows, so
> it is a spam vector rather than a data leak — the script only ever writes,
> and never reads the Sheet back out. Safe to leave in the page source, same
> as the Web3Forms key; just don't post it anywhere public.

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

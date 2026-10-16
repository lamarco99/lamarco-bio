# BSS native guide funnel — activation
Status: built, inactive, not connected to live traffic.

1. Import n8n-ai-guide.json into the owner's existing n8n instance.
2. Connect the Notion credential on every Notion HTTP node. Grant the integration access only to BSS — Free AI Guide Signups (database df14d57270ea453fb230236e457be03e; source 0edc4b55-7612-417d-9e05-37f79b70e555).
3. Select the owner's SMTP credential on Email guide and replace REPLACE_WITH_CONNECTED_SENDER with its verified sending address. Configure a valid reply address for data requests.
4. Protect the public webhook with server-side rate limiting and bot verification before promotion. Honeypot and Origin checks alone do not prevent direct automated requests. Keep n8n execution access private and set an appropriate short retention policy for failed executions.
5. Test using a controlled inbox: valid signup, malformed email, wrong origin, honeypot, Notion failure, SMTP failure, duplicate email, repeated request. Verify actual Notion state and email receipt. SMTP acceptance is not proof of inbox delivery.
6. Repeated email reuses the first matching Notion page and preserves previous marketing consent. Notion does not enforce unique email; simultaneous first requests can race. Add a server-side lock/unique-key store or serialize webhook writes before launch.
7. Activate only after those checks. Put the HTTPS production webhook URL in guide-config.js. Never put API keys or SMTP credentials in website files.
8. Publish free-guide.html, guide-config.js, guide-signup.js to bss/ as a unit. Add the free guide link to main navigation after the production submission passes.
9. Update the thank-you page to display a clear email-pending message when delivery=pending. A saved=true response means the Notion write succeeded; redirect never follows a plain HTTP 200 without that explicit receipt.
10. Retire the unused Jotform lead-magnet form after activation; leave the separate project inquiry form intact.

No nurture emails are configured. Guide fulfillment is transactional. Optional marketing consent is captured separately.
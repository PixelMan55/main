// scripts/send-weekly-email.js
//
// Run by GitHub Actions on a weekly schedule (see .github/workflows/weekly-email.yml).
// Needs three env vars, set as GitHub Actions secrets:
//   FIREBASE_SERVICE_ACCOUNT   — full contents of your Firebase service account JSON
//   RESEND_API_KEY             — a Resend API key with "Full access"
//   RESEND_AUDIENCE_ID         — the Audience you created in the Resend dashboard

const admin = require("firebase-admin");
const { Resend } = require("resend");

// --- EDIT THESE TWO for your project ---
const SITE_URL = "https://your-game-domain.com";
const FROM_ADDRESS = "Ladder <puzzle@your-game-domain.com>"; // must be on your verified Resend domain
// -----------------------------------------

async function main() {
  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
  const db = admin.firestore();

  const resend = new Resend(process.env.RESEND_API_KEY);
  const audienceId = process.env.RESEND_AUDIENCE_ID;

  // 1. Pull everyone who's subscribed in the game.
  const snap = await db.collection("newsletter").get();
  const emails = [...new Set(snap.docs.map((d) => d.data().email).filter(Boolean))];
  console.log(`Found ${emails.length} subscriber(s) in Firestore.`);

  if (emails.length === 0) {
    console.log("Nobody to email yet — skipping send.");
    return;
  }

  // 2. Make sure Resend's Audience has all of them. Adding someone who's
  //    already there just errors harmlessly — we ignore that.
  for (const email of emails) {
    try {
      await resend.contacts.create({ email, audienceId });
    } catch (e) {
      if (!String(e?.message || "").toLowerCase().includes("already exists")) {
        console.warn(`Could not add ${email}:`, e?.message || e);
      }
    }
  }

  // 3. Create the broadcast and send it immediately. Resend automatically
  //    skips anyone who's unsubscribed and adds the unsubscribe link/headers.
  const html = `
    <div style="font-family: Georgia, serif; max-width: 480px; margin: 0 auto; color:#1a1a1a;">
      <h1 style="font-size: 22px; margin-bottom: 4px;">Ladder</h1>
      <p style="color:#555;">This week's puzzles are live. Turn one word into another, one letter at a time.</p>
      <p style="margin: 24px 0;">
        <a href="${SITE_URL}" style="display:inline-block;background:#111;color:#fff;padding:12px 20px;text-decoration:none;border-radius:4px;font-weight:bold;">
          Play now
        </a>
      </p>
      <p style="font-size:12px;color:#999;margin-top:40px;border-top:1px solid #eee;padding-top:12px;">
        {{{RESEND_UNSUBSCRIBE_URL}}}
      </p>
    </div>
  `;

  const { data, error } = await resend.broadcasts.create({
    audienceId,
    from: FROM_ADDRESS,
    subject: "This week's Ladder puzzle is up",
    html,
    send: true,
  });

  if (error) {
    console.error("Resend broadcast error:", error);
    process.exit(1);
  }
  console.log("Broadcast sent:", data);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

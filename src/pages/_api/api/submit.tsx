interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  turnstileToken: string;
}

async function verifyTurnstileToken(token: string): Promise<boolean> {
  const secretKey = process.env.TURNSTILE_SECRET_KEY;
  if (!secretKey) {
    console.error("TURNSTILE_SECRET_KEY is not configured");
    return false;
  }

  try {
    const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ secret: secretKey, response: token }),
    });
    const data = (await response.json()) as { success?: boolean };
    return data.success === true;
  } catch (error) {
    console.error("Turnstile verification error:", error);
    return false;
  }
}

const truncate = (s: string, max: number) => (s.length > max ? `${s.slice(0, max - 1)}…` : s);

function buildMainPayload(formData: ContactFormData) {
  const threadName = truncate(`[Contact] ${formData.subject} — ${formData.name}`, 100);
  return {
    thread_name: threadName,
    embeds: [
      {
        title: "📨 New contact form submission",
        color: 0xff5b11,
        fields: [
          { name: "Name", value: truncate(formData.name, 1024), inline: true },
          { name: "Email", value: truncate(formData.email, 1024), inline: true },
          { name: "Subject", value: truncate(formData.subject, 1024), inline: false },
          { name: "Message", value: truncate(formData.message, 1024), inline: false },
        ],
        timestamp: new Date().toISOString(),
        footer: { text: "love-rox.cc / contact form" },
      },
    ],
  };
}

function buildReplyTemplatePayload(formData: ContactFormData) {
  const replySubject = `Re: ${formData.subject}`;
  const quoted = formData.message
    .split("\n")
    .map((line) => `> ${line}`)
    .join("\n");
  const mailto = `mailto:${encodeURIComponent(formData.email)}?subject=${encodeURIComponent(replySubject)}`;

  // Discord message content limit is 2000 chars; leave headroom for the wrapping text.
  const template = [
    `To: ${formData.email}`,
    `Subject: ${replySubject}`,
    "",
    `Hi ${formData.name},`,
    "",
    "(your reply here)",
    "",
    "----",
    quoted,
  ].join("\n");

  const codeBlock = `\`\`\`text\n${truncate(template, 1700)}\n\`\`\``;
  const intro = `📋 Reply template (copy & paste into your mail client) — [Open in mail client](${mailto})`;
  return { content: `${intro}\n${codeBlock}` };
}

interface DiscordMessageResponse {
  id?: string;
  channel_id?: string;
}

async function postToDiscord(formData: ContactFormData): Promise<void> {
  const baseUrl = process.env.DISCORD_CONTACT_WEBHOOK_URL;
  if (!baseUrl) throw new Error("DISCORD_CONTACT_WEBHOOK_URL is not configured");
  const webhookUrl = `${baseUrl}${baseUrl.includes("?") ? "&" : "?"}wait=true`;

  // Try forum-channel posting first (thread_name creates a new thread).
  const mainPayload = buildMainPayload(formData);
  let mainResponse = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(mainPayload),
  });

  // Fallback: regular text channel doesn't accept thread_name (400). Retry without it.
  if (!mainResponse.ok && mainResponse.status === 400) {
    const { thread_name: _omit, ...rest } = mainPayload;
    mainResponse = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(rest),
    });
  }

  if (!mainResponse.ok) {
    const text = await mainResponse.text().catch(() => "");
    throw new Error(`Discord webhook failed (${mainResponse.status}): ${text}`);
  }

  const mainData = (await mainResponse.json().catch(() => ({}))) as DiscordMessageResponse;
  const threadId = mainData.channel_id; // populated when forum thread was created

  const replyPayload = buildReplyTemplatePayload(formData);
  const followupUrl = threadId
    ? `${baseUrl}${baseUrl.includes("?") ? "&" : "?"}thread_id=${threadId}`
    : baseUrl;

  const followup = await fetch(followupUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(replyPayload),
  });

  if (!followup.ok) {
    const text = await followup.text().catch(() => "");
    // The main notification already succeeded — don't fail the whole submission for the
    // reply-template follow-up, but surface it in logs so we can investigate.
    console.error(`Discord reply-template post failed (${followup.status}): ${text}`);
  }
}

export const getConfig = async () => {
  return { render: "dynamic" };
};

export async function POST(request: Request): Promise<Response> {
  try {
    const body: ContactFormData = await request.json();

    if (!body.name || !body.email || !body.subject || !body.message || !body.turnstileToken) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const isValidToken = await verifyTurnstileToken(body.turnstileToken);
    if (!isValidToken) {
      return new Response(JSON.stringify({ error: "Invalid security token" }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      });
    }

    await postToDiscord(body);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Contact form error:", error);
    return new Response(JSON.stringify({ error: "Failed to deliver notification" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

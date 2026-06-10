const { Groq } = require('groq-sdk');

let groqClient = null;

function getGroqClient() {
  if (!groqClient) {
    const apiKey = process.env.GROQ_API_KEY || '';
    if (!apiKey || apiKey.includes('YOUR_GROQ_API_KEY_HERE')) {
      throw new Error("GROQ_API_KEY is missing or invalid in your backend/.env file.");
    }
    groqClient = new Groq({ apiKey });
  }
  return groqClient;
}

function cleanJsonResponse(rawText) {
  let cleaned = rawText.trim();
  const codeBlockRegex = /```(?:json)?\s*([\s\S]*?)\s*```/;
  const match = cleaned.match(codeBlockRegex);
  if (match) {
    cleaned = match[1].trim();
  }
  return cleaned;
}

const PARSE_SYSTEM_PROMPT = `You are a campaign parameter extractor.
Given a user prompt, extract the target audience segment, communication channel, and campaign goal.

Map the audienceName to one of these exact values:
- "High Value Customers"
- "Delhi Customers"
- "Inactive Customers"
- "Frequent Buyers"
- "All Customers" (use this if not specified or not matching others)

Map the channel to one of these exact values:
- "WhatsApp"
- "Email"
- "SMS"
(Default to "Email" if not specified)

Map the goal to one of these exact values:
- "Increase Sales"
- "Increase Repeat Purchases"
- "Reactivate Customers"
- "Promote New Collection"
- "Clear Inventory"
(Default to "Increase Sales" if not specified)

Return ONLY a raw JSON object with keys: "audienceName", "channel", "goal". Do not return markdown, code blocks, or explanations.

Example:
Prompt: Write a friendly WhatsApp message to our High Value Customers to get them to buy again.
Output: {"audienceName":"High Value Customers","channel":"WhatsApp","goal":"Increase Repeat Purchases"}
`;

const GENERATE_SYSTEM_PROMPT = `You are a professional AI Campaign Strategist and Marketing Copywriter.
Generate an optimized marketing campaign based on the provided audience metadata, campaign goal, and communication channel.

Adapt the copy style and content fields dynamically based on the channel:
- WhatsApp: Short, highly conversational, friendly, use formatting like *bold* for emphasis and suitable emojis. No subject line (set subject to empty string).
- Email: Detailed, professional, structured, persuasive. Must include an engaging Subject line.
- SMS: Extremely concise (under 160 characters if possible), urgent, clear CTA. No subject line (set subject to empty string).

Evaluate the generated campaign strategy and content, and provide a campaign quality score from 0 to 100, listing key strengths and improvements.

You must return ONLY a raw JSON object. Do not include markdown code blocks, do not include any text/explanations before or after the JSON.

Expected JSON schema:
{
  "strategy": "High level strategy for the audience",
  "recommendedOffer": "Promo or offer recommended for this campaign",
  "title": "A short internal title for the campaign",
  "subject": "Email subject line (empty string for SMS/WhatsApp)",
  "message": "The campaign copy text matching the channel rules",
  "cta": "Call to action text",
  "aiReasoning": "Justification of the strategy based on audience statistics",
  "qualityScore": 85,
  "strengths": ["Clear value proposition", "Direct CTA"],
  "improvements": ["Create a sense of urgency"]
}`;

/**
 * Extracts structured campaign parameters from a natural language user prompt.
 * 
 * @param {string} prompt - User request.
 * @returns {Promise<Object>} - { audienceName, channel, goal }
 */
async function parseCampaignPrompt(prompt) {
  if (!prompt || typeof prompt !== 'string') {
    throw new Error('Invalid prompt provided for parsing');
  }

  const groq = getGroqClient();
  const response = await groq.chat.completions.create({
    messages: [
      { role: 'system', content: PARSE_SYSTEM_PROMPT },
      { role: 'user', content: prompt }
    ],
    model: 'llama-3.3-70b-versatile',
    temperature: 0.1, // Low temperature for high accuracy
  });

  const rawContent = response.choices[0]?.message?.content || '';
  const cleanedContent = cleanJsonResponse(rawContent);

  try {
    const parsed = JSON.parse(cleanedContent);
    return {
      audienceName: parsed.audienceName || 'All Customers',
      channel: parsed.channel || 'Email',
      goal: parsed.goal || 'Increase Sales'
    };
  } catch (error) {
    console.error('[Campaign AI Service] Failed to parse parameters from Groq. Raw:', rawContent);
    // Safe fallbacks
    return {
      audienceName: 'All Customers',
      channel: 'Email',
      goal: 'Increase Sales'
    };
  }
}

/**
 * Generates campaign strategy, copy, and score using Groq.
 */
async function generateCampaign({ audienceName, audienceSize, channel, goal, audienceSummary }) {
  const groq = getGroqClient();

  const userPrompt = `
Generate a marketing campaign with these parameters:
- Audience Name: "${audienceName}"
- Audience Size: ${audienceSize}
- Channel: "${channel}"
- Goal: "${goal}"
- Target Audience Summary Context:
  * Total Customers: ${audienceSummary.totalCustomers}
  * Average Spend: ₹${audienceSummary.averageSpend}
  * Average Orders: ${audienceSummary.averageOrders}
  * Top City: "${audienceSummary.topCity}"
  `;

  const response = await groq.chat.completions.create({
    messages: [
      { role: 'system', content: GENERATE_SYSTEM_PROMPT },
      { role: 'user', content: userPrompt }
    ],
    model: 'llama-3.3-70b-versatile',
    temperature: 0.7,
  });

  const rawContent = response.choices[0]?.message?.content || '';
  const cleanedContent = cleanJsonResponse(rawContent);

  try {
    const campaignData = JSON.parse(cleanedContent);
    
    return {
      strategy: campaignData.strategy || '',
      recommendedOffer: campaignData.recommendedOffer || '',
      title: campaignData.title || '',
      subject: campaignData.subject || '',
      message: campaignData.message || '',
      cta: campaignData.cta || '',
      aiReasoning: campaignData.aiReasoning || '',
      qualityScore: Number(campaignData.qualityScore) || 75,
      strengths: Array.isArray(campaignData.strengths) ? campaignData.strengths : [],
      improvements: Array.isArray(campaignData.improvements) ? campaignData.improvements : []
    };
  } catch (error) {
    console.error('[Campaign AI Service] Failed to parse generated campaign JSON. Raw:', rawContent);
    throw new Error('Failed to parse campaign details from AI response');
  }
}

module.exports = {
  parseCampaignPrompt,
  generateCampaign
};

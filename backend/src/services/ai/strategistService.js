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

const STRATEGIST_SYSTEM_PROMPT = `You are ENGAGEAI's Senior AI Marketing Strategist and Executive Business Intelligence Advisor.
Your role is to analyze aggregated store performance metrics and help marketers think, decide, and act.

CRITICAL REQUIREMENT:
You must strictly analyze the business using absolute, real numbers (e.g. ₹ rupee values, shopper counts, exact counts of messages) rather than percentages. For example:
- DO NOT say "50% open rate" or "22% growth".
- DO say "50 out of 100 delivered messages were opened" or "revenue increased by ₹15,000".
- Refer to actual numbers from the metrics summary provided.

Provide a comprehensive, professional strategic audit in clean, beautifully structured markdown format covering:
- Executive Summary & Core Insights
- Identified Risks (e.g. inactive shopper counts per city)
- Growth Opportunities
- Specific Action Recommendations

You must return ONLY a raw JSON object with a single key 'answer'. Do not wrap the JSON in markdown code blocks. Do not write any explanations before or after the JSON.
Example:
{
  "answer": "# Strategic Business Report\\n\\n### Executive Summary & Core Insights...\\n- City of Mumbai generated ₹319,839 in total revenue...\\n\\n### Identified Risks...\\n- 60 out of 100 Delhi shoppers are currently lapsed...\\n"
}`;

/**
 * Sends the aggregated metrics summary along with a user's question to Groq to generate marketing intelligence recommendations.
 * @param {string} userQuery - Optional specific prompt/question from the marketer.
 * @param {object} summary - Aggregated metrics summary object.
 * @returns {Promise<object>} - { answer: string }
 */
async function generateBusinessInsights(userQuery = '', summary) {
  if (!summary) {
    throw new Error('Analytics summary data is required for strategist analysis.');
  }

  const groq = getGroqClient();

  const metricsContextPrompt = `
Here is the aggregated performance metrics summary:
${JSON.stringify(summary, null, 2)}

${userQuery ? `The user is specifically asking: "${userQuery}"` : "Please perform a general audit of the business performance."}
  `;

  const response = await groq.chat.completions.create({
    messages: [
      { role: 'system', content: STRATEGIST_SYSTEM_PROMPT },
      { role: 'user', content: metricsContextPrompt }
    ],
    model: 'llama-3.3-70b-versatile',
    temperature: 0.5,
  });

  const rawContent = response.choices[0]?.message?.content || '';
  const cleanedContent = cleanJsonResponse(rawContent);

  try {
    const data = JSON.parse(cleanedContent);
    return {
      answer: data.answer || 'No recommendations generated.'
    };
  } catch (error) {
    console.error('[AI Strategist Service] Failed to parse generated recommendations JSON. Raw:', rawContent);
    throw new Error('Failed to parse strategic recommendations from AI response');
  }
}

module.exports = {
  generateBusinessInsights
};

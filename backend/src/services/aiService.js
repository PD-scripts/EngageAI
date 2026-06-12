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

// System instructions and few-shot examples to enforce strict structured JSON outputs
const SYSTEM_PROMPT = `You are a CRM audience query parser.
Convert user requests into JSON.
Return ONLY JSON.
Do not return markdown.
Do not return explanations.
Do not return code blocks.

Allowed fields:
- CustomerID
- Name
- Email
- Phone
- City
- TotalSpend
- TotalOrders
- LastPurchaseDays
- CustomerType
- healthScore
- HealthScore

Allowed operators:
- =
- >
- <
- >=
- <=

Return only:
{
  "conditions": [
    {
      "field": "Field_Name",
      "operator": "Operator",
      "value": Value
    }
  ]
}

Ensure numeric comparisons are converted to numbers (e.g. TotalSpend, TotalOrders, LastPurchaseDays, healthScore, HealthScore).
Ensure string values are capitalized as requested (e.g. City names like "Delhi").

Examples:
User: Find customers from Delhi
Output: {"conditions":[{"field":"City","operator":"=","value":"Delhi"}]}

User: Find customers spending more than 10000
Output: {"conditions":[{"field":"TotalSpend","operator":">","value":10000}]}

User: Find customers spending less than 5000
Output: {"conditions":[{"field":"TotalSpend","operator":"<","value":5000}]}

User: Find customers inactive for more than 90 days
Output: {"conditions":[{"field":"LastPurchaseDays","operator":">","value":90}]}

User: Find customers with health score card above 50
Output: {"conditions":[{"field":"healthScore","operator":">","value":50}]}

User: Find customers with health score less than 40
Output: {"conditions":[{"field":"healthScore","operator":"<","value":40}]}

User: Find customers from Pune who spent more than 8000 and have more than 5 orders
Output: {"conditions":[{"field":"City","operator":"=","value":"Pune"},{"field":"TotalSpend","operator":">","value":8000},{"field":"TotalOrders","operator":">","value":5}]}`;

/**
 * Cleans up LLM outputs by removing markdown code blocks if the AI returned them.
 * 
 * @param {string} rawText - Raw completion text.
 * @returns {string} - Cleaned text containing only the JSON string.
 */
function cleanJsonResponse(rawText) {
  let cleaned = rawText.trim();
  
  // Look for and extract content wrapped inside ```json ... ``` or ``` ... ```
  const codeBlockRegex = /```(?:json)?\s*([\s\S]*?)\s*```/;
  const match = cleaned.match(codeBlockRegex);
  if (match) {
    cleaned = match[1].trim();
  }
  
  return cleaned;
}

/**
 * Parses user prompts into structured filter conditions using Groq.
 * 
 * @param {string} prompt - The user's natural language audience request.
 * @returns {Promise<Object>} - The parsed query JSON object { conditions: [] }.
 */
async function parseAudiencePrompt(prompt) {
  if (!prompt || typeof prompt !== 'string') {
    throw new Error('Invalid query prompt provided');
  }

  if (!process.env.GROQ_API_KEY) {
    console.warn('[AI Service] WARNING: GROQ_API_KEY is not defined in the environment variables.');
  }

  const groq = getGroqClient();
  const response = await groq.chat.completions.create({
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: prompt }
    ],
    model: 'llama-3.3-70b-versatile',
    temperature: 0.1, // Low temperature for high deterministic accuracy
  });

  const rawContent = response.choices[0]?.message?.content || '';
  const cleanedContent = cleanJsonResponse(rawContent);

  try {
    return JSON.parse(cleanedContent);
  } catch (error) {
    console.error('[AI Service] Failed to parse returned JSON from Groq. Raw content:', rawContent);
    throw new Error('Failed to parse query from AI response');
  }
}

module.exports = {
  parseAudiencePrompt
};

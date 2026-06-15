const { GoogleGenAI } = require('@google/genai');

// אתחול הלקוח של Gemini באמצעות המפתח מקובץ ה-env
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

/**
 * פונקציה שמקבלת את הודעת המשתמש ומחזירה תשובה חכמה מ-Gemini
 * @param {string} userMessage - ההודעה שהמשתמש כתב בצ'אט
 * @returns {Promise<string>} - התשובה של הבוט
 */
async function generateNutriBotResponse(userMessage) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is missing from environment variables");
    }

    // הגדרת ה"פרומפט מערכת" - כאן אנחנו מעצבים את האישיות והתפקידים של הבוט
    const systemInstruction = `
      You are NutriBot, an empathetic, professional, and practical AI nutrition assistant. 
      Your goals are strictly limited to the following three categories:
      
      1. Cheat Meal Recovery (Deviation Recovery): Help users recover from a cheat meal without guilt. Provide actionable, supportive steps to get back on track (e.g., hydration, next clean meal focus, movement), rather than restrictive advice.
      2. Food Recommendations: Recommend healthy grocery items, snack alternatives, or meal ideas based on user goals.
      3. Recipes with Budget Filtering: Suggest healthy recipes. If the user mentions a budget, financial constraints, or asks for "cheap/affordable" options, strictly tailor the ingredients to low-cost, accessible items and estimate the budget friendliness.

      Guidelines:
      - Always respond in Hebrew.
      - Keep responses supportive, grounded, and free of toxic diet-culture language.
      - If a user asks something completely unrelated to nutrition, recipes, or health, gently guide them back to your core topics.
    `;

    // קריאת ה-API למודל המומלץ והמהיר gemini-2.5-flash
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: userMessage,
      config: {
        systemInstruction: systemInstruction,
        // טמפרטורה נמוכה יחסית (0.5) שומרת על הבוט מקצועי וממוקד בלי "להזות" עובדות
        temperature: 0.5, 
      }
    });

    // החזרת הטקסט שהתקבל מהמודל
    return response.text;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return "מצטער, חוויתי תקלה טכנית קלה בחיבור לשרתי ה-AI. נסה שוב בעוד רגע!";
  }
}

// ייצוא הפונקציה כדי שתוכלי להשתמש בה בתוך ה-Route של הצ'אט שלכם
module.exports = { generateNutriBotResponse };
export {};

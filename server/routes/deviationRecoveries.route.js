const express = require('express');
const DeviationRecovery = require('../models/DeviationRecoverySchema');
const { GoogleGenAI } = require('@google/genai');

const router = express.Router();

/**
 * נתיב חדש לצ'אט עם הבוט התזונתי באמצעות Gemini
 * ה-Frontend שלכם יקרא לכתובת: POST /api/deviationRecoveries/chat
 */
router.post('/chat', async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ message: 'Message is required' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ message: 'Gemini API key is missing in the server setup' });
    }

    // אתחול ה-AI בתוך הפונקציה מבטיח שהמפתח כבר נטען מה-env בהצלחה
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const systemInstruction = `
      You are NutriBot, an empathetic, professional, and practical AI nutrition assistant. 
      Your goals are strictly limited to the following three categories:
      
      1. Cheat Meal Recovery (Deviation Recovery): Help users recover from a cheat meal without guilt. Provide actionable, supportive steps to get back on track (e.g., hydration, next clean meal focus, movement), rather than restrictive advice.
      2. Food Recommendations: Recommend healthy grocery items, snack alternatives, or meal ideas based on user goals.
      3. Recipes with Budget Filtering: Suggest healthy recipes. If the user mentions a budget, financial constraints, or asks for "cheap/affordable" options, strictly tailor the ingredients to low-cost, accessible items and estimate the budget friendliness.

      Guidelines:
      - Always respond in English.
      - Keep responses supportive, grounded, and free of toxic diet-culture language.
      - If a user asks something completely unrelated to nutrition, recipes, or health, gently guide them back to your core topics.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: message,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.5, 
      }
    });

    res.json({ reply: response.text });

  } catch (error) {
    console.error('Gemini API Error:', error);
    res.status(500).json({ message: 'Failed to generate bot response', error: error.message });
  }
});

/* ========================================================
   כל הנתיבים המקוריים שלכם נשמרו בדיוק אותו הדבר כאן למטה:
   ======================================================== */

router.get('/', async (req, res) => {
  try {
    // TODO: Filter recovery plans by userId.
    res.json(await DeviationRecovery.find());
  } catch (error) {
    res.status(500).json({ message: 'Failed to get deviation recovery plans', error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    // TODO: Validate ObjectId.
    res.json(await DeviationRecovery.findById(req.params.id));
  } catch (error) {
    res.status(500).json({ message: 'Failed to get deviation recovery plan', error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    // TODO: Calculate safe 48-hour recovery targets server-side.
    res.status(201).json(await DeviationRecovery.create(req.body));
  } catch (error) {
    res.status(400).json({ message: 'Failed to create deviation recovery plan', error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    // TODO: Restrict updates to the plan owner.
    res.json(await DeviationRecovery.findByIdAndUpdate(req.params.id, req.body, { new: true }));
  } catch (error) {
    res.status(400).json({ message: 'Failed to update deviation recovery plan', error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    // TODO: Restrict deletes to the plan owner.
    res.json(await DeviationRecovery.findByIdAndDelete(req.params.id));
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete deviation recovery plan', error: error.message });
  }
});

module.exports = router;

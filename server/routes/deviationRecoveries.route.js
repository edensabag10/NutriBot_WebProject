const express = require('express');
const DeviationRecovery = require('../models/DeviationRecoverySchema');
const User = require('../models/UserSchema');
const NutritionProfile = require('../models/NutritionProfileSchema');
const Goal = require('../models/GoalSchema');
const FoodLog = require('../models/FoodLogSchema');
const Food = require('../models/FoodSchema');
const { GoogleGenAI } = require('@google/genai');

const router = express.Router();

/**
 * נתיב חדש לצ'אט עם הבוט התזונתי באמצעות Gemini
 * ה-Frontend שלכם יקרא לכתובת: POST /api/deviationRecoveries/chat
 */
router.post('/chat', async (req, res) => {
  try {
    const { message, userId: incomingUserId, user } = req.body;

    if (!message) {
      return res.status(400).json({ message: 'Message is required' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ message: 'Gemini API key is missing in the server setup' });
    }

    const resolvedUserId = incomingUserId || user?.id;
    let userContext = '';

    if (resolvedUserId) {
      const [userRecord, profile, goal, recentDeviations, recentFoodLogs] = await Promise.all([
        User.findById(resolvedUserId).lean(),
        NutritionProfile.findOne({ userId: resolvedUserId }).lean(),
        Goal.findOne({ userId: resolvedUserId }).lean(),
        DeviationRecovery.find({ userId: resolvedUserId })
          .sort({ deviationDate: -1, createdAt: -1 })
          .limit(5)
          .lean(),
        FoodLog.find({ userId: resolvedUserId })
          .sort({ date: -1, createdAt: -1 })
          .limit(10)
          .lean(),
      ]);

      const currentUser = userRecord || user || {};
      const cheatMealSummary = recentDeviations.length
        ? recentDeviations
            .map((entry) => {
              const deviationDate = entry.deviationDate ? new Date(entry.deviationDate).toISOString().slice(0, 10) : 'Unknown date';
              return `- ${deviationDate}: ${entry.description || 'Cheat meal'} (${entry.extraCalories ?? 0} extra kcal)${entry.notes ? ` | Notes: ${entry.notes}` : ''}`;
            })
            .join('\n')
        : '- No recent cheat meals recorded';

      const foodLogIds = [...new Set(recentFoodLogs.map((entry) => entry.foodId).filter(Boolean))];
      const recentFoods = foodLogIds.length
        ? await Food.find({ _id: { $in: foodLogIds } }).lean()
        : [];
      const foodLookup = Object.fromEntries(recentFoods.map((food) => [String(food._id), food]));

      const recentMealsSummary = recentFoodLogs.length
        ? recentFoodLogs
            .map((entry) => {
              const food = foodLookup[String(entry.foodId)];
              const date = entry.date ? new Date(entry.date).toISOString().slice(0, 10) : 'Unknown date';
              const foodName = food?.name || 'Unknown food';
              const quantity = entry.quantity ? ` x${entry.quantity}` : '';
              const mealType = entry.mealType ? ` [${entry.mealType}]` : '';
              return `- ${date}${mealType}: ${foodName}${quantity}`;
            })
            .join('\n')
        : '- No recent food logs recorded';

      userContext = `
User profile context:
- Name: ${currentUser.fullName || currentUser.username || 'Not provided'}
- Username: ${currentUser.username || 'Not provided'}
- Age: ${profile?.age ?? 'Not provided'}
- Weight: ${profile?.weight ?? 'Not provided'}
- Height: ${profile?.height ?? 'Not provided'}
- Activity level: ${profile?.activityLevel || 'Not provided'}
- Goal type: ${goal?.goalType || 'Not provided'}
- Target calories: ${goal?.targetCalories ?? 'Not provided'}
- Target protein: ${goal?.targetProtein ?? 'Not provided'}
- Target carbs: ${goal?.targetCarbs ?? 'Not provided'}
- Target fat: ${goal?.targetFat ?? 'Not provided'}

Recent cheat meals / deviations:
${cheatMealSummary}

Recent food logs / meals:
${recentMealsSummary}
`;
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
      - Use the provided user profile context, recent cheat meal history, and recent food logs to personalize advice as specifically as possible.
      - When the user mentions a previous cheat meal or deviation, or when their recent logs show certain foods, help them plan the next meals and recovery approach around that exact context.
      - Keep responses supportive, grounded, and free of toxic diet-culture language.
      - If a user asks something completely unrelated to nutrition, recipes, or health, gently guide them back to your core topics.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `${userContext}\nUser message: ${message}`,
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

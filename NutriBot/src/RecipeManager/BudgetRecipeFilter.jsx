import { useState } from 'react';
import AppLayout from '../GUIComponents/AppLayout.jsx';
import Card from '../GUIComponents/Card.jsx';
import LabeledInput from '../GUIComponents/LabeledInput.jsx';
import NutriBotClientService from '../services/NutriBotClientService.js';

export default function BudgetRecipeFilter({ setScreen }) {
  const [budget, setBudget] = useState(20);
  const recipes = NutriBotClientService.getRecipes(budget);

  return (
    <AppLayout title="Budget-Based Recipe Filtering" setScreen={setScreen}>
      <Card title="Recipe budget">
        <div className="mb-6 max-w-xs">
          <LabeledInput label="Maximum recipe cost" type="number" value={budget} onChange={(event) => setBudget(event.target.value)} />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {recipes.map((recipe) => (
            <div key={recipe.id} className="rounded-lg border border-slate-200 p-4">
              <h3 className="text-lg font-black">{recipe.name}</h3>
              <p className="text-sm text-slate-600">{recipe.ingredients.join(', ')}</p>
              <p className="mt-2 font-bold text-sky-700">Cost: {recipe.estimatedCost}</p>
              <p className="text-sm">Calories {recipe.calories} · P {recipe.protein} · C {recipe.carbs} · F {recipe.fat}</p>
            </div>
          ))}
        </div>
      </Card>
    </AppLayout>
  );
}

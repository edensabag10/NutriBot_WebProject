import { useState } from 'react';
import AppLayout from '../GUIComponents/AppLayout.jsx';
import Button from '../GUIComponents/Button.jsx';
import Card from '../GUIComponents/Card.jsx';
import NutriBotClientService from '../services/NutriBotClientService.js';
import { getCurrentUser } from '../UsersManager/UsersService.js';

export default function FavoriteFoods({ setScreen }) {
  const user = getCurrentUser();
  const [version, setVersion] = useState(0);
  const favorites = NutriBotClientService.getFavoriteFoods(user.id);

  return (
    <AppLayout title="Favorite Foods" setScreen={setScreen}>
      <Card title="Quick selection foods">
        <div className="grid gap-4 md:grid-cols-3">
          {favorites.map((food) => (
            <div key={`${food.id}-${version}`} className="rounded-lg border border-slate-200 p-4">
              <h3 className="font-black">{food.name}</h3>
              <p className="mb-3 text-sm text-slate-600">{food.calories} calories</p>
              <Button variant="secondary" onClick={() => { NutriBotClientService.toggleFavoriteFood(user.id, food.id); setVersion(version + 1); }}>Remove</Button>
            </div>
          ))}
        </div>
        {!favorites.length && <p className="text-slate-500">No favorite foods yet. Add some from Food Search.</p>}
      </Card>
    </AppLayout>
  );
}

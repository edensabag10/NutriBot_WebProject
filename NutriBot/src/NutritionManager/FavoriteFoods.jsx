import { useEffect, useState } from 'react';
import AppLayout from '../GUIComponents/AppLayout.jsx';
import Button from '../GUIComponents/Button.jsx';
import Card from '../GUIComponents/Card.jsx';
import NutriBotClientService from '../services/NutriBotClientService.js';
import { getCurrentUser } from '../UsersManager/UsersService.js';

export default function FavoriteFoods({ setScreen }) {
  const user = getCurrentUser();
  const [favorites, setFavorites] = useState([]);
  const [error, setError] = useState('');

  const loadFavorites = async () => {
    try {
      setFavorites(await NutriBotClientService.getFavoriteFoods(user.id));
      setError('');
    } catch {
      setError('Unable to load favorite foods');
    }
  };

  useEffect(() => {
    loadFavorites();
  }, []);

  const handleRemove = async (foodId) => {
    await NutriBotClientService.toggleFavoriteFood(user.id, foodId);
    await loadFavorites();
  };

  return (
    <AppLayout title="Favorite Foods" setScreen={setScreen}>
      <Card title="Quick selection foods">
        {error && <p className="mb-4 text-sm font-semibold text-rose-600">{error}</p>}
        <div className="grid gap-4 md:grid-cols-3">
          {favorites.map((food) => (
            <div key={food.id} className="rounded-lg border border-slate-200 p-4">
              <h3 className="font-black">{food.name}</h3>
              <p className="mb-3 text-sm text-slate-600">{food.calories} calories</p>
              <Button variant="secondary" onClick={() => handleRemove(food.id)}>Remove</Button>
            </div>
          ))}
        </div>
        {!favorites.length && <p className="text-slate-500">No favorite foods yet. Add some from Food Search.</p>}
      </Card>
    </AppLayout>
  );
}

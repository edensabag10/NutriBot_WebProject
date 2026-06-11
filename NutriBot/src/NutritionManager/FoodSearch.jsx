import { useEffect, useState } from 'react';
import AppLayout from '../GUIComponents/AppLayout.jsx';
import Button from '../GUIComponents/Button.jsx';
import Card from '../GUIComponents/Card.jsx';
import NutriBotClientService from '../services/NutriBotClientService.js';
import { getCurrentUser } from '../UsersManager/UsersService.js';

export default function FoodSearch({ setScreen }) {
  const user = getCurrentUser();
  const [query, setQuery] = useState('');
  const [foods, setFoods] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [error, setError] = useState('');

  const loadData = async () => {
    try {
      const [nextFoods, nextFavorites] = await Promise.all([
        NutriBotClientService.getFoods(),
        NutriBotClientService.getFavoriteFoods(user.id),
      ]);
      setFoods(nextFoods);
      setFavorites(nextFavorites.map((food) => food.id));
      setError('');
    } catch {
      setError('Unable to load foods');
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredFoods = foods.filter((food) => food.name.toLowerCase().includes(query.toLowerCase()));

  const handleToggleFavorite = async (foodId) => {
    await NutriBotClientService.toggleFavoriteFood(user.id, foodId);
    await loadData();
  };

  return (
    <AppLayout title="Food Search" setScreen={setScreen}>
      <Card title="System food database">
        {error && <p className="mb-4 text-sm font-semibold text-rose-600">{error}</p>}
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search food..." className="mb-4 w-full rounded-lg border border-slate-300 px-3 py-2" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredFoods.map((food) => (
            <div key={food.id} className="rounded-lg border border-slate-200 p-4">
              <h3 className="text-lg font-black">{food.name}</h3>
              <p className="text-sm text-slate-600">{food.calories} cal - P {food.protein} - C {food.carbs} - F {food.fat}</p>
              <div className="mt-3">
                <Button onClick={() => handleToggleFavorite(food.id)} variant={favorites.includes(food.id) ? 'secondary' : 'primary'}>
                  {favorites.includes(food.id) ? 'Remove Favorite' : 'Save Favorite'}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </AppLayout>
  );
}

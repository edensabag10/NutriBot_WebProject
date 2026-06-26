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

  
  const foodImages = {
    'chicken breast': 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=400&auto=format&fit=crop&q=60',
    'rice': 'https://static01.nyt.com/images/2018/02/21/dining/00RICEGUIDE8/00RICEGUIDE8-superJumbo.jpg?format=pjpg&quality=75&auto=webp&disable=upscale',
    'banana': 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&auto=format&fit=crop&q=60',
    'egg': 'https://images.unsplash.com/photo-1506976785307-8732e854ad03?w=400&auto=format&fit=crop&q=60',
    'oats': 'https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=400&auto=format&fit=crop&q=60',
    'greek yogurt': 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&auto=format&fit=crop&q=60',
    'tuna': 'https://images.globes.co.il/images/NewGlobes/big_image_800/2016/1-800.2016317T174006.jpg'
  };
  const defaultFoodImage = "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=150&auto=format&fit=crop&q=60";

  return (
    <AppLayout title="Food Search" setScreen={setScreen}>
      <Card title="System food database">
        {error && <p className="mb-4 text-sm font-semibold text-rose-600">{error}</p>}
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search food..." className="mb-4 w-full rounded-lg border border-slate-300 px-3 py-2" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredFoods.map((food) => {
            // התאמת התמונה לפי שם המאכל באותיות קטנות
            const foodKey = food.name.toLowerCase().trim();
            const currentImage = foodImages[foodKey] || food.imageUrl || defaultFoodImage;

            return (
              <div key={food.id} className="rounded-lg border border-slate-200 p-4 flex flex-col justify-between">
                <div>
                  <div className="mb-3 h-50 w-full overflow-hidden rounded-md bg-slate-100">
                    <img 
                      src={currentImage} 
                      alt={food.name} 
                      className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                      onError={(e) => { e.target.src = defaultFoodImage; }} 
                    />
                  </div>
                  
                  <h3 className="text-lg font-black">{food.name}</h3>
                  <p className="text-sm text-slate-600">{food.calories} cal - P {food.protein} - C {food.carbs} - F {food.fat}</p>
                </div>
                <div className="mt-3">
                  <Button onClick={() => handleToggleFavorite(food.id)} variant={favorites.includes(food.id) ? 'secondary' : 'primary'}>
                    {favorites.includes(food.id) ? 'Remove Favorite' : 'Save Favorite'}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </AppLayout>
  );
}
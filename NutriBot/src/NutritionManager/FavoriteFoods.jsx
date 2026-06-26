import { useEffect, useState } from 'react';
import AppLayout from '../GUIComponents/AppLayout.jsx';
import Button from '../GUIComponents/Button.jsx';
import Card from '../GUIComponents/Card.jsx';
import NutriBotClientService from '../services/NutriBotClientService.js';
import { getCurrentUser } from '../UsersManager/UsersService.js';

const foodImages = {
  'chicken breast': 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=400&auto=format&fit=crop&q=60',
  'rice': 'https://static01.nyt.com/images/2018/02/21/dining/00RICEGUIDE8/00RICEGUIDE8-superJumbo.jpg?format=pjpg&quality=75&auto=webp&disable=upscale',
  'banana': 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&auto=format&fit=crop&q=60',
  'egg': 'https://images.unsplash.com/photo-1506976785307-8732e854ad03?w=400&auto=format&fit=crop&q=60',
  'oats': 'https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=400&auto=format&fit=crop&q=60',
  'greek yogurt': 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&auto=format&fit=crop&q=60',
  'tuna': 'https://images.globes.co.il/images/NewGlobes/big_image_800/2016/1-800.2016317T174006.jpg'
};

const getFoodImage = (foodName) => {
  const name = foodName.toLowerCase().trim();
  
  for (const key in foodImages) {
    if (name.includes(key)) {
      return foodImages[key];
    }
  }
  
  return 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=400&auto=format&fit=crop&q=60';
};

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
            <div 
              key={food.id} 
              className="rounded-lg border border-slate-200 dark:border-slate-700 p-4 bg-white dark:bg-slate-900/50 flex flex-col justify-between transition-colors duration-200"
            >
              <div>
                <div className="w-full h-48 rounded-md overflow-hidden bg-slate-100 dark:bg-slate-800 mb-3 flex items-center justify-center">
                  <img 
                    src={getFoodImage(food.name)} 
                    alt={food.name} 
                    className="w-full h-full object-cover"
                    onError={(e) => { 
                      e.target.src = 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=400&auto=format&fit=crop&q=60'; 
                    }}
                  />
                </div>
                <h3 className="font-black text-slate-900 dark:text-white">{food.name}</h3>
                <p className="mb-4 text-sm text-slate-600 dark:text-slate-400">{food.calories} calories</p>
              </div>
              <Button variant="secondary" onClick={() => handleRemove(food.id)}>Remove</Button>
            </div>
          ))}
        </div>
        {!favorites.length && <p className="text-slate-500 dark:text-slate-400 mt-2">No favorite foods yet. Add some from Food Search.</p>}
      </Card>
    </AppLayout>
  );
}
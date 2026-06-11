import { useState } from 'react';
import AppLayout from '../GUIComponents/AppLayout.jsx';
import Button from '../GUIComponents/Button.jsx';
import Card from '../GUIComponents/Card.jsx';
import LabeledInput from '../GUIComponents/LabeledInput.jsx';
import NutriBotClientService from '../services/NutriBotClientService.js';
import { getCurrentUser } from '../UsersManager/UsersService.js';

export default function NutritionProfile({ setScreen }) {
  const user = getCurrentUser();
  const existingProfile = NutriBotClientService.getNutritionProfile(user?.id);
  const [profile, setProfile] = useState(existingProfile || { age: '', weight: '', height: '', activityLevel: 'Moderate' });

  const handleChange = (event) => {
    setProfile({ ...profile, [event.target.name]: event.target.value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    NutriBotClientService.saveNutritionProfile(user.id, profile);
    setScreen('dashboard');
  };

  return (
    <AppLayout title="Nutrition Profile" setScreen={setScreen}>
      <Card title="Personal nutrition details">
        <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
          <LabeledInput label="Age" name="age" type="number" value={profile.age} onChange={handleChange} required />
          <LabeledInput label="Weight (kg)" name="weight" type="number" value={profile.weight} onChange={handleChange} required />
          <LabeledInput label="Height (cm)" name="height" type="number" value={profile.height} onChange={handleChange} required />
          <label className="block">
            <span className="mb-1 block text-sm font-semibold text-slate-600">Activity level</span>
            <select name="activityLevel" value={profile.activityLevel} onChange={handleChange} className="w-full rounded-lg border border-slate-300 px-3 py-2">
              <option>Low</option>
              <option>Moderate</option>
              <option>High</option>
            </select>
          </label>
          <div className="md:col-span-2">
            <Button type="submit">Save Profile</Button>
          </div>
        </form>
      </Card>
    </AppLayout>
  );
}

import AppLayout from '../GUIComponents/AppLayout.jsx';
import Card from '../GUIComponents/Card.jsx';
import { getCurrentUser } from './UsersService.js';

export default function Profile({ setScreen }) {
  const user = getCurrentUser();

  if (!user) {
    setScreen('login');
    return null;
  }

  return (
    <AppLayout title="User Profile" setScreen={setScreen}>
      <Card title="Account details">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-lg bg-slate-100 p-4">
            <p className="text-sm font-semibold text-slate-500">Username</p>
            <p className="text-xl font-black">{user.username}</p>
          </div>
          <div className="rounded-lg bg-slate-100 p-4">
            <p className="text-sm font-semibold text-slate-500">Email</p>
            <p className="text-xl font-black">{user.email}</p>
          </div>
          <div className="rounded-lg bg-slate-100 p-4">
            <p className="text-sm font-semibold text-slate-500">Full name</p>
            <p className="text-xl font-black">{user.fullName || 'Not set'}</p>
          </div>
          <div className="rounded-lg bg-slate-100 p-4">
            <p className="text-sm font-semibold text-slate-500">Storage</p>
            <p className="text-xl font-black">Client localStorage</p>
          </div>
        </div>
      </Card>
    </AppLayout>
  );
}

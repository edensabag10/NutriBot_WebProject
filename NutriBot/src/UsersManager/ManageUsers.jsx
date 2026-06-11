import AppLayout from '../GUIComponents/AppLayout.jsx';
import Card from '../GUIComponents/Card.jsx';
import UsersService from './UsersService.js';

export default function ManageUsers({ setScreen }) {
  const users = UsersService.getUsers();

  return (
    <AppLayout title="Manage Users" setScreen={setScreen}>
      <Card title="Registered users">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-200 text-sm text-slate-500">
                <th className="py-3">Username</th>
                <th className="py-3">Email</th>
                <th className="py-3">Full name</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-slate-100">
                  <td className="py-3 font-bold">{user.username}</td>
                  <td className="py-3">{user.email}</td>
                  <td className="py-3">{user.fullName || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </AppLayout>
  );
}

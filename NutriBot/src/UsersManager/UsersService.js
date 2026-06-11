import { apiRequest } from '../services/apiClient.js';

let currentUser = null;

function createDefaultDashboard(userData) {
  const displayName = userData.fullName || userData.username || 'New user';

  return {
    calories: { consumed: 0, goal: 2000, percent: 0 },
    macros: { carbs: '0 g', protein: '0 g', fat: '0 g' },
    profile: {
      mainGoal: userData.goal || 'Personal goal',
      rule: 'Not set',
      cookingStyle: 'Not set',
    },
    chat: {
      botMessage: `Hello ${displayName}! Your profile was created successfully. You can start tracking your day.`,
      userMessage: 'Great, let us start.',
    },
    meals: [],
  };
}

async function getUsers() {
  return apiRequest('/users');
}

async function getUserById(id) {
  return apiRequest(`/users/${id}`);
}

async function isUsernameTaken(username) {
  const normalizedUsername = username.trim().toLowerCase();
  const users = await getUsers();
  return users.some((user) => user.username?.toLowerCase() === normalizedUsername);
}

async function isEmailTaken(email) {
  const normalizedEmail = email.trim().toLowerCase();
  const users = await getUsers();
  return users.some((user) => user.email?.toLowerCase() === normalizedEmail);
}

async function register(userData) {
  const normalizedEmail = userData.email.trim().toLowerCase();
  const username = (userData.username || normalizedEmail.split('@')[0]).trim();

  if (await isUsernameTaken(username)) {
    return { user: null, error: 'username-taken' };
  }

  if (await isEmailTaken(normalizedEmail)) {
    return { user: null, error: 'email-taken' };
  }

  const user = await apiRequest('/users', {
    method: 'POST',
    body: JSON.stringify({
      ...userData,
      username,
      email: normalizedEmail,
      dashboard: userData.dashboard || createDefaultDashboard({ ...userData, username, email: normalizedEmail }),
    }),
  });

  if (userData.age || userData.weight || userData.height) {
    await apiRequest('/nutrition-profiles', {
      method: 'POST',
      body: JSON.stringify({
        userId: user.id,
        age: Number(userData.age) || 0,
        weight: Number(userData.weight) || 0,
        height: Number(userData.height) || 0,
        activityLevel: 'Moderate',
      }),
    });
  }

  return { user, error: null };
}

async function registerUser(userData) {
  return register(userData);
}

async function updateUser(id, updates) {
  return apiRequest(`/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(updates),
  });
}

async function deleteUser(id) {
  await apiRequest(`/users/${id}`, { method: 'DELETE' });

  if (String(currentUser?.id) === String(id)) {
    currentUser = null;
  }

  return true;
}

async function login(username, password) {
  const normalizedUsername = username.trim().toLowerCase();
  const users = await getUsers();

  const user = users.find(
    (existingUser) =>
      (existingUser.username?.toLowerCase() === normalizedUsername ||
        existingUser.email?.toLowerCase() === normalizedUsername) &&
      existingUser.password === password,
  );

  currentUser = user || null;
  return currentUser;
}

async function loginUser(credentials) {
  return login(credentials.username || credentials.email || '', credentials.password || '');
}

function getCurrentUser() {
  return currentUser;
}

function getCurrentUserDashboard() {
  return currentUser?.dashboard || createDefaultDashboard(currentUser || {});
}

function logout() {
  currentUser = null;
}

const UsersService = {
  getUsers,
  getUserById,
  isUsernameTaken,
  isEmailTaken,
  register,
  registerUser,
  updateUser,
  deleteUser,
  login,
  loginUser,
  getCurrentUser,
  getCurrentUserDashboard,
  logout,
};

export {
  getUsers,
  getUserById,
  register,
  registerUser,
  isUsernameTaken,
  isEmailTaken,
  updateUser,
  deleteUser,
  login,
  loginUser,
  getCurrentUser,
  getCurrentUserDashboard,
  logout,
};

export default UsersService;

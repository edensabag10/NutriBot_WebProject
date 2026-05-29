const users = [
  {
    id: '1',
    username: 'moran',
    email: 'moran@example.com',
    password: '123456',
    fullName: 'מורן',
    dashboard: {
      calories: { consumed: 1250, goal: 2000, percent: 62 },
      macros: { carbs: '150 גרם', protein: '85 גרם', fat: '40 גרם' },
      profile: {
        mainGoal: 'איזון ושגרה יומית',
        rule: 'לא לאכול אחרי 18:00',
        cookingStyle: 'מהיר וקל',
      },
      chat: {
        botMessage:
          'היי מורן! ראיתי ששתית קפה עם עוגה בבוקר. רוצה שאציע לך ארוחת צהריים מהירה שתאזן את היום?',
        userMessage: 'כן בבקשה! משהו שאני יכולה להכין בעבודה.',
      },
      meals: [
        { id: 1, time: '08:30', name: 'קפה הפוך + פרוסת עוגת בננה', cals: 350, protein: '5 גרם' },
        { id: 2, time: '13:00', name: 'סלט עוף וקינואה', cals: 450, protein: '32 גרם' },
        { id: 3, time: '16:30', name: 'תפוח ירוק', cals: 80, protein: '0 גרם' },
      ],
    },
  },
  {
    id: '2',
    username: 'admin',
    email: 'admin@nutribot.com',
    password: 'admin123',
    fullName: 'מנהל',
    dashboard: {
      calories: { consumed: 1680, goal: 2300, percent: 73 },
      macros: { carbs: '210 גרם', protein: '110 גרם', fat: '52 גרם' },
      profile: {
        mainGoal: 'שמירה על המשקל',
        rule: 'מעקב חלבון בכל ארוחה',
        cookingStyle: 'הכנה מראש',
      },
      chat: {
        botMessage:
          'היי מנהל! צריכת החלבון שלך נראית טובה היום. רוצה רעיון לארוחת ערב מאוזנת?',
        userMessage: 'כן, שיהיה פשוט.',
      },
      meals: [
        { id: 1, time: '07:45', name: 'יוגורט יווני עם שיבולת שועל', cals: 420, protein: '28 גרם' },
        { id: 2, time: '12:30', name: 'כריך הודו', cals: 560, protein: '38 גרם' },
        { id: 3, time: '15:30', name: 'שייק חלבון', cals: 220, protein: '30 גרם' },
      ],
    },
  },
  {
    id: '3',
    username: 'demo',
    email: 'demo@nutribot.com',
    password: 'demo123',
    fullName: 'משתמש לדוגמה',
    dashboard: {
      calories: { consumed: 980, goal: 1800, percent: 54 },
      macros: { carbs: '120 גרם', protein: '62 גרם', fat: '31 גרם' },
      profile: {
        mainGoal: 'ירידה מתונה במשקל',
        rule: 'לשתות מים לפני נשנושים',
        cookingStyle: 'עד 15 דקות',
      },
      chat: {
        botMessage:
          'היי משתמש לדוגמה! עדיין נשאר לך מקום לארוחת ערב מאוזנת היום. רוצה הצעה מהירה?',
        userMessage: 'בטח, משהו קליל.',
      },
      meals: [
        { id: 1, time: '09:00', name: 'טוסט עם קוטג׳', cals: 310, protein: '22 גרם' },
        { id: 2, time: '13:15', name: 'מרק ירקות', cals: 260, protein: '10 גרם' },
        { id: 3, time: '16:00', name: 'בננה', cals: 110, protein: '1 גרם' },
      ],
    },
  },
];

let currentUser = null;

function getUsers() {
  return [...users];
}

function getUserById(id) {
  return users.find((user) => user.id === id) || null;
}

function createDefaultDashboard(userData) {
  const displayName = userData.fullName || 'משתמש חדש';

  return {
    calories: { consumed: 0, goal: 2000, percent: 0 },
    macros: { carbs: '0 גרם', protein: '0 גרם', fat: '0 גרם' },
    profile: {
      mainGoal: userData.goal || 'יעד אישי',
      rule: 'טרם הוגדר',
      cookingStyle: 'טרם הוגדר',
    },
    chat: {
      botMessage: `שלום ${displayName}! הפרופיל שלך נוצר בהצלחה. אפשר להתחיל לעקוב אחרי היום שלך.`,
      userMessage: 'מעולה, בואי נתחיל.',
    },
    meals: [],
  };
}

function isUsernameTaken(username) {
  const normalizedUsername = username.trim().toLowerCase();
  return users.some((user) => user.username?.toLowerCase() === normalizedUsername);
}

function isEmailTaken(email) {
  const normalizedEmail = email.trim().toLowerCase();
  return users.some((user) => user.email.toLowerCase() === normalizedEmail);
}

function createUser(userData) {
  const normalizedEmail = userData.email.trim().toLowerCase();
  const username = (userData.username || normalizedEmail.split('@')[0]).trim();

  if (isUsernameTaken(username)) {
    return { user: null, error: 'username-taken' };
  }

  if (isEmailTaken(normalizedEmail)) {
    return { user: null, error: 'email-taken' };
  }

  const newUser = {
    id: crypto.randomUUID(),
    ...userData,
    username,
    email: normalizedEmail,
    dashboard: userData.dashboard || createDefaultDashboard(userData),
  };

  users.push(newUser);
  return { user: newUser, error: null };
}

function register(userData) {
  return createUser(userData);
}

function updateUser(id, updates) {
  const userIndex = users.findIndex((user) => user.id === id);

  if (userIndex === -1) {
    return null;
  }

  users[userIndex] = {
    ...users[userIndex],
    ...updates,
    id,
  };

  return users[userIndex];
}

function deleteUser(id) {
  const userIndex = users.findIndex((user) => user.id === id);

  if (userIndex === -1) {
    return false;
  }

  users.splice(userIndex, 1);
  return true;
}

function login(username, password) {
  const normalizedUsername = username.trim().toLowerCase();

  const user = users.find(
    (existingUser) =>
      (existingUser.username?.toLowerCase() === normalizedUsername ||
        existingUser.email.toLowerCase() === normalizedUsername) &&
      existingUser.password === password,
  );

  if (!user) {
    currentUser = null;
    return null;
  }

  currentUser = user;
  return user;
}

function getCurrentUser() {
  return currentUser;
}

function getCurrentUserDashboard() {
  return currentUser?.dashboard || null;
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
  updateUser,
  deleteUser,
  login,
  getCurrentUser,
  getCurrentUserDashboard,
  logout,
};

export { register, isUsernameTaken, isEmailTaken, login, getCurrentUser, getCurrentUserDashboard, logout };
export default UsersService;

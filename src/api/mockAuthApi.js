const USERS_KEY = 'movies_mock_users';
const DELAY_MS = 400; 

function delay(value) {
  return new Promise((resolve) => setTimeout(() => resolve(value), DELAY_MS));
}

function fail(message) {
  return Promise.reject({ status: 400, message });
}

function loadUsers() {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function ensureSeed() {
  let users = loadUsers();
  if (!users) {
    users = [
      { id: 1, userName: 'admin', email: 'admin@movies.com', password: 'Admin123!', roles: ['Admin'] },
      { id: 2, userName: 'usuario', email: 'user@movies.com', password: 'User123!', roles: ['User'] },
    ];
    saveUsers(users);
  }
  return users;
}

function makeFakeToken(user) {
  const payload = { sub: user.id, userName: user.userName, roles: user.roles, mock: true };
  return `mock.${btoa(unescape(encodeURIComponent(JSON.stringify(payload))))}.token`;
}

function toAuthResponse(user) {
  return {
    token: makeFakeToken(user),
    user: { id: user.id, userName: user.userName, email: user.email, roles: user.roles },
  };
}

export const mockAuthApi = {
  async login({ email, password }) {
    const users = ensureSeed();
    const user = users.find((u) => u.email.toLowerCase() === String(email).toLowerCase());

    if (!user || user.password !== password) {
      return fail('Email o contraseña incorrectos.');
    }

    return delay(toAuthResponse(user));
  },

  async register({ username, email, password }) {
    const users = ensureSeed();

    const emailTaken = users.some((u) => u.email.toLowerCase() === String(email).toLowerCase());
    if (emailTaken) {
      return fail('Ya existe una cuenta registrada con ese email.');
    }

    const usernameTaken = users.some((u) => u.userName.toLowerCase() === String(username).toLowerCase());
    if (usernameTaken) {
      return fail('Ese nombre de usuario ya está en uso.');
    }

    const newUser = {
      id: users.length ? Math.max(...users.map((u) => u.id)) + 1 : 1,
      userName: username,
      email,
      password,
      roles: ['User'], 
    };

    users.push(newUser);
    saveUsers(users);

    return delay(toAuthResponse(newUser));
  },
};

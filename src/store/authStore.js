import { create } from 'zustand';

const STORAGE_KEY = 'movies_auth';

function loadPersisted() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

const persisted = loadPersisted();

export const useAuthStore = create((set, get) => ({
  user: persisted?.user ?? null,
  token: persisted?.token ?? null,
  isAuthenticated: !!persisted?.token,

  login: (authResponse) => {
    const token = authResponse.token || authResponse.accessToken || authResponse.jwt;
    const user = authResponse.user || authResponse.profile || null;
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ token, user }));
    set({ user, token, isAuthenticated: !!token });
  },

  logout: () => {
    localStorage.removeItem(STORAGE_KEY);
    set({ user: null, token: null, isAuthenticated: false });
  },

  isAdmin: () => get().user?.role === 'Admin',
}));

/* ══════════════════════════════════════════════
   USER STORE — In-memory users (globalThis)
   ══════════════════════════════════════════════ */

import type { User, UserRole, ShippingAddress } from "@/types/order.type";

interface UserStore {
  users: User[];
  sessions: Record<string, string>; // token → userId
}

const getStore = (): UserStore => {
  const g = globalThis as unknown as { __userStore?: UserStore };
  if (!g.__userStore) {
    g.__userStore = {
      users: [
        {
          id: "user_admin",
          email: "admin@pcbuildershop.vn",
          name: "Admin",
          phone: "0909000000",
          role: "admin",
          addresses: [],
          createdAt: "2025-01-01T00:00:00Z",
        },
        {
          id: "user_demo",
          email: "demo@pcbuildershop.vn",
          name: "Nguyễn Văn Demo",
          phone: "0909123456",
          role: "customer",
          addresses: [
            {
              fullName: "Nguyễn Văn Demo",
              phone: "0909123456",
              email: "demo@pcbuildershop.vn",
              province: "Hồ Chí Minh",
              district: "Quận 1",
              ward: "Phường Bến Nghé",
              address: "123 Lê Lợi",
            },
          ],
          createdAt: "2025-06-15T10:30:00Z",
        },
      ],
      sessions: {},
    };
  }
  return g.__userStore;
};

/* simple password store (demo only) */
const passwords: Record<string, string> = {
  "admin@pcbuildershop.vn": "admin123",
  "demo@pcbuildershop.vn": "demo123",
};

/* ── Auth ── */
export const login = (
  email: string,
  password: string
): { user: User; token: string } | null => {
  const store = getStore();
  const user = store.users.find((u) => u.email === email);
  if (!user) return null;
  if (passwords[email] !== password) return null;
  const token = `tok_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
  store.sessions[token] = user.id;
  return { user, token };
};

export const register = (data: {
  email: string;
  password: string;
  name: string;
  phone?: string;
}): { user: User; token: string } | { error: string } => {
  const store = getStore();
  if (store.users.find((u) => u.email === data.email)) {
    return { error: "Email đã tồn tại" };
  }
  const user: User = {
    id: `user_${Date.now()}`,
    email: data.email,
    name: data.name,
    phone: data.phone,
    role: "customer",
    addresses: [],
    createdAt: new Date().toISOString(),
  };
  store.users.push(user);
  passwords[data.email] = data.password;
  const token = `tok_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
  store.sessions[token] = user.id;
  return { user, token };
};

export const getUserByToken = (token: string): User | null => {
  const store = getStore();
  const userId = store.sessions[token];
  if (!userId) return null;
  return store.users.find((u) => u.id === userId) ?? null;
};

export const logout = (token: string): void => {
  const store = getStore();
  delete store.sessions[token];
};

/* ── Profile ── */
export const updateProfile = (
  userId: string,
  data: Partial<Pick<User, "name" | "phone" | "avatar">>
): User | null => {
  const store = getStore();
  const user = store.users.find((u) => u.id === userId);
  if (!user) return null;
  if (data.name) user.name = data.name;
  if (data.phone) user.phone = data.phone;
  if (data.avatar) user.avatar = data.avatar;
  return user;
};

export const changePassword = (
  email: string,
  oldPassword: string,
  newPassword: string
): boolean => {
  if (passwords[email] !== oldPassword) return false;
  passwords[email] = newPassword;
  return true;
};

export const addAddress = (
  userId: string,
  address: ShippingAddress
): User | null => {
  const store = getStore();
  const user = store.users.find((u) => u.id === userId);
  if (!user) return null;
  user.addresses.push(address);
  return user;
};

export const removeAddress = (userId: string, index: number): User | null => {
  const store = getStore();
  const user = store.users.find((u) => u.id === userId);
  if (!user || index < 0 || index >= user.addresses.length) return null;
  user.addresses.splice(index, 1);
  return user;
};

/* ── Admin ── */
export const getAllUsers = (): User[] => getStore().users;
export const getUserById = (id: string): User | undefined =>
  getStore().users.find((u) => u.id === id);

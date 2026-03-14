import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Admin user type
export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'SUPER_ADMIN';
}

// Admin auth store
interface AdminAuthStore {
  isAdminAuthenticated: boolean;
  adminUser: AdminUser | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  checkAuth: () => void;
}

// Default admin credentials (in production, this would be in a database)
const ADMIN_CREDENTIALS = {
  email: 'admin@clothingctrl.com',
  password: 'Admin@123', // Change this in production!
  name: 'Admin',
  role: 'SUPER_ADMIN' as const,
};

export const useAdminAuth = create<AdminAuthStore>()(
  persist(
    (set) => ({
      isAdminAuthenticated: false,
      adminUser: null,

      login: async (email: string, password: string) => {
        // Simple credential check (in production, use database with hashed passwords)
        if (email.toLowerCase() === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
          const adminUser: AdminUser = {
            id: 'admin-1',
            email: ADMIN_CREDENTIALS.email,
            name: ADMIN_CREDENTIALS.name,
            role: ADMIN_CREDENTIALS.role,
          };
          set({ isAdminAuthenticated: true, adminUser });
          return { success: true };
        }
        return { success: false, error: 'Invalid email or password' };
      },

      logout: () => {
        set({ isAdminAuthenticated: false, adminUser: null });
      },

      checkAuth: () => {
        // This will be called on mount to check persisted state
        const state = useAdminAuth.getState();
        if (!state.isAdminAuthenticated) {
          set({ adminUser: null });
        }
      },
    }),
    {
      name: 'clothing-ctrl-admin-auth',
      partialize: (state) => ({
        isAdminAuthenticated: state.isAdminAuthenticated,
        adminUser: state.adminUser,
      }),
    }
  )
);

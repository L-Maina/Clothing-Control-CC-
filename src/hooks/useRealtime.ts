'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useCallback, useEffect, useRef } from 'react';

// Store Settings Interface
export interface StoreSettings {
  storeName: string;
  storeDescription: string | null;
  storeEmail: string | null;
  storePhone: string | null;
  addressLine1: string | null;
  addressLine2: string | null;
  city: string | null;
  country: string | null;
  openHour: string | null;
  closeHour: string | null;
  openDays: string | null;
  bannerEnabled: boolean;
  bannerText: string | null;
  bannerLink: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
}

// Social Handle Interface
export interface SocialHandle {
  id: string;
  platform: string;
  handle: string;
  url: string | null;
  isActive: boolean;
}

// Default settings
const defaultSettings: StoreSettings = {
  storeName: 'Clothing Ctrl',
  storeDescription: null,
  storeEmail: null,
  storePhone: null,
  addressLine1: null,
  addressLine2: null,
  city: 'Nairobi',
  country: 'Kenya',
  openHour: '12:00',
  closeHour: '18:00',
  openDays: 'Mon-Sat',
  bannerEnabled: false,
  bannerText: null,
  bannerLink: null,
  metaTitle: null,
  metaDescription: null,
};

// Settings Store
interface SettingsStore {
  settings: StoreSettings;
  socials: SocialHandle[];
  isLoading: boolean;
  lastUpdated: number | null;
  dismissedBannerText: string | null; // Store the text of dismissed banner
  setSettings: (settings: Partial<StoreSettings>) => void;
  setSocials: (socials: SocialHandle[]) => void;
  setLoading: (loading: boolean) => void;
  setDismissedBannerText: (text: string | null) => void;
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      settings: defaultSettings,
      socials: [],
      isLoading: true,
      lastUpdated: null,
      dismissedBannerText: null,
      setSettings: (newSettings) =>
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
          lastUpdated: Date.now(),
        })),
      setSocials: (socials) =>
        set({
          socials,
          lastUpdated: Date.now(),
        }),
      setLoading: (loading) => set({ isLoading: loading }),
      setDismissedBannerText: (text) => set({ dismissedBannerText: text }),
    }),
    {
      name: 'clothing-ctrl-settings',
      partialize: (state) => ({
        settings: state.settings,
        socials: state.socials,
        lastUpdated: state.lastUpdated,
        // NOTE: dismissedBannerText is NOT persisted - it resets on page refresh
      }),
    }
  )
);

// Sync Event Types
export type SyncEventType = 'SETTINGS_UPDATE' | 'SOCIALS_UPDATE' | 'ORDER_UPDATE';

export interface SyncEvent {
  type: SyncEventType;
  action: 'CREATE' | 'UPDATE' | 'DELETE';
  data: Record<string, unknown>;
  timestamp: string;
}

// SSE Connection State
interface SSEState {
  isConnected: boolean;
  lastEventTime: string | null;
  reconnectAttempts: number;
  connectionError: string | null;
}

// Hook for components that need live settings with SSE
export function useLiveSettings() {
  const settings = useSettingsStore((state) => state.settings);
  const socials = useSettingsStore((state) => state.socials);
  const isLoading = useSettingsStore((state) => state.isLoading);
  const setSettings = useSettingsStore((state) => state.setSettings);
  const setSocials = useSettingsStore((state) => state.setSocials);
  const setLoading = useSettingsStore((state) => state.setLoading);

  // Fetch settings on mount - memoized to prevent infinite loops
  const fetchSettings = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/settings');
      const data = await response.json();
      if (data.settings) {
        setSettings(data.settings);
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    } finally {
      setLoading(false);
    }
  }, [setSettings, setLoading]);

  // Fetch socials - memoized to prevent infinite loops
  const fetchSocials = useCallback(async () => {
    try {
      const response = await fetch('/api/social');
      const data = await response.json();
      if (data.handles) {
        setSocials(data.handles);
      }
    } catch (error) {
      console.error('Failed to fetch socials:', error);
    }
  }, [setSocials]);

  // Get banner settings
  const getBanner = () => {
    const { bannerEnabled, bannerText, bannerLink } = settings;
    if (!bannerEnabled || !bannerText) return null;
    return { enabled: bannerEnabled, text: bannerText, link: bannerLink };
  };

  // Get active socials
  const getActiveSocials = () => {
    return socials.filter((s) => s.isActive);
  };

  return {
    settings,
    socials,
    isLoading,
    getBanner,
    getActiveSocials,
    fetchSettings,
    fetchSocials,
    setSettings,
    setSocials,
  };
}

// SSE Hook for real-time updates
export function useRealtimeSync() {
  const setSettings = useSettingsStore((state) => state.setSettings);
  const setSocials = useSettingsStore((state) => state.setSocials);
  const { fetchSettings, fetchSocials } = useLiveSettings();

  // Use refs to persist across renders without causing re-renders
  const eventSourceRef = useRef<EventSource | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const maxReconnectAttempts = 5;
  const baseReconnectDelay = 1000;

  // Connect function - not memoized since it references itself for reconnection
  const connect = () => {
    if (typeof window === 'undefined') return;
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    try {
      eventSourceRef.current = new EventSource('/api/sync/events');

      eventSourceRef.current.onopen = () => {
        reconnectAttemptsRef.current = 0;
      };

      eventSourceRef.current.onmessage = (event) => {
        try {
          const data: SyncEvent = JSON.parse(event.data);

          // Handle different event types
          switch (data.type) {
            case 'CONNECTED':
              // Connection confirmed
              break;

            case 'KEEPALIVE':
              // Just a heartbeat, no action needed
              break;

            case 'SETTINGS_UPDATE':
              if (data.data) {
                setSettings(data.data as Partial<StoreSettings>);
              } else {
                fetchSettings();
              }
              break;

            case 'SOCIALS_UPDATE':
              fetchSocials();
              break;

            case 'ORDER_UPDATE':
              // Emit custom event for order pages to handle
              if (typeof window !== 'undefined') {
                window.dispatchEvent(new CustomEvent('orderUpdate', { detail: data.data }));
              }
              break;
          }
        } catch {
          // Failed to parse event, ignore
        }
      };

      eventSourceRef.current.onerror = () => {
        // Silently close and attempt reconnect
        eventSourceRef.current?.close();
        eventSourceRef.current = null;

        // Attempt reconnect with exponential backoff
        if (reconnectAttemptsRef.current < maxReconnectAttempts) {
          const delay = baseReconnectDelay * Math.pow(2, reconnectAttemptsRef.current);
          
          reconnectTimeoutRef.current = setTimeout(() => {
            reconnectAttemptsRef.current++;
            connect();
          }, delay);
        }
        // If max reconnect attempts reached, silently stop trying
        // The app will still work, just without real-time updates
      };
    } catch {
      // Failed to create EventSource, app will work without real-time updates
    }
  };

  const disconnect = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
  }, []);

  const isConnected = useCallback(() => 
    eventSourceRef.current?.readyState === EventSource.OPEN, []);

  return {
    connect,
    disconnect,
    isConnected,
  };
}

// Custom hook for pages that need real-time sync
export function useRealtime() {
  const { connect, disconnect, isConnected } = useRealtimeSync();
  const { fetchSettings, fetchSocials } = useLiveSettings();
  const initializedRef = useRef(false);

  // Initialize on mount (client-side only) - using useEffect to ensure single init
  useEffect(() => {
    if (typeof window === 'undefined' || initializedRef.current) return;
    initializedRef.current = true;
    
    // Fetch initial data
    fetchSettings();
    fetchSocials();
    
    // Connect to SSE for real-time updates
    connect();
    
    return () => {
      disconnect();
      initializedRef.current = false;
    };
  }, []); // Empty deps - we only want this to run once on mount

  return {
    isConnected,
  };
}

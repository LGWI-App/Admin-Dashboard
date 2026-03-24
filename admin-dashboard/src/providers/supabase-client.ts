import { createClient } from "@refinedev/supabase";
import type { SupabaseClient } from "@supabase/supabase-js";
import {
  REMEMBER_ME_STORAGE_KEY,
  SUPABASE_KEY,
  SUPABASE_URL,
} from "./constants";

const getPreferredStorage = () => {
  if (typeof window === "undefined") {
    return null;
  }

  const rememberMe =
    window.localStorage.getItem(REMEMBER_ME_STORAGE_KEY) === "1";

  return rememberMe ? window.localStorage : window.sessionStorage;
};

const authStorage = {
  getItem: (key: string) => {
    if (typeof window === "undefined") {
      return null;
    }

    const preferredStorage = getPreferredStorage();
    const fallbackStorage =
      preferredStorage === window.localStorage
        ? window.sessionStorage
        : window.localStorage;

    return preferredStorage?.getItem(key) ?? fallbackStorage.getItem(key);
  },
  setItem: (key: string, value: string) => {
    const preferredStorage = getPreferredStorage();

    if (!preferredStorage || typeof window === "undefined") {
      return;
    }

    preferredStorage.setItem(key, value);

    if (preferredStorage === window.localStorage) {
      window.sessionStorage.removeItem(key);
      return;
    }

    window.localStorage.removeItem(key);
  },
  removeItem: (key: string) => {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.removeItem(key);
    window.sessionStorage.removeItem(key);
  },
};

export const supabaseClient: SupabaseClient = createClient(
  SUPABASE_URL,
  SUPABASE_KEY,
  {
    db: {
      schema: "public",
    },
    auth: {
      persistSession: true,
      storage: authStorage,
    },
  }
);

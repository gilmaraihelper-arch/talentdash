// Clerk global type declaration
declare global {
  interface Window {
    Clerk?: {
      signOut: () => Promise<void>;
    };
  }
}

export {};
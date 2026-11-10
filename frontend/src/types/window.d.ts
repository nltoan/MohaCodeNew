export {};

declare global {
  interface Window {
    /** Runtime config injected by public/runtime-config.js */
    env?: Record<string, string | undefined>;
    grecaptcha?: {
      ready: (callback: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
    };
  }
}

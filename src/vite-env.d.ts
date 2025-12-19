/// <reference types="vite/client" />

/**
 * Environment variable type definitions for Vite
 * 
 * All environment variables accessible in the browser must be prefixed with VITE_
 */
interface ImportMetaEnv {
  /**
   * Timefold API authentication token
   * Required for authenticating API requests to Timefold
   */
  readonly VITE_TIMEFOLD_API_TOKEN?: string;

  /**
   * Timefold API base URL
   * Default: https://api.timefold.ai
   */
  readonly VITE_TIMEFOLD_BASE_URL?: string;

  /**
   * Timefold Full Stack React (FSR) configuration
   * Used for Timefold FSR integration settings
   */
  readonly VITE_TIMEFOLD_FSR_CONFIG?: string;

  /**
   * Bryntum NPM Registry Authentication Token
   * Used for installing Bryntum packages (server-side only)
   */
  readonly BRYNTUM_NPM_TOKEN?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}


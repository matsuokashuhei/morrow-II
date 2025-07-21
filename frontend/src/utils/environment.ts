/**
 * Environment configuration utility
 */

/**
 * Interface for window object with Vite environment variables
 */
interface ViteWindow extends Window {
  __VITE_ENV__?: Record<string, string>;
  process?: {
    env?: Record<string, string>;
  };
}

/**
 * Interface for import.meta with environment variables
 */
interface ImportMetaWithEnv {
  env: Record<string, string>;
}

/**
 * Checks if we're running in a test environment
 */
const isTestEnvironment = (): boolean => {
  return (
    typeof process !== 'undefined' &&
    (process.env.NODE_ENV === 'test' || Boolean(process.env.JEST_WORKER_ID))
  );
};

/**
 * Checks if we're running in a browser environment
 */
const isBrowserEnvironment = (): boolean => {
  return typeof window !== 'undefined';
};

/**
 * Gets environment variable in test environment
 */
const getTestEnvVariable = (viteKey: string, fallback: string): string => {
  if (viteKey === 'VITE_GRAPHQL_ENDPOINT') {
    return process.env.GRAPHQL_ENDPOINT || fallback;
  }
  if (viteKey === 'VITE_API_BASE_URL') {
    return process.env.API_BASE_URL || fallback;
  }
  return fallback;
};

/**
 * Gets environment variable in browser environment
 */
const getBrowserEnvVariable = (viteKey: string, fallback: string): string => {
  try {
    // In browser environment, try to access environment variables from global scope
    // This is safer for Jest compatibility
    if (typeof window !== 'undefined' && (window as ViteWindow).__VITE_ENV__) {
      const env = (window as ViteWindow).__VITE_ENV__;
      if (env && env[viteKey]) {
        return env[viteKey];
      }
    }

    // Try another common pattern for Vite env access
    if (typeof window !== 'undefined' && (window as ViteWindow).process?.env) {
      const env = (window as ViteWindow).process?.env;
      if (env && env[viteKey]) {
        return env[viteKey];
      }
    }

    // Try to access import.meta.env safely with better Jest compatibility
    try {
      // Check if import.meta exists and is an object before accessing
      const globalObj = globalThis as any;
      const hasImportMeta =
        typeof globalObj.import !== 'undefined' && globalObj.import.meta;

      if (hasImportMeta) {
        const importMeta = globalObj.import.meta as ImportMetaWithEnv;
        if (importMeta.env && importMeta.env[viteKey]) {
          return importMeta.env[viteKey];
        }
      }
    } catch (error) {
      // Fallback if import.meta.env is not accessible
    }
  } catch (error) {
    // Fallback to the default value if env is not accessible
  }
  return fallback;
};

/**
 * Gets environment variable in Node.js environment
 */
const getNodeEnvVariable = (viteKey: string, fallback: string): string => {
  // For Node.js environments without process.env, fallback to default
  if (typeof process !== 'undefined' && process.env) {
    // Map Vite keys to Node.js environment variable names
    const nodeKey = viteKey.replace('VITE_', '');
    return process.env[nodeKey] || fallback;
  }
  return fallback;
};

/**
 * Main function to get environment variables across different environments
 */
const getEnvVariable = (viteKey: string, fallback: string): string => {
  if (isTestEnvironment()) {
    return getTestEnvVariable(viteKey, fallback);
  }

  if (isBrowserEnvironment()) {
    return getBrowserEnvVariable(viteKey, fallback);
  }

  // Fallback for Node.js or other environments
  return getNodeEnvVariable(viteKey, fallback);
};

export const getGraphQLEndpoint = (): string => {
  return getEnvVariable(
    'VITE_GRAPHQL_ENDPOINT',
    'http://localhost:8080/api/v1/graphql'
  );
};

export const getBaseApiUrl = (): string => {
  return getEnvVariable('VITE_API_BASE_URL', 'http://localhost:8080');
};

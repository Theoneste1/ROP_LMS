import { z } from 'zod';

/**
 * Safely read environment variables with optional default fallback
 * Works for both server and client-side in Next.js
 * 
 * Note: Client-side variables MUST be prefixed with NEXT_PUBLIC_
 * These are injected into process.env at build time by Next.js
 * 
 * @param key - The environment variable key
 * @param defaultValue - Optional default value if env var is not set
 * @returns The environment variable value or default value
 */
export function env(key: string, defaultValue?: string): string | undefined {
  // Access process.env directly - Next.js handles both server and client
  const value = process.env[key];
  
  if (value !== undefined && value !== '') {
    return value;
  }

  // Return default value if provided
  return defaultValue;
}

/**
 * Strictly read environment variables - throws error if not found
 * @param key - The environment variable key
 * @returns The environment variable value
 * @throws Error if environment variable is not found
 */
export function envRequired(key: string): string {
  const value = env(key);
  if (!value) {
    throw new Error(`Environment variable "${key}" is required but not defined`);
  }
  return value;
}

/**
 * Validate environment variables using Zod schema
 * This is the recommended approach for robust env var handling
 * 
 * @example
 * const envSchema = z.object({
 *   NEXT_PUBLIC_ORG_EMAIL: z.string().email(),
 *   NEXT_PUBLIC_ORG_SUPPORT_PHONE: z.string(),
 * });
 * 
 * const config = parseEnv(envSchema);
 */
export function parseEnv<T extends z.ZodType>(schema: T): z.infer<T> {
  try {
    return schema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.errors
        .map((e) => `${e.path.join('.')}: ${e.message}`)
        .join('\n');
      throw new Error(
        `Invalid or missing environment variables:\n${missingVars}`
      );
    }
    throw error;
  }
}
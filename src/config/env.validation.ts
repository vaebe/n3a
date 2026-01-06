import * as Joi from 'joi';

export const envValidationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),

  PORT: Joi.number().default(3000),
  OPENAI_API_KEY: Joi.string().required(),

  // LangSmith configuration
  LANGSMITH_TRACING: Joi.string().optional(),
  LANGSMITH_ENDPOINT: Joi.string().optional(),
  LANGSMITH_API_KEY: Joi.string().optional(),
  LANGSMITH_PROJECT: Joi.string().optional(),

  // Database configuration
  NEON_PG_DB: Joi.string().required(),

  // Rate limiting configuration
  THROTTLE_TTL: Joi.number().default(60000).min(1000),
  THROTTLE_LIMIT: Joi.number().default(20).min(1),
  THROTTLE_ENABLED: Joi.boolean().default(true),
});

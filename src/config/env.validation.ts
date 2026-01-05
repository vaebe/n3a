import * as Joi from 'joi';

export const envValidationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),

  PORT: Joi.number().default(3000),
  OPENAI_API_KEY: Joi.string().required(),

  // LangSmith configuration
  LANGSMITH_TRACING: Joi.string().required(),
  LANGSMITH_ENDPOINT: Joi.string().required(),
  LANGSMITH_API_KEY: Joi.string().required(),
  LANGSMITH_PROJECT: Joi.string().required(),

  // Database configuration
  NEON_PG_DB: Joi.string().optional(),
});

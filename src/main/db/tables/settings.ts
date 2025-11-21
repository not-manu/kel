import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { SupportedModels } from '../../api/ai/schema';

export const apiKeyTypeEnum = ['openrouter', 'anthropic'] as const;

export const settings = sqliteTable('settings', {
  id: integer('id').primaryKey().default(0),
  preferredName: text('preferred_name').notNull(),
  apiKey: text('api_key'),
  apiKeyType: text('api_key_type', { enum: apiKeyTypeEnum }),
  selectedModel: text('selected_model', { enum: SupportedModels }).notNull().default('anthropic/claude-haiku-4.5'),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

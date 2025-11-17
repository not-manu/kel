import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const apiKeyTypeEnum = ['Openrouter', 'Anthropic'] as const;

export const settings = sqliteTable('settings', {
  id: integer('id').primaryKey().default(0),
  preferredName: text('preferred_name').notNull(),
  apiKey: text('api_key'),
  apiKeyType: text('api_key_type', { enum: apiKeyTypeEnum }),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

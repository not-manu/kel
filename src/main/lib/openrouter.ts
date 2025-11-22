import { createOpenRouter as createOR } from "@openrouter/ai-sdk-provider";
import { eq } from "drizzle-orm";
import { db } from "../db";
import { settings } from "../db/schema";

export async function createOpenRouter() {
  const userSettings = await db.select().from(settings).where(eq(settings.id, 0));
  const apiKey = userSettings[0].apiKey;
  const selectedModel = userSettings[0].selectedModel;

  if (!apiKey) {
    throw new Error("OpenRouter API key is not set in user settings.");
  }

  const openrouter = createOR({
    apiKey: apiKey,
  });

  return {
    openrouter,
    selectedModel,
  }
}
import { connectDB } from "@/lib/mongodb";
import Story from "@/lib/models/Story";
import { defaultStory, type StoryContent } from "@/lib/story";
export async function getStory(strict = false): Promise<{ content: StoryContent; revision: number }> {
  try {
    await connectDB();
    const doc = await Story.findOne({ key: "home-story" });
    return { content: doc ? JSON.parse(JSON.stringify(doc.content)) : defaultStory, revision: doc?.revision ?? 0 };
  } catch (error) {
    if (strict) throw error;
    return { content: defaultStory, revision: 0 };
  }
}

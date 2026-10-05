import { getLocale } from "next-intl/server";
import { getStory } from "@/lib/storyServer";
import { storyLocales, type StoryLocale } from "@/lib/story";
import OurStoryContent from "./OurStoryContent";

export default async function OurStorySection() {
  const locale = await getLocale();
  const { content } = await getStory();
  return <OurStoryContent content={content} locale={storyLocales.includes(locale as StoryLocale) ? locale as StoryLocale : "th"} />;
}

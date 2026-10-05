import { validPortfolioImage } from "@/lib/portfolio";
export const storyLocales = ["th", "en", "ja", "ko", "zh"] as const;
export type StoryLocale = (typeof storyLocales)[number];
export interface StoryText { titleLine1: string; titleLine2: string; subtitle: string; heading: string; body: string; cta: string; }
export interface StoryContent { isVisible: boolean; buttonHref: string; texts: Record<StoryLocale, StoryText>; images: { id: string; src: string; width: number; alt: string }[]; }
export const defaultStory: StoryContent = {
  "isVisible": true,
  "buttonHref": "/about",
  "texts": {
    "th": {
      "titleLine1": "Who We Are",
      "titleLine2": "and Our Story.",
      "subtitle": "เราคือใคร และเรื่องราวของเรา",
      "heading": "ทีมครีเอทีฟของเรา",
      "body": "Wooyou Creative คือทีมนักออกแบบ นักพัฒนา และนักการตลาดที่หลอมรวมเทคโนโลยีเข้ากับความคิดสร้างสรรค์ เราเชื่อว่าเว็บไซต์และระบบที่ดีเริ่มต้นจากการเข้าใจธุรกิจของลูกค้าอย่างแท้จริง เราจึงทำงานเคียงข้างคุณทุกขั้นตอน ตั้งแต่ไอเดียแรกจนถึงวันที่ระบบเติบโตไปพร้อมธุรกิจของคุณ",
      "cta": "ดูข้อมูลบริษัท"
    },
    "en": {
      "titleLine1": "Who We Are",
      "titleLine2": "and Our Story.",
      "subtitle": "Who we are and the story behind us",
      "heading": "Our Creative Team",
      "body": "Wooyou Creative is a team of designers, developers and marketers who blend technology with creativity. We believe great websites and systems start with truly understanding our clients' business, so we work alongside you at every step, from the first idea to the day your system grows with your business.",
      "cta": "View company profile"
    },
    "ja": {
      "titleLine1": "Who We Are",
      "titleLine2": "and Our Story.",
      "subtitle": "私たちについて、そしてこれまでの歩み",
      "heading": "クリエイティブチーム",
      "body": "Wooyou Creativeは、テクノロジーとクリエイティビティを融合させるデザイナー、開発者、マーケターのチームです。優れたWebサイトやシステムは、お客様のビジネスを深く理解することから始まると考え、最初のアイデアから事業とともに成長するその日まで、すべての工程に寄り添います。",
      "cta": "会社概要を見る"
    },
    "ko": {
      "titleLine1": "Who We Are",
      "titleLine2": "and Our Story.",
      "subtitle": "우리는 누구이며, 어떤 이야기를 가지고 있나요",
      "heading": "크리에이티브 팀",
      "body": "Wooyou Creative는 기술과 창의성을 결합하는 디자이너, 개발자, 마케터로 이루어진 팀입니다. 훌륭한 웹사이트와 시스템은 고객의 비즈니스를 진정으로 이해하는 데서 시작된다고 믿기에, 첫 아이디어부터 시스템이 비즈니스와 함께 성장하는 날까지 모든 단계에서 함께합니다.",
      "cta": "회사 소개 보기"
    },
    "zh": {
      "titleLine1": "Who We Are",
      "titleLine2": "and Our Story.",
      "subtitle": "我们是谁,以及我们的故事",
      "heading": "创意团队",
      "body": "Wooyou Creative 是一支由设计师、开发者和营销人员组成的团队,将技术与创意融为一体。我们相信优秀的网站和系统始于真正理解客户的业务,因此从最初的想法到系统与您的业务共同成长的那一天,我们都与您并肩同行。",
      "cta": "查看公司简介"
    }
  },
  "images": [
    {
      "id": "story-1",
      "src": "/241661656_4259626814153062_8015945241488203133_n.jpg",
      "width": 360,
      "alt": ""
    },
    {
      "id": "story-2",
      "src": "/8535d2e4-9887-4399-8f2a-a6722475f023.png",
      "width": 260,
      "alt": ""
    },
    {
      "id": "story-3",
      "src": "/1280w-ESZ8yLQMnek.webp",
      "width": 420,
      "alt": ""
    },
    {
      "id": "story-4",
      "src": "/hr.png",
      "width": 300,
      "alt": ""
    },
    {
      "id": "story-5",
      "src": "/covercon.png",
      "width": 380,
      "alt": ""
    },
    {
      "id": "story-6",
      "src": "/coverser.png",
      "width": 280,
      "alt": ""
    },
    {
      "id": "story-7",
      "src": "/ecommerce.png",
      "width": 340,
      "alt": ""
    }
  ]
};

export function validStory(value: unknown): value is StoryContent {
  if (!value || typeof value !== "object") return false;
  const data = value as StoryContent;
  if (typeof data.isVisible !== "boolean" || typeof data.buttonHref !== "string" || !/^\/(?!\/)/.test(data.buttonHref) || /[\\\s]/.test(data.buttonHref) || data.buttonHref.length > 500) return false;
  if (!Array.isArray(data.images) || data.images.length > 20 || !data.texts) return false;
  const ids = new Set<string>();
  for (const image of data.images) {
    if (!image || typeof image.id !== "string" || !/^[a-zA-Z0-9_-]{1,80}$/.test(image.id) || ids.has(image.id) || typeof image.src !== "string" || !validPortfolioImage(image.src) || !Number.isInteger(image.width) || image.width < 180 || image.width > 600 || typeof image.alt !== "string" || image.alt.length > 300) return false;
    ids.add(image.id);
  }
  return storyLocales.every((locale) => {
    const text = data.texts[locale];
    return text && ["titleLine1", "titleLine2", "subtitle", "heading", "body", "cta"].every((key) => typeof text[key as keyof StoryText] === "string" && text[key as keyof StoryText].trim().length > 0 && text[key as keyof StoryText].length <= (key === "body" ? 10000 : 300));
  });
}

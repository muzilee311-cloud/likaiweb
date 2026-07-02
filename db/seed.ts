import { getDb } from "../api/queries/connection";
import { projects, experiences, skills, projectGallery } from "./schema";

async function seed() {
  const db = getDb();

  // Seed Projects
  const projectData = [
    {
      slug: "chuanliu-brand", title: "CHUANLIU BRAND", subtitle: "川流品牌视觉",
      category: "BRAND DESIGN / VI SYSTEM", year: "2024",
      image: "https://images.unsplash.com/photo-1634942537034-2531766767d1?w=1200&h=675&fit=crop&q=80",
      thumb: "https://images.unsplash.com/photo-1634942537034-2531766767d1?w=300&h=300&fit=crop&q=80",
      description: "为成都科技初创企业打造的完整品牌识别系统",
      client: "川流科技", services: "品牌策略, 视觉识别, Logo设计", team: "Li Kai (设计总监)",
      noteEn: "CHUANLIU is a Chengdu-based tech startup focused on water resource technology. The brand name means \"flowing river,\" symbolizing continuous innovation. We created a complete visual identity system from strategy to implementation.",
      noteCn: "川流是一家专注于水资源科技的成都初创企业。品牌名称取自\"川流不息\"，象征着科技的持续创新。我们从策略到执行打造了完整的视觉识别系统。",
      sortOrder: 0,
    },
    {
      slug: "jinli-tourism", title: "JINLI TOURISM", subtitle: "锦里古镇文旅",
      category: "BRAND DESIGN / DIGITAL MARKETING", year: "2024",
      image: "https://images.unsplash.com/photo-1582739501019-5c4aa6e949d9?w=1200&h=675&fit=crop&q=80",
      thumb: "https://images.unsplash.com/photo-1582739501019-5c4aa6e949d9?w=300&h=300&fit=crop&q=80",
      description: "融合传统与现代视觉语言的文旅推广方案",
      client: "锦里文旅集团", services: "品牌设计, 数字营销, 视觉系统", team: "Li Kai (设计总监), 张薇 (插画)",
      noteEn: "Jinli Ancient Street is one of Chengdu's most iconic cultural landmarks. We designed a tourism promotion visual system that blends traditional architecture with modern graphic design.",
      noteCn: "锦里古镇是成都最具代表性的文化旅游地标之一。我们设计了一套融合传统建筑与现代平面设计的文旅推广视觉系统。",
      sortOrder: 1,
    },
    {
      slug: "mooncake-packaging", title: "MOONCAKE PACKAGE", subtitle: "月饼包装设计",
      category: "PACKAGE DESIGN / ILLUSTRATION", year: "2023",
      image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&h=675&fit=crop&q=80",
      thumb: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=300&h=300&fit=crop&q=80",
      description: "高端月饼礼盒包装，传统花窗图案的现代表达",
      client: "私人委托", services: "包装设计, 插画, 品牌策略", team: "Li Kai (设计总监)",
      noteEn: "Premium mooncake gift box packaging inspired by traditional Chinese window lattice patterns. Each box is a collectible art piece with a ceremonial unboxing experience.",
      noteCn: "高端月饼礼盒包装设计，灵感来源于中国传统花窗（窗棂）图案。每个包装盒都是一件收藏级艺术品，开箱过程充满仪式感。",
      sortOrder: 2,
    },
    {
      slug: "universiade-visual", title: "UNIVERSIADE VISUAL", subtitle: "大运会视觉设计",
      category: "EVENT VISUAL / 3D DESIGN", year: "2023",
      image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1200&h=675&fit=crop&q=80",
      thumb: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=300&h=300&fit=crop&q=80",
      description: "国际体育赛事的品牌视觉与动态图形设计",
      client: "成都大运会组委会", services: "活动视觉, 3D设计, 动态图形", team: "Li Kai (视觉总监), 陈明 (3D)",
      noteEn: "The Chengdu World University Games required a visual system representing urban vitality and international image. We combined panda, bamboo, and sunbird motifs with modern sports aesthetics.",
      noteCn: "2023年成都世界大学生夏季运动会是成都举办的最大规模国际体育赛事。我们将熊猫、竹子、太阳神鸟元素与现代运动美学相结合。",
      sortOrder: 3,
    },
    {
      slug: "shucha-brand", title: "SHUCHA BRAND", subtitle: "蜀茶品牌全案",
      category: "BRAND STRATEGY / PACKAGE", year: "2022",
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85c82c?w=1200&h=675&fit=crop&q=80",
      thumb: "https://images.unsplash.com/photo-1558618666-fcd25c85c82c?w=300&h=300&fit=crop&q=80",
      description: "从品牌命名到视觉系统的全案设计",
      client: "蜀茶文化", services: "品牌策略, 包装设计, 插画", team: "Li Kai (设计总监), 王芳 (插画)",
      noteEn: "Full brand design for SHUCHA, a high-end Sichuan tea brand. From naming to visual system, we rooted the design in Sichuan culture with hand-drawn illustration as the main visual language.",
      noteCn: "蜀茶是一个定位于高端市场的四川本土茶叶品牌。从品牌命名到视觉系统，我们以蜀文化为根基，以手绘插画为主要视觉语言。",
      sortOrder: 4,
    },
    {
      slug: "nexus-tech", title: "NEXUS TECH BRAND", subtitle: "NEXUS科技品牌",
      category: "BRAND DESIGN / UI/UX", year: "2022",
      image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&h=675&fit=crop&q=80",
      thumb: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=300&h=300&fit=crop&q=80",
      description: "AI科技公司的品牌识别与产品界面设计",
      client: "NEXUS AI", services: "品牌设计, UI/UX, 设计系统", team: "Li Kai (设计总监)",
      noteEn: "Brand identity for NEXUS AI, an artificial intelligence startup. The logo features a geometric wireframe globe symbolizing AI's vision of connecting the world.",
      noteCn: "NEXUS是一家人工智能初创公司的品牌设计项目。标识以一个几何化的线框地球为核心图形，象征着AI连接世界的愿景。",
      sortOrder: 5,
    },
    {
      slug: "bamboo-culture", title: "BAMBOO CULTURE", subtitle: "竹文化节视觉",
      category: "EVENT VISUAL / ILLUSTRATION", year: "2021",
      image: "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=1200&h=675&fit=crop&q=80",
      thumb: "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=300&h=300&fit=crop&q=80",
      description: "文化节视觉设计与插画创作",
      client: "成都竹文化节", services: "活动视觉, 插画设计", team: "Li Kai (设计总监)",
      noteEn: "Visual design for the Chengdu Bamboo Culture Festival, celebrating the deep connection between Sichuan culture and bamboo artistry.",
      noteCn: "成都竹文化节视觉设计，庆祝四川文化与竹艺之间的深厚联系。",
      sortOrder: 6,
    },
    {
      slug: "silk-road", title: "SILK ROAD FESTIVAL", subtitle: "丝绸之路文化节",
      category: "BRAND DESIGN / DIGITAL", year: "2021",
      image: "https://images.unsplash.com/photo-1547891654-e66ed7ebb968?w=1200&h=675&fit=crop&q=80",
      thumb: "https://images.unsplash.com/photo-1547891654-e66ed7ebb968?w=300&h=300&fit=crop&q=80",
      description: "文化节品牌设计与数字营销推广",
      client: "丝绸之路文化节", services: "品牌设计, 数字营销", team: "Li Kai (设计总监)",
      noteEn: "Brand identity for the Silk Road Cultural Festival, bridging Eastern and Western cultural elements in a contemporary visual language.",
      noteCn: "丝绸之路文化节品牌设计，用当代视觉语言桥接东西方文化元素。",
      sortOrder: 7,
    },
  ];

  for (const p of projectData) {
    await db.insert(projects).values(p).onDuplicateKeyUpdate({ set: p });
  }
  console.log("✓ Projects seeded");

  // Seed Experiences
  const expData = [
    { year: "2023 — PRESENT", company: "独立设计师 / FREELANCE", role: "品牌设计总监", description: "为多家初创企业与成熟品牌提供全方位的视觉识别系统设计，涵盖品牌策略、Logo设计、VI系统、数字体验设计等领域。专注于将东方美学与现代设计语言融合，打造具有文化深度的品牌体验。", sortOrder: 0 },
    { year: "2021 — 2023", company: "字节跳动 / BYTEDANCE", role: "高级品牌设计师", description: "负责抖音电商业务线的品牌视觉体系构建，主导多个大型营销活动的视觉创意方向，管理跨部门设计协作。建立了完整的设计规范系统，提升了品牌在商业场景中的一致性表达。", sortOrder: 1 },
    { year: "2019 — 2021", company: "美团 / MEITUAN", role: "品牌设计师", description: "参与美团主站及旗下业务的视觉升级项目，负责品牌规范制定、营销物料设计、活动主视觉创作。在多个大型促销活动中担任视觉负责人，积累了丰富的商业设计经验。", sortOrder: 2 },
    { year: "2018 — 2019", company: "阳狮集团 / PUBLICIS GROUPE", role: "初级设计师", description: "服务于国际品牌客户的创意执行，参与广告战役的视觉设计，积累了扎实的设计基础与项目管理经验。在这里建立了对品牌设计全流程的深刻理解。", sortOrder: 3 },
  ];

  for (const e of expData) {
    await db.insert(experiences).values(e).onDuplicateKeyUpdate({ set: e });
  }
  console.log("✓ Experiences seeded");

  // Seed Skills
  const skillData = [
    "品牌策略", "视觉识别系统", "Logo设计", "包装设计",
    "UI/UX设计", "动态图形", "3D建模", "字体设计",
    "插画设计", "广告创意", "数字营销", "设计系统",
  ].map((name, i) => ({ name, sortOrder: i }));

  for (const s of skillData) {
    await db.insert(skills).values(s).onDuplicateKeyUpdate({ set: s });
  }
  console.log("✓ Skills seeded");

  console.log("\n✅ Seed complete!");
}

seed().catch(console.error);

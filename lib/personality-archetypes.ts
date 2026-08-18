// 人格 IP 原型数据库：5 元素 × 5 十神家族 = 25 个原型。
import type { FiveElement } from "@/types/domain";

export type Family = "peer" | "output" | "wealth" | "authority" | "resource";

export interface ElementMeta {
  chinese: string; metaphor: string;
  icon: "leaf" | "flame" | "mountain" | "sword" | "wave";
  palette: readonly string[]; accent: string;
}

export interface FamilyMeta { chinese: string; metaphor: string; }

export interface Archetype {
  nickname: string; tagline: string; description: string;
  keywords: readonly string[]; fields: readonly string[];
  expressionsMale: readonly string[]; expressionsFemale: readonly string[];
}

export const ELEMENT_META: Record<FiveElement, ElementMeta> = {
  wood:  { chinese:"木", metaphor:"春生之木（生发·柔韧·成长）", icon:"leaf",     accent:"oklch(0.55 0.13 145)", palette:["oklch(0.50 0.13 145)","oklch(0.65 0.12 140)","oklch(0.90 0.06 145)","oklch(0.97 0.02 90)","oklch(0.22 0.02 60)"] },
  fire:  { chinese:"火", metaphor:"太阳之火（外放·光明·能量）", icon:"flame",    accent:"oklch(0.56 0.185 30)", palette:["#E6452E","#FF7A5C","#FFD9C9","#F7F3EE","#1A1A1A"] },
  earth: { chinese:"土", metaphor:"厚德之土（承载·守信·滋养）", icon:"mountain", accent:"oklch(0.72 0.10 75)",  palette:["oklch(0.60 0.09 75)","oklch(0.75 0.10 80)","oklch(0.92 0.06 78)","oklch(0.97 0.02 90)","oklch(0.25 0.02 60)"] },
  metal: { chinese:"金", metaphor:"百炼之金（锋锐·果断·肃敛）", icon:"sword",    accent:"oklch(0.74 0.07 85)", palette:["oklch(0.62 0.05 85)","oklch(0.78 0.05 88)","oklch(0.92 0.03 90)","oklch(0.97 0.01 90)","oklch(0.22 0.02 60)"] },
  water: { chinese:"水", metaphor:"渊深之水（流动·智慧·包容）", icon:"wave",     accent:"oklch(0.55 0.12 230)", palette:["oklch(0.50 0.13 232)","oklch(0.66 0.10 230)","oklch(0.90 0.04 230)","oklch(0.97 0.02 90)","oklch(0.22 0.02 60)"] },
};

export const FAMILY_META: Record<Family, FamilyMeta> = {
  peer:     { chinese:"比劫", metaphor:"同行之力（共进·竞争·独立）" },
  output:   { chinese:"食伤", metaphor:"灵感之焰（表达·创意·流动）" },
  wealth:   { chinese:"财星", metaphor:"资源之感（务实·聚散·变现）" },
  authority:{ chinese:"官杀", metaphor:"秩序之力（责任·规则·护持）" },
  resource: { chinese:"印星", metaphor:"涵养之力（学习·吸收·传承）" },
};

export const OUTPUT_METAPHOR: Record<FiveElement, string> = {
  wood:"生发之枝（创意·自由·鲜活）", fire:"灵感之焰（表达·创意·流动）",
  earth:"厚实之壤（踏实·耐看·落地）", metal:"精工之刃（精致·极致·巧思）",
  water:"灵思之泉（诗意·流动·感悟）",
};

export type ArchetypeKey = `${FiveElement}_${Family}`;const A: Partial<Record<ArchetypeKey, Archetype>> = {
  fire_peer: { nickname:"烈日同袍", tagline:"并肩闪耀", description:"天生的舞台中心，与强者同行互相成就。率直好胜，光明磊落——你们不是同路人，是同一种光。", keywords:["率直","好胜","感染","领跑"], fields:["团队领导","创业","竞技","公众表达"], expressionsMale:["来战","跟上","看我的","一起上"], expressionsFemale:["走吧","我撑你","别怂","一起亮"] },
  fire_output: { nickname:"高能显眼包", tagline:"表达点火", description:"天生的表达者与创意点火者，热情外放，灵感不断。走到哪里，哪里就亮起来。", keywords:["显眼","会来事","热场","点子多"], fields:["内容创作","演艺娱乐","营销公关","教育培训"], expressionsMale:["灵感来了","我有个想法","看我表演","拿捏了"], expressionsFemale:["灵机一动","这很有梗","气氛到位","我来收尾"] },
  fire_wealth: { nickname:"聚光猎手", tagline:"聚光成金", description:"用热情吸引资源，把机会变成价值。慷慨且行动力强——你的聚光灯会照亮别人的钱包。", keywords:["慷慨","行动","聚人","变现"], fields:["销售","资源整合","品牌运营","活动策划"], expressionsMale:["拿下","这事我来","稳赚","一起干"], expressionsFemale:["搞定","我请客","跟我走","包在我身上"] },
  fire_authority: { nickname:"明焰掌局", tagline:"光明领导", description:"以光明正大的方式建立秩序，用热情凝聚团队。你在场，秩序就在。", keywords:["担当","正直","号召","护众"], fields:["管理","公共事务","应急响应","团队建设"], expressionsMale:["交给我","稳住","跟我冲","有我在"], expressionsFemale:["别慌","有我呢","一起扛","我来安排"] },
  fire_resource: { nickname:"温火哲思", tagline:"内敛热忱", description:"内敛的热忱与思考型表达，把复杂感受变成温暖输出。你的火在心里，不在台前。", keywords:["深思","共情","积蓄","点燃"], fields:["心理咨询","文化研究","写作","品牌叙事"], expressionsMale:["我懂","让我想想","给你讲","我陪你"], expressionsFemale:["嗯嗯","我陪你","慢慢说","有我在"] },
  wood_peer: { nickname:"独立原木", tagline:"自我生长", description:"自我驱动，独立生长，不喜依附。坚韧而有生命力——你的根在你自己身上。", keywords:["自立","坚韧","开拓","本真"], fields:["独立创业","户外","设计","艺术创作"], expressionsMale:["我自己来","我开路","走自己的","没问题"], expressionsFemale:["我行的","跟我走","别担心","我来探"] },
  wood_output: { nickname:"灵感生发", tagline:"创意萌芽", description:"创意如新芽不断冒头，自由表达，把想法变成可见的作品。你是春天本身。", keywords:["新意","生发","自由","鲜活"], fields:["内容创作","写作","设计","品牌策划"], expressionsMale:["有新想法","冒芽了","让我画","我来做"], expressionsFemale:["灵光一闪","我有个点子","让我写","试试看"] },
  wood_wealth: { nickname:"机会捕手", tagline:"把握生长", description:"灵活善变，能在变化中捕捉资源与机会。社交力强——你嗅得到别人闻不到的风。", keywords:["灵活","社交","机遇","拓展"], fields:["商务拓展","投资","渠道","关系运营"], expressionsMale:["有门路","我去谈","这事能成","跟我来"], expressionsFemale:["我认识人","这路子通","跟我聊聊","我牵线"] },
  wood_authority: { nickname:"守正出新", tagline:"规则生根", description:"在既有规则中找到突破点，正义感与革新力并存。你守底线，但底线也在长。", keywords:["正义","秩序","革新","护持"], fields:["合规","法务","政策研究","公益"], expressionsMale:["我来把关","守底线","有新解","我来调"], expressionsFemale:["我盯着","有分寸","我来调","别越界"] },
  wood_resource: { nickname:"深根学者", tagline:"长期扎根", description:"长期主义的学习者，吸收知识如同扎根，越久越有底蕴。你的深度是时间给的。", keywords:["吸收","成长","底蕴","传承"], fields:["学术研究","教育","文化出版","顾问咨询"], expressionsMale:["让我学学","慢慢来","我研究下","记下来了"], expressionsFemale:["我在看","让我学","慢慢吸收","我记一下"] },
  earth_peer: { nickname:"稳重大地", tagline:"承载包容", description:"厚重可靠，能承载他人与项目。包容而有耐心——你站的地方，大家都安心。", keywords:["厚实","可靠","包纳","同在"], fields:["运营管理","行政","社群","后勤"], expressionsMale:["有我在","稳的","别急","我盯着"], expressionsFemale:["嗯嗯","我在呢","慢慢来","交给我"] },
  earth_output: { nickname:"厚土表达", tagline:"踏实输出", description:"踏实耐看的输出风格，不浮夸但可信。让人愿意长期看——你经得起回看。", keywords:["实在","耐看","可信","落地"], fields:["手作","实体产品","农业","传统工艺"], expressionsMale:["我做出来","耐看","实在的","慢慢品"], expressionsFemale:["我做给你看","实在","慢慢来","真实"] },
  earth_wealth: { nickname:"聚宝厚德", tagline:"稳健积累", description:"以德聚财，稳健积累。长期主义者——财富与人脉都靠信用，信用靠时间。", keywords:["节俭","守信","积累","厚报"], fields:["金融","资产管理","房地产","长期投资"], expressionsMale:["稳赚","我来管","放心","长期看"], expressionsFemale:["稳的","我记着","慢慢攒","放心"] },
};const B: Partial<Record<ArchetypeKey, Archetype>> = {
  earth_authority: { nickname:"中流砥柱", tagline:"秩序担当", description:"中正担当，秩序的维护者。关键时刻是团队的定海神针——稳，本身就是一种力量。", keywords:["责任","中正","秩序","稳定"], fields:["公共管理","法务合规","组织发展","风控"], expressionsMale:["我来扛","稳的","按规矩","别慌"], expressionsFemale:["有我呢","按规矩来","我盯着","别急"] },
  earth_resource: { nickname:"大地学者", tagline:"体系传承", description:"体系化思考，重视传承与稳健的知识积累。你的学习像地层沉积，越久越厚。", keywords:["沉淀","系统","稳健","传承"], fields:["学术","研究","教育","文化遗产"], expressionsMale:["慢慢研究","我记下","体系化","慢慢讲"], expressionsFemale:["我在读","慢慢看","我记录","沉淀中"] },
  metal_peer: { nickname:"锋芒同列", tagline:"锐气同行", description:"锐利而独立，与同侪间既有锋芒也有清高的距离感。你不屑同流，但值得同列。", keywords:["锋锐","独立","竞争","清高"], fields:["独立咨询","竞技体育","评审","高端制造"], expressionsMale:["出招","精进","看我","锋芒"], expressionsFemale:["我不让","精进","锋芒","看我"] },
  metal_output: { nickname:"精工巧匠", tagline:"精雕细琢", description:"精致极致的表达，追求工艺与审美。输出密度高——每一个字都是打磨过的。", keywords:["精致","极致","审美","巧思"], fields:["设计","工艺","珠宝","高端内容"], expressionsMale:["讲究","再磨磨","精工","这细节"], expressionsFemale:["精致","我再调","这手感","慢慢来"] },
  metal_wealth: { nickname:"利刃理财", tagline:"决断增值", description:"决断高效，对增值与回报有精准判断。你的判断是刀，快准狠。", keywords:["决断","高效","精准","果敢"], fields:["金融","投资","交易","资产管理"], expressionsMale:["准","入手","稳赚","我定"], expressionsFemale:["我定","准","这值","包赚"] },
  metal_authority: { nickname:"执剑掌印", tagline:"威严秩序", description:"威严正义，规则的执行者。护序的冷峻力量——你不动，秩序就在。", keywords:["威严","正义","决断","护序"], fields:["司法","监察","军事","合规"], expressionsMale:["执行","按规矩","拿下","别想跑"], expressionsFemale:["执行","按规矩","拿下","别想"] },
  metal_resource: { nickname:"冷锋学思", tagline:"理性思辨", description:"冷静理性的思辨者，逻辑严密，批判性思考。你的清醒是一把未出鞘的刀。", keywords:["冷静","逻辑","思辨","深刻"], fields:["学术","科研","数据分析","哲学"], expressionsMale:["逻辑","再想想","数据","批判"], expressionsFemale:["让我想","逻辑","数据","深刻"] },
  water_peer: { nickname:"暗流同舟", tagline:"顺势共存", description:"包容柔韧的共存者，能在群体中顺势而为又保持深度。你不争，但你在。", keywords:["包容","柔韧","顺势","深沉"], fields:["社群运营","关系协调","心理学","外交"], expressionsMale:["一起","我陪你","顺势","别怕"], expressionsFemale:["一起走","我在","顺势","陪你"] },
  water_output: { nickname:"灵思涌动", tagline:"诗意流动", description:"灵思如泉，诗意流动。表达带有感悟与玄思——你的输出有水的形态。", keywords:["灵思","流动","诗意","感悟"], fields:["文学","艺术","影视","音乐"], expressionsMale:["有感觉","涌了","写下来","唱"], expressionsFemale:["有灵感","涌了","我画","唱给你"] },
  water_wealth: { nickname:"顺势而为", tagline:"灵活变通", description:"顺势聚散，灵活变通。资源来去自如——你不强留，也不强求。", keywords:["顺势","灵活","变通","聚散"], fields:["贸易","中介","咨询","跨境"], expressionsMale:["顺势","变了","通了","走起"], expressionsFemale:["顺势","通了","变变","走起"] },
  water_authority: { nickname:"深渊谋局", tagline:"深谋远虑", description:"深谋远虑，隐忍布局。适合需要耐心的策略性位置——你看得很远，所以走得稳。", keywords:["深远","谋略","隐忍","布局"], fields:["战略","投资","研究","策划"], expressionsMale:["布局","等等","深算","看我"], expressionsFemale:["等等","布局","深算","看我"] },
  water_resource: { nickname:"渊博智者", tagline:"深厚学识", description:"深厚学识与直觉并重的智者。底蕴深厚——你读过的书，最终长成了你的骨相。", keywords:["渊博","直觉","玄思","底蕴"], fields:["学术","国学","心理学","顾问"], expressionsMale:["让我想","直觉","底蕴","深"], expressionsFemale:["让我想","直觉","底蕴","深"] },
};

export const ARCHETYPES: Record<ArchetypeKey, Archetype> = { ...A, ...B } as Record<ArchetypeKey, Archetype>;
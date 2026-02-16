export type Delta = { cash?: number; progress?: number; stress?: number; rep?: number };

export type Choice = {
  label: string;
  delta: Required<Delta>;
};

export type EventCard = {
  id: string;
  text: string;
  choices: [Choice, Choice, Choice];
};

const d = (cash = 0, progress = 0, stress = 0, rep = 0) => ({ cash, progress, stress, rep });

// 60-card MVP set.
// Design notes:
// - Keep deltas moderate so most runs last ~10-18 turns.
// - Each card has a "safe-ish" middle option, but never free.
// - Stress is the main killer; cash is the second.
export const EVENTS: EventCard[] = [
  // Fundraising / optics
  {
    id: "inv-angel-001",
    text: "天使投資人問：你們這個月的成長數字呢？",
    choices: [
      { label: "誠實說還在找 PMF", delta: d(0, 0, +8, -6) },
      { label: "把指標包裝一下", delta: d(0, +2, +5, +4) },
      { label: "改口談願景與路線圖", delta: d(0, +1, +3, +1) },
    ],
  },
  {
    id: "inv-terms-001",
    text: "投資人給條款：估值高，但要超多控制權。",
    choices: [
      { label: "簽（先活下來）", delta: d(+25, 0, +8, -4) },
      { label: "談判（拉長戰線）", delta: d(+5, 0, +5, +2) },
      { label: "拒絕（守住自主）", delta: d(0, +2, +4, +1) },
    ],
  },
  {
    id: "inv-demo-001",
    text: "投資人臨時說：現在就 demo 給我看。",
    choices: [
      { label: "硬上（賭一把）", delta: d(0, +2, +9, +3) },
      { label: "先講 roadmap 再 demo", delta: d(0, +1, +5, +1) },
      { label: "改約（怕翻車）", delta: d(0, 0, +3, -2) },
    ],
  },
  {
    id: "press-001",
    text: "媒體想採訪你們的故事。",
    choices: [
      { label: "接，搶曝光", delta: d(0, 0, +6, +10) },
      { label: "不接，先把產品做出來", delta: d(0, +2, -2, -2) },
      { label: "丟給同事講（你補資料）", delta: d(-1, +1, +2, +5) },
    ],
  },
  {
    id: "press-backlash-001",
    text: "你在採訪裡講太滿，網友開始酸。",
    choices: [
      { label: "發澄清文（認真）", delta: d(0, 0, +6, +2) },
      { label: "裝沒事（冷處理）", delta: d(0, +1, +4, -3) },
      { label: "改口：這是 beta", delta: d(0, +1, +5, +1) },
    ],
  },

  // Team / people
  {
    id: "team-salary-001",
    text: "核心工程師說：不加薪我就走。",
    choices: [
      { label: "加薪留下", delta: d(-12, 0, -5, +2) },
      { label: "畫大餅：下一輪一定調", delta: d(0, 0, +8, -3) },
      { label: "給更多期權", delta: d(-2, 0, +2, +3) },
    ],
  },
  {
    id: "team-hire-001",
    text: "候選人很強，但要你現在就給 offer。",
    choices: [
      { label: "給（搶人）", delta: d(-10, +2, +4, +2) },
      { label: "再面兩輪（保守）", delta: d(0, +1, +5, 0) },
      { label: "先收下顧問合作", delta: d(-3, +1, +2, +1) },
    ],
  },
  {
    id: "team-burnout-001",
    text: "團隊開始倦怠：連續兩週都在救火。",
    choices: [
      { label: "放一天假（降壓）", delta: d(0, -2, -10, +2) },
      { label: "再撐一下（衝刺）", delta: d(0, +2, +10, -2) },
      { label: "砍 scope（止血）", delta: d(0, -1, -4, 0) },
    ],
  },
  {
    id: "cofounder-001",
    text: "共同創辦人跟你吵：方向不對！",
    choices: [
      { label: "開會對齊，慢但穩", delta: d(0, +1, +6, 0) },
      { label: "你拍板：照我說的做", delta: d(0, +2, +4, -1) },
      { label: "先放著，之後再說", delta: d(0, -2, -2, -2) },
    ],
  },
  {
    id: "poach-001",
    text: "獵頭來挖你家工程師。",
    choices: [
      { label: "加薪留住", delta: d(-10, 0, -3, +1) },
      { label: "給更大的 ownership", delta: d(-2, 0, +2, +3) },
      { label: "放他走，立刻補人", delta: d(-6, -6, +6, -2) },
    ],
  },
  {
    id: "team-conflict-001",
    text: "設計跟工程吵起來：到底要不要改大 UI？",
    choices: [
      { label: "改（更漂亮）", delta: d(0, -3, +7, +2) },
      { label: "不改（先上線）", delta: d(0, +2, +3, -1) },
      { label: "做折衷（小改）", delta: d(0, 0, +4, +1) },
    ],
  },

  // Sales / customers
  {
    id: "sales-custom-001",
    text: "大客戶：要客製，不然不簽。",
    choices: [
      { label: "接！先把錢拿到", delta: d(+18, -6, +8, +2) },
      { label: "拒絕：專注產品方向", delta: d(0, +3, -2, -4) },
      { label: "只做一半：可重用的部分", delta: d(+10, -2, +4, +1) },
    ],
  },
  {
    id: "sales-renew-001",
    text: "客戶續約：要降價，不然考慮走人。",
    choices: [
      { label: "降價留住", delta: d(-6, 0, +3, +1) },
      { label: "堅持價值（不降）", delta: d(0, +1, +4, -3) },
      { label: "加值不加價（送功能）", delta: d(0, -2, +5, +2) },
    ],
  },
  {
    id: "sales-refund-001",
    text: "客戶說：不滿意，要退費。",
    choices: [
      { label: "退（止血口碑）", delta: d(-8, 0, +2, +3) },
      { label: "不退（硬扛）", delta: d(0, 0, +6, -6) },
      { label: "部分退 + 協助導入", delta: d(-4, -1, +3, +2) },
    ],
  },
  {
    id: "sales-quote-001",
    text: "你可以今天內給出報價嗎？（客戶在等）",
    choices: [
      { label: "今天給（加班）", delta: d(0, +1, +7, +2) },
      { label: "明天給（正常）", delta: d(0, 0, +3, 0) },
      { label: "先給範圍（抓大概）", delta: d(0, 0, +4, +1) },
    ],
  },
  {
    id: "support-spike-001",
    text: "客服爆量：同一個問題一直出現。",
    choices: [
      { label: "寫 FAQ（治本）", delta: d(0, -1, +5, +3) },
      { label: "先一封封回（治標）", delta: d(0, 0, +8, -1) },
      { label: "先關掉功能（止血）", delta: d(0, -2, +3, -2) },
    ],
  },

  // Product / engineering
  {
    id: "bug-001",
    text: "客戶抱怨：Bug 讓他們不能用。",
    choices: [
      { label: "優先修", delta: d(0, -3, +5, +4) },
      { label: "下版再修", delta: d(0, +1, +2, -6) },
      { label: "給折扣安撫", delta: d(-4, 0, +1, +3) },
    ],
  },
  {
    id: "tech-debt-001",
    text: "技術債越堆越高：每次改都會炸。",
    choices: [
      { label: "還債（慢但穩）", delta: d(0, -2, +4, +2) },
      { label: "繼續衝功能", delta: d(0, +3, +8, -1) },
      { label: "小修小補", delta: d(0, 0, +5, 0) },
    ],
  },
  {
    id: "feature-scope-001",
    text: "你想到一個超棒的新功能，但會延期。",
    choices: [
      { label: "做（賭爆款）", delta: d(0, +3, +8, +2) },
      { label: "不做（守住節奏）", delta: d(0, +1, -1, 0) },
      { label: "做最小版（MVP）", delta: d(0, +2, +4, +1) },
    ],
  },
  {
    id: "infra-cost-001",
    text: "雲端帳單暴增：今天又多了一筆費用。",
    choices: [
      { label: "升級方案（更穩）", delta: d(-10, 0, +2, +1) },
      { label: "優化成本（花時間）", delta: d(+4, -1, +5, +1) },
      { label: "先不管（等下月）", delta: d(0, 0, +3, -1) },
    ],
  },
  {
    id: "security-incident-001",
    text: "資安警報：疑似有人在掃你們 API。",
    choices: [
      { label: "立刻上防護（加班）", delta: d(0, -2, +9, +3) },
      { label: "先觀察（省事）", delta: d(0, 0, +4, -5) },
      { label: "請外部顧問", delta: d(-8, 0, +3, +2) },
    ],
  },

  // Marketing / growth
  {
    id: "marketing-ads-001",
    text: "行銷：要不要投廣告衝量？",
    choices: [
      { label: "投！先把聲量做起來", delta: d(-10, 0, +2, +6) },
      { label: "不投，省錢", delta: d(0, +1, -1, -1) },
      { label: "小額 A/B 測試", delta: d(-4, 0, +1, +3) },
    ],
  },
  {
    id: "marketing-partner-001",
    text: "有人提合作：上他們的 newsletter。",
    choices: [
      { label: "付費上（快）", delta: d(-6, 0, +2, +6) },
      { label: "不付（慢慢來）", delta: d(0, 0, +1, +2) },
      { label: "互惠（交換曝光）", delta: d(0, -1, +3, +4) },
    ],
  },
  {
    id: "marketing-brand-001",
    text: "你要不要把品牌整個換掉？（名字/Logo/網站）",
    choices: [
      { label: "換（重塑）", delta: d(-3, -3, +7, +5) },
      { label: "不換（先賣）", delta: d(0, +1, +2, -1) },
      { label: "只換 landing page", delta: d(-1, -1, +4, +3) },
    ],
  },

  // Personal / founder
  {
    id: "sleep-001",
    text: "你今天睡眠不足，腦袋開始當機。",
    choices: [
      { label: "硬撐，繼續開會", delta: d(0, +2, +10, 0) },
      { label: "睡 30 分鐘再上", delta: d(0, -2, -8, 0) },
      { label: "咖啡續命", delta: d(-1, +1, +4, 0) },
    ],
  },
  {
    id: "founder-focus-001",
    text: "你一天被訊息打斷 200 次，根本做不了事。",
    choices: [
      { label: "關通知 2 小時", delta: d(0, +3, -2, -1) },
      { label: "一邊回一邊做", delta: d(0, +1, +6, 0) },
      { label: "請助理幫你擋", delta: d(-3, +2, +2, +1) },
    ],
  },
  {
    id: "founder-talk-001",
    text: "今晚有社群聚會：去不去？",
    choices: [
      { label: "去（拓人脈）", delta: d(-2, 0, +5, +8) },
      { label: "不去（寫程式）", delta: d(0, +3, +2, -2) },
      { label: "去一下就走", delta: d(-1, +1, +3, +4) },
    ],
  },

  // Competitors / market
  {
    id: "competitor-price-001",
    text: "競品突然降價 50%。",
    choices: [
      { label: "跟降", delta: d(-8, 0, +3, +2) },
      { label: "強調品質與服務", delta: d(0, 0, +2, +5) },
      { label: "加一個免費功能", delta: d(0, -3, +5, +4) },
    ],
  },
  {
    id: "competitor-copy-001",
    text: "競品抄你們功能，還發文說是他們先做的。",
    choices: [
      { label: "公開反擊（吵）", delta: d(0, 0, +8, +2) },
      { label: "不理他（繼續做）", delta: d(0, +2, +3, -2) },
      { label: "發產品更新（用成果說話）", delta: d(0, +1, +5, +4) },
    ],
  },
  {
    id: "market-shift-001",
    text: "市場風向變了：大家突然在討論另一個新趨勢。",
    choices: [
      { label: "跟上（轉向）", delta: d(0, +2, +7, +2) },
      { label: "不跟（守原路線）", delta: d(0, +2, +3, -1) },
      { label: "做小實驗（保留彈性）", delta: d(-2, +1, +4, +1) },
    ],
  },

  // Operations / finance
  {
    id: "runway-001",
    text: "你算了一下 runway：只剩 2 個月。",
    choices: [
      { label: "大砍成本（裁員/縮編）", delta: d(+12, -3, +9, -4) },
      { label: "拼成交（業務衝刺）", delta: d(+6, +1, +7, +1) },
      { label: "立刻募資（焦慮）", delta: d(+3, -1, +8, +2) },
    ],
  },
  {
    id: "legal-001",
    text: "法務提醒：合約條款可能會讓你們吃虧。",
    choices: [
      { label: "請律師（花錢）", delta: d(-6, 0, +3, +2) },
      { label: "自己改（有風險）", delta: d(0, 0, +6, -1) },
      { label: "先簽（趕快成交）", delta: d(+10, 0, +5, -3) },
    ],
  },

  // Infra / incidents
  {
    id: "infra-down-001",
    text: "凌晨：伺服器爆了，客戶在罵。",
    choices: [
      { label: "立刻修，救火優先", delta: d(0, -2, +7, +2) },
      { label: "先發公告拖時間", delta: d(0, 0, +3, -2) },
      { label: "叫醒全員一起上", delta: d(0, -4, +10, +4) },
    ],
  },
  {
    id: "outage-postmortem-001",
    text: "事故後檢討：要不要寫 postmortem 公開？",
    choices: [
      { label: "公開（加信任）", delta: d(0, 0, +5, +6) },
      { label: "不公開（省麻煩）", delta: d(0, +1, +2, -2) },
      { label: "只跟客戶分享", delta: d(0, 0, +3, +3) },
    ],
  },

  // Misc fun / variety
  {
    id: "viral-001",
    text: "突然有人在社群上自發幫你們做了一支介紹影片。",
    choices: [
      { label: "轉發加碼（感謝）", delta: d(-1, 0, +2, +8) },
      { label: "私訊合作（更深入）", delta: d(0, 0, +4, +6) },
      { label: "先觀察（怕翻車）", delta: d(0, +1, +2, 0) },
    ],
  },

  // --------------- More cards to reach 60 (shorter texts, similar balance) ---------------
  {
    id: "pricing-001",
    text: "你要不要調整定價？",
    choices: [
      { label: "漲價", delta: d(+8, 0, +6, -2) },
      { label: "不動", delta: d(0, +1, +2, 0) },
      { label: "分級（更細）", delta: d(+3, -1, +4, +2) },
    ],
  },
  {
    id: "free-tier-001",
    text: "要不要做免費版？",
    choices: [
      { label: "做（拉新）", delta: d(-3, -1, +5, +6) },
      { label: "不做（專注付費）", delta: d(0, +2, +2, -1) },
      { label: "限量（邀請制）", delta: d(0, 0, +3, +3) },
    ],
  },
  {
    id: "enterprise-001",
    text: "企業客戶說：要 SSO、稽核、合規才買。",
    choices: [
      { label: "接（大單）", delta: d(+12, -4, +9, +3) },
      { label: "不接（太重）", delta: d(0, +2, +3, -1) },
      { label: "先做 roadmap 承諾", delta: d(+4, -1, +5, +1) },
    ],
  },
  {
    id: "oncall-001",
    text: "你要不要排 on-call？",
    choices: [
      { label: "排（更穩）", delta: d(0, -1, +4, +3) },
      { label: "不排（省事）", delta: d(0, +1, +6, -1) },
      { label: "只排週末", delta: d(0, 0, +5, +1) },
    ],
  },
  {
    id: "analytics-001",
    text: "要不要補上埋點/分析？",
    choices: [
      { label: "補（看得更清楚）", delta: d(0, -1, +4, +2) },
      { label: "先不補（先做功能）", delta: d(0, +2, +4, -1) },
      { label: "只補關鍵漏斗", delta: d(0, 0, +3, +1) },
    ],
  },
  {
    id: "design-refresh-001",
    text: "使用者說：產品看起來不專業。",
    choices: [
      { label: "大改 UI", delta: d(-3, -3, +7, +4) },
      { label: "先修文案與 onboarding", delta: d(0, +1, +3, +2) },
      { label: "忽略（先賣）", delta: d(0, +1, +2, -2) },
    ],
  },
  {
    id: "refactor-001",
    text: "要不要大重構？",
    choices: [
      { label: "重構（乾淨）", delta: d(0, -4, +7, +2) },
      { label: "不重構（快）", delta: d(0, +3, +6, -1) },
      { label: "重構一部分", delta: d(0, -2, +5, +1) },
    ],
  },
  {
    id: "sales-lead-001",
    text: "有個 lead 來了，但需求很怪。",
    choices: [
      { label: "接（先談）", delta: d(+5, -1, +5, +1) },
      { label: "不接（怕走偏）", delta: d(0, +1, +2, 0) },
      { label: "請他等下一版", delta: d(0, 0, +3, -1) },
    ],
  },
  {
    id: "churn-001",
    text: "一位重要客戶流失了。",
    choices: [
      { label: "打電話挽回", delta: d(0, 0, +6, +2) },
      { label: "寫檢討改善", delta: d(0, +2, +4, +1) },
      { label: "算了（專注新客）", delta: d(0, +1, +3, -2) },
    ],
  },
  {
    id: "community-001",
    text: "要不要做社群經營？",
    choices: [
      { label: "做（慢但穩）", delta: d(0, -1, +4, +6) },
      { label: "不做（太慢）", delta: d(0, +2, +3, -1) },
      { label: "找 KOL 合作", delta: d(-4, 0, +4, +5) },
    ],
  },
  {
    id: "docs-001",
    text: "你們的文件很爛，客戶看不懂。",
    choices: [
      { label: "寫文件（可複用）", delta: d(0, -1, +5, +4) },
      { label: "先別寫（先做功能）", delta: d(0, +2, +4, -1) },
      { label: "錄短影片教學", delta: d(-1, 0, +4, +3) },
    ],
  },
  {
    id: "demo-day-001",
    text: "明天 demo day，你要不要上台？",
    choices: [
      { label: "上（曝光）", delta: d(0, 0, +8, +10) },
      { label: "不上（省心）", delta: d(0, +1, +2, -2) },
      { label: "錄影片（可控）", delta: d(-1, 0, +5, +6) },
    ],
  },
  {
    id: "mentor-001",
    text: "一位前輩願意當你 mentor。",
    choices: [
      { label: "每週固定請教", delta: d(0, +2, +2, +4) },
      { label: "有事再問", delta: d(0, +1, +1, +2) },
      { label: "不了（怕被管）", delta: d(0, 0, +2, -1) },
    ],
  },
  {
    id: "feature-request-001",
    text: "一堆使用者都在喊同一個功能。",
    choices: [
      { label: "立刻做", delta: d(0, +3, +7, +2) },
      { label: "先訪談 5 人", delta: d(0, +1, +4, +1) },
      { label: "先修穩定性", delta: d(0, 0, +3, +2) },
    ],
  },
  {
    id: "platform-change-001",
    text: "你依賴的平台 API 改版，行為怪怪的。",
    choices: [
      { label: "立刻修相容性", delta: d(0, -2, +8, +2) },
      { label: "先 workaround", delta: d(0, -1, +5, 0) },
      { label: "先不管（賭）", delta: d(0, +1, +4, -3) },
    ],
  },
  {
    id: "support-hire-001",
    text: "你要不要請一個客服？",
    choices: [
      { label: "請（降壓）", delta: d(-8, 0, -6, +2) },
      { label: "不請（省錢）", delta: d(0, +1, +5, 0) },
      { label: "外包（折衷）", delta: d(-3, 0, -3, +1) },
    ],
  },
  {
    id: "office-001",
    text: "要不要租辦公室？",
    choices: [
      { label: "租（更像公司）", delta: d(-10, 0, +3, +5) },
      { label: "不租（遠端）", delta: d(+3, +1, +1, -1) },
      { label: "共享空間（便宜）", delta: d(-4, 0, +2, +2) },
    ],
  },
  {
    id: "founder-health-001",
    text: "你身體開始出狀況：胃痛。",
    choices: [
      { label: "看醫生（停一下）", delta: d(-2, -2, -10, 0) },
      { label: "忍（繼續）", delta: d(0, +1, +8, -1) },
      { label: "運動 20 分鐘", delta: d(0, -1, -6, +1) },
    ],
  },
  {
    id: "integration-001",
    text: "客戶要你們跟他們系統整合。",
    choices: [
      { label: "做（可收錢）", delta: d(+10, -3, +8, +2) },
      { label: "不做（太痛）", delta: d(0, +2, +3, -2) },
      { label: "做 API 先（通用）", delta: d(0, -2, +6, +2) },
    ],
  },
  {
    id: "refund-wave-001",
    text: "突然來了一波退訂潮。",
    choices: [
      { label: "火速修問題", delta: d(0, -2, +9, +3) },
      { label: "做留存優惠", delta: d(-5, 0, +5, +2) },
      { label: "只顧新客（硬）", delta: d(0, +1, +6, -3) },
    ],
  },
  {
    id: "intro-001",
    text: "天使說：我可以介紹你們下一輪。",
    choices: [
      { label: "立刻準備 deck + 數字", delta: d(0, -2, +5, +5) },
      { label: "先把產品做穩（再去募）", delta: d(0, +4, +2, +1) },
      { label: "兩邊都要（你會累死）", delta: d(0, +2, +7, +3) },
    ],
  },
];

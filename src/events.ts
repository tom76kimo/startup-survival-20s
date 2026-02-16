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

// MVP starter set. Keep deltas moderate so a run lasts ~8-15 turns.
export const EVENTS: EventCard[] = [
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
    id: "team-salary-001",
    text: "核心工程師說：不加薪我就走。",
    choices: [
      { label: "加薪留下", delta: d(-12, 0, -5, +2) },
      { label: "畫大餅：下一輪一定調", delta: d(0, 0, +8, -3) },
      { label: "給更多期權", delta: d(-2, 0, +2, +3) },
    ],
  },
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
    id: "competitor-price-001",
    text: "競品突然降價 50%。",
    choices: [
      { label: "跟降", delta: d(-8, 0, +3, +2) },
      { label: "強調品質與服務", delta: d(0, 0, +2, +5) },
      { label: "加一個免費功能", delta: d(0, -3, +5, +4) },
    ],
  },
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
    id: "press-001",
    text: "媒體想採訪你們的故事。",
    choices: [
      { label: "接，搶曝光", delta: d(0, 0, +6, +10) },
      { label: "不接，先把產品做出來", delta: d(0, +2, -2, -2) },
      { label: "丟給同事講（你補資料）", delta: d(-1, +1, +2, +5) },
    ],
  },
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
    id: "marketing-ads-001",
    text: "行銷：要不要投廣告衝量？",
    choices: [
      { label: "投！先把聲量做起來", delta: d(-10, 0, +2, +6) },
      { label: "不投，省錢", delta: d(0, +1, -1, -1) },
      { label: "小額 A/B 測試", delta: d(-4, 0, +1, +3) },
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
    id: "bug-001",
    text: "客戶抱怨：Bug 讓他們不能用。",
    choices: [
      { label: "優先修", delta: d(0, -3, +5, +4) },
      { label: "下版再修", delta: d(0, +1, +2, -6) },
      { label: "給折扣安撫", delta: d(-4, 0, +1, +3) },
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
    id: "intro-001",
    text: "天使說：我可以介紹你們下一輪。",
    choices: [
      { label: "立刻準備 deck + 數字", delta: d(0, -2, +5, +5) },
      { label: "先把產品做穩（再去募）", delta: d(0, +4, +2, +1) },
      { label: "兩邊都要（你會累死）", delta: d(0, +2, +7, +3) },
    ],
  },
];

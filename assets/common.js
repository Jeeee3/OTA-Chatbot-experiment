
function qs(key, def=null){
  const u = new URL(window.location.href);
  return u.searchParams.get(key) ?? def;
}
function nowISO(){ return new Date().toISOString(); }

function makeLogger(condition){
  const pid = qs('pid','P000');
  const lang = qs('lang','en');
  const returnUrl = qs('return_url','');
  const log = [];
  function push(evt, data={}){
    log.push({t: nowISO(), pid, condition, evt, ...data});
  }
  function downloadJson(){
    const blob = new Blob([JSON.stringify({pid, condition, lang, log}, null, 2)], {type:'application/json'});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `log_${pid}_${condition}.json`;
    a.click();
  }
  function finish(extra={}){
    push('finish', extra);
    const payload = btoa(unescape(encodeURIComponent(JSON.stringify({pid, condition, lang, log, extra}))));
    if(returnUrl){
      const u = new URL(returnUrl);
      u.searchParams.set('pid', pid);
      u.searchParams.set('condition', condition);
      u.searchParams.set('lang', lang);
      u.searchParams.set('payload', payload);
      window.location.href = u.toString();
    }else{
      alert('No return_url provided. Your log will be downloaded.');
      downloadJson();
    }
  }
  return {pid, lang, returnUrl, log, push, finish, downloadJson};
}

const I18N = {
  en: {
    brand: "H-Stay",
    subtitle: "Mock hotel booking (research)",
    taskTitle: "Task",
    taskText: "Choose ONE hotel for a 2-night stay in City H. This is a simulated booking. Think aloud throughout.",
    controlsTitle: "Your control",
    controlText: "You are always in control. You can ignore suggestions, change preferences, or browse freely at any time.",
    filtersTitle: "Filters",
    sustainable: "Sustainable stays",
    sustainableHint: "Properties with sustainability practices or certifications",
    priceRange: "Price range (per night)",
    ratingMin: "Minimum rating",
    metroMax: "Max walk to metro (min)",
    reset: "Reset",
    compare: "Compare",
    view: "View details",
    select: "Select",
    selected: "Selected",
    confirmSelect: "Confirm selection",
    continue: "Continue to survey",
    details: "Hotel details",
    sustainability: "Sustainability",
    sustainabilityText: "This property reports participation in sustainability practices. Details may be provided by the property.",
    close: "Close",
    language: "Language",
    en: "English",
    zh: "中文",
    chatTitle: "Chat assistant",
    shortlistTitle: "AI shortlist",
    addToCompare: "Add to compare",
    removeFromCompare: "Remove",
    aiPicked: "AI picked",
    send: "Send",
    placeholder: "Type your message…",
    c1_open_1: "Hi! I can help you compare hotels and think through what matters most for this trip. I won’t book anything for you — you stay in control the whole time.",
    c1_q: "When choosing a hotel, people often lean toward different priorities. Which option feels closest to you for this trip?\nA. Good value & convenience; sustainability is a bonus\nB. Comfortable, but avoid options that feel clearly unsustainable\nC. Sustainability matters, willing to trade off on price/location",
    c1_ack: "Got it. I’ll keep that in mind while you explore the options. You can still compare on your own or ask me anytime.",
    c2_open_1: "Hi! I can help you find and compare hotels based on price, location, ratings, and amenities. What would you like to focus on?",
    note: "Note: This is a research mockup. No real booking is made."
  },
  zh: {
    brand: "H·住",
    subtitle: "模拟酒店预订（研究）",
    taskTitle: "任务",
    taskText: "请在H市2晚行程中选择1家酒店。模拟预订不产生真实费用。请全程进行口述思考（think aloud）。",
    controlsTitle: "你的控制权",
    controlText: "你始终拥有最终决定权。你可以忽略建议、随时改变偏好，或自由浏览所有选项。",
    filtersTitle: "筛选",
    sustainable: "可持续住宿",
    sustainableHint: "提供可持续措施或认证的酒店",
    priceRange: "价格范围（每晚）",
    ratingMin: "最低评分",
    metroMax: "到地铁最大步行（分钟）",
    reset: "重置",
    compare: "对比",
    view: "查看详情",
    select: "选择",
    selected: "已选择",
    confirmSelect: "确认选择",
    continue: "继续进入问卷",
    details: "酒店详情",
    sustainability: "可持续性",
    sustainabilityText: "该酒店表示其参与了可持续实践。相关信息可能由酒店自行提供。",
    close: "关闭",
    language: "语言",
    en: "English",
    zh: "中文",
    chatTitle: "聊天助手",
    shortlistTitle: "AI推荐清单",
    addToCompare: "加入对比",
    removeFromCompare: "移除",
    aiPicked: "AI推荐",
    send: "发送",
    placeholder: "输入消息…",
    c1_open_1: "你好！我可以帮助你对比酒店，并一起理清这次旅行中你最看重的因素。我不会替你做决定，整个过程都由你掌控。",
    c1_q: "在选择酒店时，不同的人会有不同的侧重点。就这次旅行而言，以下哪一项更接近你的想法？\nA. 我主要看重性价比和便利性，环保是加分项\nB. 我希望住得舒适，但不想选择明显不环保的选项\nC. 环保对我很重要，我愿意在价格或位置上做一些取舍",
    c1_ack: "明白了。我会在你浏览选项时考虑这一点。你也可以随时自行对比，或向我提问。",
    c2_open_1: "你好！我可以根据价格、位置、评分和设施帮你查找和对比酒店。你目前最关注哪方面？",
    note: "提示：这是研究用的模拟页面，不会产生真实订单。"
  }
};

function t(lang, key){ return (I18N[lang] && I18N[lang][key]) || I18N.en[key] || key; }

async function loadHotels(){
  const res = await fetch('./assets/hotels.json');
  return await res.json();
}

function fmtPrice(n){ return `¥${n}`; }

function hotelTitle(h, lang){
  return lang==='zh' ? h.name_zh : h.name_en;
}
function district(h, lang){
  return lang==='zh' ? h.district_zh : h.district_en;
}
function highlights(h, lang){
  return lang==='zh' ? h.highlights_zh : h.highlights_en;
}
function cancelText(h, lang){
  return lang==='zh' ? h.cancel_zh : h.cancel_en;
}
function sustLabel(h, lang){
  return lang==='zh' ? h.sust_label_zh : h.sust_label_en;
}
function sustBlurb(h, lang){
  return lang==='zh' ? h.sust_blurb_zh : h.sust_blurb_en;
}

// ==UserScript==
// @name 2026世界杯赛程(Egern满血显示版)
// @version 13.0
// @description 扩充百余个国家队汉化与国旗字典库，彻底解决偏门球队未识别问题。保留所有排版与完美圆角设计。
// ==/UserScript==

// ---------------------------
// 全局样式微调参数
// ---------------------------
// 倒圆角大小（推荐 10~15 之间，过大会变回直角）
const CARD_CORNER_RADIUS = 12; 

// ---------------------------
// 终极汉化与国旗字典库 (覆盖六大洲百余支国家队)
// ---------------------------
const teamNamesCN = {
  // 北美洲及加勒比海
  "United States": "🇺🇸 美国", "USA": "🇺🇸 美国", "Canada": "🇨🇦 加拿大", "Mexico": "🇲🇽 墨西哥",
  "Costa Rica": "🇨🇷 哥斯达黎加", "Panama": "🇵🇦 巴拿马", "Jamaica": "🇯🇲 牙买加", "Honduras": "🇭🇳 洪都拉斯",
  "El Salvador": "🇸🇻 萨尔瓦多", "Haiti": "🇭🇹 海地", "Curaçao": "🇨🇼 库拉索", "Trinidad and Tobago": "🇹🇹 特立尼达和多巴哥",
  "Guatemala": "🇬🇹 危地马拉", "Cuba": "🇨🇺 古巴",
  // 南美洲
  "Brazil": "🇧🇷 巴西", "Argentina": "🇦🇷 阿根廷", "Uruguay": "🇺🇾 乌拉圭", "Colombia": "🇨🇴 哥伦比亚",
  "Peru": "🇵🇪 秘鲁", "Chile": "🇨🇱 智利", "Ecuador": "🇪🇨 厄瓜多尔", "Paraguay": "🇵🇾 巴拉圭",
  "Venezuela": "🇻🇪 委内瑞拉", "Bolivia": "🇧🇴 玻利维亚",
  // 欧洲
  "France": "🇫🇷 法国", "Germany": "🇩🇪 德国", "Spain": "🇪🇸 西班牙", "England": "🏴󠁧󠁢󠁥󠁮󠁧󠁿 英格兰",
  "Portugal": "🇵🇹 葡萄牙", "Netherlands": "🇳🇱 荷兰", "Italy": "🇮🇹 意大利", "Croatia": "🇭🇷 克罗地亚",
  "Belgium": "🇧🇪 比利时", "Denmark": "🇩🇰 丹麦", "Switzerland": "🇨🇭 瑞士", "Sweden": "🇸🇪 瑞典",
  "Wales": "🏴󠁧󠁢󠁷󠁬󠁳󠁿 威尔士", "Poland": "🇵🇱 波兰", "Serbia": "🇷🇸 塞尔维亚", "Scotland": "🏴󠁧󠁢󠁳󠁣󠁴󠁿 苏格兰",
  "Ukraine": "🇺🇦 乌克兰", "Czechia": "🇨🇿 捷克", "Czech Republic": "🇨🇿 捷克", "Austria": "🇦🇹 奥地利",
  "Hungary": "🇭🇺 匈牙利", "Türkiye": "🇹🇷 土耳其", "Turkey": "🇹🇷 土耳其", "Norway": "🇳🇴 挪威",
  "Finland": "🇫🇮 芬兰", "Romania": "🇷🇴 罗马尼亚", "Slovakia": "🇸🇰 斯洛伐克", "Greece": "🇬🇷 希腊",
  "Ireland": "🇮🇪 爱尔兰", "Republic of Ireland": "🇮🇪 爱尔兰", "Northern Ireland": "🇬🇧 北爱尔兰",
  "Bosnia-Herzegovina": "🇧🇦 波黑", "Bosnia and Herzegovina": "🇧🇦 波黑", "Iceland": "🇮🇸 冰岛",
  "Albania": "🇦🇱 阿尔巴尼亚", "Georgia": "🇬🇪 格鲁吉亚", "Slovenia": "🇸🇮 斯洛文尼亚",
  "Bulgaria": "🇧🇬 保加利亚", "North Macedonia": "🇲🇰 北马其顿", "Montenegro": "🇲🇪 黑山",
  // 非洲
  "Senegal": "🇸🇳 塞内加尔", "Morocco": "🇲🇦 摩洛哥", "Cameroon": "🇨🇲 喀麦隆", "Ghana": "🇬🇭 加纳",
  "Tunisia": "🇹🇳 突尼斯", "Egypt": "🇪🇬 埃及", "Algeria": "🇩🇿 阿尔及利亚", "Nigeria": "🇳🇬 尼日利亚",
  "Mali": "🇲🇱 马里", "Ivory Coast": "🇨🇮 科特迪瓦", "Côte d'Ivoire": "🇨🇮 科特迪瓦",
  "South Africa": "🇿🇦 南非", "Burkina Faso": "🇧🇫 布基纳法索", "Congo DR": "🇨🇩 刚果(金)",
  "DR Congo": "🇨🇩 刚果(金)", "Guinea": "🇬🇳 几内亚", "Cabo Verde": "🇨🇻 佛得角", "Cape Verde": "🇨🇻 佛得角",
  "Equatorial Guinea": "🇬🇶 赤道几内亚", "Zambia": "🇿🇲 赞比亚", "Angola": "🇦🇴 安哥拉",
  // 亚洲
  "Japan": "🇯🇵 日本", "South Korea": "🇰🇷 韩国", "Korea Republic": "🇰🇷 韩国", "Iran": "🇮🇷 伊朗",
  "Saudi Arabia": "🇸🇦 沙特", "Australia": "🇦🇺 澳大利亚", "Qatar": "🇶🇦 卡塔尔", "United Arab Emirates": "🇦🇪 阿联酋",
  "UAE": "🇦🇪 阿联酋", "Iraq": "🇮🇶 伊拉克", "Oman": "🇴🇲 阿曼", "China PR": "🇨🇳 中国", "China": "🇨🇳 中国",
  "Syria": "🇸🇾 叙利亚", "Uzbekistan": "🇺🇿 乌兹别克斯坦", "Jordan": "🇯🇴 约旦", "Bahrain": "🇧🇭 巴林",
  "Palestine": "🇵🇸 巴勒斯坦", "Indonesia": "🇮🇩 印尼", "Vietnam": "🇻🇳 越南", "Thailand": "🇹🇭 泰国",
  "North Korea": "🇰🇵 朝鲜", "Korea DPR": "🇰🇵 朝鲜", "Lebanon": "🇱🇧 黎巴嫩", "Kuwait": "🇰🇼 科威特",
  // 大洋洲
  "New Zealand": "🇳🇿 新西兰", "Fiji": "🇫🇯 斐济", "Solomon Islands": "🇸🇧 所罗门群岛"
};

function translateTeam(englishName) {
  if (!englishName) return "🏳️ 未知";
  let name = englishName.replace(/ national (football|soccer) team/i, "").trim();
  name = name.replace(/ men's/i, "").trim();
  return teamNamesCN[name] || `🏳️ ${name}`; 
}

// ---------------------------
// 严格网格对齐参数 (固定宽度分配)
// ---------------------------
const COL_WIDTH_TIME = 45;   
const COL_WIDTH_TEAM = 95;   
const COL_WIDTH_SCORE = 75;  

// ---------------------------
// Egern 小组件主入口
// ---------------------------
export default async function(ctx) {
  const now = new Date();
  const nowTs = now.getTime(); 

  const fetchStart = new Date(nowTs - 24 * 60 * 60 * 1000);
  const fetchEnd = new Date(nowTs + 3 * 24 * 60 * 60 * 1000);
  const getApiDateStr = (date) => {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}${mm}${dd}`;
  };

  const getBjDateStr = (ts) => {
    const bjDate = new Date(ts + 8 * 60 * 60 * 1000); 
    const yyyy = bjDate.getUTCFullYear();
    const mm = String(bjDate.getUTCMonth() + 1).padStart(2, '0');
    const dd = String(bjDate.getUTCDate()).padStart(2, '0');
    return `${yyyy}${mm}${dd}`;
  };

  const todayStr = getBjDateStr(nowTs);
  const tomorrowStr = getBjDateStr(nowTs + 24 * 60 * 60 * 1000);
  const dayAfterStr = getBjDateStr(nowTs + 48 * 60 * 60 * 1000);

  const weekdays = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
  const weekLabels = {
    "今日": weekdays[new Date(nowTs + 8 * 60 * 60 * 1000).getUTCDay()],
    "明日": weekdays[new Date(nowTs + 8 * 60 * 60 * 1000 + 24 * 60 * 60 * 1000).getUTCDay()],
    "后日": weekdays[new Date(nowTs + 8 * 60 * 60 * 1000 + 48 * 60 * 60 * 1000).getUTCDay()]
  };

  const url = `https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/scoreboard?dates=${getApiDateStr(fetchStart)}-${getApiDateStr(fetchEnd)}`;
  let matches = [];
  let fetchSuccess = false;
  
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const res = await ctx.http.get(url);
      const data = await res.json();
      if (data && data.events) {
        matches = data.events;
        fetchSuccess = true;
        break; 
      }
    } catch (e) {
      // 自动重试
    }
  }

  let widgetChildren = [];
  
  if (!fetchSuccess) {
    widgetChildren.push({ type: "spacer" });
    widgetChildren.push({ type: "text", text: "⚠️ 数据拉取失败，请检查网络。", textColor: "#FF3B30", font: { size: 14 } });
    widgetChildren.push({ type: "spacer" });
    return { type: "widget", backgroundColor: "#161618", padding: 12, children: widgetChildren };
  }

  const groupedMatches = { "今日": [], "明日": [], "后日": [] };
  matches.forEach(match => {
    const matchTimestamp = new Date(match.date).getTime(); 
    const bjMatchTime = new Date(matchTimestamp + 8 * 60 * 60 * 1000);
    const matchDateStr = getBjDateStr(matchTimestamp); 
    
    const homeCompetitor = match.competitions[0].competitors.find(c => c.homeAway === 'home');
    const awayCompetitor = match.competitions[0].competitors.find(c => c.homeAway === 'away');
    
    const info = {
      time: `${String(bjMatchTime.getUTCHours()).padStart(2,'0')}:${String(bjMatchTime.getUTCMinutes()).padStart(2,'0')}`,
      home: homeCompetitor,
      away: awayCompetitor,
      status: match.status.type.state
    };

    if (matchDateStr === todayStr) {
      groupedMatches["今日"].push(info);
    } else if (matchDateStr === tomorrowStr) {
      groupedMatches["明日"].push(info);
    } else if (matchDateStr === dayAfterStr) {
      groupedMatches["后日"].push(info);
    }
  });

  const dayNames = ["今日", "明日", "后日"];
  const MAX_MATCHES_TO_SHOW = 11; 
  let totalRenderedMatches = 0;

  for (let dIndex = 0; dIndex < dayNames.length; dIndex++) {
    const day = dayNames[dIndex];
    const dayMatches = groupedMatches[day];
    
    if (dayMatches.length === 0 && day !== "今日") continue;

    let cardChildren = [];

    // --- 卡片标题行 ---
    let headerRowChildren = [];
    headerRowChildren.push({
      type: "text",
      text: `${day} ${weekLabels[day]}`,
      font: { size: 14, weight: "bold" },
      textColor: day === "今日" ? "#30D158" : "#5AC8FA"
    });
    
    headerRowChildren.push({ type: "spacer" }); 
    
    if (day === "今日") {
      const timeString = `更新于 ${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
      headerRowChildren.push({ type: "text", text: timeString, font: { size: 10 }, textColor: "#888888" });
    }

    cardChildren.push({ type: "stack", direction: "row", alignItems: "center", children: headerRowChildren });
    cardChildren.push({ type: "spacer", length: 6 });

    // --- 赛事列表渲染 ---
    if (dayMatches.length === 0 && day === "今日") {
      cardChildren.push({ type: "text", text: "当天暂无赛事", font: { size: 13 }, textColor: "#888888" });
    }

    for (let i = 0; i < dayMatches.length; i++) {
      if (totalRenderedMatches >= MAX_MATCHES_TO_SHOW) break; 
      
      const m = dayMatches[i];
      let homeName = translateTeam(m.home.team.name || m.home.team.shortDisplayName);
      let awayName = translateTeam(m.away.team.name || m.away.team.shortDisplayName);
      
      let scoreStr = " VS ";
      let scoreColor = "#FFD60A"; 
      let isBold = false;
      
      if (m.status === "post") {
        scoreStr = `${m.home.score} - ${m.away.score} (完)`;
        scoreColor = "#FFFFFF"; 
      } else if (m.status === "in") {
        scoreStr = `${m.home.score} - ${m.away.score}`;
        scoreColor = "#FF453A"; 
        isBold = true;
      }

      cardChildren.push({
        type: "stack",
        direction: "row",
        alignItems: "center",
        children: [
          {
            type: "stack", direction: "row", width: COL_WIDTH_TIME,
            children: [ { type: "text", text: m.time, font: { size: 13 }, textColor: "#A1A1A6" }, { type: "spacer" } ]
          },
          { type: "spacer" },
          {
            type: "stack", direction: "row", width: COL_WIDTH_TEAM,
            children: [ { type: "spacer" }, { type: "text", text: homeName, font: { size: 13 }, textColor: "#FFFFFF" } ]
          },
          {
            type: "stack", direction: "row", width: COL_WIDTH_SCORE,
            children: [
              { type: "spacer" },
              { type: "text", text: scoreStr, font: isBold ? { size: 12, weight: "bold" } : { size: 12 }, textColor: scoreColor },
              { type: "spacer" }
            ]
          },
          {
            type: "stack", direction: "row", width: COL_WIDTH_TEAM,
            children: [ { type: "text", text: awayName, font: { size: 13 }, textColor: "#FFFFFF" }, { type: "spacer" } ]
          },
          { type: "spacer" }
        ]
      });

      cardChildren.push({ type: "spacer", length: 4 }); 
      totalRenderedMatches++;
    }
    
    if (totalRenderedMatches >= MAX_MATCHES_TO_SHOW && dayMatches.length > 0) {
      cardChildren.push({ type: "text", text: "...", font: { size: 12 }, textColor: "#888888" });
    }

    widgetChildren.push({
      type: "stack",
      direction: "column",
      padding: 0,
      children: [
        {
          type: "stack",
          direction: "column",
          backgroundColor: day === "今日" ? "#1A2520" : "#252528",
          cornerRadius: CARD_CORNER_RADIUS,
          borderRadius: CARD_CORNER_RADIUS,
          clip: true,
          clipToBounds: true,
          masksToBounds: true,
          padding: 8,
          children: cardChildren
        }
      ]
    });

    if (dIndex < dayNames.length - 1) {
      widgetChildren.push({ type: "spacer", length: 6 }); 
    }
  }

  widgetChildren.push({ type: "spacer" }); 

  return { type: "widget", backgroundColor: "#161618", padding: 10, children: widgetChildren };
}

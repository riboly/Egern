// ==UserScript==
// @name 2026世界杯赛程(Egern强制圆角版)
// @version 9.0
// @description 卡片间距缩小一倍，强制注入所有底层圆角/裁剪属性触发圆角渲染。
// ==/UserScript==

// ---------------------------
// 全局样式微调参数
// ---------------------------
// 倒圆角大小（推荐 10~15 之间，过大会变回直角）
const CARD_CORNER_RADIUS = 16; 

// ---------------------------
// 汉化与国旗字典
// ---------------------------
const teamNamesCN = {
  "Canada": "🇨🇦 加拿大", "Bosnia-Herzegovina": "🇧🇦 波黑", "Bosnia and Herzegovina": "🇧🇦 波黑",
  "United States": "🇺🇸 美国", "USA": "🇺🇸 美国", "Paraguay": "🇵🇾 巴拉圭",
  "Qatar": "🇶🇦 卡塔尔", "Switzerland": "🇨🇭 瑞士", "Brazil": "🇧🇷 巴西",
  "Morocco": "🇲🇦 摩洛哥", "Haiti": "🇭🇹 海地", "Scotland": "🏴󠁧󠁢󠁳󠁣󠁴󠁿 苏格兰",
  "Australia": "🇦🇺 澳大利亚", "Türkiye": "🇹🇷 土耳其", "Turkey": "🇹🇷 土耳其",
  "Argentina": "🇦🇷 阿根廷", "France": "🇫🇷 法国", "Germany": "🇩🇪 德国", 
  "Spain": "🇪🇸 西班牙", "England": "🏴󠁧󠁢󠁥󠁮󠁧󠁿 英格兰", "Portugal": "🇵🇹 葡萄牙", 
  "Netherlands": "🇳🇱 荷兰", "Italy": "🇮🇹 意大利", "Mexico": "🇲🇽 墨西哥", 
  "Japan": "🇯🇵 日本", "South Korea": "🇰🇷 韩国", "Saudi Arabia": "🇸🇦 沙特", 
  "Iran": "🇮🇷 伊朗", "Uruguay": "🇺🇾 乌拉圭", "Colombia": "🇨🇴 哥伦比亚", 
  "Ecuador": "🇪🇨 厄瓜多尔", "Senegal": "🇸🇳 塞内加尔", "Croatia": "🇭🇷 克罗地亚", 
  "Belgium": "🇧🇪 比利时", "Denmark": "🇩🇰 丹麦", "South Africa": "🇿🇦 南非", 
  "Czechia": "🇨🇿 捷克", "Tunisia": "🇹🇳 突尼斯", "Egypt": "🇪🇬 埃及", 
  "New Zealand": "🇳🇿 新西兰", "Norway": "🇳🇴 挪威"
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
  const fetchStart = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const fetchEnd = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);

  const getApiDateStr = (date) => {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}${mm}${dd}`;
  };

  const getBjDateStr = (timestamp) => {
    const bjTime = new Date(timestamp + 8 * 60 * 60 * 1000);
    const yyyy = bjTime.getUTCFullYear();
    const mm = String(bjTime.getUTCMonth() + 1).padStart(2, '0');
    const dd = String(bjTime.getUTCDate()).padStart(2, '0');
    return `${yyyy}${mm}${dd}`;
  };

  const bjNowTime = now.getTime() + (now.getTimezoneOffset() * 60 * 1000);
  const todayStr = getBjDateStr(bjNowTime);
  const tomorrowStr = getBjDateStr(bjNowTime + 24 * 60 * 60 * 1000);
  const dayAfterStr = getBjDateStr(bjNowTime + 48 * 60 * 60 * 1000);

  const weekdays = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
  const weekLabels = {
    "今日": weekdays[new Date(bjNowTime + 8 * 60 * 60 * 1000).getUTCDay()],
    "明日": weekdays[new Date(bjNowTime + (8 + 24) * 60 * 60 * 1000).getUTCDay()],
    "后日": weekdays[new Date(bjNowTime + (8 + 48) * 60 * 60 * 1000).getUTCDay()]
  };

  // 网络请求
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
    return { type: "widget", backgroundColor: "#161618", padding: 15, children: widgetChildren };
  }

  // 分配赛程数据
  const groupedMatches = { "今日": [], "明日": [], "后日": [] };
  matches.forEach(match => {
    const matchDate = new Date(match.date); 
    const matchTimestamp = matchDate.getTime();
    const bjMatchTime = new Date(matchTimestamp + 8 * 60 * 60 * 1000);
    const matchDateStr = getBjDateStr(matchTimestamp - matchDate.getTimezoneOffset() * 60 * 1000);
    
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
  const MAX_MATCHES_TO_SHOW = 10; 
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
    cardChildren.push({ type: "spacer", length: 10 });

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
          // 1. 时间列
          {
            type: "stack", direction: "row", width: COL_WIDTH_TIME,
            children: [ { type: "text", text: m.time, font: { size: 13 }, textColor: "#A1A1A6" }, { type: "spacer" } ]
          },
          { type: "spacer" },
          // 2. 主队名列
          {
            type: "stack", direction: "row", width: COL_WIDTH_TEAM,
            children: [ { type: "spacer" }, { type: "text", text: homeName, font: { size: 13 }, textColor: "#FFFFFF" } ]
          },
          // 3. 比分列
          {
            type: "stack", direction: "row", width: COL_WIDTH_SCORE,
            children: [
              { type: "spacer" },
              { type: "text", text: scoreStr, font: isBold ? { size: 12, weight: "bold" } : { size: 12 }, textColor: scoreColor },
              { type: "spacer" }
            ]
          },
          // 4. 客队名列
          {
            type: "stack", direction: "row", width: COL_WIDTH_TEAM,
            children: [ { type: "text", text: awayName, font: { size: 13 }, textColor: "#FFFFFF" }, { type: "spacer" } ]
          },
          { type: "spacer" }
        ]
      });

      cardChildren.push({ type: "spacer", length: 6 });
      totalRenderedMatches++;
    }
    
    if (totalRenderedMatches >= MAX_MATCHES_TO_SHOW && dayMatches.length > 0) {
      cardChildren.push({ type: "text", text: "...", font: { size: 12 }, textColor: "#888888" });
    }

    // 【暴力圆角修复】在对象中注入所有可能的 iOS 底层裁剪属性
    widgetChildren.push({
      type: "stack",
      direction: "column",
      padding: 0,
      children: [
        {
          type: "stack",
          direction: "column",
          backgroundColor: day === "今日" ? "#1A2520" : "#252528",
          // 强制注入所有可能被 Egern 底层解析的圆角/裁剪字段，防止被单点遗漏吃掉
          cornerRadius: CARD_CORNER_RADIUS,
          borderRadius: CARD_CORNER_RADIUS,
          clip: true,
          clipToBounds: true,
          masksToBounds: true,
          padding: 10, 
          children: cardChildren
        }
      ]
    });

    if (dIndex < dayNames.length - 1) {
      // 【间距修复】将原来 length: 8 的间距调小一倍为 4
      widgetChildren.push({ type: "spacer", length: 4 });
    }
  }

  widgetChildren.push({ type: "spacer" }); 

  return { type: "widget", backgroundColor: "#161618", padding: 15, children: widgetChildren };
}

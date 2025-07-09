// ==UserScript==
// @name         华住会自动签到
// @description  Quantumult X 定时自动签到，带通知
// ==/UserScript==

// ==UserScript==
// @name         华住会自动签到
// @description  Quantumult X 定时自动签到，丰富通知
// ==/UserScript==

const cookie = $prefs.valueForKey("HZ_COOKIE") || "";
if (!cookie || !cookie.includes("userToken=")) {
  $notify("❌ 华住会签到失败", "没有获取到Cookie", "请先手动抓包签到一次");
  $done();
}

const nowTs = Math.floor(Date.now()/1000); // 当前秒级时间戳
const url = `https://appgw.huazhu.com/game/sign_in?date=${nowTs}`;
const method = `GET`;
const headers = {
'Sec-Fetch-Dest' : `empty`,
'Connection' : `keep-alive`,
'Accept-Encoding' : `gzip, deflate, br`,
'Client-Platform' : `APP-IOS`,
'Sec-Fetch-Site' : `same-site`,
'Origin' : `https://cdn.huazhu.com`,
'User-Agent' : `HUAZHU/ios/iPhone/18.5/9.33.1/RNWEBVIEW`,
'Sec-Fetch-Mode' : `cors`,
'Cookie' : cookie,
'Host' : `appgw.huazhu.com`,
'Referer' : `https://cdn.huazhu.com/`,
'Accept-Language' : `zh-CN,zh-Hans;q=0.9`,
'Accept' : `application/json, text/plain, */*`
};

$task.fetch({ url, method: 'GET', headers }).then(response => {
  let body = response.body || "";
console.log("华住会签到返回：\n" + body);
let msg = "", sub = "";

try {
    const res = JSON.parse(body);
  
    if (res.code == 200 && res.content) {
      const c = res.content;
  
      // 今日是否签到
      let signResult = c.signResult ? '✅ 今日已签到' : '❌ 今日未签到';
      // 今日获得积分
      let todayPoint = c.point ?? '-';
      // 活跃值
      let activityPoints = c.activityPoints ?? '-';
      // 连续签到天数
      let yearSignInCount = c.yearSignInCount ?? '-';
  
      // 今日奖励（awardMap.award）
      let todayAwards = [];
      if (c.awardMap && Array.isArray(c.awardMap.award)) {
        todayAwards = c.awardMap.award.map(a => a.awardRealName || a.awardName || '').filter(Boolean);
      }
      let todayAwardStr = todayAwards.length ? todayAwards.join('、') : '无';
  
      // 补签提示
      let supplementStr = '';
      if (c.supplementSignTimes !== null && c.supplementSignTimes !== undefined) {
        supplementStr = `可补签次数：${c.supplementSignTimes}`;
      }
  
      msg = `${signResult}，积分+${todayPoint}，活跃值+${activityPoints}`;
      sub =
        `今日奖励：${todayAwardStr}\n` +
        `累计签到：${yearSignInCount} 天\n` +
        (supplementStr ? supplementStr + '\n' : '') +
        (res.message ? res.message : '');
  
    } else {
      msg = "签到失败";
      sub = res.message || body.slice(0, 50);
    }
  } catch (e) {
    msg = "签到结果解析失败";
    sub = String(e);
  }
  
  $notify("🏨 华住会签到", msg, sub);
  $done();
}, reason => {
  $notify("华住会签到", "请求失败", JSON.stringify(reason));
  $done();
});

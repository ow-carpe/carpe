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

const url = `https://appgw.huazhu.com/game/sign_header?`;
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
      // 今日签到分数
      let todayPoint = c.point ?? '-';
      // 活跃值
      let activityPoints = c.activityPoints ?? '-';
      // 连续签到天数
      let yearSignInCount = c.yearSignInCount ?? '-';
      // 总积分
      let memberPoint = c.memberPoint ?? '-';
      // 是否已经签到
      let signToday = c.signToday ? '✅ 已签到' : '❌ 未签到';

      // 今日奖励
      let todayAward = '';
      let today = c.signValueList?.find(s => s.today);
      if (today) {
        todayAward = today.awardList?.length
          ? today.awardList.map(a => a.awardRealName || a.awardName).join("、")
          : "";
      }

      // 下一个大奖
      let nextAward = c.nextAwardName ? `🎁 下一个大奖：${c.nextAwardName}` : "";

      msg = `${signToday}，今日+${todayPoint}积分，活跃值+${activityPoints}`;
      sub =
        (todayAward ? `今日奖励: ${todayAward}\n` : '') +
        `已签到: ${yearSignInCount} 天，当前积分: ${memberPoint}\n` +
        nextAward;
    } else {
      msg = "签到失败";
      sub = res.message || body.slice(0, 50);
    }
  } catch (e) {
    msg = "签到结果解析失败";
    sub = e + "";
  }
  $notify("🏨 华住会签到", msg, sub);
  $done();
}, reason => {
  $notify("华住会签到", "请求失败", JSON.stringify(reason));
  $done();
});

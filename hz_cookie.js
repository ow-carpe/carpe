// ==UserScript==
// @name         华住会Cookie获取(每日首次通知) 
// @description  Quantumult X 自动获取华住会 Cookie，每天只处理一次
// ==/UserScript==
/*************************************
[rewrite_local]
^https:\/\/hweb-personalcenter\.huazhu\.com\/personalCenter\/rightAndInterest\/getBriefInfo url script-request-header https://raw.githubusercontent.com/ow-carpe/carpe/master/hz_cookie.js

[mitm]
hostname = hweb-personalcenter.huazhu.com
*************************************/

// 获取当前日期字符串
function getToday() {
  const d = new Date();
  return d.getFullYear() + '-' +
    ('0' + (d.getMonth() + 1)).padStart(2, '0') + '-' +
    ('0' + d.getDate()).padStart(2, '0');
}

const today = getToday();
const lastDate = $prefs.valueForKey("HZ_COOKIE_DATE") || "";

// 已获取当天cookie，直接结束
if (today === lastDate) {
  $done();
} else if ($request && $request.headers) {
  // 只在当天第一次执行
  const cookie = $request.headers['Cookie'] || $request.headers['cookie'];
  if (cookie && cookie.includes('userToken=')) {
    const old = $prefs.valueForKey("HZ_COOKIE") || "";
    if (old !== cookie) {
      $prefs.setValueForKey(cookie, "HZ_COOKIE");
      $notify("✅ 华住会 Cookie 获取成功", `Cookie已更新（${today}）`, cookie.length > 100 ? cookie.slice(0, 60) + '...' : cookie);
      console.log("【华住会Cookie已更新】\n" + cookie);
    }
    // 无论是否变化，都要记录已处理日期，避免同一天多次通知
    $prefs.setValueForKey(today, "HZ_COOKIE_DATE");
  } else {
    $notify("❌ 获取失败", "未检测到 userToken", "");
  }
  $done();
} else {
  $done();
}

// ==UserScript==
// @name         京东Cookie获取(每日首次通知)
// @description  QuanX自动获取京东Cookie，每天只处理一次
// ==/UserScript==
/*************************************
[rewrite_local]
^https:\/\/api\.m\.jd\.com\/client\.action.* url script-request-header https://raw.githubusercontent.com/ow-carpe/carpe/master/jd_cookies.js
[mitm]
hostname = api.m.jd.com
*************************************/

// 获取当前日期字符串
function getToday() {
  const d = new Date();
  return d.getFullYear() + '-' +
    ('0' + (d.getMonth() + 1)).padStart(2, '0') + '-' +
    ('0' + d.getDate()).padStart(2, '0');
}

const today = getToday();
const lastDate = $prefs.valueForKey("JD_COOKIE_DATE") || "";

// 如果已经处理过今天，直接结束
if (today === lastDate) {
  $done();
} else if ($request && $request.headers) {
  // 仅当天第一次才处理
  const cookie = $request.headers['Cookie'] || $request.headers['cookie'];
  if (cookie && /pt_key=.+?;.+pt_pin=.+?;/.test(cookie)) {
    const oldCookie = $prefs.valueForKey("JD_COOKIE") || "";
    if (oldCookie !== cookie) {
      $prefs.setValueForKey(cookie, "JD_COOKIE");
      $notify("🎉 京东Cookie获取成功", `Cookie已更新（${today}）`, cookie);
      console.log("【京东Cookie已更新】\n" + cookie);
    } else {
      // 不变可以不提示，也可以 $notify("Cookie未变","",cookie);
    }
    $prefs.setValueForKey(today, "JD_COOKIE_DATE");
  }
  $done();
} else {
  $done();
}

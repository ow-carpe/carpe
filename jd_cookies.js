// ==UserScript==
// @name         京东Cookie获取
// @author       你的名字
// @description  Quantumult X 京东自动获取Cookie，Cookie变化才提示
// ==/UserScript==
/*************************************
[rewrite_local]
^https:\/\/api\.m\.jd\.com\/client\.action.* url script-request-header https://raw.githubusercontent.com/ow-carpe/carpe/master/jd_cookies.js
[mitm]
hostname = api.m.jd.com
*************************************/

if ($request && $request.headers) {
  const cookie = $request.headers['Cookie'] || $request.headers['cookie'];
  if (cookie && /pt_key=.+?;.+pt_pin=.+?;/.test(cookie)) {
    const oldCookie = $prefs.valueForKey("JD_COOKIE") || "";
    if (oldCookie !== cookie) {
      $prefs.setValueForKey(cookie, "JD_COOKIE");
      $notify("🎉 京东Cookie获取成功", "Cookie已更新", cookie);
      console.log("【京东Cookie已更新】\n" + cookie);
    } else {
      // 不变则不通知
      // console.log("【京东Cookie未变化】");
    }
  } else {
    // 可选：只在首次无 Cookie 时通知
    //$notify("❌ Cookie获取失败", "未检测到京东相关Cookie", "");
  }
}
$done();

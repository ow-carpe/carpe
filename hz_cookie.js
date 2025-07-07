// ==UserScript==
// @name         华住会Cookie获取
// @description  Quantumult X 自动获取华住会 Cookie 持久化
// ==/UserScript==
/*************************************
[rewrite_local]
^https:\/\/appgw\.huazhu\.com\/game\/sign_header\? url script-request-header https://raw.githubusercontent.com/ow-carpe/carpe/master/hz_cookie.js

[mitm]
hostname = appgw.huazhu.com
*************************************/

if ($request && $request.headers) {
  const cookie = $request.headers['Cookie'] || $request.headers['cookie'];
  if (cookie && cookie.includes('userToken=')) {
    // 只在 cookie 有变化时才保存
    const old = $prefs.valueForKey("HZ_COOKIE");
    if (old !== cookie) {
      $prefs.setValueForKey(cookie, "HZ_COOKIE");
      $notify("✅ 华住会 Cookie 获取成功", "已保存", cookie.length > 100 ? cookie.slice(0, 60) + '...' : cookie);
    }
  } else {
    $notify("❌ 获取失败", "未检测到 userToken", "");
  }
}
$done();

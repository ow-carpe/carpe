// ==UserScript==
// @name         京东Cookie获取
// @author       你的名字
// @description  Quantumult X 京东自动获取Cookie，通知显示
// ==/UserScript==

if ($request && $request.headers) {
  const cookie = $request.headers['Cookie'] || $request.headers['cookie'];
  if (cookie && /pt_key=.+?;.+pt_pin=.+?;/.test(cookie)) {
    // 保存 Cookie 到持久化
    $persistentStore.write(cookie, "JD_COOKIE");
    $notify("🎉 京东Cookie获取成功", "已写入持久化", cookie);
  } else {
    $notify("❌ Cookie获取失败", "未检测到京东相关Cookie", "");
  }
}
$done();

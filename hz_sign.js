// ==UserScript==
// @name         华住会自动签到
// @description  Quantumult X 定时自动签到，带通知
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
  let msg = "";
  try {
    const data = JSON.parse(body);
    if (data.code == 0) {
      msg = (data.message || "签到成功") + (data.data?.todayPoint ? `，积分 +${data.data.todayPoint}` : '');
    } else if (data.code == 1) {
      msg = data.message || "已签到";
    } else {
      msg = "未知返回: " + (data.message || body.slice(0, 50));
    }
  } catch (e) {
    msg = "解析返回失败: " + e;
  }
  $notify("华住会签到", "", msg);
  $done();
}, reason => {
  $notify("华住会签到", "请求失败", JSON.stringify(reason));
  $done();
});

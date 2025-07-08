// 获取持久化 cookie
const COOKIE = typeof $prefs !== "undefined" ? $prefs.valueForKey("JD_COOKIE") : "";
if (!COOKIE) {
  $notify("京东签到", "❌ 检查不到Cookie，请先抓包获取！", "");
  $done();
}

const url = `https://api.m.jd.com/client.action?functionId=signBeanAct`;
const method = `POST`;
const headers = {
'request-from' : `native`,
'Sec-Fetch-Dest' : `empty`,
'Connection' : `keep-alive`,
'Accept-Encoding' : `gzip, deflate, br`,
'Content-Type' : `application/x-www-form-urlencoded`,
'Sec-Fetch-Site' : `same-site`,
'Origin' : `https://pro.m.jd.com`,
'x-rp-client' : `h5_1.0.0`,
'User-Agent' : `jdapp;iPhone;15.1.65;;;M/5.0;appBuild/169923;jdSupportDarkMode/1;lang/zh_CN;site/CN;elder/0;ef/1;ep/%7B%22ciphertype%22%3A5%2C%22cipher%22%3A%7B%22ud%22%3A%22DzvvD2O5DWPwYtU0YzG5EJcnENduCwOnYzOmDWS0CNrvYwU1YWVsZK%3D%3D%22%2C%22sv%22%3A%22CJqkDG%3D%3D%22%2C%22iad%22%3A%22%22%7D%2C%22ts%22%3A1751935372%2C%22hdid%22%3A%22JM9F1ywUPwflvMIpYPok0tt5k9kW4ArJEU3lfLhxBqw%3D%22%2C%22version%22%3A%221.0.3%22%2C%22appname%22%3A%22com.360buy.jdmobile%22%2C%22ridx%22%3A-1%7D;Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1;`,
'Sec-Fetch-Mode' : `cors`,
'Cookie' : COOKIE,
'Host' : `api.m.jd.com`,
'x-referer-page' : `https://pro.m.jd.com/mall/active/Md9FMi1pJXg2q7qc8CmE9FNYDS4/index.html`,
'Referer' : `https://pro.m.jd.com/mall/active/Md9FMi1pJXg2q7qc8CmE9FNYDS4/index.html?stath=54&navh=44&babelChannel=ttt130&tttparams=8IE3ZImeyJyZnMiOiIwMDAwIiwicG9zTG5nIjoiMTIxLjQ1NzEiLCJ1ZW1wcyI6IjAtMi0wIiwiZ0xuZyI6IjEyMS40NTcxIiwiZ0xhdCI6IjM3LjQ1NDM5IiwibG5nIjoiMTIxLjI2MDQ2NCIsIm9yaWVudCI6InAiLCJvcyI6IjE4LjUiLCJsYnNMYXQiOiIzNy41MDcyMDYiLCJkTG5nIjoiIiwiZExhdCI6IiIsImxic0xuZyI6IjEyMS4yNjA1MTciLCJwcnN0YXRlIjoiMCIsImdwc19hcmVhIjoiMTNfMTA0Ml80NjUwNF81NDU1MiIsInNjYWxlIjoiMyIsImFkZHJlc3NJZCI6IjEyNjY3OTY1MDc3IiwidW5fYXJlYSI6IjEzXzEwNDJfMzUyOF81OTU5NiIsIndpZHRoIjoiMTI5MCIsImxic0FyZWEiOiIxM18xMDQyXzQ2NTA0XzU0NTUyIiwibGF0IjoiMzcuNTA3MTI4IiwibW9kZWwiOiJpUGhvbmUxNiwyIiwiY29ybmVyIjoxLCJhcmVhQ29kZSI6IjAiLCJwb3NMYXQiOiIzNy40NTQzOS7J9&embedMTab=1&mTabId=Md9FMi1pJXg2q7qc8CmE9FNYDS4`,
'Accept-Language' : `zh-CN,zh-Hans;q=0.9`,
'Accept' : `*/*`
};
const body = `functionId=signBeanAct&body=%7B%7D&appid=signed_wh5_ihub&client=apple&screen=430*749&networkType=wifi&openudid=79e7a95afb54c4997187d2a1c105b408ebe5aebd&uuid=79e7a95afb54c4997187d2a1c105b408ebe5aebd&clientVersion=15.1.65&d_model=iPhone16%2C2&osVersion=18.5`;
const myRequest = { url, method, headers, body };

$task.fetch(myRequest).then(response => {
  console.log("京东签到返回：\n" + response.body);
  let msg = '';
  try {
    let data = JSON.parse(response.body);
    if (data.code === '0' && data.data) {
      let d = data.data;
      let beans = d.dailyAward?.beanAward?.beanCount ?? '-';
      let title = (d.dailyAward?.title ?? '') + (d.dailyAward?.subTitle ?? '');
      let days = d.continuousDays ?? '-';
      if (d.status == "1") {
        // 签到成功
        msg = `签到成功🎉\n${title}\n获得京豆：${beans} 个\n连续签到：${days} 天`;
      } else if (d.status == "2") {
        // 已签到
        msg = `今天已签到✅\n${title}\n获得京豆：${beans} 个\n连续签到：${days} 天`;
      } else {
        msg = `未知状态，返回内容：${JSON.stringify(data)}`;
      }
    } else {
      msg = '签到失败，返回内容异常';
    }
  } catch(e) {
    msg = '签到失败，解析返回异常\n' + e;
  }
  $notify("京东签到", "", msg);
  $done();
}, reason => {
  $notify("京东签到", "请求失败", JSON.stringify(reason));
  $done();
});

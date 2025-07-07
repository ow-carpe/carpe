// 获取持久化 cookie
const COOKIE = typeof $prefs !== "undefined" ? $prefs.valueForKey("JD_COOKIE") : "";
if (!COOKIE) {
  $notify("京东签到", "❌ 检查不到Cookie，请先抓包获取！", "");
  $done();
}

const url = `https://api.m.jd.com/client.action?functionId=signBeanAct`;
const method = `POST`;

const headers = {
  'request-from': 'native',
  'Sec-Fetch-Dest': 'empty',
  'Connection': 'keep-alive',
  'Accept-Encoding': 'gzip, deflate, br',
  'Content-Type': 'application/x-www-form-urlencoded',
  'Sec-Fetch-Site': 'same-site',
  'Origin': 'https://pro.m.jd.com',
  'x-rp-client': 'h5_1.0.0',
  'User-Agent': 'jdapp;iPhone;15.1.65;;;M/5.0;appBuild/169923;jdSupportDarkMode/1;lang/zh_CN;site/CN;elder/0;ef/1;ep/xxx;',
  'Sec-Fetch-Mode': 'cors',
  'Cookie': COOKIE,  // <-- 自动读取
  'Host': 'api.m.jd.com',
  'x-referer-page': 'https://pro.m.jd.com/mall/active/Md9FMi1pJXg2q7qc8CmE9FNYDS4/index.html',
  'Referer': 'https://pro.m.jd.com/mall/active/Md9FMi1pJXg2q7qc8CmE9FNYDS4/index.html',
  'Accept-Language': 'zh-CN,zh-Hans;q=0.9',
  'Accept': '*/*'
};

const body = `functionId=signBeanAct&body=%7B%7D&appid=signed_wh5_ihub&client=apple&screen=430*749&networkType=wifi&openudid=xxx&uuid=xxx&clientVersion=15.1.65&d_model=iPhone16%2C2&osVersion=18.5&eid=xxx&h5st=xxx&x-api-eid-token=xxx`; // body原样

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

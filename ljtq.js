/********************************

莉景天气会员破解 (双接口版)
支持接口:
  - https://ljwapi.baichuan.tech/User/GetPrivateUsers
  - https://ljwapi.baichuan.tech/VIP/GetState

【Quantumult X 配置范例】
---------------------------------
[rewrite_local]
^https:\/\/ljwapi\.baichuan\.tech\/User\/GetPrivateUsers url script-response-body ljw_vip.js
^https:\/\/ljwapi\.baichuan\.tech\/VIP\/GetState url script-response-body ljw_vip.js

[mitm]
hostname = ljwapi.baichuan.tech

********************************/

let body = $response.body;
let url = $request.url;

try {
  let obj = JSON.parse(body);

  if (url.includes("/User/GetPrivateUsers")) {
    // 用户信息接口
    if (obj && obj.Result) {
      obj.Result.isVIP = true;
      obj.Result.vipType = 2;
      obj.Result.expiresTime = 9999999999999;
      obj.Result.name = "VIP用户";
    }
  }

  if (url.includes("/VIP/GetState")) {
    // VIP状态接口
    if (obj && obj.Result) {
      obj.Result.isLifelong = 1;
      obj.Result.vipType = 2;
      obj.Result.isDevice = true;
      obj.Result.expiresTime = 9999999999999;
    }
  }

  body = JSON.stringify(obj);
} catch (e) {
  // 兜底正则替换，防止字段名变动
  if (url.includes("/User/GetPrivateUsers")) {
    body = body
      .replace(/"isVIP":\w+/g, '"isVIP":true')
      .replace(/"name":".*?"/g, '"name":"VIP用户"')
      .replace(/"expiresTime":\d+/g, '"expiresTime":9999999999999');
  }
  if (url.includes("/VIP/GetState")) {
    body = body
      .replace(/"isLifelong":\d+/g, '"isLifelong":1')
      .replace(/"vipType":\d+/g, '"vipType":2')
      .replace(/"isDevice":\w+/g, '"isDevice":true')
      .replace(/"expiresTime":\d+/g, '"expiresTime":9999999999999');
  }
}

$done({ body });

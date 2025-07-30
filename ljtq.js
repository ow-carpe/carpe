/********************************

莉景天气会员破解 (多接口版)
支持接口:
  - https://ljwapi.baichuan.tech/User/GetPrivateUsers
  - https://ljwapi.baichuan.tech/VIP/GetState
  - https://ljwapi.baichuan.tech/Bate1/Vip/GetVipType
  - https://ljwapi.baichuan.tech/Login/Device

【Quantumult X 配置范例】
---------------------------------
[rewrite_local]
^https:\/\/ljwapi\.baichuan\.tech\/User\/GetPrivateUsers url script-response-body https://raw.githubusercontent.com/ow-carpe/carpe/master/ljtq.js
^https:\/\/ljwapi\.baichuan\.tech\/VIP\/GetState url script-response-body https://raw.githubusercontent.com/ow-carpe/carpe/master/ljtq.js
^https:\/\/ljwapi\.baichuan\.tech\/Bate1\/Vip\/GetVipType url script-response-body https://raw.githubusercontent.com/ow-carpe/carpe/master/ljtq.js
^https:\/\/ljwapi\.baichuan\.tech\/Login\/Device url script-response-body https://raw.githubusercontent.com/ow-carpe/carpe/master/ljtq.js
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

  if (url.includes("/Bate1/Vip/GetVipType")) {
    // VIP类型接口
    if (obj && obj.Result) {
      obj.Result.isLifelong = 1;
      obj.Result.vipType = 2;
      obj.Result.isDevice = true;
      obj.Result.expiresTime = 9999999999999;
    }
  }

  if (url.includes("/Login/Device")) {
    // 登录接口
    if (obj && obj.Result) {
      obj.Result.isVIP = true;
      obj.Result.isCreate = true;
      obj.Result.isAlert = false;
    }
  }

  body = JSON.stringify(obj);
} catch (e) {
  // 正则兜底替换（字段名变化时生效）
  if (url.includes("/User/GetPrivateUsers") || url.includes("/Login/Device")) {
    body = body
      .replace(/"isVIP":\w+/g, '"isVIP":true')
      .replace(/"name":".*?"/g, '"name":"VIP用户"')
      .replace(/"expiresTime":\d+/g, '"expiresTime":9999999999999');
    if (url.includes("/Login/Device")) {
      body = body
        .replace(/"isCreate":\w+/g, '"isCreate":true')
        .replace(/"isAlert":\w+/g, '"isAlert":false');
    }
  }
  if (url.includes("/VIP/GetState") || url.includes("/Bate1/Vip/GetVipType")) {
    body = body
      .replace(/"isLifelong":\d+/g, '"isLifelong":1')
      .replace(/"vipType":\d+/g, '"vipType":2')
      .replace(/"isDevice":\w+/g, '"isDevice":true')
      .replace(/"expiresTime":\d+/g, '"expiresTime":9999999999999');
  }
}

$done({ body });

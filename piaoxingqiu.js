/*************************************
项目名称：
**************************************
[rewrite_local]
^https:\/\/appapi\.caiyicloud\.com\/cyy_gatewayapi\/show url script-response-body https://raw.githubusercontent.com/ow-carpe/carpe/master/piaoxingqiu.js
[mitm]
hostname = appapi.caiyicloud.com
*************************************/

let body = $response.body;
let url = $request.url;

if (url.includes("appapi.caiyicloud.com") && body) {
  if (url.includes("/cyy_gatewayapi/show/pub/v5/show") && url.includes("/static")) {
    body = body.replace(/"showDetailStatus"\s*:\s*"[^"]*"/g, '"showDetailStatus" : "ON_SALE"');
  }
  if (url.includes("/cyy_gatewayapi/show/pub/v5/show") && url.includes("/session/")) {
    body = body.replace(/"bizSessionStatus"\s*:\s*"[^"]*"/g, '"bizSessionStatus" : "ONSALE"');
    body = body.replace(/"sessionStatus"\s*:\s*"[^"]*"/g, '"sessionStatus" : "ON_SALE"');
    body = body.replace(/"hasSessionSoldOut":true/g, '"hasSessionSoldOut":false');
    body = body.replace(/"hasStock":false/g, '"hasStock":true');
  }
  console.log(body)
  $done({body});
} else {
  $done({})
}

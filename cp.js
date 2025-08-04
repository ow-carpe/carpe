/*************************************
**************************************
[rewrite_local]
^https:\/\/compliance\.chippercash\.com\/account\/configuration$ url script-response-body https://raw.githubusercontent.com/ow-carpe/carpe/master/cp.js
[mitm]
hostname = hostname = compliance.chippercash.com
*************************************/

// ==UserScript==
// @name         猫眼门票伪造有票 ！！
// @description  QuanX修改猫眼 返回内容，所有票型都显示有票可买
// ==/UserScript==
// chippercash_liveness.js
let obj = JSON.parse($response.body);

// 兼容判断防止报错
try {
 let body = $response.body;
body = body.replace(/NOT_STARTED/g, "COMPLETED").replace(/false/g, "true");
$done({ body });

$done({ body });
} catch (e) {}

$done({ body: JSON.stringify(obj) });

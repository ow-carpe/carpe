/************************* 
^https:\/\/acs\.m\.taobao\.com\/gw\/mtop\.alibaba\.detail\.subpage\.getdetail\/2\.0\? url script-response-body https://raw.githubusercontent.com/ow-carpe/carpe/master/damai.js
[mitm]
hostname = acs.m.taobao.com
*************************/

// ==UserScript==
// @name         大麦门票缺货档伪造有票-最大数量
// @description  大麦skuList缺货档伪造成可购，字段按有票档模板，数量不超最大可售值
// ==/UserScript==

// ==UserScript==
// @name         大麦票务字段单改实验
// @description  只修改一个字段做前端实验，排查签名影响
// ==/UserScript==

let body = $response.body;
try {
    let obj = JSON.parse(body);

    // 这里的 data.result 是字符串，需先 JSON.parse 一下
    if (obj && obj.data && typeof obj.data.result === 'string') {
        let resultObj = JSON.parse(obj.data.result);

        // 找到 skuList，只改第一个票档的 priceName，别的啥都不动
        if (resultObj.perform && Array.isArray(resultObj.perform.skuList) && resultObj.perform.skuList.length > 0) {
            resultObj.perform.skuList[0].priceName += '【测试】';
        }

        // 改完后转回字符串
        obj.data.result = JSON.stringify(resultObj);
    }
    body = JSON.stringify(obj);
} catch(e) {
    console.log("大麦票务字段单改实验出错:", e);
}
$done({body});

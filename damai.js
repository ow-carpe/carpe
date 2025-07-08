/************************* 
^https:\/\/acs\.m\.taobao\.com\/gw\/mtop\.alibaba\.detail\.subpage\.getdetail\/2\.0\? url script-response-body https://raw.githubusercontent.com/ow-carpe/carpe/master/damai.js
[mitm]
hostname = acs.m.taobao.com
*************************/

// ==UserScript==
// @name         大麦票务缺货改有票
// @description  只把缺货票档变成有货，数量与最大有货票档一致，字段完全一致
// ==/UserScript==

let body = $response.body;
try {
    let obj = JSON.parse(body);

    // 1. 解析 result 字符串为对象
    if (obj && obj.data && typeof obj.data.result === 'string') {
        let resultObj = JSON.parse(obj.data.result);

        // 2. 找到skuList
        if (resultObj.perform && Array.isArray(resultObj.perform.skuList)) {
            // 3. 找到一个“真正有票”的sku，作为模板
            let template = resultObj.perform.skuList.find(item =>
                item.salableQuantity == "6" && item.skuSalable == "true"
            );
            // 如果没找到全新有票的，就用第一条
            if (!template) template = resultObj.perform.skuList[0];

            // 4. 修改所有缺货的sku
            resultObj.perform.skuList.forEach(item => {
                if (item.salableQuantity === "0" || item.skuSalable === false || item.skuSalable === "false") {
                    // 只改最核心的三个字段，其它字段一律不动
                    item.salableQuantity = template.salableQuantity;
                    item.mq = template.mq;
                    item.skuSalable = template.skuSalable;
                    item.frontEndStatus = template.frontEndStatus; // 确保状态一致
                    item.status = template.status;
                    item.tags = []; // 缺货标签去掉
                    // 可选：名字加个标识方便你识别
                    item.priceName += "【伪】";
                }
            });
        }

        // 5. stringify回 result
        obj.data.result = JSON.stringify(resultObj);
    }
    body = JSON.stringify(obj);
} catch(e) {
    console.log("大麦票务缺货转有票脚本异常:", e);
}
$done({body});

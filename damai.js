/************************* 
^https:\/\/acs\.m\.taobao\.com\/gw\/mtop\.alibaba\.detail\.subpage\.getdetail\/2\.0\? url script-response-body https://raw.githubusercontent.com/ow-carpe/carpe/master/damai.js
[mitm]
hostname = acs.m.taobao.com
*************************/

// ==UserScript==
// @name         大麦门票缺货档伪造有票-最大数量
// @description  大麦skuList缺货档伪造成可购，字段按有票档模板，数量不超最大可售值
// ==/UserScript==

let obj = JSON.parse($response.body);
let result = JSON.parse(obj.data.result);

if (result && result.perform && Array.isArray(result.perform.skuList)) {
    // 找到有票（skuSalable为"true"且salableQuantity大于0）的第一项作为模板
    const realTicket = result.perform.skuList.find(sku =>
        sku.skuSalable === "true" && sku.salableQuantity !== "0"
    );
    // 找最大数量
    const maxQty = result.perform.skuList.reduce((max, sku) => {
        if (sku.skuSalable === "true" && parseInt(sku.salableQuantity) > max) {
            return parseInt(sku.salableQuantity);
        }
        return max;
    }, 0);
    // 模板字段
    const tpl = Object.assign({}, realTicket);

    result.perform.skuList = result.perform.skuList.map(sku => {
        // 缺货造票
        if (sku.skuSalable !== "true" || sku.salableQuantity === "0") {
            let fake = Object.assign({}, tpl); // 完全拷贝
            // 恢复票型自己的识别字段和价格字段
            fake.skuId = sku.skuId;
            fake.itemId = sku.itemId;
            fake.priceId = sku.priceId;
            fake.priceIdOfTC = sku.priceIdOfTC;
            fake.priceName = sku.priceName;
            fake.price = sku.price;
            fake.dashPrice = sku.dashPrice;
            // 数量设为最大可用票数
            fake.salableQuantity = String(maxQty);
            fake.mq = String(maxQty);
            return fake;
        }
        return sku; // 有票的保留原样
    });
}

obj.data.result = JSON.stringify(result);
$done({body: JSON.stringify(obj)});

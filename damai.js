/************************* 
^https:\/\/acs\.m\.taobao\.com\/gw\/mtop\.alibaba\.detail\.subpage\.getdetail\/2\.0\? url script-response-body https://raw.githubusercontent.com/ow-carpe/carpe/master/damai.js
[mitm]
hostname = acs.m.taobao.com
*************************/

let body = $response.body;
try {
  let obj = JSON.parse(body);
  if (obj && obj.data && typeof obj.data.result === "string") {
    let result = JSON.parse(obj.data.result);
    if (result.perform && Array.isArray(result.perform.skuList)) {
      result.perform.skuList.forEach(sku => {
        // “缺货登记”或前端不可售或库存0，才处理
        const isLack = 
          (sku.tags && sku.tags.some(t => t.tagDesc && t.tagDesc.includes('缺货'))) ||
          (sku.otherTag && sku.otherTag.tagDesc && sku.otherTag.tagDesc.includes('缺货')) ||
          sku.frontEndStatus == 2 ||
          sku.skuSalable === false ||
          sku.salableQuantity == 0;
        if (isLack) {
          sku.skuSalable = true;
          sku.salableQuantity = 99;
          sku.mq = 99;
          sku.frontEndStatus = 1;
          sku.status = 1;
          sku.buyPermission = true;
          sku.clickable = true;
          sku.tags = [];
          sku.otherTag = null;
          if (sku.tips) delete sku.tips;
          // 名称后缀【伪】
          if (sku.priceName && !sku.priceName.includes("【伪】")) sku.priceName += "【伪】";
        }
      });
    }
    obj.data.result = JSON.stringify(result);
    body = JSON.stringify(obj);
  }
} catch (e) {
  console.log("大麦票档伪造出错：", e);
}
$done({body});

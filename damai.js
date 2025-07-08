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
        // 只处理不可售的
        const isLack = 
          sku.frontEndStatus != 1 || 
          !sku.skuSalable || 
          sku.salableQuantity == 0 ||
          (sku.tags && sku.tags.some(t => t.tagDesc && t.tagDesc.includes("缺货")));
        if (isLack) {
          sku.frontEndStatus = 1;
          sku.status = 1;
          sku.skuSalable = true;
          sku.salableQuantity = 99;
          sku.mq = 99;
          sku.buyPermission = true;
          sku.clickable = true;
          sku.packagesFlag = false;
          sku.freePackage = false;
          // 彻底清理标签和缺货提示
          sku.tags = [];
          sku.otherTag = null;
          if (sku.tips) delete sku.tips;
          // 名字后缀【伪】
          if (sku.priceName && !sku.priceName.includes("【伪】")) sku.priceName += "【伪】";
        }
      });
    }
    obj.data.result = JSON.stringify(result);
    body = JSON.stringify(obj);
  }
} catch (e) {
  console.log("大麦票务伪造出错:", e);
}
$done({body});

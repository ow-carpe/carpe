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
        // 标记缺货的sku
        let lackTag = (
          (sku.tags && sku.tags.some(t => t.tagDesc && t.tagDesc.includes('缺货'))) ||
          (sku.otherTag && sku.otherTag.tagDesc && sku.otherTag.tagDesc.includes('缺货'))
        );
        let isNoTicket =
          (sku.skuSalable === false || sku.salableQuantity == 0 || sku.frontEndStatus == 2);

        if (lackTag || isNoTicket) {
          // 伪造可购买
          sku.skuSalable = true;
          sku.salableQuantity = 6;
          sku.mq = 6;
          sku.frontEndStatus = 1;
          sku.status = 1;
          sku.tags = [];
          sku.otherTag = null;
          if (sku.tips) delete sku.tips;
          if (sku.priceName && !sku.priceName.includes('【伪】')) sku.priceName += "【伪】";
        }
      });
    }

    // 再次序列化
    obj.data.result = JSON.stringify(result);
    body = JSON.stringify(obj);
  }
} catch (e) {
  console.log("大麦伪造票档出错:", e);
}
$done({body});

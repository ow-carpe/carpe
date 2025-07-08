/*************************
^https:\/\/acs\.m\.taobao\.com\/gw\/mtop\.alibaba\.detail\.subpage\.getdetail\/2\.0\? url script-response-body https://raw.githubusercontent.com/ow-carpe/carpe/master/damai.js
[mitm]
hostname = acs.m.taobao.com
*************************/

let body = $response.body;
try {
  // data.result是一个json字符串，需要parse两次
  let obj = JSON.parse(body);
  if(obj && obj.data && typeof obj.data.result === "string") {
    let result = JSON.parse(obj.data.result);
    let skuList = result.perform && Array.isArray(result.perform.skuList) ? result.perform.skuList : [];
    skuList.forEach(sku => {
      if(
        (!sku.skuSalable || sku.salableQuantity === 0 || sku.frontEndStatus === 2)
        && sku.tags && sku.tags.some(t => t.tagDesc && t.tagDesc.includes('缺货'))
      ){
        // 伪造可售状态
        sku.skuSalable = true;
        sku.salableQuantity = 99;
        sku.mq = 99;
        sku.frontEndStatus = 1;
        sku.status = 1;
        sku.tags = [];
        sku.otherTag = null;
        if(sku.tips) delete sku.tips;
        if(sku.priceName && !sku.priceName.includes('【伪】')) sku.priceName += '【伪】';
      }
    });
    // 回写result
    obj.data.result = JSON.stringify(result);
    body = JSON.stringify(obj);
  }
} catch(e) {
  console.log("大麦伪造有票出错:", e);
}
$done({body});

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
        // 一律处理
        sku.status = 1;
        sku.frontEndStatus = 1;
        sku.skuSalable = true;
        sku.salableQuantity = 99;
        sku.mq = 99;
        sku.buyPermission = true;
        sku.clickable = true;
        sku.packagesFlag = false;
        sku.freePackage = false;
        sku.tags = [];
        sku.otherTag = null;
        if (sku.tips) delete sku.tips;
        // 处理字符串类型
        ["status","frontEndStatus","salableQuantity","mq"].forEach(k=>{
          if (typeof sku[k] !== "number") sku[k]=Number(sku[k])||1;
        });
        if (sku.priceName && !sku.priceName.includes("【伪】")) sku.priceName += "【伪】";
      });
    }
    obj.data.result = JSON.stringify(result);
    body = JSON.stringify(obj);
  }
} catch (e) {
  console.log("大麦票务伪造出错:", e);
}
$done({body});

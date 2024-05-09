/*************************************
项目名称：
**************************************
[rewrite_local]
^https:\/\/yanchu\.maoyan\.com\/myshow\/ajax url script-response-body https://raw.githubusercontent.com/ow-carpe/carpe/master/maoyan.js
[mitm]
hostname = yanchu.maoyan.com
*************************************/


const chxm1024 = {};
const chxm1023 = JSON.parse(typeof $response != "undefined" && $response.body || null);
var regex = /\/myshow\/ajax\/v2\/performance\/\d+\/shows/;
var body = $response.body;
var url = $request.url;

if (url.includes("yanchu.maoyan.com") && body) {
  var obj = JSON.parse($response.body);
  if (regex.test(url)) {
    body = body.replace(/("code"\s*:\s*)\d+/g, '$1200');
    body = body.replace(/"success":false/g, '"success":true');
  }
  if (url.includes("/myshow/ajax/v2/performance") && obj.data) {
    obj.data.saleStatus = 3;
    body = JSON.stringify(obj);
  }
  if (url.includes("/myshow/ajax/v2/show") && obj.data) {
    obj.data.forEach(item => {
      item.salesPlanVO.hasInventory = true;
      item.salesPlanVO.sellStatus = 3;
      item.salesPlanVO.currentAmount = 6;
      item.salesPlanVO.maxBuyLimit = 6;
      item.showStatus = 0;
      item.stockable = true;
      item.remainingStock = 6;
    });
    body = JSON.stringify(obj);
  }
  if (url.includes("showTickets/validateStock")) {
    obj.code = 200;
    obj.success = true;
    obj.msg = "";
    body = JSON.stringify(obj);
  }
  if (url.includes("/myshow/ajax/performance/show")) {
    obj.code = 200;
    obj.success = true;
    obj.msg = "";
    if (obj.data) {
      obj.data.forEach(item => {
      item.hasInventory = true;
      item.sellStatus = 3;
      item.currentAmount = 6;
      item.maxBuyLimit = 6;
    });
    }
    body = JSON.stringify(obj);
  }
  
  $done({body});
} else {
  $done({})
}

/*************************************
项目名称：彩云天气-净化/解锁SVIP
下载地址：https://t.cn/A66d95hV
更新日期：2024-04-12
脚本作者：chxm1023
电报频道：https://t.me/chxm1023
使用声明：⚠️仅供参考，🈲转载与售卖
**************************************
[rewrite_local]
^https:\/\/yanchu\.maoyan\.com\/myshow\/ajax\/v2 url script-response-body https://raw.githubusercontent.com/ow-carpe/carpe/master/maoyan.js
[mitm]
hostname = yanchu.maoyan.com
*************************************/


const chxm1024 = {};
const chxm1023 = JSON.parse(typeof $response != "undefined" && $response.body || null);
var body = $response.body;
var url = $request.url;

if (url.includes("yanchu.maoyan.com") && body) {
  var obj = JSON.parse($response.body);
  if (url.includes("/myshow/ajax/v2/performance") && obj.data) {
    obj.data.saleStatus = 3;
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
  }
  if (url.includes("showTickets/validateStock") && obj.data) {
    obj.code = 200;
    obj.success = true;
  }
  $done({ body: JSON.stringify(obj) });
} else {
  $done({})
}

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
    body = body.replace(/"data":null/g, '"data":[{"showId":1832353,"name":"2024-06-08 \u5468\u516D 15:00","performanceId":316736,"startTimeDateFormatted":"2024-06-08","startTimeWeekFormatted":"\u5468\u516D","startTimeTimeFormatted":"15:00","startTime":1717830000000,"endTime":1717844400000,"onSaleTime":1714756096000,"offSaleTime":1717844400000,"hasInventory":true,"showStatus":0,"showType":1,"showNote":"","areaUrl":null,"areaSvg":null,"areaSvgUrl":null,"showSeatType":0,"setExplain":"","showOrderLimitVO":{"maxBuyLimitPerOrder":6,"maxBuyLimitPerUser":20,"userAlreadyBuyNum":0,"userRemainBuyNum":20},"unusualStatus":0,"needFaceCheck":false,"seatMode":0,"hasDiscount":true,"minSellPrice":49.90,"preSelectVO":null,"soldOut":false,"normal":true,"default":true}]');
  }
  if (url.includes("/myshow/ajax/v2/performance") && obj.data) {
    //obj.data.saleStatus = 3;
    //body = JSON.stringify(obj);
    body = body.replace(/("saleStatus"\s*:\s*)\d+/g, '$15');
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

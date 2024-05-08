/*************************************
项目名称：
**************************************
[rewrite_local]
^https:\/\/api\.livelab\.com\.cn\/performance\/app url script-response-body https://raw.githubusercontent.com/ow-carpe/carpe/master/fenwandao.js
[mitm]
hostname = api.livelab.com.cn
*************************************/


const chxm1024 = {};
const chxm1023 = JSON.parse(typeof $response != "undefined" && $response.body || null);
var body = $response.body;
var url = $request.url;

if (url.includes("api.livelab.com.cn") && body) {
  var obj = JSON.parse($response.body);
  if (url.includes("app/project/get_project_info") && obj.data) {
    obj.data.buttonStatus = 1;
    obj.data.deliveryType = "1";
  }
  if (url.includes("project/get_performs") && obj.data) {
    obj.data.performInfos[0].seatPlans.forEach(item => {
      item.display = 1;
    });
  }
  if (url.includes("performance/app/project/seatPlanStatus") && obj.data) {
    obj.data.forEach(item => {
      item.soldOutFlag = false;
    });
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
  }
  $done({ body: JSON.stringify(obj) });
} else {
  $done({})
}

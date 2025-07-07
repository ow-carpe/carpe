/*************************************
**************************************
[rewrite_local]
^https:\/\/api\.livelab\.com\.cn\/performance\/app\/project\/get_performs\? url script-response-body https://raw.githubusercontent.com/ow-carpe/carpe/master/fenwandao.js
[mitm]
hostname = api.livelab.com.cn
*************************************/

// ==UserScript==
// @name         纷玩岛查票结果万能改写
// @description  QuanX响应体-将所有不可购票档变为可购（含所有主流可购标志位）
// ==/UserScript==

let body = $response.body;
try {
  let json = JSON.parse(body);

  json?.data?.performInfos?.forEach(performInfo => {
    performInfo.performInfo?.forEach(perform => {
      perform.seatPlans?.forEach(plan => {
        // 只改带有缺票登记的
        if (plan.display === 3) {
          plan.display = 1;             // 让前端显示为可购
          plan.tags = [{type:4, tag:"脚本可购"}]; // 标记已改
          plan.leftStock = 6;           // 随便写点余票数
          plan.ableSaleQuantity = 6;
          plan.status = 21;             // 通常21可购，22不可购
          //plan.seatPlanName += "(脚本可购)";
        }
      });
    });
  });

  $done({ body: JSON.stringify(json) });
} catch(e) {
  $notify("查票改写异常", e+"", body && body.substr(0,200));
  $done({});
}

/*****
var body = $response.body;
var url = $request.url;

if (url.includes("api.livelab.com.cn") && body) {
  var obj = JSON.parse($response.body);
  if (url.includes("app/project/get_project_info") && obj.data) {
    obj.data.buttonStatus = 1;
    obj.data.deliveryType = "1";
  }
  if (url.includes("project/get_performs") && obj.data) {
    obj.data.performInfos.forEach(pinfo => {
      pinfo.performInfo[0].status = 22;
      pinfo.performInfo[0].ashShow = 0;
      pinfo.performInfo[0].ashShowDesc = null;
      pinfo.performInfo[0].seatPlans.forEach(item => {
        item.status = 22;
        item.tags = [];
        item.display = 1;
        item.ashShow = 0;
        item.selectable = 1;
        item.saleTime = "2024-05-10 10:00:00";
        item.ashShowDesc = "";
      });
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
****/

/*************************************
项目名称：
**************************************
[rewrite_local]
^https:\/\/api\.livelab\.com\.cn\/performance\/app\/project\/get_performs\? url script-response-body https://raw.githubusercontent.com/ow-carpe/carpe/master/fenwandao.js
[mitm]
hostname = api.livelab.com.cn
*************************************/

// ==UserScript==
// @name         纷玩岛查票结果修改
// @description  QuanX响应体改写-把所有席位改为有票且可买
// ==/UserScript==

let body = $response.body;
try {
  let json = JSON.parse(body);

  // 遍历每个演出日期
  json?.data?.performInfos?.forEach(performInfo => {
    performInfo.performInfo?.forEach(perform => {
      // 遍历所有票档
      perform.seatPlans?.forEach(plan => {
        // 原本可售=0的票档 改为可售、并加上自定义标记
        if(plan.ableSell === 0){
          plan.ableSell = 1;           // 可售
          plan.ableSaleQuantity = 100; // 可买数量
          plan.leftStock = 100;        // 库存
          plan.status = 21;            // 21=可售
          plan.shelfStatus = 1;        // 上架
          plan.seatPlanName = plan.seatPlanName + "(测试票)";
          // 给标签加个自定义样式提示
          plan.tags = [{type:99, tag:"测试票-仅展示"}];
        }
      });
    });
  });

  $done({ body: JSON.stringify(json) });
} catch(e) {
  $notify("查票改写异常", e + "", body.slice(0,200));
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

// ==UserScript==
// @name         猫眼门票伪造有票 ！！
// @description  QuanX修改猫眼 返回内容，所有票型都显示有票可买
// ==/UserScript==

[rewrite_local]
^https:\/\/yanchu\.maoyan\.com\/my\/odea\/project\/(shows|tickets)\? url script-response-body https://raw.githubusercontent.com/ow-carpe/carpe/master/maoyan.js
[mitm]
hostname = yanchu.maoyan.com

let body = $response.body;
try {
    let obj = JSON.parse(body);

    if (obj && obj.data && Array.isArray(obj.data.ticketsVO)) {
        obj.data.ticketsVO.forEach(ticket => {
            // 只处理本来无票的项目（showStatus=2且remainingStock=0）
            if(ticket.showStatus === 2 && ticket.remainingStock === 0) {
                ticket.showStatus = 0; // 可买
                ticket.remainingStock = 99; // 假定剩余99张
                if(ticket.ticketName) {
                    // 可选：名字加“【伪】”方便识别
                    ticket.ticketName += "【伪】";
                }
                
            }
        });
    }
     // 处理 showListVO 场次数据
    if (obj && obj.data && Array.isArray(obj.data.showListVO)) {
        obj.data.showListVO.forEach(show => {
            // showStatus=2 表示售罄，0表示可购
            if (show.showStatus === 2) {
                show.showStatus = 0; // 可购
                if(show.showName && !show.showName.includes('【伪】')) {
                    show.showName += "【伪】";
                }
            }
        });
    }
    body = JSON.stringify(obj);
} catch(e) {
    console.log("猫眼票务伪造出错:", e);
}
$done({body});

/*************************************
项目名称：
**************************************

*********************************

var regex = /\/myshow\/ajax\/v2\/performance\/\d+\/shows/;
var body = $response.body;
var url = $request.url;

if (url.includes("yanchu.maoyan.com") && body) {
  if (regex.test(url)) {
    body = body.replace(/("code"\s*:\s*)\d+/g, '$1200');
    body = body.replace(/"success":false/g, '"success":true');
    //body = body.replace(/"data":null/g, '"data":[{"showId":1832353,"name":"2024-06-08 \u5468\u516D 15:00","performanceId":316736,"startTimeDateFormatted":"2024-06-08","startTimeWeekFormatted":"\u5468\u516D","startTimeTimeFormatted":"15:00","startTime":1717830000000,"endTime":1717844400000,"onSaleTime":1714756096000,"offSaleTime":1717844400000,"hasInventory":true,"showStatus":0,"showType":1,"showNote":"","areaUrl":null,"areaSvg":null,"areaSvgUrl":null,"showSeatType":0,"setExplain":"","showOrderLimitVO":{"maxBuyLimitPerOrder":6,"maxBuyLimitPerUser":20,"userAlreadyBuyNum":0,"userRemainBuyNum":20},"unusualStatus":0,"needFaceCheck":false,"seatMode":0,"hasDiscount":true,"minSellPrice":49.90,"preSelectVO":null,"soldOut":false,"normal":true,"default":true}]');
  }
  if (url.includes("/myshow/ajax/v2/performance")) {
    body = body.replace(/("saleStatus"\s*:\s*)\d+/g, '$13');
  }
  if (url.includes("/myshow/ajax/v2/show")) {
    body = body.replace(/"hasInventory":false/g, '"hasInventory":true');
    body = body.replace(/("sellStatus"\s*:\s*)\d+/g, '$13');
    body = body.replace(/("currentAmount"\s*:\s*)\d+/g, '$16');
    body = body.replace(/("maxBuyLimit"\s*:\s*)\d+/g, '$16');
    body = body.replace(/("showStatus"\s*:\s*)\d+/g, '$10');
    body = body.replace(/"stockable":false/g, '"stockable":true');
    body = body.replace(/("remainingStock"\s*:\s*)\d+/g, '$16');
  }
  if (url.includes("showTickets/validateStock")) {
    body = body.replace(/("code"\s*:\s*)\d+/g, '$1200');
    body = body.replace(/"success":false/g, '"success":true');
    body = body.replace(/"msg"\s*:\s*"[^"]*"/g, '"msg" : ""');
  }
  if (url.includes("/myshow/ajax/performance/show")) {
    body = body.replace(/("code"\s*:\s*)\d+/g, '$1200');
    body = body.replace(/"success":false/g, '"success":true');
    body = body.replace(/"msg"\s*:\s*"[^"]*"/g, '"msg" : ""');
    body = body.replace(/"hasInventory":false/g, '"hasInventory":true');
    body = body.replace(/("sellStatus"\s*:\s*)\d+/g, '$13');
    body = body.replace(/("currentAmount"\s*:\s*)\d+/g, '$16');
    body = body.replace(/("maxBuyLimit"\s*:\s*)\d+/g, '$16');
  }

  $done({body});
} else {
  $done({})
}
  ****/

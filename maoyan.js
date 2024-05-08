/*************************************

项目名称：彩云天气-净化/解锁SVIP
下载地址：https://t.cn/A66d95hV
更新日期：2024-04-12
脚本作者：carpebody
电报频道：https://t.me/carpebody
使用声明：⚠️仅供参考，🈲转载与售卖！

**************************************

[rewrite_local]
^https:\/\/yanchu\.maoyan\.com\/myshow\/ajax\/v2 url script-response-body https://raw.githubusercontent.com/ow-carpe/carpe/master/maoyan.js

[mitm]
hostname = yanchu.maoyan.com

*************************************/


const res = {};
const body = JSON.parse(typeof $response != "undefined" && $response.body || null);
const url = $request.url;
const adUrl = /(activity\?app_name|operation\/banners)/;
const tcUrl = /conditions/;
const vipUrl = /https:\/\/yanchu\.maoyan\.com\/myshow\/ajax\/v2\/performance/;
const userUrl = /https:\/\/yanchu\.maoyan\.com\/myshow\/ajax\/v2\/show/;
const syUrl = /trial_card\/info/;
const qyUrl = /entries/;
const peUrl = /privileges/;
const topUrl = /operation\/homefeatures/;
if (url.includes("yanchu.maoyan.com")) {
  if (url.includes("myshow/ajax/v2/performance")) {
     body.data.saleStatus = 3;
  }
 if (url.includes("myshow/ajax/v2/show")) {
  body.data.forEach(item => 
            item.salesPlanVO.hasInventory = true;
            item.salesPlanVO.sellStatus = 3;
        });
  }
  res.body = JSON.stringify(body);
}

$done(res);

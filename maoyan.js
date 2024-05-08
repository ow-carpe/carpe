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


const carperes = {};
const carpebody = JSON.parse(typeof $response != "undefined" && $response.body || null);
const url = $request.url;
const adUrl = /(activity\?app_name|operation\/banners)/;
const tcUrl = /conditions/;
const vipUrl = /https:\/\/yanchu\.maoyan\.com\/myshow\/ajax\/v2\/performance/;
const userUrl = /https:\/\/yanchu\.maoyan\.com\/myshow\/ajax\/v2\/show/;
const syUrl = /trial_card\/info/;
const qyUrl = /entries/;
const peUrl = /privileges/;
const topUrl = /operation\/homefeatures/;
if (url.indexOf("yanchu.maoyan.com") !== -1) {
  if (url.indexOf("myshow/ajax/v2/performance") !== -1) {
     carpebody.data.saleStatus = 3;
  }
 if (url.indexOf("myshow/ajax/v2/show") !== -1) {
  carpebody.data.forEach(item => 
            item.salesPlanVO.hasInventory = true;
            item.salesPlanVO.sellStatus = 3;
        });
  }
  carperes.body = JSON.stringify(carpebody);
}

$done(carperes);

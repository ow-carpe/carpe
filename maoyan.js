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


const chxm1024 = {};
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

if (typeof $response == "undefined") {
  chxm1024.headers = $request.headers;
  chxm1024.headers['device-token'] = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzZXNzaW9uIjoiNjYyNzQxMzVkYWM3MGMwMDE4YzFlNDBmIiwidXNlcl9pZCI6IjVmNWJmYzU3ZDJjNjg5MDAxNGUyNmJiOCIsInZlcnNpb24iOjIsImV4cCI6MTcyMTYyNDYyOSwidmlwX2V4cGlyZWRfYXQiOjAsImlzcyI6IndlYXRoZXIiLCJpYXQiOjE3MTM4NDg2MjksInN2aXBfZXhwaXJlZF9hdCI6MTg1NjY4NTAzMSwicHJpbWFyeSI6dHJ1ZX0.bBT3vbfATa-LF1G34j4VjPTYtwcKHfG3oHIkFlmg1dY';
} else {
  switch (true) {
    case adUrl.test(url):
      carpebody.status = "ok";
      carpebody.activities = [{"items":[{}]}];
      carpebody.data = [];
      break;
    case tcUrl.test(url):
      carpebody.actions = [];
      carpebody.popups = [];
      break;
    case vipUrl.test(url):
  
      carpebody.data.saleStatus = 3;
      break;
    case userUrl.test(url):
      carpebody.data.hasInventory = true;
       carpebody.data.data.forEach(item => 
            item.salesPlanVO.hasInventory = true;
            item.salesPlanVO.sellStatus = 3;
        });
      break;
    case syUrl.test(url):
      carpebody.receive_status = 0;
      carpebody.vip_type = "svip";
      carpebody.activated_at = 1712600671;
      carpebody.vip_duration = "999";
      carpebody.expired_at = 4092599349;
      carpebody.has_valid_card = 0;
      break;
    case qyUrl.test(url):
      carpebody["entries"] = [{  "url" : "https://t.me/carpebody",  "id" : 1,  "name" : "叮当猫",  "type" : 1,  "pos" : 2  }];
      break;
    case peUrl.test(url):
      carpebody["privileges"] = [{  "vip_type" : "svip",  "subscription_chat_quota" : 999  }];
      break;
    case topUrl.test(url):
      carpebody["data"] = [{  "badge_type" : "",  "title" : "叮当猫",  "url" : "https://t.me/carpebody",  "feature_type" : "",  "avatar" : "https://raw.githubusercontent.com/carpebody/Script_X/main/icon/ddm2.png"  },...carpebody.data];
      break;
    }
  chxm1024.body = JSON.stringify(carpebody);
}

$done(chxm1024);

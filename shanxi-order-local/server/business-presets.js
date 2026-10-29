// Sanitized facts from the 14-entry partial HAR and its referenced app bundle.
// No response bodies or AES keys were exported. Unknown fields stay empty.
export function capturedBusinessPresets(){
 const base={revision:1,status:'draft',price:'资费待核实',term:'以官方活动规则为准',scope:'act',queryParams:{},orderParams:{},sms:{channelId:'',busiType:'',busiName:'',prodDesc:'',effDate:'',sendType:'',actType:'',busiId:'',prcId:'',actId:'',meansId:'',businessCode:''}};
 return [
  {...structuredClone(base),id:'har-tech-worker-day',name:'科技工作者日专属权益',couponsBusiName:'科技工作者日专属权益',queryMode:'generic',queryPath:'nstwd/qryNstwdAct',orderPath:'nstwd/nstwdActCfm',description:'抓包出现 NSTWD 活动查询及短信请求，页面路由为 /techWorkerDay。具体可选权益由官方响应返回，本次 HAR 未保存响应正文。',requirements:['待补全：具体产品/活动编码、短信业务类型及渠道参数、订购参数和资费规则。','查询路径来自 HAR；订购路径来自同名构建的接口声明，尚未由本次订购请求核实。']},
  {...structuredClone(base),id:'har-migu-sports',name:'咪咕体育',couponsBusiName:'咪咕体育',queryMode:'none',queryPath:'',orderPath:'',description:'抓包页面埋点明确业务名称“咪咕体育”与 /olymPic 路由，并出现业务短信请求；未记录明文业务参数或订购请求。',requirements:['待补全：产品编码、短信业务类型及渠道参数、订购接口、必填参数和资费规则。','不能将路由标识 B006 当作短信 busiId，也不套用其他体育业务的订购接口。']}
 ];
}

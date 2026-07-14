(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))s(n);new MutationObserver(n=>{for(const r of n)if(r.type==="childList")for(const a of r.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&s(a)}).observe(document,{childList:!0,subtree:!0});function t(n){const r={};return n.integrity&&(r.integrity=n.integrity),n.referrerPolicy&&(r.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?r.credentials="include":n.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function s(n){if(n.ep)return;n.ep=!0;const r=t(n);fetch(n.href,r)}})();const L=Object.create(null);L.open="0";L.close="1";L.ping="2";L.pong="3";L.message="4";L.upgrade="5";L.noop="6";const re=Object.create(null);Object.keys(L).forEach(i=>{re[L[i]]=i});const be={type:"error",data:"parser error"},Ze=typeof Blob=="function"||typeof Blob<"u"&&Object.prototype.toString.call(Blob)==="[object BlobConstructor]",Qe=typeof ArrayBuffer=="function",et=i=>typeof ArrayBuffer.isView=="function"?ArrayBuffer.isView(i):i&&i.buffer instanceof ArrayBuffer,Ie=({type:i,data:e},t,s)=>Ze&&e instanceof Blob?t?s(e):He(e,s):Qe&&(e instanceof ArrayBuffer||et(e))?t?s(e):He(new Blob([e]),s):s(L[i]+(e||"")),He=(i,e)=>{const t=new FileReader;return t.onload=function(){const s=t.result.split(",")[1];e("b"+(s||""))},t.readAsDataURL(i)};function We(i){return i instanceof Uint8Array?i:i instanceof ArrayBuffer?new Uint8Array(i):new Uint8Array(i.buffer,i.byteOffset,i.byteLength)}let he;function Ct(i,e){if(Ze&&i.data instanceof Blob)return i.data.arrayBuffer().then(We).then(e);if(Qe&&(i.data instanceof ArrayBuffer||et(i.data)))return e(We(i.data));Ie(i,!1,t=>{he||(he=new TextEncoder),e(he.encode(t))})}const Ke="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",Y=typeof Uint8Array>"u"?[]:new Uint8Array(256);for(let i=0;i<Ke.length;i++)Y[Ke.charCodeAt(i)]=i;const St=i=>{let e=i.length*.75,t=i.length,s,n=0,r,a,c,u;i[i.length-1]==="="&&(e--,i[i.length-2]==="="&&e--);const w=new ArrayBuffer(e),A=new Uint8Array(w);for(s=0;s<t;s+=4)r=Y[i.charCodeAt(s)],a=Y[i.charCodeAt(s+1)],c=Y[i.charCodeAt(s+2)],u=Y[i.charCodeAt(s+3)],A[n++]=r<<2|a>>4,A[n++]=(a&15)<<4|c>>2,A[n++]=(c&3)<<6|u&63;return w},Tt=typeof ArrayBuffer=="function",Be=(i,e)=>{if(typeof i!="string")return{type:"message",data:tt(i,e)};const t=i.charAt(0);return t==="b"?{type:"message",data:It(i.substring(1),e)}:re[t]?i.length>1?{type:re[t],data:i.substring(1)}:{type:re[t]}:be},It=(i,e)=>{if(Tt){const t=St(i);return tt(t,e)}else return{base64:!0,data:i}},tt=(i,e)=>e==="blob"?i instanceof Blob?i:new Blob([i]):i instanceof ArrayBuffer?i:i.buffer,it="",Bt=(i,e)=>{const t=i.length,s=new Array(t);let n=0;i.forEach((r,a)=>{Ie(r,!1,c=>{s[a]=c,++n===t&&e(s.join(it))})})},Rt=(i,e)=>{const t=i.split(it),s=[];for(let n=0;n<t.length;n++){const r=Be(t[n],e);if(s.push(r),r.type==="error")break}return s};function kt(){return new TransformStream({transform(i,e){Ct(i,t=>{const s=t.length;let n;if(s<126)n=new Uint8Array(1),new DataView(n.buffer).setUint8(0,s);else if(s<65536){n=new Uint8Array(3);const r=new DataView(n.buffer);r.setUint8(0,126),r.setUint16(1,s)}else{n=new Uint8Array(9);const r=new DataView(n.buffer);r.setUint8(0,127),r.setBigUint64(1,BigInt(s))}i.data&&typeof i.data!="string"&&(n[0]|=128),e.enqueue(n),e.enqueue(t)})}})}let fe;function ie(i){return i.reduce((e,t)=>e+t.length,0)}function se(i,e){if(i[0].length===e)return i.shift();const t=new Uint8Array(e);let s=0;for(let n=0;n<e;n++)t[n]=i[0][s++],s===i[0].length&&(i.shift(),s=0);return i.length&&s<i[0].length&&(i[0]=i[0].slice(s)),t}function Dt(i,e){fe||(fe=new TextDecoder);const t=[];let s=0,n=-1,r=!1;return new TransformStream({transform(a,c){for(t.push(a);;){if(s===0){if(ie(t)<1)break;const u=se(t,1);r=(u[0]&128)===128,n=u[0]&127,n<126?s=3:n===126?s=1:s=2}else if(s===1){if(ie(t)<2)break;const u=se(t,2);n=new DataView(u.buffer,u.byteOffset,u.length).getUint16(0),s=3}else if(s===2){if(ie(t)<8)break;const u=se(t,8),w=new DataView(u.buffer,u.byteOffset,u.length),A=w.getUint32(0);if(A>Math.pow(2,21)-1){c.enqueue(be);break}n=A*Math.pow(2,32)+w.getUint32(4),s=3}else{if(ie(t)<n)break;const u=se(t,n);c.enqueue(Be(r?u:fe.decode(u),e)),s=0}if(n===0||n>i){c.enqueue(be);break}}}})}const st=4;function g(i){if(i)return Ot(i)}function Ot(i){for(var e in g.prototype)i[e]=g.prototype[e];return i}g.prototype.on=g.prototype.addEventListener=function(i,e){return this._callbacks=this._callbacks||{},(this._callbacks["$"+i]=this._callbacks["$"+i]||[]).push(e),this};g.prototype.once=function(i,e){function t(){this.off(i,t),e.apply(this,arguments)}return t.fn=e,this.on(i,t),this};g.prototype.off=g.prototype.removeListener=g.prototype.removeAllListeners=g.prototype.removeEventListener=function(i,e){if(this._callbacks=this._callbacks||{},arguments.length==0)return this._callbacks={},this;var t=this._callbacks["$"+i];if(!t)return this;if(arguments.length==1)return delete this._callbacks["$"+i],this;for(var s,n=0;n<t.length;n++)if(s=t[n],s===e||s.fn===e){t.splice(n,1);break}return t.length===0&&delete this._callbacks["$"+i],this};g.prototype.emit=function(i){this._callbacks=this._callbacks||{};for(var e=new Array(arguments.length-1),t=this._callbacks["$"+i],s=1;s<arguments.length;s++)e[s-1]=arguments[s];if(t){t=t.slice(0);for(var s=0,n=t.length;s<n;++s)t[s].apply(this,e)}return this};g.prototype.emitReserved=g.prototype.emit;g.prototype.listeners=function(i){return this._callbacks=this._callbacks||{},this._callbacks["$"+i]||[]};g.prototype.hasListeners=function(i){return!!this.listeners(i).length};const ue=typeof Promise=="function"&&typeof Promise.resolve=="function"?e=>Promise.resolve().then(e):(e,t)=>t(e,0),k=typeof self<"u"?self:typeof window<"u"?window:Function("return this")(),xt="arraybuffer";function nt(i,...e){return e.reduce((t,s)=>(i.hasOwnProperty(s)&&(t[s]=i[s]),t),{})}const Nt=k.setTimeout,Lt=k.clearTimeout;function pe(i,e){e.useNativeTimers?(i.setTimeoutFn=Nt.bind(k),i.clearTimeoutFn=Lt.bind(k)):(i.setTimeoutFn=k.setTimeout.bind(k),i.clearTimeoutFn=k.clearTimeout.bind(k))}const _t=1.33;function $t(i){return typeof i=="string"?Pt(i):Math.ceil((i.byteLength||i.size)*_t)}function Pt(i){let e=0,t=0;for(let s=0,n=i.length;s<n;s++)e=i.charCodeAt(s),e<128?t+=1:e<2048?t+=2:e<55296||e>=57344?t+=3:(s++,t+=4);return t}function at(){return Date.now().toString(36).substring(3)+Math.random().toString(36).substring(2,5)}function Mt(i){let e="";for(let t in i)i.hasOwnProperty(t)&&(e.length&&(e+="&"),e+=encodeURIComponent(t)+"="+encodeURIComponent(i[t]));return e}function Vt(i){let e={},t=i.split("&");for(let s=0,n=t.length;s<n;s++){let r=t[s].split("=");e[decodeURIComponent(r[0])]=decodeURIComponent(r[1])}return e}class qt extends Error{constructor(e,t,s){super(e),this.description=t,this.context=s,this.type="TransportError"}}class Re extends g{constructor(e){super(),this.writable=!1,pe(this,e),this.opts=e,this.query=e.query,this.socket=e.socket,this.supportsBinary=!e.forceBase64}onError(e,t,s){return super.emitReserved("error",new qt(e,t,s)),this}open(){return this.readyState="opening",this.doOpen(),this}close(){return(this.readyState==="opening"||this.readyState==="open")&&(this.doClose(),this.onClose()),this}send(e){this.readyState==="open"&&this.write(e)}onOpen(){this.readyState="open",this.writable=!0,super.emitReserved("open")}onData(e){const t=Be(e,this.socket.binaryType);this.onPacket(t)}onPacket(e){super.emitReserved("packet",e)}onClose(e){this.readyState="closed",super.emitReserved("close",e)}pause(e){}createUri(e,t={}){return e+"://"+this._hostname()+this._port()+this.opts.path+this._query(t)}_hostname(){const e=this.opts.hostname;return e.indexOf(":")===-1?e:"["+e+"]"}_port(){return this.opts.port&&(this.opts.secure&&Number(this.opts.port)!==443||!this.opts.secure&&Number(this.opts.port)!==80)?":"+this.opts.port:""}_query(e){const t=Mt(e);return t.length?"?"+t:""}}class Ut extends Re{constructor(){super(...arguments),this._polling=!1}get name(){return"polling"}doOpen(){this._poll()}pause(e){this.readyState="pausing";const t=()=>{this.readyState="paused",e()};if(this._polling||!this.writable){let s=0;this._polling&&(s++,this.once("pollComplete",function(){--s||t()})),this.writable||(s++,this.once("drain",function(){--s||t()}))}else t()}_poll(){this._polling=!0,this.doPoll(),this.emitReserved("poll")}onData(e){const t=s=>{if(this.readyState==="opening"&&s.type==="open"&&this.onOpen(),s.type==="close")return this.onClose({description:"transport closed by the server"}),!1;this.onPacket(s)};Rt(e,this.socket.binaryType).forEach(t),this.readyState!=="closed"&&(this._polling=!1,this.emitReserved("pollComplete"),this.readyState==="open"&&this._poll())}doClose(){const e=()=>{this.write([{type:"close"}])};this.readyState==="open"?e():this.once("open",e)}write(e){this.writable=!1,Bt(e,t=>{this.doWrite(t,()=>{this.writable=!0,this.emitReserved("drain")})})}uri(){const e=this.opts.secure?"https":"http",t=this.query||{};return this.opts.timestampRequests!==!1&&(t[this.opts.timestampParam]=at()),!this.supportsBinary&&!t.sid&&(t.b64=1),this.createUri(e,t)}}let rt=!1;try{rt=typeof XMLHttpRequest<"u"&&"withCredentials"in new XMLHttpRequest}catch{}const Ft=rt;function jt(){}class Gt extends Ut{constructor(e){if(super(e),typeof location<"u"){const t=location.protocol==="https:";let s=location.port;s||(s=t?"443":"80"),this.xd=typeof location<"u"&&e.hostname!==location.hostname||s!==e.port}}doWrite(e,t){const s=this.request({method:"POST",data:e});s.on("success",t),s.on("error",(n,r)=>{this.onError("xhr post error",n,r)})}doPoll(){const e=this.request();e.on("data",this.onData.bind(this)),e.on("error",(t,s)=>{this.onError("xhr poll error",t,s)}),this.pollXhr=e}}class N extends g{constructor(e,t,s){super(),this.createRequest=e,pe(this,s),this._opts=s,this._method=s.method||"GET",this._uri=t,this._data=s.data!==void 0?s.data:null,this._create()}_create(){var e;const t=nt(this._opts,"agent","pfx","key","passphrase","cert","ca","ciphers","rejectUnauthorized","autoUnref");t.xdomain=!!this._opts.xd;const s=this._xhr=this.createRequest(t);try{s.open(this._method,this._uri,!0);try{if(this._opts.extraHeaders){s.setDisableHeaderCheck&&s.setDisableHeaderCheck(!0);for(let n in this._opts.extraHeaders)this._opts.extraHeaders.hasOwnProperty(n)&&s.setRequestHeader(n,this._opts.extraHeaders[n])}}catch{}if(this._method==="POST")try{s.setRequestHeader("Content-type","text/plain;charset=UTF-8")}catch{}try{s.setRequestHeader("Accept","*/*")}catch{}(e=this._opts.cookieJar)===null||e===void 0||e.addCookies(s),"withCredentials"in s&&(s.withCredentials=this._opts.withCredentials),this._opts.requestTimeout&&(s.timeout=this._opts.requestTimeout),s.onreadystatechange=()=>{var n;s.readyState===3&&((n=this._opts.cookieJar)===null||n===void 0||n.parseCookies(s.getResponseHeader("set-cookie"))),s.readyState===4&&(s.status===200||s.status===1223?this._onLoad():this.setTimeoutFn(()=>{this._onError(typeof s.status=="number"?s.status:0)},0))},s.send(this._data)}catch(n){this.setTimeoutFn(()=>{this._onError(n)},0);return}typeof document<"u"&&(this._index=N.requestsCount++,N.requests[this._index]=this)}_onError(e){this.emitReserved("error",e,this._xhr),this._cleanup(!0)}_cleanup(e){if(!(typeof this._xhr>"u"||this._xhr===null)){if(this._xhr.onreadystatechange=jt,e)try{this._xhr.abort()}catch{}typeof document<"u"&&delete N.requests[this._index],this._xhr=null}}_onLoad(){const e=this._xhr.responseText;e!==null&&(this.emitReserved("data",e),this.emitReserved("success"),this._cleanup())}abort(){this._cleanup()}}N.requestsCount=0;N.requests={};if(typeof document<"u"){if(typeof attachEvent=="function")attachEvent("onunload",Je);else if(typeof addEventListener=="function"){const i="onpagehide"in k?"pagehide":"unload";addEventListener(i,Je,!1)}}function Je(){for(let i in N.requests)N.requests.hasOwnProperty(i)&&N.requests[i].abort()}const zt=(function(){const i=ot({xdomain:!1});return i&&i.responseType!==null})();class Ht extends Gt{constructor(e){super(e);const t=e&&e.forceBase64;this.supportsBinary=zt&&!t}request(e={}){return Object.assign(e,{xd:this.xd},this.opts),new N(ot,this.uri(),e)}}function ot(i){const e=i.xdomain;try{if(typeof XMLHttpRequest<"u"&&(!e||Ft))return new XMLHttpRequest}catch{}if(!e)try{return new k[["Active"].concat("Object").join("X")]("Microsoft.XMLHTTP")}catch{}}const ct=typeof navigator<"u"&&typeof navigator.product=="string"&&navigator.product.toLowerCase()==="reactnative";class Wt extends Re{get name(){return"websocket"}doOpen(){const e=this.uri(),t=this.opts.protocols,s=ct?{}:nt(this.opts,"agent","perMessageDeflate","pfx","key","passphrase","cert","ca","ciphers","rejectUnauthorized","localAddress","protocolVersion","origin","maxPayload","family","checkServerIdentity");this.opts.extraHeaders&&(s.headers=this.opts.extraHeaders);try{this.ws=this.createSocket(e,t,s)}catch(n){return this.emitReserved("error",n)}this.ws.binaryType=this.socket.binaryType,this.addEventListeners()}addEventListeners(){this.ws.onopen=()=>{this.opts.autoUnref&&this.ws._socket.unref(),this.onOpen()},this.ws.onclose=e=>this.onClose({description:"websocket connection closed",context:e}),this.ws.onmessage=e=>this.onData(e.data),this.ws.onerror=e=>this.onError("websocket error",e)}write(e){this.writable=!1;for(let t=0;t<e.length;t++){const s=e[t],n=t===e.length-1;Ie(s,this.supportsBinary,r=>{try{this.doWrite(s,r)}catch{}n&&ue(()=>{this.writable=!0,this.emitReserved("drain")},this.setTimeoutFn)})}}doClose(){typeof this.ws<"u"&&(this.ws.onerror=()=>{},this.ws.close(),this.ws=null)}uri(){const e=this.opts.secure?"wss":"ws",t=this.query||{};return this.opts.timestampRequests&&(t[this.opts.timestampParam]=at()),this.supportsBinary||(t.b64=1),this.createUri(e,t)}}const ye=k.WebSocket||k.MozWebSocket;class Kt extends Wt{createSocket(e,t,s){return ct?new ye(e,t,s):t?new ye(e,t):new ye(e)}doWrite(e,t){this.ws.send(t)}}class Jt extends Re{get name(){return"webtransport"}doOpen(){try{this._transport=new WebTransport(this.createUri("https"),this.opts.transportOptions[this.name])}catch(e){return this.emitReserved("error",e)}this._transport.closed.then(()=>{this.onClose()}).catch(e=>{this.onError("webtransport error",e)}),this._transport.ready.then(()=>{this._transport.createBidirectionalStream().then(e=>{const t=Dt(Number.MAX_SAFE_INTEGER,this.socket.binaryType),s=e.readable.pipeThrough(t).getReader(),n=kt();n.readable.pipeTo(e.writable),this._writer=n.writable.getWriter();const r=()=>{s.read().then(({done:c,value:u})=>{c||(this.onPacket(u),r())}).catch(c=>{})};r();const a={type:"open"};this.query.sid&&(a.data=`{"sid":"${this.query.sid}"}`),this._writer.write(a).then(()=>this.onOpen())})})}write(e){this.writable=!1;for(let t=0;t<e.length;t++){const s=e[t],n=t===e.length-1;this._writer.write(s).then(()=>{n&&ue(()=>{this.writable=!0,this.emitReserved("drain")},this.setTimeoutFn)})}}doClose(){var e;(e=this._transport)===null||e===void 0||e.close()}}const Yt={websocket:Kt,webtransport:Jt,polling:Ht},Xt=/^(?:(?![^:@\/?#]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@\/?#]*)(?::([^:@\/?#]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/,Zt=["source","protocol","authority","userInfo","user","password","host","port","relative","path","directory","file","query","anchor"];function Ee(i){if(i.length>8e3)throw"URI too long";const e=i,t=i.indexOf("["),s=i.indexOf("]");t!=-1&&s!=-1&&(i=i.substring(0,t)+i.substring(t,s).replace(/:/g,";")+i.substring(s,i.length));let n=Xt.exec(i||""),r={},a=14;for(;a--;)r[Zt[a]]=n[a]||"";return t!=-1&&s!=-1&&(r.source=e,r.host=r.host.substring(1,r.host.length-1).replace(/;/g,":"),r.authority=r.authority.replace("[","").replace("]","").replace(/;/g,":"),r.ipv6uri=!0),r.pathNames=Qt(r,r.path),r.queryKey=ei(r,r.query),r}function Qt(i,e){const t=/\/{2,9}/g,s=e.replace(t,"/").split("/");return(e.slice(0,1)=="/"||e.length===0)&&s.splice(0,1),e.slice(-1)=="/"&&s.splice(s.length-1,1),s}function ei(i,e){const t={};return e.replace(/(?:^|&)([^&=]*)=?([^&]*)/g,function(s,n,r){n&&(t[n]=r)}),t}const we=typeof addEventListener=="function"&&typeof removeEventListener=="function",oe=[];we&&addEventListener("offline",()=>{oe.forEach(i=>i())},!1);class q extends g{constructor(e,t){if(super(),this.binaryType=xt,this.writeBuffer=[],this._prevBufferLen=0,this._pingInterval=-1,this._pingTimeout=-1,this._maxPayload=-1,this._pingTimeoutTime=1/0,e&&typeof e=="object"&&(t=e,e=null),e){const s=Ee(e);t.hostname=s.host,t.secure=s.protocol==="https"||s.protocol==="wss",t.port=s.port,s.query&&(t.query=s.query)}else t.host&&(t.hostname=Ee(t.host).host);pe(this,t),this.secure=t.secure!=null?t.secure:typeof location<"u"&&location.protocol==="https:",t.hostname&&!t.port&&(t.port=this.secure?"443":"80"),this.hostname=t.hostname||(typeof location<"u"?location.hostname:"localhost"),this.port=t.port||(typeof location<"u"&&location.port?location.port:this.secure?"443":"80"),this.transports=[],this._transportsByName={},t.transports.forEach(s=>{const n=s.prototype.name;this.transports.push(n),this._transportsByName[n]=s}),this.opts=Object.assign({path:"/engine.io",agent:!1,withCredentials:!1,upgrade:!0,timestampParam:"t",rememberUpgrade:!1,addTrailingSlash:!0,rejectUnauthorized:!0,perMessageDeflate:{threshold:1024},transportOptions:{},closeOnBeforeunload:!1},t),this.opts.path=this.opts.path.replace(/\/$/,"")+(this.opts.addTrailingSlash?"/":""),typeof this.opts.query=="string"&&(this.opts.query=Vt(this.opts.query)),we&&(this.opts.closeOnBeforeunload&&(this._beforeunloadEventListener=()=>{this.transport&&(this.transport.removeAllListeners(),this.transport.close())},addEventListener("beforeunload",this._beforeunloadEventListener,!1)),this.hostname!=="localhost"&&(this._offlineEventListener=()=>{this._onClose("transport close",{description:"network connection lost"})},oe.push(this._offlineEventListener))),this.opts.withCredentials&&(this._cookieJar=void 0),this._open()}createTransport(e){const t=Object.assign({},this.opts.query);t.EIO=st,t.transport=e,this.id&&(t.sid=this.id);const s=Object.assign({},this.opts,{query:t,socket:this,hostname:this.hostname,secure:this.secure,port:this.port},this.opts.transportOptions[e]);return new this._transportsByName[e](s)}_open(){if(this.transports.length===0){this.setTimeoutFn(()=>{this.emitReserved("error","No transports available")},0);return}const e=this.opts.rememberUpgrade&&q.priorWebsocketSuccess&&this.transports.indexOf("websocket")!==-1?"websocket":this.transports[0];this.readyState="opening";const t=this.createTransport(e);t.open(),this.setTransport(t)}setTransport(e){this.transport&&this.transport.removeAllListeners(),this.transport=e,e.on("drain",this._onDrain.bind(this)).on("packet",this._onPacket.bind(this)).on("error",this._onError.bind(this)).on("close",t=>this._onClose("transport close",t))}onOpen(){this.readyState="open",q.priorWebsocketSuccess=this.transport.name==="websocket",this.emitReserved("open"),this.flush()}_onPacket(e){if(this.readyState==="opening"||this.readyState==="open"||this.readyState==="closing")switch(this.emitReserved("packet",e),this.emitReserved("heartbeat"),e.type){case"open":this.onHandshake(JSON.parse(e.data));break;case"ping":this._sendPacket("pong"),this.emitReserved("ping"),this.emitReserved("pong"),this._resetPingTimeout();break;case"error":const t=new Error("server error");t.code=e.data,this._onError(t);break;case"message":this.emitReserved("data",e.data),this.emitReserved("message",e.data);break}}onHandshake(e){this.emitReserved("handshake",e),this.id=e.sid,this.transport.query.sid=e.sid,this._pingInterval=e.pingInterval,this._pingTimeout=e.pingTimeout,this._maxPayload=e.maxPayload,this.onOpen(),this.readyState!=="closed"&&this._resetPingTimeout()}_resetPingTimeout(){this.clearTimeoutFn(this._pingTimeoutTimer);const e=this._pingInterval+this._pingTimeout;this._pingTimeoutTime=Date.now()+e,this._pingTimeoutTimer=this.setTimeoutFn(()=>{this._onClose("ping timeout")},e),this.opts.autoUnref&&this._pingTimeoutTimer.unref()}_onDrain(){this.writeBuffer.splice(0,this._prevBufferLen),this._prevBufferLen=0,this.writeBuffer.length===0?this.emitReserved("drain"):this.flush()}flush(){if(this.readyState!=="closed"&&this.transport.writable&&!this.upgrading&&this.writeBuffer.length){const e=this._getWritablePackets();this.transport.send(e),this._prevBufferLen=e.length,this.emitReserved("flush")}}_getWritablePackets(){if(!(this._maxPayload&&this.transport.name==="polling"&&this.writeBuffer.length>1))return this.writeBuffer;let t=1;for(let s=0;s<this.writeBuffer.length;s++){const n=this.writeBuffer[s].data;if(n&&(t+=$t(n)),s>0&&t>this._maxPayload)return this.writeBuffer.slice(0,s);t+=2}return this.writeBuffer}_hasPingExpired(){if(!this._pingTimeoutTime)return!0;const e=Date.now()>this._pingTimeoutTime;return e&&(this._pingTimeoutTime=0,ue(()=>{this._onClose("ping timeout")},this.setTimeoutFn)),e}write(e,t,s){return this._sendPacket("message",e,t,s),this}send(e,t,s){return this._sendPacket("message",e,t,s),this}_sendPacket(e,t,s,n){if(typeof t=="function"&&(n=t,t=void 0),typeof s=="function"&&(n=s,s=null),this.readyState==="closing"||this.readyState==="closed")return;s=s||{},s.compress=s.compress!==!1;const r={type:e,data:t,options:s};this.emitReserved("packetCreate",r),this.writeBuffer.push(r),n&&this.once("flush",n),this.flush()}close(){const e=()=>{this._onClose("forced close"),this.transport.close()},t=()=>{this.off("upgrade",t),this.off("upgradeError",t),e()},s=()=>{this.once("upgrade",t),this.once("upgradeError",t)};return(this.readyState==="opening"||this.readyState==="open")&&(this.readyState="closing",this.writeBuffer.length?this.once("drain",()=>{this.upgrading?s():e()}):this.upgrading?s():e()),this}_onError(e){if(q.priorWebsocketSuccess=!1,this.opts.tryAllTransports&&this.transports.length>1&&this.readyState==="opening")return this.transports.shift(),this._open();this.emitReserved("error",e),this._onClose("transport error",e)}_onClose(e,t){if(this.readyState==="opening"||this.readyState==="open"||this.readyState==="closing"){if(this.clearTimeoutFn(this._pingTimeoutTimer),this.transport.removeAllListeners("close"),this.transport.close(),this.transport.removeAllListeners(),we&&(this._beforeunloadEventListener&&removeEventListener("beforeunload",this._beforeunloadEventListener,!1),this._offlineEventListener)){const s=oe.indexOf(this._offlineEventListener);s!==-1&&oe.splice(s,1)}this.readyState="closed",this.id=null,this.emitReserved("close",e,t),this.writeBuffer=[],this._prevBufferLen=0}}}q.protocol=st;class ti extends q{constructor(){super(...arguments),this._upgrades=[]}onOpen(){if(super.onOpen(),this.readyState==="open"&&this.opts.upgrade)for(let e=0;e<this._upgrades.length;e++)this._probe(this._upgrades[e])}_probe(e){let t=this.createTransport(e),s=!1;q.priorWebsocketSuccess=!1;const n=()=>{s||(t.send([{type:"ping",data:"probe"}]),t.once("packet",p=>{if(!s)if(p.type==="pong"&&p.data==="probe"){if(this.upgrading=!0,this.emitReserved("upgrading",t),!t)return;q.priorWebsocketSuccess=t.name==="websocket",this.transport.pause(()=>{s||this.readyState!=="closed"&&(A(),this.setTransport(t),t.send([{type:"upgrade"}]),this.emitReserved("upgrade",t),t=null,this.upgrading=!1,this.flush())})}else{const h=new Error("probe error");h.transport=t.name,this.emitReserved("upgradeError",h)}}))};function r(){s||(s=!0,A(),t.close(),t=null)}const a=p=>{const h=new Error("probe error: "+p);h.transport=t.name,r(),this.emitReserved("upgradeError",h)};function c(){a("transport closed")}function u(){a("socket closed")}function w(p){t&&p.name!==t.name&&r()}const A=()=>{t.removeListener("open",n),t.removeListener("error",a),t.removeListener("close",c),this.off("close",u),this.off("upgrading",w)};t.once("open",n),t.once("error",a),t.once("close",c),this.once("close",u),this.once("upgrading",w),this._upgrades.indexOf("webtransport")!==-1&&e!=="webtransport"?this.setTimeoutFn(()=>{s||t.open()},200):t.open()}onHandshake(e){this._upgrades=this._filterUpgrades(e.upgrades),super.onHandshake(e)}_filterUpgrades(e){const t=[];for(let s=0;s<e.length;s++)~this.transports.indexOf(e[s])&&t.push(e[s]);return t}}let ii=class extends ti{constructor(e,t={}){const s=typeof e=="object",n=s?{...e}:{...t};(!n.transports||n.transports&&typeof n.transports[0]=="string")&&(n.transports=(n.transports||["polling","websocket","webtransport"]).map(r=>Yt[r]).filter(r=>!!r)),super(s?n:e,n)}};function si(i,e="",t){let s=i;t=t||typeof location<"u"&&location,i==null&&(i=t.protocol+"//"+t.host),typeof i=="string"&&(i.charAt(0)==="/"&&(i.charAt(1)==="/"?i=t.protocol+i:i=t.host+i),/^(https?|wss?):\/\//.test(i)||(typeof t<"u"?i=t.protocol+"//"+i:i="https://"+i),s=Ee(i)),s.port||(/^(http|ws)$/.test(s.protocol)?s.port="80":/^(http|ws)s$/.test(s.protocol)&&(s.port="443")),s.path=s.path||"/";const r=s.host.indexOf(":")!==-1?"["+s.host+"]":s.host;return s.id=s.protocol+"://"+r+":"+s.port+e,s.href=s.protocol+"://"+r+(t&&t.port===s.port?"":":"+s.port),s}const ni=typeof ArrayBuffer=="function",ai=i=>typeof ArrayBuffer.isView=="function"?ArrayBuffer.isView(i):i.buffer instanceof ArrayBuffer,lt=Object.prototype.toString,ri=typeof Blob=="function"||typeof Blob<"u"&&lt.call(Blob)==="[object BlobConstructor]",oi=typeof File=="function"||typeof File<"u"&&lt.call(File)==="[object FileConstructor]";function ke(i){return ni&&(i instanceof ArrayBuffer||ai(i))||ri&&i instanceof Blob||oi&&i instanceof File}function ce(i,e){if(!i||typeof i!="object")return!1;if(Array.isArray(i)){for(let t=0,s=i.length;t<s;t++)if(ce(i[t]))return!0;return!1}if(ke(i))return!0;if(i.toJSON&&typeof i.toJSON=="function"&&arguments.length===1)return ce(i.toJSON(),!0);for(const t in i)if(Object.prototype.hasOwnProperty.call(i,t)&&ce(i[t]))return!0;return!1}function ci(i){const e=[],t=i.data,s=i;return s.data=Ae(t,e),s.attachments=e.length,{packet:s,buffers:e}}function Ae(i,e){if(!i)return i;if(ke(i)){const t={_placeholder:!0,num:e.length};return e.push(i),t}else if(Array.isArray(i)){const t=new Array(i.length);for(let s=0;s<i.length;s++)t[s]=Ae(i[s],e);return t}else if(typeof i=="object"&&!(i instanceof Date)){const t={};for(const s in i)Object.prototype.hasOwnProperty.call(i,s)&&(t[s]=Ae(i[s],e));return t}return i}function li(i,e){return i.data=Ce(i.data,e),delete i.attachments,i}function Ce(i,e){if(!i)return i;if(i&&i._placeholder===!0){if(typeof i.num=="number"&&i.num>=0&&i.num<e.length)return e[i.num];throw new Error("illegal attachments")}else if(Array.isArray(i))for(let t=0;t<i.length;t++)i[t]=Ce(i[t],e);else if(typeof i=="object")for(const t in i)Object.prototype.hasOwnProperty.call(i,t)&&(i[t]=Ce(i[t],e));return i}const di=["connect","connect_error","disconnect","disconnecting","newListener","removeListener"];var v;(function(i){i[i.CONNECT=0]="CONNECT",i[i.DISCONNECT=1]="DISCONNECT",i[i.EVENT=2]="EVENT",i[i.ACK=3]="ACK",i[i.CONNECT_ERROR=4]="CONNECT_ERROR",i[i.BINARY_EVENT=5]="BINARY_EVENT",i[i.BINARY_ACK=6]="BINARY_ACK"})(v||(v={}));class ui{constructor(e){this.replacer=e}encode(e){return(e.type===v.EVENT||e.type===v.ACK)&&ce(e)?this.encodeAsBinary({type:e.type===v.EVENT?v.BINARY_EVENT:v.BINARY_ACK,nsp:e.nsp,data:e.data,id:e.id}):[this.encodeAsString(e)]}encodeAsString(e){let t=""+e.type;return(e.type===v.BINARY_EVENT||e.type===v.BINARY_ACK)&&(t+=e.attachments+"-"),e.nsp&&e.nsp!=="/"&&(t+=e.nsp+","),e.id!=null&&(t+=e.id),e.data!=null&&(t+=JSON.stringify(e.data,this.replacer)),t}encodeAsBinary(e){const t=ci(e),s=this.encodeAsString(t.packet),n=t.buffers;return n.unshift(s),n}}class De extends g{constructor(e){super(),this.opts=Object.assign({reviver:void 0,maxAttachments:10},typeof e=="function"?{reviver:e}:e)}add(e){let t;if(typeof e=="string"){if(this.reconstructor)throw new Error("got plaintext data when reconstructing a packet");t=this.decodeString(e);const s=t.type===v.BINARY_EVENT;s||t.type===v.BINARY_ACK?(t.type=s?v.EVENT:v.ACK,this.reconstructor=new pi(t),t.attachments===0&&super.emitReserved("decoded",t)):super.emitReserved("decoded",t)}else if(ke(e)||e.base64)if(this.reconstructor)t=this.reconstructor.takeBinaryData(e),t&&(this.reconstructor=null,super.emitReserved("decoded",t));else throw new Error("got binary data when not reconstructing a packet");else throw new Error("Unknown type: "+e)}decodeString(e){let t=0;const s={type:Number(e.charAt(0))};if(v[s.type]===void 0)throw new Error("unknown packet type "+s.type);if(s.type===v.BINARY_EVENT||s.type===v.BINARY_ACK){const r=t+1;for(;e.charAt(++t)!=="-"&&t!=e.length;);const a=e.substring(r,t);if(a!=Number(a)||e.charAt(t)!=="-")throw new Error("Illegal attachments");const c=Number(a);if(!vi(c)||c<0)throw new Error("Illegal attachments");if(c>this.opts.maxAttachments)throw new Error("too many attachments");s.attachments=c}if(e.charAt(t+1)==="/"){const r=t+1;for(;++t&&!(e.charAt(t)===","||t===e.length););s.nsp=e.substring(r,t)}else s.nsp="/";const n=e.charAt(t+1);if(n!==""&&Number(n)==n){const r=t+1;for(;++t;){const a=e.charAt(t);if(a==null||Number(a)!=a){--t;break}if(t===e.length)break}s.id=Number(e.substring(r,t+1))}if(e.charAt(++t)){const r=this.tryParse(e.substr(t));if(De.isPayloadValid(s.type,r))s.data=r;else throw new Error("invalid payload")}return s}tryParse(e){try{return JSON.parse(e,this.opts.reviver)}catch{return!1}}static isPayloadValid(e,t){switch(e){case v.CONNECT:return Ye(t);case v.DISCONNECT:return t===void 0;case v.CONNECT_ERROR:return typeof t=="string"||Ye(t);case v.EVENT:case v.BINARY_EVENT:return Array.isArray(t)&&(typeof t[0]=="number"||typeof t[0]=="string"&&di.indexOf(t[0])===-1);case v.ACK:case v.BINARY_ACK:return Array.isArray(t)}}destroy(){this.reconstructor&&(this.reconstructor.finishedReconstruction(),this.reconstructor=null)}}class pi{constructor(e){this.packet=e,this.buffers=[],this.reconPack=e}takeBinaryData(e){if(this.buffers.push(e),this.buffers.length===this.reconPack.attachments){const t=li(this.reconPack,this.buffers);return this.finishedReconstruction(),t}return null}finishedReconstruction(){this.reconPack=null,this.buffers=[]}}const vi=Number.isInteger||function(i){return typeof i=="number"&&isFinite(i)&&Math.floor(i)===i};function Ye(i){return Object.prototype.toString.call(i)==="[object Object]"}const mi=Object.freeze(Object.defineProperty({__proto__:null,Decoder:De,Encoder:ui,get PacketType(){return v}},Symbol.toStringTag,{value:"Module"}));function D(i,e,t){return i.on(e,t),function(){i.off(e,t)}}const hi=Object.freeze({connect:1,connect_error:1,disconnect:1,disconnecting:1,newListener:1,removeListener:1});class dt extends g{constructor(e,t,s){super(),this.connected=!1,this.recovered=!1,this.receiveBuffer=[],this.sendBuffer=[],this._queue=[],this._queueSeq=0,this.ids=0,this.acks={},this.flags={},this.io=e,this.nsp=t,s&&s.auth&&(this.auth=s.auth),this._opts=Object.assign({},s),this.io._autoConnect&&this.open()}get disconnected(){return!this.connected}subEvents(){if(this.subs)return;const e=this.io;this.subs=[D(e,"open",this.onopen.bind(this)),D(e,"packet",this.onpacket.bind(this)),D(e,"error",this.onerror.bind(this)),D(e,"close",this.onclose.bind(this))]}get active(){return!!this.subs}connect(){return this.connected?this:(this.subEvents(),this.io._reconnecting||this.io.open(),this.io._readyState==="open"&&this.onopen(),this)}open(){return this.connect()}send(...e){return e.unshift("message"),this.emit.apply(this,e),this}emit(e,...t){var s,n,r;if(hi.hasOwnProperty(e))throw new Error('"'+e.toString()+'" is a reserved event name');if(t.unshift(e),this._opts.retries&&!this.flags.fromQueue&&!this.flags.volatile)return this._addToQueue(t),this;const a={type:v.EVENT,data:t};if(a.options={},a.options.compress=this.flags.compress!==!1,typeof t[t.length-1]=="function"){const A=this.ids++,p=t.pop();this._registerAckCallback(A,p),a.id=A}const c=(n=(s=this.io.engine)===null||s===void 0?void 0:s.transport)===null||n===void 0?void 0:n.writable,u=this.connected&&!(!((r=this.io.engine)===null||r===void 0)&&r._hasPingExpired());return this.flags.volatile&&!c||(u?(this.notifyOutgoingListeners(a),this.packet(a)):this.sendBuffer.push(a)),this.flags={},this}_registerAckCallback(e,t){var s;const n=(s=this.flags.timeout)!==null&&s!==void 0?s:this._opts.ackTimeout;if(n===void 0){this.acks[e]=t;return}const r=this.io.setTimeoutFn(()=>{delete this.acks[e];for(let c=0;c<this.sendBuffer.length;c++)this.sendBuffer[c].id===e&&this.sendBuffer.splice(c,1);t.call(this,new Error("operation has timed out"))},n),a=(...c)=>{this.io.clearTimeoutFn(r),t.apply(this,c)};a.withError=!0,this.acks[e]=a}emitWithAck(e,...t){return new Promise((s,n)=>{const r=(a,c)=>a?n(a):s(c);r.withError=!0,t.push(r),this.emit(e,...t)})}_addToQueue(e){let t;typeof e[e.length-1]=="function"&&(t=e.pop());const s={id:this._queueSeq++,tryCount:0,pending:!1,args:e,flags:Object.assign({fromQueue:!0},this.flags)};e.push((n,...r)=>(this._queue[0],n!==null?s.tryCount>this._opts.retries&&(this._queue.shift(),t&&t(n)):(this._queue.shift(),t&&t(null,...r)),s.pending=!1,this._drainQueue())),this._queue.push(s),this._drainQueue()}_drainQueue(e=!1){if(!this.connected||this._queue.length===0)return;const t=this._queue[0];t.pending&&!e||(t.pending=!0,t.tryCount++,this.flags=t.flags,this.emit.apply(this,t.args))}packet(e){e.nsp=this.nsp,this.io._packet(e)}onopen(){typeof this.auth=="function"?this.auth(e=>{this._sendConnectPacket(e)}):this._sendConnectPacket(this.auth)}_sendConnectPacket(e){this.packet({type:v.CONNECT,data:this._pid?Object.assign({pid:this._pid,offset:this._lastOffset},e):e})}onerror(e){this.connected||this.emitReserved("connect_error",e)}onclose(e,t){this.connected=!1,delete this.id,this.emitReserved("disconnect",e,t),this._clearAcks()}_clearAcks(){Object.keys(this.acks).forEach(e=>{if(!this.sendBuffer.some(s=>String(s.id)===e)){const s=this.acks[e];delete this.acks[e],s.withError&&s.call(this,new Error("socket has been disconnected"))}})}onpacket(e){if(e.nsp===this.nsp)switch(e.type){case v.CONNECT:e.data&&e.data.sid?this.onconnect(e.data.sid,e.data.pid):this.emitReserved("connect_error",new Error("It seems you are trying to reach a Socket.IO server in v2.x with a v3.x client, but they are not compatible (more information here: https://socket.io/docs/v3/migrating-from-2-x-to-3-0/)"));break;case v.EVENT:case v.BINARY_EVENT:this.onevent(e);break;case v.ACK:case v.BINARY_ACK:this.onack(e);break;case v.DISCONNECT:this.ondisconnect();break;case v.CONNECT_ERROR:this.destroy();const s=new Error(e.data.message);s.data=e.data.data,this.emitReserved("connect_error",s);break}}onevent(e){const t=e.data||[];e.id!=null&&t.push(this.ack(e.id)),this.connected?this.emitEvent(t):this.receiveBuffer.push(Object.freeze(t))}emitEvent(e){if(this._anyListeners&&this._anyListeners.length){const t=this._anyListeners.slice();for(const s of t)s.apply(this,e)}super.emit.apply(this,e),this._pid&&e.length&&typeof e[e.length-1]=="string"&&(this._lastOffset=e[e.length-1])}ack(e){const t=this;let s=!1;return function(...n){s||(s=!0,t.packet({type:v.ACK,id:e,data:n}))}}onack(e){const t=this.acks[e.id];typeof t=="function"&&(delete this.acks[e.id],t.withError&&e.data.unshift(null),t.apply(this,e.data))}onconnect(e,t){this.id=e,this.recovered=t&&this._pid===t,this._pid=t,this.connected=!0,this.emitBuffered(),this._drainQueue(!0),this.emitReserved("connect")}emitBuffered(){this.receiveBuffer.forEach(e=>this.emitEvent(e)),this.receiveBuffer=[],this.sendBuffer.forEach(e=>{this.notifyOutgoingListeners(e),this.packet(e)}),this.sendBuffer=[]}ondisconnect(){this.destroy(),this.onclose("io server disconnect")}destroy(){this.subs&&(this.subs.forEach(e=>e()),this.subs=void 0),this.io._destroy(this)}disconnect(){return this.connected&&this.packet({type:v.DISCONNECT}),this.destroy(),this.connected&&this.onclose("io client disconnect"),this}close(){return this.disconnect()}compress(e){return this.flags.compress=e,this}get volatile(){return this.flags.volatile=!0,this}timeout(e){return this.flags.timeout=e,this}onAny(e){return this._anyListeners=this._anyListeners||[],this._anyListeners.push(e),this}prependAny(e){return this._anyListeners=this._anyListeners||[],this._anyListeners.unshift(e),this}offAny(e){if(!this._anyListeners)return this;if(e){const t=this._anyListeners;for(let s=0;s<t.length;s++)if(e===t[s])return t.splice(s,1),this}else this._anyListeners=[];return this}listenersAny(){return this._anyListeners||[]}onAnyOutgoing(e){return this._anyOutgoingListeners=this._anyOutgoingListeners||[],this._anyOutgoingListeners.push(e),this}prependAnyOutgoing(e){return this._anyOutgoingListeners=this._anyOutgoingListeners||[],this._anyOutgoingListeners.unshift(e),this}offAnyOutgoing(e){if(!this._anyOutgoingListeners)return this;if(e){const t=this._anyOutgoingListeners;for(let s=0;s<t.length;s++)if(e===t[s])return t.splice(s,1),this}else this._anyOutgoingListeners=[];return this}listenersAnyOutgoing(){return this._anyOutgoingListeners||[]}notifyOutgoingListeners(e){if(this._anyOutgoingListeners&&this._anyOutgoingListeners.length){const t=this._anyOutgoingListeners.slice();for(const s of t)s.apply(this,e.data)}}}function K(i){i=i||{},this.ms=i.min||100,this.max=i.max||1e4,this.factor=i.factor||2,this.jitter=i.jitter>0&&i.jitter<=1?i.jitter:0,this.attempts=0}K.prototype.duration=function(){var i=this.ms*Math.pow(this.factor,this.attempts++);if(this.jitter){var e=Math.random(),t=Math.floor(e*this.jitter*i);i=(Math.floor(e*10)&1)==0?i-t:i+t}return Math.min(i,this.max)|0};K.prototype.reset=function(){this.attempts=0};K.prototype.setMin=function(i){this.ms=i};K.prototype.setMax=function(i){this.max=i};K.prototype.setJitter=function(i){this.jitter=i};class Se extends g{constructor(e,t){var s;super(),this.nsps={},this.subs=[],e&&typeof e=="object"&&(t=e,e=void 0),t=t||{},t.path=t.path||"/socket.io",this.opts=t,pe(this,t),this.reconnection(t.reconnection!==!1),this.reconnectionAttempts(t.reconnectionAttempts||1/0),this.reconnectionDelay(t.reconnectionDelay||1e3),this.reconnectionDelayMax(t.reconnectionDelayMax||5e3),this.randomizationFactor((s=t.randomizationFactor)!==null&&s!==void 0?s:.5),this.backoff=new K({min:this.reconnectionDelay(),max:this.reconnectionDelayMax(),jitter:this.randomizationFactor()}),this.timeout(t.timeout==null?2e4:t.timeout),this._readyState="closed",this.uri=e;const n=t.parser||mi;this.encoder=new n.Encoder,this.decoder=new n.Decoder,this._autoConnect=t.autoConnect!==!1,this._autoConnect&&this.open()}reconnection(e){return arguments.length?(this._reconnection=!!e,e||(this.skipReconnect=!0),this):this._reconnection}reconnectionAttempts(e){return e===void 0?this._reconnectionAttempts:(this._reconnectionAttempts=e,this)}reconnectionDelay(e){var t;return e===void 0?this._reconnectionDelay:(this._reconnectionDelay=e,(t=this.backoff)===null||t===void 0||t.setMin(e),this)}randomizationFactor(e){var t;return e===void 0?this._randomizationFactor:(this._randomizationFactor=e,(t=this.backoff)===null||t===void 0||t.setJitter(e),this)}reconnectionDelayMax(e){var t;return e===void 0?this._reconnectionDelayMax:(this._reconnectionDelayMax=e,(t=this.backoff)===null||t===void 0||t.setMax(e),this)}timeout(e){return arguments.length?(this._timeout=e,this):this._timeout}maybeReconnectOnOpen(){!this._reconnecting&&this._reconnection&&this.backoff.attempts===0&&this.reconnect()}open(e){if(~this._readyState.indexOf("open"))return this;this.engine=new ii(this.uri,this.opts);const t=this.engine,s=this;this._readyState="opening",this.skipReconnect=!1;const n=D(t,"open",function(){s.onopen(),e&&e()}),r=c=>{this.cleanup(),this._readyState="closed",this.emitReserved("error",c),e?e(c):this.maybeReconnectOnOpen()},a=D(t,"error",r);if(this._timeout!==!1){const c=this._timeout,u=this.setTimeoutFn(()=>{n(),r(new Error("timeout")),t.close()},c);this.opts.autoUnref&&u.unref(),this.subs.push(()=>{this.clearTimeoutFn(u)})}return this.subs.push(n),this.subs.push(a),this}connect(e){return this.open(e)}onopen(){this.cleanup(),this._readyState="open",this.emitReserved("open");const e=this.engine;this.subs.push(D(e,"ping",this.onping.bind(this)),D(e,"data",this.ondata.bind(this)),D(e,"error",this.onerror.bind(this)),D(e,"close",this.onclose.bind(this)),D(this.decoder,"decoded",this.ondecoded.bind(this)))}onping(){this.emitReserved("ping")}ondata(e){try{this.decoder.add(e)}catch(t){this.onclose("parse error",t)}}ondecoded(e){ue(()=>{this.emitReserved("packet",e)},this.setTimeoutFn)}onerror(e){this.emitReserved("error",e)}socket(e,t){let s=this.nsps[e];return s?this._autoConnect&&!s.active&&s.connect():(s=new dt(this,e,t),this.nsps[e]=s),s}_destroy(e){const t=Object.keys(this.nsps);for(const s of t)if(this.nsps[s].active)return;this._close()}_packet(e){const t=this.encoder.encode(e);for(let s=0;s<t.length;s++)this.engine.write(t[s],e.options)}cleanup(){this.subs.forEach(e=>e()),this.subs.length=0,this.decoder.destroy()}_close(){this.skipReconnect=!0,this._reconnecting=!1,this.onclose("forced close")}disconnect(){return this._close()}onclose(e,t){var s;this.cleanup(),(s=this.engine)===null||s===void 0||s.close(),this.backoff.reset(),this._readyState="closed",this.emitReserved("close",e,t),this._reconnection&&!this.skipReconnect&&this.reconnect()}reconnect(){if(this._reconnecting||this.skipReconnect)return this;const e=this;if(this.backoff.attempts>=this._reconnectionAttempts)this.backoff.reset(),this.emitReserved("reconnect_failed"),this._reconnecting=!1;else{const t=this.backoff.duration();this._reconnecting=!0;const s=this.setTimeoutFn(()=>{e.skipReconnect||(this.emitReserved("reconnect_attempt",e.backoff.attempts),!e.skipReconnect&&e.open(n=>{n?(e._reconnecting=!1,e.reconnect(),this.emitReserved("reconnect_error",n)):e.onreconnect()}))},t);this.opts.autoUnref&&s.unref(),this.subs.push(()=>{this.clearTimeoutFn(s)})}}onreconnect(){const e=this.backoff.attempts;this._reconnecting=!1,this.backoff.reset(),this.emitReserved("reconnect",e)}}const J={};function le(i,e){typeof i=="object"&&(e=i,i=void 0),e=e||{};const t=si(i,e.path||"/socket.io"),s=t.source,n=t.id,r=t.path,a=J[n]&&r in J[n].nsps,c=e.forceNew||e["force new connection"]||e.multiplex===!1||a;let u;return c?u=new Se(s,e):(J[n]||(J[n]=new Se(s,e)),u=J[n]),t.query&&!e.query&&(e.query=t.queryKey),u.socket(t.path,e)}Object.assign(le,{Manager:Se,Socket:dt,io:le,connect:le});const fi=[{title:"SERVIDORES",items:[["◈","Servidores","12"],["⌁","Invitaciones",""],["♧","Miembros",""],["♙","Roles",""],["▣","Canales",""],["▤","Logs del servidor",""]]},{title:"COMANDOS",items:[["⚙","Comandos","»"],["✣","Slash Commands",""],["▢","Mensajes",""],["◫","Auto Respuestas",""]]},{title:"MODERACIÓN",items:[["◆","Moderación","»"],["◉","Advertencias",""],["⊗","Baneos",""],["◔","Muteos",""],["⌁","Anti Raid",""],["✦","Auto Mod",""]]},{title:"SISTEMA",items:[["▤","Logs","»"],["◷","Auditoría",""],["□","Tareas programadas",""],["▣","Backups",""],["⌘","Webhooks",""]]},{title:"CONFIGURACIÓN",items:[["⚙","Configuración","»"],["✎","Personalización",""],["⌁","Variables de entorno",""],["◇","Tokens",""],["⊙","Permisos",""],["⌘","Integraciones",""]]}],yi=fi.map(i=>`
  <div class="side-group">
    <div class="side-title">${i.title}</div>
    ${i.items.map(([e,t,s])=>`
      <button class="side-item">
        <span class="side-icon">${e}</span>
        <span>${t}</span>
        ${s?`<b>${s}</b>`:""}
      </button>
    `).join("")}
  </div>
`).join("");document.querySelector("#app").innerHTML=`
  <div class="glow glow-a"></div>
  <div class="glow glow-b"></div>

  <div class="layout">
    <aside class="sidebar" id="sidebar">
      <div class="brand">
        <div class="brand-logo">N</div>
        <div>
          <strong>Nebula</strong>
          <span>BOT CONTROL</span>
        </div>
      </div>

      <button class="side-item dashboard-link active">
        <span class="side-icon">⌂</span>
        <span>Dashboard</span>
        <b>⌁</b>
      </button>

      <div class="sidebar-scroll">
        ${yi}
      </div>

      <div class="owner-card">
        <div class="owner-avatar">AM</div>
        <div class="owner-info">
          <strong>Alvi Moreyra</strong>
          <span>Propietario</span>
          <small>Premium</small>
        </div>
        <button>⚙</button>
      </div>
    </aside>

    <main class="main">
      <header class="topbar">
        <div class="top-left">
          <button class="hamburger" id="hamburger">☰</button>
          <div class="search">
            <span>⌕</span>
            <input placeholder="Buscar en el panel..." />
            <kbd>Ctrl K</kbd>
          </div>
        </div>

        <div class="top-right">
          <button class="circle-btn">♢</button>
          <button class="circle-btn">▣</button>
          <button class="circle-btn">⚙</button>
          <button class="circle-btn">?</button>
          <div class="top-profile">
            <div class="profile-avatar">AM</div>
            <div>
              <strong>Alvi Moreyra</strong>
              <span><i></i> En línea</span>
            </div>
            <b>⌄</b>
          </div>
        </div>
      </header>

      <section class="welcome-row">
        <div>
          <h1>¡Bienvenido de vuelta, <span>Alvi!</span> 👋</h1>
          <p>Aquí tienes un resumen completo de tu bot y servidores.</p>
        </div>
        <div class="welcome-actions">
          <div class="status-card">
            <i></i>
            <div>
              <span>Estado del bot</span>
              <strong>En línea</strong>
            </div>
          </div>
          <button class="invite-btn">＋ Invitar bot</button>
        </div>
      </section>

      <section class="stats-grid">
        <article class="stat-card purple-border">
          <div class="stat-icon purple">♛</div>
          <div><span>Servidores</span><strong data-count="12">0</strong><small>+2 este mes</small></div>
        </article>
        <article class="stat-card">
          <div class="stat-icon blue">♣</div>
          <div><span>Usuarios Totales</span><strong data-count="8745">0</strong><small>+342 este mes</small></div>
        </article>
        <article class="stat-card purple-border">
          <div class="stat-icon green">⌘</div>
          <div><span>Comandos Usados</span><strong data-count="25683">0</strong><small>+18.7% este mes</small></div>
        </article>
        <article class="stat-card">
          <div class="stat-icon yellow">▣</div>
          <div><span>Mensajes Enviados</span><strong data-count="134245">0</strong><small>+29.4% este mes</small></div>
        </article>
        <article class="stat-card purple-border">
          <div class="stat-icon pink">〽</div>
          <div><span>Uptime</span><strong>99.99%</strong><small>30 días</small></div>
        </article>
      </section>

      <section class="main-grid">
        <article class="panel performance">
          <div class="panel-head">
            <div><h3>Rendimiento del Bot</h3></div>
            <button>Últimos 7 días⌄</button>
          </div>

          <div class="chart-wrap">
            <div class="chart-labels"><span>40K</span><span>30K</span><span>20K</span><span>10K</span><span>0</span></div>
            <div class="chart">
              <div class="grid-line g1"></div><div class="grid-line g2"></div><div class="grid-line g3"></div><div class="grid-line g4"></div><div class="grid-line g5"></div>
              <svg viewBox="0 0 760 300" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="purpleArea" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="#8b5cf6" stop-opacity=".65"/>
                    <stop offset="100%" stop-color="#8b5cf6" stop-opacity=".04"/>
                  </linearGradient>
                </defs>
                <path class="area" d="M0 235 C55 185 90 165 140 125 C195 84 255 150 310 135 C375 118 420 100 475 122 C530 138 580 90 635 105 C690 118 720 82 760 72 L760 300 L0 300 Z"/>
                <path class="line" d="M0 235 C55 185 90 165 140 125 C195 84 255 150 310 135 C375 118 420 100 475 122 C530 138 580 90 635 105 C690 118 720 82 760 72"/>
                <g class="points">
                  <circle cx="0" cy="235" r="4"/><circle cx="140" cy="125" r="4"/><circle cx="310" cy="135" r="4"/><circle cx="475" cy="122" r="4"/><circle cx="635" cy="105" r="4"/><circle cx="760" cy="72" r="4"/>
                </g>
              </svg>
              <div class="chart-days"><span>Lun</span><span>Mar</span><span>Mié</span><span>Jue</span><span>Vie</span><span>Sáb</span><span>Dom</span></div>
            </div>
          </div>

          <div class="metric-strip">
            <div><span>◔</span><strong>25.6K</strong><small>Comandos</small></div>
            <div><span>⌘</span><strong>134K</strong><small>Mensajes</small></div>
            <div><span>♣</span><strong>8.7K</strong><small>Usuarios</small></div>
            <div><span>◉</span><strong>99.99%</strong><small>Uptime</small></div>
          </div>
        </article>

        <article class="panel health">
          <div class="panel-head"><h3>Estado del Sistema</h3></div>
          <div class="health-ring">
            <div class="health-core"><strong>100%</strong><span>Salud del sistema</span></div>
          </div>
          <div class="health-list">
            ${["API Discord","Base de Datos","Servidores","Web Dashboard","Sistema de Logs"].map(i=>`<div><span><i></i>${i}</span><strong>Operativo</strong></div>`).join("")}
          </div>
        </article>

        <article class="panel activity">
          <div class="panel-head"><h3>Actividad Reciente</h3><button>Ver todo</button></div>
          <div class="activity-list">
            <div class="activity-item"><i class="green">◎</i><div><strong>Nuevo servidor conectado</strong><span>Nebula Community</span></div><time>hace 2 min</time></div>
            <div class="activity-item"><i class="purple">⌘</i><div><strong>Comando ejecutado</strong><span>/verify @usuario</span></div><time>hace 3 min</time></div>
            <div class="activity-item"><i class="red">●</i><div><strong>Usuario baneado</strong><span>Usuario#1234</span></div><time>hace 8 min</time></div>
            <div class="activity-item"><i class="blue">⌁</i><div><strong>Nueva invitación creada</strong><span>discord.gg/nebula</span></div><time>hace 15 min</time></div>
            <div class="activity-item"><i class="purple">▣</i><div><strong>Backup automático</strong><span>Base de datos</span></div><time>hace 30 min</time></div>
            <div class="activity-item"><i class="green">□</i><div><strong>Actualización del sistema</strong><span>Versión 2.4.1</span></div><time>hace 1 hora</time></div>
          </div>
        </article>
      </section>

      <section class="lower-grid">
        <article class="panel commands-panel">
          <div class="panel-head"><h3>Uso de Comandos</h3><button>Últimos 7 días⌄</button></div>
          <div class="donut-wrap">
            <div class="donut"><div><strong>25.683</strong><span>Total</span></div></div>
            <div class="command-legend">
              <div><span><i class="c1"></i>/verify</span><strong>8.429</strong><small>32.8%</small></div>
              <div><span><i class="c2"></i>/setup</span><strong>4.326</strong><small>16.8%</small></div>
              <div><span><i class="c3"></i>/ban</span><strong>3.782</strong><small>14.7%</small></div>
              <div><span><i class="c4"></i>/kick</span><strong>2.945</strong><small>11.5%</small></div>
              <div><span><i class="c5"></i>/mute</span><strong>2.156</strong><small>8.4%</small></div>
              <div><span><i class="c6"></i>Otros</span><strong>3.045</strong><small>11.8%</small></div>
            </div>
          </div>
        </article>

        <article class="panel servers-panel">
          <div class="panel-head"><h3>Servidores Más Activos</h3><button>Ver todos</button></div>
          <div class="server-list">
            ${[["NC","Nebula Community","1.245 usuarios","89%"],["GZ","Gaming Zone","987 usuarios","75%"],["TD","Team Developers","756 usuarios","62%"],["AW","Anime World","654 usuarios","48%"],["CL","Chill Lounge","432 usuarios","35%"]].map(([i,e,t,s])=>`
              <div class="server-item">
                <div class="server-logo">${i}</div>
                <div class="server-copy"><strong>${e}</strong><span>${t}</span></div>
                <div class="server-progress"><span style="width:${s}"></span></div>
                <b>${s}</b>
              </div>`).join("")}
          </div>
        </article>

        <article class="panel bot-info">
          <div class="panel-head"><h3>Información del Bot</h3></div>
          <div class="bot-visual">
            <div class="bot-orbit orbit-1"></div>
            <div class="bot-orbit orbit-2"></div>
            <div class="bot-orbit orbit-3"></div>
            <div class="bot-core">N</div>
          </div>
          <div class="bot-table">
            <div><span>Nombre</span><strong>Nebula Bot</strong></div>
            <div><span>Versión</span><strong>2.4.1</strong></div>
            <div><span>Desarrollador</span><strong>Alvi Moreyra</strong></div>
            <div><span>Librería</span><strong>Discord.js v14</strong></div>
            <div><span>Servidor</span><strong>Render (Free)</strong></div>
            <div><span>RAM</span><strong>86.4 MB</strong></div>
            <div><span>CPU</span><strong>2.3%</strong></div>
          </div>
        </article>
      </section>

      <section class="footer-status">
        <div><span class="footer-icon purple">〽</span><div><small>Latencia</small><strong>38ms</strong></div></div>
        <div><span class="footer-icon purple">◎</span><div><small>Región</small><strong>South America</strong></div></div>
        <div><span class="footer-icon green">⌁</span><div><small>Conexión</small><strong class="green-text">Estable</strong></div></div>
        <div><span class="footer-icon yellow">◉</span><div><small>Bot Uptime</small><strong>30d 14h 23m</strong></div></div>
        <div><span class="footer-icon red">▣</span><div><small>Versión del Panel</small><strong>2.4.1</strong></div></div>
      </section>
    </main>
  </div>

  <div class="toast" id="toast">
    <span>✓</span>
    <div><strong>Demo visual</strong><p>Esta función se conectará en el siguiente paso.</p></div>
  </div>
`;const B=document.getElementById("toast"),x=()=>{B.classList.add("show"),clearTimeout(window.toastTimer),window.toastTimer=setTimeout(()=>B.classList.remove("show"),2300)};document.querySelectorAll("button").forEach(i=>{i.addEventListener("click",()=>{i.id!=="hamburger"&&x()})});document.querySelectorAll(".side-item").forEach(i=>{i.addEventListener("click",()=>{document.querySelectorAll(".side-item").forEach(e=>e.classList.remove("active")),i.classList.add("active")})});const gi=document.getElementById("sidebar");document.getElementById("hamburger").addEventListener("click",()=>gi.classList.toggle("open"));document.addEventListener("keydown",i=>{i.ctrlKey&&i.key.toLowerCase()==="k"&&(i.preventDefault(),document.querySelector(".search input").focus())});const X=document.getElementById("space"),W=X.getContext("2d");let ut=[];function pt(){X.width=innerWidth*devicePixelRatio,X.height=innerHeight*devicePixelRatio,X.style.width=innerWidth+"px",X.style.height=innerHeight+"px",W.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0),ut=Array.from({length:90},()=>({x:Math.random()*innerWidth,y:Math.random()*innerHeight,r:Math.random()*1.3+.2,a:Math.random()*.45+.05,s:Math.random()*.12+.02}))}function vt(){W.clearRect(0,0,innerWidth,innerHeight),ut.forEach(i=>{i.y-=i.s,i.y<0&&(i.y=innerHeight),W.beginPath(),W.arc(i.x,i.y,i.r,0,Math.PI*2),W.fillStyle=`rgba(167,139,250,${i.a})`,W.fill()}),requestAnimationFrame(vt)}pt();vt();addEventListener("resize",pt);const bi=document.querySelector(".main"),Ei=document.querySelector(".topbar"),b=document.createElement("div");b.id="pageContent";let ne=Ei.nextElementSibling;for(;ne;){const i=ne.nextElementSibling;b.appendChild(ne),ne=i}bi.appendChild(b);const wi=b.innerHTML,Oe={Servidores:{eyebrow:"SERVIDORES",title:"Tus servidores",description:"Seleccioná un servidor para administrar sus funciones, permisos y configuración.",action:"＋ Agregar servidor",type:"servers"},Invitaciones:{eyebrow:"SERVIDORES",title:"Invitaciones",description:"Creá, controlá y eliminá enlaces de invitación para tus comunidades.",action:"＋ Nueva invitación",type:"invitations"},Miembros:{eyebrow:"COMUNIDAD",title:"Miembros",description:"Buscá usuarios, revisá sus roles y consultá su actividad reciente.",action:"Exportar lista",type:"members"},Roles:{eyebrow:"COMUNIDAD",title:"Roles",description:"Organizá la jerarquía y los permisos de cada rol del servidor.",action:"＋ Crear rol",type:"roles"},Canales:{eyebrow:"ESTRUCTURA",title:"Canales",description:"Administrá canales de texto, voz, categorías y permisos.",action:"＋ Crear canal",type:"channels"},"Logs del servidor":{eyebrow:"REGISTROS",title:"Logs del servidor",description:"Consultá eventos, mensajes eliminados y movimientos administrativos.",action:"Exportar logs",type:"logs"},Comandos:{eyebrow:"COMANDOS",title:"Comandos",description:"Activá, desactivá y personalizá las funciones principales del bot.",action:"＋ Crear comando",type:"commands"},"Slash Commands":{eyebrow:"COMANDOS",title:"Slash Commands",description:"Gestioná los comandos que aparecen al escribir / dentro de Discord.",action:"Sincronizar",type:"slash"},Mensajes:{eyebrow:"MENSAJES",title:"Mensajes automáticos",description:"Diseñá mensajes de bienvenida, despedida, anuncios y verificaciones.",action:"＋ Nuevo mensaje",type:"messages"},"Auto Respuestas":{eyebrow:"AUTOMATIZACIÓN",title:"Auto Respuestas",description:"Configurá respuestas automáticas mediante palabras o frases clave.",action:"＋ Nueva respuesta",type:"responses"},Moderación:{eyebrow:"SEGURIDAD",title:"Centro de moderación",description:"Accedé rápidamente a todas las herramientas de control del servidor.",action:"Abrir historial",type:"moderation"},Advertencias:{eyebrow:"MODERACIÓN",title:"Advertencias",description:"Registrá faltas, motivos, responsables y vencimientos.",action:"＋ Advertir usuario",type:"warnings"},Baneos:{eyebrow:"MODERACIÓN",title:"Baneos",description:"Administrá usuarios bloqueados y revisá los motivos de cada sanción.",action:"＋ Banear usuario",type:"bans"},Muteos:{eyebrow:"MODERACIÓN",title:"Muteos",description:"Aplicá silenciamientos temporales y revisá los que siguen activos.",action:"＋ Mutear usuario",type:"mutes"},"Anti Raid":{eyebrow:"PROTECCIÓN",title:"Anti Raid",description:"Protegé el servidor contra ingresos masivos y comportamientos sospechosos.",action:"Activar protección",type:"antiraid"},"Auto Mod":{eyebrow:"PROTECCIÓN",title:"Auto Mod",description:"Filtrá spam, enlaces, menciones masivas y palabras prohibidas.",action:"Guardar reglas",type:"automod"},Logs:{eyebrow:"SISTEMA",title:"Logs generales",description:"Revisá todas las acciones realizadas por el bot y el dashboard.",action:"Descargar",type:"logs"},Auditoría:{eyebrow:"SISTEMA",title:"Auditoría",description:"Identificá quién realizó cada cambio dentro del panel.",action:"Filtrar actividad",type:"audit"},"Tareas programadas":{eyebrow:"AUTOMATIZACIÓN",title:"Tareas programadas",description:"Programá anuncios, limpiezas, backups y acciones automáticas.",action:"＋ Programar tarea",type:"tasks"},Backups:{eyebrow:"SISTEMA",title:"Backups",description:"Guardá y restaurá configuraciones del servidor de forma segura.",action:"Crear backup",type:"backups"},Webhooks:{eyebrow:"INTEGRACIONES",title:"Webhooks",description:"Conectá servicios externos para recibir y enviar información.",action:"＋ Crear webhook",type:"webhooks"},Configuración:{eyebrow:"AJUSTES",title:"Configuración general",description:"Definí la identidad, el estado y el comportamiento principal del bot.",action:"Guardar cambios",type:"settings"},Personalización:{eyebrow:"APARIENCIA",title:"Personalización",description:"Cambiá colores, textos, imágenes y estilo visual del panel.",action:"Aplicar diseño",type:"customize"},"Variables de entorno":{eyebrow:"DESARROLLO",title:"Variables de entorno",description:"Prepará las variables que usaremos luego en Render sin mostrar secretos reales.",action:"Guardar variables",type:"environment"},Tokens:{eyebrow:"SEGURIDAD",title:"Tokens",description:"Visualizá el estado de las credenciales sin exponer su contenido.",action:"Actualizar token",type:"tokens"},Permisos:{eyebrow:"SEGURIDAD",title:"Permisos del bot",description:"Revisá qué acciones puede realizar el bot dentro de Discord.",action:"Guardar permisos",type:"permissions"},Integraciones:{eyebrow:"CONEXIONES",title:"Integraciones",description:"Prepará conexiones con Discord, Render, GitHub y otros servicios.",action:"＋ Conectar servicio",type:"integrations"}};function de(i){return`
    <section class="section-header">
      <div>
        <span>${i.eyebrow}</span>
        <h1>${i.title}</h1>
        <p>${i.description}</p>
      </div>
      <button class="section-action">${i.action}</button>
    </section>
  `}function P(i){return`
    <section class="section-metrics">
      ${i.map(([e,t,s,n,r="purple"])=>`
        <article class="section-metric">
          <i class="${r}">${e}</i>
          <div><span>${t}</span><strong>${s}</strong><small>${n}</small></div>
        </article>
      `).join("")}
    </section>
  `}function j(i,e){return`
    <article class="section-panel">
      <div class="section-panel-head">
        <div><span>INFORMACIÓN</span><h3>Actividad reciente</h3></div>
        <div class="section-search">⌕ <input placeholder="Buscar..." /></div>
      </div>
      <div class="data-table" style="--columns:${i.length}">
        <div class="data-row data-head">${i.map(t=>`<span>${t}</span>`).join("")}</div>
        ${e.map(t=>`<div class="data-row">${t.map(s=>`<span>${s}</span>`).join("")}</div>`).join("")}
      </div>
    </article>
  `}function ge(i){return`
    <div class="settings-layout">
      <article class="section-panel">
        <div class="section-panel-head"><div><span>CONTROLES</span><h3>Funciones disponibles</h3></div></div>
        <div class="toggle-list">
          ${i.map(([e,t,s])=>`
            <div class="toggle-row">
              <div><strong>${e}</strong><p>${t}</p></div>
              <label class="switch-control"><input type="checkbox" ${s?"checked":""}><span></span></label>
            </div>
          `).join("")}
        </div>
      </article>
      <article class="section-panel preview-panel">
        <div class="section-panel-head"><div><span>ESTADO</span><h3>Resumen visual</h3></div></div>
        <div class="preview-orbit">
          <div class="preview-ring one"></div><div class="preview-ring two"></div>
          <div class="preview-core">N</div>
        </div>
        <div class="preview-status"><i></i><span>Configuración preparada</span><strong>ONLINE</strong></div>
      </article>
    </div>
  `}function $(i){return`<section class="feature-grid">${i.map(([e,t,s,n])=>`
    <article class="feature-card">
      <div class="feature-top"><i>${e}</i><span>${n}</span></div>
      <h3>${t}</h3><p>${s}</p>
      <button>Administrar <b>›</b></button>
    </article>
  `).join("")}</section>`}function Xe(i){return`
    <div class="settings-layout">
      <article class="section-panel">
        <div class="section-panel-head"><div><span>CONFIGURACIÓN</span><h3>Datos principales</h3></div></div>
        <div class="form-grid">
          ${i.map(([e,t,s=!1])=>`
            <label class="form-field ${s?"wide":""}">
              <span>${e}</span>
              <input value="${t}" />
            </label>
          `).join("")}
        </div>
      </article>
      <article class="section-panel">
        <div class="section-panel-head"><div><span>VISTA PREVIA</span><h3>Nebula Bot</h3></div></div>
        <div class="discord-preview">
          <div class="discord-banner"></div>
          <div class="discord-avatar">N</div>
          <h3>Nebula Bot <small>BOT</small></h3>
          <span><i></i> En línea</span>
          <p>Tu asistente avanzado para administración, moderación y automatización.</p>
        </div>
      </article>
    </div>
  `}function Ai(i){switch(i){case"servers":return P([["◈","Servidores conectados","12","+2 este mes"],["♣","Miembros totales","8.745","+342 este mes","blue"],["●","Usuarios online","1.286","Ahora","green"],["⌘","Comandos hoy","3.248","+18.7%","yellow"]])+$([["NC","Nebula Community","Servidor principal · 1.245 miembros","89% activo"],["GZ","Gaming Zone","Comunidad gamer · 987 miembros","75% activo"],["TD","Team Developers","Desarrollo y tecnología · 756 miembros","62% activo"],["＋","Agregar servidor","Invitá a Nebula Bot a otra comunidad","NUEVO"]]);case"invitations":return P([["⌁","Invitaciones activas","18","6 temporales"],["♣","Usos totales","2.846","+92 hoy","blue"],["◷","Próximas a vencer","3","En 24 horas","yellow"]])+j(["Código","Canal","Usos","Vencimiento","Estado"],[["nebula-main","#bienvenida","1.284","Nunca","<b class='good'>Activa</b>"],["gaming-zone","#general","642","7 días","<b class='good'>Activa</b>"],["evento-vip","#eventos","128","18 horas","<b class='warn'>Temporal</b>"]]);case"members":return P([["♣","Miembros","8.745","+342 este mes"],["●","En línea","1.286","14.7%","green"],["◇","Con roles","8.102","92.6%","blue"],["◉","Nuevos hoy","76","+12%","yellow"]])+j(["Usuario","Rol principal","Ingreso","Mensajes","Estado"],[["<b>Alvi Moreyra</b>","Propietario","12/05/2024","18.492","<b class='good'>En línea</b>"],["Juan Cruz","Administrador","02/07/2025","7.824","Ausente"],["NovaUser","Miembro","11/07/2026","1.209","<b class='good'>En línea</b>"]]);case"roles":return $([["♛","Propietario","Control total del servidor y del dashboard.","1 miembro"],["◆","Administrador","Moderación, configuración y registros.","6 miembros"],["◇","Moderador","Control de mensajes y usuarios.","14 miembros"],["●","Miembro","Acceso general a la comunidad.","8.102 miembros"],["＋","Crear nuevo rol","Agregá una nueva jerarquía personalizada.","NUEVO"]]);case"channels":return $([["#","bienvenida","Canal de entrada y verificación.","Texto"],["#","general","Conversaciones principales de la comunidad.","Texto"],["◖","Sala General","Canal de voz para todos los miembros.","Voz"],["▣","Administración","Categoría privada del equipo.","Categoría"],["＋","Crear canal","Agregá un canal nuevo al servidor.","NUEVO"]]);case"commands":case"slash":return P([["⌘","Comandos activos","24","Todos sincronizados"],["◉","Ejecuciones","25.683","+18.7%"],["⚡","Tiempo medio","82 ms","Excelente","green"]])+j(["Comando","Descripción","Usos","Permiso","Estado"],[["/verify","Verifica usuarios y asigna roles","8.429","Todos","<b class='good'>Activo</b>"],["/clean","Elimina una cantidad de mensajes","4.326","Moderador","<b class='good'>Activo</b>"],["/data","Muestra datos del usuario verificado","3.782","Administrador","<b class='good'>Activo</b>"],["/invite","Genera el enlace del bot","2.945","Todos","<b class='good'>Activo</b>"]]);case"messages":return $([["👋","Bienvenida","Mensaje enviado cuando ingresa un nuevo miembro.","ACTIVO"],["🚪","Despedida","Aviso cuando un miembro abandona el servidor.","ACTIVO"],["✅","Verificación","Panel para verificar y asignar roles.","ACTIVO"],["📣","Anuncios","Mensajes especiales y programados.","BORRADOR"]]);case"responses":return j(["Palabra clave","Respuesta","Canal","Usos","Estado"],[["hola","¡Hola! Bienvenido a nuestra comunidad.","Todos","846","<b class='good'>Activa</b>"],["reglas","Podés leer las reglas en #reglas.","Todos","514","<b class='good'>Activa</b>"],["soporte","Abrí un ticket desde #soporte.","Ayuda","302","<b class='good'>Activa</b>"]]);case"moderation":return P([["◆","Acciones hoy","148","+22%"],["◉","Advertencias","32","8 activas","yellow"],["⊗","Baneos","12","Este mes","red"],["◔","Muteos activos","7","Ahora","blue"]])+$([["◉","Advertir usuario","Registrá una falta con motivo y evidencia.","ABRIR"],["◔","Mutear usuario","Silenciá temporalmente a un miembro.","ABRIR"],["⊗","Banear usuario","Bloqueá el acceso de forma permanente.","ABRIR"],["▤","Revisar historial","Consultá sanciones y responsables.","ABRIR"]]);case"warnings":case"bans":case"mutes":return j(["Usuario","Motivo","Responsable","Duración","Estado"],[["Usuario#4521","Spam reiterado","Alvi","24 horas","<b class='warn'>Activo</b>"],["PlayerNova","Insultos","Moderador01","7 días","<b class='warn'>Activo</b>"],["TestUser","Enlaces prohibidos","Auto Mod","Finalizado","Completado"]]);case"antiraid":case"automod":return P([["⌁","Amenazas bloqueadas","286","Últimos 30 días"],["●","Nivel de protección","Alto","Recomendado","green"],["⚡","Respuesta media","41 ms","Excelente","blue"]])+ge([["Detección de ingresos masivos","Bloquea oleadas de cuentas nuevas.",!0],["Filtro de enlaces","Impide dominios no autorizados.",!0],["Menciones masivas","Controla @everyone y spam de menciones.",!0],["Cuentas nuevas","Aplica restricciones a cuentas recientes.",!1],["Modo emergencia","Bloqueo temporal completo del servidor.",!1]]);case"logs":case"audit":return P([["▤","Eventos hoy","2.648","+14%"],["♣","Administradores","7","Con actividad"],["◷","Último evento","Hace 1 min","Actualizado","green"]])+j(["Evento","Usuario","Servidor","Fecha","Resultado"],[["Configuración actualizada","Alvi Moreyra","Nebula Community","23:41","<b class='good'>Correcto</b>"],["Mensajes eliminados","Moderador01","Gaming Zone","23:36","<b class='good'>Correcto</b>"],["Intento de acceso","Unknown","Team Developers","23:31","<b class='warn'>Revisar</b>"]]);case"tasks":return $([["◷","Anuncio diario","Se ejecuta todos los días a las 09:00.","ACTIVA"],["▣","Backup automático","Guarda la configuración cada 12 horas.","ACTIVA"],["⌘","Limpieza semanal","Elimina mensajes antiguos los domingos.","ACTIVA"],["＋","Nueva tarea","Programá otra acción automática.","NUEVO"]]);case"backups":return P([["▣","Backups guardados","18","Últimos 30 días"],["◷","Último backup","Hace 2 horas","Correcto","green"],["◇","Espacio usado","42 MB","de 500 MB","blue"]])+j(["Nombre","Servidor","Fecha","Tamaño","Estado"],[["Backup automático #018","Nebula Community","Hoy 21:30","2.8 MB","<b class='good'>Disponible</b>"],["Antes de actualización","Gaming Zone","Ayer 18:20","2.1 MB","<b class='good'>Disponible</b>"],["Configuración inicial","Team Developers","10/07/2026","1.7 MB","<b class='good'>Disponible</b>"]]);case"webhooks":case"integrations":return $([["⌘","Discord","Bot, OAuth2 y eventos del servidor.","CONECTADO"],["◈","Render","Alojamiento gratuito del bot y dashboard.","PREPARADO"],["◆","GitHub","Código, versiones y despliegue automático.","PENDIENTE"],["▣","Base de datos","Guardado de configuraciones y usuarios.","PENDIENTE"],["＋","Nueva integración","Conectá otro servicio externo.","NUEVO"]]);case"settings":return Xe([["Nombre del bot","Nebula Bot"],["Estado","Protegiendo tu servidor"],["Prefijo","/"],["Idioma","Español"],["Descripción","Bot avanzado de administración y moderación.",!0],["Mensaje de actividad","Usá /help para ver los comandos.",!0]]);case"customize":return ge([["Animaciones del panel","Activa transiciones, partículas y efectos.",!0],["Fondo espacial","Muestra estrellas en movimiento.",!0],["Modo compacto","Reduce el tamaño de tarjetas y espacios.",!1],["Sonidos del panel","Reproduce sonidos en las acciones.",!1],["Efecto neón","Aumenta los brillos violetas.",!0]]);case"environment":return Xe([["DISCORD_TOKEN","••••••••••••••••"],["CLIENT_ID","Pendiente"],["CLIENT_SECRET","••••••••••••••••"],["DATABASE_URL","Pendiente"],["REDIRECT_URI",`${window.location.origin}/auth/discord/callback`,!0],["SESSION_SECRET","••••••••••••••••",!0]]);case"tokens":return $([["◇","Token del bot","Credencial principal de conexión con Discord.","PROTEGIDO"],["⌘","Client ID","Identificador público de la aplicación.","PENDIENTE"],["◆","Client Secret","Secreto utilizado para OAuth2.","PROTEGIDO"],["◷","Última rotación","El token aún no fue conectado.","SIN DATOS"]]);case"permissions":return ge([["Administrar servidor","Permite cambiar configuraciones generales.",!0],["Administrar roles","Permite crear, editar y asignar roles.",!0],["Administrar canales","Permite crear y modificar canales.",!0],["Banear miembros","Permite bloquear usuarios.",!0],["Expulsar miembros","Permite quitar usuarios.",!0],["Administrador total","Otorga todos los permisos disponibles.",!1]]);default:return $([["✦","Sección preparada","La interfaz ya está lista para conectarse en las próximas etapas.","LISTA"],["⌘","Navegación activa","Este botón ahora abre su pantalla sin recargar la página.","ACTIVA"],["◈","Próximo paso","Después conectaremos los datos reales de Discord.","PENDIENTE"]])}}async function Ci(i){if(i==="Dashboard"){b.innerHTML=wi,Te(),mt();return}if(i==="Servidores"){await ve();return}const e=Oe[i]||{eyebrow:"NEBULA",title:i,description:"Esta sección ya forma parte de la navegación principal.",action:"Guardar cambios",type:"default"};b.innerHTML=`
    <div class="dynamic-page">
      ${de(e)}
      ${Ai(e.type)}
    </div>
  `,Te(),window.scrollTo({top:0,behavior:"smooth"})}function Te(){b.querySelectorAll("button").forEach(i=>{i.addEventListener("click",x)}),b.querySelectorAll(".switch-control input").forEach(i=>{i.addEventListener("change",x)})}document.querySelectorAll(".side-item").forEach(i=>{i.addEventListener("click",()=>{const e=i.querySelector("span:nth-child(2)")?.textContent.trim();e&&Ci(e)})});const R=window.location.origin;async function mt(){try{const i=await fetch(`${R}/api/dashboard`);if(!i.ok)throw new Error(`Error HTTP: ${i.status}`);const e=await i.json();if(!e.success)throw new Error("La API respondió con un error");const t=e.data;ht(t.statistics),ft(t.bot),yt(t.system),console.log("Datos recibidos desde la API:",t)}catch(i){console.error("No se pudo conectar con la API:",i),gt()}}function ht(i){const e=document.querySelectorAll("[data-count]"),t=[i.servers,i.users,i.commands,i.messages];e.forEach((n,r)=>{const a=t[r];if(a===void 0)return;const c=Number(n.dataset.currentValue??n.dataset.count??0);if(c===a){n.textContent=a.toLocaleString("es-AR");return}n.dataset.count=a,n.dataset.currentValue=a,Si(n,c,a)});const s=[...document.querySelectorAll(".stat-card strong")].find(n=>n.textContent.includes("%"));s&&(s.textContent=`${i.uptimePercentage}%`)}function Si(i,e,t){i.animationFrame&&cancelAnimationFrame(i.animationFrame);const s=performance.now(),n=700;function r(a){const c=Math.min((a-s)/n,1),u=1-Math.pow(1-c,3),w=Math.floor(e+(t-e)*u);i.textContent=w.toLocaleString("es-AR"),c<1?i.animationFrame=requestAnimationFrame(r):(i.textContent=t.toLocaleString("es-AR"),i.animationFrame=null)}i.animationFrame=requestAnimationFrame(r)}function ft(i){const e=document.querySelector(".status-card strong");e&&(e.textContent=i.status==="online"?"En línea":"Desconectado",e.classList.toggle("offline-text",i.status!=="online"));const t=document.querySelectorAll(".footer-status strong");t[0]&&(t[0].textContent=`${i.latency} ms`),t[3]&&(t[3].textContent=i.uptime);const s=document.querySelector(".footer-status > div:last-child strong");s&&(s.textContent=i.version)}function yt(i){const e=document.querySelectorAll(".health-list > div strong"),t=[i.discordApi,i.database,i.servers,i.dashboard,i.logs];e.forEach((s,n)=>{const r=t[n];s.textContent=r?"Operativo":"Desconectado",s.classList.toggle("system-error",!r)})}function gt(){const i=document.querySelector(".status-card strong");i&&(i.textContent="Sin conexión",i.classList.add("offline-text"))}mt();const Z=le();Z.on("connect",()=>{console.log("Dashboard conectado en tiempo real:",Z.id)});Z.on("dashboard:update",i=>{console.log("Actualización recibida por Socket.IO:",i),ht(i.statistics),ft(i.bot),yt(i.system)});Z.on("disconnect",()=>{console.log("Dashboard desconectado del servidor"),gt()});Z.on("connect_error",i=>{console.error("Error de Socket.IO:",i.message)});async function ve(){const i=Oe.Servidores;b.innerHTML=`
    <div class="dynamic-page">
      ${de(i)}

      <div class="servers-loading">
        <div class="loading-spinner"></div>
        <strong>Cargando servidores de Discord...</strong>
      </div>
    </div>
  `;try{const e=await fetch(`${R}/api/servers`);if(!e.ok)throw new Error(`Error HTTP ${e.status}`);const t=await e.json();if(!t.success)throw new Error(t.message||"No se pudieron cargar los servidores");Ti(t.data)}catch(e){console.error("Error cargando servidores:",e),b.innerHTML=`
      <div class="dynamic-page">
        ${de(i)}

        <div class="servers-error">
          <div class="servers-error-icon">!</div>
          <h3>No se pudieron cargar los servidores</h3>
          <p>${e.message}</p>
          <button id="retryServers">Volver a intentar</button>
        </div>
      </div>
    `,document.getElementById("retryServers")?.addEventListener("click",ve)}}function Ti(i){const e=Oe.Servidores,t=i.reduce((n,r)=>n+r.members,0),s=i.map(n=>{const r=n.name.split(" ").slice(0,2).map(c=>c.charAt(0)).join("").toUpperCase();return`
      <article class="real-server-card">
        <div class="real-server-banner"></div>

        <div class="real-server-body">
          <div class="real-server-avatar">
            ${n.icon?`<img src="${n.icon}" alt="${n.name}">`:`<span>${r}</span>`}
          </div>

          <div class="real-server-status">
            <i></i>
            BOT ACTIVO
          </div>

          <h3>${n.name}</h3>

          <p>
            ${n.members.toLocaleString("es-AR")} miembros
          </p>

          <div class="real-server-details">
            <div>
              <span>ID DEL SERVIDOR</span>
              <strong>${n.id}</strong>
            </div>

            <div>
              <span>ESTADO</span>
              <strong class="server-online-text">Conectado</strong>
            </div>
          </div>

          <button
            class="manage-real-server"
            data-server-id="${n.id}"
            data-server-name="${n.name}"
          >
            Administrar servidor
            <b>›</b>
          </button>
        </div>
      </article>
    `}).join("");b.innerHTML=`
    <div class="dynamic-page">
      ${de(e)}

      <section class="section-metrics">
        <article class="section-metric">
          <i class="purple">◈</i>
          <div>
            <span>Servidores conectados</span>
            <strong>${i.length}</strong>
            <small>Datos reales de Discord</small>
          </div>
        </article>

        <article class="section-metric">
          <i class="blue">♣</i>
          <div>
            <span>Miembros totales</span>
            <strong>${t.toLocaleString("es-AR")}</strong>
            <small>Todos los servidores</small>
          </div>
        </article>

        <article class="section-metric">
          <i class="green">●</i>
          <div>
            <span>Estado del bot</span>
            <strong>Online</strong>
            <small>Discord conectado</small>
          </div>
        </article>
      </section>

      <section class="real-servers-grid">
        ${s}

        <article class="real-server-card add-real-server">
          <div class="add-server-circle">＋</div>
          <h3>Agregar servidor</h3>
          <p>Invitá a Nebula Bot a otra comunidad de Discord.</p>
          <button id="addServerButton">
            Invitar el bot
            <b>›</b>
          </button>
        </article>
      </section>
    </div>
  `,document.querySelectorAll(".manage-real-server").forEach(n=>{n.addEventListener("click",async()=>{const r=n.dataset.serverId;await Q(r)})}),document.getElementById("addServerButton")?.addEventListener("click",x)}async function Q(i){b.innerHTML=`
    <div class="dynamic-page">
      <div class="servers-loading">
        <div class="loading-spinner"></div>
        <strong>Cargando información del servidor...</strong>
      </div>
    </div>
  `;try{const e=await fetch(`${R}/api/servers/${i}`),t=await e.json();if(!e.ok||!t.success)throw new Error(t.message||"No se pudo cargar el servidor");Ii(t.data)}catch(e){console.error("Error cargando servidor:",e),b.innerHTML=`
      <div class="dynamic-page">
        <div class="servers-error">
          <div class="servers-error-icon">!</div>

          <h3>No se pudo abrir el servidor</h3>

          <p>${e.message}</p>

          <button id="backToServers">
            Volver a servidores
          </button>
        </div>
      </div>
    `,document.getElementById("backToServers")?.addEventListener("click",ve)}}function Ii(i){const e=new Date(i.createdAt).toLocaleDateString("es-AR",{day:"2-digit",month:"2-digit",year:"numeric"}),t=i.name.split(" ").slice(0,2).map(a=>a.charAt(0)).join("").toUpperCase(),s=i.icon?`<img src="${i.icon}" alt="${i.name}">`:`<span>${t}</span>`,n=i.roles.length?i.roles.map(a=>`
        <div class="server-role-row">
          <i style="background:${a.color}"></i>

          <div>
            <strong>${a.name}</strong>
            <span>${a.members} miembros</span>
          </div>

          <button
            class="server-small-action"
            data-action="role"
            data-role-id="${a.id}"
          >
            Editar
          </button>
        </div>
      `).join(""):`
      <div class="server-empty">
        No hay roles disponibles.
      </div>
    `,r=i.channels.length?i.channels.map(a=>`
        <div class="server-channel-row">
          <i>#</i>

          <div>
            <strong>${a.name}</strong>
            <span>ID: ${a.id}</span>
          </div>

          <button
            class="server-small-action"
            data-action="channel"
            data-channel-id="${a.id}"
          >
            Editar
          </button>
        </div>
      `).join(""):`
      <div class="server-empty">
        No hay canales disponibles.
      </div>
    `;b.innerHTML=`
    <div class="dynamic-page server-control-page">

      <section
        class="server-control-hero"
        ${i.banner?`style="background-image:
                linear-gradient(
                  90deg,
                  rgba(7,7,12,.95),
                  rgba(7,7,12,.48)
                ),
                url('${i.banner}')"`:""}
      >
        <button
          id="backToServers"
          class="server-back-button"
        >
          ‹ Volver a servidores
        </button>

        <div class="server-control-main">
          <div class="server-control-avatar">
            ${s}
          </div>

          <div>
            <span>SERVIDOR SELECCIONADO</span>
            <h1>${i.name}</h1>

            <p>
              ${i.members.toLocaleString("es-AR")}
              miembros · Creado el ${e}
            </p>
          </div>
        </div>

        <div class="server-control-state">
          <i></i>
          Bot conectado
        </div>
      </section>

      <section class="section-metrics server-control-metrics">

        <article class="section-metric">
          <i class="purple">♣</i>
          <div>
            <span>Miembros</span>
            <strong>
              ${i.members.toLocaleString("es-AR")}
            </strong>
            <small>Usuarios del servidor</small>
          </div>
        </article>

        <article class="section-metric">
          <i class="blue">▣</i>
          <div>
            <span>Canales</span>
            <strong>${i.statistics.channels}</strong>
            <small>Texto, voz y categorías</small>
          </div>
        </article>

        <article class="section-metric">
          <i class="green">♙</i>
          <div>
            <span>Roles</span>
            <strong>${i.statistics.roles}</strong>
            <small>Jerarquías configuradas</small>
          </div>
        </article>

        <article class="section-metric">
          <i class="yellow">◇</i>
          <div>
            <span>Emojis</span>
            <strong>${i.statistics.emojis}</strong>
            <small>Emojis personalizados</small>
          </div>
        </article>

      </section>

      <section class="server-tools-grid">

        <article class="server-tool-card">
          <i>👋</i>
          <div>
            <strong>Bienvenida</strong>
            <span>Configurar mensajes de ingreso</span>
          </div>
          <button data-tool="welcome">Configurar</button>
        </article>

        <article class="server-tool-card">
          <i>✅</i>
          <div>
            <strong>Verificación</strong>
            <span>Roles y acceso de miembros</span>
          </div>
          <button data-tool="verification">Configurar</button>
        </article>

        <article class="server-tool-card">
          <i>◆</i>
          <div>
            <strong>Moderación</strong>
            <span>Baneos, advertencias y muteos</span>
          </div>
          <button data-tool="moderation">Administrar</button>
        </article>

        <article class="server-tool-card">
          <i>⌘</i>
          <div>
            <strong>Comandos</strong>
            <span>Funciones activas del bot</span>
          </div>
          <button data-tool="commands">Administrar</button>
        </article>

      </section>

      <section class="server-detail-grid">

        <article class="section-panel">
          <div class="section-panel-head">
            <div>
              <span>ROLES</span>
              <h3>Roles principales</h3>
            </div>

            <button class="server-header-action">
              ＋ Crear rol
            </button>
          </div>

          <div class="server-rows">
            ${n}
          </div>
        </article>

        <article class="section-panel">
          <div class="section-panel-head">
            <div>
              <span>CANALES</span>
              <h3>Canales principales</h3>
            </div>

            <button class="server-header-action">
              ＋ Crear canal
            </button>
          </div>

          <div class="server-rows">
            ${r}
          </div>
        </article>

      </section>

      <section class="section-panel server-identity-panel">
        <div class="section-panel-head">
          <div>
            <span>INFORMACIÓN</span>
            <h3>Identidad del servidor</h3>
          </div>
        </div>

        <div class="server-identity-grid">

          <div>
            <span>NOMBRE</span>
            <strong>${i.name}</strong>
          </div>

          <div>
            <span>ID DEL SERVIDOR</span>
            <strong>${i.id}</strong>
          </div>

          <div>
            <span>ID DEL PROPIETARIO</span>
            <strong>${i.ownerId}</strong>
          </div>

          <div>
            <span>FECHA DE CREACIÓN</span>
            <strong>${e}</strong>
          </div>

        </div>
      </section>

    </div>
  `,document.getElementById("backToServers")?.addEventListener("click",ve),document.querySelector('[data-tool="welcome"]')?.addEventListener("click",()=>{ki(i)}),document.querySelector('[data-tool="verification"]')?.addEventListener("click",()=>{Bi(i)}),document.querySelectorAll('.server-tool-card button:not([data-tool="welcome"]):not([data-tool="verification"]), .server-small-action, .server-header-action').forEach(a=>{a.addEventListener("click",()=>{B.querySelector("strong").textContent="Herramienta preparada",B.querySelector("p").textContent="Esta función se conectará más adelante.",x()})})}async function Bi(i){b.innerHTML=`
    <div class="dynamic-page">
      <div class="servers-loading">
        <div class="loading-spinner"></div>
        <strong>
          Cargando configuración de verificación...
        </strong>
      </div>
    </div>
  `;try{const[e,t,s,n]=await Promise.all([fetch(`${R}/api/servers/${i.id}/text-channels`),fetch(`${R}/api/servers/${i.id}`),fetch(`${R}/api/servers/${i.id}/verification`),fetch(`${R}/api/bot/public-info`)]),r=await e.json(),a=await t.json(),c=await s.json(),u=await n.json();if(!e.ok||!r.success)throw new Error(r.message||"No se pudieron cargar los canales");if(!t.ok||!a.success)throw new Error(a.message||"No se pudieron cargar los roles");if(!s.ok||!c.success)throw new Error(c.message||"No se pudo cargar la configuración");Ri(i,r.data,a.data.roles,c.data,u.success?u.data:{})}catch(e){console.error("Error cargando verificación:",e),b.innerHTML=`
      <div class="dynamic-page">
        <div class="servers-error">
          <div class="servers-error-icon">!</div>

          <h3>
            No se pudo abrir Verificación
          </h3>

          <p>
            ${E(e.message)}
          </p>

          <button id="backToServerPanel">
            Volver al servidor
          </button>
        </div>
      </div>
    `,document.getElementById("backToServerPanel")?.addEventListener("click",()=>{Q(i.id)})}}function M(i,e,t){return`
    <label class="welcome-field">
      <span>${e}</span>

      <div class="welcome-color-row">
        <input
          id="${i}"
          type="color"
          value="${t}"
        >

        <input
          id="${i}Text"
          value="${t}"
          maxlength="7"
        >
      </div>
    </label>
  `}function V(i,e,t,s,n,r=""){return`
    <label class="appearance-range-control">
      <div>
        <span>${e}</span>

        <strong id="${i}Value">
          ${t}${r}
        </strong>
      </div>

      <input
        id="${i}"
        type="range"
        min="${s}"
        max="${n}"
        value="${t}"
        data-suffix="${r}"
      >
    </label>
  `}function Ri(i,e,t,s,n={}){const r={avatar:!0,username:!0,displayName:!0,userId:!0,deliveredRole:!0,accountCreatedAt:!0,joinedAt:!0,verifiedAt:!0,verificationDuration:!0,attempts:!0,banner:!1,nitro:!1,operatingSystem:!1,browser:!1,device:!1,resolution:!1,language:!1,timezone:!1,country:!1,city:!1,region:!1,countryCode:!1,approximateLocalTime:!1,fullIp:!1,ipType:!1,isp:!1,asn:!1,vpn:!1,proxy:!1,hosting:!1,mobileNetwork:!1,riskLevel:!1,trustScore:!1,...s.logOptions||{}},a={pageName:"Trade Room Verification",pageDescription:"Completá la verificación para acceder al servidor.",logoUrl:"",backgroundUrl:"",primaryColor:"#8b5cf6",secondaryColor:"#6d28d9",buttonColor:"#7c3aed",textColor:"#ffffff",cardColor:"#0f0f1a",backgroundType:"space",backgroundSolidColor:"#05050a",gradientStart:"#05050a",gradientEnd:"#160c2b",spaceBackground:!0,animationsEnabled:!0,particlesEnabled:!0,glowEnabled:!0,fadeEnabled:!0,hoverEnabled:!0,cursorGlowEnabled:!1,buttonAnimationEnabled:!0,logoAnimationEnabled:!0,particleCount:100,glowIntensity:80,cardBlur:18,cardOpacity:88,cardRadius:24,cardShadow:80,verifyButtonText:"Verificar con Discord",verifyButtonIcon:"discord",verifyButtonSize:"large",verifyButtonRadius:14,verificationSound:!1,errorSound:!1,openingSound:!1,soundVolume:50,...s.webAppearance||{}},c={detectVpn:!1,detectProxy:!1,detectTor:!1,detectAltAccounts:!1,minimumAccountAgeEnabled:!1,minimumAccountAgeDays:7,blockWithoutAvatar:!1,blockWithoutBanner:!1,allowReverification:!0,notifySecurityFailure:!0,...s.security||{}},u=e.map(l=>`
        <option
          value="${l.id}"
          ${l.id===s.verificationChannelId?"selected":""}
        >
          # ${E(l.name)}
        </option>
      `).join(""),w=e.map(l=>`
        <option
          value="${l.id}"
          ${l.id===s.logsChannelId?"selected":""}
        >
          # ${E(l.name)}
        </option>
      `).join(""),A=t.map(l=>`
        <option
          value="${l.id}"
          ${l.id===s.verifiedRoleId?"selected":""}
        >
          @ ${E(l.name)}
        </option>
      `).join(""),p=(l,d,m,S)=>`
    <div class="verify-option-row">
      <div>
        <strong>${d}</strong>
        <p>${m}</p>
      </div>

      <label class="switch-control">
        <input
          id="${l}"
          type="checkbox"
          ${S?"checked":""}
        >
        <span></span>
      </label>
    </div>
  `,h=(l,d,m)=>p(`verifyLog_${l}`,d,m,!!r[l]);b.innerHTML=`
    <div class="dynamic-page verification-config-page">

      <section class="section-header">
        <div>
          <span>SEGURIDAD DEL SERVIDOR</span>

          <h1>Verificación</h1>

          <p>
            Administrá el sistema de acceso de
            ${E(i.name)}.
          </p>
        </div>

        <button
          id="backToServerPanel"
          class="section-action"
        >
          ‹ Volver al servidor
        </button>
      </section>

      <nav class="verify-tabs">
        <button
          class="verify-tab active"
          data-verify-tab="general"
        >
          ⚙ General
        </button>

        <button
          class="verify-tab"
          data-verify-tab="panel"
        >
          📨 Panel
        </button>

        <button
          class="verify-tab"
          data-verify-tab="logs"
        >
          📋 Logs
        </button>

        <button
          class="verify-tab"
          data-verify-tab="appearance"
        >
          ✨ Apariencia
        </button>

        <button
          class="verify-tab"
          data-verify-tab="security"
        >
          🛡 Seguridad
        </button>
      </nav>

      <div class="verify-tab-content">

        <!-- GENERAL -->

        <section
          class="verify-tab-panel active"
          data-verify-panel="general"
        >
          <article class="section-panel">
            <div class="section-panel-head">
              <div>
                <span>CONFIGURACIÓN GENERAL</span>
                <h3>Sistema de verificación</h3>
              </div>

              <span
                id="verifySystemStatus"
                class="verify-status-badge ${s.enabled?"enabled":"disabled"}"
              >
                ${s.enabled?"ACTIVADO":"DESACTIVADO"}
              </span>
            </div>

            ${p("verifyEnabled","Activar sistema de verificación","Permite que los usuarios obtengan el rol configurado.",s.enabled)}

            <div class="verify-form-grid">
              <label class="welcome-field">
                <span>CANAL DE VERIFICACIÓN</span>

                <select id="verifyChannel">
                  <option value="">
                    Seleccionar canal...
                  </option>

                  ${u}
                </select>
              </label>

              <label class="welcome-field">
                <span>ROL A ENTREGAR</span>

                <select id="verifyRole">
                  <option value="">
                    Seleccionar rol...
                  </option>

                  ${A}
                </select>
              </label>
            </div>
          </article>

          <article class="section-panel">
            <div class="section-panel-head">
              <div>
                <span>MÉTODO</span>
                <h3>Tipo de verificación</h3>
              </div>
            </div>

            <div class="verify-method-grid">

              <label class="verify-method-card">
                <input
                  type="radio"
                  name="verificationMethod"
                  value="oauth_link"
                  ${s.verificationMethod==="oauth_link"?"checked":""}
                >

                <div>
                  <i>🔗</i>
                  <strong>Botón de enlace</strong>
                  <p>
                    Abre OAuth2 y redirige a la
                    página web.
                  </p>
                  <span>RECOMENDADO</span>
                </div>
              </label>

              <label class="verify-method-card">
                <input
                  type="radio"
                  name="verificationMethod"
                  value="interaction_button"
                  ${s.verificationMethod==="interaction_button"?"checked":""}
                >

                <div>
                  <i>🔘</i>
                  <strong>Botón de interacción</strong>
                  <p>
                    El bot procesa la verificación
                    desde Discord.
                  </p>
                </div>
              </label>

              <label class="verify-method-card">
                <input
                  type="radio"
                  name="verificationMethod"
                  value="emoji_reaction"
                  ${s.verificationMethod==="emoji_reaction"?"checked":""}
                >

                <div>
                  <i>😀</i>
                  <strong>Reacción</strong>
                  <p>
                    El usuario reacciona al mensaje
                    para verificarse.
                  </p>
                </div>
              </label>

            </div>
          </article>
        </section>

             <!-- PANEL -->

<section
  class="verify-tab-panel"
  data-verify-panel="panel"
>
  <div class="verify-panel-editor-layout">

    <!-- CONTROLES -->

    <div class="verify-panel-controls">

      <article class="section-panel">

        <div class="section-panel-head">
          <div>
            <span>PANEL DE DISCORD</span>
            <h3>
              Configuración del embed
            </h3>
          </div>
        </div>

        <label class="welcome-field">
          <span>TÍTULO DEL EMBED</span>

          <input
            id="verifyEmbedTitle"
            maxlength="256"
            value="${y(s.embedTitle||"🔒 Verificación requerida")}"
          >
        </label>

        <label class="welcome-field">
          <span>DESCRIPCIÓN</span>

          <textarea
            id="verifyEmbedDescription"
            rows="5"
            maxlength="4000"
          >${E(s.embedDescription||"Para obtener acceso a **{server}**, debés verificar tu cuenta de Discord.")}</textarea>
        </label>

        <label class="welcome-field">
          <span>COLOR DEL EMBED</span>

          <div class="welcome-color-row">
            <input
              id="verifyEmbedColor"
              type="color"
              value="${s.embedColor||"#8b5cf6"}"
            >

            <input
              id="verifyEmbedColorText"
              maxlength="7"
              value="${s.embedColor||"#8b5cf6"}"
            >
          </div>
        </label>

        <div class="verify-form-grid">

          <label class="welcome-field">
            <span>TEXTO DEL BOTÓN</span>

            <input
              id="verifyButtonText"
              maxlength="80"
              value="${y(s.buttonText||"Verificar con Discord")}"
            >
          </label>

          <label class="welcome-field">
            <span>EMOJI DEL BOTÓN</span>

            <input
              id="verifyButtonEmoji"
              maxlength="100"
              value="${y(s.buttonEmoji||"✅")}"
            >
          </label>

        </div>

        <div class="verify-form-grid">

          <label class="welcome-field">
            <span>NOMBRE DEL CAMPO</span>

            <input
              id="verifyEmbedFieldName"
              maxlength="256"
              value="${y(s.embedFieldName||"📌 Servidor")}"
            >
          </label>

          <label class="welcome-field">
            <span>VALOR DEL CAMPO</span>

            <input
              id="verifyEmbedFieldValue"
              maxlength="1024"
              value="${y(s.embedFieldValue||"{server}")}"
            >
          </label>

        </div>

        <label class="welcome-field">
          <span>TEXTO DEL PIE</span>

          <input
            id="verifyEmbedFooterText"
            maxlength="2048"
            value="${y(s.embedFooterText||"Nebula Security • Todos los derechos reservados")}"
          >
        </label>

        <label class="welcome-field">
          <span>EMOJI DE REACCIÓN</span>

          <input
            id="verifyReactionEmoji"
            maxlength="100"
            value="${y(s.reactionEmoji||"✅")}"
          >
        </label>

      </article>

      <article class="section-panel">

        <div class="section-panel-head">
          <div>
            <span>IMÁGENES Y ELEMENTOS</span>
            <h3>Contenido visual</h3>
          </div>
        </div>

        <div class="verify-options-grid">

          ${p("verifyShowBotAvatar","Mostrar avatar del bot","Usa la foto de perfil real del bot.",s.showBotAvatar!==!1)}

          ${p("verifyShowServerIcon","Mostrar icono del servidor","Usa el icono del servidor como miniatura.",s.showServerIcon!==!1)}

          ${p("verifyShowCustomThumbnail","Miniatura personalizada","Muestra una imagen pequeña en el embed.",!!s.showCustomThumbnail)}

          ${p("verifyShowEmbedImage","Imagen grande","Muestra una imagen en la parte inferior.",!!s.showEmbedImage)}

          ${p("verifyShowTimestamp","Mostrar fecha y hora","Agrega el timestamp real de Discord.",s.showTimestamp!==!1)}

        </div>

        <label class="welcome-field">
          <span>URL DE LA MINIATURA</span>

          <input
            id="verifyEmbedThumbnailUrl"
            maxlength="1000"
            placeholder="https://..."
            value="${y(s.embedThumbnailUrl||"")}"
          >
        </label>

        <label class="welcome-field">
          <span>URL DE LA IMAGEN GRANDE</span>

          <input
            id="verifyEmbedImageUrl"
            maxlength="1000"
            placeholder="https://..."
            value="${y(s.embedImageUrl||"")}"
          >
        </label>

      </article>

      <article class="section-panel verify-panel-variables">

        <div class="section-panel-head">
          <div>
            <span>VARIABLES DISPONIBLES</span>
            <h3>Textos dinámicos</h3>
          </div>
        </div>

        <div class="verify-variable-list">
          <code>{server}</code>
          <span>Nombre del servidor</span>

          <code>{date}</code>
          <span>Fecha actual</span>

          <code>{time}</code>
          <span>Hora actual</span>
        </div>

      </article>

    </div>

    <!-- VISTA PREVIA -->

    <aside class="verify-discord-preview-column">

      <article class="section-panel verify-discord-preview-panel">

        <div class="section-panel-head">
          <div>
            <span>VISTA PREVIA</span>
            <h3>Así se verá en Discord</h3>
          </div>
        </div>

        <div class="discord-message-preview">

          <div
            id="verifyPreviewAuthor"
            class="discord-message-author"
          >
            <img
              id="verifyPreviewBotAvatar"
              src="${y(n.avatar||"https://cdn.discordapp.com/embed/avatars/0.png")}"
              alt="Avatar del bot"
            >

            <div>
              <strong id="verifyPreviewBotName">
                ${E(n.displayName||n.username||"Nebula Bot")}
              </strong>

              <span>BOT</span>

              <small>
                Hoy a las
                ${new Date().toLocaleTimeString("es-AR",{hour:"2-digit",minute:"2-digit"})}
              </small>
            </div>
          </div>

          <div
            id="verifyPreviewEmbed"
            class="discord-embed-preview"
            style="
              --preview-embed-color:
              ${s.embedColor||"#8b5cf6"};
            "
          >

            <div class="discord-embed-body">

              <div class="discord-embed-content">

                <h3 id="verifyPreviewTitle">
                  ${E(s.embedTitle||"🔒 Verificación requerida")}
                </h3>

                <p id="verifyPreviewDescription">
                  ${E((s.embedDescription||"Para obtener acceso a **{server}**, debés verificar tu cuenta de Discord.").replaceAll("{server}",i.name).replaceAll("**",""))}
                </p>

                <div
                  id="verifyPreviewField"
                  class="discord-embed-field"
                >
                  <strong id="verifyPreviewFieldName">
                    ${E(s.embedFieldName||"📌 Servidor")}
                  </strong>

                  <span id="verifyPreviewFieldValue">
                    ${E((s.embedFieldValue||"{server}").replaceAll("{server}",i.name))}
                  </span>
                </div>

                <button
                  id="verifyPreviewButton"
                  type="button"
                >
                  <span id="verifyPreviewButtonEmoji">
                    ${E(s.buttonEmoji||"✅")}
                  </span>

                  <strong id="verifyPreviewButtonText">
                    ${E(s.buttonText||"Verificar con Discord")}
                  </strong>
                </button>

              </div>

              <img
                id="verifyPreviewThumbnail"
                class="discord-embed-thumbnail"
                src="${y(s.showCustomThumbnail&&s.embedThumbnailUrl?s.embedThumbnailUrl:i.icon||i.iconURL||"")}"
                alt="Miniatura"
              >

            </div>

            <img
              id="verifyPreviewImage"
              class="discord-embed-large-image"
              src="${y(s.embedImageUrl||"")}"
              alt="Imagen del embed"
              ${s.showEmbedImage&&s.embedImageUrl?"":'style="display:none"'}
            >

            <div class="discord-embed-footer">

              <img
                id="verifyPreviewFooterAvatar"
                src="${y(n.avatar||"https://cdn.discordapp.com/embed/avatars/0.png")}"
                alt=""
              >

              <span id="verifyPreviewFooterText">
                ${E(s.embedFooterText||"Nebula Security • Todos los derechos reservados")}
              </span>

              <small
                id="verifyPreviewTimestamp"
                ${s.showTimestamp===!1?'style="display:none"':""}
              >
                • Hoy a las
                ${new Date().toLocaleTimeString("es-AR",{hour:"2-digit",minute:"2-digit"})}
              </small>

            </div>

          </div>

        </div>

        <p class="discord-preview-help">
          Los cambios se muestran en tiempo real.
        </p>

      </article>

    </aside>

  </div>
</section>

        <!-- LOGS -->

        <section
          class="verify-tab-panel"
          data-verify-panel="logs"
        >
          <article class="section-panel">
            <div class="section-panel-head">
              <div>
                <span>CANAL DE REGISTROS</span>
                <h3>Logs de verificación</h3>
              </div>
            </div>

            <label class="welcome-field">
              <span>CANAL DE LOGS</span>

              <select id="verifyLogs">
                <option value="">
                  Seleccionar canal...
                </option>

                ${w}
              </select>
            </label>
          </article>

          <div
            id="verifyLogsSettings"
            class="verify-logs-settings ${s.logsChannelId?"visible":""}"
          >
            <article class="section-panel">
              <div class="section-panel-head">
                <div>
                  <span>PERSONALIZACIÓN</span>
                  <h3>Embed del registro</h3>
                </div>
              </div>

              <label class="welcome-field">
                <span>TÍTULO DEL LOG</span>

                <input
                  id="verifyLogTitle"
                  maxlength="256"
                  value="${y(s.logEmbedTitle||"🛡️ Usuario verificado")}"
                >
              </label>

              <label class="welcome-field">
                <span>DESCRIPCIÓN DEL LOG</span>

                <textarea
                  id="verifyLogDescription"
                  rows="4"
                  maxlength="4000"
                >${E(s.logEmbedDescription||"")}</textarea>
              </label>

              <label class="welcome-field">
                <span>COLOR DEL LOG</span>

                <div class="welcome-color-row">
                  <input
                    id="verifyLogColor"
                    type="color"
                    value="${s.logEmbedColor||"#22c55e"}"
                  >

                  <input
                    id="verifyLogColorText"
                    value="${s.logEmbedColor||"#22c55e"}"
                    maxlength="7"
                  >
                </div>
              </label>
            </article>

            <article class="section-panel">
              <div class="section-panel-head">
                <div>
                  <span>DISCORD</span>
                  <h3>Datos del usuario</h3>
                </div>
              </div>

              <div class="verify-options-grid">
                ${h("avatar","Avatar","Foto de perfil del usuario.")}

                ${h("username","Usuario de Discord","Nombre de usuario.")}

                ${h("displayName","Nombre para mostrar","Apodo o nombre global.")}

                ${h("userId","Discord ID","Identificador de la cuenta.")}

                ${h("deliveredRole","Rol entregado","Rol recibido al verificarse.")}

                ${h("accountCreatedAt","Cuenta creada","Fecha de creación de Discord.")}

                ${h("joinedAt","Ingreso al servidor","Fecha en que se unió.")}

                ${h("verifiedAt","Fecha de verificación","Momento exacto de la verificación.")}
              </div>
            </article>

            <article class="section-panel">
              <div class="section-panel-head">
                <div>
                  <span>DISPOSITIVO</span>
                  <h3>Información técnica</h3>
                </div>
              </div>

              <div class="verify-options-grid">
                ${h("browser","Navegador","Chrome, Edge, Firefox, etc.")}

                ${h("operatingSystem","Sistema operativo","Windows, Android, iOS, etc.")}

                ${h("device","Dispositivo","Computadora, celular o tablet.")}

                ${h("resolution","Resolución","Tamaño de la pantalla.")}

                ${h("language","Idioma","Idioma configurado.")}

                ${h("timezone","Zona horaria","Zona horaria del navegador.")}
              </div>
            </article>

            <article class="section-panel">
              <div class="section-panel-head">
                <div>
                  <span>RED Y UBICACIÓN</span>
                  <h3>Información aproximada</h3>
                </div>
              </div>

              <div class="verify-privacy-note">
                Los datos de red deben utilizarse
                únicamente con una finalidad legítima,
                protección adecuada y aviso claro al usuario.
              </div>

              <div class="verify-options-grid">
                ${h("country","País aproximado","País estimado por la conexión.")}

                ${h("city","Ciudad aproximada","Ciudad estimada.")}

                ${h("vpn","VPN","Indica posible uso de VPN.")}

                ${h("proxy","Proxy","Indica posible uso de proxy.")}

                ${h("isp","Proveedor de internet","Empresa de conexión.")}

                ${h("asn","ASN","Identificador de la red.")}

                ${h("fullIp","Dirección IP completa","Dato sensible. Debe permanecer desactivado salvo que exista una necesidad legítima y aviso claro.")}
              </div>
            </article>
          </div>
        </section>

        <!-- APARIENCIA -->

   <section
  class="verify-tab-panel"
  data-verify-panel="appearance"
>
  <div class="appearance-editor-layout">

    <div class="appearance-editor-controls">

      <!-- IDENTIDAD -->

      <article class="section-panel">
        <div class="section-panel-head">
          <div>
            <span>IDENTIDAD</span>
            <h3>Información de la página</h3>
          </div>
        </div>

        <div class="appearance-form-grid">
          <label class="welcome-field appearance-wide">
            <span>NOMBRE DE LA PÁGINA</span>

            <input
              id="verifyPageName"
              maxlength="100"
              value="${y(a.pageName)}"
            >
          </label>

          <label class="welcome-field appearance-wide">
            <span>DESCRIPCIÓN</span>

            <textarea
              id="verifyPageDescription"
              maxlength="300"
              rows="3"
            >${E(a.pageDescription)}</textarea>
          </label>

          <label class="welcome-field">
            <span>URL DEL LOGO</span>

            <input
              id="verifyLogoUrl"
              maxlength="1000"
              placeholder="https://..."
              value="${y(a.logoUrl)}"
            >
          </label>

          <label class="welcome-field">
            <span>URL DEL FONDO</span>

            <input
              id="verifyBackgroundUrl"
              maxlength="1000"
              placeholder="https://..."
              value="${y(a.backgroundUrl)}"
            >
          </label>
        </div>
      </article>

      <!-- COLORES -->

      <article class="section-panel">
        <div class="section-panel-head">
          <div>
            <span>PALETA</span>
            <h3>Colores de la página</h3>
          </div>
        </div>

        <div class="appearance-colors-grid">

          ${M("verifyPrimaryColor","COLOR PRINCIPAL",a.primaryColor)}

          ${M("verifySecondaryColor","COLOR SECUNDARIO",a.secondaryColor)}

          ${M("verifyButtonColor","COLOR DEL BOTÓN",a.buttonColor)}

          ${M("verifyTextColor","COLOR DEL TEXTO",a.textColor)}

          ${M("verifyCardColor","COLOR DE LA TARJETA",a.cardColor)}

          ${M("verifyBackgroundSolidColor","COLOR DEL FONDO",a.backgroundSolidColor)}

          ${M("verifyGradientStart","INICIO DEL DEGRADADO",a.gradientStart)}

          ${M("verifyGradientEnd","FINAL DEL DEGRADADO",a.gradientEnd)}

        </div>
      </article>

      <!-- FONDO -->

      <article class="section-panel">
        <div class="section-panel-head">
          <div>
            <span>FONDO</span>
            <h3>Diseño del escenario</h3>
          </div>
        </div>

        <label class="welcome-field">
          <span>TIPO DE FONDO</span>

          <select id="verifyBackgroundType">
            <option
              value="space"
              ${a.backgroundType==="space"?"selected":""}
            >
              Espacial
            </option>

            <option
              value="gradient"
              ${a.backgroundType==="gradient"?"selected":""}
            >
              Degradado
            </option>

            <option
              value="image"
              ${a.backgroundType==="image"?"selected":""}
            >
              Imagen
            </option>

            <option
              value="video"
              ${a.backgroundType==="video"?"selected":""}
            >
              Video
            </option>

            <option
              value="solid"
              ${a.backgroundType==="solid"?"selected":""}
            >
              Color sólido
            </option>
          </select>
        </label>

        <div class="verify-options-grid">
          ${p("verifySpaceBackground","Fondo espacial","Muestra estrellas y partículas.",a.spaceBackground)}

          ${p("verifyParticlesEnabled","Partículas","Activa partículas animadas.",a.particlesEnabled)}
        </div>

        <div class="appearance-range-grid">
          ${V("verifyParticleCount","CANTIDAD DE PARTÍCULAS",a.particleCount,0,300)}

          ${V("verifyGlowIntensity","INTENSIDAD DEL BRILLO",a.glowIntensity,0,100)}
        </div>
      </article>

      <!-- ANIMACIONES -->

      <article class="section-panel">
        <div class="section-panel-head">
          <div>
            <span>EFECTOS</span>
            <h3>Animaciones</h3>
          </div>
        </div>

        <div class="verify-options-grid">

          ${p("verifyAnimationsEnabled","Animaciones generales","Activa todos los efectos visuales.",a.animationsEnabled)}

          ${p("verifyGlowEnabled","Efecto glow","Agrega brillo alrededor de los elementos.",a.glowEnabled)}

          ${p("verifyFadeEnabled","Entrada suave","Los elementos aparecen con un efecto fade.",a.fadeEnabled)}

          ${p("verifyHoverEnabled","Efectos hover","Los elementos reaccionan al pasar el cursor.",a.hoverEnabled)}

          ${p("verifyCursorGlowEnabled","Cursor luminoso","Agrega un resplandor alrededor del cursor.",a.cursorGlowEnabled)}

          ${p("verifyButtonAnimationEnabled","Animación del botón","Anima el botón principal.",a.buttonAnimationEnabled)}

          ${p("verifyLogoAnimationEnabled","Animación del logo","Agrega movimiento suave al logo.",a.logoAnimationEnabled)}

        </div>
      </article>

      <!-- TARJETA -->

      <article class="section-panel">
        <div class="section-panel-head">
          <div>
            <span>CONTENEDOR</span>
            <h3>Tarjeta principal</h3>
          </div>
        </div>

        <div class="appearance-range-grid">

          ${V("verifyCardBlur","DESENFOQUE",a.cardBlur,0,50,"px")}

          ${V("verifyCardOpacity","OPACIDAD",a.cardOpacity,10,100,"%")}

          ${V("verifyCardRadius","BORDES REDONDEADOS",a.cardRadius,0,50,"px")}

          ${V("verifyCardShadow","INTENSIDAD DE SOMBRA",a.cardShadow,0,100,"%")}

        </div>
      </article>

      <!-- BOTÓN -->

      <article class="section-panel">
        <div class="section-panel-head">
          <div>
            <span>ACCIÓN PRINCIPAL</span>
            <h3>Botón de verificación</h3>
          </div>
        </div>

        <div class="appearance-form-grid">

          <label class="welcome-field appearance-wide">
            <span>TEXTO DEL BOTÓN</span>

            <input
              id="verifyAppearanceButtonText"
              maxlength="80"
              value="${y(a.verifyButtonText)}"
            >
          </label>

          <label class="welcome-field">
            <span>ICONO</span>

            <select id="verifyButtonIcon">
              <option
                value="discord"
                ${a.verifyButtonIcon==="discord"?"selected":""}
              >
                Discord
              </option>

              <option
                value="shield"
                ${a.verifyButtonIcon==="shield"?"selected":""}
              >
                Escudo
              </option>

              <option
                value="check"
                ${a.verifyButtonIcon==="check"?"selected":""}
              >
                Verificado
              </option>

              <option
                value="none"
                ${a.verifyButtonIcon==="none"?"selected":""}
              >
                Sin icono
              </option>
            </select>
          </label>

          <label class="welcome-field">
            <span>TAMAÑO</span>

            <select id="verifyButtonSize">
              <option
                value="small"
                ${a.verifyButtonSize==="small"?"selected":""}
              >
                Pequeño
              </option>

              <option
                value="medium"
                ${a.verifyButtonSize==="medium"?"selected":""}
              >
                Mediano
              </option>

              <option
                value="large"
                ${a.verifyButtonSize==="large"?"selected":""}
              >
                Grande
              </option>
            </select>
          </label>

        </div>

        <div class="appearance-range-grid">
          ${V("verifyButtonRadius","BORDES DEL BOTÓN",a.verifyButtonRadius,0,40,"px")}
        </div>
      </article>

      <!-- SONIDOS -->

      <article class="section-panel">
        <div class="section-panel-head">
          <div>
            <span>AUDIO</span>
            <h3>Sonidos</h3>
          </div>
        </div>

        <div class="verify-options-grid">

          ${p("verifyOpeningSound","Sonido al abrir","Reproduce un sonido cuando carga la página.",a.openingSound)}

          ${p("verifyVerificationSound","Sonido al verificar","Reproduce un sonido cuando la verificación termina.",a.verificationSound)}

          ${p("verifyErrorSound","Sonido de error","Reproduce un sonido cuando ocurre un problema.",a.errorSound)}

        </div>

        <div class="appearance-range-grid">
          ${V("verifySoundVolume","VOLUMEN",a.soundVolume,0,100,"%")}
        </div>
      </article>

    </div>

    <!-- VISTA PREVIA -->

    <aside class="appearance-preview-column">
      <article class="section-panel appearance-preview-panel">
        <div class="section-panel-head">
          <div>
            <span>VISTA PREVIA</span>
            <h3>Verificación web</h3>
          </div>
        </div>

<div class="real-verification-preview">
  <iframe
    id="verifyAppearanceFrame"
    class="real-verification-preview-frame"
    src="/verify/${encodeURIComponent(i.id)}?preview=1"
    title="Vista previa real de la verificación"
  ></iframe>
</div>
          </article>
    </aside>

  </div>
</section>
        <!-- SEGURIDAD -->

        <section
          class="verify-tab-panel"
          data-verify-panel="security"
        >
          <article class="section-panel">
            <div class="section-panel-head">
              <div>
                <span>PROTECCIÓN</span>
                <h3>Reglas de seguridad</h3>
              </div>
            </div>

            <div class="verify-options-grid">
              ${p("verifyDetectVpn","Detectar VPN","Marca conexiones que podrían utilizar VPN.",c.detectVpn)}

              ${p("verifyDetectProxy","Detectar proxy","Marca conexiones mediante proxy.",c.detectProxy)}

              ${p("verifyDetectTor","Detectar Tor","Marca conexiones de la red Tor.",c.detectTor)}

              ${p("verifyDetectAltAccounts","Detectar multicuentas","Busca señales de cuentas duplicadas.",c.detectAltAccounts)}

              ${p("verifyBlockWithoutAvatar","Bloquear sin avatar","Impide verificar cuentas sin foto.",c.blockWithoutAvatar)}

              ${p("verifyBlockWithoutBanner","Bloquear sin banner","Impide verificar cuentas sin banner.",c.blockWithoutBanner)}

              ${p("verifyAllowReverification","Permitir reverificación","Permite verificar nuevamente.",c.allowReverification)}

              ${p("verifyNotifySecurityFailure","Registrar bloqueos","Envía un log cuando una regla falla.",c.notifySecurityFailure)}
            </div>

            ${p("verifyMinimumAgeEnabled","Edad mínima de la cuenta","Bloquea cuentas demasiado nuevas.",c.minimumAccountAgeEnabled)}

            <label class="welcome-field">
              <span>DÍAS MÍNIMOS DE ANTIGÜEDAD</span>

              <input
                id="verifyMinimumAgeDays"
                type="number"
                min="0"
                max="3650"
                value="${c.minimumAccountAgeDays}"
              >
            </label>
          </article>
        </section>

      </div>

      <div class="verify-sticky-actions">
        <button
          id="sendVerificationPanel"
          class="welcome-test-button"
          type="button"
        >
          Enviar panel a Discord
        </button>

        <button
          id="saveVerification"
          class="welcome-save-button"
          type="button"
        >
          Guardar configuración
        </button>
      </div>
    </div>
  `;const o=l=>document.getElementById(l),O=(l,d)=>{B.querySelector("strong").textContent=l,B.querySelector("p").textContent=d,x()},U=()=>document.querySelector('input[name="verificationMethod"]:checked')?.value||"oauth_link",G=()=>{const l={};return Object.keys(r).forEach(d=>{l[d]=!!o(`verifyLog_${d}`)?.checked}),l},_=l=>{const d=new Date;return String(l||"").replaceAll("{server}",i.name).replaceAll("{date}",d.toLocaleDateString("es-AR")).replaceAll("{time}",d.toLocaleTimeString("es-AR",{hour:"2-digit",minute:"2-digit"})).replaceAll("**","")},z=()=>{const l=o("verifyEmbedTitle"),d=o("verifyEmbedDescription"),m=o("verifyEmbedColor"),S=o("verifyButtonText"),ee=o("verifyButtonEmoji"),bt=o("verifyEmbedFieldName"),Et=o("verifyEmbedFieldValue"),wt=o("verifyEmbedFooterText"),Ne=o("verifyEmbedThumbnailUrl"),Le=o("verifyEmbedImageUrl"),_e=o("verifyPreviewEmbed");if(!_e)return;const $e=o("verifyPreviewTitle"),Pe=o("verifyPreviewDescription"),Me=o("verifyPreviewFieldName"),Ve=o("verifyPreviewFieldValue"),qe=o("verifyPreviewButtonText"),Ue=o("verifyPreviewButtonEmoji"),Fe=o("verifyPreviewFooterText"),je=o("verifyPreviewAuthor"),H=o("verifyPreviewThumbnail"),te=o("verifyPreviewImage"),Ge=o("verifyPreviewTimestamp");if($e&&($e.textContent=_(l?.value||"🔒 Verificación requerida")),Pe&&(Pe.textContent=_(d?.value||"Presioná el botón para verificarte.")),Me&&(Me.textContent=_(bt?.value||"📌 Servidor")),Ve&&(Ve.textContent=_(Et?.value||"{server}")),qe&&(qe.textContent=S?.value||"Verificar con Discord"),Ue&&(Ue.textContent=ee?.value||""),Fe&&(Fe.textContent=_(wt?.value||"Nebula Security")),_e.style.setProperty("--preview-embed-color",m?.value||"#8b5cf6"),je&&(je.style.display=o("verifyShowBotAvatar")?.checked?"flex":"none"),H){const ze=!!o("verifyShowCustomThumbnail")?.checked,At=!!o("verifyShowServerIcon")?.checked;ze&&Ne?.value?(H.src=Ne.value,H.style.display="block"):At&&H.src?H.style.display="block":H.style.display="none"}te&&(!!o("verifyShowEmbedImage")?.checked&&Le?.value?(te.src=Le.value,te.style.display="block"):te.style.display="none"),Ge&&(Ge.style.display=o("verifyShowTimestamp")?.checked?"inline":"none")},T=()=>({enabled:o("verifyEnabled").checked,verificationChannelId:o("verifyChannel").value,logsChannelId:o("verifyLogs").value,verifiedRoleId:o("verifyRole").value,verificationMethod:U(),embedTitle:o("verifyEmbedTitle").value,embedDescription:o("verifyEmbedDescription").value,embedColor:o("verifyEmbedColor").value,buttonText:o("verifyButtonText").value,buttonEmoji:o("verifyButtonEmoji").value,reactionEmoji:o("verifyReactionEmoji").value,embedFieldName:o("verifyEmbedFieldName").value,embedFieldValue:o("verifyEmbedFieldValue").value,embedFooterText:o("verifyEmbedFooterText").value,embedThumbnailUrl:o("verifyEmbedThumbnailUrl").value,embedImageUrl:o("verifyEmbedImageUrl").value,showBotAvatar:o("verifyShowBotAvatar").checked,showServerIcon:o("verifyShowServerIcon").checked,showCustomThumbnail:o("verifyShowCustomThumbnail").checked,showEmbedImage:o("verifyShowEmbedImage").checked,showTimestamp:o("verifyShowTimestamp").checked,logEmbedTitle:o("verifyLogTitle").value,logEmbedDescription:o("verifyLogDescription").value,logEmbedColor:o("verifyLogColor").value,logOptions:G(),webAppearance:I(),security:{detectVpn:o("verifyDetectVpn").checked,detectProxy:o("verifyDetectProxy").checked,detectTor:o("verifyDetectTor").checked,detectAltAccounts:o("verifyDetectAltAccounts").checked,minimumAccountAgeEnabled:o("verifyMinimumAgeEnabled").checked,minimumAccountAgeDays:Number(o("verifyMinimumAgeDays").value),blockWithoutAvatar:o("verifyBlockWithoutAvatar").checked,blockWithoutBanner:o("verifyBlockWithoutBanner").checked,allowReverification:o("verifyAllowReverification").checked,notifySecurityFailure:o("verifyNotifySecurityFailure").checked}});["verifyEmbedTitle","verifyEmbedDescription","verifyEmbedColor","verifyEmbedColorText","verifyButtonText","verifyButtonEmoji","verifyEmbedFieldName","verifyEmbedFieldValue","verifyEmbedFooterText","verifyEmbedThumbnailUrl","verifyEmbedImageUrl","verifyShowBotAvatar","verifyShowServerIcon","verifyShowCustomThumbnail","verifyShowEmbedImage","verifyShowTimestamp"].forEach(l=>{const d=o(l);if(!d)return;const m=d.type==="checkbox"?"change":"input";d.addEventListener(m,z)}),o("verifyEmbedColor")?.addEventListener("input",l=>{o("verifyEmbedColorText").value=l.target.value,z()}),o("verifyEmbedColorText")?.addEventListener("input",l=>{const d=l.target.value.trim();/^#[0-9a-f]{6}$/i.test(d)&&(o("verifyEmbedColor").value=d,z())}),z(),o("backToServerPanel")?.addEventListener("click",()=>{Q(i.id)}),document.querySelectorAll(".verify-tab").forEach(l=>{l.addEventListener("click",()=>{document.querySelectorAll(".verify-tab").forEach(d=>d.classList.remove("active")),document.querySelectorAll(".verify-tab-panel").forEach(d=>d.classList.remove("active")),l.classList.add("active"),document.querySelector(`[data-verify-panel="${l.dataset.verifyTab}"]`)?.classList.add("active")})}),o("verifyEnabled")?.addEventListener("change",l=>{const d=o("verifySystemStatus");d.textContent=l.target.checked?"ACTIVADO":"DESACTIVADO",d.classList.toggle("enabled",l.target.checked),d.classList.toggle("disabled",!l.target.checked)}),o("verifyLogs")?.addEventListener("change",l=>{o("verifyLogsSettings")?.classList.toggle("visible",!!l.target.value)});const f=(l,d)=>{const m=o(l),S=o(d);m?.addEventListener("input",()=>{S.value=m.value}),S?.addEventListener("input",()=>{/^#[0-9A-F]{6}$/i.test(S.value)&&(m.value=S.value)})};f("verifyEmbedColor","verifyEmbedColorText"),f("verifyLogColor","verifyLogColorText");function I(){return{pageName:document.getElementById("verifyPageName")?.value.trim()||"",pageDescription:document.getElementById("verifyPageDescription")?.value.trim()||"",logoUrl:document.getElementById("verifyLogoUrl")?.value.trim()||"",backgroundUrl:document.getElementById("verifyBackgroundUrl")?.value.trim()||"",primaryColor:document.getElementById("verifyPrimaryColorText")?.value||"#8b5cf6",secondaryColor:document.getElementById("verifySecondaryColorText")?.value||"#6d28d9",buttonColor:document.getElementById("verifyButtonColorText")?.value||"#7c3aed",textColor:document.getElementById("verifyTextColorText")?.value||"#ffffff",cardColor:document.getElementById("verifyCardColorText")?.value||"#0f0f1a",backgroundSolidColor:document.getElementById("verifyBackgroundSolidColorText")?.value||"#05050a",gradientStart:document.getElementById("verifyGradientStartText")?.value||"#05050a",gradientEnd:document.getElementById("verifyGradientEndText")?.value||"#160c2b",backgroundType:document.getElementById("verifyBackgroundType")?.value||"space",spaceBackground:!!document.getElementById("verifySpaceBackground")?.checked,animationsEnabled:!!document.getElementById("verifyAnimationsEnabled")?.checked,particlesEnabled:!!document.getElementById("verifyParticlesEnabled")?.checked,glowEnabled:!!document.getElementById("verifyGlowEnabled")?.checked,fadeEnabled:!!document.getElementById("verifyFadeEnabled")?.checked,hoverEnabled:!!document.getElementById("verifyHoverEnabled")?.checked,cursorGlowEnabled:!!document.getElementById("verifyCursorGlowEnabled")?.checked,buttonAnimationEnabled:!!document.getElementById("verifyButtonAnimationEnabled")?.checked,logoAnimationEnabled:!!document.getElementById("verifyLogoAnimationEnabled")?.checked,particleCount:Number(document.getElementById("verifyParticleCount")?.value||100),glowIntensity:Number(document.getElementById("verifyGlowIntensity")?.value||80),cardBlur:Number(document.getElementById("verifyCardBlur")?.value||18),cardOpacity:Number(document.getElementById("verifyCardOpacity")?.value||88),cardRadius:Number(document.getElementById("verifyCardRadius")?.value||24),cardShadow:Number(document.getElementById("verifyCardShadow")?.value||80),verifyButtonText:document.getElementById("verifyAppearanceButtonText")?.value.trim()||"Verificar con Discord",verifyButtonIcon:document.getElementById("verifyButtonIcon")?.value||"discord",verifyButtonSize:document.getElementById("verifyButtonSize")?.value||"large",verifyButtonRadius:Number(document.getElementById("verifyButtonRadius")?.value||14),verificationSound:!!document.getElementById("verifyVerificationSound")?.checked,errorSound:!!document.getElementById("verifyErrorSound")?.checked,openingSound:!!document.getElementById("verifyOpeningSound")?.checked,soundVolume:Number(document.getElementById("verifySoundVolume")?.value||50)}}function C(){const l=I(),d=document.getElementById("verifyAppearanceFrame");d?.contentWindow&&d.contentWindow.postMessage({type:"nebula-appearance-preview",appearance:l},window.location.origin)}document.getElementById("verifyAppearanceFrame")?.addEventListener("load",()=>{setTimeout(C,150)}),["verifyPageName","verifyPageDescription","verifyLogoUrl","verifyBackgroundUrl","verifyPrimaryColor","verifyPrimaryColorText","verifySecondaryColor","verifySecondaryColorText","verifyButtonColor","verifyButtonColorText","verifyTextColor","verifyTextColorText","verifyCardColor","verifyCardColorText","verifyBackgroundSolidColor","verifyBackgroundSolidColorText","verifyGradientStart","verifyGradientStartText","verifyGradientEnd","verifyGradientEndText","verifyBackgroundType","verifySpaceBackground","verifyParticlesEnabled","verifyAnimationsEnabled","verifyGlowEnabled","verifyFadeEnabled","verifyHoverEnabled","verifyCursorGlowEnabled","verifyButtonAnimationEnabled","verifyLogoAnimationEnabled","verifyParticleCount","verifyGlowIntensity","verifyCardBlur","verifyCardOpacity","verifyCardRadius","verifyCardShadow","verifyAppearanceButtonText","verifyButtonIcon","verifyButtonSize","verifyButtonRadius","verifyOpeningSound","verifyVerificationSound","verifyErrorSound","verifySoundVolume"].forEach(l=>{const d=document.getElementById(l);if(!d)return;const m=d.type==="checkbox"||d.tagName==="SELECT"?"change":"input";d.addEventListener(m,C)}),[["verifyPrimaryColor","verifyPrimaryColorText"],["verifySecondaryColor","verifySecondaryColorText"],["verifyButtonColor","verifyButtonColorText"],["verifyTextColor","verifyTextColorText"],["verifyCardColor","verifyCardColorText"],["verifyBackgroundSolidColor","verifyBackgroundSolidColorText"],["verifyGradientStart","verifyGradientStartText"],["verifyGradientEnd","verifyGradientEndText"]].forEach(([l,d])=>{const m=document.getElementById(l),S=document.getElementById(d);m?.addEventListener("input",()=>{S.value=m.value,C()}),S?.addEventListener("input",()=>{const ee=S.value.trim();/^#[0-9a-f]{6}$/i.test(ee)&&(m.value=ee,C())})}),document.querySelectorAll(".appearance-range-control input[type='range']").forEach(l=>{const d=document.getElementById(`${l.id}Value`),m=()=>{d&&(d.textContent=`${l.value}${l.dataset.suffix||""}`),C()};l.addEventListener("input",m),m()}),C(),o("saveVerification")?.addEventListener("click",async()=>{const l=o("saveVerification"),d=T();if(!d.verificationChannelId){O("Falta el canal","Seleccioná el canal de verificación.");return}if(!d.verifiedRoleId){O("Falta el rol","Seleccioná el rol que recibirá el usuario.");return}l.disabled=!0,l.textContent="Guardando...";try{const m=await fetch(`${R}/api/servers/${i.id}/verification`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(d)}),S=await m.json();if(!m.ok||!S.success)throw new Error(S.message||"No se pudo guardar.");O("Configuración guardada","Todos los cambios quedaron guardados.")}catch(m){O("Error al guardar",m.message)}finally{l.disabled=!1,l.textContent="Guardar configuración"}}),o("sendVerificationPanel")?.addEventListener("click",async()=>{const l=o("sendVerificationPanel");o("saveVerification").click(),await new Promise(m=>setTimeout(m,700)),l.disabled=!0,l.textContent="Enviando...";try{const m=await fetch(`${R}/api/servers/${i.id}/verification/send`,{method:"POST"}),S=await m.json();if(!m.ok||!S.success)throw new Error(S.message||"No se pudo enviar el panel.");O("Panel enviado","Revisá el canal de verificación en Discord.")}catch(m){O("Error al enviar",m.message)}finally{l.disabled=!1,l.textContent="Enviar panel a Discord"}})}async function ki(i){b.innerHTML=`
    <div class="dynamic-page">
      <div class="servers-loading">
        <div class="loading-spinner"></div>
        <strong>Cargando configuración de bienvenida...</strong>
      </div>
    </div>
  `;try{const[e,t]=await Promise.all([fetch(`${R}/api/servers/${i.id}/text-channels`),fetch(`${R}/api/servers/${i.id}/welcome`)]),s=await e.json(),n=await t.json();if(!s.success||!n.success)throw new Error("No se pudo cargar la configuración");Di(i,s.data,n.data)}catch(e){b.innerHTML=`
      <div class="dynamic-page">
        <div class="servers-error">
          <div class="servers-error-icon">!</div>
          <h3>No se pudo abrir Bienvenida</h3>
          <p>${e.message}</p>
          <button id="backToServerPanel">
            Volver al servidor
          </button>
        </div>
      </div>
    `,document.getElementById("backToServerPanel")?.addEventListener("click",()=>{Q(i.id)})}}function Di(i,e,t){const s=e.map(f=>`
    <option
      value="${f.id}"
      ${f.id===t.channelId?"selected":""}
    >
      # ${f.name}
    </option>
  `).join("");b.innerHTML=`
    <div class="dynamic-page welcome-config-page">

      <section class="section-header">
        <div>
          <span>MENSAJES AUTOMÁTICOS</span>
          <h1>Bienvenida</h1>
          <p>
            Configurá el mensaje que recibirá cada usuario
            cuando ingrese a ${i.name}.
          </p>
        </div>

        <button id="backToServerPanel" class="section-action">
          ‹ Volver al servidor
        </button>
      </section>

      <div class="welcome-layout">

        <article class="section-panel">
          <div class="section-panel-head">
            <div>
              <span>CONFIGURACIÓN</span>
              <h3>Mensaje de ingreso</h3>
            </div>
          </div>

          <div class="welcome-enabled-row">
            <div>
              <strong>Activar bienvenida</strong>
              <p>
                El bot enviará el mensaje cuando entre alguien.
              </p>
            </div>

            <label class="switch-control">
              <input
                id="welcomeEnabled"
                type="checkbox"
                ${t.enabled?"checked":""}
              >
              <span></span>
            </label>
          </div>

          <label class="welcome-field">
            <span>CANAL DE BIENVENIDA</span>
            <select id="welcomeChannel">
              <option value="">Seleccionar canal...</option>
              ${s}
            </select>
          </label>

          <label class="welcome-field">
            <span>TÍTULO</span>
            <input
              id="welcomeTitle"
              maxlength="256"
              value="${y(t.title)}"
            >
          </label>

          <label class="welcome-field">
            <span>MENSAJE</span>
            <textarea
              id="welcomeMessage"
              maxlength="2000"
              rows="7"
            >${E(t.message)}</textarea>
          </label>
<div class="welcome-enabled-row">
  <div>
    <strong>Mostrar foto del usuario</strong>
    <p>
      Agrega el avatar del nuevo miembro al mensaje público.
    </p>
  </div>

  <label class="switch-control">
    <input
      id="welcomeShowAvatar"
      type="checkbox"
      ${t.showAvatar!==!1?"checked":""}
    >
    <span></span>
  </label>
</div>
          <label class="welcome-field">
            <span>COLOR DEL MENSAJE</span>

            <div class="welcome-color-row">
              <input
                id="welcomeColor"
                type="color"
                value="${t.color}"
              >

              <input
                id="welcomeColorText"
                value="${t.color}"
                maxlength="7"
              >
            </div>
          </label>

          <div class="welcome-variables">
            <strong>Variables disponibles</strong>

            <div>
<button data-variable="{user}">{user}</button>
<button data-variable="{mention}">{mention}</button>
<button data-variable="{username}">{username}</button>
<button data-variable="{displayname}">{displayname}</button>
<button data-variable="{userid}">{userid}</button>
<button data-variable="{server}">{server}</button>
<button data-variable="{serverid}">{serverid}</button>
<button data-variable="{members}">{members}</button>
<button data-variable="{membercount}">{membercount}</button>
<button data-variable="{joindate}">{joindate}</button>
           </div>
          </div>
<div class="welcome-section-divider">
  <span>MENSAJE PRIVADO</span>
</div>

<div class="welcome-enabled-row">
  <div>
    <strong>Enviar mensaje por MD</strong>
    <p>
      Envía un mensaje privado al usuario cuando se una.
    </p>
  </div>

  <label class="switch-control">
    <input
      id="welcomeDmEnabled"
      type="checkbox"
      ${t.dmEnabled?"checked":""}
    >
    <span></span>
  </label>
</div>

<div
  id="welcomeDmFields"
  class="welcome-dm-fields ${t.dmEnabled?"visible":""}"
>
  <label class="welcome-field">
    <span>TÍTULO DEL MD</span>

    <input
      id="welcomeDmTitle"
      maxlength="256"
      value="${y(t.dmTitle)}"
    >
  </label>

  <label class="welcome-field">
    <span>MENSAJE PRIVADO</span>

    <textarea
      id="welcomeDmMessage"
      maxlength="2000"
      rows="7"
    >${E(t.dmMessage)}</textarea>
  </label>

  <label class="welcome-field">
    <span>COLOR DEL MD</span>

    <div class="welcome-color-row">
      <input
        id="welcomeDmColor"
        type="color"
        value="${t.dmColor}"
      >

      <input
        id="welcomeDmColorText"
        value="${t.dmColor}"
        maxlength="7"
      >
    </div>
  </label>

  <div class="welcome-enabled-row">
    <div>
      <strong>Mostrar foto en el MD</strong>
      <p>
        Agrega el avatar del usuario al mensaje privado.
      </p>
    </div>

    <label class="switch-control">
      <input
        id="welcomeDmShowAvatar"
        type="checkbox"
        ${t.dmShowAvatar!==!1?"checked":""}
      >
      <span></span>
    </label>
  </div>
</div>

<div class="welcome-actions-row">
  <button
    id="testWelcome"
    class="welcome-test-button"
    type="button"
  >
    Enviar mensaje de prueba
  </button>

  <button
    id="saveWelcome"
    class="welcome-save-button"
    type="button"
  >
    Guardar configuración
  </button>
</div>
        </article>

        <article class="section-panel">
          <div class="section-panel-head">
            <div>
              <span>VISTA PREVIA</span>
              <h3>Discord</h3>
            </div>
          </div>

          <div class="welcome-discord-preview">
            <div class="preview-bot-avatar">N</div>

            <div class="preview-message-content">
              <div class="preview-author">
                Nebula Bot
                <small>BOT</small>
                <time>Ahora</time>
              </div>

              <div
                class="preview-embed"
                id="welcomePreviewEmbed"
              >
                <strong id="welcomePreviewTitle"></strong>
                <p id="welcomePreviewMessage"></p>

                <div class="preview-member">
                  <div>AM</div>

                  <span>
                    <strong>Alvi Moreyra</strong>
                    Nuevo miembro
                  </span>
                </div>

                <small>
                  ${i.name} · Miembro número
                  ${i.members}
                </small>
              </div>
            </div>
          </div>

<div
  id="welcomeDmPreviewSection"
  class="welcome-dm-preview-section ${t.dmEnabled?"visible":""}"
>
  <div class="welcome-preview-label">
    VISTA PREVIA DEL MENSAJE PRIVADO
  </div>

  <div class="welcome-discord-preview dm-preview">
    <div class="preview-bot-avatar">N</div>

    <div class="preview-message-content">
      <div class="preview-author">
        Nebula Bot
        <small>BOT</small>
        <time>Ahora</time>
      </div>

      <div
        class="preview-embed"
        id="welcomeDmPreviewEmbed"
      >
        <strong id="welcomeDmPreviewTitle"></strong>

        <p id="welcomeDmPreviewMessage"></p>

        <div
          id="welcomeDmPreviewAvatar"
          class="preview-member"
        >
          <div>AM</div>

          <span>
            <strong>Alvi Moreyra</strong>
            Mensaje privado
          </span>
        </div>

        <small>
          Mensaje enviado por ${i.name}
        </small>
      </div>
    </div>
  </div>
</div>

<div class="welcome-help">
  <strong>Ejemplo de variables</strong>

  <p>
    <code>{user}</code> menciona al usuario y
    <code>{server}</code> escribe el nombre del servidor.
  </p>
</div>

</article>

  </div>
  </div>
  `;const n=document.getElementById("welcomeEnabled"),r=document.getElementById("welcomeChannel"),a=document.getElementById("welcomeTitle"),c=document.getElementById("welcomeMessage"),u=document.getElementById("welcomeColor"),w=document.getElementById("welcomeColorText"),A=document.getElementById("welcomeShowAvatar"),p=document.getElementById("welcomeDmEnabled"),h=document.getElementById("welcomeDmFields"),o=document.getElementById("welcomeDmTitle"),O=document.getElementById("welcomeDmMessage"),U=document.getElementById("welcomeDmColor"),G=document.getElementById("welcomeDmColorText"),_=document.getElementById("welcomeDmShowAvatar"),z=document.getElementById("welcomeDmPreviewSection");function T(){const f=ae(a.value,i),I=ae(c.value,i);document.getElementById("welcomePreviewTitle").textContent=f,document.getElementById("welcomePreviewMessage").textContent=I,document.getElementById("welcomePreviewEmbed").style.borderLeftColor=u.value;const C=document.querySelector("#welcomePreviewEmbed .preview-member");C&&(C.style.display=A.checked?"flex":"none");const F=ae(o.value,i),xe=ae(O.value,i);document.getElementById("welcomeDmPreviewTitle").textContent=F,document.getElementById("welcomeDmPreviewMessage").textContent=xe,document.getElementById("welcomeDmPreviewEmbed").style.borderLeftColor=U.value,document.getElementById("welcomeDmPreviewAvatar").style.display=_.checked?"flex":"none"}u.addEventListener("input",()=>{w.value=u.value,T()}),w.addEventListener("input",()=>{/^#[0-9A-F]{6}$/i.test(w.value)&&(u.value=w.value,T())}),a.addEventListener("input",T),c.addEventListener("input",T),p.addEventListener("change",()=>{h.classList.toggle("visible",p.checked),z.classList.toggle("visible",p.checked),T()}),A.addEventListener("change",T),_.addEventListener("change",T),o.addEventListener("input",T),O.addEventListener("input",T),U.addEventListener("input",()=>{G.value=U.value,T()}),G.addEventListener("input",()=>{/^#[0-9A-F]{6}$/i.test(G.value)&&(U.value=G.value,T())}),document.querySelectorAll("[data-variable]").forEach(f=>{f.addEventListener("click",()=>{const I=f.dataset.variable,C=c.selectionStart,F=c.selectionEnd;c.value=c.value.slice(0,C)+I+c.value.slice(F),c.focus(),c.selectionStart=c.selectionEnd=C+I.length,T()})}),document.getElementById("backToServerPanel").addEventListener("click",()=>{Q(i.id)});async function me(){const f=document.getElementById("saveWelcome");f.disabled=!0,f.textContent="Guardando...";try{const I=await fetch(`${R}/api/servers/${i.id}/welcome`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({enabled:n.checked,channelId:r.value,title:a.value,message:c.value,color:u.value,showAvatar:A.checked,dmEnabled:p.checked,dmTitle:o.value,dmMessage:O.value,dmColor:U.value,dmShowAvatar:_.checked})}),C=await I.json();if(!I.ok||!C.success)throw new Error(C.message||"No se pudo guardar");return B.querySelector("strong").textContent="Bienvenida guardada",B.querySelector("p").textContent="Todos los cambios quedaron guardados.",x(),!0}catch(I){return B.querySelector("strong").textContent="Error al guardar",B.querySelector("p").textContent=I.message,x(),!1}finally{f.disabled=!1,f.textContent="Guardar configuración"}}document.getElementById("saveWelcome").addEventListener("click",me),document.getElementById("testWelcome").addEventListener("click",async()=>{const f=document.getElementById("testWelcome");f.disabled=!0,f.textContent="Preparando prueba...";try{if(!await me())return;f.textContent="Enviando...";const C=await fetch(`${R}/api/servers/${i.id}/welcome/test`,{method:"POST"}),F=await C.json();if(!C.ok||!F.success)throw new Error(F.message||"No se pudo enviar la prueba");B.querySelector("strong").textContent="Prueba enviada",B.querySelector("p").textContent="Revisá el canal de bienvenida en Discord.",x()}catch(I){B.querySelector("strong").textContent="Error en la prueba",B.querySelector("p").textContent=I.message,x()}finally{f.disabled=!1,f.textContent="Enviar mensaje de prueba"}}),T()}function ae(i,e){return String(i).replaceAll("{user}","@Alvi Moreyra").replaceAll("{mention}","@Alvi Moreyra").replaceAll("{username}","Alvi").replaceAll("{displayname}","Alvi Moreyra").replaceAll("{userid}","123456789012345678").replaceAll("{server}",e.name).replaceAll("{serverid}",e.id).replaceAll("{members}",e.members.toLocaleString("es-AR")).replaceAll("{membercount}",e.members.toLocaleString("es-AR")).replaceAll("{joindate}",new Date().toLocaleDateString("es-AR"))}function E(i){return String(i).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;")}function y(i){return E(i).replaceAll('"',"&quot;").replaceAll("'","&#039;")}Te();

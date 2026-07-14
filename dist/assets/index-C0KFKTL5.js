(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))i(n);new MutationObserver(n=>{for(const r of n)if(r.type==="childList")for(const a of r.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&i(a)}).observe(document,{childList:!0,subtree:!0});function t(n){const r={};return n.integrity&&(r.integrity=n.integrity),n.referrerPolicy&&(r.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?r.credentials="include":n.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function i(n){if(n.ep)return;n.ep=!0;const r=t(n);fetch(n.href,r)}})();const I=Object.create(null);I.open="0";I.close="1";I.ping="2";I.pong="3";I.message="4";I.upgrade="5";I.noop="6";const Z=Object.create(null);Object.keys(I).forEach(s=>{Z[I[s]]=s});const de={type:"error",data:"parser error"},Ie=typeof Blob=="function"||typeof Blob<"u"&&Object.prototype.toString.call(Blob)==="[object BlobConstructor]",De=typeof ArrayBuffer=="function",Oe=s=>typeof ArrayBuffer.isView=="function"?ArrayBuffer.isView(s):s&&s.buffer instanceof ArrayBuffer,ge=({type:s,data:e},t,i)=>Ie&&e instanceof Blob?t?i(e):Ce(e,i):De&&(e instanceof ArrayBuffer||Oe(e))?t?i(e):Ce(new Blob([e]),i):i(I[s]+(e||"")),Ce=(s,e)=>{const t=new FileReader;return t.onload=function(){const i=t.result.split(",")[1];e("b"+(i||""))},t.readAsDataURL(s)};function Se(s){return s instanceof Uint8Array?s:s instanceof ArrayBuffer?new Uint8Array(s):new Uint8Array(s.buffer,s.byteOffset,s.byteLength)}let ae;function Xe(s,e){if(Ie&&s.data instanceof Blob)return s.data.arrayBuffer().then(Se).then(e);if(De&&(s.data instanceof ArrayBuffer||Oe(s.data)))return e(Se(s.data));ge(s,!1,t=>{ae||(ae=new TextEncoder),e(ae.encode(t))})}const Te="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",F=typeof Uint8Array>"u"?[]:new Uint8Array(256);for(let s=0;s<Te.length;s++)F[Te.charCodeAt(s)]=s;const Ze=s=>{let e=s.length*.75,t=s.length,i,n=0,r,a,l,d;s[s.length-1]==="="&&(e--,s[s.length-2]==="="&&e--);const b=new ArrayBuffer(e),v=new Uint8Array(b);for(i=0;i<t;i+=4)r=F[s.charCodeAt(i)],a=F[s.charCodeAt(i+1)],l=F[s.charCodeAt(i+2)],d=F[s.charCodeAt(i+3)],v[n++]=r<<2|a>>4,v[n++]=(a&15)<<4|l>>2,v[n++]=(l&3)<<6|d&63;return b},Qe=typeof ArrayBuffer=="function",ye=(s,e)=>{if(typeof s!="string")return{type:"message",data:Ne(s,e)};const t=s.charAt(0);return t==="b"?{type:"message",data:et(s.substring(1),e)}:Z[t]?s.length>1?{type:Z[t],data:s.substring(1)}:{type:Z[t]}:de},et=(s,e)=>{if(Qe){const t=Ze(s);return Ne(t,e)}else return{base64:!0,data:s}},Ne=(s,e)=>e==="blob"?s instanceof Blob?s:new Blob([s]):s instanceof ArrayBuffer?s:s.buffer,Le="",tt=(s,e)=>{const t=s.length,i=new Array(t);let n=0;s.forEach((r,a)=>{ge(r,!1,l=>{i[a]=l,++n===t&&e(i.join(Le))})})},st=(s,e)=>{const t=s.split(Le),i=[];for(let n=0;n<t.length;n++){const r=ye(t[n],e);if(i.push(r),r.type==="error")break}return i};function it(){return new TransformStream({transform(s,e){Xe(s,t=>{const i=t.length;let n;if(i<126)n=new Uint8Array(1),new DataView(n.buffer).setUint8(0,i);else if(i<65536){n=new Uint8Array(3);const r=new DataView(n.buffer);r.setUint8(0,126),r.setUint16(1,i)}else{n=new Uint8Array(9);const r=new DataView(n.buffer);r.setUint8(0,127),r.setBigUint64(1,BigInt(i))}s.data&&typeof s.data!="string"&&(n[0]|=128),e.enqueue(n),e.enqueue(t)})}})}let oe;function K(s){return s.reduce((e,t)=>e+t.length,0)}function J(s,e){if(s[0].length===e)return s.shift();const t=new Uint8Array(e);let i=0;for(let n=0;n<e;n++)t[n]=s[0][i++],i===s[0].length&&(s.shift(),i=0);return s.length&&i<s[0].length&&(s[0]=s[0].slice(i)),t}function nt(s,e){oe||(oe=new TextDecoder);const t=[];let i=0,n=-1,r=!1;return new TransformStream({transform(a,l){for(t.push(a);;){if(i===0){if(K(t)<1)break;const d=J(t,1);r=(d[0]&128)===128,n=d[0]&127,n<126?i=3:n===126?i=1:i=2}else if(i===1){if(K(t)<2)break;const d=J(t,2);n=new DataView(d.buffer,d.byteOffset,d.length).getUint16(0),i=3}else if(i===2){if(K(t)<8)break;const d=J(t,8),b=new DataView(d.buffer,d.byteOffset,d.length),v=b.getUint32(0);if(v>Math.pow(2,21)-1){l.enqueue(de);break}n=v*Math.pow(2,32)+b.getUint32(4),i=3}else{if(K(t)<n)break;const d=J(t,n);l.enqueue(ye(r?d:oe.decode(d),e)),i=0}if(n===0||n>s){l.enqueue(de);break}}}})}const Be=4;function g(s){if(s)return rt(s)}function rt(s){for(var e in g.prototype)s[e]=g.prototype[e];return s}g.prototype.on=g.prototype.addEventListener=function(s,e){return this._callbacks=this._callbacks||{},(this._callbacks["$"+s]=this._callbacks["$"+s]||[]).push(e),this};g.prototype.once=function(s,e){function t(){this.off(s,t),e.apply(this,arguments)}return t.fn=e,this.on(s,t),this};g.prototype.off=g.prototype.removeListener=g.prototype.removeAllListeners=g.prototype.removeEventListener=function(s,e){if(this._callbacks=this._callbacks||{},arguments.length==0)return this._callbacks={},this;var t=this._callbacks["$"+s];if(!t)return this;if(arguments.length==1)return delete this._callbacks["$"+s],this;for(var i,n=0;n<t.length;n++)if(i=t[n],i===e||i.fn===e){t.splice(n,1);break}return t.length===0&&delete this._callbacks["$"+s],this};g.prototype.emit=function(s){this._callbacks=this._callbacks||{};for(var e=new Array(arguments.length-1),t=this._callbacks["$"+s],i=1;i<arguments.length;i++)e[i-1]=arguments[i];if(t){t=t.slice(0);for(var i=0,n=t.length;i<n;++i)t[i].apply(this,e)}return this};g.prototype.emitReserved=g.prototype.emit;g.prototype.listeners=function(s){return this._callbacks=this._callbacks||{},this._callbacks["$"+s]||[]};g.prototype.hasListeners=function(s){return!!this.listeners(s).length};const ie=typeof Promise=="function"&&typeof Promise.resolve=="function"?e=>Promise.resolve().then(e):(e,t)=>t(e,0),A=typeof self<"u"?self:typeof window<"u"?window:Function("return this")(),at="arraybuffer";function xe(s,...e){return e.reduce((t,i)=>(s.hasOwnProperty(i)&&(t[i]=s[i]),t),{})}const ot=A.setTimeout,ct=A.clearTimeout;function ne(s,e){e.useNativeTimers?(s.setTimeoutFn=ot.bind(A),s.clearTimeoutFn=ct.bind(A)):(s.setTimeoutFn=A.setTimeout.bind(A),s.clearTimeoutFn=A.clearTimeout.bind(A))}const lt=1.33;function dt(s){return typeof s=="string"?ut(s):Math.ceil((s.byteLength||s.size)*lt)}function ut(s){let e=0,t=0;for(let i=0,n=s.length;i<n;i++)e=s.charCodeAt(i),e<128?t+=1:e<2048?t+=2:e<55296||e>=57344?t+=3:(i++,t+=4);return t}function Pe(){return Date.now().toString(36).substring(3)+Math.random().toString(36).substring(2,5)}function pt(s){let e="";for(let t in s)s.hasOwnProperty(t)&&(e.length&&(e+="&"),e+=encodeURIComponent(t)+"="+encodeURIComponent(s[t]));return e}function ht(s){let e={},t=s.split("&");for(let i=0,n=t.length;i<n;i++){let r=t[i].split("=");e[decodeURIComponent(r[0])]=decodeURIComponent(r[1])}return e}class vt extends Error{constructor(e,t,i){super(e),this.description=t,this.context=i,this.type="TransportError"}}class be extends g{constructor(e){super(),this.writable=!1,ne(this,e),this.opts=e,this.query=e.query,this.socket=e.socket,this.supportsBinary=!e.forceBase64}onError(e,t,i){return super.emitReserved("error",new vt(e,t,i)),this}open(){return this.readyState="opening",this.doOpen(),this}close(){return(this.readyState==="opening"||this.readyState==="open")&&(this.doClose(),this.onClose()),this}send(e){this.readyState==="open"&&this.write(e)}onOpen(){this.readyState="open",this.writable=!0,super.emitReserved("open")}onData(e){const t=ye(e,this.socket.binaryType);this.onPacket(t)}onPacket(e){super.emitReserved("packet",e)}onClose(e){this.readyState="closed",super.emitReserved("close",e)}pause(e){}createUri(e,t={}){return e+"://"+this._hostname()+this._port()+this.opts.path+this._query(t)}_hostname(){const e=this.opts.hostname;return e.indexOf(":")===-1?e:"["+e+"]"}_port(){return this.opts.port&&(this.opts.secure&&Number(this.opts.port)!==443||!this.opts.secure&&Number(this.opts.port)!==80)?":"+this.opts.port:""}_query(e){const t=pt(e);return t.length?"?"+t:""}}class mt extends be{constructor(){super(...arguments),this._polling=!1}get name(){return"polling"}doOpen(){this._poll()}pause(e){this.readyState="pausing";const t=()=>{this.readyState="paused",e()};if(this._polling||!this.writable){let i=0;this._polling&&(i++,this.once("pollComplete",function(){--i||t()})),this.writable||(i++,this.once("drain",function(){--i||t()}))}else t()}_poll(){this._polling=!0,this.doPoll(),this.emitReserved("poll")}onData(e){const t=i=>{if(this.readyState==="opening"&&i.type==="open"&&this.onOpen(),i.type==="close")return this.onClose({description:"transport closed by the server"}),!1;this.onPacket(i)};st(e,this.socket.binaryType).forEach(t),this.readyState!=="closed"&&(this._polling=!1,this.emitReserved("pollComplete"),this.readyState==="open"&&this._poll())}doClose(){const e=()=>{this.write([{type:"close"}])};this.readyState==="open"?e():this.once("open",e)}write(e){this.writable=!1,tt(e,t=>{this.doWrite(t,()=>{this.writable=!0,this.emitReserved("drain")})})}uri(){const e=this.opts.secure?"https":"http",t=this.query||{};return this.opts.timestampRequests!==!1&&(t[this.opts.timestampParam]=Pe()),!this.supportsBinary&&!t.sid&&(t.b64=1),this.createUri(e,t)}}let $e=!1;try{$e=typeof XMLHttpRequest<"u"&&"withCredentials"in new XMLHttpRequest}catch{}const ft=$e;function gt(){}class yt extends mt{constructor(e){if(super(e),typeof location<"u"){const t=location.protocol==="https:";let i=location.port;i||(i=t?"443":"80"),this.xd=typeof location<"u"&&e.hostname!==location.hostname||i!==e.port}}doWrite(e,t){const i=this.request({method:"POST",data:e});i.on("success",t),i.on("error",(n,r)=>{this.onError("xhr post error",n,r)})}doPoll(){const e=this.request();e.on("data",this.onData.bind(this)),e.on("error",(t,i)=>{this.onError("xhr poll error",t,i)}),this.pollXhr=e}}class k extends g{constructor(e,t,i){super(),this.createRequest=e,ne(this,i),this._opts=i,this._method=i.method||"GET",this._uri=t,this._data=i.data!==void 0?i.data:null,this._create()}_create(){var e;const t=xe(this._opts,"agent","pfx","key","passphrase","cert","ca","ciphers","rejectUnauthorized","autoUnref");t.xdomain=!!this._opts.xd;const i=this._xhr=this.createRequest(t);try{i.open(this._method,this._uri,!0);try{if(this._opts.extraHeaders){i.setDisableHeaderCheck&&i.setDisableHeaderCheck(!0);for(let n in this._opts.extraHeaders)this._opts.extraHeaders.hasOwnProperty(n)&&i.setRequestHeader(n,this._opts.extraHeaders[n])}}catch{}if(this._method==="POST")try{i.setRequestHeader("Content-type","text/plain;charset=UTF-8")}catch{}try{i.setRequestHeader("Accept","*/*")}catch{}(e=this._opts.cookieJar)===null||e===void 0||e.addCookies(i),"withCredentials"in i&&(i.withCredentials=this._opts.withCredentials),this._opts.requestTimeout&&(i.timeout=this._opts.requestTimeout),i.onreadystatechange=()=>{var n;i.readyState===3&&((n=this._opts.cookieJar)===null||n===void 0||n.parseCookies(i.getResponseHeader("set-cookie"))),i.readyState===4&&(i.status===200||i.status===1223?this._onLoad():this.setTimeoutFn(()=>{this._onError(typeof i.status=="number"?i.status:0)},0))},i.send(this._data)}catch(n){this.setTimeoutFn(()=>{this._onError(n)},0);return}typeof document<"u"&&(this._index=k.requestsCount++,k.requests[this._index]=this)}_onError(e){this.emitReserved("error",e,this._xhr),this._cleanup(!0)}_cleanup(e){if(!(typeof this._xhr>"u"||this._xhr===null)){if(this._xhr.onreadystatechange=gt,e)try{this._xhr.abort()}catch{}typeof document<"u"&&delete k.requests[this._index],this._xhr=null}}_onLoad(){const e=this._xhr.responseText;e!==null&&(this.emitReserved("data",e),this.emitReserved("success"),this._cleanup())}abort(){this._cleanup()}}k.requestsCount=0;k.requests={};if(typeof document<"u"){if(typeof attachEvent=="function")attachEvent("onunload",_e);else if(typeof addEventListener=="function"){const s="onpagehide"in A?"pagehide":"unload";addEventListener(s,_e,!1)}}function _e(){for(let s in k.requests)k.requests.hasOwnProperty(s)&&k.requests[s].abort()}const bt=(function(){const s=Me({xdomain:!1});return s&&s.responseType!==null})();class Et extends yt{constructor(e){super(e);const t=e&&e.forceBase64;this.supportsBinary=bt&&!t}request(e={}){return Object.assign(e,{xd:this.xd},this.opts),new k(Me,this.uri(),e)}}function Me(s){const e=s.xdomain;try{if(typeof XMLHttpRequest<"u"&&(!e||ft))return new XMLHttpRequest}catch{}if(!e)try{return new A[["Active"].concat("Object").join("X")]("Microsoft.XMLHTTP")}catch{}}const qe=typeof navigator<"u"&&typeof navigator.product=="string"&&navigator.product.toLowerCase()==="reactnative";class wt extends be{get name(){return"websocket"}doOpen(){const e=this.uri(),t=this.opts.protocols,i=qe?{}:xe(this.opts,"agent","perMessageDeflate","pfx","key","passphrase","cert","ca","ciphers","rejectUnauthorized","localAddress","protocolVersion","origin","maxPayload","family","checkServerIdentity");this.opts.extraHeaders&&(i.headers=this.opts.extraHeaders);try{this.ws=this.createSocket(e,t,i)}catch(n){return this.emitReserved("error",n)}this.ws.binaryType=this.socket.binaryType,this.addEventListeners()}addEventListeners(){this.ws.onopen=()=>{this.opts.autoUnref&&this.ws._socket.unref(),this.onOpen()},this.ws.onclose=e=>this.onClose({description:"websocket connection closed",context:e}),this.ws.onmessage=e=>this.onData(e.data),this.ws.onerror=e=>this.onError("websocket error",e)}write(e){this.writable=!1;for(let t=0;t<e.length;t++){const i=e[t],n=t===e.length-1;ge(i,this.supportsBinary,r=>{try{this.doWrite(i,r)}catch{}n&&ie(()=>{this.writable=!0,this.emitReserved("drain")},this.setTimeoutFn)})}}doClose(){typeof this.ws<"u"&&(this.ws.onerror=()=>{},this.ws.close(),this.ws=null)}uri(){const e=this.opts.secure?"wss":"ws",t=this.query||{};return this.opts.timestampRequests&&(t[this.opts.timestampParam]=Pe()),this.supportsBinary||(t.b64=1),this.createUri(e,t)}}const ce=A.WebSocket||A.MozWebSocket;class At extends wt{createSocket(e,t,i){return qe?new ce(e,t,i):t?new ce(e,t):new ce(e)}doWrite(e,t){this.ws.send(t)}}class Ct extends be{get name(){return"webtransport"}doOpen(){try{this._transport=new WebTransport(this.createUri("https"),this.opts.transportOptions[this.name])}catch(e){return this.emitReserved("error",e)}this._transport.closed.then(()=>{this.onClose()}).catch(e=>{this.onError("webtransport error",e)}),this._transport.ready.then(()=>{this._transport.createBidirectionalStream().then(e=>{const t=nt(Number.MAX_SAFE_INTEGER,this.socket.binaryType),i=e.readable.pipeThrough(t).getReader(),n=it();n.readable.pipeTo(e.writable),this._writer=n.writable.getWriter();const r=()=>{i.read().then(({done:l,value:d})=>{l||(this.onPacket(d),r())}).catch(l=>{})};r();const a={type:"open"};this.query.sid&&(a.data=`{"sid":"${this.query.sid}"}`),this._writer.write(a).then(()=>this.onOpen())})})}write(e){this.writable=!1;for(let t=0;t<e.length;t++){const i=e[t],n=t===e.length-1;this._writer.write(i).then(()=>{n&&ie(()=>{this.writable=!0,this.emitReserved("drain")},this.setTimeoutFn)})}}doClose(){var e;(e=this._transport)===null||e===void 0||e.close()}}const St={websocket:At,webtransport:Ct,polling:Et},Tt=/^(?:(?![^:@\/?#]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@\/?#]*)(?::([^:@\/?#]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/,_t=["source","protocol","authority","userInfo","user","password","host","port","relative","path","directory","file","query","anchor"];function ue(s){if(s.length>8e3)throw"URI too long";const e=s,t=s.indexOf("["),i=s.indexOf("]");t!=-1&&i!=-1&&(s=s.substring(0,t)+s.substring(t,i).replace(/:/g,";")+s.substring(i,s.length));let n=Tt.exec(s||""),r={},a=14;for(;a--;)r[_t[a]]=n[a]||"";return t!=-1&&i!=-1&&(r.source=e,r.host=r.host.substring(1,r.host.length-1).replace(/;/g,":"),r.authority=r.authority.replace("[","").replace("]","").replace(/;/g,":"),r.ipv6uri=!0),r.pathNames=Rt(r,r.path),r.queryKey=kt(r,r.query),r}function Rt(s,e){const t=/\/{2,9}/g,i=e.replace(t,"/").split("/");return(e.slice(0,1)=="/"||e.length===0)&&i.splice(0,1),e.slice(-1)=="/"&&i.splice(i.length-1,1),i}function kt(s,e){const t={};return e.replace(/(?:^|&)([^&=]*)=?([^&]*)/g,function(i,n,r){n&&(t[n]=r)}),t}const pe=typeof addEventListener=="function"&&typeof removeEventListener=="function",Q=[];pe&&addEventListener("offline",()=>{Q.forEach(s=>s())},!1);class L extends g{constructor(e,t){if(super(),this.binaryType=at,this.writeBuffer=[],this._prevBufferLen=0,this._pingInterval=-1,this._pingTimeout=-1,this._maxPayload=-1,this._pingTimeoutTime=1/0,e&&typeof e=="object"&&(t=e,e=null),e){const i=ue(e);t.hostname=i.host,t.secure=i.protocol==="https"||i.protocol==="wss",t.port=i.port,i.query&&(t.query=i.query)}else t.host&&(t.hostname=ue(t.host).host);ne(this,t),this.secure=t.secure!=null?t.secure:typeof location<"u"&&location.protocol==="https:",t.hostname&&!t.port&&(t.port=this.secure?"443":"80"),this.hostname=t.hostname||(typeof location<"u"?location.hostname:"localhost"),this.port=t.port||(typeof location<"u"&&location.port?location.port:this.secure?"443":"80"),this.transports=[],this._transportsByName={},t.transports.forEach(i=>{const n=i.prototype.name;this.transports.push(n),this._transportsByName[n]=i}),this.opts=Object.assign({path:"/engine.io",agent:!1,withCredentials:!1,upgrade:!0,timestampParam:"t",rememberUpgrade:!1,addTrailingSlash:!0,rejectUnauthorized:!0,perMessageDeflate:{threshold:1024},transportOptions:{},closeOnBeforeunload:!1},t),this.opts.path=this.opts.path.replace(/\/$/,"")+(this.opts.addTrailingSlash?"/":""),typeof this.opts.query=="string"&&(this.opts.query=ht(this.opts.query)),pe&&(this.opts.closeOnBeforeunload&&(this._beforeunloadEventListener=()=>{this.transport&&(this.transport.removeAllListeners(),this.transport.close())},addEventListener("beforeunload",this._beforeunloadEventListener,!1)),this.hostname!=="localhost"&&(this._offlineEventListener=()=>{this._onClose("transport close",{description:"network connection lost"})},Q.push(this._offlineEventListener))),this.opts.withCredentials&&(this._cookieJar=void 0),this._open()}createTransport(e){const t=Object.assign({},this.opts.query);t.EIO=Be,t.transport=e,this.id&&(t.sid=this.id);const i=Object.assign({},this.opts,{query:t,socket:this,hostname:this.hostname,secure:this.secure,port:this.port},this.opts.transportOptions[e]);return new this._transportsByName[e](i)}_open(){if(this.transports.length===0){this.setTimeoutFn(()=>{this.emitReserved("error","No transports available")},0);return}const e=this.opts.rememberUpgrade&&L.priorWebsocketSuccess&&this.transports.indexOf("websocket")!==-1?"websocket":this.transports[0];this.readyState="opening";const t=this.createTransport(e);t.open(),this.setTransport(t)}setTransport(e){this.transport&&this.transport.removeAllListeners(),this.transport=e,e.on("drain",this._onDrain.bind(this)).on("packet",this._onPacket.bind(this)).on("error",this._onError.bind(this)).on("close",t=>this._onClose("transport close",t))}onOpen(){this.readyState="open",L.priorWebsocketSuccess=this.transport.name==="websocket",this.emitReserved("open"),this.flush()}_onPacket(e){if(this.readyState==="opening"||this.readyState==="open"||this.readyState==="closing")switch(this.emitReserved("packet",e),this.emitReserved("heartbeat"),e.type){case"open":this.onHandshake(JSON.parse(e.data));break;case"ping":this._sendPacket("pong"),this.emitReserved("ping"),this.emitReserved("pong"),this._resetPingTimeout();break;case"error":const t=new Error("server error");t.code=e.data,this._onError(t);break;case"message":this.emitReserved("data",e.data),this.emitReserved("message",e.data);break}}onHandshake(e){this.emitReserved("handshake",e),this.id=e.sid,this.transport.query.sid=e.sid,this._pingInterval=e.pingInterval,this._pingTimeout=e.pingTimeout,this._maxPayload=e.maxPayload,this.onOpen(),this.readyState!=="closed"&&this._resetPingTimeout()}_resetPingTimeout(){this.clearTimeoutFn(this._pingTimeoutTimer);const e=this._pingInterval+this._pingTimeout;this._pingTimeoutTime=Date.now()+e,this._pingTimeoutTimer=this.setTimeoutFn(()=>{this._onClose("ping timeout")},e),this.opts.autoUnref&&this._pingTimeoutTimer.unref()}_onDrain(){this.writeBuffer.splice(0,this._prevBufferLen),this._prevBufferLen=0,this.writeBuffer.length===0?this.emitReserved("drain"):this.flush()}flush(){if(this.readyState!=="closed"&&this.transport.writable&&!this.upgrading&&this.writeBuffer.length){const e=this._getWritablePackets();this.transport.send(e),this._prevBufferLen=e.length,this.emitReserved("flush")}}_getWritablePackets(){if(!(this._maxPayload&&this.transport.name==="polling"&&this.writeBuffer.length>1))return this.writeBuffer;let t=1;for(let i=0;i<this.writeBuffer.length;i++){const n=this.writeBuffer[i].data;if(n&&(t+=dt(n)),i>0&&t>this._maxPayload)return this.writeBuffer.slice(0,i);t+=2}return this.writeBuffer}_hasPingExpired(){if(!this._pingTimeoutTime)return!0;const e=Date.now()>this._pingTimeoutTime;return e&&(this._pingTimeoutTime=0,ie(()=>{this._onClose("ping timeout")},this.setTimeoutFn)),e}write(e,t,i){return this._sendPacket("message",e,t,i),this}send(e,t,i){return this._sendPacket("message",e,t,i),this}_sendPacket(e,t,i,n){if(typeof t=="function"&&(n=t,t=void 0),typeof i=="function"&&(n=i,i=null),this.readyState==="closing"||this.readyState==="closed")return;i=i||{},i.compress=i.compress!==!1;const r={type:e,data:t,options:i};this.emitReserved("packetCreate",r),this.writeBuffer.push(r),n&&this.once("flush",n),this.flush()}close(){const e=()=>{this._onClose("forced close"),this.transport.close()},t=()=>{this.off("upgrade",t),this.off("upgradeError",t),e()},i=()=>{this.once("upgrade",t),this.once("upgradeError",t)};return(this.readyState==="opening"||this.readyState==="open")&&(this.readyState="closing",this.writeBuffer.length?this.once("drain",()=>{this.upgrading?i():e()}):this.upgrading?i():e()),this}_onError(e){if(L.priorWebsocketSuccess=!1,this.opts.tryAllTransports&&this.transports.length>1&&this.readyState==="opening")return this.transports.shift(),this._open();this.emitReserved("error",e),this._onClose("transport error",e)}_onClose(e,t){if(this.readyState==="opening"||this.readyState==="open"||this.readyState==="closing"){if(this.clearTimeoutFn(this._pingTimeoutTimer),this.transport.removeAllListeners("close"),this.transport.close(),this.transport.removeAllListeners(),pe&&(this._beforeunloadEventListener&&removeEventListener("beforeunload",this._beforeunloadEventListener,!1),this._offlineEventListener)){const i=Q.indexOf(this._offlineEventListener);i!==-1&&Q.splice(i,1)}this.readyState="closed",this.id=null,this.emitReserved("close",e,t),this.writeBuffer=[],this._prevBufferLen=0}}}L.protocol=Be;class It extends L{constructor(){super(...arguments),this._upgrades=[]}onOpen(){if(super.onOpen(),this.readyState==="open"&&this.opts.upgrade)for(let e=0;e<this._upgrades.length;e++)this._probe(this._upgrades[e])}_probe(e){let t=this.createTransport(e),i=!1;L.priorWebsocketSuccess=!1;const n=()=>{i||(t.send([{type:"ping",data:"probe"}]),t.once("packet",p=>{if(!i)if(p.type==="pong"&&p.data==="probe"){if(this.upgrading=!0,this.emitReserved("upgrading",t),!t)return;L.priorWebsocketSuccess=t.name==="websocket",this.transport.pause(()=>{i||this.readyState!=="closed"&&(v(),this.setTransport(t),t.send([{type:"upgrade"}]),this.emitReserved("upgrade",t),t=null,this.upgrading=!1,this.flush())})}else{const o=new Error("probe error");o.transport=t.name,this.emitReserved("upgradeError",o)}}))};function r(){i||(i=!0,v(),t.close(),t=null)}const a=p=>{const o=new Error("probe error: "+p);o.transport=t.name,r(),this.emitReserved("upgradeError",o)};function l(){a("transport closed")}function d(){a("socket closed")}function b(p){t&&p.name!==t.name&&r()}const v=()=>{t.removeListener("open",n),t.removeListener("error",a),t.removeListener("close",l),this.off("close",d),this.off("upgrading",b)};t.once("open",n),t.once("error",a),t.once("close",l),this.once("close",d),this.once("upgrading",b),this._upgrades.indexOf("webtransport")!==-1&&e!=="webtransport"?this.setTimeoutFn(()=>{i||t.open()},200):t.open()}onHandshake(e){this._upgrades=this._filterUpgrades(e.upgrades),super.onHandshake(e)}_filterUpgrades(e){const t=[];for(let i=0;i<e.length;i++)~this.transports.indexOf(e[i])&&t.push(e[i]);return t}}let Dt=class extends It{constructor(e,t={}){const i=typeof e=="object",n=i?{...e}:{...t};(!n.transports||n.transports&&typeof n.transports[0]=="string")&&(n.transports=(n.transports||["polling","websocket","webtransport"]).map(r=>St[r]).filter(r=>!!r)),super(i?n:e,n)}};function Ot(s,e="",t){let i=s;t=t||typeof location<"u"&&location,s==null&&(s=t.protocol+"//"+t.host),typeof s=="string"&&(s.charAt(0)==="/"&&(s.charAt(1)==="/"?s=t.protocol+s:s=t.host+s),/^(https?|wss?):\/\//.test(s)||(typeof t<"u"?s=t.protocol+"//"+s:s="https://"+s),i=ue(s)),i.port||(/^(http|ws)$/.test(i.protocol)?i.port="80":/^(http|ws)s$/.test(i.protocol)&&(i.port="443")),i.path=i.path||"/";const r=i.host.indexOf(":")!==-1?"["+i.host+"]":i.host;return i.id=i.protocol+"://"+r+":"+i.port+e,i.href=i.protocol+"://"+r+(t&&t.port===i.port?"":":"+i.port),i}const Nt=typeof ArrayBuffer=="function",Lt=s=>typeof ArrayBuffer.isView=="function"?ArrayBuffer.isView(s):s.buffer instanceof ArrayBuffer,Ve=Object.prototype.toString,Bt=typeof Blob=="function"||typeof Blob<"u"&&Ve.call(Blob)==="[object BlobConstructor]",xt=typeof File=="function"||typeof File<"u"&&Ve.call(File)==="[object FileConstructor]";function Ee(s){return Nt&&(s instanceof ArrayBuffer||Lt(s))||Bt&&s instanceof Blob||xt&&s instanceof File}function ee(s,e){if(!s||typeof s!="object")return!1;if(Array.isArray(s)){for(let t=0,i=s.length;t<i;t++)if(ee(s[t]))return!0;return!1}if(Ee(s))return!0;if(s.toJSON&&typeof s.toJSON=="function"&&arguments.length===1)return ee(s.toJSON(),!0);for(const t in s)if(Object.prototype.hasOwnProperty.call(s,t)&&ee(s[t]))return!0;return!1}function Pt(s){const e=[],t=s.data,i=s;return i.data=he(t,e),i.attachments=e.length,{packet:i,buffers:e}}function he(s,e){if(!s)return s;if(Ee(s)){const t={_placeholder:!0,num:e.length};return e.push(s),t}else if(Array.isArray(s)){const t=new Array(s.length);for(let i=0;i<s.length;i++)t[i]=he(s[i],e);return t}else if(typeof s=="object"&&!(s instanceof Date)){const t={};for(const i in s)Object.prototype.hasOwnProperty.call(s,i)&&(t[i]=he(s[i],e));return t}return s}function $t(s,e){return s.data=ve(s.data,e),delete s.attachments,s}function ve(s,e){if(!s)return s;if(s&&s._placeholder===!0){if(typeof s.num=="number"&&s.num>=0&&s.num<e.length)return e[s.num];throw new Error("illegal attachments")}else if(Array.isArray(s))for(let t=0;t<s.length;t++)s[t]=ve(s[t],e);else if(typeof s=="object")for(const t in s)Object.prototype.hasOwnProperty.call(s,t)&&(s[t]=ve(s[t],e));return s}const Mt=["connect","connect_error","disconnect","disconnecting","newListener","removeListener"];var h;(function(s){s[s.CONNECT=0]="CONNECT",s[s.DISCONNECT=1]="DISCONNECT",s[s.EVENT=2]="EVENT",s[s.ACK=3]="ACK",s[s.CONNECT_ERROR=4]="CONNECT_ERROR",s[s.BINARY_EVENT=5]="BINARY_EVENT",s[s.BINARY_ACK=6]="BINARY_ACK"})(h||(h={}));class qt{constructor(e){this.replacer=e}encode(e){return(e.type===h.EVENT||e.type===h.ACK)&&ee(e)?this.encodeAsBinary({type:e.type===h.EVENT?h.BINARY_EVENT:h.BINARY_ACK,nsp:e.nsp,data:e.data,id:e.id}):[this.encodeAsString(e)]}encodeAsString(e){let t=""+e.type;return(e.type===h.BINARY_EVENT||e.type===h.BINARY_ACK)&&(t+=e.attachments+"-"),e.nsp&&e.nsp!=="/"&&(t+=e.nsp+","),e.id!=null&&(t+=e.id),e.data!=null&&(t+=JSON.stringify(e.data,this.replacer)),t}encodeAsBinary(e){const t=Pt(e),i=this.encodeAsString(t.packet),n=t.buffers;return n.unshift(i),n}}class we extends g{constructor(e){super(),this.opts=Object.assign({reviver:void 0,maxAttachments:10},typeof e=="function"?{reviver:e}:e)}add(e){let t;if(typeof e=="string"){if(this.reconstructor)throw new Error("got plaintext data when reconstructing a packet");t=this.decodeString(e);const i=t.type===h.BINARY_EVENT;i||t.type===h.BINARY_ACK?(t.type=i?h.EVENT:h.ACK,this.reconstructor=new Vt(t),t.attachments===0&&super.emitReserved("decoded",t)):super.emitReserved("decoded",t)}else if(Ee(e)||e.base64)if(this.reconstructor)t=this.reconstructor.takeBinaryData(e),t&&(this.reconstructor=null,super.emitReserved("decoded",t));else throw new Error("got binary data when not reconstructing a packet");else throw new Error("Unknown type: "+e)}decodeString(e){let t=0;const i={type:Number(e.charAt(0))};if(h[i.type]===void 0)throw new Error("unknown packet type "+i.type);if(i.type===h.BINARY_EVENT||i.type===h.BINARY_ACK){const r=t+1;for(;e.charAt(++t)!=="-"&&t!=e.length;);const a=e.substring(r,t);if(a!=Number(a)||e.charAt(t)!=="-")throw new Error("Illegal attachments");const l=Number(a);if(!Ut(l)||l<0)throw new Error("Illegal attachments");if(l>this.opts.maxAttachments)throw new Error("too many attachments");i.attachments=l}if(e.charAt(t+1)==="/"){const r=t+1;for(;++t&&!(e.charAt(t)===","||t===e.length););i.nsp=e.substring(r,t)}else i.nsp="/";const n=e.charAt(t+1);if(n!==""&&Number(n)==n){const r=t+1;for(;++t;){const a=e.charAt(t);if(a==null||Number(a)!=a){--t;break}if(t===e.length)break}i.id=Number(e.substring(r,t+1))}if(e.charAt(++t)){const r=this.tryParse(e.substr(t));if(we.isPayloadValid(i.type,r))i.data=r;else throw new Error("invalid payload")}return i}tryParse(e){try{return JSON.parse(e,this.opts.reviver)}catch{return!1}}static isPayloadValid(e,t){switch(e){case h.CONNECT:return Re(t);case h.DISCONNECT:return t===void 0;case h.CONNECT_ERROR:return typeof t=="string"||Re(t);case h.EVENT:case h.BINARY_EVENT:return Array.isArray(t)&&(typeof t[0]=="number"||typeof t[0]=="string"&&Mt.indexOf(t[0])===-1);case h.ACK:case h.BINARY_ACK:return Array.isArray(t)}}destroy(){this.reconstructor&&(this.reconstructor.finishedReconstruction(),this.reconstructor=null)}}class Vt{constructor(e){this.packet=e,this.buffers=[],this.reconPack=e}takeBinaryData(e){if(this.buffers.push(e),this.buffers.length===this.reconPack.attachments){const t=$t(this.reconPack,this.buffers);return this.finishedReconstruction(),t}return null}finishedReconstruction(){this.reconPack=null,this.buffers=[]}}const Ut=Number.isInteger||function(s){return typeof s=="number"&&isFinite(s)&&Math.floor(s)===s};function Re(s){return Object.prototype.toString.call(s)==="[object Object]"}const jt=Object.freeze(Object.defineProperty({__proto__:null,Decoder:we,Encoder:qt,get PacketType(){return h}},Symbol.toStringTag,{value:"Module"}));function T(s,e,t){return s.on(e,t),function(){s.off(e,t)}}const Ft=Object.freeze({connect:1,connect_error:1,disconnect:1,disconnecting:1,newListener:1,removeListener:1});class Ue extends g{constructor(e,t,i){super(),this.connected=!1,this.recovered=!1,this.receiveBuffer=[],this.sendBuffer=[],this._queue=[],this._queueSeq=0,this.ids=0,this.acks={},this.flags={},this.io=e,this.nsp=t,i&&i.auth&&(this.auth=i.auth),this._opts=Object.assign({},i),this.io._autoConnect&&this.open()}get disconnected(){return!this.connected}subEvents(){if(this.subs)return;const e=this.io;this.subs=[T(e,"open",this.onopen.bind(this)),T(e,"packet",this.onpacket.bind(this)),T(e,"error",this.onerror.bind(this)),T(e,"close",this.onclose.bind(this))]}get active(){return!!this.subs}connect(){return this.connected?this:(this.subEvents(),this.io._reconnecting||this.io.open(),this.io._readyState==="open"&&this.onopen(),this)}open(){return this.connect()}send(...e){return e.unshift("message"),this.emit.apply(this,e),this}emit(e,...t){var i,n,r;if(Ft.hasOwnProperty(e))throw new Error('"'+e.toString()+'" is a reserved event name');if(t.unshift(e),this._opts.retries&&!this.flags.fromQueue&&!this.flags.volatile)return this._addToQueue(t),this;const a={type:h.EVENT,data:t};if(a.options={},a.options.compress=this.flags.compress!==!1,typeof t[t.length-1]=="function"){const v=this.ids++,p=t.pop();this._registerAckCallback(v,p),a.id=v}const l=(n=(i=this.io.engine)===null||i===void 0?void 0:i.transport)===null||n===void 0?void 0:n.writable,d=this.connected&&!(!((r=this.io.engine)===null||r===void 0)&&r._hasPingExpired());return this.flags.volatile&&!l||(d?(this.notifyOutgoingListeners(a),this.packet(a)):this.sendBuffer.push(a)),this.flags={},this}_registerAckCallback(e,t){var i;const n=(i=this.flags.timeout)!==null&&i!==void 0?i:this._opts.ackTimeout;if(n===void 0){this.acks[e]=t;return}const r=this.io.setTimeoutFn(()=>{delete this.acks[e];for(let l=0;l<this.sendBuffer.length;l++)this.sendBuffer[l].id===e&&this.sendBuffer.splice(l,1);t.call(this,new Error("operation has timed out"))},n),a=(...l)=>{this.io.clearTimeoutFn(r),t.apply(this,l)};a.withError=!0,this.acks[e]=a}emitWithAck(e,...t){return new Promise((i,n)=>{const r=(a,l)=>a?n(a):i(l);r.withError=!0,t.push(r),this.emit(e,...t)})}_addToQueue(e){let t;typeof e[e.length-1]=="function"&&(t=e.pop());const i={id:this._queueSeq++,tryCount:0,pending:!1,args:e,flags:Object.assign({fromQueue:!0},this.flags)};e.push((n,...r)=>(this._queue[0],n!==null?i.tryCount>this._opts.retries&&(this._queue.shift(),t&&t(n)):(this._queue.shift(),t&&t(null,...r)),i.pending=!1,this._drainQueue())),this._queue.push(i),this._drainQueue()}_drainQueue(e=!1){if(!this.connected||this._queue.length===0)return;const t=this._queue[0];t.pending&&!e||(t.pending=!0,t.tryCount++,this.flags=t.flags,this.emit.apply(this,t.args))}packet(e){e.nsp=this.nsp,this.io._packet(e)}onopen(){typeof this.auth=="function"?this.auth(e=>{this._sendConnectPacket(e)}):this._sendConnectPacket(this.auth)}_sendConnectPacket(e){this.packet({type:h.CONNECT,data:this._pid?Object.assign({pid:this._pid,offset:this._lastOffset},e):e})}onerror(e){this.connected||this.emitReserved("connect_error",e)}onclose(e,t){this.connected=!1,delete this.id,this.emitReserved("disconnect",e,t),this._clearAcks()}_clearAcks(){Object.keys(this.acks).forEach(e=>{if(!this.sendBuffer.some(i=>String(i.id)===e)){const i=this.acks[e];delete this.acks[e],i.withError&&i.call(this,new Error("socket has been disconnected"))}})}onpacket(e){if(e.nsp===this.nsp)switch(e.type){case h.CONNECT:e.data&&e.data.sid?this.onconnect(e.data.sid,e.data.pid):this.emitReserved("connect_error",new Error("It seems you are trying to reach a Socket.IO server in v2.x with a v3.x client, but they are not compatible (more information here: https://socket.io/docs/v3/migrating-from-2-x-to-3-0/)"));break;case h.EVENT:case h.BINARY_EVENT:this.onevent(e);break;case h.ACK:case h.BINARY_ACK:this.onack(e);break;case h.DISCONNECT:this.ondisconnect();break;case h.CONNECT_ERROR:this.destroy();const i=new Error(e.data.message);i.data=e.data.data,this.emitReserved("connect_error",i);break}}onevent(e){const t=e.data||[];e.id!=null&&t.push(this.ack(e.id)),this.connected?this.emitEvent(t):this.receiveBuffer.push(Object.freeze(t))}emitEvent(e){if(this._anyListeners&&this._anyListeners.length){const t=this._anyListeners.slice();for(const i of t)i.apply(this,e)}super.emit.apply(this,e),this._pid&&e.length&&typeof e[e.length-1]=="string"&&(this._lastOffset=e[e.length-1])}ack(e){const t=this;let i=!1;return function(...n){i||(i=!0,t.packet({type:h.ACK,id:e,data:n}))}}onack(e){const t=this.acks[e.id];typeof t=="function"&&(delete this.acks[e.id],t.withError&&e.data.unshift(null),t.apply(this,e.data))}onconnect(e,t){this.id=e,this.recovered=t&&this._pid===t,this._pid=t,this.connected=!0,this.emitBuffered(),this._drainQueue(!0),this.emitReserved("connect")}emitBuffered(){this.receiveBuffer.forEach(e=>this.emitEvent(e)),this.receiveBuffer=[],this.sendBuffer.forEach(e=>{this.notifyOutgoingListeners(e),this.packet(e)}),this.sendBuffer=[]}ondisconnect(){this.destroy(),this.onclose("io server disconnect")}destroy(){this.subs&&(this.subs.forEach(e=>e()),this.subs=void 0),this.io._destroy(this)}disconnect(){return this.connected&&this.packet({type:h.DISCONNECT}),this.destroy(),this.connected&&this.onclose("io client disconnect"),this}close(){return this.disconnect()}compress(e){return this.flags.compress=e,this}get volatile(){return this.flags.volatile=!0,this}timeout(e){return this.flags.timeout=e,this}onAny(e){return this._anyListeners=this._anyListeners||[],this._anyListeners.push(e),this}prependAny(e){return this._anyListeners=this._anyListeners||[],this._anyListeners.unshift(e),this}offAny(e){if(!this._anyListeners)return this;if(e){const t=this._anyListeners;for(let i=0;i<t.length;i++)if(e===t[i])return t.splice(i,1),this}else this._anyListeners=[];return this}listenersAny(){return this._anyListeners||[]}onAnyOutgoing(e){return this._anyOutgoingListeners=this._anyOutgoingListeners||[],this._anyOutgoingListeners.push(e),this}prependAnyOutgoing(e){return this._anyOutgoingListeners=this._anyOutgoingListeners||[],this._anyOutgoingListeners.unshift(e),this}offAnyOutgoing(e){if(!this._anyOutgoingListeners)return this;if(e){const t=this._anyOutgoingListeners;for(let i=0;i<t.length;i++)if(e===t[i])return t.splice(i,1),this}else this._anyOutgoingListeners=[];return this}listenersAnyOutgoing(){return this._anyOutgoingListeners||[]}notifyOutgoingListeners(e){if(this._anyOutgoingListeners&&this._anyOutgoingListeners.length){const t=this._anyOutgoingListeners.slice();for(const i of t)i.apply(this,e.data)}}}function V(s){s=s||{},this.ms=s.min||100,this.max=s.max||1e4,this.factor=s.factor||2,this.jitter=s.jitter>0&&s.jitter<=1?s.jitter:0,this.attempts=0}V.prototype.duration=function(){var s=this.ms*Math.pow(this.factor,this.attempts++);if(this.jitter){var e=Math.random(),t=Math.floor(e*this.jitter*s);s=(Math.floor(e*10)&1)==0?s-t:s+t}return Math.min(s,this.max)|0};V.prototype.reset=function(){this.attempts=0};V.prototype.setMin=function(s){this.ms=s};V.prototype.setMax=function(s){this.max=s};V.prototype.setJitter=function(s){this.jitter=s};class me extends g{constructor(e,t){var i;super(),this.nsps={},this.subs=[],e&&typeof e=="object"&&(t=e,e=void 0),t=t||{},t.path=t.path||"/socket.io",this.opts=t,ne(this,t),this.reconnection(t.reconnection!==!1),this.reconnectionAttempts(t.reconnectionAttempts||1/0),this.reconnectionDelay(t.reconnectionDelay||1e3),this.reconnectionDelayMax(t.reconnectionDelayMax||5e3),this.randomizationFactor((i=t.randomizationFactor)!==null&&i!==void 0?i:.5),this.backoff=new V({min:this.reconnectionDelay(),max:this.reconnectionDelayMax(),jitter:this.randomizationFactor()}),this.timeout(t.timeout==null?2e4:t.timeout),this._readyState="closed",this.uri=e;const n=t.parser||jt;this.encoder=new n.Encoder,this.decoder=new n.Decoder,this._autoConnect=t.autoConnect!==!1,this._autoConnect&&this.open()}reconnection(e){return arguments.length?(this._reconnection=!!e,e||(this.skipReconnect=!0),this):this._reconnection}reconnectionAttempts(e){return e===void 0?this._reconnectionAttempts:(this._reconnectionAttempts=e,this)}reconnectionDelay(e){var t;return e===void 0?this._reconnectionDelay:(this._reconnectionDelay=e,(t=this.backoff)===null||t===void 0||t.setMin(e),this)}randomizationFactor(e){var t;return e===void 0?this._randomizationFactor:(this._randomizationFactor=e,(t=this.backoff)===null||t===void 0||t.setJitter(e),this)}reconnectionDelayMax(e){var t;return e===void 0?this._reconnectionDelayMax:(this._reconnectionDelayMax=e,(t=this.backoff)===null||t===void 0||t.setMax(e),this)}timeout(e){return arguments.length?(this._timeout=e,this):this._timeout}maybeReconnectOnOpen(){!this._reconnecting&&this._reconnection&&this.backoff.attempts===0&&this.reconnect()}open(e){if(~this._readyState.indexOf("open"))return this;this.engine=new Dt(this.uri,this.opts);const t=this.engine,i=this;this._readyState="opening",this.skipReconnect=!1;const n=T(t,"open",function(){i.onopen(),e&&e()}),r=l=>{this.cleanup(),this._readyState="closed",this.emitReserved("error",l),e?e(l):this.maybeReconnectOnOpen()},a=T(t,"error",r);if(this._timeout!==!1){const l=this._timeout,d=this.setTimeoutFn(()=>{n(),r(new Error("timeout")),t.close()},l);this.opts.autoUnref&&d.unref(),this.subs.push(()=>{this.clearTimeoutFn(d)})}return this.subs.push(n),this.subs.push(a),this}connect(e){return this.open(e)}onopen(){this.cleanup(),this._readyState="open",this.emitReserved("open");const e=this.engine;this.subs.push(T(e,"ping",this.onping.bind(this)),T(e,"data",this.ondata.bind(this)),T(e,"error",this.onerror.bind(this)),T(e,"close",this.onclose.bind(this)),T(this.decoder,"decoded",this.ondecoded.bind(this)))}onping(){this.emitReserved("ping")}ondata(e){try{this.decoder.add(e)}catch(t){this.onclose("parse error",t)}}ondecoded(e){ie(()=>{this.emitReserved("packet",e)},this.setTimeoutFn)}onerror(e){this.emitReserved("error",e)}socket(e,t){let i=this.nsps[e];return i?this._autoConnect&&!i.active&&i.connect():(i=new Ue(this,e,t),this.nsps[e]=i),i}_destroy(e){const t=Object.keys(this.nsps);for(const i of t)if(this.nsps[i].active)return;this._close()}_packet(e){const t=this.encoder.encode(e);for(let i=0;i<t.length;i++)this.engine.write(t[i],e.options)}cleanup(){this.subs.forEach(e=>e()),this.subs.length=0,this.decoder.destroy()}_close(){this.skipReconnect=!0,this._reconnecting=!1,this.onclose("forced close")}disconnect(){return this._close()}onclose(e,t){var i;this.cleanup(),(i=this.engine)===null||i===void 0||i.close(),this.backoff.reset(),this._readyState="closed",this.emitReserved("close",e,t),this._reconnection&&!this.skipReconnect&&this.reconnect()}reconnect(){if(this._reconnecting||this.skipReconnect)return this;const e=this;if(this.backoff.attempts>=this._reconnectionAttempts)this.backoff.reset(),this.emitReserved("reconnect_failed"),this._reconnecting=!1;else{const t=this.backoff.duration();this._reconnecting=!0;const i=this.setTimeoutFn(()=>{e.skipReconnect||(this.emitReserved("reconnect_attempt",e.backoff.attempts),!e.skipReconnect&&e.open(n=>{n?(e._reconnecting=!1,e.reconnect(),this.emitReserved("reconnect_error",n)):e.onreconnect()}))},t);this.opts.autoUnref&&i.unref(),this.subs.push(()=>{this.clearTimeoutFn(i)})}}onreconnect(){const e=this.backoff.attempts;this._reconnecting=!1,this.backoff.reset(),this.emitReserved("reconnect",e)}}const j={};function te(s,e){typeof s=="object"&&(e=s,s=void 0),e=e||{};const t=Ot(s,e.path||"/socket.io"),i=t.source,n=t.id,r=t.path,a=j[n]&&r in j[n].nsps,l=e.forceNew||e["force new connection"]||e.multiplex===!1||a;let d;return l?d=new me(i,e):(j[n]||(j[n]=new me(i,e)),d=j[n]),t.query&&!e.query&&(e.query=t.queryKey),d.socket(t.path,e)}Object.assign(te,{Manager:me,Socket:Ue,io:te,connect:te});const zt=[{title:"SERVIDORES",items:[["◈","Servidores","12"],["⌁","Invitaciones",""],["♧","Miembros",""],["♙","Roles",""],["▣","Canales",""],["▤","Logs del servidor",""]]},{title:"COMANDOS",items:[["⚙","Comandos","»"],["✣","Slash Commands",""],["▢","Mensajes",""],["◫","Auto Respuestas",""]]},{title:"MODERACIÓN",items:[["◆","Moderación","»"],["◉","Advertencias",""],["⊗","Baneos",""],["◔","Muteos",""],["⌁","Anti Raid",""],["✦","Auto Mod",""]]},{title:"SISTEMA",items:[["▤","Logs","»"],["◷","Auditoría",""],["□","Tareas programadas",""],["▣","Backups",""],["⌘","Webhooks",""]]},{title:"CONFIGURACIÓN",items:[["⚙","Configuración","»"],["✎","Personalización",""],["⌁","Variables de entorno",""],["◇","Tokens",""],["⊙","Permisos",""],["⌘","Integraciones",""]]}],Ht=zt.map(s=>`
  <div class="side-group">
    <div class="side-title">${s.title}</div>
    ${s.items.map(([e,t,i])=>`
      <button class="side-item">
        <span class="side-icon">${e}</span>
        <span>${t}</span>
        ${i?`<b>${i}</b>`:""}
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
        ${Ht}
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
            ${["API Discord","Base de Datos","Servidores","Web Dashboard","Sistema de Logs"].map(s=>`<div><span><i></i>${s}</span><strong>Operativo</strong></div>`).join("")}
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
            ${[["NC","Nebula Community","1.245 usuarios","89%"],["GZ","Gaming Zone","987 usuarios","75%"],["TD","Team Developers","756 usuarios","62%"],["AW","Anime World","654 usuarios","48%"],["CL","Chill Lounge","432 usuarios","35%"]].map(([s,e,t,i])=>`
              <div class="server-item">
                <div class="server-logo">${s}</div>
                <div class="server-copy"><strong>${e}</strong><span>${t}</span></div>
                <div class="server-progress"><span style="width:${i}"></span></div>
                <b>${i}</b>
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
`;const w=document.getElementById("toast"),R=()=>{w.classList.add("show"),clearTimeout(window.toastTimer),window.toastTimer=setTimeout(()=>w.classList.remove("show"),2300)};document.querySelectorAll("button").forEach(s=>{s.addEventListener("click",()=>{s.id!=="hamburger"&&R()})});document.querySelectorAll(".side-item").forEach(s=>{s.addEventListener("click",()=>{document.querySelectorAll(".side-item").forEach(e=>e.classList.remove("active")),s.classList.add("active")})});const Gt=document.getElementById("sidebar");document.getElementById("hamburger").addEventListener("click",()=>Gt.classList.toggle("open"));document.addEventListener("keydown",s=>{s.ctrlKey&&s.key.toLowerCase()==="k"&&(s.preventDefault(),document.querySelector(".search input").focus())});const z=document.getElementById("space"),q=z.getContext("2d");let je=[];function Fe(){z.width=innerWidth*devicePixelRatio,z.height=innerHeight*devicePixelRatio,z.style.width=innerWidth+"px",z.style.height=innerHeight+"px",q.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0),je=Array.from({length:90},()=>({x:Math.random()*innerWidth,y:Math.random()*innerHeight,r:Math.random()*1.3+.2,a:Math.random()*.45+.05,s:Math.random()*.12+.02}))}function ze(){q.clearRect(0,0,innerWidth,innerHeight),je.forEach(s=>{s.y-=s.s,s.y<0&&(s.y=innerHeight),q.beginPath(),q.arc(s.x,s.y,s.r,0,Math.PI*2),q.fillStyle=`rgba(167,139,250,${s.a})`,q.fill()}),requestAnimationFrame(ze)}Fe();ze();addEventListener("resize",Fe);const Wt=document.querySelector(".main"),Kt=document.querySelector(".topbar"),y=document.createElement("div");y.id="pageContent";let Y=Kt.nextElementSibling;for(;Y;){const s=Y.nextElementSibling;y.appendChild(Y),Y=s}Wt.appendChild(y);const Jt=y.innerHTML,Ae={Servidores:{eyebrow:"SERVIDORES",title:"Tus servidores",description:"Seleccioná un servidor para administrar sus funciones, permisos y configuración.",action:"＋ Agregar servidor",type:"servers"},Invitaciones:{eyebrow:"SERVIDORES",title:"Invitaciones",description:"Creá, controlá y eliminá enlaces de invitación para tus comunidades.",action:"＋ Nueva invitación",type:"invitations"},Miembros:{eyebrow:"COMUNIDAD",title:"Miembros",description:"Buscá usuarios, revisá sus roles y consultá su actividad reciente.",action:"Exportar lista",type:"members"},Roles:{eyebrow:"COMUNIDAD",title:"Roles",description:"Organizá la jerarquía y los permisos de cada rol del servidor.",action:"＋ Crear rol",type:"roles"},Canales:{eyebrow:"ESTRUCTURA",title:"Canales",description:"Administrá canales de texto, voz, categorías y permisos.",action:"＋ Crear canal",type:"channels"},"Logs del servidor":{eyebrow:"REGISTROS",title:"Logs del servidor",description:"Consultá eventos, mensajes eliminados y movimientos administrativos.",action:"Exportar logs",type:"logs"},Comandos:{eyebrow:"COMANDOS",title:"Comandos",description:"Activá, desactivá y personalizá las funciones principales del bot.",action:"＋ Crear comando",type:"commands"},"Slash Commands":{eyebrow:"COMANDOS",title:"Slash Commands",description:"Gestioná los comandos que aparecen al escribir / dentro de Discord.",action:"Sincronizar",type:"slash"},Mensajes:{eyebrow:"MENSAJES",title:"Mensajes automáticos",description:"Diseñá mensajes de bienvenida, despedida, anuncios y verificaciones.",action:"＋ Nuevo mensaje",type:"messages"},"Auto Respuestas":{eyebrow:"AUTOMATIZACIÓN",title:"Auto Respuestas",description:"Configurá respuestas automáticas mediante palabras o frases clave.",action:"＋ Nueva respuesta",type:"responses"},Moderación:{eyebrow:"SEGURIDAD",title:"Centro de moderación",description:"Accedé rápidamente a todas las herramientas de control del servidor.",action:"Abrir historial",type:"moderation"},Advertencias:{eyebrow:"MODERACIÓN",title:"Advertencias",description:"Registrá faltas, motivos, responsables y vencimientos.",action:"＋ Advertir usuario",type:"warnings"},Baneos:{eyebrow:"MODERACIÓN",title:"Baneos",description:"Administrá usuarios bloqueados y revisá los motivos de cada sanción.",action:"＋ Banear usuario",type:"bans"},Muteos:{eyebrow:"MODERACIÓN",title:"Muteos",description:"Aplicá silenciamientos temporales y revisá los que siguen activos.",action:"＋ Mutear usuario",type:"mutes"},"Anti Raid":{eyebrow:"PROTECCIÓN",title:"Anti Raid",description:"Protegé el servidor contra ingresos masivos y comportamientos sospechosos.",action:"Activar protección",type:"antiraid"},"Auto Mod":{eyebrow:"PROTECCIÓN",title:"Auto Mod",description:"Filtrá spam, enlaces, menciones masivas y palabras prohibidas.",action:"Guardar reglas",type:"automod"},Logs:{eyebrow:"SISTEMA",title:"Logs generales",description:"Revisá todas las acciones realizadas por el bot y el dashboard.",action:"Descargar",type:"logs"},Auditoría:{eyebrow:"SISTEMA",title:"Auditoría",description:"Identificá quién realizó cada cambio dentro del panel.",action:"Filtrar actividad",type:"audit"},"Tareas programadas":{eyebrow:"AUTOMATIZACIÓN",title:"Tareas programadas",description:"Programá anuncios, limpiezas, backups y acciones automáticas.",action:"＋ Programar tarea",type:"tasks"},Backups:{eyebrow:"SISTEMA",title:"Backups",description:"Guardá y restaurá configuraciones del servidor de forma segura.",action:"Crear backup",type:"backups"},Webhooks:{eyebrow:"INTEGRACIONES",title:"Webhooks",description:"Conectá servicios externos para recibir y enviar información.",action:"＋ Crear webhook",type:"webhooks"},Configuración:{eyebrow:"AJUSTES",title:"Configuración general",description:"Definí la identidad, el estado y el comportamiento principal del bot.",action:"Guardar cambios",type:"settings"},Personalización:{eyebrow:"APARIENCIA",title:"Personalización",description:"Cambiá colores, textos, imágenes y estilo visual del panel.",action:"Aplicar diseño",type:"customize"},"Variables de entorno":{eyebrow:"DESARROLLO",title:"Variables de entorno",description:"Prepará las variables que usaremos luego en Render sin mostrar secretos reales.",action:"Guardar variables",type:"environment"},Tokens:{eyebrow:"SEGURIDAD",title:"Tokens",description:"Visualizá el estado de las credenciales sin exponer su contenido.",action:"Actualizar token",type:"tokens"},Permisos:{eyebrow:"SEGURIDAD",title:"Permisos del bot",description:"Revisá qué acciones puede realizar el bot dentro de Discord.",action:"Guardar permisos",type:"permissions"},Integraciones:{eyebrow:"CONEXIONES",title:"Integraciones",description:"Prepará conexiones con Discord, Render, GitHub y otros servicios.",action:"＋ Conectar servicio",type:"integrations"}};function se(s){return`
    <section class="section-header">
      <div>
        <span>${s.eyebrow}</span>
        <h1>${s.title}</h1>
        <p>${s.description}</p>
      </div>
      <button class="section-action">${s.action}</button>
    </section>
  `}function O(s){return`
    <section class="section-metrics">
      ${s.map(([e,t,i,n,r="purple"])=>`
        <article class="section-metric">
          <i class="${r}">${e}</i>
          <div><span>${t}</span><strong>${i}</strong><small>${n}</small></div>
        </article>
      `).join("")}
    </section>
  `}function P(s,e){return`
    <article class="section-panel">
      <div class="section-panel-head">
        <div><span>INFORMACIÓN</span><h3>Actividad reciente</h3></div>
        <div class="section-search">⌕ <input placeholder="Buscar..." /></div>
      </div>
      <div class="data-table" style="--columns:${s.length}">
        <div class="data-row data-head">${s.map(t=>`<span>${t}</span>`).join("")}</div>
        ${e.map(t=>`<div class="data-row">${t.map(i=>`<span>${i}</span>`).join("")}</div>`).join("")}
      </div>
    </article>
  `}function le(s){return`
    <div class="settings-layout">
      <article class="section-panel">
        <div class="section-panel-head"><div><span>CONTROLES</span><h3>Funciones disponibles</h3></div></div>
        <div class="toggle-list">
          ${s.map(([e,t,i])=>`
            <div class="toggle-row">
              <div><strong>${e}</strong><p>${t}</p></div>
              <label class="switch-control"><input type="checkbox" ${i?"checked":""}><span></span></label>
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
  `}function D(s){return`<section class="feature-grid">${s.map(([e,t,i,n])=>`
    <article class="feature-card">
      <div class="feature-top"><i>${e}</i><span>${n}</span></div>
      <h3>${t}</h3><p>${i}</p>
      <button>Administrar <b>›</b></button>
    </article>
  `).join("")}</section>`}function ke(s){return`
    <div class="settings-layout">
      <article class="section-panel">
        <div class="section-panel-head"><div><span>CONFIGURACIÓN</span><h3>Datos principales</h3></div></div>
        <div class="form-grid">
          ${s.map(([e,t,i=!1])=>`
            <label class="form-field ${i?"wide":""}">
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
  `}function Yt(s){switch(s){case"servers":return O([["◈","Servidores conectados","12","+2 este mes"],["♣","Miembros totales","8.745","+342 este mes","blue"],["●","Usuarios online","1.286","Ahora","green"],["⌘","Comandos hoy","3.248","+18.7%","yellow"]])+D([["NC","Nebula Community","Servidor principal · 1.245 miembros","89% activo"],["GZ","Gaming Zone","Comunidad gamer · 987 miembros","75% activo"],["TD","Team Developers","Desarrollo y tecnología · 756 miembros","62% activo"],["＋","Agregar servidor","Invitá a Nebula Bot a otra comunidad","NUEVO"]]);case"invitations":return O([["⌁","Invitaciones activas","18","6 temporales"],["♣","Usos totales","2.846","+92 hoy","blue"],["◷","Próximas a vencer","3","En 24 horas","yellow"]])+P(["Código","Canal","Usos","Vencimiento","Estado"],[["nebula-main","#bienvenida","1.284","Nunca","<b class='good'>Activa</b>"],["gaming-zone","#general","642","7 días","<b class='good'>Activa</b>"],["evento-vip","#eventos","128","18 horas","<b class='warn'>Temporal</b>"]]);case"members":return O([["♣","Miembros","8.745","+342 este mes"],["●","En línea","1.286","14.7%","green"],["◇","Con roles","8.102","92.6%","blue"],["◉","Nuevos hoy","76","+12%","yellow"]])+P(["Usuario","Rol principal","Ingreso","Mensajes","Estado"],[["<b>Alvi Moreyra</b>","Propietario","12/05/2024","18.492","<b class='good'>En línea</b>"],["Juan Cruz","Administrador","02/07/2025","7.824","Ausente"],["NovaUser","Miembro","11/07/2026","1.209","<b class='good'>En línea</b>"]]);case"roles":return D([["♛","Propietario","Control total del servidor y del dashboard.","1 miembro"],["◆","Administrador","Moderación, configuración y registros.","6 miembros"],["◇","Moderador","Control de mensajes y usuarios.","14 miembros"],["●","Miembro","Acceso general a la comunidad.","8.102 miembros"],["＋","Crear nuevo rol","Agregá una nueva jerarquía personalizada.","NUEVO"]]);case"channels":return D([["#","bienvenida","Canal de entrada y verificación.","Texto"],["#","general","Conversaciones principales de la comunidad.","Texto"],["◖","Sala General","Canal de voz para todos los miembros.","Voz"],["▣","Administración","Categoría privada del equipo.","Categoría"],["＋","Crear canal","Agregá un canal nuevo al servidor.","NUEVO"]]);case"commands":case"slash":return O([["⌘","Comandos activos","24","Todos sincronizados"],["◉","Ejecuciones","25.683","+18.7%"],["⚡","Tiempo medio","82 ms","Excelente","green"]])+P(["Comando","Descripción","Usos","Permiso","Estado"],[["/verify","Verifica usuarios y asigna roles","8.429","Todos","<b class='good'>Activo</b>"],["/clean","Elimina una cantidad de mensajes","4.326","Moderador","<b class='good'>Activo</b>"],["/data","Muestra datos del usuario verificado","3.782","Administrador","<b class='good'>Activo</b>"],["/invite","Genera el enlace del bot","2.945","Todos","<b class='good'>Activo</b>"]]);case"messages":return D([["👋","Bienvenida","Mensaje enviado cuando ingresa un nuevo miembro.","ACTIVO"],["🚪","Despedida","Aviso cuando un miembro abandona el servidor.","ACTIVO"],["✅","Verificación","Panel para verificar y asignar roles.","ACTIVO"],["📣","Anuncios","Mensajes especiales y programados.","BORRADOR"]]);case"responses":return P(["Palabra clave","Respuesta","Canal","Usos","Estado"],[["hola","¡Hola! Bienvenido a nuestra comunidad.","Todos","846","<b class='good'>Activa</b>"],["reglas","Podés leer las reglas en #reglas.","Todos","514","<b class='good'>Activa</b>"],["soporte","Abrí un ticket desde #soporte.","Ayuda","302","<b class='good'>Activa</b>"]]);case"moderation":return O([["◆","Acciones hoy","148","+22%"],["◉","Advertencias","32","8 activas","yellow"],["⊗","Baneos","12","Este mes","red"],["◔","Muteos activos","7","Ahora","blue"]])+D([["◉","Advertir usuario","Registrá una falta con motivo y evidencia.","ABRIR"],["◔","Mutear usuario","Silenciá temporalmente a un miembro.","ABRIR"],["⊗","Banear usuario","Bloqueá el acceso de forma permanente.","ABRIR"],["▤","Revisar historial","Consultá sanciones y responsables.","ABRIR"]]);case"warnings":case"bans":case"mutes":return P(["Usuario","Motivo","Responsable","Duración","Estado"],[["Usuario#4521","Spam reiterado","Alvi","24 horas","<b class='warn'>Activo</b>"],["PlayerNova","Insultos","Moderador01","7 días","<b class='warn'>Activo</b>"],["TestUser","Enlaces prohibidos","Auto Mod","Finalizado","Completado"]]);case"antiraid":case"automod":return O([["⌁","Amenazas bloqueadas","286","Últimos 30 días"],["●","Nivel de protección","Alto","Recomendado","green"],["⚡","Respuesta media","41 ms","Excelente","blue"]])+le([["Detección de ingresos masivos","Bloquea oleadas de cuentas nuevas.",!0],["Filtro de enlaces","Impide dominios no autorizados.",!0],["Menciones masivas","Controla @everyone y spam de menciones.",!0],["Cuentas nuevas","Aplica restricciones a cuentas recientes.",!1],["Modo emergencia","Bloqueo temporal completo del servidor.",!1]]);case"logs":case"audit":return O([["▤","Eventos hoy","2.648","+14%"],["♣","Administradores","7","Con actividad"],["◷","Último evento","Hace 1 min","Actualizado","green"]])+P(["Evento","Usuario","Servidor","Fecha","Resultado"],[["Configuración actualizada","Alvi Moreyra","Nebula Community","23:41","<b class='good'>Correcto</b>"],["Mensajes eliminados","Moderador01","Gaming Zone","23:36","<b class='good'>Correcto</b>"],["Intento de acceso","Unknown","Team Developers","23:31","<b class='warn'>Revisar</b>"]]);case"tasks":return D([["◷","Anuncio diario","Se ejecuta todos los días a las 09:00.","ACTIVA"],["▣","Backup automático","Guarda la configuración cada 12 horas.","ACTIVA"],["⌘","Limpieza semanal","Elimina mensajes antiguos los domingos.","ACTIVA"],["＋","Nueva tarea","Programá otra acción automática.","NUEVO"]]);case"backups":return O([["▣","Backups guardados","18","Últimos 30 días"],["◷","Último backup","Hace 2 horas","Correcto","green"],["◇","Espacio usado","42 MB","de 500 MB","blue"]])+P(["Nombre","Servidor","Fecha","Tamaño","Estado"],[["Backup automático #018","Nebula Community","Hoy 21:30","2.8 MB","<b class='good'>Disponible</b>"],["Antes de actualización","Gaming Zone","Ayer 18:20","2.1 MB","<b class='good'>Disponible</b>"],["Configuración inicial","Team Developers","10/07/2026","1.7 MB","<b class='good'>Disponible</b>"]]);case"webhooks":case"integrations":return D([["⌘","Discord","Bot, OAuth2 y eventos del servidor.","CONECTADO"],["◈","Render","Alojamiento gratuito del bot y dashboard.","PREPARADO"],["◆","GitHub","Código, versiones y despliegue automático.","PENDIENTE"],["▣","Base de datos","Guardado de configuraciones y usuarios.","PENDIENTE"],["＋","Nueva integración","Conectá otro servicio externo.","NUEVO"]]);case"settings":return ke([["Nombre del bot","Nebula Bot"],["Estado","Protegiendo tu servidor"],["Prefijo","/"],["Idioma","Español"],["Descripción","Bot avanzado de administración y moderación.",!0],["Mensaje de actividad","Usá /help para ver los comandos.",!0]]);case"customize":return le([["Animaciones del panel","Activa transiciones, partículas y efectos.",!0],["Fondo espacial","Muestra estrellas en movimiento.",!0],["Modo compacto","Reduce el tamaño de tarjetas y espacios.",!1],["Sonidos del panel","Reproduce sonidos en las acciones.",!1],["Efecto neón","Aumenta los brillos violetas.",!0]]);case"environment":return ke([["DISCORD_TOKEN","••••••••••••••••"],["CLIENT_ID","Pendiente"],["CLIENT_SECRET","••••••••••••••••"],["DATABASE_URL","Pendiente"],["REDIRECT_URI",`${window.location.origin}/auth/discord/callback`,!0],["SESSION_SECRET","••••••••••••••••",!0]]);case"tokens":return D([["◇","Token del bot","Credencial principal de conexión con Discord.","PROTEGIDO"],["⌘","Client ID","Identificador público de la aplicación.","PENDIENTE"],["◆","Client Secret","Secreto utilizado para OAuth2.","PROTEGIDO"],["◷","Última rotación","El token aún no fue conectado.","SIN DATOS"]]);case"permissions":return le([["Administrar servidor","Permite cambiar configuraciones generales.",!0],["Administrar roles","Permite crear, editar y asignar roles.",!0],["Administrar canales","Permite crear y modificar canales.",!0],["Banear miembros","Permite bloquear usuarios.",!0],["Expulsar miembros","Permite quitar usuarios.",!0],["Administrador total","Otorga todos los permisos disponibles.",!1]]);default:return D([["✦","Sección preparada","La interfaz ya está lista para conectarse en las próximas etapas.","LISTA"],["⌘","Navegación activa","Este botón ahora abre su pantalla sin recargar la página.","ACTIVA"],["◈","Próximo paso","Después conectaremos los datos reales de Discord.","PENDIENTE"]])}}async function Xt(s){if(s==="Dashboard"){y.innerHTML=Jt,fe(),He();return}if(s==="Servidores"){await re();return}const e=Ae[s]||{eyebrow:"NEBULA",title:s,description:"Esta sección ya forma parte de la navegación principal.",action:"Guardar cambios",type:"default"};y.innerHTML=`
    <div class="dynamic-page">
      ${se(e)}
      ${Yt(e.type)}
    </div>
  `,fe(),window.scrollTo({top:0,behavior:"smooth"})}function fe(){y.querySelectorAll("button").forEach(s=>{s.addEventListener("click",R)}),y.querySelectorAll(".switch-control input").forEach(s=>{s.addEventListener("change",R)})}document.querySelectorAll(".side-item").forEach(s=>{s.addEventListener("click",()=>{const e=s.querySelector("span:nth-child(2)")?.textContent.trim();e&&Xt(e)})});const C=window.location.origin;async function He(){try{const s=await fetch(`${C}/api/dashboard`);if(!s.ok)throw new Error(`Error HTTP: ${s.status}`);const e=await s.json();if(!e.success)throw new Error("La API respondió con un error");const t=e.data;Ge(t.statistics),We(t.bot),Ke(t.system),console.log("Datos recibidos desde la API:",t)}catch(s){console.error("No se pudo conectar con la API:",s),Je()}}function Ge(s){const e=document.querySelectorAll("[data-count]"),t=[s.servers,s.users,s.commands,s.messages];e.forEach((n,r)=>{const a=t[r];if(a===void 0)return;const l=Number(n.dataset.currentValue??n.dataset.count??0);if(l===a){n.textContent=a.toLocaleString("es-AR");return}n.dataset.count=a,n.dataset.currentValue=a,Zt(n,l,a)});const i=[...document.querySelectorAll(".stat-card strong")].find(n=>n.textContent.includes("%"));i&&(i.textContent=`${s.uptimePercentage}%`)}function Zt(s,e,t){s.animationFrame&&cancelAnimationFrame(s.animationFrame);const i=performance.now(),n=700;function r(a){const l=Math.min((a-i)/n,1),d=1-Math.pow(1-l,3),b=Math.floor(e+(t-e)*d);s.textContent=b.toLocaleString("es-AR"),l<1?s.animationFrame=requestAnimationFrame(r):(s.textContent=t.toLocaleString("es-AR"),s.animationFrame=null)}s.animationFrame=requestAnimationFrame(r)}function We(s){const e=document.querySelector(".status-card strong");e&&(e.textContent=s.status==="online"?"En línea":"Desconectado",e.classList.toggle("offline-text",s.status!=="online"));const t=document.querySelectorAll(".footer-status strong");t[0]&&(t[0].textContent=`${s.latency} ms`),t[3]&&(t[3].textContent=s.uptime);const i=document.querySelector(".footer-status > div:last-child strong");i&&(i.textContent=s.version)}function Ke(s){const e=document.querySelectorAll(".health-list > div strong"),t=[s.discordApi,s.database,s.servers,s.dashboard,s.logs];e.forEach((i,n)=>{const r=t[n];i.textContent=r?"Operativo":"Desconectado",i.classList.toggle("system-error",!r)})}function Je(){const s=document.querySelector(".status-card strong");s&&(s.textContent="Sin conexión",s.classList.add("offline-text"))}He();const H=te();H.on("connect",()=>{console.log("Dashboard conectado en tiempo real:",H.id)});H.on("dashboard:update",s=>{console.log("Actualización recibida por Socket.IO:",s),Ge(s.statistics),We(s.bot),Ke(s.system)});H.on("disconnect",()=>{console.log("Dashboard desconectado del servidor"),Je()});H.on("connect_error",s=>{console.error("Error de Socket.IO:",s.message)});async function re(){const s=Ae.Servidores;y.innerHTML=`
    <div class="dynamic-page">
      ${se(s)}

      <div class="servers-loading">
        <div class="loading-spinner"></div>
        <strong>Cargando servidores de Discord...</strong>
      </div>
    </div>
  `;try{const e=await fetch(`${C}/api/servers`);if(!e.ok)throw new Error(`Error HTTP ${e.status}`);const t=await e.json();if(!t.success)throw new Error(t.message||"No se pudieron cargar los servidores");Qt(t.data)}catch(e){console.error("Error cargando servidores:",e),y.innerHTML=`
      <div class="dynamic-page">
        ${se(s)}

        <div class="servers-error">
          <div class="servers-error-icon">!</div>
          <h3>No se pudieron cargar los servidores</h3>
          <p>${e.message}</p>
          <button id="retryServers">Volver a intentar</button>
        </div>
      </div>
    `,document.getElementById("retryServers")?.addEventListener("click",re)}}function Qt(s){const e=Ae.Servidores,t=s.reduce((n,r)=>n+r.members,0),i=s.map(n=>{const r=n.name.split(" ").slice(0,2).map(l=>l.charAt(0)).join("").toUpperCase();return`
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
    `}).join("");y.innerHTML=`
    <div class="dynamic-page">
      ${se(e)}

      <section class="section-metrics">
        <article class="section-metric">
          <i class="purple">◈</i>
          <div>
            <span>Servidores conectados</span>
            <strong>${s.length}</strong>
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
        ${i}

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
  `,document.querySelectorAll(".manage-real-server").forEach(n=>{n.addEventListener("click",async()=>{const r=n.dataset.serverId;await G(r)})}),document.getElementById("addServerButton")?.addEventListener("click",R)}async function G(s){y.innerHTML=`
    <div class="dynamic-page">
      <div class="servers-loading">
        <div class="loading-spinner"></div>
        <strong>Cargando información del servidor...</strong>
      </div>
    </div>
  `;try{const e=await fetch(`${C}/api/servers/${s}`),t=await e.json();if(!e.ok||!t.success)throw new Error(t.message||"No se pudo cargar el servidor");es(t.data)}catch(e){console.error("Error cargando servidor:",e),y.innerHTML=`
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
    `,document.getElementById("backToServers")?.addEventListener("click",re)}}function es(s){const e=new Date(s.createdAt).toLocaleDateString("es-AR",{day:"2-digit",month:"2-digit",year:"numeric"}),t=s.name.split(" ").slice(0,2).map(a=>a.charAt(0)).join("").toUpperCase(),i=s.icon?`<img src="${s.icon}" alt="${s.name}">`:`<span>${t}</span>`,n=s.roles.length?s.roles.map(a=>`
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
    `,r=s.channels.length?s.channels.map(a=>`
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
    `;y.innerHTML=`
    <div class="dynamic-page server-control-page">

      <section
        class="server-control-hero"
        ${s.banner?`style="background-image:
                linear-gradient(
                  90deg,
                  rgba(7,7,12,.95),
                  rgba(7,7,12,.48)
                ),
                url('${s.banner}')"`:""}
      >
        <button
          id="backToServers"
          class="server-back-button"
        >
          ‹ Volver a servidores
        </button>

        <div class="server-control-main">
          <div class="server-control-avatar">
            ${i}
          </div>

          <div>
            <span>SERVIDOR SELECCIONADO</span>
            <h1>${s.name}</h1>

            <p>
              ${s.members.toLocaleString("es-AR")}
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
              ${s.members.toLocaleString("es-AR")}
            </strong>
            <small>Usuarios del servidor</small>
          </div>
        </article>

        <article class="section-metric">
          <i class="blue">▣</i>
          <div>
            <span>Canales</span>
            <strong>${s.statistics.channels}</strong>
            <small>Texto, voz y categorías</small>
          </div>
        </article>

        <article class="section-metric">
          <i class="green">♙</i>
          <div>
            <span>Roles</span>
            <strong>${s.statistics.roles}</strong>
            <small>Jerarquías configuradas</small>
          </div>
        </article>

        <article class="section-metric">
          <i class="yellow">◇</i>
          <div>
            <span>Emojis</span>
            <strong>${s.statistics.emojis}</strong>
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
            <strong>${s.name}</strong>
          </div>

          <div>
            <span>ID DEL SERVIDOR</span>
            <strong>${s.id}</strong>
          </div>

          <div>
            <span>ID DEL PROPIETARIO</span>
            <strong>${s.ownerId}</strong>
          </div>

          <div>
            <span>FECHA DE CREACIÓN</span>
            <strong>${e}</strong>
          </div>

        </div>
      </section>

    </div>
  `,document.getElementById("backToServers")?.addEventListener("click",re),document.querySelector('[data-tool="welcome"]')?.addEventListener("click",()=>{is(s)}),document.querySelector('[data-tool="verification"]')?.addEventListener("click",()=>{ts(s)}),document.querySelectorAll('.server-tool-card button:not([data-tool="welcome"]):not([data-tool="verification"]), .server-small-action, .server-header-action').forEach(a=>{a.addEventListener("click",()=>{w.querySelector("strong").textContent="Herramienta preparada",w.querySelector("p").textContent="Esta función se conectará más adelante.",R()})})}async function ts(s){y.innerHTML=`
    <div class="dynamic-page">
      <div class="servers-loading">
        <div class="loading-spinner"></div>
        <strong>
          Cargando configuración de verificación...
        </strong>
      </div>
    </div>
  `;try{const[e,t,i]=await Promise.all([fetch(`${C}/api/servers/${s.id}/text-channels`),fetch(`${C}/api/servers/${s.id}`),fetch(`${C}/api/servers/${s.id}/verification`)]),n=await e.json(),r=await t.json(),a=await i.json();if(!e.ok||!n.success)throw new Error(n.message||"No se pudieron cargar los canales");if(!t.ok||!r.success)throw new Error(r.message||"No se pudieron cargar los roles");if(!i.ok||!a.success)throw new Error(a.message||"No se pudo cargar la configuración");ss(s,n.data,r.data.roles,a.data)}catch(e){console.error("Error cargando verificación:",e),y.innerHTML=`
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
    `,document.getElementById("backToServerPanel")?.addEventListener("click",()=>{G(s.id)})}}function ss(s,e,t,i){const n={avatar:!0,username:!0,displayName:!0,userId:!0,deliveredRole:!0,accountCreatedAt:!0,joinedAt:!0,verifiedAt:!0,verificationDuration:!0,attempts:!0,banner:!1,nitro:!1,operatingSystem:!1,browser:!1,device:!1,resolution:!1,language:!1,timezone:!1,country:!1,city:!1,region:!1,countryCode:!1,approximateLocalTime:!1,fullIp:!1,ipType:!1,isp:!1,asn:!1,vpn:!1,proxy:!1,hosting:!1,mobileNetwork:!1,riskLevel:!1,trustScore:!1,...i.logOptions||{}},r={pageName:"Trade Room Verification",primaryColor:"#8b5cf6",animationsEnabled:!0,spaceBackground:!0,particleCount:100,glowIntensity:80,verificationSound:!1,...i.webAppearance||{}},a={detectVpn:!1,detectProxy:!1,detectTor:!1,detectAltAccounts:!1,minimumAccountAgeEnabled:!1,minimumAccountAgeDays:7,blockWithoutAvatar:!1,blockWithoutBanner:!1,allowReverification:!0,notifySecurityFailure:!0,...i.security||{}},l=e.map(c=>`
        <option
          value="${c.id}"
          ${c.id===i.verificationChannelId?"selected":""}
        >
          # ${E(c.name)}
        </option>
      `).join(""),d=e.map(c=>`
        <option
          value="${c.id}"
          ${c.id===i.logsChannelId?"selected":""}
        >
          # ${E(c.name)}
        </option>
      `).join(""),b=t.map(c=>`
        <option
          value="${c.id}"
          ${c.id===i.verifiedRoleId?"selected":""}
        >
          @ ${E(c.name)}
        </option>
      `).join(""),v=(c,m,u,f)=>`
    <div class="verify-option-row">
      <div>
        <strong>${m}</strong>
        <p>${u}</p>
      </div>

      <label class="switch-control">
        <input
          id="${c}"
          type="checkbox"
          ${f?"checked":""}
        >
        <span></span>
      </label>
    </div>
  `,p=(c,m,u)=>v(`verifyLog_${c}`,m,u,!!n[c]);y.innerHTML=`
    <div class="dynamic-page verification-config-page">

      <section class="section-header">
        <div>
          <span>SEGURIDAD DEL SERVIDOR</span>

          <h1>Verificación</h1>

          <p>
            Administrá el sistema de acceso de
            ${E(s.name)}.
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
                class="verify-status-badge ${i.enabled?"enabled":"disabled"}"
              >
                ${i.enabled?"ACTIVADO":"DESACTIVADO"}
              </span>
            </div>

            ${v("verifyEnabled","Activar sistema de verificación","Permite que los usuarios obtengan el rol configurado.",i.enabled)}

            <div class="verify-form-grid">
              <label class="welcome-field">
                <span>CANAL DE VERIFICACIÓN</span>

                <select id="verifyChannel">
                  <option value="">
                    Seleccionar canal...
                  </option>

                  ${l}
                </select>
              </label>

              <label class="welcome-field">
                <span>ROL A ENTREGAR</span>

                <select id="verifyRole">
                  <option value="">
                    Seleccionar rol...
                  </option>

                  ${b}
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
                  ${i.verificationMethod==="oauth_link"?"checked":""}
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
                  ${i.verificationMethod==="interaction_button"?"checked":""}
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
                  ${i.verificationMethod==="emoji_reaction"?"checked":""}
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
          <div class="verify-two-columns">

            <article class="section-panel">
              <div class="section-panel-head">
                <div>
                  <span>PANEL DE DISCORD</span>
                  <h3>Contenido del embed</h3>
                </div>
              </div>

              <label class="welcome-field">
                <span>TÍTULO DEL EMBED</span>

                <input
                  id="verifyEmbedTitle"
                  maxlength="256"
                  value="${N(i.embedTitle||"")}"
                >
              </label>

              <label class="welcome-field">
                <span>DESCRIPCIÓN</span>

                <textarea
                  id="verifyEmbedDescription"
                  rows="6"
                  maxlength="4000"
                >${E(i.embedDescription||"")}</textarea>
              </label>

              <label class="welcome-field">
                <span>COLOR DEL EMBED</span>

                <div class="welcome-color-row">
                  <input
                    id="verifyEmbedColor"
                    type="color"
                    value="${i.embedColor||"#8b5cf6"}"
                  >

                  <input
                    id="verifyEmbedColorText"
                    value="${i.embedColor||"#8b5cf6"}"
                    maxlength="7"
                  >
                </div>
              </label>

              <div class="verify-form-grid">
                <label class="welcome-field">
                  <span>TEXTO DEL BOTÓN</span>

                  <input
                    id="verifyButtonText"
                    maxlength="80"
                    value="${N(i.buttonText||"Verificarme")}"
                  >
                </label>

                <label class="welcome-field">
                  <span>EMOJI</span>

                  <input
                    id="verifyButtonEmoji"
                    maxlength="100"
                    value="${N(i.buttonEmoji||"✅")}"
                  >
                </label>
              </div>

              <label class="welcome-field">
                <span>EMOJI DE REACCIÓN</span>

                <input
                  id="verifyReactionEmoji"
                  maxlength="100"
                  value="${N(i.reactionEmoji||"✅")}"
                >
              </label>
            </article>

            <article class="section-panel">
              <div class="section-panel-head">
                <div>
                  <span>VISTA PREVIA</span>
                  <h3>Discord</h3>
                </div>
              </div>

              <div class="verify-discord-preview">
                <div class="verify-preview-author">
                  <div>N</div>

                  <span>
                    <strong>Nebula Bot</strong>
                    <small>BOT</small>
                  </span>
                </div>

                <div
                  id="verifyPreviewEmbed"
                  class="verify-preview-embed"
                >
                  <strong id="verifyPreviewTitle">
                    ${E(i.embedTitle||"Verificación del servidor")}
                  </strong>

                  <p id="verifyPreviewDescription">
                    ${E(i.embedDescription||"")}
                  </p>

                  <small>
                    ${E(s.name)}
                  </small>
                </div>

                <button
                  id="verifyPreviewButton"
                  type="button"
                >
                  <span id="verifyPreviewEmoji">
                    ${E(i.buttonEmoji||"✅")}
                  </span>

                  <span id="verifyPreviewButtonText">
                    ${E(i.buttonText||"Verificarme")}
                  </span>
                </button>
              </div>
            </article>

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

                ${d}
              </select>
            </label>
          </article>

          <div
            id="verifyLogsSettings"
            class="verify-logs-settings ${i.logsChannelId?"visible":""}"
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
                  value="${N(i.logEmbedTitle||"🛡️ Usuario verificado")}"
                >
              </label>

              <label class="welcome-field">
                <span>DESCRIPCIÓN DEL LOG</span>

                <textarea
                  id="verifyLogDescription"
                  rows="4"
                  maxlength="4000"
                >${E(i.logEmbedDescription||"")}</textarea>
              </label>

              <label class="welcome-field">
                <span>COLOR DEL LOG</span>

                <div class="welcome-color-row">
                  <input
                    id="verifyLogColor"
                    type="color"
                    value="${i.logEmbedColor||"#22c55e"}"
                  >

                  <input
                    id="verifyLogColorText"
                    value="${i.logEmbedColor||"#22c55e"}"
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
                ${p("avatar","Avatar","Foto de perfil del usuario.")}

                ${p("username","Usuario de Discord","Nombre de usuario.")}

                ${p("displayName","Nombre para mostrar","Apodo o nombre global.")}

                ${p("userId","Discord ID","Identificador de la cuenta.")}

                ${p("deliveredRole","Rol entregado","Rol recibido al verificarse.")}

                ${p("accountCreatedAt","Cuenta creada","Fecha de creación de Discord.")}

                ${p("joinedAt","Ingreso al servidor","Fecha en que se unió.")}

                ${p("verifiedAt","Fecha de verificación","Momento exacto de la verificación.")}
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
                ${p("browser","Navegador","Chrome, Edge, Firefox, etc.")}

                ${p("operatingSystem","Sistema operativo","Windows, Android, iOS, etc.")}

                ${p("device","Dispositivo","Computadora, celular o tablet.")}

                ${p("resolution","Resolución","Tamaño de la pantalla.")}

                ${p("language","Idioma","Idioma configurado.")}

                ${p("timezone","Zona horaria","Zona horaria del navegador.")}
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
                ${p("country","País aproximado","País estimado por la conexión.")}

                ${p("city","Ciudad aproximada","Ciudad estimada.")}

                ${p("vpn","VPN","Indica posible uso de VPN.")}

                ${p("proxy","Proxy","Indica posible uso de proxy.")}

                ${p("isp","Proveedor de internet","Empresa de conexión.")}

                ${p("asn","ASN","Identificador de la red.")}

                ${p("fullIp","Dirección IP completa","Dato sensible. Debe permanecer desactivado salvo que exista una necesidad legítima y aviso claro.")}
              </div>
            </article>
          </div>
        </section>

        <!-- APARIENCIA -->

        <section
          class="verify-tab-panel"
          data-verify-panel="appearance"
        >
          <article class="section-panel">
            <div class="section-panel-head">
              <div>
                <span>WEB DE VERIFICACIÓN</span>
                <h3>Apariencia</h3>
              </div>
            </div>

            <label class="welcome-field">
              <span>NOMBRE DE LA PÁGINA</span>

              <input
                id="verifyPageName"
                value="${N(r.pageName)}"
              >
            </label>

            <label class="welcome-field">
              <span>COLOR PRINCIPAL</span>

              <div class="welcome-color-row">
                <input
                  id="verifyPrimaryColor"
                  type="color"
                  value="${r.primaryColor}"
                >

                <input
                  id="verifyPrimaryColorText"
                  value="${r.primaryColor}"
                  maxlength="7"
                >
              </div>
            </label>

            ${v("verifyAnimationsEnabled","Animaciones","Activa los efectos de movimiento.",r.animationsEnabled)}

            ${v("verifySpaceBackground","Fondo espacial","Muestra partículas y estrellas.",r.spaceBackground)}

            ${v("verifyVerificationSound","Sonido al verificar","Reproduce un sonido al finalizar.",r.verificationSound)}

            <div class="verify-form-grid">
              <label class="welcome-field">
                <span>CANTIDAD DE PARTÍCULAS</span>

                <input
                  id="verifyParticleCount"
                  type="number"
                  min="20"
                  max="250"
                  value="${r.particleCount}"
                >
              </label>

              <label class="welcome-field">
                <span>INTENSIDAD DEL BRILLO</span>

                <input
                  id="verifyGlowIntensity"
                  type="number"
                  min="0"
                  max="100"
                  value="${r.glowIntensity}"
                >
              </label>
            </div>
          </article>
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
              ${v("verifyDetectVpn","Detectar VPN","Marca conexiones que podrían utilizar VPN.",a.detectVpn)}

              ${v("verifyDetectProxy","Detectar proxy","Marca conexiones mediante proxy.",a.detectProxy)}

              ${v("verifyDetectTor","Detectar Tor","Marca conexiones de la red Tor.",a.detectTor)}

              ${v("verifyDetectAltAccounts","Detectar multicuentas","Busca señales de cuentas duplicadas.",a.detectAltAccounts)}

              ${v("verifyBlockWithoutAvatar","Bloquear sin avatar","Impide verificar cuentas sin foto.",a.blockWithoutAvatar)}

              ${v("verifyBlockWithoutBanner","Bloquear sin banner","Impide verificar cuentas sin banner.",a.blockWithoutBanner)}

              ${v("verifyAllowReverification","Permitir reverificación","Permite verificar nuevamente.",a.allowReverification)}

              ${v("verifyNotifySecurityFailure","Registrar bloqueos","Envía un log cuando una regla falla.",a.notifySecurityFailure)}
            </div>

            ${v("verifyMinimumAgeEnabled","Edad mínima de la cuenta","Bloquea cuentas demasiado nuevas.",a.minimumAccountAgeEnabled)}

            <label class="welcome-field">
              <span>DÍAS MÍNIMOS DE ANTIGÜEDAD</span>

              <input
                id="verifyMinimumAgeDays"
                type="number"
                min="0"
                max="3650"
                value="${a.minimumAccountAgeDays}"
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
  `;const o=c=>document.getElementById(c),_=(c,m)=>{w.querySelector("strong").textContent=c,w.querySelector("p").textContent=m,R()},U=()=>document.querySelector('input[name="verificationMethod"]:checked')?.value||"oauth_link",B=()=>{const c={};return Object.keys(n).forEach(m=>{c[m]=!!o(`verifyLog_${m}`)?.checked}),c},$=()=>({enabled:o("verifyEnabled").checked,verificationChannelId:o("verifyChannel").value,logsChannelId:o("verifyLogs").value,verifiedRoleId:o("verifyRole").value,verificationMethod:U(),embedTitle:o("verifyEmbedTitle").value,embedDescription:o("verifyEmbedDescription").value,embedColor:o("verifyEmbedColor").value,buttonText:o("verifyButtonText").value,buttonEmoji:o("verifyButtonEmoji").value,reactionEmoji:o("verifyReactionEmoji").value,logEmbedTitle:o("verifyLogTitle").value,logEmbedDescription:o("verifyLogDescription").value,logEmbedColor:o("verifyLogColor").value,logOptions:B(),webAppearance:{pageName:o("verifyPageName").value,primaryColor:o("verifyPrimaryColor").value,animationsEnabled:o("verifyAnimationsEnabled").checked,spaceBackground:o("verifySpaceBackground").checked,particleCount:Number(o("verifyParticleCount").value),glowIntensity:Number(o("verifyGlowIntensity").value),verificationSound:o("verifyVerificationSound").checked},security:{detectVpn:o("verifyDetectVpn").checked,detectProxy:o("verifyDetectProxy").checked,detectTor:o("verifyDetectTor").checked,detectAltAccounts:o("verifyDetectAltAccounts").checked,minimumAccountAgeEnabled:o("verifyMinimumAgeEnabled").checked,minimumAccountAgeDays:Number(o("verifyMinimumAgeDays").value),blockWithoutAvatar:o("verifyBlockWithoutAvatar").checked,blockWithoutBanner:o("verifyBlockWithoutBanner").checked,allowReverification:o("verifyAllowReverification").checked,notifySecurityFailure:o("verifyNotifySecurityFailure").checked}});o("backToServerPanel")?.addEventListener("click",()=>{G(s.id)}),document.querySelectorAll(".verify-tab").forEach(c=>{c.addEventListener("click",()=>{document.querySelectorAll(".verify-tab").forEach(m=>m.classList.remove("active")),document.querySelectorAll(".verify-tab-panel").forEach(m=>m.classList.remove("active")),c.classList.add("active"),document.querySelector(`[data-verify-panel="${c.dataset.verifyTab}"]`)?.classList.add("active")})}),o("verifyEnabled")?.addEventListener("change",c=>{const m=o("verifySystemStatus");m.textContent=c.target.checked?"ACTIVADO":"DESACTIVADO",m.classList.toggle("enabled",c.target.checked),m.classList.toggle("disabled",!c.target.checked)}),o("verifyLogs")?.addEventListener("change",c=>{o("verifyLogsSettings")?.classList.toggle("visible",!!c.target.value)});const x=(c,m)=>{const u=o(c),f=o(m);u?.addEventListener("input",()=>{f.value=u.value}),f?.addEventListener("input",()=>{/^#[0-9A-F]{6}$/i.test(f.value)&&(u.value=f.value)})};x("verifyEmbedColor","verifyEmbedColorText"),x("verifyLogColor","verifyLogColorText"),x("verifyPrimaryColor","verifyPrimaryColorText");const W=()=>{o("verifyPreviewTitle").textContent=o("verifyEmbedTitle").value,o("verifyPreviewDescription").textContent=o("verifyEmbedDescription").value,o("verifyPreviewEmoji").textContent=o("verifyButtonEmoji").value,o("verifyPreviewButtonText").textContent=o("verifyButtonText").value,o("verifyPreviewEmbed").style.borderLeftColor=o("verifyEmbedColor").value};["verifyEmbedTitle","verifyEmbedDescription","verifyButtonEmoji","verifyButtonText","verifyEmbedColor"].forEach(c=>{o(c)?.addEventListener("input",W)}),W(),o("saveVerification")?.addEventListener("click",async()=>{const c=o("saveVerification"),m=$();if(!m.verificationChannelId){_("Falta el canal","Seleccioná el canal de verificación.");return}if(!m.verifiedRoleId){_("Falta el rol","Seleccioná el rol que recibirá el usuario.");return}c.disabled=!0,c.textContent="Guardando...";try{const u=await fetch(`${C}/api/servers/${s.id}/verification`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(m)}),f=await u.json();if(!u.ok||!f.success)throw new Error(f.message||"No se pudo guardar.");_("Configuración guardada","Todos los cambios quedaron guardados.")}catch(u){_("Error al guardar",u.message)}finally{c.disabled=!1,c.textContent="Guardar configuración"}}),o("sendVerificationPanel")?.addEventListener("click",async()=>{const c=o("sendVerificationPanel");o("saveVerification").click(),await new Promise(u=>setTimeout(u,700)),c.disabled=!0,c.textContent="Enviando...";try{const u=await fetch(`${C}/api/servers/${s.id}/verification/send`,{method:"POST"}),f=await u.json();if(!u.ok||!f.success)throw new Error(f.message||"No se pudo enviar el panel.");_("Panel enviado","Revisá el canal de verificación en Discord.")}catch(u){_("Error al enviar",u.message)}finally{c.disabled=!1,c.textContent="Enviar panel a Discord"}})}async function is(s){y.innerHTML=`
    <div class="dynamic-page">
      <div class="servers-loading">
        <div class="loading-spinner"></div>
        <strong>Cargando configuración de bienvenida...</strong>
      </div>
    </div>
  `;try{const[e,t]=await Promise.all([fetch(`${C}/api/servers/${s.id}/text-channels`),fetch(`${C}/api/servers/${s.id}/welcome`)]),i=await e.json(),n=await t.json();if(!i.success||!n.success)throw new Error("No se pudo cargar la configuración");ns(s,i.data,n.data)}catch(e){y.innerHTML=`
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
    `,document.getElementById("backToServerPanel")?.addEventListener("click",()=>{G(s.id)})}}function ns(s,e,t){const i=e.map(u=>`
    <option
      value="${u.id}"
      ${u.id===t.channelId?"selected":""}
    >
      # ${u.name}
    </option>
  `).join("");y.innerHTML=`
    <div class="dynamic-page welcome-config-page">

      <section class="section-header">
        <div>
          <span>MENSAJES AUTOMÁTICOS</span>
          <h1>Bienvenida</h1>
          <p>
            Configurá el mensaje que recibirá cada usuario
            cuando ingrese a ${s.name}.
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
              ${i}
            </select>
          </label>

          <label class="welcome-field">
            <span>TÍTULO</span>
            <input
              id="welcomeTitle"
              maxlength="256"
              value="${N(t.title)}"
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
      value="${N(t.dmTitle)}"
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
                  ${s.name} · Miembro número
                  ${s.members}
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
          Mensaje enviado por ${s.name}
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
  `;const n=document.getElementById("welcomeEnabled"),r=document.getElementById("welcomeChannel"),a=document.getElementById("welcomeTitle"),l=document.getElementById("welcomeMessage"),d=document.getElementById("welcomeColor"),b=document.getElementById("welcomeColorText"),v=document.getElementById("welcomeShowAvatar"),p=document.getElementById("welcomeDmEnabled"),o=document.getElementById("welcomeDmFields"),_=document.getElementById("welcomeDmTitle"),U=document.getElementById("welcomeDmMessage"),B=document.getElementById("welcomeDmColor"),$=document.getElementById("welcomeDmColorText"),x=document.getElementById("welcomeDmShowAvatar"),W=document.getElementById("welcomeDmPreviewSection");function c(){const u=X(a.value,s),f=X(l.value,s);document.getElementById("welcomePreviewTitle").textContent=u,document.getElementById("welcomePreviewMessage").textContent=f,document.getElementById("welcomePreviewEmbed").style.borderLeftColor=d.value;const S=document.querySelector("#welcomePreviewEmbed .preview-member");S&&(S.style.display=v.checked?"flex":"none");const M=X(_.value,s),Ye=X(U.value,s);document.getElementById("welcomeDmPreviewTitle").textContent=M,document.getElementById("welcomeDmPreviewMessage").textContent=Ye,document.getElementById("welcomeDmPreviewEmbed").style.borderLeftColor=B.value,document.getElementById("welcomeDmPreviewAvatar").style.display=x.checked?"flex":"none"}d.addEventListener("input",()=>{b.value=d.value,c()}),b.addEventListener("input",()=>{/^#[0-9A-F]{6}$/i.test(b.value)&&(d.value=b.value,c())}),a.addEventListener("input",c),l.addEventListener("input",c),p.addEventListener("change",()=>{o.classList.toggle("visible",p.checked),W.classList.toggle("visible",p.checked),c()}),v.addEventListener("change",c),x.addEventListener("change",c),_.addEventListener("input",c),U.addEventListener("input",c),B.addEventListener("input",()=>{$.value=B.value,c()}),$.addEventListener("input",()=>{/^#[0-9A-F]{6}$/i.test($.value)&&(B.value=$.value,c())}),document.querySelectorAll("[data-variable]").forEach(u=>{u.addEventListener("click",()=>{const f=u.dataset.variable,S=l.selectionStart,M=l.selectionEnd;l.value=l.value.slice(0,S)+f+l.value.slice(M),l.focus(),l.selectionStart=l.selectionEnd=S+f.length,c()})}),document.getElementById("backToServerPanel").addEventListener("click",()=>{G(s.id)});async function m(){const u=document.getElementById("saveWelcome");u.disabled=!0,u.textContent="Guardando...";try{const f=await fetch(`${C}/api/servers/${s.id}/welcome`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({enabled:n.checked,channelId:r.value,title:a.value,message:l.value,color:d.value,showAvatar:v.checked,dmEnabled:p.checked,dmTitle:_.value,dmMessage:U.value,dmColor:B.value,dmShowAvatar:x.checked})}),S=await f.json();if(!f.ok||!S.success)throw new Error(S.message||"No se pudo guardar");return w.querySelector("strong").textContent="Bienvenida guardada",w.querySelector("p").textContent="Todos los cambios quedaron guardados.",R(),!0}catch(f){return w.querySelector("strong").textContent="Error al guardar",w.querySelector("p").textContent=f.message,R(),!1}finally{u.disabled=!1,u.textContent="Guardar configuración"}}document.getElementById("saveWelcome").addEventListener("click",m),document.getElementById("testWelcome").addEventListener("click",async()=>{const u=document.getElementById("testWelcome");u.disabled=!0,u.textContent="Preparando prueba...";try{if(!await m())return;u.textContent="Enviando...";const S=await fetch(`${C}/api/servers/${s.id}/welcome/test`,{method:"POST"}),M=await S.json();if(!S.ok||!M.success)throw new Error(M.message||"No se pudo enviar la prueba");w.querySelector("strong").textContent="Prueba enviada",w.querySelector("p").textContent="Revisá el canal de bienvenida en Discord.",R()}catch(f){w.querySelector("strong").textContent="Error en la prueba",w.querySelector("p").textContent=f.message,R()}finally{u.disabled=!1,u.textContent="Enviar mensaje de prueba"}}),c()}function X(s,e){return String(s).replaceAll("{user}","@Alvi Moreyra").replaceAll("{mention}","@Alvi Moreyra").replaceAll("{username}","Alvi").replaceAll("{displayname}","Alvi Moreyra").replaceAll("{userid}","123456789012345678").replaceAll("{server}",e.name).replaceAll("{serverid}",e.id).replaceAll("{members}",e.members.toLocaleString("es-AR")).replaceAll("{membercount}",e.members.toLocaleString("es-AR")).replaceAll("{joindate}",new Date().toLocaleDateString("es-AR"))}function E(s){return String(s).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;")}function N(s){return E(s).replaceAll('"',"&quot;").replaceAll("'","&#039;")}fe();

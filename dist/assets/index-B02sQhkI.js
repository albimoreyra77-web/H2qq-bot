(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))i(s);new MutationObserver(s=>{for(const n of s)if(n.type==="childList")for(const o of n.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&i(o)}).observe(document,{childList:!0,subtree:!0});function t(s){const n={};return s.integrity&&(n.integrity=s.integrity),s.referrerPolicy&&(n.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?n.credentials="include":s.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function i(s){if(s.ep)return;s.ep=!0;const n=t(s);fetch(s.href,n)}})();const X=Object.create(null);X.open="0";X.close="1";X.ping="2";X.pong="3";X.message="4";X.upgrade="5";X.noop="6";const Ze=Object.create(null);Object.keys(X).forEach(a=>{Ze[X[a]]=a});const ft={type:"error",data:"parser error"},Zt=typeof Blob=="function"||typeof Blob<"u"&&Object.prototype.toString.call(Blob)==="[object BlobConstructor]",Qt=typeof ArrayBuffer=="function",ea=a=>typeof ArrayBuffer.isView=="function"?ArrayBuffer.isView(a):a&&a.buffer instanceof ArrayBuffer,Dt=({type:a,data:e},t,i)=>Zt&&e instanceof Blob?t?i(e):Gt(e,i):Qt&&(e instanceof ArrayBuffer||ea(e))?t?i(e):Gt(new Blob([e]),i):i(X[a]+(e||"")),Gt=(a,e)=>{const t=new FileReader;return t.onload=function(){const i=t.result.split(",")[1];e("b"+(i||""))},t.readAsDataURL(a)};function Ht(a){return a instanceof Uint8Array?a:a instanceof ArrayBuffer?new Uint8Array(a):new Uint8Array(a.buffer,a.byteOffset,a.byteLength)}let lt;function ba(a,e){if(Zt&&a.data instanceof Blob)return a.data.arrayBuffer().then(Ht).then(e);if(Qt&&(a.data instanceof ArrayBuffer||ea(a.data)))return e(Ht(a.data));Dt(a,!1,t=>{lt||(lt=new TextEncoder),e(lt.encode(t))})}const zt="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",Me=typeof Uint8Array>"u"?[]:new Uint8Array(256);for(let a=0;a<zt.length;a++)Me[zt.charCodeAt(a)]=a;const Ea=a=>{let e=a.length*.75,t=a.length,i,s=0,n,o,d,m;a[a.length-1]==="="&&(e--,a[a.length-2]==="="&&e--);const w=new ArrayBuffer(e),T=new Uint8Array(w);for(i=0;i<t;i+=4)n=Me[a.charCodeAt(i)],o=Me[a.charCodeAt(i+1)],d=Me[a.charCodeAt(i+2)],m=Me[a.charCodeAt(i+3)],T[s++]=n<<2|o>>4,T[s++]=(o&15)<<4|d>>2,T[s++]=(d&3)<<6|m&63;return w},wa=typeof ArrayBuffer=="function",Lt=(a,e)=>{if(typeof a!="string")return{type:"message",data:ta(a,e)};const t=a.charAt(0);return t==="b"?{type:"message",data:Ca(a.substring(1),e)}:Ze[t]?a.length>1?{type:Ze[t],data:a.substring(1)}:{type:Ze[t]}:ft},Ca=(a,e)=>{if(wa){const t=Ea(a);return ta(t,e)}else return{base64:!0,data:a}},ta=(a,e)=>e==="blob"?a instanceof Blob?a:new Blob([a]):a instanceof ArrayBuffer?a:a.buffer,aa="",Sa=(a,e)=>{const t=a.length,i=new Array(t);let s=0;a.forEach((n,o)=>{Dt(n,!1,d=>{i[o]=d,++s===t&&e(i.join(aa))})})},Aa=(a,e)=>{const t=a.split(aa),i=[];for(let s=0;s<t.length;s++){const n=Lt(t[s],e);if(i.push(n),n.type==="error")break}return i};function Ia(){return new TransformStream({transform(a,e){ba(a,t=>{const i=t.length;let s;if(i<126)s=new Uint8Array(1),new DataView(s.buffer).setUint8(0,i);else if(i<65536){s=new Uint8Array(3);const n=new DataView(s.buffer);n.setUint8(0,126),n.setUint16(1,i)}else{s=new Uint8Array(9);const n=new DataView(s.buffer);n.setUint8(0,127),n.setBigUint64(1,BigInt(i))}a.data&&typeof a.data!="string"&&(s[0]|=128),e.enqueue(s),e.enqueue(t)})}})}let ct;function Je(a){return a.reduce((e,t)=>e+t.length,0)}function Ke(a,e){if(a[0].length===e)return a.shift();const t=new Uint8Array(e);let i=0;for(let s=0;s<e;s++)t[s]=a[0][i++],i===a[0].length&&(a.shift(),i=0);return a.length&&i<a[0].length&&(a[0]=a[0].slice(i)),t}function Ta(a,e){ct||(ct=new TextDecoder);const t=[];let i=0,s=-1,n=!1;return new TransformStream({transform(o,d){for(t.push(o);;){if(i===0){if(Je(t)<1)break;const m=Ke(t,1);n=(m[0]&128)===128,s=m[0]&127,s<126?i=3:s===126?i=1:i=2}else if(i===1){if(Je(t)<2)break;const m=Ke(t,2);s=new DataView(m.buffer,m.byteOffset,m.length).getUint16(0),i=3}else if(i===2){if(Je(t)<8)break;const m=Ke(t,8),w=new DataView(m.buffer,m.byteOffset,m.length),T=w.getUint32(0);if(T>Math.pow(2,21)-1){d.enqueue(ft);break}s=T*Math.pow(2,32)+w.getUint32(4),i=3}else{if(Je(t)<s)break;const m=Ke(t,s);d.enqueue(Lt(n?m:ct.decode(m),e)),i=0}if(s===0||s>a){d.enqueue(ft);break}}}})}const ia=4;function B(a){if(a)return ka(a)}function ka(a){for(var e in B.prototype)a[e]=B.prototype[e];return a}B.prototype.on=B.prototype.addEventListener=function(a,e){return this._callbacks=this._callbacks||{},(this._callbacks["$"+a]=this._callbacks["$"+a]||[]).push(e),this};B.prototype.once=function(a,e){function t(){this.off(a,t),e.apply(this,arguments)}return t.fn=e,this.on(a,t),this};B.prototype.off=B.prototype.removeListener=B.prototype.removeAllListeners=B.prototype.removeEventListener=function(a,e){if(this._callbacks=this._callbacks||{},arguments.length==0)return this._callbacks={},this;var t=this._callbacks["$"+a];if(!t)return this;if(arguments.length==1)return delete this._callbacks["$"+a],this;for(var i,s=0;s<t.length;s++)if(i=t[s],i===e||i.fn===e){t.splice(s,1);break}return t.length===0&&delete this._callbacks["$"+a],this};B.prototype.emit=function(a){this._callbacks=this._callbacks||{};for(var e=new Array(arguments.length-1),t=this._callbacks["$"+a],i=1;i<arguments.length;i++)e[i-1]=arguments[i];if(t){t=t.slice(0);for(var i=0,s=t.length;i<s;++i)t[i].apply(this,e)}return this};B.prototype.emitReserved=B.prototype.emit;B.prototype.listeners=function(a){return this._callbacks=this._callbacks||{},this._callbacks["$"+a]||[]};B.prototype.hasListeners=function(a){return!!this.listeners(a).length};const ot=typeof Promise=="function"&&typeof Promise.resolve=="function"?e=>Promise.resolve().then(e):(e,t)=>t(e,0),j=typeof self<"u"?self:typeof window<"u"?window:Function("return this")(),Ba="arraybuffer";function sa(a,...e){return e.reduce((t,i)=>(a.hasOwnProperty(i)&&(t[i]=a[i]),t),{})}const Da=j.setTimeout,La=j.clearTimeout;function rt(a,e){e.useNativeTimers?(a.setTimeoutFn=Da.bind(j),a.clearTimeoutFn=La.bind(j)):(a.setTimeoutFn=j.setTimeout.bind(j),a.clearTimeoutFn=j.clearTimeout.bind(j))}const xa=1.33;function Na(a){return typeof a=="string"?Ra(a):Math.ceil((a.byteLength||a.size)*xa)}function Ra(a){let e=0,t=0;for(let i=0,s=a.length;i<s;i++)e=a.charCodeAt(i),e<128?t+=1:e<2048?t+=2:e<55296||e>=57344?t+=3:(i++,t+=4);return t}function oa(){return Date.now().toString(36).substring(3)+Math.random().toString(36).substring(2,5)}function Pa(a){let e="";for(let t in a)a.hasOwnProperty(t)&&(e.length&&(e+="&"),e+=encodeURIComponent(t)+"="+encodeURIComponent(a[t]));return e}function $a(a){let e={},t=a.split("&");for(let i=0,s=t.length;i<s;i++){let n=t[i].split("=");e[decodeURIComponent(n[0])]=decodeURIComponent(n[1])}return e}class Oa extends Error{constructor(e,t,i){super(e),this.description=t,this.context=i,this.type="TransportError"}}class xt extends B{constructor(e){super(),this.writable=!1,rt(this,e),this.opts=e,this.query=e.query,this.socket=e.socket,this.supportsBinary=!e.forceBase64}onError(e,t,i){return super.emitReserved("error",new Oa(e,t,i)),this}open(){return this.readyState="opening",this.doOpen(),this}close(){return(this.readyState==="opening"||this.readyState==="open")&&(this.doClose(),this.onClose()),this}send(e){this.readyState==="open"&&this.write(e)}onOpen(){this.readyState="open",this.writable=!0,super.emitReserved("open")}onData(e){const t=Lt(e,this.socket.binaryType);this.onPacket(t)}onPacket(e){super.emitReserved("packet",e)}onClose(e){this.readyState="closed",super.emitReserved("close",e)}pause(e){}createUri(e,t={}){return e+"://"+this._hostname()+this._port()+this.opts.path+this._query(t)}_hostname(){const e=this.opts.hostname;return e.indexOf(":")===-1?e:"["+e+"]"}_port(){return this.opts.port&&(this.opts.secure&&Number(this.opts.port)!==443||!this.opts.secure&&Number(this.opts.port)!==80)?":"+this.opts.port:""}_query(e){const t=Pa(e);return t.length?"?"+t:""}}class Ma extends xt{constructor(){super(...arguments),this._polling=!1}get name(){return"polling"}doOpen(){this._poll()}pause(e){this.readyState="pausing";const t=()=>{this.readyState="paused",e()};if(this._polling||!this.writable){let i=0;this._polling&&(i++,this.once("pollComplete",function(){--i||t()})),this.writable||(i++,this.once("drain",function(){--i||t()}))}else t()}_poll(){this._polling=!0,this.doPoll(),this.emitReserved("poll")}onData(e){const t=i=>{if(this.readyState==="opening"&&i.type==="open"&&this.onOpen(),i.type==="close")return this.onClose({description:"transport closed by the server"}),!1;this.onPacket(i)};Aa(e,this.socket.binaryType).forEach(t),this.readyState!=="closed"&&(this._polling=!1,this.emitReserved("pollComplete"),this.readyState==="open"&&this._poll())}doClose(){const e=()=>{this.write([{type:"close"}])};this.readyState==="open"?e():this.once("open",e)}write(e){this.writable=!1,Sa(e,t=>{this.doWrite(t,()=>{this.writable=!0,this.emitReserved("drain")})})}uri(){const e=this.opts.secure?"https":"http",t=this.query||{};return this.opts.timestampRequests!==!1&&(t[this.opts.timestampParam]=oa()),!this.supportsBinary&&!t.sid&&(t.b64=1),this.createUri(e,t)}}let ra=!1;try{ra=typeof XMLHttpRequest<"u"&&"withCredentials"in new XMLHttpRequest}catch{}const _a=ra;function Va(){}class Ua extends Ma{constructor(e){if(super(e),typeof location<"u"){const t=location.protocol==="https:";let i=location.port;i||(i=t?"443":"80"),this.xd=typeof location<"u"&&e.hostname!==location.hostname||i!==e.port}}doWrite(e,t){const i=this.request({method:"POST",data:e});i.on("success",t),i.on("error",(s,n)=>{this.onError("xhr post error",s,n)})}doPoll(){const e=this.request();e.on("data",this.onData.bind(this)),e.on("error",(t,i)=>{this.onError("xhr poll error",t,i)}),this.pollXhr=e}}class Y extends B{constructor(e,t,i){super(),this.createRequest=e,rt(this,i),this._opts=i,this._method=i.method||"GET",this._uri=t,this._data=i.data!==void 0?i.data:null,this._create()}_create(){var e;const t=sa(this._opts,"agent","pfx","key","passphrase","cert","ca","ciphers","rejectUnauthorized","autoUnref");t.xdomain=!!this._opts.xd;const i=this._xhr=this.createRequest(t);try{i.open(this._method,this._uri,!0);try{if(this._opts.extraHeaders){i.setDisableHeaderCheck&&i.setDisableHeaderCheck(!0);for(let s in this._opts.extraHeaders)this._opts.extraHeaders.hasOwnProperty(s)&&i.setRequestHeader(s,this._opts.extraHeaders[s])}}catch{}if(this._method==="POST")try{i.setRequestHeader("Content-type","text/plain;charset=UTF-8")}catch{}try{i.setRequestHeader("Accept","*/*")}catch{}(e=this._opts.cookieJar)===null||e===void 0||e.addCookies(i),"withCredentials"in i&&(i.withCredentials=this._opts.withCredentials),this._opts.requestTimeout&&(i.timeout=this._opts.requestTimeout),i.onreadystatechange=()=>{var s;i.readyState===3&&((s=this._opts.cookieJar)===null||s===void 0||s.parseCookies(i.getResponseHeader("set-cookie"))),i.readyState===4&&(i.status===200||i.status===1223?this._onLoad():this.setTimeoutFn(()=>{this._onError(typeof i.status=="number"?i.status:0)},0))},i.send(this._data)}catch(s){this.setTimeoutFn(()=>{this._onError(s)},0);return}typeof document<"u"&&(this._index=Y.requestsCount++,Y.requests[this._index]=this)}_onError(e){this.emitReserved("error",e,this._xhr),this._cleanup(!0)}_cleanup(e){if(!(typeof this._xhr>"u"||this._xhr===null)){if(this._xhr.onreadystatechange=Va,e)try{this._xhr.abort()}catch{}typeof document<"u"&&delete Y.requests[this._index],this._xhr=null}}_onLoad(){const e=this._xhr.responseText;e!==null&&(this.emitReserved("data",e),this.emitReserved("success"),this._cleanup())}abort(){this._cleanup()}}Y.requestsCount=0;Y.requests={};if(typeof document<"u"){if(typeof attachEvent=="function")attachEvent("onunload",Wt);else if(typeof addEventListener=="function"){const a="onpagehide"in j?"pagehide":"unload";addEventListener(a,Wt,!1)}}function Wt(){for(let a in Y.requests)Y.requests.hasOwnProperty(a)&&Y.requests[a].abort()}const qa=(function(){const a=na({xdomain:!1});return a&&a.responseType!==null})();class ja extends Ua{constructor(e){super(e);const t=e&&e.forceBase64;this.supportsBinary=qa&&!t}request(e={}){return Object.assign(e,{xd:this.xd},this.opts),new Y(na,this.uri(),e)}}function na(a){const e=a.xdomain;try{if(typeof XMLHttpRequest<"u"&&(!e||_a))return new XMLHttpRequest}catch{}if(!e)try{return new j[["Active"].concat("Object").join("X")]("Microsoft.XMLHTTP")}catch{}}const la=typeof navigator<"u"&&typeof navigator.product=="string"&&navigator.product.toLowerCase()==="reactnative";class Fa extends xt{get name(){return"websocket"}doOpen(){const e=this.uri(),t=this.opts.protocols,i=la?{}:sa(this.opts,"agent","perMessageDeflate","pfx","key","passphrase","cert","ca","ciphers","rejectUnauthorized","localAddress","protocolVersion","origin","maxPayload","family","checkServerIdentity");this.opts.extraHeaders&&(i.headers=this.opts.extraHeaders);try{this.ws=this.createSocket(e,t,i)}catch(s){return this.emitReserved("error",s)}this.ws.binaryType=this.socket.binaryType,this.addEventListeners()}addEventListeners(){this.ws.onopen=()=>{this.opts.autoUnref&&this.ws._socket.unref(),this.onOpen()},this.ws.onclose=e=>this.onClose({description:"websocket connection closed",context:e}),this.ws.onmessage=e=>this.onData(e.data),this.ws.onerror=e=>this.onError("websocket error",e)}write(e){this.writable=!1;for(let t=0;t<e.length;t++){const i=e[t],s=t===e.length-1;Dt(i,this.supportsBinary,n=>{try{this.doWrite(i,n)}catch{}s&&ot(()=>{this.writable=!0,this.emitReserved("drain")},this.setTimeoutFn)})}}doClose(){typeof this.ws<"u"&&(this.ws.onerror=()=>{},this.ws.close(),this.ws=null)}uri(){const e=this.opts.secure?"wss":"ws",t=this.query||{};return this.opts.timestampRequests&&(t[this.opts.timestampParam]=oa()),this.supportsBinary||(t.b64=1),this.createUri(e,t)}}const dt=j.WebSocket||j.MozWebSocket;class Ga extends Fa{createSocket(e,t,i){return la?new dt(e,t,i):t?new dt(e,t):new dt(e)}doWrite(e,t){this.ws.send(t)}}class Ha extends xt{get name(){return"webtransport"}doOpen(){try{this._transport=new WebTransport(this.createUri("https"),this.opts.transportOptions[this.name])}catch(e){return this.emitReserved("error",e)}this._transport.closed.then(()=>{this.onClose()}).catch(e=>{this.onError("webtransport error",e)}),this._transport.ready.then(()=>{this._transport.createBidirectionalStream().then(e=>{const t=Ta(Number.MAX_SAFE_INTEGER,this.socket.binaryType),i=e.readable.pipeThrough(t).getReader(),s=Ia();s.readable.pipeTo(e.writable),this._writer=s.writable.getWriter();const n=()=>{i.read().then(({done:d,value:m})=>{d||(this.onPacket(m),n())}).catch(d=>{})};n();const o={type:"open"};this.query.sid&&(o.data=`{"sid":"${this.query.sid}"}`),this._writer.write(o).then(()=>this.onOpen())})})}write(e){this.writable=!1;for(let t=0;t<e.length;t++){const i=e[t],s=t===e.length-1;this._writer.write(i).then(()=>{s&&ot(()=>{this.writable=!0,this.emitReserved("drain")},this.setTimeoutFn)})}}doClose(){var e;(e=this._transport)===null||e===void 0||e.close()}}const za={websocket:Ga,webtransport:Ha,polling:ja},Wa=/^(?:(?![^:@\/?#]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@\/?#]*)(?::([^:@\/?#]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/,Ja=["source","protocol","authority","userInfo","user","password","host","port","relative","path","directory","file","query","anchor"];function yt(a){if(a.length>8e3)throw"URI too long";const e=a,t=a.indexOf("["),i=a.indexOf("]");t!=-1&&i!=-1&&(a=a.substring(0,t)+a.substring(t,i).replace(/:/g,";")+a.substring(i,a.length));let s=Wa.exec(a||""),n={},o=14;for(;o--;)n[Ja[o]]=s[o]||"";return t!=-1&&i!=-1&&(n.source=e,n.host=n.host.substring(1,n.host.length-1).replace(/;/g,":"),n.authority=n.authority.replace("[","").replace("]","").replace(/;/g,":"),n.ipv6uri=!0),n.pathNames=Ka(n,n.path),n.queryKey=Ya(n,n.query),n}function Ka(a,e){const t=/\/{2,9}/g,i=e.replace(t,"/").split("/");return(e.slice(0,1)=="/"||e.length===0)&&i.splice(0,1),e.slice(-1)=="/"&&i.splice(i.length-1,1),i}function Ya(a,e){const t={};return e.replace(/(?:^|&)([^&=]*)=?([^&]*)/g,function(i,s,n){s&&(t[s]=n)}),t}const ht=typeof addEventListener=="function"&&typeof removeEventListener=="function",Qe=[];ht&&addEventListener("offline",()=>{Qe.forEach(a=>a())},!1);class le extends B{constructor(e,t){if(super(),this.binaryType=Ba,this.writeBuffer=[],this._prevBufferLen=0,this._pingInterval=-1,this._pingTimeout=-1,this._maxPayload=-1,this._pingTimeoutTime=1/0,e&&typeof e=="object"&&(t=e,e=null),e){const i=yt(e);t.hostname=i.host,t.secure=i.protocol==="https"||i.protocol==="wss",t.port=i.port,i.query&&(t.query=i.query)}else t.host&&(t.hostname=yt(t.host).host);rt(this,t),this.secure=t.secure!=null?t.secure:typeof location<"u"&&location.protocol==="https:",t.hostname&&!t.port&&(t.port=this.secure?"443":"80"),this.hostname=t.hostname||(typeof location<"u"?location.hostname:"localhost"),this.port=t.port||(typeof location<"u"&&location.port?location.port:this.secure?"443":"80"),this.transports=[],this._transportsByName={},t.transports.forEach(i=>{const s=i.prototype.name;this.transports.push(s),this._transportsByName[s]=i}),this.opts=Object.assign({path:"/engine.io",agent:!1,withCredentials:!1,upgrade:!0,timestampParam:"t",rememberUpgrade:!1,addTrailingSlash:!0,rejectUnauthorized:!0,perMessageDeflate:{threshold:1024},transportOptions:{},closeOnBeforeunload:!1},t),this.opts.path=this.opts.path.replace(/\/$/,"")+(this.opts.addTrailingSlash?"/":""),typeof this.opts.query=="string"&&(this.opts.query=$a(this.opts.query)),ht&&(this.opts.closeOnBeforeunload&&(this._beforeunloadEventListener=()=>{this.transport&&(this.transport.removeAllListeners(),this.transport.close())},addEventListener("beforeunload",this._beforeunloadEventListener,!1)),this.hostname!=="localhost"&&(this._offlineEventListener=()=>{this._onClose("transport close",{description:"network connection lost"})},Qe.push(this._offlineEventListener))),this.opts.withCredentials&&(this._cookieJar=void 0),this._open()}createTransport(e){const t=Object.assign({},this.opts.query);t.EIO=ia,t.transport=e,this.id&&(t.sid=this.id);const i=Object.assign({},this.opts,{query:t,socket:this,hostname:this.hostname,secure:this.secure,port:this.port},this.opts.transportOptions[e]);return new this._transportsByName[e](i)}_open(){if(this.transports.length===0){this.setTimeoutFn(()=>{this.emitReserved("error","No transports available")},0);return}const e=this.opts.rememberUpgrade&&le.priorWebsocketSuccess&&this.transports.indexOf("websocket")!==-1?"websocket":this.transports[0];this.readyState="opening";const t=this.createTransport(e);t.open(),this.setTransport(t)}setTransport(e){this.transport&&this.transport.removeAllListeners(),this.transport=e,e.on("drain",this._onDrain.bind(this)).on("packet",this._onPacket.bind(this)).on("error",this._onError.bind(this)).on("close",t=>this._onClose("transport close",t))}onOpen(){this.readyState="open",le.priorWebsocketSuccess=this.transport.name==="websocket",this.emitReserved("open"),this.flush()}_onPacket(e){if(this.readyState==="opening"||this.readyState==="open"||this.readyState==="closing")switch(this.emitReserved("packet",e),this.emitReserved("heartbeat"),e.type){case"open":this.onHandshake(JSON.parse(e.data));break;case"ping":this._sendPacket("pong"),this.emitReserved("ping"),this.emitReserved("pong"),this._resetPingTimeout();break;case"error":const t=new Error("server error");t.code=e.data,this._onError(t);break;case"message":this.emitReserved("data",e.data),this.emitReserved("message",e.data);break}}onHandshake(e){this.emitReserved("handshake",e),this.id=e.sid,this.transport.query.sid=e.sid,this._pingInterval=e.pingInterval,this._pingTimeout=e.pingTimeout,this._maxPayload=e.maxPayload,this.onOpen(),this.readyState!=="closed"&&this._resetPingTimeout()}_resetPingTimeout(){this.clearTimeoutFn(this._pingTimeoutTimer);const e=this._pingInterval+this._pingTimeout;this._pingTimeoutTime=Date.now()+e,this._pingTimeoutTimer=this.setTimeoutFn(()=>{this._onClose("ping timeout")},e),this.opts.autoUnref&&this._pingTimeoutTimer.unref()}_onDrain(){this.writeBuffer.splice(0,this._prevBufferLen),this._prevBufferLen=0,this.writeBuffer.length===0?this.emitReserved("drain"):this.flush()}flush(){if(this.readyState!=="closed"&&this.transport.writable&&!this.upgrading&&this.writeBuffer.length){const e=this._getWritablePackets();this.transport.send(e),this._prevBufferLen=e.length,this.emitReserved("flush")}}_getWritablePackets(){if(!(this._maxPayload&&this.transport.name==="polling"&&this.writeBuffer.length>1))return this.writeBuffer;let t=1;for(let i=0;i<this.writeBuffer.length;i++){const s=this.writeBuffer[i].data;if(s&&(t+=Na(s)),i>0&&t>this._maxPayload)return this.writeBuffer.slice(0,i);t+=2}return this.writeBuffer}_hasPingExpired(){if(!this._pingTimeoutTime)return!0;const e=Date.now()>this._pingTimeoutTime;return e&&(this._pingTimeoutTime=0,ot(()=>{this._onClose("ping timeout")},this.setTimeoutFn)),e}write(e,t,i){return this._sendPacket("message",e,t,i),this}send(e,t,i){return this._sendPacket("message",e,t,i),this}_sendPacket(e,t,i,s){if(typeof t=="function"&&(s=t,t=void 0),typeof i=="function"&&(s=i,i=null),this.readyState==="closing"||this.readyState==="closed")return;i=i||{},i.compress=i.compress!==!1;const n={type:e,data:t,options:i};this.emitReserved("packetCreate",n),this.writeBuffer.push(n),s&&this.once("flush",s),this.flush()}close(){const e=()=>{this._onClose("forced close"),this.transport.close()},t=()=>{this.off("upgrade",t),this.off("upgradeError",t),e()},i=()=>{this.once("upgrade",t),this.once("upgradeError",t)};return(this.readyState==="opening"||this.readyState==="open")&&(this.readyState="closing",this.writeBuffer.length?this.once("drain",()=>{this.upgrading?i():e()}):this.upgrading?i():e()),this}_onError(e){if(le.priorWebsocketSuccess=!1,this.opts.tryAllTransports&&this.transports.length>1&&this.readyState==="opening")return this.transports.shift(),this._open();this.emitReserved("error",e),this._onClose("transport error",e)}_onClose(e,t){if(this.readyState==="opening"||this.readyState==="open"||this.readyState==="closing"){if(this.clearTimeoutFn(this._pingTimeoutTimer),this.transport.removeAllListeners("close"),this.transport.close(),this.transport.removeAllListeners(),ht&&(this._beforeunloadEventListener&&removeEventListener("beforeunload",this._beforeunloadEventListener,!1),this._offlineEventListener)){const i=Qe.indexOf(this._offlineEventListener);i!==-1&&Qe.splice(i,1)}this.readyState="closed",this.id=null,this.emitReserved("close",e,t),this.writeBuffer=[],this._prevBufferLen=0}}}le.protocol=ia;class Xa extends le{constructor(){super(...arguments),this._upgrades=[]}onOpen(){if(super.onOpen(),this.readyState==="open"&&this.opts.upgrade)for(let e=0;e<this._upgrades.length;e++)this._probe(this._upgrades[e])}_probe(e){let t=this.createTransport(e),i=!1;le.priorWebsocketSuccess=!1;const s=()=>{i||(t.send([{type:"ping",data:"probe"}]),t.once("packet",p=>{if(!i)if(p.type==="pong"&&p.data==="probe"){if(this.upgrading=!0,this.emitReserved("upgrading",t),!t)return;le.priorWebsocketSuccess=t.name==="websocket",this.transport.pause(()=>{i||this.readyState!=="closed"&&(T(),this.setTransport(t),t.send([{type:"upgrade"}]),this.emitReserved("upgrade",t),t=null,this.upgrading=!1,this.flush())})}else{const E=new Error("probe error");E.transport=t.name,this.emitReserved("upgradeError",E)}}))};function n(){i||(i=!0,T(),t.close(),t=null)}const o=p=>{const E=new Error("probe error: "+p);E.transport=t.name,n(),this.emitReserved("upgradeError",E)};function d(){o("transport closed")}function m(){o("socket closed")}function w(p){t&&p.name!==t.name&&n()}const T=()=>{t.removeListener("open",s),t.removeListener("error",o),t.removeListener("close",d),this.off("close",m),this.off("upgrading",w)};t.once("open",s),t.once("error",o),t.once("close",d),this.once("close",m),this.once("upgrading",w),this._upgrades.indexOf("webtransport")!==-1&&e!=="webtransport"?this.setTimeoutFn(()=>{i||t.open()},200):t.open()}onHandshake(e){this._upgrades=this._filterUpgrades(e.upgrades),super.onHandshake(e)}_filterUpgrades(e){const t=[];for(let i=0;i<e.length;i++)~this.transports.indexOf(e[i])&&t.push(e[i]);return t}}let Za=class extends Xa{constructor(e,t={}){const i=typeof e=="object",s=i?{...e}:{...t};(!s.transports||s.transports&&typeof s.transports[0]=="string")&&(s.transports=(s.transports||["polling","websocket","webtransport"]).map(n=>za[n]).filter(n=>!!n)),super(i?s:e,s)}};function Qa(a,e="",t){let i=a;t=t||typeof location<"u"&&location,a==null&&(a=t.protocol+"//"+t.host),typeof a=="string"&&(a.charAt(0)==="/"&&(a.charAt(1)==="/"?a=t.protocol+a:a=t.host+a),/^(https?|wss?):\/\//.test(a)||(typeof t<"u"?a=t.protocol+"//"+a:a="https://"+a),i=yt(a)),i.port||(/^(http|ws)$/.test(i.protocol)?i.port="80":/^(http|ws)s$/.test(i.protocol)&&(i.port="443")),i.path=i.path||"/";const n=i.host.indexOf(":")!==-1?"["+i.host+"]":i.host;return i.id=i.protocol+"://"+n+":"+i.port+e,i.href=i.protocol+"://"+n+(t&&t.port===i.port?"":":"+i.port),i}const ei=typeof ArrayBuffer=="function",ti=a=>typeof ArrayBuffer.isView=="function"?ArrayBuffer.isView(a):a.buffer instanceof ArrayBuffer,ca=Object.prototype.toString,ai=typeof Blob=="function"||typeof Blob<"u"&&ca.call(Blob)==="[object BlobConstructor]",ii=typeof File=="function"||typeof File<"u"&&ca.call(File)==="[object FileConstructor]";function Nt(a){return ei&&(a instanceof ArrayBuffer||ti(a))||ai&&a instanceof Blob||ii&&a instanceof File}function et(a,e){if(!a||typeof a!="object")return!1;if(Array.isArray(a)){for(let t=0,i=a.length;t<i;t++)if(et(a[t]))return!0;return!1}if(Nt(a))return!0;if(a.toJSON&&typeof a.toJSON=="function"&&arguments.length===1)return et(a.toJSON(),!0);for(const t in a)if(Object.prototype.hasOwnProperty.call(a,t)&&et(a[t]))return!0;return!1}function si(a){const e=[],t=a.data,i=a;return i.data=gt(t,e),i.attachments=e.length,{packet:i,buffers:e}}function gt(a,e){if(!a)return a;if(Nt(a)){const t={_placeholder:!0,num:e.length};return e.push(a),t}else if(Array.isArray(a)){const t=new Array(a.length);for(let i=0;i<a.length;i++)t[i]=gt(a[i],e);return t}else if(typeof a=="object"&&!(a instanceof Date)){const t={};for(const i in a)Object.prototype.hasOwnProperty.call(a,i)&&(t[i]=gt(a[i],e));return t}return a}function oi(a,e){return a.data=bt(a.data,e),delete a.attachments,a}function bt(a,e){if(!a)return a;if(a&&a._placeholder===!0){if(typeof a.num=="number"&&a.num>=0&&a.num<e.length)return e[a.num];throw new Error("illegal attachments")}else if(Array.isArray(a))for(let t=0;t<a.length;t++)a[t]=bt(a[t],e);else if(typeof a=="object")for(const t in a)Object.prototype.hasOwnProperty.call(a,t)&&(a[t]=bt(a[t],e));return a}const ri=["connect","connect_error","disconnect","disconnecting","newListener","removeListener"];var h;(function(a){a[a.CONNECT=0]="CONNECT",a[a.DISCONNECT=1]="DISCONNECT",a[a.EVENT=2]="EVENT",a[a.ACK=3]="ACK",a[a.CONNECT_ERROR=4]="CONNECT_ERROR",a[a.BINARY_EVENT=5]="BINARY_EVENT",a[a.BINARY_ACK=6]="BINARY_ACK"})(h||(h={}));class ni{constructor(e){this.replacer=e}encode(e){return(e.type===h.EVENT||e.type===h.ACK)&&et(e)?this.encodeAsBinary({type:e.type===h.EVENT?h.BINARY_EVENT:h.BINARY_ACK,nsp:e.nsp,data:e.data,id:e.id}):[this.encodeAsString(e)]}encodeAsString(e){let t=""+e.type;return(e.type===h.BINARY_EVENT||e.type===h.BINARY_ACK)&&(t+=e.attachments+"-"),e.nsp&&e.nsp!=="/"&&(t+=e.nsp+","),e.id!=null&&(t+=e.id),e.data!=null&&(t+=JSON.stringify(e.data,this.replacer)),t}encodeAsBinary(e){const t=si(e),i=this.encodeAsString(t.packet),s=t.buffers;return s.unshift(i),s}}class Rt extends B{constructor(e){super(),this.opts=Object.assign({reviver:void 0,maxAttachments:10},typeof e=="function"?{reviver:e}:e)}add(e){let t;if(typeof e=="string"){if(this.reconstructor)throw new Error("got plaintext data when reconstructing a packet");t=this.decodeString(e);const i=t.type===h.BINARY_EVENT;i||t.type===h.BINARY_ACK?(t.type=i?h.EVENT:h.ACK,this.reconstructor=new li(t),t.attachments===0&&super.emitReserved("decoded",t)):super.emitReserved("decoded",t)}else if(Nt(e)||e.base64)if(this.reconstructor)t=this.reconstructor.takeBinaryData(e),t&&(this.reconstructor=null,super.emitReserved("decoded",t));else throw new Error("got binary data when not reconstructing a packet");else throw new Error("Unknown type: "+e)}decodeString(e){let t=0;const i={type:Number(e.charAt(0))};if(h[i.type]===void 0)throw new Error("unknown packet type "+i.type);if(i.type===h.BINARY_EVENT||i.type===h.BINARY_ACK){const n=t+1;for(;e.charAt(++t)!=="-"&&t!=e.length;);const o=e.substring(n,t);if(o!=Number(o)||e.charAt(t)!=="-")throw new Error("Illegal attachments");const d=Number(o);if(!ci(d)||d<0)throw new Error("Illegal attachments");if(d>this.opts.maxAttachments)throw new Error("too many attachments");i.attachments=d}if(e.charAt(t+1)==="/"){const n=t+1;for(;++t&&!(e.charAt(t)===","||t===e.length););i.nsp=e.substring(n,t)}else i.nsp="/";const s=e.charAt(t+1);if(s!==""&&Number(s)==s){const n=t+1;for(;++t;){const o=e.charAt(t);if(o==null||Number(o)!=o){--t;break}if(t===e.length)break}i.id=Number(e.substring(n,t+1))}if(e.charAt(++t)){const n=this.tryParse(e.substr(t));if(Rt.isPayloadValid(i.type,n))i.data=n;else throw new Error("invalid payload")}return i}tryParse(e){try{return JSON.parse(e,this.opts.reviver)}catch{return!1}}static isPayloadValid(e,t){switch(e){case h.CONNECT:return Jt(t);case h.DISCONNECT:return t===void 0;case h.CONNECT_ERROR:return typeof t=="string"||Jt(t);case h.EVENT:case h.BINARY_EVENT:return Array.isArray(t)&&(typeof t[0]=="number"||typeof t[0]=="string"&&ri.indexOf(t[0])===-1);case h.ACK:case h.BINARY_ACK:return Array.isArray(t)}}destroy(){this.reconstructor&&(this.reconstructor.finishedReconstruction(),this.reconstructor=null)}}class li{constructor(e){this.packet=e,this.buffers=[],this.reconPack=e}takeBinaryData(e){if(this.buffers.push(e),this.buffers.length===this.reconPack.attachments){const t=oi(this.reconPack,this.buffers);return this.finishedReconstruction(),t}return null}finishedReconstruction(){this.reconPack=null,this.buffers=[]}}const ci=Number.isInteger||function(a){return typeof a=="number"&&isFinite(a)&&Math.floor(a)===a};function Jt(a){return Object.prototype.toString.call(a)==="[object Object]"}const di=Object.freeze(Object.defineProperty({__proto__:null,Decoder:Rt,Encoder:ni,get PacketType(){return h}},Symbol.toStringTag,{value:"Module"}));function H(a,e,t){return a.on(e,t),function(){a.off(e,t)}}const ui=Object.freeze({connect:1,connect_error:1,disconnect:1,disconnecting:1,newListener:1,removeListener:1});class da extends B{constructor(e,t,i){super(),this.connected=!1,this.recovered=!1,this.receiveBuffer=[],this.sendBuffer=[],this._queue=[],this._queueSeq=0,this.ids=0,this.acks={},this.flags={},this.io=e,this.nsp=t,i&&i.auth&&(this.auth=i.auth),this._opts=Object.assign({},i),this.io._autoConnect&&this.open()}get disconnected(){return!this.connected}subEvents(){if(this.subs)return;const e=this.io;this.subs=[H(e,"open",this.onopen.bind(this)),H(e,"packet",this.onpacket.bind(this)),H(e,"error",this.onerror.bind(this)),H(e,"close",this.onclose.bind(this))]}get active(){return!!this.subs}connect(){return this.connected?this:(this.subEvents(),this.io._reconnecting||this.io.open(),this.io._readyState==="open"&&this.onopen(),this)}open(){return this.connect()}send(...e){return e.unshift("message"),this.emit.apply(this,e),this}emit(e,...t){var i,s,n;if(ui.hasOwnProperty(e))throw new Error('"'+e.toString()+'" is a reserved event name');if(t.unshift(e),this._opts.retries&&!this.flags.fromQueue&&!this.flags.volatile)return this._addToQueue(t),this;const o={type:h.EVENT,data:t};if(o.options={},o.options.compress=this.flags.compress!==!1,typeof t[t.length-1]=="function"){const T=this.ids++,p=t.pop();this._registerAckCallback(T,p),o.id=T}const d=(s=(i=this.io.engine)===null||i===void 0?void 0:i.transport)===null||s===void 0?void 0:s.writable,m=this.connected&&!(!((n=this.io.engine)===null||n===void 0)&&n._hasPingExpired());return this.flags.volatile&&!d||(m?(this.notifyOutgoingListeners(o),this.packet(o)):this.sendBuffer.push(o)),this.flags={},this}_registerAckCallback(e,t){var i;const s=(i=this.flags.timeout)!==null&&i!==void 0?i:this._opts.ackTimeout;if(s===void 0){this.acks[e]=t;return}const n=this.io.setTimeoutFn(()=>{delete this.acks[e];for(let d=0;d<this.sendBuffer.length;d++)this.sendBuffer[d].id===e&&this.sendBuffer.splice(d,1);t.call(this,new Error("operation has timed out"))},s),o=(...d)=>{this.io.clearTimeoutFn(n),t.apply(this,d)};o.withError=!0,this.acks[e]=o}emitWithAck(e,...t){return new Promise((i,s)=>{const n=(o,d)=>o?s(o):i(d);n.withError=!0,t.push(n),this.emit(e,...t)})}_addToQueue(e){let t;typeof e[e.length-1]=="function"&&(t=e.pop());const i={id:this._queueSeq++,tryCount:0,pending:!1,args:e,flags:Object.assign({fromQueue:!0},this.flags)};e.push((s,...n)=>(this._queue[0],s!==null?i.tryCount>this._opts.retries&&(this._queue.shift(),t&&t(s)):(this._queue.shift(),t&&t(null,...n)),i.pending=!1,this._drainQueue())),this._queue.push(i),this._drainQueue()}_drainQueue(e=!1){if(!this.connected||this._queue.length===0)return;const t=this._queue[0];t.pending&&!e||(t.pending=!0,t.tryCount++,this.flags=t.flags,this.emit.apply(this,t.args))}packet(e){e.nsp=this.nsp,this.io._packet(e)}onopen(){typeof this.auth=="function"?this.auth(e=>{this._sendConnectPacket(e)}):this._sendConnectPacket(this.auth)}_sendConnectPacket(e){this.packet({type:h.CONNECT,data:this._pid?Object.assign({pid:this._pid,offset:this._lastOffset},e):e})}onerror(e){this.connected||this.emitReserved("connect_error",e)}onclose(e,t){this.connected=!1,delete this.id,this.emitReserved("disconnect",e,t),this._clearAcks()}_clearAcks(){Object.keys(this.acks).forEach(e=>{if(!this.sendBuffer.some(i=>String(i.id)===e)){const i=this.acks[e];delete this.acks[e],i.withError&&i.call(this,new Error("socket has been disconnected"))}})}onpacket(e){if(e.nsp===this.nsp)switch(e.type){case h.CONNECT:e.data&&e.data.sid?this.onconnect(e.data.sid,e.data.pid):this.emitReserved("connect_error",new Error("It seems you are trying to reach a Socket.IO server in v2.x with a v3.x client, but they are not compatible (more information here: https://socket.io/docs/v3/migrating-from-2-x-to-3-0/)"));break;case h.EVENT:case h.BINARY_EVENT:this.onevent(e);break;case h.ACK:case h.BINARY_ACK:this.onack(e);break;case h.DISCONNECT:this.ondisconnect();break;case h.CONNECT_ERROR:this.destroy();const i=new Error(e.data.message);i.data=e.data.data,this.emitReserved("connect_error",i);break}}onevent(e){const t=e.data||[];e.id!=null&&t.push(this.ack(e.id)),this.connected?this.emitEvent(t):this.receiveBuffer.push(Object.freeze(t))}emitEvent(e){if(this._anyListeners&&this._anyListeners.length){const t=this._anyListeners.slice();for(const i of t)i.apply(this,e)}super.emit.apply(this,e),this._pid&&e.length&&typeof e[e.length-1]=="string"&&(this._lastOffset=e[e.length-1])}ack(e){const t=this;let i=!1;return function(...s){i||(i=!0,t.packet({type:h.ACK,id:e,data:s}))}}onack(e){const t=this.acks[e.id];typeof t=="function"&&(delete this.acks[e.id],t.withError&&e.data.unshift(null),t.apply(this,e.data))}onconnect(e,t){this.id=e,this.recovered=t&&this._pid===t,this._pid=t,this.connected=!0,this.emitBuffered(),this._drainQueue(!0),this.emitReserved("connect")}emitBuffered(){this.receiveBuffer.forEach(e=>this.emitEvent(e)),this.receiveBuffer=[],this.sendBuffer.forEach(e=>{this.notifyOutgoingListeners(e),this.packet(e)}),this.sendBuffer=[]}ondisconnect(){this.destroy(),this.onclose("io server disconnect")}destroy(){this.subs&&(this.subs.forEach(e=>e()),this.subs=void 0),this.io._destroy(this)}disconnect(){return this.connected&&this.packet({type:h.DISCONNECT}),this.destroy(),this.connected&&this.onclose("io client disconnect"),this}close(){return this.disconnect()}compress(e){return this.flags.compress=e,this}get volatile(){return this.flags.volatile=!0,this}timeout(e){return this.flags.timeout=e,this}onAny(e){return this._anyListeners=this._anyListeners||[],this._anyListeners.push(e),this}prependAny(e){return this._anyListeners=this._anyListeners||[],this._anyListeners.unshift(e),this}offAny(e){if(!this._anyListeners)return this;if(e){const t=this._anyListeners;for(let i=0;i<t.length;i++)if(e===t[i])return t.splice(i,1),this}else this._anyListeners=[];return this}listenersAny(){return this._anyListeners||[]}onAnyOutgoing(e){return this._anyOutgoingListeners=this._anyOutgoingListeners||[],this._anyOutgoingListeners.push(e),this}prependAnyOutgoing(e){return this._anyOutgoingListeners=this._anyOutgoingListeners||[],this._anyOutgoingListeners.unshift(e),this}offAnyOutgoing(e){if(!this._anyOutgoingListeners)return this;if(e){const t=this._anyOutgoingListeners;for(let i=0;i<t.length;i++)if(e===t[i])return t.splice(i,1),this}else this._anyOutgoingListeners=[];return this}listenersAnyOutgoing(){return this._anyOutgoingListeners||[]}notifyOutgoingListeners(e){if(this._anyOutgoingListeners&&this._anyOutgoingListeners.length){const t=this._anyOutgoingListeners.slice();for(const i of t)i.apply(this,e.data)}}}function De(a){a=a||{},this.ms=a.min||100,this.max=a.max||1e4,this.factor=a.factor||2,this.jitter=a.jitter>0&&a.jitter<=1?a.jitter:0,this.attempts=0}De.prototype.duration=function(){var a=this.ms*Math.pow(this.factor,this.attempts++);if(this.jitter){var e=Math.random(),t=Math.floor(e*this.jitter*a);a=(Math.floor(e*10)&1)==0?a-t:a+t}return Math.min(a,this.max)|0};De.prototype.reset=function(){this.attempts=0};De.prototype.setMin=function(a){this.ms=a};De.prototype.setMax=function(a){this.max=a};De.prototype.setJitter=function(a){this.jitter=a};class Et extends B{constructor(e,t){var i;super(),this.nsps={},this.subs=[],e&&typeof e=="object"&&(t=e,e=void 0),t=t||{},t.path=t.path||"/socket.io",this.opts=t,rt(this,t),this.reconnection(t.reconnection!==!1),this.reconnectionAttempts(t.reconnectionAttempts||1/0),this.reconnectionDelay(t.reconnectionDelay||1e3),this.reconnectionDelayMax(t.reconnectionDelayMax||5e3),this.randomizationFactor((i=t.randomizationFactor)!==null&&i!==void 0?i:.5),this.backoff=new De({min:this.reconnectionDelay(),max:this.reconnectionDelayMax(),jitter:this.randomizationFactor()}),this.timeout(t.timeout==null?2e4:t.timeout),this._readyState="closed",this.uri=e;const s=t.parser||di;this.encoder=new s.Encoder,this.decoder=new s.Decoder,this._autoConnect=t.autoConnect!==!1,this._autoConnect&&this.open()}reconnection(e){return arguments.length?(this._reconnection=!!e,e||(this.skipReconnect=!0),this):this._reconnection}reconnectionAttempts(e){return e===void 0?this._reconnectionAttempts:(this._reconnectionAttempts=e,this)}reconnectionDelay(e){var t;return e===void 0?this._reconnectionDelay:(this._reconnectionDelay=e,(t=this.backoff)===null||t===void 0||t.setMin(e),this)}randomizationFactor(e){var t;return e===void 0?this._randomizationFactor:(this._randomizationFactor=e,(t=this.backoff)===null||t===void 0||t.setJitter(e),this)}reconnectionDelayMax(e){var t;return e===void 0?this._reconnectionDelayMax:(this._reconnectionDelayMax=e,(t=this.backoff)===null||t===void 0||t.setMax(e),this)}timeout(e){return arguments.length?(this._timeout=e,this):this._timeout}maybeReconnectOnOpen(){!this._reconnecting&&this._reconnection&&this.backoff.attempts===0&&this.reconnect()}open(e){if(~this._readyState.indexOf("open"))return this;this.engine=new Za(this.uri,this.opts);const t=this.engine,i=this;this._readyState="opening",this.skipReconnect=!1;const s=H(t,"open",function(){i.onopen(),e&&e()}),n=d=>{this.cleanup(),this._readyState="closed",this.emitReserved("error",d),e?e(d):this.maybeReconnectOnOpen()},o=H(t,"error",n);if(this._timeout!==!1){const d=this._timeout,m=this.setTimeoutFn(()=>{s(),n(new Error("timeout")),t.close()},d);this.opts.autoUnref&&m.unref(),this.subs.push(()=>{this.clearTimeoutFn(m)})}return this.subs.push(s),this.subs.push(o),this}connect(e){return this.open(e)}onopen(){this.cleanup(),this._readyState="open",this.emitReserved("open");const e=this.engine;this.subs.push(H(e,"ping",this.onping.bind(this)),H(e,"data",this.ondata.bind(this)),H(e,"error",this.onerror.bind(this)),H(e,"close",this.onclose.bind(this)),H(this.decoder,"decoded",this.ondecoded.bind(this)))}onping(){this.emitReserved("ping")}ondata(e){try{this.decoder.add(e)}catch(t){this.onclose("parse error",t)}}ondecoded(e){ot(()=>{this.emitReserved("packet",e)},this.setTimeoutFn)}onerror(e){this.emitReserved("error",e)}socket(e,t){let i=this.nsps[e];return i?this._autoConnect&&!i.active&&i.connect():(i=new da(this,e,t),this.nsps[e]=i),i}_destroy(e){const t=Object.keys(this.nsps);for(const i of t)if(this.nsps[i].active)return;this._close()}_packet(e){const t=this.encoder.encode(e);for(let i=0;i<t.length;i++)this.engine.write(t[i],e.options)}cleanup(){this.subs.forEach(e=>e()),this.subs.length=0,this.decoder.destroy()}_close(){this.skipReconnect=!0,this._reconnecting=!1,this.onclose("forced close")}disconnect(){return this._close()}onclose(e,t){var i;this.cleanup(),(i=this.engine)===null||i===void 0||i.close(),this.backoff.reset(),this._readyState="closed",this.emitReserved("close",e,t),this._reconnection&&!this.skipReconnect&&this.reconnect()}reconnect(){if(this._reconnecting||this.skipReconnect)return this;const e=this;if(this.backoff.attempts>=this._reconnectionAttempts)this.backoff.reset(),this.emitReserved("reconnect_failed"),this._reconnecting=!1;else{const t=this.backoff.duration();this._reconnecting=!0;const i=this.setTimeoutFn(()=>{e.skipReconnect||(this.emitReserved("reconnect_attempt",e.backoff.attempts),!e.skipReconnect&&e.open(s=>{s?(e._reconnecting=!1,e.reconnect(),this.emitReserved("reconnect_error",s)):e.onreconnect()}))},t);this.opts.autoUnref&&i.unref(),this.subs.push(()=>{this.clearTimeoutFn(i)})}}onreconnect(){const e=this.backoff.attempts;this._reconnecting=!1,this.backoff.reset(),this.emitReserved("reconnect",e)}}const Oe={};function tt(a,e){typeof a=="object"&&(e=a,a=void 0),e=e||{};const t=Qa(a,e.path||"/socket.io"),i=t.source,s=t.id,n=t.path,o=Oe[s]&&n in Oe[s].nsps,d=e.forceNew||e["force new connection"]||e.multiplex===!1||o;let m;return d?m=new Et(i,e):(Oe[s]||(Oe[s]=new Et(i,e)),m=Oe[s]),t.query&&!e.query&&(e.query=t.queryKey),m.socket(t.path,e)}Object.assign(tt,{Manager:Et,Socket:da,io:tt,connect:tt});const x=window.location.origin,pi=[{title:"SERVIDORES",items:[["◈","Servidor actual",""],["⌁","Invitaciones",""],["♧","Miembros",""],["♙","Roles",""],["▣","Canales",""],["▤","Logs del servidor",""]]},{title:"COMANDOS",items:[["⚙","Comandos","»"],["✣","Slash Commands",""],["▢","Mensajes",""],["◫","Auto Respuestas",""]]},{title:"MODERACIÓN",items:[["◆","Moderación","»"],["◉","Advertencias",""],["⊗","Baneos",""],["◔","Muteos",""],["⌁","Anti Raid",""],["✦","Auto Mod",""]]},{title:"SISTEMA",items:[["▤","Logs","»"],["◷","Auditoría",""],["□","Tareas programadas",""],["▣","Backups",""],["⌘","Webhooks",""]]},{title:"CONFIGURACIÓN",items:[["⚙","Configuración","»"],["✎","Personalización",""],["⌁","Variables de entorno",""],["◇","Tokens",""],["⊙","Permisos",""],["⌘","Integraciones",""]]}],vi=pi.map(a=>`
  <div class="side-group">
    <div class="side-title">${a.title}</div>
    ${a.items.map(([e,t,i])=>`
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
<nav
  class="public-sidebar-menu"
  id="publicSidebarMenu"
>
  <button
    class="public-side-item active"
    id="publicMyServers"
    type="button"
  >
    <span class="public-side-icon">
      ▱
    </span>

    <span>
      Mis servidores
    </span>
  </button>

  <button
    class="public-side-item"
    id="publicInviteBot"
    type="button"
  >
    <span class="public-side-icon">
      ＋
    </span>

    <span>
      Invitar bot
    </span>
  </button>

  <button
    class="public-side-item"
    id="publicBotStatus"
    type="button"
  >
    <span class="public-side-icon">
      ◉
    </span>

    <span>
      Estado del bot
    </span>
  </button>

  <button
    class="public-side-item"
    id="publicSupport"
    type="button"
  >
    <span class="public-side-icon">
      ?
    </span>

    <span>
      Soporte
    </span>
  </button>

  <button
    class="public-side-item public-logout"
    id="publicLogout"
    type="button"
  >
    <span class="public-side-icon">
      ↪
    </span>

    <span>
      Cerrar sesión
    </span>
  </button>
</nav>
<div
  class="server-switcher dashboard-only"
  id="serverSwitcher"
>
  <button
    class="server-current"
    id="serverCurrent"
    type="button"
  >
    <div
      class="server-current-icon"
      id="serverCurrentIcon"
    >
      N
    </div>

    <div class="server-current-copy">
      <span>Servidor actual</span>

      <strong id="serverCurrentName">
        Cargando...
      </strong>
    </div>

    <span class="server-current-arrow">
      ⌄
    </span>
  </button>

  <div
    class="server-dropdown"
    id="serverDropdown"
  >
    <div class="server-dropdown-head">
      <strong>Tus servidores</strong>

      <span id="serverDropdownCount">
        0
      </span>
    </div>

    <div
      class="server-dropdown-list"
      id="serverDropdownList"
    >
      <div class="server-dropdown-empty">
        Cargando servidores...
      </div>
    </div>
  </div>
</div>

      <button
  class="side-item dashboard-link active dashboard-only"
>
        <span class="side-icon">⌂</span>
        <span>Dashboard</span>
        <b>⌁</b>
      </button>

    <div class="sidebar-scroll dashboard-only">
        ${vi}
      </div>

<div class="owner-card">
  <div
    class="owner-avatar"
    id="ownerAvatar"
  >
    U
  </div>

  <div class="owner-info">
    <strong id="ownerDisplayName">
      Cargando...
    </strong>

    <span id="ownerUsername">
      @discord
    </span>

    <small>
      Administrador
    </small>
  </div>

  <button
    id="ownerMenuButton"
    type="button"
  >
    ⚙
  </button>
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
<button
  class="top-profile"
  id="topProfile"
  type="button"
>
  <div
    class="profile-avatar"
    id="profileAvatar"
  >
    AM
  </div>

  <div>
    <strong id="profileDisplayName">
      Cargando...
    </strong>

    <span id="profileUsername">
      <i></i>
      Discord
    </span>
  </div>

  <b>⌄</b>
</button>
        </div>
      </header>

      <section class="welcome-row">
        <div>
         <h1>
  ¡Bienvenido de vuelta,
  <span id="welcomeUsername">
    usuario
  </span>! 👋
</h1>
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
            ${["API Discord","Base de Datos","Servidores","Web Dashboard","Sistema de Logs"].map(a=>`<div><span><i></i>${a}</span><strong>Operativo</strong></div>`).join("")}
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
            ${[["NC","Nebula Community","1.245 usuarios","89%"],["GZ","Gaming Zone","987 usuarios","75%"],["TD","Team Developers","756 usuarios","62%"],["AW","Anime World","654 usuarios","48%"],["CL","Chill Lounge","432 usuarios","35%"]].map(([a,e,t,i])=>`
              <div class="server-item">
                <div class="server-logo">${a}</div>
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
`;const mi=document.getElementById("serverSwitcher"),fi=document.getElementById("serverCurrent"),ut=document.getElementById("serverCurrentIcon"),it=document.getElementById("serverCurrentName"),Pt=document.getElementById("serverDropdown"),pt=document.getElementById("serverDropdownList"),yi=document.getElementById("serverDropdownCount"),Kt=document.getElementById("profileAvatar"),wt=document.getElementById("profileDisplayName"),Ct=document.getElementById("profileUsername"),Yt=document.getElementById("ownerAvatar"),St=document.getElementById("ownerDisplayName"),At=document.getElementById("ownerUsername");document.getElementById("welcomeUsername");let z=[],Q=localStorage.getItem("nebulaSelectedServerId")||"";function ke(a){return String(a||"N").split(/\s+/).filter(Boolean).slice(0,2).map(e=>e.charAt(0)).join("").toUpperCase()}function It(a){if(!a){it.textContent="Seleccioná un servidor",ut.textContent="N";return}it.textContent=a.name||"Servidor",a.icon?ut.innerHTML=`
      <img
        src="${a.icon}"
        alt="${a.name}"
      >
    `:ut.textContent=ke(a.name)}function $t(a){a?.id&&(Q=String(a.id),localStorage.setItem("nebulaSelectedServerId",Q),It(a),Pt.classList.remove("open"),window.dispatchEvent(new CustomEvent("nebula:server-changed",{detail:{server:a}})))}function st(){if(yi.textContent=String(z.length),z.length===0){pt.innerHTML=`
      <div class="server-dropdown-empty">
        No se encontraron servidores.
      </div>
    `,It(null);return}let a=z.find(e=>String(e.id)===String(Q));a||(a=z[0],Q=String(a.id),localStorage.setItem("nebulaSelectedServerId",Q)),pt.innerHTML=z.map(e=>{const t=String(e.id)===String(Q),i=e.icon?`<img
                 src="${e.icon}"
                 alt="${e.name}"
               >`:ke(e.name);return`
          <button
            class="server-dropdown-item ${t?"active":""}"
            data-server-id="${e.id}"
            type="button"
          >
            <span class="server-dropdown-icon">
              ${i}
            </span>

            <span class="server-dropdown-copy">
              <strong>
                ${e.name}
              </strong>

              <small>
                ${Number(e.members||e.memberCount||0).toLocaleString("es-AR")} miembros
              </small>
            </span>

            ${t?`
                  <span class="server-dropdown-check">
                    ✓
                  </span>
                `:""}
          </button>
        `}).join(""),It(a),pt.querySelectorAll("[data-server-id]").forEach(e=>{e.addEventListener("click",()=>{const t=z.find(i=>String(i.id)===String(e.dataset.serverId));$t(t),st(),t?.botPresent&&ce(t.id)})})}let O=null,Tt={name:"Nebula Bot",avatar:""};async function hi(){const a=new AbortController,e=setTimeout(()=>{a.abort()},1e4);try{const t=await fetch(`${x}/api/dashboard/session`,{method:"GET",headers:{Accept:"application/json"},credentials:"include",cache:"no-store",signal:a.signal}),i=await t.json();if(t.status===401||!i.authenticated){window.location.replace("/auth/dashboard");return}if(!t.ok||!i.success||!i.data)throw new Error(i.message||"No se pudo cargar la sesión.");const s=i.data;O=s.user||null,z=Array.isArray(s.guilds)?s.guilds:[],kt(O),st(),new URLSearchParams(window.location.search).get("view")==="servers"?Be():(I.innerHTML=ua,kt(O),st(),Ot())}catch(t){if(console.error("Error cargando la sesión:",t),t.name==="AbortError"){wt.textContent="Servidor sin respuesta",Ct.innerHTML="<i></i> Reintentá",St.textContent="Servidor sin respuesta",At.textContent="Recargá la página",it.textContent="Sin respuesta";return}wt.textContent="Sesión no disponible",Ct.innerHTML="<i></i> Discord",St.textContent="Sesión no disponible",At.textContent="@discord",it.textContent="Sin conexión",setTimeout(()=>{window.location.replace("/auth/dashboard")},1500)}finally{clearTimeout(e)}}function kt(a){if(!a)return;const e=a.displayName||a.globalName||a.username||"Usuario",t=a.username||"discord";wt.textContent=e,Ct.innerHTML=`
    <i></i>
    @${t}
  `,St.textContent=e,At.textContent=`@${t}`;const i=document.getElementById("welcomeUsername");if(i&&(i.textContent=e),a.avatar){const s=`
      <img
        src="${a.avatar}"
        alt="${e}"
      >
    `;Kt.innerHTML=s,Yt.innerHTML=s}else{const s=ke(e);Kt.textContent=s,Yt.textContent=s}}function Be(){document.body.classList.add("servers-selection-mode");const e=z.map(t=>{const i=ke(t.name),s=t.icon?`
              <img
                src="${t.icon}"
                alt="${t.name}"
              >
            `:`
              <span>
                ${i}
              </span>
            `,n=t.botPresent?`
              <span class="session-server-online">
                ● Bot conectado
              </span>
            `:`
              <span class="session-server-missing">
                Bot no agregado
              </span>
            `,o=t.botPresent?`
              <button
                class="session-manage-server"
                data-server-id="${t.id}"
                type="button"
              >
                Administrar
              </button>
            `:`
              <button
                class="session-invite-server"
                data-server-id="${t.id}"
                type="button"
              >
                Agregar bot
              </button>
            `;return`
          <article class="session-server-card">
            <div class="session-server-icon">
              ${s}
            </div>

            <div class="session-server-info">
              <strong>
                ${t.name}
              </strong>

              <span>
                ${t.memberCount?`${Number(t.memberCount).toLocaleString("es-AR")} miembros`:"Cantidad no disponible"}
              </span>

              ${n}
            </div>

            ${o}
          </article>
        `}).join("");I.innerHTML=`
    <div class="dynamic-page session-servers-page">
      <section class="section-header">
        <div>
          <span>
            CUENTA DE DISCORD
          </span>

          <h1>
            Mis servidores
          </h1>

          <p>
            Seleccioná un servidor que puedas administrar.
          </p>
        </div>

        <button
          id="sessionInviteBot"
          class="section-action"
          type="button"
        >
          ＋ Invitar bot
        </button>
      </section>

      <section class="session-user-summary">
        <div class="session-user-avatar">
          ${O?.avatar?`
                <img
                  src="${O.avatar}"
                  alt="${O.displayName}"
                >
              `:ke(O?.displayName)}
        </div>

        <div>
          <span>
            Sesión iniciada como
          </span>

          <strong>
            ${O?.displayName||O?.username||"Usuario"}
          </strong>

          <small>
            @${O?.username||"discord"}
          </small>
        </div>
      </section>

      <section class="session-server-list">
        ${e||`
            <div class="session-servers-empty">
              No administrás ningún servidor.
            </div>
          `}
      </section>
    </div>
  `,document.querySelectorAll(".session-manage-server").forEach(t=>{t.addEventListener("click",async()=>{const i=t.dataset.serverId,s=z.find(n=>String(n.id)===String(i));s&&($t(s),document.body.classList.remove("servers-selection-mode"),await ce(i))})}),document.querySelectorAll(".session-invite-server").forEach(t=>{t.addEventListener("click",()=>{const i=t.dataset.serverId;gi(i,t)})}),document.getElementById("sessionInviteBot")?.addEventListener("click",()=>{window.open("/auth/bot/invite","_blank","noopener,noreferrer")})}async function gi(a,e){const t=e.textContent;if(e.disabled=!0,e.textContent="Esperando autorización...",!window.open(`/auth/bot/invite?guildId=${encodeURIComponent(a)}`,"_blank","noopener,noreferrer")){window.location.href=`/auth/bot/invite?guildId=${encodeURIComponent(a)}`;return}const s=Date.now(),n=12e4,o=2500;async function d(){try{const w=await fetch(`${x}/api/servers/${encodeURIComponent(a)}`,{credentials:"include",cache:"no-store"}),T=await w.json();if(w.ok&&T.success&&T.data){clearInterval(m),e.textContent="Bot agregado ✓";const p=z.find(E=>String(E.id)===String(a));p&&(p.botPresent=!0,$t(p)),setTimeout(()=>{ce(a)},600);return}Date.now()-s>n&&(clearInterval(m),e.disabled=!1,e.textContent="Comprobar nuevamente")}catch(w){console.log("El bot todavía no aparece en el servidor:",w.message)}}const m=setInterval(d,o);d(),setTimeout(()=>{clearInterval(m),e.textContent==="Esperando autorización..."&&(e.disabled=!1,e.textContent=t)},n)}fi.addEventListener("click",a=>{a.stopPropagation(),Pt.classList.toggle("open")});document.addEventListener("click",a=>{mi.contains(a.target)||Pt.classList.remove("open")});const R=document.getElementById("toast"),ee=()=>{R.classList.add("show"),clearTimeout(window.toastTimer),window.toastTimer=setTimeout(()=>R.classList.remove("show"),2300)};document.querySelectorAll("button").forEach(a=>{a.addEventListener("click",()=>{a.id==="openWelcomeVariables"||a.id==="hamburger"||a.id==="serverCurrent"||a.id==="topProfile"||a.id==="sessionInviteBot"||a.id==="publicMyServers"||a.id==="publicInviteBot"||a.id==="publicBotStatus"||a.id==="publicSupport"||a.id==="publicLogout"||a.id==="publicDiscordSupport"||a.classList.contains("public-support-button")||a.classList.contains("server-dropdown-item")||a.classList.contains("session-invite-server")||a.classList.contains("session-manage-server")||a.classList.contains("verify-variable-button")||ee()})});document.querySelectorAll(".side-item").forEach(a=>{a.addEventListener("click",()=>{document.querySelectorAll(".side-item").forEach(e=>e.classList.remove("active")),a.classList.add("active")})});let at=null;function ge(){at&&(clearInterval(at),at=null)}document.getElementById("publicMyServers")?.addEventListener("click",()=>{ge(),Be(),window.history.replaceState({},"","/?view=servers")});document.getElementById("publicInviteBot")?.addEventListener("click",()=>{ge(),window.open("/auth/bot/invite","_blank","noopener,noreferrer")});document.getElementById("publicBotStatus")?.addEventListener("click",()=>{document.body.classList.add("servers-selection-mode"),ge(),I.innerHTML=`
        <div class="dynamic-page">
          <section class="section-header">
            <div>
              <span>
                ESTADO DEL SERVICIO
              </span>

              <h1>
                Estado del bot
              </h1>

              <p>
                Información actualizada automáticamente cada segundo.
              </p>
            </div>
          </section>

          <section class="public-status-grid">
            <article class="public-info-card">
              <span>
                CONEXIÓN
              </span>

              <strong id="liveBotConnection">
                Consultando...
              </strong>
            </article>

            <article class="public-info-card">
              <span>
                LATENCIA
              </span>

              <strong id="liveBotLatency">
                -- ms
              </strong>
            </article>

            <article class="public-info-card">
              <span>
                TIEMPO ACTIVO
              </span>

              <strong id="liveBotUptime">
                Sin datos
              </strong>
            </article>

            <article class="public-info-card">
              <span>
                ÚLTIMA ACTUALIZACIÓN
              </span>

              <strong id="liveBotUpdatedAt">
                --
              </strong>
            </article>
          </section>
        </div>
      `;async function a(){const e=document.getElementById("liveBotConnection"),t=document.getElementById("liveBotLatency"),i=document.getElementById("liveBotUptime"),s=document.getElementById("liveBotUpdatedAt");if(!e||!t||!i||!s){ge();return}try{const n=await fetch(`${x}/api/bot/status`,{method:"GET",headers:{Accept:"application/json"},cache:"no-store",credentials:"include"}),o=await n.json();if(!n.ok||!o.success)throw new Error(o.message||"No se pudo consultar el bot.");const d=o.data||{},m=d.status==="online"||d.online===!0;e.textContent=m?"En línea":"Desconectado",e.classList.toggle("live-status-online",m),e.classList.toggle("live-status-offline",!m),i.textContent=d.uptime||"Sin datos",s.textContent=new Date().toLocaleTimeString("es-AR")}catch(n){console.error("Error actualizando el estado del bot:",n),e.textContent="Sin conexión",e.classList.remove("live-status-online"),e.classList.add("live-status-offline"),s.textContent="Error"}}a(),at=setInterval(a,500)});document.getElementById("publicSupport")?.addEventListener("click",()=>{ge(),document.body.classList.add("servers-selection-mode"),I.innerHTML=`
        <div class="dynamic-page">
          <section class="section-header">
            <div>
              <span>
                AYUDA
              </span>

              <h1>
                Centro de soporte
              </h1>

              <p>
                Encontrá ayuda para configurar y administrar Nebula.
              </p>
            </div>
          </section>

          <section class="public-support-grid">
            <article class="public-info-card">
              <span>
                CONFIGURACIÓN
              </span>

              <strong>
                Primeros pasos
              </strong>

              <p>
                Elegí un servidor y presioná Administrar.
              </p>
            </article>

        <article
  class="public-info-card public-support-discord"
  id="publicDiscordSupport"
>
  <span>
    DISCORD
  </span>

  <strong>
    Nuestro servidor de Discord
  </strong>

  <p>
    Entrá para recibir ayuda, comunicar errores y hacer consultas.
  </p>

  <button
    class="public-support-button"
    type="button"
  >
    Unirme al Discord
    <b>↗</b>
  </button>
</article>

            <article class="public-info-card">
              <span>
                SEGURIDAD
              </span>

              <strong>
                Acceso protegido
              </strong>

              <p>
                Solo podés administrar servidores donde tengas permisos.
              </p>
            </article>
          </section>
        </div>
      `,document.getElementById("publicDiscordSupport")?.addEventListener("click",()=>{window.open("https://discord.gg/ue5c56nyCr","_blank","noopener,noreferrer")})});document.getElementById("publicLogout")?.addEventListener("click",async()=>{ge();try{await fetch("/auth/discord/logout",{method:"POST",credentials:"include"})}catch(a){console.error("Error cerrando sesión:",a)}localStorage.removeItem("nebulaSelectedServerId"),window.location.replace("/auth/dashboard")});const bi=document.getElementById("sidebar");document.getElementById("hamburger").addEventListener("click",()=>bi.classList.toggle("open"));document.addEventListener("keydown",a=>{a.ctrlKey&&a.key.toLowerCase()==="k"&&(a.preventDefault(),document.querySelector(".search input").focus())});const Te=document.getElementById("space");if(Te){let t=function(){Te.width=innerWidth*devicePixelRatio,Te.height=innerHeight*devicePixelRatio,Te.style.width=innerWidth+"px",Te.style.height=innerHeight+"px",a.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0),e=Array.from({length:90},()=>({x:Math.random()*innerWidth,y:Math.random()*innerHeight,r:Math.random()*1.3+.2,a:Math.random()*.45+.05,s:Math.random()*.12+.02}))},i=function(){a.clearRect(0,0,innerWidth,innerHeight),e.forEach(s=>{s.y-=s.s,s.y<0&&(s.y=innerHeight),a.beginPath(),a.arc(s.x,s.y,s.r,0,Math.PI*2),a.fillStyle=`rgba(255,255,255,${s.a})`,a.fill()}),requestAnimationFrame(i)};var Oi=t,Mi=i;const a=Te.getContext("2d");let e=[];t(),i(),addEventListener("resize",t)}const Ei=document.querySelector(".main"),wi=document.querySelector(".topbar"),I=document.createElement("div");I.id="pageContent";let Ye=wi.nextElementSibling;for(;Ye;){const a=Ye.nextElementSibling;I.appendChild(Ye),Ye=a}Ei.appendChild(I);const ua=I.innerHTML;I.innerHTML=`
  <div class="dynamic-page">
    <div class="servers-loading">
      <div class="loading-spinner"></div>

      <strong>
        Cargando tu cuenta de Discord...
      </strong>
    </div>
  </div>
`;hi();const Ci={Servidores:{eyebrow:"SERVIDORES",title:"Tus servidores",description:"Seleccioná un servidor para administrar sus funciones, permisos y configuración.",action:"＋ Agregar servidor",type:"servers"},Invitaciones:{eyebrow:"SERVIDORES",title:"Invitaciones",description:"Creá, controlá y eliminá enlaces de invitación para tus comunidades.",action:"＋ Nueva invitación",type:"invitations"},Miembros:{eyebrow:"COMUNIDAD",title:"Miembros",description:"Buscá usuarios, revisá sus roles y consultá su actividad reciente.",action:"Exportar lista",type:"members"},Roles:{eyebrow:"COMUNIDAD",title:"Roles",description:"Organizá la jerarquía y los permisos de cada rol del servidor.",action:"＋ Crear rol",type:"roles"},Canales:{eyebrow:"ESTRUCTURA",title:"Canales",description:"Administrá canales de texto, voz, categorías y permisos.",action:"＋ Crear canal",type:"channels"},"Logs del servidor":{eyebrow:"REGISTROS",title:"Logs del servidor",description:"Consultá eventos, mensajes eliminados y movimientos administrativos.",action:"Exportar logs",type:"logs"},Comandos:{eyebrow:"COMANDOS",title:"Comandos",description:"Activá, desactivá y personalizá las funciones principales del bot.",action:"＋ Crear comando",type:"commands"},"Slash Commands":{eyebrow:"COMANDOS",title:"Slash Commands",description:"Gestioná los comandos que aparecen al escribir / dentro de Discord.",action:"Sincronizar",type:"slash"},Mensajes:{eyebrow:"MENSAJES",title:"Mensajes automáticos",description:"Diseñá mensajes de bienvenida, despedida, anuncios y verificaciones.",action:"＋ Nuevo mensaje",type:"messages"},"Auto Respuestas":{eyebrow:"AUTOMATIZACIÓN",title:"Auto Respuestas",description:"Configurá respuestas automáticas mediante palabras o frases clave.",action:"＋ Nueva respuesta",type:"responses"},Moderación:{eyebrow:"SEGURIDAD",title:"Centro de moderación",description:"Accedé rápidamente a todas las herramientas de control del servidor.",action:"Abrir historial",type:"moderation"},Advertencias:{eyebrow:"MODERACIÓN",title:"Advertencias",description:"Registrá faltas, motivos, responsables y vencimientos.",action:"＋ Advertir usuario",type:"warnings"},Baneos:{eyebrow:"MODERACIÓN",title:"Baneos",description:"Administrá usuarios bloqueados y revisá los motivos de cada sanción.",action:"＋ Banear usuario",type:"bans"},Muteos:{eyebrow:"MODERACIÓN",title:"Muteos",description:"Aplicá silenciamientos temporales y revisá los que siguen activos.",action:"＋ Mutear usuario",type:"mutes"},"Anti Raid":{eyebrow:"PROTECCIÓN",title:"Anti Raid",description:"Protegé el servidor contra ingresos masivos y comportamientos sospechosos.",action:"Activar protección",type:"antiraid"},"Auto Mod":{eyebrow:"PROTECCIÓN",title:"Auto Mod",description:"Filtrá spam, enlaces, menciones masivas y palabras prohibidas.",action:"Guardar reglas",type:"automod"},Logs:{eyebrow:"SISTEMA",title:"Logs generales",description:"Revisá todas las acciones realizadas por el bot y el dashboard.",action:"Descargar",type:"logs"},Auditoría:{eyebrow:"SISTEMA",title:"Auditoría",description:"Identificá quién realizó cada cambio dentro del panel.",action:"Filtrar actividad",type:"audit"},"Tareas programadas":{eyebrow:"AUTOMATIZACIÓN",title:"Tareas programadas",description:"Programá anuncios, limpiezas, backups y acciones automáticas.",action:"＋ Programar tarea",type:"tasks"},Backups:{eyebrow:"SISTEMA",title:"Backups",description:"Guardá y restaurá configuraciones del servidor de forma segura.",action:"Crear backup",type:"backups"},Webhooks:{eyebrow:"INTEGRACIONES",title:"Webhooks",description:"Conectá servicios externos para recibir y enviar información.",action:"＋ Crear webhook",type:"webhooks"},Configuración:{eyebrow:"AJUSTES",title:"Configuración general",description:"Definí la identidad, el estado y el comportamiento principal del bot.",action:"Guardar cambios",type:"settings"},Personalización:{eyebrow:"APARIENCIA",title:"Personalización",description:"Cambiá colores, textos, imágenes y estilo visual del panel.",action:"Aplicar diseño",type:"customize"},"Variables de entorno":{eyebrow:"DESARROLLO",title:"Variables de entorno",description:"Prepará las variables que usaremos luego en Render sin mostrar secretos reales.",action:"Guardar variables",type:"environment"},Tokens:{eyebrow:"SEGURIDAD",title:"Tokens",description:"Visualizá el estado de las credenciales sin exponer su contenido.",action:"Actualizar token",type:"tokens"},Permisos:{eyebrow:"SEGURIDAD",title:"Permisos del bot",description:"Revisá qué acciones puede realizar el bot dentro de Discord.",action:"Guardar permisos",type:"permissions"},Integraciones:{eyebrow:"CONEXIONES",title:"Integraciones",description:"Prepará conexiones con Discord, Render, GitHub y otros servicios.",action:"＋ Conectar servicio",type:"integrations"}};function Si(a){return`
    <section class="section-header">
      <div>
        <span>${a.eyebrow}</span>
        <h1>${a.title}</h1>
        <p>${a.description}</p>
      </div>
      <button class="section-action">${a.action}</button>
    </section>
  `}function ne(a){return`
    <section class="section-metrics">
      ${a.map(([e,t,i,s,n="purple"])=>`
        <article class="section-metric">
          <i class="${n}">${e}</i>
          <div><span>${t}</span><strong>${i}</strong><small>${s}</small></div>
        </article>
      `).join("")}
    </section>
  `}function he(a,e){return`
    <article class="section-panel">
      <div class="section-panel-head">
        <div><span>INFORMACIÓN</span><h3>Actividad reciente</h3></div>
        <div class="section-search">⌕ <input placeholder="Buscar..." /></div>
      </div>
      <div class="data-table" style="--columns:${a.length}">
        <div class="data-row data-head">${a.map(t=>`<span>${t}</span>`).join("")}</div>
        ${e.map(t=>`<div class="data-row">${t.map(i=>`<span>${i}</span>`).join("")}</div>`).join("")}
      </div>
    </article>
  `}function vt(a){return`
    <div class="settings-layout">
      <article class="section-panel">
        <div class="section-panel-head"><div><span>CONTROLES</span><h3>Funciones disponibles</h3></div></div>
        <div class="toggle-list">
          ${a.map(([e,t,i])=>`
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
  `}function Z(a){return`<section class="feature-grid">${a.map(([e,t,i,s])=>`
    <article class="feature-card">
      <div class="feature-top"><i>${e}</i><span>${s}</span></div>
      <h3>${t}</h3><p>${i}</p>
      <button>Administrar <b>›</b></button>
    </article>
  `).join("")}</section>`}function Xt(a){return`
    <div class="settings-layout">
      <article class="section-panel">
        <div class="section-panel-head"><div><span>CONFIGURACIÓN</span><h3>Datos principales</h3></div></div>
        <div class="form-grid">
          ${a.map(([e,t,i=!1])=>`
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
  `}function Ai(a){switch(a){case"servers":return ne([["◈","Servidores conectados","12","+2 este mes"],["♣","Miembros totales","8.745","+342 este mes","blue"],["●","Usuarios online","1.286","Ahora","green"],["⌘","Comandos hoy","3.248","+18.7%","yellow"]])+Z([["NC","Nebula Community","Servidor principal · 1.245 miembros","89% activo"],["GZ","Gaming Zone","Comunidad gamer · 987 miembros","75% activo"],["TD","Team Developers","Desarrollo y tecnología · 756 miembros","62% activo"],["＋","Agregar servidor","Invitá a Nebula Bot a otra comunidad","NUEVO"]]);case"invitations":return ne([["⌁","Invitaciones activas","18","6 temporales"],["♣","Usos totales","2.846","+92 hoy","blue"],["◷","Próximas a vencer","3","En 24 horas","yellow"]])+he(["Código","Canal","Usos","Vencimiento","Estado"],[["nebula-main","#bienvenida","1.284","Nunca","<b class='good'>Activa</b>"],["gaming-zone","#general","642","7 días","<b class='good'>Activa</b>"],["evento-vip","#eventos","128","18 horas","<b class='warn'>Temporal</b>"]]);case"members":return ne([["♣","Miembros","8.745","+342 este mes"],["●","En línea","1.286","14.7%","green"],["◇","Con roles","8.102","92.6%","blue"],["◉","Nuevos hoy","76","+12%","yellow"]])+he(["Usuario","Rol principal","Ingreso","Mensajes","Estado"],[["<b>Alvi Moreyra</b>","Propietario","12/05/2024","18.492","<b class='good'>En línea</b>"],["Juan Cruz","Administrador","02/07/2025","7.824","Ausente"],["NovaUser","Miembro","11/07/2026","1.209","<b class='good'>En línea</b>"]]);case"roles":return Z([["♛","Propietario","Control total del servidor y del dashboard.","1 miembro"],["◆","Administrador","Moderación, configuración y registros.","6 miembros"],["◇","Moderador","Control de mensajes y usuarios.","14 miembros"],["●","Miembro","Acceso general a la comunidad.","8.102 miembros"],["＋","Crear nuevo rol","Agregá una nueva jerarquía personalizada.","NUEVO"]]);case"channels":return Z([["#","bienvenida","Canal de entrada y verificación.","Texto"],["#","general","Conversaciones principales de la comunidad.","Texto"],["◖","Sala General","Canal de voz para todos los miembros.","Voz"],["▣","Administración","Categoría privada del equipo.","Categoría"],["＋","Crear canal","Agregá un canal nuevo al servidor.","NUEVO"]]);case"commands":case"slash":return ne([["⌘","Comandos activos","24","Todos sincronizados"],["◉","Ejecuciones","25.683","+18.7%"],["⚡","Tiempo medio","82 ms","Excelente","green"]])+he(["Comando","Descripción","Usos","Permiso","Estado"],[["/verify","Verifica usuarios y asigna roles","8.429","Todos","<b class='good'>Activo</b>"],["/clean","Elimina una cantidad de mensajes","4.326","Moderador","<b class='good'>Activo</b>"],["/data","Muestra datos del usuario verificado","3.782","Administrador","<b class='good'>Activo</b>"],["/invite","Genera el enlace del bot","2.945","Todos","<b class='good'>Activo</b>"]]);case"messages":return Z([["👋","Bienvenida","Mensaje enviado cuando ingresa un nuevo miembro.","ACTIVO"],["🚪","Despedida","Aviso cuando un miembro abandona el servidor.","ACTIVO"],["✅","Verificación","Panel para verificar y asignar roles.","ACTIVO"],["📣","Anuncios","Mensajes especiales y programados.","BORRADOR"]]);case"responses":return he(["Palabra clave","Respuesta","Canal","Usos","Estado"],[["hola","¡Hola! Bienvenido a nuestra comunidad.","Todos","846","<b class='good'>Activa</b>"],["reglas","Podés leer las reglas en #reglas.","Todos","514","<b class='good'>Activa</b>"],["soporte","Abrí un ticket desde #soporte.","Ayuda","302","<b class='good'>Activa</b>"]]);case"moderation":return ne([["◆","Acciones hoy","148","+22%"],["◉","Advertencias","32","8 activas","yellow"],["⊗","Baneos","12","Este mes","red"],["◔","Muteos activos","7","Ahora","blue"]])+Z([["◉","Advertir usuario","Registrá una falta con motivo y evidencia.","ABRIR"],["◔","Mutear usuario","Silenciá temporalmente a un miembro.","ABRIR"],["⊗","Banear usuario","Bloqueá el acceso de forma permanente.","ABRIR"],["▤","Revisar historial","Consultá sanciones y responsables.","ABRIR"]]);case"warnings":case"bans":case"mutes":return he(["Usuario","Motivo","Responsable","Duración","Estado"],[["Usuario#4521","Spam reiterado","Alvi","24 horas","<b class='warn'>Activo</b>"],["PlayerNova","Insultos","Moderador01","7 días","<b class='warn'>Activo</b>"],["TestUser","Enlaces prohibidos","Auto Mod","Finalizado","Completado"]]);case"antiraid":case"automod":return ne([["⌁","Amenazas bloqueadas","286","Últimos 30 días"],["●","Nivel de protección","Alto","Recomendado","green"],["⚡","Respuesta media","41 ms","Excelente","blue"]])+vt([["Detección de ingresos masivos","Bloquea oleadas de cuentas nuevas.",!0],["Filtro de enlaces","Impide dominios no autorizados.",!0],["Menciones masivas","Controla @everyone y spam de menciones.",!0],["Cuentas nuevas","Aplica restricciones a cuentas recientes.",!1],["Modo emergencia","Bloqueo temporal completo del servidor.",!1]]);case"logs":case"audit":return ne([["▤","Eventos hoy","2.648","+14%"],["♣","Administradores","7","Con actividad"],["◷","Último evento","Hace 1 min","Actualizado","green"]])+he(["Evento","Usuario","Servidor","Fecha","Resultado"],[["Configuración actualizada","Alvi Moreyra","Nebula Community","23:41","<b class='good'>Correcto</b>"],["Mensajes eliminados","Moderador01","Gaming Zone","23:36","<b class='good'>Correcto</b>"],["Intento de acceso","Unknown","Team Developers","23:31","<b class='warn'>Revisar</b>"]]);case"tasks":return Z([["◷","Anuncio diario","Se ejecuta todos los días a las 09:00.","ACTIVA"],["▣","Backup automático","Guarda la configuración cada 12 horas.","ACTIVA"],["⌘","Limpieza semanal","Elimina mensajes antiguos los domingos.","ACTIVA"],["＋","Nueva tarea","Programá otra acción automática.","NUEVO"]]);case"backups":return ne([["▣","Backups guardados","18","Últimos 30 días"],["◷","Último backup","Hace 2 horas","Correcto","green"],["◇","Espacio usado","42 MB","de 500 MB","blue"]])+he(["Nombre","Servidor","Fecha","Tamaño","Estado"],[["Backup automático #018","Nebula Community","Hoy 21:30","2.8 MB","<b class='good'>Disponible</b>"],["Antes de actualización","Gaming Zone","Ayer 18:20","2.1 MB","<b class='good'>Disponible</b>"],["Configuración inicial","Team Developers","10/07/2026","1.7 MB","<b class='good'>Disponible</b>"]]);case"webhooks":case"integrations":return Z([["⌘","Discord","Bot, OAuth2 y eventos del servidor.","CONECTADO"],["◈","Render","Alojamiento gratuito del bot y dashboard.","PREPARADO"],["◆","GitHub","Código, versiones y despliegue automático.","PENDIENTE"],["▣","Base de datos","Guardado de configuraciones y usuarios.","PENDIENTE"],["＋","Nueva integración","Conectá otro servicio externo.","NUEVO"]]);case"settings":return Xt([["Nombre del bot","Nebula Bot"],["Estado","Protegiendo tu servidor"],["Prefijo","/"],["Idioma","Español"],["Descripción","Bot avanzado de administración y moderación.",!0],["Mensaje de actividad","Usá /help para ver los comandos.",!0]]);case"customize":return vt([["Animaciones del panel","Activa transiciones, partículas y efectos.",!0],["Fondo espacial","Muestra estrellas en movimiento.",!0],["Modo compacto","Reduce el tamaño de tarjetas y espacios.",!1],["Sonidos del panel","Reproduce sonidos en las acciones.",!1],["Efecto neón","Aumenta los brillos violetas.",!0]]);case"environment":return Xt([["DISCORD_TOKEN","••••••••••••••••"],["CLIENT_ID","Pendiente"],["CLIENT_SECRET","••••••••••••••••"],["DATABASE_URL","Pendiente"],["REDIRECT_URI",`${window.location.origin}/auth/discord/callback`,!0],["SESSION_SECRET","••••••••••••••••",!0]]);case"tokens":return Z([["◇","Token del bot","Credencial principal de conexión con Discord.","PROTEGIDO"],["⌘","Client ID","Identificador público de la aplicación.","PENDIENTE"],["◆","Client Secret","Secreto utilizado para OAuth2.","PROTEGIDO"],["◷","Última rotación","El token aún no fue conectado.","SIN DATOS"]]);case"permissions":return vt([["Administrar servidor","Permite cambiar configuraciones generales.",!0],["Administrar roles","Permite crear, editar y asignar roles.",!0],["Administrar canales","Permite crear y modificar canales.",!0],["Banear miembros","Permite bloquear usuarios.",!0],["Expulsar miembros","Permite quitar usuarios.",!0],["Administrador total","Otorga todos los permisos disponibles.",!1]]);default:return Z([["✦","Sección preparada","La interfaz ya está lista para conectarse en las próximas etapas.","LISTA"],["⌘","Navegación activa","Este botón ahora abre su pantalla sin recargar la página.","ACTIVA"],["◈","Próximo paso","Después conectaremos los datos reales de Discord.","PENDIENTE"]])}}async function Ii(a){if(a==="Dashboard"){document.body.classList.remove("servers-selection-mode"),I.innerHTML=ua,Bt(),kt(O),st(),Ot();return}if(a==="Servidores"||a==="Servidor actual"){if(!Q){Be(),window.history.replaceState({},"","/?view=servers");return}const t=z.find(i=>String(i.id)===String(Q));if(!t||!t.botPresent){Be(),window.history.replaceState({},"","/?view=servers");return}await ce(Q);return}const e=Ci[a]||{eyebrow:"NEBULA",title:a,description:"Esta sección ya forma parte de la navegación principal.",action:"Guardar cambios",type:"default"};I.innerHTML=`
    <div class="dynamic-page">
      ${Si(e)}
      ${Ai(e.type)}
    </div>
  `,Bt(),window.scrollTo({top:0,behavior:"smooth"})}function Bt(){I.querySelectorAll("button").forEach(a=>{a.addEventListener("click",ee)}),I.querySelectorAll(".switch-control input").forEach(a=>{a.addEventListener("change",ee)})}document.querySelectorAll(".side-item").forEach(a=>{a.addEventListener("click",()=>{const e=a.querySelector("span:nth-child(2)")?.textContent.trim();e&&Ii(e)})});async function Ot(){try{const a=await fetch(`${x}/api/dashboard`);if(!a.ok)throw new Error(`Error HTTP: ${a.status}`);const e=await a.json();if(!e.success)throw new Error("La API respondió con un error");const t=e.data;Tt={name:t?.bot?.name||"Nebula Bot",avatar:t?.bot?.avatar||""},pa(t.statistics),va(t.bot),ma(t.system),console.log("Datos recibidos desde la API:",t)}catch(a){console.error("No se pudo conectar con la API:",a),fa()}}function pa(a){const e=document.querySelectorAll("[data-count]"),t=[a.servers,a.users,a.commands,a.messages];e.forEach((s,n)=>{const o=t[n];if(o===void 0)return;const d=Number(s.dataset.currentValue??s.dataset.count??0);if(d===o){s.textContent=o.toLocaleString("es-AR");return}s.dataset.count=o,s.dataset.currentValue=o,Ti(s,d,o)});const i=[...document.querySelectorAll(".stat-card strong")].find(s=>s.textContent.includes("%"));i&&(i.textContent=`${a.uptimePercentage}%`)}function Ti(a,e,t){a.animationFrame&&cancelAnimationFrame(a.animationFrame);const i=performance.now(),s=700;function n(o){const d=Math.min((o-i)/s,1),m=1-Math.pow(1-d,3),w=Math.floor(e+(t-e)*m);a.textContent=w.toLocaleString("es-AR"),d<1?a.animationFrame=requestAnimationFrame(n):(a.textContent=t.toLocaleString("es-AR"),a.animationFrame=null)}a.animationFrame=requestAnimationFrame(n)}function va(a){const e=document.querySelector(".status-card strong");e&&(e.textContent=a.status==="online"?"En línea":"Desconectado",e.classList.toggle("offline-text",a.status!=="online"));const t=document.querySelectorAll(".footer-status strong");t[3]&&(t[3].textContent=a.uptime);const i=document.querySelector(".footer-status > div:last-child strong");i&&(i.textContent=a.version)}function ma(a){const e=document.querySelectorAll(".health-list > div strong"),t=[a.discordApi,a.database,a.servers,a.dashboard,a.logs];e.forEach((i,s)=>{const n=t[s];i.textContent=n?"Operativo":"Desconectado",i.classList.toggle("system-error",!n)})}function fa(){const a=document.querySelector(".status-card strong");a&&(a.textContent="Sin conexión",a.classList.add("offline-text"))}Ot();let mt=!1;async function ya(){if(mt)return;mt=!0;const a=performance.now();try{const e=await fetch(`${x}/api/bot/status?t=${Date.now()}`,{method:"GET",headers:{Accept:"application/json"},credentials:"include",cache:"no-store"}),t=await e.json(),i=performance.now(),s=Math.max(0,Math.round(i-a));if(!e.ok||!t.success)throw new Error(t.message||"No se pudo consultar el estado.");const n=Math.max(0,Math.round(Number(t.data?.latency||0))),o=document.getElementById("liveBotLatency");o&&(o.textContent=`${s} ms`,o.title=`Discord: ${n} ms`);const d=document.querySelector(".footer-status > div:first-child strong");d&&(d.textContent=`${s} ms`,d.title=`Discord: ${n} ms`);const m=document.getElementById("liveBotUpdatedAt");m&&(m.textContent=new Date().toLocaleTimeString("es-AR",{hour:"2-digit",minute:"2-digit",second:"2-digit"}))}catch(e){console.error("Error actualizando la latencia:",e);const t=document.getElementById("liveBotLatency");t&&(t.textContent="Sin conexión");const i=document.querySelector(".footer-status > div:first-child strong");i&&(i.textContent="Sin conexión")}finally{mt=!1}}ya();setInterval(ya,500);const _e=tt();_e.on("connect",()=>{console.log("Dashboard conectado en tiempo real:",_e.id)});_e.on("dashboard:update",a=>{console.log("Actualización recibida por Socket.IO:",a),pa(a.statistics),va(a.bot),ma(a.system)});_e.on("disconnect",()=>{console.log("Dashboard desconectado del servidor"),fa()});_e.on("connect_error",a=>{console.error("Error de Socket.IO:",a.message)});async function ce(a){ge(),document.body.classList.remove("servers-selection-mode"),I.innerHTML=`
    <div class="dynamic-page">
      <div class="servers-loading">
        <div class="loading-spinner"></div>
        <strong>Cargando información del servidor...</strong>
      </div>
    </div>
  `;try{const e=await fetch(`${x}/api/servers/${a}`),t=await e.json();if(!e.ok||!t.success)throw new Error(t.message||"No se pudo cargar el servidor");ki(t.data)}catch(e){console.error("Error cargando servidor:",e),I.innerHTML=`
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
    `,document.getElementById("backToServers")?.addEventListener("click",()=>{Be(),window.history.replaceState({},"","/?view=servers")})}}function ki(a){const e=new Date(a.createdAt).toLocaleDateString("es-AR",{day:"2-digit",month:"2-digit",year:"numeric"}),t=a.name.split(" ").slice(0,2).map(o=>o.charAt(0)).join("").toUpperCase(),i=a.icon?`<img src="${a.icon}" alt="${a.name}">`:`<span>${t}</span>`,s=a.roles.length?a.roles.map(o=>`
        <div class="server-role-row">
          <i style="background:${o.color}"></i>

          <div>
            <strong>${o.name}</strong>
            <span>${o.members} miembros</span>
          </div>

          <button
            class="server-small-action"
            data-action="role"
            data-role-id="${o.id}"
          >
            Editar
          </button>
        </div>
      `).join(""):`
      <div class="server-empty">
        No hay roles disponibles.
      </div>
    `,n=a.channels.length?a.channels.map(o=>`
        <div class="server-channel-row">
          <i>#</i>

          <div>
            <strong>${o.name}</strong>
            <span>ID: ${o.id}</span>
          </div>

          <button
            class="server-small-action"
            data-action="channel"
            data-channel-id="${o.id}"
          >
            Editar
          </button>
        </div>
      `).join(""):`
      <div class="server-empty">
        No hay canales disponibles.
      </div>
    `;I.innerHTML=`
    <div class="dynamic-page server-control-page">

      <section
        class="server-control-hero"
        ${a.banner?`style="background-image:
                linear-gradient(
                  90deg,
                  rgba(7,7,12,.95),
                  rgba(7,7,12,.48)
                ),
                url('${a.banner}')"`:""}
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
            <h1>${a.name}</h1>

            <p>
              ${a.members.toLocaleString("es-AR")}
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
              ${a.members.toLocaleString("es-AR")}
            </strong>
            <small>Usuarios del servidor</small>
          </div>
        </article>

        <article class="section-metric">
          <i class="blue">▣</i>
          <div>
            <span>Canales</span>
            <strong>${a.statistics.channels}</strong>
            <small>Texto, voz y categorías</small>
          </div>
        </article>

        <article class="section-metric">
          <i class="green">♙</i>
          <div>
            <span>Roles</span>
            <strong>${a.statistics.roles}</strong>
            <small>Jerarquías configuradas</small>
          </div>
        </article>

        <article class="section-metric">
          <i class="yellow">◇</i>
          <div>
            <span>Emojis</span>
            <strong>${a.statistics.emojis}</strong>
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
            ${s}
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
            ${n}
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
            <strong>${a.name}</strong>
          </div>

          <div>
            <span>ID DEL SERVIDOR</span>
            <strong>${a.id}</strong>
          </div>

          <div>
            <span>ID DEL PROPIETARIO</span>
            <strong>${a.ownerId}</strong>
          </div>

          <div>
            <span>FECHA DE CREACIÓN</span>
            <strong>${e}</strong>
          </div>

        </div>
      </section>

    </div>
  `,document.getElementById("backToServers")?.addEventListener("click",()=>{Be(),window.history.replaceState({},"","/?view=servers")}),document.querySelector('[data-tool="welcome"]')?.addEventListener("click",()=>{Li(a)}),document.querySelector('[data-tool="verification"]')?.addEventListener("click",()=>{Bi(a)}),document.querySelectorAll('.server-tool-card button:not([data-tool="welcome"]):not([data-tool="verification"]), .server-small-action, .server-header-action').forEach(o=>{o.addEventListener("click",()=>{R.querySelector("strong").textContent="Herramienta preparada",R.querySelector("p").textContent="Esta función se conectará más adelante.",ee()})})}async function Bi(a){I.innerHTML=`
    <div class="dynamic-page">
      <div class="servers-loading">
        <div class="loading-spinner"></div>
        <strong>
          Cargando configuración de verificación...
        </strong>
      </div>
    </div>
  `;try{const[e,t,i,s]=await Promise.all([fetch(`${x}/api/servers/${a.id}/text-channels`),fetch(`${x}/api/servers/${a.id}`),fetch(`${x}/api/servers/${a.id}/verification`),fetch(`${x}/api/bot/public-info`)]),n=await e.json(),o=await t.json(),d=await i.json(),m=await s.json();if(!e.ok||!n.success)throw new Error(n.message||"No se pudieron cargar los canales");if(!t.ok||!o.success)throw new Error(o.message||"No se pudieron cargar los roles");if(!i.ok||!d.success)throw new Error(d.message||"No se pudo cargar la configuración");Di(a,n.data,o.data.roles,d.data,m.success?m.data:{})}catch(e){console.error("Error cargando verificación:",e),I.innerHTML=`
      <div class="dynamic-page">
        <div class="servers-error">
          <div class="servers-error-icon">!</div>

          <h3>
            No se pudo abrir Verificación
          </h3>

          <p>
            ${b(e.message)}
          </p>

          <button id="backToServerPanel">
            Volver al servidor
          </button>
        </div>
      </div>
    `,document.getElementById("backToServerPanel")?.addEventListener("click",()=>{ce(a.id)})}}function U(a,e,t){return`
    <label class="welcome-field">
      <span>${e}</span>

      <div class="welcome-color-row">
        <input
          id="${a}"
          type="color"
          value="${t}"
        >

        <input
          id="${a}Text"
          value="${t}"
          maxlength="7"
        >
      </div>
    </label>
  `}function q(a,e,t,i,s,n=""){return`
    <label class="appearance-range-control">
      <div>
        <span>${e}</span>

        <strong id="${a}Value">
          ${t}${n}
        </strong>
      </div>

      <input
        id="${a}"
        type="range"
        min="${i}"
        max="${s}"
        value="${t}"
        data-suffix="${n}"
      >
    </label>
  `}function Di(a,e,t,i,s={}){const n={avatar:!0,username:!0,displayName:!0,userId:!0,deliveredRole:!0,accountCreatedAt:!0,joinedAt:!0,verifiedAt:!0,verificationDuration:!0,attempts:!0,banner:!1,nitro:!1,operatingSystem:!1,browser:!1,device:!1,resolution:!1,language:!1,timezone:!1,country:!1,city:!1,region:!1,countryCode:!1,approximateLocalTime:!1,fullIp:!1,ipType:!1,isp:!1,asn:!1,vpn:!1,proxy:!1,hosting:!1,mobileNetwork:!1,riskLevel:!1,trustScore:!1,...i.logOptions||{}},o={cardDesign:"classic",splitImageUrl:"",splitImagePosition:"left",splitImageFit:"cover",splitImageDarkness:45,splitImageWidth:48,splitShowImage:!0,splitShowDate:!0,splitShowAccess:!0,terminalTitle:"NEBULA SECURITY TERMINAL",terminalPrefix:">",terminalStatusText:"Sistema preparado",terminalBackgroundColor:"#020703",terminalTextColor:"#d9ffe0",terminalAccentColor:"#22c55e",terminalBorderColor:"#14532d",terminalShowCursor:!0,terminalShowLines:!0,terminalShowServer:!0,terminalShowRole:!0,terminalGlow:25,terminalRadius:10,pageName:"Trade Room Verification",pageDescription:"Completá la verificación para acceder al servidor.",logoUrl:"",backgroundUrl:"",primaryColor:"#8b5cf6",secondaryColor:"#6d28d9",buttonColor:"#7c3aed",textColor:"#ffffff",cardColor:"#0f0f1a",backgroundType:"space",backgroundSolidColor:"#05050a",gradientStart:"#05050a",gradientEnd:"#160c2b",spaceBackground:!0,animationsEnabled:!0,particlesEnabled:!0,glowEnabled:!0,fadeEnabled:!0,hoverEnabled:!0,cursorGlowEnabled:!1,buttonAnimationEnabled:!0,logoAnimationEnabled:!0,particleCount:100,glowIntensity:80,cardBlur:18,cardOpacity:88,cardRadius:24,cardShadow:80,verifyButtonText:"Verificar con Discord",verifyButtonIcon:"discord",verifyButtonSize:"large",verifyButtonRadius:14,verificationSound:!1,errorSound:!1,openingSound:!1,soundVolume:50,...i.webAppearance||{}},d={detectVpn:!1,detectProxy:!1,detectTor:!1,blockHosting:!1,detectAltAccounts:!1,minimumAccountAgeEnabled:!1,minimumAccountAgeDays:7,blockWithoutAvatar:!1,blockWithoutBanner:!1,allowReverification:!0,notifySecurityFailure:!0,...i.security||{}},m=e.map(r=>`
        <option
          value="${r.id}"
          ${r.id===i.verificationChannelId?"selected":""}
        >
          # ${b(r.name)}
        </option>
      `).join(""),w=e.map(r=>`
        <option
          value="${r.id}"
          ${r.id===i.logsChannelId?"selected":""}
        >
          # ${b(r.name)}
        </option>
      `).join(""),T=t.map(r=>`
        <option
          value="${r.id}"
          ${r.id===i.verifiedRoleId?"selected":""}
        >
          @ ${b(r.name)}
        </option>
      `).join(""),p=(r,c,u,v)=>`
    <div class="verify-option-row">
      <div>
        <strong>${c}</strong>
        <p>${u}</p>
      </div>

      <label class="switch-control">
        <input
          id="${r}"
          type="checkbox"
          ${v?"checked":""}
        >
        <span></span>
      </label>
    </div>
  `,E=(r,c,u)=>p(`verifyLog_${r}`,c,u,!!n[r]);I.innerHTML=`
    <div class="dynamic-page verification-config-page">

      <section class="section-header">
        <div>
          <span>SEGURIDAD DEL SERVIDOR</span>

          <h1>Verificación</h1>

          <p>
            Administrá el sistema de acceso de
            ${b(a.name)}.
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

        <button
          class="verify-tab"
          data-verify-tab="configuration"
        >
          ⚙ Configuración
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

            ${p("verifyEnabled","Activar sistema de verificación","Permite que los usuarios obtengan el rol configurado.",i.enabled)}

            <div class="verify-form-grid">
              <label class="welcome-field">
                <span>CANAL DE VERIFICACIÓN</span>

                <select id="verifyChannel">
                  <option value="">
                    Seleccionar canal...
                  </option>

                  ${m}
                </select>
              </label>

              <label class="welcome-field">
                <span>ROL A ENTREGAR</span>

                <select id="verifyRole">

                  <option value="">
                    Seleccionar rol...
                  </option>

                  ${T}
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

  <button
    class="open-variables-button"
    data-open-variables
    type="button"
  >
    <span>⌘</span>
    Variables
  </button>
</div>

        <label class="welcome-field">
          <span>TÍTULO DEL EMBED</span>

          <input
            id="verifyEmbedTitle"
            maxlength="256"
            value="${y(i.embedTitle||"🔒 Verificación requerida")}"
          >
        </label>

        <label class="welcome-field">
          <span>DESCRIPCIÓN</span>

          <textarea
            id="verifyEmbedDescription"
            rows="5"
            maxlength="4000"
          >${b(i.embedDescription||"Para obtener acceso a **{server}**, debés verificar tu cuenta de Discord.")}</textarea>
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
              maxlength="7"
              value="${i.embedColor||"#8b5cf6"}"
            >
          </div>
        </label>

        <div class="verify-form-grid">

          <label class="welcome-field">
            <span>TEXTO DEL BOTÓN</span>

            <input
              id="verifyButtonText"
              maxlength="80"
              value="${y(i.buttonText||"Verificar con Discord")}"
            >
          </label>

          <label class="welcome-field">
            <span>EMOJI DEL BOTÓN</span>

            <input
              id="verifyButtonEmoji"
              maxlength="100"
              value="${y(i.buttonEmoji||"✅")}"
            >
          </label>

        </div>

        <div class="verify-form-grid">

          <label class="welcome-field">
            <span>NOMBRE DEL CAMPO</span>

            <input
              id="verifyEmbedFieldName"
              maxlength="256"
              value="${y(i.embedFieldName||"📌 Servidor")}"
            >
          </label>

          <label class="welcome-field">
            <span>VALOR DEL CAMPO</span>

            <input
              id="verifyEmbedFieldValue"
              maxlength="1024"
              value="${y(i.embedFieldValue||"{server}")}"
            >
          </label>

        </div>

        <label class="welcome-field">
          <span>TEXTO DEL PIE</span>

          <input
            id="verifyEmbedFooterText"
            maxlength="2048"
            value="${y(i.embedFooterText||"Nebula Security • Todos los derechos reservados")}"
          >
        </label>

        <label class="welcome-field">
          <span>EMOJI DE REACCIÓN</span>

          <input
            id="verifyReactionEmoji"
            maxlength="100"
            value="${y(i.reactionEmoji||"✅")}"
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

          ${p("verifyShowBotAvatar","Mostrar avatar del bot","Usa la foto de perfil real del bot.",i.showBotAvatar!==!1)}

          ${p("verifyShowServerIcon","Mostrar icono del servidor","Usa el icono del servidor como miniatura.",i.showServerIcon!==!1)}

          ${p("verifyShowCustomThumbnail","Miniatura personalizada","Muestra una imagen pequeña en el embed.",!!i.showCustomThumbnail)}

          ${p("verifyShowEmbedImage","Imagen grande","Muestra una imagen en la parte inferior.",!!i.showEmbedImage)}

          ${p("verifyShowTimestamp","Mostrar fecha y hora","Agrega el timestamp real de Discord.",i.showTimestamp!==!1)}

        </div>

        <label class="welcome-field">
          <span>URL DE LA MINIATURA</span>

          <input
            id="verifyEmbedThumbnailUrl"
            maxlength="1000"
            placeholder="https://..."
            value="${y(i.embedThumbnailUrl||"")}"
          >
        </label>

        <label class="welcome-field">
          <span>URL DE LA IMAGEN GRANDE</span>

          <input
            id="verifyEmbedImageUrl"
            maxlength="1000"
            placeholder="https://..."
            value="${y(i.embedImageUrl||"")}"
          >
        </label>

      </article>

    
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
              src="${y(s.avatar||"https://cdn.discordapp.com/embed/avatars/0.png")}"
              alt="Avatar del bot"
            >

            <div>
              <strong id="verifyPreviewBotName">
                ${b(s.displayName||s.username||"Nebula Bot")}
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
              ${i.embedColor||"#8b5cf6"};
            "
          >

            <div class="discord-embed-body">

              <div class="discord-embed-content">

                <h3 id="verifyPreviewTitle">
                  ${b(i.embedTitle||"🔒 Verificación requerida")}
                </h3>

                <p id="verifyPreviewDescription">
                  ${b((i.embedDescription||"Para obtener acceso a **{server}**, debés verificar tu cuenta de Discord.").replaceAll("{server}",a.name).replaceAll("**",""))}
                </p>

                <div
                  id="verifyPreviewField"
                  class="discord-embed-field"
                >
                  <strong id="verifyPreviewFieldName">
                    ${b(i.embedFieldName||"📌 Servidor")}
                  </strong>

                  <span id="verifyPreviewFieldValue">
                    ${b((i.embedFieldValue||"{server}").replaceAll("{server}",a.name))}
                  </span>
                </div>

                <button
                  id="verifyPreviewButton"
                  type="button"
                >
                  <span id="verifyPreviewButtonEmoji">
                    ${b(i.buttonEmoji||"✅")}
                  </span>

                  <strong id="verifyPreviewButtonText">
                    ${b(i.buttonText||"Verificar con Discord")}
                  </strong>
                </button>

              </div>

              <img
                id="verifyPreviewThumbnail"
                class="discord-embed-thumbnail"
                src="${y(i.showCustomThumbnail&&i.embedThumbnailUrl?i.embedThumbnailUrl:a.icon||a.iconURL||"")}"
                alt="Miniatura"
              >

            </div>

            <img
              id="verifyPreviewImage"
              class="discord-embed-large-image"
              src="${y(i.embedImageUrl||"")}"
              alt="Imagen del embed"
              ${i.showEmbedImage&&i.embedImageUrl?"":'style="display:none"'}
            >

            <div class="discord-embed-footer">

              <img
                id="verifyPreviewFooterAvatar"
                src="${y(s.avatar||"https://cdn.discordapp.com/embed/avatars/0.png")}"
                alt=""
              >

              <span id="verifyPreviewFooterText">
                ${b(i.embedFooterText||"Nebula Security • Todos los derechos reservados")}
              </span>

              <small
                id="verifyPreviewTimestamp"
                ${i.showTimestamp===!1?'style="display:none"':""}
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

    <h3>
      Logs de verificación
    </h3>
  </div>

  <button
    class="open-variables-button"
    data-open-variables
    type="button"
  >
    <span>⌘</span>
    Variables
  </button>
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
                  value="${y(i.logEmbedTitle||"🛡️ Usuario verificado")}"
                >
              </label>

              <label class="welcome-field">
                <span>DESCRIPCIÓN DEL LOG</span>

                <textarea
                  id="verifyLogDescription"
                  rows="4"
                  maxlength="4000"
                >${b(i.logEmbedDescription||"")}</textarea>
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
                ${E("avatar","Avatar","Foto de perfil del usuario.")}

                ${E("username","Usuario de Discord","Nombre de usuario.")}

                ${E("displayName","Nombre para mostrar","Apodo o nombre global.")}

                ${E("userId","Discord ID","Identificador de la cuenta.")}

                ${E("deliveredRole","Rol entregado","Rol recibido al verificarse.")}

                ${E("accountCreatedAt","Cuenta creada","Fecha de creación de Discord.")}

                ${E("joinedAt","Ingreso al servidor","Fecha en que se unió.")}

                ${E("verifiedAt","Fecha de verificación","Momento exacto de la verificación.")}
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
                ${E("browser","Navegador","Chrome, Edge, Firefox, etc.")}

                ${E("operatingSystem","Sistema operativo","Windows, Android, iOS, etc.")}

                ${E("device","Dispositivo","Computadora, celular o tablet.")}

                ${E("resolution","Resolución","Tamaño de la pantalla.")}

                ${E("language","Idioma","Idioma configurado.")}

                ${E("timezone","Zona horaria","Zona horaria del navegador.")}
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
                ${E("country","País aproximado","País estimado por la conexión.")}

                ${E("city","Ciudad aproximada","Ciudad estimada.")}

                ${E("vpn","VPN","Indica posible uso de VPN.")}

                ${E("proxy","Proxy","Indica posible uso de proxy.")}

                ${E("isp","Proveedor de internet","Empresa de conexión.")}

                ${E("asn","ASN","Identificador de la red.")}

                ${E("fullIp","Dirección IP completa","Dato sensible. Debe permanecer desactivado salvo que exista una necesidad legítima y aviso claro.")}
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

<!-- DISEÑOS -->

<article class="section-panel appearance-design-section">
  <div class="section-panel-head">
    <div>
      <span>ESTILO DE LA TARJETA</span>
      <h3>Diseños</h3>
    </div>
  </div>

  <div class="appearance-design-grid">

    <label class="appearance-design-card">
      <input
        type="radio"
        name="verificationCardDesign"
        value="classic"
        ${o.cardDesign==="classic"?"checked":""}
      >

      <div>
        <span class="appearance-design-icon">
          ◫
        </span>

        <strong>
          Clásico
        </strong>

        <p>
          Diseño actual de Nebula.
        </p>
      </div>
    </label>

    <label class="appearance-design-card">
      <input
        type="radio"
        name="verificationCardDesign"
        value="split"
        ${o.cardDesign==="split"?"checked":""}
      >

      <div>
        <span class="appearance-design-icon">
          ◧
        </span>

        <strong>
          Split Premium
        </strong>

        <p>
          Imagen a la izquierda y datos a la derecha.
        </p>
      </div>
    </label>

    <label class="appearance-design-card">
      <input
        type="radio"
        name="verificationCardDesign"
        value="terminal"
        ${o.cardDesign==="terminal"?"checked":""}
      >

      <div>
        <span class="appearance-design-icon">
          &gt;_
        </span>

        <strong>
          Terminal
        </strong>

        <p>
          Diseño serio con estilo de consola.
        </p>
      </div>
    </label>

  </div>
</article>
<!-- OPCIONES ESPECÍFICAS DE SPLIT PREMIUM -->

<div
  class="design-settings-panel"
  data-design-settings="split"
>
  <article class="section-panel">

    <div class="section-panel-head">
      <div>
        <span>SPLIT PREMIUM</span>

        <h3>
          Imagen y distribución
        </h3>
      </div>
    </div>

    <div class="appearance-form-grid">

      <label class="welcome-field appearance-wide">
        <span>
          URL DE LA IMAGEN LATERAL
        </span>

        <input
          id="verifySplitImageUrl"
          maxlength="1000"
          placeholder="https://..."
          value="${y(o.splitImageUrl||"")}"
        >
      </label>

      <label class="welcome-field">
        <span>
          POSICIÓN DE LA IMAGEN
        </span>

        <select id="verifySplitImagePosition">

          <option
            value="left"
            ${o.splitImagePosition!=="right"?"selected":""}
          >
            Izquierda
          </option>

          <option
            value="right"
            ${o.splitImagePosition==="right"?"selected":""}
          >
            Derecha
          </option>

        </select>
      </label>

      <label class="welcome-field">
        <span>
          AJUSTE DE LA IMAGEN
        </span>

        <select id="verifySplitImageFit">

          <option
            value="cover"
            ${o.splitImageFit!=="contain"?"selected":""}
          >
            Cubrir
          </option>

          <option
            value="contain"
            ${o.splitImageFit==="contain"?"selected":""}
          >
            Contener
          </option>

        </select>
      </label>

    </div>

    <div class="appearance-range-grid">

      ${q("verifySplitImageDarkness","OSCURIDAD DE LA IMAGEN",o.splitImageDarkness??45,0,90,"%")}

      ${q("verifySplitImageWidth","ANCHO DE LA IMAGEN",o.splitImageWidth??48,35,65,"%")}

    </div>

    <div class="verify-options-grid">

      ${p("verifySplitShowImage","Mostrar imagen lateral","Activa o desactiva la imagen del diseño.",o.splitShowImage!==!1)}

      ${p("verifySplitShowDate","Mostrar fecha","Muestra la fecha actual dentro de la tarjeta.",o.splitShowDate!==!1)}

      ${p("verifySplitShowAccess","Mostrar acceso","Muestra el estado de acceso instantáneo.",o.splitShowAccess!==!1)}

    </div>

  </article>
</div>

<!-- OPCIONES ESPECÍFICAS DE TERMINAL -->

<div
  class="design-settings-panel"
  data-design-settings="terminal"
>
  <article class="section-panel">

    <div class="section-panel-head">
      <div>
        <span>TERMINAL</span>

        <h3>
          Consola de seguridad
        </h3>
      </div>
    </div>

    <div class="appearance-form-grid">

      <label class="welcome-field appearance-wide">
        <span>
          TÍTULO DE LA TERMINAL
        </span>

        <input
          id="verifyTerminalTitle"
          maxlength="100"
          value="${y(o.terminalTitle||"NEBULA SECURITY TERMINAL")}"
        >
      </label>

      <label class="welcome-field">
        <span>
          PREFIJO DE LAS LÍNEAS
        </span>

        <input
          id="verifyTerminalPrefix"
          maxlength="5"
          value="${y(o.terminalPrefix||">")}"
        >
      </label>

      <label class="welcome-field">
        <span>
          TEXTO DE ESTADO
        </span>

        <input
          id="verifyTerminalStatusText"
          maxlength="80"
          value="${y(o.terminalStatusText||"Sistema preparado")}"
        >
      </label>

    </div>

    <div class="appearance-colors-grid">

      ${U("verifyTerminalBackgroundColor","COLOR DEL FONDO",o.terminalBackgroundColor||"#020703")}

      ${U("verifyTerminalTextColor","COLOR DEL TEXTO",o.terminalTextColor||"#d9ffe0")}

      ${U("verifyTerminalAccentColor","COLOR PRINCIPAL",o.terminalAccentColor||"#22c55e")}

      ${U("verifyTerminalBorderColor","COLOR DEL BORDE",o.terminalBorderColor||"#14532d")}

    </div>

    <div class="verify-options-grid">

      ${p("verifyTerminalShowCursor","Cursor parpadeante","Muestra un cursor discreto al final de la terminal.",o.terminalShowCursor!==!1)}

      ${p("verifyTerminalShowLines","Líneas separadoras","Muestra divisiones con estilo de consola.",o.terminalShowLines!==!1)}

      ${p("verifyTerminalShowServer","Mostrar servidor","Muestra el nombre del servidor.",o.terminalShowServer!==!1)}

      ${p("verifyTerminalShowRole","Mostrar rol","Muestra el rol que recibirá el usuario.",o.terminalShowRole!==!1)}

    </div>

    <div class="appearance-range-grid">

      ${q("verifyTerminalGlow","INTENSIDAD DEL BRILLO",o.terminalGlow??25,0,70,"%")}

      ${q("verifyTerminalRadius","BORDES REDONDEADOS",o.terminalRadius??10,0,30,"px")}

    </div>

  </article>
</div>


     <article
  class="section-panel"
  data-appearance-section="identity"
>
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
              value="${y(o.pageName)}"
            >
          </label>

          <label class="welcome-field appearance-wide">
            <span>DESCRIPCIÓN</span>

            <textarea
              id="verifyPageDescription"
              maxlength="300"
              rows="3"
            >${b(o.pageDescription)}</textarea>
          </label>

          <label class="welcome-field">
            <span>URL DEL LOGO</span>

            <input
              id="verifyLogoUrl"
              maxlength="1000"
              placeholder="https://..."
              value="${y(o.logoUrl)}"
            >
          </label>

          <label class="welcome-field">
            <span>URL DEL FONDO</span>

            <input
              id="verifyBackgroundUrl"
              maxlength="1000"
              placeholder="https://..."
              value="${y(o.backgroundUrl)}"
            >
          </label>
        </div>
      </article>

      <!-- COLORES -->

<article
  class="section-panel"
  data-appearance-section="palette"
>
          <div class="section-panel-head">
          <div>
            <span>PALETA</span>
            <h3>Colores de la página</h3>
          </div>
        </div>

        <div class="appearance-colors-grid">

          ${U("verifyPrimaryColor","COLOR PRINCIPAL",o.primaryColor)}

          ${U("verifySecondaryColor","COLOR SECUNDARIO",o.secondaryColor)}

          ${U("verifyButtonColor","COLOR DEL BOTÓN",o.buttonColor)}

          ${U("verifyTextColor","COLOR DEL TEXTO",o.textColor)}

          ${U("verifyCardColor","COLOR DE LA TARJETA",o.cardColor)}

          ${U("verifyBackgroundSolidColor","COLOR DEL FONDO",o.backgroundSolidColor)}

          ${U("verifyGradientStart","INICIO DEL DEGRADADO",o.gradientStart)}

          ${U("verifyGradientEnd","FINAL DEL DEGRADADO",o.gradientEnd)}

        </div>
      </article>

      <!-- FONDO -->

<article
  class="section-panel"
  data-appearance-section="background"
>
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
              ${o.backgroundType==="space"?"selected":""}
            >
              Espacial
            </option>

            <option
              value="gradient"
              ${o.backgroundType==="gradient"?"selected":""}
            >
              Degradado
            </option>

            <option
              value="image"
              ${o.backgroundType==="image"?"selected":""}
            >
              Imagen
            </option>

            <option
              value="video"
              ${o.backgroundType==="video"?"selected":""}
            >
              Video
            </option>

            <option
              value="solid"
              ${o.backgroundType==="solid"?"selected":""}
            >
              Color sólido
            </option>
          </select>
        </label>

        <div class="verify-options-grid">
          ${p("verifySpaceBackground","Fondo espacial","Muestra estrellas y partículas.",o.spaceBackground)}

          ${p("verifyParticlesEnabled","Partículas","Activa partículas animadas.",o.particlesEnabled)}
        </div>

        <div class="appearance-range-grid">
          ${q("verifyParticleCount","CANTIDAD DE PARTÍCULAS",o.particleCount,0,300)}

          ${q("verifyGlowIntensity","INTENSIDAD DEL BRILLO",o.glowIntensity,0,100)}
        </div>
      </article>

      <!-- ANIMACIONES -->

     <article
  class="section-panel"
  data-appearance-section="animations"
>
        <div class="section-panel-head">
          <div>
            <span>EFECTOS</span>
            <h3>Animaciones</h3>
          </div>
        </div>

        <div class="verify-options-grid">

          ${p("verifyAnimationsEnabled","Animaciones generales","Activa todos los efectos visuales.",o.animationsEnabled)}

          ${p("verifyGlowEnabled","Efecto glow","Agrega brillo alrededor de los elementos.",o.glowEnabled)}

          ${p("verifyFadeEnabled","Entrada suave","Los elementos aparecen con un efecto fade.",o.fadeEnabled)}

          ${p("verifyHoverEnabled","Efectos hover","Los elementos reaccionan al pasar el cursor.",o.hoverEnabled)}

          ${p("verifyCursorGlowEnabled","Cursor luminoso","Agrega un resplandor alrededor del cursor.",o.cursorGlowEnabled)}

          ${p("verifyButtonAnimationEnabled","Animación del botón","Anima el botón principal.",o.buttonAnimationEnabled)}

          ${p("verifyLogoAnimationEnabled","Animación del logo","Agrega movimiento suave al logo.",o.logoAnimationEnabled)}

        </div>
      </article>

      <!-- TARJETA -->

<article
  class="section-panel"
  data-appearance-section="card"
>
           <div class="section-panel-head">
          <div>
            <span>CONTENEDOR</span>
            <h3>Tarjeta principal</h3>
          </div>
        </div>

        <div class="appearance-range-grid">

          ${q("verifyCardBlur","DESENFOQUE",o.cardBlur,0,50,"px")}

          ${q("verifyCardOpacity","OPACIDAD",o.cardOpacity,10,100,"%")}

          ${q("verifyCardRadius","BORDES REDONDEADOS",o.cardRadius,0,50,"px")}

          ${q("verifyCardShadow","INTENSIDAD DE SOMBRA",o.cardShadow,0,100,"%")}

        </div>
      </article>

      <!-- BOTÓN -->

      <article
  class="section-panel"
  data-appearance-section="button"
>
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
              value="${y(o.verifyButtonText)}"
            >
          </label>

          <label class="welcome-field">
            <span>ICONO</span>

            <select id="verifyButtonIcon">
              <option
                value="discord"
                ${o.verifyButtonIcon==="discord"?"selected":""}
              >
                Discord
              </option>

              <option
                value="shield"
                ${o.verifyButtonIcon==="shield"?"selected":""}
              >
                Escudo
              </option>

              <option
                value="check"
                ${o.verifyButtonIcon==="check"?"selected":""}
              >
                Verificado
              </option>

              <option
                value="none"
                ${o.verifyButtonIcon==="none"?"selected":""}
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
                ${o.verifyButtonSize==="small"?"selected":""}
              >
                Pequeño
              </option>

              <option
                value="medium"
                ${o.verifyButtonSize==="medium"?"selected":""}
              >
                Mediano
              </option>

              <option
                value="large"
                ${o.verifyButtonSize==="large"?"selected":""}
              >
                Grande
              </option>
            </select>
          </label>

        </div>

        <div class="appearance-range-grid">
          ${q("verifyButtonRadius","BORDES DEL BOTÓN",o.verifyButtonRadius,0,40,"px")}
        </div>
      </article>

      <!-- SONIDOS -->

      <article
  class="section-panel"
  data-appearance-section="sounds"
>
        <div class="section-panel-head">
          <div>
            <span>AUDIO</span>
            <h3>Sonidos</h3>
          </div>
        </div>

        <div class="verify-options-grid">

          ${p("verifyOpeningSound","Sonido al abrir","Reproduce un sonido cuando carga la página.",o.openingSound)}

          ${p("verifyVerificationSound","Sonido al verificar","Reproduce un sonido cuando la verificación termina.",o.verificationSound)}

          ${p("verifyErrorSound","Sonido de error","Reproduce un sonido cuando ocurre un problema.",o.errorSound)}

        </div>

        <div class="appearance-range-grid">
          ${q("verifySoundVolume","VOLUMEN",o.soundVolume,0,100,"%")}
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
    src="/verify/${encodeURIComponent(a.id)}?preview=1"
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
              ${p("verifyDetectVpn","Detectar VPN","Marca conexiones que podrían utilizar VPN.",d.detectVpn)}

              ${p("verifyDetectProxy","Detectar proxy","Marca conexiones mediante proxy.",d.detectProxy)}

              ${p("verifyDetectTor","Detectar Tor","Marca conexiones de la red Tor.",d.detectTor)}
${p("verifyBlockHosting","Bloquear hosting / datacenter","Bloquea conexiones provenientes de servidores o centros de datos.",d.blockHosting)}

              ${p("verifyDetectAltAccounts","Detectar multicuentas","Busca señales de cuentas duplicadas.",d.detectAltAccounts)}

              ${p("verifyBlockWithoutAvatar","Bloquear sin avatar","Impide verificar cuentas sin foto.",d.blockWithoutAvatar)}

              ${p("verifyBlockWithoutBanner","Bloquear sin banner","Impide verificar cuentas sin banner.",d.blockWithoutBanner)}

              ${p("verifyAllowReverification","Permitir reverificación","Permite verificar nuevamente.",d.allowReverification)}

              ${p("verifyNotifySecurityFailure","Registrar bloqueos","Envía un log cuando una regla falla.",d.notifySecurityFailure)}
            </div>

            ${p("verifyMinimumAgeEnabled","Edad mínima de la cuenta","Bloquea cuentas demasiado nuevas.",d.minimumAccountAgeEnabled)}

            <label class="welcome-field">
              <span>DÍAS MÍNIMOS DE ANTIGÜEDAD</span>

              <input
                id="verifyMinimumAgeDays"
                type="number"
                min="0"
                max="3650"
                value="${d.minimumAccountAgeDays}"
              >
            </label>
          </article>
        </section>
<!-- CONFIGURACIÓN -->

<section
  class="verify-tab-panel"
  data-verify-panel="configuration"
>
  <div class="configuration-flow">

    <!-- ===================================================
         1. MENSAJE DEL BOTÓN DE INTERACCIÓN
         =================================================== -->

    <article
      class="section-panel configuration-flow-card"
      id="interactionMessageConfiguration"
      ${i.verificationMethod==="interaction_button"?"":'style="display:none;"'}
    >
     <div class="verification-section-heading">
  <div>
    <h2>
      1. Mensaje del botón de interacción
    </h2>

    <p>
      Este es el mensaje privado que el bot enviará al usuario cuando presione el botón de verificación.
    </p>
  </div>

  <button
    class="open-variables-button"
    data-open-variables
    type="button"
  >
    <span>⌘</span>
    Variables
  </button>
</div>

      <div class="configuration-editor-layout">

        <div class="configuration-editor-fields">

          <label class="welcome-field">
            <span>TÍTULO DEL MENSAJE</span>

            <input
              id="verifyInteractionTitle"
              maxlength="256"
              value="${y(i.interactionTitle||"🔒 Verificá tu cuenta")}"
            >
          </label>

          <label class="welcome-field">
            <span>DESCRIPCIÓN DEL MENSAJE</span>

            <textarea
              id="verifyInteractionMessage"
              rows="8"
              maxlength="2000"
            >${b(i.interactionMessage||`¡Hola {usuario}! 👋

Presioná el botón de abajo para verificar tu cuenta de forma rápida y segura.

El enlace es personal y solo puede utilizarse una vez.

Si no solicitaste esto, ignorá este mensaje.`)}</textarea>
          </label>

          <div class="configuration-variable-help">
            <span>Variables disponibles:</span>

            <code>{usuario}</code>
            <code>{servidor}</code>
            <code>{rol}</code>
            <code>{fecha}</code>
            <code>{hora}</code>
          </div>

        </div>

        <div class="configuration-editor-options">

          <label class="welcome-field">
            <span>COLOR DEL EMBED</span>

            <div class="welcome-color-row">
              <input
                id="verifyInteractionColor"
                type="color"
                value="${i.interactionColor||"#8b5cf6"}"
              >

              <input
                id="verifyInteractionColorText"
                maxlength="7"
                value="${y(i.interactionColor||"#8b5cf6")}"
              >
            </div>
          </label>

          <label class="welcome-field">
            <span>IMAGEN OPCIONAL</span>

            <input
              id="verifyInteractionImage"
              placeholder="https://i.imgur.com/imagen.png"
              value="${y(i.interactionImage||"")}"
            >
          </label>

 <div class="configuration-button-fields">

  <label class="welcome-field">
    <span>EMOJI DEL BOTÓN</span>

    <input
      id="verifyInteractionButtonEmoji"
      maxlength="16"
      placeholder="🛡️"
      value="${y(i.interactionButtonEmoji||"🛡️")}"
    >
  </label>

  <label class="welcome-field">
    <span>NOMBRE DEL BOTÓN</span>

    <input
      id="verifyInteractionButtonText"
      maxlength="80"
      placeholder="Continuar verificación"
      value="${y(i.interactionButtonText||"Continuar verificación")}"
    >
  </label>

</div>

<div class="configuration-link-button-note">
  <span>↗</span>

  <p>
    Este botón se mostrará como un enlace externo de Discord.
  </p>
</div>

             </div>

        <div class="configuration-preview-column">
          <span class="configuration-preview-label">
            VISTA PREVIA DEL MENSAJE
          </span>

          <div
            class="configuration-discord-preview"
            id="interactionMessagePreview"
          >
            <div
              class="configuration-preview-embed"
              id="interactionMessagePreviewEmbed"
              style="--preview-color:${i.interactionColor||"#8b5cf6"};"
            >
              <strong id="interactionPreviewTitle">
                ${b(i.interactionTitle||"🔒 Verificá tu cuenta")}
              </strong>

              <p id="interactionPreviewMessage">${b(i.interactionMessage||`¡Hola Usuario! 👋

Presioná el botón de abajo para verificar tu cuenta de forma rápida y segura.

El enlace es personal y solo puede utilizarse una vez.

Si no solicitaste esto, ignorá este mensaje.`)}</p>

              <img
                id="interactionPreviewImage"
                class="configuration-preview-image"
                src="${y(i.interactionImage||"")}"
                alt=""
                ${i.interactionImage?"":'style="display:none;"'}
              >
            </div>

            <button
              class="configuration-preview-button"
              id="interactionPreviewButton"
              type="button"
            >
              ${b(i.interactionButtonText||"Verificar mi cuenta")}
            </button>
          </div>
        </div>

      </div>
    </article>

    <!-- ===================================================
         2. MENSAJE DESPUÉS DE VERIFICAR
         =================================================== -->

    <article class="section-panel configuration-flow-card">
      <div class="configuration-flow-header">
        <div>
          <h3>
            2. Mensaje después de verificar
          </h3>

          <p>
            Este es el mensaje que verá el usuario en la página web
            cuando complete correctamente la verificación.
          </p>
        </div>
      </div>

      <div class="configuration-editor-layout">

        <div class="configuration-editor-fields">

          <label class="welcome-field">
            <span>TÍTULO DEL MENSAJE</span>

            <input
              id="verifySuccessTitle"
              maxlength="256"
              value="${y(i.successTitle||"✅ Verificación completada")}"
            >
          </label>

          <label class="welcome-field">
            <span>DESCRIPCIÓN DEL MENSAJE</span>

            <textarea
              id="verifySuccessMessage"
              rows="7"
              maxlength="1000"
            >${b(i.successMessage||`Tu cuenta fue verificada correctamente.

¡Bienvenido a {servidor}!

Ya podés acceder a todos los canales.`)}</textarea>
          </label>

        </div>

        <div class="configuration-editor-options">

          <label class="welcome-field">
            <span>COLOR</span>

            <div class="welcome-color-row">
              <input
                id="verifySuccessColor"
                type="color"
                value="${i.successColor||"#22c55e"}"
              >

              <input
                id="verifySuccessColorText"
                maxlength="7"
                value="${y(i.successColor||"#22c55e")}"
              >
            </div>
          </label>

          <label class="welcome-field">
            <span>ANIMACIÓN DE ÉXITO</span>

            <select id="verifySuccessAnimation">
              <option value="check">
                Confirmación
              </option>

              <option value="confetti">
                Confeti
              </option>

              <option value="none">
                Sin animación
              </option>
            </select>
          </label>

          ${p("verifyShowCountdown","Mostrar cuenta regresiva","Muestra los segundos antes de cerrar o redirigir.",i.showCountdown!==!1)}

          ${p("verifyClosePageEnabled","Cerrar página automáticamente","Intenta cerrar la página al finalizar.",!!i.closePageEnabled)}

        </div>

        <div class="configuration-preview-column">
          <span class="configuration-preview-label">
            VISTA PREVIA
          </span>

          <div class="configuration-success-preview">
            <div
              class="configuration-success-icon"
              id="successPreviewIcon"
            >
              ✓
            </div>

            <strong id="successPreviewTitle">
              ${b(i.successTitle||"Verificación completada")}
            </strong>

            <p id="successPreviewMessage">${b(i.successMessage||`Tu cuenta fue verificada correctamente.

¡Bienvenido al servidor!

Ya podés acceder a todos los canales.`)}</p>

            <small>
              Redirigiendo en 3 segundos...
            </small>

            <div class="configuration-progress-track">
              <span></span>
            </div>
          </div>
        </div>

      </div>
    </article>

    <!-- ===================================================
         3. MENSAJE PRIVADO DESPUÉS DE VERIFICAR
         =================================================== -->

    <article class="section-panel configuration-flow-card">
      <div class="configuration-flow-header">
        <div class="configuration-flow-title-row">
          <div>
            <h3>
              3. Mensaje privado (MD)
            </h3>

            <p>
              Este mensaje se enviará por privado al usuario
              después de verificar correctamente su cuenta.
            </p>
          </div>

          <span class="configuration-condition-badge">
            OPCIONAL
          </span>
        </div>
      </div>

      <div class="configuration-editor-layout">

        <div class="configuration-editor-fields">

          ${p("verifySuccessDmEnabled","Enviar mensaje privado","Envía un MD cuando el usuario completa la verificación.",!!i.successDmEnabled)}

          <label class="welcome-field">
            <span>TÍTULO DEL MENSAJE</span>

            <input
              id="verifySuccessDmTitle"
              maxlength="256"
              value="${y(i.successDmTitle||"🎉 ¡Verificado!")}"
            >
          </label>

          <label class="welcome-field">
            <span>DESCRIPCIÓN DEL MENSAJE</span>

            <textarea
              id="verifySuccessDmMessage"
              rows="7"
              maxlength="2000"
            >${b(i.successDmMessage||`¡Hola {usuario}! 🎉

Tu cuenta fue verificada correctamente en {servidor}.

Gracias por formar parte de nuestra comunidad.`)}</textarea>
          </label>

          <div class="configuration-variable-help">
            <span>Variables disponibles:</span>

            <code>{usuario}</code>
            <code>{servidor}</code>
            <code>{rol}</code>
            <code>{fecha}</code>
            <code>{hora}</code>
          </div>

        </div>

        <div class="configuration-editor-options">

          <label class="welcome-field">
            <span>COLOR DEL EMBED</span>

            <div class="welcome-color-row">
              <input
                id="verifySuccessDmColor"
                type="color"
                value="${i.successDmColor||"#3b82f6"}"
              >

              <input
                id="verifySuccessDmColorText"
                maxlength="7"
                value="${y(i.successDmColor||"#3b82f6")}"
              >
            </div>
          </label>

          <label class="welcome-field">
            <span>THUMBNAIL OPCIONAL</span>

            <input
              id="verifySuccessDmThumbnail"
              placeholder="https://i.imgur.com/imagen.png"
              value="${y(i.successDmThumbnail||"")}"
            >
          </label>

        </div>

        <div class="configuration-preview-column">
          <span class="configuration-preview-label">
            VISTA PREVIA DEL MD
          </span>

          <div class="configuration-discord-preview">
            <div
              class="configuration-preview-embed"
              id="successDmPreviewEmbed"
              style="--preview-color:${i.successDmColor||"#3b82f6"};"
            >
              <div class="configuration-dm-preview-head">
                <div>
                  <strong id="successDmPreviewTitle">
                    ${b(i.successDmTitle||"🎉 ¡Verificado!")}
                  </strong>

                  <p id="successDmPreviewMessage">${b(i.successDmMessage||`¡Hola Usuario! 🎉

Tu cuenta fue verificada correctamente en el servidor.

Gracias por formar parte de nuestra comunidad.`)}</p>
                </div>

                <img
                  id="successDmPreviewThumbnail"
                  class="configuration-preview-thumbnail"
                  src="${y(i.successDmThumbnail||"")}"
                  alt=""
                  ${i.successDmThumbnail?"":'style="display:none;"'}
                >
              </div>
            </div>
          </div>
        </div>

      </div>
    </article>

  </div>
</section>
      </div>

      <div
  class="variables-modal"
  id="variablesModal"
  aria-hidden="true"
>
  <div
    class="variables-modal-backdrop"
    data-close-variables
  ></div>

  <section
    class="variables-modal-dialog"
    role="dialog"
    aria-modal="true"
    aria-labelledby="variablesModalTitle"
  >
    <header class="variables-modal-header">
      <div>
        <span>
          VARIABLES DISPONIBLES
        </span>

        <h2 id="variablesModalTitle">
          Textos dinámicos
        </h2>

        <p>
          Presioná una variable para copiarla.
        </p>
      </div>

      <button
        class="variables-modal-close"
        data-close-variables
        type="button"
        aria-label="Cerrar variables"
      >
        ×
      </button>
    </header>

    <div class="variables-modal-search">
      <span>⌕</span>

      <input
        id="variablesSearch"
        type="search"
        placeholder="Buscar una variable..."
        autocomplete="off"
      >
    </div>

<div class="variables-modal-content">

  <aside class="variables-categories">

    <button
      type="button"
      class="variables-category active"
      data-variable-category="user"
    >
      <span>👤</span>
      Usuario
    </button>

    <button
      type="button"
      class="variables-category"
      data-variable-category="server"
    >
      <span>🌍</span>
      Servidor
    </button>

    <button
      type="button"
      class="variables-category"
      data-variable-category="roles"
    >
      <span>🛡️</span>
      Roles
    </button>

    <button
      type="button"
      class="variables-category"
      data-variable-category="channel"
    >
      <span>📢</span>
      Canal
    </button>

    <button
      type="button"
      class="variables-category"
      data-variable-category="bot"
    >
      <span>🤖</span>
      Bot
    </button>

    <button
      type="button"
      class="variables-category"
      data-variable-category="date"
    >
      <span>📅</span>
      Fecha y hora
    </button>

    <button
      type="button"
      class="variables-category"
      data-variable-category="verification"
    >
      <span>✅</span>
      Verificación
    </button>

    <button
      type="button"
      class="variables-category"
      data-variable-category="tickets"
    >
      <span>🎫</span>
      Tickets
    </button>

    <button
      type="button"
      class="variables-category"
      data-variable-category="moderation"
    >
      <span>👮</span>
      Moderación
    </button>

    <button
      type="button"
      class="variables-category"
      data-variable-category="web"
    >
      <span>🌐</span>
      Web
    </button>

    <button
      type="button"
      class="variables-category"
      data-variable-category="messages"
    >
      <span>💬</span>
      Mensajes
    </button>

    <button
      type="button"
      class="variables-category"
      data-variable-category="invites"
    >
      <span>🎉</span>
      Invitaciones
    </button>

    <button
      type="button"
      class="variables-category"
      data-variable-category="emojis"
    >
      <span>😀</span>
      Emojis
    </button>

    <button
      type="button"
      class="variables-category"
      data-variable-category="system"
    >
      <span>⚙️</span>
      Sistema
    </button>

    <button
      type="button"
      class="variables-category"
      data-variable-category="stats"
    >
      <span>📊</span>
      Estadísticas
    </button>

  </aside>

  <section class="variables-results">

    <div
      class="variables-modal-list"
      id="variablesModalList"
    >
    </div>

  </section>

</div>

<div
  class="variables-modal-empty"
  id="variablesModalEmpty"
  hidden
>
  No se encontraron variables.
</div>

<footer class="variables-modal-footer">

  <span>
    Después de copiar, pegala usando
    <kbd>Ctrl</kbd> + <kbd>V</kbd>
  </span>

  <button
    data-close-variables
    type="button"
  >
    Cerrar
  </button>
</footer>

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
  `;const l=r=>document.getElementById(r);async function de(r,c){try{if(navigator.clipboard&&window.isSecureContext)await navigator.clipboard.writeText(r);else{const v=document.createElement("textarea");v.value=r,v.setAttribute("readonly",""),v.style.position="fixed",v.style.opacity="0",document.body.appendChild(v),v.select();const S=document.execCommand("copy");if(v.remove(),!S)throw new Error("No se pudo copiar.")}const u=c.querySelector("b");c.classList.add("copied"),u&&(u.textContent="Copiado ✓"),F("Variable copiada",`${r} se copió correctamente.`),setTimeout(()=>{c.classList.remove("copied"),u&&(u.textContent="Copiar")},1500)}catch(u){console.error("Error copiando variable:",u),F("No se pudo copiar",`Copiá manualmente ${r}.`)}}const te=[{category:"user",key:"{user}",label:"Nombre del usuario"},{category:"user",key:"{username}",label:"Nombre de usuario"},{category:"user",key:"{displayname}",label:"Nombre visible"},{category:"user",key:"{globalname}",label:"Nombre global"},{category:"user",key:"{nickname}",label:"Apodo en el servidor"},{category:"user",key:"{mention}",label:"Mención del usuario"},{category:"user",key:"{userid}",label:"ID del usuario"},{category:"user",key:"{avatar}",label:"Avatar del usuario"},{category:"user",key:"{banner}",label:"Banner del usuario"},{category:"user",key:"{created}",label:"Fecha de creación de la cuenta"},{category:"user",key:"{joined}",label:"Fecha de ingreso al servidor"},{category:"user",key:"{joinedrelative}",label:"Tiempo desde que ingresó"},{category:"user",key:"{status}",label:"Estado del usuario"},{category:"user",key:"{activity}",label:"Actividad actual"},{category:"user",key:"{roles}",label:"Roles del usuario"},{category:"user",key:"{rolecount}",label:"Cantidad de roles"},{category:"user",key:"{highestrole}",label:"Rol más alto"},{category:"user",key:"{permissions}",label:"Permisos del usuario"},{category:"user",key:"{boosting}",label:"Estado de boost"},{category:"server",key:"{server}",label:"Nombre del servidor"},{category:"server",key:"{serverid}",label:"ID del servidor"},{category:"server",key:"{servericon}",label:"Icono del servidor"},{category:"server",key:"{serverbanner}",label:"Banner del servidor"},{category:"server",key:"{serverdescription}",label:"Descripción del servidor"},{category:"server",key:"{owner}",label:"Propietario del servidor"},{category:"server",key:"{ownerid}",label:"ID del propietario"},{category:"server",key:"{membercount}",label:"Cantidad de miembros"},{category:"server",key:"{members}",label:"Cantidad de miembros"},{category:"server",key:"{bots}",label:"Cantidad de bots"},{category:"server",key:"{humans}",label:"Cantidad de usuarios reales"},{category:"server",key:"{online}",label:"Miembros conectados"},{category:"server",key:"{offline}",label:"Miembros desconectados"},{category:"server",key:"{boosts}",label:"Cantidad de boosts"},{category:"server",key:"{boostlevel}",label:"Nivel de boost"},{category:"server",key:"{verificationlevel}",label:"Nivel de verificación"},{category:"server",key:"{channels}",label:"Cantidad de canales"},{category:"server",key:"{textchannels}",label:"Canales de texto"},{category:"server",key:"{voicechannels}",label:"Canales de voz"},{category:"server",key:"{categories}",label:"Cantidad de categorías"},{category:"server",key:"{rolescount}",label:"Cantidad de roles"},{category:"server",key:"{emojis}",label:"Cantidad de emojis"},{category:"server",key:"{stickers}",label:"Cantidad de stickers"},{category:"server",key:"{createdserver}",label:"Fecha de creación del servidor"},{category:"roles",key:"{role}",label:"Nombre del rol entregado"},{category:"roles",key:"{roleid}",label:"ID del rol entregado"},{category:"roles",key:"{rolename}",label:"Nombre del rol"},{category:"roles",key:"{rolecolor}",label:"Color del rol"},{category:"roles",key:"{roleicon}",label:"Icono del rol"},{category:"roles",key:"{highestrole}",label:"Rol más alto"},{category:"roles",key:"{lowestrole}",label:"Rol más bajo"},{category:"roles",key:"{autorole}",label:"Rol automático"},{category:"channel",key:"{channel}",label:"Canal actual"},{category:"channel",key:"{channelid}",label:"ID del canal"},{category:"channel",key:"{channelmention}",label:"Mención del canal"},{category:"channel",key:"{channeltopic}",label:"Tema del canal"},{category:"channel",key:"{category}",label:"Categoría del canal"},{category:"channel",key:"{categoryid}",label:"ID de la categoría"},{category:"channel",key:"{thread}",label:"Nombre del hilo"},{category:"channel",key:"{threadid}",label:"ID del hilo"},{category:"channel",key:"{slowmode}",label:"Modo lento"},{category:"channel",key:"{channeltype}",label:"Tipo de canal"},{category:"bot",key:"{bot}",label:"Nombre del bot"},{category:"bot",key:"{botid}",label:"ID del bot"},{category:"bot",key:"{botavatar}",label:"Avatar del bot"},{category:"bot",key:"{botversion}",label:"Versión del bot"},{category:"bot",key:"{latency}",label:"Latencia del bot"},{category:"bot",key:"{ping}",label:"Ping del bot"},{category:"bot",key:"{uptime}",label:"Tiempo activo"},{category:"bot",key:"{commands}",label:"Cantidad de comandos"},{category:"bot",key:"{servers}",label:"Cantidad de servidores"},{category:"bot",key:"{users}",label:"Cantidad de usuarios"},{category:"bot",key:"{memory}",label:"Memoria usada"},{category:"bot",key:"{cpu}",label:"Uso del procesador"},{category:"bot",key:"{node}",label:"Versión de Node.js"},{category:"bot",key:"{library}",label:"Librería utilizada"},{category:"date",key:"{date}",label:"Fecha actual"},{category:"date",key:"{time}",label:"Hora actual"},{category:"date",key:"{datetime}",label:"Fecha y hora actual"},{category:"date",key:"{timestamp}",label:"Marca de tiempo"},{category:"date",key:"{year}",label:"Año actual"},{category:"date",key:"{month}",label:"Número del mes"},{category:"date",key:"{monthname}",label:"Nombre del mes"},{category:"date",key:"{day}",label:"Día actual"},{category:"date",key:"{weekday}",label:"Día de la semana"},{category:"date",key:"{hour}",label:"Hora"},{category:"date",key:"{minute}",label:"Minuto"},{category:"date",key:"{second}",label:"Segundo"},{category:"date",key:"{timezone}",label:"Zona horaria"},{category:"date",key:"{unix}",label:"Tiempo Unix"},{category:"date",key:"{shortdate}",label:"Fecha corta"},{category:"date",key:"{longdate}",label:"Fecha completa"},{category:"verification",key:"{verifylink}",label:"Enlace de verificación"},{category:"verification",key:"{verificationcode}",label:"Código de verificación"},{category:"verification",key:"{verificationid}",label:"ID de verificación"},{category:"verification",key:"{verificationmethod}",label:"Método de verificación"},{category:"verification",key:"{verificationrole}",label:"Rol de verificación"},{category:"verification",key:"{verificationchannel}",label:"Canal de verificación"},{category:"verification",key:"{verificationtime}",label:"Hora de verificación"},{category:"verification",key:"{verificationdate}",label:"Fecha de verificación"},{category:"verification",key:"{verifyexpires}",label:"Vencimiento del enlace"},{category:"verification",key:"{verified}",label:"Estado de verificación"},{category:"verification",key:"{verifybrowser}",label:"Navegador utilizado"},{category:"verification",key:"{verifyos}",label:"Sistema operativo"},{category:"verification",key:"{verifydevice}",label:"Dispositivo utilizado"},{category:"verification",key:"{verifycountry}",label:"País aproximado"},{category:"verification",key:"{verifycity}",label:"Ciudad aproximada"},{category:"verification",key:"{verifylanguage}",label:"Idioma del navegador"},{category:"verification",key:"{verifyisp}",label:"Proveedor de internet"},{category:"tickets",key:"{ticket}",label:"Nombre del ticket"},{category:"tickets",key:"{ticketid}",label:"ID del ticket"},{category:"tickets",key:"{ticketnumber}",label:"Número del ticket"},{category:"tickets",key:"{ticketowner}",label:"Creador del ticket"},{category:"tickets",key:"{ticketownerid}",label:"ID del creador"},{category:"tickets",key:"{ticketcategory}",label:"Categoría del ticket"},{category:"tickets",key:"{ticketreason}",label:"Motivo del ticket"},{category:"tickets",key:"{ticketcreated}",label:"Fecha de creación"},{category:"tickets",key:"{ticketclosed}",label:"Fecha de cierre"},{category:"tickets",key:"{ticketclosedby}",label:"Cerrado por"},{category:"tickets",key:"{ticketmessages}",label:"Cantidad de mensajes"},{category:"tickets",key:"{ticketclaim}",label:"Miembro del staff asignado"},{category:"tickets",key:"{ticketpriority}",label:"Prioridad"},{category:"tickets",key:"{ticketstatus}",label:"Estado del ticket"},{category:"moderation",key:"{moderator}",label:"Moderador responsable"},{category:"moderation",key:"{moderatorid}",label:"ID del moderador"},{category:"moderation",key:"{reason}",label:"Motivo"},{category:"moderation",key:"{duration}",label:"Duración"},{category:"moderation",key:"{case}",label:"Número de caso"},{category:"moderation",key:"{warns}",label:"Cantidad de advertencias"},{category:"moderation",key:"{bans}",label:"Cantidad de baneos"},{category:"moderation",key:"{kicks}",label:"Cantidad de expulsiones"},{category:"moderation",key:"{timeouts}",label:"Cantidad de aislamientos"},{category:"moderation",key:"{punishment}",label:"Tipo de sanción"},{category:"moderation",key:"{appeal}",label:"Apelación"},{category:"moderation",key:"{appealid}",label:"ID de apelación"},{category:"moderation",key:"{appealstatus}",label:"Estado de apelación"},{category:"web",key:"{ip}",label:"Dirección IP"},{category:"web",key:"{country}",label:"País aproximado"},{category:"web",key:"{city}",label:"Ciudad aproximada"},{category:"web",key:"{region}",label:"Región aproximada"},{category:"web",key:"{timezone}",label:"Zona horaria"},{category:"web",key:"{browser}",label:"Navegador"},{category:"web",key:"{browserversion}",label:"Versión del navegador"},{category:"web",key:"{os}",label:"Sistema operativo"},{category:"web",key:"{osversion}",label:"Versión del sistema"},{category:"web",key:"{device}",label:"Dispositivo"},{category:"web",key:"{platform}",label:"Plataforma"},{category:"web",key:"{language}",label:"Idioma"},{category:"web",key:"{resolution}",label:"Resolución de pantalla"},{category:"web",key:"{isp}",label:"Proveedor de internet"},{category:"messages",key:"{message}",label:"Contenido del mensaje"},{category:"messages",key:"{messageid}",label:"ID del mensaje"},{category:"messages",key:"{author}",label:"Autor del mensaje"},{category:"messages",key:"{authorid}",label:"ID del autor"},{category:"messages",key:"{reply}",label:"Mensaje respondido"},{category:"messages",key:"{attachments}",label:"Cantidad de archivos"},{category:"messages",key:"{embeds}",label:"Cantidad de embeds"},{category:"messages",key:"{mentions}",label:"Menciones"},{category:"messages",key:"{wordcount}",label:"Cantidad de palabras"},{category:"messages",key:"{characters}",label:"Cantidad de caracteres"},{category:"messages",key:"{lines}",label:"Cantidad de líneas"},{category:"messages",key:"{jumpurl}",label:"Enlace al mensaje"},{category:"invites",key:"{invite}",label:"Enlace de invitación"},{category:"invites",key:"{invitecode}",label:"Código de invitación"},{category:"invites",key:"{inviter}",label:"Creador de la invitación"},{category:"invites",key:"{inviterid}",label:"ID del creador"},{category:"invites",key:"{uses}",label:"Cantidad de usos"},{category:"invites",key:"{maxuses}",label:"Máximo de usos"},{category:"invites",key:"{expires}",label:"Fecha de vencimiento"},{category:"invites",key:"{temporary}",label:"Invitación temporal"},{category:"emojis",key:"{emoji}",label:"Emoji"},{category:"emojis",key:"{emojiid}",label:"ID del emoji"},{category:"emojis",key:"{emojiurl}",label:"URL del emoji"},{category:"emojis",key:"{success}",label:"Emoji de éxito"},{category:"emojis",key:"{error}",label:"Emoji de error"},{category:"emojis",key:"{warning}",label:"Emoji de advertencia"},{category:"emojis",key:"{info}",label:"Emoji de información"},{category:"system",key:"{newline}",label:"Salto de línea"},{category:"system",key:"{space}",label:"Espacio"},{category:"system",key:"{separator}",label:"Separador"},{category:"system",key:"{tab}",label:"Tabulación"},{category:"system",key:"{version}",label:"Versión"},{category:"system",key:"{dashboardversion}",label:"Versión del dashboard"},{category:"system",key:"{build}",label:"Versión de compilación"},{category:"system",key:"{environment}",label:"Entorno"},{category:"system",key:"{random}",label:"Texto aleatorio"},{category:"system",key:"{randomnumber}",label:"Número aleatorio"},{category:"system",key:"{randomcolor}",label:"Color aleatorio"},{category:"system",key:"{uuid}",label:"Identificador único"},{category:"system",key:"{domain}",label:"Dominio del dashboard"},{category:"system",key:"{url}",label:"URL actual"},{category:"stats",key:"{totalusers}",label:"Usuarios totales"},{category:"stats",key:"{totalservers}",label:"Servidores totales"},{category:"stats",key:"{totalchannels}",label:"Canales totales"},{category:"stats",key:"{totalroles}",label:"Roles totales"},{category:"stats",key:"{totalbots}",label:"Bots totales"},{category:"stats",key:"{verificationstoday}",label:"Verificaciones de hoy"},{category:"stats",key:"{verificationstotal}",label:"Verificaciones totales"},{category:"stats",key:"{ticketsopen}",label:"Tickets abiertos"},{category:"stats",key:"{ticketsclosed}",label:"Tickets cerrados"},{category:"stats",key:"{commandsused}",label:"Comandos utilizados"},{category:"stats",key:"{joins}",label:"Ingresos"},{category:"stats",key:"{leaves}",label:"Salidas"},{category:"stats",key:"{uptimepercent}",label:"Porcentaje de actividad"}],P=l("variablesModal"),M=l("variablesSearch"),Le=l("variablesModalEmpty"),ae=l("variablesModalList"),ie=document.querySelectorAll("[data-variable-category]");let be="user";function ue(){if(!ae)return;const r=String(M?.value||"").trim().toLowerCase(),c=te.filter(v=>{const S=v.category===be,$=`${v.key} ${v.label}`.toLowerCase(),L=!r||$.includes(r);return S&&L});ae.innerHTML=c.map(v=>`
        <button
          class="verify-variable-button"
          data-copy-variable="${y(v.key)}"
          data-variable-search="${y(`${v.key} ${v.label}`)}"
          type="button"
        >
          <code>
            ${b(v.key)}
          </code>

          <span>
            ${b(v.label)}
          </span>

          <b>
            Copiar
          </b>
        </button>
      `).join("");const u=c.length>0;Le&&(Le.hidden=u,Le.classList.toggle("visible",!u))}function Ve(r){M&&(M.value=String(r||"")),ue()}ie.forEach(r=>{r.addEventListener("click",c=>{c.preventDefault(),c.stopPropagation(),be=r.dataset.variableCategory||"user",ie.forEach(u=>{u.classList.toggle("active",u===r)}),ue()})}),ae?.addEventListener("click",r=>{const c=r.target.closest("[data-copy-variable]");c&&(r.preventDefault(),r.stopPropagation(),de(c.dataset.copyVariable,c))}),ue(),P?.addEventListener("wheel",r=>{const c=r.target.closest(".variables-categories, .variables-results");if(!c){r.preventDefault();return}const u=r.deltaY<0,v=r.deltaY>0,S=c.scrollTop<=0,$=Math.ceil(c.scrollTop+c.clientHeight)>=c.scrollHeight;(u&&S||v&&$)&&r.preventDefault()},{passive:!1});function Ue(){P&&(P.classList.add("open"),P.setAttribute("aria-hidden","false"),document.body.classList.add("variables-modal-open"),M&&(M.value=""),be="user",ie.forEach(r=>{r.classList.toggle("active",r.dataset.variableCategory==="user")}),ue(),M&&setTimeout(()=>{M.focus()},150))}function xe(){P&&(P.classList.remove("open"),P.setAttribute("aria-hidden","true"),document.body.classList.remove("variables-modal-open"))}document.querySelectorAll("[data-open-variables]").forEach(r=>{r.addEventListener("click",c=>{c.preventDefault(),c.stopPropagation(),Ue()})}),document.querySelectorAll("[data-close-variables]").forEach(r=>{r.addEventListener("click",c=>{c.preventDefault(),c.stopPropagation(),xe()})}),document.querySelectorAll("[data-copy-variable]").forEach(r=>{r.addEventListener("click",c=>{c.preventDefault(),c.stopPropagation(),de(r.dataset.copyVariable,r)})}),M?.addEventListener("input",r=>{Ve(r.target.value)}),document.addEventListener("keydown",r=>{r.key==="Escape"&&P?.classList.contains("open")&&xe()});const F=(r,c)=>{R.querySelector("strong").textContent=r,R.querySelector("p").textContent=c,ee()};document.querySelectorAll("[data-copy-variable]").forEach(r=>{r.addEventListener("click",c=>{c.preventDefault(),c.stopPropagation();const u=r.dataset.copyVariable;u&&de(u,r)})});const qe=()=>document.querySelector('input[name="verificationMethod"]:checked')?.value||"oauth_link",je=()=>{const r={};return Object.keys(n).forEach(c=>{r[c]=!!l(`verifyLog_${c}`)?.checked}),r},se=r=>nt(r),pe=()=>{const r=l("verifyEmbedTitle"),c=l("verifyEmbedDescription"),u=l("verifyEmbedColor"),v=l("verifyButtonText"),S=l("verifyButtonEmoji"),$=l("verifyEmbedFieldName"),L=l("verifyEmbedFieldValue"),K=l("verifyEmbedFooterText"),_=l("verifyEmbedThumbnailUrl"),A=l("verifyEmbedImageUrl"),G=l("verifyPreviewEmbed");if(!G)return;const ye=l("verifyPreviewTitle"),re=l("verifyPreviewDescription"),V=l("verifyPreviewFieldName"),Pe=l("verifyPreviewFieldValue"),Ae=l("verifyPreviewButtonText"),$e=l("verifyPreviewButtonEmoji"),Ut=l("verifyPreviewFooterText"),qt=l("verifyPreviewAuthor"),Ie=l("verifyPreviewThumbnail"),We=l("verifyPreviewImage"),jt=l("verifyPreviewTimestamp");if(ye&&(ye.textContent=se(r?.value||"🔒 Verificación requerida")),re&&(re.textContent=se(c?.value||"Presioná el botón para verificarte.")),V&&(V.textContent=se($?.value||"📌 Servidor")),Pe&&(Pe.textContent=se(L?.value||"{server}")),Ae&&(Ae.textContent=v?.value||"Verificar con Discord"),$e&&($e.textContent=S?.value||""),Ut&&(Ut.textContent=se(K?.value||"Nebula Security")),G.style.setProperty("--preview-embed-color",u?.value||"#8b5cf6"),qt&&(qt.style.display=l("verifyShowBotAvatar")?.checked?"flex":"none"),Ie){const Ft=!!l("verifyShowCustomThumbnail")?.checked,ga=!!l("verifyShowServerIcon")?.checked;Ft&&_?.value?(Ie.src=_.value,Ie.style.display="block"):ga&&Ie.src?Ie.style.display="block":Ie.style.display="none"}We&&(!!l("verifyShowEmbedImage")?.checked&&A?.value?(We.src=A.value,We.style.display="block"):We.style.display="none"),jt&&(jt.style.display=l("verifyShowTimestamp")?.checked?"inline":"none")},Ee=()=>{const r=document.getElementById("verifySuccessTitle"),c=document.getElementById("verifySuccessMessage"),u=document.getElementById("verifySuccessColor"),v=document.getElementById("verifySuccessAnimation"),S=document.getElementById("verifyShowCountdown"),$=document.getElementById("verifyClosePageEnabled"),L=document.querySelector(".configuration-success-preview"),K=document.getElementById("successPreviewTitle"),_=document.getElementById("successPreviewMessage"),A=document.getElementById("successPreviewIcon"),G=L?.querySelector("small"),ye=L?.querySelector(".configuration-progress-track");if(!r||!c||!u||!L||!K||!_||!A)return;const re=a?.name||"servidor";K.textContent=r.value.trim()||"Verificación completada",_.textContent=(c.value.trim()||"Tu cuenta fue verificada correctamente.").replaceAll("{servidor}",re).replaceAll("{server}",re);const V=/^#[0-9a-f]{6}$/i.test(u.value)?u.value:"#22c55e";L.style.setProperty("--success-color",V),A.style.setProperty("background-color",V,"important"),A.style.setProperty("border-color",V,"important"),A.style.setProperty("box-shadow",`0 0 28px ${V}88`,"important"),A.style.color="#ffffff";const Pe=L.querySelector(".configuration-progress-track span");Pe&&Pe.style.setProperty("background-color",V,"important");const Ae=v?.value||"check";L.dataset.animation=Ae,Ae==="none"?A.style.display="none":(A.style.display="grid",A.textContent=Ae==="confetti"?"🎉":"✓");const $e=S?.checked!==!1;G&&(G.style.display=$e?"":"none",G.textContent=$?.checked?"Cerrando en 3 segundos...":"Redirigiendo en 3 segundos..."),ye&&(ye.style.display=$e?"":"none")};["verifySuccessTitle","verifySuccessMessage","verifySuccessColor"].forEach(r=>{document.getElementById(r)?.addEventListener("input",Ee)}),["verifySuccessAnimation","verifyShowCountdown","verifyClosePageEnabled"].forEach(r=>{document.getElementById(r)?.addEventListener("change",Ee)}),Ee();const D=r=>String(r||"").replaceAll("{usuario}","Usuario de ejemplo").replaceAll("{servidor}","Servidor de ejemplo").replaceAll("{rol}","✓ Verificado").replaceAll("{fecha}",new Date().toLocaleDateString("es-AR")).replaceAll("{hora}",new Date().toLocaleTimeString("es-AR",{hour:"2-digit",minute:"2-digit"})),N=()=>{const r=document.getElementById("verifySuccessDmEnabled"),c=document.getElementById("verifySuccessDmTitle"),u=document.getElementById("verifySuccessDmMessage"),v=document.getElementById("verifySuccessDmColor"),S=document.getElementById("verifySuccessDmColorText"),$=document.getElementById("verifySuccessDmThumbnail"),L=document.getElementById("successDmPreviewEmbed"),K=document.getElementById("successDmPreviewTitle"),_=document.getElementById("successDmPreviewMessage"),A=document.getElementById("successDmPreviewThumbnail");if(!L||!K||!_||!A)return;const G=c?.value||"🎉 ¡Verificado!",ye=u?.value||`¡Hola {usuario}! 🎉

Tu cuenta fue verificada correctamente en {servidor}.

Gracias por formar parte de nuestra comunidad.`,re=v?.value||"#3b82f6",V=String($?.value||"").trim();K.textContent=D(G),_.textContent=D(ye),L.style.setProperty("--preview-color",re),S&&(S.value=re),V&&/^https?:\/\//i.test(V)?(A.src=V,A.style.display=""):(A.removeAttribute("src"),A.style.display="none"),L.style.opacity=r?.checked?"1":"0.45"};["verifySuccessDmTitle","verifySuccessDmMessage","verifySuccessDmThumbnail"].forEach(r=>{document.getElementById(r)?.addEventListener("input",N)}),document.getElementById("verifySuccessDmEnabled")?.addEventListener("change",N),document.getElementById("verifySuccessDmColor")?.addEventListener("input",r=>{const c=document.getElementById("verifySuccessDmColorText");c&&(c.value=r.target.value),N()}),document.getElementById("verifySuccessDmColorText")?.addEventListener("input",r=>{const c=r.target.value.trim();if(/^#[0-9a-f]{6}$/i.test(c)){const u=document.getElementById("verifySuccessDmColor");u&&(u.value=c),N()}}),N();const ve=()=>({enabled:l("verifyEnabled").checked,verificationChannelId:l("verifyChannel").value,logsChannelId:l("verifyLogs").value,verifiedRoleId:l("verifyRole").value,verificationMethod:qe(),embedTitle:l("verifyEmbedTitle").value,embedDescription:l("verifyEmbedDescription").value,embedColor:l("verifyEmbedColor").value,buttonText:l("verifyButtonText").value,buttonEmoji:l("verifyButtonEmoji").value,reactionEmoji:l("verifyReactionEmoji").value,interactionTitle:l("verifyInteractionTitle").value,interactionMessage:l("verifyInteractionMessage").value,interactionColor:l("verifyInteractionColor").value,interactionImage:l("verifyInteractionImage").value,interactionButtonEmoji:l("verifyInteractionButtonEmoji").value,interactionButtonText:l("verifyInteractionButtonText").value,successTitle:l("verifySuccessTitle").value,successMessage:l("verifySuccessMessage").value,successColor:l("verifySuccessColor").value,successAnimation:l("verifySuccessAnimation").value,showCountdown:l("verifyShowCountdown").checked,closePageEnabled:l("verifyClosePageEnabled").checked,successDmEnabled:l("verifySuccessDmEnabled").checked,successDmTitle:l("verifySuccessDmTitle").value,successDmMessage:l("verifySuccessDmMessage").value,successDmColor:l("verifySuccessDmColor").value,successDmThumbnail:l("verifySuccessDmThumbnail").value,embedFieldName:l("verifyEmbedFieldName").value,embedFieldValue:l("verifyEmbedFieldValue").value,embedFooterText:l("verifyEmbedFooterText").value,embedThumbnailUrl:l("verifyEmbedThumbnailUrl").value,embedImageUrl:l("verifyEmbedImageUrl").value,showBotAvatar:l("verifyShowBotAvatar").checked,showServerIcon:l("verifyShowServerIcon").checked,showCustomThumbnail:l("verifyShowCustomThumbnail").checked,showEmbedImage:l("verifyShowEmbedImage").checked,showTimestamp:l("verifyShowTimestamp").checked,logEmbedTitle:l("verifyLogTitle").value,logEmbedDescription:l("verifyLogDescription").value,logEmbedColor:l("verifyLogColor").value,logOptions:je(),webAppearance:_t(),security:{detectVpn:l("verifyDetectVpn").checked,detectProxy:l("verifyDetectProxy").checked,detectTor:l("verifyDetectTor").checked,blockHosting:l("verifyBlockHosting").checked,detectAltAccounts:l("verifyDetectAltAccounts").checked,minimumAccountAgeEnabled:l("verifyMinimumAgeEnabled").checked,minimumAccountAgeDays:Number(l("verifyMinimumAgeDays").value),blockWithoutAvatar:l("verifyBlockWithoutAvatar").checked,blockWithoutBanner:l("verifyBlockWithoutBanner").checked,allowReverification:l("verifyAllowReverification").checked,notifySecurityFailure:l("verifyNotifySecurityFailure").checked}});["verifyEmbedTitle","verifyEmbedDescription","verifyEmbedColor","verifyEmbedColorText","verifyButtonText","verifyButtonEmoji","verifyEmbedFieldName","verifyEmbedFieldValue","verifyEmbedFooterText","verifyEmbedThumbnailUrl","verifyEmbedImageUrl","verifyShowBotAvatar","verifyShowServerIcon","verifyShowCustomThumbnail","verifyShowEmbedImage","verifyShowTimestamp","verifyRole","verifyChannel"].forEach(r=>{const c=l(r);if(!c)return;const u=c.type==="checkbox"?"change":"input";c.addEventListener(u,pe)}),l("verifyEmbedColor")?.addEventListener("input",r=>{l("verifyEmbedColorText").value=r.target.value,pe()}),l("verifyEmbedColorText")?.addEventListener("input",r=>{const c=r.target.value.trim();/^#[0-9a-f]{6}$/i.test(c)&&(l("verifyEmbedColor").value=c,pe())}),pe();const we=l("interactionMessageConfiguration"),Ne=document.querySelectorAll('input[name="verificationMethod"]');function Ce(){const r=document.querySelector('input[name="verificationMethod"]:checked')?.value||"oauth_link";we&&(we.style.display=r==="interaction_button"?"":"none")}Ne.forEach(r=>{r.addEventListener("change",Ce)}),Ce();const Ge=l("verifyInteractionTitle"),me=l("verifyInteractionMessage"),Se=l("verifyInteractionColor"),oe=l("verifyInteractionColorText"),Re=l("verifyInteractionImage"),f=l("verifyInteractionButtonEmoji"),g=l("verifyInteractionButtonText"),C=l("interactionPreviewTitle"),k=l("interactionPreviewMessage"),W=l("interactionMessagePreviewEmbed"),J=l("interactionPreviewImage"),He=l("interactionPreviewButton");function nt(r){const c=new Date,u=l("verifyRole")?.selectedOptions?.[0]?.textContent?.trim()||"Miembro verificado",v=l("verifyChannel")?.selectedOptions?.[0]?.textContent?.trim()||"#verificación",S=a?.name||"Servidor de ejemplo",$=String(a?.id||"123456789012345678"),L=String(a?.ownerId||"123456789012345678"),K=Number(a?.memberCount||a?.members||1248).toLocaleString("es-AR"),_={"{usuario}":"Usuario","{servidor}":S,"{rol}":u,"{fecha}":c.toLocaleDateString("es-AR"),"{hora}":c.toLocaleTimeString("es-AR",{hour:"2-digit",minute:"2-digit"}),"{user}":"Usuario","{username}":"usuario","{displayname}":"Usuario de ejemplo","{globalname}":"Usuario de ejemplo","{nickname}":"Usuario","{mention}":"@Usuario","{userid}":"123456789012345678","{avatar}":"https://cdn.discordapp.com/avatar.png","{banner}":"https://cdn.discordapp.com/banner.png","{created}":"15/03/2024","{joined}":"10/07/2026","{joinedrelative}":"hace 7 días","{status}":"En línea","{activity}":"Usando Nebula","{roles}":`${u}, Miembro`,"{rolecount}":"2","{highestrole}":u,"{lowestrole}":"Miembro","{permissions}":"Ver canales, enviar mensajes","{boosting}":"No","{server}":S,"{serverid}":$,"{servericon}":a?.icon||"Icono del servidor","{serverbanner}":a?.banner||"Banner del servidor","{serverdescription}":a?.description||"Comunidad protegida por Nebula","{owner}":"Propietario","{ownerid}":L,"{membercount}":K,"{members}":K,"{bots}":"24","{humans}":"1.224","{online}":"386","{offline}":"862","{boosts}":"18","{boostlevel}":"Nivel 2","{verificationlevel}":"Medio","{channels}":"48","{textchannels}":"32","{voicechannels}":"10","{categories}":"6","{rolescount}":"14","{emojis}":"42","{stickers}":"8","{createdserver}":"20/05/2024","{role}":u,"{roleid}":"123456789012345678","{rolename}":u,"{rolecolor}":"#ffffff","{roleicon}":"🛡️","{autorole}":u,"{channel}":v,"{channelid}":"123456789012345678","{channelmention}":v,"{channeltopic}":"Canal de verificación","{category}":"INFORMACIÓN","{categoryid}":"123456789012345678","{thread}":"Hilo de ejemplo","{threadid}":"123456789012345678","{slowmode}":"Desactivado","{channeltype}":"Canal de texto","{bot}":"Nebula Bot","{botid}":"123456789012345678","{botavatar}":"Avatar de Nebula","{botversion}":"2.0.0","{latency}":"38 ms","{ping}":"38 ms","{uptime}":"30 días","{commands}":"24","{servers}":"12","{users}":"8.745","{memory}":"86 MB","{cpu}":"2.3%","{node}":"Node.js 22","{library}":"Discord.js v14","{date}":c.toLocaleDateString("es-AR"),"{time}":c.toLocaleTimeString("es-AR",{hour:"2-digit",minute:"2-digit"}),"{datetime}":c.toLocaleString("es-AR"),"{timestamp}":String(c.getTime()),"{year}":String(c.getFullYear()),"{month}":String(c.getMonth()+1),"{monthname}":c.toLocaleDateString("es-AR",{month:"long"}),"{day}":String(c.getDate()),"{weekday}":c.toLocaleDateString("es-AR",{weekday:"long"}),"{hour}":String(c.getHours()).padStart(2,"0"),"{minute}":String(c.getMinutes()).padStart(2,"0"),"{second}":String(c.getSeconds()).padStart(2,"0"),"{timezone}":Intl.DateTimeFormat().resolvedOptions().timeZone,"{unix}":String(Math.floor(c.getTime()/1e3)),"{shortdate}":c.toLocaleDateString("es-AR"),"{longdate}":c.toLocaleDateString("es-AR",{weekday:"long",year:"numeric",month:"long",day:"numeric"}),"{verifylink}":`${window.location.origin}/verify`,"{verificationcode}":"NEBULA-4821","{verificationid}":"VER-123456","{verificationmethod}":"Botón de enlace","{verificationrole}":u,"{verificationchannel}":v,"{verificationtime}":c.toLocaleTimeString("es-AR"),"{verificationdate}":c.toLocaleDateString("es-AR"),"{verifyexpires}":"20 minutos","{verified}":"Verificado","{verifybrowser}":"Chrome","{verifyos}":"Windows 11","{verifydevice}":"Computadora","{verifycountry}":"Argentina","{verifycity}":"El Colorado","{verifylanguage}":navigator.language||"es-AR","{verifyisp}":"Proveedor de internet","{newline}":`
`,"{space}":" ","{separator}":"────────────","{tab}":"    ","{version}":"2.0.0","{dashboardversion}":"2.0.0","{build}":"Producción","{environment}":"Dashboard","{random}":"Nebula","{randomnumber}":String(Math.floor(Math.random()*1e3)),"{randomcolor}":"#ffffff","{uuid}":"550e8400-e29b-41d4-a716-446655440000","{domain}":window.location.hostname,"{url}":window.location.href};return te.forEach(A=>{const G=A.key.toLowerCase();_[G]===void 0&&(_[G]=`${A.label} — ejemplo`)}),String(r||"").replace(/\{[a-z0-9]+\}/gi,A=>_[A.toLowerCase()]??A)}function ha(r){return/^#[0-9A-Fa-f]{6}$/.test(String(r||""))}function ze(){if(!C||!k||!W||!He)return;const r=nt(Ge?.value||"🔒 Verificá tu cuenta"),c=nt(me?.value||"Presioná el botón para verificarte.");C.textContent=r,k.textContent=c;const u=Se?.value||"#ffffff";W.style.setProperty("--preview-color",u),oe&&oe.value!==u&&(oe.value=u);const v=Re?.value.trim()||"";J&&(v?(J.src=v,J.style.display="block"):(J.removeAttribute("src"),J.style.display="none"));const S=f?.value.trim()||"",$=g?.value.trim()||"Continuar verificación";He.innerHTML=`
  ${S?`<span class="configuration-link-button-emoji">${b(S)}</span>`:""}

  <span class="configuration-link-button-text">
    ${b($)}
  </span>

  <span class="configuration-link-button-arrow">
    ↗
  </span>
`}[Ge,me,Re,f,g].forEach(r=>{r?.addEventListener("input",ze)}),Se?.addEventListener("input",ze),oe?.addEventListener("input",()=>{const r=oe.value.trim();ha(r)&&Se&&(Se.value=r,ze())}),ze(),l("backToServerPanel")?.addEventListener("click",()=>{ce(a.id)}),document.querySelectorAll(".verify-tab").forEach(r=>{r.addEventListener("click",()=>{document.querySelectorAll(".verify-tab").forEach(c=>c.classList.remove("active")),document.querySelectorAll(".verify-tab-panel").forEach(c=>c.classList.remove("active")),r.classList.add("active"),document.querySelector(`[data-verify-panel="${r.dataset.verifyTab}"]`)?.classList.add("active")})}),l("verifyEnabled")?.addEventListener("change",r=>{const c=l("verifySystemStatus");c.textContent=r.target.checked?"ACTIVADO":"DESACTIVADO",c.classList.toggle("enabled",r.target.checked),c.classList.toggle("disabled",!r.target.checked)}),l("verifyLogs")?.addEventListener("change",r=>{l("verifyLogsSettings")?.classList.toggle("visible",!!r.target.value)});const Mt=(r,c)=>{const u=l(r),v=l(c);u?.addEventListener("input",()=>{v.value=u.value}),v?.addEventListener("input",()=>{/^#[0-9A-F]{6}$/i.test(v.value)&&(u.value=v.value)})};Mt("verifyEmbedColor","verifyEmbedColorText"),Mt("verifyLogColor","verifyLogColorText");function _t(){return{splitImageUrl:document.getElementById("verifySplitImageUrl")?.value.trim()||"",splitImagePosition:document.getElementById("verifySplitImagePosition")?.value||"left",splitImageFit:document.getElementById("verifySplitImageFit")?.value||"cover",splitImageDarkness:Number(document.getElementById("verifySplitImageDarkness")?.value||45),splitImageWidth:Number(document.getElementById("verifySplitImageWidth")?.value||48),splitShowImage:document.getElementById("verifySplitShowImage")?.checked!==!1,splitShowDate:document.getElementById("verifySplitShowDate")?.checked!==!1,splitShowAccess:document.getElementById("verifySplitShowAccess")?.checked!==!1,cardDesign:document.querySelector('input[name="verificationCardDesign"]:checked')?.value||"classic",terminalTitle:document.getElementById("verifyTerminalTitle")?.value.trim()||"NEBULA SECURITY TERMINAL",terminalPrefix:document.getElementById("verifyTerminalPrefix")?.value.trim()||">",terminalStatusText:document.getElementById("verifyTerminalStatusText")?.value.trim()||"Sistema preparado",terminalBackgroundColor:document.getElementById("verifyTerminalBackgroundColorText")?.value||"#020703",terminalTextColor:document.getElementById("verifyTerminalTextColorText")?.value||"#d9ffe0",terminalAccentColor:document.getElementById("verifyTerminalAccentColorText")?.value||"#22c55e",terminalBorderColor:document.getElementById("verifyTerminalBorderColorText")?.value||"#14532d",terminalShowCursor:!!document.getElementById("verifyTerminalShowCursor")?.checked,terminalShowLines:!!document.getElementById("verifyTerminalShowLines")?.checked,terminalShowServer:!!document.getElementById("verifyTerminalShowServer")?.checked,terminalShowRole:!!document.getElementById("verifyTerminalShowRole")?.checked,terminalGlow:Number(document.getElementById("verifyTerminalGlow")?.value||25),terminalRadius:Number(document.getElementById("verifyTerminalRadius")?.value||10),pageName:document.getElementById("verifyPageName")?.value.trim()||"",pageDescription:document.getElementById("verifyPageDescription")?.value.trim()||"",logoUrl:document.getElementById("verifyLogoUrl")?.value.trim()||"",backgroundUrl:document.getElementById("verifyBackgroundUrl")?.value.trim()||"",primaryColor:document.getElementById("verifyPrimaryColorText")?.value||"#8b5cf6",secondaryColor:document.getElementById("verifySecondaryColorText")?.value||"#6d28d9",buttonColor:document.getElementById("verifyButtonColorText")?.value||"#7c3aed",textColor:document.getElementById("verifyTextColorText")?.value||"#ffffff",cardColor:document.getElementById("verifyCardColorText")?.value||"#0f0f1a",backgroundSolidColor:document.getElementById("verifyBackgroundSolidColorText")?.value||"#05050a",gradientStart:document.getElementById("verifyGradientStartText")?.value||"#05050a",gradientEnd:document.getElementById("verifyGradientEndText")?.value||"#160c2b",backgroundType:document.getElementById("verifyBackgroundType")?.value||"space",spaceBackground:!!document.getElementById("verifySpaceBackground")?.checked,animationsEnabled:!!document.getElementById("verifyAnimationsEnabled")?.checked,particlesEnabled:!!document.getElementById("verifyParticlesEnabled")?.checked,glowEnabled:!!document.getElementById("verifyGlowEnabled")?.checked,fadeEnabled:!!document.getElementById("verifyFadeEnabled")?.checked,hoverEnabled:!!document.getElementById("verifyHoverEnabled")?.checked,cursorGlowEnabled:!!document.getElementById("verifyCursorGlowEnabled")?.checked,buttonAnimationEnabled:!!document.getElementById("verifyButtonAnimationEnabled")?.checked,logoAnimationEnabled:!!document.getElementById("verifyLogoAnimationEnabled")?.checked,particleCount:Number(document.getElementById("verifyParticleCount")?.value||100),glowIntensity:Number(document.getElementById("verifyGlowIntensity")?.value||80),cardBlur:Number(document.getElementById("verifyCardBlur")?.value||18),cardOpacity:Number(document.getElementById("verifyCardOpacity")?.value||88),cardRadius:Number(document.getElementById("verifyCardRadius")?.value||24),cardShadow:Number(document.getElementById("verifyCardShadow")?.value||80),verifyButtonText:document.getElementById("verifyAppearanceButtonText")?.value.trim()||"Verificar con Discord",verifyButtonIcon:document.getElementById("verifyButtonIcon")?.value||"discord",verifyButtonSize:document.getElementById("verifyButtonSize")?.value||"large",verifyButtonRadius:Number(document.getElementById("verifyButtonRadius")?.value||14),verificationSound:!!document.getElementById("verifyVerificationSound")?.checked,errorSound:!!document.getElementById("verifyErrorSound")?.checked,openingSound:!!document.getElementById("verifyOpeningSound")?.checked,soundVolume:Number(document.getElementById("verifySoundVolume")?.value||50)}}function fe(){const r=_t(),c=document.getElementById("verifyAppearanceFrame");c?.contentWindow&&c.contentWindow.postMessage({type:"nebula-appearance-preview",appearance:r},window.location.origin)}document.getElementById("verifyAppearanceFrame")?.addEventListener("load",()=>{setTimeout(fe,150)});function Vt(){const r=document.querySelector('input[name="verificationCardDesign"]:checked')?.value||"classic";document.querySelectorAll("[data-design-settings]").forEach(v=>{v.classList.toggle("active",v.dataset.designSettings===r)});const c={classic:["identity","palette","background","animations","card","button","sounds"],split:["identity","palette","background","button"],terminal:["identity","background","button"]},u=c[r]||c.classic;document.querySelectorAll("[data-appearance-section]").forEach(v=>{const S=v.dataset.appearanceSection;v.hidden=!u.includes(S)})}document.querySelectorAll('input[name="verificationCardDesign"]').forEach(r=>{r.addEventListener("change",()=>{Vt(),fe()})}),Vt(),["verifyPageName","verifyPageDescription","verifyLogoUrl","verifyBackgroundUrl","verifyPrimaryColor","verifyPrimaryColorText","verifySecondaryColor","verifySecondaryColorText","verifyButtonColor","verifyButtonColorText","verifyTextColor","verifyTextColorText","verifyCardColor","verifyCardColorText","verifyBackgroundSolidColor","verifyBackgroundSolidColorText","verifyGradientStart","verifyGradientStartText","verifyGradientEnd","verifyGradientEndText","verifyBackgroundType","verifySpaceBackground","verifyParticlesEnabled","verifyAnimationsEnabled","verifyGlowEnabled","verifyFadeEnabled","verifyHoverEnabled","verifyCursorGlowEnabled","verifyButtonAnimationEnabled","verifyLogoAnimationEnabled","verifyParticleCount","verifyGlowIntensity","verifyCardBlur","verifyCardOpacity","verifyCardRadius","verifyCardShadow","verifyAppearanceButtonText","verifyButtonIcon","verifyButtonSize","verifyButtonRadius","verifyOpeningSound","verifyVerificationSound","verifyErrorSound","verifySoundVolume","verifySplitImageUrl","verifySplitImagePosition","verifySplitImageFit","verifySplitImageDarkness","verifySplitImageWidth","verifySplitShowImage","verifySplitShowDate","verifySplitShowAccess","verifyTerminalTitle","verifyTerminalPrefix","verifyTerminalStatusText","verifyTerminalBackgroundColor","verifyTerminalBackgroundColorText","verifyTerminalTextColor","verifyTerminalTextColorText","verifyTerminalAccentColor","verifyTerminalAccentColorText","verifyTerminalBorderColor","verifyTerminalBorderColorText","verifyTerminalShowCursor","verifyTerminalShowLines","verifyTerminalShowServer","verifyTerminalShowRole","verifyTerminalGlow","verifyTerminalRadius"].forEach(r=>{const c=document.getElementById(r);if(!c)return;const u=c.type==="checkbox"||c.tagName==="SELECT"?"change":"input";c.addEventListener(u,fe)}),[["verifyPrimaryColor","verifyPrimaryColorText"],["verifySecondaryColor","verifySecondaryColorText"],["verifyButtonColor","verifyButtonColorText"],["verifyTextColor","verifyTextColorText"],["verifyCardColor","verifyCardColorText"],["verifyBackgroundSolidColor","verifyBackgroundSolidColorText"],["verifyGradientStart","verifyGradientStartText"],["verifyGradientEnd","verifyGradientEndText"],["verifyTerminalBackgroundColor","verifyTerminalBackgroundColorText"],["verifyTerminalTextColor","verifyTerminalTextColorText"],["verifyTerminalAccentColor","verifyTerminalAccentColorText"],["verifyTerminalBorderColor","verifyTerminalBorderColorText"]].forEach(([r,c])=>{const u=document.getElementById(r),v=document.getElementById(c);u?.addEventListener("input",()=>{v.value=u.value,fe()}),v?.addEventListener("input",()=>{const S=v.value.trim();/^#[0-9a-f]{6}$/i.test(S)&&(u.value=S,fe())})}),document.querySelectorAll(".appearance-range-control input[type='range']").forEach(r=>{const c=document.getElementById(`${r.id}Value`),u=()=>{c&&(c.textContent=`${r.value}${r.dataset.suffix||""}`),fe()};r.addEventListener("input",u),u()}),fe(),l("saveVerification")?.addEventListener("click",async()=>{const r=l("saveVerification"),c=ve();if(!c.verificationChannelId){F("Falta el canal","Seleccioná el canal de verificación.");return}if(!c.verifiedRoleId){F("Falta el rol","Seleccioná el rol que recibirá el usuario.");return}r.disabled=!0,r.textContent="Guardando...";try{const u=await fetch(`${x}/api/servers/${a.id}/verification`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(c)}),v=await u.json();if(!u.ok||!v.success)throw new Error(v.message||"No se pudo guardar.");F("Configuración guardada","Todos los cambios quedaron guardados.")}catch(u){F("Error al guardar",u.message)}finally{r.disabled=!1,r.textContent="Guardar configuración"}}),l("sendVerificationPanel")?.addEventListener("click",async()=>{const r=l("sendVerificationPanel");l("saveVerification").click(),await new Promise(u=>setTimeout(u,700)),r.disabled=!0,r.textContent="Enviando...";try{const u=await fetch(`${x}/api/servers/${a.id}/verification/send`,{method:"POST"}),v=await u.json();if(!u.ok||!v.success)throw new Error(v.message||"No se pudo enviar el panel.");F("Panel enviado","Revisá el canal de verificación en Discord.")}catch(u){F("Error al enviar",u.message)}finally{r.disabled=!1,r.textContent="Enviar panel a Discord"}})}async function Li(a){I.innerHTML=`
    <div class="dynamic-page">
      <div class="servers-loading">
        <div class="loading-spinner"></div>
        <strong>Cargando configuración de bienvenida...</strong>
      </div>
    </div>
  `;try{const[e,t]=await Promise.all([fetch(`${x}/api/servers/${a.id}/text-channels`),fetch(`${x}/api/servers/${a.id}/welcome`)]),i=await e.json(),s=await t.json();if(!i.success||!s.success)throw new Error("No se pudo cargar la configuración");xi(a,i.data,s.data)}catch(e){I.innerHTML=`
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
    `,document.getElementById("backToServerPanel")?.addEventListener("click",()=>{ce(a.id)})}}function xi(a,e,t){const i=e.map(f=>`
    <option
      value="${f.id}"
      ${f.id===t.channelId?"selected":""}
    >
      # ${f.name}
    </option>
  `).join("");I.innerHTML=`
    <div class="dynamic-page welcome-config-page">

      <section class="section-header">
        <div>
          <span>MENSAJES AUTOMÁTICOS</span>
          <h1>Bienvenida</h1>
          <p>
            Configurá el mensaje que recibirá cada usuario
            cuando ingrese a ${a.name}.
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

    <h3>
      Mensaje de ingreso
    </h3>
  </div>

<button
  id="openWelcomeVariables"
  class="open-variables-button"
  data-open-welcome-variables
  type="button"
>
  <span>⌘</span>
  Variables
</button>
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
              value="${y(t.title)}"
            >
          </label>

          <label class="welcome-field">
            <span>MENSAJE</span>
            <textarea
              id="welcomeMessage"
              maxlength="2000"
              rows="7"
            >${b(t.message)}</textarea>
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
    >${b(t.dmMessage)}</textarea>
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
  <div
    class="preview-bot-avatar"
    id="welcomePreviewBotAvatar"
  >
    N
  </div>

  <div class="preview-message-content">
    <div class="preview-author">
      <span id="welcomePreviewBotName">
        Nebula Bot
      </span>

      <small>BOT</small>
      <time>Ahora</time>
    </div>

              <div
                class="preview-embed"
                id="welcomePreviewEmbed"
              >
                <strong id="welcomePreviewTitle"></strong>
                <p id="welcomePreviewMessage"></p>

               <div
  id="welcomePreviewUserAvatar"
  class="preview-user-thumbnail"
></div>

                <small>
                  ${a.name} · Miembro número
                  ${a.members}
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
  <div
    class="preview-bot-avatar"
    id="welcomeDmPreviewBotAvatar"
  >
    N
  </div>

  <div class="preview-message-content">
    <div class="preview-author">
      <span id="welcomeDmPreviewBotName">
        Nebula Bot
      </span>

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
  class="preview-user-thumbnail"
></div>

        <small>
          Mensaje enviado por ${a.name}
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

<div
  id="welcomeVariablesModal"
  class="variables-modal"
  aria-hidden="true"
>
  <div
    class="variables-modal-backdrop"
    data-close-welcome-variables
  ></div>

  <section
    class="variables-modal-window"
    role="dialog"
    aria-modal="true"
    aria-labelledby="welcomeVariablesTitle"
  >
    <header class="variables-modal-header">
      <div>
        <span>TEXTOS DINÁMICOS</span>

        <h2 id="welcomeVariablesTitle">
          Variables de Bienvenida
        </h2>

        <p>
          Elegí una categoría y copiá la variable que necesites.
        </p>
      </div>

      <button
        class="variables-modal-close"
        data-close-welcome-variables
        type="button"
        aria-label="Cerrar"
      >
        ×
      </button>
    </header>

    <div class="variables-modal-search">
      <span>⌕</span>

      <input
        id="welcomeVariablesSearch"
        type="search"
        placeholder="Buscar una variable..."
        autocomplete="off"
      >
    </div>

    <div class="variables-modal-content">
      <aside class="variables-categories">

        <button
          type="button"
          class="variables-category active"
          data-welcome-variable-category="user"
        >
          <span>👤</span>
          Usuario
        </button>

        <button
          type="button"
          class="variables-category"
          data-welcome-variable-category="server"
        >
          <span>🌍</span>
          Servidor
        </button>

        <button
          type="button"
          class="variables-category"
          data-welcome-variable-category="date"
        >
          <span>📅</span>
          Fecha y hora
        </button>

      </aside>

      <section class="variables-results">
        <div
          id="welcomeVariablesModalList"
          class="variables-modal-list"
        ></div>
      </section>
    </div>

    <div
      id="welcomeVariablesModalEmpty"
      class="variables-modal-empty"
      hidden
    >
      No se encontraron variables.
    </div>

    <footer class="variables-modal-footer">
      <span>
        Presioná una variable para copiarla.
      </span>

      <button
        data-close-welcome-variables
        type="button"
      >
        Cerrar
      </button>
    </footer>
  </section>
</div>

</article>

  </div>
  </div>
  `;const s=document.getElementById("welcomeEnabled"),n=document.getElementById("welcomeChannel"),o=document.getElementById("welcomeTitle"),d=document.getElementById("welcomeMessage"),m=document.getElementById("welcomeColor"),w=document.getElementById("welcomeColorText"),T=document.getElementById("welcomeShowAvatar"),p=document.getElementById("welcomeDmEnabled"),E=document.getElementById("welcomeDmFields"),l=document.getElementById("welcomeDmTitle"),de=document.getElementById("welcomeDmMessage"),te=document.getElementById("welcomeDmColor"),P=document.getElementById("welcomeDmColorText"),M=document.getElementById("welcomeDmShowAvatar"),Le=document.getElementById("welcomeDmPreviewSection"),ae=Tt?.name||"Nebula Bot",ie=O||{},be=ie.displayName||ie.globalName||ie.username||"Usuario",ue=ie.avatar||"",Ve=document.getElementById("welcomePreviewUserAvatar"),Ue=document.getElementById("welcomeDmPreviewAvatar"),xe=ue?`
      <img
        src="${ue}"
        alt="${be}"
      >
    `:`
      <span>
        ${ke(be)}
      </span>
    `;Ve&&(Ve.innerHTML=xe),Ue&&(Ue.innerHTML=xe);const F=Tt?.avatar||"",qe=document.getElementById("welcomePreviewBotName"),je=document.getElementById("welcomeDmPreviewBotName"),se=document.getElementById("welcomePreviewBotAvatar"),pe=document.getElementById("welcomeDmPreviewBotAvatar");qe&&(qe.textContent=ae),je&&(je.textContent=ae);const Ee=F?`
      <img
        src="${F}"
        alt="${ae}"
      >
    `:ae.charAt(0).toUpperCase();se&&(se.innerHTML=Ee),pe&&(pe.innerHTML=Ee);function D(){const f=Xe(o.value,a),g=Xe(d.value,a);document.getElementById("welcomePreviewTitle").textContent=f,document.getElementById("welcomePreviewMessage").textContent=g,document.getElementById("welcomePreviewEmbed").style.borderLeftColor=m.value;const C=document.getElementById("welcomePreviewUserAvatar");C&&(C.style.display=T.checked?"block":"none");const k=Xe(l.value,a),W=Xe(de.value,a);document.getElementById("welcomeDmPreviewTitle").textContent=k,document.getElementById("welcomeDmPreviewMessage").textContent=W,document.getElementById("welcomeDmPreviewEmbed").style.borderLeftColor=te.value;const J=document.getElementById("welcomeDmPreviewAvatar");J&&(J.style.display=M.checked?"block":"none")}m.addEventListener("input",()=>{w.value=m.value,D()}),w.addEventListener("input",()=>{/^#[0-9A-F]{6}$/i.test(w.value)&&(m.value=w.value,D())}),o.addEventListener("input",D),d.addEventListener("input",D),p.addEventListener("change",()=>{E.classList.toggle("visible",p.checked),Le.classList.toggle("visible",p.checked),D()}),T.addEventListener("change",D),M.addEventListener("change",D),l.addEventListener("input",D),de.addEventListener("input",D),te.addEventListener("input",()=>{P.value=te.value,D()}),P.addEventListener("input",()=>{/^#[0-9A-F]{6}$/i.test(P.value)&&(te.value=P.value,D())}),document.querySelectorAll("[data-variable]").forEach(f=>{f.addEventListener("click",()=>{const g=f.dataset.variable,C=d.selectionStart,k=d.selectionEnd;d.value=d.value.slice(0,C)+g+d.value.slice(k),d.focus(),d.selectionStart=d.selectionEnd=C+g.length,D()})});const N=document.getElementById("welcomeVariablesModal"),ve=document.getElementById("welcomeVariablesSearch"),Fe=document.getElementById("welcomeVariablesModalList"),we=document.getElementById("welcomeVariablesModalEmpty"),Ne=document.querySelectorAll("[data-welcome-variable-category]");let Ce="user";const Ge=[{key:"{user}",label:"Nombre corto del usuario",category:"user"},{key:"{mention}",label:"Mención del usuario",category:"user"},{key:"{username}",label:"Nombre de usuario",category:"user"},{key:"{displayname}",label:"Nombre visible",category:"user"},{key:"{userid}",label:"ID del usuario",category:"user"},{key:"{joindate}",label:"Fecha de ingreso",category:"user"},{key:"{server}",label:"Nombre del servidor",category:"server"},{key:"{serverid}",label:"ID del servidor",category:"server"},{key:"{members}",label:"Cantidad de miembros",category:"server"},{key:"{membercount}",label:"Cantidad de miembros",category:"server"},{key:"{date}",label:"Fecha actual",category:"date"},{key:"{time}",label:"Hora actual",category:"date"}];function me(){if(!Fe)return;const f=String(ve?.value||"").trim().toLowerCase(),g=Ge.filter(k=>{const W=k.category===Ce,J=`${k.key} ${k.label}`.toLowerCase(),He=!f||J.includes(f);return W&&He});Fe.innerHTML=g.map(k=>`
          <button
            class="verify-variable-button"
            data-copy-welcome-variable="${k.key}"
            type="button"
          >
            <code>
              ${k.key}
            </code>

            <span>
              ${k.label}
            </span>

            <b>
              Copiar
            </b>
          </button>
        `).join("");const C=g.length>0;we&&(we.hidden=C,we.classList.toggle("visible",!C))}function Se(f=null){N&&(N.classList.add("open"),N.setAttribute("aria-hidden","false"),document.body.classList.add("variables-modal-open"),Ce="user",ve&&(ve.value=""),Ne.forEach(g=>{g.classList.toggle("active",g.dataset.welcomeVariableCategory==="user")}),me(),setTimeout(()=>{ve?.focus()},100))}function oe(){N&&(N.classList.remove("open"),N.setAttribute("aria-hidden","true"),document.body.classList.remove("variables-modal-open"))}document.querySelector("[data-open-welcome-variables]")?.addEventListener("click",f=>{f.preventDefault(),f.stopPropagation(),Se(d)}),document.querySelectorAll("[data-close-welcome-variables]").forEach(f=>{f.addEventListener("click",g=>{g.preventDefault(),g.stopPropagation(),oe()})}),Ne.forEach(f=>{f.addEventListener("click",g=>{g.preventDefault(),g.stopPropagation(),Ce=f.dataset.welcomeVariableCategory||"user",Ne.forEach(C=>{C.classList.toggle("active",C===f)}),me()})}),ve?.addEventListener("input",me),Fe?.addEventListener("click",async f=>{const g=f.target.closest("[data-copy-welcome-variable]");if(!g)return;f.preventDefault(),f.stopPropagation();const C=g.dataset.copyWelcomeVariable;if(C)try{await navigator.clipboard.writeText(C);const k=g.querySelector("b")?.textContent,W=g.querySelector("b");W&&(W.textContent="Copiado ✓",setTimeout(()=>{W.textContent=k||"Copiar"},1200))}catch(k){console.error("No se pudo copiar la variable:",k)}}),N?.addEventListener("wheel",f=>{f.target.closest(".variables-categories, .variables-results")||f.preventDefault()},{passive:!1}),document.addEventListener("keydown",f=>{f.key==="Escape"&&N?.classList.contains("open")&&oe()}),me(),document.getElementById("backToServerPanel").addEventListener("click",()=>{ce(a.id)});async function Re(){const f=document.getElementById("saveWelcome");f.disabled=!0,f.textContent="Guardando...";try{const g=await fetch(`${x}/api/servers/${a.id}/welcome`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({enabled:s.checked,channelId:n.value,title:o.value,message:d.value,color:m.value,showAvatar:T.checked,dmEnabled:p.checked,dmTitle:l.value,dmMessage:de.value,dmColor:te.value,dmShowAvatar:M.checked})}),C=await g.json();if(!g.ok||!C.success)throw new Error(C.message||"No se pudo guardar");return R.querySelector("strong").textContent="Bienvenida guardada",R.querySelector("p").textContent="Todos los cambios quedaron guardados.",ee(),!0}catch(g){return R.querySelector("strong").textContent="Error al guardar",R.querySelector("p").textContent=g.message,ee(),!1}finally{f.disabled=!1,f.textContent="Guardar configuración"}}document.getElementById("saveWelcome").addEventListener("click",Re),document.getElementById("testWelcome").addEventListener("click",async()=>{const f=document.getElementById("testWelcome");f.disabled=!0,f.textContent="Preparando prueba...";try{if(!await Re())return;f.textContent="Enviando...";const C=await fetch(`${x}/api/servers/${a.id}/welcome/test`,{method:"POST"}),k=await C.json();if(!C.ok||!k.success)throw new Error(k.message||"No se pudo enviar la prueba");R.querySelector("strong").textContent="Prueba enviada",R.querySelector("p").textContent="Revisá el canal de bienvenida en Discord.",ee()}catch(g){R.querySelector("strong").textContent="Error en la prueba",R.querySelector("p").textContent=g.message,ee()}finally{f.disabled=!1,f.textContent="Enviar mensaje de prueba"}}),D()}function Xe(a,e){const t=new Date,i=O||{},s=i.username||"usuario",n=i.displayName||i.globalName||s,o=i.id||"000000000000000000";return String(a).replaceAll("{user}",s).replaceAll("{mention}",`@${s}`).replaceAll("{username}",s).replaceAll("{displayname}",n).replaceAll("{userid}",o).replaceAll("{server}",e.name).replaceAll("{serverid}",e.id).replaceAll("{members}",Number(e.members||0).toLocaleString("es-AR")).replaceAll("{membercount}",Number(e.members||0).toLocaleString("es-AR")).replaceAll("{joindate}",t.toLocaleDateString("es-AR")).replaceAll("{date}",t.toLocaleDateString("es-AR")).replaceAll("{time}",t.toLocaleTimeString("es-AR",{hour:"2-digit",minute:"2-digit"}))}function b(a){return String(a).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;")}function y(a){return b(a).replaceAll('"',"&quot;").replaceAll("'","&#039;")}Bt();

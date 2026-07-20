(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))i(n);new MutationObserver(n=>{for(const c of n)if(c.type==="childList")for(const s of c.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&i(s)}).observe(document,{childList:!0,subtree:!0});function t(n){const c={};return n.integrity&&(c.integrity=n.integrity),n.referrerPolicy&&(c.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?c.credentials="include":n.crossOrigin==="anonymous"?c.credentials="omit":c.credentials="same-origin",c}function i(n){if(n.ep)return;n.ep=!0;const c=t(n);fetch(n.href,c)}})();const be=Object.create(null);be.open="0";be.close="1";be.ping="2";be.pong="3";be.message="4";be.upgrade="5";be.noop="6";const ct=Object.create(null);Object.keys(be).forEach(a=>{ct[be[a]]=a});const At={type:"error",data:"parser error"},na=typeof Blob=="function"||typeof Blob<"u"&&Object.prototype.toString.call(Blob)==="[object BlobConstructor]",sa=typeof ArrayBuffer=="function",oa=a=>typeof ArrayBuffer.isView=="function"?ArrayBuffer.isView(a):a&&a.buffer instanceof ArrayBuffer,_t=({type:a,data:e},t,i)=>na&&e instanceof Blob?t?i(e):Xt(e,i):sa&&(e instanceof ArrayBuffer||oa(e))?t?i(e):Xt(new Blob([e]),i):i(be[a]+(e||"")),Xt=(a,e)=>{const t=new FileReader;return t.onload=function(){const i=t.result.split(",")[1];e("b"+(i||""))},t.readAsDataURL(a)};function Yt(a){return a instanceof Uint8Array?a:a instanceof ArrayBuffer?new Uint8Array(a):new Uint8Array(a.buffer,a.byteOffset,a.byteLength)}let gt;function Ia(a,e){if(na&&a.data instanceof Blob)return a.data.arrayBuffer().then(Yt).then(e);if(sa&&(a.data instanceof ArrayBuffer||oa(a.data)))return e(Yt(a.data));_t(a,!1,t=>{gt||(gt=new TextEncoder),e(gt.encode(t))})}const Zt="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",tt=typeof Uint8Array>"u"?[]:new Uint8Array(256);for(let a=0;a<Zt.length;a++)tt[Zt.charCodeAt(a)]=a;const ka=a=>{let e=a.length*.75,t=a.length,i,n=0,c,s,p,m;a[a.length-1]==="="&&(e--,a[a.length-2]==="="&&e--);const D=new ArrayBuffer(e),$=new Uint8Array(D);for(i=0;i<t;i+=4)c=tt[a.charCodeAt(i)],s=tt[a.charCodeAt(i+1)],p=tt[a.charCodeAt(i+2)],m=tt[a.charCodeAt(i+3)],$[n++]=c<<2|s>>4,$[n++]=(s&15)<<4|p>>2,$[n++]=(p&3)<<6|m&63;return D},Ta=typeof ArrayBuffer=="function",Vt=(a,e)=>{if(typeof a!="string")return{type:"message",data:ra(a,e)};const t=a.charAt(0);return t==="b"?{type:"message",data:La(a.substring(1),e)}:ct[t]?a.length>1?{type:ct[t],data:a.substring(1)}:{type:ct[t]}:At},La=(a,e)=>{if(Ta){const t=ka(a);return ra(t,e)}else return{base64:!0,data:a}},ra=(a,e)=>e==="blob"?a instanceof Blob?a:new Blob([a]):a instanceof ArrayBuffer?a:a.buffer,ca="",Ba=(a,e)=>{const t=a.length,i=new Array(t);let n=0;a.forEach((c,s)=>{_t(c,!1,p=>{i[s]=p,++n===t&&e(i.join(ca))})})},Da=(a,e)=>{const t=a.split(ca),i=[];for(let n=0;n<t.length;n++){const c=Vt(t[n],e);if(i.push(c),c.type==="error")break}return i};function xa(){return new TransformStream({transform(a,e){Ia(a,t=>{const i=t.length;let n;if(i<126)n=new Uint8Array(1),new DataView(n.buffer).setUint8(0,i);else if(i<65536){n=new Uint8Array(3);const c=new DataView(n.buffer);c.setUint8(0,126),c.setUint16(1,i)}else{n=new Uint8Array(9);const c=new DataView(n.buffer);c.setUint8(0,127),c.setBigUint64(1,BigInt(i))}a.data&&typeof a.data!="string"&&(n[0]|=128),e.enqueue(n),e.enqueue(t)})}})}let ht;function nt(a){return a.reduce((e,t)=>e+t.length,0)}function st(a,e){if(a[0].length===e)return a.shift();const t=new Uint8Array(e);let i=0;for(let n=0;n<e;n++)t[n]=a[0][i++],i===a[0].length&&(a.shift(),i=0);return a.length&&i<a[0].length&&(a[0]=a[0].slice(i)),t}function Na(a,e){ht||(ht=new TextDecoder);const t=[];let i=0,n=-1,c=!1;return new TransformStream({transform(s,p){for(t.push(s);;){if(i===0){if(nt(t)<1)break;const m=st(t,1);c=(m[0]&128)===128,n=m[0]&127,n<126?i=3:n===126?i=1:i=2}else if(i===1){if(nt(t)<2)break;const m=st(t,2);n=new DataView(m.buffer,m.byteOffset,m.length).getUint16(0),i=3}else if(i===2){if(nt(t)<8)break;const m=st(t,8),D=new DataView(m.buffer,m.byteOffset,m.length),$=D.getUint32(0);if($>Math.pow(2,21)-1){p.enqueue(At);break}n=$*Math.pow(2,32)+D.getUint32(4),i=3}else{if(nt(t)<n)break;const m=st(t,n);p.enqueue(Vt(c?m:ht.decode(m),e)),i=0}if(n===0||n>a){p.enqueue(At);break}}}})}const la=4;function G(a){if(a)return $a(a)}function $a(a){for(var e in G.prototype)a[e]=G.prototype[e];return a}G.prototype.on=G.prototype.addEventListener=function(a,e){return this._callbacks=this._callbacks||{},(this._callbacks["$"+a]=this._callbacks["$"+a]||[]).push(e),this};G.prototype.once=function(a,e){function t(){this.off(a,t),e.apply(this,arguments)}return t.fn=e,this.on(a,t),this};G.prototype.off=G.prototype.removeListener=G.prototype.removeAllListeners=G.prototype.removeEventListener=function(a,e){if(this._callbacks=this._callbacks||{},arguments.length==0)return this._callbacks={},this;var t=this._callbacks["$"+a];if(!t)return this;if(arguments.length==1)return delete this._callbacks["$"+a],this;for(var i,n=0;n<t.length;n++)if(i=t[n],i===e||i.fn===e){t.splice(n,1);break}return t.length===0&&delete this._callbacks["$"+a],this};G.prototype.emit=function(a){this._callbacks=this._callbacks||{};for(var e=new Array(arguments.length-1),t=this._callbacks["$"+a],i=1;i<arguments.length;i++)e[i-1]=arguments[i];if(t){t=t.slice(0);for(var i=0,n=t.length;i<n;++i)t[i].apply(this,e)}return this};G.prototype.emitReserved=G.prototype.emit;G.prototype.listeners=function(a){return this._callbacks=this._callbacks||{},this._callbacks["$"+a]||[]};G.prototype.hasListeners=function(a){return!!this.listeners(a).length};const yt=typeof Promise=="function"&&typeof Promise.resolve=="function"?e=>Promise.resolve().then(e):(e,t)=>t(e,0),ue=typeof self<"u"?self:typeof window<"u"?window:Function("return this")(),Ra="arraybuffer";function da(a,...e){return e.reduce((t,i)=>(a.hasOwnProperty(i)&&(t[i]=a[i]),t),{})}const Pa=ue.setTimeout,Ma=ue.clearTimeout;function ft(a,e){e.useNativeTimers?(a.setTimeoutFn=Pa.bind(ue),a.clearTimeoutFn=Ma.bind(ue)):(a.setTimeoutFn=ue.setTimeout.bind(ue),a.clearTimeoutFn=ue.clearTimeout.bind(ue))}const Oa=1.33;function _a(a){return typeof a=="string"?Va(a):Math.ceil((a.byteLength||a.size)*Oa)}function Va(a){let e=0,t=0;for(let i=0,n=a.length;i<n;i++)e=a.charCodeAt(i),e<128?t+=1:e<2048?t+=2:e<55296||e>=57344?t+=3:(i++,t+=4);return t}function ua(){return Date.now().toString(36).substring(3)+Math.random().toString(36).substring(2,5)}function Ua(a){let e="";for(let t in a)a.hasOwnProperty(t)&&(e.length&&(e+="&"),e+=encodeURIComponent(t)+"="+encodeURIComponent(a[t]));return e}function qa(a){let e={},t=a.split("&");for(let i=0,n=t.length;i<n;i++){let c=t[i].split("=");e[decodeURIComponent(c[0])]=decodeURIComponent(c[1])}return e}class ja extends Error{constructor(e,t,i){super(e),this.description=t,this.context=i,this.type="TransportError"}}class Ut extends G{constructor(e){super(),this.writable=!1,ft(this,e),this.opts=e,this.query=e.query,this.socket=e.socket,this.supportsBinary=!e.forceBase64}onError(e,t,i){return super.emitReserved("error",new ja(e,t,i)),this}open(){return this.readyState="opening",this.doOpen(),this}close(){return(this.readyState==="opening"||this.readyState==="open")&&(this.doClose(),this.onClose()),this}send(e){this.readyState==="open"&&this.write(e)}onOpen(){this.readyState="open",this.writable=!0,super.emitReserved("open")}onData(e){const t=Vt(e,this.socket.binaryType);this.onPacket(t)}onPacket(e){super.emitReserved("packet",e)}onClose(e){this.readyState="closed",super.emitReserved("close",e)}pause(e){}createUri(e,t={}){return e+"://"+this._hostname()+this._port()+this.opts.path+this._query(t)}_hostname(){const e=this.opts.hostname;return e.indexOf(":")===-1?e:"["+e+"]"}_port(){return this.opts.port&&(this.opts.secure&&Number(this.opts.port)!==443||!this.opts.secure&&Number(this.opts.port)!==80)?":"+this.opts.port:""}_query(e){const t=Ua(e);return t.length?"?"+t:""}}class Fa extends Ut{constructor(){super(...arguments),this._polling=!1}get name(){return"polling"}doOpen(){this._poll()}pause(e){this.readyState="pausing";const t=()=>{this.readyState="paused",e()};if(this._polling||!this.writable){let i=0;this._polling&&(i++,this.once("pollComplete",function(){--i||t()})),this.writable||(i++,this.once("drain",function(){--i||t()}))}else t()}_poll(){this._polling=!0,this.doPoll(),this.emitReserved("poll")}onData(e){const t=i=>{if(this.readyState==="opening"&&i.type==="open"&&this.onOpen(),i.type==="close")return this.onClose({description:"transport closed by the server"}),!1;this.onPacket(i)};Da(e,this.socket.binaryType).forEach(t),this.readyState!=="closed"&&(this._polling=!1,this.emitReserved("pollComplete"),this.readyState==="open"&&this._poll())}doClose(){const e=()=>{this.write([{type:"close"}])};this.readyState==="open"?e():this.once("open",e)}write(e){this.writable=!1,Ba(e,t=>{this.doWrite(t,()=>{this.writable=!0,this.emitReserved("drain")})})}uri(){const e=this.opts.secure?"https":"http",t=this.query||{};return this.opts.timestampRequests!==!1&&(t[this.opts.timestampParam]=ua()),!this.supportsBinary&&!t.sid&&(t.b64=1),this.createUri(e,t)}}let pa=!1;try{pa=typeof XMLHttpRequest<"u"&&"withCredentials"in new XMLHttpRequest}catch{}const Ha=pa;function Ga(){}class za extends Fa{constructor(e){if(super(e),typeof location<"u"){const t=location.protocol==="https:";let i=location.port;i||(i=t?"443":"80"),this.xd=typeof location<"u"&&e.hostname!==location.hostname||i!==e.port}}doWrite(e,t){const i=this.request({method:"POST",data:e});i.on("success",t),i.on("error",(n,c)=>{this.onError("xhr post error",n,c)})}doPoll(){const e=this.request();e.on("data",this.onData.bind(this)),e.on("error",(t,i)=>{this.onError("xhr poll error",t,i)}),this.pollXhr=e}}class he extends G{constructor(e,t,i){super(),this.createRequest=e,ft(this,i),this._opts=i,this._method=i.method||"GET",this._uri=t,this._data=i.data!==void 0?i.data:null,this._create()}_create(){var e;const t=da(this._opts,"agent","pfx","key","passphrase","cert","ca","ciphers","rejectUnauthorized","autoUnref");t.xdomain=!!this._opts.xd;const i=this._xhr=this.createRequest(t);try{i.open(this._method,this._uri,!0);try{if(this._opts.extraHeaders){i.setDisableHeaderCheck&&i.setDisableHeaderCheck(!0);for(let n in this._opts.extraHeaders)this._opts.extraHeaders.hasOwnProperty(n)&&i.setRequestHeader(n,this._opts.extraHeaders[n])}}catch{}if(this._method==="POST")try{i.setRequestHeader("Content-type","text/plain;charset=UTF-8")}catch{}try{i.setRequestHeader("Accept","*/*")}catch{}(e=this._opts.cookieJar)===null||e===void 0||e.addCookies(i),"withCredentials"in i&&(i.withCredentials=this._opts.withCredentials),this._opts.requestTimeout&&(i.timeout=this._opts.requestTimeout),i.onreadystatechange=()=>{var n;i.readyState===3&&((n=this._opts.cookieJar)===null||n===void 0||n.parseCookies(i.getResponseHeader("set-cookie"))),i.readyState===4&&(i.status===200||i.status===1223?this._onLoad():this.setTimeoutFn(()=>{this._onError(typeof i.status=="number"?i.status:0)},0))},i.send(this._data)}catch(n){this.setTimeoutFn(()=>{this._onError(n)},0);return}typeof document<"u"&&(this._index=he.requestsCount++,he.requests[this._index]=this)}_onError(e){this.emitReserved("error",e,this._xhr),this._cleanup(!0)}_cleanup(e){if(!(typeof this._xhr>"u"||this._xhr===null)){if(this._xhr.onreadystatechange=Ga,e)try{this._xhr.abort()}catch{}typeof document<"u"&&delete he.requests[this._index],this._xhr=null}}_onLoad(){const e=this._xhr.responseText;e!==null&&(this.emitReserved("data",e),this.emitReserved("success"),this._cleanup())}abort(){this._cleanup()}}he.requestsCount=0;he.requests={};if(typeof document<"u"){if(typeof attachEvent=="function")attachEvent("onunload",Qt);else if(typeof addEventListener=="function"){const a="onpagehide"in ue?"pagehide":"unload";addEventListener(a,Qt,!1)}}function Qt(){for(let a in he.requests)he.requests.hasOwnProperty(a)&&he.requests[a].abort()}const Ka=(function(){const a=va({xdomain:!1});return a&&a.responseType!==null})();class Wa extends za{constructor(e){super(e);const t=e&&e.forceBase64;this.supportsBinary=Ka&&!t}request(e={}){return Object.assign(e,{xd:this.xd},this.opts),new he(va,this.uri(),e)}}function va(a){const e=a.xdomain;try{if(typeof XMLHttpRequest<"u"&&(!e||Ha))return new XMLHttpRequest}catch{}if(!e)try{return new ue[["Active"].concat("Object").join("X")]("Microsoft.XMLHTTP")}catch{}}const ma=typeof navigator<"u"&&typeof navigator.product=="string"&&navigator.product.toLowerCase()==="reactnative";class Ja extends Ut{get name(){return"websocket"}doOpen(){const e=this.uri(),t=this.opts.protocols,i=ma?{}:da(this.opts,"agent","perMessageDeflate","pfx","key","passphrase","cert","ca","ciphers","rejectUnauthorized","localAddress","protocolVersion","origin","maxPayload","family","checkServerIdentity");this.opts.extraHeaders&&(i.headers=this.opts.extraHeaders);try{this.ws=this.createSocket(e,t,i)}catch(n){return this.emitReserved("error",n)}this.ws.binaryType=this.socket.binaryType,this.addEventListeners()}addEventListeners(){this.ws.onopen=()=>{this.opts.autoUnref&&this.ws._socket.unref(),this.onOpen()},this.ws.onclose=e=>this.onClose({description:"websocket connection closed",context:e}),this.ws.onmessage=e=>this.onData(e.data),this.ws.onerror=e=>this.onError("websocket error",e)}write(e){this.writable=!1;for(let t=0;t<e.length;t++){const i=e[t],n=t===e.length-1;_t(i,this.supportsBinary,c=>{try{this.doWrite(i,c)}catch{}n&&yt(()=>{this.writable=!0,this.emitReserved("drain")},this.setTimeoutFn)})}}doClose(){typeof this.ws<"u"&&(this.ws.onerror=()=>{},this.ws.close(),this.ws=null)}uri(){const e=this.opts.secure?"wss":"ws",t=this.query||{};return this.opts.timestampRequests&&(t[this.opts.timestampParam]=ua()),this.supportsBinary||(t.b64=1),this.createUri(e,t)}}const bt=ue.WebSocket||ue.MozWebSocket;class Xa extends Ja{createSocket(e,t,i){return ma?new bt(e,t,i):t?new bt(e,t):new bt(e)}doWrite(e,t){this.ws.send(t)}}class Ya extends Ut{get name(){return"webtransport"}doOpen(){try{this._transport=new WebTransport(this.createUri("https"),this.opts.transportOptions[this.name])}catch(e){return this.emitReserved("error",e)}this._transport.closed.then(()=>{this.onClose()}).catch(e=>{this.onError("webtransport error",e)}),this._transport.ready.then(()=>{this._transport.createBidirectionalStream().then(e=>{const t=Na(Number.MAX_SAFE_INTEGER,this.socket.binaryType),i=e.readable.pipeThrough(t).getReader(),n=xa();n.readable.pipeTo(e.writable),this._writer=n.writable.getWriter();const c=()=>{i.read().then(({done:p,value:m})=>{p||(this.onPacket(m),c())}).catch(p=>{})};c();const s={type:"open"};this.query.sid&&(s.data=`{"sid":"${this.query.sid}"}`),this._writer.write(s).then(()=>this.onOpen())})})}write(e){this.writable=!1;for(let t=0;t<e.length;t++){const i=e[t],n=t===e.length-1;this._writer.write(i).then(()=>{n&&yt(()=>{this.writable=!0,this.emitReserved("drain")},this.setTimeoutFn)})}}doClose(){var e;(e=this._transport)===null||e===void 0||e.close()}}const Za={websocket:Xa,webtransport:Ya,polling:Wa},Qa=/^(?:(?![^:@\/?#]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@\/?#]*)(?::([^:@\/?#]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/,ei=["source","protocol","authority","userInfo","user","password","host","port","relative","path","directory","file","query","anchor"];function It(a){if(a.length>8e3)throw"URI too long";const e=a,t=a.indexOf("["),i=a.indexOf("]");t!=-1&&i!=-1&&(a=a.substring(0,t)+a.substring(t,i).replace(/:/g,";")+a.substring(i,a.length));let n=Qa.exec(a||""),c={},s=14;for(;s--;)c[ei[s]]=n[s]||"";return t!=-1&&i!=-1&&(c.source=e,c.host=c.host.substring(1,c.host.length-1).replace(/;/g,":"),c.authority=c.authority.replace("[","").replace("]","").replace(/;/g,":"),c.ipv6uri=!0),c.pathNames=ti(c,c.path),c.queryKey=ai(c,c.query),c}function ti(a,e){const t=/\/{2,9}/g,i=e.replace(t,"/").split("/");return(e.slice(0,1)=="/"||e.length===0)&&i.splice(0,1),e.slice(-1)=="/"&&i.splice(i.length-1,1),i}function ai(a,e){const t={};return e.replace(/(?:^|&)([^&=]*)=?([^&]*)/g,function(i,n,c){n&&(t[n]=c)}),t}const kt=typeof addEventListener=="function"&&typeof removeEventListener=="function",lt=[];kt&&addEventListener("offline",()=>{lt.forEach(a=>a())},!1);class Re extends G{constructor(e,t){if(super(),this.binaryType=Ra,this.writeBuffer=[],this._prevBufferLen=0,this._pingInterval=-1,this._pingTimeout=-1,this._maxPayload=-1,this._pingTimeoutTime=1/0,e&&typeof e=="object"&&(t=e,e=null),e){const i=It(e);t.hostname=i.host,t.secure=i.protocol==="https"||i.protocol==="wss",t.port=i.port,i.query&&(t.query=i.query)}else t.host&&(t.hostname=It(t.host).host);ft(this,t),this.secure=t.secure!=null?t.secure:typeof location<"u"&&location.protocol==="https:",t.hostname&&!t.port&&(t.port=this.secure?"443":"80"),this.hostname=t.hostname||(typeof location<"u"?location.hostname:"localhost"),this.port=t.port||(typeof location<"u"&&location.port?location.port:this.secure?"443":"80"),this.transports=[],this._transportsByName={},t.transports.forEach(i=>{const n=i.prototype.name;this.transports.push(n),this._transportsByName[n]=i}),this.opts=Object.assign({path:"/engine.io",agent:!1,withCredentials:!1,upgrade:!0,timestampParam:"t",rememberUpgrade:!1,addTrailingSlash:!0,rejectUnauthorized:!0,perMessageDeflate:{threshold:1024},transportOptions:{},closeOnBeforeunload:!1},t),this.opts.path=this.opts.path.replace(/\/$/,"")+(this.opts.addTrailingSlash?"/":""),typeof this.opts.query=="string"&&(this.opts.query=qa(this.opts.query)),kt&&(this.opts.closeOnBeforeunload&&(this._beforeunloadEventListener=()=>{this.transport&&(this.transport.removeAllListeners(),this.transport.close())},addEventListener("beforeunload",this._beforeunloadEventListener,!1)),this.hostname!=="localhost"&&(this._offlineEventListener=()=>{this._onClose("transport close",{description:"network connection lost"})},lt.push(this._offlineEventListener))),this.opts.withCredentials&&(this._cookieJar=void 0),this._open()}createTransport(e){const t=Object.assign({},this.opts.query);t.EIO=la,t.transport=e,this.id&&(t.sid=this.id);const i=Object.assign({},this.opts,{query:t,socket:this,hostname:this.hostname,secure:this.secure,port:this.port},this.opts.transportOptions[e]);return new this._transportsByName[e](i)}_open(){if(this.transports.length===0){this.setTimeoutFn(()=>{this.emitReserved("error","No transports available")},0);return}const e=this.opts.rememberUpgrade&&Re.priorWebsocketSuccess&&this.transports.indexOf("websocket")!==-1?"websocket":this.transports[0];this.readyState="opening";const t=this.createTransport(e);t.open(),this.setTransport(t)}setTransport(e){this.transport&&this.transport.removeAllListeners(),this.transport=e,e.on("drain",this._onDrain.bind(this)).on("packet",this._onPacket.bind(this)).on("error",this._onError.bind(this)).on("close",t=>this._onClose("transport close",t))}onOpen(){this.readyState="open",Re.priorWebsocketSuccess=this.transport.name==="websocket",this.emitReserved("open"),this.flush()}_onPacket(e){if(this.readyState==="opening"||this.readyState==="open"||this.readyState==="closing")switch(this.emitReserved("packet",e),this.emitReserved("heartbeat"),e.type){case"open":this.onHandshake(JSON.parse(e.data));break;case"ping":this._sendPacket("pong"),this.emitReserved("ping"),this.emitReserved("pong"),this._resetPingTimeout();break;case"error":const t=new Error("server error");t.code=e.data,this._onError(t);break;case"message":this.emitReserved("data",e.data),this.emitReserved("message",e.data);break}}onHandshake(e){this.emitReserved("handshake",e),this.id=e.sid,this.transport.query.sid=e.sid,this._pingInterval=e.pingInterval,this._pingTimeout=e.pingTimeout,this._maxPayload=e.maxPayload,this.onOpen(),this.readyState!=="closed"&&this._resetPingTimeout()}_resetPingTimeout(){this.clearTimeoutFn(this._pingTimeoutTimer);const e=this._pingInterval+this._pingTimeout;this._pingTimeoutTime=Date.now()+e,this._pingTimeoutTimer=this.setTimeoutFn(()=>{this._onClose("ping timeout")},e),this.opts.autoUnref&&this._pingTimeoutTimer.unref()}_onDrain(){this.writeBuffer.splice(0,this._prevBufferLen),this._prevBufferLen=0,this.writeBuffer.length===0?this.emitReserved("drain"):this.flush()}flush(){if(this.readyState!=="closed"&&this.transport.writable&&!this.upgrading&&this.writeBuffer.length){const e=this._getWritablePackets();this.transport.send(e),this._prevBufferLen=e.length,this.emitReserved("flush")}}_getWritablePackets(){if(!(this._maxPayload&&this.transport.name==="polling"&&this.writeBuffer.length>1))return this.writeBuffer;let t=1;for(let i=0;i<this.writeBuffer.length;i++){const n=this.writeBuffer[i].data;if(n&&(t+=_a(n)),i>0&&t>this._maxPayload)return this.writeBuffer.slice(0,i);t+=2}return this.writeBuffer}_hasPingExpired(){if(!this._pingTimeoutTime)return!0;const e=Date.now()>this._pingTimeoutTime;return e&&(this._pingTimeoutTime=0,yt(()=>{this._onClose("ping timeout")},this.setTimeoutFn)),e}write(e,t,i){return this._sendPacket("message",e,t,i),this}send(e,t,i){return this._sendPacket("message",e,t,i),this}_sendPacket(e,t,i,n){if(typeof t=="function"&&(n=t,t=void 0),typeof i=="function"&&(n=i,i=null),this.readyState==="closing"||this.readyState==="closed")return;i=i||{},i.compress=i.compress!==!1;const c={type:e,data:t,options:i};this.emitReserved("packetCreate",c),this.writeBuffer.push(c),n&&this.once("flush",n),this.flush()}close(){const e=()=>{this._onClose("forced close"),this.transport.close()},t=()=>{this.off("upgrade",t),this.off("upgradeError",t),e()},i=()=>{this.once("upgrade",t),this.once("upgradeError",t)};return(this.readyState==="opening"||this.readyState==="open")&&(this.readyState="closing",this.writeBuffer.length?this.once("drain",()=>{this.upgrading?i():e()}):this.upgrading?i():e()),this}_onError(e){if(Re.priorWebsocketSuccess=!1,this.opts.tryAllTransports&&this.transports.length>1&&this.readyState==="opening")return this.transports.shift(),this._open();this.emitReserved("error",e),this._onClose("transport error",e)}_onClose(e,t){if(this.readyState==="opening"||this.readyState==="open"||this.readyState==="closing"){if(this.clearTimeoutFn(this._pingTimeoutTimer),this.transport.removeAllListeners("close"),this.transport.close(),this.transport.removeAllListeners(),kt&&(this._beforeunloadEventListener&&removeEventListener("beforeunload",this._beforeunloadEventListener,!1),this._offlineEventListener)){const i=lt.indexOf(this._offlineEventListener);i!==-1&&lt.splice(i,1)}this.readyState="closed",this.id=null,this.emitReserved("close",e,t),this.writeBuffer=[],this._prevBufferLen=0}}}Re.protocol=la;class ii extends Re{constructor(){super(...arguments),this._upgrades=[]}onOpen(){if(super.onOpen(),this.readyState==="open"&&this.opts.upgrade)for(let e=0;e<this._upgrades.length;e++)this._probe(this._upgrades[e])}_probe(e){let t=this.createTransport(e),i=!1;Re.priorWebsocketSuccess=!1;const n=()=>{i||(t.send([{type:"ping",data:"probe"}]),t.once("packet",h=>{if(!i)if(h.type==="pong"&&h.data==="probe"){if(this.upgrading=!0,this.emitReserved("upgrading",t),!t)return;Re.priorWebsocketSuccess=t.name==="websocket",this.transport.pause(()=>{i||this.readyState!=="closed"&&($(),this.setTransport(t),t.send([{type:"upgrade"}]),this.emitReserved("upgrade",t),t=null,this.upgrading=!1,this.flush())})}else{const M=new Error("probe error");M.transport=t.name,this.emitReserved("upgradeError",M)}}))};function c(){i||(i=!0,$(),t.close(),t=null)}const s=h=>{const M=new Error("probe error: "+h);M.transport=t.name,c(),this.emitReserved("upgradeError",M)};function p(){s("transport closed")}function m(){s("socket closed")}function D(h){t&&h.name!==t.name&&c()}const $=()=>{t.removeListener("open",n),t.removeListener("error",s),t.removeListener("close",p),this.off("close",m),this.off("upgrading",D)};t.once("open",n),t.once("error",s),t.once("close",p),this.once("close",m),this.once("upgrading",D),this._upgrades.indexOf("webtransport")!==-1&&e!=="webtransport"?this.setTimeoutFn(()=>{i||t.open()},200):t.open()}onHandshake(e){this._upgrades=this._filterUpgrades(e.upgrades),super.onHandshake(e)}_filterUpgrades(e){const t=[];for(let i=0;i<e.length;i++)~this.transports.indexOf(e[i])&&t.push(e[i]);return t}}let ni=class extends ii{constructor(e,t={}){const i=typeof e=="object",n=i?{...e}:{...t};(!n.transports||n.transports&&typeof n.transports[0]=="string")&&(n.transports=(n.transports||["polling","websocket","webtransport"]).map(c=>Za[c]).filter(c=>!!c)),super(i?n:e,n)}};function si(a,e="",t){let i=a;t=t||typeof location<"u"&&location,a==null&&(a=t.protocol+"//"+t.host),typeof a=="string"&&(a.charAt(0)==="/"&&(a.charAt(1)==="/"?a=t.protocol+a:a=t.host+a),/^(https?|wss?):\/\//.test(a)||(typeof t<"u"?a=t.protocol+"//"+a:a="https://"+a),i=It(a)),i.port||(/^(http|ws)$/.test(i.protocol)?i.port="80":/^(http|ws)s$/.test(i.protocol)&&(i.port="443")),i.path=i.path||"/";const c=i.host.indexOf(":")!==-1?"["+i.host+"]":i.host;return i.id=i.protocol+"://"+c+":"+i.port+e,i.href=i.protocol+"://"+c+(t&&t.port===i.port?"":":"+i.port),i}const oi=typeof ArrayBuffer=="function",ri=a=>typeof ArrayBuffer.isView=="function"?ArrayBuffer.isView(a):a.buffer instanceof ArrayBuffer,ya=Object.prototype.toString,ci=typeof Blob=="function"||typeof Blob<"u"&&ya.call(Blob)==="[object BlobConstructor]",li=typeof File=="function"||typeof File<"u"&&ya.call(File)==="[object FileConstructor]";function qt(a){return oi&&(a instanceof ArrayBuffer||ri(a))||ci&&a instanceof Blob||li&&a instanceof File}function dt(a,e){if(!a||typeof a!="object")return!1;if(Array.isArray(a)){for(let t=0,i=a.length;t<i;t++)if(dt(a[t]))return!0;return!1}if(qt(a))return!0;if(a.toJSON&&typeof a.toJSON=="function"&&arguments.length===1)return dt(a.toJSON(),!0);for(const t in a)if(Object.prototype.hasOwnProperty.call(a,t)&&dt(a[t]))return!0;return!1}function di(a){const e=[],t=a.data,i=a;return i.data=Tt(t,e),i.attachments=e.length,{packet:i,buffers:e}}function Tt(a,e){if(!a)return a;if(qt(a)){const t={_placeholder:!0,num:e.length};return e.push(a),t}else if(Array.isArray(a)){const t=new Array(a.length);for(let i=0;i<a.length;i++)t[i]=Tt(a[i],e);return t}else if(typeof a=="object"&&!(a instanceof Date)){const t={};for(const i in a)Object.prototype.hasOwnProperty.call(a,i)&&(t[i]=Tt(a[i],e));return t}return a}function ui(a,e){return a.data=Lt(a.data,e),delete a.attachments,a}function Lt(a,e){if(!a)return a;if(a&&a._placeholder===!0){if(typeof a.num=="number"&&a.num>=0&&a.num<e.length)return e[a.num];throw new Error("illegal attachments")}else if(Array.isArray(a))for(let t=0;t<a.length;t++)a[t]=Lt(a[t],e);else if(typeof a=="object")for(const t in a)Object.prototype.hasOwnProperty.call(a,t)&&(a[t]=Lt(a[t],e));return a}const pi=["connect","connect_error","disconnect","disconnecting","newListener","removeListener"];var k;(function(a){a[a.CONNECT=0]="CONNECT",a[a.DISCONNECT=1]="DISCONNECT",a[a.EVENT=2]="EVENT",a[a.ACK=3]="ACK",a[a.CONNECT_ERROR=4]="CONNECT_ERROR",a[a.BINARY_EVENT=5]="BINARY_EVENT",a[a.BINARY_ACK=6]="BINARY_ACK"})(k||(k={}));class vi{constructor(e){this.replacer=e}encode(e){return(e.type===k.EVENT||e.type===k.ACK)&&dt(e)?this.encodeAsBinary({type:e.type===k.EVENT?k.BINARY_EVENT:k.BINARY_ACK,nsp:e.nsp,data:e.data,id:e.id}):[this.encodeAsString(e)]}encodeAsString(e){let t=""+e.type;return(e.type===k.BINARY_EVENT||e.type===k.BINARY_ACK)&&(t+=e.attachments+"-"),e.nsp&&e.nsp!=="/"&&(t+=e.nsp+","),e.id!=null&&(t+=e.id),e.data!=null&&(t+=JSON.stringify(e.data,this.replacer)),t}encodeAsBinary(e){const t=di(e),i=this.encodeAsString(t.packet),n=t.buffers;return n.unshift(i),n}}class jt extends G{constructor(e){super(),this.opts=Object.assign({reviver:void 0,maxAttachments:10},typeof e=="function"?{reviver:e}:e)}add(e){let t;if(typeof e=="string"){if(this.reconstructor)throw new Error("got plaintext data when reconstructing a packet");t=this.decodeString(e);const i=t.type===k.BINARY_EVENT;i||t.type===k.BINARY_ACK?(t.type=i?k.EVENT:k.ACK,this.reconstructor=new mi(t),t.attachments===0&&super.emitReserved("decoded",t)):super.emitReserved("decoded",t)}else if(qt(e)||e.base64)if(this.reconstructor)t=this.reconstructor.takeBinaryData(e),t&&(this.reconstructor=null,super.emitReserved("decoded",t));else throw new Error("got binary data when not reconstructing a packet");else throw new Error("Unknown type: "+e)}decodeString(e){let t=0;const i={type:Number(e.charAt(0))};if(k[i.type]===void 0)throw new Error("unknown packet type "+i.type);if(i.type===k.BINARY_EVENT||i.type===k.BINARY_ACK){const c=t+1;for(;e.charAt(++t)!=="-"&&t!=e.length;);const s=e.substring(c,t);if(s!=Number(s)||e.charAt(t)!=="-")throw new Error("Illegal attachments");const p=Number(s);if(!yi(p)||p<0)throw new Error("Illegal attachments");if(p>this.opts.maxAttachments)throw new Error("too many attachments");i.attachments=p}if(e.charAt(t+1)==="/"){const c=t+1;for(;++t&&!(e.charAt(t)===","||t===e.length););i.nsp=e.substring(c,t)}else i.nsp="/";const n=e.charAt(t+1);if(n!==""&&Number(n)==n){const c=t+1;for(;++t;){const s=e.charAt(t);if(s==null||Number(s)!=s){--t;break}if(t===e.length)break}i.id=Number(e.substring(c,t+1))}if(e.charAt(++t)){const c=this.tryParse(e.substr(t));if(jt.isPayloadValid(i.type,c))i.data=c;else throw new Error("invalid payload")}return i}tryParse(e){try{return JSON.parse(e,this.opts.reviver)}catch{return!1}}static isPayloadValid(e,t){switch(e){case k.CONNECT:return ea(t);case k.DISCONNECT:return t===void 0;case k.CONNECT_ERROR:return typeof t=="string"||ea(t);case k.EVENT:case k.BINARY_EVENT:return Array.isArray(t)&&(typeof t[0]=="number"||typeof t[0]=="string"&&pi.indexOf(t[0])===-1);case k.ACK:case k.BINARY_ACK:return Array.isArray(t)}}destroy(){this.reconstructor&&(this.reconstructor.finishedReconstruction(),this.reconstructor=null)}}class mi{constructor(e){this.packet=e,this.buffers=[],this.reconPack=e}takeBinaryData(e){if(this.buffers.push(e),this.buffers.length===this.reconPack.attachments){const t=ui(this.reconPack,this.buffers);return this.finishedReconstruction(),t}return null}finishedReconstruction(){this.reconPack=null,this.buffers=[]}}const yi=Number.isInteger||function(a){return typeof a=="number"&&isFinite(a)&&Math.floor(a)===a};function ea(a){return Object.prototype.toString.call(a)==="[object Object]"}const fi=Object.freeze(Object.defineProperty({__proto__:null,Decoder:jt,Encoder:vi,get PacketType(){return k}},Symbol.toStringTag,{value:"Module"}));function ve(a,e,t){return a.on(e,t),function(){a.off(e,t)}}const gi=Object.freeze({connect:1,connect_error:1,disconnect:1,disconnecting:1,newListener:1,removeListener:1});class fa extends G{constructor(e,t,i){super(),this.connected=!1,this.recovered=!1,this.receiveBuffer=[],this.sendBuffer=[],this._queue=[],this._queueSeq=0,this.ids=0,this.acks={},this.flags={},this.io=e,this.nsp=t,i&&i.auth&&(this.auth=i.auth),this._opts=Object.assign({},i),this.io._autoConnect&&this.open()}get disconnected(){return!this.connected}subEvents(){if(this.subs)return;const e=this.io;this.subs=[ve(e,"open",this.onopen.bind(this)),ve(e,"packet",this.onpacket.bind(this)),ve(e,"error",this.onerror.bind(this)),ve(e,"close",this.onclose.bind(this))]}get active(){return!!this.subs}connect(){return this.connected?this:(this.subEvents(),this.io._reconnecting||this.io.open(),this.io._readyState==="open"&&this.onopen(),this)}open(){return this.connect()}send(...e){return e.unshift("message"),this.emit.apply(this,e),this}emit(e,...t){var i,n,c;if(gi.hasOwnProperty(e))throw new Error('"'+e.toString()+'" is a reserved event name');if(t.unshift(e),this._opts.retries&&!this.flags.fromQueue&&!this.flags.volatile)return this._addToQueue(t),this;const s={type:k.EVENT,data:t};if(s.options={},s.options.compress=this.flags.compress!==!1,typeof t[t.length-1]=="function"){const $=this.ids++,h=t.pop();this._registerAckCallback($,h),s.id=$}const p=(n=(i=this.io.engine)===null||i===void 0?void 0:i.transport)===null||n===void 0?void 0:n.writable,m=this.connected&&!(!((c=this.io.engine)===null||c===void 0)&&c._hasPingExpired());return this.flags.volatile&&!p||(m?(this.notifyOutgoingListeners(s),this.packet(s)):this.sendBuffer.push(s)),this.flags={},this}_registerAckCallback(e,t){var i;const n=(i=this.flags.timeout)!==null&&i!==void 0?i:this._opts.ackTimeout;if(n===void 0){this.acks[e]=t;return}const c=this.io.setTimeoutFn(()=>{delete this.acks[e];for(let p=0;p<this.sendBuffer.length;p++)this.sendBuffer[p].id===e&&this.sendBuffer.splice(p,1);t.call(this,new Error("operation has timed out"))},n),s=(...p)=>{this.io.clearTimeoutFn(c),t.apply(this,p)};s.withError=!0,this.acks[e]=s}emitWithAck(e,...t){return new Promise((i,n)=>{const c=(s,p)=>s?n(s):i(p);c.withError=!0,t.push(c),this.emit(e,...t)})}_addToQueue(e){let t;typeof e[e.length-1]=="function"&&(t=e.pop());const i={id:this._queueSeq++,tryCount:0,pending:!1,args:e,flags:Object.assign({fromQueue:!0},this.flags)};e.push((n,...c)=>(this._queue[0],n!==null?i.tryCount>this._opts.retries&&(this._queue.shift(),t&&t(n)):(this._queue.shift(),t&&t(null,...c)),i.pending=!1,this._drainQueue())),this._queue.push(i),this._drainQueue()}_drainQueue(e=!1){if(!this.connected||this._queue.length===0)return;const t=this._queue[0];t.pending&&!e||(t.pending=!0,t.tryCount++,this.flags=t.flags,this.emit.apply(this,t.args))}packet(e){e.nsp=this.nsp,this.io._packet(e)}onopen(){typeof this.auth=="function"?this.auth(e=>{this._sendConnectPacket(e)}):this._sendConnectPacket(this.auth)}_sendConnectPacket(e){this.packet({type:k.CONNECT,data:this._pid?Object.assign({pid:this._pid,offset:this._lastOffset},e):e})}onerror(e){this.connected||this.emitReserved("connect_error",e)}onclose(e,t){this.connected=!1,delete this.id,this.emitReserved("disconnect",e,t),this._clearAcks()}_clearAcks(){Object.keys(this.acks).forEach(e=>{if(!this.sendBuffer.some(i=>String(i.id)===e)){const i=this.acks[e];delete this.acks[e],i.withError&&i.call(this,new Error("socket has been disconnected"))}})}onpacket(e){if(e.nsp===this.nsp)switch(e.type){case k.CONNECT:e.data&&e.data.sid?this.onconnect(e.data.sid,e.data.pid):this.emitReserved("connect_error",new Error("It seems you are trying to reach a Socket.IO server in v2.x with a v3.x client, but they are not compatible (more information here: https://socket.io/docs/v3/migrating-from-2-x-to-3-0/)"));break;case k.EVENT:case k.BINARY_EVENT:this.onevent(e);break;case k.ACK:case k.BINARY_ACK:this.onack(e);break;case k.DISCONNECT:this.ondisconnect();break;case k.CONNECT_ERROR:this.destroy();const i=new Error(e.data.message);i.data=e.data.data,this.emitReserved("connect_error",i);break}}onevent(e){const t=e.data||[];e.id!=null&&t.push(this.ack(e.id)),this.connected?this.emitEvent(t):this.receiveBuffer.push(Object.freeze(t))}emitEvent(e){if(this._anyListeners&&this._anyListeners.length){const t=this._anyListeners.slice();for(const i of t)i.apply(this,e)}super.emit.apply(this,e),this._pid&&e.length&&typeof e[e.length-1]=="string"&&(this._lastOffset=e[e.length-1])}ack(e){const t=this;let i=!1;return function(...n){i||(i=!0,t.packet({type:k.ACK,id:e,data:n}))}}onack(e){const t=this.acks[e.id];typeof t=="function"&&(delete this.acks[e.id],t.withError&&e.data.unshift(null),t.apply(this,e.data))}onconnect(e,t){this.id=e,this.recovered=t&&this._pid===t,this._pid=t,this.connected=!0,this.emitBuffered(),this._drainQueue(!0),this.emitReserved("connect")}emitBuffered(){this.receiveBuffer.forEach(e=>this.emitEvent(e)),this.receiveBuffer=[],this.sendBuffer.forEach(e=>{this.notifyOutgoingListeners(e),this.packet(e)}),this.sendBuffer=[]}ondisconnect(){this.destroy(),this.onclose("io server disconnect")}destroy(){this.subs&&(this.subs.forEach(e=>e()),this.subs=void 0),this.io._destroy(this)}disconnect(){return this.connected&&this.packet({type:k.DISCONNECT}),this.destroy(),this.connected&&this.onclose("io client disconnect"),this}close(){return this.disconnect()}compress(e){return this.flags.compress=e,this}get volatile(){return this.flags.volatile=!0,this}timeout(e){return this.flags.timeout=e,this}onAny(e){return this._anyListeners=this._anyListeners||[],this._anyListeners.push(e),this}prependAny(e){return this._anyListeners=this._anyListeners||[],this._anyListeners.unshift(e),this}offAny(e){if(!this._anyListeners)return this;if(e){const t=this._anyListeners;for(let i=0;i<t.length;i++)if(e===t[i])return t.splice(i,1),this}else this._anyListeners=[];return this}listenersAny(){return this._anyListeners||[]}onAnyOutgoing(e){return this._anyOutgoingListeners=this._anyOutgoingListeners||[],this._anyOutgoingListeners.push(e),this}prependAnyOutgoing(e){return this._anyOutgoingListeners=this._anyOutgoingListeners||[],this._anyOutgoingListeners.unshift(e),this}offAnyOutgoing(e){if(!this._anyOutgoingListeners)return this;if(e){const t=this._anyOutgoingListeners;for(let i=0;i<t.length;i++)if(e===t[i])return t.splice(i,1),this}else this._anyOutgoingListeners=[];return this}listenersAnyOutgoing(){return this._anyOutgoingListeners||[]}notifyOutgoingListeners(e){if(this._anyOutgoingListeners&&this._anyOutgoingListeners.length){const t=this._anyOutgoingListeners.slice();for(const i of t)i.apply(this,e.data)}}}function Ye(a){a=a||{},this.ms=a.min||100,this.max=a.max||1e4,this.factor=a.factor||2,this.jitter=a.jitter>0&&a.jitter<=1?a.jitter:0,this.attempts=0}Ye.prototype.duration=function(){var a=this.ms*Math.pow(this.factor,this.attempts++);if(this.jitter){var e=Math.random(),t=Math.floor(e*this.jitter*a);a=(Math.floor(e*10)&1)==0?a-t:a+t}return Math.min(a,this.max)|0};Ye.prototype.reset=function(){this.attempts=0};Ye.prototype.setMin=function(a){this.ms=a};Ye.prototype.setMax=function(a){this.max=a};Ye.prototype.setJitter=function(a){this.jitter=a};class Bt extends G{constructor(e,t){var i;super(),this.nsps={},this.subs=[],e&&typeof e=="object"&&(t=e,e=void 0),t=t||{},t.path=t.path||"/socket.io",this.opts=t,ft(this,t),this.reconnection(t.reconnection!==!1),this.reconnectionAttempts(t.reconnectionAttempts||1/0),this.reconnectionDelay(t.reconnectionDelay||1e3),this.reconnectionDelayMax(t.reconnectionDelayMax||5e3),this.randomizationFactor((i=t.randomizationFactor)!==null&&i!==void 0?i:.5),this.backoff=new Ye({min:this.reconnectionDelay(),max:this.reconnectionDelayMax(),jitter:this.randomizationFactor()}),this.timeout(t.timeout==null?2e4:t.timeout),this._readyState="closed",this.uri=e;const n=t.parser||fi;this.encoder=new n.Encoder,this.decoder=new n.Decoder,this._autoConnect=t.autoConnect!==!1,this._autoConnect&&this.open()}reconnection(e){return arguments.length?(this._reconnection=!!e,e||(this.skipReconnect=!0),this):this._reconnection}reconnectionAttempts(e){return e===void 0?this._reconnectionAttempts:(this._reconnectionAttempts=e,this)}reconnectionDelay(e){var t;return e===void 0?this._reconnectionDelay:(this._reconnectionDelay=e,(t=this.backoff)===null||t===void 0||t.setMin(e),this)}randomizationFactor(e){var t;return e===void 0?this._randomizationFactor:(this._randomizationFactor=e,(t=this.backoff)===null||t===void 0||t.setJitter(e),this)}reconnectionDelayMax(e){var t;return e===void 0?this._reconnectionDelayMax:(this._reconnectionDelayMax=e,(t=this.backoff)===null||t===void 0||t.setMax(e),this)}timeout(e){return arguments.length?(this._timeout=e,this):this._timeout}maybeReconnectOnOpen(){!this._reconnecting&&this._reconnection&&this.backoff.attempts===0&&this.reconnect()}open(e){if(~this._readyState.indexOf("open"))return this;this.engine=new ni(this.uri,this.opts);const t=this.engine,i=this;this._readyState="opening",this.skipReconnect=!1;const n=ve(t,"open",function(){i.onopen(),e&&e()}),c=p=>{this.cleanup(),this._readyState="closed",this.emitReserved("error",p),e?e(p):this.maybeReconnectOnOpen()},s=ve(t,"error",c);if(this._timeout!==!1){const p=this._timeout,m=this.setTimeoutFn(()=>{n(),c(new Error("timeout")),t.close()},p);this.opts.autoUnref&&m.unref(),this.subs.push(()=>{this.clearTimeoutFn(m)})}return this.subs.push(n),this.subs.push(s),this}connect(e){return this.open(e)}onopen(){this.cleanup(),this._readyState="open",this.emitReserved("open");const e=this.engine;this.subs.push(ve(e,"ping",this.onping.bind(this)),ve(e,"data",this.ondata.bind(this)),ve(e,"error",this.onerror.bind(this)),ve(e,"close",this.onclose.bind(this)),ve(this.decoder,"decoded",this.ondecoded.bind(this)))}onping(){this.emitReserved("ping")}ondata(e){try{this.decoder.add(e)}catch(t){this.onclose("parse error",t)}}ondecoded(e){yt(()=>{this.emitReserved("packet",e)},this.setTimeoutFn)}onerror(e){this.emitReserved("error",e)}socket(e,t){let i=this.nsps[e];return i?this._autoConnect&&!i.active&&i.connect():(i=new fa(this,e,t),this.nsps[e]=i),i}_destroy(e){const t=Object.keys(this.nsps);for(const i of t)if(this.nsps[i].active)return;this._close()}_packet(e){const t=this.encoder.encode(e);for(let i=0;i<t.length;i++)this.engine.write(t[i],e.options)}cleanup(){this.subs.forEach(e=>e()),this.subs.length=0,this.decoder.destroy()}_close(){this.skipReconnect=!0,this._reconnecting=!1,this.onclose("forced close")}disconnect(){return this._close()}onclose(e,t){var i;this.cleanup(),(i=this.engine)===null||i===void 0||i.close(),this.backoff.reset(),this._readyState="closed",this.emitReserved("close",e,t),this._reconnection&&!this.skipReconnect&&this.reconnect()}reconnect(){if(this._reconnecting||this.skipReconnect)return this;const e=this;if(this.backoff.attempts>=this._reconnectionAttempts)this.backoff.reset(),this.emitReserved("reconnect_failed"),this._reconnecting=!1;else{const t=this.backoff.duration();this._reconnecting=!0;const i=this.setTimeoutFn(()=>{e.skipReconnect||(this.emitReserved("reconnect_attempt",e.backoff.attempts),!e.skipReconnect&&e.open(n=>{n?(e._reconnecting=!1,e.reconnect(),this.emitReserved("reconnect_error",n)):e.onreconnect()}))},t);this.opts.autoUnref&&i.unref(),this.subs.push(()=>{this.clearTimeoutFn(i)})}}onreconnect(){const e=this.backoff.attempts;this._reconnecting=!1,this.backoff.reset(),this.emitReserved("reconnect",e)}}const et={};function ut(a,e){typeof a=="object"&&(e=a,a=void 0),e=e||{};const t=si(a,e.path||"/socket.io"),i=t.source,n=t.id,c=t.path,s=et[n]&&c in et[n].nsps,p=e.forceNew||e["force new connection"]||e.multiplex===!1||s;let m;return p?m=new Bt(i,e):(et[n]||(et[n]=new Bt(i,e)),m=et[n]),t.query&&!e.query&&(e.query=t.queryKey),m.socket(t.path,e)}Object.assign(ut,{Manager:Bt,Socket:fa,io:ut,connect:ut});const R=window.location.origin,hi=[{title:"SERVIDORES",items:[["◈","Servidor actual",""],["⌁","Invitaciones",""],["♧","Miembros",""],["♙","Roles",""],["▣","Canales",""],["▤","Logs del servidor",""]]},{title:"COMANDOS",items:[["⚙","Comandos","»"],["✣","Slash Commands",""],["▢","Mensajes",""],["◫","Auto Respuestas",""]]},{title:"MODERACIÓN",items:[["◆","Moderación","»"],["◉","Advertencias",""],["⊗","Baneos",""],["◔","Muteos",""],["⌁","Anti Raid",""],["✦","Auto Mod",""]]},{title:"SISTEMA",items:[["▤","Logs","»"],["◷","Auditoría",""],["□","Tareas programadas",""],["▣","Backups",""],["⌘","Webhooks",""]]},{title:"CONFIGURACIÓN",items:[["⚙","Configuración","»"],["✎","Personalización",""],["⌁","Variables de entorno",""],["◇","Tokens",""],["⊙","Permisos",""],["⌘","Integraciones",""]]}],bi=hi.map(a=>`
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
  class="public-side-item owner-only"
  id="publicLicenses"
  type="button"
>

     <span class="public-side-icon">
      🔑
    </span>

    <span>
      Licencias
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
        ${bi}
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
`;const Ei=document.getElementById("serverSwitcher"),wi=document.getElementById("serverCurrent"),Et=document.getElementById("serverCurrentIcon"),vt=document.getElementById("serverCurrentName"),Ft=document.getElementById("serverDropdown"),wt=document.getElementById("serverDropdownList"),Ci=document.getElementById("serverDropdownCount"),ta=document.getElementById("profileAvatar"),Dt=document.getElementById("profileDisplayName"),xt=document.getElementById("profileUsername"),aa=document.getElementById("ownerAvatar"),Nt=document.getElementById("ownerDisplayName"),$t=document.getElementById("ownerUsername");document.getElementById("welcomeUsername");let me=[],J=localStorage.getItem("nebulaSelectedServerId")||"";function Je(a){return String(a||"N").split(/\s+/).filter(Boolean).slice(0,2).map(e=>e.charAt(0)).join("").toUpperCase()}function Rt(a){if(!a){vt.textContent="Seleccioná un servidor",Et.textContent="N";return}vt.textContent=a.name||"Servidor",a.icon?Et.innerHTML=`
      <img
        src="${a.icon}"
        alt="${a.name}"
      >
    `:Et.textContent=Je(a.name)}function Ht(a){a?.id&&(J=String(a.id),localStorage.setItem("nebulaSelectedServerId",J),Rt(a),Ft.classList.remove("open"),window.dispatchEvent(new CustomEvent("nebula:server-changed",{detail:{server:a}})))}function mt(){if(Ci.textContent=String(me.length),me.length===0){wt.innerHTML=`
      <div class="server-dropdown-empty">
        No se encontraron servidores.
      </div>
    `,Rt(null);return}let a=me.find(e=>String(e.id)===String(J));a||(a=me[0],J=String(a.id),localStorage.setItem("nebulaSelectedServerId",J)),wt.innerHTML=me.map(e=>{const t=String(e.id)===String(J),i=e.icon?`<img
                 src="${e.icon}"
                 alt="${e.name}"
               >`:Je(e.name);return`
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
        `}).join(""),Rt(a),wt.querySelectorAll("[data-server-id]").forEach(e=>{e.addEventListener("click",()=>{const t=me.find(i=>String(i.id)===String(e.dataset.serverId));Ht(t),mt(),t?.botPresent&&Me(t.id)})})}let _=null,Pt={name:"Nebula Bot",avatar:""};async function Si(){const a=new AbortController,e=setTimeout(()=>{a.abort()},1e4);try{const t=await fetch(`${R}/api/dashboard/session`,{method:"GET",headers:{Accept:"application/json"},credentials:"include",cache:"no-store",signal:a.signal}),i=await t.json();if(t.status===401||!i.authenticated){window.location.replace("/auth/dashboard");return}if(!t.ok||!i.success||!i.data)throw new Error(i.message||"No se pudo cargar la sesión.");const n=i.data;_=n.user||null;const c=_?.hasAccess===!0||_?.isOwner===!0;me=Array.isArray(n.guilds)?n.guilds:[],Mt(_),mt();const s=new URLSearchParams(window.location.search);c?s.get("view")==="servers"?Xe():(P.innerHTML=ha,Mt(_),mt(),Gt()):(ga(),window.history.replaceState({},"","/?view=access"))}catch(t){if(console.error("Error cargando la sesión:",t),t.name==="AbortError"){Dt.textContent="Servidor sin respuesta",xt.innerHTML="<i></i> Reintentá",Nt.textContent="Servidor sin respuesta",$t.textContent="Recargá la página",vt.textContent="Sin respuesta";return}Dt.textContent="Sesión no disponible",xt.innerHTML="<i></i> Discord",Nt.textContent="Sesión no disponible",$t.textContent="@discord",vt.textContent="Sin conexión",setTimeout(()=>{window.location.replace("/auth/dashboard")},1500)}finally{clearTimeout(e)}}function Mt(a){if(!a)return;const e=a.displayName||a.globalName||a.username||"Usuario",t=a.username||"discord";Dt.textContent=e,xt.innerHTML=`
    <i></i>
    @${t}
  `,Nt.textContent=e,$t.textContent=`@${t}`;const i=document.getElementById("welcomeUsername"),n=document.getElementById("publicLicenses");if(n&&(n.style.display=a?.isOwner?"flex":"none"),i&&(i.textContent=e),a.avatar){const c=`
      <img
        src="${a.avatar}"
        alt="${e}"
      >
    `;ta.innerHTML=c,aa.innerHTML=c}else{const c=Je(e);ta.textContent=c,aa.textContent=c}}function ga(){document.body.classList.add("servers-selection-mode");const a=_?.displayName||_?.username||"Usuario",e=_?.username||"discord";P.innerHTML=`
    <div class="dynamic-page access-page">
      <section class="access-card">
        <div class="access-lock">
          🔒
        </div>

        <span class="access-eyebrow">
          NEBULA DASHBOARD
        </span>

        <h1>
          Acceso restringido
        </h1>

        <p>
          Hola <strong>${a}</strong>.
          Tu cuenta de Discord todavía no tiene acceso al dashboard.
        </p>

        <small>
          @${e}
        </small>

        <div class="access-key-inputs">
          <input
            id="accessKeyInput"
            type="text"
            placeholder="NEBULA-XXXX-XXXX-XXXX"
            maxlength="24"
            autocomplete="off"
          >
        </div>

        <button
          id="validateAccessKey"
          type="button"
        >
          Validar Key
        </button>

        <div
          class="access-message"
          id="accessMessage"
        ></div>

        <p class="access-help">
          ¿No tenés una key?
          Solicitásela al administrador.
        </p>
      </section>
    </div>
  `;const t=document.getElementById("accessKeyInput"),i=document.getElementById("validateAccessKey"),n=document.getElementById("accessMessage");t?.addEventListener("input",()=>{t.value=t.value.toUpperCase().replace(/[^A-Z0-9-]/g,"")}),i?.addEventListener("click",async()=>{const c=t.value.trim().toUpperCase();if(!c){n.textContent="Ingresá una Key de acceso.";return}i.disabled=!0,i.textContent="Validando...",n.textContent="Comprobando la Key...";try{const s=await fetch(`${R}/api/licenses/activate`,{method:"POST",headers:{"Content-Type":"application/json",Accept:"application/json"},credentials:"include",body:JSON.stringify({key:c})}),p=await s.json();if(!s.ok||!p.success)throw new Error(p.message||"La Key no es válida.");n.textContent="Key activada correctamente. Entrando...",_&&(_.hasAccess=!0),setTimeout(()=>{window.location.replace("/?view=servers")},700)}catch(s){n.textContent=s.message||"No se pudo validar la Key.",i.disabled=!1,i.textContent="Validar Key"}})}function Xe(){document.body.classList.add("servers-selection-mode");const e=me.map(t=>{const i=Je(t.name),n=t.icon?`
              <img
                src="${t.icon}"
                alt="${t.name}"
              >
            `:`
              <span>
                ${i}
              </span>
            `,c=t.botPresent?`
              <span class="session-server-online">
                ● Bot conectado
              </span>
            `:`
              <span class="session-server-missing">
                Bot no agregado
              </span>
            `,s=t.botPresent?`
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
              ${n}
            </div>

            <div class="session-server-info">
              <strong>
                ${t.name}
              </strong>

              <span>
                ${t.memberCount?`${Number(t.memberCount).toLocaleString("es-AR")} miembros`:"Cantidad no disponible"}
              </span>

              ${c}
            </div>

            ${s}
          </article>
        `}).join("");P.innerHTML=`
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
          ${_?.avatar?`
                <img
                  src="${_.avatar}"
                  alt="${_.displayName}"
                >
              `:Je(_?.displayName)}
        </div>

        <div>
          <span>
            Sesión iniciada como
          </span>

          <strong>
            ${_?.displayName||_?.username||"Usuario"}
          </strong>

          <small>
            @${_?.username||"discord"}
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
  `,document.querySelectorAll(".session-manage-server").forEach(t=>{t.addEventListener("click",async()=>{const i=t.dataset.serverId,n=me.find(c=>String(c.id)===String(i));n&&(Ht(n),document.body.classList.remove("servers-selection-mode"),await Me(i))})}),document.querySelectorAll(".session-invite-server").forEach(t=>{t.addEventListener("click",()=>{const i=t.dataset.serverId;Ai(i,t)})}),document.getElementById("sessionInviteBot")?.addEventListener("click",()=>{window.open("/auth/bot/invite","_blank","noopener,noreferrer")})}async function Ai(a,e){const t=e.textContent;if(e.disabled=!0,e.textContent="Esperando autorización...",!window.open(`/auth/bot/invite?guildId=${encodeURIComponent(a)}`,"_blank","noopener,noreferrer")){window.location.href=`/auth/bot/invite?guildId=${encodeURIComponent(a)}`;return}const n=Date.now(),c=12e4,s=2500;async function p(){try{const D=await fetch(`${R}/api/servers/${encodeURIComponent(a)}`,{credentials:"include",cache:"no-store"}),$=await D.json();if(D.ok&&$.success&&$.data){clearInterval(m),e.textContent="Bot agregado ✓";const h=me.find(M=>String(M.id)===String(a));h&&(h.botPresent=!0,Ht(h)),setTimeout(()=>{Me(a)},600);return}Date.now()-n>c&&(clearInterval(m),e.disabled=!1,e.textContent="Comprobar nuevamente")}catch(D){console.log("El bot todavía no aparece en el servidor:",D.message)}}const m=setInterval(p,s);p(),setTimeout(()=>{clearInterval(m),e.textContent==="Esperando autorización..."&&(e.disabled=!1,e.textContent=t)},c)}wi.addEventListener("click",a=>{a.stopPropagation(),Ft.classList.toggle("open")});document.addEventListener("click",a=>{Ei.contains(a.target)||Ft.classList.remove("open")});const ee=document.getElementById("toast"),Ie=()=>{ee.classList.add("show"),clearTimeout(window.toastTimer),window.toastTimer=setTimeout(()=>ee.classList.remove("show"),2300)};document.querySelectorAll("button").forEach(a=>{a.addEventListener("click",()=>{a.id==="openWelcomeVariables"||a.id==="hamburger"||a.id==="serverCurrent"||a.id==="topProfile"||a.id==="sessionInviteBot"||a.id==="publicMyServers"||a.id==="publicInviteBot"||a.id==="publicBotStatus"||a.id==="publicSupport"||a.id==="publicLogout"||a.id==="publicDiscordSupport"||a.id==="publicLicenses"||a.classList.contains("public-support-button")||a.classList.contains("server-dropdown-item")||a.classList.contains("session-invite-server")||a.classList.contains("session-manage-server")||a.classList.contains("verify-variable-button")||Ie()})});document.querySelectorAll(".side-item").forEach(a=>{a.addEventListener("click",()=>{document.querySelectorAll(".side-item").forEach(e=>e.classList.remove("active")),a.classList.add("active")})});let pt=null;function Pe(){pt&&(clearInterval(pt),pt=null)}document.getElementById("publicMyServers")?.addEventListener("click",()=>{if(Pe(),!(_?.hasAccess===!0||_?.isOwner===!0)){ga(),window.history.replaceState({},"","/?view=access");return}Xe(),window.history.replaceState({},"","/?view=servers")});document.getElementById("publicInviteBot")?.addEventListener("click",()=>{Pe(),window.open("/auth/bot/invite","_blank","noopener,noreferrer")});document.getElementById("publicBotStatus")?.addEventListener("click",()=>{document.body.classList.add("servers-selection-mode"),Pe(),P.innerHTML=`
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
      `;async function a(){const e=document.getElementById("liveBotConnection"),t=document.getElementById("liveBotLatency"),i=document.getElementById("liveBotUptime"),n=document.getElementById("liveBotUpdatedAt");if(!e||!t||!i||!n){Pe();return}try{const c=await fetch(`${R}/api/bot/status`,{method:"GET",headers:{Accept:"application/json"},cache:"no-store",credentials:"include"}),s=await c.json();if(!c.ok||!s.success)throw new Error(s.message||"No se pudo consultar el bot.");const p=s.data||{},m=p.status==="online"||p.online===!0;e.textContent=m?"En línea":"Desconectado",e.classList.toggle("live-status-online",m),e.classList.toggle("live-status-offline",!m),i.textContent=p.uptime||"Sin datos",n.textContent=new Date().toLocaleTimeString("es-AR")}catch(c){console.error("Error actualizando el estado del bot:",c),e.textContent="Sin conexión",e.classList.remove("live-status-online"),e.classList.add("live-status-offline"),n.textContent="Error"}}a(),pt=setInterval(a,500)});document.getElementById("publicLicenses")?.addEventListener("click",()=>{if(Pe(),!_?.isOwner){alert("No tenés permisos para acceder a esta sección.");return}document.body.classList.add("servers-selection-mode"),P.innerHTML=`
<div class="dynamic-page">

<section class="section-header">
<div>
<span>LICENCIAS</span>
<h1>Administrador de Licencias</h1>
<p>
Gestioná todas las licencias del dashboard desde un solo lugar.
</p>
</div>
</section>

<div class="licenses-top-layout">

  <section class="public-status-grid licenses-stats-grid">

    <article class="public-info-card">
      <span>TOTAL</span>
      <strong id="licenseTotal">0</strong>
      <p>Licencias creadas</p>
    </article>

    <article class="public-info-card">
      <span>ACTIVAS</span>
      <strong id="licenseActive">0</strong>
      <p>Licencias en uso</p>
    </article>

    <article class="public-info-card">
      <span>DISPONIBLES</span>
      <strong id="licenseUnused">0</strong>
      <p>Sin activar</p>
    </article>

    <article class="public-info-card">
      <span>REVOCADAS</span>
      <strong id="licenseRevoked">0</strong>
      <p>Deshabilitadas</p>
    </article>

  </section>

  <aside class="license-settings-card">

    <div class="license-settings-title">
      <span class="license-settings-icon">
        ⚙
      </span>

      <div>
        <h3>Configuración de Licencias</h3>
        <p>
          Configurá dónde se enviarán los registros.
        </p>
      </div>
    </div>

    <div class="license-setting-group">
      <label for="licenseLogsChannel">
        Canal de Logs
      </label>

      <select
        id="licenseLogsChannel"
        class="license-setting-select"
      >
        <option value="">
          Seleccionar un canal
        </option>

        <option value="demo">
          #logs-licencias
        </option>
      </select>
    </div>

    <div class="license-checkbox-list">

      <label class="license-checkbox-item">
        <input
          id="licenseLogCreation"
          type="checkbox"
          checked
        >
        <span>Registrar creación</span>
      </label>

      <label class="license-checkbox-item">
        <input
          id="licenseLogActivation"
          type="checkbox"
          checked
        >
        <span>Registrar activación</span>
      </label>

      <label class="license-checkbox-item">
        <input
          id="licenseLogExpiration"
          type="checkbox"
          checked
        >
        <span>Registrar expiración</span>
      </label>

      <label class="license-checkbox-item">
        <input
          id="licenseLogDeletion"
          type="checkbox"
          checked
        >
        <span>Registrar eliminación</span>
      </label>

      <label class="license-checkbox-item">
        <input
          id="licenseLogRevocation"
          type="checkbox"
          checked
        >
        <span>Registrar revocación</span>
      </label>

    </div>

    <button
      id="saveLicenseSettings"
      class="license-save-button"
      type="button"
    >
      💾 Guardar configuración
    </button>

  </aside>

</div>

<section class="panel licenses-list-panel">

  <div class="panel-head licenses-list-header">

    <div>
      <h3>Listado de Licencias</h3>

      <p class="licenses-list-description">
        Administrá, generá y controlá todas las licencias del sistema.
      </p>
    </div>

    <div class="licenses-header-actions">

      <button
        id="deleteAllLicensesButton"
        class="delete-all-licenses-button"
        type="button"
      >
        🗑 Borrar Keys
      </button>

      <button
        id="generateLicenseButton"
        class="generate-license-button"
        type="button"
      >
        🔑 Generar Key
      </button>

    </div>

  </div>

  <div
    id="licensesTable"
    class="licenses-table"
  >
    <div class="server-dropdown-empty">
      Todavía no hay licencias.
    </div>
  </div>

</section>

</div>
      `;const a=document.getElementById("generateLicenseButton"),e=document.getElementById("deleteAllLicensesButton"),t=document.getElementById("licensesTable"),i=document.getElementById("licenseTotal"),n=document.getElementById("licenseActive"),c=document.getElementById("licenseUnused"),s=document.getElementById("licenseRevoked"),p=document.getElementById("licenseLogsChannel"),m=document.getElementById("saveLicenseSettings"),D=document.getElementById("licenseLogCreation"),$=document.getElementById("licenseLogActivation"),h=document.getElementById("licenseLogExpiration"),M=document.getElementById("licenseLogDeletion"),B=document.getElementById("licenseLogRevocation");async function Ge(){if(p){if(!J){p.innerHTML=`
      <option value="">
        Primero seleccioná un servidor
      </option>
    `,p.disabled=!0;return}p.disabled=!0,p.innerHTML=`
    <option value="">
      Cargando canales...
    </option>
  `;try{const o=await fetch(`${R}/api/servers/${encodeURIComponent(J)}/text-channels`,{method:"GET",headers:{Accept:"application/json"},credentials:"include",cache:"no-store"}),u=await o.json();if(!o.ok||!u.success)throw new Error(u.message||"No se pudieron cargar los canales.");const y=Array.isArray(u.data)?u.data:[];p.innerHTML=`
      <option value="">
        Seleccionar un canal
      </option>

      ${y.map(g=>`
          <option value="${g.id}">
            #${g.name}
          </option>
        `).join("")}
    `,p.disabled=!1}catch(o){console.error("Error cargando canales de logs:",o),p.innerHTML=`
      <option value="">
        No se pudieron cargar los canales
      </option>
    `,p.disabled=!0}}}async function d(){if(!(!J||!p))try{const o=await fetch(`${R}/api/servers/${encodeURIComponent(J)}/license-settings`,{method:"GET",headers:{Accept:"application/json"},credentials:"include",cache:"no-store"}),u=await o.json();if(!o.ok||!u.success)throw new Error(u.message||"No se pudo cargar la configuración.");const y=u.data||{};p.value=y.logsChannelId||"",D.checked=y.creation!==!1,$.checked=y.activation!==!1,h.checked=y.expiration!==!1,M.checked=y.deletion!==!1,B.checked=y.revocation!==!1}catch(o){console.error("Error cargando configuración de licencias:",o)}}async function ye(){if(!J){alert("Primero seleccioná un servidor.");return}if(!m)return;const o=m.textContent;m.disabled=!0,m.textContent="Guardando...";try{const u=await fetch(`${R}/api/servers/${encodeURIComponent(J)}/license-settings`,{method:"POST",headers:{"Content-Type":"application/json",Accept:"application/json"},credentials:"include",body:JSON.stringify({logsChannelId:p?.value||"",creation:D?.checked===!0,activation:$?.checked===!0,expiration:h?.checked===!0,deletion:M?.checked===!0,revocation:B?.checked===!0})}),y=await u.json();if(!u.ok||!y.success)throw new Error(y.message||"No se pudo guardar la configuración.");m.textContent="✓ Configuración guardada",setTimeout(()=>{m.textContent=o},1800)}catch(u){console.error("Error guardando configuración de licencias:",u),alert(u.message||"No se pudo guardar la configuración."),m.textContent=o}finally{m.disabled=!1}}m?.addEventListener("click",ye);function ke(){document.querySelector(".license-config-overlay")?.remove(),document.body.insertAdjacentHTML("beforeend",`
      <div class="license-config-overlay">

        <div class="license-config-modal">

          <div class="license-config-header">

            <div class="license-config-title">
              <span>🔑</span>

              <div>
                <h2>Nueva Licencia</h2>

                <p>
                  Configurá la licencia antes de generarla.
                </p>
              </div>
            </div>

            <button
              class="license-config-close"
              id="closeLicenseModal"
              type="button"
            >
              ×
            </button>

          </div>

          <div class="license-config-field">

            <label>
              Duración
            </label>

            <div class="license-time-grid">

              <div class="license-time-field">
                <span>DÍAS</span>

                <input
                  id="licenseDays"
                  class="license-config-input"
                  type="number"
                  min="0"
                  max="9999"
                  value="30"
                >
              </div>

              <div class="license-time-field">
                <span>HORAS</span>

                <input
                  id="licenseHours"
                  class="license-config-input"
                  type="number"
                  min="0"
                  max="23"
                  value="0"
                >
              </div>

              <div class="license-time-field">
                <span>MINUTOS</span>

                <input
                  id="licenseMinutes"
                  class="license-config-input"
                  type="number"
                  min="0"
                  max="59"
                  value="0"
                >
              </div>

              <div class="license-time-field">
                <span>SEGUNDOS</span>

                <input
                  id="licenseSeconds"
                  class="license-config-input"
                  type="number"
                  min="0"
                  max="59"
                  value="0"
                >
              </div>

            </div>

          </div>

          <div class="license-duration-preview">

            <div>
              <span>
                VIGENCIA
              </span>

              <strong
                id="licenseExpirePreview"
              >
                Calculando...
              </strong>
            </div>

            <div
              class="license-modal-countdown"
              id="licenseModalCountdown"
            >
              ⏱ Calculando tiempo restante...
            </div>

            <b
              id="licensePermanentTag"
              class="license-permanent-badge"
              style="display:none"
            >
              PERMANENTE
            </b>

          </div>

          <div class="license-config-field">

            <label>
              Descripción
            </label>

            <textarea
              id="licenseDescription"
              class="license-config-textarea"
              placeholder="Ej: Licencia de prueba, cliente premium, etc."
            ></textarea>

          </div>

          <div class="license-config-actions">

            <button
              id="cancelGenerateLicense"
              class="license-config-cancel"
              type="button"
            >
              Cancelar
            </button>

            <button
              id="continueGenerateLicense"
              class="license-config-confirm"
              type="button"
            >
              Continuar →
            </button>

          </div>

        </div>

      </div>
    `),ne()}function ne(){const o=document.getElementById("licenseDays"),u=document.getElementById("licenseHours"),y=document.getElementById("licenseMinutes"),g=document.getElementById("licenseSeconds"),E=document.getElementById("licenseExpirePreview"),w=document.getElementById("licenseModalCountdown"),V=document.getElementById("licensePermanentTag");let z=null;function U(C,X,r){let l=Number(C?.value||0);return Number.isFinite(l)||(l=X),l=Math.floor(l),l=Math.min(r,Math.max(X,l)),C.value=String(l),l}function j(){const C=U(o,0,9999),X=U(u,0,23),r=U(y,0,59),l=U(g,0,59),v=C>=9999,f=v?null:C*24*60*60*1e3+X*60*60*1e3+r*60*1e3+l*1e3;return{days:C,hours:X,minutes:r,seconds:l,permanent:v,milliseconds:f}}function q(C){const X=Math.max(0,Math.floor(C/1e3)),r=Math.floor(X/86400),l=Math.floor(X%86400/3600),v=Math.floor(X%3600/60),f=X%60;return`${r}d ${String(l).padStart(2,"0")}h ${String(v).padStart(2,"0")}m ${String(f).padStart(2,"0")}s restantes`}function re(){const C=j();if(C.permanent){E.textContent="Licencia permanente",w.textContent="∞ Sin vencimiento",w.classList.add("permanent"),V.style.display="inline-flex";return}if(V.style.display="none",w.classList.remove("permanent"),!C.milliseconds||C.milliseconds<1e3){E.textContent="Duración no válida",w.textContent="La duración mínima es de 1 segundo";return}const X=Date.now()+C.milliseconds,r=new Date(X);E.textContent="Vence el "+r.toLocaleString("es-AR",{day:"2-digit",month:"2-digit",year:"numeric",hour:"2-digit",minute:"2-digit",second:"2-digit"}),w.textContent="⏱ "+q(C.milliseconds)}function W(){z&&(clearInterval(z),z=null),document.querySelector(".license-config-overlay")?.remove()}[o,u,y,g].forEach(C=>{C?.addEventListener("input",re),C?.addEventListener("change",re)}),document.getElementById("closeLicenseModal")?.addEventListener("click",W),document.getElementById("cancelGenerateLicense")?.addEventListener("click",W),document.getElementById("continueGenerateLicense")?.addEventListener("click",async()=>{const C=j(),X=document.getElementById("licenseDescription"),r=document.getElementById("continueGenerateLicense"),l=String(X?.value||"").trim();if(!C.permanent&&(!C.milliseconds||C.milliseconds<1e3)){window.alert("La duración mínima es de 1 segundo.");return}r.disabled=!0,r.textContent="Generando...",W(),await O({days:C.days,hours:C.hours,minutes:C.minutes,seconds:C.seconds,permanent:C.permanent,durationMilliseconds:C.milliseconds,description:l})}),re(),z=setInterval(re,1e3)}function T(o){return String(o??"").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;")}function te(o){if(!o)return"Sin fecha";const u=new Date(o);return Number.isNaN(u.getTime())?String(o):u.toLocaleString("es-AR",{day:"2-digit",month:"2-digit",year:"numeric",hour:"2-digit",minute:"2-digit"})}function Te(o){const u=String(o?.status||o?.state||"").trim().toLowerCase(),y=o?.revoked===!0||o?.disabled===!0||u==="revoked"||u==="revocada"||u==="disabled",g=o?.used===!0||o?.active===!0||o?.activated===!0||!!(o?.userId||o?.discordId||o?.discordUserId||o?.activatedBy||o?.user?.id)||u==="used"||u==="active"||u==="activa";return y?{className:"revoked",label:"Revocada",description:o?.revokedAt?`Revocada: ${te(o.revokedAt)}`:"Licencia deshabilitada"}:g?{className:"active",label:"Activa",description:o?.activatedAt?`Activada: ${te(o.activatedAt)}`:"Licencia en uso"}:{className:"available",label:"Disponible",description:"Nunca utilizada"}}function Le(o){const u=o?.user||o?.discordUser||(typeof o?.activatedBy=="object"?o.activatedBy:{}),y=u?.id||o?.userId||o?.discordId||o?.discordUserId||(typeof o?.activatedBy=="string"?o.activatedBy:""),g=u?.displayName||u?.globalName||u?.username||o?.activatedDisplayName||o?.activatedUsername||o?.displayName||o?.username||"",E=u?.username||o?.username||"",w=u?.avatar||o?.activatedAvatar||o?.avatar||o?.userAvatar||"",V=!!(y||g||E);return{assigned:V,id:String(y||""),displayName:g||E||"Sin asignar",username:E?`@${E}`:V?"Usuario de Discord":"Nunca utilizada",avatar:w}}function Be(o){return String(o).split(/\s+/).filter(Boolean).slice(0,2).map(u=>u.charAt(0)).join("").toUpperCase()}function Ee(o){const u=Le(o),y=u.avatar?`
          <img
            src="${T(u.avatar)}"
            alt="${T(u.displayName)}"
          >
        `:T(u.assigned?Be(u.displayName):"?");return`
    <div class="license-user ${u.assigned?"":"unassigned"}">

      <div class="license-user-avatar">
        ${y}
      </div>

      <div class="license-user-copy">

        <strong>
          ${T(u.displayName)}
        </strong>

        <span>
          ${u.id?`ID: ${T(u.id)}`:T(u.username)}
        </span>

      </div>

    </div>
  `}function Oe(o,u=!1){const y=o?.key||o?.licenseKey||o?.token||"KEY NO DISPONIBLE",g=o?.createdAt||o?.created||new Date().toISOString(),E=Number(o?.durationDays??o?.duration??0),w=Number(o?.durationHours??0),V=Number(o?.durationMinutes??0),z=Number(o?.durationSeconds??0),U=Number(o?.durationMilliseconds??E*864e5+w*36e5+V*6e4+z*1e3),j=o?.permanent===!0||E>=9999||String(o?.type||"").toLowerCase()==="permanente",q=String(o?.description||"Sin descripción").trim(),re=j?"Permanente":E>0?`${E} ${E===1?"día":"días"}`:o?.type||o?.plan||"Dashboard",W=j?null:o?.expiresAt||o?.expirationDate||o?.expires||(U>0?new Date(new Date(g).getTime()+U).toISOString():null),C=Te(o);return j||W&&`${te(W)}`,`
    <div
      class="license-generated-card ${u?"license-new-entry":""}"
      data-license-key="${T(y)}"
      data-license-duration="${T(String(E))}"
      data-license-permanent="${j?"true":"false"}"
      data-license-description="${T(q)}"
      data-license-created-at="${T(g)}"
      data-license-expires-at="${T(W||"")}"
    >

      <div class="license-generated-info">

        <span>
          LICENCIA
        </span>

        <strong title="${T(y)}">
          ${T(y)}
        </strong>

        <div class="license-meta">

          <span class="license-created-date">
            Creada:
            ${T(te(g))}
          </span>

          <span class="license-meta-separator">
            •
          </span>

          <span class="license-type">
            ${T(re)}
          </span>

        </div>

      ${j?`
      <div class="license-permanent-timer">
        <strong>∞</strong>
        <span>LICENCIA PERMANENTE</span>
      </div>
    `:`
      <div
        class="license-live-timer"
        data-license-countdown
        data-expires-at="${T(W||"")}"
      >

        <div class="license-time-box">
          <strong data-countdown-days>
            00
          </strong>

          <span>
            DÍAS
          </span>
        </div>

        <div class="license-time-box">
          <strong data-countdown-hours>
            00
          </strong>

          <span>
            HORAS
          </span>
        </div>

        <div class="license-time-box">
          <strong data-countdown-minutes>
            00
          </strong>

          <span>
            MINUTOS
          </span>
        </div>

        <div class="license-time-box">
          <strong data-countdown-seconds>
            00
          </strong>

          <span>
            SEGUNDOS
          </span>
        </div>

      </div>
    `}

</div>

      ${Ee(o)}

      <div class="license-state-column">

        <b class="license-status ${C.className}">
          ${C.label}
        </b>

        <span class="license-state-date">
          ${T(C.description)}
        </span>

      </div>

      <div class="license-actions">

        <button
          class="license-action-btn view"
          title="Ver detalles"
          type="button"
          data-license-action="view"
        >
          👁
        </button>

        <button
          class="license-action-btn edit"
          title="Editar"
          type="button"
          data-license-action="edit"
        >
          ✏️
        </button>

        <button
          class="license-action-btn copy"
          title="Copiar Key"
          type="button"
          data-license-action="copy"
          data-license-key="${T(y)}"
        >
          📋
        </button>

        <button
          class="license-action-btn delete"
          title="Eliminar"
          type="button"
          data-license-action="delete"
        >
          🗑
        </button>

      </div>

    </div>
  `}let _e=null;function De(){document.querySelectorAll("[data-license-countdown]").forEach(u=>{const y=u.dataset.expiresAt,g=u.querySelector("[data-countdown-days]"),E=u.querySelector("[data-countdown-hours]"),w=u.querySelector("[data-countdown-minutes]"),V=u.querySelector("[data-countdown-seconds]"),z=/^\d+$/.test(String(y))?Number(y):new Date(y).getTime();if(!y||Number.isNaN(z)){u.innerHTML=`
        <span class="license-countdown-error">
          Vencimiento no disponible
        </span>
      `;return}const U=z-Date.now();if(U<=0){u.innerHTML=`
            <span class="license-countdown-expired">
                LICENCIA EXPIRADA
            </span>
        `;const C=u.closest(".license-generated-card");C&&!C.dataset.expired&&(C.dataset.expired="true",ae(C.dataset.licenseKey));return}const j=Math.floor(U/864e5),q=Math.floor(U%864e5/36e5),re=Math.floor(U%36e5/6e4),W=Math.floor(U%6e4/1e3);g&&(g.textContent=String(j).padStart(2,"0")),E&&(E.textContent=String(q).padStart(2,"0")),w&&(w.textContent=String(re).padStart(2,"0")),V&&(V.textContent=String(W).padStart(2,"0"))})}async function ae(o){try{await fetch(`/api/licenses/${encodeURIComponent(o)}`,{method:"DELETE"});const u=document.querySelector(`[data-license-key="${CSS.escape(o)}"]`);u&&u.remove(),oe()}catch(u){console.error("Error eliminando licencia:",u)}}function Ve(){clearInterval(_e),De(),_e=setInterval(De,1e3)}function fe(){return`
    <div class="licenses-table-header">
      <span>Licencia</span>
      <span>Usuario</span>
      <span>Estado</span>
      <span style="text-align:right">
        Acciones
      </span>
    </div>
  `}function se(){return`
    ${fe()}

    <div class="licenses-empty-state">
      Todavía no hay licencias.
    </div>
  `}function H(){document.querySelector(".delete-licenses-overlay")?.remove(),document.body.insertAdjacentHTML("beforeend",`
      <div class="delete-licenses-overlay">

        <div class="delete-licenses-modal">

          <button
            class="delete-licenses-close"
            id="closeDeleteLicensesModal"
            type="button"
          >
            ×
          </button>

          <div class="delete-licenses-icon">
            🗑
          </div>

          <span class="delete-licenses-eyebrow">
            ACCIÓN DE SEGURIDAD
          </span>

          <h2>
            ¿Querés borrar todas las Keys?
          </h2>

          <p>
            Esta acción eliminará definitivamente todas
            las licencias guardadas y no se podrá deshacer.
          </p>

          <label for="deleteLicensesCode">
            Ingresá el código de seguridad
          </label>

          <input
            id="deleteLicensesCode"
            type="password"
            inputmode="numeric"
            maxlength="4"
            placeholder="••••"
            autocomplete="off"
          >

          <div
            class="delete-licenses-message"
            id="deleteLicensesMessage"
          ></div>

          <div class="delete-licenses-actions">

            <button
              id="cancelDeleteLicenses"
              class="delete-licenses-cancel"
              type="button"
            >
              Cancelar
            </button>

            <button
              id="confirmDeleteLicenses"
              class="delete-licenses-confirm"
              type="button"
            >
              Borrar todas
            </button>

          </div>

        </div>

      </div>
    `),Z()}function Z(){const o=document.querySelector(".delete-licenses-overlay"),u=document.getElementById("deleteLicensesCode"),y=document.getElementById("deleteLicensesMessage"),g=document.getElementById("confirmDeleteLicenses"),E=()=>{o?.remove()};document.getElementById("closeDeleteLicensesModal")?.addEventListener("click",E),document.getElementById("cancelDeleteLicenses")?.addEventListener("click",E),o?.addEventListener("click",w=>{w.target===o&&E()}),u?.addEventListener("input",()=>{u.value=u.value.replace(/\D/g,""),y.textContent=""}),u?.addEventListener("keydown",w=>{w.key==="Enter"&&g?.click()}),g?.addEventListener("click",async()=>{const w=String(u?.value||"").trim();if(!w){y.textContent="Ingresá el código de seguridad.";return}g.disabled=!0,g.textContent="Eliminando...",y.textContent="Comprobando código...";try{const V=await fetch(`${R}/api/licenses`,{method:"DELETE",credentials:"include",headers:{"Content-Type":"application/json",Accept:"application/json"},body:JSON.stringify({code:w})}),z=await V.json();if(!V.ok||!z.success)throw new Error(z.message||"No se pudieron borrar las Keys.");t&&(t.innerHTML=se()),oe(),y.textContent="Todas las Keys fueron eliminadas.",setTimeout(()=>{E()},700)}catch(V){y.textContent=V.message||"No se pudieron borrar las Keys.",g.disabled=!1,g.textContent="Borrar todas",u?.focus(),u?.select()}}),setTimeout(()=>{u?.focus()},100)}function ge(){if(!t)return;t.querySelector(".licenses-table-header")||t.insertAdjacentHTML("afterbegin",fe())}async function pe(){if(t){t.innerHTML=`
    ${fe()}

    <div class="licenses-empty-state">
      Cargando licencias...
    </div>
  `;try{const o=await fetch(`${R}/api/licenses`,{method:"GET",credentials:"include",headers:{Accept:"application/json"},cache:"no-store"}),u=await o.json();if(!o.ok||!u.success)throw new Error(u.message||"No se pudieron cargar las licencias.");const y=Array.isArray(u.licenses)?u.licenses:[];if(y.length===0){t.innerHTML=se(),oe();return}t.innerHTML=`
      ${fe()}

      ${y.map(g=>Oe(g,!1)).join("")}
    `,oe(),Ge(),d(),Ve()}catch(o){console.error("Error cargando licencias:",o),t.innerHTML=`
      ${fe()}

      <div class="license-generation-error">
        ❌ ${o.message||"No se pudieron cargar las licencias."}
      </div>
    `,oe()}}}function Ue(){t?.querySelector(".server-dropdown-empty")?.remove(),t?.querySelector(".licenses-empty-state")?.remove(),t?.querySelector(".license-generation-error")?.remove()}function oe(){if(!t)return;const o=[...t.querySelectorAll(".license-generated-card")],u=o.length,y=o.filter(w=>w.querySelector(".license-status.active, .license-status.used")).length,g=o.filter(w=>w.querySelector(".license-status.available")).length,E=o.filter(w=>w.querySelector(".license-status.revoked")).length;i&&(i.textContent=String(u)),n&&(n.textContent=String(y)),c&&(c.textContent=String(g)),s&&(s.textContent=String(E))}function xe(){t&&(t.querySelector(".license-generating-overlay")?.remove(),document.body.insertAdjacentHTML("beforeend",`
      <div class="license-generating-overlay">

        <div class="license-generating-box">

          <div class="license-generating-icon">
            🔑
          </div>

          <strong>
            Generando licencia...
          </strong>

          <p>
            Preparando una nueva Key de acceso.
          </p>

          <div class="license-generating-progress">
            <span></span>
          </div>

          <small class="license-generating-step">
            Conectando con Nebula...
          </small>

        </div>

      </div>
    `))}function qe(o){const u=document.querySelector(".license-generating-step");u&&(u.textContent=o)}function we(){const o=document.querySelector(".license-generating-box");if(!o)return;o.classList.add("is-success");const u=o.querySelector(".license-generating-icon"),y=o.querySelector("strong"),g=o.querySelector("p"),E=o.querySelector(".license-generating-step");u&&(u.textContent="✓"),y&&(y.textContent="Licencia creada"),g&&(g.textContent="La nueva Key fue agregada correctamente."),E&&(E.textContent="Proceso completado")}function je(){const o=document.querySelector(".license-generating-overlay");o&&(o.style.opacity="0",setTimeout(()=>{o.remove()},220))}function Ce(o){return new Promise(u=>setTimeout(u,o))}async function Se(o){const u=o.dataset.licenseKey||o.closest(".license-generated-card")?.dataset.licenseKey||"";if(u)try{await navigator.clipboard.writeText(u);const y=o.textContent;o.textContent="✓",o.classList.add("is-copied"),setTimeout(()=>{o.textContent=y,o.classList.remove("is-copied")},1300)}catch(y){console.error("No se pudo copiar la licencia:",y)}}function b(o){const u=o?.dataset.licenseKey||"Sin Key",y=o?.querySelector(".license-user-copy strong")?.textContent?.trim()||"Sin asignar",g=o?.querySelector(".license-user-copy span")?.textContent?.trim()||"Sin datos",E=o?.querySelector(".license-status")?.textContent?.trim()||"Sin estado",w=o?.querySelector(".license-duration-text")?.textContent?.replace(/\s+/g," ")?.trim()||"Duración no disponible",V=o?.querySelector(".license-expiration-text")?.textContent?.replace(/\s+/g," ")?.trim()||"Vencimiento no disponible";alert(`DETALLES DE LA LICENCIA

Key: ${u}
Usuario: ${y}
${g}
${w}
${V}
Estado: ${E}`)}function A(o){const u=o?.dataset.licenseKey||"",y=prompt("Editar el nombre visible de la Key:",u);if(!y||y.trim()===u)return;const g=y.trim().toUpperCase();o.dataset.licenseKey=g;const E=o.querySelector(".license-generated-info > strong"),w=o.querySelector(".license-action-btn.copy");E&&(E.textContent=g,E.title=g),w&&(w.dataset.licenseKey=g)}async function x(o){const u=o?.dataset.licenseKey||"";if(!u){window.alert("No se pudo obtener la Key.");return}if(window.confirm(`¿Querés eliminar ${u} definitivamente?`))try{const g=await fetch(`${R}/api/licenses/${encodeURIComponent(u)}`,{method:"DELETE",headers:{Accept:"application/json"},credentials:"include"}),E=await g.json();if(!g.ok||!E.success)throw new Error(E.message||"No se pudo eliminar la licencia.");o.style.opacity="0",o.style.transform="translateX(20px)",setTimeout(()=>{o.remove(),oe(),t.querySelectorAll(".license-generated-card").length===0&&(t.innerHTML=se())},220)}catch(g){console.error("Error eliminando licencia:",g),window.alert(g.message||"No se pudo eliminar la licencia.")}}t?.addEventListener("click",o=>{const u=o.target.closest("[data-license-action]");if(!u)return;const y=u.closest(".license-generated-card"),g=u.dataset.licenseAction;if(g==="copy"){Se(u);return}if(g==="view"){b(y);return}if(g==="edit"){A(y);return}g==="delete"&&x(y)}),t&&pe();async function O(o){const u=Number(o.days||0),y=Number(o.hours||0),g=Number(o.minutes||0),E=Number(o.seconds||0),w=o.permanent===!0||u>=9999,V=u,z=a.innerHTML;a.disabled=!0,a.innerHTML="Generando Key...",xe();try{qe("Validando datos..."),await Ce(350),qe("Generando código único...");const U=await fetch(`${R}/api/licenses/generate`,{method:"POST",credentials:"include",headers:{"Content-Type":"application/json",Accept:"application/json"},body:JSON.stringify({guildId:J,days:u,hours:y,minutes:g,seconds:E,durationDays:u,duration:u,permanent:w,description:o.description})});let j;try{j=await U.json()}catch{throw new Error("El servidor devolvió una respuesta inválida.")}if(!U.ok||!j.success)throw new Error(j.message||"No se pudo generar la Key.");const q=Array.isArray(j.licenses)?j.licenses[0]:j.license||j.data||null,re=q?.key||q?.licenseKey||q?.token,W=q?.createdAt||new Date().toISOString(),C=w?null:q?.expiresAt||q?.expirationDate||q?.expires||(o.durationMilliseconds?new Date(new Date(W).getTime()+o.durationMilliseconds).toISOString():null);if(!re)throw new Error("El servidor no devolvió la Key.");qe("Guardando en el sistema..."),await Ce(450),we(),await Ce(650),je(),Ue(),ge(),t.insertAdjacentHTML("beforeend",Oe({...q,key:re,duration:u,durationDays:u,durationHours:y,durationMinutes:g,durationSeconds:E,durationMilliseconds:o.durationMilliseconds,permanent:w,description:o.description,type:w?"Permanente":`${V} ${V===1?"día":"días"}`,createdAt:W,expiresAt:C},!0)),Ve(),oe(),t.scrollTo({top:t.scrollHeight,behavior:"smooth"})}catch(U){console.error("Error generando licencia:",U),je(),alert(U.message||"No se pudo generar la licencia.")}finally{a.disabled=!1,a.innerHTML=z}}a?.addEventListener("click",()=>{ke()}),e?.addEventListener("click",()=>{H()})});document.getElementById("publicSupport")?.addEventListener("click",()=>{Pe(),document.body.classList.add("servers-selection-mode"),P.innerHTML=`
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
      `,document.getElementById("publicDiscordSupport")?.addEventListener("click",()=>{window.open("https://discord.gg/ue5c56nyCr","_blank","noopener,noreferrer")})});document.getElementById("publicLogout")?.addEventListener("click",async()=>{Pe();try{await fetch("/auth/discord/logout",{method:"POST",credentials:"include"})}catch(a){console.error("Error cerrando sesión:",a)}localStorage.removeItem("nebulaSelectedServerId"),window.location.replace("/auth/dashboard")});const Ii=document.getElementById("sidebar");document.getElementById("hamburger").addEventListener("click",()=>Ii.classList.toggle("open"));document.addEventListener("keydown",a=>{a.ctrlKey&&a.key.toLowerCase()==="k"&&(a.preventDefault(),document.querySelector(".search input").focus())});const We=document.getElementById("space");if(We){let t=function(){We.width=innerWidth*devicePixelRatio,We.height=innerHeight*devicePixelRatio,We.style.width=innerWidth+"px",We.style.height=innerHeight+"px",a.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0),e=Array.from({length:90},()=>({x:Math.random()*innerWidth,y:Math.random()*innerHeight,r:Math.random()*1.3+.2,a:Math.random()*.45+.05,s:Math.random()*.12+.02}))},i=function(){a.clearRect(0,0,innerWidth,innerHeight),e.forEach(n=>{n.y-=n.s,n.y<0&&(n.y=innerHeight),a.beginPath(),a.arc(n.x,n.y,n.r,0,Math.PI*2),a.fillStyle=`rgba(255,255,255,${n.a})`,a.fill()}),requestAnimationFrame(i)};var Vi=t,Ui=i;const a=We.getContext("2d");let e=[];t(),i(),addEventListener("resize",t)}const ki=document.querySelector(".main"),Ti=document.querySelector(".topbar"),P=document.createElement("div");P.id="pageContent";let ot=Ti.nextElementSibling;for(;ot;){const a=ot.nextElementSibling;P.appendChild(ot),ot=a}ki.appendChild(P);const ha=P.innerHTML;P.innerHTML=`
  <div class="dynamic-page">
    <div class="servers-loading">
      <div class="loading-spinner"></div>

      <strong>
        Cargando tu cuenta de Discord...
      </strong>
    </div>
  </div>
`;Si();window.addEventListener("nebula:server-changed",async()=>{document.getElementById("licenseLogsChannel")&&(await loadLicenseLogChannels(),await loadLicenseSettings())});const Li={Servidores:{eyebrow:"SERVIDORES",title:"Tus servidores",description:"Seleccioná un servidor para administrar sus funciones, permisos y configuración.",action:"＋ Agregar servidor",type:"servers"},Invitaciones:{eyebrow:"SERVIDORES",title:"Invitaciones",description:"Creá, controlá y eliminá enlaces de invitación para tus comunidades.",action:"＋ Nueva invitación",type:"invitations"},Miembros:{eyebrow:"COMUNIDAD",title:"Miembros",description:"Buscá usuarios, revisá sus roles y consultá su actividad reciente.",action:"Exportar lista",type:"members"},Roles:{eyebrow:"COMUNIDAD",title:"Roles",description:"Organizá la jerarquía y los permisos de cada rol del servidor.",action:"＋ Crear rol",type:"roles"},Canales:{eyebrow:"ESTRUCTURA",title:"Canales",description:"Administrá canales de texto, voz, categorías y permisos.",action:"＋ Crear canal",type:"channels"},"Logs del servidor":{eyebrow:"REGISTROS",title:"Logs del servidor",description:"Consultá eventos, mensajes eliminados y movimientos administrativos.",action:"Exportar logs",type:"logs"},Comandos:{eyebrow:"COMANDOS",title:"Comandos",description:"Activá, desactivá y personalizá las funciones principales del bot.",action:"＋ Crear comando",type:"commands"},"Slash Commands":{eyebrow:"COMANDOS",title:"Slash Commands",description:"Gestioná los comandos que aparecen al escribir / dentro de Discord.",action:"Sincronizar",type:"slash"},Mensajes:{eyebrow:"MENSAJES",title:"Mensajes automáticos",description:"Diseñá mensajes de bienvenida, despedida, anuncios y verificaciones.",action:"＋ Nuevo mensaje",type:"messages"},"Auto Respuestas":{eyebrow:"AUTOMATIZACIÓN",title:"Auto Respuestas",description:"Configurá respuestas automáticas mediante palabras o frases clave.",action:"＋ Nueva respuesta",type:"responses"},Moderación:{eyebrow:"SEGURIDAD",title:"Centro de moderación",description:"Accedé rápidamente a todas las herramientas de control del servidor.",action:"Abrir historial",type:"moderation"},Advertencias:{eyebrow:"MODERACIÓN",title:"Advertencias",description:"Registrá faltas, motivos, responsables y vencimientos.",action:"＋ Advertir usuario",type:"warnings"},Baneos:{eyebrow:"MODERACIÓN",title:"Baneos",description:"Administrá usuarios bloqueados y revisá los motivos de cada sanción.",action:"＋ Banear usuario",type:"bans"},Muteos:{eyebrow:"MODERACIÓN",title:"Muteos",description:"Aplicá silenciamientos temporales y revisá los que siguen activos.",action:"＋ Mutear usuario",type:"mutes"},"Anti Raid":{eyebrow:"PROTECCIÓN",title:"Anti Raid",description:"Protegé el servidor contra ingresos masivos y comportamientos sospechosos.",action:"Activar protección",type:"antiraid"},"Auto Mod":{eyebrow:"PROTECCIÓN",title:"Auto Mod",description:"Filtrá spam, enlaces, menciones masivas y palabras prohibidas.",action:"Guardar reglas",type:"automod"},Logs:{eyebrow:"SISTEMA",title:"Logs generales",description:"Revisá todas las acciones realizadas por el bot y el dashboard.",action:"Descargar",type:"logs"},Auditoría:{eyebrow:"SISTEMA",title:"Auditoría",description:"Identificá quién realizó cada cambio dentro del panel.",action:"Filtrar actividad",type:"audit"},"Tareas programadas":{eyebrow:"AUTOMATIZACIÓN",title:"Tareas programadas",description:"Programá anuncios, limpiezas, backups y acciones automáticas.",action:"＋ Programar tarea",type:"tasks"},Backups:{eyebrow:"SISTEMA",title:"Backups",description:"Guardá y restaurá configuraciones del servidor de forma segura.",action:"Crear backup",type:"backups"},Webhooks:{eyebrow:"INTEGRACIONES",title:"Webhooks",description:"Conectá servicios externos para recibir y enviar información.",action:"＋ Crear webhook",type:"webhooks"},Configuración:{eyebrow:"AJUSTES",title:"Configuración general",description:"Definí la identidad, el estado y el comportamiento principal del bot.",action:"Guardar cambios",type:"settings"},Personalización:{eyebrow:"APARIENCIA",title:"Personalización",description:"Cambiá colores, textos, imágenes y estilo visual del panel.",action:"Aplicar diseño",type:"customize"},"Variables de entorno":{eyebrow:"DESARROLLO",title:"Variables de entorno",description:"Prepará las variables que usaremos luego en Render sin mostrar secretos reales.",action:"Guardar variables",type:"environment"},Tokens:{eyebrow:"SEGURIDAD",title:"Tokens",description:"Visualizá el estado de las credenciales sin exponer su contenido.",action:"Actualizar token",type:"tokens"},Permisos:{eyebrow:"SEGURIDAD",title:"Permisos del bot",description:"Revisá qué acciones puede realizar el bot dentro de Discord.",action:"Guardar permisos",type:"permissions"},Integraciones:{eyebrow:"CONEXIONES",title:"Integraciones",description:"Prepará conexiones con Discord, Render, GitHub y otros servicios.",action:"＋ Conectar servicio",type:"integrations"}};function Bi(a){return`
    <section class="section-header">
      <div>
        <span>${a.eyebrow}</span>
        <h1>${a.title}</h1>
        <p>${a.description}</p>
      </div>
      <button class="section-action">${a.action}</button>
    </section>
  `}function $e(a){return`
    <section class="section-metrics">
      ${a.map(([e,t,i,n,c="purple"])=>`
        <article class="section-metric">
          <i class="${c}">${e}</i>
          <div><span>${t}</span><strong>${i}</strong><small>${n}</small></div>
        </article>
      `).join("")}
    </section>
  `}function He(a,e){return`
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
  `}function Ct(a){return`
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
  `}function Ae(a){return`<section class="feature-grid">${a.map(([e,t,i,n])=>`
    <article class="feature-card">
      <div class="feature-top"><i>${e}</i><span>${n}</span></div>
      <h3>${t}</h3><p>${i}</p>
      <button>Administrar <b>›</b></button>
    </article>
  `).join("")}</section>`}function ia(a){return`
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
  `}function Di(a){switch(a){case"servers":return $e([["◈","Servidores conectados","12","+2 este mes"],["♣","Miembros totales","8.745","+342 este mes","blue"],["●","Usuarios online","1.286","Ahora","green"],["⌘","Comandos hoy","3.248","+18.7%","yellow"]])+Ae([["NC","Nebula Community","Servidor principal · 1.245 miembros","89% activo"],["GZ","Gaming Zone","Comunidad gamer · 987 miembros","75% activo"],["TD","Team Developers","Desarrollo y tecnología · 756 miembros","62% activo"],["＋","Agregar servidor","Invitá a Nebula Bot a otra comunidad","NUEVO"]]);case"invitations":return $e([["⌁","Invitaciones activas","18","6 temporales"],["♣","Usos totales","2.846","+92 hoy","blue"],["◷","Próximas a vencer","3","En 24 horas","yellow"]])+He(["Código","Canal","Usos","Vencimiento","Estado"],[["nebula-main","#bienvenida","1.284","Nunca","<b class='good'>Activa</b>"],["gaming-zone","#general","642","7 días","<b class='good'>Activa</b>"],["evento-vip","#eventos","128","18 horas","<b class='warn'>Temporal</b>"]]);case"members":return $e([["♣","Miembros","8.745","+342 este mes"],["●","En línea","1.286","14.7%","green"],["◇","Con roles","8.102","92.6%","blue"],["◉","Nuevos hoy","76","+12%","yellow"]])+He(["Usuario","Rol principal","Ingreso","Mensajes","Estado"],[["<b>Alvi Moreyra</b>","Propietario","12/05/2024","18.492","<b class='good'>En línea</b>"],["Juan Cruz","Administrador","02/07/2025","7.824","Ausente"],["NovaUser","Miembro","11/07/2026","1.209","<b class='good'>En línea</b>"]]);case"roles":return Ae([["♛","Propietario","Control total del servidor y del dashboard.","1 miembro"],["◆","Administrador","Moderación, configuración y registros.","6 miembros"],["◇","Moderador","Control de mensajes y usuarios.","14 miembros"],["●","Miembro","Acceso general a la comunidad.","8.102 miembros"],["＋","Crear nuevo rol","Agregá una nueva jerarquía personalizada.","NUEVO"]]);case"channels":return Ae([["#","bienvenida","Canal de entrada y verificación.","Texto"],["#","general","Conversaciones principales de la comunidad.","Texto"],["◖","Sala General","Canal de voz para todos los miembros.","Voz"],["▣","Administración","Categoría privada del equipo.","Categoría"],["＋","Crear canal","Agregá un canal nuevo al servidor.","NUEVO"]]);case"commands":case"slash":return $e([["⌘","Comandos activos","24","Todos sincronizados"],["◉","Ejecuciones","25.683","+18.7%"],["⚡","Tiempo medio","82 ms","Excelente","green"]])+He(["Comando","Descripción","Usos","Permiso","Estado"],[["/verify","Verifica usuarios y asigna roles","8.429","Todos","<b class='good'>Activo</b>"],["/clean","Elimina una cantidad de mensajes","4.326","Moderador","<b class='good'>Activo</b>"],["/data","Muestra datos del usuario verificado","3.782","Administrador","<b class='good'>Activo</b>"],["/invite","Genera el enlace del bot","2.945","Todos","<b class='good'>Activo</b>"]]);case"messages":return Ae([["👋","Bienvenida","Mensaje enviado cuando ingresa un nuevo miembro.","ACTIVO"],["🚪","Despedida","Aviso cuando un miembro abandona el servidor.","ACTIVO"],["✅","Verificación","Panel para verificar y asignar roles.","ACTIVO"],["📣","Anuncios","Mensajes especiales y programados.","BORRADOR"]]);case"responses":return He(["Palabra clave","Respuesta","Canal","Usos","Estado"],[["hola","¡Hola! Bienvenido a nuestra comunidad.","Todos","846","<b class='good'>Activa</b>"],["reglas","Podés leer las reglas en #reglas.","Todos","514","<b class='good'>Activa</b>"],["soporte","Abrí un ticket desde #soporte.","Ayuda","302","<b class='good'>Activa</b>"]]);case"moderation":return $e([["◆","Acciones hoy","148","+22%"],["◉","Advertencias","32","8 activas","yellow"],["⊗","Baneos","12","Este mes","red"],["◔","Muteos activos","7","Ahora","blue"]])+Ae([["◉","Advertir usuario","Registrá una falta con motivo y evidencia.","ABRIR"],["◔","Mutear usuario","Silenciá temporalmente a un miembro.","ABRIR"],["⊗","Banear usuario","Bloqueá el acceso de forma permanente.","ABRIR"],["▤","Revisar historial","Consultá sanciones y responsables.","ABRIR"]]);case"warnings":case"bans":case"mutes":return He(["Usuario","Motivo","Responsable","Duración","Estado"],[["Usuario#4521","Spam reiterado","Alvi","24 horas","<b class='warn'>Activo</b>"],["PlayerNova","Insultos","Moderador01","7 días","<b class='warn'>Activo</b>"],["TestUser","Enlaces prohibidos","Auto Mod","Finalizado","Completado"]]);case"antiraid":case"automod":return $e([["⌁","Amenazas bloqueadas","286","Últimos 30 días"],["●","Nivel de protección","Alto","Recomendado","green"],["⚡","Respuesta media","41 ms","Excelente","blue"]])+Ct([["Detección de ingresos masivos","Bloquea oleadas de cuentas nuevas.",!0],["Filtro de enlaces","Impide dominios no autorizados.",!0],["Menciones masivas","Controla @everyone y spam de menciones.",!0],["Cuentas nuevas","Aplica restricciones a cuentas recientes.",!1],["Modo emergencia","Bloqueo temporal completo del servidor.",!1]]);case"logs":case"audit":return $e([["▤","Eventos hoy","2.648","+14%"],["♣","Administradores","7","Con actividad"],["◷","Último evento","Hace 1 min","Actualizado","green"]])+He(["Evento","Usuario","Servidor","Fecha","Resultado"],[["Configuración actualizada","Alvi Moreyra","Nebula Community","23:41","<b class='good'>Correcto</b>"],["Mensajes eliminados","Moderador01","Gaming Zone","23:36","<b class='good'>Correcto</b>"],["Intento de acceso","Unknown","Team Developers","23:31","<b class='warn'>Revisar</b>"]]);case"tasks":return Ae([["◷","Anuncio diario","Se ejecuta todos los días a las 09:00.","ACTIVA"],["▣","Backup automático","Guarda la configuración cada 12 horas.","ACTIVA"],["⌘","Limpieza semanal","Elimina mensajes antiguos los domingos.","ACTIVA"],["＋","Nueva tarea","Programá otra acción automática.","NUEVO"]]);case"backups":return $e([["▣","Backups guardados","18","Últimos 30 días"],["◷","Último backup","Hace 2 horas","Correcto","green"],["◇","Espacio usado","42 MB","de 500 MB","blue"]])+He(["Nombre","Servidor","Fecha","Tamaño","Estado"],[["Backup automático #018","Nebula Community","Hoy 21:30","2.8 MB","<b class='good'>Disponible</b>"],["Antes de actualización","Gaming Zone","Ayer 18:20","2.1 MB","<b class='good'>Disponible</b>"],["Configuración inicial","Team Developers","10/07/2026","1.7 MB","<b class='good'>Disponible</b>"]]);case"webhooks":case"integrations":return Ae([["⌘","Discord","Bot, OAuth2 y eventos del servidor.","CONECTADO"],["◈","Render","Alojamiento gratuito del bot y dashboard.","PREPARADO"],["◆","GitHub","Código, versiones y despliegue automático.","PENDIENTE"],["▣","Base de datos","Guardado de configuraciones y usuarios.","PENDIENTE"],["＋","Nueva integración","Conectá otro servicio externo.","NUEVO"]]);case"settings":return ia([["Nombre del bot","Nebula Bot"],["Estado","Protegiendo tu servidor"],["Prefijo","/"],["Idioma","Español"],["Descripción","Bot avanzado de administración y moderación.",!0],["Mensaje de actividad","Usá /help para ver los comandos.",!0]]);case"customize":return Ct([["Animaciones del panel","Activa transiciones, partículas y efectos.",!0],["Fondo espacial","Muestra estrellas en movimiento.",!0],["Modo compacto","Reduce el tamaño de tarjetas y espacios.",!1],["Sonidos del panel","Reproduce sonidos en las acciones.",!1],["Efecto neón","Aumenta los brillos violetas.",!0]]);case"environment":return ia([["DISCORD_TOKEN","••••••••••••••••"],["CLIENT_ID","Pendiente"],["CLIENT_SECRET","••••••••••••••••"],["DATABASE_URL","Pendiente"],["REDIRECT_URI",`${window.location.origin}/auth/discord/callback`,!0],["SESSION_SECRET","••••••••••••••••",!0]]);case"tokens":return Ae([["◇","Token del bot","Credencial principal de conexión con Discord.","PROTEGIDO"],["⌘","Client ID","Identificador público de la aplicación.","PENDIENTE"],["◆","Client Secret","Secreto utilizado para OAuth2.","PROTEGIDO"],["◷","Última rotación","El token aún no fue conectado.","SIN DATOS"]]);case"permissions":return Ct([["Administrar servidor","Permite cambiar configuraciones generales.",!0],["Administrar roles","Permite crear, editar y asignar roles.",!0],["Administrar canales","Permite crear y modificar canales.",!0],["Banear miembros","Permite bloquear usuarios.",!0],["Expulsar miembros","Permite quitar usuarios.",!0],["Administrador total","Otorga todos los permisos disponibles.",!1]]);default:return Ae([["✦","Sección preparada","La interfaz ya está lista para conectarse en las próximas etapas.","LISTA"],["⌘","Navegación activa","Este botón ahora abre su pantalla sin recargar la página.","ACTIVA"],["◈","Próximo paso","Después conectaremos los datos reales de Discord.","PENDIENTE"]])}}async function xi(a){if(a==="Dashboard"){document.body.classList.remove("servers-selection-mode"),P.innerHTML=ha,Ot(),Mt(_),mt(),Gt();return}if(a==="Servidores"||a==="Servidor actual"){if(!J){Xe(),window.history.replaceState({},"","/?view=servers");return}const t=me.find(i=>String(i.id)===String(J));if(!t||!t.botPresent){Xe(),window.history.replaceState({},"","/?view=servers");return}await Me(J);return}const e=Li[a]||{eyebrow:"NEBULA",title:a,description:"Esta sección ya forma parte de la navegación principal.",action:"Guardar cambios",type:"default"};P.innerHTML=`
    <div class="dynamic-page">
      ${Bi(e)}
      ${Di(e.type)}
    </div>
  `,Ot(),window.scrollTo({top:0,behavior:"smooth"})}function Ot(){P.querySelectorAll("button").forEach(a=>{a.addEventListener("click",Ie)}),P.querySelectorAll(".switch-control input").forEach(a=>{a.addEventListener("change",Ie)})}document.querySelectorAll(".side-item").forEach(a=>{a.addEventListener("click",()=>{const e=a.querySelector("span:nth-child(2)")?.textContent.trim();e&&xi(e)})});async function Gt(){try{const a=await fetch(`${R}/api/dashboard`);if(!a.ok)throw new Error(`Error HTTP: ${a.status}`);const e=await a.json();if(!e.success)throw new Error("La API respondió con un error");const t=e.data;Pt={name:t?.bot?.name||"Nebula Bot",avatar:t?.bot?.avatar||""},ba(t.statistics),Ea(t.bot),wa(t.system),console.log("Datos recibidos desde la API:",t)}catch(a){console.error("No se pudo conectar con la API:",a),Ca()}}function ba(a){const e=document.querySelectorAll("[data-count]"),t=[a.servers,a.users,a.commands,a.messages];e.forEach((n,c)=>{const s=t[c];if(s===void 0)return;const p=Number(n.dataset.currentValue??n.dataset.count??0);if(p===s){n.textContent=s.toLocaleString("es-AR");return}n.dataset.count=s,n.dataset.currentValue=s,Ni(n,p,s)});const i=[...document.querySelectorAll(".stat-card strong")].find(n=>n.textContent.includes("%"));i&&(i.textContent=`${a.uptimePercentage}%`)}function Ni(a,e,t){a.animationFrame&&cancelAnimationFrame(a.animationFrame);const i=performance.now(),n=700;function c(s){const p=Math.min((s-i)/n,1),m=1-Math.pow(1-p,3),D=Math.floor(e+(t-e)*m);a.textContent=D.toLocaleString("es-AR"),p<1?a.animationFrame=requestAnimationFrame(c):(a.textContent=t.toLocaleString("es-AR"),a.animationFrame=null)}a.animationFrame=requestAnimationFrame(c)}function Ea(a){const e=document.querySelector(".status-card strong");e&&(e.textContent=a.status==="online"?"En línea":"Desconectado",e.classList.toggle("offline-text",a.status!=="online"));const t=document.querySelectorAll(".footer-status strong");t[3]&&(t[3].textContent=a.uptime);const i=document.querySelector(".footer-status > div:last-child strong");i&&(i.textContent=a.version)}function wa(a){const e=document.querySelectorAll(".health-list > div strong"),t=[a.discordApi,a.database,a.servers,a.dashboard,a.logs];e.forEach((i,n)=>{const c=t[n];i.textContent=c?"Operativo":"Desconectado",i.classList.toggle("system-error",!c)})}function Ca(){const a=document.querySelector(".status-card strong");a&&(a.textContent="Sin conexión",a.classList.add("offline-text"))}Gt();let St=!1;async function Sa(){if(St)return;St=!0;const a=performance.now();try{const e=await fetch(`${R}/api/bot/status?t=${Date.now()}`,{method:"GET",headers:{Accept:"application/json"},credentials:"include",cache:"no-store"}),t=await e.json(),i=performance.now(),n=Math.max(0,Math.round(i-a));if(!e.ok||!t.success)throw new Error(t.message||"No se pudo consultar el estado.");const c=Math.max(0,Math.round(Number(t.data?.latency||0))),s=document.getElementById("liveBotLatency");s&&(s.textContent=`${n} ms`,s.title=`Discord: ${c} ms`);const p=document.querySelector(".footer-status > div:first-child strong");p&&(p.textContent=`${n} ms`,p.title=`Discord: ${c} ms`);const m=document.getElementById("liveBotUpdatedAt");m&&(m.textContent=new Date().toLocaleTimeString("es-AR",{hour:"2-digit",minute:"2-digit",second:"2-digit"}))}catch(e){console.error("Error actualizando la latencia:",e);const t=document.getElementById("liveBotLatency");t&&(t.textContent="Sin conexión");const i=document.querySelector(".footer-status > div:first-child strong");i&&(i.textContent="Sin conexión")}finally{St=!1}}Sa();setInterval(Sa,500);const at=ut();at.on("connect",()=>{console.log("Dashboard conectado en tiempo real:",at.id)});at.on("dashboard:update",a=>{console.log("Actualización recibida por Socket.IO:",a),ba(a.statistics),Ea(a.bot),wa(a.system)});at.on("disconnect",()=>{console.log("Dashboard desconectado del servidor"),Ca()});at.on("connect_error",a=>{console.error("Error de Socket.IO:",a.message)});async function Me(a){Pe(),document.body.classList.remove("servers-selection-mode"),P.innerHTML=`
    <div class="dynamic-page">
      <div class="servers-loading">
        <div class="loading-spinner"></div>
        <strong>Cargando información del servidor...</strong>
      </div>
    </div>
  `;try{const e=await fetch(`${R}/api/servers/${a}`),t=await e.json();if(!e.ok||!t.success)throw new Error(t.message||"No se pudo cargar el servidor");$i(t.data)}catch(e){console.error("Error cargando servidor:",e),P.innerHTML=`
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
    `,document.getElementById("backToServers")?.addEventListener("click",()=>{Xe(),window.history.replaceState({},"","/?view=servers")})}}function $i(a){const e=new Date(a.createdAt).toLocaleDateString("es-AR",{day:"2-digit",month:"2-digit",year:"numeric"}),t=a.name.split(" ").slice(0,2).map(s=>s.charAt(0)).join("").toUpperCase(),i=a.icon?`<img src="${a.icon}" alt="${a.name}">`:`<span>${t}</span>`,n=a.roles.length?a.roles.map(s=>`
        <div class="server-role-row">
          <i style="background:${s.color}"></i>

          <div>
            <strong>${s.name}</strong>
            <span>${s.members} miembros</span>
          </div>

          <button
            class="server-small-action"
            data-action="role"
            data-role-id="${s.id}"
          >
            Editar
          </button>
        </div>
      `).join(""):`
      <div class="server-empty">
        No hay roles disponibles.
      </div>
    `,c=a.channels.length?a.channels.map(s=>`
        <div class="server-channel-row">
          <i>#</i>

          <div>
            <strong>${s.name}</strong>
            <span>ID: ${s.id}</span>
          </div>

          <button
            class="server-small-action"
            data-action="channel"
            data-channel-id="${s.id}"
          >
            Editar
          </button>
        </div>
      `).join(""):`
      <div class="server-empty">
        No hay canales disponibles.
      </div>
    `;P.innerHTML=`
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
            ${c}
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
  `,document.getElementById("backToServers")?.addEventListener("click",()=>{Xe(),window.history.replaceState({},"","/?view=servers")}),document.querySelector('[data-tool="welcome"]')?.addEventListener("click",()=>{Mi(a)}),document.querySelector('[data-tool="verification"]')?.addEventListener("click",()=>{Ri(a)}),document.querySelectorAll('.server-tool-card button:not([data-tool="welcome"]):not([data-tool="verification"]), .server-small-action, .server-header-action').forEach(s=>{s.addEventListener("click",()=>{ee.querySelector("strong").textContent="Herramienta preparada",ee.querySelector("p").textContent="Esta función se conectará más adelante.",Ie()})})}async function Ri(a){P.innerHTML=`
    <div class="dynamic-page">
      <div class="servers-loading">
        <div class="loading-spinner"></div>
        <strong>
          Cargando configuración de verificación...
        </strong>
      </div>
    </div>
  `;try{const[e,t,i,n]=await Promise.all([fetch(`${R}/api/servers/${a.id}/text-channels`),fetch(`${R}/api/servers/${a.id}`),fetch(`${R}/api/servers/${a.id}/verification`),fetch(`${R}/api/bot/public-info`)]),c=await e.json(),s=await t.json(),p=await i.json(),m=await n.json();if(!e.ok||!c.success)throw new Error(c.message||"No se pudieron cargar los canales");if(!t.ok||!s.success)throw new Error(s.message||"No se pudieron cargar los roles");if(!i.ok||!p.success)throw new Error(p.message||"No se pudo cargar la configuración");Pi(a,c.data,s.data.roles,p.data,m.success?m.data:{})}catch(e){console.error("Error cargando verificación:",e),P.innerHTML=`
      <div class="dynamic-page">
        <div class="servers-error">
          <div class="servers-error-icon">!</div>

          <h3>
            No se pudo abrir Verificación
          </h3>

          <p>
            ${I(e.message)}
          </p>

          <button id="backToServerPanel">
            Volver al servidor
          </button>
        </div>
      </div>
    `,document.getElementById("backToServerPanel")?.addEventListener("click",()=>{Me(a.id)})}}function le(a,e,t){return`
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
  `}function de(a,e,t,i,n,c=""){return`
    <label class="appearance-range-control">
      <div>
        <span>${e}</span>

        <strong id="${a}Value">
          ${t}${c}
        </strong>
      </div>

      <input
        id="${a}"
        type="range"
        min="${i}"
        max="${n}"
        value="${t}"
        data-suffix="${c}"
      >
    </label>
  `}function Pi(a,e,t,i,n={}){const c={avatar:!0,username:!0,displayName:!0,userId:!0,deliveredRole:!0,accountCreatedAt:!0,joinedAt:!0,verifiedAt:!0,verificationDuration:!0,attempts:!0,banner:!1,nitro:!1,operatingSystem:!1,browser:!1,device:!1,resolution:!1,language:!1,timezone:!1,country:!1,city:!1,region:!1,countryCode:!1,approximateLocalTime:!1,fullIp:!1,ipType:!1,isp:!1,asn:!1,vpn:!1,proxy:!1,hosting:!1,mobileNetwork:!1,riskLevel:!1,trustScore:!1,...i.logOptions||{}},s={cardDesign:"classic",splitImageUrl:"",splitImagePosition:"left",splitImageFit:"cover",splitImageDarkness:45,splitImageWidth:48,splitShowImage:!0,splitShowDate:!0,splitShowAccess:!0,terminalTitle:"NEBULA SECURITY TERMINAL",terminalPrefix:">",terminalStatusText:"Sistema preparado",terminalBackgroundColor:"#020703",terminalTextColor:"#d9ffe0",terminalAccentColor:"#22c55e",terminalBorderColor:"#14532d",terminalShowCursor:!0,terminalShowLines:!0,terminalShowServer:!0,terminalShowRole:!0,terminalGlow:25,terminalRadius:10,pageName:"Trade Room Verification",pageDescription:"Completá la verificación para acceder al servidor.",logoUrl:"",backgroundUrl:"",primaryColor:"#8b5cf6",secondaryColor:"#6d28d9",buttonColor:"#7c3aed",textColor:"#ffffff",cardColor:"#0f0f1a",backgroundType:"space",backgroundSolidColor:"#05050a",gradientStart:"#05050a",gradientEnd:"#160c2b",spaceBackground:!0,animationsEnabled:!0,particlesEnabled:!0,glowEnabled:!0,fadeEnabled:!0,hoverEnabled:!0,cursorGlowEnabled:!1,buttonAnimationEnabled:!0,logoAnimationEnabled:!0,particleCount:100,glowIntensity:80,cardBlur:18,cardOpacity:88,cardRadius:24,cardShadow:80,verifyButtonText:"Verificar con Discord",verifyButtonIcon:"discord",verifyButtonSize:"large",verifyButtonRadius:14,verificationSound:!1,errorSound:!1,openingSound:!1,soundVolume:50,...i.webAppearance||{}},p={detectVpn:!1,detectVpnLogChannelId:"",detectProxy:!1,detectProxyLogChannelId:"",detectTor:!1,detectTorLogChannelId:"",blockHosting:!1,blockHostingLogChannelId:"",detectAltAccounts:!1,detectAltAccountsLogChannelId:"",minimumAccountAgeEnabled:!1,minimumAccountAgeDays:7,minimumAccountAgeLogChannelId:"",blockWithoutAvatar:!1,blockWithoutAvatarLogChannelId:"",blockWithoutBanner:!1,blockWithoutBannerLogChannelId:"",allowReverification:!0,notifySecurityFailure:!0,...i.security||{}},m=e.map(r=>`
        <option
          value="${r.id}"
          ${r.id===i.verificationChannelId?"selected":""}
        >
          # ${I(r.name)}
        </option>
      `).join(""),D=e.map(r=>`
        <option
          value="${r.id}"
          ${r.id===i.logsChannelId?"selected":""}
        >
          # ${I(r.name)}
        </option>
      `).join(""),$=t.map(r=>`
        <option
          value="${r.id}"
          ${r.id===i.verifiedRoleId?"selected":""}
        >
          @ ${I(r.name)}
        </option>
      `).join(""),h=(r,l,v,f)=>`
    <div class="verify-option-row">
      <div>
        <strong>${l}</strong>
        <p>${v}</p>
      </div>

      <label class="switch-control">
        <input
          id="${r}"
          type="checkbox"
          ${f?"checked":""}
        >
        <span></span>
      </label>
    </div>
  `,M=({id:r,title:l,description:v,enabled:f,logChannelId:L="",channels:K="",showLogChannel:F=!0,icon:Y="◈",extraContent:Q="",cardClass:N=""})=>{const ie=String(K).replace(new RegExp(`value="${String(L)}"`,"g"),`value="${String(L)}" selected`);return`
    <article
      class="verify-security-card ${N}"
      data-security-card="${r}"
    >
      <div class="verify-security-card-glow"></div>

      <div class="verify-security-card-header">

        <div class="verify-security-card-icon">
          ${Y}
        </div>

        <div class="verify-security-card-copy">
          <strong>
            ${I(l)}
          </strong>

          <p>
            ${I(v)}
          </p>
        </div>

        <label class="switch-control verify-security-switch">
          <input
            id="${r}"
            type="checkbox"
            ${f?"checked":""}
          >

          <span></span>
        </label>

      </div>

      ${Q}

      ${F?`
            <label class="verify-security-field">

              <span class="verify-security-field-label">
                <i></i>
                CANAL DE LOGS
              </span>

              <div class="verify-security-select-wrapper">
                <select
                  id="${r}LogChannel"
                  class="verify-security-channel"
                >
                  <option value="">
                    No enviar logs
                  </option>

                  ${ie}
                </select>

                <span class="verify-security-select-arrow">
                 ⌄
                </span>
              </div>

            </label>
          `:""}

      <div class="verify-security-card-status">
        <span class="verify-security-status-dot"></span>

        <span class="verify-security-status-text">
          ${f?"Protección activada":"Protección desactivada"}
        </span>
      </div>

    </article>
  `},B=(r,l,v)=>h(`verifyLog_${r}`,l,v,!!c[r]);P.innerHTML=`
    <div class="dynamic-page verification-config-page">

      <section class="section-header">
        <div>
          <span>SEGURIDAD DEL SERVIDOR</span>

          <h1>Verificación</h1>

          <p>
            Administrá el sistema de acceso de
            ${I(a.name)}.
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

            ${h("verifyEnabled","Activar sistema de verificación","Permite que los usuarios obtengan el rol configurado.",i.enabled)}

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

                  ${$}
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
            value="${S(i.embedTitle||"🔒 Verificación requerida")}"
          >
        </label>

        <label class="welcome-field">
          <span>DESCRIPCIÓN</span>

          <textarea
            id="verifyEmbedDescription"
            rows="5"
            maxlength="4000"
          >${I(i.embedDescription||"Para obtener acceso a **{server}**, debés verificar tu cuenta de Discord.")}</textarea>
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
              value="${S(i.buttonText||"Verificar con Discord")}"
            >
          </label>

          <label class="welcome-field">
            <span>EMOJI DEL BOTÓN</span>

            <input
              id="verifyButtonEmoji"
              maxlength="100"
              value="${S(i.buttonEmoji||"✅")}"
            >
          </label>

        </div>

        <div class="verify-form-grid">

          <label class="welcome-field">
            <span>NOMBRE DEL CAMPO</span>

            <input
              id="verifyEmbedFieldName"
              maxlength="256"
              value="${S(i.embedFieldName||"📌 Servidor")}"
            >
          </label>

          <label class="welcome-field">
            <span>VALOR DEL CAMPO</span>

            <input
              id="verifyEmbedFieldValue"
              maxlength="1024"
              value="${S(i.embedFieldValue||"{server}")}"
            >
          </label>

        </div>

        <label class="welcome-field">
          <span>TEXTO DEL PIE</span>

          <input
            id="verifyEmbedFooterText"
            maxlength="2048"
            value="${S(i.embedFooterText||"Nebula Security • Todos los derechos reservados")}"
          >
        </label>

        <label class="welcome-field">
          <span>EMOJI DE REACCIÓN</span>

          <input
            id="verifyReactionEmoji"
            maxlength="100"
            value="${S(i.reactionEmoji||"✅")}"
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

          ${h("verifyShowBotAvatar","Mostrar avatar del bot","Usa la foto de perfil real del bot.",i.showBotAvatar!==!1)}

          ${h("verifyShowServerIcon","Mostrar icono del servidor","Usa el icono del servidor como miniatura.",i.showServerIcon!==!1)}

          ${h("verifyShowCustomThumbnail","Miniatura personalizada","Muestra una imagen pequeña en el embed.",!!i.showCustomThumbnail)}

          ${h("verifyShowEmbedImage","Imagen grande","Muestra una imagen en la parte inferior.",!!i.showEmbedImage)}

          ${h("verifyShowTimestamp","Mostrar fecha y hora","Agrega el timestamp real de Discord.",i.showTimestamp!==!1)}

        </div>

        <label class="welcome-field">
          <span>URL DE LA MINIATURA</span>

          <input
            id="verifyEmbedThumbnailUrl"
            maxlength="1000"
            placeholder="https://..."
            value="${S(i.embedThumbnailUrl||"")}"
          >
        </label>

        <label class="welcome-field">
          <span>URL DE LA IMAGEN GRANDE</span>

          <input
            id="verifyEmbedImageUrl"
            maxlength="1000"
            placeholder="https://..."
            value="${S(i.embedImageUrl||"")}"
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
              src="${S(n.avatar||"https://cdn.discordapp.com/embed/avatars/0.png")}"
              alt="Avatar del bot"
            >

            <div>
              <strong id="verifyPreviewBotName">
                ${I(n.displayName||n.username||"Nebula Bot")}
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
                  ${I(i.embedTitle||"🔒 Verificación requerida")}
                </h3>

                <p id="verifyPreviewDescription">
                  ${I((i.embedDescription||"Para obtener acceso a **{server}**, debés verificar tu cuenta de Discord.").replaceAll("{server}",a.name).replaceAll("**",""))}
                </p>

                <div
                  id="verifyPreviewField"
                  class="discord-embed-field"
                >
                  <strong id="verifyPreviewFieldName">
                    ${I(i.embedFieldName||"📌 Servidor")}
                  </strong>

                  <span id="verifyPreviewFieldValue">
                    ${I((i.embedFieldValue||"{server}").replaceAll("{server}",a.name))}
                  </span>
                </div>

                <button
                  id="verifyPreviewButton"
                  type="button"
                >
                  <span id="verifyPreviewButtonEmoji">
                    ${I(i.buttonEmoji||"✅")}
                  </span>

                  <strong id="verifyPreviewButtonText">
                    ${I(i.buttonText||"Verificar con Discord")}
                  </strong>
                </button>

              </div>

              <img
                id="verifyPreviewThumbnail"
                class="discord-embed-thumbnail"
                src="${S(i.showCustomThumbnail&&i.embedThumbnailUrl?i.embedThumbnailUrl:a.icon||a.iconURL||"")}"
                alt="Miniatura"
              >

            </div>

            <img
              id="verifyPreviewImage"
              class="discord-embed-large-image"
              src="${S(i.embedImageUrl||"")}"
              alt="Imagen del embed"
              ${i.showEmbedImage&&i.embedImageUrl?"":'style="display:none"'}
            >

            <div class="discord-embed-footer">

              <img
                id="verifyPreviewFooterAvatar"
                src="${S(n.avatar||"https://cdn.discordapp.com/embed/avatars/0.png")}"
                alt=""
              >

              <span id="verifyPreviewFooterText">
                ${I(i.embedFooterText||"Nebula Security • Todos los derechos reservados")}
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

                ${D}
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
                  value="${S(i.logEmbedTitle||"🛡️ Usuario verificado")}"
                >
              </label>

              <label class="welcome-field">
                <span>DESCRIPCIÓN DEL LOG</span>

                <textarea
                  id="verifyLogDescription"
                  rows="4"
                  maxlength="4000"
                >${I(i.logEmbedDescription||"")}</textarea>
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
                ${B("avatar","Avatar","Foto de perfil del usuario.")}

                ${B("username","Usuario de Discord","Nombre de usuario.")}

                ${B("displayName","Nombre para mostrar","Apodo o nombre global.")}

                ${B("userId","Discord ID","Identificador de la cuenta.")}

                ${B("deliveredRole","Rol entregado","Rol recibido al verificarse.")}

                ${B("accountCreatedAt","Cuenta creada","Fecha de creación de Discord.")}

                ${B("joinedAt","Ingreso al servidor","Fecha en que se unió.")}

                ${B("verifiedAt","Fecha de verificación","Momento exacto de la verificación.")}
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
                ${B("browser","Navegador","Chrome, Edge, Firefox, etc.")}

                ${B("operatingSystem","Sistema operativo","Windows, Android, iOS, etc.")}

                ${B("device","Dispositivo","Computadora, celular o tablet.")}

                ${B("resolution","Resolución","Tamaño de la pantalla.")}

                ${B("language","Idioma","Idioma configurado.")}

                ${B("timezone","Zona horaria","Zona horaria del navegador.")}
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
                ${B("country","País aproximado","País estimado por la conexión.")}

                ${B("city","Ciudad aproximada","Ciudad estimada.")}

                ${B("vpn","VPN","Indica posible uso de VPN.")}

                ${B("proxy","Proxy","Indica posible uso de proxy.")}

                ${B("isp","Proveedor de internet","Empresa de conexión.")}

                ${B("asn","ASN","Identificador de la red.")}

                ${B("fullIp","Dirección IP completa","Dato sensible. Debe permanecer desactivado salvo que exista una necesidad legítima y aviso claro.")}
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
        ${s.cardDesign==="classic"?"checked":""}
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
        ${s.cardDesign==="split"?"checked":""}
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
        ${s.cardDesign==="terminal"?"checked":""}
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
          value="${S(s.splitImageUrl||"")}"
        >
      </label>

      <label class="welcome-field">
        <span>
          POSICIÓN DE LA IMAGEN
        </span>

        <select id="verifySplitImagePosition">

          <option
            value="left"
            ${s.splitImagePosition!=="right"?"selected":""}
          >
            Izquierda
          </option>

          <option
            value="right"
            ${s.splitImagePosition==="right"?"selected":""}
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
            ${s.splitImageFit!=="contain"?"selected":""}
          >
            Cubrir
          </option>

          <option
            value="contain"
            ${s.splitImageFit==="contain"?"selected":""}
          >
            Contener
          </option>

        </select>
      </label>

    </div>

    <div class="appearance-range-grid">

      ${de("verifySplitImageDarkness","OSCURIDAD DE LA IMAGEN",s.splitImageDarkness??45,0,90,"%")}

      ${de("verifySplitImageWidth","ANCHO DE LA IMAGEN",s.splitImageWidth??48,35,65,"%")}

    </div>

    <div class="verify-options-grid">

      ${h("verifySplitShowImage","Mostrar imagen lateral","Activa o desactiva la imagen del diseño.",s.splitShowImage!==!1)}

      ${h("verifySplitShowDate","Mostrar fecha","Muestra la fecha actual dentro de la tarjeta.",s.splitShowDate!==!1)}

      ${h("verifySplitShowAccess","Mostrar acceso","Muestra el estado de acceso instantáneo.",s.splitShowAccess!==!1)}

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
          value="${S(s.terminalTitle||"NEBULA SECURITY TERMINAL")}"
        >
      </label>

      <label class="welcome-field">
        <span>
          PREFIJO DE LAS LÍNEAS
        </span>

        <input
          id="verifyTerminalPrefix"
          maxlength="5"
          value="${S(s.terminalPrefix||">")}"
        >
      </label>

      <label class="welcome-field">
        <span>
          TEXTO DE ESTADO
        </span>

        <input
          id="verifyTerminalStatusText"
          maxlength="80"
          value="${S(s.terminalStatusText||"Sistema preparado")}"
        >
      </label>

    </div>

    <div class="appearance-colors-grid">

      ${le("verifyTerminalBackgroundColor","COLOR DEL FONDO",s.terminalBackgroundColor||"#020703")}

      ${le("verifyTerminalTextColor","COLOR DEL TEXTO",s.terminalTextColor||"#d9ffe0")}

      ${le("verifyTerminalAccentColor","COLOR PRINCIPAL",s.terminalAccentColor||"#22c55e")}

      ${le("verifyTerminalBorderColor","COLOR DEL BORDE",s.terminalBorderColor||"#14532d")}

    </div>

    <div class="verify-options-grid">

      ${h("verifyTerminalShowCursor","Cursor parpadeante","Muestra un cursor discreto al final de la terminal.",s.terminalShowCursor!==!1)}

      ${h("verifyTerminalShowLines","Líneas separadoras","Muestra divisiones con estilo de consola.",s.terminalShowLines!==!1)}

      ${h("verifyTerminalShowServer","Mostrar servidor","Muestra el nombre del servidor.",s.terminalShowServer!==!1)}

      ${h("verifyTerminalShowRole","Mostrar rol","Muestra el rol que recibirá el usuario.",s.terminalShowRole!==!1)}

    </div>

    <div class="appearance-range-grid">

      ${de("verifyTerminalGlow","INTENSIDAD DEL BRILLO",s.terminalGlow??25,0,70,"%")}

      ${de("verifyTerminalRadius","BORDES REDONDEADOS",s.terminalRadius??10,0,30,"px")}

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
              value="${S(s.pageName)}"
            >
          </label>

          <label class="welcome-field appearance-wide">
            <span>DESCRIPCIÓN</span>

            <textarea
              id="verifyPageDescription"
              maxlength="300"
              rows="3"
            >${I(s.pageDescription)}</textarea>
          </label>

          <label class="welcome-field">
            <span>URL DEL LOGO</span>

            <input
              id="verifyLogoUrl"
              maxlength="1000"
              placeholder="https://..."
              value="${S(s.logoUrl)}"
            >
          </label>

          <label class="welcome-field">
            <span>URL DEL FONDO</span>

            <input
              id="verifyBackgroundUrl"
              maxlength="1000"
              placeholder="https://..."
              value="${S(s.backgroundUrl)}"
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

          ${le("verifyPrimaryColor","COLOR PRINCIPAL",s.primaryColor)}

          ${le("verifySecondaryColor","COLOR SECUNDARIO",s.secondaryColor)}

          ${le("verifyButtonColor","COLOR DEL BOTÓN",s.buttonColor)}

          ${le("verifyTextColor","COLOR DEL TEXTO",s.textColor)}

          ${le("verifyCardColor","COLOR DE LA TARJETA",s.cardColor)}

          ${le("verifyBackgroundSolidColor","COLOR DEL FONDO",s.backgroundSolidColor)}

          ${le("verifyGradientStart","INICIO DEL DEGRADADO",s.gradientStart)}

          ${le("verifyGradientEnd","FINAL DEL DEGRADADO",s.gradientEnd)}

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
              ${s.backgroundType==="space"?"selected":""}
            >
              Espacial
            </option>

            <option
              value="gradient"
              ${s.backgroundType==="gradient"?"selected":""}
            >
              Degradado
            </option>

            <option
              value="image"
              ${s.backgroundType==="image"?"selected":""}
            >
              Imagen
            </option>

            <option
              value="video"
              ${s.backgroundType==="video"?"selected":""}
            >
              Video
            </option>

            <option
              value="solid"
              ${s.backgroundType==="solid"?"selected":""}
            >
              Color sólido
            </option>
          </select>
        </label>

        <div class="verify-options-grid">
          ${h("verifySpaceBackground","Fondo espacial","Muestra estrellas y partículas.",s.spaceBackground)}

          ${h("verifyParticlesEnabled","Partículas","Activa partículas animadas.",s.particlesEnabled)}
        </div>

        <div class="appearance-range-grid">
          ${de("verifyParticleCount","CANTIDAD DE PARTÍCULAS",s.particleCount,0,300)}

          ${de("verifyGlowIntensity","INTENSIDAD DEL BRILLO",s.glowIntensity,0,100)}
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

          ${h("verifyAnimationsEnabled","Animaciones generales","Activa todos los efectos visuales.",s.animationsEnabled)}

          ${h("verifyGlowEnabled","Efecto glow","Agrega brillo alrededor de los elementos.",s.glowEnabled)}

          ${h("verifyFadeEnabled","Entrada suave","Los elementos aparecen con un efecto fade.",s.fadeEnabled)}

          ${h("verifyHoverEnabled","Efectos hover","Los elementos reaccionan al pasar el cursor.",s.hoverEnabled)}

          ${h("verifyCursorGlowEnabled","Cursor luminoso","Agrega un resplandor alrededor del cursor.",s.cursorGlowEnabled)}

          ${h("verifyButtonAnimationEnabled","Animación del botón","Anima el botón principal.",s.buttonAnimationEnabled)}

          ${h("verifyLogoAnimationEnabled","Animación del logo","Agrega movimiento suave al logo.",s.logoAnimationEnabled)}

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

          ${de("verifyCardBlur","DESENFOQUE",s.cardBlur,0,50,"px")}

          ${de("verifyCardOpacity","OPACIDAD",s.cardOpacity,10,100,"%")}

          ${de("verifyCardRadius","BORDES REDONDEADOS",s.cardRadius,0,50,"px")}

          ${de("verifyCardShadow","INTENSIDAD DE SOMBRA",s.cardShadow,0,100,"%")}

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
              value="${S(s.verifyButtonText)}"
            >
          </label>

          <label class="welcome-field">
            <span>ICONO</span>

            <select id="verifyButtonIcon">
              <option
                value="discord"
                ${s.verifyButtonIcon==="discord"?"selected":""}
              >
                Discord
              </option>

              <option
                value="shield"
                ${s.verifyButtonIcon==="shield"?"selected":""}
              >
                Escudo
              </option>

              <option
                value="check"
                ${s.verifyButtonIcon==="check"?"selected":""}
              >
                Verificado
              </option>

              <option
                value="none"
                ${s.verifyButtonIcon==="none"?"selected":""}
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
                ${s.verifyButtonSize==="small"?"selected":""}
              >
                Pequeño
              </option>

              <option
                value="medium"
                ${s.verifyButtonSize==="medium"?"selected":""}
              >
                Mediano
              </option>

              <option
                value="large"
                ${s.verifyButtonSize==="large"?"selected":""}
              >
                Grande
              </option>
            </select>
          </label>

        </div>

        <div class="appearance-range-grid">
          ${de("verifyButtonRadius","BORDES DEL BOTÓN",s.verifyButtonRadius,0,40,"px")}
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

          ${h("verifyOpeningSound","Sonido al abrir","Reproduce un sonido cuando carga la página.",s.openingSound)}

          ${h("verifyVerificationSound","Sonido al verificar","Reproduce un sonido cuando la verificación termina.",s.verificationSound)}

          ${h("verifyErrorSound","Sonido de error","Reproduce un sonido cuando ocurre un problema.",s.errorSound)}

        </div>

        <div class="appearance-range-grid">
          ${de("verifySoundVolume","VOLUMEN",s.soundVolume,0,100,"%")}
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

  <article class="section-panel verify-security-section">

    <div class="verify-security-heading">

      <div class="verify-security-heading-icon">
        ◈
      </div>

      <div class="verify-security-heading-copy">
        <span>
          PROTECCIÓN AVANZADA
        </span>

        <h3>
          Reglas de seguridad
        </h3>

        <p>
          Configurá cómo se controlarán y registrarán las verificaciones sospechosas.
        </p>
      </div>

      <div class="verify-security-counter">
        <strong id="verifySecurityActiveCount">
          0
        </strong>

        <span>
          reglas activas
        </span>
      </div>

    </div>

    <div class="verify-security-list">

      ${M({id:"verifyDetectVpn",title:"Detectar VPN",description:"Marca conexiones que utilizan redes privadas virtuales.",enabled:p.detectVpn,logChannelId:p.detectVpnLogChannelId,channels:m,icon:"◉"})}

      ${M({id:"verifyDetectProxy",title:"Detectar Proxy",description:"Bloquea conexiones realizadas mediante servidores Proxy.",enabled:p.detectProxy,logChannelId:p.detectProxyLogChannelId,channels:m,icon:"⌁"})}

      ${M({id:"verifyDetectTor",title:"Detectar Tor",description:"Detecta conexiones realizadas desde la red anónima Tor.",enabled:p.detectTor,logChannelId:p.detectTorLogChannelId,channels:m,icon:"◎"})}

      ${M({id:"verifyBlockHosting",title:"Bloquear Hosting",description:"Impide verificaciones desde servidores, datacenters o VPS.",enabled:p.blockHosting,logChannelId:p.blockHostingLogChannelId,channels:m,icon:"▣"})}

      ${M({id:"verifyDetectAltAccounts",title:"Detectar Multicuentas",description:"Detecta usuarios que podrían utilizar cuentas alternativas.",enabled:p.detectAltAccounts,logChannelId:p.detectAltAccountsLogChannelId,channels:m,icon:"♧"})}

      ${M({id:"verifyMinimumAgeEnabled",title:"Edad mínima de la cuenta",description:"Bloquea cuentas de Discord creadas recientemente.",enabled:p.minimumAccountAgeEnabled,logChannelId:p.minimumAccountAgeLogChannelId,channels:m,icon:"◷",cardClass:"verify-security-age-card",extraContent:`
          <label class="verify-security-field verify-security-age-field">

            <span class="verify-security-field-label">
              <i></i>
              DÍAS MÍNIMOS DE ANTIGÜEDAD
            </span>

            <div class="verify-security-number-wrapper">
              <input
                id="verifyMinimumAgeDays"
                type="number"
                min="0"
                max="3650"
                value="${p.minimumAccountAgeDays}"
              >

              <span>
                días
              </span>
            </div>

          </label>
        `}).replace('id="verifyMinimumAgeEnabledLogChannel"','id="verifyMinimumAgeLogChannel"')}

      ${M({id:"verifyBlockWithoutAvatar",title:"Bloquear sin Avatar",description:"Impide verificar usuarios que no tengan foto de perfil.",enabled:p.blockWithoutAvatar,logChannelId:p.blockWithoutAvatarLogChannelId,channels:m,icon:"●"})}

      ${M({id:"verifyBlockWithoutBanner",title:"Bloquear sin Banner",description:"Impide verificar usuarios que no tengan banner configurado.",enabled:p.blockWithoutBanner,logChannelId:p.blockWithoutBannerLogChannelId,channels:m,icon:"▰"})}

      ${M({id:"verifyAllowReverification",title:"Permitir Re-verificación",description:"Permite que un usuario vuelva a realizar el proceso.",enabled:p.allowReverification,showLogChannel:!1,icon:"↻",cardClass:"verify-security-simple-card"})}

      ${M({id:"verifyNotifySecurityFailure",title:"Notificar fallo de seguridad",description:"Envía un aviso cuando una verificación es rechazada.",enabled:p.notifySecurityFailure,showLogChannel:!1,icon:"!",cardClass:"verify-security-simple-card"})}

    </div>

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
              value="${S(i.interactionTitle||"🔒 Verificá tu cuenta")}"
            >
          </label>

          <label class="welcome-field">
            <span>DESCRIPCIÓN DEL MENSAJE</span>

            <textarea
              id="verifyInteractionMessage"
              rows="8"
              maxlength="2000"
            >${I(i.interactionMessage||`¡Hola {usuario}! 👋

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
                value="${S(i.interactionColor||"#8b5cf6")}"
              >
            </div>
          </label>

          <label class="welcome-field">
            <span>IMAGEN OPCIONAL</span>

            <input
              id="verifyInteractionImage"
              placeholder="https://i.imgur.com/imagen.png"
              value="${S(i.interactionImage||"")}"
            >
          </label>

 <div class="configuration-button-fields">

  <label class="welcome-field">
    <span>EMOJI DEL BOTÓN</span>

    <input
      id="verifyInteractionButtonEmoji"
      maxlength="16"
      placeholder="🛡️"
      value="${S(i.interactionButtonEmoji||"🛡️")}"
    >
  </label>

  <label class="welcome-field">
    <span>NOMBRE DEL BOTÓN</span>

    <input
      id="verifyInteractionButtonText"
      maxlength="80"
      placeholder="Continuar verificación"
      value="${S(i.interactionButtonText||"Continuar verificación")}"
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
                ${I(i.interactionTitle||"🔒 Verificá tu cuenta")}
              </strong>

              <p id="interactionPreviewMessage">${I(i.interactionMessage||`¡Hola Usuario! 👋

Presioná el botón de abajo para verificar tu cuenta de forma rápida y segura.

El enlace es personal y solo puede utilizarse una vez.

Si no solicitaste esto, ignorá este mensaje.`)}</p>

              <img
                id="interactionPreviewImage"
                class="configuration-preview-image"
                src="${S(i.interactionImage||"")}"
                alt=""
                ${i.interactionImage?"":'style="display:none;"'}
              >
            </div>

            <button
              class="configuration-preview-button"
              id="interactionPreviewButton"
              type="button"
            >
              ${I(i.interactionButtonText||"Verificar mi cuenta")}
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
              value="${S(i.successTitle||"✅ Verificación completada")}"
            >
          </label>

          <label class="welcome-field">
            <span>DESCRIPCIÓN DEL MENSAJE</span>

            <textarea
              id="verifySuccessMessage"
              rows="7"
              maxlength="1000"
            >${I(i.successMessage||`Tu cuenta fue verificada correctamente.

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
                value="${S(i.successColor||"#22c55e")}"
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

          ${h("verifyShowCountdown","Mostrar cuenta regresiva","Muestra los segundos antes de cerrar o redirigir.",i.showCountdown!==!1)}

          ${h("verifyClosePageEnabled","Cerrar página automáticamente","Intenta cerrar la página al finalizar.",!!i.closePageEnabled)}

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
              ${I(i.successTitle||"Verificación completada")}
            </strong>

            <p id="successPreviewMessage">${I(i.successMessage||`Tu cuenta fue verificada correctamente.

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

          ${h("verifySuccessDmEnabled","Enviar mensaje privado","Envía un MD cuando el usuario completa la verificación.",!!i.successDmEnabled)}

          <label class="welcome-field">
            <span>TÍTULO DEL MENSAJE</span>

            <input
              id="verifySuccessDmTitle"
              maxlength="256"
              value="${S(i.successDmTitle||"🎉 ¡Verificado!")}"
            >
          </label>

          <label class="welcome-field">
            <span>DESCRIPCIÓN DEL MENSAJE</span>

            <textarea
              id="verifySuccessDmMessage"
              rows="7"
              maxlength="2000"
            >${I(i.successDmMessage||`¡Hola {usuario}! 🎉

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
                value="${S(i.successDmColor||"#3b82f6")}"
              >
            </div>
          </label>

          <label class="welcome-field">
            <span>THUMBNAIL OPCIONAL</span>

            <input
              id="verifySuccessDmThumbnail"
              placeholder="https://i.imgur.com/imagen.png"
              value="${S(i.successDmThumbnail||"")}"
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
                    ${I(i.successDmTitle||"🎉 ¡Verificado!")}
                  </strong>

                  <p id="successDmPreviewMessage">${I(i.successDmMessage||`¡Hola Usuario! 🎉

Tu cuenta fue verificada correctamente en el servidor.

Gracias por formar parte de nuestra comunidad.`)}</p>
                </div>

                <img
                  id="successDmPreviewThumbnail"
                  class="configuration-preview-thumbnail"
                  src="${S(i.successDmThumbnail||"")}"
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
  `,(()=>{const r=document.querySelectorAll(".verify-security-card"),l=document.getElementById("verifySecurityActiveCount"),v=()=>{const f=document.querySelectorAll('.verify-security-switch input[type="checkbox"]:checked').length;l&&(l.textContent=String(f))};r.forEach(f=>{const L=f.querySelector('.verify-security-switch input[type="checkbox"]'),K=f.querySelector(".verify-security-status-text");if(!L)return;const F=()=>{const Y=L.checked;f.classList.toggle("is-active",Y),K&&(K.textContent=Y?"Protección activada":"Protección desactivada")};L.addEventListener("change",()=>{F(),v()}),F()}),v()})();const d=r=>document.getElementById(r);async function ye(r,l){try{if(navigator.clipboard&&window.isSecureContext)await navigator.clipboard.writeText(r);else{const f=document.createElement("textarea");f.value=r,f.setAttribute("readonly",""),f.style.position="fixed",f.style.opacity="0",document.body.appendChild(f),f.select();const L=document.execCommand("copy");if(f.remove(),!L)throw new Error("No se pudo copiar.")}const v=l.querySelector("b");l.classList.add("copied"),v&&(v.textContent="Copiado ✓"),ae("Variable copiada",`${r} se copió correctamente.`),setTimeout(()=>{l.classList.remove("copied"),v&&(v.textContent="Copiar")},1500)}catch(v){console.error("Error copiando variable:",v),ae("No se pudo copiar",`Copiá manualmente ${r}.`)}}const ke=[{category:"user",key:"{user}",label:"Nombre del usuario"},{category:"user",key:"{username}",label:"Nombre de usuario"},{category:"user",key:"{displayname}",label:"Nombre visible"},{category:"user",key:"{globalname}",label:"Nombre global"},{category:"user",key:"{nickname}",label:"Apodo en el servidor"},{category:"user",key:"{mention}",label:"Mención del usuario"},{category:"user",key:"{userid}",label:"ID del usuario"},{category:"user",key:"{avatar}",label:"Avatar del usuario"},{category:"user",key:"{banner}",label:"Banner del usuario"},{category:"user",key:"{created}",label:"Fecha de creación de la cuenta"},{category:"user",key:"{joined}",label:"Fecha de ingreso al servidor"},{category:"user",key:"{joinedrelative}",label:"Tiempo desde que ingresó"},{category:"user",key:"{status}",label:"Estado del usuario"},{category:"user",key:"{activity}",label:"Actividad actual"},{category:"user",key:"{roles}",label:"Roles del usuario"},{category:"user",key:"{rolecount}",label:"Cantidad de roles"},{category:"user",key:"{highestrole}",label:"Rol más alto"},{category:"user",key:"{permissions}",label:"Permisos del usuario"},{category:"user",key:"{boosting}",label:"Estado de boost"},{category:"server",key:"{server}",label:"Nombre del servidor"},{category:"server",key:"{serverid}",label:"ID del servidor"},{category:"server",key:"{servericon}",label:"Icono del servidor"},{category:"server",key:"{serverbanner}",label:"Banner del servidor"},{category:"server",key:"{serverdescription}",label:"Descripción del servidor"},{category:"server",key:"{owner}",label:"Propietario del servidor"},{category:"server",key:"{ownerid}",label:"ID del propietario"},{category:"server",key:"{membercount}",label:"Cantidad de miembros"},{category:"server",key:"{members}",label:"Cantidad de miembros"},{category:"server",key:"{bots}",label:"Cantidad de bots"},{category:"server",key:"{humans}",label:"Cantidad de usuarios reales"},{category:"server",key:"{online}",label:"Miembros conectados"},{category:"server",key:"{offline}",label:"Miembros desconectados"},{category:"server",key:"{boosts}",label:"Cantidad de boosts"},{category:"server",key:"{boostlevel}",label:"Nivel de boost"},{category:"server",key:"{verificationlevel}",label:"Nivel de verificación"},{category:"server",key:"{channels}",label:"Cantidad de canales"},{category:"server",key:"{textchannels}",label:"Canales de texto"},{category:"server",key:"{voicechannels}",label:"Canales de voz"},{category:"server",key:"{categories}",label:"Cantidad de categorías"},{category:"server",key:"{rolescount}",label:"Cantidad de roles"},{category:"server",key:"{emojis}",label:"Cantidad de emojis"},{category:"server",key:"{stickers}",label:"Cantidad de stickers"},{category:"server",key:"{createdserver}",label:"Fecha de creación del servidor"},{category:"roles",key:"{role}",label:"Nombre del rol entregado"},{category:"roles",key:"{roleid}",label:"ID del rol entregado"},{category:"roles",key:"{rolename}",label:"Nombre del rol"},{category:"roles",key:"{rolecolor}",label:"Color del rol"},{category:"roles",key:"{roleicon}",label:"Icono del rol"},{category:"roles",key:"{highestrole}",label:"Rol más alto"},{category:"roles",key:"{lowestrole}",label:"Rol más bajo"},{category:"roles",key:"{autorole}",label:"Rol automático"},{category:"channel",key:"{channel}",label:"Canal actual"},{category:"channel",key:"{channelid}",label:"ID del canal"},{category:"channel",key:"{channelmention}",label:"Mención del canal"},{category:"channel",key:"{channeltopic}",label:"Tema del canal"},{category:"channel",key:"{category}",label:"Categoría del canal"},{category:"channel",key:"{categoryid}",label:"ID de la categoría"},{category:"channel",key:"{thread}",label:"Nombre del hilo"},{category:"channel",key:"{threadid}",label:"ID del hilo"},{category:"channel",key:"{slowmode}",label:"Modo lento"},{category:"channel",key:"{channeltype}",label:"Tipo de canal"},{category:"bot",key:"{bot}",label:"Nombre del bot"},{category:"bot",key:"{botid}",label:"ID del bot"},{category:"bot",key:"{botavatar}",label:"Avatar del bot"},{category:"bot",key:"{botversion}",label:"Versión del bot"},{category:"bot",key:"{latency}",label:"Latencia del bot"},{category:"bot",key:"{ping}",label:"Ping del bot"},{category:"bot",key:"{uptime}",label:"Tiempo activo"},{category:"bot",key:"{commands}",label:"Cantidad de comandos"},{category:"bot",key:"{servers}",label:"Cantidad de servidores"},{category:"bot",key:"{users}",label:"Cantidad de usuarios"},{category:"bot",key:"{memory}",label:"Memoria usada"},{category:"bot",key:"{cpu}",label:"Uso del procesador"},{category:"bot",key:"{node}",label:"Versión de Node.js"},{category:"bot",key:"{library}",label:"Librería utilizada"},{category:"date",key:"{date}",label:"Fecha actual"},{category:"date",key:"{time}",label:"Hora actual"},{category:"date",key:"{datetime}",label:"Fecha y hora actual"},{category:"date",key:"{timestamp}",label:"Marca de tiempo"},{category:"date",key:"{year}",label:"Año actual"},{category:"date",key:"{month}",label:"Número del mes"},{category:"date",key:"{monthname}",label:"Nombre del mes"},{category:"date",key:"{day}",label:"Día actual"},{category:"date",key:"{weekday}",label:"Día de la semana"},{category:"date",key:"{hour}",label:"Hora"},{category:"date",key:"{minute}",label:"Minuto"},{category:"date",key:"{second}",label:"Segundo"},{category:"date",key:"{timezone}",label:"Zona horaria"},{category:"date",key:"{unix}",label:"Tiempo Unix"},{category:"date",key:"{shortdate}",label:"Fecha corta"},{category:"date",key:"{longdate}",label:"Fecha completa"},{category:"verification",key:"{verifylink}",label:"Enlace de verificación"},{category:"verification",key:"{verificationcode}",label:"Código de verificación"},{category:"verification",key:"{verificationid}",label:"ID de verificación"},{category:"verification",key:"{verificationmethod}",label:"Método de verificación"},{category:"verification",key:"{verificationrole}",label:"Rol de verificación"},{category:"verification",key:"{verificationchannel}",label:"Canal de verificación"},{category:"verification",key:"{verificationtime}",label:"Hora de verificación"},{category:"verification",key:"{verificationdate}",label:"Fecha de verificación"},{category:"verification",key:"{verifyexpires}",label:"Vencimiento del enlace"},{category:"verification",key:"{verified}",label:"Estado de verificación"},{category:"verification",key:"{verifybrowser}",label:"Navegador utilizado"},{category:"verification",key:"{verifyos}",label:"Sistema operativo"},{category:"verification",key:"{verifydevice}",label:"Dispositivo utilizado"},{category:"verification",key:"{verifycountry}",label:"País aproximado"},{category:"verification",key:"{verifycity}",label:"Ciudad aproximada"},{category:"verification",key:"{verifylanguage}",label:"Idioma del navegador"},{category:"verification",key:"{verifyisp}",label:"Proveedor de internet"},{category:"tickets",key:"{ticket}",label:"Nombre del ticket"},{category:"tickets",key:"{ticketid}",label:"ID del ticket"},{category:"tickets",key:"{ticketnumber}",label:"Número del ticket"},{category:"tickets",key:"{ticketowner}",label:"Creador del ticket"},{category:"tickets",key:"{ticketownerid}",label:"ID del creador"},{category:"tickets",key:"{ticketcategory}",label:"Categoría del ticket"},{category:"tickets",key:"{ticketreason}",label:"Motivo del ticket"},{category:"tickets",key:"{ticketcreated}",label:"Fecha de creación"},{category:"tickets",key:"{ticketclosed}",label:"Fecha de cierre"},{category:"tickets",key:"{ticketclosedby}",label:"Cerrado por"},{category:"tickets",key:"{ticketmessages}",label:"Cantidad de mensajes"},{category:"tickets",key:"{ticketclaim}",label:"Miembro del staff asignado"},{category:"tickets",key:"{ticketpriority}",label:"Prioridad"},{category:"tickets",key:"{ticketstatus}",label:"Estado del ticket"},{category:"moderation",key:"{moderator}",label:"Moderador responsable"},{category:"moderation",key:"{moderatorid}",label:"ID del moderador"},{category:"moderation",key:"{reason}",label:"Motivo"},{category:"moderation",key:"{duration}",label:"Duración"},{category:"moderation",key:"{case}",label:"Número de caso"},{category:"moderation",key:"{warns}",label:"Cantidad de advertencias"},{category:"moderation",key:"{bans}",label:"Cantidad de baneos"},{category:"moderation",key:"{kicks}",label:"Cantidad de expulsiones"},{category:"moderation",key:"{timeouts}",label:"Cantidad de aislamientos"},{category:"moderation",key:"{punishment}",label:"Tipo de sanción"},{category:"moderation",key:"{appeal}",label:"Apelación"},{category:"moderation",key:"{appealid}",label:"ID de apelación"},{category:"moderation",key:"{appealstatus}",label:"Estado de apelación"},{category:"web",key:"{ip}",label:"Dirección IP"},{category:"web",key:"{country}",label:"País aproximado"},{category:"web",key:"{city}",label:"Ciudad aproximada"},{category:"web",key:"{region}",label:"Región aproximada"},{category:"web",key:"{timezone}",label:"Zona horaria"},{category:"web",key:"{browser}",label:"Navegador"},{category:"web",key:"{browserversion}",label:"Versión del navegador"},{category:"web",key:"{os}",label:"Sistema operativo"},{category:"web",key:"{osversion}",label:"Versión del sistema"},{category:"web",key:"{device}",label:"Dispositivo"},{category:"web",key:"{platform}",label:"Plataforma"},{category:"web",key:"{language}",label:"Idioma"},{category:"web",key:"{resolution}",label:"Resolución de pantalla"},{category:"web",key:"{isp}",label:"Proveedor de internet"},{category:"messages",key:"{message}",label:"Contenido del mensaje"},{category:"messages",key:"{messageid}",label:"ID del mensaje"},{category:"messages",key:"{author}",label:"Autor del mensaje"},{category:"messages",key:"{authorid}",label:"ID del autor"},{category:"messages",key:"{reply}",label:"Mensaje respondido"},{category:"messages",key:"{attachments}",label:"Cantidad de archivos"},{category:"messages",key:"{embeds}",label:"Cantidad de embeds"},{category:"messages",key:"{mentions}",label:"Menciones"},{category:"messages",key:"{wordcount}",label:"Cantidad de palabras"},{category:"messages",key:"{characters}",label:"Cantidad de caracteres"},{category:"messages",key:"{lines}",label:"Cantidad de líneas"},{category:"messages",key:"{jumpurl}",label:"Enlace al mensaje"},{category:"invites",key:"{invite}",label:"Enlace de invitación"},{category:"invites",key:"{invitecode}",label:"Código de invitación"},{category:"invites",key:"{inviter}",label:"Creador de la invitación"},{category:"invites",key:"{inviterid}",label:"ID del creador"},{category:"invites",key:"{uses}",label:"Cantidad de usos"},{category:"invites",key:"{maxuses}",label:"Máximo de usos"},{category:"invites",key:"{expires}",label:"Fecha de vencimiento"},{category:"invites",key:"{temporary}",label:"Invitación temporal"},{category:"emojis",key:"{emoji}",label:"Emoji"},{category:"emojis",key:"{emojiid}",label:"ID del emoji"},{category:"emojis",key:"{emojiurl}",label:"URL del emoji"},{category:"emojis",key:"{success}",label:"Emoji de éxito"},{category:"emojis",key:"{error}",label:"Emoji de error"},{category:"emojis",key:"{warning}",label:"Emoji de advertencia"},{category:"emojis",key:"{info}",label:"Emoji de información"},{category:"system",key:"{newline}",label:"Salto de línea"},{category:"system",key:"{space}",label:"Espacio"},{category:"system",key:"{separator}",label:"Separador"},{category:"system",key:"{tab}",label:"Tabulación"},{category:"system",key:"{version}",label:"Versión"},{category:"system",key:"{dashboardversion}",label:"Versión del dashboard"},{category:"system",key:"{build}",label:"Versión de compilación"},{category:"system",key:"{environment}",label:"Entorno"},{category:"system",key:"{random}",label:"Texto aleatorio"},{category:"system",key:"{randomnumber}",label:"Número aleatorio"},{category:"system",key:"{randomcolor}",label:"Color aleatorio"},{category:"system",key:"{uuid}",label:"Identificador único"},{category:"system",key:"{domain}",label:"Dominio del dashboard"},{category:"system",key:"{url}",label:"URL actual"},{category:"stats",key:"{totalusers}",label:"Usuarios totales"},{category:"stats",key:"{totalservers}",label:"Servidores totales"},{category:"stats",key:"{totalchannels}",label:"Canales totales"},{category:"stats",key:"{totalroles}",label:"Roles totales"},{category:"stats",key:"{totalbots}",label:"Bots totales"},{category:"stats",key:"{verificationstoday}",label:"Verificaciones de hoy"},{category:"stats",key:"{verificationstotal}",label:"Verificaciones totales"},{category:"stats",key:"{ticketsopen}",label:"Tickets abiertos"},{category:"stats",key:"{ticketsclosed}",label:"Tickets cerrados"},{category:"stats",key:"{commandsused}",label:"Comandos utilizados"},{category:"stats",key:"{joins}",label:"Ingresos"},{category:"stats",key:"{leaves}",label:"Salidas"},{category:"stats",key:"{uptimepercent}",label:"Porcentaje de actividad"}],ne=d("variablesModal"),T=d("variablesSearch"),te=d("variablesModalEmpty"),Te=d("variablesModalList"),Le=document.querySelectorAll("[data-variable-category]");let Be="user";function Ee(){if(!Te)return;const r=String(T?.value||"").trim().toLowerCase(),l=ke.filter(f=>{const L=f.category===Be,K=`${f.key} ${f.label}`.toLowerCase(),F=!r||K.includes(r);return L&&F});Te.innerHTML=l.map(f=>`
        <button
          class="verify-variable-button"
          data-copy-variable="${S(f.key)}"
          data-variable-search="${S(`${f.key} ${f.label}`)}"
          type="button"
        >
          <code>
            ${I(f.key)}
          </code>

          <span>
            ${I(f.label)}
          </span>

          <b>
            Copiar
          </b>
        </button>
      `).join("");const v=l.length>0;te&&(te.hidden=v,te.classList.toggle("visible",!v))}function Oe(r){T&&(T.value=String(r||"")),Ee()}Le.forEach(r=>{r.addEventListener("click",l=>{l.preventDefault(),l.stopPropagation(),Be=r.dataset.variableCategory||"user",Le.forEach(v=>{v.classList.toggle("active",v===r)}),Ee()})}),Te?.addEventListener("click",r=>{const l=r.target.closest("[data-copy-variable]");l&&(r.preventDefault(),r.stopPropagation(),ye(l.dataset.copyVariable,l))}),Ee(),ne?.addEventListener("wheel",r=>{const l=r.target.closest(".variables-categories, .variables-results");if(!l){r.preventDefault();return}const v=r.deltaY<0,f=r.deltaY>0,L=l.scrollTop<=0,K=Math.ceil(l.scrollTop+l.clientHeight)>=l.scrollHeight;(v&&L||f&&K)&&r.preventDefault()},{passive:!1});function _e(){ne&&(ne.classList.add("open"),ne.setAttribute("aria-hidden","false"),document.body.classList.add("variables-modal-open"),T&&(T.value=""),Be="user",Le.forEach(r=>{r.classList.toggle("active",r.dataset.variableCategory==="user")}),Ee(),T&&setTimeout(()=>{T.focus()},150))}function De(){ne&&(ne.classList.remove("open"),ne.setAttribute("aria-hidden","true"),document.body.classList.remove("variables-modal-open"))}document.querySelectorAll("[data-open-variables]").forEach(r=>{r.addEventListener("click",l=>{l.preventDefault(),l.stopPropagation(),_e()})}),document.querySelectorAll("[data-close-variables]").forEach(r=>{r.addEventListener("click",l=>{l.preventDefault(),l.stopPropagation(),De()})}),document.querySelectorAll("[data-copy-variable]").forEach(r=>{r.addEventListener("click",l=>{l.preventDefault(),l.stopPropagation(),ye(r.dataset.copyVariable,r)})}),T?.addEventListener("input",r=>{Oe(r.target.value)}),document.addEventListener("keydown",r=>{r.key==="Escape"&&ne?.classList.contains("open")&&De()});const ae=(r,l)=>{ee.querySelector("strong").textContent=r,ee.querySelector("p").textContent=l,Ie()};document.querySelectorAll("[data-copy-variable]").forEach(r=>{r.addEventListener("click",l=>{l.preventDefault(),l.stopPropagation();const v=r.dataset.copyVariable;v&&ye(v,r)})});const Ve=()=>document.querySelector('input[name="verificationMethod"]:checked')?.value||"oauth_link",fe=()=>{const r={};return Object.keys(c).forEach(l=>{r[l]=!!d(`verifyLog_${l}`)?.checked}),r},se=r=>w(r),H=()=>{const r=d("verifyEmbedTitle"),l=d("verifyEmbedDescription"),v=d("verifyEmbedColor"),f=d("verifyButtonText"),L=d("verifyButtonEmoji"),K=d("verifyEmbedFieldName"),F=d("verifyEmbedFieldValue"),Y=d("verifyEmbedFooterText"),Q=d("verifyEmbedThumbnailUrl"),N=d("verifyEmbedImageUrl"),ie=d("verifyPreviewEmbed");if(!ie)return;const Fe=d("verifyPreviewTitle"),Ne=d("verifyPreviewDescription"),ce=d("verifyPreviewFieldName"),Ze=d("verifyPreviewFieldValue"),ze=d("verifyPreviewButtonText"),Qe=d("verifyPreviewButtonEmoji"),zt=d("verifyPreviewFooterText"),Kt=d("verifyPreviewAuthor"),Ke=d("verifyPreviewThumbnail"),it=d("verifyPreviewImage"),Wt=d("verifyPreviewTimestamp");if(Fe&&(Fe.textContent=se(r?.value||"🔒 Verificación requerida")),Ne&&(Ne.textContent=se(l?.value||"Presioná el botón para verificarte.")),ce&&(ce.textContent=se(K?.value||"📌 Servidor")),Ze&&(Ze.textContent=se(F?.value||"{server}")),ze&&(ze.textContent=f?.value||"Verificar con Discord"),Qe&&(Qe.textContent=L?.value||""),zt&&(zt.textContent=se(Y?.value||"Nebula Security")),ie.style.setProperty("--preview-embed-color",v?.value||"#8b5cf6"),Kt&&(Kt.style.display=d("verifyShowBotAvatar")?.checked?"flex":"none"),Ke){const Jt=!!d("verifyShowCustomThumbnail")?.checked,Aa=!!d("verifyShowServerIcon")?.checked;Jt&&Q?.value?(Ke.src=Q.value,Ke.style.display="block"):Aa&&Ke.src?Ke.style.display="block":Ke.style.display="none"}it&&(!!d("verifyShowEmbedImage")?.checked&&N?.value?(it.src=N.value,it.style.display="block"):it.style.display="none"),Wt&&(Wt.style.display=d("verifyShowTimestamp")?.checked?"inline":"none")},Z=()=>{const r=document.getElementById("verifySuccessTitle"),l=document.getElementById("verifySuccessMessage"),v=document.getElementById("verifySuccessColor"),f=document.getElementById("verifySuccessAnimation"),L=document.getElementById("verifyShowCountdown"),K=document.getElementById("verifyClosePageEnabled"),F=document.querySelector(".configuration-success-preview"),Y=document.getElementById("successPreviewTitle"),Q=document.getElementById("successPreviewMessage"),N=document.getElementById("successPreviewIcon"),ie=F?.querySelector("small"),Fe=F?.querySelector(".configuration-progress-track");if(!r||!l||!v||!F||!Y||!Q||!N)return;const Ne=a?.name||"servidor";Y.textContent=r.value.trim()||"Verificación completada",Q.textContent=(l.value.trim()||"Tu cuenta fue verificada correctamente.").replaceAll("{servidor}",Ne).replaceAll("{server}",Ne);const ce=/^#[0-9a-f]{6}$/i.test(v.value)?v.value:"#22c55e";F.style.setProperty("--success-color",ce),N.style.setProperty("background-color",ce,"important"),N.style.setProperty("border-color",ce,"important"),N.style.setProperty("box-shadow",`0 0 28px ${ce}88`,"important"),N.style.color="#ffffff";const Ze=F.querySelector(".configuration-progress-track span");Ze&&Ze.style.setProperty("background-color",ce,"important");const ze=f?.value||"check";F.dataset.animation=ze,ze==="none"?N.style.display="none":(N.style.display="grid",N.textContent=ze==="confetti"?"🎉":"✓");const Qe=L?.checked!==!1;ie&&(ie.style.display=Qe?"":"none",ie.textContent=K?.checked?"Cerrando en 3 segundos...":"Redirigiendo en 3 segundos..."),Fe&&(Fe.style.display=Qe?"":"none")};["verifySuccessTitle","verifySuccessMessage","verifySuccessColor"].forEach(r=>{document.getElementById(r)?.addEventListener("input",Z)}),["verifySuccessAnimation","verifyShowCountdown","verifyClosePageEnabled"].forEach(r=>{document.getElementById(r)?.addEventListener("change",Z)}),Z();const ge=r=>String(r||"").replaceAll("{usuario}","Usuario de ejemplo").replaceAll("{servidor}","Servidor de ejemplo").replaceAll("{rol}","✓ Verificado").replaceAll("{fecha}",new Date().toLocaleDateString("es-AR")).replaceAll("{hora}",new Date().toLocaleTimeString("es-AR",{hour:"2-digit",minute:"2-digit"})),pe=()=>{const r=document.getElementById("verifySuccessDmEnabled"),l=document.getElementById("verifySuccessDmTitle"),v=document.getElementById("verifySuccessDmMessage"),f=document.getElementById("verifySuccessDmColor"),L=document.getElementById("verifySuccessDmColorText"),K=document.getElementById("verifySuccessDmThumbnail"),F=document.getElementById("successDmPreviewEmbed"),Y=document.getElementById("successDmPreviewTitle"),Q=document.getElementById("successDmPreviewMessage"),N=document.getElementById("successDmPreviewThumbnail");if(!F||!Y||!Q||!N)return;const ie=l?.value||"🎉 ¡Verificado!",Fe=v?.value||`¡Hola {usuario}! 🎉

Tu cuenta fue verificada correctamente en {servidor}.

Gracias por formar parte de nuestra comunidad.`,Ne=f?.value||"#3b82f6",ce=String(K?.value||"").trim();Y.textContent=ge(ie),Q.textContent=ge(Fe),F.style.setProperty("--preview-color",Ne),L&&(L.value=Ne),ce&&/^https?:\/\//i.test(ce)?(N.src=ce,N.style.display=""):(N.removeAttribute("src"),N.style.display="none"),F.style.opacity=r?.checked?"1":"0.45"};["verifySuccessDmTitle","verifySuccessDmMessage","verifySuccessDmThumbnail"].forEach(r=>{document.getElementById(r)?.addEventListener("input",pe)}),document.getElementById("verifySuccessDmEnabled")?.addEventListener("change",pe),document.getElementById("verifySuccessDmColor")?.addEventListener("input",r=>{const l=document.getElementById("verifySuccessDmColorText");l&&(l.value=r.target.value),pe()}),document.getElementById("verifySuccessDmColorText")?.addEventListener("input",r=>{const l=r.target.value.trim();if(/^#[0-9a-f]{6}$/i.test(l)){const v=document.getElementById("verifySuccessDmColor");v&&(v.value=l),pe()}}),pe();const Ue=()=>({enabled:d("verifyEnabled").checked,verificationChannelId:d("verifyChannel").value,logsChannelId:d("verifyLogs").value,verifiedRoleId:d("verifyRole").value,verificationMethod:Ve(),embedTitle:d("verifyEmbedTitle").value,embedDescription:d("verifyEmbedDescription").value,embedColor:d("verifyEmbedColor").value,buttonText:d("verifyButtonText").value,buttonEmoji:d("verifyButtonEmoji").value,reactionEmoji:d("verifyReactionEmoji").value,interactionTitle:d("verifyInteractionTitle").value,interactionMessage:d("verifyInteractionMessage").value,interactionColor:d("verifyInteractionColor").value,interactionImage:d("verifyInteractionImage").value,interactionButtonEmoji:d("verifyInteractionButtonEmoji").value,interactionButtonText:d("verifyInteractionButtonText").value,successTitle:d("verifySuccessTitle").value,successMessage:d("verifySuccessMessage").value,successColor:d("verifySuccessColor").value,successAnimation:d("verifySuccessAnimation").value,showCountdown:d("verifyShowCountdown").checked,closePageEnabled:d("verifyClosePageEnabled").checked,successDmEnabled:d("verifySuccessDmEnabled").checked,successDmTitle:d("verifySuccessDmTitle").value,successDmMessage:d("verifySuccessDmMessage").value,successDmColor:d("verifySuccessDmColor").value,successDmThumbnail:d("verifySuccessDmThumbnail").value,embedFieldName:d("verifyEmbedFieldName").value,embedFieldValue:d("verifyEmbedFieldValue").value,embedFooterText:d("verifyEmbedFooterText").value,embedThumbnailUrl:d("verifyEmbedThumbnailUrl").value,embedImageUrl:d("verifyEmbedImageUrl").value,showBotAvatar:d("verifyShowBotAvatar").checked,showServerIcon:d("verifyShowServerIcon").checked,showCustomThumbnail:d("verifyShowCustomThumbnail").checked,showEmbedImage:d("verifyShowEmbedImage").checked,showTimestamp:d("verifyShowTimestamp").checked,logEmbedTitle:d("verifyLogTitle").value,logEmbedDescription:d("verifyLogDescription").value,logEmbedColor:d("verifyLogColor").value,logOptions:fe(),webAppearance:j(),security:{detectVpn:d("verifyDetectVpn").checked,detectProxy:d("verifyDetectProxy").checked,detectTor:d("verifyDetectTor").checked,blockHosting:d("verifyBlockHosting").checked,detectAltAccounts:d("verifyDetectAltAccounts").checked,minimumAccountAgeEnabled:d("verifyMinimumAgeEnabled").checked,minimumAccountAgeDays:Number(d("verifyMinimumAgeDays").value),blockWithoutAvatar:d("verifyBlockWithoutAvatar").checked,blockWithoutBanner:d("verifyBlockWithoutBanner").checked,allowReverification:d("verifyAllowReverification").checked,notifySecurityFailure:d("verifyNotifySecurityFailure").checked,detectVpnLogChannelId:d("verifyDetectVpnLogChannel").value,detectProxyLogChannelId:d("verifyDetectProxyLogChannel").value,detectTorLogChannelId:d("verifyDetectTorLogChannel").value,blockHostingLogChannelId:d("verifyBlockHostingLogChannel").value,detectAltAccountsLogChannelId:d("verifyDetectAltAccountsLogChannel").value,minimumAccountAgeLogChannelId:d("verifyMinimumAgeLogChannel").value,blockWithoutAvatarLogChannelId:d("verifyBlockWithoutAvatarLogChannel").value,blockWithoutBannerLogChannelId:d("verifyBlockWithoutBannerLogChannel").value}});["verifyEmbedTitle","verifyEmbedDescription","verifyEmbedColor","verifyEmbedColorText","verifyButtonText","verifyButtonEmoji","verifyEmbedFieldName","verifyEmbedFieldValue","verifyEmbedFooterText","verifyEmbedThumbnailUrl","verifyEmbedImageUrl","verifyShowBotAvatar","verifyShowServerIcon","verifyShowCustomThumbnail","verifyShowEmbedImage","verifyShowTimestamp","verifyRole","verifyChannel"].forEach(r=>{const l=d(r);if(!l)return;const v=l.type==="checkbox"?"change":"input";l.addEventListener(v,H)}),d("verifyEmbedColor")?.addEventListener("input",r=>{d("verifyEmbedColorText").value=r.target.value,H()}),d("verifyEmbedColorText")?.addEventListener("input",r=>{const l=r.target.value.trim();/^#[0-9a-f]{6}$/i.test(l)&&(d("verifyEmbedColor").value=l,H())}),H();const xe=d("interactionMessageConfiguration"),qe=document.querySelectorAll('input[name="verificationMethod"]');function we(){const r=document.querySelector('input[name="verificationMethod"]:checked')?.value||"oauth_link";xe&&(xe.style.display=r==="interaction_button"?"":"none")}qe.forEach(r=>{r.addEventListener("change",we)}),we();const je=d("verifyInteractionTitle"),Ce=d("verifyInteractionMessage"),Se=d("verifyInteractionColor"),b=d("verifyInteractionColorText"),A=d("verifyInteractionImage"),x=d("verifyInteractionButtonEmoji"),O=d("verifyInteractionButtonText"),o=d("interactionPreviewTitle"),u=d("interactionPreviewMessage"),y=d("interactionMessagePreviewEmbed"),g=d("interactionPreviewImage"),E=d("interactionPreviewButton");function w(r){const l=new Date,v=d("verifyRole")?.selectedOptions?.[0]?.textContent?.trim()||"Miembro verificado",f=d("verifyChannel")?.selectedOptions?.[0]?.textContent?.trim()||"#verificación",L=a?.name||"Servidor de ejemplo",K=String(a?.id||"123456789012345678"),F=String(a?.ownerId||"123456789012345678"),Y=Number(a?.memberCount||a?.members||1248).toLocaleString("es-AR"),Q={"{usuario}":"Usuario","{servidor}":L,"{rol}":v,"{fecha}":l.toLocaleDateString("es-AR"),"{hora}":l.toLocaleTimeString("es-AR",{hour:"2-digit",minute:"2-digit"}),"{user}":"Usuario","{username}":"usuario","{displayname}":"Usuario de ejemplo","{globalname}":"Usuario de ejemplo","{nickname}":"Usuario","{mention}":"@Usuario","{userid}":"123456789012345678","{avatar}":"https://cdn.discordapp.com/avatar.png","{banner}":"https://cdn.discordapp.com/banner.png","{created}":"15/03/2024","{joined}":"10/07/2026","{joinedrelative}":"hace 7 días","{status}":"En línea","{activity}":"Usando Nebula","{roles}":`${v}, Miembro`,"{rolecount}":"2","{highestrole}":v,"{lowestrole}":"Miembro","{permissions}":"Ver canales, enviar mensajes","{boosting}":"No","{server}":L,"{serverid}":K,"{servericon}":a?.icon||"Icono del servidor","{serverbanner}":a?.banner||"Banner del servidor","{serverdescription}":a?.description||"Comunidad protegida por Nebula","{owner}":"Propietario","{ownerid}":F,"{membercount}":Y,"{members}":Y,"{bots}":"24","{humans}":"1.224","{online}":"386","{offline}":"862","{boosts}":"18","{boostlevel}":"Nivel 2","{verificationlevel}":"Medio","{channels}":"48","{textchannels}":"32","{voicechannels}":"10","{categories}":"6","{rolescount}":"14","{emojis}":"42","{stickers}":"8","{createdserver}":"20/05/2024","{role}":v,"{roleid}":"123456789012345678","{rolename}":v,"{rolecolor}":"#ffffff","{roleicon}":"🛡️","{autorole}":v,"{channel}":f,"{channelid}":"123456789012345678","{channelmention}":f,"{channeltopic}":"Canal de verificación","{category}":"INFORMACIÓN","{categoryid}":"123456789012345678","{thread}":"Hilo de ejemplo","{threadid}":"123456789012345678","{slowmode}":"Desactivado","{channeltype}":"Canal de texto","{bot}":"Nebula Bot","{botid}":"123456789012345678","{botavatar}":"Avatar de Nebula","{botversion}":"2.0.0","{latency}":"38 ms","{ping}":"38 ms","{uptime}":"30 días","{commands}":"24","{servers}":"12","{users}":"8.745","{memory}":"86 MB","{cpu}":"2.3%","{node}":"Node.js 22","{library}":"Discord.js v14","{date}":l.toLocaleDateString("es-AR"),"{time}":l.toLocaleTimeString("es-AR",{hour:"2-digit",minute:"2-digit"}),"{datetime}":l.toLocaleString("es-AR"),"{timestamp}":String(l.getTime()),"{year}":String(l.getFullYear()),"{month}":String(l.getMonth()+1),"{monthname}":l.toLocaleDateString("es-AR",{month:"long"}),"{day}":String(l.getDate()),"{weekday}":l.toLocaleDateString("es-AR",{weekday:"long"}),"{hour}":String(l.getHours()).padStart(2,"0"),"{minute}":String(l.getMinutes()).padStart(2,"0"),"{second}":String(l.getSeconds()).padStart(2,"0"),"{timezone}":Intl.DateTimeFormat().resolvedOptions().timeZone,"{unix}":String(Math.floor(l.getTime()/1e3)),"{shortdate}":l.toLocaleDateString("es-AR"),"{longdate}":l.toLocaleDateString("es-AR",{weekday:"long",year:"numeric",month:"long",day:"numeric"}),"{verifylink}":`${window.location.origin}/verify`,"{verificationcode}":"NEBULA-4821","{verificationid}":"VER-123456","{verificationmethod}":"Botón de enlace","{verificationrole}":v,"{verificationchannel}":f,"{verificationtime}":l.toLocaleTimeString("es-AR"),"{verificationdate}":l.toLocaleDateString("es-AR"),"{verifyexpires}":"20 minutos","{verified}":"Verificado","{verifybrowser}":"Chrome","{verifyos}":"Windows 11","{verifydevice}":"Computadora","{verifycountry}":"Argentina","{verifycity}":"El Colorado","{verifylanguage}":navigator.language||"es-AR","{verifyisp}":"Proveedor de internet","{newline}":`
`,"{space}":" ","{separator}":"────────────","{tab}":"    ","{version}":"2.0.0","{dashboardversion}":"2.0.0","{build}":"Producción","{environment}":"Dashboard","{random}":"Nebula","{randomnumber}":String(Math.floor(Math.random()*1e3)),"{randomcolor}":"#ffffff","{uuid}":"550e8400-e29b-41d4-a716-446655440000","{domain}":window.location.hostname,"{url}":window.location.href};return ke.forEach(N=>{const ie=N.key.toLowerCase();Q[ie]===void 0&&(Q[ie]=`${N.label} — ejemplo`)}),String(r||"").replace(/\{[a-z0-9]+\}/gi,N=>Q[N.toLowerCase()]??N)}function V(r){return/^#[0-9A-Fa-f]{6}$/.test(String(r||""))}function z(){if(!o||!u||!y||!E)return;const r=w(je?.value||"🔒 Verificá tu cuenta"),l=w(Ce?.value||"Presioná el botón para verificarte.");o.textContent=r,u.textContent=l;const v=Se?.value||"#ffffff";y.style.setProperty("--preview-color",v),b&&b.value!==v&&(b.value=v);const f=A?.value.trim()||"";g&&(f?(g.src=f,g.style.display="block"):(g.removeAttribute("src"),g.style.display="none"));const L=x?.value.trim()||"",K=O?.value.trim()||"Continuar verificación";E.innerHTML=`
  ${L?`<span class="configuration-link-button-emoji">${I(L)}</span>`:""}

  <span class="configuration-link-button-text">
    ${I(K)}
  </span>

  <span class="configuration-link-button-arrow">
    ↗
  </span>
`}[je,Ce,A,x,O].forEach(r=>{r?.addEventListener("input",z)}),Se?.addEventListener("input",z),b?.addEventListener("input",()=>{const r=b.value.trim();V(r)&&Se&&(Se.value=r,z())}),z(),d("backToServerPanel")?.addEventListener("click",()=>{Me(a.id)}),document.querySelectorAll(".verify-tab").forEach(r=>{r.addEventListener("click",()=>{document.querySelectorAll(".verify-tab").forEach(l=>l.classList.remove("active")),document.querySelectorAll(".verify-tab-panel").forEach(l=>l.classList.remove("active")),r.classList.add("active"),document.querySelector(`[data-verify-panel="${r.dataset.verifyTab}"]`)?.classList.add("active")})}),d("verifyEnabled")?.addEventListener("change",r=>{const l=d("verifySystemStatus");l.textContent=r.target.checked?"ACTIVADO":"DESACTIVADO",l.classList.toggle("enabled",r.target.checked),l.classList.toggle("disabled",!r.target.checked)}),d("verifyLogs")?.addEventListener("change",r=>{d("verifyLogsSettings")?.classList.toggle("visible",!!r.target.value)});const U=(r,l)=>{const v=d(r),f=d(l);v?.addEventListener("input",()=>{f.value=v.value}),f?.addEventListener("input",()=>{/^#[0-9A-F]{6}$/i.test(f.value)&&(v.value=f.value)})};U("verifyEmbedColor","verifyEmbedColorText"),U("verifyLogColor","verifyLogColorText");function j(){return{splitImageUrl:document.getElementById("verifySplitImageUrl")?.value.trim()||"",splitImagePosition:document.getElementById("verifySplitImagePosition")?.value||"left",splitImageFit:document.getElementById("verifySplitImageFit")?.value||"cover",splitImageDarkness:Number(document.getElementById("verifySplitImageDarkness")?.value||45),splitImageWidth:Number(document.getElementById("verifySplitImageWidth")?.value||48),splitShowImage:document.getElementById("verifySplitShowImage")?.checked!==!1,splitShowDate:document.getElementById("verifySplitShowDate")?.checked!==!1,splitShowAccess:document.getElementById("verifySplitShowAccess")?.checked!==!1,cardDesign:document.querySelector('input[name="verificationCardDesign"]:checked')?.value||"classic",terminalTitle:document.getElementById("verifyTerminalTitle")?.value.trim()||"NEBULA SECURITY TERMINAL",terminalPrefix:document.getElementById("verifyTerminalPrefix")?.value.trim()||">",terminalStatusText:document.getElementById("verifyTerminalStatusText")?.value.trim()||"Sistema preparado",terminalBackgroundColor:document.getElementById("verifyTerminalBackgroundColorText")?.value||"#020703",terminalTextColor:document.getElementById("verifyTerminalTextColorText")?.value||"#d9ffe0",terminalAccentColor:document.getElementById("verifyTerminalAccentColorText")?.value||"#22c55e",terminalBorderColor:document.getElementById("verifyTerminalBorderColorText")?.value||"#14532d",terminalShowCursor:!!document.getElementById("verifyTerminalShowCursor")?.checked,terminalShowLines:!!document.getElementById("verifyTerminalShowLines")?.checked,terminalShowServer:!!document.getElementById("verifyTerminalShowServer")?.checked,terminalShowRole:!!document.getElementById("verifyTerminalShowRole")?.checked,terminalGlow:Number(document.getElementById("verifyTerminalGlow")?.value||25),terminalRadius:Number(document.getElementById("verifyTerminalRadius")?.value||10),pageName:document.getElementById("verifyPageName")?.value.trim()||"",pageDescription:document.getElementById("verifyPageDescription")?.value.trim()||"",logoUrl:document.getElementById("verifyLogoUrl")?.value.trim()||"",backgroundUrl:document.getElementById("verifyBackgroundUrl")?.value.trim()||"",primaryColor:document.getElementById("verifyPrimaryColorText")?.value||"#8b5cf6",secondaryColor:document.getElementById("verifySecondaryColorText")?.value||"#6d28d9",buttonColor:document.getElementById("verifyButtonColorText")?.value||"#7c3aed",textColor:document.getElementById("verifyTextColorText")?.value||"#ffffff",cardColor:document.getElementById("verifyCardColorText")?.value||"#0f0f1a",backgroundSolidColor:document.getElementById("verifyBackgroundSolidColorText")?.value||"#05050a",gradientStart:document.getElementById("verifyGradientStartText")?.value||"#05050a",gradientEnd:document.getElementById("verifyGradientEndText")?.value||"#160c2b",backgroundType:document.getElementById("verifyBackgroundType")?.value||"space",spaceBackground:!!document.getElementById("verifySpaceBackground")?.checked,animationsEnabled:!!document.getElementById("verifyAnimationsEnabled")?.checked,particlesEnabled:!!document.getElementById("verifyParticlesEnabled")?.checked,glowEnabled:!!document.getElementById("verifyGlowEnabled")?.checked,fadeEnabled:!!document.getElementById("verifyFadeEnabled")?.checked,hoverEnabled:!!document.getElementById("verifyHoverEnabled")?.checked,cursorGlowEnabled:!!document.getElementById("verifyCursorGlowEnabled")?.checked,buttonAnimationEnabled:!!document.getElementById("verifyButtonAnimationEnabled")?.checked,logoAnimationEnabled:!!document.getElementById("verifyLogoAnimationEnabled")?.checked,particleCount:Number(document.getElementById("verifyParticleCount")?.value||100),glowIntensity:Number(document.getElementById("verifyGlowIntensity")?.value||80),cardBlur:Number(document.getElementById("verifyCardBlur")?.value||18),cardOpacity:Number(document.getElementById("verifyCardOpacity")?.value||88),cardRadius:Number(document.getElementById("verifyCardRadius")?.value||24),cardShadow:Number(document.getElementById("verifyCardShadow")?.value||80),verifyButtonText:document.getElementById("verifyAppearanceButtonText")?.value.trim()||"Verificar con Discord",verifyButtonIcon:document.getElementById("verifyButtonIcon")?.value||"discord",verifyButtonSize:document.getElementById("verifyButtonSize")?.value||"large",verifyButtonRadius:Number(document.getElementById("verifyButtonRadius")?.value||14),verificationSound:!!document.getElementById("verifyVerificationSound")?.checked,errorSound:!!document.getElementById("verifyErrorSound")?.checked,openingSound:!!document.getElementById("verifyOpeningSound")?.checked,soundVolume:Number(document.getElementById("verifySoundVolume")?.value||50)}}function q(){const r=j(),l=document.getElementById("verifyAppearanceFrame");l?.contentWindow&&l.contentWindow.postMessage({type:"nebula-appearance-preview",appearance:r},window.location.origin)}document.getElementById("verifyAppearanceFrame")?.addEventListener("load",()=>{setTimeout(q,150)});function W(){const r=document.querySelector('input[name="verificationCardDesign"]:checked')?.value||"classic";document.querySelectorAll("[data-design-settings]").forEach(f=>{f.classList.toggle("active",f.dataset.designSettings===r)});const l={classic:["identity","palette","background","animations","card","button","sounds"],split:["identity","palette","background","button"],terminal:["identity","background","button"]},v=l[r]||l.classic;document.querySelectorAll("[data-appearance-section]").forEach(f=>{const L=f.dataset.appearanceSection;f.hidden=!v.includes(L)})}document.querySelectorAll('input[name="verificationCardDesign"]').forEach(r=>{r.addEventListener("change",()=>{W(),q()})}),W(),["verifyPageName","verifyPageDescription","verifyLogoUrl","verifyBackgroundUrl","verifyPrimaryColor","verifyPrimaryColorText","verifySecondaryColor","verifySecondaryColorText","verifyButtonColor","verifyButtonColorText","verifyTextColor","verifyTextColorText","verifyCardColor","verifyCardColorText","verifyBackgroundSolidColor","verifyBackgroundSolidColorText","verifyGradientStart","verifyGradientStartText","verifyGradientEnd","verifyGradientEndText","verifyBackgroundType","verifySpaceBackground","verifyParticlesEnabled","verifyAnimationsEnabled","verifyGlowEnabled","verifyFadeEnabled","verifyHoverEnabled","verifyCursorGlowEnabled","verifyButtonAnimationEnabled","verifyLogoAnimationEnabled","verifyParticleCount","verifyGlowIntensity","verifyCardBlur","verifyCardOpacity","verifyCardRadius","verifyCardShadow","verifyAppearanceButtonText","verifyButtonIcon","verifyButtonSize","verifyButtonRadius","verifyOpeningSound","verifyVerificationSound","verifyErrorSound","verifySoundVolume","verifySplitImageUrl","verifySplitImagePosition","verifySplitImageFit","verifySplitImageDarkness","verifySplitImageWidth","verifySplitShowImage","verifySplitShowDate","verifySplitShowAccess","verifyTerminalTitle","verifyTerminalPrefix","verifyTerminalStatusText","verifyTerminalBackgroundColor","verifyTerminalBackgroundColorText","verifyTerminalTextColor","verifyTerminalTextColorText","verifyTerminalAccentColor","verifyTerminalAccentColorText","verifyTerminalBorderColor","verifyTerminalBorderColorText","verifyTerminalShowCursor","verifyTerminalShowLines","verifyTerminalShowServer","verifyTerminalShowRole","verifyTerminalGlow","verifyTerminalRadius"].forEach(r=>{const l=document.getElementById(r);if(!l)return;const v=l.type==="checkbox"||l.tagName==="SELECT"?"change":"input";l.addEventListener(v,q)}),[["verifyPrimaryColor","verifyPrimaryColorText"],["verifySecondaryColor","verifySecondaryColorText"],["verifyButtonColor","verifyButtonColorText"],["verifyTextColor","verifyTextColorText"],["verifyCardColor","verifyCardColorText"],["verifyBackgroundSolidColor","verifyBackgroundSolidColorText"],["verifyGradientStart","verifyGradientStartText"],["verifyGradientEnd","verifyGradientEndText"],["verifyTerminalBackgroundColor","verifyTerminalBackgroundColorText"],["verifyTerminalTextColor","verifyTerminalTextColorText"],["verifyTerminalAccentColor","verifyTerminalAccentColorText"],["verifyTerminalBorderColor","verifyTerminalBorderColorText"]].forEach(([r,l])=>{const v=document.getElementById(r),f=document.getElementById(l);v?.addEventListener("input",()=>{f.value=v.value,q()}),f?.addEventListener("input",()=>{const L=f.value.trim();/^#[0-9a-f]{6}$/i.test(L)&&(v.value=L,q())})}),document.querySelectorAll(".appearance-range-control input[type='range']").forEach(r=>{const l=document.getElementById(`${r.id}Value`),v=()=>{l&&(l.textContent=`${r.value}${r.dataset.suffix||""}`),q()};r.addEventListener("input",v),v()}),q(),d("saveVerification")?.addEventListener("click",async()=>{const r=d("saveVerification"),l=Ue();if(!l.verificationChannelId){ae("Falta el canal","Seleccioná el canal de verificación.");return}if(!l.verifiedRoleId){ae("Falta el rol","Seleccioná el rol que recibirá el usuario.");return}r.disabled=!0,r.textContent="Guardando...";try{const v=await fetch(`${R}/api/servers/${a.id}/verification`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(l)}),f=await v.json();if(!v.ok||!f.success)throw new Error(f.message||"No se pudo guardar.");ae("Configuración guardada","Todos los cambios quedaron guardados.")}catch(v){ae("Error al guardar",v.message)}finally{r.disabled=!1,r.textContent="Guardar configuración"}}),d("sendVerificationPanel")?.addEventListener("click",async()=>{const r=d("sendVerificationPanel");d("saveVerification").click(),await new Promise(v=>setTimeout(v,700)),r.disabled=!0,r.textContent="Enviando...";try{const v=await fetch(`${R}/api/servers/${a.id}/verification/send`,{method:"POST"}),f=await v.json();if(!v.ok||!f.success)throw new Error(f.message||"No se pudo enviar el panel.");ae("Panel enviado","Revisá el canal de verificación en Discord.")}catch(v){ae("Error al enviar",v.message)}finally{r.disabled=!1,r.textContent="Enviar panel a Discord"}})}async function Mi(a){P.innerHTML=`
    <div class="dynamic-page">
      <div class="servers-loading">
        <div class="loading-spinner"></div>
        <strong>Cargando configuración de bienvenida...</strong>
      </div>
    </div>
  `;try{const[e,t]=await Promise.all([fetch(`${R}/api/servers/${a.id}/text-channels`),fetch(`${R}/api/servers/${a.id}/welcome`)]),i=await e.json(),n=await t.json();if(!i.success||!n.success)throw new Error("No se pudo cargar la configuración");Oi(a,i.data,n.data)}catch(e){P.innerHTML=`
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
    `,document.getElementById("backToServerPanel")?.addEventListener("click",()=>{Me(a.id)})}}function Oi(a,e,t){const i=e.map(b=>`
    <option
      value="${b.id}"
      ${b.id===t.channelId?"selected":""}
    >
      # ${b.name}
    </option>
  `).join("");P.innerHTML=`
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
              value="${S(t.title)}"
            >
          </label>

          <label class="welcome-field">
            <span>MENSAJE</span>
            <textarea
              id="welcomeMessage"
              maxlength="2000"
              rows="7"
            >${I(t.message)}</textarea>
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
      value="${S(t.dmTitle)}"
    >
  </label>

  <label class="welcome-field">
    <span>MENSAJE PRIVADO</span>

    <textarea
      id="welcomeDmMessage"
      maxlength="2000"
      rows="7"
    >${I(t.dmMessage)}</textarea>
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
  `;const n=document.getElementById("welcomeEnabled"),c=document.getElementById("welcomeChannel"),s=document.getElementById("welcomeTitle"),p=document.getElementById("welcomeMessage"),m=document.getElementById("welcomeColor"),D=document.getElementById("welcomeColorText"),$=document.getElementById("welcomeShowAvatar"),h=document.getElementById("welcomeDmEnabled"),M=document.getElementById("welcomeDmFields"),B=document.getElementById("welcomeDmTitle"),Ge=document.getElementById("welcomeDmMessage"),d=document.getElementById("welcomeDmColor"),ye=document.getElementById("welcomeDmColorText"),ke=document.getElementById("welcomeDmShowAvatar"),ne=document.getElementById("welcomeDmPreviewSection"),T=Pt?.name||"Nebula Bot",te=_||{},Te=te.displayName||te.globalName||te.username||"Usuario",Le=te.avatar||"",Be=document.getElementById("welcomePreviewUserAvatar"),Ee=document.getElementById("welcomeDmPreviewAvatar"),Oe=Le?`
      <img
        src="${Le}"
        alt="${Te}"
      >
    `:`
      <span>
        ${Je(Te)}
      </span>
    `;Be&&(Be.innerHTML=Oe),Ee&&(Ee.innerHTML=Oe);const _e=Pt?.avatar||"",De=document.getElementById("welcomePreviewBotName"),ae=document.getElementById("welcomeDmPreviewBotName"),Ve=document.getElementById("welcomePreviewBotAvatar"),fe=document.getElementById("welcomeDmPreviewBotAvatar");De&&(De.textContent=T),ae&&(ae.textContent=T);const se=_e?`
      <img
        src="${_e}"
        alt="${T}"
      >
    `:T.charAt(0).toUpperCase();Ve&&(Ve.innerHTML=se),fe&&(fe.innerHTML=se);function H(){const b=rt(s.value,a),A=rt(p.value,a);document.getElementById("welcomePreviewTitle").textContent=b,document.getElementById("welcomePreviewMessage").textContent=A,document.getElementById("welcomePreviewEmbed").style.borderLeftColor=m.value;const x=document.getElementById("welcomePreviewUserAvatar");x&&(x.style.display=$.checked?"block":"none");const O=rt(B.value,a),o=rt(Ge.value,a);document.getElementById("welcomeDmPreviewTitle").textContent=O,document.getElementById("welcomeDmPreviewMessage").textContent=o,document.getElementById("welcomeDmPreviewEmbed").style.borderLeftColor=d.value;const u=document.getElementById("welcomeDmPreviewAvatar");u&&(u.style.display=ke.checked?"block":"none")}m.addEventListener("input",()=>{D.value=m.value,H()}),D.addEventListener("input",()=>{/^#[0-9A-F]{6}$/i.test(D.value)&&(m.value=D.value,H())}),s.addEventListener("input",H),p.addEventListener("input",H),h.addEventListener("change",()=>{M.classList.toggle("visible",h.checked),ne.classList.toggle("visible",h.checked),H()}),$.addEventListener("change",H),ke.addEventListener("change",H),B.addEventListener("input",H),Ge.addEventListener("input",H),d.addEventListener("input",()=>{ye.value=d.value,H()}),ye.addEventListener("input",()=>{/^#[0-9A-F]{6}$/i.test(ye.value)&&(d.value=ye.value,H())}),document.querySelectorAll("[data-variable]").forEach(b=>{b.addEventListener("click",()=>{const A=b.dataset.variable,x=p.selectionStart,O=p.selectionEnd;p.value=p.value.slice(0,x)+A+p.value.slice(O),p.focus(),p.selectionStart=p.selectionEnd=x+A.length,H()})});const Z=document.getElementById("welcomeVariablesModal"),ge=document.getElementById("welcomeVariablesSearch"),pe=document.getElementById("welcomeVariablesModalList"),Ue=document.getElementById("welcomeVariablesModalEmpty"),oe=document.querySelectorAll("[data-welcome-variable-category]");let xe="user";const qe=[{key:"{user}",label:"Nombre corto del usuario",category:"user"},{key:"{mention}",label:"Mención del usuario",category:"user"},{key:"{username}",label:"Nombre de usuario",category:"user"},{key:"{displayname}",label:"Nombre visible",category:"user"},{key:"{userid}",label:"ID del usuario",category:"user"},{key:"{joindate}",label:"Fecha de ingreso",category:"user"},{key:"{server}",label:"Nombre del servidor",category:"server"},{key:"{serverid}",label:"ID del servidor",category:"server"},{key:"{members}",label:"Cantidad de miembros",category:"server"},{key:"{membercount}",label:"Cantidad de miembros",category:"server"},{key:"{date}",label:"Fecha actual",category:"date"},{key:"{time}",label:"Hora actual",category:"date"}];function we(){if(!pe)return;const b=String(ge?.value||"").trim().toLowerCase(),A=qe.filter(O=>{const o=O.category===xe,u=`${O.key} ${O.label}`.toLowerCase(),y=!b||u.includes(b);return o&&y});pe.innerHTML=A.map(O=>`
          <button
            class="verify-variable-button"
            data-copy-welcome-variable="${O.key}"
            type="button"
          >
            <code>
              ${O.key}
            </code>

            <span>
              ${O.label}
            </span>

            <b>
              Copiar
            </b>
          </button>
        `).join("");const x=A.length>0;Ue&&(Ue.hidden=x,Ue.classList.toggle("visible",!x))}function je(b=null){Z&&(Z.classList.add("open"),Z.setAttribute("aria-hidden","false"),document.body.classList.add("variables-modal-open"),xe="user",ge&&(ge.value=""),oe.forEach(A=>{A.classList.toggle("active",A.dataset.welcomeVariableCategory==="user")}),we(),setTimeout(()=>{ge?.focus()},100))}function Ce(){Z&&(Z.classList.remove("open"),Z.setAttribute("aria-hidden","true"),document.body.classList.remove("variables-modal-open"))}document.querySelector("[data-open-welcome-variables]")?.addEventListener("click",b=>{b.preventDefault(),b.stopPropagation(),je(p)}),document.querySelectorAll("[data-close-welcome-variables]").forEach(b=>{b.addEventListener("click",A=>{A.preventDefault(),A.stopPropagation(),Ce()})}),oe.forEach(b=>{b.addEventListener("click",A=>{A.preventDefault(),A.stopPropagation(),xe=b.dataset.welcomeVariableCategory||"user",oe.forEach(x=>{x.classList.toggle("active",x===b)}),we()})}),ge?.addEventListener("input",we),pe?.addEventListener("click",async b=>{const A=b.target.closest("[data-copy-welcome-variable]");if(!A)return;b.preventDefault(),b.stopPropagation();const x=A.dataset.copyWelcomeVariable;if(x)try{await navigator.clipboard.writeText(x);const O=A.querySelector("b")?.textContent,o=A.querySelector("b");o&&(o.textContent="Copiado ✓",setTimeout(()=>{o.textContent=O||"Copiar"},1200))}catch(O){console.error("No se pudo copiar la variable:",O)}}),Z?.addEventListener("wheel",b=>{b.target.closest(".variables-categories, .variables-results")||b.preventDefault()},{passive:!1}),document.addEventListener("keydown",b=>{b.key==="Escape"&&Z?.classList.contains("open")&&Ce()}),we(),document.getElementById("backToServerPanel").addEventListener("click",()=>{Me(a.id)});async function Se(){const b=document.getElementById("saveWelcome");b.disabled=!0,b.textContent="Guardando...";try{const A=await fetch(`${R}/api/servers/${a.id}/welcome`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({enabled:n.checked,channelId:c.value,title:s.value,message:p.value,color:m.value,showAvatar:$.checked,dmEnabled:h.checked,dmTitle:B.value,dmMessage:Ge.value,dmColor:d.value,dmShowAvatar:ke.checked})}),x=await A.json();if(!A.ok||!x.success)throw new Error(x.message||"No se pudo guardar");return ee.querySelector("strong").textContent="Bienvenida guardada",ee.querySelector("p").textContent="Todos los cambios quedaron guardados.",Ie(),!0}catch(A){return ee.querySelector("strong").textContent="Error al guardar",ee.querySelector("p").textContent=A.message,Ie(),!1}finally{b.disabled=!1,b.textContent="Guardar configuración"}}document.getElementById("saveWelcome").addEventListener("click",Se),document.getElementById("testWelcome").addEventListener("click",async()=>{const b=document.getElementById("testWelcome");b.disabled=!0,b.textContent="Preparando prueba...";try{if(!await Se())return;b.textContent="Enviando...";const x=await fetch(`${R}/api/servers/${a.id}/welcome/test`,{method:"POST"}),O=await x.json();if(!x.ok||!O.success)throw new Error(O.message||"No se pudo enviar la prueba");ee.querySelector("strong").textContent="Prueba enviada",ee.querySelector("p").textContent="Revisá el canal de bienvenida en Discord.",Ie()}catch(A){ee.querySelector("strong").textContent="Error en la prueba",ee.querySelector("p").textContent=A.message,Ie()}finally{b.disabled=!1,b.textContent="Enviar mensaje de prueba"}}),H()}function rt(a,e){const t=new Date,i=_||{},n=i.username||"usuario",c=i.displayName||i.globalName||n,s=i.id||"000000000000000000";return String(a).replaceAll("{user}",n).replaceAll("{mention}",`@${n}`).replaceAll("{username}",n).replaceAll("{displayname}",c).replaceAll("{userid}",s).replaceAll("{server}",e.name).replaceAll("{serverid}",e.id).replaceAll("{members}",Number(e.members||0).toLocaleString("es-AR")).replaceAll("{membercount}",Number(e.members||0).toLocaleString("es-AR")).replaceAll("{joindate}",t.toLocaleDateString("es-AR")).replaceAll("{date}",t.toLocaleDateString("es-AR")).replaceAll("{time}",t.toLocaleTimeString("es-AR",{hour:"2-digit",minute:"2-digit"}))}function I(a){return String(a).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;")}function S(a){return I(a).replaceAll('"',"&quot;").replaceAll("'","&#039;")}Ot();

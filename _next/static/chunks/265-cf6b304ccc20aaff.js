(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[265],{6365:function(A){A.exports=function(A){function t(g){if(r[g])return r[g].exports;var l=r[g]={exports:{},id:g,loaded:!1};return A[g].call(l.exports,l,l.exports,t),l.loaded=!0,l.exports}var r={};return t.m=A,t.c=r,t.p="dist/",t(0)}([function(A,r,g){"use strict";function o(A){return A&&A.__esModule?A:{default:A}}var l=Object.assign||function(A){for(var r=1;r<arguments.length;r++){var g=arguments[r];for(var l in g)Object.prototype.hasOwnProperty.call(g,l)&&(A[l]=g[l])}return A},h=(o(g(1)),g(6)),E=o(h),b=o(g(7)),p=o(g(8)),Q=o(g(9)),w=o(g(10)),C=o(g(11)),B=o(g(14)),I=[],y=!1,x={offset:120,delay:0,easing:"ease",duration:400,disable:!1,once:!1,startEvent:"DOMContentLoaded",throttleDelay:99,debounceDelay:50,disableMutationObserver:!1},j=function(){var A=arguments.length>0&&void 0!==arguments[0]&&arguments[0];if(A&&(y=!0),y)return I=(0,C.default)(I,x),(0,w.default)(I,x.once),I},O=function(){I=(0,B.default)(),j()},M=function(){I.forEach(function(A,r){A.node.removeAttribute("data-aos"),A.node.removeAttribute("data-aos-easing"),A.node.removeAttribute("data-aos-duration"),A.node.removeAttribute("data-aos-delay")})};A.exports={init:function(A){x=l(x,A),I=(0,B.default)();var r,g=document.all&&!window.atob;return!0===(r=x.disable)||"mobile"===r&&Q.default.mobile()||"phone"===r&&Q.default.phone()||"tablet"===r&&Q.default.tablet()||"function"==typeof r&&!0===r()||g?M():(x.disableMutationObserver||p.default.isSupported()||(console.info('\n      aos: MutationObserver is not supported on this browser,\n      code mutations observing has been disabled.\n      You may have to call "refreshHard()" by yourself.\n    '),x.disableMutationObserver=!0),document.querySelector("body").setAttribute("data-aos-easing",x.easing),document.querySelector("body").setAttribute("data-aos-duration",x.duration),document.querySelector("body").setAttribute("data-aos-delay",x.delay),"DOMContentLoaded"===x.startEvent&&["complete","interactive"].indexOf(document.readyState)>-1?j(!0):"load"===x.startEvent?window.addEventListener(x.startEvent,function(){j(!0)}):document.addEventListener(x.startEvent,function(){j(!0)}),window.addEventListener("resize",(0,b.default)(j,x.debounceDelay,!0)),window.addEventListener("orientationchange",(0,b.default)(j,x.debounceDelay,!0)),window.addEventListener("scroll",(0,E.default)(function(){(0,w.default)(I,x.once)},x.throttleDelay)),x.disableMutationObserver||p.default.ready("[data-aos]",O),I)},refresh:j,refreshHard:O}},function(A,r){},,,,,function(A,r){(function(r){"use strict";function i(A){var r=void 0===A?"undefined":g(A);return!!A&&("object"==r||"function"==r)}function u(A){if("number"==typeof A)return A;if("symbol"==(void 0===(r=A)?"undefined":g(r))||r&&"object"==(void 0===r?"undefined":g(r))&&x.call(r)==E)return h;if(i(A)){var r,l="function"==typeof A.valueOf?A.valueOf():A;A=i(l)?l+"":l}if("string"!=typeof A)return 0===A?A:+A;var B=Q.test(A=A.replace(b,""));return B||w.test(A)?C(A.slice(2),B?2:8):p.test(A)?h:+A}var g="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(A){return typeof A}:function(A){return A&&"function"==typeof Symbol&&A.constructor===Symbol&&A!==Symbol.prototype?"symbol":typeof A},l="Expected a function",h=NaN,E="[object Symbol]",b=/^\s+|\s+$/g,p=/^[-+]0x[0-9a-f]+$/i,Q=/^0b[01]+$/i,w=/^0o[0-7]+$/i,C=parseInt,B="object"==(void 0===r?"undefined":g(r))&&r&&r.Object===Object&&r,I="object"==("undefined"==typeof self?"undefined":g(self))&&self&&self.Object===Object&&self,y=B||I||Function("return this")(),x=Object.prototype.toString,v=Math.max,D=Math.min,O=function(){return y.Date.now()};A.exports=function(A,r,g){var h=!0,E=!0;if("function"!=typeof A)throw TypeError(l);return i(g)&&(h="leading"in g?!!g.leading:h,E="trailing"in g?!!g.trailing:E),function(A,r,g){function o(r){var g=h,l=E;return h=E=void 0,C=r,p=A.apply(l,g)}function c(A){var g=A-w,l=A-C;return void 0===w||g>=r||g<0||I&&l>=b}function f(){var A,g,l,h=O();return c(h)?d(h):void(Q=setTimeout(f,(A=h-w,g=h-C,l=r-A,I?D(l,b-g):l)))}function d(A){return Q=void 0,y&&h?o(A):(h=E=void 0,p)}function m(){var A,g=O(),l=c(g);if(h=arguments,E=this,w=g,l){if(void 0===Q)return C=A=w,Q=setTimeout(f,r),B?o(A):p;if(I)return Q=setTimeout(f,r),o(w)}return void 0===Q&&(Q=setTimeout(f,r)),p}var h,E,b,p,Q,w,C=0,B=!1,I=!1,y=!0;if("function"!=typeof A)throw TypeError(l);return r=u(r)||0,i(g)&&(B=!!g.leading,b=(I="maxWait"in g)?v(u(g.maxWait)||0,r):b,y="trailing"in g?!!g.trailing:y),m.cancel=function(){void 0!==Q&&clearTimeout(Q),C=0,h=w=E=Q=void 0},m.flush=function(){return void 0===Q?p:d(O())},m}(A,r,{leading:h,maxWait:r,trailing:E})}}).call(r,function(){return this}())},function(A,r){(function(r){"use strict";function o(A){var r=void 0===A?"undefined":g(A);return!!A&&("object"==r||"function"==r)}function a(A){if("number"==typeof A)return A;if("symbol"==(void 0===(r=A)?"undefined":g(r))||r&&"object"==(void 0===r?"undefined":g(r))&&y.call(r)==h)return l;if(o(A)){var r,C="function"==typeof A.valueOf?A.valueOf():A;A=o(C)?C+"":C}if("string"!=typeof A)return 0===A?A:+A;var B=p.test(A=A.replace(E,""));return B||Q.test(A)?w(A.slice(2),B?2:8):b.test(A)?l:+A}var g="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(A){return typeof A}:function(A){return A&&"function"==typeof Symbol&&A.constructor===Symbol&&A!==Symbol.prototype?"symbol":typeof A},l=NaN,h="[object Symbol]",E=/^\s+|\s+$/g,b=/^[-+]0x[0-9a-f]+$/i,p=/^0b[01]+$/i,Q=/^0o[0-7]+$/i,w=parseInt,C="object"==(void 0===r?"undefined":g(r))&&r&&r.Object===Object&&r,B="object"==("undefined"==typeof self?"undefined":g(self))&&self&&self.Object===Object&&self,I=C||B||Function("return this")(),y=Object.prototype.toString,x=Math.max,v=Math.min,j=function(){return I.Date.now()};A.exports=function(A,r,g){function i(r){var g=l,E=h;return l=h=void 0,w=r,b=A.apply(E,g)}function s(A){var g=A-Q,l=A-w;return void 0===Q||g>=r||g<0||B&&l>=E}function f(){var A,g,l,h=j();return s(h)?d(h):void(p=setTimeout(f,(A=h-Q,g=h-w,l=r-A,B?v(l,E-g):l)))}function d(A){return p=void 0,I&&l?i(A):(l=h=void 0,b)}function m(){var A,g=j(),E=s(g);if(l=arguments,h=this,Q=g,E){if(void 0===p)return w=A=Q,p=setTimeout(f,r),C?i(A):b;if(B)return p=setTimeout(f,r),i(Q)}return void 0===p&&(p=setTimeout(f,r)),b}var l,h,E,b,p,Q,w=0,C=!1,B=!1,I=!0;if("function"!=typeof A)throw TypeError("Expected a function");return r=a(r)||0,o(g)&&(C=!!g.leading,E=(B="maxWait"in g)?x(a(g.maxWait)||0,r):E,I="trailing"in g?!!g.trailing:I),m.cancel=function(){void 0!==p&&clearTimeout(p),w=0,l=Q=h=p=void 0},m.flush=function(){return void 0===p?b:d(j())},m}}).call(r,function(){return this}())},function(A,r){"use strict";function o(){return window.MutationObserver||window.WebKitMutationObserver||window.MozMutationObserver}function a(A){A&&A.forEach(function(A){var r=Array.prototype.slice.call(A.addedNodes),g=Array.prototype.slice.call(A.removedNodes);if(function n(A){var r=void 0,g=void 0;for(r=0;r<A.length;r+=1)if((g=A[r]).dataset&&g.dataset.aos||g.children&&n(g.children))return!0;return!1}(r.concat(g)))return u()})}Object.defineProperty(r,"__esModule",{value:!0});var u=function(){};r.default={isSupported:function(){return!!o()},ready:function(A,r){var g=window.document,l=new(o())(a);u=r,l.observe(g.documentElement,{childList:!0,subtree:!0,removedNodes:!0})}}},function(A,r){"use strict";function o(){return navigator.userAgent||navigator.vendor||window.opera||""}Object.defineProperty(r,"__esModule",{value:!0});var g=function(){function e(A,r){for(var g=0;g<r.length;g++){var l=r[g];l.enumerable=l.enumerable||!1,l.configurable=!0,"value"in l&&(l.writable=!0),Object.defineProperty(A,l.key,l)}}return function(A,r,g){return r&&e(A.prototype,r),g&&e(A,g),A}}(),l=/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i,h=/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i,E=/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i,b=/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i,p=function(){function e(){!function(A,r){if(!(A instanceof r))throw TypeError("Cannot call a class as a function")}(this,e)}return g(e,[{key:"phone",value:function(){var A=o();return!(!l.test(A)&&!h.test(A.substr(0,4)))}},{key:"mobile",value:function(){var A=o();return!(!E.test(A)&&!b.test(A.substr(0,4)))}},{key:"tablet",value:function(){return this.mobile()&&!this.phone()}}]),e}();r.default=new p},function(A,r){"use strict";Object.defineProperty(r,"__esModule",{value:!0});var n=function(A,r,g){var l=A.node.getAttribute("data-aos-once");r>A.position?A.node.classList.add("aos-animate"):void 0===l||"false"!==l&&(g||"true"===l)||A.node.classList.remove("aos-animate")};r.default=function(A,r){var g=window.pageYOffset,l=window.innerHeight;A.forEach(function(A,h){n(A,l+g,r)})}},function(A,r,g){"use strict";Object.defineProperty(r,"__esModule",{value:!0});var l,h=(l=g(12))&&l.__esModule?l:{default:l};r.default=function(A,r){return A.forEach(function(A,g){A.node.classList.add("aos-init"),A.position=(0,h.default)(A.node,r.offset)}),A}},function(A,r,g){"use strict";Object.defineProperty(r,"__esModule",{value:!0});var l,h=(l=g(13))&&l.__esModule?l:{default:l};r.default=function(A,r){var g=0,l=0,E=window.innerHeight,b={offset:A.getAttribute("data-aos-offset"),anchor:A.getAttribute("data-aos-anchor"),anchorPlacement:A.getAttribute("data-aos-anchor-placement")};switch(b.offset&&!isNaN(b.offset)&&(l=parseInt(b.offset)),b.anchor&&document.querySelectorAll(b.anchor)&&(A=document.querySelectorAll(b.anchor)[0]),g=(0,h.default)(A).top,b.anchorPlacement){case"top-bottom":break;case"center-bottom":g+=A.offsetHeight/2;break;case"bottom-bottom":g+=A.offsetHeight;break;case"top-center":g+=E/2;break;case"bottom-center":g+=E/2+A.offsetHeight;break;case"center-center":g+=E/2+A.offsetHeight/2;break;case"top-top":g+=E;break;case"bottom-top":g+=A.offsetHeight+E;break;case"center-top":g+=A.offsetHeight/2+E}return b.anchorPlacement||b.offset||isNaN(r)||(l=r),g+l}},function(A,r){"use strict";Object.defineProperty(r,"__esModule",{value:!0}),r.default=function(A){for(var r=0,g=0;A&&!isNaN(A.offsetLeft)&&!isNaN(A.offsetTop);)r+=A.offsetLeft-("BODY"!=A.tagName?A.scrollLeft:0),g+=A.offsetTop-("BODY"!=A.tagName?A.scrollTop:0),A=A.offsetParent;return{top:g,left:r}}},function(A,r){"use strict";Object.defineProperty(r,"__esModule",{value:!0}),r.default=function(A){return A=A||document.querySelectorAll("[data-aos]"),Array.prototype.map.call(A,function(A){return{node:A}})}}])},1265:function(A,r,g){Promise.resolve().then(g.bind(g,3403))},3403:function(A,r,g){"use strict";g.r(r),g.d(r,{default:function(){return L}});var l=g(7437),h=g(6302),E=g(6691),b=g.n(E),p=g(2265),Q=g(1704),w=g(2549),C=g(9311);let B=Q.fC,I=Q.xz,y=Q.h_,x=p.forwardRef((A,r)=>{let{className:g,...h}=A;return(0,l.jsx)(Q.aV,{ref:r,className:(0,C.cn)("fixed inset-0 z-50 bg-background/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",g),...h})});x.displayName=Q.aV.displayName;let v=p.forwardRef((A,r)=>{let{className:g,children:h,...E}=A;return(0,l.jsxs)(y,{children:[(0,l.jsx)(x,{}),(0,l.jsxs)(Q.VY,{ref:r,className:(0,C.cn)("fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg md:w-full",g),...E,children:[h,(0,l.jsxs)(Q.x8,{className:"absolute right-2 top-2 rounded-sm opacity-70 transition-opacity hover:opacity-100 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground",children:[(0,l.jsx)(w.Z,{className:"h-6 w-6"}),(0,l.jsx)("span",{className:"sr-only",children:"Close"})]})]})]})});v.displayName=Q.VY.displayName;let D=p.forwardRef((A,r)=>{let{className:g,...h}=A;return(0,l.jsx)(Q.Dx,{ref:r,className:(0,C.cn)("text-lg font-semibold leading-none tracking-tight",g),...h})});D.displayName=Q.Dx.displayName;let k=p.forwardRef((A,r)=>{let{className:g,...h}=A;return(0,l.jsx)(Q.dk,{ref:r,className:(0,C.cn)("text-sm text-muted-foreground",g),...h})});k.displayName=Q.dk.displayName;var P=g(6365),S=g.n(P),coach_image=A=>{let{img:r,delay:g}=A;return p.useEffect(()=>{S().init()},[]),(0,l.jsxs)(B,{children:[(0,l.jsx)(b(),{src:r,alt:"coach image",height:300,width:400,className:"block h-[300px] w-[400px] transition-all duration-500 hover:scale-110 md:hidden","data-aos":"fade-up","data-aos-anchor-placement":"center-bottom","data-aos-once":!0,priority:!0,placeholder:"blur"}),(0,l.jsx)(I,{asChild:!0,className:"hidden md:block",children:(0,l.jsx)("button",{children:(0,l.jsx)(b(),{src:r,alt:"coach image",height:300,width:400,className:"h-[300px] w-[400px] transition-all duration-500 hover:scale-110","data-aos":"flip-up","data-aos-delay":g,"data-aos-once":!0,priority:!0,placeholder:"blur"})})}),(0,l.jsx)(v,{className:"flex max-h-[750px] max-w-[970px] items-center justify-center data-[state=open]:duration-500 max-md:hidden ",children:(0,l.jsx)(b(),{src:r,alt:"coach image",height:200,width:300,className:"h-auto w-[90%] md:h-[700px] md:w-[900px]",priority:!0})})]})},F=g(7256),U=g(6061);let Y=(0,U.j)("inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",{variants:{variant:{default:"bg-primary text-primary-foreground hover:bg-primary/90",destructive:"bg-destructive text-destructive-foreground hover:bg-destructive/90",outline:"border border-input bg-background hover:bg-accent hover:text-accent-foreground",secondary:"bg-secondary text-secondary-foreground hover:bg-secondary/80",ghost:"hover:bg-accent hover:text-accent-foreground",link:"text-primary underline-offset-4 hover:underline"},size:{default:"h-10 px-4 py-2",sm:"h-9 rounded-md px-3",lg:"h-11 rounded-md px-8",icon:"h-10 w-10"}},defaultVariants:{variant:"default",size:"default"}}),_=p.forwardRef((A,r)=>{let{className:g,variant:h,size:E,asChild:b=!1,...p}=A,Q=b?F.g7:"button";return(0,l.jsx)(Q,{className:(0,C.cn)(Y({variant:h,size:E,className:g})),ref:r,...p})});_.displayName="Button";var G=g(2764),L=p.memo(()=>{let[A,r]=p.useState([]),[g,E]=p.useState([]),[b]=p.useState(9),[Q,w]=p.useState(),[C,B]=p.useState(1),[I,y]=p.useState(0),x=p.useCallback(function(){let A=arguments.length>0&&void 0!==arguments[0]?arguments[0]:12,r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:1;return(r-1)*A},[]),v=p.useCallback(function(){let A=arguments.length>0&&void 0!==arguments[0]?arguments[0]:12,r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:1,g=arguments.length>2&&void 0!==arguments[2]?arguments[2]:50,l=Math.ceil(g/A),h=Array.from({length:l},(A,r)=>r+1),E=r<1?1:r>l?l:r;return{pages:h,totalPage:l,currentPage:E,hasPrevPage:E-1>=1,hasNextPage:E+1<=l}},[]);return p.useEffect(()=>{S().init()},[]),p.useEffect(()=>{r(h.l.slice(I,I+b))},[I,b]),p.useEffect(()=>{E(r=>r.concat(A))},[A]),p.useEffect(()=>{y(x(b,C)),w(v(b,C,h.l.length))},[b,C,x,v]),(0,l.jsxs)("div",{className:"flex h-auto flex-col items-center bg-black p-4 text-white",children:[(0,l.jsx)("div",{className:"max-container flex flex-wrap justify-evenly gap-4 md:grid md:grid-cols-3",children:g.map((A,r)=>{let g=[100,200,300,400,500,600,700,800,900],h=g[r%g.length];return(0,l.jsx)(coach_image,{img:A.img,delay:h},A.key)})}),(0,l.jsx)("div",{className:"mt-10",children:(0,l.jsx)(_,{className:"h-20 w-20 rounded-full bg-[#E81E26] text-sm font-extrabold tracking-widest ring-4 ring-transparent transition-all duration-300 hover:bg-[#E81E26] hover:ring-[#E81E26]/40",disabled:!(null==Q?void 0:Q.hasNextPage),onClick:()=>B(C+1),"data-aos":"fade-up","data-aos-duration":700,"data-aos-anchor-placement":"center-bottom","data-aos-once":!0,children:(null==Q?void 0:Q.hasNextPage)?"載入更多":"沒有更多"})}),(0,l.jsx)(G.Z,{})]})})},2764:function(A,r,g){"use strict";g.d(r,{Z:function(){return scorllToTop}});var l=g(7437),h=g(2898);let E=(0,h.Z)("ArrowUpFromLine",[["path",{d:"m18 9-6-6-6 6",key:"kcunyi"}],["path",{d:"M12 3v14",key:"7cf3v8"}],["path",{d:"M5 21h14",key:"11awu3"}]]);var scorllToTop=()=>(0,l.jsx)("button",{className:"sticky bottom-5 left-[95%] flex items-center justify-center rounded-full bg-[#FFD531] p-3",onClick:()=>window.scrollTo({top:0,behavior:"smooth"}),children:(0,l.jsx)(E,{className:"h-8 w-8"})})},6302:function(A,r,g){"use strict";g.d(r,{l:function(){return h},q:function(){return l}});let l=[{href:"/news",key:"news",label:"最新消息"},{href:"/about",key:"about",label:"關於我們"},{href:"/class",key:"class",label:"專心練課程"},{href:"/coach",key:"coach",label:"教練陣容"}],h=[{img:{src:"/focus_space_official_website/_next/static/media/1.9af57d76.jpg",height:1077,width:1523,blurDataURL:"data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAoKCgoKCgsMDAsPEA4QDxYUExMUFiIYGhgaGCIzICUgICUgMy03LCksNy1RQDg4QFFeT0pPXnFlZXGPiI+7u/sBCgoKCgoKCwwMCw8QDhAPFhQTExQWIhgaGBoYIjMgJSAgJSAzLTcsKSw3LVFAODhAUV5PSk9ecWVlcY+Ij7u7+//CABEIAAYACAMBIgACEQEDEQH/xAAoAAEBAAAAAAAAAAAAAAAAAAAAAwEBAQAAAAAAAAAAAAAAAAAABQb/2gAMAwEAAhADEAAAAICQU//EABwQAAICAgMAAAAAAAAAAAAAAAECAwQREwAGMf/aAAgBAQABPwC71qrHplaZjteOuwCqPWxkc//EABsRAAICAwEAAAAAAAAAAAAAAAECAwQABRGR/9oACAECAQE/AH2N0Q12E7Asp77n/8QAGREAAwADAAAAAAAAAAAAAAAAAQIDABIh/9oACAEDAQE/AFhIs40HDn//2Q==",blurWidth:8,blurHeight:6},key:"coach1"},{img:{src:"/focus_space_official_website/_next/static/media/2.8fefb353.jpg",height:1077,width:1523,blurDataURL:"data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAoKCgoKCgsMDAsPEA4QDxYUExMUFiIYGhgaGCIzICUgICUgMy03LCksNy1RQDg4QFFeT0pPXnFlZXGPiI+7u/sBCgoKCgoKCwwMCw8QDhAPFhQTExQWIhgaGBoYIjMgJSAgJSAzLTcsKSw3LVFAODhAUV5PSk9ecWVlcY+Ij7u7+//CABEIAAYACAMBIgACEQEDEQH/xAAoAAEBAAAAAAAAAAAAAAAAAAAAAQEBAQAAAAAAAAAAAAAAAAAABQb/2gAMAwEAAhADEAAAAIItb//EAB4QAAIBAwUAAAAAAAAAAAAAAAISAwABBAYTMkJR/9oACAEBAAE/AC0lEG0RZhG7QG0Ycb+L2r//xAAaEQACAgMAAAAAAAAAAAAAAAABAgMEAAWS/9oACAECAQE/AJtleENVhYYFkJPWf//EABoRAAICAwAAAAAAAAAAAAAAAAIDAAERIjH/2gAIAQMBAT8AFCclpXZ//9k=",blurWidth:8,blurHeight:6},key:"coach2"},{img:{src:"/focus_space_official_website/_next/static/media/3.a17c2040.jpg",height:1077,width:1523,blurDataURL:"data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAoKCgoKCgsMDAsPEA4QDxYUExMUFiIYGhgaGCIzICUgICUgMy03LCksNy1RQDg4QFFeT0pPXnFlZXGPiI+7u/sBCgoKCgoKCwwMCw8QDhAPFhQTExQWIhgaGBoYIjMgJSAgJSAzLTcsKSw3LVFAODhAUV5PSk9ecWVlcY+Ij7u7+//CABEIAAYACAMBIgACEQEDEQH/xAAoAAEBAAAAAAAAAAAAAAAAAAAAAgEBAQAAAAAAAAAAAAAAAAAABQb/2gAMAwEAAhADEAAAAIEUt//EAB4QAAIBAwUAAAAAAAAAAAAAAAIDBAABBhMhIiQx/9oACAEBAAE/ADxWHEsLHy3t1+sXAPD2r//EABsRAAICAwEAAAAAAAAAAAAAAAECAwQABRFx/9oACAECAQE/AJtleEFVhYYF0Jbnuf/EABkRAAMAAwAAAAAAAAAAAAAAAAECAwASIf/aAAgBAwEBPwBYSLONBw5//9k=",blurWidth:8,blurHeight:6},key:"coach3"},{img:{src:"/focus_space_official_website/_next/static/media/4.4bb89b2f.jpg",height:1077,width:1523,blurDataURL:"data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAoKCgoKCgsMDAsPEA4QDxYUExMUFiIYGhgaGCIzICUgICUgMy03LCksNy1RQDg4QFFeT0pPXnFlZXGPiI+7u/sBCgoKCgoKCwwMCw8QDhAPFhQTExQWIhgaGBoYIjMgJSAgJSAzLTcsKSw3LVFAODhAUV5PSk9ecWVlcY+Ij7u7+//CABEIAAYACAMBIgACEQEDEQH/xAAoAAEBAAAAAAAAAAAAAAAAAAAAAgEBAQAAAAAAAAAAAAAAAAAABQb/2gAMAwEAAhADEAAAAKEkr//EAB0QAAIBBAMAAAAAAAAAAAAAAAIDAQAEESEGQXL/2gAIAQEAAT8AuOM2UCthsneEHgB3B9+q/8QAGhEAAQUBAAAAAAAAAAAAAAAAAQACBBETkf/aAAgBAgEBPwAz5mEd2zrcDfV//8QAGBEAAwEBAAAAAAAAAAAAAAAAAQMSAAL/2gAIAQMBAT8ACFV0IG//2Q==",blurWidth:8,blurHeight:6},key:"coach4"},{img:{src:"/focus_space_official_website/_next/static/media/5.ba270f3f.jpg",height:1077,width:1522,blurDataURL:"data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAoKCgoKCgsMDAsPEA4QDxYUExMUFiIYGhgaGCIzICUgICUgMy03LCksNy1RQDg4QFFeT0pPXnFlZXGPiI+7u/sBCgoKCgoKCwwMCw8QDhAPFhQTExQWIhgaGBoYIjMgJSAgJSAzLTcsKSw3LVFAODhAUV5PSk9ecWVlcY+Ij7u7+//CABEIAAYACAMBIgACEQEDEQH/xAAoAAEBAAAAAAAAAAAAAAAAAAAAAgEBAQAAAAAAAAAAAAAAAAAABQb/2gAMAwEAAhADEAAAAJESt//EABwQAAICAgMAAAAAAAAAAAAAAAIDAQQSUQAGMf/aAAgBAQABPwCx1erlXYTSkWMGuyMR82Oi5//EABsRAAMAAgMAAAAAAAAAAAAAAAECBAADBRFS/9oACAECAQE/AKeUvTVKVoYFkJPQHrP/xAAaEQACAgMAAAAAAAAAAAAAAAABAgADESEi/9oACAEDAQE/AEoqy/A0Z//Z",blurWidth:8,blurHeight:6},key:"coach5"},{img:{src:"/focus_space_official_website/_next/static/media/7.e1dc12f8.jpg",height:1077,width:1523,blurDataURL:"data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAoKCgoKCgsMDAsPEA4QDxYUExMUFiIYGhgaGCIzICUgICUgMy03LCksNy1RQDg4QFFeT0pPXnFlZXGPiI+7u/sBCgoKCgoKCwwMCw8QDhAPFhQTExQWIhgaGBoYIjMgJSAgJSAzLTcsKSw3LVFAODhAUV5PSk9ecWVlcY+Ij7u7+//CABEIAAYACAMBIgACEQEDEQH/xAAoAAEBAAAAAAAAAAAAAAAAAAAAAwEBAQAAAAAAAAAAAAAAAAAABQb/2gAMAwEAAhADEAAAAJCNV//EABwQAAMAAQUAAAAAAAAAAAAAAAECBAMABhETgf/aAAgBAQABPwC7bU04kL5C/fkSdiqonAPh1//EABoRAAICAwAAAAAAAAAAAAAAAAECAwQABZH/2gAIAQIBAT8Am2V5IKrLYYF0Jbuf/8QAGBEBAQEBAQAAAAAAAAAAAAAAAQIDACH/2gAIAQMBAT8AjDJqxg8e/9k=",blurWidth:8,blurHeight:6},key:"coach6"},{img:{src:"/focus_space_official_website/_next/static/media/6.5c022edd.jpg",height:1077,width:1523,blurDataURL:"data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAoKCgoKCgsMDAsPEA4QDxYUExMUFiIYGhgaGCIzICUgICUgMy03LCksNy1RQDg4QFFeT0pPXnFlZXGPiI+7u/sBCgoKCgoKCwwMCw8QDhAPFhQTExQWIhgaGBoYIjMgJSAgJSAzLTcsKSw3LVFAODhAUV5PSk9ecWVlcY+Ij7u7+//CABEIAAYACAMBIgACEQEDEQH/xAAoAAEBAAAAAAAAAAAAAAAAAAAAAgEBAQAAAAAAAAAAAAAAAAAABQb/2gAMAwEAAhADEAAAAIEop//EAB4QAAICAAcAAAAAAAAAAAAAAAECAwQABhESIjFy/9oACAEBAAE/AL+Vq0SwzGdubJXYbB0xA19Y/8QAGxEAAgEFAAAAAAAAAAAAAAAAAgQBABESE5H/2gAIAQIBAT8Ah9yVlj3lkQlftf/EABoRAAICAwAAAAAAAAAAAAAAAAESAAIDEyH/2gAIAQMBAT8A0YmsEHJ//9k=",blurWidth:8,blurHeight:6},key:"coach7"},{img:{src:"/focus_space_official_website/_next/static/media/8.365cc605.jpg",height:1077,width:1523,blurDataURL:"data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAoKCgoKCgsMDAsPEA4QDxYUExMUFiIYGhgaGCIzICUgICUgMy03LCksNy1RQDg4QFFeT0pPXnFlZXGPiI+7u/sBCgoKCgoKCwwMCw8QDhAPFhQTExQWIhgaGBoYIjMgJSAgJSAzLTcsKSw3LVFAODhAUV5PSk9ecWVlcY+Ij7u7+//CABEIAAYACAMBIgACEQEDEQH/xAAoAAEBAAAAAAAAAAAAAAAAAAAAAwEBAQAAAAAAAAAAAAAAAAAABQb/2gAMAwEAAhADEAAAAJiOV//EAB0QAAICAQUAAAAAAAAAAAAAAAIDAQQhAAYTIiP/2gAIAQEAAT8At7YQAIZyx2YNc/OMieNf/8QAHREAAQMFAQAAAAAAAAAAAAAAAgEREwADBAUhQf/aAAgBAgEBPwAthmwWCnJFJCdue1//xAAYEQADAQEAAAAAAAAAAAAAAAABAxIAAv/aAAgBAwEBPwAIVXQgb//Z",blurWidth:8,blurHeight:6},key:"coach8"},{img:{src:"/focus_space_official_website/_next/static/media/9.523f5f3b.jpg",height:1077,width:1523,blurDataURL:"data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAoKCgoKCgsMDAsPEA4QDxYUExMUFiIYGhgaGCIzICUgICUgMy03LCksNy1RQDg4QFFeT0pPXnFlZXGPiI+7u/sBCgoKCgoKCwwMCw8QDhAPFhQTExQWIhgaGBoYIjMgJSAgJSAzLTcsKSw3LVFAODhAUV5PSk9ecWVlcY+Ij7u7+//CABEIAAYACAMBIgACEQEDEQH/xAAoAAEBAAAAAAAAAAAAAAAAAAAAAwEBAQAAAAAAAAAAAAAAAAAABQb/2gAMAwEAAhADEAAAAIiPV//EABoQAAIDAQEAAAAAAAAAAAAAAAIDAQQyAAb/2gAIAQEAAT8At+TrLWlrLBHJtWjADqe//8QAGhEAAgIDAAAAAAAAAAAAAAAAAQIEEwAFEf/aAAgBAgEBPwBtjNojtewLKe5//8QAGREAAgMBAAAAAAAAAAAAAAAAAQIAAxIh/9oACAEDAQE/AFoq0wwOGf/Z",blurWidth:8,blurHeight:6},key:"coach9"},{img:{src:"/focus_space_official_website/_next/static/media/10.9698a1c8.jpg",height:1077,width:1523,blurDataURL:"data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAoKCgoKCgsMDAsPEA4QDxYUExMUFiIYGhgaGCIzICUgICUgMy03LCksNy1RQDg4QFFeT0pPXnFlZXGPiI+7u/sBCgoKCgoKCwwMCw8QDhAPFhQTExQWIhgaGBoYIjMgJSAgJSAzLTcsKSw3LVFAODhAUV5PSk9ecWVlcY+Ij7u7+//CABEIAAYACAMBIgACEQEDEQH/xAAoAAEBAAAAAAAAAAAAAAAAAAAAAwEBAQAAAAAAAAAAAAAAAAAABQb/2gAMAwEAAhADEAAAAIiOV//EABsQAAMAAgMAAAAAAAAAAAAAAAECAwAEBhEi/9oACAEBAAE/ANriUJLOp2ndq0nBvKgdMc//xAAbEQACAgMBAAAAAAAAAAAAAAABAgQRAAMFcf/aAAgBAgEBPwBujNGiOwkMCym69z//xAAaEQACAgMAAAAAAAAAAAAAAAABAgADERIh/9oACAEDAQE/AFoqyw0HJ//Z",blurWidth:8,blurHeight:6},key:"coach10"},{img:{src:"/focus_space_official_website/_next/static/media/11.9ecf2cac.jpg",height:1077,width:1523,blurDataURL:"data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAoKCgoKCgsMDAsPEA4QDxYUExMUFiIYGhgaGCIzICUgICUgMy03LCksNy1RQDg4QFFeT0pPXnFlZXGPiI+7u/sBCgoKCgoKCwwMCw8QDhAPFhQTExQWIhgaGBoYIjMgJSAgJSAzLTcsKSw3LVFAODhAUV5PSk9ecWVlcY+Ij7u7+//CABEIAAYACAMBIgACEQEDEQH/xAAoAAEBAAAAAAAAAAAAAAAAAAAAAwEBAQAAAAAAAAAAAAAAAAAABQb/2gAMAwEAAhADEAAAAJCPV//EABsQAQACAgMAAAAAAAAAAAAAAAIBAwAEBhIi/9oACAEBAAE/ANjiuuYpbvl92aF4Jz//xAAbEQACAgMBAAAAAAAAAAAAAAABAgQRAAMFcf/aAAgBAgEBPwB+jNGmOwkMCym69z//xAAaEQACAgMAAAAAAAAAAAAAAAABAgADERIh/9oACAEDAQE/AFoqyw0HDP/Z",blurWidth:8,blurHeight:6},key:"coach11"},{img:{src:"/focus_space_official_website/_next/static/media/12.2ef3c0ad.jpg",height:1077,width:1523,blurDataURL:"data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAoKCgoKCgsMDAsPEA4QDxYUExMUFiIYGhgaGCIzICUgICUgMy03LCksNy1RQDg4QFFeT0pPXnFlZXGPiI+7u/sBCgoKCgoKCwwMCw8QDhAPFhQTExQWIhgaGBoYIjMgJSAgJSAzLTcsKSw3LVFAODhAUV5PSk9ecWVlcY+Ij7u7+//CABEIAAYACAMBIgACEQEDEQH/xAAoAAEBAAAAAAAAAAAAAAAAAAAAAQEBAQAAAAAAAAAAAAAAAAAABQb/2gAMAwEAAhADEAAAAIJBX//EABwQAAMAAQUAAAAAAAAAAAAAAAECAwQABhESM//aAAgBAQABPwDO2zjSlB2r6OkG6oo5DEDX/8QAGhEAAgIDAAAAAAAAAAAAAAAAAQIEEwAFEf/aAAgBAgEBPwA7GbRHa9gWU9z/xAAZEQEAAgMAAAAAAAAAAAAAAAABAxIAAiH/2gAIAQMBAT8AIIrbFDjn/9k=",blurWidth:8,blurHeight:6},key:"coach12"},{img:{src:"/focus_space_official_website/_next/static/media/13.db897c25.jpg",height:1077,width:1523,blurDataURL:"data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAoKCgoKCgsMDAsPEA4QDxYUExMUFiIYGhgaGCIzICUgICUgMy03LCksNy1RQDg4QFFeT0pPXnFlZXGPiI+7u/sBCgoKCgoKCwwMCw8QDhAPFhQTExQWIhgaGBoYIjMgJSAgJSAzLTcsKSw3LVFAODhAUV5PSk9ecWVlcY+Ij7u7+//CABEIAAYACAMBIgACEQEDEQH/xAAoAAEBAAAAAAAAAAAAAAAAAAAAAwEBAQAAAAAAAAAAAAAAAAAABQb/2gAMAwEAAhADEAAAAICSV//EABwQAAICAgMAAAAAAAAAAAAAAAIDAQQRIQAGEv/aAAgBAQABPwC11NCQS1ts2+mCmcgEaKYjWOf/xAAbEQABBAMAAAAAAAAAAAAAAAACAAEEEQMTIf/aAAgBAgEBPwBp8wo+A95WTPdcX//EABgRAAMBAQAAAAAAAAAAAAAAAAEDEgAC/9oACAEDAQE/AAlVdCBv/9k=",blurWidth:8,blurHeight:6},key:"coach13"},{img:{src:"/focus_space_official_website/_next/static/media/14.a351e4b1.jpg",height:1077,width:1523,blurDataURL:"data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAoKCgoKCgsMDAsPEA4QDxYUExMUFiIYGhgaGCIzICUgICUgMy03LCksNy1RQDg4QFFeT0pPXnFlZXGPiI+7u/sBCgoKCgoKCwwMCw8QDhAPFhQTExQWIhgaGBoYIjMgJSAgJSAzLTcsKSw3LVFAODhAUV5PSk9ecWVlcY+Ij7u7+//CABEIAAYACAMBIgACEQEDEQH/xAAoAAEBAAAAAAAAAAAAAAAAAAAABAEBAQAAAAAAAAAAAAAAAAAABQb/2gAMAwEAAhADEAAAAJhIqf/EAB4QAAICAAcAAAAAAAAAAAAAAAEDAgQABQYREiNC/9oACAEBAAE/AMy01VrhDy+fcxdUgRj7PDfH/8QAGhEAAgIDAAAAAAAAAAAAAAAAAQIDBAAFkf/aAAgBAgEBPwCTY3RBWYTsC6kt3P/EABgRAQEBAQEAAAAAAAAAAAAAAAECAwAh/9oACAEDAQE/AJwyasYPHv/Z",blurWidth:8,blurHeight:6},key:"coach14"},{img:{src:"/focus_space_official_website/_next/static/media/15.686ee777.jpg",height:1077,width:1523,blurDataURL:"data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAoKCgoKCgsMDAsPEA4QDxYUExMUFiIYGhgaGCIzICUgICUgMy03LCksNy1RQDg4QFFeT0pPXnFlZXGPiI+7u/sBCgoKCgoKCwwMCw8QDhAPFhQTExQWIhgaGBoYIjMgJSAgJSAzLTcsKSw3LVFAODhAUV5PSk9ecWVlcY+Ij7u7+//CABEIAAYACAMBIgACEQEDEQH/xAAoAAEBAAAAAAAAAAAAAAAAAAAABAEBAQAAAAAAAAAAAAAAAAAABQb/2gAMAwEAAhADEAAAAJhKqf/EAB0QAAICAQUAAAAAAAAAAAAAAAIDBBIBAAUGIWL/2gAIAQEAAT8A3PjKY64zybe7lRiGmB6Mq2x61//EABoRAAICAwAAAAAAAAAAAAAAAAERAgQAAxP/2gAIAQIBAT8AF23Kvon3myC0Vn//xAAYEQADAQEAAAAAAAAAAAAAAAABAxIAAv/aAAgBAwEBPwAJVXQgb//Z",blurWidth:8,blurHeight:6},key:"coach15"},{img:{src:"/focus_space_official_website/_next/static/media/16.4afd058c.jpg",height:1077,width:1523,blurDataURL:"data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAoKCgoKCgsMDAsPEA4QDxYUExMUFiIYGhgaGCIzICUgICUgMy03LCksNy1RQDg4QFFeT0pPXnFlZXGPiI+7u/sBCgoKCgoKCwwMCw8QDhAPFhQTExQWIhgaGBoYIjMgJSAgJSAzLTcsKSw3LVFAODhAUV5PSk9ecWVlcY+Ij7u7+//CABEIAAYACAMBIgACEQEDEQH/xAAoAAEBAAAAAAAAAAAAAAAAAAAAAwEBAQAAAAAAAAAAAAAAAAAABQb/2gAMAwEAAhADEAAAAIiRV//EAB0QAAICAQUAAAAAAAAAAAAAAAEDAgQABQYREjP/2gAIAQEAAT8A1DbFSspNhjOxm1Vc8QA9JCGf/8QAHBEAAQMFAAAAAAAAAAAAAAAAEQECAwAEExQh/9oACAECAQE/AN+8WCB2d5Ukcr//xAAYEQADAQEAAAAAAAAAAAAAAAABAxIAAv/aAAgBAwEBPwAJVXQgb//Z",blurWidth:8,blurHeight:6},key:"coach16"},{img:{src:"/focus_space_official_website/_next/static/media/17.590ba2a4.jpg",height:1077,width:1523,blurDataURL:"data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAoKCgoKCgsMDAsPEA4QDxYUExMUFiIYGhgaGCIzICUgICUgMy03LCksNy1RQDg4QFFeT0pPXnFlZXGPiI+7u/sBCgoKCgoKCwwMCw8QDhAPFhQTExQWIhgaGBoYIjMgJSAgJSAzLTcsKSw3LVFAODhAUV5PSk9ecWVlcY+Ij7u7+//CABEIAAYACAMBIgACEQEDEQH/xAAoAAEBAAAAAAAAAAAAAAAAAAAABAEBAQAAAAAAAAAAAAAAAAAABQb/2gAMAwEAAhADEAAAAJBErf/EABsQAAMAAgMAAAAAAAAAAAAAAAECAwQRAAUG/9oACAEBAAE/AOw8uqDCqtZkPZMejFNMNkaZef/EABsRAAICAwEAAAAAAAAAAAAAAAECAwQABSFS/9oACAECAQE/ALG0vpDVKzkFkYng9Z//xAAZEQADAAMAAAAAAAAAAAAAAAABAgMAIjH/2gAIAQMBAT8ASEi1NOEZ/9k=",blurWidth:8,blurHeight:6},key:"coach17"}]},9311:function(A,r,g){"use strict";g.d(r,{cn:function(){return cn}});var l=g(7042),h=g(3986);function cn(){for(var A=arguments.length,r=Array(A),g=0;g<A;g++)r[g]=arguments[g];return(0,h.m)((0,l.W)(r))}},2597:function(A,r,g){"use strict";Object.defineProperty(r,"__esModule",{value:!0}),function(A,r){for(var g in r)Object.defineProperty(A,g,{enumerable:!0,get:r[g]})}(r,{default:function(){return Q},unstable_getImgProps:function(){return unstable_getImgProps}});let l=g(1024),h=g(3655),E=g(7707),b=g(6964),p=l._(g(5324)),unstable_getImgProps=A=>{(0,E.warnOnce)("Warning: unstable_getImgProps() is experimental and may change or be removed at any time. Use at your own risk.");let{props:r}=(0,h.getImgProps)(A,{defaultLoader:p.default,imgConf:{deviceSizes:[640,750,828,1080,1200,1920,2048,3840],imageSizes:[16,32,48,64,96,128,256,384],path:"/focus_space_official_website/_next/image",loader:"default",dangerouslyAllowSVG:!1,unoptimized:!1}});for(let[A,g]of Object.entries(r))void 0===g&&delete r[A];return{props:r}},Q=b.Image},6691:function(A,r,g){A.exports=g(2597)}}]);
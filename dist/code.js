!function(e){var t={};function a(n){if(t[n])return t[n].exports;var r=t[n]={i:n,l:!1,exports:{}};return e[n].call(r.exports,r,r.exports,a),r.l=!0,r.exports}a.m=e,a.c=t,a.d=function(e,t,n){a.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},a.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},a.t=function(e,t){if(1&t&&(e=a(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(a.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)a.d(n,r,function(t){return e[t]}.bind(null,r));return n},a.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return a.d(t,"a",t),t},a.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},a.p="",a(a.s=281)}({281:function(e,t){figma.showUI(__html__,{height:500}),figma.ui.onmessage=e=>{"set-color"===e.type?figma.clientStorage.setAsync(e.data.name,e.data.color):"get-color"===e.type?figma.clientStorage.getAsync(e.data.name).then(t=>figma.ui.postMessage({type:"get-color-res",data:{name:e.data.name,color:t}})):"set-swatches"===e.type?figma.clientStorage.setAsync("swatches",e.data):"get-swatches"===e.type?figma.clientStorage.getAsync("swatches").then(e=>figma.ui.postMessage({type:"get-swatches-res",data:e})):"set-bg"===e.type?figma.clientStorage.setAsync("bg",e.data):"get-bg"===e.type?figma.clientStorage.getAsync("bg").then(e=>figma.ui.postMessage({type:"get-bg-res",data:e})):"set-shift"===e.type?figma.clientStorage.setAsync("shift",e.data):"get-shift"===e.type&&figma.clientStorage.getAsync("shift").then(e=>figma.ui.postMessage({type:"get-shift-res",data:e}))}}});
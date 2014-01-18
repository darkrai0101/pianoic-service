/*
Copyright (c) 2011, Daniel Guerrero
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:
    * Redistributions of source code must retain the above copyright
      notice, this list of conditions and the following disclaimer.
    * Redistributions in binary form must reproduce the above copyright
      notice, this list of conditions and the following disclaimer in the
      documentation and/or other materials provided with the distribution.
    * Neither the name of the Daniel Guerrero nor the
      names of its contributors may be used to endorse or promote products
      derived from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL DANIEL GUERRERO BE LIABLE FOR ANY
DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/
(function(a){a.btoa||(a.btoa=function(d){d=escape(d);var a="",b,c,h="",g,l,f="",k=0;do b=d.charCodeAt(k++),c=d.charCodeAt(k++),h=d.charCodeAt(k++),g=b>>2,b=(b&3)<<4|c>>4,l=(c&15)<<2|h>>6,f=h&63,isNaN(c)?l=f=64:isNaN(h)&&(f=64),a=a+"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".charAt(g)+"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".charAt(b)+"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".charAt(l)+"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".charAt(f);
while(k<d.length);return a});a.atob||(a.atob=function(a){var e="",b,c,h="",g,l="",f=0;/[^A-Za-z0-9\+\/\=]/g.exec(a)&&alert("There were invalid base64 characters in the input text.\nValid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\nExpect errors in decoding.");a=a.replace(/[^A-Za-z0-9\+\/\=]/g,"");do b="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".indexOf(a.charAt(f++)),c="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".indexOf(a.charAt(f++)),g="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".indexOf(a.charAt(f++)),
l="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".indexOf(a.charAt(f++)),b=b<<2|c>>4,c=(c&15)<<4|g>>2,h=(g&3)<<6|l,e+=String.fromCharCode(b),64!=g&&(e+=String.fromCharCode(c)),64!=l&&(e+=String.fromCharCode(h));while(f<a.length);return unescape(e)})})(this);
var Base64Binary={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",decodeArrayBuffer:function(a){var d=Math.ceil(3*a.length/4),d=new ArrayBuffer(d);this.decode(a,d);return d},decode:function(a,d){var e=this._keyStr.indexOf(a.charAt(a.length-1)),b=this._keyStr.indexOf(a.charAt(a.length-1)),c=Math.ceil(3*a.length/4);64==e&&c--;64==b&&c--;var h,g,l,f,k=0,m=0,e=d?new Uint8Array(d):new Uint8Array(c);a=a.replace(/[^A-Za-z0-9\+\/\=]/g,"");for(k=0;k<c;k+=3)h=this._keyStr.indexOf(a.charAt(m++)),
g=this._keyStr.indexOf(a.charAt(m++)),b=this._keyStr.indexOf(a.charAt(m++)),f=this._keyStr.indexOf(a.charAt(m++)),h=h<<2|g>>4,g=(g&15)<<4|b>>2,l=(b&3)<<6|f,e[k]=h,64!=b&&(e[k+1]=g),64!=f&&(e[k+2]=l);return e}};
// $begin{copyright}
//
// This file is part of WebSharper
//
// Copyright (c) 2008-2014 IntelliFactory
//
// Licensed under the Apache License, Version 2.0 (the "License"); you
// may not use this file except in compliance with the License.  You may
// obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
// implied.  See the License for the specific language governing
// permissions and limitations under the License.
//
// $end{copyright}

try {
    Object.defineProperty(Error.prototype, 'message', { enumerable: true });
} catch (e) { }

var IntelliFactory =
{
    Runtime:
    {
        Class:
            function (p, s) {
                function r() { }
                r.prototype = p;
                for (var f in s) { r[f] = s[f]; }
                return r;
            },

        Define:
            function (a, b) {
                var overwrite = !!this.overwrite;
                function define(a, b) {
                    for (var k in b) {
                        var t1 = typeof a[k];
                        var t2 = typeof b[k];
                        if (t1 == "object" && t2 == "object") {
                            define(a[k], b[k]);
                        } else if (t1 == "undefined" || overwrite) {
                            a[k] = b[k];
                        } else {
                            throw new Error("Name conflict: " + k);
                        }
                    }
                }
                define(a, b);
            },

        DeleteEmptyFields:
            function (obj, fields) {
                for (var i = 0; i < fields.length; i++) {
                    var f = fields[i];
                    if (obj[f] === undefined) { delete obj[f]; }
                }
                return obj;
            },

        Field:
            function (f) {
                var value, ready = false;
                return function () {
                    if (!ready) { ready = true; value = f(); }
                    return value;
                }
            },

        GetOptional:
            function (value) {
                return (value === undefined) ? { $: 0 } : { $: 1, $0: value };
            },

        New:		
            function (ctor, fields) {
                var r = new ctor();
                for (var f in fields) {
                    if (!(f in r)) {
                        r[f] = fields[f];
                    }
                }
                return r
            },

        NewObject:
            function (kv) {
                var o = {};
                for (var i = 0; i < kv.length; i++) {
                    o[kv[i][0]] = kv[i][1];
                }
                return o;
            },

        OnInit:
            function (f) {
                if (!("init" in this)) {
                    this.init = [];
                }
                this.init.push(f);
            },

        OnLoad:
            function (f) {
                if (!("load" in this)) {
                    this.load = [];
                }
                this.load.push(f);
            },

        Inherit:
            function (a, b) {
                var p = a.prototype;
                a.prototype = new b();
                for (var f in p) {
                    a.prototype[f] = p[f];
                }
            },

        Safe:
            function (x) {
                if (x === undefined) return {};
                return x;
            },

        SetOptional:
            function (obj, field, value) {
                if (value.$ == 0) {
                    delete obj[field];
                } else {
                    obj[field] = value.$0;
                }
            },

        Start:
            function () {
                function run(c) {
                    for (var i = 0; i < c.length; i++) {
                        c[i]();
                    }
                }
                if ("init" in this) {
                    run(this.init);
                    this.init = [];
                }
                if ("load" in this) {
                    run(this.load);
                    this.load = [];
                }
            },

        Bind:
            function (f, obj) {
                return function () { return f.apply(this, arguments) }
            },

        CreateFuncWithArgs:
            function (f) {
                return function () { return f(Array.prototype.slice.call(arguments)); }
            },

        CreateFuncWithOnlyThis:
            function (f) {
                return function () { return f(this); }
            },

        CreateFuncWithThis:
            function (f) {
                return function () { return f(this).apply(null, arguments); }
            },

        CreateFuncWithThisArgs:
            function (f) {
                return function () { return f(this)(Array.prototype.slice.call(arguments)); }
            },

        CreateFuncWithRest:
            function (length, f) {
                return function () { return f(Array.prototype.slice.call(arguments, 0, length).concat([Array.prototype.slice.call(arguments, length)])); }
            },

        CreateFuncWithArgsRest:
            function (length, f) {
                return function () { return f([Array.prototype.slice.call(arguments, 0, length), Array.prototype.slice.call(arguments, length)]); }
            },

        UnionByType:
            function (types, value, optional) {
                var vt = typeof value;
                for (var i = 0; i < types.length; i++) {
                    var t = types[i];
                    if (Number.isInteger(t)) {
                        if (Array.isArray(value) && (t == 0 || value.length == t)) {
                            return { $: i, $0: value };
                        }
                    } else {
                        if (t == vt) {
                            return { $: i, $0: value };
                        }
                    }
                }
                if (!optional) {
                    throw new Error("Type not expected for creating Choice value.");
                }
            }
    }
};

// Polyfill

if (!Date.now) {
    Date.now = function now() {
        return new Date().getTime();
    };
}
;
var JSON;JSON||(JSON={}),function(){"use strict";function i(n){return n<10?"0"+n:n}function f(n){return o.lastIndex=0,o.test(n)?'"'+n.replace(o,function(n){var t=s[n];return typeof t=="string"?t:"\\u"+("0000"+n.charCodeAt(0).toString(16)).slice(-4)})+'"':'"'+n+'"'}function r(i,e){var s,l,h,a,v=n,c,o=e[i];o&&typeof o=="object"&&typeof o.toJSON=="function"&&(o=o.toJSON(i)),typeof t=="function"&&(o=t.call(e,i,o));switch(typeof o){case"string":return f(o);case"number":return isFinite(o)?String(o):"null";case"boolean":case"null":return String(o);case"object":if(!o)return"null";if(n+=u,c=[],Object.prototype.toString.apply(o)==="[object Array]"){for(a=o.length,s=0;s<a;s+=1)c[s]=r(s,o)||"null";return h=c.length===0?"[]":n?"[\n"+n+c.join(",\n"+n)+"\n"+v+"]":"["+c.join(",")+"]",n=v,h}if(t&&typeof t=="object")for(a=t.length,s=0;s<a;s+=1)typeof t[s]=="string"&&(l=t[s],h=r(l,o),h&&c.push(f(l)+(n?": ":":")+h));else for(l in o)Object.prototype.hasOwnProperty.call(o,l)&&(h=r(l,o),h&&c.push(f(l)+(n?": ":":")+h));return h=c.length===0?"{}":n?"{\n"+n+c.join(",\n"+n)+"\n"+v+"}":"{"+c.join(",")+"}",n=v,h}}typeof Date.prototype.toJSON!="function"&&(Date.prototype.toJSON=function(){return isFinite(this.valueOf())?this.getUTCFullYear()+"-"+i(this.getUTCMonth()+1)+"-"+i(this.getUTCDate())+"T"+i(this.getUTCHours())+":"+i(this.getUTCMinutes())+":"+i(this.getUTCSeconds())+"Z":null},String.prototype.toJSON=Number.prototype.toJSON=Boolean.prototype.toJSON=function(){return this.valueOf()});var e=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,o=/[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,n,u,s={"\b":"\\b","\t":"\\t","\n":"\\n","\f":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"},t;typeof JSON.stringify!="function"&&(JSON.stringify=function(i,f,e){var o;if(n="",u="",typeof e=="number")for(o=0;o<e;o+=1)u+=" ";else typeof e=="string"&&(u=e);if(t=f,f&&typeof f!="function"&&(typeof f!="object"||typeof f.length!="number"))throw new Error("JSON.stringify");return r("",{"":i})}),typeof JSON.parse!="function"&&(JSON.parse=function(n,t){function r(n,i){var f,e,u=n[i];if(u&&typeof u=="object")for(f in u)Object.prototype.hasOwnProperty.call(u,f)&&(e=r(u,f),e!==undefined?u[f]=e:delete u[f]);return t.call(n,i,u)}var i;if(n=String(n),e.lastIndex=0,e.test(n)&&(n=n.replace(e,function(n){return"\\u"+("0000"+n.charCodeAt(0).toString(16)).slice(-4)})),/^[\],:{}\s]*$/.test(n.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,"@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,"]").replace(/(?:^|:|,)(?:\s*\[)+/g,"")))return i=eval("("+n+")"),typeof t=="function"?r({"":i},""):i;throw new SyntaxError("JSON.parse");})}();;
(function()
{
 var Global=this,Runtime=this.IntelliFactory.Runtime,Number,Arrays,Operators,Error,Array,Seq,Unchecked,Enumerator,Arrays2D,Concurrency,AggregateException,Option,clearTimeout,setTimeout,CancellationTokenSource,Char,Util,Lazy,Date,console,Scheduler,T,Html,Client,Activator,document,jQuery,Json,JSON,JavaScript,JSModule,HtmlContentExtensions,SingleNode,List,T1,Math,Strings,PrintfHelpers,Remoting,XhrProvider,AsyncProxy,AjaxRemotingProvider,window,Enumerable,String,RegExp;
 Runtime.Define(Global,{
  WebSharper:{
   AggregateException:Runtime.Class({},{
    New:function($innerExceptions)
    {
     var $0=this,$this=this;
     return Global.e=new Global.Error("AggregateException"),Global.e.InnerExceptions=$innerExceptions,Global.e;
    }
   }),
   Arrays:{
    average:function(arr)
    {
     return Number(Arrays.sum(arr))/Number(arr.length);
    },
    averageBy:function(f,arr)
    {
     return Number(Arrays.sumBy(f,arr))/Number(arr.length);
    },
    blit:function(arr1,start1,arr2,start2,length)
    {
     var i;
     Arrays.checkRange(arr1,start1,length);
     Arrays.checkRange(arr2,start2,length);
     for(i=0;i<=length-1;i++){
      Arrays.set(arr2,start2+i,Arrays.get(arr1,start1+i));
     }
     return;
    },
    checkBounds:function(arr,n)
    {
     return(n<0?true:n>=arr.length)?Operators.FailWith("Index was outside the bounds of the array."):null;
    },
    checkBounds2D:function(arr,n1,n2)
    {
     return(((n1<0?true:n2<0)?true:n1>=arr.length)?true:n2>=(arr.length?arr[0].length:0))?Operators.Raise(new Error("IndexOutOfRangeException")):null;
    },
    checkLength:function(arr1,arr2)
    {
     return arr1.length!==arr2.length?Operators.FailWith("Arrays differ in length."):null;
    },
    checkRange:function(arr,start,size)
    {
     return((size<0?true:start<0)?true:arr.length<start+size)?Operators.FailWith("Index was outside the bounds of the array."):null;
    },
    choose:function(f,arr)
    {
     var q,i,matchValue,_,x;
     q=[];
     for(i=0;i<=arr.length-1;i++){
      matchValue=f(Arrays.get(arr,i));
      if(matchValue.$==0)
       {
        _=null;
       }
      else
       {
        x=matchValue.$0;
        _=q.push(x);
       }
     }
     return q;
    },
    collect:function(f,x)
    {
     return Array.prototype.concat.apply([],Arrays.map(f,x));
    },
    concat:function(xs)
    {
     return Array.prototype.concat.apply([],Arrays.ofSeq(xs));
    },
    create:function(size,value)
    {
     var r,i;
     r=Array(size);
     for(i=0;i<=size-1;i++){
      Arrays.set(r,i,value);
     }
     return r;
    },
    create2D:function(rows)
    {
     var mapping,source1,x;
     mapping=function(source)
     {
      return Arrays.ofSeq(source);
     };
     source1=Seq.map(mapping,rows);
     x=Arrays.ofSeq(source1);
     x.dims=2;
     return x;
    },
    exists2:function(f,arr1,arr2)
    {
     Arrays.checkLength(arr1,arr2);
     return Seq.exists2(f,arr1,arr2);
    },
    fill:function(arr,start,length,value)
    {
     var i;
     Arrays.checkRange(arr,start,length);
     for(i=start;i<=start+length-1;i++){
      Arrays.set(arr,i,value);
     }
     return;
    },
    filter:function(f,arr)
    {
     var r,i;
     r=[];
     for(i=0;i<=arr.length-1;i++){
      f(Arrays.get(arr,i))?r.push(Arrays.get(arr,i)):null;
     }
     return r;
    },
    find:function(f,arr)
    {
     var matchValue,_,x;
     matchValue=Arrays.tryFind(f,arr);
     if(matchValue.$==0)
      {
       _=Operators.FailWith("KeyNotFoundException");
      }
     else
      {
       x=matchValue.$0;
       _=x;
      }
     return _;
    },
    findINdex:function(f,arr)
    {
     var matchValue,_,x;
     matchValue=Arrays.tryFindIndex(f,arr);
     if(matchValue.$==0)
      {
       _=Operators.FailWith("KeyNotFoundException");
      }
     else
      {
       x=matchValue.$0;
       _=x;
      }
     return _;
    },
    fold:function(f,zero,arr)
    {
     var acc,i;
     acc=zero;
     for(i=0;i<=arr.length-1;i++){
      acc=(f(acc))(Arrays.get(arr,i));
     }
     return acc;
    },
    fold2:function(f,zero,arr1,arr2)
    {
     var accum,i;
     Arrays.checkLength(arr1,arr2);
     accum=zero;
     for(i=0;i<=arr1.length-1;i++){
      accum=((f(accum))(Arrays.get(arr1,i)))(Arrays.get(arr2,i));
     }
     return accum;
    },
    foldBack:function(f,arr,zero)
    {
     var acc,len,i;
     acc=zero;
     len=arr.length;
     for(i=1;i<=len;i++){
      acc=(f(Arrays.get(arr,len-i)))(acc);
     }
     return acc;
    },
    foldBack2:function(f,arr1,arr2,zero)
    {
     var len,accum,i;
     Arrays.checkLength(arr1,arr2);
     len=arr1.length;
     accum=zero;
     for(i=1;i<=len;i++){
      accum=((f(Arrays.get(arr1,len-i)))(Arrays.get(arr2,len-i)))(accum);
     }
     return accum;
    },
    forall2:function(f,arr1,arr2)
    {
     Arrays.checkLength(arr1,arr2);
     return Seq.forall2(f,arr1,arr2);
    },
    get:function(arr,n)
    {
     Arrays.checkBounds(arr,n);
     return arr[n];
    },
    get2D:function(arr,n1,n2)
    {
     Arrays.checkBounds2D(arr,n1,n2);
     return arr[n1][n2];
    },
    init:function(size,f)
    {
     var r,i;
     size<0?Operators.FailWith("Negative size given."):null;
     r=Array(size);
     for(i=0;i<=size-1;i++){
      Arrays.set(r,i,f(i));
     }
     return r;
    },
    iter:function(f,arr)
    {
     var i;
     for(i=0;i<=arr.length-1;i++){
      f(Arrays.get(arr,i));
     }
     return;
    },
    iter2:function(f,arr1,arr2)
    {
     var i;
     Arrays.checkLength(arr1,arr2);
     for(i=0;i<=arr1.length-1;i++){
      (f(Arrays.get(arr1,i)))(Arrays.get(arr2,i));
     }
     return;
    },
    iteri:function(f,arr)
    {
     var i;
     for(i=0;i<=arr.length-1;i++){
      (f(i))(Arrays.get(arr,i));
     }
     return;
    },
    iteri2:function(f,arr1,arr2)
    {
     var i;
     Arrays.checkLength(arr1,arr2);
     for(i=0;i<=arr1.length-1;i++){
      ((f(i))(Arrays.get(arr1,i)))(Arrays.get(arr2,i));
     }
     return;
    },
    length:function(arr)
    {
     var matchValue;
     matchValue=arr.dims;
     return matchValue===2?arr.length*arr.length:arr.length;
    },
    map:function(f,arr)
    {
     var r,i;
     r=Array(arr.length);
     for(i=0;i<=arr.length-1;i++){
      Arrays.set(r,i,f(Arrays.get(arr,i)));
     }
     return r;
    },
    map2:function(f,arr1,arr2)
    {
     var r,i;
     Arrays.checkLength(arr1,arr2);
     r=Array(arr2.length);
     for(i=0;i<=arr2.length-1;i++){
      Arrays.set(r,i,(f(Arrays.get(arr1,i)))(Arrays.get(arr2,i)));
     }
     return r;
    },
    mapi:function(f,arr)
    {
     var y,i;
     y=Array(arr.length);
     for(i=0;i<=arr.length-1;i++){
      Arrays.set(y,i,(f(i))(Arrays.get(arr,i)));
     }
     return y;
    },
    mapi2:function(f,arr1,arr2)
    {
     var res,i;
     Arrays.checkLength(arr1,arr2);
     res=Array(arr1.length);
     for(i=0;i<=arr1.length-1;i++){
      Arrays.set(res,i,((f(i))(Arrays.get(arr1,i)))(Arrays.get(arr2,i)));
     }
     return res;
    },
    max:function(x)
    {
     return Arrays.reduce(function(e1)
     {
      return function(e2)
      {
       return Operators.Max(e1,e2);
      };
     },x);
    },
    maxBy:function(f,arr)
    {
     return Arrays.reduce(function(x)
     {
      return function(y)
      {
       return Unchecked.Compare(f(x),f(y))===1?x:y;
      };
     },arr);
    },
    min:function(x)
    {
     return Arrays.reduce(function(e1)
     {
      return function(e2)
      {
       return Operators.Min(e1,e2);
      };
     },x);
    },
    minBy:function(f,arr)
    {
     return Arrays.reduce(function(x)
     {
      return function(y)
      {
       return Unchecked.Compare(f(x),f(y))===-1?x:y;
      };
     },arr);
    },
    nonEmpty:function(arr)
    {
     return arr.length===0?Operators.FailWith("The input array was empty."):null;
    },
    ofSeq:function(xs)
    {
     var q,_enum;
     q=[];
     _enum=Enumerator.Get(xs);
     while(_enum.MoveNext())
      {
       q.push(_enum.get_Current());
      }
     return q;
    },
    partition:function(f,arr)
    {
     var ret1,ret2,i;
     ret1=[];
     ret2=[];
     for(i=0;i<=arr.length-1;i++){
      f(Arrays.get(arr,i))?ret1.push(Arrays.get(arr,i)):ret2.push(Arrays.get(arr,i));
     }
     return[ret1,ret2];
    },
    permute:function(f,arr)
    {
     var ret,i;
     ret=Array(arr.length);
     for(i=0;i<=arr.length-1;i++){
      Arrays.set(ret,f(i),Arrays.get(arr,i));
     }
     return ret;
    },
    pick:function(f,arr)
    {
     var matchValue,_,x;
     matchValue=Arrays.tryPick(f,arr);
     if(matchValue.$==0)
      {
       _=Operators.FailWith("KeyNotFoundException");
      }
     else
      {
       x=matchValue.$0;
       _=x;
      }
     return _;
    },
    reduce:function(f,arr)
    {
     var acc,i;
     Arrays.nonEmpty(arr);
     acc=Arrays.get(arr,0);
     for(i=1;i<=arr.length-1;i++){
      acc=(f(acc))(Arrays.get(arr,i));
     }
     return acc;
    },
    reduceBack:function(f,arr)
    {
     var len,acc,i;
     Arrays.nonEmpty(arr);
     len=arr.length;
     acc=Arrays.get(arr,len-1);
     for(i=2;i<=len;i++){
      acc=(f(Arrays.get(arr,len-i)))(acc);
     }
     return acc;
    },
    reverse:function(array,offset,length)
    {
     var a;
     a=Arrays.sub(array,offset,length).slice().reverse();
     return Arrays.blit(a,0,array,offset,Arrays.length(a));
    },
    scan:function(f,zero,arr)
    {
     var ret,i;
     ret=Array(1+arr.length);
     Arrays.set(ret,0,zero);
     for(i=0;i<=arr.length-1;i++){
      Arrays.set(ret,i+1,(f(Arrays.get(ret,i)))(Arrays.get(arr,i)));
     }
     return ret;
    },
    scanBack:function(f,arr,zero)
    {
     var len,ret,i;
     len=arr.length;
     ret=Array(1+len);
     Arrays.set(ret,len,zero);
     for(i=0;i<=len-1;i++){
      Arrays.set(ret,len-i-1,(f(Arrays.get(arr,len-i-1)))(Arrays.get(ret,len-i)));
     }
     return ret;
    },
    set:function(arr,n,x)
    {
     Arrays.checkBounds(arr,n);
     arr[n]=x;
     return;
    },
    set2D:function(arr,n1,n2,x)
    {
     Arrays.checkBounds2D(arr,n1,n2);
     arr[n1][n2]=x;
     return;
    },
    setSub:function(arr,start,len,src)
    {
     var i;
     for(i=0;i<=len-1;i++){
      Arrays.set(arr,start+i,Arrays.get(src,i));
     }
     return;
    },
    setSub2D:function(dst,src1,src2,len1,len2,src)
    {
     var i,j;
     for(i=0;i<=len1-1;i++){
      for(j=0;j<=len2-1;j++){
       Arrays.set2D(dst,src1+i,src2+j,Arrays.get2D(src,i,j));
      }
     }
     return;
    },
    sort:function(arr)
    {
     return Arrays.sortBy(function(x)
     {
      return x;
     },arr);
    },
    sortBy:function(f,arr)
    {
     return arr.slice().sort(function(x,y)
     {
      return Operators.Compare(f(x),f(y));
     });
    },
    sortInPlace:function(arr)
    {
     return Arrays.sortInPlaceBy(function(x)
     {
      return x;
     },arr);
    },
    sortInPlaceBy:function(f,arr)
    {
     return arr.sort(function(x,y)
     {
      return Operators.Compare(f(x),f(y));
     });
    },
    sortInPlaceWith:function(comparer,arr)
    {
     return arr.sort(function(x,y)
     {
      return(comparer(x))(y);
     });
    },
    sortWith:function(comparer,arr)
    {
     return arr.slice().sort(function(x,y)
     {
      return(comparer(x))(y);
     });
    },
    sub:function(arr,start,length)
    {
     Arrays.checkRange(arr,start,length);
     return arr.slice(start,start+length);
    },
    sub2D:function(src,src1,src2,len1,len2)
    {
     var len11,len21,dst,i,j;
     len11=len1<0?0:len1;
     len21=len2<0?0:len2;
     dst=Arrays.zeroCreate2D(len11,len21);
     for(i=0;i<=len11-1;i++){
      for(j=0;j<=len21-1;j++){
       Arrays.set2D(dst,i,j,Arrays.get2D(src,src1+i,src2+j));
      }
     }
     return dst;
    },
    sum:function($arr)
    {
     var $0=this,$this=this;
     var sum=0;
     for(var i=0;i<$arr.length;i++)sum+=$arr[i];
     return sum;
    },
    sumBy:function($f,$arr)
    {
     var $0=this,$this=this;
     var sum=0;
     for(var i=0;i<$arr.length;i++)sum+=$f($arr[i]);
     return sum;
    },
    tryFind:function(f,arr)
    {
     var res,i;
     res={
      $:0
     };
     i=0;
     while(i<arr.length?res.$==0:false)
      {
       f(Arrays.get(arr,i))?res={
        $:1,
        $0:Arrays.get(arr,i)
       }:null;
       i=i+1;
      }
     return res;
    },
    tryFindIndex:function(f,arr)
    {
     var res,i;
     res={
      $:0
     };
     i=0;
     while(i<arr.length?res.$==0:false)
      {
       f(Arrays.get(arr,i))?res={
        $:1,
        $0:i
       }:null;
       i=i+1;
      }
     return res;
    },
    tryPick:function(f,arr)
    {
     var res,i,matchValue;
     res={
      $:0
     };
     i=0;
     while(i<arr.length?res.$==0:false)
      {
       matchValue=f(Arrays.get(arr,i));
       matchValue.$==1?res=matchValue:null;
       i=i+1;
      }
     return res;
    },
    unzip:function(arr)
    {
     var x,y,i,patternInput,b,a;
     x=[];
     y=[];
     for(i=0;i<=arr.length-1;i++){
      patternInput=Arrays.get(arr,i);
      b=patternInput[1];
      a=patternInput[0];
      x.push(a);
      y.push(b);
     }
     return[x,y];
    },
    unzip3:function(arr)
    {
     var x,y,z,i,matchValue,c,b,a;
     x=[];
     y=[];
     z=[];
     for(i=0;i<=arr.length-1;i++){
      matchValue=Arrays.get(arr,i);
      c=matchValue[2];
      b=matchValue[1];
      a=matchValue[0];
      x.push(a);
      y.push(b);
      z.push(c);
     }
     return[x,y,z];
    },
    zeroCreate2D:function(n,m)
    {
     var arr;
     arr=Arrays.init(n,function()
     {
      return Array(m);
     });
     arr.dims=2;
     return arr;
    },
    zip:function(arr1,arr2)
    {
     var res,i;
     Arrays.checkLength(arr1,arr2);
     res=Array(arr1.length);
     for(i=0;i<=arr1.length-1;i++){
      Arrays.set(res,i,[Arrays.get(arr1,i),Arrays.get(arr2,i)]);
     }
     return res;
    },
    zip3:function(arr1,arr2,arr3)
    {
     var res,i;
     Arrays.checkLength(arr1,arr2);
     Arrays.checkLength(arr2,arr3);
     res=Array(arr1.length);
     for(i=0;i<=arr1.length-1;i++){
      Arrays.set(res,i,[Arrays.get(arr1,i),Arrays.get(arr2,i),Arrays.get(arr3,i)]);
     }
     return res;
    }
   },
   Arrays2D:{
    copy:function(array)
    {
     return Arrays2D.init(array.length,array.length?array[0].length:0,function(i)
     {
      return function(j)
      {
       return Arrays.get2D(array,i,j);
      };
     });
    },
    init:function(n,m,f)
    {
     var array,i,j;
     array=Arrays.zeroCreate2D(n,m);
     for(i=0;i<=n-1;i++){
      for(j=0;j<=m-1;j++){
       Arrays.set2D(array,i,j,(f(i))(j));
      }
     }
     return array;
    },
    iter:function(f,array)
    {
     var count1,count2,i,j;
     count1=array.length;
     count2=array.length?array[0].length:0;
     for(i=0;i<=count1-1;i++){
      for(j=0;j<=count2-1;j++){
       f(Arrays.get2D(array,i,j));
      }
     }
     return;
    },
    iteri:function(f,array)
    {
     var count1,count2,i,j;
     count1=array.length;
     count2=array.length?array[0].length:0;
     for(i=0;i<=count1-1;i++){
      for(j=0;j<=count2-1;j++){
       ((f(i))(j))(Arrays.get2D(array,i,j));
      }
     }
     return;
    },
    map:function(f,array)
    {
     return Arrays2D.init(array.length,array.length?array[0].length:0,function(i)
     {
      return function(j)
      {
       return f(Arrays.get2D(array,i,j));
      };
     });
    },
    mapi:function(f,array)
    {
     return Arrays2D.init(array.length,array.length?array[0].length:0,function(i)
     {
      return function(j)
      {
       return((f(i))(j))(Arrays.get2D(array,i,j));
      };
     });
    }
   },
   AsyncProxy:Runtime.Class({},{
    get_CancellationToken:function()
    {
     return Concurrency.GetCT();
    },
    get_DefaultCancellationToken:function()
    {
     return Concurrency.defCTS().contents;
    }
   }),
   CancellationTokenSource:Runtime.Class({
    Cancel:function()
    {
     var _,chooser,array,errors;
     if(!this.c)
      {
       this.c=true;
       chooser=function(a)
       {
        var _1,e;
        try
        {
         a(null);
         _1={
          $:0
         };
        }
        catch(e)
        {
         _1={
          $:1,
          $0:e
         };
        }
        return _1;
       };
       array=this.r;
       errors=Arrays.choose(chooser,array);
       _=Arrays.length(errors)>0?Operators.Raise(AggregateException.New(errors)):null;
      }
     else
      {
       _=null;
      }
     return _;
    },
    Cancel1:function(throwOnFirstException)
    {
     var _,_1,action,array;
     if(!throwOnFirstException)
      {
       _=this.Cancel();
      }
     else
      {
       if(!this.c)
        {
         this.c=true;
         action=function(a)
         {
          return a(null);
         };
         array=this.r;
         _1=Arrays.iter(action,array);
        }
       else
        {
         _1=null;
        }
       _=_1;
      }
     return _;
    },
    CancelAfter:function(delay)
    {
     var _,option,arg0,_this=this;
     if(!this.c)
      {
       option=this.pending;
       Option.iter(function(handle)
       {
        return clearTimeout(handle);
       },option);
       arg0=setTimeout(function()
       {
        return _this.Cancel();
       },delay);
       _=void(this.pending={
        $:1,
        $0:arg0
       });
      }
     else
      {
       _=null;
      }
     return _;
    },
    get_IsCancellationRequested:function()
    {
     return this.c;
    }
   },{
    CreateLinkedTokenSource:function(t1,t2)
    {
     return CancellationTokenSource.CreateLinkedTokenSource1([t1,t2]);
    },
    CreateLinkedTokenSource1:function(tokens)
    {
     var cts,action;
     cts=CancellationTokenSource.New();
     action=function(t)
     {
      var callback,value;
      callback=function()
      {
       return cts.Cancel();
      };
      value=Concurrency.Register(t,function()
      {
       return callback();
      });
      return;
     };
     return Arrays.iter(action,tokens);
    },
    New:function()
    {
     var r;
     r=Runtime.New(this,{});
     r.c=false;
     r.pending={
      $:0
     };
     r.r=[];
     return r;
    }
   }),
   Char:Runtime.Class({},{
    GetNumericValue:function(c)
    {
     return(c>=48?c<=57:false)?Number(c)-Number(48):-1;
    },
    IsControl:function(c)
    {
     return(c>=0?c<=31:false)?true:c>=128?c<=159:false;
    },
    IsDigit:function(c)
    {
     return c>=48?c<=57:false;
    },
    IsLetter:function(c)
    {
     return(c>=65?c<=90:false)?true:c>=97?c<=122:false;
    },
    IsLetterOrDigit:function(c)
    {
     return Char.IsLetter(c)?true:Char.IsDigit(c);
    },
    IsLower:function(c)
    {
     return c>=97?c<=122:false;
    },
    IsUpper:function(c)
    {
     return c>=65?c<=90:false;
    },
    IsWhiteSpace:function($c)
    {
     var $0=this,$this=this;
     return Global.String.fromCharCode($c).match(/\s/)!==null;
    },
    Parse:function(s)
    {
     return s.length===1?s.charCodeAt(0):Operators.FailWith("String must be exactly one character long.");
    }
   }),
   Concurrency:{
    AwaitEvent:function(e)
    {
     var r;
     r=function(c)
     {
      var sub,sub1,creg,creg1,sub2,creg2;
      sub=function()
      {
       return Util.subscribeTo(e,function(x)
       {
        var action;
        Lazy.Force(sub1).Dispose();
        Lazy.Force(creg1).Dispose();
        action=function()
        {
         return c.k.call(null,{
          $:0,
          $0:x
         });
        };
        return Concurrency.scheduler().Fork(action);
       });
      };
      sub1=Lazy.Create(sub);
      creg=function()
      {
       return Concurrency.Register(c.ct,function()
       {
        var action;
        Lazy.Force(sub1).Dispose();
        action=function()
        {
         return c.k.call(null,{
          $:2,
          $0:new Error("OperationCanceledException")
         });
        };
        return Concurrency.scheduler().Fork(action);
       });
      };
      creg1=Lazy.Create(creg);
      sub2=Lazy.Force(sub1);
      creg2=Lazy.Force(creg1);
      return null;
     };
     return Concurrency.checkCancel(r);
    },
    Bind:function(r,f)
    {
     var r1;
     r1=function(c)
     {
      return r({
       k:function(_arg1)
       {
        var _,x,action,action1;
        if(_arg1.$==0)
         {
          x=_arg1.$0;
          action=function()
          {
           var _1,e;
           try
           {
            _1=(f(x))(c);
           }
           catch(e)
           {
            _1=c.k.call(null,{
             $:1,
             $0:e
            });
           }
           return _1;
          };
          _=Concurrency.scheduler().Fork(action);
         }
        else
         {
          action1=function()
          {
           return c.k.call(null,_arg1);
          };
          _=Concurrency.scheduler().Fork(action1);
         }
        return _;
       },
       ct:c.ct
      });
     };
     return Concurrency.checkCancel(r1);
    },
    Catch:function(r)
    {
     var r1;
     r1=function(c)
     {
      var _,e1;
      try
      {
       _=r({
        k:function(_arg1)
        {
         var _1,x,e;
         if(_arg1.$==0)
          {
           x=_arg1.$0;
           _1=c.k.call(null,{
            $:0,
            $0:{
             $:0,
             $0:x
            }
           });
          }
         else
          {
           if(_arg1.$==1)
            {
             e=_arg1.$0;
             _1=c.k.call(null,{
              $:0,
              $0:{
               $:1,
               $0:e
              }
             });
            }
           else
            {
             _1=c.k.call(null,_arg1);
            }
          }
         return _1;
        },
        ct:c.ct
       });
      }
      catch(e1)
      {
       _=c.k.call(null,{
        $:0,
        $0:{
         $:1,
         $0:e1
        }
       });
      }
      return _;
     };
     return Concurrency.checkCancel(r1);
    },
    Combine:function(a,b)
    {
     return Concurrency.Bind(a,function()
     {
      return b;
     });
    },
    Delay:function(mk)
    {
     var r;
     r=function(c)
     {
      var _,e;
      try
      {
       _=(mk(null))(c);
      }
      catch(e)
      {
       _=c.k.call(null,{
        $:1,
        $0:e
       });
      }
      return _;
     };
     return Concurrency.checkCancel(r);
    },
    For:function(s,b)
    {
     var ie;
     ie=Enumerator.Get(s);
     return Concurrency.While(function()
     {
      return ie.MoveNext();
     },Concurrency.Delay(function()
     {
      return b(ie.get_Current());
     }));
    },
    FromContinuations:function(subscribe)
    {
     var r;
     r=function(c)
     {
      var continued,once;
      continued={
       contents:false
      };
      once=function(cont)
      {
       var _;
       if(continued.contents)
        {
         _=Operators.FailWith("A continuation provided by Async.FromContinuations was invoked multiple times");
        }
       else
        {
         continued.contents=true;
         _=Concurrency.scheduler().Fork(cont);
        }
       return _;
      };
      return subscribe([function(a)
      {
       return once(function()
       {
        return c.k.call(null,{
         $:0,
         $0:a
        });
       });
      },function(e)
      {
       return once(function()
       {
        return c.k.call(null,{
         $:1,
         $0:e
        });
       });
      },function(e)
      {
       return once(function()
       {
        return c.k.call(null,{
         $:2,
         $0:e
        });
       });
      }]);
     };
     return Concurrency.checkCancel(r);
    },
    GetCT:Runtime.Field(function()
    {
     var r;
     r=function(c)
     {
      return c.k.call(null,{
       $:0,
       $0:c.ct
      });
     };
     return Concurrency.checkCancel(r);
    }),
    Ignore:function(r)
    {
     return Concurrency.Bind(r,function()
     {
      return Concurrency.Return(null);
     });
    },
    OnCancel:function(action)
    {
     var r;
     r=function(c)
     {
      return c.k.call(null,{
       $:0,
       $0:Concurrency.Register(c.ct,action)
      });
     };
     return Concurrency.checkCancel(r);
    },
    Parallel:function(cs)
    {
     var cs1,_,r;
     cs1=Arrays.ofSeq(cs);
     if(Arrays.length(cs1)===0)
      {
       _=Concurrency.Return([]);
      }
     else
      {
       r=function(c)
       {
        var n,o,a,accept;
        n=cs1.length;
        o={
         contents:n
        };
        a=Arrays.create(n,undefined);
        accept=function(i)
        {
         return function(x)
         {
          var matchValue,_1,_2,x1,res,_3,x2,n1,res1;
          matchValue=[o.contents,x];
          if(matchValue[0]===0)
           {
            _1=null;
           }
          else
           {
            if(matchValue[0]===1)
             {
              if(matchValue[1].$==0)
               {
                x1=matchValue[1].$0;
                Arrays.set(a,i,x1);
                o.contents=0;
                _2=c.k.call(null,{
                 $:0,
                 $0:a
                });
               }
              else
               {
                matchValue[0];
                res=matchValue[1];
                o.contents=0;
                _2=c.k.call(null,res);
               }
              _1=_2;
             }
            else
             {
              if(matchValue[1].$==0)
               {
                x2=matchValue[1].$0;
                n1=matchValue[0];
                Arrays.set(a,i,x2);
                _3=void(o.contents=n1-1);
               }
              else
               {
                matchValue[0];
                res1=matchValue[1];
                o.contents=0;
                _3=c.k.call(null,res1);
               }
              _1=_3;
             }
           }
          return _1;
         };
        };
        return Arrays.iteri(function(i)
        {
         return function(run)
         {
          var action;
          action=function()
          {
           return run({
            k:accept(i),
            ct:c.ct
           });
          };
          return Concurrency.scheduler().Fork(action);
         };
        },cs1);
       };
       _=Concurrency.checkCancel(r);
      }
     return _;
    },
    Register:function(ct,callback)
    {
     var i;
     i=ct.r.push(callback)-1;
     return{
      Dispose:function()
      {
       return Arrays.set(ct.r,i,function()
       {
       });
      }
     };
    },
    Return:function(x)
    {
     var r;
     r=function(c)
     {
      return c.k.call(null,{
       $:0,
       $0:x
      });
     };
     return Concurrency.checkCancel(r);
    },
    Scheduler:Runtime.Class({
     Fork:function(action)
     {
      var _,value,_this=this;
      this.robin.push(action);
      if(this.idle)
       {
        this.idle=false;
        value=setTimeout(function()
        {
         return _this.tick();
        },0);
        _=void value;
       }
      else
       {
        _=null;
       }
      return _;
     },
     tick:function()
     {
      var t,loop,matchValue,_,_1,value,_this=this;
      t=Date.now();
      loop=true;
      while(loop)
       {
        matchValue=this.robin.length;
        if(matchValue===0)
         {
          this.idle=true;
          _=loop=false;
         }
        else
         {
          (this.robin.shift())(null);
          if(Date.now()-t>40)
           {
            value=setTimeout(function()
            {
             return _this.tick();
            },0);
            _1=loop=false;
           }
          else
           {
            _1=null;
           }
          _=_1;
         }
       }
      return;
     }
    },{
     New:function()
     {
      var r;
      r=Runtime.New(this,{});
      r.idle=true;
      r.robin=[];
      return r;
     }
    }),
    Sleep:function(ms)
    {
     var r;
     r=function(c)
     {
      var pending,pending1,creg,creg1,pending2,creg2;
      pending=function()
      {
       return setTimeout(function()
       {
        var action;
        Lazy.Force(creg1).Dispose();
        action=function()
        {
         return c.k.call(null,{
          $:0,
          $0:null
         });
        };
        return Concurrency.scheduler().Fork(action);
       },ms);
      };
      pending1=Lazy.Create(pending);
      creg=function()
      {
       return Concurrency.Register(c.ct,function()
       {
        var action;
        clearTimeout(Lazy.Force(pending1));
        action=function()
        {
         return c.k.call(null,{
          $:2,
          $0:new Error("OperationCanceledException")
         });
        };
        return Concurrency.scheduler().Fork(action);
       });
      };
      creg1=Lazy.Create(creg);
      pending2=Lazy.Force(pending1);
      creg2=Lazy.Force(creg1);
      return null;
     };
     return Concurrency.checkCancel(r);
    },
    Start:function(c,ctOpt)
    {
     return Concurrency.StartWithContinuations(c,function()
     {
     },function(exn)
     {
      var ps;
      ps=[exn];
      return console?console.log.apply(console,["WebSharper: Uncaught asynchronous exception"].concat(ps)):undefined;
     },function()
     {
     },ctOpt);
    },
    StartChild:function(r)
    {
     var r1;
     r1=function(c)
     {
      var cached,queue,action,r2,r21;
      cached={
       contents:{
        $:0
       }
      };
      queue=[];
      action=function()
      {
       return r({
        k:function(res)
        {
         cached.contents={
          $:1,
          $0:res
         };
         while(queue.length>0)
          {
           (queue.shift())(res);
          }
         return;
        },
        ct:c.ct
       });
      };
      Concurrency.scheduler().Fork(action);
      r2=function(c2)
      {
       var matchValue,_,x;
       matchValue=cached.contents;
       if(matchValue.$==0)
        {
         _=queue.push(c2.k);
        }
       else
        {
         x=matchValue.$0;
         _=c2.k.call(null,x);
        }
       return _;
      };
      r21=Concurrency.checkCancel(r2);
      return c.k.call(null,{
       $:0,
       $0:r21
      });
     };
     return Concurrency.checkCancel(r1);
    },
    StartWithContinuations:function(c,s,f,cc,ctOpt)
    {
     var ct,action;
     ct=Operators.DefaultArg(ctOpt,Concurrency.defCTS().contents);
     action=function()
     {
      return c({
       k:function(_arg1)
       {
        var _,e,e1,x;
        if(_arg1.$==1)
         {
          e=_arg1.$0;
          _=f(e);
         }
        else
         {
          if(_arg1.$==2)
           {
            e1=_arg1.$0;
            _=cc(e1);
           }
          else
           {
            x=_arg1.$0;
            _=s(x);
           }
         }
        return _;
       },
       ct:ct
      });
     };
     return Concurrency.scheduler().Fork(action);
    },
    TryCancelled:function(run,comp)
    {
     var r;
     r=function(c)
     {
      return run({
       k:function(_arg1)
       {
        var _,e;
        if(_arg1.$==2)
         {
          e=_arg1.$0;
          comp(e);
          _=c.k.call(null,_arg1);
         }
        else
         {
          _=c.k.call(null,_arg1);
         }
        return _;
       },
       ct:c.ct
      });
     };
     return Concurrency.checkCancel(r);
    },
    TryFinally:function(run,f)
    {
     var r;
     r=function(c)
     {
      return run({
       k:function(r1)
       {
        var _,e;
        try
        {
         f(null);
         _=c.k.call(null,r1);
        }
        catch(e)
        {
         _=c.k.call(null,{
          $:1,
          $0:e
         });
        }
        return _;
       },
       ct:c.ct
      });
     };
     return Concurrency.checkCancel(r);
    },
    TryWith:function(r,f)
    {
     var r1;
     r1=function(c)
     {
      return r({
       k:function(_arg1)
       {
        var _,x,e,_1,e1;
        if(_arg1.$==0)
         {
          x=_arg1.$0;
          _=c.k.call(null,{
           $:0,
           $0:x
          });
         }
        else
         {
          if(_arg1.$==1)
           {
            e=_arg1.$0;
            try
            {
             _1=(f(e))(c);
            }
            catch(e1)
            {
             _1=c.k.call(null,_arg1);
            }
            _=_1;
           }
          else
           {
            _=c.k.call(null,_arg1);
           }
         }
        return _;
       },
       ct:c.ct
      });
     };
     return Concurrency.checkCancel(r1);
    },
    Using:function(x,f)
    {
     return Concurrency.TryFinally(f(x),function()
     {
      return x.Dispose();
     });
    },
    While:function(g,c)
    {
     return g(null)?Concurrency.Bind(c,function()
     {
      return Concurrency.While(g,c);
     }):Concurrency.Return(null);
    },
    checkCancel:function(r)
    {
     return function(c)
     {
      return c.ct.c?c.k.call(null,{
       $:2,
       $0:new Error("OperationCanceledException")
      }):r(c);
     };
    },
    defCTS:Runtime.Field(function()
    {
     return{
      contents:CancellationTokenSource.New()
     };
    }),
    scheduler:Runtime.Field(function()
    {
     return Scheduler.New();
    })
   },
   Control:{
    createEvent:function(add,remove,create)
    {
     return{
      AddHandler:add,
      RemoveHandler:remove,
      Subscribe:function(r)
      {
       var h;
       h=create(function()
       {
        return function(args)
        {
         return r.OnNext.call(null,args);
        };
       });
       add(h);
       return{
        Dispose:function()
        {
         return remove(h);
        }
       };
      }
     };
    }
   },
   DateTimeHelpers:{
    AddMonths:function(d,months)
    {
     var e;
     e=new Date(d);
     return(new Date(e.getFullYear(),e.getMonth()+months,e.getDate(),e.getHours(),e.getMinutes(),e.getSeconds(),e.getMilliseconds())).getTime();
    },
    AddYears:function(d,years)
    {
     var e;
     e=new Date(d);
     return(new Date(e.getFullYear()+years,e.getMonth(),e.getDate(),e.getHours(),e.getMinutes(),e.getSeconds(),e.getMilliseconds())).getTime();
    },
    DatePortion:function(d)
    {
     var e;
     e=new Date(d);
     return(new Date(e.getFullYear(),e.getMonth(),e.getDate())).getTime();
    },
    TimePortion:function(d)
    {
     var e;
     e=new Date(d);
     return(((24*0+e.getHours())*60+e.getMinutes())*60+e.getSeconds())*1000+e.getMilliseconds();
    }
   },
   Enumerable:{
    Of:function(getEnumerator)
    {
     return{
      GetEnumerator:getEnumerator
     };
    }
   },
   Enumerator:{
    Get:function(x)
    {
     var _,next,_2,next1;
     if(x instanceof Global.Array)
      {
       next=function(e)
       {
        var i,_1,v,v1;
        i=e.s;
        if(i<Arrays.length(x))
         {
          v=Arrays.get(x,i);
          e.c=v;
          v1=i+1;
          e.s=v1;
          _1=true;
         }
        else
         {
          _1=false;
         }
        return _1;
       };
       _=T.New(0,null,next);
      }
     else
      {
       if(Unchecked.Equals(typeof x,"string"))
        {
         next1=function(e)
         {
          var i,_1,v,v1;
          i=e.s;
          if(i<x.length)
           {
            v=x.charCodeAt(i);
            e.c=v;
            v1=i+1;
            e.s=v1;
            _1=true;
           }
          else
           {
            _1=false;
           }
          return _1;
         };
         _2=T.New(0,null,next1);
        }
       else
        {
         _2=x.GetEnumerator();
        }
       _=_2;
      }
     return _;
    },
    T:Runtime.Class({
     MoveNext:function()
     {
      return this.n.call(null,this);
     },
     get_Current:function()
     {
      return this.c;
     }
    },{
     New:function(s,c,n)
     {
      var r;
      r=Runtime.New(this,{});
      r.s=s;
      r.c=c;
      r.n=n;
      return r;
     }
    })
   },
   Guid:Runtime.Class({},{
    NewGuid:function()
    {
     var $0=this,$this=this;
     return"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,function(c)
     {
      var r=Global.Math.random()*16|0,v=c=="x"?r:r&0x3|0x8;
      return v.toString(16);
     });
    }
   }),
   Html:{
    Client:{
     Activator:{
      Activate:Runtime.Field(function()
      {
       var _,meta;
       if(Activator.hasDocument())
        {
         meta=document.getElementById("websharper-data");
         _=meta?jQuery(document).ready(function()
         {
          var text,obj,action,array;
          text=meta.getAttribute("content");
          obj=Json.Activate(JSON.parse(text));
          action=function(tupledArg)
          {
           var k,v,p,old;
           k=tupledArg[0];
           v=tupledArg[1];
           p=v.get_Body();
           old=document.getElementById(k);
           return p.ReplaceInDom(old);
          };
          array=JSModule.GetFields(obj);
          return Arrays.iter(action,array);
         }):null;
        }
       else
        {
         _=null;
        }
       return _;
      }),
      hasDocument:function()
      {
       var $0=this,$this=this;
       return typeof Global.document!=="undefined";
      }
     },
     HtmlContentExtensions:{
      "IControlBody.SingleNode.Static":function(node)
      {
       return SingleNode.New(node);
      },
      SingleNode:Runtime.Class({
       ReplaceInDom:function(old)
       {
        var value;
        value=this.node.parentNode.replaceChild(this.node,old);
        return;
       }
      },{
       New:function(node)
       {
        var r;
        r=Runtime.New(this,{});
        r.node=node;
        return r;
       }
      })
     }
    }
   },
   JavaScript:{
    JSModule:{
     Delete:function($x,$field)
     {
      var $0=this,$this=this;
      return delete $x[$field];
     },
     ForEach:function($x,$iter)
     {
      var $0=this,$this=this;
      for(var k in $x){
       if($iter(k))
        break;
      }
     },
     GetFieldNames:function($o)
     {
      var $0=this,$this=this;
      var r=[];
      for(var k in $o)r.push(k);
      return r;
     },
     GetFieldValues:function($o)
     {
      var $0=this,$this=this;
      var r=[];
      for(var k in $o)r.push($o[k]);
      return r;
     },
     GetFields:function($o)
     {
      var $0=this,$this=this;
      var r=[];
      for(var k in $o)r.push([k,$o[k]]);
      return r;
     },
     Log:function($x)
     {
      var $0=this,$this=this;
      if(Global.console)
       Global.console.log($x);
     },
     LogMore:function($args)
     {
      var $0=this,$this=this;
      if(Global.console)
       Global.console.log.apply(Global.console,$args);
     }
    },
    Pervasives:{
     NewFromList:function(fields)
     {
      var r,enumerator,forLoopVar,v,k;
      r={};
      enumerator=Enumerator.Get(fields);
      while(enumerator.MoveNext())
       {
        forLoopVar=enumerator.get_Current();
        v=forLoopVar[1];
        k=forLoopVar[0];
        r[k]=v;
       }
      return r;
     }
    }
   },
   Json:{
    Activate:function(json)
    {
     var types,i,decode;
     types=json.$TYPES;
     for(i=0;i<=Arrays.length(types)-1;i++){
      Arrays.set(types,i,Json.lookup(Arrays.get(types,i)));
     }
     decode=function(x)
     {
      var _,matchValue,_1,_2,o,ti;
      if(Unchecked.Equals(x,null))
       {
        _=x;
       }
      else
       {
        matchValue=typeof x;
        if(matchValue==="object")
         {
          if(x instanceof Global.Array)
           {
            _2=Json.shallowMap(decode,x);
           }
          else
           {
            o=Json.shallowMap(decode,x.$V);
            ti=x.$T;
            _2=Unchecked.Equals(typeof ti,"undefined")?o:Json.restore(Arrays.get(types,ti),o);
           }
          _1=_2;
         }
        else
         {
          _1=x;
         }
        _=_1;
       }
      return _;
     };
     return decode(json.$DATA);
    },
    lookup:function(x)
    {
     var k,r,i,n,rn,_;
     k=Arrays.length(x);
     r=Global;
     i=0;
     while(i<k)
      {
       n=Arrays.get(x,i);
       rn=r[n];
       if(!Unchecked.Equals(typeof rn,undefined))
        {
         r=rn;
         _=i=i+1;
        }
       else
        {
         _=Operators.FailWith("Invalid server reply. Failed to find type: "+n);
        }
      }
     return r;
    },
    restore:function(ty,obj)
    {
     var r;
     r=new ty();
     JSModule.ForEach(obj,function(k)
     {
      r[k]=obj[k];
      return false;
     });
     return r;
    },
    shallowMap:function(f,x)
    {
     var _,matchValue,_1,r;
     if(x instanceof Global.Array)
      {
       _=Arrays.map(f,x);
      }
     else
      {
       matchValue=typeof x;
       if(matchValue==="object")
        {
         r={};
         JSModule.ForEach(x,function(y)
         {
          r[y]=f(x[y]);
          return false;
         });
         _1=r;
        }
       else
        {
         _1=x;
        }
       _=_1;
      }
     return _;
    }
   },
   Lazy:{
    Create:function(f)
    {
     var x,get;
     x={
      value:undefined,
      created:false,
      eval:f
     };
     get=function()
     {
      var _;
      if(x.created)
       {
        _=x.value;
       }
      else
       {
        x.created=true;
        x.value=f(null);
        _=x.value;
       }
      return _;
     };
     x.eval=get;
     return x;
    },
    CreateFromValue:function(v)
    {
     return{
      value:v,
      created:true,
      eval:function()
      {
       return v;
      },
      eval:function()
      {
       return v;
      }
     };
    },
    Force:function(x)
    {
     return x.eval.call(null,null);
    }
   },
   List:{
    T:Runtime.Class({
     GetEnumerator:function()
     {
      var next;
      next=function(e)
      {
       var matchValue,_,xs,x;
       matchValue=e.s;
       if(matchValue.$==0)
        {
         _=false;
        }
       else
        {
         xs=matchValue.$1;
         x=matchValue.$0;
         e.c=x;
         e.s=xs;
         _=true;
        }
       return _;
      };
      return T.New(this,null,next);
     },
     get_Item:function(x)
     {
      return Seq.nth(x,this);
     },
     get_Length:function()
     {
      return Seq.length(this);
     }
    },{
     Construct:function(head,tail)
     {
      return Runtime.New(T1,{
       $:1,
       $0:head,
       $1:tail
      });
     },
     get_Nil:function()
     {
      return Runtime.New(T1,{
       $:0
      });
     }
    }),
    append:function(x,y)
    {
     return List.ofSeq(Seq.append(x,y));
    },
    choose:function(f,l)
    {
     return List.ofSeq(Seq.choose(f,l));
    },
    collect:function(f,l)
    {
     return List.ofSeq(Seq.collect(f,l));
    },
    concat:function(s)
    {
     return List.ofSeq(Seq.concat(s));
    },
    exists2:function(p,l1,l2)
    {
     return Arrays.exists2(p,Arrays.ofSeq(l1),Arrays.ofSeq(l2));
    },
    filter:function(p,l)
    {
     return List.ofSeq(Seq.filter(p,l));
    },
    fold2:function(f,s,l1,l2)
    {
     return Arrays.fold2(f,s,Arrays.ofSeq(l1),Arrays.ofSeq(l2));
    },
    foldBack:function(f,l,s)
    {
     return Arrays.foldBack(f,Arrays.ofSeq(l),s);
    },
    foldBack2:function(f,l1,l2,s)
    {
     return Arrays.foldBack2(f,Arrays.ofSeq(l1),Arrays.ofSeq(l2),s);
    },
    forall2:function(p,l1,l2)
    {
     return Arrays.forall2(p,Arrays.ofSeq(l1),Arrays.ofSeq(l2));
    },
    head:function(l)
    {
     var _,h;
     if(l.$==1)
      {
       h=l.$0;
       _=h;
      }
     else
      {
       _=Operators.FailWith("The input list was empty.");
      }
     return _;
    },
    init:function(s,f)
    {
     return List.ofArray(Arrays.init(s,f));
    },
    iter2:function(f,l1,l2)
    {
     return Arrays.iter2(f,Arrays.ofSeq(l1),Arrays.ofSeq(l2));
    },
    iteri2:function(f,l1,l2)
    {
     return Arrays.iteri2(f,Arrays.ofSeq(l1),Arrays.ofSeq(l2));
    },
    map:function(f,l)
    {
     return List.ofSeq(Seq.map(f,l));
    },
    map2:function(f,l1,l2)
    {
     return List.ofArray(Arrays.map2(f,Arrays.ofSeq(l1),Arrays.ofSeq(l2)));
    },
    map3:function(f,l1,l2,l3)
    {
     var array;
     array=Arrays.map2(function(func)
     {
      return function(arg1)
      {
       return func(arg1);
      };
     },Arrays.map2(f,Arrays.ofSeq(l1),Arrays.ofSeq(l2)),Arrays.ofSeq(l3));
     return List.ofArray(array);
    },
    mapi:function(f,l)
    {
     return List.ofSeq(Seq.mapi(f,l));
    },
    mapi2:function(f,l1,l2)
    {
     return List.ofArray(Arrays.mapi2(f,Arrays.ofSeq(l1),Arrays.ofSeq(l2)));
    },
    max:function(l)
    {
     return Seq.reduce(function(e1)
     {
      return function(e2)
      {
       return Operators.Max(e1,e2);
      };
     },l);
    },
    maxBy:function(f,l)
    {
     return Seq.reduce(function(x)
     {
      return function(y)
      {
       return Unchecked.Compare(f(x),f(y))===1?x:y;
      };
     },l);
    },
    min:function(l)
    {
     return Seq.reduce(function(e1)
     {
      return function(e2)
      {
       return Operators.Min(e1,e2);
      };
     },l);
    },
    minBy:function(f,l)
    {
     return Seq.reduce(function(x)
     {
      return function(y)
      {
       return Unchecked.Compare(f(x),f(y))===-1?x:y;
      };
     },l);
    },
    ofArray:function(arr)
    {
     var r,i;
     r=Runtime.New(T1,{
      $:0
     });
     for(i=0;i<=Arrays.length(arr)-1;i++){
      r=Runtime.New(T1,{
       $:1,
       $0:Arrays.get(arr,Arrays.length(arr)-i-1),
       $1:r
      });
     }
     return r;
    },
    ofSeq:function(s)
    {
     var r,e,x;
     r=[];
     e=Enumerator.Get(s);
     while(e.MoveNext())
      {
       r.unshift(e.get_Current());
      }
     x=r.slice(0);
     x.reverse();
     return List.ofArray(x);
    },
    partition:function(p,l)
    {
     var patternInput,b,a;
     patternInput=Arrays.partition(p,Arrays.ofSeq(l));
     b=patternInput[1];
     a=patternInput[0];
     return[List.ofArray(a),List.ofArray(b)];
    },
    permute:function(f,l)
    {
     return List.ofArray(Arrays.permute(f,Arrays.ofSeq(l)));
    },
    reduceBack:function(f,l)
    {
     return Arrays.reduceBack(f,Arrays.ofSeq(l));
    },
    replicate:function(size,value)
    {
     return List.ofArray(Arrays.create(size,value));
    },
    rev:function(l)
    {
     var a;
     a=Arrays.ofSeq(l);
     a.reverse();
     return List.ofArray(a);
    },
    scan:function(f,s,l)
    {
     return List.ofSeq(Seq.scan(f,s,l));
    },
    scanBack:function(f,l,s)
    {
     return List.ofArray(Arrays.scanBack(f,Arrays.ofSeq(l),s));
    },
    sort:function(l)
    {
     var a;
     a=Arrays.ofSeq(l);
     Arrays.sortInPlace(a);
     return List.ofArray(a);
    },
    sortBy:function(f,l)
    {
     return List.sortWith(function(x)
     {
      return function(y)
      {
       return Operators.Compare(f(x),f(y));
      };
     },l);
    },
    sortWith:function(f,l)
    {
     var a;
     a=Arrays.ofSeq(l);
     Arrays.sortInPlaceWith(f,a);
     return List.ofArray(a);
    },
    tail:function(l)
    {
     var _,t;
     if(l.$==1)
      {
       t=l.$1;
       _=t;
      }
     else
      {
       _=Operators.FailWith("The input list was empty.");
      }
     return _;
    },
    unzip:function(l)
    {
     var x,y,enumerator,forLoopVar,b,a;
     x=[];
     y=[];
     enumerator=Enumerator.Get(l);
     while(enumerator.MoveNext())
      {
       forLoopVar=enumerator.get_Current();
       b=forLoopVar[1];
       a=forLoopVar[0];
       x.push(a);
       y.push(b);
      }
     return[List.ofArray(x.slice(0)),List.ofArray(y.slice(0))];
    },
    unzip3:function(l)
    {
     var x,y,z,enumerator,forLoopVar,c,b,a;
     x=[];
     y=[];
     z=[];
     enumerator=Enumerator.Get(l);
     while(enumerator.MoveNext())
      {
       forLoopVar=enumerator.get_Current();
       c=forLoopVar[2];
       b=forLoopVar[1];
       a=forLoopVar[0];
       x.push(a);
       y.push(b);
       z.push(c);
      }
     return[List.ofArray(x.slice(0)),List.ofArray(y.slice(0)),List.ofArray(z.slice(0))];
    },
    zip:function(l1,l2)
    {
     return List.ofArray(Arrays.zip(Arrays.ofSeq(l1),Arrays.ofSeq(l2)));
    },
    zip3:function(l1,l2,l3)
    {
     return List.ofArray(Arrays.zip3(Arrays.ofSeq(l1),Arrays.ofSeq(l2),Arrays.ofSeq(l3)));
    }
   },
   Operators:{
    Compare:function(a,b)
    {
     return Unchecked.Compare(a,b);
    },
    Decrement:function(x)
    {
     x.contents=x.contents-1;
    },
    DefaultArg:function(x,d)
    {
     var _,x1;
     if(x.$==0)
      {
       _=d;
      }
     else
      {
       x1=x.$0;
       _=x1;
      }
     return _;
    },
    FailWith:function(msg)
    {
     return Operators.Raise(new Error(msg));
    },
    Increment:function(x)
    {
     x.contents=x.contents+1;
    },
    KeyValue:function(kvp)
    {
     return[kvp.K,kvp.V];
    },
    Max:function(a,b)
    {
     return Unchecked.Compare(a,b)===1?a:b;
    },
    Min:function(a,b)
    {
     return Unchecked.Compare(a,b)===-1?a:b;
    },
    Pown:function(a,n)
    {
     var p;
     p=function(n1)
     {
      var _,_1,b;
      if(n1===1)
       {
        _=a;
       }
      else
       {
        if(n1%2===0)
         {
          b=p(n1/2>>0);
          _1=b*b;
         }
        else
         {
          _1=a*p(n1-1);
         }
        _=_1;
       }
      return _;
     };
     return p(n);
    },
    Raise:function($e)
    {
     var $0=this,$this=this;
     throw $e;
    },
    Sign:function(x)
    {
     return x===0?0:x<0?-1:1;
    },
    Truncate:function(x)
    {
     return x<0?Math.ceil(x):Math.floor(x);
    },
    Using:function(t,f)
    {
     var _;
     try
     {
      _=f(t);
     }
     finally
     {
      t.Dispose();
     }
     return _;
    },
    range:function(min,max)
    {
     return Seq.init(1+max-min,function(x)
     {
      return x+min;
     });
    },
    step:function(min,step,max)
    {
     var s,predicate,source,x;
     s=Operators.Sign(step);
     predicate=function(k)
     {
      return s*(max-k)>=0;
     };
     source=Seq.initInfinite(function(k)
     {
      return min+k*step;
     });
     x=Seq.takeWhile(predicate,source);
     return x;
    }
   },
   Option:{
    bind:function(f,x)
    {
     var _,x1;
     if(x.$==0)
      {
       _={
        $:0
       };
      }
     else
      {
       x1=x.$0;
       _=f(x1);
      }
     return _;
    },
    exists:function(p,x)
    {
     var _,x1;
     if(x.$==0)
      {
       _=false;
      }
     else
      {
       x1=x.$0;
       _=p(x1);
      }
     return _;
    },
    fold:function(f,s,x)
    {
     var _,x1;
     if(x.$==0)
      {
       _=s;
      }
     else
      {
       x1=x.$0;
       _=(f(s))(x1);
      }
     return _;
    },
    foldBack:function(f,x,s)
    {
     var _,x1;
     if(x.$==0)
      {
       _=s;
      }
     else
      {
       x1=x.$0;
       _=(f(x1))(s);
      }
     return _;
    },
    forall:function(p,x)
    {
     var _,x1;
     if(x.$==0)
      {
       _=true;
      }
     else
      {
       x1=x.$0;
       _=p(x1);
      }
     return _;
    },
    iter:function(p,x)
    {
     var _,x1;
     if(x.$==0)
      {
       _=null;
      }
     else
      {
       x1=x.$0;
       _=p(x1);
      }
     return _;
    },
    map:function(f,x)
    {
     var _,x1;
     if(x.$==0)
      {
       _={
        $:0
       };
      }
     else
      {
       x1=x.$0;
       _={
        $:1,
        $0:f(x1)
       };
      }
     return _;
    },
    toArray:function(x)
    {
     var _,x1;
     if(x.$==0)
      {
       _=[];
      }
     else
      {
       x1=x.$0;
       _=[x1];
      }
     return _;
    },
    toList:function(x)
    {
     var _,x1;
     if(x.$==0)
      {
       _=Runtime.New(T1,{
        $:0
       });
      }
     else
      {
       x1=x.$0;
       _=List.ofArray([x1]);
      }
     return _;
    }
   },
   PrintfHelpers:{
    padNumLeft:function(s,l)
    {
     var f,_,_this,i;
     f=Arrays.get(s,0);
     if((f===" "?true:f==="+")?true:f==="-")
      {
       _this=s.substr(1);
       i=l-1;
       _=f+Strings.PadLeftWith(_this,i,48);
      }
     else
      {
       _=Strings.PadLeftWith(s,l,48);
      }
     return _;
    },
    plusForPos:function(n,s)
    {
     return 0<=n?"+"+s:s;
    },
    plusForPos0:function(n,s)
    {
     return 0<=n?"+"+s:s;
    },
    prettyPrint:function(o)
    {
     var printObject,t,_1,_2,_3,mapping1,strings1;
     printObject=function(o1)
     {
      var s,_,mapping,array,strings;
      s=Global.String(o1);
      if(s==="[object Object]")
       {
        mapping=function(tupledArg)
        {
         var k,v;
         k=tupledArg[0];
         v=tupledArg[1];
         return k+" = "+PrintfHelpers.prettyPrint(v);
        };
        array=JSModule.GetFields(o1);
        strings=Arrays.map(mapping,array);
        _="{"+Strings.concat("; ",strings)+"}";
       }
      else
       {
        _=s;
       }
      return _;
     };
     t=typeof o;
     if(t=="string")
      {
       _1="\""+o+"\"";
      }
     else
      {
       if(t=="object")
        {
         if(o instanceof Global.Array)
          {
           mapping1=function(o1)
           {
            return PrintfHelpers.prettyPrint(o1);
           };
           strings1=Arrays.map(mapping1,o);
           _3="[|"+Strings.concat("; ",strings1)+"|]";
          }
         else
          {
           _3=printObject(o);
          }
         _2=_3;
        }
       else
        {
         _2=Global.String(o);
        }
       _1=_2;
      }
     return _1;
    },
    printArray:function(p,o)
    {
     var strings;
     strings=Arrays.map(p,o);
     return"[|"+Strings.concat("; ",strings)+"|]";
    },
    printArray2D:function(p,o)
    {
     var strings;
     strings=Seq.delay(function()
     {
      var l2;
      l2=o.length?o[0].length:0;
      return Seq.map(function(i)
      {
       var strings1;
       strings1=Seq.delay(function()
       {
        return Seq.map(function(j)
        {
         return p(Arrays.get2D(o,i,j));
        },Operators.range(0,l2-1));
       });
       return Strings.concat("; ",strings1);
      },Operators.range(0,o.length-1));
     });
     return"[["+Strings.concat("][",strings)+"]]";
    },
    printList:function(p,o)
    {
     var strings;
     strings=Seq.map(p,o);
     return"["+Strings.concat("; ",strings)+"]";
    },
    spaceForPos:function(n,s)
    {
     return 0<=n?" "+s:s;
    },
    toSafe:function(s)
    {
     return s==null?"":s;
    }
   },
   Queue:{
    Clear:function(a)
    {
     return a.splice(0,Arrays.length(a));
    },
    Contains:function(a,el)
    {
     return Seq.exists(function(y)
     {
      return Unchecked.Equals(el,y);
     },a);
    },
    CopyTo:function(a,array,index)
    {
     return Arrays.blit(a,0,array,index,Arrays.length(a));
    }
   },
   Random:Runtime.Class({
    Next:function()
    {
     return Math.floor(Math.random()*2147483648);
    },
    Next1:function(maxValue)
    {
     return maxValue<0?Operators.FailWith("'maxValue' must be greater than zero."):Math.floor(Math.random()*maxValue);
    },
    Next2:function(minValue,maxValue)
    {
     var _,maxValue1;
     if(minValue>maxValue)
      {
       _=Operators.FailWith("'minValue' cannot be greater than maxValue.");
      }
     else
      {
       maxValue1=maxValue-minValue;
       _=minValue+Math.floor(Math.random()*maxValue1);
      }
     return _;
    },
    NextBytes:function(buffer)
    {
     var i;
     for(i=0;i<=Arrays.length(buffer)-1;i++){
      Arrays.set(buffer,i,Math.floor(Math.random()*256));
     }
     return;
    }
   },{
    New:function()
    {
     return Runtime.New(this,{});
    }
   }),
   Remoting:{
    AjaxProvider:Runtime.Field(function()
    {
     return XhrProvider.New();
    }),
    AjaxRemotingProvider:Runtime.Class({},{
     Async:function(m,data)
     {
      var headers,payload,f;
      headers=Remoting.makeHeaders(m);
      payload=Remoting.makePayload(data);
      f=function()
      {
       var x,f1;
       x=AsyncProxy.get_CancellationToken();
       f1=function(_arg1)
       {
        var callback,x2;
        callback=function(tupledArg)
        {
         var ok,err,cc,waiting,callback1,reg,ok1,err1,arg00;
         ok=tupledArg[0];
         err=tupledArg[1];
         cc=tupledArg[2];
         waiting={
          contents:true
         };
         callback1=function()
         {
          var _;
          if(waiting.contents)
           {
            waiting.contents=false;
            _=cc(new Error("OperationCanceledException"));
           }
          else
           {
            _=null;
           }
          return _;
         };
         reg=Concurrency.Register(_arg1,function()
         {
          return callback1();
         });
         ok1=function(x1)
         {
          var _;
          if(waiting.contents)
           {
            waiting.contents=false;
            reg.Dispose();
            _=ok(Json.Activate(JSON.parse(x1)));
           }
          else
           {
            _=null;
           }
          return _;
         };
         err1=function(e)
         {
          var _;
          if(waiting.contents)
           {
            waiting.contents=false;
            reg.Dispose();
            _=err(e);
           }
          else
           {
            _=null;
           }
          return _;
         };
         arg00=Remoting.EndPoint();
         return Remoting.AjaxProvider().Async(arg00,headers,payload,ok1,err1);
        };
        x2=Concurrency.FromContinuations(callback);
        return x2;
       };
       return Concurrency.Bind(x,f1);
      };
      return Concurrency.Delay(f);
     },
     Send:function(m,data)
     {
      var computation,computation1,t;
      computation=AjaxRemotingProvider.Async(m,data);
      computation1=Concurrency.Ignore(computation);
      t={
       $:0
      };
      return Concurrency.Start(computation1,t);
     },
     Sync:function(m,data)
     {
      var arg00,arg10,arg20,data1;
      arg00=Remoting.EndPoint();
      arg10=Remoting.makeHeaders(m);
      arg20=Remoting.makePayload(data);
      data1=Remoting.AjaxProvider().Sync(arg00,arg10,arg20);
      return Json.Activate(JSON.parse(data1));
     }
    }),
    EndPoint:Runtime.Field(function()
    {
     return"?";
    }),
    UseHttps:function()
    {
     var _,_this,_1,_this1,_2,matchValue;
     try
     {
      _this=window.location.href;
      if(!Strings.StartsWith(_this,"https://"))
       {
        _this1=window.location.href;
        _2=Strings.Replace(_this1,"http://","https://");
        Remoting.EndPoint=function()
        {
         return _2;
        };
        _1=true;
       }
      else
       {
        _1=false;
       }
      _=_1;
     }
     catch(matchValue)
     {
      _=false;
     }
     return _;
    },
    XhrProvider:Runtime.Class({
     Async:function(url,headers,data,ok,err)
     {
      return Remoting.ajax(true,url,headers,data,ok,err);
     },
     Sync:function(url,headers,data)
     {
      var res;
      res={
       contents:undefined
      };
      Remoting.ajax(false,url,headers,data,function(x)
      {
       res.contents=x;
      },function(e)
      {
       return Operators.Raise(e);
      });
      return res.contents;
     }
    },{
     New:function()
     {
      return Runtime.New(this,{});
     }
    }),
    ajax:function($async,$url,$headers,$data,$ok,$err)
    {
     var $0=this,$this=this;
     var xhr=new Global.XMLHttpRequest();
     xhr.open("POST",$url,$async);
     if($async==true)
      {
       xhr.withCredentials=true;
      }
     for(var h in $headers){
      xhr.setRequestHeader(h,$headers[h]);
     }
     function k()
     {
      if(xhr.status==200)
       {
        $ok(xhr.responseText);
       }
      else
       {
        var msg="Response status is not 200: ";
        $err(new Global.Error(msg+xhr.status));
       }
     }
     if("onload"in xhr)
      {
       xhr.onload=xhr.onerror=xhr.onabort=k;
      }
     else
      {
       xhr.onreadystatechange=function()
       {
        if(xhr.readyState==4)
         {
          k();
         }
       };
      }
     xhr.send($data);
    },
    makeHeaders:function(m)
    {
     var headers;
     headers={};
     headers["content-type"]="application/json";
     headers["x-websharper-rpc"]=m;
     return headers;
    },
    makePayload:function(data)
    {
     return JSON.stringify(data);
    }
   },
   Seq:{
    append:function(s1,s2)
    {
     return Enumerable.Of(function()
     {
      var e1,next;
      e1=Enumerator.Get(s1);
      next=function(x)
      {
       var _,v,_1,e2,_2,v1;
       if(x.s.MoveNext())
        {
         v=x.s.get_Current();
         x.c=v;
         _=true;
        }
       else
        {
         if(x.s===e1)
          {
           e2=Enumerator.Get(s2);
           x.s=e2;
           if(e2.MoveNext())
            {
             v1=e2.get_Current();
             x.c=v1;
             _2=true;
            }
           else
            {
             _2=false;
            }
           _1=_2;
          }
         else
          {
           _1=false;
          }
         _=_1;
        }
       return _;
      };
      return T.New(e1,null,next);
     });
    },
    average:function(s)
    {
     var patternInput,sum,count;
     patternInput=Seq.fold(function(tupledArg)
     {
      var n,s1;
      n=tupledArg[0];
      s1=tupledArg[1];
      return function(x)
      {
       return[n+1,s1+x];
      };
     },[0,0],s);
     sum=patternInput[1];
     count=patternInput[0];
     return sum/count;
    },
    averageBy:function(f,s)
    {
     var patternInput,sum,count;
     patternInput=Seq.fold(function(tupledArg)
     {
      var n,s1;
      n=tupledArg[0];
      s1=tupledArg[1];
      return function(x)
      {
       return[n+1,s1+f(x)];
      };
     },[0,0],s);
     sum=patternInput[1];
     count=patternInput[0];
     return sum/count;
    },
    cache:function(s)
    {
     var cache,_enum,getEnumerator;
     cache=[];
     _enum=Enumerator.Get(s);
     getEnumerator=function()
     {
      var next;
      next=function(e)
      {
       var _,v,v1,_1,v2,v3;
       if(e.s+1<cache.length)
        {
         v=e.s+1;
         e.s=v;
         v1=cache[e.s];
         e.c=v1;
         _=true;
        }
       else
        {
         if(_enum.MoveNext())
          {
           v2=e.s+1;
           e.s=v2;
           v3=_enum.get_Current();
           e.c=v3;
           cache.push(e.get_Current());
           _1=true;
          }
         else
          {
           _1=false;
          }
         _=_1;
        }
       return _;
      };
      return T.New(0,null,next);
     };
     return Enumerable.Of(getEnumerator);
    },
    choose:function(f,s)
    {
     var mapping;
     mapping=function(x)
     {
      var matchValue,_,v;
      matchValue=f(x);
      if(matchValue.$==0)
       {
        _=Runtime.New(T1,{
         $:0
        });
       }
      else
       {
        v=matchValue.$0;
        _=List.ofArray([v]);
       }
      return _;
     };
     return Seq.collect(mapping,s);
    },
    collect:function(f,s)
    {
     return Seq.concat(Seq.map(f,s));
    },
    compareWith:function(f,s1,s2)
    {
     var e1,e2,r,loop,matchValue;
     e1=Enumerator.Get(s1);
     e2=Enumerator.Get(s2);
     r=0;
     loop=true;
     while(loop?r===0:false)
      {
       matchValue=[e1.MoveNext(),e2.MoveNext()];
       matchValue[0]?matchValue[1]?r=(f(e1.get_Current()))(e2.get_Current()):r=1:matchValue[1]?r=-1:loop=false;
      }
     return r;
    },
    concat:function(ss)
    {
     return Enumerable.Of(function()
     {
      var outerE,next;
      outerE=Enumerator.Get(ss);
      next=function(st)
      {
       var matchValue,_,_1,v,_2,v1;
       matchValue=st.s;
       if(Unchecked.Equals(matchValue,null))
        {
         if(outerE.MoveNext())
          {
           v=Enumerator.Get(outerE.get_Current());
           st.s=v;
           _1=next(st);
          }
         else
          {
           _1=false;
          }
         _=_1;
        }
       else
        {
         if(matchValue.MoveNext())
          {
           v1=matchValue.get_Current();
           st.c=v1;
           _2=true;
          }
         else
          {
           st.s=null;
           _2=next(st);
          }
         _=_2;
        }
       return _;
      };
      return T.New(null,null,next);
     });
    },
    countBy:function(f,s)
    {
     var generator;
     generator=function()
     {
      var d,e,keys,k,h,_,mapping,array,x;
      d={};
      e=Enumerator.Get(s);
      keys=[];
      while(e.MoveNext())
       {
        k=f(e.get_Current());
        h=Unchecked.Hash(k);
        if(d.hasOwnProperty(h))
         {
          _=void(d[h]=d[h]+1);
         }
        else
         {
          keys.push(k);
          _=void(d[h]=1);
         }
       }
      mapping=function(k1)
      {
       return[k1,d[Unchecked.Hash(k1)]];
      };
      array=keys.slice(0);
      x=Arrays.map(mapping,array);
      return x;
     };
     return Seq.delay(generator);
    },
    delay:function(f)
    {
     return Enumerable.Of(function()
     {
      return Enumerator.Get(f(null));
     });
    },
    distinct:function(s)
    {
     return Seq.distinctBy(function(x)
     {
      return x;
     },s);
    },
    distinctBy:function(f,s)
    {
     var getEnumerator;
     getEnumerator=function()
     {
      var _enum,seen,next;
      _enum=Enumerator.Get(s);
      seen={};
      next=function(e)
      {
       var _,cur,h,check,has,_1,v;
       if(_enum.MoveNext())
        {
         cur=_enum.get_Current();
         h=function(c)
         {
          var x;
          x=f(c);
          return Unchecked.Hash(x);
         };
         check=function(c)
         {
          return seen.hasOwnProperty(h(c));
         };
         has=check(cur);
         while(has?_enum.MoveNext():false)
          {
           cur=_enum.get_Current();
           has=check(cur);
          }
         if(has)
          {
           _1=false;
          }
         else
          {
           seen[h(cur)]=null;
           v=cur;
           e.c=v;
           _1=true;
          }
         _=_1;
        }
       else
        {
         _=false;
        }
       return _;
      };
      return T.New(null,null,next);
     };
     return Enumerable.Of(getEnumerator);
    },
    empty:function()
    {
     return[];
    },
    enumFinally:function(s,f)
    {
     return Enumerable.Of(function()
     {
      var e,_,e1,next;
      try
      {
       _=Enumerator.Get(s);
      }
      catch(e1)
      {
       f(null);
       _=Operators.Raise(e1);
      }
      e=_;
      next=function(x)
      {
       var _1,_2,v,e2;
       try
       {
        if(e.MoveNext())
         {
          v=e.get_Current();
          x.c=v;
          _2=true;
         }
        else
         {
          f(null);
          _2=false;
         }
        _1=_2;
       }
       catch(e2)
       {
        f(null);
        _1=Operators.Raise(e2);
       }
       return _1;
      };
      return T.New(null,null,next);
     });
    },
    enumUsing:function(x,f)
    {
     return f(x);
    },
    enumWhile:function(f,s)
    {
     return Enumerable.Of(function()
     {
      var next,state;
      next=function(en)
      {
       var matchValue,_,e,_1,v,v1,_2,v2;
       matchValue=en.s;
       if(matchValue.$==1)
        {
         e=matchValue.$0;
         if(e.MoveNext())
          {
           v=e.get_Current();
           en.c=v;
           _1=true;
          }
         else
          {
           v1={
            $:0
           };
           en.s=v1;
           _1=next(en);
          }
         _=_1;
        }
       else
        {
         if(f(null))
          {
           v2={
            $:1,
            $0:Enumerator.Get(s)
           };
           en.s=v2;
           _2=next(en);
          }
         else
          {
           _2=false;
          }
         _=_2;
        }
       return _;
      };
      state={
       $:0
      };
      return T.New(state,null,next);
     });
    },
    exists:function(p,s)
    {
     var e,r;
     e=Enumerator.Get(s);
     r=false;
     while(!r?e.MoveNext():false)
      {
       r=p(e.get_Current());
      }
     return r;
    },
    exists2:function(p,s1,s2)
    {
     var e1,e2,r;
     e1=Enumerator.Get(s1);
     e2=Enumerator.Get(s2);
     r=false;
     while((!r?e1.MoveNext():false)?e2.MoveNext():false)
      {
       r=(p(e1.get_Current()))(e2.get_Current());
      }
     return r;
    },
    filter:function(f,s)
    {
     var getEnumerator;
     getEnumerator=function()
     {
      var _enum,next;
      _enum=Enumerator.Get(s);
      next=function(e)
      {
       var loop,c,res,_,v;
       loop=_enum.MoveNext();
       c=_enum.get_Current();
       res=false;
       while(loop)
        {
         if(f(c))
          {
           v=c;
           e.c=v;
           res=true;
           _=loop=false;
          }
         else
          {
           _=_enum.MoveNext()?c=_enum.get_Current():loop=false;
          }
        }
       return res;
      };
      return T.New(null,null,next);
     };
     return Enumerable.Of(getEnumerator);
    },
    find:function(p,s)
    {
     var matchValue,_,x;
     matchValue=Seq.tryFind(p,s);
     if(matchValue.$==0)
      {
       _=Operators.FailWith("KeyNotFoundException");
      }
     else
      {
       x=matchValue.$0;
       _=x;
      }
     return _;
    },
    findIndex:function(p,s)
    {
     var matchValue,_,x;
     matchValue=Seq.tryFindIndex(p,s);
     if(matchValue.$==0)
      {
       _=Operators.FailWith("KeyNotFoundException");
      }
     else
      {
       x=matchValue.$0;
       _=x;
      }
     return _;
    },
    fold:function(f,x,s)
    {
     var r,e;
     r=x;
     e=Enumerator.Get(s);
     while(e.MoveNext())
      {
       r=(f(r))(e.get_Current());
      }
     return r;
    },
    forall:function(p,s)
    {
     return!Seq.exists(function(x)
     {
      return!p(x);
     },s);
    },
    forall2:function(p,s1,s2)
    {
     return!Seq.exists2(function(x)
     {
      return function(y)
      {
       return!(p(x))(y);
      };
     },s1,s2);
    },
    groupBy:function(f,s)
    {
     return Seq.delay(function()
     {
      var d,d1,keys,e,c,k,h;
      d={};
      d1={};
      keys=[];
      e=Enumerator.Get(s);
      while(e.MoveNext())
       {
        c=e.get_Current();
        k=f(c);
        h=Unchecked.Hash(k);
        !d.hasOwnProperty(h)?keys.push(k):null;
        d1[h]=k;
        d.hasOwnProperty(h)?d[h].push(c):void(d[h]=[c]);
       }
      return Arrays.map(function(k1)
      {
       return[k1,d[Unchecked.Hash(k1)]];
      },keys);
     });
    },
    head:function(s)
    {
     var e;
     e=Enumerator.Get(s);
     return e.MoveNext()?e.get_Current():Seq.insufficient();
    },
    init:function(n,f)
    {
     return Seq.take(n,Seq.initInfinite(f));
    },
    initInfinite:function(f)
    {
     var getEnumerator;
     getEnumerator=function()
     {
      var next;
      next=function(e)
      {
       var v,v1;
       v=f(e.s);
       e.c=v;
       v1=e.s+1;
       e.s=v1;
       return true;
      };
      return T.New(0,null,next);
     };
     return Enumerable.Of(getEnumerator);
    },
    insufficient:function()
    {
     return Operators.FailWith("The input sequence has an insufficient number of elements.");
    },
    isEmpty:function(s)
    {
     var e;
     e=Enumerator.Get(s);
     return!e.MoveNext();
    },
    iter:function(p,s)
    {
     return Seq.iteri(function()
     {
      return function(x)
      {
       return p(x);
      };
     },s);
    },
    iter2:function(p,s1,s2)
    {
     var e1,e2;
     e1=Enumerator.Get(s1);
     e2=Enumerator.Get(s2);
     while(e1.MoveNext()?e2.MoveNext():false)
      {
       (p(e1.get_Current()))(e2.get_Current());
      }
     return;
    },
    iteri:function(p,s)
    {
     var i,e;
     i=0;
     e=Enumerator.Get(s);
     while(e.MoveNext())
      {
       (p(i))(e.get_Current());
       i=i+1;
      }
     return;
    },
    length:function(s)
    {
     var i,e;
     i=0;
     e=Enumerator.Get(s);
     while(e.MoveNext())
      {
       i=i+1;
      }
     return i;
    },
    map:function(f,s)
    {
     var getEnumerator;
     getEnumerator=function()
     {
      var en,next;
      en=Enumerator.Get(s);
      next=function(e)
      {
       var _,v;
       if(en.MoveNext())
        {
         v=f(en.get_Current());
         e.c=v;
         _=true;
        }
       else
        {
         _=false;
        }
       return _;
      };
      return T.New(null,null,next);
     };
     return Enumerable.Of(getEnumerator);
    },
    mapi:function(f,s)
    {
     return Seq.mapi2(f,Seq.initInfinite(function(x)
     {
      return x;
     }),s);
    },
    mapi2:function(f,s1,s2)
    {
     var getEnumerator;
     getEnumerator=function()
     {
      var e1,e2,next;
      e1=Enumerator.Get(s1);
      e2=Enumerator.Get(s2);
      next=function(e)
      {
       var _,v;
       if(e1.MoveNext()?e2.MoveNext():false)
        {
         v=(f(e1.get_Current()))(e2.get_Current());
         e.c=v;
         _=true;
        }
       else
        {
         _=false;
        }
       return _;
      };
      return T.New(null,null,next);
     };
     return Enumerable.Of(getEnumerator);
    },
    max:function(s)
    {
     return Seq.reduce(function(x)
     {
      return function(y)
      {
       return Unchecked.Compare(x,y)>=0?x:y;
      };
     },s);
    },
    maxBy:function(f,s)
    {
     return Seq.reduce(function(x)
     {
      return function(y)
      {
       return Unchecked.Compare(f(x),f(y))>=0?x:y;
      };
     },s);
    },
    min:function(s)
    {
     return Seq.reduce(function(x)
     {
      return function(y)
      {
       return Unchecked.Compare(x,y)<=0?x:y;
      };
     },s);
    },
    minBy:function(f,s)
    {
     return Seq.reduce(function(x)
     {
      return function(y)
      {
       return Unchecked.Compare(f(x),f(y))<=0?x:y;
      };
     },s);
    },
    nth:function(index,s)
    {
     var pos,e;
     index<0?Operators.FailWith("negative index requested"):null;
     pos=-1;
     e=Enumerator.Get(s);
     while(pos<index)
      {
       !e.MoveNext()?Seq.insufficient():null;
       pos=pos+1;
      }
     return e.get_Current();
    },
    pairwise:function(s)
    {
     var mapping,source;
     mapping=function(x)
     {
      return[Arrays.get(x,0),Arrays.get(x,1)];
     };
     source=Seq.windowed(2,s);
     return Seq.map(mapping,source);
    },
    pick:function(p,s)
    {
     var matchValue,_,x;
     matchValue=Seq.tryPick(p,s);
     if(matchValue.$==0)
      {
       _=Operators.FailWith("KeyNotFoundException");
      }
     else
      {
       x=matchValue.$0;
       _=x;
      }
     return _;
    },
    readOnly:function(s)
    {
     return Enumerable.Of(function()
     {
      return Enumerator.Get(s);
     });
    },
    reduce:function(f,source)
    {
     var e,r;
     e=Enumerator.Get(source);
     !e.MoveNext()?Operators.FailWith("The input sequence was empty"):null;
     r=e.get_Current();
     while(e.MoveNext())
      {
       r=(f(r))(e.get_Current());
      }
     return r;
    },
    scan:function(f,x,s)
    {
     var getEnumerator;
     getEnumerator=function()
     {
      var en,next;
      en=Enumerator.Get(s);
      next=function(e)
      {
       var _,_1,v;
       if(e.s)
        {
         if(en.MoveNext())
          {
           v=(f(e.get_Current()))(en.get_Current());
           e.c=v;
           _1=true;
          }
         else
          {
           _1=false;
          }
         _=_1;
        }
       else
        {
         e.c=x;
         e.s=true;
         _=true;
        }
       return _;
      };
      return T.New(false,null,next);
     };
     return Enumerable.Of(getEnumerator);
    },
    skip:function(n,s)
    {
     return Enumerable.Of(function()
     {
      var e,i;
      e=Enumerator.Get(s);
      for(i=1;i<=n;i++){
       !e.MoveNext()?Seq.insufficient():null;
      }
      return e;
     });
    },
    skipWhile:function(f,s)
    {
     return Enumerable.Of(function()
     {
      var e,empty,_,_this,next;
      e=Enumerator.Get(s);
      empty=true;
      while(e.MoveNext()?f(e.get_Current()):false)
       {
        empty=false;
       }
      if(empty)
       {
        _this=Seq.empty();
        _=Enumerator.Get(_this);
       }
      else
       {
        next=function(x)
        {
         var _1,v,r,v1;
         if(x.s)
          {
           x.s=false;
           v=e.get_Current();
           x.c=v;
           _1=true;
          }
         else
          {
           r=e.MoveNext();
           v1=e.get_Current();
           x.c=v1;
           _1=r;
          }
         return _1;
        };
        _=T.New(true,null,next);
       }
      return _;
     });
    },
    sort:function(s)
    {
     return Seq.sortBy(function(x)
     {
      return x;
     },s);
    },
    sortBy:function(f,s)
    {
     return Seq.delay(function()
     {
      var array;
      array=Arrays.ofSeq(s);
      Arrays.sortInPlaceBy(f,array);
      return array;
     });
    },
    sum:function(s)
    {
     return Seq.fold(function(s1)
     {
      return function(x)
      {
       return s1+x;
      };
     },0,s);
    },
    sumBy:function(f,s)
    {
     return Seq.fold(function(s1)
     {
      return function(x)
      {
       return s1+f(x);
      };
     },0,s);
    },
    take:function(n,s)
    {
     return Enumerable.Of(function()
     {
      var e,next;
      e=Enumerator.Get(s);
      next=function(_enum)
      {
       var _,_1,v,v1;
       if(_enum.s>=n)
        {
         _=false;
        }
       else
        {
         if(e.MoveNext())
          {
           v=_enum.s+1;
           _enum.s=v;
           v1=e.get_Current();
           _enum.c=v1;
           _1=true;
          }
         else
          {
           e.Dispose();
           _enum.s=n;
           _1=false;
          }
         _=_1;
        }
       return _;
      };
      return T.New(0,null,next);
     });
    },
    takeWhile:function(f,s)
    {
     return Seq.delay(function()
     {
      return Seq.enumUsing(Enumerator.Get(s),function(e)
      {
       return Seq.enumWhile(function()
       {
        return e.MoveNext()?f(e.get_Current()):false;
       },Seq.delay(function()
       {
        return[e.get_Current()];
       }));
      });
     });
    },
    toArray:function(s)
    {
     var q,enumerator,e;
     q=[];
     enumerator=Enumerator.Get(s);
     while(enumerator.MoveNext())
      {
       e=enumerator.get_Current();
       q.push(e);
      }
     return q.slice(0);
    },
    toList:function(s)
    {
     return List.ofSeq(s);
    },
    truncate:function(n,s)
    {
     return Seq.delay(function()
     {
      return Seq.enumUsing(Enumerator.Get(s),function(e)
      {
       var i;
       i={
        contents:0
       };
       return Seq.enumWhile(function()
       {
        return e.MoveNext()?i.contents<n:false;
       },Seq.delay(function()
       {
        Operators.Increment(i);
        return[e.get_Current()];
       }));
      });
     });
    },
    tryFind:function(ok,s)
    {
     var e,r,x;
     e=Enumerator.Get(s);
     r={
      $:0
     };
     while(r.$==0?e.MoveNext():false)
      {
       x=e.get_Current();
       ok(x)?r={
        $:1,
        $0:x
       }:null;
      }
     return r;
    },
    tryFindIndex:function(ok,s)
    {
     var e,loop,i,x;
     e=Enumerator.Get(s);
     loop=true;
     i=0;
     while(loop?e.MoveNext():false)
      {
       x=e.get_Current();
       ok(x)?loop=false:i=i+1;
      }
     return loop?{
      $:0
     }:{
      $:1,
      $0:i
     };
    },
    tryPick:function(f,s)
    {
     var e,r;
     e=Enumerator.Get(s);
     r={
      $:0
     };
     while(Unchecked.Equals(r,{
      $:0
     })?e.MoveNext():false)
      {
       r=f(e.get_Current());
      }
     return r;
    },
    unfold:function(f,s)
    {
     var getEnumerator;
     getEnumerator=function()
     {
      var next;
      next=function(e)
      {
       var matchValue,_,t,s1;
       matchValue=f(e.s);
       if(matchValue.$==0)
        {
         _=false;
        }
       else
        {
         t=matchValue.$0[0];
         s1=matchValue.$0[1];
         e.c=t;
         e.s=s1;
         _=true;
        }
       return _;
      };
      return T.New(s,null,next);
     };
     return Enumerable.Of(getEnumerator);
    },
    windowed:function(windowSize,s)
    {
     windowSize<=0?Operators.FailWith("The input must be non-negative."):null;
     return Seq.delay(function()
     {
      return Seq.enumUsing(Enumerator.Get(s),function(e)
      {
       var q;
       q=[];
       return Seq.append(Seq.enumWhile(function()
       {
        return q.length<windowSize?e.MoveNext():false;
       },Seq.delay(function()
       {
        q.push(e.get_Current());
        return Seq.empty();
       })),Seq.delay(function()
       {
        return q.length===windowSize?Seq.append([q.slice(0)],Seq.delay(function()
        {
         return Seq.enumWhile(function()
         {
          return e.MoveNext();
         },Seq.delay(function()
         {
          q.shift();
          q.push(e.get_Current());
          return[q.slice(0)];
         }));
        })):Seq.empty();
       }));
      });
     });
    },
    zip:function(s1,s2)
    {
     return Seq.mapi2(function(x)
     {
      return function(y)
      {
       return[x,y];
      };
     },s1,s2);
    },
    zip3:function(s1,s2,s3)
    {
     return Seq.mapi2(function(x)
     {
      return function(tupledArg)
      {
       var y,z;
       y=tupledArg[0];
       z=tupledArg[1];
       return[x,y,z];
      };
     },s1,Seq.zip(s2,s3));
    }
   },
   Slice:{
    array:function(source,start,finish)
    {
     var matchValue,_,_1,f,_2,s,f1,s1;
     matchValue=[start,finish];
     if(matchValue[0].$==0)
      {
       if(matchValue[1].$==1)
        {
         f=matchValue[1].$0;
         _1=source.slice(0,f+1);
        }
       else
        {
         _1=[];
        }
       _=_1;
      }
     else
      {
       if(matchValue[1].$==0)
        {
         s=matchValue[0].$0;
         _2=source.slice(s);
        }
       else
        {
         f1=matchValue[1].$0;
         s1=matchValue[0].$0;
         _2=source.slice(s1,f1+1);
        }
       _=_2;
      }
     return _;
    },
    array2D:function(arr,start1,finish1,start2,finish2)
    {
     var start11,_,n,start21,_1,n1,finish11,_2,n2,finish21,_3,n3,len1,len2;
     if(start1.$==1)
      {
       n=start1.$0;
       _=n;
      }
     else
      {
       _=0;
      }
     start11=_;
     if(start2.$==1)
      {
       n1=start2.$0;
       _1=n1;
      }
     else
      {
       _1=0;
      }
     start21=_1;
     if(finish1.$==1)
      {
       n2=finish1.$0;
       _2=n2;
      }
     else
      {
       _2=arr.length-1;
      }
     finish11=_2;
     if(finish2.$==1)
      {
       n3=finish2.$0;
       _3=n3;
      }
     else
      {
       _3=(arr.length?arr[0].length:0)-1;
      }
     finish21=_3;
     len1=finish11-start11+1;
     len2=finish21-start21+1;
     return Arrays.sub2D(arr,start11,start21,len1,len2);
    },
    array2Dfix1:function(arr,fixed1,start2,finish2)
    {
     var start21,_,n,finish21,_1,n1,len2,dst,j;
     if(start2.$==1)
      {
       n=start2.$0;
       _=n;
      }
     else
      {
       _=0;
      }
     start21=_;
     if(finish2.$==1)
      {
       n1=finish2.$0;
       _1=n1;
      }
     else
      {
       _1=(arr.length?arr[0].length:0)-1;
      }
     finish21=_1;
     len2=finish21-start21+1;
     dst=Array(len2);
     for(j=0;j<=len2-1;j++){
      Arrays.set(dst,j,Arrays.get2D(arr,fixed1,start21+j));
     }
     return dst;
    },
    array2Dfix2:function(arr,start1,finish1,fixed2)
    {
     var start11,_,n,finish11,_1,n1,len1,dst,i;
     if(start1.$==1)
      {
       n=start1.$0;
       _=n;
      }
     else
      {
       _=0;
      }
     start11=_;
     if(finish1.$==1)
      {
       n1=finish1.$0;
       _1=n1;
      }
     else
      {
       _1=arr.length-1;
      }
     finish11=_1;
     len1=finish11-start11+1;
     dst=Array(len1);
     for(i=0;i<=len1-1;i++){
      Arrays.set(dst,i,Arrays.get2D(arr,start11+i,fixed2));
     }
     return dst;
    },
    setArray:function(dst,start,finish,src)
    {
     var start1,_,n,finish1,_1,n1;
     if(start.$==1)
      {
       n=start.$0;
       _=n;
      }
     else
      {
       _=0;
      }
     start1=_;
     if(finish.$==1)
      {
       n1=finish.$0;
       _1=n1;
      }
     else
      {
       _1=dst.length-1;
      }
     finish1=_1;
     return Arrays.setSub(dst,start1,finish1-start1+1,src);
    },
    setArray2D:function(dst,start1,finish1,start2,finish2,src)
    {
     var start11,_,n,start21,_1,n1,finish11,_2,n2,finish21,_3,n3;
     if(start1.$==1)
      {
       n=start1.$0;
       _=n;
      }
     else
      {
       _=0;
      }
     start11=_;
     if(start2.$==1)
      {
       n1=start2.$0;
       _1=n1;
      }
     else
      {
       _1=0;
      }
     start21=_1;
     if(finish1.$==1)
      {
       n2=finish1.$0;
       _2=n2;
      }
     else
      {
       _2=dst.length-1;
      }
     finish11=_2;
     if(finish2.$==1)
      {
       n3=finish2.$0;
       _3=n3;
      }
     else
      {
       _3=(dst.length?dst[0].length:0)-1;
      }
     finish21=_3;
     return Arrays.setSub2D(dst,start11,start21,finish11-start11+1,finish21-start21+1,src);
    },
    setArray2Dfix1:function(dst,fixed1,start2,finish2,src)
    {
     var start21,_,n,finish21,_1,n1,len2,j;
     if(start2.$==1)
      {
       n=start2.$0;
       _=n;
      }
     else
      {
       _=0;
      }
     start21=_;
     if(finish2.$==1)
      {
       n1=finish2.$0;
       _1=n1;
      }
     else
      {
       _1=(dst.length?dst[0].length:0)-1;
      }
     finish21=_1;
     len2=finish21-start21+1;
     for(j=0;j<=len2-1;j++){
      Arrays.set2D(dst,fixed1,start21+j,Arrays.get(src,j));
     }
     return;
    },
    setArray2Dfix2:function(dst,start1,finish1,fixed2,src)
    {
     var start11,_,n,finish11,_1,n1,len1,i;
     if(start1.$==1)
      {
       n=start1.$0;
       _=n;
      }
     else
      {
       _=0;
      }
     start11=_;
     if(finish1.$==1)
      {
       n1=finish1.$0;
       _1=n1;
      }
     else
      {
       _1=dst.length-1;
      }
     finish11=_1;
     len1=finish11-start11+1;
     for(i=0;i<=len1-1;i++){
      Arrays.set2D(dst,start11+i,fixed2,Arrays.get(src,i));
     }
     return;
    },
    string:function(source,start,finish)
    {
     var matchValue,_,_1,f,_2,s,f1,s1;
     matchValue=[start,finish];
     if(matchValue[0].$==0)
      {
       if(matchValue[1].$==1)
        {
         f=matchValue[1].$0;
         _1=source.slice(0,f+1);
        }
       else
        {
         _1="";
        }
       _=_1;
      }
     else
      {
       if(matchValue[1].$==0)
        {
         s=matchValue[0].$0;
         _2=source.slice(s);
        }
       else
        {
         f1=matchValue[1].$0;
         s1=matchValue[0].$0;
         _2=source.slice(s1,f1+1);
        }
       _=_2;
      }
     return _;
    }
   },
   Stack:{
    Clear:function(stack)
    {
     return stack.splice(0,Arrays.length(stack));
    },
    Contains:function(stack,el)
    {
     return Seq.exists(function(y)
     {
      return Unchecked.Equals(el,y);
     },stack);
    },
    CopyTo:function(stack,array,index)
    {
     return Arrays.blit(array,0,array,index,Arrays.length(stack));
    }
   },
   Strings:{
    Compare:function(x,y)
    {
     return Operators.Compare(x,y);
    },
    CopyTo:function(s,o,d,off,ct)
    {
     return Arrays.blit(Strings.ToCharArray(s),o,d,off,ct);
    },
    EndsWith:function($x,$s)
    {
     var $0=this,$this=this;
     return $x.substring($x.length-$s.length)==$s;
    },
    IndexOf:function($s,$c,$i)
    {
     var $0=this,$this=this;
     return $s.indexOf(Global.String.fromCharCode($c),$i);
    },
    Insert:function($x,$index,$s)
    {
     var $0=this,$this=this;
     return $x.substring(0,$index-1)+$s+$x.substring($index);
    },
    IsNullOrEmpty:function($x)
    {
     var $0=this,$this=this;
     return $x==null||$x=="";
    },
    Join:function($sep,$values)
    {
     var $0=this,$this=this;
     return $values.join($sep);
    },
    LastIndexOf:function($s,$c,$i)
    {
     var $0=this,$this=this;
     return $s.lastIndexOf(Global.String.fromCharCode($c),$i);
    },
    PadLeft:function(s,n)
    {
     return Strings.PadLeftWith(s,n,32);
    },
    PadLeftWith:function($s,$n,$c)
    {
     var $0=this,$this=this;
     return Global.Array($n-$s.length+1).join(Global.String.fromCharCode($c))+$s;
    },
    PadRight:function(s,n)
    {
     return Strings.PadRightWith(s,n,32);
    },
    PadRightWith:function($s,$n,$c)
    {
     var $0=this,$this=this;
     return $s+Global.Array($n-$s.length+1).join(Global.String.fromCharCode($c));
    },
    RegexEscape:function($s)
    {
     var $0=this,$this=this;
     return $s.replace(/[-\/\\^$*+?.()|[\]{}]/g,"\\$&");
    },
    Remove:function($x,$ix,$ct)
    {
     var $0=this,$this=this;
     return $x.substring(0,$ix)+$x.substring($ix+$ct);
    },
    Replace:function(subject,search,replace)
    {
     var replaceLoop;
     replaceLoop=function(subj)
     {
      var index,_,replaced,nextStartIndex,ct;
      index=subj.indexOf(search);
      if(index!==-1)
       {
        replaced=Strings.ReplaceOnce(subj,search,replace);
        nextStartIndex=index+replace.length;
        ct=index+replace.length;
        _=Strings.Substring(replaced,0,ct)+replaceLoop(replaced.substring(nextStartIndex));
       }
      else
       {
        _=subj;
       }
      return _;
     };
     return replaceLoop(subject);
    },
    ReplaceChar:function(s,oldC,newC)
    {
     return Strings.Replace(s,String.fromCharCode(oldC),String.fromCharCode(newC));
    },
    ReplaceOnce:function($string,$search,$replace)
    {
     var $0=this,$this=this;
     return $string.replace($search,$replace);
    },
    Split:function(s,pat,opts)
    {
     var res;
     res=Strings.SplitWith(s,pat);
     return opts===1?Arrays.filter(function(x)
     {
      return x!=="";
     },res):res;
    },
    SplitChars:function(s,sep,opts)
    {
     var re;
     re="["+Strings.RegexEscape(String.fromCharCode.apply(undefined,sep))+"]";
     return Strings.Split(s,new RegExp(re),opts);
    },
    SplitStrings:function(s,sep,opts)
    {
     var re;
     re=Strings.concat("|",Arrays.map(function(s1)
     {
      return Strings.RegexEscape(s1);
     },sep));
     return Strings.Split(s,new RegExp(re),opts);
    },
    SplitWith:function($str,$pat)
    {
     var $0=this,$this=this;
     return $str.split($pat);
    },
    StartsWith:function($t,$s)
    {
     var $0=this,$this=this;
     return $t.substring(0,$s.length)==$s;
    },
    Substring:function($s,$ix,$ct)
    {
     var $0=this,$this=this;
     return $s.substr($ix,$ct);
    },
    ToCharArray:function(s)
    {
     return Arrays.init(s.length,function(x)
     {
      return s.charCodeAt(x);
     });
    },
    ToCharArrayRange:function(s,startIndex,length)
    {
     return Arrays.init(length,function(i)
     {
      return s.charCodeAt(startIndex+i);
     });
    },
    Trim:function($s)
    {
     var $0=this,$this=this;
     return $s.replace(/^\s+/,"").replace(/\s+$/,"");
    },
    TrimEnd:function($s)
    {
     var $0=this,$this=this;
     return $s.replace(/\s+$/,"");
    },
    TrimStart:function($s)
    {
     var $0=this,$this=this;
     return $s.replace(/^\s+/,"");
    },
    collect:function(f,s)
    {
     return Arrays.init(s.length,function(i)
     {
      return f(s.charCodeAt(i));
     }).join("");
    },
    concat:function(separator,strings)
    {
     return Seq.toArray(strings).join(separator);
    },
    exists:function(f,s)
    {
     return Seq.exists(f,Strings.protect(s));
    },
    forall:function(f,s)
    {
     return Seq.forall(f,Strings.protect(s));
    },
    init:function(count,f)
    {
     return Arrays.init(count,f).join("");
    },
    iter:function(f,s)
    {
     return Seq.iter(f,Strings.protect(s));
    },
    iteri:function(f,s)
    {
     return Seq.iteri(f,Strings.protect(s));
    },
    length:function(s)
    {
     return Strings.protect(s).length;
    },
    map:function(f,s)
    {
     return Strings.collect(function(x)
     {
      return String.fromCharCode(f(x));
     },Strings.protect(s));
    },
    mapi:function(f,s)
    {
     return Seq.toArray(Seq.mapi(function(i)
     {
      return function(x)
      {
       return String.fromCharCode((f(i))(x));
      };
     },s)).join("");
    },
    protect:function(s)
    {
     return s===null?"":s;
    },
    replicate:function(count,s)
    {
     return Strings.init(count,function()
     {
      return s;
     });
    }
   },
   Unchecked:{
    Compare:function(a,b)
    {
     var _,matchValue,_1,matchValue1;
     if(a===b)
      {
       _=0;
      }
     else
      {
       matchValue=typeof a;
       if(matchValue==="undefined")
        {
         matchValue1=typeof b;
         _1=matchValue1==="undefined"?0:-1;
        }
       else
        {
         _1=matchValue==="function"?Operators.FailWith("Cannot compare function values."):matchValue==="boolean"?a<b?-1:1:matchValue==="number"?a<b?-1:1:matchValue==="string"?a<b?-1:1:a===null?-1:b===null?1:"CompareTo"in a?a.CompareTo(b):(a instanceof Array?b instanceof Array:false)?Unchecked.compareArrays(a,b):(a instanceof Date?b instanceof Date:false)?Unchecked.compareDates(a,b):Unchecked.compareArrays(JSModule.GetFields(a),JSModule.GetFields(b));
        }
       _=_1;
      }
     return _;
    },
    Equals:function(a,b)
    {
     var _,matchValue;
     if(a===b)
      {
       _=true;
      }
     else
      {
       matchValue=typeof a;
       _=matchValue==="object"?a===null?false:b===null?false:"Equals"in a?a.Equals(b):(a instanceof Array?b instanceof Array:false)?Unchecked.arrayEquals(a,b):(a instanceof Date?b instanceof Date:false)?Unchecked.dateEquals(a,b):Unchecked.arrayEquals(JSModule.GetFields(a),JSModule.GetFields(b)):false;
      }
     return _;
    },
    Hash:function(o)
    {
     var matchValue;
     matchValue=typeof o;
     return matchValue==="function"?0:matchValue==="boolean"?o?1:0:matchValue==="number"?o:matchValue==="string"?Unchecked.hashString(o):matchValue==="object"?o==null?0:o instanceof Array?Unchecked.hashArray(o):Unchecked.hashObject(o):0;
    },
    arrayEquals:function(a,b)
    {
     var _,eq,i;
     if(Arrays.length(a)===Arrays.length(b))
      {
       eq=true;
       i=0;
       while(eq?i<Arrays.length(a):false)
        {
         !Unchecked.Equals(Arrays.get(a,i),Arrays.get(b,i))?eq=false:null;
         i=i+1;
        }
       _=eq;
      }
     else
      {
       _=false;
      }
     return _;
    },
    compareArrays:function(a,b)
    {
     var _,_1,cmp,i;
     if(Arrays.length(a)<Arrays.length(b))
      {
       _=-1;
      }
     else
      {
       if(Arrays.length(a)>Arrays.length(b))
        {
         _1=1;
        }
       else
        {
         cmp=0;
         i=0;
         while(cmp===0?i<Arrays.length(a):false)
          {
           cmp=Unchecked.Compare(Arrays.get(a,i),Arrays.get(b,i));
           i=i+1;
          }
         _1=cmp;
        }
       _=_1;
      }
     return _;
    },
    compareDates:function(a,b)
    {
     return Operators.Compare(a.getTime(),b.getTime());
    },
    dateEquals:function(a,b)
    {
     return a.getTime()===b.getTime();
    },
    hashArray:function(o)
    {
     var h,i;
     h=-34948909;
     for(i=0;i<=Arrays.length(o)-1;i++){
      h=Unchecked.hashMix(h,Unchecked.Hash(Arrays.get(o,i)));
     }
     return h;
    },
    hashMix:function(x,y)
    {
     return(x<<5)+x+y;
    },
    hashObject:function(o)
    {
     var _,op_PlusPlus,h;
     if("GetHashCode"in o)
      {
       _=o.GetHashCode();
      }
     else
      {
       op_PlusPlus=function(x,y)
       {
        return Unchecked.hashMix(x,y);
       };
       h={
        contents:0
       };
       JSModule.ForEach(o,function(key)
       {
        h.contents=op_PlusPlus(op_PlusPlus(h.contents,Unchecked.hashString(key)),Unchecked.Hash(o[key]));
        return false;
       });
       _=h.contents;
      }
     return _;
    },
    hashString:function(s)
    {
     var _,hash,i;
     if(s===null)
      {
       _=0;
      }
     else
      {
       hash=5381;
       for(i=0;i<=s.length-1;i++){
        hash=Unchecked.hashMix(hash,s.charCodeAt(i)<<0);
       }
       _=hash;
      }
     return _;
    }
   },
   Util:{
    addListener:function(event,h)
    {
     event.Subscribe(Util.observer(h));
    },
    observer:function(h)
    {
     return{
      OnCompleted:function()
      {
      },
      OnError:function()
      {
      },
      OnNext:h
     };
    },
    subscribeTo:function(event,h)
    {
     return event.Subscribe(Util.observer(h));
    }
   }
  }
 });
 Runtime.OnInit(function()
 {
  Number=Runtime.Safe(Global.Number);
  Arrays=Runtime.Safe(Global.WebSharper.Arrays);
  Operators=Runtime.Safe(Global.WebSharper.Operators);
  Error=Runtime.Safe(Global.Error);
  Array=Runtime.Safe(Global.Array);
  Seq=Runtime.Safe(Global.WebSharper.Seq);
  Unchecked=Runtime.Safe(Global.WebSharper.Unchecked);
  Enumerator=Runtime.Safe(Global.WebSharper.Enumerator);
  Arrays2D=Runtime.Safe(Global.WebSharper.Arrays2D);
  Concurrency=Runtime.Safe(Global.WebSharper.Concurrency);
  AggregateException=Runtime.Safe(Global.WebSharper.AggregateException);
  Option=Runtime.Safe(Global.WebSharper.Option);
  clearTimeout=Runtime.Safe(Global.clearTimeout);
  setTimeout=Runtime.Safe(Global.setTimeout);
  CancellationTokenSource=Runtime.Safe(Global.WebSharper.CancellationTokenSource);
  Char=Runtime.Safe(Global.WebSharper.Char);
  Util=Runtime.Safe(Global.WebSharper.Util);
  Lazy=Runtime.Safe(Global.WebSharper.Lazy);
  Date=Runtime.Safe(Global.Date);
  console=Runtime.Safe(Global.console);
  Scheduler=Runtime.Safe(Concurrency.Scheduler);
  T=Runtime.Safe(Enumerator.T);
  Html=Runtime.Safe(Global.WebSharper.Html);
  Client=Runtime.Safe(Html.Client);
  Activator=Runtime.Safe(Client.Activator);
  document=Runtime.Safe(Global.document);
  jQuery=Runtime.Safe(Global.jQuery);
  Json=Runtime.Safe(Global.WebSharper.Json);
  JSON=Runtime.Safe(Global.JSON);
  JavaScript=Runtime.Safe(Global.WebSharper.JavaScript);
  JSModule=Runtime.Safe(JavaScript.JSModule);
  HtmlContentExtensions=Runtime.Safe(Client.HtmlContentExtensions);
  SingleNode=Runtime.Safe(HtmlContentExtensions.SingleNode);
  List=Runtime.Safe(Global.WebSharper.List);
  T1=Runtime.Safe(List.T);
  Math=Runtime.Safe(Global.Math);
  Strings=Runtime.Safe(Global.WebSharper.Strings);
  PrintfHelpers=Runtime.Safe(Global.WebSharper.PrintfHelpers);
  Remoting=Runtime.Safe(Global.WebSharper.Remoting);
  XhrProvider=Runtime.Safe(Remoting.XhrProvider);
  AsyncProxy=Runtime.Safe(Global.WebSharper.AsyncProxy);
  AjaxRemotingProvider=Runtime.Safe(Remoting.AjaxRemotingProvider);
  window=Runtime.Safe(Global.window);
  Enumerable=Runtime.Safe(Global.WebSharper.Enumerable);
  String=Runtime.Safe(Global.String);
  return RegExp=Runtime.Safe(Global.RegExp);
 });
 Runtime.OnLoad(function()
 {
  Remoting.EndPoint();
  Remoting.AjaxProvider();
  Activator.Activate();
  Concurrency.scheduler();
  Concurrency.defCTS();
  Concurrency.GetCT();
  return;
 });
}());

(function()
{
 var Global=this,Runtime=this.IntelliFactory.Runtime,Arrays,ok,Unchecked,console,Testing,Pervasives,TestBuilder,test,Random,Math,NaN1,Infinity1,List,String,Seq;
 Runtime.Define(Global,{
  WebSharper:{
   Testing:{
    Assert:{
     For:function(times,gen,attempt)
     {
      var _this,i,i1;
      _this=gen.Base;
      for(i=0;i<=Arrays.length(_this)-1;i++){
       attempt(Arrays.get(gen.Base,i));
      }
      for(i1=1;i1<=times;i1++){
       attempt(gen.Next.call(null,null));
      }
      return;
     },
     Raises:function(f)
     {
      var _,matchValue;
      try
      {
       f(null);
       _=ok(false,"Assert raises exception test failed.");
      }
      catch(matchValue)
      {
       _=ok(true,"Pass.");
      }
      return _;
     }
    },
    Pervasives:{
     Is:function(a,b)
     {
      var _,ps;
      if(!Unchecked.Equals(a,b))
       {
        ps=[a,b];
        if(console)
         {
          console.log.apply(console,["Equality test failed."].concat(ps));
         }
        _=ok(false,"Equality test failed.");
       }
      else
       {
        _=ok(true,"Pass.");
       }
      return _;
     },
     Isnt:function(a,b)
     {
      var _,ps;
      if(Unchecked.Equals(a,b))
       {
        ps=[a,b];
        if(console)
         {
          console.log.apply(console,["Inequality test failed."].concat(ps));
         }
        _=ok(false,"Inequality test failed.");
       }
      else
       {
        _=ok(true,"Pass.");
       }
      return _;
     },
     Test:function(name)
     {
      return TestBuilder.New(name);
     },
     TestBuilder:Runtime.Class({
      Delay:function(f)
      {
       return test(this.name,f);
      },
      Zero:function()
      {
       return null;
      }
     },{
      New:function(name)
      {
       var r;
       r=Runtime.New(this,{});
       r.name=name;
       return r;
      }
     })
    },
    Random:{
     ArrayOf:function(generator)
     {
      return{
       Base:[[]],
       Next:function()
       {
        var len;
        len=Random.Natural().Next.call(null,null)%100;
        return Arrays.init(len,function()
        {
         return generator.Next.call(null,null);
        });
       }
      };
     },
     Boolean:Runtime.Field(function()
     {
      return{
       Base:[true,false],
       Next:function()
       {
        return Random.StandardUniform().Next.call(null,null)>0.5;
       }
      };
     }),
     Const:function(x)
     {
      return{
       Base:[x],
       Next:function()
       {
        return x;
       }
      };
     },
     Exponential:function(lambda)
     {
      return{
       Base:[],
       Next:function()
       {
        var p;
        p=Random.StandardUniform().Next.call(null,null);
        return-Math.log(1-p)/lambda;
       }
      };
     },
     Float:Runtime.Field(function()
     {
      return{
       Base:[0],
       Next:function()
       {
        var sign;
        sign=Random.Boolean().Next.call(null,null)?1:-1;
        return sign*Random.Exponential(0.1).Next.call(null,null);
       }
      };
     }),
     FloatExhaustive:Runtime.Field(function()
     {
      return{
       Base:[0,NaN1,Infinity1,-Infinity1],
       Next:function()
       {
        return Random.Float().Next.call(null,null);
       }
      };
     }),
     FloatWithin:function(low,hi)
     {
      return{
       Base:[low,hi],
       Next:function()
       {
        return low+(hi-low)*Math.random();
       }
      };
     },
     Implies:function(a,b)
     {
      return!a?true:b;
     },
     Imply:function(a,b)
     {
      return Random.Implies(a,b);
     },
     Int:Runtime.Field(function()
     {
      return{
       Base:[0,1,-1],
       Next:function()
       {
        return Math.round(Random.Float().Next.call(null,null));
       }
      };
     }),
     ListOf:function(generator)
     {
      var f,gen;
      f=function(array)
      {
       return List.ofArray(array);
      };
      gen=Random.ArrayOf(generator);
      return Random.Map(f,gen);
     },
     Map:function(f,gen)
     {
      var f1;
      f1=gen.Next;
      return{
       Base:Arrays.map(f,gen.Base),
       Next:function(x)
       {
        return f(f1(x));
       }
      };
     },
     Mix:function(a,b)
     {
      var left;
      left={
       contents:false
      };
      return{
       Base:a.Base.concat(b.Base),
       Next:function()
       {
        left.contents=!left.contents;
        return left.contents?a.Next.call(null,null):b.Next.call(null,null);
       }
      };
     },
     Natural:Runtime.Field(function()
     {
      var g;
      g=Random.Int().Next;
      return{
       Base:[0,1],
       Next:function(x)
       {
        var value;
        value=g(x);
        return Math.abs(value);
       }
      };
     }),
     OneOf:function(seeds)
     {
      var index;
      index=Random.Within(1,Arrays.length(seeds));
      return{
       Base:seeds,
       Next:function()
       {
        return Arrays.get(seeds,index.Next.call(null,null)-1);
       }
      };
     },
     OptionOf:function(generator)
     {
      return Random.Mix(Random.Const({
       $:0
      }),Random.Map(function(arg0)
      {
       return{
        $:1,
        $0:arg0
       };
      },generator));
     },
     StandardUniform:Runtime.Field(function()
     {
      return{
       Base:[],
       Next:function()
       {
        return Math.random();
       }
      };
     }),
     String:Runtime.Field(function()
     {
      return{
       Base:[""],
       Next:function()
       {
        var len,cs;
        len=Random.Natural().Next.call(null,null)%100;
        cs=Arrays.init(len,function()
        {
         return Random.Int().Next.call(null,null)%256;
        });
        return String.fromCharCode.apply(undefined,cs);
       }
      };
     }),
     StringExhaustive:Runtime.Field(function()
     {
      return{
       Base:[null,""],
       Next:Random.String().Next
      };
     }),
     Tuple2Of:function(a,b)
     {
      return{
       Base:Seq.toArray(Seq.delay(function()
       {
        return Seq.collect(function(x)
        {
         return Seq.map(function(y)
         {
          return[x,y];
         },b.Base);
        },a.Base);
       })),
       Next:function()
       {
        return[a.Next.call(null,null),b.Next.call(null,null)];
       }
      };
     },
     Tuple3Of:function(a,b,c)
     {
      return{
       Base:Seq.toArray(Seq.delay(function()
       {
        return Seq.collect(function(x)
        {
         return Seq.collect(function(y)
         {
          return Seq.map(function(z)
          {
           return[x,y,z];
          },c.Base);
         },b.Base);
        },a.Base);
       })),
       Next:function()
       {
        return[a.Next.call(null,null),b.Next.call(null,null),c.Next.call(null,null)];
       }
      };
     },
     Within:function(low,hi)
     {
      return{
       Base:[low,hi],
       Next:function()
       {
        return Random.Natural().Next.call(null,null)%(hi-low)+low;
       }
      };
     }
    }
   }
  }
 });
 Runtime.OnInit(function()
 {
  Arrays=Runtime.Safe(Global.WebSharper.Arrays);
  ok=Runtime.Safe(Global.ok);
  Unchecked=Runtime.Safe(Global.WebSharper.Unchecked);
  console=Runtime.Safe(Global.console);
  Testing=Runtime.Safe(Global.WebSharper.Testing);
  Pervasives=Runtime.Safe(Testing.Pervasives);
  TestBuilder=Runtime.Safe(Pervasives.TestBuilder);
  test=Runtime.Safe(Global.test);
  Random=Runtime.Safe(Testing.Random);
  Math=Runtime.Safe(Global.Math);
  NaN1=Runtime.Safe(Global.NaN);
  Infinity1=Runtime.Safe(Global.Infinity);
  List=Runtime.Safe(Global.WebSharper.List);
  String=Runtime.Safe(Global.String);
  return Seq=Runtime.Safe(Global.WebSharper.Seq);
 });
 Runtime.OnLoad(function()
 {
  Random.StringExhaustive();
  Random.String();
  Random.StandardUniform();
  Random.Natural();
  Random.Int();
  Random.FloatExhaustive();
  Random.Float();
  Random.Boolean();
  return;
 });
}());

(function()
{
 var Global=this,Runtime=this.IntelliFactory.Runtime,Html,Client,Implementation,Attribute,Pagelet,Element,Enumerator,Math,document,jQuery,Events,JQueryEventSupport,AttributeBuilder,DeprecatedTagBuilder,JQueryHtmlProvider,TagBuilder,Text,Attr,EventsPervasives,Tags;
 Runtime.Define(Global,{
  WebSharper:{
   Html:{
    Client:{
     Attr:{
      Attr:Runtime.Field(function()
      {
       return Implementation.Attr();
      })
     },
     Attribute:Runtime.Class({
      get_Body:function()
      {
       var attr;
       attr=this.HtmlProvider.CreateAttribute(this.Name);
       attr.value=this.Value;
       return attr;
      }
     },{
      New:function(htmlProvider,name,value)
      {
       var a;
       a=Attribute.New1(htmlProvider);
       a.Name=name;
       a.Value=value;
       return a;
      },
      New1:function(HtmlProvider)
      {
       var r;
       r=Runtime.New(this,Pagelet.New());
       r.HtmlProvider=HtmlProvider;
       return r;
      }
     }),
     AttributeBuilder:Runtime.Class({
      NewAttr:function(name,value)
      {
       var a;
       a=Attribute.New(this.HtmlProvider,name,value);
       return a;
      }
     },{
      New:function(HtmlProvider)
      {
       var r;
       r=Runtime.New(this,{});
       r.HtmlProvider=HtmlProvider;
       return r;
      }
     }),
     Default:{
      OnLoad:function(init)
      {
       return Implementation.HtmlProvider().OnDocumentReady(init);
      }
     },
     DeprecatedAttributeBuilder:Runtime.Class({
      NewAttr:function(name,value)
      {
       var a;
       a=Attribute.New(this.HtmlProvider,name,value);
       return a;
      }
     },{
      New:function(HtmlProvider)
      {
       var r;
       r=Runtime.New(this,{});
       r.HtmlProvider=HtmlProvider;
       return r;
      }
     }),
     DeprecatedTagBuilder:Runtime.Class({
      NewTag:function(name,children)
      {
       var el,enumerator,pl;
       el=Element.New(this.HtmlProvider,name);
       enumerator=Enumerator.Get(children);
       while(enumerator.MoveNext())
        {
         pl=enumerator.get_Current();
         el.AppendI(pl);
        }
       return el;
      }
     },{
      New:function(HtmlProvider)
      {
       var r;
       r=Runtime.New(this,{});
       r.HtmlProvider=HtmlProvider;
       return r;
      }
     }),
     Element:Runtime.Class({
      AppendI:function(pl)
      {
       var body,_,objectArg,arg00,objectArg1,arg001,arg10,_1,r;
       body=pl.get_Body();
       if(body.nodeType===2)
        {
         objectArg=this["HtmlProvider@33"];
         arg00=this.get_Body();
         _=objectArg.AppendAttribute(arg00,body);
        }
       else
        {
         objectArg1=this["HtmlProvider@33"];
         arg001=this.get_Body();
         arg10=pl.get_Body();
         _=objectArg1.AppendNode(arg001,arg10);
        }
       if(this.IsRendered)
        {
         _1=pl.Render();
        }
       else
        {
         r=this.RenderInternal;
         _1=void(this.RenderInternal=function()
         {
          r(null);
          return pl.Render();
         });
        }
       return _1;
      },
      AppendN:function(node)
      {
       var objectArg,arg00;
       objectArg=this["HtmlProvider@33"];
       arg00=this.get_Body();
       return objectArg.AppendNode(arg00,node);
      },
      OnLoad:function(f)
      {
       var objectArg,arg00;
       objectArg=this["HtmlProvider@33"];
       arg00=this.get_Body();
       return objectArg.OnLoad(arg00,f);
      },
      Render:function()
      {
       var _;
       if(!this.IsRendered)
        {
         this.RenderInternal.call(null,null);
         _=void(this.IsRendered=true);
        }
       else
        {
         _=null;
        }
       return _;
      },
      get_Body:function()
      {
       return this.Dom;
      },
      get_Html:function()
      {
       return this["HtmlProvider@33"].GetHtml(this.get_Body());
      },
      get_HtmlProvider:function()
      {
       return this["HtmlProvider@33"];
      },
      get_Id:function()
      {
       var objectArg,arg00,id,_,newId,objectArg1,arg001;
       objectArg=this["HtmlProvider@33"];
       arg00=this.get_Body();
       id=objectArg.GetProperty(arg00,"id");
       if(id===undefined?true:id==="")
        {
         newId="id"+Math.round(Math.random()*100000000);
         objectArg1=this["HtmlProvider@33"];
         arg001=this.get_Body();
         objectArg1.SetProperty(arg001,"id",newId);
         _=newId;
        }
       else
        {
         _=id;
        }
       return _;
      },
      get_Item:function(name)
      {
       var objectArg,arg00,objectArg1,arg001;
       objectArg=this["HtmlProvider@33"];
       arg00=this.get_Body();
       objectArg.GetAttribute(arg00,name);
       objectArg1=this["HtmlProvider@33"];
       arg001=this.get_Body();
       return objectArg1.GetAttribute(arg001,name);
      },
      get_Text:function()
      {
       return this["HtmlProvider@33"].GetText(this.get_Body());
      },
      get_Value:function()
      {
       return this["HtmlProvider@33"].GetValue(this.get_Body());
      },
      set_Html:function(x)
      {
       var objectArg,arg00;
       objectArg=this["HtmlProvider@33"];
       arg00=this.get_Body();
       return objectArg.SetHtml(arg00,x);
      },
      set_Item:function(name,value)
      {
       var objectArg,arg00;
       objectArg=this["HtmlProvider@33"];
       arg00=this.get_Body();
       return objectArg.SetAttribute(arg00,name,value);
      },
      set_Text:function(x)
      {
       var objectArg,arg00;
       objectArg=this["HtmlProvider@33"];
       arg00=this.get_Body();
       return objectArg.SetText(arg00,x);
      },
      set_Value:function(x)
      {
       var objectArg,arg00;
       objectArg=this["HtmlProvider@33"];
       arg00=this.get_Body();
       return objectArg.SetValue(arg00,x);
      }
     },{
      New:function(html,name)
      {
       var el,dom;
       el=Element.New1(html);
       dom=document.createElement(name);
       el.RenderInternal=function()
       {
       };
       el.Dom=dom;
       el.IsRendered=false;
       return el;
      },
      New1:function(HtmlProvider)
      {
       var r;
       r=Runtime.New(this,Pagelet.New());
       r["HtmlProvider@33"]=HtmlProvider;
       return r;
      }
     }),
     Events:{
      JQueryEventSupport:Runtime.Class({
       OnBlur:function(f,el)
       {
        return jQuery(el.get_Body()).bind("blur",function()
        {
         return f(el);
        });
       },
       OnChange:function(f,el)
       {
        return jQuery(el.get_Body()).bind("change",function()
        {
         return f(el);
        });
       },
       OnClick:function(f,el)
       {
        return this.OnMouse("click",f,el);
       },
       OnDoubleClick:function(f,el)
       {
        return this.OnMouse("dblclick",f,el);
       },
       OnError:function(f,el)
       {
        return jQuery(el.get_Body()).bind("error",function()
        {
         return f(el);
        });
       },
       OnEvent:function(ev,f,el)
       {
        return jQuery(el.get_Body()).bind(ev,function(ev1)
        {
         return(f(el))(ev1);
        });
       },
       OnFocus:function(f,el)
       {
        return jQuery(el.get_Body()).bind("focus",function()
        {
         return f(el);
        });
       },
       OnKeyDown:function(f,el)
       {
        return jQuery(el.get_Body()).bind("keydown",function(ev)
        {
         return(f(el))({
          KeyCode:ev.keyCode,
          Event:ev
         });
        });
       },
       OnKeyPress:function(f,el)
       {
        return jQuery(el.get_Body()).keypress(function(ev)
        {
         return(f(el))({
          CharacterCode:ev.which,
          Event:ev
         });
        });
       },
       OnKeyUp:function(f,el)
       {
        return jQuery(el.get_Body()).bind("keyup",function(ev)
        {
         return(f(el))({
          KeyCode:ev.keyCode,
          Event:ev
         });
        });
       },
       OnLoad:function(f,el)
       {
        return jQuery(el.get_Body()).bind("load",function()
        {
         return f(el);
        });
       },
       OnMouse:function(name,f,el)
       {
        return jQuery(el.get_Body()).bind(name,function(ev)
        {
         return(f(el))({
          X:ev.pageX,
          Y:ev.pageY,
          Event:ev
         });
        });
       },
       OnMouseDown:function(f,el)
       {
        return this.OnMouse("mousedown",f,el);
       },
       OnMouseEnter:function(f,el)
       {
        return this.OnMouse("mouseenter",f,el);
       },
       OnMouseLeave:function(f,el)
       {
        return this.OnMouse("mouseleave",f,el);
       },
       OnMouseMove:function(f,el)
       {
        return this.OnMouse("mousemove",f,el);
       },
       OnMouseOut:function(f,el)
       {
        return this.OnMouse("mouseout",f,el);
       },
       OnMouseUp:function(f,el)
       {
        return this.OnMouse("mouseup",f,el);
       },
       OnResize:function(f,el)
       {
        return jQuery(el.get_Body()).bind("resize",function()
        {
         return f(el);
        });
       },
       OnScroll:function(f,el)
       {
        return jQuery(el.get_Body()).bind("scroll",function()
        {
         return f(el);
        });
       },
       OnSelect:function(f,el)
       {
        return jQuery(el.get_Body()).bind("select",function()
        {
         return f(el);
        });
       },
       OnSubmit:function(f,el)
       {
        return jQuery(el.get_Body()).bind("submit",function()
        {
         return f(el);
        });
       },
       OnUnLoad:function(f,el)
       {
        return jQuery(el.get_Body()).bind("unload",function()
        {
         return f(el);
        });
       }
      },{
       New:function()
       {
        return Runtime.New(this,{});
       }
      })
     },
     EventsPervasives:{
      Events:Runtime.Field(function()
      {
       return JQueryEventSupport.New();
      })
     },
     Implementation:{
      Attr:Runtime.Field(function()
      {
       return AttributeBuilder.New(Implementation.HtmlProvider());
      }),
      DeprecatedHtml:Runtime.Field(function()
      {
       return DeprecatedTagBuilder.New(Implementation.HtmlProvider());
      }),
      HtmlProvider:Runtime.Field(function()
      {
       return JQueryHtmlProvider.New();
      }),
      JQueryHtmlProvider:Runtime.Class({
       AddClass:function(node,cls)
       {
        return jQuery(node).addClass(cls);
       },
       AppendAttribute:function(node,attr)
       {
        var arg10,arg20;
        arg10=attr.nodeName;
        arg20=attr.value;
        return this.SetAttribute(node,arg10,arg20);
       },
       AppendNode:function(node,el)
       {
        return jQuery(node).append(jQuery(el));
       },
       Clear:function(node)
       {
        return jQuery(node).contents().detach();
       },
       CreateAttribute:function(str)
       {
        return document.createAttribute(str);
       },
       CreateElement:function(name)
       {
        return document.createElement(name);
       },
       CreateTextNode:function(str)
       {
        return document.createTextNode(str);
       },
       GetAttribute:function(node,name)
       {
        return jQuery(node).attr(name);
       },
       GetHtml:function(node)
       {
        return jQuery(node).html();
       },
       GetProperty:function(node,name)
       {
        var x;
        x=jQuery(node).attr(name);
        return x;
       },
       GetText:function(node)
       {
        return node.textContent;
       },
       GetValue:function(node)
       {
        var x;
        x=jQuery(node).val();
        return x;
       },
       HasAttribute:function(node,name)
       {
        return jQuery(node).attr(name)!=null;
       },
       OnDocumentReady:function(f)
       {
        return jQuery(document).ready(f);
       },
       OnLoad:function(node,f)
       {
        return jQuery(node).ready(f);
       },
       Remove:function(node)
       {
        return jQuery(node).remove();
       },
       RemoveAttribute:function(node,name)
       {
        return jQuery(node).removeAttr(name);
       },
       RemoveClass:function(node,cls)
       {
        return jQuery(node).removeClass(cls);
       },
       SetAttribute:function(node,name,value)
       {
        return jQuery(node).attr(name,value);
       },
       SetCss:function(node,name,prop)
       {
        return jQuery(node).css(name,prop);
       },
       SetHtml:function(node,text)
       {
        return jQuery(node).html(text);
       },
       SetProperty:function(node,name,value)
       {
        var x;
        x=jQuery(node).prop(name,value);
        return x;
       },
       SetStyle:function(node,style)
       {
        return jQuery(node).attr("style",style);
       },
       SetText:function(node,text)
       {
        node.textContent=text;
       },
       SetValue:function(node,value)
       {
        return jQuery(node).val(value);
       }
      },{
       New:function()
       {
        return Runtime.New(this,{});
       }
      }),
      Tags:Runtime.Field(function()
      {
       return TagBuilder.New(Implementation.HtmlProvider());
      })
     },
     Operators:{
      OnAfterRender:function(f,w)
      {
       var r;
       r=w.Render;
       w.Render=function()
       {
        r.apply(w);
        return f(w);
       };
       return;
      },
      OnBeforeRender:function(f,w)
      {
       var r;
       r=w.Render;
       w.Render=function()
       {
        f(w);
        return r.apply(w);
       };
       return;
      },
      add:function(el,inner)
      {
       var enumerator,pl;
       enumerator=Enumerator.Get(inner);
       while(enumerator.MoveNext())
        {
         pl=enumerator.get_Current();
         el.AppendI(pl);
        }
       return el;
      }
     },
     Pagelet:Runtime.Class({
      AppendTo:function(targetId)
      {
       var target,value;
       target=document.getElementById(targetId);
       value=target.appendChild(this.get_Body());
       return this.Render();
      },
      Render:function()
      {
       return null;
      },
      ReplaceInDom:function(node)
      {
       var value;
       value=node.parentNode.replaceChild(this.get_Body(),node);
       return this.Render();
      }
     },{
      New:function()
      {
       return Runtime.New(this,{});
      }
     }),
     TagBuilder:Runtime.Class({
      NewTag:function(name,children)
      {
       var el,enumerator,pl;
       el=Element.New(this.HtmlProvider,name);
       enumerator=Enumerator.Get(children);
       while(enumerator.MoveNext())
        {
         pl=enumerator.get_Current();
         el.AppendI(pl);
        }
       return el;
      },
      text:function(data)
      {
       return Text.New(data);
      }
     },{
      New:function(HtmlProvider)
      {
       var r;
       r=Runtime.New(this,{});
       r.HtmlProvider=HtmlProvider;
       return r;
      }
     }),
     Tags:{
      Deprecated:Runtime.Field(function()
      {
       return Implementation.DeprecatedHtml();
      }),
      Tags:Runtime.Field(function()
      {
       return Implementation.Tags();
      })
     },
     Text:Runtime.Class({
      get_Body:function()
      {
       return document.createTextNode(this.text);
      }
     },{
      New:function(text)
      {
       var r;
       r=Runtime.New(this,Pagelet.New());
       r.text=text;
       return r;
      }
     })
    }
   }
  }
 });
 Runtime.OnInit(function()
 {
  Html=Runtime.Safe(Global.WebSharper.Html);
  Client=Runtime.Safe(Html.Client);
  Implementation=Runtime.Safe(Client.Implementation);
  Attribute=Runtime.Safe(Client.Attribute);
  Pagelet=Runtime.Safe(Client.Pagelet);
  Element=Runtime.Safe(Client.Element);
  Enumerator=Runtime.Safe(Global.WebSharper.Enumerator);
  Math=Runtime.Safe(Global.Math);
  document=Runtime.Safe(Global.document);
  jQuery=Runtime.Safe(Global.jQuery);
  Events=Runtime.Safe(Client.Events);
  JQueryEventSupport=Runtime.Safe(Events.JQueryEventSupport);
  AttributeBuilder=Runtime.Safe(Client.AttributeBuilder);
  DeprecatedTagBuilder=Runtime.Safe(Client.DeprecatedTagBuilder);
  JQueryHtmlProvider=Runtime.Safe(Implementation.JQueryHtmlProvider);
  TagBuilder=Runtime.Safe(Client.TagBuilder);
  Text=Runtime.Safe(Client.Text);
  Attr=Runtime.Safe(Client.Attr);
  EventsPervasives=Runtime.Safe(Client.EventsPervasives);
  return Tags=Runtime.Safe(Client.Tags);
 });
 Runtime.OnLoad(function()
 {
  Runtime.Inherit(Attribute,Pagelet);
  Runtime.Inherit(Element,Pagelet);
  Runtime.Inherit(Text,Pagelet);
  Tags.Tags();
  Tags.Deprecated();
  Implementation.Tags();
  Implementation.HtmlProvider();
  Implementation.DeprecatedHtml();
  Implementation.Attr();
  EventsPervasives.Events();
  Attr.Attr();
  return;
 });
}());

(function()
{
 var Global=this,Runtime=this.IntelliFactory.Runtime,Unchecked,Seq,Option,Control,Disposable,Arrays,FSharpEvent,Util,Event,Event1,Collections,ResizeArray,ResizeArrayProxy,EventModule,HotStream,HotStream1,Operators,Error,Concurrency,setTimeout,clearTimeout,LinkedList,ListProxy,MailboxProcessor,Observable,Observer,Observable1,List,T,Observer1;
 Runtime.Define(Global,{
  WebSharper:{
   Control:{
    Disposable:{
     Of:function(dispose)
     {
      return{
       Dispose:dispose
      };
     }
    },
    Event:{
     Event:Runtime.Class({
      AddHandler:function(h)
      {
       return this.Handlers.Add(h);
      },
      RemoveHandler:function(h)
      {
       var predicate,objectArg,action,source,option;
       predicate=function(y)
       {
        return Unchecked.Equals(h,y);
       };
       objectArg=this.Handlers;
       action=function(arg00)
       {
        return objectArg.RemoveAt(arg00);
       };
       source=this.Handlers;
       option=Seq.tryFindIndex(predicate,source);
       return Option.iter(action,option);
      },
      Subscribe:function(observer)
      {
       var h,_this=this;
       h=function(x)
       {
        return observer.OnNext(x);
       };
       this.AddHandler(h);
       return Disposable.Of(function()
       {
        return _this.RemoveHandler(h);
       });
      },
      Trigger:function(x)
      {
       var arr,idx,h;
       arr=this.Handlers.ToArray();
       for(idx=0;idx<=arr.length-1;idx++){
        h=Arrays.get(arr,idx);
        h(x);
       }
       return;
      }
     })
    },
    EventModule:{
     Choose:function(c,e)
     {
      var r;
      r=FSharpEvent.New();
      Util.addListener(e,function(x)
      {
       var matchValue,_,y;
       matchValue=c(x);
       if(matchValue.$==0)
        {
         _=null;
        }
       else
        {
         y=matchValue.$0;
         _=r.event.Trigger(y);
        }
       return _;
      });
      return r.event;
     },
     Filter:function(ok,e)
     {
      var r;
      r=Runtime.New(Event1,{
       Handlers:ResizeArrayProxy.New2()
      });
      Util.addListener(e,function(x)
      {
       return ok(x)?r.Trigger(x):null;
      });
      return r;
     },
     Map:function(f,e)
     {
      var r;
      r=Runtime.New(Event1,{
       Handlers:ResizeArrayProxy.New2()
      });
      Util.addListener(e,function(x)
      {
       return r.Trigger(f(x));
      });
      return r;
     },
     Merge:function(e1,e2)
     {
      var r;
      r=Runtime.New(Event1,{
       Handlers:ResizeArrayProxy.New2()
      });
      Util.addListener(e1,function(arg00)
      {
       return r.Trigger(arg00);
      });
      Util.addListener(e2,function(arg00)
      {
       return r.Trigger(arg00);
      });
      return r;
     },
     Pairwise:function(e)
     {
      var buf,ev;
      buf={
       contents:{
        $:0
       }
      };
      ev=Runtime.New(Event1,{
       Handlers:ResizeArrayProxy.New2()
      });
      Util.addListener(e,function(x)
      {
       var matchValue,_,old;
       matchValue=buf.contents;
       if(matchValue.$==1)
        {
         old=matchValue.$0;
         buf.contents={
          $:1,
          $0:x
         };
         _=ev.Trigger([old,x]);
        }
       else
        {
         _=void(buf.contents={
          $:1,
          $0:x
         });
        }
       return _;
      });
      return ev;
     },
     Partition:function(f,e)
     {
      return[EventModule.Filter(f,e),EventModule.Filter(function(x)
      {
       var value;
       value=f(x);
       return!value;
      },e)];
     },
     Scan:function(fold,seed,e)
     {
      var state,f;
      state={
       contents:seed
      };
      f=function(value)
      {
       state.contents=(fold(state.contents))(value);
       return state.contents;
      };
      return EventModule.Map(f,e);
     },
     Split:function(f,e)
     {
      var chooser,chooser1;
      chooser=function(x)
      {
       var matchValue,_,x1;
       matchValue=f(x);
       if(matchValue.$==0)
        {
         x1=matchValue.$0;
         _={
          $:1,
          $0:x1
         };
        }
       else
        {
         _={
          $:0
         };
        }
       return _;
      };
      chooser1=function(x)
      {
       var matchValue,_,x1;
       matchValue=f(x);
       if(matchValue.$==1)
        {
         x1=matchValue.$0;
         _={
          $:1,
          $0:x1
         };
        }
       else
        {
         _={
          $:0
         };
        }
       return _;
      };
      return[EventModule.Choose(chooser,e),EventModule.Choose(chooser1,e)];
     }
    },
    FSharpEvent:Runtime.Class({},{
     New:function()
     {
      var r;
      r=Runtime.New(this,{});
      r.event=Runtime.New(Event1,{
       Handlers:ResizeArrayProxy.New2()
      });
      return r;
     }
    }),
    HotStream:{
     HotStream:Runtime.Class({
      Subscribe:function(o)
      {
       var disp,_this;
       this.Latest.contents.$==1?o.OnNext(this.Latest.contents.$0):null;
       _this=this.Event;
       disp=Util.subscribeTo(_this.event,function(v)
       {
        return o.OnNext(v);
       });
       return disp;
      },
      Trigger:function(v)
      {
       var _this;
       this.Latest.contents={
        $:1,
        $0:v
       };
       _this=this.Event;
       return _this.event.Trigger(v);
      }
     },{
      New:function()
      {
       return Runtime.New(HotStream1,{
        Latest:{
         contents:{
          $:0
         }
        },
        Event:FSharpEvent.New()
       });
      }
     })
    },
    MailboxProcessor:Runtime.Class({
     PostAndAsyncReply:function(msgf,timeout)
     {
      var f,_this=this;
      f=function()
      {
       var x,f1;
       x=_this.PostAndTryAsyncReply(msgf,timeout);
       f1=function(_arg4)
       {
        var x1,_,x2;
        if(_arg4.$==1)
         {
          x2=_arg4.$0;
          _=x2;
         }
        else
         {
          _=Operators.Raise(new Error("TimeoutException"));
         }
        x1=_;
        return Concurrency.Return(x1);
       };
       return Concurrency.Bind(x,f1);
      };
      return Concurrency.Delay(f);
     },
     PostAndTryAsyncReply:function(msgf,timeout)
     {
      var timeout1,arg00,_this=this;
      timeout1=Operators.DefaultArg(timeout,this.get_DefaultTimeout());
      arg00=function(tupledArg)
      {
       var ok,_arg3,_arg4,_,arg001,value,waiting,arg002,value1,value2;
       ok=tupledArg[0];
       _arg3=tupledArg[1];
       _arg4=tupledArg[2];
       if(timeout1<0)
        {
         arg001=msgf(function(x)
         {
          return ok({
           $:1,
           $0:x
          });
         });
         value=_this.mailbox.AddLast(arg001);
         _=_this.resume();
        }
       else
        {
         waiting={
          contents:true
         };
         arg002=msgf(function(res)
         {
          var _1;
          if(waiting.contents)
           {
            waiting.contents=false;
            _1=ok({
             $:1,
             $0:res
            });
           }
          else
           {
            _1=null;
           }
          return _1;
         });
         value1=_this.mailbox.AddLast(arg002);
         _this.resume();
         value2=setTimeout(function()
         {
          var _1;
          if(waiting.contents)
           {
            waiting.contents=false;
            _1=ok({
             $:0
            });
           }
          else
           {
            _1=null;
           }
          return _1;
         },timeout1);
         _=void value2;
        }
       return _;
      };
      return Concurrency.FromContinuations(arg00);
     },
     Receive:function(timeout)
     {
      var f,_this=this;
      f=function()
      {
       var x,f1;
       x=_this.TryReceive(timeout);
       f1=function(_arg3)
       {
        var x1,_,x2;
        if(_arg3.$==1)
         {
          x2=_arg3.$0;
          _=x2;
         }
        else
         {
          _=Operators.Raise(new Error("TimeoutException"));
         }
        x1=_;
        return Concurrency.Return(x1);
       };
       return Concurrency.Bind(x,f1);
      };
      return Concurrency.Delay(f);
     },
     Scan:function(scanner,timeout)
     {
      var f,_this=this;
      f=function()
      {
       var x,f1;
       x=_this.TryScan(scanner,timeout);
       f1=function(_arg8)
       {
        var x1,_,x2;
        if(_arg8.$==1)
         {
          x2=_arg8.$0;
          _=x2;
         }
        else
         {
          _=Operators.Raise(new Error("TimeoutException"));
         }
        x1=_;
        return Concurrency.Return(x1);
       };
       return Concurrency.Bind(x,f1);
      };
      return Concurrency.Delay(f);
     },
     Start:function()
     {
      var _,f,_this=this,a1;
      if(this.started)
       {
        _=Operators.FailWith("The MailboxProcessor has already been started.");
       }
      else
       {
        this.started=true;
        f=function()
        {
         var f1,a,f3;
         f1=function()
         {
          var x,f2;
          x=_this.initial.call(null,_this);
          f2=function()
          {
           return Concurrency.Return(null);
          };
          return Concurrency.Bind(x,f2);
         };
         a=Concurrency.Delay(f1);
         f3=function(_arg2)
         {
          var _this1;
          _this1=_this.errorEvent;
          _this1.event.Trigger(_arg2);
          return Concurrency.Return(null);
         };
         return Concurrency.TryWith(a,f3);
        };
        a1=Concurrency.Delay(f);
        _=_this.startAsync(a1);
       }
      return _;
     },
     TryReceive:function(timeout)
     {
      var timeout1,arg00,_this=this;
      timeout1=Operators.DefaultArg(timeout,this.get_DefaultTimeout());
      arg00=function(tupledArg)
      {
       var ok,_arg1,_arg2,_,_1,f,arg01,waiting,pending,f1,arg02,arg03;
       ok=tupledArg[0];
       _arg1=tupledArg[1];
       _arg2=tupledArg[2];
       if(Unchecked.Equals(_this.mailbox.get_First(),null))
        {
         if(timeout1<0)
          {
           f=function()
           {
            var arg0;
            arg0=_this.dequeue();
            ok({
             $:1,
             $0:arg0
            });
            return Concurrency.Return(null);
           };
           arg01=Concurrency.Delay(f);
           _1=void(_this.savedCont={
            $:1,
            $0:arg01
           });
          }
         else
          {
           waiting={
            contents:true
           };
           pending=setTimeout(function()
           {
            var _2;
            if(waiting.contents)
             {
              waiting.contents=false;
              _this.savedCont={
               $:0
              };
              _2=ok({
               $:0
              });
             }
            else
             {
              _2=null;
             }
            return _2;
           },timeout1);
           f1=function()
           {
            var _2,arg0;
            if(waiting.contents)
             {
              waiting.contents=false;
              clearTimeout(pending);
              arg0=_this.dequeue();
              ok({
               $:1,
               $0:arg0
              });
              _2=Concurrency.Return(null);
             }
            else
             {
              _2=Concurrency.Return(null);
             }
            return _2;
           };
           arg02=Concurrency.Delay(f1);
           _1=void(_this.savedCont={
            $:1,
            $0:arg02
           });
          }
         _=_1;
        }
       else
        {
         arg03=_this.dequeue();
         _=ok({
          $:1,
          $0:arg03
         });
        }
       return _;
      };
      return Concurrency.FromContinuations(arg00);
     },
     TryScan:function(scanner,timeout)
     {
      var timeout1,f,_this=this;
      timeout1=Operators.DefaultArg(timeout,this.get_DefaultTimeout());
      f=function()
      {
       var scanInbox,matchValue1,_1,found1,f1,arg00,x1;
       scanInbox=function()
       {
        var m,found,matchValue,_;
        m=_this.mailbox.get_First();
        found={
         $:0
        };
        while(!Unchecked.Equals(m,null))
         {
          matchValue=scanner(m.v);
          if(matchValue.$==0)
           {
            _=m=m.n;
           }
          else
           {
            _this.mailbox.Remove(m);
            m=null;
            _=found=matchValue;
           }
         }
        return found;
       };
       matchValue1=scanInbox(null);
       if(matchValue1.$==1)
        {
         found1=matchValue1.$0;
         f1=function(_arg5)
         {
          var x;
          x={
           $:1,
           $0:_arg5
          };
          return Concurrency.Return(x);
         };
         _1=Concurrency.Bind(found1,f1);
        }
       else
        {
         arg00=function(tupledArg)
         {
          var ok,_arg5,_arg6,_,scanNext,waiting,pending,scanNext1;
          ok=tupledArg[0];
          _arg5=tupledArg[1];
          _arg6=tupledArg[2];
          if(timeout1<0)
           {
            scanNext=function()
            {
             var f2,arg0;
             f2=function()
             {
              var matchValue,_2,c,f3;
              matchValue=scanner(_this.mailbox.get_First().v);
              if(matchValue.$==1)
               {
                c=matchValue.$0;
                _this.mailbox.RemoveFirst();
                f3=function(_arg61)
                {
                 ok({
                  $:1,
                  $0:_arg61
                 });
                 return Concurrency.Return(null);
                };
                _2=Concurrency.Bind(c,f3);
               }
              else
               {
                scanNext(null);
                _2=Concurrency.Return(null);
               }
              return _2;
             };
             arg0=Concurrency.Delay(f2);
             _this.savedCont={
              $:1,
              $0:arg0
             };
             return;
            };
            _=scanNext(null);
           }
          else
           {
            waiting={
             contents:true
            };
            pending=setTimeout(function()
            {
             var _2;
             if(waiting.contents)
              {
               waiting.contents=false;
               _this.savedCont={
                $:0
               };
               _2=ok({
                $:0
               });
              }
             else
              {
               _2=null;
              }
             return _2;
            },timeout1);
            scanNext1=function()
            {
             var f2,arg0;
             f2=function()
             {
              var matchValue,_2,c,f3;
              matchValue=scanner(_this.mailbox.get_First().v);
              if(matchValue.$==1)
               {
                c=matchValue.$0;
                _this.mailbox.RemoveFirst();
                f3=function(_arg7)
                {
                 var _3;
                 if(waiting.contents)
                  {
                   waiting.contents=false;
                   clearTimeout(pending);
                   ok({
                    $:1,
                    $0:_arg7
                   });
                   _3=Concurrency.Return(null);
                  }
                 else
                  {
                   _3=Concurrency.Return(null);
                  }
                 return _3;
                };
                _2=Concurrency.Bind(c,f3);
               }
              else
               {
                scanNext1(null);
                _2=Concurrency.Return(null);
               }
              return _2;
             };
             arg0=Concurrency.Delay(f2);
             _this.savedCont={
              $:1,
              $0:arg0
             };
             return;
            };
            _=scanNext1(null);
           }
          return _;
         };
         x1=Concurrency.FromContinuations(arg00);
         _1=x1;
        }
       return _1;
      };
      return Concurrency.Delay(f);
     },
     dequeue:function()
     {
      var f;
      f=this.mailbox.get_First().v;
      this.mailbox.RemoveFirst();
      return f;
     },
     get_CurrentQueueLength:function()
     {
      return this.mailbox.get_Count();
     },
     get_DefaultTimeout:function()
     {
      return this["DefaultTimeout@"];
     },
     get_Error:function()
     {
      var _this;
      _this=this.errorEvent;
      return _this.event;
     },
     resume:function()
     {
      var matchValue,_,c;
      matchValue=this.savedCont;
      if(matchValue.$==1)
       {
        c=matchValue.$0;
        this.savedCont={
         $:0
        };
        _=this.startAsync(c);
       }
      else
       {
        _=null;
       }
      return _;
     },
     set_DefaultTimeout:function(v)
     {
      this["DefaultTimeout@"]=v;
      return;
     },
     startAsync:function(a)
     {
      var t;
      t=this.token;
      return Concurrency.Start(a,t);
     }
    },{
     New:function(initial,token)
     {
      var r,matchValue,_,ct,callback,value;
      r=Runtime.New(this,{});
      r.initial=initial;
      r.token=token;
      r.started=false;
      r.errorEvent=FSharpEvent.New();
      r.mailbox=ListProxy.New();
      r.savedCont={
       $:0
      };
      matchValue=r.token;
      if(matchValue.$==0)
       {
        _=null;
       }
      else
       {
        ct=matchValue.$0;
        callback=function()
        {
         return r.resume();
        };
        value=Concurrency.Register(ct,function()
        {
         return callback();
        });
        _=void value;
       }
      r["DefaultTimeout@"]=-1;
      return r;
     },
     Start:function(initial,token)
     {
      var mb;
      mb=MailboxProcessor.New(initial,token);
      mb.Start();
      return mb;
     }
    }),
    Observable:{
     Aggregate:function(io,seed,fold)
     {
      var f;
      f=function(o1)
      {
       var state,on,arg001;
       state={
        contents:seed
       };
       on=function(v)
       {
        return Observable.Protect(function()
        {
         return(fold(state.contents))(v);
        },function(s)
        {
         state.contents=s;
         return o1.OnNext(s);
        },function(arg00)
        {
         return o1.OnError(arg00);
        });
       };
       arg001=Observer.New(on,function(arg00)
       {
        return o1.OnError(arg00);
       },function()
       {
        return o1.OnCompleted();
       });
       return io.Subscribe(arg001);
      };
      return Observable.New(f);
     },
     Choose:function(f,io)
     {
      var f1;
      f1=function(o1)
      {
       var on,arg001;
       on=function(v)
       {
        var action;
        action=function(arg00)
        {
         return o1.OnNext(arg00);
        };
        return Observable.Protect(function()
        {
         return f(v);
        },function(option)
        {
         return Option.iter(action,option);
        },function(arg00)
        {
         return o1.OnError(arg00);
        });
       };
       arg001=Observer.New(on,function(arg00)
       {
        return o1.OnError(arg00);
       },function()
       {
        return o1.OnCompleted();
       });
       return io.Subscribe(arg001);
      };
      return Observable.New(f1);
     },
     CombineLatest:function(io1,io2,f)
     {
      var f1;
      f1=function(o)
      {
       var lv1,lv2,update,onNext,o1,onNext1,o2,d1,d2;
       lv1={
        contents:{
         $:0
        }
       };
       lv2={
        contents:{
         $:0
        }
       };
       update=function()
       {
        var matchValue,_,_1,v1,v2;
        matchValue=[lv1.contents,lv2.contents];
        if(matchValue[0].$==1)
         {
          if(matchValue[1].$==1)
           {
            v1=matchValue[0].$0;
            v2=matchValue[1].$0;
            _1=Observable.Protect(function()
            {
             return(f(v1))(v2);
            },function(arg00)
            {
             return o.OnNext(arg00);
            },function(arg00)
            {
             return o.OnError(arg00);
            });
           }
          else
           {
            _1=null;
           }
          _=_1;
         }
        else
         {
          _=null;
         }
        return _;
       };
       onNext=function(x)
       {
        lv1.contents={
         $:1,
         $0:x
        };
        return update(null);
       };
       o1=Observer.New(onNext,function()
       {
       },function()
       {
       });
       onNext1=function(y)
       {
        lv2.contents={
         $:1,
         $0:y
        };
        return update(null);
       };
       o2=Observer.New(onNext1,function()
       {
       },function()
       {
       });
       d1=io1.Subscribe(o1);
       d2=io2.Subscribe(o2);
       return Disposable.Of(function()
       {
        d1.Dispose();
        return d2.Dispose();
       });
      };
      return Observable.New(f1);
     },
     Concat:function(io1,io2)
     {
      var f;
      f=function(o)
      {
       var innerDisp,outerDisp,dispose;
       innerDisp={
        contents:{
         $:0
        }
       };
       outerDisp=io1.Subscribe(Observer.New(function(arg00)
       {
        return o.OnNext(arg00);
       },function()
       {
       },function()
       {
        var arg0;
        arg0=io2.Subscribe(o);
        innerDisp.contents={
         $:1,
         $0:arg0
        };
       }));
       dispose=function()
       {
        innerDisp.contents.$==1?innerDisp.contents.$0.Dispose():null;
        return outerDisp.Dispose();
       };
       return Disposable.Of(dispose);
      };
      return Observable.New(f);
     },
     Drop:function(count,io)
     {
      var f;
      f=function(o1)
      {
       var index,on,arg00;
       index={
        contents:0
       };
       on=function(v)
       {
        Operators.Increment(index);
        return index.contents>count?o1.OnNext(v):null;
       };
       arg00=Observer.New(on,function(arg001)
       {
        return o1.OnError(arg001);
       },function()
       {
        return o1.OnCompleted();
       });
       return io.Subscribe(arg00);
      };
      return Observable.New(f);
     },
     Filter:function(f,io)
     {
      var f1;
      f1=function(o1)
      {
       var on,arg001;
       on=function(v)
       {
        var action;
        action=function(arg00)
        {
         return o1.OnNext(arg00);
        };
        return Observable.Protect(function()
        {
         return f(v)?{
          $:1,
          $0:v
         }:{
          $:0
         };
        },function(option)
        {
         return Option.iter(action,option);
        },function(arg00)
        {
         return o1.OnError(arg00);
        });
       };
       arg001=Observer.New(on,function(arg00)
       {
        return o1.OnError(arg00);
       },function()
       {
        return o1.OnCompleted();
       });
       return io.Subscribe(arg001);
      };
      return Observable.New(f1);
     },
     Map:function(f,io)
     {
      var f1;
      f1=function(o1)
      {
       var on,arg001;
       on=function(v)
       {
        return Observable.Protect(function()
        {
         return f(v);
        },function(arg00)
        {
         return o1.OnNext(arg00);
        },function(arg00)
        {
         return o1.OnError(arg00);
        });
       };
       arg001=Observer.New(on,function(arg00)
       {
        return o1.OnError(arg00);
       },function()
       {
        return o1.OnCompleted();
       });
       return io.Subscribe(arg001);
      };
      return Observable.New(f1);
     },
     Merge:function(io1,io2)
     {
      var f;
      f=function(o)
      {
       var completed1,completed2,arg00,disp1,arg002,disp2;
       completed1={
        contents:false
       };
       completed2={
        contents:false
       };
       arg00=Observer.New(function(arg001)
       {
        return o.OnNext(arg001);
       },function()
       {
       },function()
       {
        completed1.contents=true;
        return(completed1.contents?completed2.contents:false)?o.OnCompleted():null;
       });
       disp1=io1.Subscribe(arg00);
       arg002=Observer.New(function(arg001)
       {
        return o.OnNext(arg001);
       },function()
       {
       },function()
       {
        completed2.contents=true;
        return(completed1.contents?completed2.contents:false)?o.OnCompleted():null;
       });
       disp2=io2.Subscribe(arg002);
       return Disposable.Of(function()
       {
        disp1.Dispose();
        return disp2.Dispose();
       });
      };
      return Observable.New(f);
     },
     Never:function()
     {
      return Observable.New(function()
      {
       return Disposable.Of(function()
       {
       });
      });
     },
     New:function(f)
     {
      return Runtime.New(Observable1,{
       Subscribe1:f
      });
     },
     Observable:Runtime.Class({
      Subscribe:function(observer)
      {
       return this.Subscribe1.call(null,observer);
      }
     }),
     Of:function(f)
     {
      return Observable.New(function(o)
      {
       return Disposable.Of(f(function(x)
       {
        return o.OnNext(x);
       }));
      });
     },
     Protect:function(f,succeed,fail)
     {
      var matchValue,_,e,_1,e1,x;
      try
      {
       _={
        $:0,
        $0:f(null)
       };
      }
      catch(e)
      {
       _={
        $:1,
        $0:e
       };
      }
      matchValue=_;
      if(matchValue.$==1)
       {
        e1=matchValue.$0;
        _1=fail(e1);
       }
      else
       {
        x=matchValue.$0;
        _1=succeed(x);
       }
      return _1;
     },
     Range:function(start,count)
     {
      var f;
      f=function(o)
      {
       var i;
       for(i=start;i<=start+count;i++){
        o.OnNext(i);
       }
       return Disposable.Of(function()
       {
       });
      };
      return Observable.New(f);
     },
     Return:function(x)
     {
      var f;
      f=function(o)
      {
       o.OnNext(x);
       o.OnCompleted();
       return Disposable.Of(function()
       {
       });
      };
      return Observable.New(f);
     },
     SelectMany:function(io)
     {
      return Observable.New(function(o)
      {
       var disp,d;
       disp={
        contents:function()
        {
        }
       };
       d=Util.subscribeTo(io,function(o1)
       {
        var d1;
        d1=Util.subscribeTo(o1,function(v)
        {
         return o.OnNext(v);
        });
        disp.contents=function()
        {
         disp.contents.call(null,null);
         return d1.Dispose();
        };
        return;
       });
       return Disposable.Of(function()
       {
        disp.contents.call(null,null);
        return d.Dispose();
       });
      });
     },
     Sequence:function(ios)
     {
      var sequence;
      sequence=function(ios1)
      {
       var _,xs,x,rest;
       if(ios1.$==1)
        {
         xs=ios1.$1;
         x=ios1.$0;
         rest=sequence(xs);
         _=Observable.CombineLatest(x,rest,function(x1)
         {
          return function(y)
          {
           return Runtime.New(T,{
            $:1,
            $0:x1,
            $1:y
           });
          };
         });
        }
       else
        {
         _=Observable.Return(Runtime.New(T,{
          $:0
         }));
        }
       return _;
      };
      return sequence(List.ofSeq(ios));
     },
     Switch:function(io)
     {
      return Observable.New(function(o)
      {
       var index,disp,disp1;
       index={
        contents:0
       };
       disp={
        contents:{
         $:0
        }
       };
       disp1=Util.subscribeTo(io,function(o1)
       {
        var currentIndex,arg0,d;
        Operators.Increment(index);
        disp.contents.$==1?disp.contents.$0.Dispose():null;
        currentIndex=index.contents;
        arg0=Util.subscribeTo(o1,function(v)
        {
         return currentIndex===index.contents?o.OnNext(v):null;
        });
        d={
         $:1,
         $0:arg0
        };
        disp.contents=d;
        return;
       });
       return disp1;
      });
     }
    },
    ObservableModule:{
     Pairwise:function(e)
     {
      var f;
      f=function(o1)
      {
       var last,on,arg00;
       last={
        contents:{
         $:0
        }
       };
       on=function(v)
       {
        var matchValue,_,l;
        matchValue=last.contents;
        if(matchValue.$==1)
         {
          l=matchValue.$0;
          _=o1.OnNext([l,v]);
         }
        else
         {
          _=null;
         }
        last.contents={
         $:1,
         $0:v
        };
        return;
       };
       arg00=Observer.New(on,function(arg001)
       {
        return o1.OnError(arg001);
       },function()
       {
        return o1.OnCompleted();
       });
       return e.Subscribe(arg00);
      };
      return Observable.New(f);
     },
     Partition:function(f,e)
     {
      var ok;
      ok=function(x)
      {
       var value;
       value=f(x);
       return!value;
      };
      return[Observable.Filter(f,e),Observable.Filter(ok,e)];
     },
     Scan:function(fold,seed,e)
     {
      var f;
      f=function(o1)
      {
       var state,on,arg001;
       state={
        contents:seed
       };
       on=function(v)
       {
        return Observable.Protect(function()
        {
         return(fold(state.contents))(v);
        },function(s)
        {
         state.contents=s;
         return o1.OnNext(s);
        },function(arg00)
        {
         return o1.OnError(arg00);
        });
       };
       arg001=Observer.New(on,function(arg00)
       {
        return o1.OnError(arg00);
       },function()
       {
        return o1.OnCompleted();
       });
       return e.Subscribe(arg001);
      };
      return Observable.New(f);
     },
     Split:function(f,e)
     {
      var chooser,left,chooser1,right;
      chooser=function(x)
      {
       var matchValue,_,x1;
       matchValue=f(x);
       if(matchValue.$==0)
        {
         x1=matchValue.$0;
         _={
          $:1,
          $0:x1
         };
        }
       else
        {
         _={
          $:0
         };
        }
       return _;
      };
      left=Observable.Choose(chooser,e);
      chooser1=function(x)
      {
       var matchValue,_,x1;
       matchValue=f(x);
       if(matchValue.$==1)
        {
         x1=matchValue.$0;
         _={
          $:1,
          $0:x1
         };
        }
       else
        {
         _={
          $:0
         };
        }
       return _;
      };
      right=Observable.Choose(chooser1,e);
      return[left,right];
     }
    },
    Observer:{
     New:function(f,e,c)
     {
      return Runtime.New(Observer1,{
       onNext:f,
       onError:e,
       onCompleted:c
      });
     },
     Observer:Runtime.Class({
      OnCompleted:function()
      {
       return this.onCompleted.call(null,null);
      },
      OnError:function(e)
      {
       return this.onError.call(null,e);
      },
      OnNext:function(x)
      {
       return this.onNext.call(null,x);
      }
     }),
     Of:function(f)
     {
      return Runtime.New(Observer1,{
       onNext:function(x)
       {
        return f(x);
       },
       onError:function(x)
       {
        return Operators.Raise(x);
       },
       onCompleted:function()
       {
        return null;
       }
      });
     }
    }
   }
  }
 });
 Runtime.OnInit(function()
 {
  Unchecked=Runtime.Safe(Global.WebSharper.Unchecked);
  Seq=Runtime.Safe(Global.WebSharper.Seq);
  Option=Runtime.Safe(Global.WebSharper.Option);
  Control=Runtime.Safe(Global.WebSharper.Control);
  Disposable=Runtime.Safe(Control.Disposable);
  Arrays=Runtime.Safe(Global.WebSharper.Arrays);
  FSharpEvent=Runtime.Safe(Control.FSharpEvent);
  Util=Runtime.Safe(Global.WebSharper.Util);
  Event=Runtime.Safe(Control.Event);
  Event1=Runtime.Safe(Event.Event);
  Collections=Runtime.Safe(Global.WebSharper.Collections);
  ResizeArray=Runtime.Safe(Collections.ResizeArray);
  ResizeArrayProxy=Runtime.Safe(ResizeArray.ResizeArrayProxy);
  EventModule=Runtime.Safe(Control.EventModule);
  HotStream=Runtime.Safe(Control.HotStream);
  HotStream1=Runtime.Safe(HotStream.HotStream);
  Operators=Runtime.Safe(Global.WebSharper.Operators);
  Error=Runtime.Safe(Global.Error);
  Concurrency=Runtime.Safe(Global.WebSharper.Concurrency);
  setTimeout=Runtime.Safe(Global.setTimeout);
  clearTimeout=Runtime.Safe(Global.clearTimeout);
  LinkedList=Runtime.Safe(Collections.LinkedList);
  ListProxy=Runtime.Safe(LinkedList.ListProxy);
  MailboxProcessor=Runtime.Safe(Control.MailboxProcessor);
  Observable=Runtime.Safe(Control.Observable);
  Observer=Runtime.Safe(Control.Observer);
  Observable1=Runtime.Safe(Observable.Observable);
  List=Runtime.Safe(Global.WebSharper.List);
  T=Runtime.Safe(List.T);
  return Observer1=Runtime.Safe(Observer.Observer);
 });
 Runtime.OnLoad(function()
 {
  return;
 });
}());

(function()
{
 var Global=this,Runtime=this.IntelliFactory.Runtime,Collections,BalancedTree,Operators,Arrays,Seq,List,T,JavaScript,JSModule,Enumerator,DictionaryUtil,Dictionary,Unchecked,FSharpMap,Pair,Option,MapUtil,FSharpSet,SetModule,SetUtil,Array,HashSet,HashSetUtil,HashSet1,LinkedList,EnumeratorProxy,ListProxy,ResizeArray,ResizeArrayProxy;
 Runtime.Define(Global,{
  WebSharper:{
   Collections:{
    BalancedTree:{
     Add:function(x,t)
     {
      return BalancedTree.Put(function()
      {
       return function(x1)
       {
        return x1;
       };
      },x,t);
     },
     Branch:function(node,left,right)
     {
      return{
       Node:node,
       Left:left,
       Right:right,
       Height:1+Operators.Max(left==null?0:left.Height,right==null?0:right.Height),
       Count:1+(left==null?0:left.Count)+(right==null?0:right.Count)
      };
     },
     Build:function(data,min,max)
     {
      var sz,_,center,left,right;
      sz=max-min+1;
      if(sz<=0)
       {
        _=null;
       }
      else
       {
        center=(min+max)/2>>0;
        left=BalancedTree.Build(data,min,center-1);
        right=BalancedTree.Build(data,center+1,max);
        _=BalancedTree.Branch(Arrays.get(data,center),left,right);
       }
      return _;
     },
     Contains:function(v,t)
     {
      return!((BalancedTree.Lookup(v,t))[0]==null);
     },
     Enumerate:function(flip,t)
     {
      var gen;
      gen=function(tupledArg)
      {
       var t1,spine,_,_1,t2,spine1,other;
       t1=tupledArg[0];
       spine=tupledArg[1];
       if(t1==null)
        {
         if(spine.$==1)
          {
           t2=spine.$0[0];
           spine1=spine.$1;
           other=spine.$0[1];
           _1={
            $:1,
            $0:[t2,[other,spine1]]
           };
          }
         else
          {
           _1={
            $:0
           };
          }
         _=_1;
        }
       else
        {
         _=flip?gen([t1.Right,Runtime.New(T,{
          $:1,
          $0:[t1.Node,t1.Left],
          $1:spine
         })]):gen([t1.Left,Runtime.New(T,{
          $:1,
          $0:[t1.Node,t1.Right],
          $1:spine
         })]);
        }
       return _;
      };
      return Seq.unfold(gen,[t,Runtime.New(T,{
       $:0
      })]);
     },
     Lookup:function(k,t)
     {
      var spine,t1,loop,_,matchValue,_1;
      spine=[];
      t1=t;
      loop=true;
      while(loop)
       {
        if(t1==null)
         {
          _=loop=false;
         }
        else
         {
          matchValue=Operators.Compare(k,t1.Node);
          if(matchValue===0)
           {
            _1=loop=false;
           }
          else
           {
            if(matchValue===1)
             {
              spine.unshift([true,t1.Node,t1.Left]);
              _1=t1=t1.Right;
             }
            else
             {
              spine.unshift([false,t1.Node,t1.Right]);
              _1=t1=t1.Left;
             }
           }
          _=_1;
         }
       }
      return[t1,spine];
     },
     OfSeq:function(data)
     {
      var data1;
      data1=Arrays.sort(Seq.toArray(Seq.distinct(data)));
      return BalancedTree.Build(data1,0,data1.length-1);
     },
     Put:function(combine,k,t)
     {
      var patternInput,t1,spine;
      patternInput=BalancedTree.Lookup(k,t);
      t1=patternInput[0];
      spine=patternInput[1];
      return t1==null?BalancedTree.Rebuild(spine,BalancedTree.Branch(k,null,null)):BalancedTree.Rebuild(spine,BalancedTree.Branch((combine(t1.Node))(k),t1.Left,t1.Right));
     },
     Rebuild:function(spine,t)
     {
      var h,t1,i,matchValue,_,x1,l,_1,_2,m,x2,r,_3,_4,m1;
      h=function(x)
      {
       return x==null?0:x.Height;
      };
      t1=t;
      for(i=0;i<=Arrays.length(spine)-1;i++){
       matchValue=Arrays.get(spine,i);
       if(matchValue[0])
        {
         x1=matchValue[1];
         l=matchValue[2];
         if(h(t1)>h(l)+1)
          {
           if(h(t1.Left)===h(t1.Right)+1)
            {
             m=t1.Left;
             _2=BalancedTree.Branch(m.Node,BalancedTree.Branch(x1,l,m.Left),BalancedTree.Branch(t1.Node,m.Right,t1.Right));
            }
           else
            {
             _2=BalancedTree.Branch(t1.Node,BalancedTree.Branch(x1,l,t1.Left),t1.Right);
            }
           _1=_2;
          }
         else
          {
           _1=BalancedTree.Branch(x1,l,t1);
          }
         _=_1;
        }
       else
        {
         x2=matchValue[1];
         r=matchValue[2];
         if(h(t1)>h(r)+1)
          {
           if(h(t1.Right)===h(t1.Left)+1)
            {
             m1=t1.Right;
             _4=BalancedTree.Branch(m1.Node,BalancedTree.Branch(t1.Node,t1.Left,m1.Left),BalancedTree.Branch(x2,m1.Right,r));
            }
           else
            {
             _4=BalancedTree.Branch(t1.Node,t1.Left,BalancedTree.Branch(x2,t1.Right,r));
            }
           _3=_4;
          }
         else
          {
           _3=BalancedTree.Branch(x2,t1,r);
          }
         _=_3;
        }
       t1=_;
      }
      return t1;
     },
     Remove:function(k,src)
     {
      var patternInput,t,spine,_,_1,_2,source,t1,t2,data,t3;
      patternInput=BalancedTree.Lookup(k,src);
      t=patternInput[0];
      spine=patternInput[1];
      if(t==null)
       {
        _=src;
       }
      else
       {
        if(t.Right==null)
         {
          _1=BalancedTree.Rebuild(spine,t.Left);
         }
        else
         {
          if(t.Left==null)
           {
            _2=BalancedTree.Rebuild(spine,t.Right);
           }
          else
           {
            t1=t.Left;
            t2=t.Right;
            source=Seq.append(BalancedTree.Enumerate(false,t1),BalancedTree.Enumerate(false,t2));
            data=Seq.toArray(source);
            t3=BalancedTree.Build(data,0,data.length-1);
            _2=BalancedTree.Rebuild(spine,t3);
           }
          _1=_2;
         }
        _=_1;
       }
      return _;
     },
     TryFind:function(v,t)
     {
      var x;
      x=(BalancedTree.Lookup(v,t))[0];
      return x==null?{
       $:0
      }:{
       $:1,
       $0:x.Node
      };
     }
    },
    Dictionary:Runtime.Class({
     Add:function(k,v)
     {
      var h,_;
      h=this.hash.call(null,k);
      if(this.data.hasOwnProperty(h))
       {
        _=Operators.FailWith("An item with the same key has already been added.");
       }
      else
       {
        this.data[h]={
         K:k,
         V:v
        };
        _=void(this.count=this.count+1);
       }
      return _;
     },
     Clear:function()
     {
      this.data={};
      this.count=0;
      return;
     },
     ContainsKey:function(k)
     {
      return this.data.hasOwnProperty(this.hash.call(null,k));
     },
     GetEnumerator:function()
     {
      var s;
      s=JSModule.GetFieldValues(this.data);
      return Enumerator.Get(s);
     },
     Remove:function(k)
     {
      var h,_;
      h=this.hash.call(null,k);
      if(this.data.hasOwnProperty(h))
       {
        JSModule.Delete(this.data,h);
        this.count=this.count-1;
        _=true;
       }
      else
       {
        _=false;
       }
      return _;
     },
     get_Item:function(k)
     {
      var k1,_,x;
      k1=this.hash.call(null,k);
      if(this.data.hasOwnProperty(k1))
       {
        x=this.data[k1];
        _=x.V;
       }
      else
       {
        _=DictionaryUtil.notPresent();
       }
      return _;
     },
     set_Item:function(k,v)
     {
      var h;
      h=this.hash.call(null,k);
      !this.data.hasOwnProperty(h)?void(this.count=this.count+1):null;
      this.data[h]={
       K:k,
       V:v
      };
      return;
     }
    },{
     New:function(dictionary)
     {
      return Runtime.New(this,Dictionary.New4(dictionary,function(x)
      {
       return function(y)
       {
        return Unchecked.Equals(x,y);
       };
      },function(obj)
      {
       return Unchecked.Hash(obj);
      }));
     },
     New1:function(dictionary,comparer)
     {
      return Runtime.New(this,Dictionary.New4(dictionary,function(x)
      {
       return function(y)
       {
        return comparer.Equals(x,y);
       };
      },function(x)
      {
       return comparer.GetHashCode(x);
      }));
     },
     New11:function(capacity,comparer)
     {
      return Runtime.New(this,Dictionary.New3(comparer));
     },
     New12:function()
     {
      return Runtime.New(this,Dictionary.New4([],function(x)
      {
       return function(y)
       {
        return Unchecked.Equals(x,y);
       };
      },function(obj)
      {
       return Unchecked.Hash(obj);
      }));
     },
     New2:function()
     {
      return Runtime.New(this,Dictionary.New12());
     },
     New3:function(comparer)
     {
      return Runtime.New(this,Dictionary.New4([],function(x)
      {
       return function(y)
       {
        return comparer.Equals(x,y);
       };
      },function(x)
      {
       return comparer.GetHashCode(x);
      }));
     },
     New4:function(init,equals,hash)
     {
      var r,enumerator,x,x1;
      r=Runtime.New(this,{});
      r.hash=hash;
      r.count=0;
      r.data={};
      enumerator=Enumerator.Get(init);
      while(enumerator.MoveNext())
       {
        x=enumerator.get_Current();
        x1=x.K;
        r.data[r.hash.call(null,x1)]=x.V;
       }
      return r;
     }
    }),
    DictionaryUtil:{
     notPresent:function()
     {
      return Operators.FailWith("The given key was not present in the dictionary.");
     }
    },
    FSharpMap:Runtime.Class({
     Add:function(k,v)
     {
      var x,x1;
      x=this.tree;
      x1=Runtime.New(Pair,{
       Key:k,
       Value:v
      });
      return FSharpMap.New(BalancedTree.Add(x1,x));
     },
     CompareTo:function(other)
     {
      return Seq.compareWith(function(x)
      {
       return function(y)
       {
        return Operators.Compare(x,y);
       };
      },this,other);
     },
     ContainsKey:function(k)
     {
      var x,v;
      x=this.tree;
      v=Runtime.New(Pair,{
       Key:k,
       Value:undefined
      });
      return BalancedTree.Contains(v,x);
     },
     Equals:function(other)
     {
      return this.get_Count()===other.get_Count()?Seq.forall2(function(x)
      {
       return function(y)
       {
        return Unchecked.Equals(x,y);
       };
      },this,other):false;
     },
     GetEnumerator:function()
     {
      var t,mapping,source,s;
      t=this.tree;
      mapping=function(kv)
      {
       return{
        K:kv.Key,
        V:kv.Value
       };
      };
      source=BalancedTree.Enumerate(false,t);
      s=Seq.map(mapping,source);
      return Enumerator.Get(s);
     },
     GetHashCode:function()
     {
      var x;
      x=Seq.toArray(this);
      return Unchecked.Hash(x);
     },
     Remove:function(k)
     {
      var x,k1;
      x=this.tree;
      k1=Runtime.New(Pair,{
       Key:k,
       Value:undefined
      });
      return FSharpMap.New(BalancedTree.Remove(k1,x));
     },
     TryFind:function(k)
     {
      var x,v,mapping,option;
      x=this.tree;
      v=Runtime.New(Pair,{
       Key:k,
       Value:undefined
      });
      mapping=function(kv)
      {
       return kv.Value;
      };
      option=BalancedTree.TryFind(v,x);
      return Option.map(mapping,option);
     },
     get_Count:function()
     {
      var tree;
      tree=this.tree;
      return tree==null?0:tree.Count;
     },
     get_IsEmpty:function()
     {
      return this.tree==null;
     },
     get_Item:function(k)
     {
      var matchValue,_,v;
      matchValue=this.TryFind(k);
      if(matchValue.$==0)
       {
        _=Operators.FailWith("The given key was not present in the dictionary.");
       }
      else
       {
        v=matchValue.$0;
        _=v;
       }
      return _;
     },
     get_Tree:function()
     {
      return this.tree;
     }
    },{
     New:function(tree)
     {
      var r;
      r=Runtime.New(this,{});
      r.tree=tree;
      return r;
     },
     New1:function(s)
     {
      return Runtime.New(this,FSharpMap.New(MapUtil.fromSeq(s)));
     }
    }),
    FSharpSet:Runtime.Class({
     Add:function(x)
     {
      return FSharpSet.New(BalancedTree.Add(x,this.tree));
     },
     CompareTo:function(other)
     {
      return Seq.compareWith(function(e1)
      {
       return function(e2)
       {
        return Operators.Compare(e1,e2);
       };
      },this,other);
     },
     Contains:function(v)
     {
      return BalancedTree.Contains(v,this.tree);
     },
     Equals:function(other)
     {
      return this.get_Count()===other.get_Count()?Seq.forall2(function(x)
      {
       return function(y)
       {
        return Unchecked.Equals(x,y);
       };
      },this,other):false;
     },
     GetEnumerator:function()
     {
      var t,_this;
      t=this.tree;
      _this=BalancedTree.Enumerate(false,t);
      return Enumerator.Get(_this);
     },
     GetHashCode:function()
     {
      var _this;
      _this=Seq.toArray(this);
      return-1741749453+Unchecked.Hash(_this);
     },
     IsProperSubsetOf:function(s)
     {
      return this.IsSubsetOf(s)?this.get_Count()<s.get_Count():false;
     },
     IsProperSupersetOf:function(s)
     {
      return this.IsSupersetOf(s)?this.get_Count()>s.get_Count():false;
     },
     IsSubsetOf:function(s)
     {
      return Seq.forall(function(arg00)
      {
       return s.Contains(arg00);
      },this);
     },
     IsSupersetOf:function(s)
     {
      var _this=this;
      return Seq.forall(function(arg00)
      {
       return _this.Contains(arg00);
      },s);
     },
     Remove:function(v)
     {
      return FSharpSet.New(BalancedTree.Remove(v,this.tree));
     },
     add:function(x)
     {
      var a,t;
      a=Seq.append(this,x);
      t=BalancedTree.OfSeq(a);
      return FSharpSet.New(t);
     },
     get_Count:function()
     {
      var tree;
      tree=this.tree;
      return tree==null?0:tree.Count;
     },
     get_IsEmpty:function()
     {
      return this.tree==null;
     },
     get_MaximumElement:function()
     {
      var t;
      t=this.tree;
      return Seq.head(BalancedTree.Enumerate(true,t));
     },
     get_MinimumElement:function()
     {
      var t;
      t=this.tree;
      return Seq.head(BalancedTree.Enumerate(false,t));
     },
     get_Tree:function()
     {
      return this.tree;
     },
     sub:function(x)
     {
      return SetModule.Filter(function(x1)
      {
       return!x.Contains(x1);
      },this);
     }
    },{
     New:function(tree)
     {
      var r;
      r=Runtime.New(this,{});
      r.tree=tree;
      return r;
     },
     New1:function(s)
     {
      return Runtime.New(this,FSharpSet.New(SetUtil.ofSeq(s)));
     }
    }),
    HashSet:{
     HashSet:Runtime.Class({
      Add:function(item)
      {
       return this.add(item);
      },
      Clear:function()
      {
       this.data=Array.prototype.constructor.apply(Array,[]);
       this.count=0;
       return;
      },
      Contains:function(item)
      {
       var arr;
       arr=this.data[this.hash.call(null,item)];
       return arr==null?false:this.arrContains(item,arr);
      },
      CopyTo:function(arr)
      {
       var i,all,i1;
       i=0;
       all=HashSetUtil.concat(this.data);
       for(i1=0;i1<=all.length-1;i1++){
        Arrays.set(arr,i1,all[i1]);
       }
       return;
      },
      ExceptWith:function(xs)
      {
       var enumerator,item,value;
       enumerator=Enumerator.Get(xs);
       while(enumerator.MoveNext())
        {
         item=enumerator.get_Current();
         value=this.Remove(item);
        }
       return;
      },
      GetEnumerator:function()
      {
       var _this;
       _this=HashSetUtil.concat(this.data);
       return Enumerator.Get(_this);
      },
      IntersectWith:function(xs)
      {
       var other,all,i,item,value,_,value1;
       other=HashSet1.New2(xs,this.equals,this.hash);
       all=HashSetUtil.concat(this.data);
       for(i=0;i<=all.length-1;i++){
        item=all[i];
        value=other.Contains(item);
        if(!value)
         {
          value1=this.Remove(item);
          _=void value1;
         }
        else
         {
          _=null;
         }
       }
       return;
      },
      IsProperSubsetOf:function(xs)
      {
       var other;
       other=Arrays.ofSeq(xs);
       return this.count<Arrays.length(other)?this.IsSubsetOf(other):false;
      },
      IsProperSupersetOf:function(xs)
      {
       var other;
       other=Arrays.ofSeq(xs);
       return this.count>Arrays.length(other)?this.IsSupersetOf(other):false;
      },
      IsSubsetOf:function(xs)
      {
       var other,predicate,array;
       other=HashSet1.New2(xs,this.equals,this.hash);
       predicate=function(arg00)
       {
        return other.Contains(arg00);
       };
       array=HashSetUtil.concat(this.data);
       return Seq.forall(predicate,array);
      },
      IsSupersetOf:function(xs)
      {
       var predicate,x=this;
       predicate=function(arg00)
       {
        return x.Contains(arg00);
       };
       return Seq.forall(predicate,xs);
      },
      Overlaps:function(xs)
      {
       var predicate,x=this;
       predicate=function(arg00)
       {
        return x.Contains(arg00);
       };
       return Seq.exists(predicate,xs);
      },
      Remove:function(item)
      {
       var h,arr,_,_1;
       h=this.hash.call(null,item);
       arr=this.data[h];
       if(arr==null)
        {
         _=false;
        }
       else
        {
         if(this.arrRemove(item,arr))
          {
           this.count=this.count-1;
           _1=true;
          }
         else
          {
           _1=false;
          }
         _=_1;
        }
       return _;
      },
      RemoveWhere:function(cond)
      {
       var all,i,item,_,value;
       all=HashSetUtil.concat(this.data);
       for(i=0;i<=all.length-1;i++){
        item=all[i];
        if(cond(item))
         {
          value=this.Remove(item);
          _=void value;
         }
        else
         {
          _=null;
         }
       }
       return;
      },
      SetEquals:function(xs)
      {
       var other;
       other=HashSet1.New2(xs,this.equals,this.hash);
       return this.get_Count()===other.get_Count()?this.IsSupersetOf(other):false;
      },
      SymmetricExceptWith:function(xs)
      {
       var enumerator,item,_,value,value1;
       enumerator=Enumerator.Get(xs);
       while(enumerator.MoveNext())
        {
         item=enumerator.get_Current();
         if(this.Contains(item))
          {
           value=this.Remove(item);
           _=void value;
          }
         else
          {
           value1=this.Add(item);
           _=void value1;
          }
        }
       return;
      },
      UnionWith:function(xs)
      {
       var enumerator,item,value;
       enumerator=Enumerator.Get(xs);
       while(enumerator.MoveNext())
        {
         item=enumerator.get_Current();
         value=this.Add(item);
        }
       return;
      },
      add:function(item)
      {
       var h,arr,_,_1,value;
       h=this.hash.call(null,item);
       arr=this.data[h];
       if(arr==null)
        {
         this.data[h]=[item];
         this.count=this.count+1;
         _=true;
        }
       else
        {
         if(this.arrContains(item,arr))
          {
           _1=false;
          }
         else
          {
           value=arr.push(item);
           this.count=this.count+1;
           _1=true;
          }
         _=_1;
        }
       return _;
      },
      arrContains:function(item,arr)
      {
       var c,i,l;
       c=true;
       i=0;
       l=arr.length;
       while(c?i<l:false)
        {
         (this.equals.call(null,arr[i]))(item)?c=false:i=i+1;
        }
       return!c;
      },
      arrRemove:function(item,arr)
      {
       var c,i,l,_,start,ps,value;
       c=true;
       i=0;
       l=arr.length;
       while(c?i<l:false)
        {
         if((this.equals.call(null,arr[i]))(item))
          {
           start=i;
           ps=[];
           value=arr.splice.apply(arr,[start,1].concat(ps));
           _=c=false;
          }
         else
          {
           _=i=i+1;
          }
        }
       return!c;
      },
      get_Count:function()
      {
       return this.count;
      }
     },{
      New:function(init,comparer)
      {
       return Runtime.New(this,HashSet1.New2(init,function(x)
       {
        return function(y)
        {
         return comparer.Equals(x,y);
        };
       },function(x)
       {
        return comparer.GetHashCode(x);
       }));
      },
      New1:function(comparer)
      {
       return Runtime.New(this,HashSet1.New2(Seq.empty(),function(x)
       {
        return function(y)
        {
         return comparer.Equals(x,y);
        };
       },function(x)
       {
        return comparer.GetHashCode(x);
       }));
      },
      New11:function()
      {
       return Runtime.New(this,HashSet1.New2(Seq.empty(),function(x)
       {
        return function(y)
        {
         return Unchecked.Equals(x,y);
        };
       },function(obj)
       {
        return Unchecked.Hash(obj);
       }));
      },
      New2:function(init,equals,hash)
      {
       var r,enumerator,x,value;
       r=Runtime.New(this,{});
       r.equals=equals;
       r.hash=hash;
       r.data=Array.prototype.constructor.apply(Array,[]);
       r.count=0;
       enumerator=Enumerator.Get(init);
       while(enumerator.MoveNext())
        {
         x=enumerator.get_Current();
         value=r.add(x);
        }
       return r;
      },
      New3:function(init)
      {
       return Runtime.New(this,HashSet1.New2(init,function(x)
       {
        return function(y)
        {
         return Unchecked.Equals(x,y);
        };
       },function(obj)
       {
        return Unchecked.Hash(obj);
       }));
      }
     }),
     HashSetUtil:{
      concat:function($o)
      {
       var $0=this,$this=this;
       var r=[];
       for(var k in $o){
        r.push.apply(r,$o[k]);
       }
       ;
       return r;
      }
     }
    },
    LinkedList:{
     EnumeratorProxy:Runtime.Class({
      Dispose:function()
      {
       return null;
      },
      MoveNext:function()
      {
       this.c=this.c.n;
       return!Unchecked.Equals(this.c,null);
      },
      get_Current:function()
      {
       return this.c.v;
      }
     },{
      New:function(l)
      {
       var r;
       r=Runtime.New(this,{});
       r.c=l;
       return r;
      }
     }),
     ListProxy:Runtime.Class({
      AddAfter:function(after,value)
      {
       var before,node,_;
       before=after.n;
       node={
        p:after,
        n:before,
        v:value
       };
       Unchecked.Equals(after.n,null)?void(this.p=node):null;
       after.n=node;
       if(!Unchecked.Equals(before,null))
        {
         before.p=node;
         _=node;
        }
       else
        {
         _=null;
        }
       this.c=this.c+1;
       return node;
      },
      AddBefore:function(before,value)
      {
       var after,node,_;
       after=before.p;
       node={
        p:after,
        n:before,
        v:value
       };
       Unchecked.Equals(before.p,null)?void(this.n=node):null;
       before.p=node;
       if(!Unchecked.Equals(after,null))
        {
         after.n=node;
         _=node;
        }
       else
        {
         _=null;
        }
       this.c=this.c+1;
       return node;
      },
      AddFirst:function(value)
      {
       var _,node;
       if(this.c===0)
        {
         node={
          p:null,
          n:null,
          v:value
         };
         this.n=node;
         this.p=this.n;
         this.c=1;
         _=node;
        }
       else
        {
         _=this.AddBefore(this.n,value);
        }
       return _;
      },
      AddLast:function(value)
      {
       var _,node;
       if(this.c===0)
        {
         node={
          p:null,
          n:null,
          v:value
         };
         this.n=node;
         this.p=this.n;
         this.c=1;
         _=node;
        }
       else
        {
         _=this.AddAfter(this.p,value);
        }
       return _;
      },
      Clear:function()
      {
       this.c=0;
       this.n=null;
       this.p=null;
       return;
      },
      Contains:function(value)
      {
       var found,node;
       found=false;
       node=this.n;
       while(!Unchecked.Equals(node,null)?!found:false)
        {
         node.v==value?found=true:node=node.n;
        }
       return found;
      },
      Find:function(value)
      {
       var node,notFound;
       node=this.n;
       notFound=true;
       while(notFound?!Unchecked.Equals(node,null):false)
        {
         node.v==value?notFound=false:node=node.n;
        }
       return notFound?null:node;
      },
      FindLast:function(value)
      {
       var node,notFound;
       node=this.p;
       notFound=true;
       while(notFound?!Unchecked.Equals(node,null):false)
        {
         node.v==value?notFound=false:node=node.p;
        }
       return notFound?null:node;
      },
      GetEnumerator:function()
      {
       return EnumeratorProxy.New(this);
      },
      Remove:function(node)
      {
       var before,after,_,_1;
       before=node.p;
       after=node.n;
       if(Unchecked.Equals(before,null))
        {
         _=void(this.n=after);
        }
       else
        {
         before.n=after;
         _=after;
        }
       if(Unchecked.Equals(after,null))
        {
         _1=void(this.p=before);
        }
       else
        {
         after.p=before;
         _1=before;
        }
       this.c=this.c-1;
       return;
      },
      Remove1:function(value)
      {
       var node,_;
       node=this.Find(value);
       if(Unchecked.Equals(node,null))
        {
         _=false;
        }
       else
        {
         this.Remove(node);
         _=true;
        }
       return _;
      },
      RemoveFirst:function()
      {
       return this.Remove(this.n);
      },
      RemoveLast:function()
      {
       return this.Remove(this.p);
      },
      get_Count:function()
      {
       return this.c;
      },
      get_First:function()
      {
       return this.n;
      },
      get_Last:function()
      {
       return this.p;
      }
     },{
      New:function()
      {
       return Runtime.New(this,ListProxy.New1(Seq.empty()));
      },
      New1:function(coll)
      {
       var r,ie,_,node;
       r=Runtime.New(this,{});
       r.c=0;
       r.n=null;
       r.p=null;
       ie=Enumerator.Get(coll);
       if(ie.MoveNext())
        {
         r.n={
          p:null,
          n:null,
          v:ie.get_Current()
         };
         r.p=r.n;
         _=void(r.c=1);
        }
       else
        {
         _=null;
        }
       while(ie.MoveNext())
        {
         node={
          p:r.p,
          n:null,
          v:ie.get_Current()
         };
         r.p.n=node;
         r.p=node;
         r.c=r.c+1;
        }
       return r;
      }
     })
    },
    MapModule:{
     Exists:function(f,m)
     {
      var predicate;
      predicate=function(kv)
      {
       return(f(kv.K))(kv.V);
      };
      return Seq.exists(predicate,m);
     },
     Filter:function(f,m)
     {
      var t,predicate,source,source1,x,x1;
      t=m.get_Tree();
      predicate=function(kv)
      {
       return(f(kv.Key))(kv.Value);
      };
      source=BalancedTree.Enumerate(false,t);
      source1=Seq.filter(predicate,source);
      x=Seq.toArray(source1);
      x1=BalancedTree.Build(x,0,x.length-1);
      return FSharpMap.New(x1);
     },
     FindKey:function(f,m)
     {
      var chooser;
      chooser=function(kv)
      {
       return(f(kv.K))(kv.V)?{
        $:1,
        $0:kv.K
       }:{
        $:0
       };
      };
      return Seq.pick(chooser,m);
     },
     Fold:function(f,s,m)
     {
      var t,folder,source;
      t=m.get_Tree();
      folder=function(s1)
      {
       return function(kv)
       {
        return((f(s1))(kv.Key))(kv.Value);
       };
      };
      source=BalancedTree.Enumerate(false,t);
      return Seq.fold(folder,s,source);
     },
     FoldBack:function(f,m,s)
     {
      var t,folder,source;
      t=m.get_Tree();
      folder=function(s1)
      {
       return function(kv)
       {
        return((f(kv.Key))(kv.Value))(s1);
       };
      };
      source=BalancedTree.Enumerate(true,t);
      return Seq.fold(folder,s,source);
     },
     ForAll:function(f,m)
     {
      var predicate;
      predicate=function(kv)
      {
       return(f(kv.K))(kv.V);
      };
      return Seq.forall(predicate,m);
     },
     Iterate:function(f,m)
     {
      var action;
      action=function(kv)
      {
       return(f(kv.K))(kv.V);
      };
      return Seq.iter(action,m);
     },
     Map:function(f,m)
     {
      var t,mapping,source,data,x;
      t=m.get_Tree();
      mapping=function(kv)
      {
       return Runtime.New(Pair,{
        Key:kv.Key,
        Value:(f(kv.Key))(kv.Value)
       });
      };
      source=BalancedTree.Enumerate(false,t);
      data=Seq.map(mapping,source);
      x=BalancedTree.OfSeq(data);
      return FSharpMap.New(x);
     },
     OfArray:function(a)
     {
      var mapping,data,t;
      mapping=function(tupledArg)
      {
       var k,v;
       k=tupledArg[0];
       v=tupledArg[1];
       return Runtime.New(Pair,{
        Key:k,
        Value:v
       });
      };
      data=Seq.map(mapping,a);
      t=BalancedTree.OfSeq(data);
      return FSharpMap.New(t);
     },
     Partition:function(f,m)
     {
      var predicate,array,t,patternInput,y,x,t1,t2;
      predicate=function(kv)
      {
       return(f(kv.Key))(kv.Value);
      };
      t=m.get_Tree();
      array=Seq.toArray(BalancedTree.Enumerate(false,t));
      patternInput=Arrays.partition(predicate,array);
      y=patternInput[1];
      x=patternInput[0];
      t1=BalancedTree.Build(x,0,x.length-1);
      t2=BalancedTree.Build(y,0,y.length-1);
      return[FSharpMap.New(t1),FSharpMap.New(t2)];
     },
     Pick:function(f,m)
     {
      var chooser;
      chooser=function(kv)
      {
       return(f(kv.K))(kv.V);
      };
      return Seq.pick(chooser,m);
     },
     ToSeq:function(m)
     {
      var t,mapping,source;
      t=m.get_Tree();
      mapping=function(kv)
      {
       return[kv.Key,kv.Value];
      };
      source=BalancedTree.Enumerate(false,t);
      return Seq.map(mapping,source);
     },
     TryFind:function(k,m)
     {
      return m.TryFind(k);
     },
     TryFindKey:function(f,m)
     {
      var chooser;
      chooser=function(kv)
      {
       return(f(kv.K))(kv.V)?{
        $:1,
        $0:kv.K
       }:{
        $:0
       };
      };
      return Seq.tryPick(chooser,m);
     },
     TryPick:function(f,m)
     {
      var chooser;
      chooser=function(kv)
      {
       return(f(kv.K))(kv.V);
      };
      return Seq.tryPick(chooser,m);
     }
    },
    MapUtil:{
     fromSeq:function(s)
     {
      var a;
      a=Seq.toArray(Seq.delay(function()
      {
       return Seq.collect(function(matchValue)
       {
        var v,k;
        v=matchValue[1];
        k=matchValue[0];
        return[Runtime.New(Pair,{
         Key:k,
         Value:v
        })];
       },Seq.distinctBy(function(tuple)
       {
        return tuple[0];
       },s));
      }));
      Arrays.sortInPlace(a);
      return BalancedTree.Build(a,0,a.length-1);
     }
    },
    Pair:Runtime.Class({
     CompareTo:function(other)
     {
      return Operators.Compare(this.Key,other.Key);
     },
     Equals:function(other)
     {
      return Unchecked.Equals(this.Key,other.Key);
     },
     GetHashCode:function()
     {
      var x;
      x=this.Key;
      return Unchecked.Hash(x);
     }
    }),
    ResizeArray:{
     ResizeArrayProxy:Runtime.Class({
      Add:function(x)
      {
       return this.arr.push(x);
      },
      AddRange:function(x)
      {
       var _this=this;
       return Seq.iter(function(arg00)
       {
        return _this.Add(arg00);
       },x);
      },
      Clear:function()
      {
       var value,_this;
       _this=this.arr;
       value=ResizeArray.splice(this.arr,0,Arrays.length(_this),[]);
       return;
      },
      CopyTo:function(arr)
      {
       return this.CopyTo1(arr,0);
      },
      CopyTo1:function(arr,offset)
      {
       return this.CopyTo2(0,arr,offset,this.get_Count());
      },
      CopyTo2:function(index,target,offset,count)
      {
       return Arrays.blit(this.arr,index,target,offset,count);
      },
      GetEnumerator:function()
      {
       var _this;
       _this=this.arr;
       return Enumerator.Get(_this);
      },
      GetRange:function(index,count)
      {
       var arr;
       arr=this.arr;
       return ResizeArrayProxy.New11(Arrays.sub(arr,index,count));
      },
      Insert:function(index,items)
      {
       var value;
       value=ResizeArray.splice(this.arr,index,0,[items]);
       return;
      },
      InsertRange:function(index,items)
      {
       var value;
       value=ResizeArray.splice(this.arr,index,0,Seq.toArray(items));
       return;
      },
      RemoveAt:function(x)
      {
       var value;
       value=ResizeArray.splice(this.arr,x,1,[]);
       return;
      },
      RemoveRange:function(index,count)
      {
       var value;
       value=ResizeArray.splice(this.arr,index,count,[]);
       return;
      },
      Reverse:function()
      {
       return this.arr.reverse();
      },
      Reverse1:function(index,count)
      {
       return Arrays.reverse(this.arr,index,count);
      },
      ToArray:function()
      {
       return this.arr.slice();
      },
      get_Count:function()
      {
       var _this;
       _this=this.arr;
       return Arrays.length(_this);
      },
      get_Item:function(x)
      {
       return Arrays.get(this.arr,x);
      },
      set_Item:function(x,v)
      {
       return Arrays.set(this.arr,x,v);
      }
     },{
      New:function(el)
      {
       return Runtime.New(this,ResizeArrayProxy.New11(Seq.toArray(el)));
      },
      New1:function()
      {
       return Runtime.New(this,ResizeArrayProxy.New11([]));
      },
      New11:function(arr)
      {
       var r;
       r=Runtime.New(this,{});
       r.arr=arr;
       return r;
      },
      New2:function()
      {
       return Runtime.New(this,ResizeArrayProxy.New11([]));
      }
     }),
     splice:function($arr,$index,$howMany,$items)
     {
      var $0=this,$this=this;
      return Global.Array.prototype.splice.apply($arr,[$index,$howMany].concat($items));
     }
    },
    SetModule:{
     Filter:function(f,s)
     {
      var data,t;
      data=Seq.toArray(Seq.filter(f,s));
      t=BalancedTree.Build(data,0,data.length-1);
      return FSharpSet.New(t);
     },
     FoldBack:function(f,a,s)
     {
      var t;
      t=a.get_Tree();
      return Seq.fold(function(s1)
      {
       return function(x)
       {
        return(f(x))(s1);
       };
      },s,BalancedTree.Enumerate(true,t));
     },
     Partition:function(f,a)
     {
      var patternInput,y,x,t,t1;
      patternInput=Arrays.partition(f,Seq.toArray(a));
      y=patternInput[1];
      x=patternInput[0];
      t=BalancedTree.OfSeq(x);
      t1=BalancedTree.OfSeq(y);
      return[FSharpSet.New(t),FSharpSet.New(t1)];
     }
    },
    SetUtil:{
     ofSeq:function(s)
     {
      var a;
      a=Seq.toArray(s);
      Arrays.sortInPlace(a);
      return BalancedTree.Build(a,0,a.length-1);
     }
    }
   }
  }
 });
 Runtime.OnInit(function()
 {
  Collections=Runtime.Safe(Global.WebSharper.Collections);
  BalancedTree=Runtime.Safe(Collections.BalancedTree);
  Operators=Runtime.Safe(Global.WebSharper.Operators);
  Arrays=Runtime.Safe(Global.WebSharper.Arrays);
  Seq=Runtime.Safe(Global.WebSharper.Seq);
  List=Runtime.Safe(Global.WebSharper.List);
  T=Runtime.Safe(List.T);
  JavaScript=Runtime.Safe(Global.WebSharper.JavaScript);
  JSModule=Runtime.Safe(JavaScript.JSModule);
  Enumerator=Runtime.Safe(Global.WebSharper.Enumerator);
  DictionaryUtil=Runtime.Safe(Collections.DictionaryUtil);
  Dictionary=Runtime.Safe(Collections.Dictionary);
  Unchecked=Runtime.Safe(Global.WebSharper.Unchecked);
  FSharpMap=Runtime.Safe(Collections.FSharpMap);
  Pair=Runtime.Safe(Collections.Pair);
  Option=Runtime.Safe(Global.WebSharper.Option);
  MapUtil=Runtime.Safe(Collections.MapUtil);
  FSharpSet=Runtime.Safe(Collections.FSharpSet);
  SetModule=Runtime.Safe(Collections.SetModule);
  SetUtil=Runtime.Safe(Collections.SetUtil);
  Array=Runtime.Safe(Global.Array);
  HashSet=Runtime.Safe(Collections.HashSet);
  HashSetUtil=Runtime.Safe(HashSet.HashSetUtil);
  HashSet1=Runtime.Safe(HashSet.HashSet);
  LinkedList=Runtime.Safe(Collections.LinkedList);
  EnumeratorProxy=Runtime.Safe(LinkedList.EnumeratorProxy);
  ListProxy=Runtime.Safe(LinkedList.ListProxy);
  ResizeArray=Runtime.Safe(Collections.ResizeArray);
  return ResizeArrayProxy=Runtime.Safe(ResizeArray.ResizeArrayProxy);
 });
 Runtime.OnLoad(function()
 {
  return;
 });
}());

(function()
{
 var Global=this,Runtime=this.IntelliFactory.Runtime,List,Seq,Html,Client,Tags,DataGrid,Client1,Arrays,Operators,Unchecked,window,Strings,Arrays2D,Attr;
 Runtime.Define(Global,{
  DataGrid:{
   Client:{
    Main:Runtime.Field(function()
    {
     var x,x1,_this3,_this4;
     x1=Seq.toList(Seq.delay(function()
     {
      var x2,_this1;
      x2=Seq.toList(Seq.delay(function()
      {
       return List.map(function(e)
       {
        var x3,_this;
        x3=List.ofArray([Tags.Tags().text(e)]);
        _this=Tags.Tags();
        return _this.NewTag("th",x3);
       },Client1.columns());
      }));
      _this1=Tags.Tags();
      return Seq.append([_this1.NewTag("tr",x2)],Seq.delay(function()
      {
       return Seq.map(function(r)
       {
        var x3,_this2;
        x3=Seq.toList(Seq.delay(function()
        {
         return Seq.collect(function(c)
         {
          var inputBox,x4,_this;
          inputBox=Arrays.get2D(Client1.grid(),c,r);
          inputBox.get_Body().addEventListener("paste",function(e)
          {
           return Client1.doPaste(e);
          },false);
          x4=List.ofArray([inputBox]);
          _this=Tags.Tags();
          return[_this.NewTag("td",x4)];
         },Seq.toList(Operators.range(0,Client1.columns().get_Length()-1)));
        }));
        _this2=Tags.Tags();
        return _this2.NewTag("tr",x3);
       },Seq.toList(Operators.range(0,Client1.rows()-1)));
      }));
     }));
     _this3=Tags.Tags();
     x=List.ofArray([_this3.NewTag("table",x1)]);
     _this4=Tags.Tags();
     return _this4.NewTag("div",x).AppendTo("grid");
    }),
    columns:Runtime.Field(function()
    {
     return List.map(function(i)
     {
      return"C"+Global.String(i);
     },Seq.toList(Operators.range(0,7)));
    }),
    doPaste:function(e)
    {
     var targetNode,data,x,yorg,xorg,sep,array,x1,action;
     targetNode=e.target;
     data=!Unchecked.Equals(e.clipboardData,undefined)?e.clipboardData.getData("text/plain"):window.clipboardData.getData("text");
     e.preventDefault();
     x=Client1.getCoordinates(targetNode);
     if(x.$==1)
      {
       yorg=x.$0[1];
       xorg=x.$0[0];
       sep=[10];
       array=Strings.SplitChars(data,sep,1);
       x1=List.ofArray(array);
       action=function(ypaste)
       {
        return function(row)
        {
         var sep1,action1,list;
         sep1=[9];
         action1=function(xpaste)
         {
          return function(text)
          {
           var patternInput,ytarget,xtarget;
           patternInput=[xorg+xpaste,yorg+ypaste];
           ytarget=patternInput[1];
           xtarget=patternInput[0];
           return(xtarget<Client1.columns().get_Length()?ytarget<Client1.rows():false)?Arrays.get2D(Client1.grid(),xtarget,ytarget).set_Value(text):null;
          };
         };
         list=List.ofArray(Strings.SplitChars(row,sep1,1));
         return Seq.iteri(action1,list);
        };
       };
       return Seq.iteri(action,x1);
      }
     else
      {
       return;
      }
    },
    getCoordinates:function(node)
    {
     var chooser,list1;
     chooser=function(c)
     {
      var chooser1,list;
      chooser1=function(r)
      {
       return Unchecked.Equals(Arrays.get2D(Client1.grid(),c,r).get_Body(),node)?{
        $:1,
        $0:[c,r]
       }:{
        $:0
       };
      };
      list=Seq.toList(Operators.range(0,Client1.rows()-1));
      return Seq.tryPick(chooser1,list);
     };
     list1=Seq.toList(Operators.range(0,Client1.columns().get_Length()-1));
     return Seq.tryPick(chooser,list1);
    },
    grid:Runtime.Field(function()
    {
     return Arrays2D.init(Client1.columns().get_Length(),Client1.rows(),function()
     {
      return function()
      {
       var x1,_this,_this1;
       _this=Attr.Attr();
       x1=List.ofArray([_this.NewAttr("type","Text")]);
       _this1=Tags.Tags();
       return _this1.NewTag("input",x1);
      };
     });
    }),
    rows:Runtime.Field(function()
    {
     return 8;
    })
   }
  }
 });
 Runtime.OnInit(function()
 {
  List=Runtime.Safe(Global.WebSharper.List);
  Seq=Runtime.Safe(Global.WebSharper.Seq);
  Html=Runtime.Safe(Global.WebSharper.Html);
  Client=Runtime.Safe(Html.Client);
  Tags=Runtime.Safe(Client.Tags);
  DataGrid=Runtime.Safe(Global.DataGrid);
  Client1=Runtime.Safe(DataGrid.Client);
  Arrays=Runtime.Safe(Global.WebSharper.Arrays);
  Operators=Runtime.Safe(Global.WebSharper.Operators);
  Unchecked=Runtime.Safe(Global.WebSharper.Unchecked);
  window=Runtime.Safe(Global.window);
  Strings=Runtime.Safe(Global.WebSharper.Strings);
  Arrays2D=Runtime.Safe(Global.WebSharper.Arrays2D);
  return Attr=Runtime.Safe(Client.Attr);
 });
 Runtime.OnLoad(function()
 {
  Client1.rows();
  Client1.grid();
  Client1.columns();
  Client1.Main();
  return;
 });
}());


if (typeof IntelliFactory !=='undefined')
  IntelliFactory.Runtime.Start();

(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["60f91a5e"],{"0929":function(e,t,s){"use strict";var a=s("8382"),r=s.n(a);r.a},3050:function(e,t,s){},"35da":function(e,t,s){},"5d8c":function(e,t,s){"use strict";var a=s("def6"),r=s.n(a);r.a},"607a":function(e,t,s){"use strict";var a=s("8ee9"),r=s.n(a);r.a},"663a":function(e,t,s){e.exports=s.p+"img/USComicsLogo.8eea547f.png"},"6d96":function(e,t,s){"use strict";var a=s("3050"),r=s.n(a);r.a},"713b":function(e,t,s){"use strict";s.r(t);var a=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("q-layout",{attrs:{view:"hHh lpR fFf"}},[a("q-header",{staticClass:"bg-primary text-white",attrs:{reveal:"",elevated:""}},[a("q-toolbar",[a("q-toolbar-title",[a("q-img",{staticStyle:{height:"50px",width:"50px"},attrs:{src:s("663a")}})],1),a("q-btn",{attrs:{dense:"",flat:"",round:"",icon:"person"},on:{click:function(t){e.right=!e.right}}})],1)],1),a("q-drawer",{attrs:{side:"right","no-swipe-backdrop":"",persistent:"",overlay:"",elevated:""},model:{value:e.right,callback:function(t){e.right=t},expression:"right"}},[e.$store.state.main.userPanelState===e.stateResetPassword?a("ResetPassword"):e.$store.state.main.userPanelState===e.stateSignIn?a("SignIn"):e.$store.state.main.userPanelState===e.stateSignUp?a("SignUp"):e.$store.state.main.userPanelState===e.stateUser?a("UserPanel"):e._e()],1),a("q-page-container",[a("router-view")],1)],1)},r=[],n=s("967e"),i=s.n(n),o=(s("96cf"),s("fa84")),u=s.n(o),c=s("fc74"),l=s.n(c),m=s("59a1"),E=s.n(m),p=s("d5eb"),h=function e(t,s,a,r){l()(this,e),this.message=t,this.sound=s,this.lifetime=a,this.hasImage=r},d=s("a7ee"),_=s("c47a"),S=s.n(_),f=function(){function e(){l()(this,e)}return E()(e,null,[{key:"getMessage",value:function(t,s){return e.LANGUAGE.en_US===t?0>=s||e.messages_en_US.length<s?null:e.messages_en_US[s-1]:null}}]),e}();S()(f,"LANGUAGE",{en_US:1}),S()(f,"SOUND_NONE",0),S()(f,"SOUND_ERROR","../assets/Error.wav"),S()(f,"SOUND_SUCCESS","../assets/Success.wav"),S()(f,"ERROR_USERNAME_REQUIRED",1),S()(f,"ERROR_INVALID_USERNAME",2),S()(f,"ERROR_INVALID_USERNAME_LENGTH",3),S()(f,"ERROR_PASSWORD_REQUIRED",4),S()(f,"ERROR_PASSWORD_LENGTH",5),S()(f,"ERROR_PASSWORDS_DO_NOT_MATCH",6),S()(f,"ERROR_EMAIL_REQUIRED",7),S()(f,"ERROR_INVALID_EMAIL",8),S()(f,"SUCCESS_ACCOUNT_ADDED",9),S()(f,"SUCCESS_ACCOUNT_UPDATED",10),S()(f,"SUCCESS_SIGN_IN",11),S()(f,"ERROR_NETWORK",12),S()(f,"ERROR_INVALID_CREDENTIALS",13),S()(f,"ERROR_UNABLE_TO_OBTAIN_BOOK_LIST",14),S()(f,"ERROR_NO_FAVORITES",15),S()(f,"ERROR_NO_CART",16),S()(f,"SUCCESS_PURCHASE",17),S()(f,"MESSAGE_ALREADY_PURCHASED",18),S()(f,"SUCCESS_PASSWORD_RESET_REQUEST",19),S()(f,"NO_CART",20),S()(f,"NO_FAVORITES",21),S()(f,"NO_PURCHASES",22),S()(f,"messages_en_US",["A user name is required.","Invalid user name. User name can contain only letters, numbers, hyphens, or underscores.","Invalid user name. Must be at least 5 characters long.","A password is required.","Invalid password. Must be at least 5 characters long.","Passwords do not match.","Email required.","Invalid email.","Account created successfully. Welcome to U.S. Comics.","Account updated successfully.","Login successful.","A network error occured.","Invalid credentials.","Unable to obtain the list of your books from the server.","You don't have any favorites.","Your cart is empty.","Purchase successful.","You purchased this item on {0}.","Password reset link sent. Check your email.","There's nothing in our cart. Get shopping!","You don't have any favorites. Yet.","It doesn't look like you've bought anything yet. Cheapskate."]);var v=function(){function e(){l()(this,e)}return E()(e,null,[{key:"getFromServer",value:function(){var e=u()(i.a.mark((function e(t){var s,a;return i.a.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,fetch(t,{method:"GET"});case 3:return s=e.sent,e.next=6,s.text();case 6:return a=e.sent,e.abrupt("return",{status:s.status,statusText:s.statusText,body:a,headers:s.headers,cookies:s.cookies});case 10:return e.prev=10,e.t0=e["catch"](0),e.abrupt("return",{status:500,body:JSON.stringify(e.t0)});case 13:case"end":return e.stop()}}),e,null,[[0,10]])})));function t(t){return e.apply(this,arguments)}return t}()},{key:"postToServer",value:function(){var e=u()(i.a.mark((function e(t,s){var a,r;return i.a.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,fetch(t,{method:"POST",body:s});case 3:return a=e.sent,e.next=6,a.text();case 6:return r=e.sent,e.abrupt("return",{status:a.status,statusText:a.statusText,body:r,headers:a.headers,cookies:a.cookies});case 10:return e.prev=10,e.t0=e["catch"](0),e.abrupt("return",{status:500,body:JSON.stringify(e.t0)});case 13:case"end":return e.stop()}}),e,null,[[0,10]])})));function t(t,s){return e.apply(this,arguments)}return t}()},{key:"hasErrors",value:function(e){if(200===e.status)return!1;if(500!==e.status){var t=new h(e.body,f.SOUND_ERROR,0,!1);return p["a"].broadcast(d["a"].USER_MESSAGE,t),console.log(e.body),!0}var s=f.getMessage(f.LANGUAGE.en_US,f.ERROR_NETWORK),a=new h(s,f.SOUND_ERROR,0,!1);return p["a"].broadcast(d["a"].USER_MESSAGE,a),console.log(s),!0}}]),e}(),R=v,b=(s("55dd"),s("ac6a"),s("cadf"),s("5df3"),s("551c"),s("06db"),function(){function e(t,s){l()(this,e),this.id=t,this.issue=s,this.issue.length&&(this.issue=parseInt(this.issue))}return E()(e,null,[{key:"getFromServer",value:function(){var e=u()(i.a.mark((function e(t){var s,a;return i.a.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,fetch(t,{method:"GET"});case 3:return s=e.sent,e.next=6,s.text();case 6:return a=e.sent,e.abrupt("return",{status:s.status,statusText:s.statusText,body:a,headers:s.headers,cookies:s.cookies});case 10:return e.prev=10,e.t0=e["catch"](0),e.abrupt("return",{status:500,body:JSON.stringify(e.t0)});case 13:case"end":return e.stop()}}),e,null,[[0,10]])})));function t(t){return e.apply(this,arguments)}return t}()},{key:"getBooksFromServer",value:function(){var t=u()(i.a.mark((function t(s,a){return i.a.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return t.abrupt("return",new Promise((function(t,r){a||t([]);var n=function(){var t=u()(i.a.mark((function t(a){var r,n;return i.a.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return r=s+a.id+"/"+a.issue,t.next=3,e.getFromServer(r);case 3:return n=t.sent,t.abrupt("return",n);case 5:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}();Promise.all(a.map(n)).then((function(e){for(var s=[],a=0;a<e.length;a++){var r=e[a];200===r.status&&s.push(JSON.parse(r.body))}t(s)}))})));case 1:case"end":return t.stop()}}),t)})));function s(e,s){return t.apply(this,arguments)}return s}()},{key:"sortBooks",value:function(t,s){if(e.SORT_BY_DATE===s){for(var a=t.length,r=1;r<a;r++){for(var n=t[r],i=r-1;i>=0&&parseInt(t[i].transactionDate)>parseInt(n.transactionDate);i--)t[i+1]=t[i];t[i+1]=n}t.reverse()}else if(e.SORT_BY_NAME===s){var o=function(e,t){return e.id===t.id?e.issue-t.issue:(""+e.id).localeCompare(t.id)};t.sort(o)}}}]),E()(e,[{key:"makeKey",value:function(){return this.id+" "+this.issue}}]),e}());S()(b,"SORT_BY_NAME",1),S()(b,"SORT_BY_DATE",2);var A=b,g=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"reset-password-column"},[a("div",{staticClass:"reset-password-column reset-password-top"},[a("img",{staticClass:"reset-password-logo",attrs:{src:s("663a")}}),a("form",{staticClass:"reset-password-column"},[a("q-input",{attrs:{id:"email",label:"Email"},model:{value:e.email,callback:function(t){e.email=t},expression:"email"}}),a("br"),a("q-btn",{staticClass:"q-mt-md",attrs:{color:"white","text-color":"black",label:"Reset Password"},on:{click:e.resetPassword}})],1),a("br"),a("div",{staticClass:"text-body1"},[e._v("\n      An email will be sent to you. It will contain a link which can be used to reset your password. This link will expire after 1 hour.\n    ")]),a("br")])])},w=[],N=function(){function e(t,s,a,r,n,i,o,u){l()(this,e),this.username=t,this.password=s,this.email=a,this.firstName=r,this.lastName=n,this.rememberMe=i,this.groups=o,this.authorization=u}return E()(e,null,[{key:"getUserInfoFromServer",value:function(){var e=u()(i.a.mark((function e(t){return i.a.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.abrupt("return",R.getFromServer(t));case 1:case"end":return e.stop()}}),e)})));function t(t){return e.apply(this,arguments)}return t}()},{key:"getUserCartFromServer",value:function(){var e=u()(i.a.mark((function e(t){return i.a.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.abrupt("return",R.getFromServer(t));case 1:case"end":return e.stop()}}),e)})));function t(t){return e.apply(this,arguments)}return t}()},{key:"getUserFavoritesFromServer",value:function(){var e=u()(i.a.mark((function e(t){return i.a.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.abrupt("return",R.getFromServer(t));case 1:case"end":return e.stop()}}),e)})));function t(t){return e.apply(this,arguments)}return t}()},{key:"getUserPurchasesFromServer",value:function(){var e=u()(i.a.mark((function e(t){return i.a.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.abrupt("return",R.getFromServer(t));case 1:case"end":return e.stop()}}),e)})));function t(t){return e.apply(this,arguments)}return t}()}]),E()(e,[{key:"validate",value:function(){return this.username&&0!==this.username.length?5>this.username.length?f.ERROR_INVALID_USERNAME_LENGTH:/[a-zA-Z0-9-_]/.test(this.username)?this.password&&0!==this.password.length?5>this.password.length?f.ERROR_PASSWORD_LENGTH:this.email&&0!==this.email.length?0<this.email.length&&5>this.email.length?f.ERROR_INVALID_EMAIL:0<this.email.length&&-1===this.email.indexOf("@")?f.ERROR_INVALID_EMAIL:0<this.email.length&&-1===this.email.indexOf(".")?f.ERROR_INVALID_EMAIL:0:f.ERROR_EMAIL_REQUIRED:f.ERROR_PASSWORD_REQUIRED:f.ERROR_INVALID_USERNAME:f.ERROR_USERNAME_REQUIRED}},{key:"postToServer",value:function(){var e=u()(i.a.mark((function e(t){var s,a,r,n=arguments;return i.a.wrap((function(e){while(1)switch(e.prev=e.next){case 0:if(s=!(n.length>1&&void 0!==n[1])||n[1],!s){e.next=5;break}if(a=this.validate(),0===a){e.next=5;break}throw TypeError(a);case 5:return r=new FormData,this.username&&r.set("username",this.username),this.password&&r.set("password",this.password),this.email&&r.set("email",this.email),this.firstName&&r.set("firstName",this.firstName),this.lastName&&r.set("lastName",this.lastName),this.rememberMe&&r.set("rememberMe",this.rememberMe),this.groups&&r.set("group1",this.groups[0]),e.abrupt("return",R.postToServer(t,r));case 14:case"end":return e.stop()}}),e,this)})));function t(t){return e.apply(this,arguments)}return t}()},{key:"signInToServer",value:function(){var e=u()(i.a.mark((function e(t){var s,a;return i.a.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return s=new FormData,s.set("username",this.username),s.set("password",this.password),s.set("rememberMe",this.rememberMe),e.next=6,R.postToServer(t,s);case 6:return a=e.sent,e.abrupt("return",a);case 8:case"end":return e.stop()}}),e,this)})));function t(t){return e.apply(this,arguments)}return t}()}]),e}(),C=N,U=s("61b1"),O={name:"ResetPassword",data:function(){return{email:""}},methods:{resetPassword:function(){var e=u()(i.a.mark((function e(){var t,s,a,r,n;return i.a.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return t=this.$store.state.main.urlBase+"user/password/reset/request/data",s=new C(null,null,this.email,null,null,null,null),e.next=4,s.postToServer(t,!1);case 4:if(a=e.sent,!R.hasErrors(a)){e.next=7;break}return e.abrupt("return");case 7:r=f.getMessage(f.LANGUAGE.en_US,f.SUCCESS_PASSWORD_RESET_REQUEST),n=new h(r,f.SOUND_SUCCESS,0,!1),this.$store.commit("main/SET_USER_PANEL_STATE",U["a"].SIGN_IN),p["a"].broadcast(d["a"].USER_MESSAGE,n);case 11:case"end":return e.stop()}}),e,this)})));function t(){return e.apply(this,arguments)}return t}()}},k=O,T=(s("c6ba"),s("2877")),y=s("eebe"),D=s.n(y),x=s("27f9"),I=s("9c40"),P=Object(T["a"])(k,g,w,!1,null,"b63bb074",null),M=P.exports;D()(P,"components",{QInput:x["a"],QBtn:I["a"]});var L=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"sign-in-wrapper"},[a("div",{staticClass:"sign-in-column sign-in-top"},[a("img",{staticClass:"sign-in-logo",attrs:{src:s("663a")}}),a("form",{staticClass:"sign-in-column"},[a("div",{staticClass:"sign-in-row"},[a("div",{staticClass:"sign-in-column"},[a("q-input",{attrs:{id:"username",label:"User Name"},model:{value:e.username,callback:function(t){e.username=t},expression:"username"}}),a("q-input",{attrs:{id:"password",type:"password",label:"Password"},model:{value:e.password,callback:function(t){e.password=t},expression:"password"}})],1)]),a("div",{staticClass:"sign-in-row-2"},[a("q-checkbox",{attrs:{id:"rememberMe"},model:{value:e.rememberMe,callback:function(t){e.rememberMe=t},expression:"rememberMe"}}),a("label",{staticClass:"text-body1",attrs:{for:"rememberMe"}},[e._v("Remember Me")])],1),a("q-btn",{staticClass:"q-mt-md",attrs:{color:"white","text-color":"black",label:"Sign In"},on:{click:e.signIn}})],1),a("br"),a("label",{staticClass:"text-body1"},[e._v("Don't Have An Account?")]),a("label",{staticClass:"text-body1 sign-in-link",on:{click:e.signUp}},[e._v("Sign Up")]),a("br"),a("label",{staticClass:"text-body1"},[e._v("Forgot Your Password?")]),a("label",{staticClass:"text-body1 sign-in-link",on:{click:e.resetPassword}},[e._v("Reset Password")])])])},G=[],B={name:"SignIn",data:function(){return{username:"",password:"",rememberMe:!1}},created:function(){this.remember(),p["a"].register(this,d["a"].USER_SIGNED_IN,this.getUserInfo),p["a"].register(this,d["a"].USER_SIGNED_IN,this.getUserCart),p["a"].register(this,d["a"].USER_SIGNED_IN,this.getUserFavorites),p["a"].register(this,d["a"].USER_SIGNED_IN,this.getUserPurchases)},methods:{remember:function(){var e=u()(i.a.mark((function e(){var t,s;return i.a.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return t=this.$store.state.main.urlBase+"remember/data",e.next=3,R.postToServer(t,new FormData);case 3:s=e.sent,200===s.status&&(this.username=JSON.parse(s.body).user,this.rememberMe=!0);case 5:case"end":return e.stop()}}),e,this)})));function t(){return e.apply(this,arguments)}return t}(),signIn:function(){var e=u()(i.a.mark((function e(){var t,s,a,r,n;return i.a.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return t=this.$store.state.main.urlBase+"user/authenticate",s=new C(this.username,this.password,null,null,null,this.rememberMe,null),e.next=4,s.signInToServer(t);case 4:if(a=e.sent,console.log(JSON.stringify(a)),!R.hasErrors(a)){e.next=8;break}return e.abrupt("return");case 8:console.log("Opps!"),r=f.getMessage(f.LANGUAGE.en_US,f.SUCCESS_SIGN_IN),n=new h(r,f.SOUND_SUCCESS,0,!1),p["a"].broadcast(d["a"].USER_MESSAGE,n),p["a"].broadcast(d["a"].USER_SIGNED_IN,{username:this.username}),this.$store.commit("main/SET_USER_PANEL_STATE",U["a"].USER);case 14:case"end":return e.stop()}}),e,this)})));function t(){return e.apply(this,arguments)}return t}(),signUp:function(){this.$store.commit("main/SET_USER_PANEL_STATE",U["a"].SIGN_UP)},resetPassword:function(){this.$store.commit("main/SET_USER_PANEL_STATE",U["a"].RESET_PASSWORD)},getUserInfo:function(){var e=u()(i.a.mark((function e(t){var s,a;return i.a.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return s=this.$store.state.main.urlBase+"user/"+this.username+"/info",e.next=3,C.getUserInfoFromServer(s);case 3:if(a=e.sent,!R.hasErrors(a)){e.next=6;break}return e.abrupt("return");case 6:this.$store.commit("main/SET_ACCOUNT",JSON.parse(a.body));case 7:case"end":return e.stop()}}),e,this)})));function t(t){return e.apply(this,arguments)}return t}(),getUserCart:function(){var e=u()(i.a.mark((function e(t){var s,a;return i.a.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return s=this.$store.state.main.urlBase+"cart/"+this.username,e.next=3,C.getUserCartFromServer(s);case 3:if(a=e.sent,!R.hasErrors(a)){e.next=6;break}return e.abrupt("return");case 6:this.$store.commit("main/SET_CART",JSON.parse(a.body));case 7:case"end":return e.stop()}}),e,this)})));function t(t){return e.apply(this,arguments)}return t}(),getUserFavorites:function(){var e=u()(i.a.mark((function e(t){var s,a;return i.a.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return s=this.$store.state.main.urlBase+"favorites/"+this.username,e.next=3,C.getUserFavoritesFromServer(s);case 3:if(a=e.sent,!R.hasErrors(a)){e.next=6;break}return e.abrupt("return");case 6:this.$store.commit("main/SET_FAVORITES",JSON.parse(a.body));case 7:case"end":return e.stop()}}),e,this)})));function t(t){return e.apply(this,arguments)}return t}(),getUserPurchases:function(){var e=u()(i.a.mark((function e(t){var s,a;return i.a.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return s=this.$store.state.main.urlBase+"comics/"+this.username,e.next=3,C.getUserPurchasesFromServer(s);case 3:if(a=e.sent,!R.hasErrors(a)){e.next=6;break}return e.abrupt("return");case 6:this.$store.commit("main/SET_PURCHASED",JSON.parse(a.body));case 7:case"end":return e.stop()}}),e,this)})));function t(t){return e.apply(this,arguments)}return t}()}},q=B,F=(s("5d8c"),s("8f8e")),$=Object(T["a"])(q,L,G,!1,null,"baccbd14",null),V=$.exports;D()($,"components",{QInput:x["a"],QCheckbox:F["a"],QBtn:I["a"]});var H=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"sign-up-column"},[a("div",{staticClass:"sign-up-column sign-up-top"},[a("img",{staticClass:"sign-up-logo",attrs:{src:s("663a")}}),a("form",{staticClass:"sign-up-column"},[a("div",{staticClass:"sign-up-row"},[a("div",{staticClass:"sign-up-column sign-up-half-width"},[a("q-input",{attrs:{id:"username",label:"User Name"},model:{value:e.username,callback:function(t){e.username=t},expression:"username"}}),a("q-input",{attrs:{id:"firstName",label:"First Name"},model:{value:e.firstName,callback:function(t){e.firstName=t},expression:"firstName"}}),a("q-input",{attrs:{id:"lastName",label:"Last Name"},model:{value:e.lastName,callback:function(t){e.lastName=t},expression:"lastName"}})],1),a("div",{staticClass:"sign-up-column sign-up-half-width"},[a("q-input",{attrs:{id:"password",type:"password",label:"Password"},model:{value:e.password,callback:function(t){e.password=t},expression:"password"}}),a("q-input",{attrs:{id:"reenterPassword",type:"password",label:"Renter Password"},model:{value:e.reenterPassword,callback:function(t){e.reenterPassword=t},expression:"reenterPassword"}}),a("q-input",{attrs:{id:"email",label:"Email"},model:{value:e.email,callback:function(t){e.email=t},expression:"email"}})],1)]),a("div",{staticClass:"sign-up-row-2"},[a("q-checkbox",{attrs:{id:"rememberMe"},model:{value:e.rememberMe,callback:function(t){e.rememberMe=t},expression:"rememberMe"}}),a("label",{staticClass:"text-body1",attrs:{for:"rememberMe"}},[e._v("Remember Me")])],1),a("q-btn",{staticClass:"q-mt-md",attrs:{color:"white","text-color":"black",label:"Sign Up"},on:{click:e.signUp}})],1),a("br"),a("label",{staticClass:"text-body1"},[e._v("Already Have An Account?")]),a("label",{staticClass:"text-body1 sign-up-link",on:{click:e.signIn}},[e._v("Sign In")]),a("br"),a("label",{staticClass:"text-body1"},[e._v("Forgot Your Password?")]),a("label",{staticClass:"text-body1 sign-up-link",on:{click:e.resetPassword}},[e._v("Reset Password")])])])},Q=[],K={name:"SignUp",data:function(){return{username:"",firstName:"",lastName:"",password:"",reenterPassword:"",email:"",rememberMe:!1}},methods:{signUp:function(){var e=u()(i.a.mark((function e(){var t,s,a,r,n,o,u,c;return i.a.wrap((function(e){while(1)switch(e.prev=e.next){case 0:if(t=this.validate(),!t){e.next=6;break}return s=f.getMessage(f.LANGUAGE.en_US,t),a=new h(s,f.SOUND_ERROR,0,!1),p["a"].broadcast(d["a"].USER_MESSAGE,a),e.abrupt("return");case 6:return r=this.$store.state.main.urlBase+"user/add/data",n=new C(this.username,this.password,this.email,this.firstName,this.lastName,this.rememberMe,["user"]),e.next=10,n.postToServer(r);case 10:if(o=e.sent,!R.hasErrors(o)){e.next=13;break}return e.abrupt("return");case 13:this.$store.commit("main/SET_ACCOUNT",n),this.$store.commit("main/SET_USER_PANEL_STATE",U["a"].USER),u=f.getMessage(f.LANGUAGE.en_US,f.SUCCESS_ACCOUNT_ADDED),c=new h(u,f.SOUND_SUCCESS,0,!1),p["a"].broadcast(d["a"].USER_MESSAGE,c);case 18:case"end":return e.stop()}}),e,this)})));function t(){return e.apply(this,arguments)}return t}(),signIn:function(){this.$store.commit("main/SET_USER_PANEL_STATE",U["a"].SIGN_IN)},resetPassword:function(){this.$store.commit("main/SET_USER_PANEL_STATE",U["a"].RESET_PASSWORD)},validate:function(){var e=new C(this.username,this.password,this.email),t=e.validate();return t||(this.password!==this.reenterPassword?f.ERROR_PASSWORDS_DO_NOT_MATCH:0)}}},W=K,J=(s("7984"),Object(T["a"])(W,H,Q,!1,null,"aaf4aa36",null)),Y=J.exports;D()(J,"components",{QInput:x["a"],QCheckbox:F["a"],QBtn:I["a"]});var j=function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("div",{staticClass:"q-pa-md"},[s("div",{staticClass:"q-gutter-y-md",staticStyle:{"max-width":"600px"}},[s("q-tabs",{staticClass:"text-teal",model:{value:e.tab,callback:function(t){e.tab=t},expression:"tab"}},[s("q-tab",{staticClass:"tabs",attrs:{name:"stuff",icon:"menu_book",label:"Stuff"}}),s("q-tab",{staticClass:"tabs",attrs:{name:"you",icon:"face",label:"You"}}),s("q-tab",{staticClass:"tabs",attrs:{name:"favs",icon:"favorite",label:"Favs"}}),s("q-tab",{staticClass:"tabs",attrs:{name:"cart",icon:"shopping_cart",label:"Cart"}})],1),s("q-tab-panels",{attrs:{animated:""},model:{value:e.tab,callback:function(t){e.tab=t},expression:"tab"}},[s("q-tab-panel",{staticStyle:{width:"100%",height:"100%"},attrs:{name:"stuff"}},[s("ItemList",{staticStyle:{height:"100%"},attrs:{bookList:e.$store.state.main.purchased,emptyMessage:e.emptyPurchasedMessage,clickedMessage:e.clickedPurchasedMessage}})],1),s("q-tab-panel",{attrs:{name:"you"}},[s("div",{staticClass:"row justify-center"},[s("q-btn",{staticClass:"q-mb-lg",attrs:{color:"white","text-color":"black",label:"Sign Out"},on:{click:e.signOut}})],1),s("q-separator",{staticClass:"q-mb-lg",attrs:{inset:""}}),s("UpdateAccount",{staticClass:"q-mt-lg",staticStyle:{height:"400px"}})],1),s("q-tab-panel",{attrs:{name:"favs"}},[s("ItemList",{staticStyle:{height:"100%"},attrs:{bookList:e.$store.state.main.favorites,emptyMessage:e.emptyFavoritesMessage,clickedMessage:e.clickedFavoritesMessage}})],1),s("q-tab-panel",{attrs:{name:"cart"}},[s("div",{staticClass:"cart-price-panel q-mb-md"},[s("div",{staticClass:"cart-price-row"},[s("div",[e._v("Subtotal:")]),s("div",[e._v("$"+e._s(e.getSubtotal()))])]),s("div",{staticClass:"cart-price-row"},[s("div",[e._v("Discount:")]),s("div",[e._v("$"+e._s(e.getSubtotal()))])]),s("div",{staticClass:"cart-price-row"},[s("div",[e._v("Total:")]),s("div",[e._v("$0.00")])])]),s("div",{staticClass:"row justify-center"},[s("q-btn",{staticClass:"q-mt-md q-mb-lg",attrs:{color:"white","text-color":"black",label:"Purchase"},on:{click:e.purchase}})],1),s("ItemList",{staticStyle:{height:"100%"},attrs:{bookList:e.$store.state.main.cart,emptyMessage:e.emptyCartMessage,clickedMessage:e.clickedCartMessage}})],1)],1)],1)])},X=[],z=function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("div",[e.bookList?s("div",{staticStyle:{height:"100%",width:"100%"}},e._l(e.bookList,(function(t,a){return s("div",{key:a,attrs:{dense:""}},[s("div",{staticClass:"q-mb-md"},[s("div",{staticClass:"flex column justify-center"},[s("img",{staticClass:"thumbnail-image",attrs:{src:e.getURL(t)}}),s("div",{attrs:{clsss:"thumbnail-item-description"}},[s("q-item-label",[e._v(e._s(e.getTitle(t))+" #"+e._s(t.issue))])],1)])])])})),0):s("div",[e._v("\n    "+e._s(e.emptyMessage)+"\n  ")])])},Z=[],ee={name:"ItemList",props:{bookList:{type:Array},emptyMessage:{type:String},clickedMessage:{type:String}},methods:{getTitle:function(e){var t=this.$store.state.main.bookInfo;if(!t||!t.length)return"";for(var s=0;s<t.length;s++){var a=t[s];if(a.id===e.id&&a.issue===e.issue)return a.title}return""},getURL:function(e){var t,s=this.$store.state.main.bookInfo;if(!s||!s.length)return"";for(var a=0;a<s.length;a++){var r=s[a];r.id===e.id&&r.issue===e.issue&&(t=r)}if(t){var n=this.$store.state.main.urlBase+"comics/"+e.id+"/"+e.issue+"/"+t.cover;return n}}}},te=ee,se=(s("0929"),s("0170")),ae=Object(T["a"])(te,z,Z,!1,null,"4ce58b36",null),re=ae.exports;D()(ae,"components",{QItemLabel:se["a"]});var ne=function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("div",{staticClass:"update-account-column"},[s("div",{staticClass:"update-account-column update-account-top"},[s("form",{staticClass:"update-account-column"},[s("div",{staticClass:"update-account-row"},[s("div",{staticClass:"update-account-column update-account-half-width"},[s("q-input",{attrs:{id:"username",label:"User Name"},model:{value:e.username,callback:function(t){e.username=t},expression:"username"}}),s("q-input",{attrs:{id:"firstName",label:"First Name"},model:{value:e.firstName,callback:function(t){e.firstName=t},expression:"firstName"}}),s("q-input",{attrs:{id:"lastName",label:"Last Name"},model:{value:e.lastName,callback:function(t){e.lastName=t},expression:"lastName"}})],1),s("div",{staticClass:"update-account-column update-account-half-width"},[s("q-input",{attrs:{id:"password",type:"password",label:"Password"},model:{value:e.password,callback:function(t){e.password=t},expression:"password"}}),s("q-input",{attrs:{id:"reenterPassword",type:"password",label:"Renter Password"},model:{value:e.reenterPassword,callback:function(t){e.reenterPassword=t},expression:"reenterPassword"}}),s("q-input",{attrs:{id:"email",label:"Email"},model:{value:e.email,callback:function(t){e.email=t},expression:"email"}})],1)]),s("br"),s("q-btn",{staticClass:"q-mt-md q-mb-lg",attrs:{color:"white","text-color":"black",label:"Update Account"},on:{click:e.updateAccount}})],1)])])},ie=[],oe={name:"UpdateAccount",data:function(){return{username:this.$store.state.main.account.username,firstName:this.$store.state.main.account.firstName,lastName:this.$store.state.main.account.lastName,password:"",reenterPassword:"",email:this.$store.state.main.account.email}},methods:{updateAccount:function(){var e=u()(i.a.mark((function e(){var t,s,a,r,n,o,u,c;return i.a.wrap((function(e){while(1)switch(e.prev=e.next){case 0:if(t=this.validate(),!t){e.next=6;break}return s=f.getMessage(f.LANGUAGE.en_US,t),a=new h(s,f.SOUND_ERROR,0,!1),p["a"].broadcast(d["a"].USER_MESSAGE,a),e.abrupt("return");case 6:return r=this.$store.state.main.urlBase+"user/update/data",n=new C(this.username,this.password,this.email,this.firstName,this.lastName,null,["user"]),e.next=10,n.postToServer(r);case 10:if(o=e.sent,!R.hasErrors(o)){e.next=13;break}return e.abrupt("return");case 13:this.$store.commit("main/SET_ACCOUNT",n),u=f.getMessage(f.LANGUAGE.en_US,f.SUCCESS_ACCOUNT_UPDATED),c=new h(u,f.SOUND_SUCCESS,0,!1),p["a"].broadcast(d["a"].USER_MESSAGE,c);case 17:case"end":return e.stop()}}),e,this)})));function t(){return e.apply(this,arguments)}return t}(),validate:function(){var e=new C(this.username,this.password,this.email),t=e.validate();return t||(this.password!==this.reenterPassword?f.ERROR_PASSWORDS_DO_NOT_MATCH:0)}}},ue=oe,ce=(s("607a"),Object(T["a"])(ue,ne,ie,!1,null,"4d86c0ee",null)),le=ce.exports;D()(ce,"components",{QInput:x["a"],QBtn:I["a"]});var me=function(){function e(t,s,a){l()(this,e),this.username=t,this.id=s,this.issue=a,this.issue.length&&(this.issue=parseInt(this.issue))}return E()(e,null,[{key:"postPurchaseToServer",value:function(){var e=u()(i.a.mark((function e(t,s,a){var r;return i.a.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return r=new FormData,s&&r.set("username",s),a&&r.set("books",a),e.abrupt("return",R.postToServer(t,r));case 4:case"end":return e.stop()}}),e)})));function t(t,s,a){return e.apply(this,arguments)}return t}()}]),E()(e,[{key:"postToServer",value:function(){var e=u()(i.a.mark((function e(t){var s;return i.a.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return s=new FormData,this.username&&s.set("username",this.username),this.id&&s.set("id",this.id),this.issue&&s.set("issue",this.issue),e.abrupt("return",R.postToServer(t,s));case 5:case"end":return e.stop()}}),e,this)})));function t(t){return e.apply(this,arguments)}return t}()}]),e}(),Ee=me,pe={name:"UserPanel",components:{ItemList:re,UpdateAccount:le},data:function(){return{tab:"stuff",subtotal:0}},mounted:function(){this.subtotal=this.getSubtotal},computed:{clickedCartMessage:function(){return d["a"].CART_BOOK_REMOVED},clickedFavoritesMessage:function(){return d["a"].FAVORITES_BOOK_SELECTED},clickedPurchasedMessage:function(){return d["a"].PURCHASED_BOOK_SELECTED},emptyCartMessage:function(){return f.getMessage(f.LANGUAGE.en_US,f.NO_CART)},emptyFavoritesMessage:function(){return f.getMessage(f.LANGUAGE.en_US,f.NO_FAVORITES)},emptyPurchasedMessage:function(){return f.getMessage(f.LANGUAGE.en_US,f.NO_PURCHASES)}},methods:{getSubtotal:function(){var e=0,t=this.$store.state.main.cart,s=this.$store.state.main.bookInfo;if(!t||!s)return 0;for(var a=0;a<t.length;a++)for(var r=t[a],n=0;n<s.length;n++){var i=s[n];r.id===i.id&&r.issue===i.issue&&(e+=parseFloat(i.price))}return e=e.toFixed(2),e},purchase:function(){var e=u()(i.a.mark((function e(){var t,s,a,r;return i.a.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return t=this.$store.getters.urlBase+"user/checkout/data",e.next=3,Ee.postPurchaseToServer(t,this.$store.state.main.username,JSON.stringify(this.$store.state.main.cart));case 3:if(s=e.sent,!R.hasErrors(s)){e.next=6;break}return e.abrupt("return");case 6:a=f.getMessage(f.LANGUAGE.en_US,f.SUCCESS_PURCHASE),r=new h(a,f.SOUND_SUCCESS,0,!1),p["a"].broadcast(d["a"].USER_MESSAGE,r);case 9:case"end":return e.stop()}}),e,this)})));function t(){return e.apply(this,arguments)}return t}(),signOut:function(){var e=u()(i.a.mark((function e(){return i.a.wrap((function(e){while(1)switch(e.prev=e.next){case 0:this.$store.commit("main/SIGN_OUT"),this.$store.commit("main/SET_USER_PANEL_STATE",U["a"].SIGN_IN);case 2:case"end":return e.stop()}}),e,this)})));function t(){return e.apply(this,arguments)}return t}()}},he=pe,de=(s("6d96"),s("429b")),_e=s("7460"),Se=s("adad"),fe=s("823b"),ve=s("eb85"),Re=Object(T["a"])(he,j,X,!1,null,null,null),be=Re.exports;D()(Re,"components",{QTabs:de["a"],QTab:_e["a"],QTabPanels:Se["a"],QTabPanel:fe["a"],QBtn:I["a"],QSeparator:ve["a"]});var Ae={components:{ResetPassword:M,SignIn:V,SignUp:Y,UserPanel:be},data:function(){return{right:!1}},mounted:function(){var e=u()(i.a.mark((function e(){var t,s,a;return i.a.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return t=this.$store.state.main.urlBase+"comics",e.next=3,A.getFromServer(t);case 3:if(s=e.sent,!R.hasErrors(s)){e.next=6;break}return e.abrupt("return");case 6:return e.next=8,A.getBooksFromServer(this.$store.state.main.urlBase+"comics/",JSON.parse(s.body));case 8:a=e.sent,A.sortBooks(a,A.SORT_BY_NAME),this.$store.commit("main/SET_BOOK_INFO",a);case 11:case"end":return e.stop()}}),e,this)})));function t(){return e.apply(this,arguments)}return t}(),computed:{stateResetPassword:function(){return U["a"].RESET_PASSWORD},stateSignIn:function(){return U["a"].SIGN_IN},stateSignUp:function(){return U["a"].SIGN_UP},stateUser:function(){return U["a"].USER}}},ge=Ae,we=s("4d5a"),Ne=s("e359"),Ce=s("65c6"),Ue=s("6ac5"),Oe=s("068f"),ke=s("9404"),Te=s("09e3"),ye=Object(T["a"])(ge,a,r,!1,null,null,null);t["default"]=ye.exports;D()(ye,"components",{QLayout:we["a"],QHeader:Ne["a"],QToolbar:Ce["a"],QToolbarTitle:Ue["a"],QImg:Oe["a"],QBtn:I["a"],QDrawer:ke["a"],QPageContainer:Te["a"]})},"743b":function(e,t,s){},7984:function(e,t,s){"use strict";var a=s("743b"),r=s.n(a);r.a},8382:function(e,t,s){},"8ee9":function(e,t,s){},a7ee:function(e,t,s){"use strict";s.d(t,"a",(function(){return o}));var a=s("fc74"),r=s.n(a),n=s("c47a"),i=s.n(n),o=function e(){r()(this,e)};i()(o,"CACHE_PAGE_LOADED","CACHE_PAGE_LOADED"),i()(o,"CACHE_PAGE_ADDED","CACHE_PAGE_ADDED"),i()(o,"CACHE_PAGE_REMOVED","CACHE_PAGE_REMOVED"),i()(o,"CACHE_PAGE_REFRESHED","CACHE_PAGE_REFRESHED"),i()(o,"CACHE_EXPIRED_PAGES_REFRESHED","CACHE_EXPIRED_PAGES_REFRESHED"),i()(o,"CACHE_CLEARED","CACHE_CLEARED"),i()(o,"CACHE_PAGE_FAULT","CACHE_PAGE_FAULT"),i()(o,"USER_SIGNED_IN","USER_SIGNED_IN"),i()(o,"USER_SIGNED_OUT","USER_SIGNED_OUT"),i()(o,"READER_NAV_BAR_FIRST_PAGE","READER_NAV_BAR_FIRST_PAGE"),i()(o,"READER_NAV_BAR_PREVIOUS_PAGE","READER_NAV_BAR_PREVIOUS_PAGE"),i()(o,"READER_NAV_BAR_NEXT_PAGE","READER_NAV_BAR_NEXT_PAGE"),i()(o,"READER_NAV_BAR_LAST_PAGE","READER_NAV_BAR_LAST_PAGE"),i()(o,"READER_NAV_BAR_BOOKS","READER_NAV_BAR_BOOKS"),i()(o,"READER_NAV_BAR_ENABLE_FIRST","READER_NAV_BAR_ENABLE_FIRST"),i()(o,"READER_NAV_BAR_ENABLE_PREVIOUS","READER_NAV_BAR_ENABLE_PREVIOUS"),i()(o,"READER_NAV_BAR_ENABLE_NEXT","READER_NAV_BAR_ENABLE_NEXT"),i()(o,"READER_NAV_BAR_ENABLE_LAST","READER_NAV_BAR_ENABLE_LAST"),i()(o,"READER_NAV_BAR_PROGRESS","READER_NAV_BAR_PROGRESS"),i()(o,"PURCHASED_BOOK_SELECTED","PURCHASED_BOOK_SELECTED"),i()(o,"STORE_BOOK_SELECTED","STORE_BOOK_SELECTED"),i()(o,"FAVORITES_BOOK_SELECTED","STORE_BOOK_SELECTED"),i()(o,"CART_BOOK_REMOVED","CART_BOOK_REMOVED"),i()(o,"USER_MESSAGE","USER_MESSAGE")},c6ba:function(e,t,s){"use strict";var a=s("35da"),r=s.n(a);r.a},d5eb:function(e,t,s){"use strict";s.d(t,"a",(function(){return l}));s("551c"),s("ac6a"),s("cadf"),s("06db"),s("5df3");var a=s("fc74"),r=s.n(a),n=s("59a1"),i=s.n(n),o=s("c47a"),u=s.n(o),c=s("a7ee"),l=function(){function e(){r()(this,e)}return i()(e,null,[{key:"register",value:function(t,s,a){e.listeners.push({listener:t,message:s,callback:a})}},{key:"isRegistered",value:function(t,s){for(var a=0;a<e.listeners.length;a++){var r=e.listeners[a];if(r.listener===t&&r.message===s)return!0}return!1}},{key:"unregister",value:function(t,s){for(var a=[],r=0;r<e.listeners.length;r++){var n=e.listeners[r];n.listener===t&&n.message===s&&a.push(e.listeners.splice(r,1)[0])}return a}},{key:"unregisterAll",value:function(){e.listeners=[]}},{key:"broadcast",value:function(t,s){for(var a=[],r=0;r<e.listeners.length;r++){var n=e.listeners[r];n.message===t&&(n.callback(s),a.push(n))}return a}},{key:"broadcastError",value:function(t){return e.broadcast(c["a"].ERROR,{message:t})}},{key:"broadcastNotification",value:function(t){return e.broadcast(c["a"].NOTIFICATION,{message:t})}},{key:"call",value:function(t,s){for(var a=[],r=0;r<e.listeners.length;r++){var n=e.listeners[r];n.message===t&&a.push(n.callback(s))}return Promise.all(a)}}]),e}();u()(l,"listeners",[])},def6:function(e,t,s){}}]);
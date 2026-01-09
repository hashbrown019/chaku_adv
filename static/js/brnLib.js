"use strict";
"use strict";
"use strict";

let CALLERSTACK = [];
let xhttp={};
let _ = undefined;
let REQ_ERR_DIALOG = false; //Depricated
var CONNECTION = {};
var REQUESTS = {};
var CONNECTION_COUNTER = 0;
var ERR_EXCEPTIONS = false;
var ON_GOING_REQUEST = [];
var ACTIVE_CONNECTION
let _last_ls_random_result = '';
let onload_funcs = [];
const _JS_NAME = 'brorn.JS' ;
const _JS_VERSION_ = 'v 0.13.1_alpha' ;
const _VERSION_ = _JS_VERSION_;
const POST = "POST";
const GET = "GET";
const OPTION = "OPTION";
console.log(" * License");
console.log(" * Loading JS Framework");
let _WARNINGS_ = true;if(!_WARNINGS_){console.warn = function(args){}};
function $CLASS(class_name){return document.getElementsByClassName(class_name)};
function $TAG(tag){_CALLERSTACK();return document.getElementsByTagName(tag)};
function $ID(id_name){return document.getElementById(id_name)};
function $NAME(_name){return document.getElementsByName(_name)};
function $randint(size){_CALLERSTACK();return Math.floor(Math.random() * size);};
function goto(url,new_tab=false){
	if(new_tab){
		window.open(url,'_blank');
	}else{
		// window.location.replace(url);
		window.location.href = url;
	}
};
function redirectto(url){window.location.href = url;}; // DEPRICATED
function $$$_(q){_CALLERSTACK();return document.querySelector(q)};
function $json(str){_CALLERSTACK();return JSON.parse(str)};
function $table(...p){_CALLERSTACK();console.table(...p)};
function printtable(...p){_CALLERSTACK();console.table(...p)};
function $print(...p){_CALLERSTACK();console.log(...p)};
function println(...p){
	_CALLERSTACK();
	console.groupCollapsed(...p)
	console.trace(...p);
	console.groupEnd();
	return p
};
function errprintln(...p){_CALLERSTACK();console.error(...p)};
function warnprintln(...p){_CALLERSTACK();console.warn(...p)};
function $date(){_CALLERSTACK();return new Date()};
function $datetime(){_CALLERSTACK();return new Date().toLocaleString()};

// ARRAY MANIPULATION
function arr_rem_dup(arr){return [...new Set(arr)]}

function print_page(page_id) {
	var printContents = document.getElementById(page_id).innerHTML;
	var originalContents = document.body.innerHTML;
	document.body.innerHTML = printContents;
	window.print();
	document.body.innerHTML = originalContents;
	return printContents
};

var URL_ARGS =  URL_ARGS_();
function URL_ARGS_ (){
	var url = new URL(document.location.toString());let obj = {};
	var c = url.searchParams.forEach((value, key) => {obj[key] = value;});
	_CALLERSTACK();return(obj);
};

var URL_ARGS_ID =  URL_ARGS_ID_();
function URL_ARGS_ID_(){
	var url = new URL(document.location.toString());
	var __IDURL__ = document.location.toString().split("#")[1];
	return(__IDURL__);
};
function _CALLERSTACK(){
	var arss = (new Error).stack.split("\n");
	delete arss[0];
	delete arss[1];
	CALLERSTACK.push(arss);
	return CALLERSTACK
};


function show_view(ids,classn,func){
	var panel_views = $CLASS(classn);
	for (var i = 0; i < panel_views.length; i++) {
		if(ids!=panel_views[i].id){panel_views[i].style.display="none"}else{panel_views[i].style.display="block"};
	};
	try{
		func(ids);
	}catch(e){
		console.warn(e);
	};
 };

function $show_view_args_check(ids,classn, istrue,isfalse){
	var panel_views = $CLASS(classn);
	println(ids);
	for (var i = 0; i < panel_views.length; i++) {
		if(ids!=panel_views[i].id){panel_views[i].checked=istrue}else{panel_views[i].checked=isfalse};
	}
 };
 
function $http(p){_CALLERSTACK();return http(p)};
function $send(p){_CALLERSTACK();return http(p)};
function http(p){
	var UNIQUE_REQUEST_KEY = gen_code(14);
	// this.p = p;
	let RESULT_REQ = undefined;
	if(window.navigator.onLine){}
	else{println("You are not connected to internet")};
	CONNECTION_COUNTER += 1;
	const params = populate(p);
	ACTIVE_CONNECTION = (CONNECTION_COUNTER);
	REQUESTS[ACTIVE_CONNECTION] =  params;
	CONNECTION[ACTIVE_CONNECTION] = new XMLHttpRequest();
	xhttp[UNIQUE_REQUEST_KEY] = CONNECTION[ACTIVE_CONNECTION];
	xhttp[UNIQUE_REQUEST_KEY].UNIQUE_REQUEST_KEY = UNIQUE_REQUEST_KEY;
	xhttp[UNIQUE_REQUEST_KEY].open(REQUESTS[ACTIVE_CONNECTION].method,REQUESTS[ACTIVE_CONNECTION].action,REQUESTS[ACTIVE_CONNECTION].a_sync);
	// xhttp[UNIQUE_REQUEST_KEY].timeout = 1;
	for (var key in REQUESTS[ACTIVE_CONNECTION].headers){xhttp[UNIQUE_REQUEST_KEY].setRequestHeader(key, REQUESTS[ACTIVE_CONNECTION].headers[key])};
	// xhttp[UNIQUE_REQUEST_KEY].onreadystatechange = function(){RESULT_REQ = this}
	let loadEnd =  function (e) {
		RESULT_REQ = e.target;
		if(parseInt(e.target.status)!=200){
			warnprintln(" - ERROR on request : Happened on [http.loadend.condition_0]");
			if(REQUESTS[ACTIVE_CONNECTION].err_dialog==true){
				var err_dialog = $dialog({
					title : "Something Went Wrong",
					subtitle : "",
					content : "<div class='x-padding x-container' style='overflow-y:scroll;height: 70vh;'><div id='ERR_PAGE_PRINT'>errReady_state:"+RESULT_REQ.readyState+" | errStatus:"+RESULT_REQ.status+" | action:<i>"+REQUESTS[ACTIVE_CONNECTION].action+"</i></br><h4>Please do Screenshot or save this error for your reporting, specially the <b><i>Traceback</i></b></h3><br>"+e.target.response+"</div></div>",
					footer_content : "ERROR on request : Happened on [http.loadend.condition_0]",
					buttons : ['Print Error'],
					buttons_actions : [print_err]
				});
				err_dialog.dialog.style.width = "50vw";
				err_dialog.show();
			};
			REQUESTS[ACTIVE_CONNECTION].err(e);
		};
		if(RESULT_REQ.readyState == 4) {
			if(RESULT_REQ.status == 200){
				if(REQUESTS[ACTIVE_CONNECTION].response=="all"){REQUESTS[ACTIVE_CONNECTION].func(RESULT_REQ,RESULT_REQ.getAllResponseHeaders())}
				else if(REQUESTS[ACTIVE_CONNECTION].response=="header"){REQUESTS[ACTIVE_CONNECTION].func(RESULT_REQ.getAllResponseHeaders())}
				else if(REQUESTS[ACTIVE_CONNECTION].response=="text"){REQUESTS[ACTIVE_CONNECTION].func(RESULT_REQ.responseText)}
				else{REQUESTS[ACTIVE_CONNECTION].func(RESULT_REQ.responseText)};
			}else{
				warnprintln(" - ERROR on request : Happened on [http.loadend.condition_1.condition_1]");
				if(REQUESTS[ACTIVE_CONNECTION].err_dialog==true){
					var err_dialog = $dialog({
						title : "Something Went Wrong",
						subtitle : "",
						content : "<div class='x-padding x-container' style='overflow-y:scroll;height: 70vh;'><div id='ERR_PAGE_PRINT'>errReady_state:"+RESULT_REQ.readyState+" | errStatus:"+RESULT_REQ.status+" | action:<i>"+REQUESTS[ACTIVE_CONNECTION].action+"</i></br><h4>Please do Screenshot or save this error for your reporting, specially the <b><i>Traceback</i></b></h3><br>"+e.target.response+"</div></div>",
						footer_content : "ERROR on request : Happened on [http.loadend.condition_1.condition_1]",
						buttons : ['Print Error'],
						buttons_actions : [print_err]
					});
					err_dialog.dialog.style.width = "50vw";
					err_dialog.show();
				};
				REQUESTS[ACTIVE_CONNECTION].err(e);
			};
		}else if(RESULT_REQ.status == 500 || RESULT_REQ.status == 404 || RESULT_REQ.status == 401){
			REQUESTS[ACTIVE_CONNECTION].func(RESULT_REQ.getAllResponseHeaders);
			ERROR = {"ERROR_REQUEST":CONNECTION[ACTIVE_CONNECTION]};
			_CALLERSTACK();return xhttp[UNIQUE_REQUEST_KEY];
			 
		}else{
			warnprintln(" - ERROR on request : Happened on [http.loadend.condition_3]");
			if(REQUESTS[ACTIVE_CONNECTION].err_dialog==true){
				var err_dialog = $dialog({
					title : "Something Went Wrong",
					subtitle : "",
					content : "<div id='err_occour' class='x-padding x-container' style='overflow-y:scroll;height: 70vh;'><div id='ERR_PAGE_PRINT'>errReady_state:"+RESULT_REQ.readyState+" | errStatus:"+RESULT_REQ.status+" | action:<i>"+REQUESTS[ACTIVE_CONNECTION].action+"</i></br><h4>Please do Screenshot or save this error for your reporting, specially the <b><i>Traceback</i></b></h3><br>"+e.target.response+"</div></div>",
					footer_content : "ERROR on request : Happened on [http.loadend.condition_3]",
					buttons : ['Print Error'],
					buttons_actions : [print_err]
				});
				err_dialog.dialog.style.width = "50vw";
				err_dialog.show();
			};
			REQUESTS[ACTIVE_CONNECTION].on_request(this);
		};
		function print_err(){
			// print_page(err_dialog.dialog.id)
			print_page('ERR_PAGE_PRINT');
		};
	}

	let progress_ = function(e){REQUESTS[ACTIVE_CONNECTION].progress(e)}
	let _timeout = function(e){
		warnprintln(" - ERROR on request : Happened on [http.loadend._timeout]")
		if(REQUESTS[ACTIVE_CONNECTION].err_dialog==true){
			var err_dialog = $dialog({
				title : "Something Went Wrong",
				subtitle : "",
				content : "<div class='x-padding x-container' style='overflow-y:scroll;height: 70vh;'><div id='ERR_PAGE_PRINT'>errReady_state:"+RESULT_REQ.readyState+" | errStatus:"+RESULT_REQ.status+" | action:<i>"+REQUESTS[ACTIVE_CONNECTION].action+"</i></br><h4>Please do Screenshot or save this error for your reporting, specially the <b><i>Traceback</i></b></h3><br>"+e.target.response+"</div></div>",
				footer_content : "ERROR on request : Happened on [http.loadend._timeout]",
				buttons : ['Print Error'],
				buttons_actions : [print_err]
			});
			err_dialog.dialog.style.width = "50vw";
			err_dialog.show();
		};
		REQUESTS[ACTIVE_CONNECTION].timeout(e);
	};
	// xhttp[UNIQUE_REQUEST_KEY].timeout = 2000
	xhttp[UNIQUE_REQUEST_KEY].addEventListener("loadend", loadEnd);
	xhttp[UNIQUE_REQUEST_KEY].addEventListener("progress", progress_);
	xhttp[UNIQUE_REQUEST_KEY].addEventListener("timeout", _timeout);
	xhttp[UNIQUE_REQUEST_KEY].send(params.data);
	return xhttp[UNIQUE_REQUEST_KEY];
}

http.prototype.next = async function(func) {xhttp[UNIQUE_REQUEST_KEY].addEventListener('loadend', function(e) {$print("* Next :"+e.type);_CALLERSTACK();return func});}
http.prototype.with = async function(func) {xhttp[UNIQUE_REQUEST_KEY].addEventListener('loadstart', function(e) {$print("* with"+e.type);_CALLERSTACK();return func});}

String.prototype.replaceAt = function(index, replacement) {
	_CALLERSTACK();return this.substr(0, index) + replacement + this.substr(index + replacement.length);
}

function headerMap(resp){
	const arr = resp.target.getAllResponseHeaders().trim().split(/[\r\n]+/);
	const _headerMap = {};
	arr.forEach((line) => {
		const parts = line.split(': ');
		const header = parts.shift();
		const value = parts.join(': ');
		_headerMap[header] = value;
	});
	return _headerMap;
}

function $TRIGGER(params){
	if(params.id==undefined){params.action='#'};
	if(params.event==undefined){params.event="click"};
	if(params.func==undefined){params.func= function(){alert(params)}};
	$(params.id).addEventListener(params.event, params.func);
}

function populate(params){
	if(params.on_request==undefined){params.on_request=function(ret){println(" *[BRORN.js] on request :"+JSON.stringify(ret.xhttp))}};
	if(params.func==undefined){params.func=function(res){$print(res)}};
	if(params.err==undefined){params.err=function(res){$print(res)}};
	if(params.data==undefined){params.data=$DATA({'_DATA':'NULL'})};
	if(params.progress==undefined){params.progress=function(res){}};
	if(params.timeout==undefined){params.timeout=function(res){}};
	if(params.response==undefined){params.type="responseText"};
	if(params.err_dialog==undefined){params.err_dialog=false};
	if(params.method==undefined){params.method='POST'};
	if(params.headers==undefined){params.headers={}};
	if(params.a_sync==undefined){params.a_sync=true};
	if(params.action==undefined){params.action='/'};
	_CALLERSTACK();return params;
}

function num_comma(x){_CALLERSTACK();return Money(x)}
function money(x){_CALLERSTACK();return Money(x)}
function Money(x) {
	if(x==null){_CALLERSTACK();return x}else{_CALLERSTACK();return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");}
}

function ls_random(ls){
	while(true){
		res = ls[Math.floor(Math.random() * ls.length)];
		if(res==_last_ls_random_result){continue}
		else{_last_ls_random_result = res;_CALLERSTACK();return res}
	}
} 

function input_to_json(class_name,get_by_name=false){
	var class_object=$CLASS(class_name);var form_data_from_input ={};
	for (var i = 0; i < class_object.length; i++) {
		var key = "NULL"; var val = "NULL";
		if(get_by_name){key = class_object[i].name}
		else{key = class_object[i].id}

		if(class_object[i].type=="checkbox"){val = class_object[i].click()}
		else{val = class_object[i].value}
		form_data_from_input[key] = val;
	}
	delete form_data_from_input[""]
	return form_data_from_input;
}

//DEPRICATED
function json_to_input(class_name,json,set_by_name=false,func=function(){}){
	DICT_TO_INPUT(json,class_name,set_by_name,func);
};

function DICT_TO_INPUT(DICT_,class_name,set_by_name=false,func=function(i,e){return true}) {
	/*
	PARAMS @ DICT = json data o fill the fields
	PARAMS @ class_name = class name of the fields
	PARAMS @ set_by_name = if true, values will be set by name not by id
	PARAMS @ func = function executed every loop, must return true otherwise skipp the loop
	*/
	var x_ins = $CLASS(class_name)
	for (let index = 0; index < x_ins.length; index++) {
		if(!func(index,x_ins[index].id)){continue}
		var _KEY = "NULL"
		if(set_by_name){_KEY = x_ins[index].name;}
		else{_KEY = x_ins[index].id;}
		if (x_ins[index].type == "checkbox") {
			try{
				if(DICT_[_KEY] === "true") {
					x_ins[index].click();
				};
			}catch(err){
				warnprintln(_KEY + " ||| " + err)
			};
		} else if (x_ins[index].type == "select-one") {
			try{
				x_ins[index].value = DICT_[_KEY];
				trigger_event(x_ins[index],'change');
			}catch(err){
				warnprintln(_KEY + " ||| " + err);
			}
		} else {
			try {
				x_ins[index].value = DICT_[_KEY];
			} catch (error) {
				warnprintln(_KEY + " ||| " + error);
			}
		}
	}
	return x_ins
}

function DICT_TO_TEXT(dict_){
	for( key in dict_){
		try{
			println();
			// $ID(key).innerText = dict_[key]
		}catch(e){
			warnprintln(` * Unable to set text to id : [${key}] with an error [${e}]`);
		}
	}
}


function trigger_event(element,trigger) {
	let changeEvent = new Event(trigger);
	element.dispatchEvent(changeEvent);
};

// FORM DATA FUNCTIONS
function $DATA(d){var data_form = new FormData();for(var key in d){data_form.append(key, d[key])};_CALLERSTACK();return data_form};
FormData.prototype.appendFile = function(file_tag) {for (var i = 0; i < file_tag.files.length; i++) {this.append(file_tag.id+i,file_tag.files[i])};_CALLERSTACK();return this};
FormData.prototype.appendFileArr = function(file_tag) {for (var x = 0; x < file_tag.files.length; x++) {this.append(file_tag.id, file_tag.files[x]);}return this};
// FormData.prototype.appendFileArr = function(file_tag) {for (var x = 0; x < file_tag.files.length; x++) {this.append(file_tag.id+"[]", file_tag.files[x]);}return this}

function hashCode(str, seed = 0) {
	let h1 = 0xdeadbeef ^ seed, h2 = 0x41c6ce57 ^ seed;
	for (let i = 0, ch; i < str.length; i++) {ch = str.charCodeAt(i);h1 = Math.imul(h1 ^ ch, 2654435761);h2 = Math.imul(h2 ^ ch, 1597334677);}
	h1 = Math.imul(h1 ^ (h1>>>16), 2246822507) ^ Math.imul(h2 ^ (h2>>>13), 3266489909);
	h2 = Math.imul(h2 ^ (h2>>>16), 2246822507) ^ Math.imul(h1 ^ (h1>>>13), 3266489909);
	_CALLERSTACK();return 4294967296 * (2097151 & h2) + (h1>>>0);
};

String.prototype.toCamelCase = function() {camelcase(this)};
function camelcase(strs_){
	try{
		_CALLERSTACK();return strs_.replace(/^([A-Z])|\s(\w)/g, function(match, p1, p2, offset) {
			if (p2) _CALLERSTACK();return p2.toUpperCase();
			_CALLERSTACK();return p1.toLowerCase();        
		});
	}
	catch(e){warnprintln(e)};
};

function upeachword(strs_){
	if(strs_!=undefined){
		var str = strs_.split(" ");var new_str = "";
		if(str.length>1){
		// if(str[i]!=undefined){
			for (var i = 0; i < str.length; i++) {
				if(str[i][0]==undefined){continue};
				new_str += str[i][0].toUpperCase() + str[i].substring(1) + " ";
			}
			return new_str;
		}
		else{
			return strs_[0].toUpperCase() + strs_.substring(1) ;
		}
	}else{
		return "";
	};
};

function timeout(func,sec){window.setTimeout(func,sec)}

var w;
function JSWorker(JS_FILE_NAME,func) {
	if(typeof(Worker) !== "undefined") {
		if(typeof(w) == "undefined") {w = new Worker(JS_FILE_NAME);}
		func(w);
		// w.onmessage = function(event) {_CALLERSTACK();func(event);};
	} else {alert("Sorry, your browser does not support Web Workers...");}
};

function stopWorker() { w.terminate();w = undefined;}


function generate_code(len){return gen_code(len)}
function gen_code(length) {
	for (var s=''; s.length < length; s += 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.charAt(Math.random()*62|0));
	_CALLERSTACK();return s;
};

function gen_decode(str) {
	for (var s=str; s.length < length; s += 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.charAt(Math.random()*62|0));
	_CALLERSTACK();return s;
};

function getCookie(cname) {
	let name = cname + "=";
	let decodedCookie = decodeURIComponent(document.cookie);
	let ca = decodedCookie.split(';');
	for(let i = 0; i <ca.length; i++) {
		let c = ca[i];
		while (c.charAt(0) == ' ') {
			c = c.substring(1);
		}
		if (c.indexOf(name) == 0) {
			return c.substring(name.length, c.length);
		}
	};
	return undefined;
}
;
function input_validate(_class_){
	var class_ = $CLASS(_class_);var arr_val = [];
	for (var i = 0; i < class_.length; i++) {arr_val.push(class_[i].value.length)};
	return !arr_val.includes(0);
};

function search_str_arr(strs,_arr){
	return _arr.every(item => strs.toLowerCase().includes(item.toLowerCase()));
};

function add_class2class(class_,...cl){
	const elmnts = document.querySelectorAll("."+class_);
	for (const elmnt of elmnts) {
		elmnt.classList.add(...cl);
	}
};

function isOnline(){
	// println("--- INTERNET DATA is :"+window.navigator.onLine);
	return window.navigator.onLine;
	// return false
};

function sortByKeys(dict) {
	var sorted = [];
	for(var key in dict) {
		sorted[sorted.length] = key;
	}
	sorted.sort();
	var tempDict = {};
	for(var i = 0; i < sorted.length; i++) {
		tempDict[sorted[i]] = dict[sorted[i]];
	}
	return tempDict;
};

// ----------------FOR DYNAMIC MODAL-------------------------------------



function $modal(args){return $dialog(args)};
function $dialog(_args){
	let ___name = create_div();
	let MODAL_ = $ID(___name);
	let type_ls__ = {"done":"blue","success":"green","error":"red","warning":"yellow","neutral":"grey"};
	let type_ls__ICON = {"done":"check-square-o","success":"check-square-o","error":"minus-circle","warning":"exclamation-triangle","neutral":"info-circle"};
	let contnt;let CLR_ ;let CLR_ICON ;let __btns;let __btns_def;let __btns_act;
	let ___actions ;let __value_setter;
	__value_setter = function(args){
		contnt = $dialog_popu(args,MODAL_);
		CLR_ = type_ls__[contnt.type];
		CLR_ICON = type_ls__ICON[contnt.type];
		if (CLR_ == undefined) {CLR_="grey"}
		if (CLR_ICON == undefined) {CLR_ICON="grey"}
		// MODAL_.style.display ="none";
		MODAL_.querySelector("#MODAL_BRN_HEADER").classList.remove("x-pale-"+CLR_);
		MODAL_.querySelector("#MODAL_BODYBRN").classList.remove("x-border-"+CLR_);
		MODAL_.querySelector("#FA_FA_").classList.remove("x-text-"+CLR_);
		MODAL_.querySelector("#FA_FA_").classList.remove("fa","fa-"+CLR_ICON);
		MODAL_.querySelector("#modal_title").classList.remove("x-text-"+CLR_);

		MODAL_.querySelector("#MODAL_BRN_HEADER").classList.add("x-pale-"+CLR_);
		MODAL_.querySelector("#MODAL_BODYBRN").classList.add("x-leftbar","x-border-"+CLR_);
		MODAL_.querySelector("#FA_FA_").classList.add("fa","fa-"+CLR_ICON,"x-text-"+CLR_);
		MODAL_.querySelector("#modal_title").classList.add("x-text-"+CLR_);
		MODAL_.querySelector("#modal_title").innerHTML = contnt.title;
		MODAL_.querySelector("#modal_subtitle").innerHTML = contnt.subtitle;
		MODAL_.querySelector("#modal_content").innerHTML = contnt.content;
		MODAL_.querySelector("#modal_footer_content").innerHTML = contnt.footer_content;

		__btns = contnt.buttons;
		__btns_def = MODAL_.querySelectorAll(".___modal_btn");
		__btns_act = contnt.buttons_actions;
		for (var BTN_BRNJ = 0; BTN_BRNJ < __btns.length; BTN_BRNJ++) {
			__btns_def[BTN_BRNJ].innerHTML = __btns[BTN_BRNJ];
			__btns_def[BTN_BRNJ].style.display = "inline";
		};
		___actions(__btns_act);
		return MODAL_;
	};

	___actions = function(__btns_act_){
		for (var _btnACT = 0; _btnACT < __btns_act_.length; _btnACT++) {
			__btns_def[_btnACT].addEventListener("click",__btns_act_[_btnACT]);
			// __btns_def[_btnACT].addEventListener("click",function(){println(__btns_act_[_btnACT])});
		}
	}
	__value_setter(_args);
	___actions(__btns_act);
	return {
		"get_modal_data" : contnt,
		"dialog": MODAL_.childNodes[0],
		"show": function(){MODAL_.style.display="block"; return MODAL_.childNodes[0]},
		"hide":function(){ MODAL_.style.display="none"; return MODAL_.childNodes[0]},
		"destroy":function(){DESTROY_MODAL(MODAL_,contnt);MODAL_.childNodes[0]},
		"elements": MODAL_.childNodes,
		"modal": MODAL_,
		"actions" : ___actions,
		"elem_buttons" : function () {return MODAL_.childNodes[0].querySelectorAll(".___modal_btn")},
		"set" : function(__args){
			for(new_key in __args){_args[w] = __args[new_key]};
			__value_setter(_args);
		},
	}
};

function DESTROY_MODAL(__MODAL,contnt){
	// contnt.on_destroy()
	__MODAL.remove();
};
let MODAL_COUNT = 0;
function create_div(){
	var div = document.createElement('div');
	div.id = 'DIALOG_MODAL_BRORNJS_'+MODAL_COUNT;
	div.className = 'x-modal x-animate-fade';
	div.innerHTML = MODAL_DEF;
	document.body.appendChild(div);
	MODAL_COUNT+=1;
	// println(" + Creating Modal with ID : "+div.id)
	return div.id;
};

function $dialog_popu(args,MODAL_){
	var __DEF_ACT = function(){MODAL_.remove();}
	var __DEF_LS_ACT=[__DEF_ACT,__DEF_ACT,__DEF_ACT];
	var __btns_def = $CLASS("___modal_btn");
	if(args.title==undefined || args.title==""){args.title = "Hi There"}
	// if(args.on_destroy==undefined || args.on_destroy==""){args.on_destroy = function(e){console.warn(" * Dialog Destroy")}}
	if(args.type==undefined || args.type==""){args.type = 'neutral'}
	if(args.subtitle==undefined || args.subtitle==""){args.subtitle = 'Please read the content below carefully'}
	if(args.footer_content==undefined || args.footer_content==""){args.footer_content = 'Please select a response'}
	if(args.content==undefined || args.content==""){args.content = 'You are seeing this dialog because something wants to alert you'};
	if(typeof(args.buttons_actions)=='object'){
		for (var i = 0; i < args.buttons_actions.length; i++) {__DEF_LS_ACT[i] = args.buttons_actions[i]};
		args.buttons_actions=__DEF_LS_ACT;
	};
	if(typeof(args.buttons_actions)=='undefined'){args.buttons_actions = __DEF_LS_ACT}
	if(typeof(args.buttons)=='undefined'){args.buttons = ["Proceed"]}
	else if(typeof(args.buttons)=='string'){
		if(args.buttons=="" || args.buttons==" "){args.buttons = ["Proceed"]};
	}
	return args;
};


// =========================== multiple select===================================
// dd1 = $dropdown_multiple({
// 	id : "ID OF INPUT (div to be replace by dropdown)",
// 	dd_id : "ID WHERE VALUE WILL PUT: AUTO_GEN",
// 	classn : "CLASS NAME OF ALL INPUT IN FORMS",
// 	option :  (ARRAY OF LIST OR OPTION),
// 	search : true,
// 	add : true,
// 	on_add : function(item){}
// })
// Must be init after onload and before usage

// this tag must place inorder to use dialog
// <div id="sample_dropdown" class="name_f x-select x-dropdown_multiple x-container x-row">
// 	</div>

function dropdown_mul(params){return $dropdown_multiple(params)};
function $dropdown_multiple(params){
	params = drop_down_popu_(params);
	var btn__dd_ad = params.add ? "<button onclick='__dd_add_item_to_prelist(this.parentNode,"+params.on_add+")' style='width:25%' class='x-col x-btn x-green'><span class='fa fa-plus'></span></button>":"";
	var _opts = (params.search) ? "<div class='x-row'><input onkeyup='__dd_on_search(this,"+'"'+params.option_display+'"'+")' style='width:70%;' class='__dd_search_field x-col x-input x-border' type='' name='' placeholder='Search or add here'>"+btn__dd_ad+"</div><b class='x-text-grey x-hover-text-blue'>Selected</b><div class='__dd_added_item'></div><br><b class='x-text-grey' style='display:"+params.option_display+";'>-- Options --</b>":"";

	var __id_dd_m = $ID(params.id);
	__id_dd_m.innerHTML = `<span class="anchor">Select Options</span><ul class="dd_items" style="min-width:100%;overflow-y:scroll;max-height: `+params.max_height+`;"></ul><input id=`+params.dd_id+` name=`+params.dd_name+` hidden class="_dd_value _form `+params.classn+`" type="" name="" value="none">`;
	for (var i = 0; i < params.option.length; i++) {
		_opts +=(`<li style="padding:2px;display:`+params.option_display+`" class="__item_ind x-hover-blue x-text-grey"><span class='_dd_item_label'>`+params.option[i]+`</span></li>`);
		// _opts +=(`<span style="display:`+params.option_display+`"><li style="padding:2px;" class="__item_ind x-hover-blue x-text-grey"><span class='_dd_item_label'>`+params.option[i]+`</span></li></span>`);
	}
	__id_dd_m.getElementsByClassName('anchor')[0].innerHTML = "<b class='x-hover-text-blue'>"+params.default+"</b>";
	__id_dd_m.getElementsByClassName('dd_items')[0].innerHTML = _opts;
	__id_dd_m.getElementsByClassName('anchor')[0].onclick = function(evt) {
		if (__id_dd_m.classList.contains('visible')){__id_dd_m.classList.remove('visible');}
		else{__id_dd_m.classList.add('visible');}
	};

	var dd_ind_tem = __id_dd_m.getElementsByClassName('dd_items')[0].getElementsByClassName('__item_ind');
	for (var i = 0; i < dd_ind_tem.length; i++) {
		dd_ind_tem[i].onclick = function(e){
			// println(e.srcElement)
			add_item_from_prelist(e.srcElement,params.func,__id_dd_m);
		}
	};

	document.addEventListener('click', function handleClickOutsideBox(event) {
		if (!__id_dd_m.contains(event.target)) {__id_dd_m.classList.remove('visible');}
	});

	return {
		value : function () {return dd_value(__id_dd_m)},
		add_item: function(itm_val){
			if(dd_value(__id_dd_m).includes(itm_val)){println(" * Item on parameter failed to add due to duplication");return}
			var id_item = gen_code(8);
			var _to_add = (`<li id='__dd_item_id_`+id_item+`' class="__item_ind __added_items" style="padding:2px;"><input id=""`+itm_val.replace(" ","")+`"" class="_dd_item " type="checkbox" onclick="added_item_click_dd(this)" value="`+itm_val+`" checked/>&nbsp;<span class='_dd_item_label'>`+itm_val+`</span></li>`)
			var item__ = __id_dd_m.getElementsByClassName("dd_items")[0].getElementsByClassName("__dd_added_item")[0]
			item__.innerHTML += _to_add;
			__id_dd_m.getElementsByClassName("_dd_value")[0].value = dd_value(__id_dd_m);
			__id_dd_m.getElementsByClassName('anchor')[0].innerHTML = "<b>("+dd_value(__id_dd_m).length + ")</b> Selected"
			params.func(dd_value(__id_dd_m));
			return $ID('__dd_item_id_'+id_item);
		}
	}
};

function drop_down_popu_(params){
	params.func = params.on_add
	if(params.id == undefined ||params.id == ""){params.id=gen_code(4)};
	if(params.dd_id == undefined ||params.dd_id == ""){params.dd_id=gen_code(4)};
	if(params.dd_name == undefined ||params.dd_name == ""){params.dd_name=params.dd_id};
	if(params.classn == undefined ||params.classn == ""){params.classn=gen_code(4)};
	if(params.default == undefined ||params.default == ""){params.default="Select Option"};
	if(params.option == undefined ||params.option == ""){params.option=["Yes","no"]};
	if(params.max_height == undefined ||params.max_height == ""){params.max_height="40vh"};
	if(params.on_add == undefined ||params.on_add == ""){params.on_add=function(item){}};
	if(params.add == undefined ||params.add == ""){params.add=false};
	if(params.option_display == undefined ||params.option_display == ""){params.option_display=true};
	return params;
};

function dd_value(__id_dd_m) {
	var __selected_dd_items = [];
	var items = __id_dd_m.getElementsByClassName("dd_items")[0].getElementsByClassName("__added_items");
	for (var i = 0; i < items.length; i++) {
		try{
			if(items[i].getElementsByClassName('_dd_item')[0].checked){
				__selected_dd_items.push(items[i].getElementsByClassName('_dd_item_label')[0].innerHTML) ;
			}
		}catch(e){println("Click error : "+e)}
	}
	__id_dd_m.getElementsByClassName("_dd_value")[0].value = __selected_dd_items;
	return(__selected_dd_items);
};

function add_item_from_prelist(elem,func,__id_dd_m){
	var sel_val = elem.innerHTML;
	if(sel_val.includes("/>")||sel_val.includes("</")){println(" * Item on the list failed to add due to dupilciate");return}
	if(dd_value(__id_dd_m).includes(sel_val)){return}
	elem.parentNode.parentNode.getElementsByClassName('__dd_added_item')[0].innerHTML +=(`<li class="__item_ind __added_items" style="padding:2px;"><input id=""`+sel_val.replace(" ","")+`"" class="_dd_item " type="checkbox" onclick="added_item_click_dd(this)" value="`+sel_val+`" checked/>&nbsp;<span class='_dd_item_label'>`+sel_val+`</span></li>`);
	__id_dd_m.getElementsByClassName("_dd_value")[0].value = dd_value(__id_dd_m);
	__id_dd_m.getElementsByClassName('anchor')[0].innerHTML = "<b>("+dd_value(__id_dd_m).length + ")</b> Selected";
	func(dd_value(__id_dd_m));
}

function __dd_add_item_to_prelist(elem,func){
	var __id_dd_m = elem.parentNode.parentNode;
	var itm_val = elem.getElementsByClassName("__dd_search_field")[0].value;
	if(dd_value(__id_dd_m).includes(itm_val)){println(" * Item on search field failed to add due to dupilciate");return}

	var in_added_ls = false;
	var all_items_in_dd = (elem.parentNode.getElementsByClassName("_dd_item_label"));
	for (var i = 0; i < all_items_in_dd.length; i++) {
		all_items_in_dd[i].parentNode.style.display="block"; 
		if(all_items_in_dd[i].innerHTML.toLowerCase()==(itm_val).toLowerCase()){in_added_ls=true}
	}
	if(!in_added_ls){ elem.parentNode.getElementsByClassName('__dd_added_item')[0].innerHTML +=(`<li class="__item_ind __added_items" style="padding:2px;"><input id=""`+itm_val.replace(" ","")+`"" class="_dd_item " type="checkbox" onclick="added_item_click_dd(this)" value="`+itm_val+`" checked/>&nbsp;<span class='_dd_item_label'>`+itm_val+`</span></li>`) };
	__id_dd_m.getElementsByClassName("_dd_value")[0].value = dd_value(__id_dd_m);
	__id_dd_m.getElementsByClassName('anchor')[0].innerHTML = "<b>("+dd_value(__id_dd_m).length + ")</b> Selected";
	func(dd_value(__id_dd_m));
};

function __dd_on_search(itms,option_display){
	var val = itms.value;
	var all_items_in_dd = (itms.parentNode.parentNode.getElementsByClassName("_dd_item_label"));
	for (var i = 0; i < all_items_in_dd.length; i++) {
		if(!(all_items_in_dd[i].innerHTML.toLowerCase()).includes(val.toLowerCase())){all_items_in_dd[i].parentNode.style.display="none";}
		else{all_items_in_dd[i].parentNode.style.display="block"}
	}
	// var re__item_ind = $CLASS("__item_ind")
	// if(val.length<=1){
	// 	for (var i = 0; i < re__item_ind.length; i++) {
	// 		re__item_ind[i].parentNode.style.display = option_display
	// 	}
	// }
};

function added_item_click_dd(elem){
	var parent_node = (elem.parentNode.parentNode.parentNode.parentNode);
	parent_node.getElementsByClassName('anchor')[0].innerHTML = "<b>("+dd_value(parent_node).length + ")</b> <b class='x-hover-text-blue'>Selected</b";
};

function sortTable(table_id,thead) {
	var table, rows, switching, i, x, y, shouldSwitch;
	table = document.getElementById(table_id);
	switching = true;
	while (switching) {
		switching = false;
		rows = table.rows;
		for (i = 1; i < (rows.length - 1); i++) {
			// Start by saying there should be no switching:
			shouldSwitch = false;
			/* Get the two elements you want to compare,
			one from current row and one from the next: */
			x = rows[i].getElementsByTagName("TD")[thead];
			y = rows[i + 1].getElementsByTagName("TD")[thead];
			// Check if the two rows should switch place:
			if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
				// If so, mark as a switch and break the loop:
				shouldSwitch = true;
				break;
			}
		}
		if (shouldSwitch) {
			/* If a switch has been marked, make the switch
			and mark that a switch has been done: */
			rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
			switching = true;
		}
	}
};

function web_safe_encode(UNWEBSAFE,withsemicolon = false){
	return UNWEBSAFE.replaceAll(" ",'%20').replaceAll("!",'%21').replaceAll('"','%22').replaceAll("#",'%23').replaceAll("$",'%24').replaceAll("&",'%26').replaceAll("'",'%27').replaceAll("(",'%28').replaceAll(")",'%29').replaceAll("*",'%2A').replaceAll("+",'%2B').replaceAll(",",'%2C').replaceAll("-",'%2D').replaceAll(".",'%2E').replaceAll("/",'%2F').replaceAll(":",'%3A').replaceAll(";",'%3B').replaceAll("<",'%3C').replaceAll("=",'%3D').replaceAll(">",'%3E').replaceAll("?",'%3F').replaceAll("@",'%40').replaceAll("[",'%5B').replaceAll("\\",'%5C').replaceAll("]",'%5D').replaceAll("^",'%5E').replaceAll("_",'%5F').replaceAll("`",'%60').replaceAll("{",'%7B').replaceAll("|",'%7C').replaceAll("}",'%7D').replaceAll("~",'%7E');
};


function web_safe_decode(WEBSAFE,withsemicolon = false){
	return WEBSAFE.replaceAll('%20'," ").replaceAll('%21',"!").replaceAll('%22','"').replaceAll('%23',"#").replaceAll('%24',"$").replaceAll('%26',"&").replaceAll('%27',"'").replaceAll('%28',"(").replaceAll('%29',")").replaceAll('%2A',"*").replaceAll('%2B',"+").replaceAll('%2C',",").replaceAll('%2D',"-").replaceAll('%2E',".").replaceAll('%2F',"/").replaceAll('%3A',":").replaceAll('%3B',";").replaceAll('%3C',"<").replaceAll('%3D',"=").replaceAll('%3E',">").replaceAll('%3F',"?").replaceAll('%40',"@").replaceAll('%5B',"[").replaceAll('%5C',"\\").replaceAll('%5D',"]").replaceAll('%5E',"^").replaceAll('%5F',"_").replaceAll('%60',"`").replaceAll('%7B',"{").replaceAll('%7C',"|").replaceAll('%7D',"}").replaceAll('%7E',"~");
};

function arr_is_equal(arr1,arr2){
	if(arr1.join(',')=== arr2.join(',')){return true}
	else{return true};
};

function _int(...args){return parseInt(...args)};
function _float(...args){return parseFloat(...args)};


function date_readable(date__,day=true){
	var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
	var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
	var now =  new Date(date__)
	if(day){
		return (days[now.getDay()] + ' ' + months[now.getMonth()] + ' ' + now.getDate() + ' ' + now.getFullYear());
	}else{
		return (months[now.getMonth()] + ' ' + now.getDate() + ' ' + now.getFullYear());
	}
};

function date_diff(date__,suffix='ago',compl = false){
	var d1 = new Date(); //"now"
	var d2 = new Date(date__.split(",")[1].split(" GMT")[0]);  // some date
	// println("Date Now: "+d1 +"  || Date_comment: "+d2)
	var diff = Math.abs(d1-d2);
	return dhm(diff,suffix,compl);
};
function date_diff_mod2(date__,suffix='ago',compl = false){
	var d1 = new Date(); //"now"
	var d2 = new Date(date__);  // some date
	// println("Date Now: "+d1 +"  || Date_comment: "+d2)
	var diff = Math.abs(d1-d2);
	return dhm(diff,suffix,compl);
};

function dhm(ms,suffix,compl) {
	var days = Math.floor(ms / (24*60*60*1000));
	var daysms = ms % (24*60*60*1000);
	var hours = (Math.floor(daysms / (60*60*1000))+"");
	var hoursms = ms % (60*60*1000);
	var minutes = (Math.floor(hoursms / (60*1000))+"");
	var minutesms = ms  % (60*1000);
	var sec = (Math.floor(minutesms / 1000)+"");
	var str_ago = "";var  days_="";var hrs_="";var mins_ ="";

	if(_int(minutes)!=0){mins_= minutes+" minute "+suffix}
	if(_int(minutes)>1){mins_= minutes+" minutes "+suffix}
	else{mins_="Now"}

	if(_int(hours)!=0){hrs_= hours+" hour "+suffix;mins_=""}
	if(_int(hours)>1){hrs_= hours+" hours "+suffix;mins_=""}

	if(_int(days)!=0){days_= days+" Day "+suffix;hrs_=""}
	if(_int(days)>1){days_= days+" days "+suffix;hrs_=""}
	// else{hrs_=""}
	str_ago = days_ + hrs_ + mins_;
	if(compl){
		// str_ago= days + "day/s, " + hours + "hr/s " + minutes + "min/s " + sec + "sec"
		str_ago= [days, hours, minutes, sec];
	}
	return str_ago;
	// return days + ":" + hours + ":" + minutes + ":" + sec;
};
 
function scroll_to_id(id){
	$ID(id).scrollIntoView({behavior: "smooth", block: "center"});
};

function color_generator(how_many=1){
	var _ = [];
	for (var i = 0; i < how_many; i++) {
		_.push("#"+Math.floor(Math.random()*16777215).toString(16));
	}
	println(_);
	return _
}

function if_stop_typing(input_id, stop_typing_func, typing_func=function(){}, timeoutVal=1000){
	let timer
	const typer = document.getElementById(input_id);

	typer.addEventListener('keypress', handleKeyPress);
	typer.addEventListener('keyup', handleKeyUp);

	function handleKeyUp(e) {
		window.clearTimeout(timer);
		timer = window.setTimeout(() => {
			// status.innerHTML = 'All done typing! Do stuff like save content to DB, send WebSocket message to server, etc.';
			stop_typing_func()
			}, timeoutVal);
	}
	function handleKeyPress(e) {
		window.clearTimeout(timer);
		typing_func()
		// status.innerHTML = 'Typing...';
	}
}


// ============================================================
// ============================================================
// ============================================================
// ============================================================
// ============================================================
// ============================================================


function __money_tag_exec(){
	var _MONEY_TAGS_ = $CLASS('_money_tag');
	for (var i = 0; i < _MONEY_TAGS_.length; i++) {
		var tags___ = Money(parseInt(_MONEY_TAGS_[i].innerText));
		if(tags___ == NaN || tags___ == 'NaN'){console.warn(" * Trying to put a '_money_tag' className in an Element that has no Integer or Not Integer-able string")}
		else{_MONEY_TAGS_[i].innerText = Money(parseInt(_MONEY_TAGS_[i].innerText))}
	}
};

function __websafe_decode(){
	var websafe =  $CLASS("WEBSAFE")
	for (var i = 0; i < websafe.length; i++) {
		try{
			websafe[i].innerHTML = web_safe_decode(websafe[i].innerHTML);
		}catch(e){
			warnprintln(e);
			try{
				websafe[i].value = web_safe_decode(websafe[i].value);
			}catch(e){
				warnprintln(e);
			}
		}
	}
};

function dom_refresh(){
	document.querySelector('body').style.display ="none";
	document.querySelector('body').style.display ="block";
	$print(" * DOM Content Refreshed");
};

function lazy_load_all_img(){
	var ALL_IMG = document.querySelectorAll("img")
	for (var i = 0; i < ALL_IMG.length; i++) {
		ALL_IMG[i].loading = "lazy"
	}
};

// ==========Onload Contents===========================
function onload_funcs_ls(){
	for (var i = 0; i < onload_funcs.length; i++) {
		onload_funcs[i]()
	}
};

function $onload(...func){onload_funcs.push(...func)};

document.addEventListener("DOMContentLoaded", () => {
	$print(" * DOM Content Loaded");
	lazy_load_all_img()
	onload_funcs_ls();
	__money_tag_exec();
	__websafe_decode();
	dom_refresh();
});

// ==============================================================================
const MODAL_DEF =( `<div id="MODAL_BODYBRN" class="x-modal-content x-animate-top x-round-large"><div id="MODAL_BRN_HEADER" class="x-container x-padding x-round-large"><span class="x-large x-hover-red x-display-topright fa fa-close x-text-red x-circle" style="padding:3px 5px 3px 5px" onclick="this.parentNode.parentNode.parentNode.style.display='none';DESTROY_MODAL(this.parentNode.parentNode.parentNode)"></span><div style=""><span><span class="x-xlarge"><b id="modal_title">Title</b><br><p class="x-small" id="modal_subtitle" style="line-height: 100%;">Sub title</p></span></span></div></div><div class="x-container"><span></span><span id="modal_content">Content</span></div><div class="x-container x-padding x-light-grey x-round-large"><span id="FA_FA_" class="x-left x-xxlarge"></span><div id="modal_footer_content" class="x-left x-text-grey x-padding x-display-container">Footer Content</div><div class="x-right x-round-large"><button id="___modal_btn1" style="display:none;" class="___modal_btn x-btn x-round-large x-green">Button1</button><button id="___modal_btn2" style="display:none;" class="___modal_btn x-btn x-round-large x-red">Button2</button><button id="___modal_btn3" style="display:none;" class="___modal_btn x-btn x-round-large x-orange">Button3</button></div></div></div>`);
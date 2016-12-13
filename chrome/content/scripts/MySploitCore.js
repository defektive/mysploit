/**
 * Utility Function
 * pretty sure i lifted thes from some where else
 */

/*
	parseUri 1.2.1
	(c) 2007 Steven Levithan <stevenlevithan.com>
	MIT License
*/

function parseUri (str) {
	var	o   = parseUri.options,
		m   = o.parser[o.strictMode ? "strict" : "loose"].exec(str),
		uri = {},
		i   = 14;

	while (i--) uri[o.key[i]] = m[i] || "";

	uri[o.q.name] = {};
	uri[o.key[12]].replace(o.q.parser, function ($0, $1, $2) {
		if ($1) uri[o.q.name][$1] = $2;
	});

	return uri;
};

parseUri.options = {
	strictMode: true,
	key: ["source","protocol","authority","userInfo","user","password","host","port","relative","path","directory","file","query","anchor"],
	q:   {
		name:   "queryKey",
		parser: /(?:^|&)([^&=]*)=?([^&]*)/g
	},
	parser: {
		strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*):?([^:@]*))?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
		loose:  /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*):?([^:@]*))?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
	}
};


// un escape;
String.prototype.urlEncode = function() {
    var ret = '';
    for (var i=0; i<this.length; i++){
        ret += '%' + this.charCodeAt(i).toString(16);
    }
    return ret;
}

var Base64 = {

    // private property
    _keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

    // public method for encoding
    encode : function (input) {
        var output = "";
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
        var i = 0;

        input = Base64._utf8_encode(input);

        while (i < input.length) {

            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);

            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;

            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }

            output = output +
            this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
            this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);

        }

        return output;
    },

    // public method for decoding
    decode : function (input) {
        var output = "";
        var chr1, chr2, chr3;
        var enc1, enc2, enc3, enc4;
        var i = 0;

        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

        while (i < input.length) {

            enc1 = this._keyStr.indexOf(input.charAt(i++));
            enc2 = this._keyStr.indexOf(input.charAt(i++));
            enc3 = this._keyStr.indexOf(input.charAt(i++));
            enc4 = this._keyStr.indexOf(input.charAt(i++));

            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;

            output = output + String.fromCharCode(chr1);

            if (enc3 != 64) {
                output = output + String.fromCharCode(chr2);
            }
            if (enc4 != 64) {
                output = output + String.fromCharCode(chr3);
            }

        }

        output = Base64._utf8_decode(output);
        return output;
    },

    // private method for UTF-8 encoding
    _utf8_encode : function (string) {
        string = string.replace(/\r\n/g,"\n");
        var utftext = "";

        for (var n = 0; n < string.length; n++) {

            var c = string.charCodeAt(n);

            if (c < 128) {
                utftext += String.fromCharCode(c);
            }
            else if((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            }
            else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }

        }

        return utftext;
    },

    // private method for UTF-8 decoding
    _utf8_decode : function (utftext) {
        var string = "";
        var i = 0;
        var c = c1 = c2 = 0;

        while ( i < utftext.length ) {

            c = utftext.charCodeAt(i);

            if (c < 128) {
                string += String.fromCharCode(c);
                i++;
            }
            else if((c > 191) && (c < 224)) {
                c2 = utftext.charCodeAt(i+1);
                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                i += 2;
            }
            else {
                c2 = utftext.charCodeAt(i+1);
                c3 = utftext.charCodeAt(i+2);
                string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                i += 3;
            }

        }
        return string;
    }
}

/*
Copyright 2006-2007, Open Source Applications Foundation

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

     http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
*/

//Used for getting xpaths for elements in the DOM based on a given node
function getXPath(node, path) {
    path = path || [];

    if(node.parentNode) {
      path = getXPath(node.parentNode, path);
    }

    if(node.previousSibling) {
      var count = 1;
      var sibling = node.previousSibling
      do {
        if(sibling.nodeType == 1 && sibling.nodeName == node.nodeName) {count++;}
        sibling = sibling.previousSibling;
      } while(sibling);
      if(count == 1) {count = null;}
    } else if(node.nextSibling) {
      var sibling = node.nextSibling;
      do {
        if(sibling.nodeType == 1 && sibling.nodeName == node.nodeName) {
          var count = 1;
          sibling = null;
        } else {
          var count = null;
          sibling = sibling.previousSibling;
        }
      } while(sibling);
    }

    if(node.nodeType == 1) {
   //   if ($('absXpaths').checked){
        path.push(node.nodeName.toLowerCase() + (node.id ? "[@id='"+node.id+"']" : count > 0 ? "["+count+"]" : ''));
    //  }
    //  else{
    //    path.push(node.nodeName.toLowerCase() + (node.id ? "" : count > 0 ? "["+count+"]" : ''));
    //  }
    }
    return path;
  };

  function getXSPath(node){
    var xpArray = getXPath(node);
    var stringXpath = xpArray.join('/');
    stringXpath = '/'+stringXpath;
    stringXpath = stringXpath.replace('//','/');
    return stringXpath;
}





/**
 * MySploit Main Module
 * @authorBrad
 */
var MySploit = {
    Actions: {},
    Modules: {},

    initialize: function(Modules){

        this.MySploitDataModule = {};

            include (jslib_system);
            include (jslib_fileutils);
            include (jslib_file);
            include (jslib_dir);

        if(!this.MySploitDataModule.initialized){

            this.set('System',          new System);
            this.set('FileUtils',       new FileUtils);
            var MyDirUtils = this.set('DirUtils',        new DirUtils);
            this.set('StorageSystem',   Components.classes["@mozilla.org/storage/service;1"].getService(Components.interfaces.mozIStorageService));
            this.set('Preferences',     Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch));

            var Sys = this.get('System');
            switch(Sys.os){
                case 'win32':
                    var PluginDir = this.set('PluginDir', MyDirUtils.getMozUserHomeDir() +'\\extensions\\mysploit@mysploit.com\\');
                    this.set('DataDir', PluginDir+'data\\');
                    break;
                case 'linux':
                    var PluginDir = this.set('PluginDir', MyDirUtils.getMozUserHomeDir() +'/extensions/mysploit@mysploit.com/');
                    this.set('DataDir', PluginDir+'data/');
                    break;
            }

            var app = document.getElementById('appcontent');
            if(app) {
                app.addEventListener("DOMContentLoaded", MySploit.PageInit, true);
            }
            this.set('initialized', true);
        }
    },

    set: function (what, value){
        this.MySploitDataModule[what] = value;
        return this.MySploitDataModule[what];
    },

    get: function (what){
        return this.MySploitDataModule[what];
    },

    addModule: function (Name, Obj){
        this.Modules[Name] = Obj;
        if(this.Modules[Name].initialize){
            this.Modules[Name].initialize(this);
        }
        return this.Modules[Name];
    },

    getModule: function (Name){

        return this.Modules[Name];
    },

    runAction: function (evnt){
        action = evnt.target.getAttribute('action');
        action = action.split('::');
        switch(action.shift()){
            case 'openTab':
                var mainWindow = window.QueryInterface(Components.interfaces.nsIInterfaceRequestor)
                   .getInterface(Components.interfaces.nsIWebNavigation)
                   .QueryInterface(Components.interfaces.nsIDocShellTreeItem)
                   .rootTreeItem
                   .QueryInterface(Components.interfaces.nsIInterfaceRequestor)
                   .getInterface(Components.interfaces.nsIDOMWindow);

                mainWindow.getBrowser().selectedTab = mainWindow.getBrowser().addTab(action.shift());
                break;

            case 'load':
                var mainWindow = window.QueryInterface(Components.interfaces.nsIInterfaceRequestor)
                   .getInterface(Components.interfaces.nsIWebNavigation)
                   .QueryInterface(Components.interfaces.nsIDocShellTreeItem)
                   .rootTreeItem
                   .QueryInterface(Components.interfaces.nsIInterfaceRequestor)
                   .getInterface(Components.interfaces.nsIDOMWindow);

                mainWindow.getBrowser().selectedTab = mainWindow.getBrowser().addTab(MySploit.getPref(action.shift()));
                break;

            case 'dialog':
                window.openDialog(action.shift(), "pop", "")
                break


            case 'launch': // launch external app
                alert(action.length)
                break;
//          case 'open': // open chrome window
//              MySploit.openChrome(action.shift(), action);
//              break;


            case 'mysploit': // internal hacks
                var MSAction = action.shift();
                if(MySploit.Actions[MSAction]){
                    MySploit.Actions[MSAction]()
                }
                break;
        }
    },

    openChrome: function(chrome, args){
        window.open("chrome://mysploit/content/xul/"+ chrome + ".xul", chrome, args.join());
    },

    getDB: function (){
        return this.DB;
    },

    PageInit: function (e){
        for (mod in MySploit.Modules){
            if(MySploit.Modules[mod].PageInit){
                MySploit.Modules[mod].PageInit(e);
            }
        }
    },



    getPref: function (pref, type){
        if(type){
            switch(type){
                case 'bool':
                    return this.get('Preferences').getBoolPref("MySploit."+pref);
                    break;
            }
        } else {
            return this.get('Preferences').getCharPref("MySploit."+pref);
        }
        return false;
    },

    setPref: function (pref, type, value){
        if(type !== null){
            switch(type){
                case 'bool':
                    return this.get('Preferences').setBoolPref("MySploit."+pref, value);
                    break;
            }
        } else {
            return this.get('Preferences').setCharPref("MySploit."+pref, value);
        }
        return false;
    }
}

MySploitDatabase = function(database){
    this.Connection = MySploit.get('StorageSystem').openDatabase(database);
}

MySploitDatabase.prototype = {
    execute: function (sql){
        try {
            var stmt = this.Connection.createStatement(sql);
            return new this.resultObject(stmt);
        } catch(e){
            alert('Failed to execute: '+sql+ ' : ' +this.Connection.lastErrorString);
        }
        return false;
    },

    tableExists: function (tbl){
        return this.Connection.tableExists(tbl);
    },

    close: function(){
        this.Connection.close();
    },

    resultObject: function(statement){
        this.statement = statement
        this.currentParameter = 0;
        this.EOF = false;
        this.data = {};
        this.rows = [];

        this.moveNext = function(){
            return this.statement.executeStep();
        }

        this.getData = function(){
            this.data = {};
            for (var i=0; i < this.statement.numEntries; i++){
                this.data[this.statement.getColumnName(i)] = this.statement.getString(i);
            }
            var i = this.rows.push(this.data);
            return this.data;
        }

        this.recordCount=function (){
            return this.statement;
        }
    }
}

window.addEventListener('load', function (){
    MySploit.initialize();


    var MySploitDBFile = new Dir(MySploit.get('DataDir'));
    MySploitDBFile.append("mysploit.sqlite");
    MySploit.DB = new MySploitDatabase(MySploitDBFile);

    var MySploitUserDBFile = new Dir(MySploit.get('DirUtils').getMozUserHomeDir());
    MySploitUserDBFile.append("mysploit.userdata.sqlite");
    MySploit.UserDB = new MySploitDatabase(MySploitUserDBFile);
    if(MySploit.UserDB.tableExists('payloads') === false){
        MySploit.UserDB.Connection.executeSimpleSQL(String.fromCharCode(67,82,69,65,84,69,32,84,65,66,76,69,32,34,112,97,121,108,111,97,100,115,34,32,40,34,108,97,98,101,108,34,32,118,97,114,99,104,97,114,32,78,79,84,32,78,85,76,76,32,32,68,69,70,65,85,76,84,32,39,39,32,44,34,99,111,100,101,34,32,84,69,88,84,32,78,79,84,32,78,85,76,76,32,32,68,69,70,65,85,76,84,32,39,39,32,44,34,100,101,102,97,117,108,116,34,32,73,78,84,69,71,69,82,32,78,79,84,32,78,85,76,76,32,32,68,69,70,65,85,76,84,32,39,39,32,41,59,10,73,78,83,69,82,84,32,73,78,84,79,32,34,112,97,121,108,111,97,100,115,34,32,86,65,76,85,69,83,40,39,67,111,109,109,111,110,39,44,39,39,39,34,62,60,115,99,114,105,112,116,62,97,108,101,114,116,40,49,41,60,47,115,99,114,105,112,116,62,39,44,49,41,59,10,73,78,83,69,82,84,32,73,78,84,79,32,34,112,97,121,108,111,97,100,115,34,32,86,65,76,85,69,83,40,39,77,105,110,101,39,44,39,97,108,101,114,116,40,39,39,88,83,83,32,98,121,32,66,72,79,39,39,41,59,39,44,48,41,59));
    }
}, false);

//  addMenu: "INSERT INTO `menu` (`label`,`action`,`description`,`sort`,`active`) VALUES ('{label}','{console}','{desc}','{sort}','{active}')",
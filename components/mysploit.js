Components.utils.import("resource://gre/modules/XPCOMUtils.jsm");
/**
 * MySploit Component
 * @author bho
 * http://mysploit.com/
 */
function MySploit() {
    this.wrappedJSObject = this
}

MySploit.prototype = {
    classDescription: "MySploit XPCOM Component",
    classID:          Components.ID("{ED764E96-9A0B-11DD-BE01-E59F55D89593}"),
    contractID:       "@mysploit.com/mysploit;1",
    QueryInterface: XPCOMUtils.generateQI(),

    Modules: {},
    DB: false,
    snippets: null,

    getSnippets: function (){
        this.snippets = [];

        var sql = "SELECT * FROM user_snippets us LEFT JOIN snippet_types st ON us type=st.rowid WHERE 1";
        var res = MySploit.DB.execute(sql);

        while(res.moveNext()){
            var data = res.getData();
            alert(data.name)

            var tmp =  document.createElement('menuitem');
            tmp.setAttribute('label', data.label);
            tmp.setAttribute('tooltiptext', data.description);
            tmp.setAttribute('action', data.action);
            tmp.addEventListener('command', MySploit.runAction, true);
            this.snippets.push(tmp);
        }
    },

    runAction: function (evnt){
        action = evnt.target.getAttribute('action');
        action = action.split('::');
        switch(action.shift()){


          case 'openTab':
             gBrowser.selectedTab = gBrowser.addTab(action.shift());
             break;

          case 'load':
             gBrowser.selectedTab = gBrowser.addTab(helm.getPref(action.shift()));
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
              switch(action.shift()){
                  case 'reloadMenu':
                      MySploit.Modules.ContextMenu.buildPopupMenu();
                      break;
                  case 'reloadSiteProfile':
                      MySploit.Modules.SiteProfiler.xPathInit();
                      break;
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

    init: function(){
        alert('load');
        this.system    = new System;
        this.fileUtils = new FileUtils();
        this.dirUtils  = new DirUtils();
        this.storageSystem = Components.classes["@mozilla.org/storage/service;1"].getService(Components.interfaces.mozIStorageService);

        this.prefs = Components.classes["@mozilla.org/preferences-service;1"]
                        .getService(Components.interfaces.nsIPrefBranch);
        switch(this.system.os){
            case 'win32':
                this.pluginDir = this.dirUtils.getMozUserHomeDir() +'\\extensions\\mysploit@mysploit.com\\';
                this.dataDir   = this.pluginDir+'data\\';
                break;
            case 'linux':
                this.pluginDir =  this.dirUtils.getMozUserHomeDir() +'/extensions/mysploit@mysploit.com/';
                this.dataDir =  this.pluginDir+ 'data/';
                break;
        }

        this.DB = new msDatabase('mysploit');
        for (mod in this.Modules){
            if(this.Modules[mod].init){
                this.Modules[mod].init();
            }
        }


        var app = document.getElementById('appcontent');
        if(app) {
            app.addEventListener("DOMContentLoaded", MySploit.PageInit, true);
        }
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
                    return this.prefs.getBoolPref("mysploit."+pref);
                    break;
            }
        } else {
            return this.prefs.getCharPref("mysploit."+pref);
        }
        return false;
    },

    setPref: function (pref, type, value){
        if(type !== null){
            switch(type){
                case 'bool':
                    return this.prefs.setBoolPref("mysploit."+pref, value);
                    break;
            }
        } else {
            return this.prefs.setCharPref("mysploit."+pref, value);
        }
        return false;
    }
};

var components = [MySploit];
function NSGetModule(compMgr, fileSpec) {
    return XPCOMUtils.generateModule(components);
}

var XSS = {
    toFromCharCodeString: function (string){
        var finalString = '';
        for(i=0; i<string.length; i++) {
            finalString += finalString.length > 0 ? ','+string.charCodeAt(i):string.charCodeAt(i);
        }
        return 'String.fromCharCode(' + finalString +')';
    },


    fromFromCharCodeString: function (string){
        string = string.replace(/[^0-9\,]/g, '');
        return eval('String.fromCharCode('+ string + ')');
    }
}

XSSHelper = {
    Elements: {
        Code: null,
        PayloadList: null,
        gBrowser: null,
        Fields: null,
        Forms: [],
        Inputs: [],
        Tab: null
    },
    Subscribers: [],
    DefaultSet: false,
    CodeTO: false,
    Options: [
        {
            Label: 'URL Encode',
            Command: function (e){
                XSSHelper.setCode(XSSHelper.getCode().urlEncode());
            }
        },
        {
            Label: 'URL Decode',
            Command: function (e){
                XSSHelper.setCode(unescape(XSSHelper.getCode()));
            }
        },
        {
            Label: 'To CharCode',
            Command: function (e){
                XSSHelper.setCode(XSS.toFromCharCodeString(XSSHelper.getCode()));
            }
        },
        {
            Label: 'From CharCode',
            Command: function (e){
                XSSHelper.setCode(XSS.fromFromCharCodeString(XSSHelper.getCode()));
            }
        },
        {
            Label: 'Base64 Encode',
            Command: function (e){
                XSSHelper.setCode(Base64.encode(XSSHelper.getCode()));
            }
        },
        {
            Label: 'Base64 Decode',
            Command: function (e){
                XSSHelper.setCode(Base64.decode(XSSHelper.getCode()));
            }
        },
        {
            Label: 'Eval',
            Command: function (e){
                var code = XSSHelper.getCode();
                with (XSSHelper.Elements.gBrowser.selectedBrowser.contentWindow) {
                    try {
                        eval(code);
                    } catch(e){
                        alert(e);
                    }
                }

            }
        },
        //{
        //    Label: 'Move Up',
        //    Command: function (e){
        //        XSSHelper.Elements.Code.value = XSSHelper.Elements.Code.value;
        //    }
        //},
        //{
        //    Label: 'Clear',
        //    Command: function (e){
        //        XSSHelper.Elements.Code.value = XSSHelper.Elements.Code.value = ''
        //    }
        //}
    ],

    init: function(){
        var wm = Components.classes["@mozilla.org/appshell/window-mediator;1"]
                           .getService(Components.interfaces.nsIWindowMediator);
        var mainWindow = wm.getMostRecentWindow("navigator:browser");


        var tmp = document.getElementById('xss-code-cont');
        var tb = tmp.getElementsByTagName('textbox');
        this.Elements.Code           = tb[1];
        this.Elements.PayloadList    = document.getElementById('xss-payloads');
        this.Elements.FieldTabs      = document.getElementById('XSS-Tabs');
        this.Elements.FieldTabPanels = document.getElementById('XSS-TabPanels');
        this.Elements.gBrowser       = mainWindow.getBrowser();

        this.Elements.Code.addEventListener('keyup', XSSHelper.updateCodeSubscribers, true);

        var XSSOptions = document.getElementById('MySploit-XSSOptions');

        for(var i=0; i< this.Options.length; i++){
            var opt = this.Options[i];
            var ele = document.createElement('button');
            ele.setAttribute('label', opt.Label);
            XSSOptions.appendChild(ele)
            ele.addEventListener('command', opt.Command, true);
        }

        this.Elements.PayloadList.addEventListener('select', function (e){
            var tree = e.target;
            XSSHelper.Elements.Code.value = tree.view.getCellText(tree.currentIndex, tree.columns.getColumnAt(1))
        }, true)

        this.getInputsForCurrentTab();
    },

    getCode: function (){
        var selectionStart = XSSHelper.Elements.Code.selectionStart;
        var selectionEnd   = XSSHelper.Elements.Code.selectionEnd;

        if(selectionStart != selectionEnd){
            var selection = XSSHelper.Elements.Code.value.substring(selectionStart, selectionEnd);
            return selection;
        }
        return XSSHelper.Elements.Code.value;
    },

    setCode: function (code){
        var selectionStart = XSSHelper.Elements.Code.selectionStart;
        var selectionEnd   = XSSHelper.Elements.Code.selectionEnd;

        if(selectionStart != selectionEnd){
            var preSelection = XSSHelper.Elements.Code.value.substring(0, selectionStart);
            var postSelection = XSSHelper.Elements.Code.value.substring(selectionEnd, XSSHelper.Elements.Code.value.length);
            XSSHelper.Elements.Code.value = preSelection + code + postSelection;
            return;
        }

        XSSHelper.Elements.Code.value = code;
    },
    getFormInputQS: function (node){
        var cbs = node.getElementsByTagName('checkbox');

        var qs = '';
        for(var i=0; i<cbs.length; i++){
            var cb = cbs[i];
            qs = qs + ((qs != '') ?'&':'');
            if(cb.checked){
                qs = qs + cb.getAttribute('name') +'='+ XSSHelper.Elements.Code.value;
            } else {
                qs = qs + cb.getAttribute('name') +'='+ cb.getAttribute('orgvalue');
            }
        }
        return qs;
    },

    getInputsForCurrentTab: function (){
        var tmpDoc = this.Elements.gBrowser.selectedBrowser.contentDocument;
        var tmpWin = this.Elements.gBrowser.selectedBrowser.contentWindow;

        while(this.Elements.FieldTabs.hasChildNodes()) this.Elements.FieldTabs.removeChild(this.Elements.Fields.lastChild);
        while(this.Elements.FieldTabPanels.hasChildNodes()) this.Elements.FieldTabPanels.removeChild(this.Elements.Fields.lastChild);


        var formXpath = "//form";
        var formXpathResult = tmpDoc.evaluate(formXpath,tmpDoc,null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,null);;


        for(var i=0; i<formXpathResult.snapshotLength; i++){
            var form = formXpathResult.snapshotItem(i);
            //this.Elements.Forms.push(form);

            var tab = document.createElement('tab');
            tab.setAttribute('label', (form.name || form.id || 'Form')+'['+i+']');

            var tabpanel = document.createElement('tabpanel');

            this.Elements.FieldTabs.appendChild(tab)
            this.Elements.FieldTabPanels.appendChild(tabpanel);

            if(i == 0){
                this.Elements.FieldTabs.parentNode.selectedTab = tab
            }

            //input form
            var vbox = document.createElement('vbox');
            var hbox = document.createElement('hbox');
            var post = document.createElement('button');
            var get  = document.createElement('button');

            vbox.setAttribute('id', 'xss-vbox-'+i);

            post.setAttribute('label', 'POST');
            post.setAttribute('action', form.action);
            post.setAttribute('target', 'iframe-'+i);
            post.setAttribute('vbox', 'xss-vbox-'+i);
            get.setAttribute('label', 'GET');
            get.setAttribute('action', form.action);
            get.setAttribute('target', 'iframe-'+i);
            get.setAttribute('vbox', 'xss-vbox-'+i);

            post.addEventListener('command', function(e){
                var action = e.target.getAttribute('action');
                var targetID = e.target.getAttribute('target');
                var target = document.getElementById(targetID);
                var qs = XSSHelper.getFormInputQS(e.target.parentNode.parentNode);

                var stringStream = Components.classes["@mozilla.org/io/string-input-stream;1"].
                                   createInstance(Components.interfaces.nsIStringInputStream);
                stringStream.data = qs;
                var postData = Components.classes["@mozilla.org/network/mime-input-stream;1"].
                               createInstance(Components.interfaces.nsIMIMEInputStream);
                postData.addHeader("Content-Type", "application/x-www-form-urlencoded");
                postData.addContentLength = true;
                postData.setData(stringStream);

                if(!XSSHelper.Elements.Tab){
                    XSSHelper.Elements.Tab = XSSHelper.Elements.gBrowser.addTab('about:blank');
                }
                XSSHelper.Elements.gBrowser.selectedTab = XSSHelper.Elements.Tab;
                XSSHelper.Elements.gBrowser.getBrowserForTab(XSSHelper.Elements.Tab).loadURIWithFlags(action, null,  null, null, postData)


            }, true);


            get.addEventListener('command', function(e){
                var action = e.target.getAttribute('action');
                var targetID = e.target.getAttribute('target');
                var target = document.getElementById(targetID);
                var qs = XSSHelper.getFormInputQS(e.target.parentNode.parentNode);

                if(!XSSHelper.Elements.Tab){
                    XSSHelper.Elements.Tab = XSSHelper.Elements.gBrowser.addTab('about:blank');
                }
                XSSHelper.Elements.gBrowser.selectedTab = XSSHelper.Elements.Tab;
                XSSHelper.Elements.gBrowser.getBrowserForTab(XSSHelper.Elements.Tab).loadURI(action+'?'+qs)
            }, true);

            hbox.appendChild(post);
            hbox.appendChild(get);
            vbox.appendChild(hbox);

            tabpanel.appendChild(vbox);

            for(var e=0; e<form.elements.length; e++){

                var inp = form.elements[e];

                var tmphbox = document.createElement('hbox');
                var tmpinpt = document.createElement('checkbox');

                tmpinpt.setAttribute('label', inp.nodeName +':'+inp.type+':'+inp.name+' = '+ inp.value)
                tmpinpt.setAttribute('name', inp.name)
                tmpinpt.setAttribute('orgvalue', inp.value)
                tmphbox.appendChild(tmpinpt)
                vbox.appendChild(tmphbox)
            }

        }
    },

    updateCodeSubscribers: function (){
        if(XSSHelper.CodeTO){
            clearTimeout(XSSHelper.CodeTO);
        }

        XSSHelper.CodeTO = setTimeout('XSSHelper._updateCodeSubscribers()', 600);
    },
    _updateCodeSubscribers: function (){
        for(var i in XSSHelper.Subscribers){
            var cb = XSSHelper.Subscribers[i];

            var formID = cb.getAttribute('formElement');
            var inpID  = cb.getAttribute('inputElement');
            var inp    = XSSHelper.Elements.Forms[formID].xPathResult.snapshotItem(inpID);

             switch(inp.nodeName){
                case 'TEXTAREA':
                    inp.innerHTML = XSSHelper.Elements.Code.value;
                    break;
                case 'SELECT':
                    inp.options[XSSHelper.Elements.FieldInp[v].selectedIndex].value = XSSHelper.Elements.Code.value;
                    break;
                case 'INPUT':
                    inp.value = XSSHelper.Elements.Code.value;
                    break;
            }
        }
    }
}
window.addEventListener('load', function(){

    XSSHelper.init();
},true)
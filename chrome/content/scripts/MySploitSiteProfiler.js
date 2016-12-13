/**
 * MySploit Site Profiler
 * @author defektive
 */
MySploitSiteProfiler =  {
    String: null,
    ToolTip: null,
    xPath: null,
    xPathResult: null,

    StatusElement: null,

    Data: [],
    Checks: {},

    Matches: {},

    initialize: function(Parent){

        var mainWindow = window.QueryInterface(Components.interfaces.nsIInterfaceRequestor)
                   .getInterface(Components.interfaces.nsIWebNavigation)
                   .QueryInterface(Components.interfaces.nsIDocShellTreeItem)
                   .rootTreeItem
                   .QueryInterface(Components.interfaces.nsIInterfaceRequestor)
                   .getInterface(Components.interfaces.nsIDOMWindow);
        if(mainWindow.getBrowser){

            this.StatusElement = document.getElementById('ms-status');
            mainWindow.getBrowser().tabContainer.addEventListener("TabSelect", this.OnTabSelect, true);
            this.xPathInit();
            Parent.Actions.refreshSiteProfiles = function (){
                MySploitSiteProfiler.xPathInit();
            }
        }
    },

    xPathInit: function (){

        var sql = "SELECT * FROM site_profiles";
        var res = MySploit.DB.execute(sql);
        this.xPath = ''
        while(res.moveNext()){
            var data = res.getData();
            this.xPath += this.xPath.length > 0 ? ' | ' : '';
            this.xPath += data.xpath;
            this.Checks[data.contains] = data.name;
        }
    },

    OnTabSelect: function (e){
        if(!content.document.SiteProfile){
            MySploitSiteProfiler.ProfileDoc(content.document);
        }

        MySploitSiteProfiler.StatusElement.setAttribute('value', content.document.SiteProfile.value);
        MySploitSiteProfiler.StatusElement.setAttribute('tooltiptext', content.document.SiteProfile.tooltiptext);
    },

    PageInit: function (e){
        MySploitSiteProfiler.ProfileDoc(e.target);
    },

    ProfileDoc: function (doc){

        Matches = {};
        Data = {}
        var xPathResult = doc.evaluate(this.xPath, doc, null, XPathResult.ANY_TYPE,null);

        try {
            var element = xPathResult.iterateNext();


            while (element) {
                for(c in this.Checks){
                    if(element.nodeValue.indexOf(c) > -1){
                        if(!Matches[this.Checks[c]]){
                            Matches[this.Checks[c]] = 0;
                        }
                        this.Matches[this.Checks[c]]++;
                    }
                }

                element = xPathResult.iterateNext();
            }


            var string = '';
            var tooltip = '';
            for(match in Matches){
                string += match +' ';
                tooltip += match +': '+ Matches[match]+"\n";
            }
            if(string.length == 0){
                string = "MySploit"

            }

        } catch (e) {
            dump( 'Error: Document tree modified during iteration ' + e );
        }

        doc.SiteProfile = {
            value: string,
            tooltiptext: tooltip
        }


        if(content.document === doc){
            this.StatusElement.setAttribute('value', content.document.SiteProfile.value);
            this.StatusElement.setAttribute('tooltiptext', content.document.SiteProfile.tooltiptext);
        }

    }
}


window.addEventListener('load', function (){
    MySploit.addModule('MySploitSiteProfiler', MySploitSiteProfiler);
}, false);

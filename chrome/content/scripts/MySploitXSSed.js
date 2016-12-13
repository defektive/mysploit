/**
 * MySploit XSSed Submission Module
 */
MySploitXSSed= {

    initialize: function (Parent){
        Parent.Actions.XSSed = function (){
            MySploitXSSed.submit();
        }
    },

    submit: function () {
        var pageVars = {
            Author: MySploit.getPref('xssed.alias'),
            URL: gBrowser.selectedBrowser.contentWindow.location,
            POST: null
        }

        var history = gBrowser.selectedBrowser.webNavigation.sessionHistory;
        var postdata = history.getEntryAtIndex(history.index,false).QueryInterface(Ci.nsISHEntry).postData;
        if(postdata) {
            postdata.QueryInterface(Ci.nsISeekableStream).seek(Ci.nsISeekableStream.NS_SEEK_SET, 0);
            var stream = Cc["@mozilla.org/binaryinputstream;1"].createInstance(Ci.nsIBinaryInputStream);
            stream.setInputStream(postdata);
            var postBytes = stream.readByteArray(stream.available());
            var poststr = String.fromCharCode.apply(null, postBytes);
            //Do anything to your poststr
            pageVars.POST = poststr.split("\r\n\r\n")[1];
        }
        var newTab = gBrowser.addTab(MySploit.getPref('xssed.url'));
        gBrowser.selectedTab = newTab;

        var newTabBrowser = gBrowser.getBrowserForTab(newTab);
        newTabBrowser.addEventListener("load", function() {

            newTabBrowser.contentDocument.getElementsByName('author')[0].value   = pageVars.Author;
            newTabBrowser.contentDocument.getElementsByName('url')[0].value      = pageVars.URL;
            newTabBrowser.contentDocument.getElementsByName('postdata')[0].value = pageVars.POST;
            newTabBrowser.contentDocument.getElementsByName('code')[0].focus();


        }, true);


    }


}


window.addEventListener('load', function (){
    MySploit.addModule('MySploitXSSed', MySploitXSSed);
}, false);

/**
 * MySploit Context Menu
 */
MySploitContextMenu = {

    items: false,

    initialize: function (Parent){
        //var xPathRes = document.evaluate("//menupopup[@name='MySploitMenu']", document, null, XPathResult.ANY_TYPE,null);

        var d = [
            document.getElementById('mysploit-toolsmenu-popup'),
            document.getElementById('mysploit-context-popup')
        ]

        for(var i=0; i<d.length; i++){
            d[i].addEventListener('popupshowing', this.onPopupShowing, true)
            d[i].addEventListener('popuphiding', this.onPopupHiding, true)
        }

        this.buildPopupMenu();

        Parent.Actions.refreshContextMenu = function (){
            MySploitContextMenu.buildPopupMenu();
        }
    },

    onPopupShowing: function (event){
        obj = event.target;
        var items = MySploit.getModule('MySploitContextMenu').getItems();

        while(obj.hasChildNodes()) {
            obj.removeChild(obj.lastChild);
        }

        for(var i=0; i<items.length; i++){
            obj.appendChild(items[i]);
        }
    },

    onPopupHiding: function (){
    },

    getItems: function (){
        if(this.items === false){
            this.buildPopupMenu();
        }

        return this.items;
    },

    buildPopupMenu: function (){
        this.items = Array();

        var sql = "SELECT * FROM menu WHERE active=1 ORDER BY sort";
        var res = MySploit.DB.execute(sql);

        while(res.moveNext()){
            var data = res.getData();
            var tmp =  document.createElement('menuitem');
            tmp.setAttribute('label', data.label);
            tmp.setAttribute('tooltiptext', data.description);
            tmp.setAttribute('action', data.action);
            tmp.addEventListener('command', MySploit.runAction, true);
            this.items.push(tmp);
        }
    }
}


window.addEventListener('load', function (){
    MySploit.addModule('MySploitContextMenu', MySploitContextMenu);
}, false);

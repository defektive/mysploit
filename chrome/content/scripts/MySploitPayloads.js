/**
 * MySploit Payloads
 * @author defektive
 */
MySploitPayloads = {
    Payloads: null,

    getPayloads: function (){
        if(!this.Payloads){
            this.buildPayloadList();
        }
        return this.Payloads;
    },

    getDefaultPayload: function (){
        var sql = "SELECT * FROM payloads WHERE default='1'";
        var res = MySploit.DB.execute(sql);
        return res.getData();
    },

    buildPayloadList: function (){

        this.Payloads = [];
        var sql = "SELECT * FROM payloads";

        var res = MySploit.DB.execute(sql);

        while(res.moveNext()){
            this.Payloads.push(res.getData());
        }
    }
}


window.addEventListener('load', function (){
    MySploit.addModule('MySploitPayloads', MySploitPayloads);
}, false);

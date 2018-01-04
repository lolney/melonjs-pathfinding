(function ($) {
    var pathFindingInstance = function() {};

    pathFindingInstance.prototype.init = function(width, height, type, length, loc) {
        type = type || "JumpPointFinder";
        length = length || 1;
        loc = loc || "lib/plugins/pathFinding/";

        this.name = "me.pathFinding";

        this.worker = new Worker(loc + "jobWorker.js");

        this.postMessage({  name: "init", 
                            data:{
                                type: type, width: width, height: height, length: length
                            }
                        });
    };

    pathFindingInstance.prototype.addListener = function(listener) {
            this.worker.addEventListener('message', listener, false);
    };



    pathFindingInstance.prototype.postMessage = function(object){
            this.worker.postMessage(object);
    };

    pathFindingPlugin = me.plugin.Base.extend(
    {

        init : function (width, height, type, length, loc) {
            this._super(me.plugin.Base, "init");
            this.GUID = "pathFinding-"+me.utils.createGUID();
            this.name = "me.pathFinding";
            this.isPersistent = true;

            me.event.subscribe(me.event.LEVEL_LOADED, function(){
                if (me.pathFinding != null) {
                    // alternatively, just update the nodes?
                    me.pathFinding = null;
                }
                me.pathFinding = new pathFindingInstance();
                me.pathFinding.init(width, height, type, length, loc);
            });
        },
    });
})(window);
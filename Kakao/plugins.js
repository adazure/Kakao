var Plugins = (function Plugins() {

    Plugins.constructor = {}

    Plugins.constructor.run = [];
    Plugins.constructor.onload = [];

    Plugins.add = function add(obj) {

        if (obj.constructor.run) {
            Plugins.constructor.run.push(obj.constructor.run);
        }


        if (obj.constructor.onload)
            Plugins.constructor.onload.push(obj.constructor.onload);
    }

    return Plugins;

})()
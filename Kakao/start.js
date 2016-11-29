/**
 * Pluginleri çalıştıralım
 */

for (var n = 0, len = Plugins.constructor.run.length; n < len; n++) {
    Plugins.constructor.run[n]();
}


for (var n = 0, len = Plugins.constructor.onload.length; n < len; n++) {
    Listener.add(window, 'load', Plugins.constructor.onload[n]);
}


})()
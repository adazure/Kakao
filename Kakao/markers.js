/*
 * İşaretleyiciler
 * Hangi nesneler üzerinde işlem yapılacağına dair fikir verir
 * Nesne üzerinde eklendiğinde tek başına herhangi bir etkileşimleri bulunmamaktadır
 */

var Markers = (function Markers() { return Markers })()


Markers.Names = {
    'all': [],
    'this': [],
    'in': [],
    'any': false
}


Markers.constructor = {}

Markers.constructor.run = function run() {

    for (var i in Screens.Values) {

        for (var n = 1; n <= Screens.Piece; n++) {
            //This
            Markers.Names['this'].push(i + n);
            //In
            Markers.Names['in'].push(i + '-' + n);
        }
    }

    //Defaults
    Markers.Names.this.push('this');
    Markers.Names.this = Markers.Names.this.concat(Selectors.getOnlySelectors());

    Markers.Names.in.push('in');
    Markers.Names.in = Markers.Names.in.concat(Selectors.getOnlySelectors());

    Markers.Names.all = Markers.Names.all.concat(Markers.Names.this, Markers.Names.in);

}


Plugins.add(Markers);
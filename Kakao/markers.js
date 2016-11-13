/*
 * İşaretleyiciler
 * Hangi nesneler üzerinde işlem yapılacağına dair fikir verir
 * Nesne üzerinde eklendiğinde tek başına herhangi bir etkileşimleri bulunmamaktadır
 */

Kakao.markers = {

    names: {
        'all': [],
        'this': [],
        'in': [],
        'any': false
    },



    'constructor': {

        run: function() {

            for (var i in screens) {

                for (var n = 1; n <= piece; n++) {
                    //This
                    markers.names['this'].push(i + n);
                    //In
                    markers.names['in'].push(i + '-' + n);
                }
            }

            //Defaults
            markers.names.this.push('this');
            markers.names.this = markers.names.this.concat(getOnlySelectors());

            markers.names.in.push('in');
            markers.names.in = markers.names.in.concat(getOnlySelectors());

            markers.names.all = markers.names.all.concat(markers.names.this, markers.names.in);

        }
    }

}
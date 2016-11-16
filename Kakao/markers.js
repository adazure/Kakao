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

            for (var i in Kakao.screens) {

                for (var n = 1; n <= Kakao.piece; n++) {
                    //This
                    Kakao.markers.names['this'].push(i + n);
                    //In
                    Kakao.markers.names['in'].push(i + '-' + n);
                }
            }

            //Defaults
            Kakao.markers.names.this.push('this');
            Kakao.markers.names.this = Kakao.markers.names.this.concat(Kakao.getOnlySelectors());

            Kakao.markers.names.in.push('in');
            Kakao.markers.names.in = Kakao.markers.names.in.concat(Kakao.getOnlySelectors());

            Kakao.markers.names.all = Kakao.markers.names.all.concat(Kakao.markers.names.this, Kakao.markers.names.in);

        }
    }

}
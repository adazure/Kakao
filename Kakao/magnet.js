Kakao.magnets = {

    'formatR': regx('(' + objects.keys(screens).join('|') + ')\-(\\d{1,2})'),



    /**
     * Sayfa boyutlanırken ya da sayfa yüklendiğinde otomatik olarak ilgili nesneleri dizecek nesnemiz
     */
    'custommagnet': function custommagnet(obj, screenSize) {

        //data-magnet özelliğine sahip nesnemiz
        var n = obj;

        n.magnetSetting = {

            //İşlem yapılan nesnenin bir magnet nesnesi olduğunu ve bir işlem yapıldığını belli eder
            status: true,

            //data-magnet nesnesinin sayfa yüklendiği anda kaç parçaya ayrıldığı bilgisini tutar
            //Böylece sayfa her resize olduğunda buradaki değer ile parçalanması gereken değer aynıysa işlem yapılmayacak
            piece: 0,
        }

        //Nesneye ait alt çocuklar
        var children = [];
        var length = obj.children.length;
        for (var q = 0; q < length; q++) {
            children.push(obj.children[0].cloneNode(true));
            obj.children[0].remove();
        }
        //Maksimum parca sayısı ör : 4
        var max = magnets.getMaxValues(screenSize, 'piece');

        magnets.triggerResize(children, obj, screenSize, max);

        window._listen('resize', function() {
            magnets.triggerResize(children, obj, screenSize, max);
        });

        window._listen('DOMNodeInserted', function(a) { magnets.addNewMagnet(children, a); })

    },


    //Ekran boyutuna göre alanın uygulanacak parça değerini verir
    findScreenPiece: function(n) {

        var s = 0;
        for (var k in n)
            if (window.innerWidth < n[k][0]) s = n[k][1];

        return s;

    },


    /**
     * data-magnet nesnesinin children nesnelerinden hangisinin yüksekliğinin en kısa olduğunu bize verir
     * Amacımız yüksekliği en kısa nesneye yeni nesneleri eklemek.
     */
    findLowestObject: function(o) {

        /**
         * Dönüş tipi olarak gelen çocuk nesnelerinden ilk nesneyi seçiyoruz
         * Ve ilk nesnenin yükseklik değerini referans alıyoruz
         * eğer ilk nesne yüksekliği 0 ile zaten başka küçük değer olmayacağından
         * ilk nesneyi geri döndürüyoruz.
         * 
         * Eğer 0 dan büyükse, tüm dilimlerin yüksekliklerini kontrol edip en küçük olanı alıyoruz
         */
        var e = o[0];
        var result = o[0].offsetHeight;
        if (result <= 0) return e

        for (var i in o) {
            if (o[i].offsetHeight < result) {
                result = o.offsetHeight;
                e = o[i];
            }
        }

        //@return
        return e;
    },

    /**
     * Belirttimiz ana nesne içindeki çocuk nesneleri siler
     */
    removeChildren: function(o) {
        if (!o) return;
        while (o.children.length > 0) {
            o.children[0].remove();
        }
    },


    /**
     * Sayfa üzerinde oluşturulan tüm nesneleri kontrol eder
     * Eğer içeriğinde bizim şartlarımızı sağlayan özellikler varsa işlemi yapar.
     * Örneğin sayfa üzerinde oluşturulmuş herhangi bir nesnenin parent nesnesi bir data-magnet mi
     * ve oluşturulan yeni nesne üzerinde daha önce magnet işlemi yapıldımı kontrol ediliyor
     * ve oluşturulan nesne magnet-item sınıf adına sahip değilse işleme alınıyor
     */
    addNewMagnet: function(childrenList, item) {

        //Eklenmiş olan nesnenin parent nesnesinde magnet var mı
        var parent = item.target.parentNode;

        var mgSet = parent.magnetSetting;

        //Varsa işlemi yap
        if (mgSet && mgSet.status === true && !item.target.isMagnetAvaible && !item.target.classList.contains('magnet-item')) {


            try {

                var length = parent.children.length - 1;

                //Yeni nesneyi klonla
                var cln = item.target.cloneNode(true);

                cln.isMagnetAvaible = true;

                //Orjinali sil
                item.target.remove();

                //Hafızaya ekle
                childrenList.push(cln);

                //Son olarak da copyayı ekrana bastır
                magnets.findLowestObject(parent.children).appendChild(cln);

            } catch (ex) {}
        }
    },


    //Sayfa ilk yüklendiğinde ve ekran boyutlandırıldığında işleyecek method
    //Tüm işlemleri burada yapıyoruz
    triggerResize: function(children, obj, screenSize, max) {

        //data-magnet özelliğine sahip nesnenin o an ki parçalanmış alan sayısını alıyoruz
        var set = obj.magnetSetting;

        var doPiece = magnets.findScreenPiece(screenSize);

        //Ekran boyutlandırma sırasında parçalanma bilgisi değişirse uyguluyoruz
        if (set.piece != doPiece) {


            //Nesnenin kendisine parçalanma bilgisini verelim
            set.piece = doPiece;

            //Var olan kayıtları silelim
            magnets.removeChildren(obj);


            //Oluşturulacak parça sayısı kadar nesne oluşturur
            for (var n = 0; n < doPiece; n++) {
                obj.appendChild(Dom.create('div')._class('magnet-item'));
            }

            //Hafızadaki tüm nesneler ilgili dilimlere aktarılıyor
            for (var c = 0; c < children.length; c++) {
                var lowestHeightObj = magnets.findLowestObject(obj.children);
                lowestHeightObj.appendChild(children[c]);
            }


        }

    },





    //İstediğimiz alanın maksimum değere sahip kaydını alalım
    //En fazla kaç parçaya böleceğimize dair bilgiyi almış olacağız
    getMaxValues: function(values, name) {

        var max = 0;
        for (var i in values) {
            if (i[name] > max)
                max = i[name];
        }

    },




    /**
     * Gelen string değer içerisinde istenen formattaki değerleri alıp dizi olarak geri döndürüyoruz
     */
    getMatches: function(values) {

        //Eğer değer yoksa varsayılan olarak tek parçaya bölüyoruz
        if (!values)
            values = [
                ['web-12', 'web', '12']
            ];
        else {
            values = values.match(magnets.formatR);
            magnets.formatR.lastIndex = 0;
        }
        return values;
    },





    /**
     * 
     * Gelen match edilmiş diziyi bizim istediğimiz formata çevirip geri döndürüyoruz
     * 
     */

    getResizeValues: function(matches) {

        //Ekran boyutlandırılırken kontrolün kolay sağlanması için özel nesne oluşturuyoruz
        /**
        * {
            'web':{
                    'piece':3,
                    'size':2500
                },
            'tab':{
                    'piece':2,
                    'size':800
                  }
           }
        * 
        */

        var customScreen = [];

        //["web-4", "tab-6", "mob-12"]
        for (var z = 0; z < matches.length; z++) {

            //Group Şeklinde alalım
            var scrGroupItem = magnets.formatR.exec(matches[z]);
            magnets.formatR.lastIndex = 0;


            //İptal edelim
            if (!scrGroupItem || scrGroupItem.length == 0)
                return null;


            //Geliştirici tarafından verilen ekran boyut isimleri, screens nesnesi içindeki özellik adları kontrol ediliyor
            if (screens.hasOwnProperty(scrGroupItem[1])) {

                var num = screens[scrGroupItem[1]];
                if (num == 0)
                    num = 9999;

                customScreen.push([num, piece / scrGroupItem[2]]);

            }

        } //For

        customScreen.sort(function(r, t) { return customScreen[t] - customScreen[r] });
        //console.log(customScreen);
        return customScreen;

    },





    'constructor': {
        onload: function() {

            //Sayfa üzerinde ki tüm data-magnet nesnelerini seçelim
            var datamagnet = document.querySelectorAll('[data-magnet]');

            //Eğer bir nesne varsa işleme alalım
            if (datamagnet != null)
                if (datamagnet.length > 0) {

                    //Bulunan nesne sayısı kadar döngü oluştur
                    for (var i = 0; i < datamagnet.length; i++) {

                        /**
                         * Gelen screen boyutlarını alıyoruz
                         * Alınan bu bilgileri screen nesnesindeki değerlerle karşılaştıracağız
                         * Screen nesnesine uyan değerler alınıp, ekran boyutlandırması sırasında kullanacağız
                         */

                        var y = datamagnet[i];

                        //Geliştirici tarafından verilen değerleri alalım
                        var scr = y._attr('data-screen').toString();

                        //["web-4", "tab-6", "mob-12"]
                        var scrMatch = magnets.getMatches(scr);

                        //Nesnemize ilgili sınıf değerlerini ekleyelim
                        y._class(scr.split(' '))._class(['in', 'map']);

                        //Nesneden data-screen özelliğini kaldıralım
                        y._removeAttr('data-screen');

                        var p = magnets.getResizeValues(scrMatch);

                        if (p)
                            new magnets.custommagnet(y, p);


                    }

                }

        }
    }
}
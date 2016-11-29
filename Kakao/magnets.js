/**
 * 
 *  Magnets
 *  Magnet nesnesi ile nesnenin içeriğinde bulunan çocuk nesnelerini birbirine yapışarak dizilen formata getirmektedir
 */



//Plugin
var Magnets = (function Magnets() {

    Magnets.formatR = Regx('(' + Keys(Screens.Values).join('|') + ')\-(\\d{1,2})')

    return Magnets;

})()



Magnets.custommagnet = function custommagnet(obj, screenSize) {


    /**
     * data-magnet özelliğine ait nesnemizin sayfa içinde kullanacağımız bazı özelliklerini bu alan içerisinde tutulacak
     * 
     */

    var magset = {

        //İşlem yapılan nesnenin bir magnet nesnesi olduğunu ve bir işlem yapıldığını belli eder
        status: true,

        //data-magnet nesnesinin sayfa yüklendiği anda kaç parçaya ayrıldığı bilgisini tutar
        //Böylece sayfa her resize olduğunda buradaki değer ile parçalanması gereken değer aynıysa işlem yapılmayacak
        piece: 0,

        //CopyChildren
        children: []
    }

    //İlgili çocuk nesnelerin sayısı
    var length = obj.children.length;


    //Çocuk nesneler kadar döngü oluştur
    while (obj.children.length > 0) {
        magset.children.push(obj.children[0].cloneNode(true));
        obj.children[0].remove();
    }

    //setting nesnesini ilgili data-magnet nesnesine aktaralım
    obj['magnetSetting'] = magset;

    //Maksimum parca sayısı ör : 4
    var max = Magnets.getMaxValues(screenSize, 'piece');

    //sayfa yüklendiğinde çalıştırılacak olan method. Parametre olarak gönderilmiş değerler üzerinden işlem yapılacaktır
    Magnets.triggerResize(magset.children, obj, screenSize, max);

    //sayfa boyutlandığında çalıştırılacak olan method. Parametre olarak gönderilmiş değerler üzerinden işlem yapılacaktır

    Listener.add(window, 'resize', function() {
        Magnets.triggerResize(magset.children, obj, screenSize, max);
    });

    //Sayfa üzerinde yeni bir nesne oluşturulduğunda çalıştırılacak dinleyici
    Listener.add(obj, 'DOMNodeInserted', function(item, root, e, f) {
        Magnets.addNewMagnet(magset.children, item, root);
    });


    //Nesneye yeni magnetler eklemek için kullanılabilir method
    obj['appendMagnet'] = function(params) {
        if (isObj(params)) {

            if (params.length > 1)
                params._each(function(item) {
                    Magnets.addNewMagnet(obj.magnetSetting.Children, item, obj)
                });
            else
                Magnets.addNewMagnet(obj.magnetSetting.Children, params, obj)

        }
    }

}






/**
 * Sayfa boyutlanırken, data-magnet alanının boyuta göre kaç parçaya ayrılacağı bilgisini hesaplayıp geriye döndürmektedir.
 */
Magnets.findScreenPiece = function findScreenPiece(obj) {
    var result = 0;
    for (var k in obj)
        if (window.innerWidth < obj[k][0]) result = obj[k][1];
    return result;
}








/**
 * data-magnet nesnesinin children nesnelerinden hangisinin yüksekliğinin en kısa olduğunu bize verir
 * Amacımız yüksekliği en kısa nesneye yeni nesneleri eklemek.
 */


Magnets.findLowestObject = function findLowestObject(parent) {

    //  console.log(parent);
    /**
     * Dönüş tipi olarak gelen çocuk nesnelerinden ilk nesneyi seçiyoruz
     * Ve ilk nesnenin yükseklik değerini referans alıyoruz
     * eğer ilk nesne yüksekliği 0 ile zaten başka küçük değer olmayacağından
     * ilk nesneyi geri döndürüyoruz.
     * 
     * Eğer 0 dan büyükse, tüm dilimlerin yüksekliklerini kontrol edip en küçük olanı alıyoruz
     */

    var children = parent.children;
    var e = children[0];
    var result = children[0].offsetHeight;
    if (result <= 0) return e;

    for (var i = 0, len = parent.magnetSetting.piece; i < len; i++) {
        if (children[i].offsetHeight < result) {
            result = children[i].offsetHeight;
            e = children[i];
        }
    }


    //@return
    return e;

}






/**
 * Belirttimiz ana nesne içindeki çocuk nesneleri siler
 */
Magnets.removeChildren = function removeChildren(obj) {
    if (!obj) return;
    while (obj.children.length > 0) {
        obj.children[0].remove();
    }
}







/**
 * Sayfa üzerinde oluşturulan tüm nesneleri kontrol eder
 * Eğer içeriğinde bizim şartlarımızı sağlayan özellikler varsa işlemi yapar.
 * Örneğin sayfa üzerinde oluşturulmuş herhangi bir nesnenin parent nesnesi bir data-magnet mi
 * ve oluşturulan yeni nesne üzerinde daha önce magnet işlemi yapıldımı kontrol ediliyor
 * ve oluşturulan nesne magnet-item sınıf adına sahip değilse işleme alınıyor
 */

Magnets.addNewMagnet = function addNewMagnet(childrenList, item, parent) {

    //Eklenmiş olan nesnenin parent nesnesinde magnet var mı
    var mgSet = parent.magnetSetting;

    //Varsa işlemi yap
    if (mgSet && mgSet.status === true && !item.isMagnetAvaible && !item.dataMagnetItem) {

        try {

            //Yeni nesneyi klonla
            // var cln = item.cloneNode(true);

            item.isMagnetAvaible = true;

            //Orjinali sil
            //item.remove();

            //Hafızaya ekle
            mgSet.children.push(item);

            //Son olarak da copyayı ekrana bastır
            Magnets.findLowestObject(parent).appendChild(item);

        } catch (ex) { console.log(ex); }
    }


}









//Sayfa ilk yüklendiğinde ve ekran boyutlandırıldığında işleyecek method
//Tüm işlemleri burada yapıyoruz
Magnets.triggerResize = function triggerResize(children, obj, screenSize, max) {

    var pieceCount = Magnets.findScreenPiece(screenSize);

    //Ekran boyutlandırma sırasında parçalanma bilgisi değişirse uyguluyoruz
    if (obj.magnetSetting.piece != pieceCount) {

        /**
         * data-magnet nesnesi içinde oluşan çocuk nesne sayısı değerini
         * data-magnet nesnemizin setting özelliğine bildiriyoruz
         * 
         */
        obj.magnetSetting.piece = pieceCount;

        //data-magnet nesnesindeki tüm çocuk nesneleri temizleyelim
        Magnets.removeChildren(obj);

        /**
         * data-magnet nesnesi icerisindeki tüm nesneleri sildikten sonra
         * tekrardan istediğimiz parça sayısı kadar cocuk nesne oluşturuyoruz
         */
        for (var n = 0; n < pieceCount; n++) {
            var u = document.createElement('div');
            u['dataMagnetItem'] = 'v.0.1';
            obj.appendChild(u);
        }


        /**
         * Sayfa oluşturulurken bulunan nesneleri hafızaya kopyalamıstık.
         * Kopyalanan bu nesneleri yeni oluşturduğumuz parcalara dağıtıyoruz
         * Dağıtırken kullanılan mantık, en düşük yüksekliğe sahip nesneye sıradaki nesneyi aktarıyoruz
         * 
         */

        for (var c = 0; c < children.length; c++) {
            var lowestHeightObj = Magnets.findLowestObject(obj);
            lowestHeightObj.appendChild(children[c]);

            if (c == children.length - 1)
                obj.classList.remove('showinit');
        }

    }

}



//İstediğimiz alanın maksimum değere sahip kaydını alalım
//En fazla kaç parçaya böleceğimize dair bilgiyi almış olacağız
Magnets.getMaxValues = function getMaxValues(values, name) {

    var max = 0;
    for (var i in values) {
        if (i[name] > max)
            max = i[name];
    }

}




/**
 * Gelen string değer içerisinde istenen formattaki değerleri alıp dizi olarak geri döndürüyoruz
 */
Magnets.getMatches = function getMatches(values) {

    //Eğer değer yoksa varsayılan olarak tek parçaya bölüyoruz
    if (!values)
        values = [
            ['all-12', 'all', '12']
        ];
    else {
        values = values.match(Magnets.formatR);

        Magnets.formatR.lastIndex = 0;
    }
    return values;
}






/**
 * 
 * Gelen match edilmiş diziyi bizim istediğimiz formata çevirip geri döndürüyoruz
 * 
 */

Magnets.getResizeValues = function getResizeValues(obj) {

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

    var matches = obj.className.match(Magnets.formatR);
    Magnets.formatR.lastIndex = 0;

    //["web-4", "tab-6", "mob-12"]
    for (var z = 0; z < matches.length; z++) {

        //Group Şeklinde alalım
        var scrGroupItem = Magnets.formatR.exec(matches[z]);
        Magnets.formatR.lastIndex = 0;


        //İptal edelim
        if (!scrGroupItem || scrGroupItem.length == 0)
            return null;


        //Geliştirici tarafından verilen ekran boyut isimleri, screens nesnesi içindeki özellik adları kontrol ediliyor
        if (Screens.Values.hasOwnProperty(scrGroupItem[1])) {

            var num = Screens.Values[scrGroupItem[1]];
            if (num == 0)
                num = 9999;

            customScreen.push([num, Screens.Piece / scrGroupItem[2]]);

        }

    } //For

    customScreen.sort(function(r, t) { return customScreen[t] - customScreen[r] });

    return customScreen;

}


//Constructor
Magnets.constructor = {}



//Sayfa yüklendiğinde işletilecek method
Magnets.constructor.onload = function onload() {

    //Sayfa üzerinde ki tüm data-magnet nesnelerini seçelim
    var datamagnet = document.querySelectorAll('[data-magnet]');

    //Eğer bir nesne varsa işleme alalım
    if (datamagnet != null)
        if (datamagnet.length > 0) {

            //Bulunan nesne sayısı kadar döngü oluştur
            for (var i = 0; i < datamagnet.length; i++) {

                //data-magnet nesneleri sadece div olabilir
                if (datamagnet[i].tagName != 'DIV') {
                    console.log('Data-magnet nesneleri sadece DIV elementi olabilir');
                    return;
                };

                /**
                 * Gelen screen boyutlarını alıyoruz
                 * Alınan bu bilgileri screen nesnesindeki değerlerle karşılaştıracağız
                 * Screen nesnesine uyan değerler alınıp, ekran boyutlandırması sırasında kullanacağız
                 */

                var y = datamagnet[i];

                //Geliştirici tarafından verilen değerleri alalım
                //var scr = y._attr('data-screen').toString();

                //["web-4", "tab-6", "mob-12"]
                //var scrMatch = Magnets.getMatches(scr);


                //Nesnemize ilgili sınıf değerlerini ekleyelim
                //y._class(scr.split(' '))._class(['in', 'float']);

                //Nesneden data-screen özelliğini kaldıralım
                //y._removeAttr('data-screen');

                var p = Magnets.getResizeValues(y);

                if (p)
                    new Magnets.custommagnet(y, p);


            }

        }




    Listener.remove(window, 'load', Magnets.constructor.onload);

}




//Plugini ekleyelim
Plugins.add(Magnets);
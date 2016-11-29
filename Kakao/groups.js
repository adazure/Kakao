var Groups = (function Groups() {

    //format : inline-web-6-6, inline-tab-12-12-5-1, float-tab-12-12
    Groups.formatR = Regx('(' + Selectors.getOnlySelectors().join('|') + ')\\-(' + Keys(Screens.Values).join('|') + ')(\\-\\d{1,2})+')

    return Groups;
})();


Groups.applyChildren = function(objs, params, values) {

    for (var i in objs) {
        Groups.applyChild(objs[i], params, values);
    }
}





Groups.applyChild = function(obj, params, values) {

    /**
     * Gelen sayısal değerleri öncelikle kontrol edeceğiz
     * Eğer tek bir kayıt varsa, ilgili sayısal veriyi tüm alt nesnelere aynı şekilde uygulayacagız
     * Eğer iki ve daha fazla sayı varsa ilgili sayının katları şeklinde alt nesnelere uygulayacağız
     * Örneğin 2 tane sayısal kayıt geldiğini düşünelim
     * [4,6]
     * Örnek ilgili nesnemizin alt nesneleri de 5 adet div nesnesi olsun
     * O halde ikişerli olarak her nesneye ilgili sayıları uygulayacağız
     * 1'nci div 4 değerini,
     * 2'nci div 6 değerini,
     * 3'üncü div 4 değerini,
     * 4'ünvü div 6 değerini gibi iki ve katları şeklinde uygulanmıştır
     * Uygulanacak sayı değeri sayısı ilgili nesnelerin sayısından az ise tekrar başa dönerek sırasdaki nesneye sıradaki sayı değerini uygular
     * 
     */


    if (obj == null) return;
    if (obj.children == null) return;
    if (obj.children.length == 0) return;

    var startIndex = -1;

    for (var n = 0, length = obj.children.length; n < length; n++) {

        if (startIndex < values.length - 1)
            startIndex++;
        else
            startIndex = 0;

        //Örnek web12
        var dataClass = params[2] + values[startIndex];

        //Örnek web12, this, inline sınıf değerlerinin hepsi atanıyor
        obj.children[n]._class(dataClass, 'this', params[1]);

        //Sadece float özelliğinde
        if (params[1] == 'float') {
            obj._class('float', 'group');
        }

    }

}








/**
 * Bulunan match değerlerini ilgili nesnenin alt nesnelerine uygular
 */

Groups.applyMatch = function(match, obj) {


    for (var i in match) {

        var b = match[i];

        /**
         * b parametresinden gelen değeri exec ile grouplara ayıralım
         * 
         * İlgili nesne sınıf değerleri içinde istediğimiz gibi kayıt/kayıtlar mevcut. O halde işleyelim
         * Bulunan değerin web-inline-6-6 olduğunu varsayarak işleyelim
         * Exec ile bize aşağıdaki gibi bir çıktı verecek
         * group0 : web-inline-6-6
         * group1 : web
         * group2 : inline
         * group3 : 6
         */

        var params = Groups.formatR.exec(b);

        //Regex nesne formatımız sabit olduğundan, yani new RegExp demediğimiz için formatın sorgu sırasını 0'a çekiyoruz
        Groups.formatR.lastIndex = 0;

        //Eğer formata uygun değilse iptal et
        if (!params) return;

        //Sayısal değerleri almak için - işaretinden parçalayalım
        var values = params[0].split('-');

        //Sayısal değerleri alalım. 2. index kaydından itibaren tüm kayıtları alalım
        values = values.slice(2, values.length);

        //Secici ifadeki silelim *-inline-*-*-* vs
        obj._removeClass(params[0]);

        //Next all özelliğini kontrol ederek kaç nesneyi daha etkileyip etkilemeyeceğini bulalım
        var next = obj._attr('data-next')

        /**
         * Tek bir nesneden fazla nesnede etkileşim olacağını anlıyoruz
         * Şimdi kaç nesnenin etkileceğini bulup işlemi yaptıralım
         */

        if (!next) {
            obj._removeAttr('data-next');
            Groups.applyChild(obj, params, values);
        }

        //Belirli aralıktaki nesnelere uygulama yapalım
        else if (next) {

            //* değeri varsa tüm nesneleri seçelim
            if (next && next === '*')
                next = obj.parentNode.children.length;

            //Değilse sadece belirli sayı aralığındakileri seçelim
            else if (next && isNum(next))
                next = parseInt(next);

            //0dan büyük bir değer olmalı
            if (next >= 0) {

                var children = Array.prototype.slice.call(obj.parentNode.children);

                //Şimdi bizim nesnemizin bu ana grup içinde bulunduğu pozisyonun index numarasını al
                var currentIndex = children.indexOf(obj);

                //Şimdi de nesnemizin bulunduğu pozisyondan kaç tanesi bu durumdan etkilenecekse, bu grubun listesini ver
                var t = children.slice(currentIndex, currentIndex + parseInt(next) + 1);

                Groups.applyChildren(t, params, values);

            }
        }

    }

}





//constructor
Groups.constructor = {};






//Sayfa yüklendiğinde çalıştırılacak method
Groups.constructor.onload = function() {


    //web, tab, mob, min
    var keys = Keys(Screens.Values);

    //Format : [class*="-float-"], [class*="-inline-"], [class*="-table-"]
    var queryvalue = Format.Repeat('[class*="{}-"]', Selectors.getOnlySelectors()).join(',');

    //Sayfa üzerinde ki -float-, -inline-, -table- gibi sınıf adlarına sahip nesneleri seçer
    var selectGroups = document.querySelectorAll(queryvalue);


    if (selectGroups && selectGroups.length > 0) {

        //Bulunan her bir nesneyi tek tek işleme al

        for (var i = 0, len = selectGroups.length; i < len; i++) {

            var b = selectGroups[i];
            //-float-, -inline-, -table- gibi değerlerle nesneler bulunmuş olabilir ama yeterli değil
            //ilgili nesnenin sınıf adlarında tam olarak bizim istediğimiz formatta bir sınıf adı varsa işleme alacağız
            var match = b.className.match(Groups.formatR);

            //Eğer hiç bulunamamışsa bu nesne bize uygun değil demektir
            if (match == null) return;


            //İşlem yapıldığına dair işaret koyalım
            b.groupMatch = match;


            b.groupTrigger = function() {
                Groups.applyMatch(match, b);
            }

            //İlgili nesnenin bağlı olduğuğu parent nesnesine group ibaresi ekleyelim
            b.parentNode.groups = true;

            /**
             * Eğer gelen bir array liste varsa ve değer/değerler bulunmuşsa. Aşağıdaki gibi bir örnek çıktı verecektir
             * 
             * Array[2]
             *  0: "web-float-12-12"
             *  1: "tab-float-12-12"
             *  length: 2
             *  __proto__: Array[0]
             * 
             * Tek bir nesne içinde 2 kayıt bulunduğunu varsayarak ilerliyoruz
             */

            Groups.applyMatch(match, b);


            //Sayfa üzerinde yeni bir nesne oluşturulduğunda tetiklenecek methodumuz
            Listener.add(b, 'DOMNodeInserted', function(e) {

                e.children._each(function(b) {
                    if (b.groupTrigger)
                        b.groupTrigger();
                });
            });


        }

    }





    Listener.remove(window, 'load', Groups.constructor.onload);

}




//Plugini yükle
Plugins.add(Groups);
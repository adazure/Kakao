Kakao.groups = {


    //map, inline, table
    query: getOnlySelectors(),


    //format : web-inline-6-6, tab-inline-12-12-5-1, tab-map-12-12
    formatR: regx('(' + objects.keys(screens).join('|') + ')\\-(' + getOnlySelectors().join('|') + ')(\\-\\d{1,2})+'),


    applyChildren: function(objs, params, values) {
        foreach(objs, function(a, b, c) {
            groups.applyChild(b, params, values);

        });
    },


    applyChild: function(obj, params, values) {

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

        var startIndex = -1;

        var length = obj.children.length;

        for (var n = 0; n < length; n++) {

            if (startIndex < values.length - 1)
                startIndex++;
            else
                startIndex = 0;

            //Örnek web12
            var dataClass = params[1] + values[startIndex];

            //Örnek web12, this, inline sınıf değerlerinin hepsi atanıyor
            obj.children[n]._class(dataClass, 'this', params[2]);
        }


    },

    /**
     * Bulunan match değerlerini ilgili nesnenin alt nesnelerine uygular
     */

    applyMatch: function(match, obj) {


        foreach(match, function(a, b, c) {

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

            var params = groups.formatR.exec(b);

            //Regex nesne formatımız sabit olduğundan, yani new RegExp demediğimiz için formatın sorgu sırasını 0'a çekiyoruz
            groups.formatR.lastIndex = 0;

            //Eğer formata uygun değilse iptal et
            if (!params) return;

            //Sayısal değerleri almak için - işaretinden parçalayalım
            var values = params[0].split('-');

            //Sayısal değerleri alalım. 2. index kaydınran itibaren tüm kayıtları alalım
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
                groups.applyChild(obj, params, values);
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

                    groups.applyChildren(t, params, values);

                }
            }

        });

    },

    'constructor': {
        run: function() {




        },
        onload: function() {


            //web, tab, mob, min
            var keys = objects.keys(screens);

            //Format : [class*="-map-"], [class*="-inline-"], [class*="-table-"]
            var queryvalue = repeat('[class*="-{}-"]', groups.query).join(',');

            //Sayfa üzerinde ki -map-, -inline-, -table- gibi sınıf adlarına sahip nesneleri seçer
            var selectGroups = document.querySelectorAll(queryvalue);

            //Bulunan her bir nesneyi tek tek işleme al
            foreach(selectGroups, function(a, b, c) {

                //Sıradaki nesnenin sınıf adlarının listesini string olarak al
                var className = b.className || b.classList.value;

                //-map-, -inline-, -table- gibi değerlerle nesneler bulunmuş olabilir ama yeterli değil
                //ilgili nesnenin sınıf adlarında tam olarak bizim istediğimiz formatta bir sınıf adı varsa işleme alacağız

                var match = className.match(groups.formatR);

                //Eğer hiç bulunamamışsa bu nesne bize uygun değil demektir
                if (match == null) return;


                /**
                 * Eğer gelen bir array liste varsa ve değer/değerler bulunmuşsa. Aşağıdaki gibi bir örnek çıktı verecektir
                 * 
                 * Array[2]
                 *  0: "web-map-12-12"
                 *  1: "tab-map-12-12"
                 *  length: 2
                 *  __proto__: Array[0]
                 * 
                 * Tek bir nesne içinde 2 kayıt bulunduğunu varsayarak ilerliyoruz
                 */

                groups.applyMatch(match, b);

            })

        }
    }
}
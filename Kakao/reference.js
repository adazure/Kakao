Kakao.reference = {

    /**
     * Sayfa üzerinde bulunan tüm ref- etiketine sahip veriler burada tutulmaktadır
     * Tutulan veri tipi Object Array tipindedir.
     * Örnek data: { name: 'sınıfadı', ref: 'this', obj: <Nesne></Nesne> }
     */

    table: [],



    /**
     * Sayfa üzerinde oluşturulmuş ref-**- nesnelerini arar ve gelen listeyi geri döndürür
     */
    search: function() {

        //@Return
        var _get = [];

        //İşaretleyici sayısınca döngü oluştur
        foreach(markers.names, function(a, i, c) {

            //Tanımlayıcı
            var ref = 'ref-' + c + '-';

            //Tüm nesneleri tarar
            var _e = document.querySelectorAll('[class*=' + ref + ']');

            _e.forEach(function(item) {
                _get.push(item);
            });

        })

        //@return geri döndür
        return _get;
    },





    /**
     * <param HTMLElement>
     * <param [this,in,all,any]
     * Gelen type değerine göre markers.names[type] nesnesi içinde tanımlanan nesne listesi içinde arama yapar
     * Bu liste içerisinde ilgili HTMLElement nesnesinin class değerleri içindeki aynı olan değerleri alır
     * Bulunan değerler [...] ilgili referans gösterilen nesnenin class değerlerine eklenmek üzere geri döndürülür
     */
    getSameClass: function(obj, type) {

        //Type değerinin "any" olması durumunda nesneye ait class değerlerinin tamamı geri döndürülür
        if (!markers.names[type]) return obj.classList;

        //@Return nesnesi 
        var re = [];

        //Gelen type değerini ilgili nesne class değerleri içinde kontrol ederek benzer sınıf adlarını alalım
        obj.classList.forEach(function(item, i) {

            if (markers.names[type].indexOf(item) != -1)
                re.push(item);
        });

        //Listesi geri döndürelim
        return re;
    },



    /**
     * Search methodu ile sayfa üzerinde bulunmuş ref- etiketli nesnelere getReference methodu static prototype olarak eklenecektir
     * HTMLElement.getReference(refName) olarak işletilecektir.
     * 
     * <param referencetype> => [this,in,all,any]
     * Table[] nesnesine atanan bu ilgili ref- etiketli nesneler buraya aktarılmıştı
     * Table[] nesnesinde arama yapıldığında buradaki ilgili nesnelerin getReference olarak atanmış methodu kolayca çalıştırılabilecek
     * Buradaki amaç bu method çağrıldığında, bağlı bulunduğu nesnenin içindeki diğer <element></element> elementler taranacak
     * Taranan bu nesnelerde, getReference methodu çağrılan nesnedeki [sınıfadı] aranacak ve bulunan nesnelere 
     */
    getReference: function(refName) {
        var _self = this;


        var n = document.querySelectorAll('[data-refix-cls] .' + _self.reffName);
        if (n && n.length > 0) {
            var _ref = reference.getSameClass(_self, refName);

            if (_ref)
                n.forEach(function(item, index) {
                    item._class(_ref);
                    item.classList.remove(_self.reffName);
                });
        }
    },


    'constructor': {
        run: function() {

                //Sayfa üzerindeki tüm referens nesnelerini arar
                var n = reference.search();

                //Arama sonucu gelen nesne boş veya liste sayısı 0'sa işlemi iptal et
                if (!n || n.length == 0) return;

                //İlgili nesne içerisinde tam istediğimiz ref- sınıf adı varsa alalım
                var match = regx('ref\\-(' + objects.keys(markers.names).join('|') + ')\\-(\\w+)');


                n.forEach(function(item, index) {

                    // Sıradaki nesneye ait sınıf değerleri içinde ilgili pattern modelini aratalım
                    var get = item.className.match(match);

                    //İstenilen pattern mutlaka en az 1 tane varsa işleme devam et
                    if (get || get.length > 0) {

                        //Pattern değerine ait tüm değerleri sırasıyla işleme al
                        get.forEach(function(a) {

                            /**
                             * Gelen sıradaki veriyi parçalarına ayır
                             * Çıktı:
                             * ['ref-in-sınıfadi'],['in'],['sinifadi']
                             */
                            var grp = match.exec(a);

                            //Regex Exec işleminden sonra regexin işlem index numarasını 0'a eşitliyoruz. Böylece sıradaki diğer işlem 0'ıncı karakterden başlayacak
                            match.lastIndex = 0;

                            //Eğer gelen bir grup değeri varsa işleme devam et
                            if (grp) {

                                //Daha sonradan tekrar kullanabilmek için ilgili sıradaki değerleri tabloya kaydet
                                reference.table.push({ name: grp[2], ref: grp[1], obj: item });

                                //İlgili nesneden [0]'ncı değeri yani gelen ['ref-in-sınıfadi'] değerini siler
                                item.classList.remove(grp[0]);

                                //Bu nesneye daha önce getReference methodu eklenmemişse devam et
                                if (!item.getReference) {

                                    //getReference methodu oluştur ve varolan method ile eşle
                                    item.getReference = reference.getReference;

                                    //[sinifadi] değerini ilgili nesneye aktaralım
                                    item.reffName = grp[2];

                                    //İlgili nesne üzerinde oluşturulacak attribute özelliğine benzersiz veri atayalım
                                    item.refixClsName = '-refix-cls-000' + Math.round(Math.random() * 99999);

                                    item.setAttribute('data-refix-cls', ' ');

                                    //İşlemlerden sonra ilgili methodu ilkkez başlatalım
                                    item.getReference(grp[1]);
                                }

                            } //EndIf

                        }); //Foreach

                    } //EndIf

                });


                //Sayfa üzerinde yeni bir nesne oluşturulduğunda tetiklenecek methodumuz
                document._listen('DOMNodeInserted', function(e) {

                    reference.table.forEach(function(item, i) {

                        item.obj.getReference(item.name);

                    });

                });



            } //Constructor
    }

}
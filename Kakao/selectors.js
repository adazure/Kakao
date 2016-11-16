/*


 * Seçiciler
 * Eklendiği nesne üzerinde bir işlem yapılacağına ve nasıl bir işlem yapılacağına dair fikir verir
 * Nesne üzerinde eklendiğinde tek başına herhangi bir etkileşimleri bulunmamaktadır
 * 
 */

Kakao.getOnlySelectors = function() {
    var r = [];
    for (var i in Kakao.selectors) {
        if (Kakao.selectors[i].selector && !Kakao.selectors[i].lock)
            r.push(i);
    }
    return r;
}

Kakao.selectors = {

    'map': {
        //Kontroller sırasında seçici olarak işleme alınsın mı
        selector: true,
        //This işaretleyicisi olsun mu
        root: true,
        //In işaretleyicisi olsun mu
        children: true,
        //Each değişkeni before ve init methodlarının Start dosyasında işleme alınıp alınmayacağı. Eğer true olursa methodlar çalıştırılır.
        //Şöyle söyleyelim. Before function methodu mevcut olabilir ama bazı durumlarda bunu yükletmek istemeyiz. Each değeri true ve before methodu varsa çalışır
        each: true,
        //Sayfa yüklenmeden önce yapılacak işler
        before: function() {
            Kakao.result.push('.map.this,.map.in>*{float:left; margin:0;}');
            Kakao.result.push('.map.in::before,.map.in::after{content:" "; display:block; clear:both;}');
        },
    },





    'inline': {
        //Kontroller sırasında seçici olarak işleme alınsın mı
        selector: true,
        //This işaretleyicisi olsun mu
        root: true,
        //In işaretleyicisi olsun mu
        children: true,
        //Each değişkeni before ve init methodlarının Start dosyasında işleme alınıp alınmayacağı. Eğer true olursa methodlar çalıştırılır.
        //Şöyle söyleyelim. Before function methodu mevcut olabilir ama bazı durumlarda bunu yükletmek istemeyiz. Each değeri true ve before methodu varsa çalışır
        each: true,
        //Sayfa yüklenmeden önce yapılacak işler
        before: function() {
            Kakao.result.push('.inline.this,.inline.in>*{display:inline-block; vertical-align:top;}');
            Kakao.result.push('.inline.in>*{margin-right:-4px;}');
            Kakao.result.push('.inline.in::before,.inline.in::after{content:" "; display:block; clear:both;}');

        },
    },






    'table': {
        //Kontroller sırasında seçici olarak işleme alınsın mı
        selector: false,
        //This işaretleyicisi olsun mu
        root: false,
        //In işaretleyicisi olsun mu
        children: false,
        //Each değişkeni before ve init methodlarının Start dosyasında işleme alınıp alınmayacağı. Eğer true olursa methodlar çalıştırılır.
        //Şöyle söyleyelim. Before function methodu mevcut olabilir ama bazı durumlarda bunu yükletmek istemeyiz. Each değeri true ve before methodu varsa çalışır
        each: false,
        //Sayfa yüklenmeden önce yapılacak işler
        before: function() {
            Kakao.result.push('.table.this,.table.in{display:table}');
            Kakao.result.push('.table.in>*{display:table-cell;}');
        },
    },





    /**
     * Burada tanımlanacak tüm bilgiler yada değerler, selector olarak işaretlenmiş...
     * her bir ekran boyutuna; yine kendi ekran adıyla beraber oluşturulur
     * Örnek: hidden tanımlı sınıf adı her ekran boyutu için şu şekilde tanımlanır
     * web-hidden, mob-hidden, tab-hidden vs. web, mob, tab gibi seçici içimlerini belirtmeniz gerekmez
     * Bu değerler otomatik olarak eklenir.
     */
    'all': {
        lock: true,
        //Sayfa yüklenmeden önce yapılacak işler
        before: function(name, arr) {

            var allDefaults = {
                'hidden': 'display:none !important',
                'show': 'display:block !important',
                'textcenter': 'text-align:center !important',
                'textright': 'text-align:right !important',
                'textleft': 'text-align:left !important',
                'left': 'margin-left:0; margin-right:auto;',
                'center': 'margin-left:auto; margin-right:auto; display:inherit !important;',
                'right': 'margin-left:auto; margin-right:0'
            };

            for (var n in allDefaults) {
                arr.push(Kakao.format(".{0}-{1}{{2}}", name, n, allDefaults[n]));
            }

        },
    },








    /**
     * Sayfa içerisinde genel kullanım için tanımlanmış bilgiler yer alıyor
     * Ekran boyutlarından tamamen bağımsız kullanımı olan bilgiler tanımlanmalıdır
     */
    'default': {
        lock: true,
        //Each değişkeni before ve init methodlarının Start dosyasında işleme alınıp alınmayacağı. Eğer true olursa methodlar çalıştırılır.
        each: true,
        //Sayfa yüklenmeden önce yapılacak işler
        before: function() {
            Kakao.result.push('*{box-sizing:border-box};');
            Kakao.result.push('.showinit{display:none};');
            Kakao.result.push('[data-grid] .inline {vertical-align:top; width:25%;}');
            Kakao.result.push('[data-grid="form"] .inline {vertical-align:text-bottom;}');
            Kakao.result.push('[data-grid] .inline label {padding:3px; display:block; font-weight:bold;}');
            Kakao.result.push('[data-grid] .inline * {width:100%;}');
            Kakao.result.push('[data-grid] .inline.grid-col {padding:2px;}');
            Kakao.result.push('[data-magnet] > * {width:33.3333%; float:left;}');
        },
        //Sayfa yüklendiğinde yapılması istenen işler
        init: false
    },





    /**
     * 
     * Bu alan yukarıdaki tanımlamalardan tamamen bağımsızdır
     * Bu method sadece start nesnesinden çağrıldığında işletilecektir.
     * 
     */
    'constructor': {
        lock: true,
        run: function() {

            /**
             * //////////////////////////////////////////
             * ////////// SELECTOR START ////////////////
             * //////////////////////////////////////////
             */

            /**
             * Selector nesnesi içerisinde yüklenmesi gereken alanları yükleyelim
             * Buradaki yükleme işlemi before ve init methodlarının çağrılarak Kakao.result nesnesi içerisine yüklenmesi
             * Kakao.result nesnesine yüklenen veriler sayfada oluşturulacak <style></style> nesnesine aktarılacaktır
             * Şimdi aşağıda sırasıyla işlemleri başlatıyoruz
             */

            Kakao._for(Kakao.selectors, function(i, v) {

                //Before methodu varsa ve each değeriyle sorgulama işlemine alınmak isteniyorsa
                if (v.before && v.each)
                    v.before();

                //Sayfa ve dosya yüklendiğinde çalıştırılacak veya yapılacak işlemler. Eğer init methodu varsa çalışırır.
                if (v.init);
                window._listen('load', v.init);

            })


            /**
             * Selector nesnesi içerisinde bulunan seçici adlarıyla, screens nesnesi içerisindeki değerler birleştirilerek, aşağıdaki örnek çıktılar sayfa boyutlarına göre oluşturulmaktadır
             * 
             * Örnek 'tab' screen çıktısı:
             * 
             * @media screen and (max-width:980px){
             *  .map.this.tab1,.map.in.tab-1>*,.inline.this.tab1,.inline.in.tab-1>*,.table.this.tab1,.table.in.tab-1>*{width:8.3333%}
                .map.this.tab2,.map.in.tab-2>*,.inline.this.tab2,.inline.in.tab-2>*,.table.this.tab2,.table.in.tab-2>*{width:16.6667%}
                .map.this.tab3,.map.in.tab-3>*,.inline.this.tab3,.inline.in.tab-3>*,.table.this.tab3,.table.in.tab-3>*{width:25%}
                .map.this.tab4,.map.in.tab-4>*,.inline.this.tab4,.inline.in.tab-4>*,.table.this.tab4,.table.in.tab-4>*{width:33.3333%}
                .map.this.tab5,.map.in.tab-5>*,.inline.this.tab5,.inline.in.tab-5>*,.table.this.tab5,.table.in.tab-5>*{width:41.6667%}
                .map.this.tab6,.map.in.tab-6>*,.inline.this.tab6,.inline.in.tab-6>*,.table.this.tab6,.table.in.tab-6>*{width:50%}
                .map.this.tab7,.map.in.tab-7>*,.inline.this.tab7,.inline.in.tab-7>*,.table.this.tab7,.table.in.tab-7>*{width:58.3333%}
                .map.this.tab8,.map.in.tab-8>*,.inline.this.tab8,.inline.in.tab-8>*,.table.this.tab8,.table.in.tab-8>*{width:66.6667%}
                .map.this.tab9,.map.in.tab-9>*,.inline.this.tab9,.inline.in.tab-9>*,.table.this.tab9,.table.in.tab-9>*{width:75%}
                .map.this.tab10,.map.in.tab-10>*,.inline.this.tab10,.inline.in.tab-10>*,.table.this.tab10,.table.in.tab-10>*{width:83.3333%}
                .map.this.tab11,.map.in.tab-11>*,.inline.this.tab11,.inline.in.tab-11>*,.table.this.tab11,.table.in.tab-11>*{width:91.6667%}
                .map.this.tab12,.map.in.tab-12>*,.inline.this.tab12,.inline.in.tab-12>*,.table.this.tab12,.table.in.tab-12>*{width:100%}
                .tab-hidden{display:none !important}
                .tab-show{display:block !important}
                .tab-textcenter{text-align:center !important}
                .tab-textright{text-align:right !important}
                .tab-textleft{text-align:left !important}
                .tab-left{margin-left:0; margin-right:auto;}
                .tab-center{margin-left:auto; margin-right:auto; display:inherit !important;}
                .tab-right{margin-left:auto; margin-right:0}
                }
             */

            //Tüm ekran boyutlarını tek tek ele alıyoruz
            Kakao._for(Kakao.screens, function(a, b, key) {

                //İşlemler sırasında oluşturululan @media screen değerleri buraya kaydedilecek
                var cache = [];

                //Piece değeri kadar döngü oluşturur. Bilindiği üzere Piece değeri sayfada oluşturulacak maksimum parça değerini simgeler
                for (var n = 1; n <= Kakao.piece; n++) {

                    var z = [];

                    /**
                     * Seçicileri bir döngü içerisinde ele alıp
                     * Gelen her bir değeri this ve in işaretleyicilerle birleştiriyoruz
                     * 
                     * Örnek çıktı:
                     * .map.this.web1
                     */

                    for (var i in Kakao.selectors) {
                        var x = Kakao.selectors[i];
                        //console.log(x);
                        if (x.root && x.selector)
                            z.push(Kakao.format('.{0}.this.{1}{2}', i, key, n));

                        if (x.children && x.selector)
                            z.push(Kakao.format('.{0}.in.{1}-{2}>*', i, key, n));

                    } //maps




                    /**
                     * Z Array nesnesine eklenen çıktıyı formatlayarak yeni bir çıktı elde ediyoruz
                     * 
                     * Örnek çıktı:
                     * .map.this.web1,.inline.this.web1,.table.this.web1{width:8.3333%}
                     */


                    cache.push(Kakao.format('{0}{width:{1}%}', z.join(','), Kakao.screenCalc(n)));
                    //console.log(Kakao.format('{0}{width:{1}%}', z.join(','), screenCalc(n)));




                } //piece







                /**
                 * Selector nesnemizde all diye bir alan tanımladık
                 * Bu alan her bir screen değerinde oluşturulacak verileri simgeliyordu
                 * Örneğin işlem sırasındaki screen adı 'web' olsun. Bu gelen değeri Selector.all nesnemizin before methoduna gönderiyoruz
                 * O da bize 'web' ön etiketiyle beraber bu method içindeki CSS adlarını birleştirerek ilgili ekran boyutunun değerleri olarak işleme almaktadır.
                 * 
                 * örnek:
                 * 'web' adı methoda gönderiliyor.
                 * Çıktı:
                 * web-hidden yada web-show, web-remove vs...
                 */

                Kakao.selectors.all.before(key, cache);





                /**
                 * Son olarak @media screen and ekran boyutumuzu oluşturuyoruz ve ilgili değerleri içerisine yüklüyoruz
                 * 
                 */
                Kakao.result.push(Kakao.media.create(Kakao.screens[key], cache.join('')));



            });

            /**
             * Sayfa üzerinde head kısmına <style></style> nesnesi oluşturuyoruz
             * Oluşturulan nesne içerisine Kakao.result değişkeni içindeki değerleri aktarıyoruz 
             */
            var sty = Kakao.Dom.create('style');
            sty.innerHTML = Kakao.result.join('');
            document.head.appendChild(sty);


            /**
             * //////////////////////////////////////////
             * ////////// SELECTOR END //////////////////
             * //////////////////////////////////////////
             */



        },
        /**
         * Selector nesnesinde sayfa yüklendiği anda yapılacak işlemler burada yapılacak
         * 
         */
        onload: function() {

            var d = document.querySelectorAll('.showinit');

            if (d && d.length > 0) {
                Kakao._for(d, function(a, b) {
                    b._removeClass('showinit');
                });
            }
        }
    }

}
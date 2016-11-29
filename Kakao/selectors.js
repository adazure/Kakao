/*


 * Seçiciler
 * Eklendiği nesne üzerinde bir işlem yapılacağına ve nasıl bir işlem yapılacağına dair fikir verir
 * Nesne üzerinde eklendiğinde tek başına herhangi bir etkileşimleri bulunmamaktadır
 * 
 */

var Selectors = (function Selectors() {


    Selectors.Values = {};

    return Selectors;
})()




//Sadece selector özelliği olan nesneleri adlarını getirir
//@return [float, inline, table]
Selectors.getOnlySelectors = function getOnlySelectors() {
    var r = [];
    for (var i in Selectors.Values) {
        if (Selectors.Values[i].selector && !Selectors.Values[i].lock)
            r.push(i);
    }
    return r;
}





/**
 * Yeni bir selector nesnesi eklemek için kullanılır.
 * Amaç plugin şeklinde yapmak olduğundan ve geliştirici tarafından istenirse yüklenmesi amacıyla oluşturuluyor
 * Böylece geliştirici sadece istediği pluginleri yükleyerek gereksiz script tanımlamalarını yüklememiş ve 
 * Yükleme hızından da kazanılmış olacaktır
 * 
 * Yeni bir selector nesnesinde olması gereken özellikler ve tanımlamalar aşağıdadır
 * 
 * <param name> Selector nesnesi için benzersiz bir isim tanımlanmalı
 * <param object> Selector nesnesinin alacağı sabit paramatreler için Object Array nesnesi
 * 
 * Örnek Object Array nesnesi
 * {
 *  selector:       true/false değer alır. Eğer nesneler üzerinde bir işlem yapılacaksa,
 *  lock:           true/false Lock özelliğini geliştiricilerin dışarıdan değer tanımladıklarında(setting özelliğinde) buradaki benzersiz isimle uyuşmamaları içindir.
 *                             Burada tanımlanan isimde bir isim tanımlamamaları gerekmektedir anlamını taşımaktadır.
 *  root:           true/false Root özelliği this marker'ını ifade etmektedir. İşlem yapılacak nesnelerin direk kendisinide kapsayıp kapsamayacağını belli etmek için eklendi.
 *                             Örneğin float this, inline this tanımlamasında olduğu gibi tanımlamaların yapılıp yapılmayacağını belli eder
 *                             Style oluşturulmaları sırasında kullanılmaktadır. Yani ilgili methodumuz gelen selector adına --- 'selectorName'.this --- gibi ibareleri ekler
 * 
 *  children        true/false Root özelliğinde olduğu gibi ancak "in" ifadesi için kullanılmaktadır ve float in, inline in gibi ifadelere maruz kalıp kalamayacağını belli eder. İhtiyaç yoksa false işaretlenmelidir.
                               Style oluşturulmaları sırasında kullanılmaktadır. Yani ilgili methodumuz gelen selector adına --- 'selectorName'.in > * --- gibi ibareleri ekler
 * 
 *  each            true/false Selector nesnemiz de before ve init methodları bulunmaktadır. Bazı durumlarda ya da yeni ekleyeceğimiz bu selector nesnemizde before ve init nesnelerini...
 *                             Sayfa yüklendiğinde veya sayfa yüklenirken çalıştırmak istemeyebiliriz. Bu durumda each alanını false yaparak istisnai hale getirebilir ve sadece biz methodlarını çağırdığımız yerden
 *                             çalışmasını isteyebiliriz.
 * 
 *  before          function   Sayfa yüklenmeden önce yapılması istenen işlemler
 *  init            function   Sayfa yüklendiğinde yapılması istenen işlemler
 * 
 * }
 * 
 * 
 */



Selectors.add = function add(name, selectorObj) {

    Selectors.Values[name] = selectorObj;

}


Selectors.constructor = {}




/**
 * 
 * Bu alan yukarıdaki tanımlamalardan tamamen bağımsızdır
 * Bu method sadece start nesnesinden çağrıldığında işletilecektir.
 * 
 */

Selectors.constructor.run = function run() {


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

    for (var i in Selectors.Values) {

        var v = Selectors.Values[i];

        //Before methodu varsa ve each değeriyle sorgulama işlemine alınmak isteniyorsa
        if (v.before && v.each)
            v.before();

        //Sayfa ve dosya yüklendiğinde çalıştırılacak veya yapılacak işlemler. Eğer init methodu varsa çalışırır.
        if (v.init)
            Listener(window, 'load', v.init);
    }


    /**
     * Selector nesnesi içerisinde bulunan seçici adlarıyla, screens nesnesi içerisindeki değerler birleştirilerek, aşağıdaki örnek çıktılar sayfa boyutlarına göre oluşturulmaktadır
     * 
     * Örnek 'tab' screen çıktısı:
     * 
     * @media screen and (max-width:980px){
     *  .float.this.tab1,.float.in.tab-1>*,.inline.this.tab1,.inline.in.tab-1>*,.table.this.tab1,.table.in.tab-1>*{width:8.3333%}
        .float.this.tab2,.float.in.tab-2>*,.inline.this.tab2,.inline.in.tab-2>*,.table.this.tab2,.table.in.tab-2>*{width:16.6667%}
        .float.this.tab3,.float.in.tab-3>*,.inline.this.tab3,.inline.in.tab-3>*,.table.this.tab3,.table.in.tab-3>*{width:25%}
        .float.this.tab4,.float.in.tab-4>*,.inline.this.tab4,.inline.in.tab-4>*,.table.this.tab4,.table.in.tab-4>*{width:33.3333%}
        .float.this.tab5,.float.in.tab-5>*,.inline.this.tab5,.inline.in.tab-5>*,.table.this.tab5,.table.in.tab-5>*{width:41.6667%}
        .float.this.tab6,.float.in.tab-6>*,.inline.this.tab6,.inline.in.tab-6>*,.table.this.tab6,.table.in.tab-6>*{width:50%}
        .float.this.tab7,.float.in.tab-7>*,.inline.this.tab7,.inline.in.tab-7>*,.table.this.tab7,.table.in.tab-7>*{width:58.3333%}
        .float.this.tab8,.float.in.tab-8>*,.inline.this.tab8,.inline.in.tab-8>*,.table.this.tab8,.table.in.tab-8>*{width:66.6667%}
        .float.this.tab9,.float.in.tab-9>*,.inline.this.tab9,.inline.in.tab-9>*,.table.this.tab9,.table.in.tab-9>*{width:75%}
        .float.this.tab10,.float.in.tab-10>*,.inline.this.tab10,.inline.in.tab-10>*,.table.this.tab10,.table.in.tab-10>*{width:83.3333%}
        .float.this.tab11,.float.in.tab-11>*,.inline.this.tab11,.inline.in.tab-11>*,.table.this.tab11,.table.in.tab-11>*{width:91.6667%}
        .float.this.tab12,.float.in.tab-12>*,.inline.this.tab12,.inline.in.tab-12>*,.table.this.tab12,.table.in.tab-12>*{width:100%}
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

    var key_ = Keys(Screens.Values);

    key_._each(function _each(key) {

        //İşlemler sırasında oluşturululan @media screen değerleri buraya kaydedilecek
        var cache = [];

        //Piece değeri kadar döngü oluşturur. Bilindiği üzere Piece değeri sayfada oluşturulacak maksimum parça değerini simgeler
        for (var n = 1; n <= Screens.Piece; n++) {

            var z = [];

            /**
             * Seçicileri bir döngü içerisinde ele alıp
             * Gelen her bir değeri this ve in işaretleyicilerle birleştiriyoruz
             * 
             * Örnek çıktı:
             * .float.this.web1
             */

            for (var i in Selectors.Values) {
                var x = Selectors.Values[i];
                //console.log(x);
                if (x.root && x.selector)
                    z.push(Format('.{0}.this.{1}{2}', i, key, n));

                if (x.children && x.selector)
                    z.push(Format('.{0}.in.{1}-{2}>*', i, key, n));



            } //floats


            /**
             * Z Array nesnesine eklenen çıktıyı formatlayarak yeni bir çıktı elde ediyoruz
             * 
             * Örnek çıktı:
             * .float.this.web1,.inline.this.web1,.table.this.web1{width:8.3333%}
             */


            cache.push(Format('{0}{width:{1}%}', z.join(','), Screens.screenCalc(n)));
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

        Selectors.Values.all.before(key, cache);



        /**
         * Son olarak @media screen and ekran boyutumuzu oluşturuyoruz ve ilgili değerleri içerisine yüklüyoruz
         * 
         */
        Kakao.result.push(Media.Create(Screens.Values[key], cache.join('\n')));



    })

    /**
     * Sayfa üzerinde head kısmına <style></style> nesnesi oluşturuyoruz
     * Oluşturulan nesne içerisine Kakao.result değişkeni içindeki değerleri aktarıyoruz 
     */
    var sty = document.createElement('style');
    sty.innerHTML = Kakao.result.join('\n');
    document.head.appendChild(sty);


    /**
     * //////////////////////////////////////////
     * ////////// SELECTOR END //////////////////
     * //////////////////////////////////////////
     */





}


Plugins.add(Selectors);
Kakao.Dom = {

    /**
     * <param element adı>
     * @DOM.create
     * @Return örnek <div></div>
     * @Return örnek <div style="display:block;....."></div>
     * @Return örnek <div id="..." onclick="..." style="..."></div>
     */


    create: function(el, arr) {

        /**
         * 
         * 'el' parametresi bizim oluşturulacak elementimizin tipi olmaktadır
         * Bunlar div, span, input vs olabilir
         *  
         * Arr parametresi ise oluşturulacak el elementinin attribute'lerini yani özelliklerini barındırmaktadır
         * Arr parametresi Object Array tipinde olabilir. Yani JSON tipinde değer olmalıdır
         * Arr parametresi zorunlu bir karşılık değildir.
         * Arr parametresinde gönderilecek örnek değerler
         * <Input /> nesnesi için örnek
         * Parametre:
         * 
         *      {
         *          style:{
         *                  width:'100%',
         *                  padding:'5px'
         *              },
         *          id:'haber-context',
         *          required:'required'
         *      }
         * 
         * Kullanım:
         * DOM.create('div',{style:{display:'block',padding:'10px'},id:'haber-context'})
         * 
         * Çıktı:
         * <div id="haber-context" style="display: block; padding: 10px;"></div>
         * 
         */

        el = document.createElement(el);

        /**
         * Gelen arguman nesnesi kontrol ediliyor
         * Eğer undefined veya null değilse işleme alınıyor
         * Arguman nesnesi mutlak Object Array tipinde olmalı
         */

        if (arr && isObj(arr)) {


            /**
             * Argumanı döngüye sokuyoruz
             * Döngü içerisinde de bir takım kontroller yapılıyor
             */

            foreach(arr, function(i, v, k) {



                /**
                 * <param i:index> => sıra numarası
                 * <param v:value> => değer
                 * <param k:key>   => anahtar kelime
                 * 
                 * 
                 * 
                 * 
                 * Gelen v değeri de bir Object Array nesnesi olabilir
                 * Buna örnek bir nesnenin style özelliği gösterilebilir
                 * style attribute özelliği bilindiği gibi birden fazla key ve value değeri içerebilir
                 * örneğin nesneye v id özelliğini çağır demişken, v style olması durumunda
                 * style'in v değeri {display:'block',position:'absolute'} vs gibi bir çok ad'a sahip olabilir
                 * elbette eğer geliştirici tarafından id özelliğine style özelliğinde olduğu gibi bir çok ad gönderilirse hata oluşacaktır
                 */

                if (!isObj(v)) {

                    /**
                     * Gelen b tipi Object Array tipinde olmadığı için
                     * k değeri ile el nesnesinin direk o ilgili özelliğine atama yapılıyor
                     * örnek : k değeri 'id','attribute','style' vs gibi isimler olabilir
                     * gelen k değerinin aktarımı el[k] => el.id = v => <div id='valuename'></div> şeklinde uygulanacaktır
                     * 
                     * Örnek:
                     * el değeri => div 
                     * k değeri => id 
                     * v değeri => haber 
                     * 
                     * Çıktı:
                     * <div id="haber"></div>
                     */

                    el._attr(k, v);
                }

                /**
                 * 
                 * Bu noktada style gibi Object array tipindeki veriler işlenecek
                 * Ancak gelen her Object array tipli nesne style özelliği olmak zorunda değildir
                 * Belki style olmayan ve value özelliğine ilgili datanın aktarılması istenebilir
                 * Örneğin gelen veri şöyle olsun
                 * 
                 * {ad:'KEREM',soyad:'YAVUZ'}
                 * 
                 * Böyle bir durumda buradaki veriler bir style özelliğine ait veriler değil.
                 * Bu gibi veriler direk olarak belirtilen k = key değerinin içeriği olabilir
                 * örnek:
                 * <div data-name="{ad:'KEREM',soyad:'YAVUZ'}"></div>
                 * 
                 * Geliştirici bu verileri buradan kullanarak işlem yapmak isteyebilir.
                 * Bu yüzden işlem önceki kontrol ekliyoruz
                 * 
                 */
                else if (isObj(v)) {

                    /**
                     * Gelen key değeri bizim DOM.attr nesnesi içerisinde aynı ad'a sahip bir eleman var mı buna bakar
                     * Örneğin key değeri 'style' olsun. bu özellik nesnenin bir özelliği olduğundan,
                     * DOM.attr içinde ki bu key tanımlı method çalıştırılacaktır. Eğer yoksa içerik direk olarak el nesnesinin özelliği olarak atanacaktır
                     */

                    //Dom.attr nesnesinde gelen key değeri varsa DOM.attr[key]() methodunu çalıştır.
                    if (Dom.attr[k]) {

                        Dom.attr[k](el, v);

                    }

                    /**
                     * Dom.attr nesnesi içerisinde gelen key değeri yok
                     * Gelen veriyi key özelliğinin value değeri olarak atayalım
                     * <div data-name="{ad:'KEREM',soyad:'YAVUZ'}"></div>
                     */
                    else {
                        el._attr(k, JSON.stringify(v));
                    }

                }



            }, 0)

            //Endforeach




        } //Endif


        //Oluşturulan nesneyi geri döndür
        return el;

    },





    /**
     * @DOM.attr
     * Bir nesnedeki sabit özelliklerin kontrolü bu alanda sağlanacak
     * Bu sayede nesneye ait özellikler özelleştirilebilir
     */
    attr: {

        /**
         * el nesnesinin style özelliği tetiklendiğinde bu alan işletilecektir
         * burada ki style adı div,span vb gibi 'style' özelliğindeki isimdir
         * kontroller sırasında buradaki gerçek isimler kontrol edilecektir.
         * Nesnenin sahip olduğu gerçek isimler bu alanda tanımlanmalıdır
         */

        style: function(el, s) {
            //index,deger,ozellik
            foreach(s, function(i, v, k) {

                //key değerindeki a-z-A-Z aralığının dışındaki tüm karakterleri temizleyerek işleme alır
                el.css(k, v);

            })

        }
    }

}
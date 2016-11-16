//Kakao.js start
var Kakao = (function() {

    function Kakao() {
        this.result = [];
    }

    return new Kakao();
})()
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

        if (arr && Kakao.isObj(arr)) {


            /**
             * Argumanı döngüye sokuyoruz
             * Döngü içerisinde de bir takım kontroller yapılıyor
             */

            Kakao._for(arr, function(i, v, k) {



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

                if (!Kakao.isObj(v)) {

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
                else if (Kakao.isObj(v)) {

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
            Kakao._for(s, function(i, v, k) {

                //key değerindeki a-z-A-Z aralığının dışındaki tüm karakterleri temizleyerek işleme alır
                el.css(k, v);

            })

        }
    }

}
Kakao.filter = {

    /**
     * Gelen verinin ilk harflerini büyük yapmak için oluşturuldu.
     * 4 adet parametre almaktadır
     * <param string>
     * <param split>
     * <param startindex>
     * <param charcount>
     * 
     * param string     :  Gelen veriyi temsil etmektedir
     * param split      :  Parçalanması istenen karakter. boşluk, tire, alt tire,a,b,c,d gibi. Varsayılan olarak boşluktur
     * param startindex :  Split edilmiş parçaların kaçıncı indexinden itibaren büyütme işlemi gerçekleştireceğini belirtir. Varsayılan olarak 0'dır
     * param charCount  :  Parçalanmış verilerden gelen sıradaki değerin, baştan kaç karakterinin büyütüleceği değerini alır. Varsayılan olarak 1'dir
     */

    capitalize: function(str, split, startindex, charCount) {

        split = split || ' ';
        startindex = (startIndex = startindex || 0) < 0 ? 0 : startindex;
        charCount = (charCount = charCount || 1) < 1 ? 1 : charCount;
        var s = str.split(split);
        for (var i = startindex, l = s.length; i < l; i++) {
            s[i] = s[i].slice(0, charCount).toUpperCase() + s[i].slice(charCount);
        }

        return s.join(split);
    },

    /**
     * Sadece style $css özelliğinde kullanılmak üzere tasarlandı
     * Amacı $css ile yeni özellikler eklenmek istendiğinde '-' tire ile tanımlanmış alanları CSS style özelliğine çevirmektedir
     * Örneğin $css('padding-top') gibi bir veri geldiğinde aradaki - işareti silinip, 'top' verisininde baş harfi büyük yapılarak birleştirmesidir
     * Çıktı : paddingTop yada borderTop, backgroundColor gibi... 
     */

    style: function(a) {
        return filter.capitalize(a, '-', 1).replace(/\-/g, '');
    },

    /**
     * Arguments nesnesini array tipine çevirir
     * <param arguments>
     * Bu method arguments almaktadır ancak methoda gelen arguments değerlerinin sadece ilk ikisini kabul ediyoruz
     * args[1] = start
     * args[2] = end 
     * değerlerini içerecektir. Yani bizden bir arguments nesnesini arraya çevirmemiz istendiğinde start ve end değerleriyle de slice yapabileceğiz
     */
    toArray: function(args) {
        var n = [];
        var s = parseInt(arguments[1] ? arguments[1] : 0);
        var e = parseInt(arguments[2] ? arguments[2] : args.length);
        for (var i = s; i < e; i++) {
            n.push(args[i]);
        }
        return n;
    }


}
/**
 * 
 * ForEach ile istediğimiz şekilde döngü oluşturalım
 * 
 * <param array>  =>  döngü listesi   
 * <param function> => döngü sırasında çalıştırılacak method
 * <param start index>  => döngünün kaçıncı index numarasından itibaren işleneceği
 */
Kakao._for = function foreach(arr, func, inx) {

    /**
     * <param inx değeri varsayılan olarak 0'dır
     * param func ile işlem sırasında çalıştırarak geri değerleri döndürüyoruz
     */
    inx = inx || 0;

    //Sadece Object array tipinde nesneler
    if (Kakao.isObj(arr)) {

        //Başlangıç index numarası
        var _index = 0,
            n = 0;

        if (arr.length)
            for (var i = 0; i < arr.length; i++) {
                if (i >= inx) {
                    func(i, arr[i]);
                }
            }
        else {
            var i = 0;
            for (var n in arr) {

                func(i, arr[n], n);
                i++;

            }
        }

    }



    /**
     * Array tipi nesneler için ayıklama işlemi
     */
    else if (Kakao.isArr(arr)) {

        for (var i = inx, n = arr.length; i < n; i++) {

            //Invoke
            func(key, arr[i]);
        }

    } else
        console.log(arr + ' Object ve Array tipinde bir nesne değil');

}
/**
 * Format ile gelen bir veriyi istenen şekile çevirir
 * 
 * <param format veri>
 * <noreq arguments>
 */

Kakao.format = function format(f) {


    /**
     * 
     * @Kullanım 
     * format('{0} tarihinde {1} tarafından yapıldı','10:11:2012','Kerem YAVUZ')
     */

    //a : index, b: value
    Kakao._for(arguments, function(a, b) {
        f = f.replace(Kakao.regx('\\{' + (a - 1) + '\\}'), b);
    }, 1)

    return f;

}

/**
 * <param format>
 * <param arguments>
 * 
 * Repeat methodu ile f parametresindeki değerler, arguments nesnesi sayısında tekrar ettirilir
 * Repeat methodu örnek kullanımı
 * 
 * Gönderilen format parametresi : "Merhaba {}"
 * Gönderilen arguments parametresi : "Ahmet","Mehmet","Hüseyin"
 * 
 * Çıktı : Array [] 
 * Merhaba Ahmet
 * Merhaba Mehmet
 * Merhaba Hüseyin
 * 
 */

Kakao.repeat = function repeat(f) {

    if (arguments.length <= 1) return;
    var args = Kakao.isObj(arguments[1]) ? arguments[1] : Kakao.filter.toArray(arguments, 1);
    var n = [];
    Kakao._for(args, function(a, b, c) {
        n.push(f.replace('{}', b));
    });

    return n;
}
/**
 * Nesne tipleri ile ilgili dönüşüm bilgilerini alacağımız methodlar
 * @isFunc
 * @isArr
 * @isObj
 * @isNum
 * @isNaN
 * @isStr
 */

//Sadece fonksiyon tipler
Kakao.isFunc = function isFunc(a) {
    if (!a) return false;
    return typeof a === 'function';
}

//Sadece array tipler
Kakao.isArr = function isArr(a) {
    if (!a) return false;
    return typeof a === 'array';
}

//Sadece object array tipler
Kakao.isObj = function isObj(a) {
    if (!a) return false;
    return typeof a === 'object';
}

//Sadece numeric tipler
Kakao.isNum = function isNum(a) {
    if (!a) return false;
    return typeof a === 'number';
}

//Sadece numeric olmayanlar tipler
Kakao.isNaN = function isNaN(a) {
    if (!a) return false;
    return a == Number.isNaN;
}

//Sadece string tipler
Kakao.isStr = function isStr(a) {
    if (!a) return false;
    return typeof a === 'string';
}
Kakao.media = {

    /**
     * 
     * @Media
     *  
     * <param genislik değeri>
     * <param içerik>
     * 
     * Kullanım:
     * media.create(300,'.maden{display:block;}')
     * 
     * Çıktı:
     * "@media screen and (max-width:300px){.maden{display:block;}}"
     * 
     * 
     */
    create: function(g, i) {
        if (!Kakao.isNum(g) || g < 1) return i;
        return Kakao.format('@media screen and (max-width:{0}px){{1}}', g, i);
    }
}
/**
 * 
 *  Object array nesnesindeki özellikleri ve value değerlerini alabilmemizi sağlayan methodlar
 * 
 */


Kakao.objects = {


    /**
     * 
     * Key veya value değerlerini veren methodlar
     * 2 parametre almaktadır. 
     * <param nesne>
     * <param tip>
     * 
     * param nesne  : İçeriği temsil etmektedir
     * param tip    : True veya false değer almaktadır. Varsayılan olarak false'dir.
     * 
     * Tip parametresinin false olması keys değerlerini al, true ise sadece value değerleri al demektir
     * 
     */
    key: function(n, tp) {

        //@Return
        var u = [];

        //Eleman sayısı kadar devam eder
        for (var i in n) {

            //Özelliklerden sadece Object ve String tipindekileri alıyoruz. Yani fonksiyon olmayan değerleri.
            if (!Kakao.isFunc(n[i]))
                u.push(!tp ? i : n[i]);
        }

        //@Return 
        return u;
    },



    /**
     * 
     * @object.keys şeklinde çağrılmaktadır
     * <param icerik>
     * i parametresi ile methoda object array nesnesi gönderilmektedir
     * 
     */
    keys: function(i) {
        return Kakao.objects.key(i);
    },



    /**
     * 
     * @object.values şeklinde çağrılmaktadır
     * 
     * <param icerik>
     * i parametresi ile methoda object array nesnesi gönderilmektedir
     * 
     */
    values: function(i) {

        /** 
         * 
         * <param içerik>
         * <param tip>
         * 
         * Tip olarak da value değerlerini almamızı sağlamak için true değeri gönderiliyor
         * 
         */
        return Kakao.objects.key(i, true);
    },

    extend: function(obj1, obj2) {
        for (var i in obj2) {
            obj1[i] = obj2[i];
        }
    }
}
/**
 * 
 * Regex oluşturma işlemleri için kullanılacak
 * Basit olarak ilgili methodlar içinde new RegExp olarak kullanabilirdik
 * Ancak bir parametre yardımıyla istediğimiz model(pattern) değerini yollayıp bizim için dönüştürmesini sağlayacağız
 * <param pattern>
 */


Kakao.regx = function(p) {

    /**
     * @return
     * örnek gelen pattern değeri : [^\d]+
     * 
     * Çıktı: /[^\d]/gi
     * 
     */
    var args = arguments[1];

    if (!args && args == undefined)
        return new RegExp(p, 'gi');
    else if (!args && args === false)
        return new RegExp(p);
    else if (args)
        return new RegExp(p, args);
}
/**
 * 
 * Element nesnelere style ve attribute özellikleri atamak için methodlar oluşturuldu
 * Element.each
 * Element.css
 * Element.removeAttr
 * Element.attr
 * Element.class
 * Element.removeClass
 * 
 */



Kakao.style = {


    /**
     * 
     * Bu method diğer iki methodu destekleme amacıyla oluşturuldu
     * Sadece bu iki method içerisinde çağrılmakta olup, başka dosyalardan çağrılmamıştır
     * 
     * <param object>
     * <param liste>
     * <param tip>
     *  
     */
    each: function(obj, list, attr) {


        /**
         * 
         * Döngü içerisinde ilgili obj nesnesinin attr özelliği çalıştırılmaktadır
         * Attr parametresi diğer iki methoddan gelen css ve attr gibi isimleri döndürmektedir
         * Bu isimler ilgili methodların key isimleri ile aynıdır. Yani bu dosyadaki style.css, style.attr tanımlamalarıdır.
         * Parametre olarak gelen bu iki değeri, obj nesnesi özelliklerinde aratıp, method olarak çağırabilmekteyiz.
         * Çağırdığımız bu methoda ilgili parametrelerde gönderilerek çalıştırılması sağlandı.
         * Kısaca, obj nesnesi tarafından çağırılan bu alan tarafından tekrar kendisi çağırılmaktadır
         */


        Kakao._for(list, function(a, b, c) {

            //Obj nesnesinin gelen attr özelliği bulunup bir method gibi çalıştırılmaktadır.
            obj[attr](c, b);

        })
    },





    /**
     * CSS özellikleri eklenirken aşağıdaki bazı değerler px vs gibi ekler almamakta.
     * Bu yüzden sadece sayısal değer aktarımlarında eğer name kısmı bu listede dışında bir kelime gelirse varsayılan olarak px değeri atanacak.
     * Buradaki veriler sadece kontrol amaçlığıdır. Başka yerden çağırılmamaktadır.
     * Kullanım yeri css methodudur. Örnek css('opacity',0) gibi bir 'opacity' değer geldiğinde bu alana px değeri eklenmeyecektir.
     */
    isNumber: {
        "animationIterationCount": true,
        "columnCount": true,
        "fillOpacity": true,
        "flexGrow": true,
        "flexShrink": true,
        "fontWeight": true,
        "lineHeight": true,
        "opacity": true,
        "order": true,
        "orphans": true,
        "widows": true,
        "zIndex": true,
        "zoom": true

    },


    /**
     * İlgili nesneye sınıf eklemek için kullanılacak
     */
    class: function(arr) {
        var self = this;

        if (arguments.length >= 2)
            arr = filter.toArray(arguments);

        if (Kakao.isObj(arr) || Kakao.isArr(arr)) {
            arr.forEach(function(item) {
                self.classList.add(item);
            })
        } else {
            self.classList.add(arr);
        }
        return self;
    },
    /**
     * İlgili nesneden belirtilen sınıfları siler
     */
    removeClass: function() {
        for (var i = 0; i < arguments.length; i++) {
            this.classList.remove(arguments[i]);
        }
        return this;
    },


    /**
     * 
     * @Element.css
     * 
     * @Element.css('display','block');
     * @Element.css({'display':'block','position':'absolute'})
     * @Element.css('display') @return 'block';
     * 
     * @Element.css('...').css('...').css('...')
     * 
     * İlgili nesneye yeni style özellikleri tanımlar
     * <param name>     : 'display'
     * <param value>    : 'block'
     * 
     */
    css: function(name, value) {


        /**
         * Gelen name değeri bir Object Array nesnesimi kontrol et
         * Eğer bir Object Array nesnesi ise önce each methoduna gönderilerek
         * O bize değeri tekrar buraya tek tek gönderecek ve biz de işleyeceğiz
         */

        if (Kakao.isObj(name))
            style.each(this, name, 'css');



        /**
         * Gelen name değeri string bir değer ise ve value değeri boş ise, tanımlanmamışsa
         * O halde sadece ilgili nesnenin name özelliğinin değerini geriye döndür
         */

        if (Kakao.isStr(name) && !value) {


            //Önce normal şekilde bak var mı, varsa döndür
            if (this.style[name]) return this.style[name];

            //Eğer Internet Explorer kullanılarak çağılıyorsa ve varsa döndür
            if (this.currentStyle) return this.currentStyle[name];

            //Diğer tarayıcılar tarafından bağlanıyorsa ve her halukarda döndür
            return window.getComputedStyle(this, null).getPropertyValue(name);


        }





        /**
         * name ve value özellikleri mutlak string ise
         * ilgili bilgileri ilgili nesne özelliğinde oluştur
         */


        if (Kakao.isStr(name) && value) {

            //Örnek 'border-left-width' gibi gelen değeri 'borderLeftWidth' olarak değiştirir.
            var y = Kakao.filter.style(name);

            this.style[y] = value + (Kakao.isNum(value) ? Kakao.style.isNumber[y] ? '' : 'px' : '');
        }

        //ilgili nesnenin kendisini tekrar geriye döndür

        return this;
    },





    /**
     * 
     * @Element.attr
     * 
     * @Element.attr('id','objectname');
     * @Element.attr({
     *                  'data-number':'10',
     *                  'data-obj':'{ad:"KEREM",soyad:"YAVUZ"}',
     *                  required='required'
     *              });
     * 
     * @Element.attr('id') @return 'objectname';
     * @Element.attr('...').attr('...').attr('...')
     * 
     * İlgili nesneye yeni style özellikleri tanımlar
     * <param name>     : 'display'
     * <param value>    : 'block'
     * 
     */
    attr: function(name, value) {

        /**
         * Gelen name değeri bir Object Array nesnesi mi kontrol et
         * Eğer bir Object Array nesnesi ise önce each methoduna gönderilecek
         * O bize değeri tekrar buraya tek tek gönderecek ve biz de işleyeceğiz
         */

        if (Kakao.isObj(name))
            Kakao.style.each(this, name, 'attr');


        /**
         * Gelen name değeri string bir değer ise ve value değeri boş ise
         * O halde sadece ilgili nesnenin name özelliğinin değerini geriye döndür
         */

        if (Kakao.isStr(name) && !value)
            return this.getAttribute(name);



        /**
         * name ve value özellikleri mutlak string ise
         * ilgili bilgileri ilgili nesne özelliğinde oluştur
         */
        if (Kakao.isStr(name) && Kakao.isStr(value))
            this.setAttribute(name, value);

        //Her durumda nesnenin kendisini tekrar geriye döndür
        return this;
    },
    /**
     * İlgili nesneden belirtilen attribute değerlerini siler
     */
    removeAttr: function(name) {
        for (var i = 0; i < arguments.length; i++) {
            this.removeAttribute(arguments[i]);
        }
        return this;
    },


}

Element.prototype._css = Kakao.style.css;
Element.prototype._attr = Kakao.style.attr;
Element.prototype._removeAttr = Kakao.style.removeAttr;
Element.prototype._class = Kakao.style.class;
Element.prototype._removeClass = Kakao.style.removeClass;
Element.prototype._listen =
    Document.prototype._listen =
    Window.prototype._listen = function(e, m) {
        if (this.addEventListener)
            this.addEventListener(e, m, false);
        else
            this.attachEvent('on' + e, m);
    }
//Sayfadaki varsayılan ayrılacak parça sayısı
Kakao.piece = 12;


/**
 * Sayfa üzerinde kullanılacak varsayılan ekran boyutları listesi
 * web : 0 değeri diğer boyutların devreye girmediği tüm boyutlarda işletilmesini belirtir.
 * Değerler ve tanımlamalar değeri en yüksekten en aşağıya doğru belirtilmelidir.
 */

Kakao.screens = {
    'all': 0,
    'web': 980,
    'tab': 800,
    'mob': 640,
    'min': 480
}


/**
 * <param piece>
 * Gelen n değeri işlemdeki 1,2,3,4,5 vs gibi sayısal veriyi nitelemektedir.
 * Methodun amacı, gelen n değerinin toplam piece maksimum değerine oranını hesaplamak
 * Çıktı olarak yüzdesel değer vermektedir.
 * 
 * Girdi:
 * 2
 * Çıktı:
 * 16.6667
 * 
 */

Kakao.screenCalc = function(n) {
    var z = (100 / Kakao.piece * n),
        fixed = z % 1 === 0 ? 0 : 4;
    return (100 / Kakao.piece * n).toFixed(fixed);
}
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
        Kakao._for(Kakao.markers.names, function(a, i, c) {

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
     * <param HTMLElement Array>
     * <param [this,in,all,any]
     * Gelen type değerine göre Kakao.markers.names[type] nesnesi içinde tanımlanan nesne listesi içinde arama yapar
     * Bu liste içerisinde ilgili HTMLElement nesnesinin class değerleri içindeki aynı olan değerleri alır
     * Bulunan değerler [...] ilgili referans gösterilen nesnenin class değerlerine eklenmek üzere geri döndürülür
     */
    getSameClass: function(obj, type) {

        //Type değerinin "any" olması durumunda nesneye ait class değerlerinin tamamı geri döndürülür
        if (!Kakao.markers.names[type]) return obj.classList;

        //@Return nesnesi 
        var re = [];

        //Gelen type değerini ilgili nesne class değerleri içinde kontrol ederek benzer sınıf adlarını alalım
        obj.classList.Kakao._for(function(item, i) {

            if (Kakao.markers.names[type].indexOf(item) != -1)
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

        var n = document.querySelectorAll('.' + _self.reffName);
        if (n && n.length > 0) {
            var _ref = Kakao.reference.getSameClass(_self, refName);

            if (_ref)
                n.foreach(function(item, index) {
                    item._class(_ref);
                    item.classList.remove(_self.reffName);
                });
        }
    },


    'constructor': {
        onload: function() {


            //Sayfa üzerindeki tüm referens nesnelerini arar
            var n = Kakao.reference.search();

            //Arama sonucu gelen nesne boş veya liste sayısı 0'sa işlemi iptal et
            if (!n || n.length == 0) return;

            //İlgili nesne içerisinde tam istediğimiz ref- sınıf adı varsa alalım
            var match = regx('ref\\-(' + objects.keys(Kakao.markers.names).join('|') + ')\\-(\\w+)');


            n.forEach(function(item, index) {

                // Sıradaki nesneye ait sınıf değerleri içinde ilgili pattern modelini aratalım
                var get = item.className.match(match);

                //İstenilen pattern mutlaka en az 1 tane varsa işleme devam et
                if (get || get.length > 0) {

                    //Pattern değerine ait tüm değerleri sırasıyla işleme al
                    get.Kakao._for(function(a) {

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
                            Kakao.reference.table.push({ name: grp[2], ref: grp[1], obj: item });

                            //İlgili nesneden [0]'ncı değeri yani gelen ['ref-in-sınıfadi'] değerini siler
                            item.classList.remove(grp[0]);

                            //Bu nesneye daha önce getReference methodu eklenmemişse devam et
                            if (!item.getReference) {

                                //getReference methodu oluştur ve varolan method ile eşle
                                item.getReference = Kakao.reference.getReference;

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

                Kakao.reference.table.foreach(function(item, i) {

                    item.obj.getReference(item.name);

                });

            });


        }
    }

}
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
Kakao.grid = {

    /**
     * Row nesneleri içerisinde yeni column nesneler oluşturmaktadır
     */
    createCol: function(a) {
        var e = Kakao.Dom.create('div');
        Kakao.grid.createLabel(a, e);
        e.appendChild(a);
        return e;
    },

    /**
     * İstenen root nesne içerisinde label nesnesi ve içeriği oluşturuluyor
     */
    createLabel: function(a, target) {
        //Label değeri varsa işleme al
        var lbl = a._attr('data-label');
        if (lbl) {

            //Label oluştur
            var c = Kakao.Dom.create('label')
                ._class('data-col-label')
                ._removeAttr('data-label');

            //Label değerini innerHTML olarak ata
            c.innerHTML = lbl;

            //Label nesnesini istenen root nesnesine ata
            target.appendChild(c);
        }
    },

    /**
     * Belirtilen nesneye ait çocuk nesnelerin sahip olduğu data-screen değerleri bu alanda işlenerek
     * parent nesnesine ilgili değerler uygulanmaktadır
     */
    addScreen: function(children) {

        //Her bir cocuk nesnesinde data-screen değerini aranıyor
        for (var n = 0; n < children.length; n++) {

            //İlgili sıradaki nesneyi alır
            var chl = children[n];

            //Nesne içinde data-screen ifadesi var mı bakar
            var datascreen = chl.children[chl.children.length - 1]._attr('data-screen');

            //Eğer data screen ifadesi yoksa yani boşsa varsayılan olarak sutun sayısı kadar web değeri atar
            if (!datascreen) {
                children[n]._class('web' + piece / children.length)
            }
            //Eğer data screen özelliği bir değere sahipse ve string ifade barındırıyorsa
            else if (datascreen && typeof datascreen === 'string') {
                children[n]._class(datascreen.split(' '));
            }
        }
    },

    //Children nesnelere toplu değer atamaları yapılır
    addClassToChildren: function(children) {
        for (var i = 0; i < children.length; i++) {
            children[i]._class(Kakao.filter.toArray(arguments, 1));
        }
    },


    'constructor': {

        onload: function() {

            var _grids = document.querySelectorAll('[data-grid]');
            if (!_grids || _grids.length == 0) return;

            foreach(_grids, function(index, a, c) {

                //İlgili nesne içerisindeki maksimum satır sayısı
                var maxRowCount = 0;

                //İlgili nesnenin içindeki çocuk nesne sayısı
                var children = a.children;

                //Çocuk nesnelerin sayısı
                var length = children.length;

                //Oluşturulacak her bir grid satır nesnesi
                var rows = Kakao.Dom.create('div')._class('data-row');

                var colCount = 0;

                //Bir döngü içerisinde tüm cocuk nesnelerin işleyisi bitene kadar 0'ıncı çocuk nesnesi seçilerek devam eder
                while (length > 0) {

                    //Sıradaki çocuk nesnesi. Her seferinde 0 index numaraları nesne seçilir.
                    //Çünkü 0'ıncı nesne işlemi bittiğinde, nesne listeden kaldırılır ve yeni nesneye aktarılır.
                    //Böyle olunca 0'ıncı nesne otomatik olarak değişmiş olacak
                    var item = children[0];

                    //Sıradaki nesnenin row numarasını al
                    var rowNumber = parseInt(item._attr('data-row'));

                    //Row attribute özelliğini kaldır
                    item._removeAttr('data-row');

                    //İşlenen tek bir satıra ait sütun sayısı değerini bir arttır
                    colCount++;

                    //Gelen row değeri maxRowCount değerinden büyükse yeni bir satır oluştur
                    if (rowNumber > maxRowCount) {

                        //Row değerini max değerine eşitle
                        maxRowCount = rowNumber;

                        //Yeni bir satır oluşturmadan önce işlediğin tüm nesnelere sabit tanımlı sınıf isimlerini ata
                        Kakao.grid.addClassToChildren(rows.children, 'inline', 'this', 'grid-col');

                        //İşlenen nesneleri grid nesnesi içine yeni satır olarak ekle
                        a.appendChild(rows);

                        //İlgili nesnede data-screen değerleri varsa uygular, eğer yoksa sütun sayısına eşitler
                        Kakao.grid.addScreen(rows.children);


                        //Sonraki satır için yeni row oluştur
                        rows = Kakao.Dom.create('div')._class('data-row');

                        //İşlenen sütun sayısını sıfırla
                        colCount = 0;
                    }

                    //Hangi satırdaysak, ilgili seçili nesneyi sıradaki satır nesnesine aktar.
                    rows.appendChild(Kakao.grid.createCol(item));

                    //İşlem bittikten sonra, bu nesne ile ilişkisinin bittiğine dair length değeri 1 eksiltiliyor
                    length--;

                    //Eğer length değeri 0 ise ve eğer işlenmiş 1,2 kayıt varsa da onları da ekle
                    if (length == 0) {

                        Kakao.grid.addClassToChildren(rows.children, 'inline', 'this', 'grid-col');

                        //İlgili nesnede data-screen değerleri varsa uygular, eğer yoksa sütun sayısına eşitler
                        Kakao.grid.addScreen(rows.children);

                        a.appendChild(rows);
                    }
                }

            });
        }

    }
}
Kakao.groups = {


    //format : web-inline-6-6, tab-inline-12-12-5-1, tab-map-12-12
    formatR: Kakao.regx('(' + Kakao.objects.keys(Kakao.screens).join('|') + ')\\-(' + Kakao.getOnlySelectors().join('|') + ')(\\-\\d{1,2})+'),


    applyChildren: function(objs, params, values) {
        Kakao._for(objs, function(a, b, c) {
            Kakao.groups.applyChild(b, params, values);

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


        Kakao._for(match, function(a, b, c) {

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

            var params = Kakao.groups.formatR.exec(b);

            //Regex nesne formatımız sabit olduğundan, yani new RegExp demediğimiz için formatın sorgu sırasını 0'a çekiyoruz
            Kakao.groups.formatR.lastIndex = 0;

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
                Kakao.groups.applyChild(obj, params, values);
            }



            //Belirli aralıktaki nesnelere uygulama yapalım
            else if (next) {

                //* değeri varsa tüm nesneleri seçelim
                if (next && next === '*')
                    next = obj.parentNode.children.length;

                //Değilse sadece belirli sayı aralığındakileri seçelim
                else if (next && Kakao.isNum(next))
                    next = parseInt(next);

                //0dan büyük bir değer olmalı
                if (next >= 0) {


                    var children = Array.prototype.slice.call(obj.parentNode.children);

                    //Şimdi bizim nesnemizin bu ana grup içinde bulunduğu pozisyonun index numarasını al
                    var currentIndex = children.indexOf(obj);

                    //Şimdi de nesnemizin bulunduğu pozisyondan kaç tanesi bu durumdan etkilenecekse, bu grubun listesini ver
                    var t = children.slice(currentIndex, currentIndex + parseInt(next) + 1);

                    Kakao.groups.applyChildren(t, params, values);

                }
            }

        });

    },

    'constructor': {
        onload: function() {


            //web, tab, mob, min
            var keys = Kakao.objects.keys(Kakao.screens);

            //Format : [class*="-map-"], [class*="-inline-"], [class*="-table-"]
            var queryvalue = Kakao.repeat('[class*="-{}-"]', Kakao.getOnlySelectors()).join(',');

            //Sayfa üzerinde ki -map-, -inline-, -table- gibi sınıf adlarına sahip nesneleri seçer
            var selectGroups = document.querySelectorAll(queryvalue);

            if (selectGroups && selectGroups.length > 0)
            //Bulunan her bir nesneyi tek tek işleme al
                Kakao._for(selectGroups, function(a, b, c) {

                    //Sıradaki nesnenin sınıf adlarının listesini string olarak al
                    var className = b.className || b.classList.value;

                    //-map-, -inline-, -table- gibi değerlerle nesneler bulunmuş olabilir ama yeterli değil
                    //ilgili nesnenin sınıf adlarında tam olarak bizim istediğimiz formatta bir sınıf adı varsa işleme alacağız

                    var match = className.match(Kakao.groups.formatR);

                    //Eğer hiç bulunamamışsa bu nesne bize uygun değil demektir
                    if (match == null) return;


                    //İşlem yapıldığına dair işaret koyalım
                    b.groupMatch = match;
                    b.groupTrigger = function() {
                        Kakao.groups.applyMatch(match, b);
                    }

                    //İlgili nesnenin bağlı olduğuğu parent nesnesine group ibaresi ekleyelim
                    b.parentNode.groups = true;

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

                    Kakao.groups.applyMatch(match, b);

                }) //foreach

            //Sayfa üzerinde yeni bir nesne oluşturulduğunda tetiklenecek methodumuz
            document._listen('DOMNodeInserted', function(e) {

                var tr = e.target.parentNode;
                if (tr.groups) {
                    Kakao._for(tr.children, function(a, b) {
                        if (b.groupTrigger)
                            b.groupTrigger();
                    })
                }

            });

        }
    }
}
Kakao.magnets = {

    'formatR': Kakao.regx('(' + Kakao.objects.keys(Kakao.screens).join('|') + ')\-(\\d{1,2})'),



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
            piece: 0
        }

        //Nesneye ait alt çocuklar
        var children = [];
        var length = obj.children.length;
        for (var q = 0; q < length; q++) {
            children.push(obj.children[0].cloneNode(true));
            obj.children[0].remove();
        }
        //Maksimum parca sayısı ör : 4
        var max = Kakao.magnets.getMaxValues(screenSize, 'piece');

        Kakao.magnets.triggerResize(children, obj, screenSize, max);

        window._listen('resize', function() {
            Kakao.magnets.triggerResize(children, obj, screenSize, max);
        });

        window._listen('DOMNodeInserted', function(a) { Kakao.magnets.addNewMagnet(children, a); })

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
                result = o[i].offsetHeight;
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
        if (mgSet && mgSet.status === true && !item.target.isMagnetAvaible && !item.target.dataMagnetItem) {


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
                Kakao.magnets.findLowestObject(parent.children).appendChild(cln);

            } catch (ex) {}
        }
    },


    //Sayfa ilk yüklendiğinde ve ekran boyutlandırıldığında işleyecek method
    //Tüm işlemleri burada yapıyoruz
    triggerResize: function(children, obj, screenSize, max) {



        var pieceCount = Kakao.magnets.findScreenPiece(screenSize);

        //Ekran boyutlandırma sırasında parçalanma bilgisi değişirse uyguluyoruz
        if (obj.magnetSetting.piece != pieceCount) {


            /**
             * data-magnet nesnesi içinde oluşan çocuk nesne sayısı değerini
             * data-magnet nesnemizin setting özelliğine bildiriyoruz
             * 
             */
            obj.magnetSetting.piece = pieceCount;

            //data-magnet nesnesindeki tüm çocuk nesneleri temizleyelim
            Kakao.magnets.removeChildren(obj);


            /**
             * data-magnet nesnesi icerisindeki tüm nesneleri sildikten sonra
             * tekrardan istediğimiz parça sayısı kadar cocuk nesne oluşturuyoruz
             */
            for (var n = 0; n < pieceCount; n++) {
                var u = Kakao.Dom.create('div');
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
                var lowestHeightObj = Kakao.magnets.findLowestObject(obj.children);
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
            values = values.match(Kakao.magnets.formatR);
            Kakao.magnets.formatR.lastIndex = 0;
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
            var scrGroupItem = Kakao.magnets.formatR.exec(matches[z]);
            Kakao.magnets.formatR.lastIndex = 0;


            //İptal edelim
            if (!scrGroupItem || scrGroupItem.length == 0)
                return null;


            //Geliştirici tarafından verilen ekran boyut isimleri, screens nesnesi içindeki özellik adları kontrol ediliyor
            if (Kakao.screens.hasOwnProperty(scrGroupItem[1])) {

                var num = Kakao.screens[scrGroupItem[1]];
                if (num == 0)
                    num = 9999;

                customScreen.push([num, Kakao.piece / scrGroupItem[2]]);

            }

        } //For

        customScreen.sort(function(r, t) { return customScreen[t] - customScreen[r] });

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
                        var scr = y._attr('data-screen').toString();

                        //["web-4", "tab-6", "mob-12"]
                        var scrMatch = Kakao.magnets.getMatches(scr);

                        //Nesnemize ilgili sınıf değerlerini ekleyelim
                        y._class(scr.split(' '))._class(['in', 'map']);

                        //Nesneden data-screen özelliğini kaldıralım
                        y._removeAttr('data-screen');

                        var p = Kakao.magnets.getResizeValues(scrMatch);

                        if (p)
                            new Kakao.magnets.custommagnet(y, p);


                    }

                }

        }
    }
}
/**
 * Geliştirici tarafından ayarlamalar verilirse bunları da ilgili datalara aktaralım
 */
var KS = null;
try {

    var KS = document.querySelector('script[src*="Kakao.package"]');
    KS = KS ? eval(KS._attr('data-setting'))[0] : KakaoSetting;
    if (KS && Kakao.isObj(KS)) {

        try {

            if (KS.Screens && Kakao.isObj(KS)) {
                for (var n in KS.Screens)
                    if (Kakao.screens.hasOwnProperty(n))
                        Kakao.screens[n] = parseInt(KS.Screens)
            }

            if (KS.Piece && Kakao.isNum(KS.Piece))
                Kakao.piece = KS.Piece;

            if (KS.Selectors && Kakao.isObj(KS.Selectors)) {

                for (var n in KS.Selectors)
                    if (Kakao.selectors.hasOwnProperty(n) && !Kakao.selectors.lock) {
                        var x = KS.Selectors[n];
                        Kakao.selectors[n].selector = x;
                        Kakao.selectors[n].root = x;
                        Kakao.selectors[n].children = x;
                        Kakao.selectors[n].children = x;
                        Kakao.selectors[n].each = x;
                    }

            }


        } catch (error) {
            console.log('Kakao Setting nesnesinde hata var');
            console.log(error);
            console.log(KS);
        }

    }

} catch (error) {}
/**
 * Sayfa yüklenmeden önce yapılacak tüm işler ve çalıştırılacak methodlar
 */


Kakao._for(Kakao, function(a, b, c) {

    if (b && b.constructor) {
        if (b.constructor.run)
            b.constructor.run();
        if (b.constructor.onload)
            window._listen('load', b.constructor.onload);
    }

}); //Foreach
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
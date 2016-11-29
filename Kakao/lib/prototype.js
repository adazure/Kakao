var Methods = (function Methods() {

    //İlgili nesneye yeni bir sınıf eklemek için kullanılmaktadır
    //string ve array tipinde değer alabilir
    //arguments olarak da değer verilebilir
    //class(arg1, arg2, arg3, arg4)
    Methods.class = function(arr) {

        var self = this;

        //arguments sayısı 2 ve daha fazlasıyla birden fazla sınıf adı var demektir.
        //Arguments parametreslerini bir dizi ye çeviriyoruz

        if (arguments.length >= 2)
            arr = Filter.toArray(arguments);

        //Eğer gelen değer bir dizi ise devam ediyoruz
        if (isObj(arr) || isArr(arr)) {

            //Dizi sayısı kadar işlemi okuyoruz
            arr._each(function(item) {
                add(self, item);
            })

        } else {

            //Sadece tek bir sınıf adı varsayıyoruz
            add(self, arr);
        }

        function add(o, n) {
            if (o.classList)
                o.classList.add(n);
            else
                o.className += ' ' + n;
        }

        //nesneyi geri döndür
        return self;

    }



    //Arguments parametresinden gelen değerleri ilgili nesnenin sınıf dizisinden siler
    //string ve array tipinde değer alabilir
    //arguments olarak da değer verilebilir
    //class(arg1, arg2, arg3, arg4)
    Methods.removeClass = function() {
        for (var i = 0; i < arguments.length; i++) {
            this.classList.remove(arguments[i]);
        }
        return this;
    }




    /**
     * 
     * @Element._attr
     * 
     * @Element._attr('id','objectname');
     * @Element._attr({
     *                  'data-number':'10',
     *                  'data-obj':'{ad:"KEREM",soyad:"YAVUZ"}',
     *                  required='required'
     *              });
     * 
     * @Element._attr('id') @return 'objectname';
     * @Element._attr('...')._attr('...')._attr('...')
     * 
     * 
     */


    Methods.attr = function(name, value) {

        /**
         * Gelen name değeri bir Object Array nesnesi mi kontrol et
         * Eğer bir Object Array nesnesi ise önce each methoduna gönderilecek
         * O bize değeri tekrar buraya tek tek gönderecek ve biz de işleyeceğiz
         */

        if (isObj(name))
            each(this, name, 'attr');


        /**
         * Gelen name değeri string bir değer ise ve value değeri boş ise
         * O halde sadece ilgili nesnenin name özelliğinin değerini geriye döndür
         */

        if (isStr(name) && !value)
            return this.getAttribute(name);



        /**
         * name ve value özellikleri mutlak string ise
         * ilgili bilgileri ilgili nesne özelliğinde oluştur
         */
        if (isStr(name) && isStr(value))
            this.setAttribute(name, value);

        //Her durumda nesnenin kendisini tekrar geriye döndür
        return this;
    }








    Methods.remove = function() {
        if (this.parentNode)
            this.parentNode.removeChild(this);
    }






    /**
     * İlgili nesneden belirtilen attribute değerlerini siler
     */
    Methods.removeAttr = function(name) {
        for (var i = 0; i < arguments.length; i++) {
            this.removeAttribute(arguments[i]);
        }
        return this;
    }








    Methods._each = function(method) {
        for (var i = 0, len = this.length; i < len; i++) {
            method(this[i], i);
        }
    }





    return Methods;



})()




Element.prototype._attr = Methods.attr;
Element.prototype._removeAttr = Methods.removeAttr;
Element.prototype._class = Methods.class;
Element.prototype._removeClass = Methods.removeClass;
Element.prototype._newline = Methods.newline;
Element.prototype.remove = Methods.remove;
Array.prototype._each = Methods._each;
Object.prototype._each = Methods._each;
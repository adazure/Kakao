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
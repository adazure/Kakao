/**
 * Format ile gelen bir veriyi istenen şekile çevirir
 * 
 * <param format veri>
 * <noreq arguments>
 */


var Format = function Format(f) {

    /**
     * 
     * @Kullanım 
     * format('{0} tarihinde {1} tarafından yapıldı','10:11:2012','Kerem YAVUZ')
     */

    for (var i = 1; i < arguments.length; i++) {
        f = f.replace(Regx('\\{' + (i - 1) + '\\}'), arguments[i]);
    }

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



Format.Repeat = function Repeat(f) {

    if (arguments.length <= 1) return;
    var args = isObj(arguments[1]) ? arguments[1] : Filter.toArray(arguments, 1);
    var n = [];

    for (var i in args) {
        n.push(f.replace('{}', args[i]));
    }

    return n;

}
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
    foreach(arguments, function(a, b) {
        f = f.replace(regx('\\{' + (a - 1) + '\\}'), b);
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
    var args = isObj(arguments[1]) ? arguments[1] : filter.toArray(arguments, 1);
    var n = [];
    foreach(args, function(a, b, c) {
        n.push(f.replace('{}', b));
    });

    return n;
}
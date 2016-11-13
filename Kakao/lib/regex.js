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
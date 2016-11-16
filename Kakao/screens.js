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
var Screens = (function Screens() {

    //Sayfadaki varsayılan ayrılacak parça sayısı
    Screens.Piece = 12;

    /**
     * Sayfa üzerinde kullanılacak varsayılan ekran boyutları listesi
     * web : 0 değeri diğer boyutların devreye girmediği tüm boyutlarda işletilmesini belirtir.
     * Değerler ve tanımlamalar değeri en yüksekten en aşağıya doğru belirtilmelidir.
     */

    Screens.Values = {

        'all': 0,
        'web': 1024,
        'tab': 768,
        'mob': 425,
        'min': 360
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


    Screens.screenCalc = function(n) {
        var z = (100 / Screens.Piece * n),
            fixed = z % 1 === 0 ? 0 : 4;
        return (100 / Screens.Piece * n).toFixed(fixed);

    }



    return Screens;
})()
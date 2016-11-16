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
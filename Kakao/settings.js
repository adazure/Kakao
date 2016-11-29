/**
 * Geliştirici tarafından ayarlamalar verilirse bunları da ilgili datalara aktaralım
 */
var KS = null;
try {

    var KS = document.querySelector('script[src*="Kakao.package"]');
    KS = KS ? eval(KS._attr('data-setting'))[0] : KakaoSetting;
    if (KS && isObj(KS)) {

        try {

            if (KS.Screens && isObj(KS)) {
                for (var n in KS.Screens)
                    if (Screens.Values.hasOwnProperty(n))
                        Screens.Values[n] = parseInt(KS.Screens)
            }

            if (KS.Piece && isNum(KS.Piece))
                Screens.Piece = KS.Piece;

            if (KS.Selectors && isObj(KS.Selectors)) {

                for (var n in KS.Selectors)
                    if (Selectors.Values.hasOwnProperty(n) && !Selectors.Values.lock) {
                        var x = KS.Selectors[n];
                        Selectors.Values[n].selector = x;
                        Selectors.Values[n].root = x;
                        Selectors.Values[n].children = x;
                        Selectors.Values[n].children = x;
                        Selectors.Values[n].each = x;
                    }

            }


        } catch (error) {
            console.log('Kakao Setting nesnesinde hata var');
            console.log(error);
            console.log(KS);
        }

    }




} catch (error) {}
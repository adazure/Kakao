/**
 * Sayfa yüklenmeden önce yapılacak tüm işler ve çalıştırılacak methodlar
 */

foreach(Kakao, function(a, b, c) {

if (b && b.constructor) {
    if (b.constructor.run)
        b.constructor.run();
    if (b.constructor.onload)
        window._listen('load', b.constructor.onload);
}

}); //Foreach



//End Kakao.js
})();
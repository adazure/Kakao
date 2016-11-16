/**
 * Sayfa yüklenmeden önce yapılacak tüm işler ve çalıştırılacak methodlar
 */

console.log(Kakao.Dom);

Kakao._for(Kakao, function(a, b, c) {

    if (b && b.constructor) {
        if (b.constructor.run)
            b.constructor.run();
        if (b.constructor.onload)
            window._listen('load', b.constructor.onload);
    }

}); //Foreach
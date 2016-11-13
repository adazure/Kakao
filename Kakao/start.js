/**
 * Sayfa yüklenmeden önce yapılacak tüm işler ve çalıştırılacak methodlar
 */
Kakao.start = (function() {

    selectors.constructor.run();
    markers.constructor.run();

})()

/**
 * Sayfa ve JS dökümanı yüklendiğinde yapılması iştenen işlemler burada yapılmaktadır
 */
Kakao.load = function() {

    reference.constructor.run();
    grid.constructor.run();
    selectors.constructor.onload();
    groups.constructor.onload();

}


//Sayfa yüklendiğinde
window._listen('load', Kakao.load);
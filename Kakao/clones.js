var Clones = (function Clones() {


    return Clones;
})()



Clones.constructor = {};


//Tüm data-clone nesnelerini bulur
Clones.findClones = function() {
    return document.querySelectorAll("[data-clone]");
}




Clones.applyClone = function applyClone(sample, children) {

    //Ben bana gönderdiğin örnekteki sınıf adlarını
    //Children olarak gönderdiğin listedekilerin hepsine aktardım.
    children._each(function(item) {
        item._class(sample.classList);
    });


    //Şimdi ben örnek gönderdiğin nesnenin çocuk nesnelerini alıp
    //Children nesnesindeki nesnelerin çocuk nesnelerini etkileyeceğim
    for (var i = 0; i < sample.children.length; i++) {

        /**
         * Öncelikle, gelen örneğin çocuk nesnelerini tek tek ele almalıyım,
         * Daha sonra, örnek almak istediğim sıradaki örneğin index numarasını bulmalıyım
         * Örnek : sample.children[0,1,2,3,4,5...];
         * o index numarasını children listesindeki her bir elemanın çocuklarında, o index numarasındaki aratmalıyım
         * children.children[0,1,2,3,4,5....]
         * Bunun için öncelikle bir methodum daha olmalı ve bu methoda sıradaki örneğimi göndermeli..
         * daha sonra kontrol etmesini istediğim örneğimin index numarasını veriyorum
         * bir de o index numarasını araması için yukarıdan gelen children nesnemi referans veriyorum
         */
        Clones.findPositionClones(sample.children[i], children, i);
    }


}

Clones.findPositionClones = function findPositionClones(sample, children, index) {

    //Gelen children listesi içindeki her bir nesnenin çocuk nesnelerinde
    //sample nesnesinin index numarasına eşit olanlarını bulup 
    //tekrar bir liste haline getireceğiz. Sonrasında en başa dönüp
    //ilk sample tetiklemesini yaptığımız gibi applyClone methoduna yönlendiriyoruz
    //Yani bir döngü içerisine sokuyoruz

    var n = [];
    children._each(function _each(item, i) {
        n.push(item.children[index]);
    });

    Clones.applyClone(sample, n);
}





Clones.constructor.onload = function onload() {


    /**
     * Sayfa üzerindeki tüm data-clone özelliğine sahip nesneleri bulalım
     */

    var clone = Clones.findClones();

    clone._each(function _each(item) {

        var slice = item.parentNode.children;

        try {
            var x = item._attr('data-clone');
            if (x)
                x = parseInt(x);

            if (x <= 1) {
                x = 1;
            }

            slice = x;

        } catch (error) {

        }

        //Her bir clone nesnesinden sonraki tüm nesneleri seçelim
        var allOthers = Array.prototype.slice.call(item.parentNode.children);

        //Şimdi bizim nesnemizin bu ana grup içinde bulunduğu pozisyonun index numarasını al
        var currentIndex = allOthers.indexOf(item);

        //Şimdi de nesnemizin bulunduğu pozisyondan kaç tanesi bu durumdan etkilenecekse, bu grubun listesini ver
        var tList = allOthers.slice(currentIndex, currentIndex + slice + 1);

        Clones.applyClone(item, tList);


    });

    Listener.remove(window, 'load', Clones.constructor.onload);

}


Plugins.add(Clones);
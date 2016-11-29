/**
 * 
 *  Object array nesnesindeki özellikleri ve value değerlerini alabilmemizi sağlayan methodlar
 * 
 */

/**
 * 
 * Key veya value değerlerini veren methodlar
 * 2 parametre almaktadır. 
 * <param nesne>
 * <param tip>
 * 
 * param nesne  : İçeriği temsil etmektedir
 * param tip    : True veya false değer almaktadır. Varsayılan olarak false'dir.
 * 
 * Tip parametresinin false olması keys değerlerini al, true ise sadece value değerleri al demektir
 * 
 */


function Keys(obj, typ) {

    //@Return
    var u = [];

    //Eleman sayısı kadar devam eder
    for (var i in obj) {

        //Özelliklerden sadece Object ve String tipindekileri alıyoruz. Yani fonksiyon olmayan değerleri.
        if (!isFunc(obj[i]))
            u.push(!typ ? i : obj[i]);
    }

    //@Return 
    return u;

}




/**
 * 
 * @object.values şeklinde çağrılmaktadır
 * 
 * <param icerik>
 * i parametresi ile methoda object array nesnesi gönderilmektedir
 * 
 */


function Values(obj) {


    /** 
     * 
     * <param içerik>
     * <param tip>
     * 
     * Tip olarak da value değerlerini almamızı sağlamak için true değeri gönderiliyor
     * 
     */

    return Keys(obj, true);
}





function Extend(obj1, obj2) {

    for (var i in obj2) {
        obj1[i] = obj2[i];
    }

}
/**
 * 
 *  Object array nesnesindeki özellikleri ve value değerlerini alabilmemizi sağlayan methodlar
 * 
 */


Kakao.objects = {


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
    key: function(n, tp) {

        //@Return
        var u = [];

        //Eleman sayısı kadar devam eder
        for (var i in n) {

            //Özelliklerden sadece Object ve String tipindekileri alıyoruz. Yani fonksiyon olmayan değerleri.
            if (!isFunc(n[i]))
                u.push(!tp ? i : n[i]);
        }

        //@Return 
        return u;
    },



    /**
     * 
     * @object.keys şeklinde çağrılmaktadır
     * <param icerik>
     * i parametresi ile methoda object array nesnesi gönderilmektedir
     * 
     */
    keys: function(i) {
        return objects.key(i);
    },



    /**
     * 
     * @object.values şeklinde çağrılmaktadır
     * 
     * <param icerik>
     * i parametresi ile methoda object array nesnesi gönderilmektedir
     * 
     */
    values: function(i) {

        /** 
         * 
         * <param içerik>
         * <param tip>
         * 
         * Tip olarak da value değerlerini almamızı sağlamak için true değeri gönderiliyor
         * 
         */
        return objects.key(i, true);
    },

    extend: function(obj1, obj2) {
        for (var i in obj2) {
            obj1[i] = obj2[i];
        }
    }
}
/**
 * 
 * ForEach ile istediğimiz şekilde döngü oluşturalım
 * 
 * <param array>  =>  döngü listesi   
 * <param function> => döngü sırasında çalıştırılacak method
 * <param start index>  => döngünün kaçıncı index numarasından itibaren işleneceği
 */
Kakao._for = function foreach(arr, func, inx) {


    console.log('----');
    console.log(arr);

    /**
     * <param inx değeri varsayılan olarak 0'dır
     * param func ile işlem sırasında çalıştırarak geri değerleri döndürüyoruz
     */
    inx = inx || 0;

    //Sadece Object array tipinde nesneler
    if (Kakao.isObj(arr)) {

        //Başlangıç index numarası
        var _index = 0,
            n = 0;

        if (arr.length)
            for (var i = 0; i < arr.length; i++) {
                if (i >= inx) {
                    func(i, arr[i]);
                }
            }
        else {
            var i = 0;
            for (var n in arr) {

                func(i, arr[n], n);
                i++;

            }
        }

    }



    /**
     * Array tipi nesneler için ayıklama işlemi
     */
    else if (Kakao.isArr(arr)) {

        for (var i = inx, n = arr.length; i < n; i++) {

            //Invoke
            func(key, arr[i]);
        }

    } else
        console.log(arr + ' Object ve Array tipinde bir nesne değil');

}
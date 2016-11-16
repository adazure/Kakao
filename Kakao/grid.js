Kakao.grid = {

    /**
     * Row nesneleri içerisinde yeni column nesneler oluşturmaktadır
     */
    createCol: function(a) {
        var e = Kakao.Dom.create('div');
        Kakao.grid.createLabel(a, e);
        e.appendChild(a);
        return e;
    },

    /**
     * İstenen root nesne içerisinde label nesnesi ve içeriği oluşturuluyor
     */
    createLabel: function(a, target) {
        //Label değeri varsa işleme al
        var lbl = a._attr('data-label');
        if (lbl) {

            //Label oluştur
            var c = Kakao.Dom.create('label')
                ._class('data-col-label')
                ._removeAttr('data-label');

            //Label değerini innerHTML olarak ata
            c.innerHTML = lbl;

            //Label nesnesini istenen root nesnesine ata
            target.appendChild(c);
        }
    },

    /**
     * Belirtilen nesneye ait çocuk nesnelerin sahip olduğu data-screen değerleri bu alanda işlenerek
     * parent nesnesine ilgili değerler uygulanmaktadır
     */
    addScreen: function(children) {

        //Her bir cocuk nesnesinde data-screen değerini aranıyor
        for (var n = 0; n < children.length; n++) {

            //İlgili sıradaki nesneyi alır
            var chl = children[n];

            //Nesne içinde data-screen ifadesi var mı bakar
            var datascreen = chl.children[chl.children.length - 1]._attr('data-screen');

            //Eğer data screen ifadesi yoksa yani boşsa varsayılan olarak sutun sayısı kadar web değeri atar
            if (!datascreen) {
                children[n]._class('web' + piece / children.length)
            }
            //Eğer data screen özelliği bir değere sahipse ve string ifade barındırıyorsa
            else if (datascreen && typeof datascreen === 'string') {
                children[n]._class(datascreen.split(' '));
            }
        }
    },

    //Children nesnelere toplu değer atamaları yapılır
    addClassToChildren: function(children) {
        for (var i = 0; i < children.length; i++) {
            children[i]._class(Kakao.filter.toArray(arguments, 1));
        }
    },


    'constructor': {

        onload: function() {

            var _grids = document.querySelectorAll('[data-grid]');
            if (!_grids || _grids.length == 0) return;

            foreach(_grids, function(index, a, c) {

                //İlgili nesne içerisindeki maksimum satır sayısı
                var maxRowCount = 0;

                //İlgili nesnenin içindeki çocuk nesne sayısı
                var children = a.children;

                //Çocuk nesnelerin sayısı
                var length = children.length;

                //Oluşturulacak her bir grid satır nesnesi
                var rows = Kakao.Dom.create('div')._class('data-row');

                var colCount = 0;

                //Bir döngü içerisinde tüm cocuk nesnelerin işleyisi bitene kadar 0'ıncı çocuk nesnesi seçilerek devam eder
                while (length > 0) {

                    //Sıradaki çocuk nesnesi. Her seferinde 0 index numaraları nesne seçilir.
                    //Çünkü 0'ıncı nesne işlemi bittiğinde, nesne listeden kaldırılır ve yeni nesneye aktarılır.
                    //Böyle olunca 0'ıncı nesne otomatik olarak değişmiş olacak
                    var item = children[0];

                    //Sıradaki nesnenin row numarasını al
                    var rowNumber = parseInt(item._attr('data-row'));

                    //Row attribute özelliğini kaldır
                    item._removeAttr('data-row');

                    //İşlenen tek bir satıra ait sütun sayısı değerini bir arttır
                    colCount++;

                    //Gelen row değeri maxRowCount değerinden büyükse yeni bir satır oluştur
                    if (rowNumber > maxRowCount) {

                        //Row değerini max değerine eşitle
                        maxRowCount = rowNumber;

                        //Yeni bir satır oluşturmadan önce işlediğin tüm nesnelere sabit tanımlı sınıf isimlerini ata
                        Kakao.grid.addClassToChildren(rows.children, 'inline', 'this', 'grid-col');

                        //İşlenen nesneleri grid nesnesi içine yeni satır olarak ekle
                        a.appendChild(rows);

                        //İlgili nesnede data-screen değerleri varsa uygular, eğer yoksa sütun sayısına eşitler
                        Kakao.grid.addScreen(rows.children);


                        //Sonraki satır için yeni row oluştur
                        rows = Kakao.Dom.create('div')._class('data-row');

                        //İşlenen sütun sayısını sıfırla
                        colCount = 0;
                    }

                    //Hangi satırdaysak, ilgili seçili nesneyi sıradaki satır nesnesine aktar.
                    rows.appendChild(Kakao.grid.createCol(item));

                    //İşlem bittikten sonra, bu nesne ile ilişkisinin bittiğine dair length değeri 1 eksiltiliyor
                    length--;

                    //Eğer length değeri 0 ise ve eğer işlenmiş 1,2 kayıt varsa da onları da ekle
                    if (length == 0) {

                        Kakao.grid.addClassToChildren(rows.children, 'inline', 'this', 'grid-col');

                        //İlgili nesnede data-screen değerleri varsa uygular, eğer yoksa sütun sayısına eşitler
                        Kakao.grid.addScreen(rows.children);

                        a.appendChild(rows);
                    }
                }

            });
        }

    }
}
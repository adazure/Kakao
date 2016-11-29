Selectors.add('all', {


    /**
     * Burada tanımlanacak tüm bilgiler yada değerler, selector olarak işaretlenmiş...
     * her bir ekran boyutuna; yine kendi ekran adıyla beraber oluşturulur
     * Örnek: hidden tanımlı sınıf adı her ekran boyutu için şu şekilde tanımlanır
     * web-hidden, mob-hidden, tab-hidden vs. web, mob, tab gibi seçici içimlerini belirtmeniz gerekmez
     * Bu değerler otomatik olarak eklenir.
     */

    lock: true,

    before: function(name, arr) {

        var allDefaults = {
            'hidden': 'display:none !important',
            'show': 'display:block !important',
            'textcenter': 'text-align:center !important',
            'textright': 'text-align:right !important',
            'textleft': 'text-align:left !important',
            'left': 'margin-left:0; margin-right:auto;',
            'center': 'margin-left:auto; margin-right:auto; display:inherit !important;',
            'right': 'margin-left:auto; margin-right:0'
        };

        for (var n in allDefaults) {
            arr.push(Format(".{0}-{1}{{2}}", name, n, allDefaults[n]));
        }



    }
});
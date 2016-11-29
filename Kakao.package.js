(function() {
        //Kakao.js start
        var Kakao = (function() {

            function Kakao() {
                this.result = [];
            }

            return new Kakao();
        })()
var Plugins = (function Plugins() {

    Plugins.constructor = {}

    Plugins.constructor.run = [];
    Plugins.constructor.onload = [];

    Plugins.add = function add(obj) {

        if (obj.constructor.run) {
            Plugins.constructor.run.push(obj.constructor.run);
        }


        if (obj.constructor.onload)
            Plugins.constructor.onload.push(obj.constructor.onload);
    }

    return Plugins;

})()
  var Listener = (function Listener() {

      var mutationNodeSelect = (function mutationNodeSelect() {

          mutationNodeSelect.DOMNodeInserted = function(version, mutationNode, method) {
              if (version) {
                  if (mutationNode.addedNodes.length > 0)
                      method(
                          mutationNode.addedNodes[0],
                          mutationNode.target,
                          mutationNode.type,
                          mutationNode);
              } else {
                  if (mutationNode.target)
                      method(
                          mutationNode.target,
                          mutationNode.relatedNode,
                          null,
                          mutationNode);
              }
          }

          mutationNodeSelect.DOMNodeRemoved = function(version, mutationNode, method) {
              if (version) {
                  if (removedNodes.length > 0)
                      method(
                          mutationNode.removedNodes[0],
                          mutationNode.target,
                          mutationNode.type,
                          mutationNode);
              } else {
                  if (mutationNode.target)
                      method(
                          mutationNode.target,
                          mutationNode.relatedNode,
                          null,
                          mutationNode);
              }
          }

          mutationNodeSelect.DOMSubtreeModified = function(version, mutationNode, method) {
              if (version) {
                  if (mutationNode.target)
                      method(
                          mutationNode.target,
                          mutationNode.target.parentNode,
                          mutationNode.type,
                          mutationNode);
              } else {
                  if (mutationNode.target)
                      method(
                          mutationNode.target,
                          mutationNode.target.parentNode,
                          null,
                          mutationNode);
              }
          }

          return mutationNodeSelect;
      })();





      function selectMode(name) {

          if (window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver) {

              var node = {
                  'DOMNodeInserted': {
                      config: {
                          childList: true
                      }
                  },
                  'DOMNodeRemoved': {
                      config: {
                          childList: true
                      }
                  },
                  'DOMSubtreeModified': {
                      config: {
                          childList: true,
                          subtree: true,
                          attributes: true
                      }
                  },
              }

              if (!node.hasOwnProperty(name)) return null;
              return node[name]

          } else {

              var node = {
                  'DOMNodeInserted': true,
                  'DOMNodeRemoved': true,
                  'DOMSubtreeModified': true
              }

              if (!node.hasOwnProperty(name)) return null;
              return node[name]
          }
      }


      Listener.add = function(obj, name, method) {
          if (!MutationServer(obj, name, method)) {
              addListener(obj, name, method);
          }
          return obj;
      }

      Listener.remove = function(obj, name, method) {
          if (!MutationServer(obj, name, method)) {
              removeListener(obj, name, method);
          }
          return obj;
      }

      function MutationServer(obj, name, method) {

          var config = selectMode(name)
              //Eğer bize gelen bilgi bir mutation mode değeri değilse normal listener olarak devam etsin
          if (!config) return false

          //Eğer bu nesneye daha önce mutasyon mode uygulanmadıysa
          //O halde herşey ilkkez olacağından herşeyi oluşturalım 
          if (!obj.mutationList) {
              obj.mutationList = {};
          }
          //Eğer bu nesnenin mutasyon listesinde belirtilen name değerli bir alan yoksa
          //yani daha önce mutasyon geçirmiş bir nesne ise alanı oluştur ve içine methodu uygula
          if (!obj.mutationList[name]) {

              obj.mutationList[name] = [method];
              if (config.config)
              //Yeni sistem
                  createMutationRecord(obj, name, method, config);
              else
              //Eski sistem
                  createMutationEvent(obj, name, method, config);

          } else {
              //Nesneye daha önce mutasyon uygulanmış ilgili alanda var
              //O halde ilgili alana mutasyonu ekle ve geri döndür
              obj.mutationList[name].push(method);
          }

          //Mutasyon uygulandı
          return true;
      }


      function addListener(obj, name, method) {
          if (obj.addEventListener)
              obj.addEventListener(name, method, false);
          else
              obj.attachEvent('on' + name, method);
      }

      function removeListener(obj, name, method) {
          if (obj.removeEventListener)
              obj.removeEventListener(name, method, false);
          else
              obj.detachEvent('on' + name, method);
      }


      function createMutationRecord(obj, name, method, config) {


          var mos = new MutationObserver(function(e) {
              e.forEach(function(q) {
                  obj.mutationList[name].forEach(function(mtd) {
                      mutationNodeSelect[name](true, q, mtd);
                  });
              });
          });

          mos.observe(obj, config.config);
      }


      function createMutationEvent(obj, name, method, config) {
          addListener(obj, name, function(e) {
              obj.mutationList[name].forEach(function(mtd) {
                  mutationNodeSelect[name](false, e, mtd);
              });
          })
      }



      return Listener;

  })()
var Filter = (function Filter() {


    /**
     * Gelen verinin ilk harflerini büyük yapmak için oluşturuldu.
     * 4 adet parametre almaktadır
     * <param string>
     * <param split>
     * <param startindex>
     * <param charcount>
     * 
     * param string     :  Gelen veriyi temsil etmektedir
     * param split      :  Parçalanması istenen karakter. boşluk, tire, alt tire,a,b,c,d gibi. Varsayılan olarak boşluktur
     * param startindex :  Split edilmiş parçaların kaçıncı indexinden itibaren büyütme işlemi gerçekleştireceğini belirtir. Varsayılan olarak 0'dır
     * param charCount  :  Parçalanmış verilerden gelen sıradaki değerin, baştan kaç karakterinin büyütüleceği değerini alır. Varsayılan olarak 1'dir
     */

    Filter.capitalize = function(str, split, startindex, charCount) {

        split = split || ' ';
        startindex = (startIndex = startindex || 0) < 0 ? 0 : startindex;
        charCount = (charCount = charCount || 1) < 1 ? 1 : charCount;
        var s = str.split(split);
        for (var i = startindex, l = s.length; i < l; i++) {
            s[i] = s[i].slice(0, charCount).toUpperCase() + s[i].slice(charCount);
        }
        return s.join(split);
    }






    /**
     * Sadece style $css özelliğinde kullanılmak üzere tasarlandı
     * Amacı $css ile yeni özellikler eklenmek istendiğinde '-' tire ile tanımlanmış alanları CSS style özelliğine çevirmektedir
     * Örneğin $css('padding-top') gibi bir veri geldiğinde aradaki - işareti silinip, 'top' verisininde baş harfi büyük yapılarak birleştirmesidir
     * Çıktı : paddingTop yada borderTop, backgroundColor gibi... 
     */

    Filter.style = function(a) {
        return Filter.capitalize(a, '-', 1).replace(/\-/g, '');
    }








    /**
     * Arguments nesnesini array tipine çevirir
     * <param arguments>
     * Bu method arguments almaktadır ancak methoda gelen arguments değerlerinin sadece ilk ikisini kabul ediyoruz
     * args[1] = start
     * args[2] = end 
     * değerlerini içerecektir. Yani bizden bir arguments nesnesini arraya çevirmemiz istendiğinde start ve end değerleriyle de slice yapabileceğiz
     */


    Filter.toArray = function(args) {
        var n = [];
        var s = parseInt(arguments[1] ? arguments[1] : 0);
        var e = parseInt(arguments[2] ? arguments[2] : args.length);
        for (var i = s; i < e; i++) {
            n.push(args[i]);
        }
        return n;
    }







    return Filter;

})()
/**
 * Format ile gelen bir veriyi istenen şekile çevirir
 * 
 * <param format veri>
 * <noreq arguments>
 */


var Format = function Format(f) {

    /**
     * 
     * @Kullanım 
     * format('{0} tarihinde {1} tarafından yapıldı','10:11:2012','Kerem YAVUZ')
     */

    for (var i = 1; i < arguments.length; i++) {
        f = f.replace(Regx('\\{' + (i - 1) + '\\}'), arguments[i]);
    }

    return f;

}




/**
 * <param format>
 * <param arguments>
 * 
 * Repeat methodu ile f parametresindeki değerler, arguments nesnesi sayısında tekrar ettirilir
 * Repeat methodu örnek kullanımı
 * 
 * Gönderilen format parametresi : "Merhaba {}"
 * Gönderilen arguments parametresi : "Ahmet","Mehmet","Hüseyin"
 * 
 * Çıktı : Array [] 
 * Merhaba Ahmet
 * Merhaba Mehmet
 * Merhaba Hüseyin
 * 
 */



Format.Repeat = function Repeat(f) {

    if (arguments.length <= 1) return;
    var args = isObj(arguments[1]) ? arguments[1] : Filter.toArray(arguments, 1);
    var n = [];

    for (var i in args) {
        n.push(f.replace('{}', args[i]));
    }

    return n;

}
/**
 * Nesne tipleri ile ilgili dönüşüm bilgilerini alacağımız methodlar
 * @isFunc
 * @isArr
 * @isObj
 * @isNum
 * @isNaN
 * @isStr
 */

//Sadece fonksiyon tipler
function isFunc(a) {
    if (!a) return false;
    return typeof a === 'function';
}

//Sadece array tipler
function isArr(a) {
    if (!a) return false;
    return typeof a === 'array';
}

//Sadece object array tipler
function isObj(a) {
    if (!a) return false;
    return typeof a === 'object';
}

//Sadece numeric tipler
function isNum(a) {
    if (!a) return false;
    return typeof a === 'number';
}

//Sadece numeric olmayanlar tipler
function isNaN(a) {
    if (!a) return false;
    return a == Number.isNaN;
}

//Sadece string tipler
function isStr(a) {
    if (!a) return false;
    return typeof a === 'string';
}
var Media = (function Media() {


    /**
     * 
     * @Media
     *  
     * <param genislik değeri>
     * <param içerik>
     * 
     * Kullanım:
     * media.create(300,'.maden{display:block;}')
     * 
     * Çıktı:
     * "@media screen and (max-width:300px){.maden{display:block;}}"
     * 
     * 
     */
    Media.Create = function(g, i) {
        if (!isNum(g) || g < 1) return i;
        return Format('@media screen and (max-width:{0}px){{1}}', g, i);
    }

    return Media;
})()
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
/**
 * 
 * Regex oluşturma işlemleri için kullanılacak
 * Basit olarak ilgili methodlar içinde new RegExp olarak kullanabilirdik
 * Ancak bir parametre yardımıyla istediğimiz model(pattern) değerini yollayıp bizim için dönüştürmesini sağlayacağız
 * <param pattern>
 */


function Regx(p) {

    /**
     * @return
     * örnek gelen pattern değeri : [^\d]+
     * 
     * Çıktı: /[^\d]/gi
     * 
     */
    var args = arguments[1];

    if (!args && args == undefined)
        return new RegExp(p, 'gi');
    else if (!args && args === false)
        return new RegExp(p);
    else if (args)
        return new RegExp(p, args);
}
var Methods = (function Methods() {

    //İlgili nesneye yeni bir sınıf eklemek için kullanılmaktadır
    //string ve array tipinde değer alabilir
    //arguments olarak da değer verilebilir
    //class(arg1, arg2, arg3, arg4)
    Methods.class = function(arr) {

        var self = this;

        //arguments sayısı 2 ve daha fazlasıyla birden fazla sınıf adı var demektir.
        //Arguments parametreslerini bir dizi ye çeviriyoruz

        if (arguments.length >= 2)
            arr = Filter.toArray(arguments);

        //Eğer gelen değer bir dizi ise devam ediyoruz
        if (isObj(arr) || isArr(arr)) {

            //Dizi sayısı kadar işlemi okuyoruz
            arr._each(function(item) {
                add(self, item);
            })

        } else {

            //Sadece tek bir sınıf adı varsayıyoruz
            add(self, arr);
        }

        function add(o, n) {
            if (o.classList)
                o.classList.add(n);
            else
                o.className += ' ' + n;
        }

        //nesneyi geri döndür
        return self;

    }



    //Arguments parametresinden gelen değerleri ilgili nesnenin sınıf dizisinden siler
    //string ve array tipinde değer alabilir
    //arguments olarak da değer verilebilir
    //class(arg1, arg2, arg3, arg4)
    Methods.removeClass = function() {
        for (var i = 0; i < arguments.length; i++) {
            this.classList.remove(arguments[i]);
        }
        return this;
    }




    /**
     * 
     * @Element._attr
     * 
     * @Element._attr('id','objectname');
     * @Element._attr({
     *                  'data-number':'10',
     *                  'data-obj':'{ad:"KEREM",soyad:"YAVUZ"}',
     *                  required='required'
     *              });
     * 
     * @Element._attr('id') @return 'objectname';
     * @Element._attr('...')._attr('...')._attr('...')
     * 
     * 
     */


    Methods.attr = function(name, value) {

        /**
         * Gelen name değeri bir Object Array nesnesi mi kontrol et
         * Eğer bir Object Array nesnesi ise önce each methoduna gönderilecek
         * O bize değeri tekrar buraya tek tek gönderecek ve biz de işleyeceğiz
         */

        if (isObj(name))
            each(this, name, 'attr');


        /**
         * Gelen name değeri string bir değer ise ve value değeri boş ise
         * O halde sadece ilgili nesnenin name özelliğinin değerini geriye döndür
         */

        if (isStr(name) && !value)
            return this.getAttribute(name);



        /**
         * name ve value özellikleri mutlak string ise
         * ilgili bilgileri ilgili nesne özelliğinde oluştur
         */
        if (isStr(name) && isStr(value))
            this.setAttribute(name, value);

        //Her durumda nesnenin kendisini tekrar geriye döndür
        return this;
    }








    Methods.remove = function() {
        if (this.parentNode)
            this.parentNode.removeChild(this);
    }






    /**
     * İlgili nesneden belirtilen attribute değerlerini siler
     */
    Methods.removeAttr = function(name) {
        for (var i = 0; i < arguments.length; i++) {
            this.removeAttribute(arguments[i]);
        }
        return this;
    }








    Methods._each = function(method) {
        for (var i = 0, len = this.length; i < len; i++) {
            method(this[i], i);
        }
    }





    return Methods;



})()




Element.prototype._attr = Methods.attr;
Element.prototype._removeAttr = Methods.removeAttr;
Element.prototype._class = Methods.class;
Element.prototype._removeClass = Methods.removeClass;
Element.prototype._newline = Methods.newline;
Element.prototype.remove = Methods.remove;
Array.prototype._each = Methods._each;
Object.prototype._each = Methods._each;
var Screens = (function Screens() {

    //Sayfadaki varsayılan ayrılacak parça sayısı
    Screens.Piece = 12;

    /**
     * Sayfa üzerinde kullanılacak varsayılan ekran boyutları listesi
     * web : 0 değeri diğer boyutların devreye girmediği tüm boyutlarda işletilmesini belirtir.
     * Değerler ve tanımlamalar değeri en yüksekten en aşağıya doğru belirtilmelidir.
     */

    Screens.Values = {

        'all': 0,
        'web': 1024,
        'tab': 768,
        'mob': 425,
        'min': 360
    }


    /**
     * <param piece>
     * Gelen n değeri işlemdeki 1,2,3,4,5 vs gibi sayısal veriyi nitelemektedir.
     * Methodun amacı, gelen n değerinin toplam piece maksimum değerine oranını hesaplamak
     * Çıktı olarak yüzdesel değer vermektedir.
     * 
     * Girdi:
     * 2
     * Çıktı:
     * 16.6667
     * 
     */


    Screens.screenCalc = function(n) {
        var z = (100 / Screens.Piece * n),
            fixed = z % 1 === 0 ? 0 : 4;
        return (100 / Screens.Piece * n).toFixed(fixed);

    }



    return Screens;
})()
var References = (function References() {

    /**
     * Sayfa üzerinde bulunan tüm ref- etiketine sahip veriler burada tutulmaktadır
     * Tutulan veri tipi Object Array tipindedir.
     * Örnek data: { name: 'sınıfadı', ref: 'this', obj: <Nesne></Nesne> }
     */

    References.table = [];

    return References;
})()





/**
 * Sayfa üzerinde oluşturulmuş ref-**- nesnelerini arar ve gelen listeyi geri döndürür
 */


References.Search = function() {

    //@Return
    var _get = [];

    //İşaretleyici sayısınca döngü oluştur

    var key = Keys(Markers.Names);

    for (var i = 0; i < key.length; i++) {

        var c = key[i];

        //Tanımlayıcı
        var ref = 'ref-' + c + '-';

        //Tüm nesneleri tarar
        var _e = document.querySelectorAll('[class*=' + ref + ']');

        _e._each(function(item) {
            _get.push(item);
        });

    }

    //@return geri döndür
    return _get;

}




/**
 * <param HTMLElement Array>
 * <param [this,in,all,any]
 * Gelen type değerine göre markers.names[type] nesnesi içinde tanımlanan nesne listesi içinde arama yapar
 * Bu liste içerisinde ilgili HTMLElement nesnesinin class değerleri içindeki aynı olan değerleri alır
 * Bulunan değerler [...] ilgili referans gösterilen nesnenin class değerlerine eklenmek üzere geri döndürülür
 */

References.getSameClass = function(obj, type) {

    //Type değerinin "any" olması durumunda nesneye ait class değerlerinin tamamı geri döndürülür
    if (!Markers.Names[type]) return obj.classList;

    //@Return nesnesi 
    var re = [];

    //Gelen type değerini ilgili nesne class değerleri içinde kontrol ederek benzer sınıf adlarını alalım
    obj.classList._each(function(i) {
        re.push(i);
    });


    //Listesi geri döndürelim
    return re;

}




/**
 * Search methodu ile sayfa üzerinde bulunmuş ref- etiketli nesnelere getReference methodu static prototype olarak eklenecektir
 * HTMLElement.getReference(refName) olarak işletilecektir.
 * 
 * <param referencetype> => [this,in,all,any]
 * Table[] nesnesine atanan bu ilgili ref- etiketli nesneler buraya aktarılmıştı
 * Table[] nesnesinde arama yapıldığında buradaki ilgili nesnelerin getReference olarak atanmış methodu kolayca çalıştırılabilecek
 * Buradaki amaç bu method çağrıldığında, bağlı bulunduğu nesnenin içindeki diğer <element></element> elementler taranacak
 * Taranan bu nesnelerde, getReference methodu çağrılan nesnedeki [sınıfadı] aranacak ve bulunan nesnelere 
 */


References.getReference = function(refName) {

    var _self = this;
    var n = document.querySelectorAll('.' + _self.reffName);

    if (n && n.length > 0) {
        var _ref = References.getSameClass(_self, refName);

        if (_ref)
            n._each(function(item, index) {
                item._class(_ref);
                item.classList.remove(_self.reffName);
            });
    }

}





References.constructor = {};





References.constructor.onload = function() {


    //Sayfa üzerindeki tüm referens nesnelerini arar
    var n = References.Search();

    //Arama sonucu gelen nesne boş veya liste sayısı 0'sa işlemi iptal et
    if (!n || n.length == 0) return;

    //İlgili nesne içerisinde tam istediğimiz ref- sınıf adı varsa alalım
    var match = Regx('ref\\-(' + Keys(Markers.Names).join('|') + ')\\-(\\w+)');

    n._each(function(item, index) {

        // Sıradaki nesneye ait sınıf değerleri içinde ilgili pattern modelini aratalım
        var get = item.className.match(match);

        //İstenilen pattern mutlaka en az 1 tane varsa işleme devam et
        if (get && get.length > 0) {


            //Pattern değerine ait tüm değerleri sırasıyla işleme al
            get._each(function(a) {

                /**
                 * Gelen sıradaki veriyi parçalarına ayır
                 * Çıktı:
                 * ['ref-in-sınıfadi'],['in'],['sinifadi']
                 */
                var grp = match.exec(a);

                //Regex Exec işleminden sonra regexin işlem index numarasını 0'a eşitliyoruz. Böylece sıradaki diğer işlem 0'ıncı karakterden başlayacak
                match.lastIndex = 0;

                //Eğer gelen bir grup değeri varsa işleme devam et
                if (grp) {

                    //Daha sonradan tekrar kullanabilmek için ilgili sıradaki değerleri tabloya kaydet
                    References.table.push({ name: grp[2], ref: grp[1], obj: item });

                    //İlgili nesneden [0]'ncı değeri yani gelen ['ref-in-sınıfadi'] değerini siler
                    item.classList.remove(grp[0]);

                    //Bu nesneye daha önce getReference methodu eklenmemişse devam et
                    if (!item.getReference) {

                        //getReference methodu oluştur ve varolan method ile eşle
                        item.getReference = References.getReference;

                        //[sinifadi] değerini ilgili nesneye aktaralım
                        item.reffName = grp[2];

                        //İlgili nesne üzerinde oluşturulacak attribute özelliğine benzersiz veri atayalım
                        item.refixClsName = '-refix-cls-000' + Math.round(Math.random() * 99999);

                        //İşlemlerden sonra ilgili methodu ilkkez başlatalım
                        item.getReference(grp[1]);
                    }

                } //EndIf

            }); //_each

        } //EndIf

    });


    //Sayfa üzerinde yeni bir nesne oluşturulduğunda tetiklenecek methodumuz
    Listener.add(document.body, 'DOMSubtreeModified', function() {

        References.table._each(function _each(item) {
            item.obj.getReference(item.name);

        });
    });

    Listener.remove(window, 'load', References.constructor.onload);
}


Plugins.add(References);
/*


 * Seçiciler
 * Eklendiği nesne üzerinde bir işlem yapılacağına ve nasıl bir işlem yapılacağına dair fikir verir
 * Nesne üzerinde eklendiğinde tek başına herhangi bir etkileşimleri bulunmamaktadır
 * 
 */

var Selectors = (function Selectors() {


    Selectors.Values = {};

    return Selectors;
})()




//Sadece selector özelliği olan nesneleri adlarını getirir
//@return [float, inline, table]
Selectors.getOnlySelectors = function getOnlySelectors() {
    var r = [];
    for (var i in Selectors.Values) {
        if (Selectors.Values[i].selector && !Selectors.Values[i].lock)
            r.push(i);
    }
    return r;
}





/**
 * Yeni bir selector nesnesi eklemek için kullanılır.
 * Amaç plugin şeklinde yapmak olduğundan ve geliştirici tarafından istenirse yüklenmesi amacıyla oluşturuluyor
 * Böylece geliştirici sadece istediği pluginleri yükleyerek gereksiz script tanımlamalarını yüklememiş ve 
 * Yükleme hızından da kazanılmış olacaktır
 * 
 * Yeni bir selector nesnesinde olması gereken özellikler ve tanımlamalar aşağıdadır
 * 
 * <param name> Selector nesnesi için benzersiz bir isim tanımlanmalı
 * <param object> Selector nesnesinin alacağı sabit paramatreler için Object Array nesnesi
 * 
 * Örnek Object Array nesnesi
 * {
 *  selector:       true/false değer alır. Eğer nesneler üzerinde bir işlem yapılacaksa,
 *  lock:           true/false Lock özelliğini geliştiricilerin dışarıdan değer tanımladıklarında(setting özelliğinde) buradaki benzersiz isimle uyuşmamaları içindir.
 *                             Burada tanımlanan isimde bir isim tanımlamamaları gerekmektedir anlamını taşımaktadır.
 *  root:           true/false Root özelliği this marker'ını ifade etmektedir. İşlem yapılacak nesnelerin direk kendisinide kapsayıp kapsamayacağını belli etmek için eklendi.
 *                             Örneğin float this, inline this tanımlamasında olduğu gibi tanımlamaların yapılıp yapılmayacağını belli eder
 *                             Style oluşturulmaları sırasında kullanılmaktadır. Yani ilgili methodumuz gelen selector adına --- 'selectorName'.this --- gibi ibareleri ekler
 * 
 *  children        true/false Root özelliğinde olduğu gibi ancak "in" ifadesi için kullanılmaktadır ve float in, inline in gibi ifadelere maruz kalıp kalamayacağını belli eder. İhtiyaç yoksa false işaretlenmelidir.
                               Style oluşturulmaları sırasında kullanılmaktadır. Yani ilgili methodumuz gelen selector adına --- 'selectorName'.in > * --- gibi ibareleri ekler
 * 
 *  each            true/false Selector nesnemiz de before ve init methodları bulunmaktadır. Bazı durumlarda ya da yeni ekleyeceğimiz bu selector nesnemizde before ve init nesnelerini...
 *                             Sayfa yüklendiğinde veya sayfa yüklenirken çalıştırmak istemeyebiliriz. Bu durumda each alanını false yaparak istisnai hale getirebilir ve sadece biz methodlarını çağırdığımız yerden
 *                             çalışmasını isteyebiliriz.
 * 
 *  before          function   Sayfa yüklenmeden önce yapılması istenen işlemler
 *  init            function   Sayfa yüklendiğinde yapılması istenen işlemler
 * 
 * }
 * 
 * 
 */



Selectors.add = function add(name, selectorObj) {

    Selectors.Values[name] = selectorObj;

}


Selectors.constructor = {}




/**
 * 
 * Bu alan yukarıdaki tanımlamalardan tamamen bağımsızdır
 * Bu method sadece start nesnesinden çağrıldığında işletilecektir.
 * 
 */

Selectors.constructor.run = function run() {


    /**
     * //////////////////////////////////////////
     * ////////// SELECTOR START ////////////////
     * //////////////////////////////////////////
     */

    /**
     * Selector nesnesi içerisinde yüklenmesi gereken alanları yükleyelim
     * Buradaki yükleme işlemi before ve init methodlarının çağrılarak Kakao.result nesnesi içerisine yüklenmesi
     * Kakao.result nesnesine yüklenen veriler sayfada oluşturulacak <style></style> nesnesine aktarılacaktır
     * Şimdi aşağıda sırasıyla işlemleri başlatıyoruz
     */

    for (var i in Selectors.Values) {

        var v = Selectors.Values[i];

        //Before methodu varsa ve each değeriyle sorgulama işlemine alınmak isteniyorsa
        if (v.before && v.each)
            v.before();

        //Sayfa ve dosya yüklendiğinde çalıştırılacak veya yapılacak işlemler. Eğer init methodu varsa çalışırır.
        if (v.init)
            Listener(window, 'load', v.init);
    }


    /**
     * Selector nesnesi içerisinde bulunan seçici adlarıyla, screens nesnesi içerisindeki değerler birleştirilerek, aşağıdaki örnek çıktılar sayfa boyutlarına göre oluşturulmaktadır
     * 
     * Örnek 'tab' screen çıktısı:
     * 
     * @media screen and (max-width:980px){
     *  .float.this.tab1,.float.in.tab-1>*,.inline.this.tab1,.inline.in.tab-1>*,.table.this.tab1,.table.in.tab-1>*{width:8.3333%}
        .float.this.tab2,.float.in.tab-2>*,.inline.this.tab2,.inline.in.tab-2>*,.table.this.tab2,.table.in.tab-2>*{width:16.6667%}
        .float.this.tab3,.float.in.tab-3>*,.inline.this.tab3,.inline.in.tab-3>*,.table.this.tab3,.table.in.tab-3>*{width:25%}
        .float.this.tab4,.float.in.tab-4>*,.inline.this.tab4,.inline.in.tab-4>*,.table.this.tab4,.table.in.tab-4>*{width:33.3333%}
        .float.this.tab5,.float.in.tab-5>*,.inline.this.tab5,.inline.in.tab-5>*,.table.this.tab5,.table.in.tab-5>*{width:41.6667%}
        .float.this.tab6,.float.in.tab-6>*,.inline.this.tab6,.inline.in.tab-6>*,.table.this.tab6,.table.in.tab-6>*{width:50%}
        .float.this.tab7,.float.in.tab-7>*,.inline.this.tab7,.inline.in.tab-7>*,.table.this.tab7,.table.in.tab-7>*{width:58.3333%}
        .float.this.tab8,.float.in.tab-8>*,.inline.this.tab8,.inline.in.tab-8>*,.table.this.tab8,.table.in.tab-8>*{width:66.6667%}
        .float.this.tab9,.float.in.tab-9>*,.inline.this.tab9,.inline.in.tab-9>*,.table.this.tab9,.table.in.tab-9>*{width:75%}
        .float.this.tab10,.float.in.tab-10>*,.inline.this.tab10,.inline.in.tab-10>*,.table.this.tab10,.table.in.tab-10>*{width:83.3333%}
        .float.this.tab11,.float.in.tab-11>*,.inline.this.tab11,.inline.in.tab-11>*,.table.this.tab11,.table.in.tab-11>*{width:91.6667%}
        .float.this.tab12,.float.in.tab-12>*,.inline.this.tab12,.inline.in.tab-12>*,.table.this.tab12,.table.in.tab-12>*{width:100%}
        .tab-hidden{display:none !important}
        .tab-show{display:block !important}
        .tab-textcenter{text-align:center !important}
        .tab-textright{text-align:right !important}
        .tab-textleft{text-align:left !important}
        .tab-left{margin-left:0; margin-right:auto;}
        .tab-center{margin-left:auto; margin-right:auto; display:inherit !important;}
        .tab-right{margin-left:auto; margin-right:0}
        }
     */

    //Tüm ekran boyutlarını tek tek ele alıyoruz

    var key_ = Keys(Screens.Values);

    key_._each(function _each(key) {

        //İşlemler sırasında oluşturululan @media screen değerleri buraya kaydedilecek
        var cache = [];

        //Piece değeri kadar döngü oluşturur. Bilindiği üzere Piece değeri sayfada oluşturulacak maksimum parça değerini simgeler
        for (var n = 1; n <= Screens.Piece; n++) {

            var z = [];

            /**
             * Seçicileri bir döngü içerisinde ele alıp
             * Gelen her bir değeri this ve in işaretleyicilerle birleştiriyoruz
             * 
             * Örnek çıktı:
             * .float.this.web1
             */

            for (var i in Selectors.Values) {
                var x = Selectors.Values[i];
                //console.log(x);
                if (x.root && x.selector)
                    z.push(Format('.{0}.this.{1}{2}', i, key, n));

                if (x.children && x.selector)
                    z.push(Format('.{0}.in.{1}-{2}>*', i, key, n));



            } //floats


            /**
             * Z Array nesnesine eklenen çıktıyı formatlayarak yeni bir çıktı elde ediyoruz
             * 
             * Örnek çıktı:
             * .float.this.web1,.inline.this.web1,.table.this.web1{width:8.3333%}
             */


            cache.push(Format('{0}{width:{1}%}', z.join(','), Screens.screenCalc(n)));
            //console.log(Kakao.format('{0}{width:{1}%}', z.join(','), screenCalc(n)));



        } //piece







        /**
         * Selector nesnemizde all diye bir alan tanımladık
         * Bu alan her bir screen değerinde oluşturulacak verileri simgeliyordu
         * Örneğin işlem sırasındaki screen adı 'web' olsun. Bu gelen değeri Selector.all nesnemizin before methoduna gönderiyoruz
         * O da bize 'web' ön etiketiyle beraber bu method içindeki CSS adlarını birleştirerek ilgili ekran boyutunun değerleri olarak işleme almaktadır.
         * 
         * örnek:
         * 'web' adı methoda gönderiliyor.
         * Çıktı:
         * web-hidden yada web-show, web-remove vs...
         */

        Selectors.Values.all.before(key, cache);



        /**
         * Son olarak @media screen and ekran boyutumuzu oluşturuyoruz ve ilgili değerleri içerisine yüklüyoruz
         * 
         */
        Kakao.result.push(Media.Create(Screens.Values[key], cache.join('\n')));



    })

    /**
     * Sayfa üzerinde head kısmına <style></style> nesnesi oluşturuyoruz
     * Oluşturulan nesne içerisine Kakao.result değişkeni içindeki değerleri aktarıyoruz 
     */
    var sty = document.createElement('style');
    sty.innerHTML = Kakao.result.join('\n');
    document.head.appendChild(sty);


    /**
     * //////////////////////////////////////////
     * ////////// SELECTOR END //////////////////
     * //////////////////////////////////////////
     */





}


Plugins.add(Selectors);
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
Selectors.add('defaults', {


    /**
     * Sayfa içerisinde genel kullanım için tanımlanmış bilgiler yer alıyor
     * Ekran boyutlarından tamamen bağımsız kullanımı olan bilgiler tanımlanmalıdır
     */

    lock: true,

    each: true,

    before: function() {
        Kakao.result.push('*{box-sizing:border-box} ');
        Kakao.result.push('.showinit{display:none !important;}');
        Kakao.result.push('.overflow{overflow:hidden;}');
        Kakao.result.push('[data-grid]>*{width:100%;}');
        Kakao.result.push('[data-grid] .grid-col {vertical-align:top; width:25%;}');
        Kakao.result.push('[data-grid="form"] .grid-col {vertical-align:text-bottom !important;}');
        Kakao.result.push('[data-grid] .grid-col label {padding:3px; display:block; font-weight:bold;}');
        Kakao.result.push('[data-grid] .grid-col * {width:100%;}');
        Kakao.result.push('[data-grid] .grid-col {padding:2px;}');
        Kakao.result.push('[data-grid] .data-row::before,[data-grid] .data-row::after{content:" "; display:block; clear:both; width:100% !important;}')
        Kakao.result.push('[data-magnet] > * {width:20%; float:left;}');
    },

    init: false


});
Selectors.add('inline', {


    selector: true,

    root: true,

    children: true,

    each: true,

    before: function() {
        Kakao.result.push('.inline.this,.inline.in>*{display:inline-block; vertical-align:top;margin-right:-4px; padding:2px;}');
        Kakao.result.push('.inline.in::before,.inline.in::after{content:" "; display:block; clear:both;}');
        Kakao.result.push('.middle-this{vertical-align:middle !important;}');
        Kakao.result.push('.middle-in>*{vertical-align:middle !important;}');
        Kakao.result.push('.middle-all,.middle-all>*{vertical-align:middle !important;}');
    }


});
Selectors.add('table', {

    selector: false,

    root: false,

    children: false,

    each: false,

    before: function() {
        Kakao.result.push('.table.this,.table.in{display:table;}');
        Kakao.result.push('.table.in>*{display:table-cell; padding:2px;}');
    }
});
Selectors.add('float', {


    selector: true,

    root: true,

    children: true,

    each: true,

    before: function() {

        Kakao.result.push('.float.this,.float.in>*{float:left; margin:0; padding:2px;}');
        Kakao.result.push('.float.group::before,.float.group::after,.float.in::before,.float.in::after{content:" "; display:block; clear:both;}');
        Kakao.result.push('.float-this,.float-in>*,.float-all,.float-all>*{float:left;}');
    }



});
/*
 * İşaretleyiciler
 * Hangi nesneler üzerinde işlem yapılacağına dair fikir verir
 * Nesne üzerinde eklendiğinde tek başına herhangi bir etkileşimleri bulunmamaktadır
 */

var Markers = (function Markers() { return Markers })()


Markers.Names = {
    'all': [],
    'this': [],
    'in': [],
    'any': false
}


Markers.constructor = {}

Markers.constructor.run = function run() {

    for (var i in Screens.Values) {

        for (var n = 1; n <= Screens.Piece; n++) {
            //This
            Markers.Names['this'].push(i + n);
            //In
            Markers.Names['in'].push(i + '-' + n);
        }
    }

    //Defaults
    Markers.Names.this.push('this');
    Markers.Names.this = Markers.Names.this.concat(Selectors.getOnlySelectors());

    Markers.Names.in.push('in');
    Markers.Names.in = Markers.Names.in.concat(Selectors.getOnlySelectors());

    Markers.Names.all = Markers.Names.all.concat(Markers.Names.this, Markers.Names.in);

}


Plugins.add(Markers);
var Grids = (function Grids() {


    return Grids;
})()


/**
 * Row nesneleri içerisinde yeni column nesneler oluşturmaktadır
 */
Grids.createCol = function(a) {
    var e = document.createElement('div');
    Grids.createLabel(a, e);
    e.appendChild(a);
    return e;
}



/**
 * İstenen root nesne içerisinde label nesnesi ve içeriği oluşturuluyor
 */
Grids.createLabel = function(a, target) {

    //Label değeri varsa işleme al
    var lbl = a._attr('data-label');
    if (lbl) {

        //Label oluştur
        var c = document.createElement('label')
            ._class('data-col-label')
            ._removeAttr('data-label');

        //Label değerini innerHTML olarak ata
        c.innerHTML = lbl;

        //Label nesnesini istenen root nesnesine ata
        target.appendChild(c)
    }
}






/**
 * Belirtilen nesneye ait çocuk nesnelerin sahip olduğu data-screen değerleri bu alanda işlenerek
 * parent nesnesine ilgili değerler uygulanmaktadır
 */
Grids.addScreen = function(children) {
    //Her bir cocuk nesnesinde data-screen değerini aranıyor
    for (var n = 0; n < children.length; n++) {

        //İlgili sıradaki nesneyi alır
        var chl = children[n];

        //Nesne içinde data-screen ifadesi var mı bakar
        var datascreen = chl.children[chl.children.length - 1]._attr('data-screen');

        //Eğer data screen ifadesi yoksa yani boşsa varsayılan olarak sutun sayısı kadar web değeri atar
        if (!datascreen) {
            children[n]._class('all' + Screens.Piece / children.length)
        }
        //Eğer data screen özelliği bir değere sahipse ve string ifade barındırıyorsa
        else if (datascreen && typeof datascreen === 'string') {
            children[n]._class(datascreen.split(' '));
        }
    }
}







//Children nesnelere toplu değer atamaları yapılır
Grids.addClassToChildren = function(children) {
    for (var i = 0; i < children.length; i++) {
        children[i]._class(Filter.toArray(arguments, 1));
    }
}


Grids.constructor = {};



Grids.constructor.onload = function onload() {


    var _grids = document.querySelectorAll('[data-grid]');

    if (!_grids || _grids.length == 0) return;

    for (var index = 0; index < _grids.length; index++) {

        var a = _grids[index];


        //İlgili nesne içerisindeki maksimum satır sayısı
        var maxRowCount = 0;

        //İlgili nesnenin içindeki çocuk nesne sayısı
        var children = a.children;

        //Çocuk nesnelerin sayısı
        var length = children.length;

        //Oluşturulacak her bir grid satır nesnesi
        var rows = document.createElement('div')._class('data-row');

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
                Grids.addClassToChildren(rows.children, 'float', 'this', 'grid-col');

                //İşlenen nesneleri grid nesnesi içine yeni satır olarak ekle
                a.appendChild(rows);


                //İlgili nesnede data-screen değerleri varsa uygular, eğer yoksa sütun sayısına eşitler
                Grids.addScreen(rows.children);


                //Sonraki satır için yeni row oluştur
                rows = document.createElement('div')._class('data-row');

                //İşlenen sütun sayısını sıfırla
                colCount = 0;
            }

            //Hangi satırdaysak, ilgili seçili nesneyi sıradaki satır nesnesine aktar.
            rows.appendChild(Grids.createCol(item));

            //İşlem bittikten sonra, bu nesne ile ilişkisinin bittiğine dair length değeri 1 eksiltiliyor
            length--;

            //Eğer length değeri 0 ise ve eğer işlenmiş 1,2 kayıt varsa da onları da ekle
            if (length == 0) {

                Grids.addClassToChildren(rows.children, 'float', 'this', 'grid-col');

                //İlgili nesnede data-screen değerleri varsa uygular, eğer yoksa sütun sayısına eşitler
                Grids.addScreen(rows.children);

                a.appendChild(rows);

                a.classList.remove('showinit');
            }
        }


    }


    Listener.remove(window, 'load', Grids.constructor.onload);

}



Plugins.add(Grids);
var Groups = (function Groups() {

    //format : inline-web-6-6, inline-tab-12-12-5-1, float-tab-12-12
    Groups.formatR = Regx('(' + Selectors.getOnlySelectors().join('|') + ')\\-(' + Keys(Screens.Values).join('|') + ')(\\-\\d{1,2})+')

    return Groups;
})();


Groups.applyChildren = function(objs, params, values) {

    for (var i in objs) {
        Groups.applyChild(objs[i], params, values);
    }
}





Groups.applyChild = function(obj, params, values) {

    /**
     * Gelen sayısal değerleri öncelikle kontrol edeceğiz
     * Eğer tek bir kayıt varsa, ilgili sayısal veriyi tüm alt nesnelere aynı şekilde uygulayacagız
     * Eğer iki ve daha fazla sayı varsa ilgili sayının katları şeklinde alt nesnelere uygulayacağız
     * Örneğin 2 tane sayısal kayıt geldiğini düşünelim
     * [4,6]
     * Örnek ilgili nesnemizin alt nesneleri de 5 adet div nesnesi olsun
     * O halde ikişerli olarak her nesneye ilgili sayıları uygulayacağız
     * 1'nci div 4 değerini,
     * 2'nci div 6 değerini,
     * 3'üncü div 4 değerini,
     * 4'ünvü div 6 değerini gibi iki ve katları şeklinde uygulanmıştır
     * Uygulanacak sayı değeri sayısı ilgili nesnelerin sayısından az ise tekrar başa dönerek sırasdaki nesneye sıradaki sayı değerini uygular
     * 
     */


    if (obj == null) return;
    if (obj.children == null) return;
    if (obj.children.length == 0) return;

    var startIndex = -1;

    for (var n = 0, length = obj.children.length; n < length; n++) {

        if (startIndex < values.length - 1)
            startIndex++;
        else
            startIndex = 0;

        //Örnek web12
        var dataClass = params[2] + values[startIndex];

        //Örnek web12, this, inline sınıf değerlerinin hepsi atanıyor
        obj.children[n]._class(dataClass, 'this', params[1]);

        //Sadece float özelliğinde
        if (params[1] == 'float') {
            obj._class('float', 'group');
        }

    }

}








/**
 * Bulunan match değerlerini ilgili nesnenin alt nesnelerine uygular
 */

Groups.applyMatch = function(match, obj) {


    for (var i in match) {

        var b = match[i];

        /**
         * b parametresinden gelen değeri exec ile grouplara ayıralım
         * 
         * İlgili nesne sınıf değerleri içinde istediğimiz gibi kayıt/kayıtlar mevcut. O halde işleyelim
         * Bulunan değerin web-inline-6-6 olduğunu varsayarak işleyelim
         * Exec ile bize aşağıdaki gibi bir çıktı verecek
         * group0 : web-inline-6-6
         * group1 : web
         * group2 : inline
         * group3 : 6
         */

        var params = Groups.formatR.exec(b);

        //Regex nesne formatımız sabit olduğundan, yani new RegExp demediğimiz için formatın sorgu sırasını 0'a çekiyoruz
        Groups.formatR.lastIndex = 0;

        //Eğer formata uygun değilse iptal et
        if (!params) return;

        //Sayısal değerleri almak için - işaretinden parçalayalım
        var values = params[0].split('-');

        //Sayısal değerleri alalım. 2. index kaydından itibaren tüm kayıtları alalım
        values = values.slice(2, values.length);

        //Secici ifadeki silelim *-inline-*-*-* vs
        obj._removeClass(params[0]);

        //Next all özelliğini kontrol ederek kaç nesneyi daha etkileyip etkilemeyeceğini bulalım
        var next = obj._attr('data-next')

        /**
         * Tek bir nesneden fazla nesnede etkileşim olacağını anlıyoruz
         * Şimdi kaç nesnenin etkileceğini bulup işlemi yaptıralım
         */

        if (!next) {
            obj._removeAttr('data-next');
            Groups.applyChild(obj, params, values);
        }

        //Belirli aralıktaki nesnelere uygulama yapalım
        else if (next) {

            //* değeri varsa tüm nesneleri seçelim
            if (next && next === '*')
                next = obj.parentNode.children.length;

            //Değilse sadece belirli sayı aralığındakileri seçelim
            else if (next && isNum(next))
                next = parseInt(next);

            //0dan büyük bir değer olmalı
            if (next >= 0) {

                var children = Array.prototype.slice.call(obj.parentNode.children);

                //Şimdi bizim nesnemizin bu ana grup içinde bulunduğu pozisyonun index numarasını al
                var currentIndex = children.indexOf(obj);

                //Şimdi de nesnemizin bulunduğu pozisyondan kaç tanesi bu durumdan etkilenecekse, bu grubun listesini ver
                var t = children.slice(currentIndex, currentIndex + parseInt(next) + 1);

                Groups.applyChildren(t, params, values);

            }
        }

    }

}





//constructor
Groups.constructor = {};






//Sayfa yüklendiğinde çalıştırılacak method
Groups.constructor.onload = function() {


    //web, tab, mob, min
    var keys = Keys(Screens.Values);

    //Format : [class*="-float-"], [class*="-inline-"], [class*="-table-"]
    var queryvalue = Format.Repeat('[class*="{}-"]', Selectors.getOnlySelectors()).join(',');

    //Sayfa üzerinde ki -float-, -inline-, -table- gibi sınıf adlarına sahip nesneleri seçer
    var selectGroups = document.querySelectorAll(queryvalue);


    if (selectGroups && selectGroups.length > 0) {

        //Bulunan her bir nesneyi tek tek işleme al

        for (var i = 0, len = selectGroups.length; i < len; i++) {

            var b = selectGroups[i];
            //-float-, -inline-, -table- gibi değerlerle nesneler bulunmuş olabilir ama yeterli değil
            //ilgili nesnenin sınıf adlarında tam olarak bizim istediğimiz formatta bir sınıf adı varsa işleme alacağız
            var match = b.className.match(Groups.formatR);

            //Eğer hiç bulunamamışsa bu nesne bize uygun değil demektir
            if (match == null) return;


            //İşlem yapıldığına dair işaret koyalım
            b.groupMatch = match;


            b.groupTrigger = function() {
                Groups.applyMatch(match, b);
            }

            //İlgili nesnenin bağlı olduğuğu parent nesnesine group ibaresi ekleyelim
            b.parentNode.groups = true;

            /**
             * Eğer gelen bir array liste varsa ve değer/değerler bulunmuşsa. Aşağıdaki gibi bir örnek çıktı verecektir
             * 
             * Array[2]
             *  0: "web-float-12-12"
             *  1: "tab-float-12-12"
             *  length: 2
             *  __proto__: Array[0]
             * 
             * Tek bir nesne içinde 2 kayıt bulunduğunu varsayarak ilerliyoruz
             */

            Groups.applyMatch(match, b);


            //Sayfa üzerinde yeni bir nesne oluşturulduğunda tetiklenecek methodumuz
            Listener.add(b, 'DOMNodeInserted', function(e) {

                e.children._each(function(b) {
                    if (b.groupTrigger)
                        b.groupTrigger();
                });
            });


        }

    }





    Listener.remove(window, 'load', Groups.constructor.onload);

}




//Plugini yükle
Plugins.add(Groups);
/**
 * 
 *  Magnets
 *  Magnet nesnesi ile nesnenin içeriğinde bulunan çocuk nesnelerini birbirine yapışarak dizilen formata getirmektedir
 */



//Plugin
var Magnets = (function Magnets() {

    Magnets.formatR = Regx('(' + Keys(Screens.Values).join('|') + ')\-(\\d{1,2})')

    return Magnets;

})()



Magnets.custommagnet = function custommagnet(obj, screenSize) {


    /**
     * data-magnet özelliğine ait nesnemizin sayfa içinde kullanacağımız bazı özelliklerini bu alan içerisinde tutulacak
     * 
     */

    var magset = {

        //İşlem yapılan nesnenin bir magnet nesnesi olduğunu ve bir işlem yapıldığını belli eder
        status: true,

        //data-magnet nesnesinin sayfa yüklendiği anda kaç parçaya ayrıldığı bilgisini tutar
        //Böylece sayfa her resize olduğunda buradaki değer ile parçalanması gereken değer aynıysa işlem yapılmayacak
        piece: 0,

        //CopyChildren
        children: []
    }

    //İlgili çocuk nesnelerin sayısı
    var length = obj.children.length;


    //Çocuk nesneler kadar döngü oluştur
    while (obj.children.length > 0) {
        magset.children.push(obj.children[0].cloneNode(true));
        obj.children[0].remove();
    }

    //setting nesnesini ilgili data-magnet nesnesine aktaralım
    obj['magnetSetting'] = magset;

    //Maksimum parca sayısı ör : 4
    var max = Magnets.getMaxValues(screenSize, 'piece');

    //sayfa yüklendiğinde çalıştırılacak olan method. Parametre olarak gönderilmiş değerler üzerinden işlem yapılacaktır
    Magnets.triggerResize(magset.children, obj, screenSize, max);

    //sayfa boyutlandığında çalıştırılacak olan method. Parametre olarak gönderilmiş değerler üzerinden işlem yapılacaktır

    Listener.add(window, 'resize', function() {
        Magnets.triggerResize(magset.children, obj, screenSize, max);
    });

    //Sayfa üzerinde yeni bir nesne oluşturulduğunda çalıştırılacak dinleyici
    Listener.add(obj, 'DOMNodeInserted', function(item, root, e, f) {
        Magnets.addNewMagnet(magset.children, item, root);
    });


    //Nesneye yeni magnetler eklemek için kullanılabilir method
    obj['appendMagnet'] = function(params) {
        if (isObj(params)) {

            if (params.length > 1)
                params._each(function(item) {
                    Magnets.addNewMagnet(obj.magnetSetting.Children, item, obj)
                });
            else
                Magnets.addNewMagnet(obj.magnetSetting.Children, params, obj)

        }
    }

}






/**
 * Sayfa boyutlanırken, data-magnet alanının boyuta göre kaç parçaya ayrılacağı bilgisini hesaplayıp geriye döndürmektedir.
 */
Magnets.findScreenPiece = function findScreenPiece(obj) {
    var result = 0;
    for (var k in obj)
        if (window.innerWidth < obj[k][0]) result = obj[k][1];
    return result;
}








/**
 * data-magnet nesnesinin children nesnelerinden hangisinin yüksekliğinin en kısa olduğunu bize verir
 * Amacımız yüksekliği en kısa nesneye yeni nesneleri eklemek.
 */


Magnets.findLowestObject = function findLowestObject(parent) {

    //  console.log(parent);
    /**
     * Dönüş tipi olarak gelen çocuk nesnelerinden ilk nesneyi seçiyoruz
     * Ve ilk nesnenin yükseklik değerini referans alıyoruz
     * eğer ilk nesne yüksekliği 0 ile zaten başka küçük değer olmayacağından
     * ilk nesneyi geri döndürüyoruz.
     * 
     * Eğer 0 dan büyükse, tüm dilimlerin yüksekliklerini kontrol edip en küçük olanı alıyoruz
     */

    var children = parent.children;
    var e = children[0];
    var result = children[0].offsetHeight;
    if (result <= 0) return e;

    for (var i = 0, len = parent.magnetSetting.piece; i < len; i++) {
        if (children[i].offsetHeight < result) {
            result = children[i].offsetHeight;
            e = children[i];
        }
    }


    //@return
    return e;

}






/**
 * Belirttimiz ana nesne içindeki çocuk nesneleri siler
 */
Magnets.removeChildren = function removeChildren(obj) {
    if (!obj) return;
    while (obj.children.length > 0) {
        obj.children[0].remove();
    }
}







/**
 * Sayfa üzerinde oluşturulan tüm nesneleri kontrol eder
 * Eğer içeriğinde bizim şartlarımızı sağlayan özellikler varsa işlemi yapar.
 * Örneğin sayfa üzerinde oluşturulmuş herhangi bir nesnenin parent nesnesi bir data-magnet mi
 * ve oluşturulan yeni nesne üzerinde daha önce magnet işlemi yapıldımı kontrol ediliyor
 * ve oluşturulan nesne magnet-item sınıf adına sahip değilse işleme alınıyor
 */

Magnets.addNewMagnet = function addNewMagnet(childrenList, item, parent) {

    //Eklenmiş olan nesnenin parent nesnesinde magnet var mı
    var mgSet = parent.magnetSetting;

    //Varsa işlemi yap
    if (mgSet && mgSet.status === true && !item.isMagnetAvaible && !item.dataMagnetItem) {

        try {

            //Yeni nesneyi klonla
            // var cln = item.cloneNode(true);

            item.isMagnetAvaible = true;

            //Orjinali sil
            //item.remove();

            //Hafızaya ekle
            mgSet.children.push(item);

            //Son olarak da copyayı ekrana bastır
            Magnets.findLowestObject(parent).appendChild(item);

        } catch (ex) { console.log(ex); }
    }


}









//Sayfa ilk yüklendiğinde ve ekran boyutlandırıldığında işleyecek method
//Tüm işlemleri burada yapıyoruz
Magnets.triggerResize = function triggerResize(children, obj, screenSize, max) {

    var pieceCount = Magnets.findScreenPiece(screenSize);

    //Ekran boyutlandırma sırasında parçalanma bilgisi değişirse uyguluyoruz
    if (obj.magnetSetting.piece != pieceCount) {

        /**
         * data-magnet nesnesi içinde oluşan çocuk nesne sayısı değerini
         * data-magnet nesnemizin setting özelliğine bildiriyoruz
         * 
         */
        obj.magnetSetting.piece = pieceCount;

        //data-magnet nesnesindeki tüm çocuk nesneleri temizleyelim
        Magnets.removeChildren(obj);

        /**
         * data-magnet nesnesi icerisindeki tüm nesneleri sildikten sonra
         * tekrardan istediğimiz parça sayısı kadar cocuk nesne oluşturuyoruz
         */
        for (var n = 0; n < pieceCount; n++) {
            var u = document.createElement('div');
            u['dataMagnetItem'] = 'v.0.1';
            obj.appendChild(u);
        }


        /**
         * Sayfa oluşturulurken bulunan nesneleri hafızaya kopyalamıstık.
         * Kopyalanan bu nesneleri yeni oluşturduğumuz parcalara dağıtıyoruz
         * Dağıtırken kullanılan mantık, en düşük yüksekliğe sahip nesneye sıradaki nesneyi aktarıyoruz
         * 
         */

        for (var c = 0; c < children.length; c++) {
            var lowestHeightObj = Magnets.findLowestObject(obj);
            lowestHeightObj.appendChild(children[c]);

            if (c == children.length - 1)
                obj.classList.remove('showinit');
        }

    }

}



//İstediğimiz alanın maksimum değere sahip kaydını alalım
//En fazla kaç parçaya böleceğimize dair bilgiyi almış olacağız
Magnets.getMaxValues = function getMaxValues(values, name) {

    var max = 0;
    for (var i in values) {
        if (i[name] > max)
            max = i[name];
    }

}




/**
 * Gelen string değer içerisinde istenen formattaki değerleri alıp dizi olarak geri döndürüyoruz
 */
Magnets.getMatches = function getMatches(values) {

    //Eğer değer yoksa varsayılan olarak tek parçaya bölüyoruz
    if (!values)
        values = [
            ['all-12', 'all', '12']
        ];
    else {
        values = values.match(Magnets.formatR);

        Magnets.formatR.lastIndex = 0;
    }
    return values;
}






/**
 * 
 * Gelen match edilmiş diziyi bizim istediğimiz formata çevirip geri döndürüyoruz
 * 
 */

Magnets.getResizeValues = function getResizeValues(obj) {

    //Ekran boyutlandırılırken kontrolün kolay sağlanması için özel nesne oluşturuyoruz
    /**
    * {
        'web':{
                'piece':3,
                'size':2500
            },
        'tab':{
                'piece':2,
                'size':800
              }
       }
    * 
    */

    var customScreen = [];

    var matches = obj.className.match(Magnets.formatR);
    Magnets.formatR.lastIndex = 0;

    //["web-4", "tab-6", "mob-12"]
    for (var z = 0; z < matches.length; z++) {

        //Group Şeklinde alalım
        var scrGroupItem = Magnets.formatR.exec(matches[z]);
        Magnets.formatR.lastIndex = 0;


        //İptal edelim
        if (!scrGroupItem || scrGroupItem.length == 0)
            return null;


        //Geliştirici tarafından verilen ekran boyut isimleri, screens nesnesi içindeki özellik adları kontrol ediliyor
        if (Screens.Values.hasOwnProperty(scrGroupItem[1])) {

            var num = Screens.Values[scrGroupItem[1]];
            if (num == 0)
                num = 9999;

            customScreen.push([num, Screens.Piece / scrGroupItem[2]]);

        }

    } //For

    customScreen.sort(function(r, t) { return customScreen[t] - customScreen[r] });

    return customScreen;

}


//Constructor
Magnets.constructor = {}



//Sayfa yüklendiğinde işletilecek method
Magnets.constructor.onload = function onload() {

    //Sayfa üzerinde ki tüm data-magnet nesnelerini seçelim
    var datamagnet = document.querySelectorAll('[data-magnet]');

    //Eğer bir nesne varsa işleme alalım
    if (datamagnet != null)
        if (datamagnet.length > 0) {

            //Bulunan nesne sayısı kadar döngü oluştur
            for (var i = 0; i < datamagnet.length; i++) {

                //data-magnet nesneleri sadece div olabilir
                if (datamagnet[i].tagName != 'DIV') {
                    console.log('Data-magnet nesneleri sadece DIV elementi olabilir');
                    return;
                };

                /**
                 * Gelen screen boyutlarını alıyoruz
                 * Alınan bu bilgileri screen nesnesindeki değerlerle karşılaştıracağız
                 * Screen nesnesine uyan değerler alınıp, ekran boyutlandırması sırasında kullanacağız
                 */

                var y = datamagnet[i];

                //Geliştirici tarafından verilen değerleri alalım
                //var scr = y._attr('data-screen').toString();

                //["web-4", "tab-6", "mob-12"]
                //var scrMatch = Magnets.getMatches(scr);


                //Nesnemize ilgili sınıf değerlerini ekleyelim
                //y._class(scr.split(' '))._class(['in', 'float']);

                //Nesneden data-screen özelliğini kaldıralım
                //y._removeAttr('data-screen');

                var p = Magnets.getResizeValues(y);

                if (p)
                    new Magnets.custommagnet(y, p);


            }

        }




    Listener.remove(window, 'load', Magnets.constructor.onload);

}




//Plugini ekleyelim
Plugins.add(Magnets);
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
/**
 * Pluginleri çalıştıralım
 */

for (var n = 0, len = Plugins.constructor.run.length; n < len; n++) {
    Plugins.constructor.run[n]();
}


for (var n = 0, len = Plugins.constructor.onload.length; n < len; n++) {
    Listener.add(window, 'load', Plugins.constructor.onload[n]);
}


})()
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
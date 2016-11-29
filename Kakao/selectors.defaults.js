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
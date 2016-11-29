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
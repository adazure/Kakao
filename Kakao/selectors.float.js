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
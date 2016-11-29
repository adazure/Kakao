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
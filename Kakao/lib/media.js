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
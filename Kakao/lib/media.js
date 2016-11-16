Kakao.media = {

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
    create: function(g, i) {
        if (!Kakao.isNum(g) || g < 1) return i;
        return Kakao.format('@media screen and (max-width:{0}px){{1}}', g, i);
    }
}
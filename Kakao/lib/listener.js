Element.prototype._listen =
    Document.prototype._listen =
    Window.prototype._listen = function(e, m) {
        if (this.addEventListener)
            this.addEventListener(e, m, false);
        else
            this.attachEvent('on' + e, m);
    }
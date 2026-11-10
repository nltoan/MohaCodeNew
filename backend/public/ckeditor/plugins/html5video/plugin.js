/**
 * HTML5 video widget (third-party plugin 'html5video', locally modified).
 * Extracted from the former custom CKEditor 4.14.0 build when upgrading to 4.22.1.
 */
CKEDITOR.plugins.add("html5video", {
                requires: "widget",
                lang: "en,vi",
                icons: "html5video",
                init: function (e) {
                    e.widgets.add("html5video", {
                        button: e.lang.html5video.button,
                        template: '<div class="ckeditor-html5-video"></div>',
                        allowedContent: "div[data-responsive](!ckeditor-html5-video){text-align,float,margin-left,margin-right,width}; video[src,poster,controls,autoplay,width, height,loop,style]{max-width,height,width};",
                        requiredContent: "div(ckeditor-html5-video); video[src];",
                        upcast: function (e) {
                            return "div" === e.name && e.hasClass("ckeditor-html5-video")
                        },
                        dialog: "html5video",
                        init: function () {
                            var e = "",
                                t = "",
                                n = "",
                                i = "",
                                o = this.element.getStyle("text-align"),
                                a = "",
                                r = "",
                                s = "";
                            this.element.getChild(0) &&
                                (e = this.element.getChild(0).getAttribute("src"), a = this.element.getChild(0).getAttribute("width"), r = this.element.getChild(0).getAttribute("height"), t = this.element.getChild(0).getAttribute("autoplay"), allowdownload = !this.element.getChild(0).getAttribute("controlslist"), n = this.element.getChild(0).getAttribute("loop"), advisorytitle = this.element.getChild(0).getAttribute("title"), i = this.element.getChild(0).getAttribute("controls"), responsive = this.element.getAttribute("data-responsive"), s = this.element.getChild(0).getAttribute("poster")), e && (this.setData("src", e), o ? this.setData("align", o) : this.setData("align", "none"), a && this.setData("width", a), r && this.setData("height", r), t && this.setData("autoplay", "yes"), allowdownload && this.setData("allowdownload", "yes"), n && this.setData("loop", "yes"), advisorytitle && this.setData("advisorytitle", advisorytitle), responsive && this.setData("responsive", responsive), i && this.setData("controls", i), s && this.setData("poster", s))
                        },
                        data: function () {
                            if (this.data.src) {
                                if (!this.element.getChild(0)) {
                                    var e = new CKEDITOR.dom.element("video");
                                    e.setStyle('width', '100%');
                                    e.setAttribute("controls", "controls"), this.element.append(e)
                                }
                                this.element.getChild(0).setAttribute("src", this.data.src), this.data.width && this.element.getChild(0).setAttribute("width", this.data.width), this.data.height && this.element.getChild(0).setAttribute("height", this.data.height), this.data.responsive ? (this.element.setAttribute("data-responsive", this.data.responsive), this.element.getChild(0).setStyle("max-width", "100%"), this.element.getChild(0).setStyle("height", "auto")) : (this.element.removeAttribute("data-responsive"), this.element.getChild(0).removeStyle("max-width"), this.element.getChild(0).removeStyle("height")), this.data.poster && this.element.getChild(0).setAttribute("poster", this.data.poster)
                            }
                            this.element.removeStyle("float"), this.element.removeStyle("margin-left"), this.element.removeStyle("margin-right"), "none" === this.data.align ? this.element.removeStyle("text-align") : this.element.setStyle("text-align", this.data.align), "left" === this.data.align ? (this.element.setStyle("float", this.data.align), this.element.setStyle("margin-right", "10px")) : "right" === this.data.align && (this.element.setStyle("float", this.data.align), this.element.setStyle("margin-left", "10px")), this.element.getChild(0) && ("yes" === this.data.autoplay ? this.element.getChild(0).setAttribute("autoplay", "autoplay") : this.element.getChild(0).removeAttribute("autoplay"), "yes" === this.data.loop ? this.element.getChild(0).setAttribute("loop", "loop") : this.element.getChild(0).removeAttribute("loop"), "yes" === this.data.allowdownload ? this.element.getChild(0).removeAttribute("controlslist") : this.element.getChild(0).setAttribute("controlslist", "nodownload"), this.data.advisorytitle ? this.element.getChild(0).setAttribute("title", this.data.advisorytitle) : this.element.getChild(0).removeAttribute("title"), this.element.getChild(0).setAttribute("controls", "controls"))
                        }
                    }), e.contextMenu && (e.addMenuGroup("html5videoGroup"), e.addMenuItem("html5videoPropertiesItem", {
                        label: e.lang.html5video.videoProperties,
                        icon: "html5video",
                        command: "html5video",
                        group: "html5videoGroup"
                    }), e.contextMenu.addListener((function (e) {
                        if (e && e.getChild(0) && e.getChild(0).hasClass && e.getChild(0).hasClass("ckeditor-html5-video")) return {
                            html5videoPropertiesItem: CKEDITOR.TRISTATE_OFF
                        }
                    }))), CKEDITOR.dialog.add("html5video", this.path + "dialogs/html5video.js")
                }
            });

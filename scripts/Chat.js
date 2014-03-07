var Chat = (function () {
    function init(scene, parent) {
    	
        this.parent = parent;
        this.selected = false;
        this.mouseOnLabel = false;
        this.curLine = 0;
        this.textMass = [];
        this.docHeight = 0;
        this.nonActiveLines = 0;
        this.trickLinesCounter = 0;
        this.chatContainer = new CAAT.ActorContainer()
            .setSize(images['chatBackgroundImage'].singleWidth, images['chatBackgroundImage'].singleHeight)
            .setLocation(json.chatlocation.x, json.chatlocation.y)
            .setVisible(true);
        scene.addChild(this.chatContainer);

        var chatBackground = new CAAT.Actor().setBackgroundImage(images['chatBackgroundImage'].getRef(), true);
        this.chatContainer.addChild(chatBackground);
        var activeWidth = images['chatBackgroundImage'].singleWidth  - (json.chatMargin.leftMargin + json.chatMargin.rightMargin);
        var activeHeight = images['chatBackgroundImage'].singleHeight - (json.chatMargin.topMargin + json.chatMargin.bottomMargin);
        this.inputWidth = activeWidth;
        this.labelHeight = activeHeight - json.input.size.height;
        this.scrHeightMaxHeight = activeHeight - json.input.size.height - json.scrollBtnUp.height - json.scrollBtnDown.height;

        var chatTextContainer = new CAAT.ActorContainer()
            .setSize(activeWidth, activeHeight - json.input.size.height)
            .setLocation(json.chatLabel.location.x, json.chatLabel.location.y);
        this.inputContainer = new CAAT.ActorContainer()
            .setSize(activeWidth, json.input.size.height)
            .setLocation(json.input.location.x, images['chatBackgroundImage'].singleHeight - json.input.size.height - json.chatMargin.bottomMargin);

        this.chatContainer.addChild(chatTextContainer);
        this.chatContainer.addChild(this.inputContainer);
        this.chatLabel = new CAAT.UI.Label()
            .setSize(activeWidth, activeHeight - json.input.size.height)
            .setStyle("default", {
                alignment: "left",
                font: json.chatLabel.default.font,
                fontSize: json.chatLabel.default.fontSize,
                tabSize: json.chatLabel.default.tabSize,
                fill: json.chatLabel.default.fill
            })
            .setStyle("observer", {
                fill: json.chatLabel.observer.fill
            })
            .setStyle("admin", {
                fontSize: json.chatLabel.admin.fontSize,
                fill: json.chatLabel.admin.fill
            })
            .setStyle("player", {
                fill: json.chatLabel.player.fill
            })
            .setStyle("trick", {
                fill: json.chatLabel.player.fill
            })
            .setStyle("bold", {
                bold: true
            });

        this.labelContainer = new Input(this.inputContainer, this);
        if (this.labelContainer.keydownHandler !== undefined){
            $('#table').bind('keydown', this.labelContainer.keydownHandler);
            $('#table').bind('keypress', this.labelContainer.keyboardPressHandler);
            $('#table').bind('keyup', this.labelContainer.keyboardDownHandler);
        }
        /**
         * Mouse wheel event
         * @type {*|jQuery|HTMLElement}
         */
        var mouseWheel = function (event){
            if (this.mouseOnLabel &&  this.docHeight > this.chatLabel.height){
            var delta = 0;
            if (event.type === "mousewheel"){   /* IE/Opera/Chrome. */
            event = window.event;
            } else if(event.type === "DOMMouseScroll"){  /* Mozilla case. */
            event = event.originalEvent;
            }
            if (event.wheelDelta !== undefined) { /* IE/Opera/Chrome. */
                delta = event.wheelDelta / 120;
            } else if (event.detail) { /* Mozilla case. */
                delta = -event.detail/3;
            }
            var handle = function (delta) {
                scroll = delta;
                if(scroll > 0)
                {
                    this.lineUp();
                }
                if(scroll < 0)
                {
                    this.lineDown();
                }
            }.bind(this);
                if (delta){
                    handle(delta);
                }
        }
        }.bind(this);

        var $canvas = $('#game-canvas');
        $canvas.bind('mousewheel', mouseWheel);
        $canvas.bind('DOMMouseScroll', mouseWheel);

        chatTextContainer.addChild(this.chatLabel);
        this.chatLabel.mouseEnter = (function(){
            this.mouseOnLabel = true;
        }).bind(this);
        this.chatLabel.mouseExit = (function(){
            this.mouseOnLabel = false;
        }).bind(this);
        this.chatLabel.mouseClick = (function(){
            this.selected = false;
        }).bind(this);

        this.scroll = new Scroll(chatTextContainer, (this.lineUp).bind(this), (this.lineDown).bind(this));
        this.scroll.SetPosition(activeWidth, activeHeight, json.scrollWidth, json.input.size.height, this.scrHeightMaxHeight);

    }
    init.prototype.textAdd = function (trick){
        var newlines  = this.chatLabel.lines;
        if (trick) {
            if (this.trickLinesCounter !== 0) this.deleteLastTrick(json.trickTitle);
            this.trickLinesCounter = this.chatLabel.lines.length;
        }
        for (var i=0; i<newlines.length; i++){
            this.textMass.push(newlines[i]);
            trick ? log('now text height' + this.docHeight) : this.docHeight += newlines[i].height;
        }
        newlines.length = 0;
    };

    init.prototype.redrawText = function () {
        var h = 0;
        var i = this.curLine;

        while (i < this.textMass.length) {
            h += this.textMass[i].height;
            if(h < this.labelHeight){
                i++;
                continue;
            } else {
              break;
            }
        }

        var currentArray = this.textMass.slice(this.curLine, i);
        this.chatLabel.lines = setLinesY(currentArray);
        this.scroll.setScroll(this.labelHeight, this.docHeight, this.scrHeightMaxHeight);
    };

    function setLinesY (arr){
        arr[0].y = 0;
        for (var i = 0; i < arr.length - 1; i++){
            arr[i+1].y = arr[i].y + arr[i].height;
        }
        return arr;
    }



    init.prototype.setLines = function () {
        var linesLength = this.textMass.length;
        var h = 0;
        var i = linesLength - 1;
        while (h < this.labelHeight - this.textMass[this.curLine].height && i >= 0) {
            h += this.textMass[i].height;
            i--;
        }
        this.curLine = i + 1;
        if(i < 0) this.curLine = 0;
        this.nonActiveLines = this.curLine;
    };

    init.prototype.lineUp = function (isFromScroll) {
        this.curLine--;
        if (this.curLine <= 0) {
            this.curLine = 0;
        }
        this.redrawText();
        if (!isFromScroll){
            this.scroll.labelScrollHandler.y -= this.scroll.scaleInterval;
            this.scroll.checkScrollHandlerPosition(this.scroll);
        }

    };

    init.prototype.lineDown = function (isFromScroll) {
        var oldLines = this.chatLabel.lines;
        var h = 0;
        for (var i = this.curLine; i < this.textMass.length; i++) {
            h += this.textMass[i].height;
            if (h > this.labelHeight) {
                this.curLine++;
                break;
            }
        }
        this.chatLabel.lines = oldLines;
        this.redrawText();
        if (!isFromScroll){
            this.scroll.labelScrollHandler.y += this.scroll.scaleInterval;
            this.scroll.checkScrollHandlerPosition(this.scroll);
        }
    };

    init.prototype.deleteLastTrick = function (trickName) {
        for (var i = this.textMass.length - 1; i >= 0; i--){
            if (this.textMass[i].elements[0].text === trickName){
                this.textMass.splice(this.textMass.indexOf(this.textMass[i]), this.trickLinesCounter);
                break;
            }
        }
    };


    return init;
})();
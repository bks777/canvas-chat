var Input = (function () {
    var text = ""; // current text
    var idxFirst=0;
    var idxLast=0;
    var idxCursor = 0; //setting of current position in the text
    var _CanvasEditor;
    this.selected = false;

    function init(scene, parent) {
        this.parent = parent;
        _CanvasEditor = this;
        this.inputTextContainer = new CAAT.ActorContainer()
            .setSize(images['chatBackgroundImage'].singleWidth - (json.chatMargin.leftMargin + json.chatMargin.rightMargin), json.input.size.height)
            //.setLocation(json.input.cursor.startPosition, 0);
        scene.addChild(this.inputTextContainer);
        var input = new CAAT.Actor();
        this.inputTextContainer.addChild(input);
        input.ctx = CAAT.director[0].ctx;
        input.ctx.font = json.input.font;
        /**
         * Cursor object
         */
        this.cursor = new CAAT.Actor();
           // .setBounds(0, 0, input.width, input.height)
           // .enableEvents(false);
        this.inputTextContainer.addChild(this.cursor);
        /**
         * Graphical cursor position.
         */
        var cursorPosition = {
            x: json.input.cursor.startPosition,
            y: 0
        };
        this.cursor.cx = 0;
        this.cursor.setXPosition = function(newX){
            this.cx = newX;
        };
        // draw cursor
        this.cursor.paint = function (director, time) {
            var ctx = input.ctx;
            // build a color
            var color = json.input.cursor.color;

            if (time % 1000 > 500) {
                color = json.input.cursor.backgroundColor;
            } else {
                color = json.input.cursor.color;
            }

            if (this.parent.selected != true){
                ctx.globalAlpha = 0;
            } else {
                ctx.globalAlpha = 1;
            }
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.rect(Math.round(this.cx), cursorPosition.y + json.input.cursor.verticalPadding, json.input.cursor.verticalPadding, json.input.size.height - (json.input.cursor.verticalPadding*2));

            ctx.fill();
        };
        input.paint = function (director, time) {
            var ctx = input.ctx;
            var curTxt = text.substr(idxFirst,  idxLast - idxFirst + 1);
            ctx.fillStyle = json.input.fontColor;
            ctx.fillText(curTxt, 0, json.input.size.height / 1.3);
        };

        this.clickArea =  new CAAT.Actor()
            .setSize(this.inputTextContainer.width, this.inputTextContainer.height);


        this.inputTextContainer.addChild(this.clickArea);
        this.clickArea.mouseClick = function () {
            $('#table').focus();
            this.parent.selected = true;
        }
    }

    init.prototype.recalcIndexes = function(){
        var ctx=CAAT.director[0].ctx;
        var curW=0;
        var cursorX=-1;

        for(i=idxFirst;i<text.length;i++){
            curW += ctx.measureText(text.substr(i,1)).width;

            if(i+1 == idxCursor){
                cursorX = curW;
            }

            if(curW > this.inputTextContainer.width){break;}
        }
        if(idxCursor == idxFirst){this.cursor.cx=0;}else
        if(cursorX == -1){
            this.cursor.cx = curW -ctx.measureText(text.substr(i,1)).width;
        }else{this.cursor.cx = cursorX;}
        idxLast=i-1;
    };

    /**
     * Insert text at current position (idxCursor)
     */
    init.prototype.insertText = function (newText) {
        // at the very beginning
        if (idxCursor == 0) {
            text = newText + text;
        } else
        // at the very end
        if (idxCursor == text.length) {
            text = text + newText;
        } else
        // inside
        {

            var txt = text.substr(0, idxCursor);
            txt += newText;
            txt += text.substr(idxCursor);

            text = txt;

        }
        this.setCurPos( idxCursor + newText.length);
        this.recalcIndexes();
        return this;
    };
     /**
     * Keyboard event handler for printable chars
     */
    init.prototype.keydownHandler = function(evt){
        if(evt.keyCode == 8){
           _CanvasEditor.btnBackSpace();
           evt.preventDefault();
        }
        if(evt.keyCode == 37){
            _CanvasEditor.btnArrowLeft();
            evt.preventDefault();
        }
        if(evt.keyCode == 39){
            _CanvasEditor.btnArrowRight();
            evt.preventDefault();
        }
    };
    init.prototype.keyboardPressHandler = function (evt) {

        /*if ( this.parent.selected != true){
            return;
        }*/
        // technical button pressed like arrow
        if (evt.charCode === 0) {
            evt.preventDefault();
            // backspace button
            if (evt.keyCode == 8) {

                evt.preventDefault();
            }
            if (evt.code == 13) {
                evt.preventDefault();
            }
            return;
        }
        var newText = String.fromCharCode(evt.charCode);
        _CanvasEditor.insertText(newText);

    };
    init.prototype.keyboardDownHandler = function (evt) {

        /*if ( this.parent.selected != true){
            return;
        }*/
        switch (evt.keyCode) {
            //enter button
            case 13:
                _CanvasEditor.btnEnter();
                break;
            //BACKSPACE
            case 8:
                evt.preventDefault();
                break;
            // del button
            case 46:
                _CanvasEditor.btnDel();
                break;
            case 36:
                _CanvasEditor.btnHome();
                break;
            case 35:
                _CanvasEditor.btnEnd();
                break;
            // arrow up button
            case 38:
                _CanvasEditor.btnArrowUp();
                break;
            // arrow down button
            case 40:
                _CanvasEditor.btnArrowDown();
                break;
            default :
                evt.preventDefault();
        }

    };
    /**
     * Set cursor to new textual position
     */
    init.prototype.setCurPos = function (newPos) {
        if (newPos < 0) {
            newPos = 0;
        } else if (newPos > text.length) {
            newPos = text.length;
        }
        var ctx = CAAT.director[0].ctx;
        if(newPos > idxLast+1){
            idxLast = newPos-1;
            var curW=0;
            for(var i=newPos-1;i>=0;i--){
                curW += ctx.measureText(text.substr(i,1)).width;
                if(curW > this.inputTextContainer.width){
                    idxFirst = i+1;
                    break;
                }
            }
        }else if(newPos < idxFirst){
            idxFirst=newPos;
        }
        idxCursor = newPos;
        this.recalcIndexes();
    };
    /**
     * Action of [home] button at current position
     */
    init.prototype.btnHome = function () {
        this.setCurPos(0);

        return this;
    };

    /**
     * Action of [end] button at current position
     */
    init.prototype.btnEnd = function () {
        this.setCurPos(text.length);

        return this;
    };

    /**
     * Action of [<-] button at current position
     */
    init.prototype.btnArrowLeft = function () {
        this.setCurPos(idxCursor - 1);

        return this;
    };
    /**
     * Action of [->] button at current position
     */
    init.prototype.btnArrowRight = function () {
        this.setCurPos(idxCursor + 1);

        return this;
    };

    /**
     * Action of [Up] button at current position
     */
    init.prototype.btnArrowUp = function () {
        this.parent.lineUp();
        return this;
    };
    /**
     * Action of [Down] button at current position
     */
    init.prototype.btnArrowDown = function () {
        this.parent.lineDown();
        return this;
    };
    /**
     * Action of [del] button at current position
     */
    init.prototype.btnDel = function () {
        // if cursor is after last char -- nothing to do
        if (idxCursor == text.length) {
            return this;
        }
        // copy text before cursor
        var txt = text.substr(0, idxCursor);
        // if there is something remaining in the text (cursor was not right
        // before the last char)
        // -- add it
        if (idxCursor + 1 < text.length) {
            txt += text.substr(idxCursor + 1);
        }
        text = txt;

        return this;
    };

    /**
     * Action of [backspace] button at current position
     */
    init.prototype.btnBackSpace = function () {
        // if cursor is before the 1st char -- nothing to do
        if (idxCursor == 0) {
            return this;
        }
        // copy all before the cursor
        var txt = text.substr(0, idxCursor - 1);
        // copy the rest of text to the left from cursor
        txt += text.substr(idxCursor);
        text = txt;
        // move cursor one char left
        this.setCurPos(idxCursor - 1);

        return this;
    };

    /**
     * Action of [enter] button at current position
     */
    init.prototype.btnEnter = function () {
        if (text !== '') {

           text = json.chatLabel.default.startText + text + json.chatLabel.endText;
            chat.chatLabel.setVisible(false);
            chat.chatLabel.setText(text, json.chatLabel.linesWidth);
            chat.textAdd();
            chat.setLines();
            chat.redrawText();
            chat.scroll.scrollToBottom();
            if(chat.curLine > 0) {
                chat.scroll.setScaleInterval(chat.nonActiveLines);
            }
            chat.chatLabel.setVisible(true);
        }
        text = '';
        this.cursor.cx = 0;
        return this;
    };
    return init;
})();

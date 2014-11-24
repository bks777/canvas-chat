var Scroll = (function(){
    function init(container, callUp, callDown){
        this.labelScrollY = 0;
        this.sY = 0;
        this.scrHeight = 0;
        this.rollingWidth = 0;
        this.scaleInterval = 0;
        this.scrollGapValue = 0;
        this.heightForScale = 0;
        this.scrollContainer = new CAAT.ActorContainer();
        container.addChild(this.scrollContainer);
        this.labelScrollBackground = new CAAT.Actor();
        this.labelScrollHandler = new CAAT.Actor()
            .setFillStyle('#d9d9d9');

        /**
         * Scroll drag event
         */
        this.labelScrollHandler.mouseDrag = (function(mouseEvent){
            this.rollingWidth = this.startY - mouseEvent.y;
            if(this.scrHeight > 0){
                this.labelScrollHandler.y -= this.rollingWidth;
            }
            this.checkScrollHandlerPosition(this);
            if (Math.abs(this.labelScrollY - this.labelScrollHandler.y) >= this.scaleInterval) {
                if (this.labelScrollY - this.labelScrollHandler.y > 0){
                    this.labelScrollY -= this.scaleInterval;
                    if (callUp !== undefined) callUp(true);
                }
                if (this.labelScrollY - this.labelScrollHandler.y < 0) {
                    this.labelScrollY += this.scaleInterval;
                    if (callDown !== undefined) callDown(true);
                }
            }

        }).bind(this);

        this.labelScrollHandler.mouseDown = (function(mouseEvent){
            this.startY = mouseEvent.y;
            this.labelScrollY = this.labelScrollHandler.y;
            this.labelScrollHandler.setFillStyle('#4A4A4A');
            CAAT.setCursor('pointer');
        }).bind(this);
        this.labelScrollHandler.mouseUp = (function(mouseEvent){
            this.labelScrollHandler.setFillStyle('#d9d9d9');
            CAAT.setCursor('default');
        }).bind(this);
        this.labelScrollHandler.mouseEnter = (function(){
            CAAT.setCursor('pointer');
        }).bind(this);
        this.labelBtnUp = new CAAT.Actor().setAsButton(
                images['imgSArrows'].getRef(), 1, 1, 1, 1,
                (function () {
                    if(this.scaleInterval)this.labelScrollHandler.y -= this.scaleInterval;
                    this.checkScrollHandlerPosition(this);
                    chat.lineUp();
                }).bind(this)
            )
            .setSize(json.scrollWidth, json.scrollBtnUp.height)
            .setLocation(0, 0);

        this.labelBtnDown = new CAAT.Actor().setAsButton(
                images['imgSArrows'].getRef(), 0, 0, 0, 0,
                (function () {
                    if(this.scaleInterval)this.labelScrollHandler.y += this.scaleInterval;
                    this.checkScrollHandlerPosition(this);
                    chat.lineDown();
                }).bind(this)
            )
            .setSize(json.scrollWidth, json.scrollBtnDown.height);

        this.scrollContainer.addChild(this.labelScrollBackground);
        this.scrollContainer.addChild(this.labelScrollHandler);
        this.scrollContainer.addChild(this.labelBtnUp);
        this.scrollContainer.addChild(this.labelBtnDown);
    }

    init.prototype.checkScrollHandlerPosition = function(ctx){
        if (ctx.labelScrollHandler.y + ctx.scrHeight > ctx.scrollContainer.height - json.scrollBtnDown.height ){
            ctx.labelScrollHandler.y = ctx.scrollContainer.height - json.scrollBtnUp.height - ctx.scrHeight;
            return;
        }
        if (ctx.labelScrollHandler.y < json.scrollBtnUp.height){
            ctx.labelScrollHandler.y = json.scrollBtnUp.height;
        }
    };

    init.prototype.SetPosition = function(x, y, w, h, mh){
        this.scrollContainer.setBounds(x - w, 0, w, y - h);
        this.labelScrollBackground.setBounds(0, 0, w, y - h);
        this.labelBtnDown.setLocation(0, this.scrollContainer.height - json.scrollBtnDown.height);
        this.labelScrollHandler.setSize(w, mh);
        this.labelScrollHandler.setLocation(0, json.scrollBtnUp.height);
        this.heightForScale = this.scrollContainer.height - json.scrollBtnDown.height - json.scrollBtnUp.height;
    };

    init.prototype.setScaleInterval = function(numberOfLines){
        if (numberOfLines === 0) {
            this.scaleInterval = 0;
            return;
        }
        this.scrollGapValue = this.heightForScale - this.labelScrollHandler.height;
        this.scaleInterval = this.scrollGapValue / numberOfLines;
    };

    init.prototype.setScroll = function (labelHeight, docHeight, maxHeight) {
        this.scrHeight = labelHeight / docHeight * maxHeight;
        if (this.scrHeight < json.chatLabel.scrollHandlerMinHeight) {
            this.scrHeight = json.chatLabel.scrollHandlerMinHeight;
        } else if (this.scrHeight > maxHeight) {
            this.scrHeight = maxHeight;
        }
        this.labelScrollHandler.setSize(json.scrollWidth, this.scrHeight);

    };

    init.prototype.scrollToBottom = function(){
        if (this.scrHeight < this.heightForScale) {
            this.sY = (this.heightForScale - this.scrHeight);
            this.labelScrollHandler.y = this.sY + json.scrollBtnUp.height;
        }
    };

    return init;
})();
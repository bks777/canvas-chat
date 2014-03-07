/**
 * Created by Konstantin Bokov
 * Initializing of CAAT framework, creating director, scene, actors, etc
 */


var images = [];

var scene;
var chat;
function initialize (callback){
var director = new CAAT.Director().initialize
    ( 293, 183, $('#game-canvas')[0] );
director.loop();

director.enableResizeEvents(CAAT.Director.prototype.RESIZE_PROPORTIONAL);
director.setSoundEffectsEnabled(true);
director.setClear(true);

new CAAT.ImagePreloader().loadImages([
    {id: 'chatBackgroundImage', url:'img/chat_container.png'},
    {id: 'scrollArrows', url:'img/scrollArrows.png'}
], function(counter, imgList) {
    if (counter === imgList.length) {
        director.setImagesCache(imgList);
        images['chatBackgroundImage'] = new  CAAT.SpriteImage().initialize(director.getImage('chatBackgroundImage'), 1, 1);
        images['imgSArrows'] = new  CAAT.SpriteImage().initialize(director.getImage('scrollArrows'), 1, 2);

        if( callback !== undefined ) {
            callback();
        }
    }

});

scene = director.createScene();
}

initialize(function initChat(){
    chat = new Chat(scene, scene);
});
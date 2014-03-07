/**
 * Created by Konstantin Bokov
 * Config file
 */

var json = {
    chatlocation:{
        x: 0,
        y: 0
    },
    chatMargin:{
        leftMargin: 3,
        rightMargin: 3,
        topMargin: 3,
        bottomMargin: 3
    },

    input: {
        cursor:{
            color : '#000',
            backgroundColor: '#c9c9c9',
            startPosition: 5,
            verticalPadding: 1
        },
        font: "16px Arial",
        fontColor: '#000',
        size: {
            height : 22
        },
        location:{
            x : 5,
            y : 0
        }
    },

    chatLabel: {
        location:{
            x : 3,
            y : 3
        },
        linesWidth : 275,
        default:{
            startText: '<style=default><style=bold>default: </style> ',
            font: 'Arial',
            fontSize: 14,
            tabSize: 100,
            fill: '#000'
        },
        observer:{
            startText: '<style=observer><style=bold>visitor: </style> ',
            fill: 'blue'
        },
        admin: {
            startText: '<style=admin><style=bold>admin: </style> ',
            fontSize: 16,
            fill: '#f00'
        },
        player: {
            startText:'<style=player><style=bold>',
            fill: '#005000'
        },
        trick: {
            startText:'<style=trick><style=bold>trick: ',
            fill: '#4c4c4c'
        },
        endText: '</style>',
        scrollHandlerMinHeight : 16
    },
    scrollWidth: 15,
    scrollBtnUp: {
        height : 15
    },
    scrollBtnDown: {
        height : 16
    }
};

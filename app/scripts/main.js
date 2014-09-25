(function () {
    "use strict";


    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");

    var snake = null,
        map = null;


    var numberLength = function(number) {
        return ("" + number).length - 1;
    };

    var getDificulty = function (value) {

        var dif = {};

        if (value < 3) {

            var dificulties = [
                {
                    snake: {
                        speed: 6,
                        bodyPartsOffset: 2,
                        rotateAbility: 0.12
                    },
                    apple: {
                        growRate: 6
                    },
                    map: {

                    },
                    game: {
                        controls: "standard"
                    }
                },
                {
                    snake: {
                        speed: 3
                    },
                    apple: {
                        growRate: 2
                    },
                    map: {

                    },
                    game: {
                        controls: "standard"
                    }

                },
                {
                    snake: {
                        speed: 2,
                        bodyPartsOffset: 5
                    },
                    apple: {
                        growRate: 2
                    },
                    map: {

                    },
                    game: {
                        controls: "standard"
                    }

                }
            ];

            dif = dificulties[value] || dificulties[1];

        } else {

            var getValue = function(inputName) {
                return $("[name='" + inputName +"']").val();
            };

            var getChecked = function(inputName) {
                return $("[name='" + inputName +"']").prop("checked");
            };

            var calcOffset = function (vel) {
                // TODO: calc with size
                return 2;
            };

            dif = {
                snake: {
                    speed: getValue("snakeSpeed"),
                    bodyPartsOffset: calcOffset(getValue("snakeSpeed")),
                    rotateAbility: getValue("snakeTurnAbility")
                },
                apple: {
                    growRate: getValue("appleGrowRate")
                },
                map: {
                    totalApples: getValue("totalApples"),
                    goldenApplesAppearanceFrequency: getValue("goldenApples")
                },
                game: {
                    controls: (function() {
                        return getChecked("worm") ? "worm" : "standard";
                    } ())
                }
            };


        }

        return dif;
    };

    var playGameOverSound = function () {
        core.preloads.gameOverAudio.play();
        $({volume: 1}).animate({volume: 0}, {
            duration: 500,
            step: function () {
                core.preloads.backgroundAudio.volume = this.volume;
            },
            complete: function () {
                core.preloads.backgroundAudio.pause();
            }
        });
    };

    var paintGameoverOverlay = function (ctx) {
    };

    var setGameoverScores = function (scores) {
        $("#distance-covered").text(((scores.distanceCovered * 100) >> 0) / 10000);
        $("#score").text(scores.score);
        $("#time-played").text(scores.timePlayed / 1000);
        $("#godmode-time").text(scores.godModeTime / 1000);
    };


    var startGame = function() {

        var dif = getDificulty($('input[name="dificulty"]:checked').val());

        var snakeDifficulty = dif.snake;
        var mapDifficulty = dif.map;
        var appleDifficulty = dif.apple;
        var gameDifficulty = dif.game;

        if (map) {
            clearTimeout(map._nextGoldenTimeout);
        }

        snake = new Snake(snakeDifficulty);
        map = new Map(mapDifficulty);


        var nextGoldenTime = Math.random() * 5000 + (25000 / map.goldenApplesAppearanceFrequency);
        map._nextGoldenTimeout = setTimeout(function newGoldenApple() {

            map.newApple({type: "golden", pointsReward: 0});

        }, nextGoldenTime);

        map.snakes = [snake];
        for (var i = 0, ii = mapDifficulty.totalApples || 1; i < ii; i++) {
            map.newApple(appleDifficulty);
        }
        map.paint(ctx);

        core.preloads.backgroundAudio.volume = 1;
        core.preloads.backgroundAudio.loop = true;
        core.preloads.backgroundAudio.currentTime = 0;
        core.preloads.backgroundAudio.play();


        core.makeControlable(gameDifficulty.controls, snake);
        core.status = "game";
        core.game.points = 0;

        core.game.startTimestamp = new Date().valueOf();
        core.game.endTimestamp = null;

        core.resume();

    };

    var repaint = function (ctx) {

        if (core.status === "game") {
            paintGame(ctx);
        } else if (core.status === "menu") {
            paintMenu(ctx);
        } else if (core.status === "gameover") {
            paintGameoverOverlay(ctx);
        }

        requestAnimationFrame(function () {
            repaint(ctx);
        });

    };

    var paintGame = function (ctx) {

        var i;

        var paintPoints = function (ctx, points) {

            ctx.font = '12pt Gloria Hallelujah';
            ctx.fillStyle = "white";
            ctx.fillText("score", 10, 20);
            ctx.font = 'bold 20pt Gloria Hallelujah';
            ctx.fillStyle = "white";
            ctx.fillText(points, 25 - numberLength(points) * 6, 50)
        };

        if (core.animation()) {
            ctx.clearRect(0, 0, 1300, 600);
            map.paint(ctx);
            snake.move();
            snake.paint(ctx);

            for (i = 0; i < map.apples.length; i++) {
                if (snake.getHead().hitTest(map.apples[i])) {
                    core.game.points = core.game.points + map.apples[i].pointsReward;
                    map.apples[i].snakeHit(map, snake);
                }
            }

            for (i = 0; i < map.apples.length; i++) {
                map.apples[i].paint(ctx);
            }

            paintPoints(ctx, core.game.points);
            if (snake._godMode) {
                snake.paintGodMode(ctx, map.size.w - 50, 50);
            }

            if (snake.selfHitTest() || map.isOutOfLimits(snake.getHead())) {
                core.gameOver();
                core.status = "gameover";
                map.finish();

                setGameoverScores({
                    score: core.game.points,
                    distanceCovered: snake.distanceCovered,
                    timePlayed: core.game.endTimestamp - core.game.startTimestamp,
                    godModeTime: snake.godModeTime
                });


                $("#gameover-menu").fadeIn();
                $("#restart").click(function() {
                    startGame();
                    $("#gameover-menu").hide();
                });

                if (core.isUnmuted()) {
                    playGameOverSound();
                }
            }
        }

    };

    var paintMenu = function (ctx) {
        ctx.clearRect(0, 0, 500, 500);
        ctx.drawImage(core.preloads.background, 0, 0);
        ctx.drawImage(core.preloads.welcome, 0, -100);
        ctx.font = '16pt Gloria Hallelujah';
        ctx.fillStyle = "white";
        if (core.isLoading()) {
            ctx.fillText("loading", 220, 230);
        } else {
            $("#play:hidden").fadeIn().click(function() {
                startGame();
                $(this).hide();
            })
        }

        var percent = ((core.getPromisesResolved() / core.getPromisesCount() * 10000) >> 0) / 100;
        ctx.fillText(percent + "%", 245 - numberLength(percent) * 5, 270);
    };

    var doPreloads = function() {
        core.preloads.gameOverAudio = core.loadAudio("fx/gameover.wav");
        core.preloads.backgroundAudio = core.loadAudio("fx/background.mp3");
        core.preloads.welcome = core.loadImage("img/welcome.png");
        core.preloads.background = core.loadImage("img/grass.png");
    };

    var init = (function (ctx) {

        core.pause();

        var hideOrShowCustomDif = function() {
            if ($("[name='dificulty']:checked").val() === "3") {
                $("#custom-settings").show();
            } else {
                $("#custom-settings").hide();
            }
        }

        $("input[type='radio']").click(function() {
            hideOrShowCustomDif();
        });


        hideOrShowCustomDif();
        doPreloads();
        repaint(ctx);

    }(ctx));

}());
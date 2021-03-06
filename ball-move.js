////////////////////game//////////////////////

  var _renderer = (function() {
    return function(callback) {
      setTimeout(callback, 1000 / 60);
    };

  })();

  var _engine = function(){
    log('игр.ц.не иниц.')
  };

  var startGame = function(game){
    if (typeof game == 'function'){
      _engine = game;
    };
    gameLoop();
  };

  var setGame = function(game){
    if (typeof game == 'function'){
      _engine = game;
    };
  }

  var gameLoop = function(){
    _engine();
    _renderer(gameLoop);
  }

//////////////////graph/////////////////////////////

  function isCollisionWidth(x1, w1, x2, w2){
    return ( x1 < x2 + w2 && 
             x1 + w1 > x2)
  }

  function isCollisionHeight( y1, h1, y2, h2){
    return ( y1 < y2 + h2 && 
             h1 + y1 > y2)
  }

  function stopJump(){
    jumpCount = 0;
    jumpPressed = false;
    jumpHeight = 0;
  }


////////////////////////////grass////////////////////////////////////

  var grass = {
    x: 0,
    y: height - 100,
    w: 680,
    h: 200,
    color: "#27ac1b",

    draw: function(){
      drawRect(this.x, this.y, this.w, this.h, this.color); 
    }
  }

//////////////////////ball////////////////////////////

  var jumpPressed = false;
  var jumpCount = 0;
  var jumpLength = 50;
  var jumpHeight = 0;
  var destroy = false;
    
  var ball = {
    speed: 5,
    x: 320,
    radius: 20,
    y: grass.y - 20,
    color: "blue",

    init: function(x, y){
      this.x = x;
      this.y = y;
    },

    draw: function(){
      var img = false;

      if ( jumpPressed ){
        jumpCount++;
        jumpHeight = 4 * jumpLength * Math.sin( Math.PI * jumpCount / jumpLength );
      }

      if ( jumpCount > jumpLength ){
        stopJump()
      }

      if (destroy){
        img = true;
      }
        
      // drawCircle(this.x, this.y - jumpHeight, this.radius, this.color);
      var image = new Image(this.radius * 2, this.radius * 2);

      if (!img){
        image.src = "images/ball.png";
      } else {
        image.src = "images/destroyBall.png";
      }

      drawImage(this.x - this.radius, this.y - this.radius - jumpHeight, this.radius * 2, this.radius * 2, image);

    },

    move: function(){
      destroy = false;

      if (mc.isActionActive("left")){
        this.x -= this.speed;
      };

      if (mc.isActionActive("right")){
        this.x += this.speed;
      };

      if (mc.isActionActive("up")){
        jumpPressed = true;
      };

      if (mc.isActionActive("left") && mc.isActionActive("right")){
        destroy = true;
      }
    }, 

    collision: function(){
      var yPos = this.y - this.radius - jumpHeight;

      if (isCollisionWidth(this.x - this.radius, this.radius * 2, shelf.x, shelf.width)){

        if (isCollisionHeight(yPos, this.radius* 2, shelf.y, shelf.height)){

          if (yPos <= shelf.y && yPos < shelf.y + shelf.height){
            stopJump()
            this.y = shelf.y - this.radius;
            console.log("top")
          }

          if (yPos > shelf.y && yPos <= shelf.y + shelf.height){
            stopJump()
          }
        }

      } else {
        if (this.y !== grass.y - this.radius){
          this.y = this.y + this.speed * 2;
        }
      }
      

      if (this.x - this.radius <= 0){
        this.x = this.x - this.speed * ( -1 );
      }

      if (this.x + this.radius >= width ){
        this.x = this.x + this.speed * ( -1 );
      }
    }
  }

  //////////////////////////////shelf/////////////////////////////////////


  var shelf = {
    x: 100,
    y: height - 300,
    width: 170,
    height: 30,
    color: "brown",

    draw: function() {
      drawRect(this.x, this.y, this.width, this.height, this.color);
    }
  }
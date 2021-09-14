const Engine = Matter.Engine;
const Render = Matter.Render;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;
const Body = Matter.Body;
const Composites = Matter.Composites;
const Composite = Matter.Composite;

let engine;
let world;
var ground, bridge;
var leftWall, rightWall;
var jointPoint;
var jointLink;
var zom;
var zom1;
var zom2;
var zom3;
var sadzom;
var zombie;
var breakButton;
var backgroundImage;
var theme;
var stones = [];
var collided = false;

function preload() {
  
  zom = loadImage("assets/zombie1.png");
  zom1 = loadImage("assets/zombie2.png");
  zom2 = loadImage("assets/zombie3.png");
  zom3= loadImage("assets/zombie4.png");
  sadzom=loadImage("assets/sad_zombie.png");

  backgroundImage = loadImage("./assets/background.png");
  
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  engine = Engine.create();
  world = engine.world;
  frameRate(80);

  ground = new Base(0, height - 10, width * 2, 20);
  leftWall = new Base(100, height - 300, 200, height / 2 + 100);
  rightWall = new Base(width - 100, height - 300, 200, height / 2 + 100);

  bridge = new Bridge(25, { x: 80, y: height / 2 - 100 });
  jointPoint = new Base(width - 250, height / 2 - 100, 40, 30);

  Matter.Composite.add(bridge.body, jointPoint);
  jointLink = new Link(bridge, jointPoint);

  for (var i = 0; i <= 8; i++) {
    var x = random(width / 2 - 200, width / 2 + 300);
    var y = random(-100, 100);
    var stone = new Stone(x, y, 80, 80);
    stones.push(stone);
  }

  zombie = createSprite(width/2,height-100,50,50);
  zombie.addAnimation("lefttoright",zom,zom1,zom);
  zombie.addAnimation("righttoleft",zom2,zom3,zom2);
  zombie.addImage("sad",sadzom);
  zombie.velocityX=10;
  zombie.scale = 0.1;


  breakButton = createButton("");
  breakButton.position(width - 200, height / 2 - 50);
  breakButton.class("breakbutton");
  breakButton.mousePressed(handleButtonPress);
}

function draw() {
  background(backgroundImage);
  Engine.update(engine);

  bridge.show();
  
 for(var stone of stones){
   stone.show();
   var pos = stone.body.position;
   var distance = dist(zombie.position.x,zombie.position.y,pos.x,pos.y);
   if(distance <=50){
     zombie.velocityX = 0;
     Matter.Body.setVelocity(stone.body,{x:10,y:-10});
     zombie.changeImage("sad");
     collided = true;

   }


 }




  
 

 if (zombie.position.x >= width - 300 && !collided)
  { 
    zombie.velocityX = -10; 
    zombie.changeAnimation("righttoleft"); 
  }

if (zombie.position.x <=  300 && !collided)
  { 
    zombie.velocityX = 10; 
    zombie.changeAnimation("lefttoright"); 
  }
  

  drawSprites();
}

function handleButtonPress() {
  jointLink.dettach();
  setTimeout(() => {
    bridge.break();
  }, 1500);
}

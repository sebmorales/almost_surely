let letters=[];
let sentenceCount=9;
let currentSentence=0;
let processedSentences=[];
let margin=20;
let textS=24;
let font;
let currentMatches=0;
let grow=false;
let growth_started;
let growth_duration=5000;
let started=false;
let mobile=false;



function preload() {
  font = loadFont('Rubik-Regular.ttf');
}


function setup() {
    createCanvas(windowWidth ,windowHeight);
    // stroke(255);
    noStroke();
    fill(255);  
    textFont(font);
    textSize(textS/2);
    if(width<700){
      mobile=true;
      sentences=sentences_mobile;
      textS-=7
      margin/=3;
      let msg=`Almost Surely requires a keyboard. 
      This version has been modified to work on mobile.

      Tap to simulate keystrokes.`
      textAlign(CENTER);
      text(msg,width/2,height/2)

    }
    for(let i=0;i<sentences.length;i++){
      processedSentences.push(new sentence(sentences[i]));
      // console.log(processedSentences[i].letters);
    }
    textAlign(LEFT)
    angleMode(DEGREES);
    if(!mobile){
      text("[type]",width/2,height/2)
    }
}


function draw() {
  if(!grow && started){
    background(10,70,0);
      for (let i=0;i<letters.length;i++){
        text(letters[i].letter,letters[i].x,letters[i].y);
        letters[i].update();
        if(letters[i].timeTolive<0){
          letters.splice(i,1);
        }
      }// image(img, 0, 0, img.width, img.height);

      if(currentMatches==processedSentences[currentSentence].letters.length){
        currentMatches=0;
        currentSentence++;
        if(currentSentence>=sentences.length){
          grow=true;
          growth_started=millis();
          // currentSentence=sentences.length-1;
        } 
      }
  }else{
    for (let i=0;i<letters.length;i++){
      // text(letters[i].letter,letters[i].x,letters[i].y);
      letters[i].grow();
      if(letters[i].match && millis()-growth_started<growth_duration){
        letters[i].update();
      }
    }
  }

}

function mouseClicked(){

}
function touchStarted(){
  if(mobile){
      started=true;

      let l=['q','w','e','r','t','y','u','i','o','p',
      'a','s','d','f','g','h','j','k','l',
      'z','x','c','v','b','n','m',',','.','?'];

      for(let i=0;i<10;i++){
          letters.push(new createLetter(random(l))); 
      }
  }
}

function keyPressed(){
  started=true;
  letters.push(new createLetter(key));
  if(keyCode===LEFT_ARROW){
    currentSentence--;
  }
  if(keyCode===RIGHT_ARROW){
    currentSentence++;
  }
  if(keyCode===UP_ARROW){
    currentSentence--;
  }
  if(keyCode===DOWN_ARROW){
    currentSentence++;
  }

  if(keyCode===191){
    letters.push(new createLetter('?'));
  }

  if(currentSentence>=sentences.length){currentSentence=sentences.length-1;}
  if(currentSentence<0){currentSentence=0;}

}
function createLetter(l){
  this.letter=l.toUpperCase();
  this.x=random(width);
  this.y=random(height);
  this.numberMatches=-1;
  this.destX;
  this.destY=currentSentence*24+24;
  this.timeTolive=1000;
  this.speed=random(3,8);
  this.match=false;
  this.random_seed=random(1000);
  this.speed_grow=random(0.0001,0.1);
  
  this.desiredX=function(){
    let numberMatches=-1;
    if(!grow){
      for(let i=0;i<processedSentences[currentSentence].letters.length;i++){
        let this_l=this.letter;
        let that_l=processedSentences[currentSentence].letters[i].letter;
        if(this_l.toUpperCase()==that_l.toUpperCase()){
          if(processedSentences[currentSentence].letters[i].match==false){
            processedSentences[currentSentence].letters[i].match=true;
            this.destX=processedSentences[currentSentence].letters[i].x_pos+margin;
            i=sentences[currentSentence].length+1
            this.match=true;
            currentMatches++;
            // console.log("found match");
          }
        }
      }
    }
  }
  this.desiredX();

  this.update=function(){
    if(!this.match){
      this.y+=2;
      this.x+=random(-1,1);
      if(this.x>width)this.x=0;
      if(this.x<0)this.x=width;
      if(this.y>height-20){
        this.y=height-20;
        this.timeTolive--;
      }
    }
    else{

      if(this.x<this.destX+this.speed && this.x>this.destX-this.speed){this.x=this.destX;}
      if(this.y<this.destY+this.speed && this.y>this.destY-this.speed){this.y=this.destY;}
      if(this.x<this.destX){this.x+=this.speed}
      if(this.x>this.destX){this.x-=this.speed;}
      if(this.x<this.destX){this.x+=this.speed;}
      if(this.y<this.destY)this.y+=4;
      if(this.y>this.destY)this.y-=4;
    }
  };

  this.grow=function(){
    fill(255,255,255,10)
    noStroke();
    push();
    translate(this.x,this.y);
    text(this.letter,0,0);
    // text(this.letter,this.x,this.y);
    rotate(noise(0.005 * frameCount+this.random_seed))
    // translate(-this.x,-this.y);

    pop();
    this.x+= -.5+noise(this.speed_grow * frameCount+this.random_seed);
    this.y-= noise(this.speed_grow*3 * frameCount+this.random_seed);

  }
}


class sentence{
  constructor(s){
    this.s=s;
    this.h=sentences.length*textS+textS;
    this.letters=[];
    let x_offset=0;
    for(let i=0;i<s.length;i++){
      let bbox = font.textBounds(this.s[i].toUpperCase(),0,0);
      if(this.s[i]!=" "){
        this.letters.push({
          letter:s[i],
          match:false,
          x_pos:x_offset
        });
      }
      x_offset+=bbox.w+4;
    }
  }



  
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
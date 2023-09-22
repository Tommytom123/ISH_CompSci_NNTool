
console.log("Running");
var brain = require("./brain.js");
var fs = require('fs');
autoRecord();

function autoRecord(){
  // Config
  var variations = [[10,10,10],[20,20,20],[30,30,30],[40,40,40],[60,60,60],[100,100,100],[300,300,300],[800,800,800],[1500,1500,1500],[2500,2500,2500],[5000,5000,5000],[10000,10000,10000]]; //[(Variation 1)[Rect, circle, triangle], (Variation 2)[Rect, circle, triangle],...]. It allows for a non 1:1:1 relationships, which can lead to interesting results
  var test_size = 5000;
  var trials = 1;
  var randomize = "_Rand"; // Extension after the experiment. If not randomizing, change to "_Set". This isn't a boolean to make changing the filename easier
  // --
  var data;
  var db = {};
  for(var i=0;i<trials;i++){ // Trials
    console.log("Trial: " + i); 
    for(var x=0;x<variations.length ;x++) {// Goes through the different variations
      console.log("Current training sample size - Rectangles: " +variations[x][0] + " Circles: " + variations[x][1] + " Triangles: " + variations[x][2]);
      data = sampleit(runnet(variations[x][0],variations[x][1],variations[x][2], randomize), test_size);
      db[variations[x]] = data; // Adds a json/dictionary entry with results
    }
  fs.writeFile('ShapesNN_T'+ (i+1) + randomize +'.json', JSON.stringify(db), 'utf8', function(err) {
    if (err) throw err;
    console.log('File written');
    });
  }
  console.log("Complete");


}

function runnet(r, c, t, rand) {
  var net;
  // REAL STUFF
  var rects = r;
  var circs = c;
  var tris = t;
  
  
  var trijson = [];
  var circjson = [];
  var rectjson = [];
  var allinputs = [];
  
  var t,c,r,myJson;
  var name,shape

  // create shapes
  // First creates Rectangles, then adds Circles and finally Triangles
  for(var i=0;i<rects;i++) {
    r = character(generateRectangle());
    myJson = {input: r, output: { rect:1}};
    rectjson.push(myJson);
    allinputs.push(myJson);
  }

  for(var i=0;i<circs;i++) {
    c = character(generateCircle());
    myJson = {input: c, output: { circ:1}};
    circjson.push(myJson);
    allinputs.push(myJson);
  }

  for(var i=0;i<tris;i++) {
    t = character(generateTriangle());
    myJson = {input: t, output: { tri:1}};
    trijson.push(myJson);
    allinputs.push(myJson);
  }

  //console.log(allinputs);
  //SHUFFLING ARRAY - THIS REMOVES THE RECTANGLE OVERFIT
  
  if (rand == "_Rand"){
    const shuffle = array => { 
      for (let i = array.length - 1; i > 0; i--) { 
        const j = Math.floor(Math.random() * (i + 1)); 
        [array[i], array[j]] = [array[j], array[i]]; 
      } 
      return array; 
    }; 
    
    allinputs = shuffle(allinputs); 
    //console.log(allinputs);
  }
  
  //NN stuff
  //console.log("Making net");
  net = new brain.NeuralNetwork({
    activation: 'sigmoid', // activation function
    hiddenLayers: [20,20],
    iterations: 20000,
    learningRate: 0.5 // global learning rate, useful when training using streams
  });
  //console.log("Train");
  net.train(allinputs);
  return net
}   

function sampleit(n, sz) { // Tests the model
  var net = n;
  var ssize = sz; //Constant value
  //console.log("Training");

  var scores = [[0,0,0],[0,0,0],[0,0,0]]; // [(Rect)[Rect, Circ, Tri], Circ[Rect, Circ, Tri], Tri[Rect, Circ, Tri]] This allows for a confusion matrix
  var g;
  var shape_dict = {
    0 : "rect",
    1 : "circ",
    2 : "tri",
    "rect" : 0,
    "circ" : 1,
    "tri" : 2
  };

  for(var z=0;z<3;z++) { // for each different shape
    for(var i=0;i<ssize;i++) { //for sample size (ssize) of testing data
      
      if (z==0)  g = character(generateRectangle());
      else if (z==1)  g = character(generateCircle());
      else if (z==2)  g = character(generateTriangle());
      
      var result = brain.likely(g, net);
      scores[z][shape_dict[result]] += 1; 

    }
  }
  //console.log(scores);
  return(scores)
}

/**
 * Turn the # into 1s and . into 0s. for whole string
 * @param string
 * @returns {Array}
 */

function character(string) {
  return string
    .trim()
    .split('')
    .map(integer);
}

/**
 * Return 0 or 1 for '#'
 * @param character
 * @returns {number}
 */
function integer(character) {
  if ('#' === character) return 1;
  return 0;
}

function generateCircle() {



  const columns = 20;
  const rows = 20;
  var centerX,centerY,radius,distance,wiggle,dx,dy;

  centerX = Math.floor(columns / 2);
  centerY = Math.floor(rows / 2);
  radius = Math.floor((Math.random()* 4) + 6);
  wiggle=9-radius;
  dx = Math.floor((Math.random()* 2*wiggle))-wiggle;
  dy = Math.floor((Math.random()* 2*wiggle))-wiggle;
  centerX+=dx;
  centerY+=dy;
  let circle = "";

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < columns; x++) {
      distance = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);

      if (Math.abs(distance - radius) < 0.5) {
        circle += "#";
      } else {
        circle += ".";
      }
    }
    
  }
return circle;
  
}

function generateRectangle() {


  const columns = 20;
  const rows = 20;
  var top,bot,left,right;


  left = Math.floor((Math.random()* 5) + 0);
  right = Math.floor((Math.random()* 5) + 14);
  top = Math.floor((Math.random()* 5) + 0);
  bot = Math.floor((Math.random()* 5) + 14);
  
  let rect = "";

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < columns; x++) {

      if ((top===y)&&(x>=left)&&(x<=right)) {
        rect += "#";
      } else if ((bot===y)&&(x>=left)&&(x<=right)) {
        rect += "#";
      } else if ((left===x)&&(y>=top)&&(y<=bot)) {
        rect += "#";
      } else if ((right===x)&&(y>=top)&&(y<=bot)) {
        rect += "#";
      }  else {
        rect += ".";
      }
    }
  
    
  }

  return rect;
  
}

function generateTriangle() {
  const columns = 20;
  const rows = 20;
  var top,mid,scale,left,right,base;


  scale = (Math.random()*0.4)+0.6;
  top = Math.floor((Math.random()* 5) + 0);
  mid = Math.floor((Math.random()* 6) + 7);
  base = Math.floor((Math.random()* 5) + 14);

  //scale=1
  left=mid
  right=mid

  let tri = "";
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < columns; x++) {
      rt=Math.floor(right)
      lf=Math.floor(left)
      if((lf===0)&&(rt<20)&&(base>y)) base=y;
      if((rt===19)&&(lf>=0)&&(base>y)) base=y;
      if ((y>=top)&&((x===lf)||(x===rt))&&(y<=base)) {
        tri += "#";
       }  else if ((y===base)&&(x>=lf)&&(x<=rt)) {
          tri += "#";
       } else {
        tri += ".";
      }
    }
  if(y>=top) {
      left-=scale;
      right+=scale;
     }
  }
  
  return tri;
  
}



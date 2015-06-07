function textChangeListener (evt) {
  var id = evt.target.id;
  var text = evt.target.value;
  
  if (id == "topLineText") {
    window.topLineText = text;
  } else {
    window.bottomLineText = text;
  }
  
  redrawMeme(window.imageSrc, window.topLineText, window.bottomLineText);
}
function fragmentText(text, maxWidth) {
    var canvas = document.querySelector('canvas'),
        ctx = canvas.getContext("2d"),
        words = text.split(' '),
        lines = [],
        line = "";
    if (ctx.measureText(text).width < maxWidth) {
        return [text];
    }
    while (words.length > 0) {
        var split = false;
        while (ctx.measureText(words[0]).width >= maxWidth) {
            var tmp = words[0];
            words[0] = tmp.slice(0, -1);
            if (!split) {
                split = true;
                words.splice(1, 0, tmp.slice(-1));
            } else {
                words[1] = tmp.slice(-1) + words[1];
            }
        }
        if (ctx.measureText(line + words[0]).width < maxWidth) {
            line += words.shift() + " ";
        } else {
            lines.push(line);
            line = "";
        }
        if (words.length === 0) {
            lines.push(line);
        }
    }
    return lines;
}

function redrawMeme(image, topLine, bottomLine) {
  // Get Canvas2DContext
  var canvas = document.querySelector('canvas');
  var ctx = canvas.getContext("2d");
  if (image != null){
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
  }
  else{
      if(!document.querySelector('.alertify-log')){
        alertify.success('Select an image from your computer!');
      }
  }
  
  // Text attributes
  ctx.font = '30pt Impact';
  ctx.textAlign = 'center';
  ctx.strokeStyle = 'black';
  ctx.lineWidth = 3;
  ctx.fillStyle = 'white';
  
  if (topLine != null) {
    var lines = fragmentText(topLine, 500);
    for(line in lines){
        ctx.fillText(lines[line], canvas.width / 2, (40 + (line * 40)) );
        ctx.strokeText(lines[line], canvas.width / 2, (40 + (line * 40)) );
    }
  }
  
  if (bottomLine != null) {
    var lines = fragmentText(bottomLine, 500);
    var numberOfLines = lines.length;
    var heights = [];
    for(i = 0, len = lines.length; i < len; i++ ){
        heights.push( -20 + ((len - i) * 40 ) ); // 20 plus 40px for each line.. first lines have to have greatest numbers
    }
    for(line in lines){
        ctx.fillText(lines[line], canvas.width / 2, canvas.height - heights[line]);
        ctx.strokeText(lines[line], canvas.width / 2, canvas.height - heights[line]);
    }
  }
}

function saveFile() {
  window.open(document.querySelector('canvas').toDataURL());
}


function handleFileSelect(evt) {
  var canvasWidth = 500;
  var canvasHeight = 500;
  var file = evt.target.files[0];
  
  
  
  var reader = new FileReader();
  reader.onload = function(fileObject) {
    var data = fileObject.target.result;
    
    // Create an image object
    var image = new Image();
    image.onload = function() {
      
      window.imageSrc = this;
      redrawMeme(window.imageSrc, null, null);
    }
    
    // Set image data to background image.
    image.src = data;
    console.log(fileObject.target.result);
  };
  reader.readAsDataURL(file)
}

window.topLineText = "";
window.bottomLineText = "";
var input1 = document.getElementById('topLineText');
var input2 = document.getElementById('bottomLineText');
input1.oninput = textChangeListener;
input2.oninput = textChangeListener;
document.getElementById('file').addEventListener('change', handleFileSelect, false);
document.getElementById('saveFile').addEventListener('click', saveFile, false);
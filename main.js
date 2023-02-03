const canvas = document.getElementById("ground")
canvas.height = window.innerHeight
canvas.width = window.innerWidth

const gr_context = canvas.getContext("2d", { willReadFrequently: true })

gr_context.fillStyle = "white"
gr_context.fillRect(0, 0, canvas.width, canvas.height)

const MAX_BUFFER_SIZE = 10

// DRAWING MODES
const DRAW = 1
const RECT = 2
const SCATTER = 3
const ELLIPSE = 4
const STAR = 5
const NEON = 6
const FILL = 7
const BRIDGE = 8
const AIRBRUSH = 9
const DROPS = 10
const STROKES = 11
const WATERMELON = 12

// DRAWING STATUSES
var is_drawing = false
var drawingMode = DRAW // drawing mode DRAW by default
var fill_or_no = false
var flat = false
var contour = true
var jitter = false
var round = true

// VALUES
var prevX = null //var vs var
var prevY = null

var cx = 0, cy = 0

var color1 = "#0057b7"
var color2 = "#ffd700"

var r, g, b

// DRAWING PARAMETERS
var penwi = 1
var diami = 50
var densi = 100
var transi = 50
var ncuts = 5
var n = 2
var point_recentness = 10
var connectivity_range = 300
var line_offset = 0
var nlines = 5
var linedistance = 10
var jitter_range = 15

gr_context.lineWidth = penwi
gr_context.lineCap = "round"
gr_context.lineJoin = "miter"
gr_context.strokeStyle = "#0057b7"
//gr_context.strokeStyle = "rgba(25, 71, 241, 0.1)"
gr_context.fillStyle = "#ffd700"

document.getElementById("clear").addEventListener("click", () => {
    gr_context.globalAlpha = 1
    gr_context.fillStyle = color2
    gr_context.fillRect(0, 0, canvas.width, canvas.height)
    gr_context.beginPath();
    updateBuffer()
    //canvas.width = canvas.width
    //canvas.height = canvas.height
})

document.getElementById("save").addEventListener("click", () => {
    //var  file_name = prompt("Повне ім'я файлу:");
    let data = canvas.toDataURL("imag/jpg")
    let canvas_image = document.createElement("a")
    canvas_image.href = data

    canvas_image.download = "My BlossomField sketch" //file_name
    canvas_image.click()
})

// DRAWING MODE CHANGE
document.getElementById("draw_button").addEventListener("click", () => drawingMode = DRAW)
document.getElementById("rect_button").addEventListener("click", () => drawingMode = RECT)
document.getElementById("scatter_button").addEventListener("click", () => drawingMode = SCATTER)
document.getElementById("ellipse_button").addEventListener("click", () => drawingMode = ELLIPSE)
document.getElementById("neon_button").addEventListener("click", () => drawingMode = NEON)
document.getElementById("star_button").addEventListener("click", () => drawingMode = STAR)
//document.getElementById("bucket_button").addEventListener("click", () => drawingMode = FILL)
document.getElementById("bridge_button").addEventListener("click", () => drawingMode = BRIDGE)
document.getElementById("airbrush_button").addEventListener("click", () => drawingMode = AIRBRUSH)
document.getElementById("drops_button").addEventListener("click", () => drawingMode = DROPS)
document.getElementById("strokes_button").addEventListener("click", () => drawingMode = STROKES)
document.getElementById("baza_button").addEventListener("click", () => drawingMode = WATERMELON)


// SLIDERS CHANGE
var pen_size = document.getElementById("pen_size");
var pen_size_label = document.getElementById("pen_size_label");
pen_size_label.innerHTML = pen_size.value;
gr_context.lineWidth = pen_size.value;
pen_size.addEventListener("input", () => {
    gr_context.lineWidth = pen_size.value;
    penwi = pen_size.value
    pen_size_label.innerHTML = pen_size.value;
})

var transparency_slider = document.getElementById("transparency_slider");
var transparency_slider_label = document.getElementById("transparency_slider_label");
transparency_slider_label.innerHTML = transparency_slider.value;
transi = transparency_slider.value;
transparency_slider.addEventListener("input", () => {
    transi = transparency_slider.value;
    transparency_slider_label.innerHTML = transparency_slider.value;
})

document.getElementById("round").addEventListener("input", () => {round = !round})

var radius = document.getElementById("radius");
var radius_label = document.getElementById("radius_label");
radius_label.innerHTML = radius.value;
diami = radius.value;
radius.addEventListener("input", () => {
    diami = radius.value;
    radius_label.innerHTML = radius.value;
})

var density = document.getElementById("density");
var density_label = document.getElementById("density_label");
density_label.innerHTML = density.value;
densi = density.value;
density.addEventListener("input", () => {
    densi = density.value;
    density_label.innerHTML = density.value;
})

var star_ncuts = document.getElementById("star_ncuts");
var star_ncuts_label = document.getElementById("star_ncuts_label");
star_ncuts_label.innerHTML = star_ncuts.value;
ncuts = star_ncuts.value;
star_ncuts.addEventListener("input", (ev) => {
    ncuts = ev.target.value;
    star_ncuts_label.innerHTML = star_ncuts.value;
})

var inner_radius = document.getElementById("inner_radius");
var inner_radius_label = document.getElementById("inner_radius_label");
inner_radius_label.innerHTML = inner_radius.value;
n = inner_radius.value;
inner_radius.addEventListener("input", () => {
    n = inner_radius.value;
    inner_radius_label.innerHTML = inner_radius.value;
})

var density = document.getElementById("density");
var density_label = document.getElementById("density_label");
density_label.innerHTML = density.value;
densi = density.value;
density.addEventListener("input", () => {
    densi = density.value;
    density_label.innerHTML = density.value;
})

var jitter_slider = document.getElementById("jitter_slider");
var jitter_slider_label = document.getElementById("jitter_slider_label");
jitter_slider_label.innerHTML = jitter_slider.value;
jitter_range = jitter_slider.value;
jitter_slider.addEventListener("input", () => {
    jitter_range = jitter_slider.value;
    jitter_slider_label.innerHTML = jitter_slider.value;
})

var recentness_slider = document.getElementById("recentness_slider");
var recentness_slider_label = document.getElementById("recentness_slider_label");
recentness_slider_label.innerHTML = recentness_slider.value;
point_recentness = recentness_slider.value;
recentness_slider.addEventListener("input", () => {
    point_recentness = recentness_slider.value;
    recentness_slider_label.innerHTML = recentness_slider.value;
})

var connectivity_slider = document.getElementById("connectivity_slider");
var connectivity_slider_label = document.getElementById("connectivity_slider_label");
connectivity_slider_label.innerHTML = connectivity_slider.value;
connectivity_range = connectivity_slider.value;
connectivity_slider.addEventListener("input", () => {
    connectivity_range = connectivity_slider.value;
    connectivity_slider_label.innerHTML = connectivity_slider.value;
})

var bridge_transi_slider = document.getElementById("bridge_transi_slider");
var bridge_transi_slider_label = document.getElementById("bridge_transi_slider_label");
bridge_transi_slider_label.innerHTML = bridge_transi_slider.value;
bridge_transi = bridge_transi_slider.value;
bridge_transi_slider.addEventListener("input", () => {
    bridge_transi = bridge_transi_slider.value;
    bridge_transi_slider_label.innerHTML = bridge_transi_slider.value;
})

var offset_slider = document.getElementById("offset_slider");
var offset_slider_label = document.getElementById("offset_slider_label");
offset_slider_label.innerHTML = offset_slider.value;
line_offset = offset_slider.value;
offset_slider.addEventListener("input", () => {
    line_offset = offset_slider.value;
    offset_slider_label.innerHTML = offset_slider.value;
})

var strokes_slider = document.getElementById("strokes_slider");
var strokes_sliderlabel = document.getElementById("strokes_slider_label");
strokes_slider_label.innerHTML = strokes_slider.value;
linedistance = strokes_slider.value;
strokes_slider.addEventListener("input", () => {
    linedistance = strokes_slider.value;
    strokes_slider_label.innerHTML = strokes_slider.value;
})

var nstrokes_slider = document.getElementById("nstrokes_slider");
var nstrokes_slider_label = document.getElementById("nstrokes_slider_label");
nstrokes_slider_label.innerHTML = nstrokes_slider.value;
nlines = nstrokes_slider.value;
nstrokes_slider.addEventListener("input", () => {
    nlines = nstrokes_slider.value;
    nstrokes_slider_label.innerHTML = nstrokes_slider.value;
})

let pen_color = document.getElementById("pen_color")
let brush_color = document.getElementById("brush_color")
let fill_checkbox = document.getElementById("fill_rect")

document.getElementById("undo_button").addEventListener("click", () => undo())
document.getElementById("redo_button").addEventListener("click", () => redo())
document.getElementById("grid_button").addEventListener("click", () => document.getElementById("gridBar").style.width = "250px")
document.getElementById("closeGrid").addEventListener("click", () => cdocument.getElementById("gridBar").style.width = "0")

var x1=0, y1=0, w1=0, h1=0, offx=0, offy=0, nx=0, ny=0
document.getElementById("sx_grid").addEventListener("click", (e) => {
    x1 = parseInt(e.target.value)
    document.getElementById("sxL").innerHTML = x1
})
document.getElementById("sy_grid").addEventListener("click", (e) => {
    y1 = parseInt(e.target.value)
    document.getElementById("syL").innerHTML = y1
})
document.getElementById("w_grid").addEventListener("click", (e) => {
    w1 = parseInt(e.target.value)
    document.getElementById("wL").innerHTML = w1
})
document.getElementById("h_grid").addEventListener("click", (e) => {
    h1 = parseInt(e.target.value)
    document.getElementById("hL").innerHTML = h1
})
document.getElementById("offx_grid").addEventListener("click", (e) => {
    offx = parseInt(e.target.value)
    document.getElementById("oxL").innerHTML = offx
})
document.getElementById("offy_grid").addEventListener("click", (e) => {
    offy = parseInt(e.target.value)
    document.getElementById("oyL").innerHTML = offy
})
document.getElementById("nx_grid").addEventListener("click", (e) => {
    nx = parseInt(e.target.value)
    document.getElementById("nxL").innerHTML = nx
})
document.getElementById("ny_grid").addEventListener("click", (e) => {
    ny = parseInt(e.target.value)
    document.getElementById("nyL").innerHTML = ny
})

//var x1=300, y1=100, w1=100, h1=100, ix=350, iy=250, ngridx = 3, ngridy = 3

document.getElementById("goGrid").addEventListener("click", () => {grid()})

function grid(){
    let xb = x1
    //buffer variables not to change original data
    let tx1=x1, ty1=y1

    for (let i = 0; i < ny; i++){
        for (let j = 0; j < nx; j++){
            gr_context.beginPath()
            gr_context.rect(tx1, ty1, w1, h1)
            gr_context.stroke()
            tx1 += (1*offx)+(1*w1)
        }
        ty1 += (1*offy)+(1*h1)
        tx1 = x1
    }
    updateBuffer()

   /* var x = 300, y = 100
    gr_context.strokeStyle = "grey"
for (let i = 0; i < 3; i++){
    for (let j = 0; j < 3; j++){
        gr_context.beginPath()
        gr_context.rect(x, y, 200, 200)
        gr_context.stroke()
        x += 350 
    }
    y += 250
    x = 300
}*/
}

function rand(from, to){
    let r = Math.floor(Math.random() * (to - from) + from);
    console.log("from: " + from + ", to: " + to + "     rand:" + r)
    return r
}

// DRAWING FUNCTIONS

function setRGB(r, g, b){
    return "rgb(" + r + "," + g + "," + b + ")"
}

function setRGBA(r, g, b, a){
    return "rgb(" + r + "," + g + "," + b + "," + a + ")"
}

function updatePen(){
    if (round)
        gr_context.lineCap = "round"
    else gr_context.lineCap = "butt"
    gr_context.globalAlpha = transi/100
    gr_context.lineWidth = penwi
    if (drawingMode == NEON){
        gr_context.strokeStyle = "white"
        gr_context.shadowBlur = diami
        gr_context.shadowColor = color1

    } else {
        gr_context.strokeStyle = color1
        gr_context.shadowBlur = 0
    }
    gr_context.fillStyle = color2
}

var canvasBuffer = []
var uCount = 0

pushToBuffer()

function bufferSizeIsLegal(){
    return canvasBuffer.length < MAX_BUFFER_SIZE
}

function pushToBuffer(){ 
    if (bufferSizeIsLegal()){
        var snapshot = gr_context.getImageData(0, 0, canvas.width, canvas.height); // adding current canvas snapshot to a buffer
        canvasBuffer.push(snapshot)
    }
}

function undo(){
    if ((canvasBuffer.length > 0) && (uCount < canvasBuffer.length)){
        uCount++
        gr_context.putImageData(canvasBuffer[canvasBuffer.length-uCount], 0, 0)
    }
}

function redo(){
    if (uCount > 0){
        uCount--
        gr_context.putImageData(canvasBuffer[canvasBuffer.length-uCount], 0, 0)
    }
}

function updateBuffer(){ // updating the buffer after evry user's action
    if (uCount > 0){
        canvasBuffer.splice(canvasBuffer.length - uCount, uCount)
    }

    uCount = 0 // setting undo counter to 0 as user added something to canvas
    if (!bufferSizeIsLegal())
        canvasBuffer.shift() // erasing the outdated snapshot

    pushToBuffer() //then push
}

function colorFilter(){
    var img = gr_context.getImageData(0, 0, canvas.width, canvas.height);
    var pixel = img.data;

    for (let i = 0; i < pixel.length; i += 4) {
        pixel[i] = pixel[i]+20
        pixel[i+1] = pixel[i+1]-20
        pixel[i+2] = pixel[i+2]+20
    }
    gr_context.putImageData(img, 0, 0)
}

function invert(){
    var img = gr_context.getImageData(0, 0, canvas.width, canvas.height);
    var pixel = img.data;

    for (let i = 0; i < pixel.length; i += 4) {
        pixel[i] = 255 - pixel[i]
        pixel[i+1] = 255 - pixel[i+1]
        pixel[i+2] = 255 - pixel[i+2]
    }
    gr_context.putImageData(img, 0, 0)
}

function pointsWithinCircle(d, x, y){
    let lx, ly    
    var a = Math.random()
    var b = Math.random()

    if (flat && b < a){
        let temp = a
        a = b
        b = temp
    }
    lx = b*d*Math.cos(2*Math.PI*(a/b))+x
    ly = b*d*Math.sin(2*Math.PI*(a/b))+y

    return [lx, ly]
}

function scatter(x, y){
    var p = []
    for (let i = 0; i < densi; i++) {
        
        p = pointsWithinCircle(diami, x, y)
        gr_context.beginPath()
        gr_context.moveTo(p[0], p[1])
        gr_context.lineTo(p[0], p[1])
        gr_context.stroke()
    }
}

function circleCoords(centreX, centreY, radius, i, ncuts){
    var ncuts_angle = (360/ncuts)/57
    //if (outer) ncuts_angle += 2*(360/ncuts)/57
    cx = centreX + Math.cos(ncuts_angle*i*2)*radius
    cy = centreY + Math.sin(ncuts_angle*i*2)*radius
    //console.log("X: " + cx + "   Y: " + cy)
}

// MAKE COLOR PALETTE !!

function bridge(prevX, prevY, curX, curY){
    // gr_context.moveTo(prevX, prevY)
    // gr_context.lineTo(curX, curY)

    // var i
    // if (pointArray.length >= (point_recentness + 1))
    //     i = pointArray.length - point_recentness - 1
    // else i = 0
    // for (; i < pointArray.length; i++){
    // var dx = pointArray[i][0]-curX
    // var dy = pointArray[i][1]-curY
    // var d = dx * dx + dy * dy;
    //     if (d < connectivity_range*connectivity_range){
    //         gr_context.moveTo(curX+dx*0.2, curY+dy*0.2)
    //         gr_context.lineTo(pointArray[i][0]-dx*0.2, pointArray[i][1]+dy*0.2)
    //         gr_context.stroke();
    //     }
    // }

    //gr_context.moveTo(prevX, prevY)
    //gr_context.lineTo(curX, curY)

    var i
    if (pointArray.length >= (point_recentness + 1))
        i = pointArray.length - point_recentness - 1
    else i = 0
    for (; i < pointArray.length; i++){
        gr_context.globalAlpha = (transi/100)
        gr_context.beginPath()
        gr_context.moveTo(prevX, prevY)
        gr_context.lineTo(curX, curY)
        gr_context.stroke()

        var dx = pointArray[i][0]-curX
        var dy = pointArray[i][1]-curY
        var d = dx * dx + dy * dy;
        if (d < connectivity_range*connectivity_range){
            gr_context.globalAlpha = (bridge_transi/100)
            var odx = dx*(line_offset/10)
            var ody = dy*(line_offset/10)
            gr_context.beginPath()
            //var rgb = extractRGB(color1)
            //gr_context.strokeStyle = setRGBA(rgb[0], rgb[1], rgb[2], transi*25.5)

            gr_context.moveTo((curX > pointArray[i][0])?(curX+odx):(curX-odx), (curY > pointArray[i][1])?(curY+ody):(curY-ody))
            gr_context.lineTo((curX > pointArray[i][0])?(pointArray[i][0]-odx):(pointArray[i][0]+ody), (curY > pointArray[i][1])?(pointArray[i][1]-ody):(pointArray[i][1]+ody))
            gr_context.stroke();
        }
    }
}

function drawStar(startX, startY, endX, endY, ncuts){
    var curAngle = 0.8
    var centreX = (endX+startX)/2
    var centreY = (endY+startY)/2
    gr_context.beginPath

    var r = Math.min(Math.abs(endX-startX), Math.abs(endY-startY))
    console.log(r)
    r = Math.sqrt(r*r)/2
    console.log(r)
    for (let i = 1; i <= ncuts; i++) {
            //gr_context.beginPath()
            if (i%2==0){
                circleCoords(centreX, centreY, r, i, ncuts*2)
            } else circleCoords(centreX, centreY, r/n, i, ncuts*2)
            
            if (i==1){
                gr_context.moveTo(cx, cy)
                var sx = cx
                var sy = cy
            }
                
            gr_context.lineTo(cx, cy)
            gr_context.moveTo(cx, cy)
            //gr_context.stroke()
    }
    gr_context.stroke()
    gr_context.lineTo(sx, sy)
    gr_context.stroke()
}
//gr_context.strokeStyle = "pink"
// test
//drawStar(200, 200, 400, 500, 10)

//----------------------------------------------------------------------EVENT LISTENERS--------
document.getElementById("invert_button").addEventListener("click", () => invert())
// ---------------------------------COLOR CHANGE----------------------
pen_color.addEventListener("input", (event) => {color1 = event.target.value
    updatePen()})
pen_color.addEventListener("change", (event) => {color1 = event.target.value
    updatePen()})
brush_color.addEventListener("input", (event) => {color2 = event.target.value
    updatePen()})
brush_color.addEventListener("change", (event) => {color2 = event.target.value
    updatePen()})

// --------------------DRAWING PARAMETERS CHANGE----------------------

fill_checkbox.addEventListener("change", () => {fill_or_no = !fill_or_no})
document.getElementById("flat").addEventListener("change", () => { flat = !flat})
document.getElementById("contour").addEventListener("change", () => {contour = !contour})
document.getElementById("jitter").addEventListener("change", () => jitter = !jitter)
var pointArray = [[0, 0]]

canvas.addEventListener("mousedown", (ev) => {
    is_drawing = true
    updatePen()
    gr_context.beginPath() // to prevent changing the properties of finished objects

    pointArray.splice(0, pointArray.length)

    prevX = ev.clientX
    prevY = ev.clientY
})

canvas.addEventListener("mouseup", (ev) => {
    is_drawing = false
    var endX = ev.clientX
    var endY = ev.clientY
    gr_context.closePath()

    updateBuffer()

    if (drawingMode == RECT) {
        //gr_context.fillStyle = "blue"
        gr_context.beginPath()
        gr_context.rect(prevX, prevY, (endX-prevX), (endY-prevY))
        if (fill_or_no) gr_context.fill()
        if (contour) gr_context.stroke()

    } else if (drawingMode == ELLIPSE){
        gr_context.beginPath();
        gr_context.ellipse((endX+prevX)/2, (endY+prevY)/2, Math.abs(endX-prevX)/2, Math.abs(endY-prevY)/2, 0, 0, 2*Math.PI)
        if (fill_or_no)  gr_context.fill()
        if (contour) gr_context.stroke();

    } else if (drawingMode == STAR){
        drawStar(prevX, prevY, endX, endY, ncuts*2)
    } else if (drawingMode == FILL){
        paintAt(endX, endY)
    } else if (drawingMode == WATERMELON){
        watermelon(prevX, prevY, endX, endY)
    }
})

function midPoint(x1, y1, x2, y2){
    return [(x1+(x2-x1)/2), (y1+(y2-y1)/2)]
}

function draw(prevX, prevY, curX, curY){
    //pointArray.push([curX, curY])
    gr_context.beginPath();   

    gr_context.moveTo(prevX, prevY)
    gr_context.lineTo(curX, curY)
    gr_context.stroke(); 
}

function stroke(prevX, prevY, curX, curY){
    gr_context.globalAlpha = transi/100
    var inc_dist = 0
    for (let i = 1; i <= nlines; i++){
        gr_context.beginPath()
        gr_context.moveTo(prevX, prevY+inc_dist);
        gr_context.lineTo(curX, curY+inc_dist);
        gr_context.stroke();
        inc_dist = linedistance*i
        gr_context.globalAlpha -= (transi/100)/nlines
    }
}

function drops(prevX, prevY, curX, curY){
    gr_context.strokeStyle = "rgba(0,0,0,0)"
    gr_context.globalAlpha = Math.random()
    gr_context.beginPath()
    //gr_context.moveTo(prevX, prevY);
    //gr_context.arc(rand(prevX-jitter_range, prevX+jitter_range), rand(prevY-jitter_range, prevY+jitter_range), Math.random()*diami, 0, 2*Math.PI, true)
    gr_context.arc(prevX+Math.random()*jitter_range, prevY+Math.random()*jitter_range, Math.random()*diami, 0, 2*Math.PI, true)
    gr_context.fill()
    gr_context.stroke()
    gr_context.closePath()
}

function distanceBetweenPoints(prevX, prevY, curX, curY){
    var dx = Math.abs(prevX-curX)
    var dy = Math.abs(prevY-curY)
    return Math.sqrt(dx * dx + dy * dy);
}

function angleBetweenPoints(prevX, prevY, curX, curY){
    return Math.atan2(curX - prevX, curY - prevY);
}

function extractRGB(color){
    var R = parseInt(color.substr(1,2), 16)
    var G = parseInt(color.substr(3,2), 16)
    var B = parseInt(color.substr(5,2), 16)
    return [R, G, B]
}

function airbrush(prevX, prevY, curX, curY){
    var x, y

    var dist = distanceBetweenPoints(prevX, prevY, curX, curY)
    var angle = angleBetweenPoints(prevX, prevY, curX, curY)

    gr_context.globalAlpha = transi/100
    for (let i = 0; i < dist; i+=5){
        x = prevX + Math.sin(angle)*i
        y = prevY + Math.cos(angle)*i

        var brush_airbrush = gr_context.createRadialGradient(x, y, 1, x, y, penwi)

        var rgb = extractRGB(color1)

        brush_airbrush.addColorStop(0, setRGBA(rgb[0], rgb[1], rgb[2], 1))
        //brush_airbrush.addColorStop(0.2, color1)
        //brush_airbrush.addColorStop(0.3, "rgba(0,0,0,0.2)")
        brush_airbrush.addColorStop(0.5, setRGBA(rgb[0], rgb[1], rgb[2], 0.5))
        brush_airbrush.addColorStop(1, setRGBA(rgb[0], rgb[1], rgb[2], 0))

        gr_context.fillStyle = brush_airbrush
        gr_context.fillRect(x-penwi, y-penwi, 2*penwi, 2*penwi)
    }
}

function watermelon(prevX, prevY, curX, curY){

    var red = "rgb(255, 25, 0)"
    var white = "rgb(255, 255, 255)"
    var green = "rgb(66, 189, 0)"

    var centreX = (curX+prevX)/2
    var centreY = (curY+prevY)/2
    var rad = Math.abs(curY-prevY)/2
/*
    pointArray.splice(0, pointArray.length)

    var r = Math.min(Math.abs(curX-prevX), Math.abs(curY-prevY))
    console.log(r)
    r = Math.sqrt(r*r)/2
    //console.log(r)
    var br = r + penwi*2
    var linePoints = []
    for (let i = 1; i <= ncuts; i++) {
            //gr_context.beginPath()
            circleCoords(centreX, centreY, br, i, ncuts*4)
            linePoints.push([cx, cy])
            circleCoords(centreX, centreY, r, i, ncuts*4)
            pointArray.push([cx, cy])
            if (i==1){
                gr_context.moveTo(cx, cy)
                var sx = cx
                var sy = cy
            } 
            //gr_context.lineTo(cx, cy)
            gr_context.strokeStyle = red
            bridge(cx, cy, cx, cy)
            gr_context.beginPath()
            //gr_context.strokeStyle = green
            //gr_context.lineTo(cx, cy)
            gr_context.moveTo(cx, cy)
    }
    
    gr_context.stroke()
    gr_context.lineTo(sx, sy)
    gr_context.stroke()
*/
    gr_context.strokeStyle = "rgba(0,0,0,0)"
    gr_context.lineWidth = 1
    gr_context.beginPath()
    gr_context.fillStyle = green
    gr_context.arc(centreX, centreY, rad, 0, Math.PI)
    gr_context.fill()
    gr_context.beginPath()

    gr_context.fillStyle = white
    gr_context.arc(centreX, centreY, rad*0.9, 0, Math.PI)
    gr_context.fill()
    gr_context.beginPath()

    gr_context.fillStyle = red
    gr_context.arc(centreX, centreY, rad*0.8, 0, Math.PI)
    var redgr = gr_context.createRadialGradient(centreX, centreY, 1, centreX, centreY, rad)
    redgr.addColorStop(0.2, "rgb(255, 25, 0)")
    redgr.addColorStop(0.9, "rgb(255, 255, 255)")
    gr_context.fillStyle = redgr
    gr_context.fill()
    gr_context.stroke()
    var seed = []
    gr_context.strokeStyle = "rgba(62,43,30,255)"
    gr_context.beginPath()
    for (let i = 0; i < 20; i++){
        seed = pointsWithinCircle(rad*0.8, centreX, centreY)
        if (seed[1] >= centreY)
            drawStar(seed[0], seed[1], seed[0]+jitter_range*Math.random(), seed[1]+jitter_range*Math.random(), ncuts*2)
    }
}

canvas.addEventListener("mousemove", (ev) => {

    var curX = ev.clientX
    var curY = ev.clientY

    if (jitter){
        gr_context.lineWidth = Math.random()*penwi
        gr_context.globalAlpha = Math.random()
    }

    //gr_context.strokeStyle = "rgb(" + Math.random()*255 + ", " + Math.random()*255 + ", " + Math.random()*255 + ")"

    if (prevX == null || prevY == null){
        prevX = ev.clientX
        prevY = ev.clientY
        //return
    } else if (is_drawing){

        pointArray.push([curX, curY]) // pushing to array of path points

        if(drawingMode == DRAW || drawingMode == NEON){
            draw(prevX, prevY, curX, curY)
        } else if (drawingMode == BRIDGE) {
            bridge(prevX, prevY, curX, curY)
        } else if (drawingMode == AIRBRUSH) {
            airbrush(prevX, prevY, curX, curY)
        } else if (drawingMode == SCATTER) {
            scatter(curX, curY)
        } else if (drawingMode == STROKES) {
            stroke(prevX, prevY, curX, curY)
        } else if (drawingMode == DROPS) {
            drops(prevX, prevY, curX, curY)
        }
    }
    if (drawingMode != RECT && drawingMode != ELLIPSE && drawingMode != STAR && drawingMode != WATERMELON) {
        prevX = curX
        prevY = curY
    }
})

document.getElementById("close_button").addEventListener("click", () => {
    document.getElementById("menu_button").style.opacity = "1";
    document.getElementById("sideBar").style.width = "0";
})
document.getElementById("menu_button").addEventListener("click", () => {
    document.getElementById("menu_button").style.opacity = "0";    
    document.getElementById("sideBar").style.width = "250px";
})

document.getElementById("palette_button").addEventListener("click", () =>{document.getElementById("paletteBar").style.width = "250px";})
document.getElementById("closePalette").addEventListener("click", () => {document.getElementById("paletteBar").style.width = "0"})

var palette = document.querySelectorAll(".palette")
palette = Array.from(palette)
palette.forEach(palette_color => {
    palette_color.addEventListener("click", () => {
        color1 = palette_color.dataset.palette
        pen_color.value = palette_color.dataset.palette
    })    
})

document.getElementById("settings_button").addEventListener("click", () => {document.getElementById("settingsBar").style.width = "250px";})
document.getElementById("close_settings").addEventListener("click", () => {document.getElementById("settingsBar").style.width = "0";})

// SETTINGS HANDLING

window.onbeforeunload = function() {return "";}
const canvas = document.getElementById("ground")
canvas.height = window.innerHeight
canvas.width = window.innerWidth

const gr_context = canvas.getContext("2d")

// gr_context.fillStyle = "red"
// gr_context.fillRect(100, 100, 100, 100)

// DRAWING MODES
const DRAW = 1
const RECT = 2
const SCATTER = 3
const ELLIPSE = 4
const STAR = 5
const NEON = 6

// DRAWING STATUSES
var is_drawing = false
var drawingMode = DRAW // drawing mode DRAW by default
var fill_or_no = false
var flat = true
var contour = true
var ncuts = 8

// VALUES
var prevX = null //var vs var
var prevY = null

var cx = 0, cy = 0

// DRAWING PARAMETERS
var color = 0
var penwi = 3
var diami = 50
var densi = 100
var transi = 50

gr_context.lineWidth = penwi

document.querySelector(".clear").addEventListener("click", () => {
    gr_context.fillRect(0, 0, canvas.width, canvas.height)
})

document.querySelector(".save").addEventListener("click", () => {
    //var  file_name = prompt("Повне ім'я файлу:");
    let data = canvas.toDataURL("imag/jpg")
    let canvas_image = document.createElement("a")
    canvas_image.href = data

    canvas_image.download = "drawing" //file_name
    canvas_image.click()
})

// DRAWING MODE CHANGE
document.getElementById("draw_button").addEventListener("click", () => {drawingMode = DRAW})
document.getElementById("rect_button").addEventListener("click", () => {drawingMode = RECT})
document.getElementById("scatter_button").addEventListener("click", () => {drawingMode = SCATTER})
document.getElementById("ellipse_button").addEventListener("click", () => {drawingMode = ELLIPSE})
document.getElementById("neon_button").addEventListener("click", () => {drawingMode = NEON})
document.getElementById("star_button").addEventListener("click", () => drawingMode = STAR)

// DRAWING PARAMETERS CHANGE
document.getElementById("flat").addEventListener("change", () => {
    if (flat)
        flat = false
    else flat = true
})

document.getElementById("contour").addEventListener("change", () => {
    if (contour)
        contour = false
    else contour = true
})

let pen_color = document.getElementById("pen_color")
let brush_color = document.getElementById("brush_color")
let fill_checkbox = document.getElementById("fill_rect")


function rand(from, to){
    let r = Math.floor(Math.random() * (to - from) + from);
    console.log("from: " + from + ", to: " + to + "     rand:" + r)
    return r
}

// DRAWING FUNCTIONS
function scatter(x, y){
    let lx, ly
    for (let i = 0; i < densi; i++) {
        
        var a = Math.random()
        var b = Math.random()

        if (flat && b < a){
            let temp = a
            a = b
            b = temp
        }

        lx = b*diami*Math.cos(2*Math.PI*(a/b))+x
        ly = b*diami*Math.sin(2*Math.PI*(a/b))+y
        gr_context.fillRect(lx, ly, 0.5, 0.5)
    }
}
// ggogl JS get&setPixel when i get the electricity

function circleCoords(centreX, centreY, radius, i, ncuts){
    // x = cx + cos(angle)*r
    // y sin

    var ncuts_angle = (360/ncuts)/57
    //if (outer) ncuts_angle += 2*(360/ncuts)/57
    cx = centreX + Math.cos(ncuts_angle*i*2)*radius
    cy = centreY + Math.sin(ncuts_angle*i*2)*radius
    console.log("X: " + cx + "   Y: " + cy)
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
            } else circleCoords(centreX, centreY, r/2, i, ncuts*2)
            
            if (i==1){
                gr_context.moveTo(cx, cy)
                var sx = cx
                var sy = cy
            }
                
            gr_context.lineTo(cx, cy)
            gr_context.moveTo(cx, cy)
            
            //gr_context.stroke()
    
        console.log("from: " + cx + " " + cy + "   to: " + cx + " " + cy) 
    }

    gr_context.lineTo(sx, sy)
    gr_context.stroke()
}
gr_context.strokeStyle = "pink"
// test
drawStar(200, 200, 400, 500, 10)

//----------------------------------------------------------------------EVENT LISTENERS--------

// ---------------------------------COLOR CHANGE----------------------
pen_color.addEventListener("input", (event) => {gr_context.strokeStyle = event.target.value})
pen_color.addEventListener("change", (event) => {gr_context.strokeStyle = event.target.value})
brush_color.addEventListener("input", (event) => {gr_context.fillStyle = event.target.value})
brush_color.addEventListener("change", (event) => {gr_context.fillStyle = event.target.value})

fill_checkbox.addEventListener("change", () => {
    if (fill_or_no)
        fill_or_no = false
    else fill_or_no = true
})

window.addEventListener("mousedown", (ev) => {
    is_drawing = true

    prevX = ev.clientX
    prevY = ev.clientY
})

window.addEventListener("mouseup", (ev) => {
    is_drawing = false
    var endX = ev.clientX
    var endY = ev.clientY

    if (drawingMode == RECT) {
        //gr_context.fillStyle = "blue"
        if (fill_or_no)
            gr_context.fillRect(prevX, prevY, (endX-prevX), (endY-prevY))
        if (contour) {
            gr_context.beginPath()
            gr_context.rect(prevX, prevY, (endX-prevX), (endY-prevY))
            gr_context.stroke()
        }
    } else if (drawingMode == ELLIPSE){
        gr_context.beginPath();
        gr_context.ellipse((endX+prevX)/2, (endY+prevY)/2, Math.abs(endX-prevX)/2, Math.abs(endY-prevY)/2, 0, 0, 2*Math.PI)
        gr_context.stroke();
    } else if (drawingMode == STAR){
        drawStar(prevX, prevY, endX, endY, ncuts*2)
    }
})

window.addEventListener("mousemove", (ev) => {

    var curX = ev.clientX
    var curY = ev.clientY

    if (prevX == null || prevY == null){
        prevX = ev.clientX
        prevY = ev.clientY
        //return
    } else if (is_drawing && drawingMode == DRAW){
        
        
        gr_context.beginPath()
        gr_context.moveTo(prevX, prevY)

        gr_context.lineTo(curX, curY)
        gr_context.stroke()

        prevX = curX
        prevY = curY

        //rand(curX-20, curX+20)
    } else if (is_drawing && drawingMode == SCATTER)
        scatter(curX, curY)
    else if (is_drawing && drawingMode == NEON){
        flat = false
        scatter(curX, curY)
        gr_context.beginPath()
        gr_context.moveTo(prevX, prevY)
        
        gr_context.lineTo(curX, curY)
        gr_context.stroke()

        prevX = curX
        prevY = curY
    }
    
})
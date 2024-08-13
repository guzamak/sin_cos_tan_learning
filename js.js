// ก็อปมา
const RADIUS = 200;
const X_CIRCLE_CENTER = 300;
const Y_CIRCLE_CENTER = 300;

let canvas;
let ctx;

class MousePosition {
    constructor(x, y) {
        this.x = x,
        this.y = y;
    }
}

let mousePos = new MousePosition(0,0);

document.addEventListener('DOMContentLoaded', setup);

function setup(){
    canvas = document.querySelector("canvas");
    ctx = canvas.getContext("2d");
    drawCanvas()
    canvas.addEventListener("mousemove", redrawCanvas);
}
function drawCanvas(){
    drawRectangle("#839192",5,0,0,600,600)
    drawCircle("#839192",1,X_CIRCLE_CENTER,Y_CIRCLE_CENTER,RADIUS,0,Math.PI * 2)
    drawLine("#839192",1,0,Y_CIRCLE_CENTER,600,Y_CIRCLE_CENTER)
    drawLine("#839192",1,X_CIRCLE_CENTER,0,X_CIRCLE_CENTER,600)
}
function redrawCanvas(e){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawCanvas()
    getMousePosition(e)
    drawTextAtPoint("X :" + mousePos.x,15,25)
    drawTextAtPoint("Y :" + mousePos.y,15,45)
    let angleOfMouseDegrees = getAngleUsingXAndY(mousePos.x, mousePos.y);
    drawTextAtPoint("Degrees : " + angleOfMouseDegrees, 15, 65);
    drawTriangle(angleOfMouseDegrees);
}
function drawRectangle(strokeColor,lineWidth, startX,  startY, endX, endY){
    ctx.beginPath(); 
    ctx.lineWidth = lineWidth
    ctx.strokeStyle = strokeColor
    ctx.rect(startX, startY, endX, endY)  
    ctx.stroke();  
}    

function drawCircle(strokeColor, lineWidth, xCircCenter, yCircCenter, radius, arcStart, arcEnd){
    ctx.beginPath(); 
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = strokeColor;
    ctx.beginPath();
    ctx.arc(xCircCenter, yCircCenter, radius, arcStart, arcEnd);
    ctx.stroke();
}
function drawLine(strokeColor, lineWidth, xStart, yStart, xEnd, yEnd){
    ctx.beginPath(); 
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = strokeColor;
    ctx.moveTo(xStart, yStart);
    ctx.lineTo(xEnd, yEnd);
    ctx.stroke();
}
function drawTextAtPoint(text,x,y){
    ctx.font = "15px Arial"
    ctx.fillText(text,x,y)
}
function getMousePosition(e){
    let canvasDimensions = canvas.getBoundingClientRect()
    mousePos.x = Math.floor(e.clientX - canvasDimensions.left)
    mousePos.y = Math.floor(e.clientY - canvasDimensions.top)
    mousePos.x -= 300
    mousePos.y = -1 * (mousePos.y -300)
    return mousePos
}
// อธิบาย
//              /|
//   ฉาก hypot / |
//   tenuse   /  |  ข้ามฉาก opposite
//           /   |
//          /    |
//         /     |
//        /______|
//    ชิดฉาก adjacent
// 
// 

// หามุมจาก tan()
function getAngleUsingXAndY(x, y){
    let adjacent = x;  
    let opposite = y; 
    
//              /| (x,y)
//   ฉาก hypot / |
//   tenuse   /  |  ข้าม opposite
//           /   |
//          /    |
//         / 0   |
//        /______|
//    ชิดฉาก adjacent

//   x =  ______
//   y = | 
//       |
//       |
//       |
//       |
//       |

//  x เป็นองศา หรือ เรเดียน เเต่ Math. ใน js ใช้ radians เป็นหลัก
//  หามุม 0 จาก tan(0) = opposite/adjacent ข้ามชิด get radians
//  **
//  sin(x) = opposite / hypottenuse  ข้ามฉาก
//  cos(x) = adjacent / hypottenuse ชิดฉาก (cosine)
//  cosec(x) = hypottenuse / opposite (sin⁻¹ or arcsin)
//  sec(x) = hypottenuse / adjacent (cos⁻¹ or arccos)
//  cot(x) = adjacent / opposite (tan⁻¹ or arctan )
// tan(x) = opposite/adjacent
    return radiansToDegrees(Math.atan2(opposite, adjacent));
}
// หา องศา degress จาก เรเดียน radians (คนละหน่วย) (เรเดียน * 180/π = องศา)
function radiansToDegrees(rad){
    if(rad < 0){
        return (360.0 + (rad * (180 / Math.PI))).toFixed(2);
    } else {
        return (rad * (180 / Math.PI)).toFixed(2);
    }
}
// องศา * 3.14/180 = เรเดียน
function degreesToRadians(degrees){
    return degrees * (Math.PI / 180);
}
// วาดสามเหลี่ยม
function drawTriangle(angleDegrees){
        // วาดเส้นฉาก hypotenuse เอียง / ตามองศา
        ctx.beginPath(); 
        ctx.moveTo(X_CIRCLE_CENTER, Y_CIRCLE_CENTER);

        // cos(x) = adjacent / hypottenuse ชิดฉาก (cosine)
        // xEndPoint = จุดกึ่งกลางวงกลม + (รัศมี * cos(angle))  // ความยาว(รัศมี) เเต่ อ้่างอิง องศา ผ่าน cos
        // ได้ จุด เเกน x (adjacent) ฝั่งชิดเเนวนอน
        let xEndPoint = X_CIRCLE_CENTER + RADIUS * Math.cos(degreesToRadians(angleDegrees));
    
        // sin(x) = opposite / hypottenuse  ข้ามฉาก
        // yEndPoint = จุดกึ่งกลางวงกลม + (รัศมี * -sin(angle)) 
        // ได้ จุด เเกน y (opposite) ฝั่งชิดเเนวตั้ง
        // เหตุผลที่ -sin เพราะ canvas ใน html ถ้าบวกจะลงไปข้างล่าง เเต่ในกราฟจริงๆถ้าบวกจะขึ้นบน ทำให้ต้องลบ 
        let yEndPoint = Y_CIRCLE_CENTER + RADIUS * -(Math.sin(degreesToRadians(angleDegrees)));
        drawTextAtPoint("Radians : " + degreesToRadians(angleDegrees).toFixed(2), 15, 85);
    
        ctx.strokeStyle = "red"
        ctx.lineTo(xEndPoint, yEndPoint);
        ctx.stroke();
    
        // วาดเส้นเเนวตั้ง (ข้าม)
        ctx.moveTo(xEndPoint, yEndPoint);
        ctx.lineTo(xEndPoint, 300);
        ctx.stroke();
    
        // Draw text for x & y
        drawTextAtPoint( "(" + xEndPoint.toFixed(2) + "," + yEndPoint.toFixed(2) + ")", xEndPoint + 10, yEndPoint - 10);
    
        // หาความยาวเส้นฉาก
        let hypotenuseLength = getLineLength(X_CIRCLE_CENTER, Y_CIRCLE_CENTER, xEndPoint, yEndPoint);
        drawTextAtPoint( "Hypot L : " + hypotenuseLength.toFixed(2), 15, 105);
    
        // หาความยาวเส้นเเนวตั้ง (ข้าม)
        let oppositeLength = getLineLength(xEndPoint, yEndPoint, xEndPoint, 300);
        drawTextAtPoint( "Opp L : " + oppositeLength.toFixed(2), 15, 125);
}

// ระยะห่าง xy1 xy2 กังๆ
function getLineLength(x1,y1,x2,y2){
    return Math.hypot(x1-x2, y1-y2)
}



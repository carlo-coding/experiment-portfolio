



export function getQuadrant(width, height, mouseX, mouseY) {
    const center = { x: width/2, y: height/2 };
    let quadrant = 0;
    const angles = {x: 0, y: 0}
    const distance = Math.sqrt(Math.pow((center.x - mouseX), 2) + Math.pow((center.y - mouseY), 2))/1500
    if (mouseY < center.y && mouseX > center.x) {
        quadrant = 1;
        angles.x = -1*distance;
        angles.y = 1*distance;
    }
    else if(mouseY < center.y && mouseX < center.x) {
        quadrant = 2;
        angles.x = -1*distance;
        angles.y = -1*distance;
    }
    else if(mouseY > center.y && mouseX < center.x) {
        quadrant = 3;
        angles.x = 1*distance;
        angles.y = -1*distance;
    }
    else if(mouseY > center.y && mouseX > center.x) {
        quadrant = 4;
        angles.x = 1*distance;
        angles.y = 1*distance;
    }

    
    
    return angles;
}

export function createClips(targets, container) {

    let paths = "";
    for (let target of targets) {
        let coords = {
            p1: {x: target.x, y: target.y},
            p2: {x: (target.x + target.width), y: target.y},
            p3: {x: (target.x + target.width), y: (target.y + target.height)},
            p4: {x: target.x, y: (target.y + target.height)},
        };
        paths += `
            ${coords.p1.x}px 100%, 
            ${coords.p1.x}px ${coords.p1.y}px, 
            ${coords.p2.x}px ${coords.p2.y}px, 
            ${coords.p3.x}px ${coords.p3.y}px, 
            ${coords.p4.x}px ${coords.p4.y}px, 
            ${coords.p4.x}px 100%,
        `;
    }
    container.style.clipPath = `
        polygon(
            0% 0%,
            0% 100%,
            ${paths}
            100% 100%, 
            100% 0%
        )`
}
const color_input = document.getElementById("color");
const paragraph = document.getElementById("paragraph");
const content = document.getElementById("content");

var socket = io('http://localhost:4200/');


socket.on('newcolor', (data) => {
    let color = data.color === "dark" ? "white" : "black";
    let text = data.color === "dark" ? "Ag" : "Qara";
    paragraph.innerHTML = `This is some random text: ${text}`;
    paragraph.style.color = color;
});

if (color_input) {

    color_input.addEventListener('change', (e) => {

        let hex_color = e.target.value;
        let rgb_color = convertHexToRGB(hex_color);
        content.style.backgroundColor = hex_color;
        socket.emit('colorchanged', {
            hex_color: rgb_color
        });

    });

}

function convertHexToRGB(hex) {

    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function (m, r, g, b) {
        return r + r + g + g + b + b;
    });

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: Math.round(parseInt(result[1], 16) / 2.55) / 100,
        g: Math.round(parseInt(result[2], 16) / 2.55) / 100,
        b: Math.round(parseInt(result[3], 16) / 2.55) / 100,
    } : null;
}


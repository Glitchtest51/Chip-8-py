const gameWidth = 64;
const gameHeight = 32;
const introAttributeNames = 'clickchip'.split('');
const gameAttributeNames = 'playchip'.split('');

let lastTime = performance.now();

let firstElement;
const divs = [];
let mode = 'intro';
var map = [];

var keys = [];
const Keybinds = [
    88, 49, 50, 51,
    81, 87, 69, 65,
    83, 68, 90, 67,
    52, 82, 70, 86 
];

const Font = [
    0xF0, 0x90, 0x90, 0x90, 0xF0, // 0
    0x20, 0x60, 0x20, 0x20, 0x70, // 1
    0xF0, 0x10, 0xF0, 0x80, 0xF0, // 2
    0xF0, 0x10, 0xF0, 0x10, 0xF0, // 3
    0x90, 0x90, 0xF0, 0x10, 0x10, // 4
    0xF0, 0x80, 0xF0, 0x10, 0xF0, // 5
    0xF0, 0x80, 0xF0, 0x90, 0xF0, // 6
    0xF0, 0x10, 0x20, 0x40, 0x40, // 7
    0xF0, 0x90, 0xF0, 0x90, 0xF0, // 8
    0xF0, 0x90, 0xF0, 0x10, 0xF0, // 9
    0xF0, 0x90, 0xF0, 0x90, 0x90, // A
    0xE0, 0x90, 0xE0, 0x90, 0xE0, // B
    0xF0, 0x80, 0x80, 0x80, 0xF0, // C
    0xE0, 0x90, 0x90, 0x90, 0xE0, // D
    0xF0, 0x80, 0xF0, 0x80, 0xF0, // E
    0xF0, 0x80, 0xF0, 0x80, 0x80 // F
];

var PC = 0x200;
var I = 0;
var Stack = [];
var V = new Array(0xF + 1).fill(0);

let MemorySize = 4096;
var Memory = new Array(MemorySize).fill(0);

var DelayTimer = 0;
var SoundTimer = 0;

let ROM = [0x13,0x0C,0x60,0x00,0xE0,0xA1,0x12,0x04,0x70,0x01,0x40,0x10,0x00,0xEE,0x12,0x04,0x65,0x00,0xA2,0x22,0xF1,0x55,0xA2,0x82,0xF1,0x55,0x12,0x22,0x43,0x01,0xD0,0x12,0x22,0x02,0x00,0x00,0xF5,0x1E,0xF5,0x1E,0xF5,0x1E,0xF5,0x1E,0xF1,0x65,0x63,0x00,0xF3,0x15,0xF4,0x07,0x34,0x00,0x12,0x44,0xA4,0x23,0xD0,0x12,0x64,0x0A,0xF4,0x15,0x64,0x01,0x83,0x43,0x64,0x0E,0xE4,0x9E,0x12,0x52,0x45,0x00,0x12,0x52,0x75,0xFF,0x12,0x1C,0x64,0x0F,0xE4,0x9E,0x12,0x60,0x95,0x20,0x12,0x60,0x75,0x01,0x12,0x1C,0x86,0x50,0x64,0x0A,0xE4,0xA1,0x12,0x80,0x64,0x00,0x72,0x01,0x74,0x01,0xE4,0x9E,0x12,0x78,0x86,0x40,0x76,0xFF,0x12,0x80,0x54,0x20,0x12,0x6C,0x72,0xFF,0x12,0x32,0x22,0x02,0x00,0x00,0xF6,0x1E,0xF6,0x1E,0xF6,0x1E,0xF6,0x1E,0x64,0x02,0xF4,0x1E,0xF1,0x65,0x64,0x10,0x80,0x41,0xA2,0x9A,0xF1,0x55,0x00,0x00,0xFC,0x65,0x23,0x02,0x41,0x00,0x00,0xEE,0x80,0x10,0x23,0x02,0x42,0x00,0x00,0xEE,0x80,0x20,0x23,0x02,0x43,0x00,0x00,0xEE,0x80,0x30,0x23,0x02,0x44,0x00,0x00,0xEE,0x80,0x40,0x23,0x02,0x45,0x00,0x00,0xEE,0x80,0x50,0x23,0x02,0x46,0x00,0x00,0xEE,0x80,0x60,0x23,0x02,0x47,0x00,0x00,0xEE,0x80,0x70,0x23,0x02,0x48,0x00,0x00,0xEE,0x80,0x80,0x23,0x02,0x49,0x00,0x00,0xEE,0x80,0x90,0x23,0x02,0x4A,0x00,0x00,0xEE,0x80,0xA0,0x23,0x02,0x4B,0x00,0x00,0xEE,0x80,0xB0,0x23,0x02,0x4C,0x00,0x00,0xEE,0x80,0xC0,0x23,0x02,0x00,0xEE,0xA4,0x27,0xF0,0x1E,0xDD,0xE4,0x7D,0x04,0x00,0xEE,0x00,0xE0,0xA1,0xFF,0xF0,0x65,0x40,0x01,0x13,0x54,0x40,0x02,0x13,0x58,0x40,0x03,0x13,0xBE,0x6D,0x0A,0x6E,0x02,0xA4,0xD3,0x22,0x9C,0x6D,0x08,0x6E,0x0A,0xA4,0xDF,0x22,0x9C,0x6D,0x08,0x6E,0x0F,0xA4,0xEB,0x22,0x9C,0x6D,0x08,0x6E,0x14,0xA4,0xF5,0x22,0x9C,0x6A,0x32,0x6B,0x1B,0xA5,0x89,0xDA,0xB4,0x6A,0x3A,0xA5,0x8D,0xDA,0xB4,0x60,0xA4,0x61,0xC7,0x62,0x02,0x12,0x10,0x61,0x9E,0x13,0x5A,0x61,0xA1,0x60,0xEE,0xA3,0x9E,0xF1,0x55,0x00,0xE0,0xA5,0x33,0xFF,0x65,0xA4,0x12,0xFF,0x55,0x6D,0x12,0x6E,0x03,0xA5,0x43,0x22,0x9C,0x6D,0x12,0x6E,0x0A,0xA5,0x4B,0x22,0x9C,0x6D,0x12,0x6E,0x11,0xA5,0x53,0x22,0x9C,0x6D,0x12,0x6E,0x18,0xA5,0x5B,0x22,0x9C,0x6E,0x00,0x23,0x96,0x7E,0x01,0x4E,0x10,0x6E,0x00,0x13,0x8C,0xA4,0x12,0xFE,0x1E,0xF0,0x65,0x62,0x01,0xEE,0xA1,0x62,0x00,0x90,0x20,0x13,0xBC,0x80,0xE0,0x80,0x0E,0xA5,0x63,0xF0,0x1E,0xF1,0x65,0xA5,0x83,0xD0,0x16,0xA4,0x12,0xFE,0x1E,0x80,0x20,0xF0,0x55,0x00,0xEE,0x00,0xE0,0x6D,0x06,0x6E,0x0D,0xA5,0x03,0x22,0x9C,0x60,0x03,0xF0,0x15,0xF0,0x0A,0xF1,0x07,0x31,0x00,0x13,0xF2,0xE0,0xA1,0x13,0xF8,0x00,0xE0,0xA4,0x25,0x60,0x1E,0x61,0x09,0xD0,0x13,0x6D,0x10,0x6E,0x11,0xA5,0x11,0x22,0x9C,0x22,0x02,0xF0,0x0A,0x22,0x02,0x13,0x0C,0x6D,0x0A,0xA5,0x1A,0x13,0xFC,0x6D,0x08,0xA5,0x26,0x00,0xE0,0x6E,0x11,0x22,0x9C,0xA4,0x28,0x60,0x1E,0x61,0x09,0xD0,0x13,0x22,0x02,0xF0,0x0A,0x22,0x02,0x13,0x0C,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0xC0,0xC0,0xA0,0xC0,0x80,0xA0,0x40,0xA0,0xE0,0xA0,0xA0,0xE0,0xC0,0x40,0x40,0xE0,0xE0,0x20,0xC0,0xE0,0xE0,0x60,0x20,0xE0,0xA0,0xE0,0x20,0x20,0xE0,0xC0,0x20,0xC0,0xE0,0x80,0xE0,0xE0,0xE0,0x20,0x20,0x20,0xE0,0xE0,0xA0,0xE0,0xE0,0xE0,0x20,0xE0,0x40,0xA0,0xE0,0xA0,0xC0,0xE0,0xA0,0xE0,0xE0,0x80,0x80,0xE0,0xC0,0xA0,0xA0,0xC0,0xE0,0xC0,0x80,0xE0,0xE0,0x80,0xC0,0x80,0x60,0x80,0xA0,0x60,0xA0,0xE0,0xA0,0xA0,0xE0,0x40,0x40,0xE0,0x60,0x20,0x20,0xC0,0xA0,0xC0,0xA0,0xA0,0x80,0x80,0x80,0xE0,0xE0,0xE0,0xA0,0xA0,0xC0,0xA0,0xA0,0xA0,0xE0,0xA0,0xA0,0xE0,0xC0,0xA0,0xC0,0x80,0x40,0xA0,0xE0,0x60,0xC0,0xA0,0xC0,0xA0,0x60,0xC0,0x20,0xC0,0xE0,0x40,0x40,0x40,0xA0,0xA0,0xA0,0x60,0xA0,0xA0,0xA0,0x40,0xA0,0xA0,0xE0,0xE0,0xA0,0x40,0xA0,0xA0,0xA0,0xA0,0x40,0x40,0xE0,0x60,0x80,0xE0,0x00,0x00,0x00,0x00,0x00,0xE0,0x00,0x00,0x00,0x00,0x00,0x40,0x04,0x0B,0x03,0x54,0x04,0x10,0x03,0x58,0x04,0x15,0x03,0xBE,0x68,0x4C,0x34,0x54,0x94,0x64,0x68,0x34,0x64,0x38,0x3C,0x00,0x08,0x94,0x3C,0x88,0x28,0x3C,0x94,0x38,0x64,0x84,0x60,0x00,0x0C,0x94,0x3C,0x88,0x2C,0x08,0x94,0x7C,0x68,0x00,0x10,0x94,0x40,0x88,0x04,0x2C,0x94,0x44,0x3C,0x78,0x54,0x3C,0x8C,0x00,0x68,0x70,0x3C,0x74,0x74,0x94,0x2C,0x60,0x8C,0x94,0x54,0x3C,0x8C,0x00,0x2C,0x58,0x58,0x94,0x44,0x64,0x64,0x38,0x00,0x60,0x64,0x78,0x94,0x48,0x2C,0x58,0x78,0x4C,0x60,0x44,0x00,0x60,0x64,0x78,0x94,0x70,0x3C,0x58,0x3C,0x2C,0x74,0x3C,0x38,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x08,0x94,0x0C,0x94,0x10,0x94,0x34,0x00,0x14,0x94,0x18,0x94,0x1C,0x94,0x38,0x00,0x20,0x94,0x24,0x94,0x28,0x94,0x3C,0x00,0x2C,0x94,0x04,0x94,0x30,0x94,0x40,0x00,0x18,0x17,0x10,0x02,0x18,0x02,0x20,0x02,0x10,0x09,0x18,0x09,0x20,0x09,0x10,0x10,0x18,0x10,0x20,0x10,0x10,0x17,0x20,0x17,0x28,0x02,0x28,0x09,0x28,0x10,0x28,0x17,0xFE,0xFE,0xFE,0xFE,0xFE,0xFE,0x0A,0xAE,0xA2,0x42,0x10,0x30,0x10,0xB8]

// ---dunno yet---
// \/\/\/

// Waits x milliseconds
function wait(milliseconds) {
    return new Promise((resolve, reject) => {
        setTimeout(resolve, milliseconds);
    });
}

// Renders Intro
function renderIntro() {
    let i = Math.floor(Math.sin(Date.now()/700) * (divs.length/2) + (divs.length/2));

    divs.forEach((div, y) => {
        if (y == i) {
            div.setAttribute(introAttributeNames[y % introAttributeNames.length], ' . OKAY now CLICK the SNAKE! . ');
        }
        else {
            div.setAttribute(introAttributeNames[y % introAttributeNames.length], ' . . . . . . . . . . . . . . . ');
        }
    });
}

// Starts game
async function startGame() {
    // Set mode to setup
    mode = 'setup';

    // Remove old divs
    do {
        let div = divs.pop();
        await wait(50);
        div.parentElement.removeChild(div);
    }
    while (divs.length > 1);
    divs[0].removeAttribute(introAttributeNames[0]);

    // Make new divs
    while (divs.length < gameHeight) {
        await wait(50);
        div = document.createElement('div');
        document.body.insertBefore(div, firstElement);
        divs.push(div);
    }

    // Set mode to game
    mode = 'game';

    // Init map
    clearscreen()

    // Init V and Mem
    initemu()
}

// /\/\/\

// ---Screen---
// \/\/\/

// Clears map
function clearscreen() {
    for (let i = 0; i < (gameWidth * gameHeight); i ++) {
        map[i] = 0;
    }
}

// Sets pixel to on or off
function turnOnPix(X, Y) {
    let index = Y * gameWidth + X;
    map[index % (gameWidth * gameHeight)] ^= 1;
}

// Gets pixel
function getPix(X, Y) {
    let index = Y * gameWidth + X;
    return map[index % (gameWidth * gameHeight)];
}

// Renders map
function renderScreen() {
    divs.forEach((div, y) => {
        let line = '';

        for (let x = 0; x < gameWidth; x ++) {
            const tile = getPix(x, y);

            if (tile == 0) {
                line += '⬛';
            }
            else if (tile == 1) {
                line += '⬜';
            }
        }

        div.setAttribute(gameAttributeNames[y % gameAttributeNames.length], line);
        y -= 1;
    });
}

// /\/\/\

// ---Emulator---
// \/\/\/

// init
function initemu() {
    for (let i = 0; i < Font.length; i++) {
        Memory[i] = Font[i];
    }

    for (let i = 0; i < ROM.length; i++) {
        Memory[512 + i] = ROM[i];
    }
}

function fetch() {
    try {
        const opcode = (Memory[PC] << 8) | Memory[PC + 1];
        PC += 2;
        return opcode;
    } catch (error) {
        console.error(error);
    }
}

function execute(opcode) {
    try {
        let op1 = (opcode & 0xF000) >> 12;
        let X = (opcode & 0x0F00) >> 8;
        let Y = (opcode & 0x00F0) >> 4;
        let nnn = (opcode & 0x0FFF);
        let nn = (opcode & 0x00FF);
        let n = (opcode & 0x000F);
        let tmp;

        switch (op1) {
            case 0x0:
                switch (nn) {
                    case 0xE0:
                        clearscreen();
                        break;
                    case 0xEE:
                        PC = Stack.pop();
                        break;
                }
                break;
            case 0x1:
                PC = nnn;
                break;
            case 0x2:
                Stack.push(PC);
                PC = nnn;
                break;
            case 0x3:
                if (V[X] == nn) {
                    PC += 2;
                }
                break;
            case 0x4:
                if (V[X] != nn) {
                    PC += 2;
                }
                break;
            case 0x5:
                if (V[X] == V[Y]) {
                    PC += 2;
                }
                break;
            case 0x6:
                V[X] = nn;
                break;
            case 0x7:
                V[X] = (V[X] + nn) % 256;
                break;
            case 0x8:
                switch (n) {
                    case 0x0:
                        V[X] = V[Y];
                        break;
                    case 0x1:
                        V[X] |= V[Y];
                        V[0xF] = 0;
                        break;
                    case 0x2:
                        V[X] &= V[Y];
                        V[0xF] = 0;
                        break;
                    case 0x3:
                        V[X] ^= V[Y];
                        V[0xF] = 0;
                        break;
                    case 0x4:
                        if ((V[X] + V[Y]) > 255) {
                            tmp = 1;
                        }
                        else {
                            tmp = 0;
                        }
                        V[X] = (V[X] + V[Y]) % 256;
                        V[0xF] = tmp;
                        break;
                    case 0x5:
                        if (V[X] >= V[Y]) {
                            tmp = 1;
                        }
                        else {
                            tmp = 0;
                        }
                        V[X] = (V[X] - V[Y]) % 256;
                        V[0xF] = tmp;
                        break;
                    case 0x6:
                        V[X] = V[Y];
                        tmp = V[X] & 0x1;
                        V[X] = (V[X] >> 1) % 256;
                        V[0xF] = tmp;
                        break;
                    case 0x7:
                        if (V[Y] >= V[X]) {
                            tmp = 1;
                        }
                        else {
                            tmp = 0
                        }
                        V[X] = (V[Y] - V[X]) % 256;
                        V[0xF] = tmp;
                        break;
                    case 0xE:
                        V[X] = V[Y];
                        tmp = V[X] >> 7;
                        V[X] = (V[X] << 1) % 256;
                        V[0xF] = tmp;
                        break;
                }
                break;
            case 0x9:
                if (V[X] != V[Y]) {
                    PC += 2;
                }
                break;
            case 0xA:
                I = nnn;
                break;
            case 0xB:
                PC = nnn + V[0x0];
                break;
            case 0xC:
                V[X] = Math.floor(Math.random() * 0xFF) & nn;
                break;
            case 0xD:
                let x = V[X] % 64;
                let y = V[Y] % 32;
                V[0xF] = 0;
                for (let row = 0; row < n; row++) {
                    if (y + row !== 32) {
                        let data = Memory[I + row];
                        for (let col = 0; col < 8; col++) {
                            if (x + col !== 64) {
                                if ((data >> (7 - col)) & 1 === 1) {
                                    let finalX = (x + col) % 64;
                                    let finalY = (y + row) % 32;
                                    if (getPix(finalX, finalY) === 1) {
                                        V[0xF] = 1;
                                    }
                                    turnOnPix(finalX, finalY);
                                }
                            }
                        }
                    }
                }
                break;
            case 0xE:
                switch (nn) {
                    case 0x9E:
                        if (keys.includes(Keybinds[V[X]])) {
                            PC += 2;
                        }
                        break;
                    case 0xA1:
                        if (!keys.includes(Keybinds[V[X]])) {
                            PC += 2;
                        }
                        break;
                }
            break;
            case 0xF:
                switch (nn) {
                    case 0x07:
                        V[X] = DelayTimer;
                        break;
                    case 0x15:
                        DelayTimer = V[X];
                        break;
                    case 0x18:
                        SoundTimer = V[X];
                        break;
                    case 0x1E:
                        I += V[X];
                        break;
                    case 0x0A:
                        PC -= 2;
                        Keybinds.forEach((key, index) => {
                            if (keys[key]) {
                                PC += 2
                                V[X] = index
                            }
                        });
                        break;
                    case 0x29:
                        I = (V[X] & 0xF) * 5
                        break;
                    case 0x33:
                        VX = V[X]
                        for (let i = 0; i < VX.toString().length; i++) {
                            Memory[(i + I) % MemorySize] = int(str(VX)[i]);
                        }
                        break;
                    case 0x55:
                        for (let i = 0; i < X + 1; i++) {
                            Memory[(I + i) % MemorySize] = V[i];
                        }
                        I += 1;
                        break;
                    case 0x65:
                        for (let i = 0; i < X + 1; i++) {
                            V[i] = Memory[(I + i) % MemorySize];
                        }
                        I += 1;
                        break;
                }
                break;
            default:
                console.log('Unknown Opcode: ' + opcode.toString(16));
        }
    } catch (error) {
        console.error(opcode.toString(16));
        console.error(error);
    }
}

function decrementTimers() {
    if (DelayTimer > 0) {
        DelayTimer -= 1
    }
    if (SoundTimer > 0) {
        // start sound
        SoundTimer -= 1
    }
    // else {
        // stop sound
    // }
}

function executeCycle() {
    execute(fetch())
    renderScreen()
}

// /\/\/\

function loop() {
    setTimeout(loop, 1000 / 400);

    if (mode == 'intro') {
        renderIntro();
    }
    else if (mode == 'game') {
        executeCycle();
    }

    let currentTime = performance.now();
    let elapsedTime = currentTime - lastTime;
    if (elapsedTime < 60) {
        decrementTimers();
        lastTime = currentTime;
    }
}

function keydown(event) {
    const key = event.which;
    if (!keys.includes(key)) {
        keys.push(key);
    }
}

function keyup(event) {
    const key = event.which;
    const index = keys.indexOf(key);
    if (index > -1) {
        keys.splice(index, 1);
    }
}

// Start
window.addEventListener('load', () => {
    // Sets firstElement
    firstElement = document.body.firstChild;

    for (let i = 0; i < 10; i ++) {
        const div = document.createElement('div');
        document.body.insertBefore(div, firstElement);
        divs.push(div);
    }

    window.addEventListener('keydown', keydown);
    window.addEventListener('keyup', keyup);

    const snakeElement = divs[0];
    window.addEventListener('blur', () => {
        document.getElementsByTagName('style')[0].innerHTML += 'div:first-of-type {cursor: pointer;}';
        snakeElement.addEventListener('click', startGame);
    });

    loop();
});
var randomNormal = require('random-normal');

/**
 * Return a random number between 0 and maxValue.
 * @param {number} maxValue A number.
 * @returns {number} A random number between 0 and maxValue.
 */
function random(maxValue) {

    return Math.round(Math.random() * maxValue);
}

/**
 * Initialises a shape population of a set number.
 * @param {string} shape The type of shape each population individual will be.
 * @param {number} shapeCount The size of the population.
 * @param {Object} size The dimensions of the target image.
 * @returns {Array} The population of shape objects.
 */
function initDna(shape, shapeCount, size) {
    var i;
    var dna = [];
    var points;
    var colour;
    var radius;
    switch(shape) {
        // Population is initialised based on the value of the shape parameter
        case 'circle':
            for(i = 0; i < shapeCount; i++) {
                radius = random(size.width/10) + 5; // A random radius value between 5 and a random factor of the target image's width
                points = [random(size.width), random(size.height), radius, 0, 2 * Math.PI];
                colour = {r: random(255), g: random(255), b: random(255), a: Math.random()};
                dna[i] = {points: points, colour: colour};
            }
            break;

        case 'rectangle':
            for(i = 0; i < shapeCount; i++) {
                points = [random(size.width), random(size.height), random(size.width), random(size.height)];
                colour = {r: random(255), g: random(255), b: random(255), a: Math.random()};
                dna[i] = {points: points, colour: colour};
            }
            break;

        case 'square':
            for(i = 0; i < shapeCount; i++) {
                radius = random(size.width/5) + 5; // A random radius value between 5 and a random factor of the target image's width
                points = [random(size.width-radius/2), random(size.height-radius/2), radius, radius];
                colour = {r: random(255), g: random(255), b: random(255), a: Math.random()};
                dna[i] = {points: points, colour: colour};
            }
            break;

        case 'triangle':
            for(i = 0; i < shapeCount; i++) {
                points = [];
                for(var j = 0; j < 3; j++) {
                    points.push({x: random(size.width), y: random(size.height)});
                }
                colour = {r: random(255), g: random(255), b: random(255), a: Math.random()};
                dna[i] = {points: points, colour: colour};
            }
            break;

        default:
            break;
    }
    return dna;
}

/**
 * Copies a shape object from one population to another.
 * @param {Object} shapeFrom The shape whose attributes are to be copied.
 * @param {Object} shapeTo The shape whose attributes are to be replaced.
 * @param {string} shape The type of shape in use.
 * @param {number} index The identical array index of both shape objects.
 */
function passGeneMutation(shapeFrom, shapeTo, shape, index) {
    // Copying 'colour' key from one object to another.
    shapeTo[index].colour.r = shapeFrom[index].colour.r;
    shapeTo[index].colour.g = shapeFrom[index].colour.g;
    shapeTo[index].colour.b = shapeFrom[index].colour.b;
    shapeTo[index].colour.a = shapeFrom[index].colour.a;

    var i;

    switch(shape) {
        // Copying 'points' key from one object to anthoer, depending on which shape is in use.
        case 'circle':
            shapeTo[index].points[0] = shapeFrom[index].points[0];
            shapeTo[index].points[1] = shapeFrom[index].points[1];
            shapeTo[index].points[2] = shapeFrom[index].points[2];
            break;

        case 'square':
        case 'rectangle':
            for(i = 0; i < 4; i++) {
                shapeTo[index].points[i] = shapeFrom[index].points[i];
            }
            break;

        case 'triangle':
            for(i = 0; i < 3; i++) {
                shapeTo[index].points[i].x = shapeFrom[index].points[i].x;
                shapeTo[index].points[i].y = shapeFrom[index].points[i].y;
            }
            break;
        default:
            break;
    }
}

/**
 * Returns a random number, within a range, from a Gaussian distribution.
 * @param {number} centre The current value of a shape object's attribute.
 * @param {number} limit The maximum value of the attribute.
 * @returns {number} Random number from Gaussian distribution.
 */
function computeNormal(centre, limit){
    var retval = randomNormal({mean: centre, dev: centre/6});
    while(0 > retval || retval > limit) {
        retval = randomNormal({mean: centre, dev: centre/6});
    }
    return retval;
}

/**
 * Paints a circle on a canvas.
 * @param {CanvasRenderingContext2D} ctx The reference to a HTML canvas.
 * @param {Object} colour The circle's colour.
 * @param {Array} points The circle's coordinates/points.
 */
function drawCircle(ctx, colour, points) {
    ctx.beginPath();
    ctx.fillStyle = "rgba("+colour.r+","+colour.g+","+colour.b+","+colour.a+")";
    ctx.arc(points[0], points[1], points[2], 0, 2 * Math.PI);
    ctx.closePath();
    ctx.fill();
}

/**
 * Paints a rectangle on a canvas.
 * @param {CanvasRenderingContext2D} ctx The reference to a HTML canvas.
 * @param {Object} colour The rectangle's colour.
 * @param {Array} points The rectangle's coordinates/points.
 */
function drawRect(ctx, colour, points) {
    ctx.fillStyle = "rgba("+colour.r+","+colour.g+","+colour.b+","+colour.a+")";
    ctx.fillRect(points[0], points[1], points[2], points[3]);
}

/**
 * Paints a triangle on a canvas.
 * @param {CanvasRenderingContext2D} ctx The reference to a HTML canvas.
 * @param {Object} colour The triangle's colour.
 * @param {Array} points The triangle's coordinates/points.
 */
function drawTri(ctx, colour, points) {
    ctx.fillStyle = "rgba("+colour.r+","+colour.g+","+colour.b+","+colour.a+")";
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    ctx.lineTo(points[1].x, points[1].y);
    ctx.lineTo(points[2].x, points[2].y);
    ctx.closePath();
    ctx.fill();
}

/**
 * Paints a shape on a canvas.
 * @param {CanvasRenderingContext2D} ctx The reference to a HTML canvas.
 * @param {Array} dna A population of shape individuals.
 * @param {string} shape The type of shape in use.
 * @param {Object} size The dimensions of the target image.
 */
function drawDNA(ctx, dna, shape, size) {
    // Clears the canvas before painting the shapes in the population
    ctx.fillStyle = "rgb(255,255,255)";
    ctx.fillRect(0, 0, size.width, size.height);
    var i;

    switch(shape) {
        case 'circle':
            for(i = 0; i < dna.length; i++) {
                drawCircle(ctx, dna[i].colour, dna[i].points);
            }
            break;
        case 'square':
        case 'rectangle':
            for(i = 0; i < dna.length; i++) {
                drawRect(ctx, dna[i].colour, dna[i].points);
            }
            break;
        case 'triangle':
            for(i = 0; i < dna.length; i++) {
                drawTri(ctx, dna[i].colour, dna[i].points);
            }
            break;
        default:
            break;
    }
}

/**
 * Calculates the fitness score of a canvas.
 * @param {CanvasRenderingContext2D} testCtx The reference to a HTML canvas.
 * @param {ImageData} targetData The pixel data of the target image.
 * @param {Object} size The dimensions of the target image.
 * @returns {number} The fitness score.
 */
function fitness(testCtx, targetData, size) {
    var fitness = 0;
    var pixelError = 0;

    var red = 0;
    var green = 0;
    var blue = 0;

    // The pixel data of the canvas
    var imageData = testCtx.getImageData(0, 0, size.width, size.height).data;

    // Iteratively checks RGB pixel content against target image
    for(var i = 0; i < imageData.length; i += 4) {
        red = Math.abs(imageData[i] - targetData[i]);
        green = Math.abs(imageData[i + 1] - targetData[i + 1]);
        blue = Math.abs(imageData[i + 2] - targetData[i + 2]);

        pixelError = red + green + blue;
        fitness += pixelError;
    }

    return fitness;
}

/**
 *  Mutate a shape.
 * @param {Array} testDna The population of shapes.
 * @param {Object} size The dimensions of the target image.
 * @param {number} numShapes Size of the population.
 * @param {string} shape The type of shape in use.
 * @returns {number} Array index of mutated shape object.
 */
function mutate(testDna, size, numShapes, shape) {
    // Randomly choose which shape from population, and which of their attributes, to mutate
    var index = random(numShapes-1);
    var roulette = Math.random() * 2.0;

    // Mutate a colour attribute, either R, G, B, or A
    if(roulette < 1) {
        if(roulette < 0.25) {
            testDna[index].colour.r = Math.round(computeNormal(testDna[index].colour.r, 255));
        }
        else if(roulette < 0.5) {
            testDna[index].colour.g = Math.round(computeNormal(testDna[index].colour.g, 255));
        }
        else if(roulette < 0.75) {
            testDna[index].colour.b = Math.round(computeNormal(testDna[index].colour.b, 255));
        }
        else {
            testDna[index].colour.a = computeNormal(testDna[index].colour.a, 1);
        }
    }
    // Mutate a coordinate/point attribute
    else {
        var pointsIndex;
        switch(shape) {
            case 'circle':
                if(roulette < 1.5) {
                    // Mutate x coordinate
                    testDna[index].points[0] = Math.round(computeNormal(testDna[index].points[0], size.width));
                }
                else {
                    // Mutate y coordinate
                    testDna[index].points[1] = Math.round(computeNormal(testDna[index].points[1], size.height));
                }
                break;

            case 'rectangle':
                pointsIndex = random(3);
                if(roulette < 1.5) {
                    if(pointsIndex == 0 || pointsIndex == 2) {
                        // Mutate x coordinate
                        testDna[index].points[pointsIndex] = Math.round(computeNormal(testDna[index].points[pointsIndex], size.width));
                    }
                }
                else {
                    if(pointsIndex == 1 || pointsIndex == 3) {
                        // Mutate y coordinate
                        testDna[index].points[pointsIndex] = Math.round(computeNormal(testDna[index].points[pointsIndex], size.height));
                    }
                }
                break;

            case 'square':
                if(roulette < 1.5) {
                    // Mutate x coordinate
                    testDna[index].points[0] = Math.round(computeNormal(testDna[index].points[0], size.width-testDna[index].points[2]/2));
                }
                else{
                    // Mutate y coordinate
                    testDna[index].points[1] = Math.round(computeNormal(testDna[index].points[1], size.height-testDna[index].points[2]/2));
                }
                break;

            case 'triangle':
                pointsIndex = random(2);
                if(roulette < 1.5) {
                    // Mutate x coordinate
                    testDna[index].points[pointsIndex].x = Math.round(computeNormal(testDna[index].points[pointsIndex].x, size.width));
                }
                else {
                    // Mutate y coordinate
                    testDna[index].points[pointsIndex].y = Math.round(computeNormal(testDna[index].points[pointsIndex].y, size.height));
                }
                break;

            default:
                break;
        }
    }
    return index;
}

module.exports = {
    random,
    initDna,
    passGeneMutation,
    computeNormal,
    drawCircle,
    drawRect,
    drawTri,
    drawDNA,
    fitness,
    mutate
}

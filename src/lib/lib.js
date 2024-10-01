// place files you want to import through the `$lib` alias in this folder.
export async function generateFractal(request) {
    const { fractalType, cReal, cImag, zoom, maxIterations, width, height } = await request.json();

    const buffer = new Uint8ClampedArray(width * height * 4);

    if (fractalType === 'julia') {
        generateJulia(buffer, cReal, cImag, zoom, maxIterations, width, height);
    } else if (fractalType === 'mandelbrot') {
        generateMandelbrot(buffer, zoom, maxIterations, width, height);
    }

    return buffer;
}
function generateJulia(buffer, cReal, cImag, zoom, maxIterations, width, height) {
    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
            let zReal = (x - width / 2) / (width / 4) / zoom;
            let zImag = (y - height / 2) / (height / 4) / zoom;

            let i;
            for (i = 0; i < maxIterations; i++) {
                let zRealTemp = zReal * zReal - zImag * zImag + cReal;
                zImag = 2 * zReal * zImag + cImag;
                zReal = zRealTemp;

                if (zReal * zReal + zImag * zImag > 4) break;
            }

            const [r, g, b] = hsvToRgb(i / maxIterations * 360, 1, i < maxIterations ? 1 : 0);
            const pixelIndex = (y * width + x) * 4;
            buffer[pixelIndex] = r;
            buffer[pixelIndex + 1] = g;
            buffer[pixelIndex + 2] = b;
            buffer[pixelIndex + 3] = 255;
        }
    }
}

function generateMandelbrot(buffer, zoom, maxIterations, width, height) {
    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
            let cReal = (x - width / 2) / (width / 4) / zoom;
            let cImag = (y - height / 2) / (height / 4) / zoom;
            let zReal = 0, zImag = 0;

            let i;
            for (i = 0; i < maxIterations; i++) {
                let zRealTemp = zReal * zReal - zImag * zImag + cReal;
                zImag = 2 * zReal * zImag + cImag;
                zReal = zRealTemp;

                if (zReal * zReal + zImag * zImag > 4) break;
            }

            const [r, g, b] = hsvToRgb(i / maxIterations * 360, 1, i < maxIterations ? 1 : 0);
            const pixelIndex = (y * width + x) * 4;
            buffer[pixelIndex] = r;
            buffer[pixelIndex + 1] = g;
            buffer[pixelIndex + 2] = b;
            buffer[pixelIndex + 3] = 255;
        }
    }
}

function hsvToRgb(h, s, v) {
    let r, g, b;
    let i = Math.floor(h / 60);
    let f = h / 60 - i;
    let p = v * (1 - s);
    let q = v * (1 - f * s);
    let t = v * (1 - (1 - f) * s);

    switch (i % 6) {
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}
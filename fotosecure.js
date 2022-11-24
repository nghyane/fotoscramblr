function reconstruct(cell_image_array) {
    if (!cell_image_array) {
        return false;
    }

    let cell_image = cell_image_array[0][0];

    let cell_w = 0;
    let cell_h = 0;

    cell_w = cell_image.width;
    cell_h = cell_image.height;

    //get reconstructed image dimensions
    let row_len = cell_image_array.length;
    let col_len = cell_image_array[0].length;

    let w = col_len * cell_w;
    let h = row_len * cell_h;

    if (cell_w > w || cell_h > h) {
        console.log("Error: cell image dimensions may not exceed image dimensions");

        return false;
    }

    let canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    let ctx = canvas.getContext("2d");

    for (let j = 0; j < row_len; j++) {
        for (let i = 0; i < col_len; i++) {
            ctx.putImageData(cell_image_array[j][i], i * cell_w, j * cell_h);
        }
    }

    return canvas;
}

function resize(img, newWidth, newHeight) {
    let canvas = document.createElement("canvas");
    canvas.width = newWidth;
    canvas.height = newHeight;
    let ctx = canvas.getContext("2d", { willReadFrequently: true });
    ctx.drawImage(img, 0, 0, newWidth, newHeight);

    return canvas;
}

function decompose(img, cell_w, cell_h) {
    let w = img.width;
    let h = img.height;

    if (cell_w > w || cell_h > h) {
        console.log("Error: cell image dimensions may not exceed image dimensions");

        return false;
    }

    new_img_w = w;
    new_img_h = h;

    //resize image to fit cells exactly
    if (w % cell_w !== 0) {
        new_img_w = cell_w - (w % cell_w) + w;
    }

    if (h % cell_h !== 0) {
        new_img_h = cell_h - (h % cell_h) + h;
    }

    canvas = resize(img, new_img_w, new_img_h);

    //grab new dimensions
    w = canvas.width;
    h = canvas.height;

    let cell_image_array = [];
    for (let j = 0; j < h; j += cell_h) {
        let row_array = [];
        for (let i = 0; i < w; i += cell_w) {

            let ctx = canvas.getContext("2d", { willReadFrequently: true });
            let cell_image = ctx.getImageData(i, j, cell_w, cell_h);

            row_array.push(cell_image);
        }

        cell_image_array.push(row_array);
    }

    return cell_image_array;
}


function decrypt(img, keys, factor) {
    let cell_image_array = decompose(img, Math.ceil(factor * img.width), Math.ceil(factor * img.height));
    let delim = [];

    for (let i = 1; i <= keys.length; i++) {
        delim[i] = Math.round(keys[(i - 1)] * cell_image_array.length);
        if (i % 2 == 0) {
            if (delim[i] % 2 != 0) {
                delim[i]++;
            }
        } else {
            if (delim[i] % 2 == 0) {
                delim[i]++;
            }
        }
    }

    for (let j = keys.length; j >= 1; j--) {
        for (let i = cell_image_array.length - 1; i >= delim[j]; i--) {
            if (i % 2 == 0) {
                let tmp = cell_image_array[i];
                cell_image_array[i] = cell_image_array[i - delim[j]];
                cell_image_array[i - delim[j]] = tmp;
            }
        }
    }

    //even index delimiters must be even and odd index delimiters must be odd
    for (i = 1; i <= keys.length; i++) {
        delim[i] = Math.round(keys[i - 1] * cell_image_array.length);
        if (i % 2 == 0) {
            if (delim[i] % 2 != 0) {
                delim[i]++;
            }
        } else {
            if (delim[i] % 2 == 0) {
                delim[i]++;
            }
        }
    }

    for (let k = keys.length; k > 0; k--) {
        for (let j = cell_image_array[0].length - 1; j >= delim[k]; j--) {
            if (j % 2 == 0) {
                for (let i = 0; i < cell_image_array.length; i++) {
                    let tmp = cell_image_array[i][j];
                    cell_image_array[i][j] = cell_image_array[i][j - delim[k]];
                    cell_image_array[i][j - delim[k]] = tmp;
                }
            }
        }
    }

    //reverse odd rows
    for (let i = 0; i < cell_image_array.length; i++) {
        if (i % 2 != 0) {
            cell_image_array[i] = cell_image_array[i].reverse();
        }

        cell_image_array[i] = cell_image_array[i].reverse();
    }


    cell_image_array.reverse();

    return reconstruct(cell_image_array);
}
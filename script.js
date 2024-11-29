function toFraction(decimal) {
    if (decimal === 0) return "0";
    const tolerance = 1.0E-6;
    let numerator = 1;
    let denominator = 1;
    let fraction = decimal;

    while (Math.abs(fraction - Math.round(fraction)) > tolerance) {
        denominator++;
        fraction = decimal * denominator;
    }
    
    numerator = Math.round(fraction);
    const gcdValue = gcd(numerator, denominator);
    
    return `${numerator / gcdValue}/${denominator / gcdValue}`;
}


function gcd(a, b) {
    return b === 0 ? a : gcd(b, a % b);
}


function generateMatrixInput() {
    const order = parseInt(document.getElementById("matrix-order").value);
    const container = document.getElementById("matrix-input-container");
    container.innerHTML = "";

    let table = "<table>";
    for (let i = 0; i < order; i++) {
        table += "<tr>";
        for (let j = 0; j < order; j++) {
            table += `<td><input type="number" id="a${i}${j}" step="any"></td>`;
        }
        table += "</tr>";
    }
    table += "</table>";
    container.innerHTML = table;
    document.getElementById("transformation-steps").innerHTML = "";
}

function logStep(matrix, message) {
    const stepsContainer = document.getElementById("transformation-steps");
    const order = matrix.length;
    let stepMessage = document.createElement("p");
    stepMessage.textContent = message;
    stepsContainer.appendChild(stepMessage);

    let table = document.createElement("table");
    for (let i = 0; i < order; i++) {
        let row = document.createElement("tr");
        for (let j = 0; j < order; j++) {
            let cell = document.createElement("td");
            cell.textContent = toFraction(matrix[i][j]);
            row.appendChild(cell);
        }
        table.appendChild(row);
    }
    stepsContainer.appendChild(table);
}


function transformToLowerTriangular() {
    const order = parseInt(document.getElementById("matrix-order").value);
    let matrix = [];
    for (let i = 0; i < order; i++) {
        matrix[i] = [];
        for (let j = 0; j < order; j++) {
            matrix[i][j] = parseFloat(document.getElementById(`a${i}${j}`).value) || 0;
        }
    }

    logStep(matrix, "Initial Matrix:");
    for (let i = 0; i < order; i++) {
        for (let j = 0; j < i; j++) {
            if (matrix[j][j] === 0) continue;
            let factor = matrix[i][j] / matrix[j][j];
            for (let k = 0; k < order; k++) {
                matrix[i][k] -= factor * matrix[j][k];
            }
            logStep(matrix, `Eliminate element in row ${i + 1}, column ${j + 1}`);
        }
    }
    logStep(matrix, "Lower Triangular Matrix:");
}

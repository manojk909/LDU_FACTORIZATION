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

function transformToUpperTriangular() {
    const order = parseInt(document.getElementById("matrix-order").value);
    let matrix = [];
    for (let i = 0; i < order; i++) {
        matrix[i] = [];
        for (let j = 0; j < order; j++) {
            matrix[i][j] = parseFloat(document.getElementById(`a${i}${j}`).value) || 0;
        }
    }

    logStep(matrix, "Upper Triangular Matrix:");
    for (let i = 0; i < order; i++) {
        for (let j = i + 1; j < order; j++) {
            if (matrix[i][i] === 0) continue;
            let factor = matrix[j][i] / matrix[i][i];
            for (let k = 0; k < order; k++) {
                matrix[j][k] -= factor * matrix[i][k];
            }
            logStep(matrix, `Eliminate element in row ${j + 1}, column ${i + 1}`);
        }
    }
    createDiagonalMatrix(matrix);
}


function createDiagonalMatrix(matrix) {
    const order = matrix.length;
    let diagonalMatrix = [];
    for (let i = 0; i < order; i++) {
        diagonalMatrix[i] = [];
        for (let j = 0; j < order; j++) {
            diagonalMatrix[i][j] = (i === j) ? matrix[i][j] : 0;
        }
    }
    logStep(diagonalMatrix, "Diagonal Matrix:");
}


function transformToUpperIdentity() {
    const size = parseInt(document.getElementById("matrix-order").value);
    let matrix = Array.from({ length: size }, (_, i) => 
        Array.from({ length: size }, (_, j) => parseFloat(document.getElementById(`a${i}${j}`).value) || 0)
    );

    for (let i = 0; i < size; i++) {
        if (matrix[i][i] !== 1) {
            const factor = matrix[i][i];
            for (let j = i; j < size; j++) {
                matrix[i][j] /= factor;
            }
            addStep(`R${i + 1} / ${toFraction(factor)}`, matrix);
        }
        for (let k = i + 1; k < size; k++) {
            const factor = matrix[k][i] / matrix[i][i];
            for (let j = i; j < size; j++) {
                matrix[k][j] -= factor * matrix[i][j];
            }
            addStep(`R${k + 1} - ${toFraction(factor)} * R${i + 1}`, matrix);
        }
    }
}


function addStep(description, matrix) {
    const stepsOutput = document.getElementById("transformation-steps");
    let stepDiv = document.createElement("div");
    stepDiv.innerHTML = `<h3>${description}</h3>${matrixToHTML(matrix)}`;
    stepsOutput.appendChild(stepDiv);
}

function matrixToHTML(matrix) {
    return `<div class="matrix">${matrix.map(row => `<div>${row.map(value => `<span>${toFraction(value)}</span>`).join(' ')}</div>`).join('')}</div>`;
}

let L = [];
let D = [];
let U = [];


function resetMatrices(order) {
    L = Array.from({ length: order }, () => Array(order).fill(0));
    D = Array.from({ length: order }, () => Array(order).fill(0));
    U = Array.from({ length: order }, () => Array(order).fill(0));
}

function computeLDU() {
    const order = parseInt(document.getElementById("matrix-order").value);
    let A = [];
    resetMatrices(order);


    for (let i = 0; i < order; i++) {
        A[i] = [];
        for (let j = 0; j < order; j++) {
            A[i][j] = parseFloat(document.getElementById(`a${i}${j}`).value) || 0;
        }
    }

    for (let i = 0; i < order; i++) {
        L[i][i] = 1;
    }


    for (let i = 0; i < order; i++) {

        for (let j = i; j < order; j++) {
            U[i][j] = A[i][j];
            for (let k = 0; k < i; k++) {
                U[i][j] -= L[i][k] * D[k][k] * U[k][j];
            }
        }

            D[i][i] = U[i][i];
        U[i][i] = 1;


        for (let j = i + 1; j < order; j++) {
            L[j][i] = A[j][i];
            for (let k = 0; k < i; k++) {
                L[j][i] -= L[j][k] * D[k][k] * U[k][i];
            }
            L[j][i] /= D[i][i];
        }
    }

    logStep(L, "Matrix L (Lower Triangular):");
    logStep(D, "Matrix D (Diagonal):");
    logStep(U, "Matrix U (Upper Triangular):");

    reconstructMatrix(A, L, D, U);
}

function reconstructMatrix(A, L, D, U) {
    const order = A.length;
    let reconstructed = Array.from({ length: order }, () => Array(order).fill(0));

    for (let i = 0; i < order; i++) {
        for (let j = 0; j < order; j++) {
            for (let k = 0; k < order; k++) {
                reconstructed[i][j] += L[i][k] * D[k][k] * U[k][j];
            }
        }
    }

    logStep(reconstructed, "Reconstructed Matrix A = L × D × U:");
}


function transformToUpperIdentity() {
    computeLDU();
}

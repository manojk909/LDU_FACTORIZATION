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

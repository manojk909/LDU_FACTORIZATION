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

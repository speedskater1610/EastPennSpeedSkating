async function getSkaters() {
    const response = await fetch('skaters.csv');
    const data = await response.text();

    // split the CSV into lines
    const lines = data.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim());

    // return a promise of the value
    return lines.slice(1).map(line => {
        const values = line.split(',').map(v => v.trim());

        // print and return
        let valuesAsObject = Object.fromEntries(headers.map((h, i) => [h, values[i]]));
        console.log(valuesAsObject);
        return valuesAsObject;
    });
}

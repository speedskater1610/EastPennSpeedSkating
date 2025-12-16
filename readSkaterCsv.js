async function getSkaters() {
    return fetch('skaters.csv') // make the promise
        .then(response => response.text())
        .then(data => {
            // split and map as a CSV 
            const lines = data.trim().split('\n');
            const headers = lines[0].split(',').map(h => h.trim());

            const skaters = lines.slice(1).map(line => {
                const values = line.split(',').map(v => v.trim());
                const skater = {};
                headers.forEach((header, index) => {
                    skater[header] = values[index];
                });
                return skater;
            });

            console.log(skaters);
            return skaters; // resolves the promise
        })
        .catch(err => console.error(err));
}

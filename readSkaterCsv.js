function getSkaters() {
    fetch('skaters.csv')
        .then(response => response.text())
        .then(data => {
            // split the CSV into lines
            const lines = data.trim().split('\n');
            
            // extract headers
            const headers = lines[0].split(',').map(h => h.trim());
            
            // convert each line to an object
            const skaters = lines.slice(1).map(line => {
                const values = line.split(',').map(v => v.trim());
                const skater = {};
                headers.forEach((header, index) => {
                    skater[header] = values[index];
                });
                return skater;
            });

            console.log(skaters); // array of skater objects
            return skaters;
        })
        .catch(err => console.error(err));
}

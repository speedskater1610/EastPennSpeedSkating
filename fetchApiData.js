function fetchApi(skater, distance, season) {
    fetch(`https://speedskatingresults.com/api/xml/skater_results.php?skater=${skater}&distance=${distance}&season=${season}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
        })
        .catch(error => {
            console.error("Reading API Error:", error);
        }
}

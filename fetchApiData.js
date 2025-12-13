/**
* the `fetchApi()` funtion returns the 
*/
function fetchApi(skater, distance, season) {
    const url = `https://speedskatingresults.com/api/xml/skater_results.php?skater=${skater}&distance=${distance}&season=${season}`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text(); 
        })
        .then(xmlText => {
            const parser = new DOMParser();
            const xml = parser.parseFromString(xmlText, "application/xml");

            const results = xml.querySelectorAll("result");

            const output = document.getElementById("output");
            output.innerHTML = "";

            results.forEach(result => {
                const time = result.querySelector("time")?.textContent;
                const date = result.querySelector("date")?.textContent;
                const location = result.querySelector("location")?.textContent;

                const div = document.createElement("div");
                div.textContent = `${date} — ${time} @ ${location}`;
                output.appendChild(div);
            });
        })
        .catch(error => {
            console.error("Reading API Error:", error);
        });
}

/**
* the `fetchApi()` funtion returns the 
*/
function fetchApi(skater, distance, season) {
    const apiUrl =
        `https://speedskatingresults.com/api/xml/skater_results.php` +
        `?skater=${skater}&distance=${distance}&season=${season}`; // skater info

    const corsProxy =
        `https://api.allorigins.win/raw?url=${encodeURIComponent(apiUrl)}`;

    fetch(corsProxy)
        .then(res => res.text())
        .then(xmlText => {
            const parser = new DOMParser();
            const xml = parser.parseFromString(xmlText, "application/xml");

            const output = document.getElementById("output");
            output.innerHTML = "";

            xml.querySelectorAll("result").forEach(r => {
                const time = r.querySelector("time")?.textContent;
                const date = r.querySelector("date")?.textContent;
                const location = r.querySelector("location")?.textContent;

                output.innerHTML += `<div>${date} — ${time} @ ${location}</div>`;
            });
        })
        .catch(err => console.error(err));
}


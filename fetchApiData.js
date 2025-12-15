/**
* the `fetchApi()` funtion returns the 
*/
class ApiReturn {
    constructor({ time, date, location, skater, distance, season }) {
        this.time = time;
        this.date = date;
        this.location = location;
        this.skater = skater;
        this.distance = distance;
        this.season = season;
    }
}

function fetchApi(skater, distance, season, outputName) {
    const apiUrl =
        `https://speedskatingresults.com/api/xml/skater_results.php` +
        `?skater=${skater}&distance=${distance}&season=${season}`;

    const corsProxy =
        `https://api.allorigins.win/raw?url=${encodeURIComponent(apiUrl)}`;

    const output = document.getElementById(outputName);
    output.textContent = "Loading…";

    fetch(corsProxy)
        .then(res => res.text())
        .then(xmlText => {
            const parser = new DOMParser();
            const xml = parser.parseFromString(xmlText, "application/xml");

            if (xml.querySelector("parsererror")) {
                throw new Error("Failed to parse XML");
            }

            output.innerHTML = "";

            xml.querySelectorAll("result").forEach(r => {
                const time = r.querySelector("time")?.textContent ?? "—";
                const date = r.querySelector("date")?.textContent ?? "—";
                const location = r.querySelector("location")?.textContent ?? "—";

                const div = document.createElement("div");
                div.textContent = `${date} — ${time} @ ${location}`;
                output.appendChild(div);
            });
        })
        .catch(err => {
            console.error(err);
            output.textContent = "Failed to load results.";
        });
}

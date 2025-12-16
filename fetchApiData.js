class ApiReturn {
    constructor({ time, date, location, skater, distance, season, outputName }) {
        Object.assign(this, { time, date, location, skater, distance, season, outputName });
    }
}

async function fetchApi(skater, distance, season, outputName) {
    const apiUrl = `https://speedskatingresults.com/api/xml/skater_results.php?skater=${skater}&distance=${distance}&season=${season}`;
    const corsProxy = `https://api.allorigins.win/raw?url=${encodeURIComponent(apiUrl)}`;
    const output = document.getElementById(outputName);

    output.textContent = "Loading…";

    try {
        const res = await fetch(corsProxy);
        const xmlText = await res.text();
        const parser = new DOMParser();
        const xml = parser.parseFromString(xmlText, "application/xml");

        if (xml.querySelector("parsererror")) {
            throw new Error("Failed to parse XML");
        }

        output.innerHTML = "";

        const results = [];

        xml.querySelectorAll("result").forEach(r => {
            const resultData = {
                time: r.querySelector("time")?.textContent ?? "—",
                date: r.querySelector("date")?.textContent ?? "—",
                location: r.querySelector("location")?.textContent ?? "—",
                skater,
                distance,
                season, 
                outputName
            };
            
            // Display in page
            const div = document.createElement("div");
            div.textContent = `${resultData.date} — ${resultData.time} @ ${resultData.location}`;
            output.appendChild(div);

            // Store result
            results.push(new ApiReturn(resultData));
        });

        return results; // Return array of ApiReturn objects
    } catch (err) {
        console.error(err);
        output.textContent = "Failed to load results.";
        return [];
    }
}

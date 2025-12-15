let allSkaters = []; // load from CSV
let allResults = []; // store all results fetched

// populate clubs after loading CSV
function populateClubDropdown(skaters) {
    const clubs = [...new Set(skaters.map(s => s.Club))].sort();
    const clubSelect = document.getElementById("clubSelect");
    clubs.forEach(club => {
        const opt = document.createElement("option");
        opt.value = club;
        opt.textContent = club;
        clubSelect.appendChild(opt);
    });
}

// load skaters CSV and populate dropdowns
getSkaters().then(skaters => {
    allSkaters = skaters;
    populateClubDropdown(skaters);
});

// helper to fetch results for a skater for all distances
async function fetchAllDistances(skaterId) {
    const distances = [500, 1000, 1500, 3000];
    const results = [];
    for (const dist of distances) {
        const r = await fetchApi(skaterId, dist, 2025, "output");
        if (r.length > 0) results.push(...r);
    }
    return results;
}

// compute best times for each skater
async function buildLeaderboard() {
    allResults = [];
    for (const skater of allSkaters) {
        const skaterId = skater.ID;
        const results = await fetchAllDistances(skaterId);
        allResults.push({ skater, results });
    }
}

// filter and display leaderboard
function displayLeaderboard() {
    const club = document.getElementById("clubSelect").value;
    const gender = document.getElementById("genderSelect").value;
    const distance = document.getElementById("distanceSelect").value;
    const output = document.getElementById("leaderBoardOutput");
    output.innerHTML = "";

    const filtered = allResults.map(sr => {
        // filter by club/gender
        if ((club !== "all" && sr.skater.Club !== club) || 
            (gender !== "all" && sr.skater.Gender !== gender)) return null;

        // pick results based on distance
        let timeSum = 0;
        if (distance === "all") {
            // sum best times (all-round)
            const bestTimes = {};
            sr.results.forEach(r => {
                const dist = r.distance;
                const t = parseFloat(r.time) || Infinity;
                if (!bestTimes[dist] || t < bestTimes[dist]) bestTimes[dist] = t;
            });
            timeSum = Object.values(bestTimes).reduce((a,b) => a+b, 0);
        } else {
            // single distance best time
            const times = sr.results
                .filter(r => r.distance == distance)
                .map(r => parseFloat(r.time) || Infinity);
            timeSum = times.length ? Math.min(...times) : Infinity;
        }

        return { skater: sr.skater, time: timeSum };
    }).filter(Boolean);

    filtered.sort((a,b) => a.time - b.time);

    filtered.forEach((f, i) => {
        const div = document.createElement("div");
        div.textContent = `${i+1}. ${f.skater.Name} (${f.skater.Club}) — ${f.time === Infinity ? '—' : f.time.toFixed(2)}s`;
        output.appendChild(div);
    });
}

// event listener
document.getElementById("searchLeaderboard").addEventListener("click", () => {
    displayLeaderboard();
});

// load results for everyone on page load
buildLeaderboard();

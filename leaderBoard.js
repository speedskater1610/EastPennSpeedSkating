async function loadLeaders() {
    const skaters = await getSkaters();
    
    const genderSelect = document.getElementById("gender").value;
    const clubSelect = document.getElementById("club").value;
    let leaderBoard = document.getElementById("leaderBoard");

    const distance = document.getElementById("distance").value;
    const currentYear = new Date().getFullYear();

    let skatersFiltered = removeGender(genderSelect, skaters);
    skatersFiltered = removeClubs(clubSelect, skatersFiltered);

    let apiData = new Array();
    for (const skater of skatersFiltered) {
        const results = await fetchApi(skater.ID, distance, currentYear, skater.Name);
        apiData = apiData.concat(results); // merge arrays
    }

    // sort by fastest time (smallest to largest)
    apiData.sort((a, b) => {
        const parseTime = t => {
                if (!t || t === "—") 
                    return Infinity;
                if (t.includes(":")) {
                    const [min, sec] = t.split(":").map(Number);
                    return min*60 + sec;
                }
            return parseFloat(t);
        };

        return parseTime(a.time) - parseTime(b.time);
    });

    console.log(apiData);

    // put the times on leaderBoard id
    leaderBoard.innerHTML = `
<table border="1">
  <thead>
    <tr>
      <th>Skater Name</th>
      <th>Time</th>
    </tr>
  </thead>
  <tbody>
    ${apiData.slice(0, 5).map(s => `
      <tr>
        <td>${s.outputName}</td>
        <td>${s.time}</td>
      </tr>
    `).join('')}
  </tbody>
</table>
`;
}

function removeGender(gender, objects) {
    if (!Array.isArray(objects)) {
        console.error("removeGender() expected array, got: ", objects);
        return [];
    }
    return objects.filter(s => s.Gender === gender);
}

function removeClubs(club, objects) {
    if (!club) return objects;
    return objects.filter(s => s.Club === club);
}

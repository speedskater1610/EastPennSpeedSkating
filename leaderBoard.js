
You said:
document.addEventListener("DOMContentLoaded", function() {
    async function loadLeaders() {
        const skaters = getSkaters();
    
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
                if (!t || t === "—") return Infinity;
                const parts = t.split(":").map(Number); // e.g., "1:44.788"
                return parts.length === 2 ? parts[0]*60 + parts[1] : parts[0]; 
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
});

function removeGender(gender, objects) {
    return objects.filter(s => s.Gender == gender);
}
function removeClubs(club, objects) {
    return objects.filter(s => s.Club == club)
}

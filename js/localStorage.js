let playerStats = {
    deaths: {
        obstacles: 0,
        fall: 0
    },
    wins: 0,
    totalHeights: 0,
    totalElevations: 0,
    obstaclesDestroyed: 0,
    rectsCollected: 0,
    rectsSpended: 0,
    damageTaken: 0,
    healsTaken: 0,
    playTime: 0,
    shortestTimeToWin: 0,
    totalJumps: 0,
    highestElevation: 0,
    randomFacts: {
        keys: {
            space: 0,
            w: 0,
            a: 0,
            s: 0,
            d: 0,
            q: 0,
            e: 0,
            f: 0,
            ArrowUp: 0,
            ArrowDown: 0,
            ArrowLeft: 0,
            ArrowRight: 0,
            ForwardSlash: 0,
            apostrophe: 0,
            enter: 0,
            semicolon: 0,
            otherKeys: 0,
            totalKeys: 0
        }
    }
}

if (localStorage) {
    const data = localStorage.getItem('playerStats');
    if (data) {
        playerStats = JSON.parse(data);
    }
    else {
        console.error('No data found');
    }
}
else {
    console.error(`Your Browser doesn't support localStorage`);
}

function saveStats() {
    if (localStorage) {
        localStorage.setItem('playerStats', JSON.stringify(playerStats));
    }
}

function game_result(match_status, winner_id = 555, win_percenter = 100)
{
    console.log("Match status: " + match_status);
    console.log("Winner ID: " + winner_id);
    console.log("Win percenter: " + win_percenter);
    var Resultdata = {
        'match_status':match_status,
        'winner_id':winner_id,
        'win_percenter':win_percenter
    };

    top.postMessage(JSON.stringify(Resultdata), 'http://gamesclash.in');
};
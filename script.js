const options = {
  method: "GET",
  headers: {
    "X-RapidAPI-Key": "79bef5239bmsh32b01545de78234p1d8f3fjsn4ee8157b710f",
    "X-RapidAPI-Host": "cricbuzz-cricket.p.rapidapi.com",
  },
};

errorFun = () => {
  alert("Oops! Something Went Wrong!!");
};

funForStats = () => {
  let id, imageid;
  let temp0 = document.getElementById("temp0");

  let temp2 = document.getElementById("temp2");

  let el = document.getElementsByClassName("homeButton");

  let form = document.getElementById("click_for_search");

  el[0].addEventListener("click", () => {
    temp0.style["display"] = "grid";
    temp2.style["display"] = "none";
  });

  putStatsInPage = async (dat) => {
    temp0.style["display"] = "none";
    temp2.style["display"] = "grid";
    let pAN = document.getElementsByClassName("photoAndName")[0].children;
    await fetch(
      `https://cricbuzz-cricket.p.rapidapi.com/img/v1/i1/${imageid}/i.jpg?p=gthumb&d=high`,
      options
    )
      .then((response) => response.blob())
      .then((img) => pAN[0].setAttribute("src", URL.createObjectURL(img)))
      .catch((err) => console.error(err));
    // pAN[0].setAttribute(
    //   "src",
    //   `https://cricbuzz-cricket.p.rapidapi.com/img/v1/i1/c170640/i.jpg?p=de&d=high`
    // );
    pAN[1].innerHTML = dat.name;
    let about = document.getElementById("aboutPlayer");
    let aTable = about.getElementsByClassName("table");
    let aRow = aTable[0].getElementsByClassName("row");
    // console.log(dat);
    let arrForAbout = [
      dat.name,
      dat.DoB,
      dat.teams,
      dat.bat,
      dat.bowl,
      dat.birthPlace,
    ];
    for (i = 0; i < aRow.length; i++) {
      let temp = aRow[i].getElementsByClassName("column");
      temp[1].innerHTML = arrForAbout[i];
    }
    let bat = document.getElementById("battingStats");
    let bTable = bat.getElementsByClassName("table");
    let bRow = bTable[0].getElementsByClassName("row");
    let bowl = document.getElementById("bowlingStats");
    let bTable2 = bowl.getElementsByClassName("table");
    let bRow2 = bTable2[0].getElementsByClassName("row");

    await fetch(
      `https://cricbuzz-cricket.p.rapidapi.com/stats/v1/player/${id}/batting`,
      options
    )
      .then((response) => response.json())
      .then((data) => {
        for (let i = 1; i < 14; ++i) {
          for (let j = 1; j < 5; ++j) {
            // let temp1 = document.createElement("div");
            let temp2 = data.values[i - 1].values[j];
            // let temp3 = document.createTextNode(temp2);
            // temp1.appendChild(temp3);
            bRow[i].children[j].innerHTML = temp2;
            bRow[i].children[j].setAttribute("class", "column_stats");
          }
        }
      })
      .catch((err) => console.error(err));

    await fetch(
      `https://cricbuzz-cricket.p.rapidapi.com/stats/v1/player/${id}/bowling`,
      options
    )
      .then((response) => response.json())
      .then((data) => {
        for (let i = 1; i < 15; ++i) {
          for (let j = 1; j < 5; ++j) {
            // let temp1 = document.createElement("div");
            let temp2 = data.values[i - 1].values[j];
            // let temp3 = document.createTextNode(temp2);
            // temp1.appendChild(temp3);
            bRow2[i].children[j].innerHTML = temp2;
            bRow2[i].children[j].setAttribute("class", "column_stats");
          }
        }
      })
      .catch((err) => console.error(err));
    let profile = document.getElementsByClassName("profile");
    profile[0].innerHTML = dat.bio;
  };

  playerStatsAPI = async (pid) => {
    let response = await fetch(
      `https://cricbuzz-cricket.p.rapidapi.com/stats/v1/player/${pid}`,
      options
    );
    let dat = response.json();
    return dat;
  };

  playerNameAPI = async (nameOfPlayer) => {
    let res = await fetch(
      `https://cricbuzz-cricket.p.rapidapi.com/stats/v1/player/search?plrN=${nameOfPlayer}`,
      options
    );
    let dat = res.json();
    return dat;
  };

  // playerNameAPI function will call the API
  // of playerfinder in cricapi

  // p.then(value){
  //     console.log(value);
  // }

  // checkStats is the function for getting the value from
  // tetxbox and then using to search for the player name
  checkStats = async () => {
    let textB = document.getElementById("text_for_stats");
    let nameOfPlayer = textB.value;
    // calling player name api to get pid
    playerNameAPI(nameOfPlayer)
      .then(async (pr) => {
        let res = await playerStatsAPI(pr.player[0].id);
        // console.log(res);
        id = pr.player[0].id;
        imageid = `c${pr.player[0].faceImageId}`;
        return res;
      })
      .then((res) => {
        putStatsInPage(res);
      })
      .catch(() => {
        alert(`oops something went wrong,try checking name of player!!`);
      });
  };

  // stats is the function for calling a function checkStats
  // whenever search button is clicked
  form.addEventListener("click", checkStats);
};

//                      Score

funForScore = async () => {
  //   let i;
  //   let ref = [1];
  putLiveScore = (data, dom) => {
    let temp1 = document.createElement(`div`);
    temp1.setAttribute(`class`, `scorecard`);

    let t1 = document.createElement(`div`);
    let t2 = document.createElement(`div`);

    let team1 = data.team1;
    let team2 = data.team2;
    let scoreOfTeam1 = data.scoreOfTeam1;
    let scoreOfTeam2 = data.scoreOfTeam2;
    let wicketOfTeam1 = data.wicketOfTeam1;
    let wicketOfTeam2 = data.wicketOfTeam2;

    let x = document.createTextNode(
      `${team1} : ${scoreOfTeam1}/${wicketOfTeam1}`
    );
    let y = document.createTextNode(
      `${team2} : ${scoreOfTeam2}/${wicketOfTeam2}`
    );
    t1.appendChild(x);
    t2.appendChild(y);
    t1.setAttribute(`class`, `team`);
    t2.setAttribute(`class`, `team`);
    let z = document.createElement(`button`);
    z.innerHTML = `Refresh`;
    z.setAttribute(`class`, `refresh`);
    temp1.appendChild(t1);
    temp1.appendChild(t2);
    temp1.appendChild(z);
    dom.appendChild(temp1);
  };

  let dom = document.getElementsByClassName(`matches`);

  //   doRefresh = async (ind) => {
  //     let x = await fetch(
  //       `https://cricapi.com/api/cricketScore?apikey=a8yv2hxwSzLfOqlf29MV2QNfxu43&unique_id=${ref[ind]}`
  //     );
  //     let dat = await x.json();
  //     let temp = dom[0].children[ind];
  //     let temp1 = temp.getElementsByClassName(`team`);
  //     let temp2 = dat.score;
  //     let temp3 = dat[`team-1`];
  //     let temp4 = dat[`team-2`];
  //     let score1 = ``;
  //     let score2 = ``;
  //     let i1 = temp2.indexOf(temp3) + temp3.length;
  //     let i2 = temp2.indexOf(temp4) + temp4.length;
  //     // console.log(temp2,temp3,temp4,i1,i2);
  //     i1++;
  //     while (i1 < temp2.length && temp2[i1] != ` ` && temp2[i1] != `v`) {
  //       score1 = score1 + temp2[i1];
  //       i1++;
  //     }
  //     i2++;
  //     while (i2 < temp2.length && temp2[i2] != ` `) {
  //       score2 = score2 + temp2[i2];
  //       i2++;
  //     }
  //     temp1[0].innerHTML = `${temp3.slice(0, 3)} : ${score1}`;
  //     temp1[1].innerHTML = `${temp4.slice(0, 3)} : ${score2}`;
  //   };
  let count = 0;
  await fetch(
    "https://cricbuzz-cricket.p.rapidapi.com/matches/v1/live",
    options
  )
    .then(async (response) => await response.json())
    .then((data) => {
      //   let data = dat.data;
      console.log(data);
      data.typeMatches.forEach((typeOfMatch) => {
        typeOfMatch.seriesMatches.forEach((series) => {
          if (series.seriesAdWrapper) {
            series.seriesAdWrapper.matches.forEach((match) => {
              if (
                match.matchInfo &&
                match.matchScore &&
                match.matchInfo.team1 &&
                match.matchInfo.team2 &&
                match.matchInfo.team1.teamSName &&
                match.matchInfo.team2.teamSName &&
                match.matchScore.team1Score &&
                match.matchScore.team2Score &&
                match.matchScore.team1Score.inngs1 &&
                match.matchScore.team2Score.inngs1 &&
                match.matchScore.team1Score.inngs1.runs &&
                match.matchScore.team2Score.inngs1.runs &&
                match.matchScore.team1Score.inngs1.wickets &&
                match.matchScore.team2Score.inngs1.wickets
              ) {
                let team1 = match.matchInfo.team1.teamSName;
                let team2 = match.matchInfo.team2.teamSName;
                let scoreOfTeam1 = match.matchScore.team1Score.inngs1.runs;
                let scoreOfTeam2 = match.matchScore.team2Score.inngs1.runs;
                let wicketOfTeam1 = match.matchScore.team1Score.inngs1.wickets;
                let wicketOfTeam2 = match.matchScore.team2Score.inngs1.wickets;
                let sendData = {
                  team1,
                  team2,
                  scoreOfTeam1,
                  scoreOfTeam2,
                  wicketOfTeam1,
                  wicketOfTeam2,
                };
                // console.log(sendData);
                count++;
                putLiveScore(sendData, dom[0]);
              }
            });
          }
        });
      });
    })
    .catch((err) => console.error(err));

  await fetch(
    "https://cricbuzz-cricket.p.rapidapi.com/matches/v1/recent",
    options
  )
    .then(async (response) => await response.json())
    .then((data) => {
      //   let data = dat.data;
      console.log(data);
      data.typeMatches.forEach((typeOfMatch) => {
        typeOfMatch.seriesMatches.forEach((series) => {
          if (series.seriesAdWrapper) {
            series.seriesAdWrapper.matches.forEach((match) => {
              if (
                match.matchInfo &&
                match.matchScore &&
                match.matchInfo.team1 &&
                match.matchInfo.team2 &&
                match.matchInfo.team1.teamSName &&
                match.matchInfo.team2.teamSName &&
                match.matchScore.team1Score &&
                match.matchScore.team2Score &&
                match.matchScore.team1Score.inngs1 &&
                match.matchScore.team2Score.inngs1 &&
                match.matchScore.team1Score.inngs1.runs &&
                match.matchScore.team2Score.inngs1.runs &&
                match.matchScore.team1Score.inngs1.wickets &&
                match.matchScore.team2Score.inngs1.wickets &&
                count < 25
              ) {
                let team1 = match.matchInfo.team1.teamSName;
                let team2 = match.matchInfo.team2.teamSName;
                let scoreOfTeam1 = match.matchScore.team1Score.inngs1.runs;
                let scoreOfTeam2 = match.matchScore.team2Score.inngs1.runs;
                let wicketOfTeam1 = match.matchScore.team1Score.inngs1.wickets;
                let wicketOfTeam2 = match.matchScore.team2Score.inngs1.wickets;
                let sendData = {
                  team1,
                  team2,
                  scoreOfTeam1,
                  scoreOfTeam2,
                  wicketOfTeam1,
                  wicketOfTeam2,
                };
                count++;
                putLiveScore(sendData, dom[0]);
              }
            });
          }
        });
      });
    })
    // .then(() => {
    //   let checkOutStats = document.getElementById("temp0");
    //   let d1 = document.createElement("div");
    //   d1.innerHTML =
    //     '<div class="stats_entries"><div class="head">CHECK OUT STATS!</div><div class="stats_area"><input type="text" id="text_for_stats" placeholder="type the name of player here e.g. virat kohli"/><input type="submit" id="click_for_search" class="button" value="SEARCH"/></div></div>';
    //   checkOutStats.appendChild(d1);
    // })
    .catch((err) => console.error(err));

  //   await fetch(
  //     "https://cricapi.com/api/cricket?apikey=a8yv2hxwSzLfOqlf29MV2QNfxu43"
  //   ).then(async (live) => {
  //     let dat = await live.json();
  //     let data = dat.data;
  //     if (data.length == 0) {
  //       let temp1 = document.createTextNode(`Nothing To Show Here!!`);
  //       let temp2 = document.createElement(`div`);
  //       temp2.appendChild(temp1);
  //       temp2.setAttribute(`class`, `Nothing`);
  //       dom[0].appendChild(temp2);
  //     }
  //     for (i = 0; i < data.length; i++) {
  //       if (i != 0) ref.push(data[i].unique_id);
  //       else ref[0] = data[i].unique_id;
  //       await fetch(
  //         `https://cricapi.com/api/cricketScore?apikey=a8yv2hxwSzLfOqlf29MV2QNfxu43&unique_id=${data[i].unique_id}`
  //       ).then(async (pr) => {
  //         let dat2 = await pr.json();
  //         if (i < data.length - 1) putLiveScore(dat2, dom[0], true);
  //         else putLiveScore(dat2, dom[0], false);
  //       });
  //     }
  //   });

  //   let temp = document.getElementsByClassName(`refresh`);
  //   for (i = 0; i < temp.length; i++) {
  //     if (i < temp.length - 1) {
  //       temp[i].addEventListener("click", doRefresh(i));
  //     } else {
  //       temp[i].addEventListener("click", doRefresh(i));
  //     }
  //   }
};
// calling function when DOM get loaded
// stats();
window.addEventListener("load", funForStats);
window.addEventListener("load", funForScore);
// window.addEventListener("load",goingBackToHome);

errorFun = () => {
    alert('Oops! Something Went Wrong!!');
}

funForStats = () => {

    let temp0 = document.getElementById('temp0');

    let temp2 = document.getElementById('temp2');

    let el = document.getElementsByClassName('homeButton');

    let form = document.getElementById('click_for_search');

    el[0].addEventListener("click", () => {
        temp0.style['display'] = 'grid';
        temp2.style['display'] = 'none';
    });

    putStatsInPage = (dat) => {
        let pAN = document.getElementsByClassName('photoAndName')[0].children;
        let i, j, k;
        pAN[0].setAttribute('src', dat.imageURL);
        pAN[1].innerHTML = dat.name;
        let about = document.getElementById('aboutPlayer');
        let aTable = about.getElementsByClassName('table');
        let aRow = aTable[0].getElementsByClassName('row');
        let arrForAbout = [dat.fullName,
        dat.born,
        dat.currentAge,
        dat.majorTeams,
        dat.battingStyle,
        dat.bowlingStyle,
        dat.country
        ];
        for (i = 0; i < aRow.length; i++) {
            let temp = aRow[i].getElementsByClassName('column');
            temp[1].innerHTML = arrForAbout[i];
        }
        let bat = document.getElementById('battingStats');
        let bTable = bat.getElementsByClassName('table');
        let bRow = bTable[0].getElementsByClassName('row');
        let batAPI = dat.data.batting;
        let bowl = document.getElementById('bowlingStats');
        let bTable2 = bowl.getElementsByClassName('table');
        let bRow2 = bTable2[0].getElementsByClassName('row');
        let bowlAPI = dat.data.bowling;
        let arrForData = ['Mat',
            'Inns',
            'Runs',
            'Ave',
            'SR',
            '50',
            '100',
            'HS',
            'NO',
            'BF',
            '6s',
            '4s'
        ];
        let arrForData2 = ['Mat',
            'Inns',
            'Wkts',
            'Balls',
            'Runs',
            'Econ',
            'Ave',
            'SR',
            'BBI',
            'BBM',
            '5w',
            '10'
        ];
        let arrForFormat = ['tests',
            'ODIs',
            'T20Is',
            'listA',
            'firstClass'
        ];
        for (i = 1; i < 13; i++) {
            for (j = 0; j < 5; j++) {
                let temp1 = document.createElement('div');
                let temp2 = batAPI[arrForFormat[j]][arrForData[i - 1]];
                if (temp2 == "") {
                    temp2 = '-';
                }
                let temp3 = document.createTextNode(temp2);
                temp1.appendChild(temp3);
                bRow[i].appendChild(temp1);
                bRow[i].children[j + 1].setAttribute('class', 'column_stats');
                temp1 = document.createElement('div');
                temp2 = bowlAPI[arrForFormat[j]][arrForData2[i - 1]];
                if (temp2 == "") {
                    temp2 = '-';
                }
                temp3 = document.createTextNode(temp2);
                temp1.appendChild(temp3);
                bRow2[i].appendChild(temp1);
                bRow2[i].children[j + 1].setAttribute('class', 'column_stats');
            }
        }
        let profile = document.getElementsByClassName('profile');
        profile[0].innerHTML = dat.profile;
        temp0.style['display'] = 'none';
        temp2.style['display'] = 'grid';
    }

    playerStatsAPI = async (pid) => {
        let response = await fetch(
            `https://cricapi.com/api/playerStats?apikey=a8yv2hxwSzLfOqlf29MV2QNfxu43&pid=${pid}`
        );
        let dat = response.json();
        return dat;
    }

    playerNameAPI = async (nameOfPlayer) => {
        let res = await fetch(
            `https://cricapi.com/api/playerFinder?name=${nameOfPlayer}&apikey=a8yv2hxwSzLfOqlf29MV2QNfxu43`
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
        let textB = document.getElementById('text_for_stats');
        let nameOfPlayer = textB.value;
        // calling player name api to get pid
        let pr = playerNameAPI(nameOfPlayer)
            .then(async (pr) => {
                let res = await playerStatsAPI(pr.data[0].pid);
                return res;
            })
            .then(async (res) => {
                putStatsInPage(res);
            })
            .catch(() => {
                alert(`oops something went wrong,try checking name of player!!`)
            })
    }

    // stats is the function for calling a function checkStats
    // whenever search button is clicked
    form.addEventListener("click", checkStats);
}

//                      Score


funForScore = async () => {
    let i;
    let ref=[1];
    putLiveScore = (data, dom, b) => {
        let temp1 = document.createElement(`div`);
        temp1.setAttribute(`class`, `scorecard`);
        if (b == false)
            temp1.setAttribute(`class`, `scorecard last`);
        let t1 = document.createElement(`div`);
        let t2 = document.createElement(`div`);
        let temp2 = data.score;
        let temp3 = data[`team-1`];
        let temp4 = data[`team-2`];
        let score1 = ``;
        let score2 = ``;
        let i1 = temp2.indexOf(temp3) + temp3.length;
        let i2 = temp2.indexOf(temp4) + temp4.length;
        // console.log(temp2,temp3,temp4,i1,i2);
        i1++;
        while (i1<temp2.length && temp2[i1] != ` ` && temp2[i1]!='v') {
            score1 = score1 + temp2[i1];
            i1++;
        }
        i2++;
        while (i2<temp2.length && temp2[i2] != ` `) {
            score2 = score2 + temp2[i2];
            i2++;
        }
        if(score1==`v`)
        score1=` `;
        let x = document.createTextNode(`${temp3.slice(0, 3)} : ${score1}`);
        let y = document.createTextNode(`${temp4.slice(0, 3)} : ${score2}`);
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
    }

    let dom = document.getElementsByClassName(`matches`);

    doRefresh = async(ind) =>{
        let x=await fetch(
            `https://cricapi.com/api/cricketScore?apikey=a8yv2hxwSzLfOqlf29MV2QNfxu43&unique_id=${ref[ind]}`
        )
        let dat = await x.json();
        let temp = dom[0].children[ind];
        let temp1 = temp.getElementsByClassName(`team`);
        let temp2 = dat.score;
        let temp3 = dat[`team-1`];
        let temp4 = dat[`team-2`];
        let score1 = ``;
        let score2 = ``;
        let i1 = temp2.indexOf(temp3) + temp3.length;
        let i2 = temp2.indexOf(temp4) + temp4.length;
        // console.log(temp2,temp3,temp4,i1,i2);
        i1++;
        while (i1<temp2.length && temp2[i1] != ` ` && temp2[i1]!=`v`) {
            score1 = score1 + temp2[i1];
            i1++;
        }
        i2++;
        while (i2<temp2.length && temp2[i2] != ` `) {
            score2 = score2 + temp2[i2];
            i2++;
        }
        temp1[0].innerHTML=`${temp3.slice(0, 3)} : ${score1}`;
        temp1[1].innerHTML=`${temp4.slice(0, 3)} : ${score2}`;
    }
    
    await fetch(
        'https://cricapi.com/api/cricket?apikey=a8yv2hxwSzLfOqlf29MV2QNfxu43'
    )
        .then(async (live) => {
            let dat = await live.json();
            let data = dat.data;
            if (data.length == 0) {
                let temp1 = document.createTextNode(`Nothing To Show Here!!`);
                let temp2 = document.createElement(`div`);
                temp2.appendChild(temp1);
                temp2.setAttribute(`class`, `Nothing`);
                dom[0].appendChild(temp2);
            }
            for (i = 0; i < data.length; i++) {
                if (i != 0)
                    ref.push(data[i].unique_id);
                else
                    ref[0]=data[i].unique_id;
                await fetch(
                    `https://cricapi.com/api/cricketScore?apikey=a8yv2hxwSzLfOqlf29MV2QNfxu43&unique_id=${data[i].unique_id}`
                )
                    .then(async (pr) => {
                        let dat2 = await pr.json();
                        if (i < (data.length - 1))
                            putLiveScore(dat2, dom[0], true);
                        else
                            putLiveScore(dat2, dom[0], false);
                    })
            }
        })
        
    let temp = document.getElementsByClassName(`refresh`);
    for (i = 0; i < temp.length; i++) {
        if (i < temp.length - 1) {
            temp[i].addEventListener("click", doRefresh(i));
        }
        else {
            temp[i].addEventListener("click", doRefresh(i));
        }
    }
        
    
    // .catch(()=>{
    //     errorFun();
    // })
}
// calling function when DOM get loaded
// stats();
window.addEventListener("load", funForStats);
window.addEventListener("load", funForScore);
// window.addEventListener("load",goingBackToHome);







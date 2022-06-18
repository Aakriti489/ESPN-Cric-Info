// const url = 'https://www.espncricinfo.com//series/ipl-2020-21-1210595/mumbai-indians-vs-chennai-super-kings-1st-match-1216492/full-scorecard';
const request = require('request');
const cheerio = require('cheerio');
const path = require('path');
const fs = require('fs');
const xlsx = require('xlsx');

function processScoreCard(url){
    request(url,cb);
}


function cb(err,response,html){
    if(err){
        console.log(error);
    }else{
        extractMatchDetails(html);
    }
}
function extractMatchDetails(html){
    let $ = cheerio.load(html);
    let descStr = $('.header-info .description')
    let descArr = descStr.text().split(',');
    let venue = descArr[1].trim();
    let date = descArr[2].trim();
    let result = $('.match-info.match-info-MATCH.match-info-MATCH-half-width .status-text').text();
    console.log(venue);
    console.log(date);
    console.log(result);

    let innings = $('.card.content-block.match-scorecard-table>.Collapsible');
    let htmlString = ''
    for(let i = 0;i<innings.length;i++){
        htmlString += $(innings[i]).html()
        let teamNames = $(innings[i]).find('h5').text()
        teamNames = teamNames.split('INNINGS')[0].trim()
        let opponentIdx = i == 0 ?1:0;
        let opponentName = $(innings[opponentIdx]).find('h5').text()
        opponentName = opponentName.split('INNINGS')[0].trim()
        //console.log(teamNames, opponentName)

        let cInning = $(innings[i]);
        let allRows = cInning.find('.table.batsman tbody tr');

        for(let j = 0;j<allRows.length;j++){
            let allCols = $(allRows[j]).find('td');
            let isWorthy = $(allCols[0]).hasClass('batsman-cell')
            if(isWorthy){
                let playerName = $(allCols[0]).text().trim()
                let runs = $(allCols[2]).text().trim()
                let balls = $(allCols[3]).text().trim()
                let fours = $(allCols[5]).text().trim()
                let six = $(allCols[6]).text().trim()
                let str = $(allCols[7]).text().trim()

                console.log(`${playerName} | ${runs} | ${balls} | ${fours} | ${six} | ${str}`)

                processPlayer(teamNames,opponentName,playerName,runs,balls,fours,six,str,venue,date,result)
                
            }
        }
        console.log('---------------------------------------')
    }
  
    // console.log(htmlString)


}


function processPlayer(teamNames,opponentName,playerName,runs,balls,fours,six,str,venue,date,result){
    let teamPath = path.join(__dirname,"IPL",teamNames)
    dirCreator(teamPath)

    let filePath = path.join(teamPath,playerName+'.xlsx')
    let content = excelReader(filePath,playerName)
    let playerObj = {
        playerName,
        teamNames,
        opponentName,
        playerName,
        runs,
        balls,
        fours,
        six,
        str,
        venue,
        date,
        result
    };
    content.push(playerObj)
    excelWriter(filePath,playerName,content)

}
function dirCreator(folderPath){
    if(fs.existsSync(folderPath)==false){
        fs.mkdirSync(folderPath)
    }
}

function excelWriter(fileName,sheetName,data){
    let newWB = xlsx.utils.book_new();
    let newWS = xlsx.utils.json_to_sheet(data);
    xlsx.utils.book_append_sheet(newWB, newWS,sheetName);
    xlsx.writeFile(newWB,fileName);


}
   
function excelReader(fileName,sheetName){
    if(fs.existsSync(fileName) == false){
        return [];
    }
    let wb = xlsx.readFile(fileName);
    let excelData = wb.Sheets[sheetName];
    let ans = xlsx.utils.sheet_to_json(excelData);
    return ans 

}

module.exports={
    ps:processScoreCard
}

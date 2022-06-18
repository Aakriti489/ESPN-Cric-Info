
const url = 'https://www.espncricinfo.com/series/ipl-2020-21-1210595'
const request = require('request');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

const allMatchobj = require('./allMatch')
// const { linkSync } = require('fs');

let iplPath = path.join(__dirname,"IPL");
function dirCreator(filePath){
    if(fs.existsSync(filePath)==false){
        fs.mkdirSync(filePath)
    }
}

dirCreator(iplPath);
request(url,cb);

function cb(err,response,html){
    if(err){
        console.log(error);
    }else{
        extractLink(html);
    }
}

function extractLink(html){
    let selTool = cheerio.load(html);
    let anchorElement =  selTool('a[data-hover = "View All Results"]');
    let link = anchorElement.attr('href');
    // console.log(link);
    let fullLink = 'https://www.espncricinfo.com/'+link;
    //console.log(fullLink);
    allMatchobj.getAllMatch(fullLink)
}

const fs = require('fs');
const xlsx = require('xlsx');

let buffer = fs.readFileSync("./example.json");
let data = JSON.parse(buffer);

data.push({
    "name":"Pragati",
    "last name":"sharma",
     "isAvengers":true,
     "age":15,
     "friends":["akki","tony","bucky"],
     "address":{
         "city":"delhi",
         "state":"delhi"
     }

});

let stringData = JSON.stringify(data);
fs.writeFileSync("example.json",stringData)
// console.log("updated");


    


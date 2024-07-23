////////////////////////////---------File Stream-----------////////////////////////////////////

//require() imports the module to the current environment here the 'fs' module --> filestream
const fs = require("fs");
const url = require("url");
const http = require("http");

// //readFileSync reads the file and returns a string
// //first argument is the path to the file and the second argument is the encoding scheme
// const retrievedText = fs.readFileSync('./txt/append.txt', 'utf8');
// console.log( retrievedText );
// const textOut = `This is about myself: ${retrievedText}`;
// console.log( textOut );

// console.log('Rangeelomaro');

// //Asynchronous Implementation of Reading file accepts a callback function
// //It starts reading from file and at the time span the other things get executed like the console.log statements
// //When the file is read completely the callback function is executed and output is shown.

// //This is what called the Callback Hell.
// //To escape this we have to use Promises or async/await.
// fs.readFile('/home/alucard007/Documents/Learnings/BackEnd/txt/start.txt', 'utf8', (err,data1)=>
// {
//     console.log(data1);
//     fs.readFile(`/home/alucard007/Documents/Learnings/BackEnd/txt/${data1}.txt`, 'utf8', (err,data2)=>
//         {
//               console.log(data2);
//               fs.readFile(`/home/alucard007/Documents/Learnings/BackEnd/txt/append.txt`, 'utf8', (err,data3)=>
//                 {
//                     console.log(data3);
//                     fs.writeFile(`/home/alucard007/Documents/Learnings/BackEnd/txt/output2.txt`,`${data2}\n${data3}`, 'utf8', (err)=>
//                         {
//                               console.log(`File written`);
//                         });
//                 });
//         });
// });
// console.log(`Reading file`);

//writeFileSync writes the output to a file, if not exits then creates a new file
// The first argument is where you want to write and The second argument is what you want to write.
// fs.writeFileSync('./txt/output.txt', textOut);
// console.log(`File written`);

////////////////////////////---------File Stream-----------////////////////////////////////////

//////////////////------------------Server-----------------///////////////////

//createServer creates a server which accepts a callback function
//the callback function has two parameters names request and response
//whenever the server starts listening, the callback function is executed and the response is shown on the page
//for this response.end() is used.

const replaceTemplate = (template, product) => {
  let cardTemplate = template.replace(/{%PRODUCTNAME%}/g, product.productName);
  cardTemplate = cardTemplate.replace(/{%IMAGE%}/g, product.image);
  cardTemplate = cardTemplate.replace(/{%PRICE%}/g, product.price);
  cardTemplate = cardTemplate.replace(/{%QUANTITIES%}/g, product.quantity);
  cardTemplate = cardTemplate.replace(/{%FROM%}/g, product.from);
  cardTemplate = cardTemplate.replace(/{%NUTRIENTS%}/g, product.nutrients);
  cardTemplate = cardTemplate.replace(/{%DESCRIPTION%}/g, product.description);
  cardTemplate = cardTemplate.replace(/{%ID%}/g, product.id);

  if (!product.organic)
    cardTemplate = cardTemplate.replace(/{%NOT_ORGANIC%}/g, "not-organic");
  return cardTemplate;
};

const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  "utf-8"
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  "utf-8"
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  "utf-8"
);
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const objectData = JSON.parse(data);
const myServer = http.createServer((request, response) => {
  // let x = 20;
  // console.log(`Baby Server chalu ho gaya hai!!`);
  // console.log(request.url);
  //It prints to the console the default url requests made by the server
  //Inititally it prints to the console ['/' and '/favicon.ico'].

  //Basically whatever request we send via the URL accordingly we get response from the server like the following.
  //Here the concept of routing is depicted
//   console.log(request.url);
  const { query, pathname: requestedPath } = url.parse(request.url, true);
  //Overview Page
  if (requestedPath === "/" || requestedPath === "/overview") {
    const cardsHTML = objectData.map((el) => replaceTemplate(tempCard, el));
    const outputHTML = cardsHTML.join("");
    // console.log(outputHTML);
    const updatedOverview = tempOverview.replace(
      /{%PRODUCT_CARDS%}/g,
      outputHTML
    );
    response.writeHead(200, {
      "Content-Type": "text/html",
    });
    response.end(updatedOverview);
  }
  //Products Page
  else if (requestedPath === "/products") {
    // console.log(query);
    const product = objectData[query.id];
    const outputHTML = replaceTemplate(tempProduct,product);
    response.writeHead(200, {
      "Content-Type": "text/html",
    });
    response.end(outputHTML);
  }
  //API Page
  else if (requestedPath === "/api") {
    // Here the __dirname property is used to get the path to the current directory in which index.js is running.
    // Again here we are attempting to read data from the custom API which is stored in the dev-data folder.
    // APIs are stored in JSON format and to read from them we need to parse then to create Object and Array types.
    // Also as we are requesting data via a request so here this url request is '/api'.
    // Finally as the json is read so the Content-Type header is set to 'application/json'

    // fs.readFile(`${__dirname}/dev-data/data.json`,'utf-8',(err,data)=>{
    //     const json = JSON.parse(data);
    // })

    //Instead of repeatedly reading from the file when we request, we can read once when server starts and use it when necessary.
    response.writeHead(200, {
      "Content-Type": "application/json",
    });
    response.end(data);
  } //If no path exists then it will show 404 not found status code and we are passing some extra information via the writeHead object.
  //Not Found
  else {
    response.writeHead(404, {
      "Content-Type": "text/html",
      "my-own-header": "lolHeader",
    }); //status code 404 means page not found. 403 means forbidden. 200 means OK. 500 means Internal Server Error. 302 means Found.
    response.end("<h1>Page Not Found!!<h1>");
  }
});

//The output of createServer() is a server which is used to do various things.
//Here the server is used to listen to the localhost 127.0.0.1 on port 8001.
myServer.listen(8001, "127.0.0.1", () => {
  console.log("Server Listening");
});

//////////////////------------------Server-----------------///////////////////

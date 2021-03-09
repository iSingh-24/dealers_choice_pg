const { client, syncAndSeed } = require("./mapleDB");
const express = require("express");
const path = require("path");

const app = express();

app.use("/public", express.static(path.join(__dirname, "public")));

app.get("/", async (req, res, next) => {
  try {
    const response = await client.query(`SELECT * FROM "Category";`);
    const categories = response.rows;

    res.send(`
            <html>
            <head>
              <link rel='stylesheet' href='/public/styles.css'/>
            </head>
            <body>
            <h1 class ="title">CHOOSE YOUR JOB</h1>
           <br>
           <br>
            <h2 class = "title">BEST MAPLESTORY JOB CLASSES</h2> 
            <ul>
            ${categories
              .map(
                (category) => `
                    <li class="categories">
                        <a href="/categories/${category.id}"> 
                    ${category.name}
                    </li>
                    <a/>
                `
              )
              .join("")}
            </ul>
            </body>
            </html>
        `);
  } catch (ex) {
    next(ex);
  }
});

app.get("/categories/:id", async (req, res, next) => {
  try {
    const promises = [
      client.query(`SELECT * FROM "Category" WHERE id=$1;`, [req.params.id]),
      client.query(`SELECT * FROM "Job" WHERE category_id=$1;`, [
        req.params.id,
      ]),
    ];

    const responses = await Promise.all(promises);
    const category = responses[0].rows[0];
    const jobs = responses[1].rows;

    res.send(`
            <html>
            <head>
              <link rel='stylesheet' href='/public/styles.css'/>
            </head>
            <body class = "jobClasses">
            <h1 class ="picked">YOU CHOSE ${category.name.toUpperCase()}</h1>
            <h2><a class = "home" href = "/">BACK TO HOME</a> <p>${
              category.name
            }</p></h2>  
            <ul>
            ${jobs
              .map(
                (job) => `
                <li class="jobs">
                  ${job.name}
                </li>
                <h2 class = "jobDescription">Also Known As</h2>
                <li class = "jobs">
                ${job.description}
                </li>
                `
              )
              .join("")}
            </ul>
            </body>
            </html>
        `);
  } catch (ex) {
    next(ex);
  }
});

const port = process.env.PORT || 3000;

const setUp = async () => {
  try {
    await client.connect();
    await syncAndSeed();
    console.log("Connected to database");
    app.listen(port, () => console.log(`Listening at port ${port}`));
  } catch (ex) {
    console.log(ex);
  }
};

setUp();

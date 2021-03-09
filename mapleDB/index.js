const pg = require("pg");

const port = process.env.PORT || 3000;
const client = new pg.Client(
  process.env.DATABASE_URL || "postgres://localhost/maple_chars_db"
);

const syncAndSeed = async () => {
  const SQL = `

        DROP TABLE IF EXISTS "Job"; 
        DROP TABLE IF EXISTS "Category"; 
        CREATE TABLE "Category"(
            id INTEGER PRIMARY KEY,
            name VARCHAR(100) NOT NULL
        ); 
        CREATE TABLE "Job"(
            id INTEGER PRIMARY KEY, 
            name VARCHAR(100) NOT NULL,
            category_id INTEGER REFERENCES "Category"(id),
            description VARCHAR(1000)
        );
        
        INSERT INTO "Category"(id, name) VALUES(1, 'Warrior');
        INSERT INTO "Category"(id, name) VALUES(2, 'Magician');
        INSERT INTO "Category"(id, name) VALUES(3, 'Rouge');
        INSERT INTO "Category"(id, name) VALUES(4, 'Archer');
        INSERT INTO "Job"(id, name, category_id, description) VALUES(1, 'Spearman',1, 'Warrior Class Of Maplestory');
        INSERT INTO "Job"(id, name, category_id, description) VALUES(2, 'Cleric',2, 'Magician Class Of Maplestory. Heals for DAYSSSS');
        INSERT INTO "Job"(id, name, category_id, description) VALUES(3, 'Bandit',3, 'Long range, kunai wielding, and the most badass looking class on maplestory!');  
        INSERT INTO "Job"(id, name, category_id, description) VALUES(4, 'Hunter',4, 'Long range snipers of the maple world! Let it RAIN!');  
    `;
  await client.query(SQL);
};

module.exports = {
  client,
  syncAndSeed,
};

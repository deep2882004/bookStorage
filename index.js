import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "books",
  password: "Deeprewale@28",
  port: 5432,
});

db.connect();

let books = [];

app.get("/", async (req, res) => {
  try {
    const booksData = await db.query("SELECT * FROM books ORDER BY id DESC");
    const Result = booksData.rows;
    console.log(Result);
    res.render("home.ejs", {
      books: Result,
    });
  } catch (err) {
    console.log(err);
  }
});

app.get("/edit/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const booksData = await db.query("SELECT * FROM books WHERE id = ($1)", [
      id,
    ]);
    const result = booksData.rows[0];
    res.render("partials/edit.ejs", {
      book: result,
    });
  } catch (err) {
    console.log(err);
  }
});

app.post("/edit/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const name = req.body.name;
    const author = req.body.author;
    const review = req.body.review;
    const rating = req.body.rating;
    const date = req.body.date;

    await db.query(
      "UPDATE books SET name = ($1), author = ($2), review = ($3) , rating = ($4), date = ($5) WHERE id = ($6)",
      [name, author, review, rating, date, id]
    );
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
});

app.get("/add", (req, res) => {
  res.render("partials/add.ejs");
});

app.post("/add", async (req, res) => {
  try {
    const nameadd = req.body.nameadd;
    const authoradd = req.body.authoradd;
    const reviewadd = req.body.reviewadd;
    const ratingadd = req.body.ratingadd;
    const dateadd = req.body.dateadd;
    const isbn = req.body.isbn;

    await db.query(
      "INSERT INTO books(name,author,review,rating,date,isbn_number) VALUES($1,$2,$3,$4,$5,$6)",
      [nameadd, authoradd, reviewadd, ratingadd, dateadd, isbn]
    );
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
});

app.get("/delete/:id", async (req, res) => {
  try {
    const id = req.params.id;

    await db.query("DELETE FROM books WHERE id = ($1)", [id]);
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
});
app.listen(port, () => {
  console.log(` server listining to http://localhost:${port}`);
});

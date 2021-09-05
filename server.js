const express = require("express")
const app = express()
const mongoose = require("mongoose")
require('dotenv').config()
const PORT = process.env.PORT || 7000


const Document = require("./models/Document")
const MONGO_URL = process.env.MONGO_URL

app.set("view engine", "ejs")
app.use(express.static("public"))
app.use(express.urlencoded({ extended: true }))

//Connect to mongoDB database
mongoose.connect(MONGO_URL, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
}, ()=>{
  console.log('Database connected')
})

//Home route
app.get("/", (req, res) => {
  const code = `Welcome to TextHub!

Create, save & share your text files
from top right corner 👉`

  res.render("code-display", { code, language: "plaintext" })
})

//New route
app.get("/new", (req, res) => {
  res.render("new")
})

//Save route
app.post("/save", async (req, res) => {
  const value = req.body.value
  try {
    const document = await Document.create({ value })
    res.redirect(`/${document.id}`)
  } catch (e) {
    res.render("new", { value })
  }
})

app.get("/:id/duplicate", async (req, res) => {
  const id = req.params.id
  try {
    const document = await Document.findById(id)
    res.render("new", { value: document.value })
  } catch (e) {
    res.redirect(`/${id}`)
  }
})

app.get("/:id", async (req, res) => {
  const id = req.params.id
  try {
    const document = await Document.findById(id)

    res.render("code-display", { code: document.value, id })
  } catch (e) {
    res.redirect("/")
  }
})

app.listen(PORT, ()=>{
  console.log('Server connected')
})

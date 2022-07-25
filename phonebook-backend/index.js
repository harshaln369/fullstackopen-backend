const express = require("express");
const morgan = require("morgan");

const app = express();

app.use(express.json());
morgan.token("type", function (req, res) {
  return JSON.stringify(req.body);
});
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :type")
);

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((person) => person.id === id);

  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((person) => person.id !== id);

  response.status(204).end();
});

app.post("/api/persons", (request, response) => {
  let person = request.body;

  console.log("person", person);

  if (Object.keys(person).length === 0) {
    response.status(400).json({ error: "No data provided" });
  }

  if (person["name"] === undefined || person["name"] === "") {
    response.status(400).json({ error: "Name is required" });
  }

  if (person["number"] === undefined || person["number"] === "") {
    response.status(400).json({ error: "Number is required" });
  }

  const nameAlreadyExists = persons.filter(
    (p) => p.name.toLowerCase() === person.name.toLowerCase()
  );

  if (nameAlreadyExists.length > 0) {
    response.status(400).json({ error: "Name must be unique" });
  }

  console.log("person", person);

  person = {
    ...person,
    id: Math.random().toString(),
  };

  persons.push(person);

  response.json(person);
});

app.get("/info", (request, response) => {
  const noOfPersons = persons.length;
  const date = new Date();
  response.send(
    `<div><p>Phonebook has info for ${noOfPersons} people</p><p>${date}</p></div>`
  );
});

const PORT = 3001;
app.listen(PORT, () => console.log("listening on port: ", PORT));

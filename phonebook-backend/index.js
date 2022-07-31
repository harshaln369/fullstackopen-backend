require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const Person = require("./models/person");

const app = express();

app.use(express.static("build"));
app.use(express.json());

morgan.token("type", function (req, res) {
  return JSON.stringify(req.body);
});
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :type")
);
app.use(cors());

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
  Person.find().then((people) => response.json(people));
});

app.get("/api/persons/:id", (request, response) => {
  const id = request.params.id;

  Person.findById(id)
    .then((person) => {
      response.json(person);
    })
    .catch((error) => {
      console.log(error);
      next(error);
    });
});

app.delete("/api/persons/:id", (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then((result) => {
      response.status(204).end();
    })
    .catch((error) => {
      console.log(error);
      next(error);
    });
});

app.post("/api/persons", (request, response, next) => {
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

  // const nameAlreadyExists = persons.filter(
  //   (p) => p.name.toLowerCase() === person.name.toLowerCase()
  // );

  // if (nameAlreadyExists.length > 0) {
  //   response.status(400).json({ error: "Name must be unique" });
  // }

  const newPerson = new Person({
    ...person,
  });

  newPerson
    .save()
    .then((person) => {
      response.send(person);
    })
    .catch((error) => {
      console.log("Not able to save new person", error);
      next(error);
    });
});

app.put("/api/persons/:id", (request, response, next) => {
  const updateData = request.body;
  Person.findByIdAndUpdate(request.params.id, updateData, { new: true })
    .then((updatedPerson) => {
      response.send(updatedPerson);
    })
    .catch((error) => {
      next(error);
    });
});

app.get("/info", (request, response) => {
  Person.find()
    .countDocuments()
    .then((count) => {
      const noOfPersons = count;
      const date = new Date();
      response.send(
        `<div><p>Phonebook has info for ${noOfPersons} people</p><p>${date}</p></div>`
      );
    })
    .catch((error) => {
      console.log(error);
      next(error);
    });
});

const errorHandler = (error, request, response, next) => {
  console.log(error.message);

  if (error.name === "Cast Error") {
    return res.status(400).send({ error: "Malformatted id" });
  }

  next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => console.log("listening on port: ", PORT));

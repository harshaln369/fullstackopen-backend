/* eslint-disable no-undef */
const mongoose = require('mongoose')

// eslint-disable-next-line no-undef
if (process.argv.length < 3) {
  console.log(
    'Please provide the password as an argument: node mongo.js <password>'
  )
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://harshal:${password}@cluster0.oxj4nkh.mongodb.net/phonebook?retryWrites=true&w=majority`

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length <= 3) {
  mongoose
    .connect(url)
    .then(() => {
      console.log('Connected to MongoDB')

      return Person.find({})
    })
    .then((people) => {
      let peopleString = ''
      const str = people.reduce((prevPerson, currPerson) => {
        if (prevPerson === '') {
          return (peopleString += `phonebook:\n${currPerson.name} ${currPerson.number}\n`)
        } else {
          return (peopleString += `${currPerson.name} ${currPerson.number}\n`)
        }
      }, '')
      console.log(str)
      return mongoose.connection.close()
    })
    .catch((err) => console.log(err))
} else {
  mongoose
    .connect(url)
    .then(() => {
      console.log('Connected to MongoDB')

      if (
        process.argv[3] &&
        process.argv[4] &&
        process.argv[3].length > 0 &&
        process.argv[4].length > 0
      ) {
        const person = new Person({
          name: process.argv[3],
          number: process.argv[4],
        })

        return person.save()
      } else {
        throw new Error(
          'Please provide the name and number as an argument: node mongo.js <password> <name> <number>'
        )
      }
    })
    .then(() => {
      console.log(
        `added ${process.argv[3]} number ${process.argv[4]} to phonebook`
      )
      return mongoose.connection.close()
    })
    .catch((err) => console.log(err))
}

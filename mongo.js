const mongoose = require('mongoose')

// if (process.argv.length<3) {

//   console.log('Provide arguments: node mongo.js password name (as string, if contains spaces) number');
//   process.exit(1)
// }

const password = process.argv[2]


const url =
  `mongodb+srv://stevanakvadrat:${password}@cluster0.e1ajbev.mongodb.net/phonebookApp?retryWrites=true&w=majority`


mongoose.set('strictQuery',false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
	name: String,
	number: String,
})

const Person = mongoose.model('Person', personSchema)

const person = new Person({
	name: process.argv[3],
	number: process.argv[4],
})


if(process.argv.length ===3){
	Person.find({}).then(result => {
		result.forEach(person => {
			console.log(person)
		})
		mongoose.connection.close()
	})
} else {


	person.save().then(result => {
		console.log(result)
		console.log(`Person ${result.name} ${result.number} saved`)
		mongoose.connection.close()
	})
}
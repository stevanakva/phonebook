const mongoose = require('mongoose')

//const url =`mongodb+srv://stevanakvadrat:V4st3nAd98tKV4@cluster0.e1ajbev.mongodb.net/phonebookApp?retryWrites=true&w=majority`


mongoose.set('strictQuery',false)

const url = process.env.MONGODB_URI
console.log('connecting to', url);
mongoose.connect(url)
    .then(result => {
        console.log('connected to MONGODB')
    })
    .catch((error) => {
        console.log('error connecting to MONGODB', error.message)
    })

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
  })

module.exports = mongoose.model('Person', personSchema);
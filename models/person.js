const mongoose = require('mongoose')

mongoose.set('strictQuery', false) //https://stackoverflow.com/questions/74747476

const url = process.env.MONGODB_URI

console.log('connecting to', url)

mongoose
  .connect(url)
  .then(() => console.log('connected to MongoDB'))
  .catch(error => console.log('error connecting to MongoDB', error.message))

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
  },
  number: {
    type: String,
    minLength: 8,
    validate: {
      validator: value => {
        if (value.includes('-')) {
          return /\d{2,3}-\d{1,}/.test(value)
        }
      },
      message: props => `${props.value} is not a valid phone number!`,
    },
  },
})

personSchema.set('toJSON', {
  transform: (document, returnedObejct) => {
    returnedObejct.id = returnedObejct._id.toString()
    delete returnedObejct._id
    delete returnedObejct.__v
  },
})

module.exports = mongoose.model('person', personSchema)

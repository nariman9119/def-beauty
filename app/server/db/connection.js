const mongoose = require('mongoose')
var mongo = require('mongodb')
const config = require('config')
const GridFsStorage = require('multer-gridfs-storage')
const Grid = require('gridfs-stream')
const multer = require('multer')

let logger = require('../logger')

mongoose.set('useFindAndModify', false)
mongoose.set('useNewUrlParser', true)
mongoose.set('useCreateIndex', true)

const dbname = config.get('dbName')
const dbport = config.get('dbPort')
const dbuser = config.get('dbUser')
const dbpass = config.get('dbPassword')


const connection = () => {
  if (process.env.NODE_ENV === 'development')
    mongoose.connect(`mongodb://localhost:${dbport}/${dbname}`)
  else
    mongoose.connect(`mongodb://${dbuser}:${dbpass}@mongodb:${dbport}/${dbname}`)
}

const dbConnection = mongoose.connection
let errorCount = 0

dbConnection.on('error', () => {
  setTimeout(connection, 1000)
  if (errorCount++ === 0) {
    dbConnection.on('error', error => logger.error.bind(console, `MongoDB Connection to ${dbname} error:`)(error.toString()))
  }
})

let gfs = ''
let storage = ''
let upload = ''

dbConnection.once('open', async () => {
  Grid.mongo = mongoose.mongo
  gfs = Grid(dbConnection.db)
  storage = GridFsStorage({
    db: gfs,

    // Additional Meta-data that you want to store
    metadata: function (req, file, cb) {
      cb(null, {originalname: file.originalname})
    },

    file: (req, file) => {
      return {
        filename: file.fieldname + '-' + Date.now() + '.',
        metadata: {originalname: file.originalname},
        bucketName: 'ctFiles',
      }
    },

    root: 'ctFiles' // Root collection name
  })


  // Multer configuration for single file uploads
  upload = multer({
    storage: storage
  }).single('file')

  logger.info(`MongoDB connection to ${dbname} succeeded!`)
})

connection()

exports.getGrid = () => ({
  gfs, storage, upload
})





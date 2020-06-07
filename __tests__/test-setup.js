import mongoose from 'mongoose';
mongoose.set('useCreateIndex', true)
mongoose.promise = global.Promise;

async function removeAllCollections () {
    const collections = Object.keys(mongoose.connection.collections)
    for (const collectionName of collections) {
      const collection = mongoose.connection.collections[collectionName]
      await collection.deleteMany()
    }
}

// async function dropAllCollections () {
//     const collections = Object.keys(mongoose.connection.collections)
//     for (const collectionName of collections) {
//       const collection = mongoose.connection.collections[collectionName]
//       try {
//         await collection.drop()
//       } catch (error) {
//         // Sometimes this error happens, but you can safely ignore it
//         if (error.message === 'ns not found') return
//         // This error occurs when you use it.todo. You can
//         // safely ignore this error too
//         if (error.message.includes('a background operation is currently running')) return
//         console.log(error.message)
//       }
//     }
// }

export const setupDB = (databaseName) => {

      // Uncomment this block in order to set up a real db for tests
      // Connect to Mongoose
      // beforeAll(async () => {
      //   const url = `mongodb://127.0.0.1/${databaseName}`
      //   await mongoose.connect(url, { 
      //     useUnifiedTopology: true,
      //     useCreateIndex: true,
      //     useUnifiedTopology: true,
      //     useNewUrlParser: true 
      //   });
      // })
  
      // Cleans up database between each test
      beforeEach(async () => {
        await removeAllCollections()
      })
  
      // Uncomment this block in order to dropAllCollections and close the connection if necessary
      // Disconnect Mongoose
      // afterAll(async () => {
      //   await dropAllCollections()
      //   await mongoose.connection.close()
      // })
}
  
  
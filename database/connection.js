const mongoose = require('mongoose')
mongoose.Promise = global.Promise;

mongoose.connect(process.env.MONGO_DB, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(res => console.log(`Connected`))
    .catch(err => console.log(`Error: ${err}`));
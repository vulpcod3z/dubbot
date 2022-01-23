module.exports = class Db {

  // Get reqs and create instance.
  constructor() {
    (async () => {
      this.mongoose = require('mongoose');
      require('mongoose-long')(this.mongoose);
      this.uniquedator = require('mongoose-unique-validator');

      // Create db connector and return for use.
      this.conn = await this.mongoose.createConnection(`${process.env.DB_URL}`, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useFindAndModify: false,
        useCreateIndex: true
      });

      // // User schema.
      // this.User = this.conn.model(
      //   'User',
      //   require('./schemas/User')
      //     .User(this.mongoose, this.uniquedator));

      // Game signup/submissions schema.
      this.GameSignup = this.conn.model(
        'GameSignup',
        require('./schemas/GameSignup')
          .GameSignup(this.mongoose));

      // Game signup/submissions archive schema.
      this.GameSignupArchive = this.conn.model(
        'GameSignupArchive',
        require('./schemas/GameSignupArchive')
          .GameSignupArchive(this.mongoose));

      // Return db connection.
      return this.conn;
    })();
  }
}
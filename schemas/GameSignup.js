// Db schema for gamesignups.
module.exports.GameSignup = mongoose => {
  return new mongoose.Schema({
    user_id: {
      type: mongoose.Schema.Types.Long,
      require: true
    },
    user_name: {
      type: String,
      require: true
    },
    user_hash: {
      type: String,
      require: true
    },
    artist_name: {
      type: String,
      require: true
    },
    song_link: {
      type: String,
      require: true
    },
    file_name: {
      type: String,
      require: true
    }
  });
}
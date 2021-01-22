class SpotifyLink {
    constructor(db) {
      this.db = db;
    }

    retrieveLinks() {
        const sql = 'SELECT * FROM SpotifyLink ORDER BY Description';
        return this.db.retrieveList(sql);
        session = Session()
      }

}

exports.SpotifyLink = SpotifyLink;
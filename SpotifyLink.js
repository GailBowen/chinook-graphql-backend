class SpotifyLink {
    constructor(db) {
      this.db = db;
    }

    retrieveLinks() {
        const sql = 'SELECT * FROM SpotifyLink ORDER BY Description';
        return this.db.retrieveList(sql);
        session = Session()
      }

      
    retrieveLink(args) {
      const sql = 'SELECT * FROM SpotifyLink WHERE SpotifyLinkId = ?';
      const id = args.spotifyLinkId;

      return this.db.retrieveRowByFields(sql, [id]);
    }

    

  

}

exports.SpotifyLink = SpotifyLink;
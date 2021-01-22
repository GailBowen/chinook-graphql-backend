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

    addSpotifyLink(args) {
      const maxSql = `
        SELECT MAX(SpotifyLinkId)+1 AS SpotifyLinkId FROM SpotifyLink;
      `;
  
  
      const i = this.db.retrieveRowByFields(maxSql, [])
        .then(x => {
          const sql = `
            INSERT INTO SpotifyLink (SpotifyLinkId, Description, Link) VALUES (?, ?, ?);
          `;
          this.db.runSql(sql, [x.spotifyLinkId, args.description, args.link]);
        });
    }

    

  

}

exports.SpotifyLink = SpotifyLink;
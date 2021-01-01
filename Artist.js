class Artist {
  constructor(db) {
    this.db = db;
  }

  retrieveArtists() {
    const sql = 'SELECT * FROM Artist ORDER BY Name';
    return this.db.retrieveList(sql);
  }

  retrieveArtist(args) {
    const sql = 'SELECT * FROM Artist WHERE ArtistId = ?';
    const id = args.artistId;

    return this.db.retrieveRowByFields(sql, [id]);
  }

  setArtist(args) {
    const artistId = args.artistId;
    const artistName = args.artistName;

    const sql = `
      UPDATE Artist
      SET Name = ?
      WHERE ArtistId = ?;
    `

    return this.db.runSql(sql, [artistName, artistId]);
  }

  addArtist(args) {
    const maxSql = `
      SELECT MAX(ArtistId)+1 AS ArtistId FROM Artist;
    `;


    const i = this.db.retrieveRowByFields(maxSql, [])
      .then(x => {
        const sql = `
          INSERT INTO Artist (ArtistId, Name) VALUES (?, ?);
        `;
        this.db.runSql(sql, [x.ArtistId, args.artistName]);
      });
  }

  deleteArtist(args) {
    const artistId = args.artistId;

    const sql = `
      DELETE FROM Artist WHERE ArtistId = ?;
    `;

    this.db.runSql(sql, [artistId]);
  };
}

exports.Artist = Artist;

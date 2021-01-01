class Album {
  constructor(db) {
    this.db = db;
  }
  
  retrieveAlbums() {
    const sql = 'SELECT * FROM Album ORDER BY Title';
    return this.db.retrieveList(sql);
    session = Session()
  }

  retrieveAlbumsByArtist(args) {
    const sql = 'SELECT * FROM Album WHERE ArtistId = ?';
    const id = args.artistId;
    return this.db.retrieveListByFields(sql, [id]);
  }

  retrieveAlbum(args) {
    const sql = `
    SELECT Album.*, Artist.Name AS ArtistName
    FROM Album 
    JOIN Artist ON Album.ArtistId=Artist.ArtistId
    WHERE Album.AlbumId = ?`;
    const id = args.albumId;

    return this.db.retrieveRowByFields(sql, [id]);
  }

  setAlbum(args) {
    const albumId = args.albumId;
    const albumName = args.albumName;
    const albumArtist = args.albumArtist;

    const sql = `
      UPDATE Album
      SET Title = ?, ArtistId = ?
      WHERE AlbumId = ?;
    `;

    return this.db.runSql(sql, [albumName, albumArtist, albumId]);
  };

  addAlbum(args) {
    const albumName = args.albumName;
    const albumArtist = args.albumArtist;

    const maxSql = `
      SELECT MAX(AlbumId)+1 AS AlbumId FROM Album;
    `;

    this.db.retrieveRowByFields(maxSql, [])
      .then(x => {
        const sql = `
          INSERT INTO Album (AlbumId, Title, ArtistId)
          VALUES (?, ?, ?);
        `;

        this.db.runSql(sql, [x.AlbumId, albumName, albumArtist]);
      })
  };

  deleteAlbum(args) {
    const albumId = args.albumId;

    const sql = `
      DELETE FROM Album WHERE AlbumId = ?;
    `;

    this.db.runSql(sql, [albumId]);
  };
}

exports.Album = Album;

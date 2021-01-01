class Track {
  constructor(db) {
    this.db = db;
  }

  retrieveTracks(args) {
    const sql = `
      SELECT t.*, ar.Name AS ArtistName, ar.ArtistId
      FROM Track t
      JOIN Album al ON t.AlbumId=al.AlbumId
      JOIN Artist ar ON al.ArtistId=ar.ArtistId
      ORDER BY Name`;
    return this.db.retrieveList(sql);
  }

  retrieveTracksByAlbum(args) {
    const sql = 'SELECT * FROM Track WHERE AlbumId = ?';
    const id = args.albumId;

    return this.db.retrieveListByFields(sql, [id]);
  }

  retrieveTracksByGenre(args) {
    const sql = 'SELECT * FROM Track WHERE GenreId = ?';
    const id = args.genreId;

    return this.db.retrieveListByFields(sql, [id]);
  }

  retrieveTracksByMediaType(args) {
    const sql = 'SELECT * FROM Track WHERE MediaTypeId = ?';
    const id = args.mediaTypeId;

    return this.db.retrieveListByFields(sql, [id]);
  }

  retrieveTrack(args) {
    const sql = `
      SELECT t.*, a.Title AS AlbumTitle, mt.Name as MediaTypeName, 
        g.Name as GenreName, ar.Name AS ArtistName, ar.ArtistId
      FROM Track t
      JOIN Album a ON t.AlbumId=a.AlbumId
      JOIN MediaType mt ON t.MediaTypeId=mt.MediaTypeId
      JOIN Genre g ON t.GenreId=g.GenreId
      JOIN Artist ar ON a.ArtistID=ar.ArtistId
      WHERE t.TrackId = ?`;
    const trackId = args.trackId;
    return this.db.retrieveRowByFields(sql, trackId);
  }
}

exports.Track = Track;

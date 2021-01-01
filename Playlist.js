class Playlist {
  constructor(db) {
    this.db = db;
  }

  retrievePlaylists(args) {
    const sql = 'SELECT * FROM Playlist ORDER BY Name';
    return this.db.retrieveList(sql);
  }

  retrievePlaylist(args) {
    const sql = 'SELECT * FROM Playlist WHERE PlaylistId = ?';
    const playListId = args.playListId;
    return this.db.retrieveRowByFields(sql, playListId);
  } 
}

exports.Playlist = Playlist;

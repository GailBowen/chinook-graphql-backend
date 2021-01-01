class PlaylistTrack {
  constructor(db) {
    this.db = db;
  }
  
  retrievePlaylistTracks(args) {
    const sql = 'SELECT * FROM PlaylistTrack WHERE PlaylistId = ?';
    const id = args.playListId;

    return this.db.retrieveListByFields(sql, [id]);
  }

  retrieveTrackPlaylists(args) {
    const sql = 'SELECT * FROM PlaylistTrack WHERE TrackId = ?';
    const id = args.trackId;

    return this.db.retrieveListByFields(sql, [id]);
  }
}

exports.PlaylistTrack = PlaylistTrack;

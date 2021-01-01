class MediaType {
  constructor(db) {
    this.db = db;
  }

  retrieveMediaTypes(args) {
    const sql = 'SELECT * FROM MediaType ORDER BY Name';
    return this.db.retrieveList(sql);
  }

  retrieveMediaType(args) {
    const sql = 'SELECT * FROM MediaType WHERE MediaTypeId = ?';
    const mediaTypeId = args.mediaTypeId;
    return this.db.retrieveRowByFields(sql, mediaTypeId);
  }
}

exports.MediaType = MediaType;

class Genre {
  constructor(db) {
    this.db = db;
  }

  retrieveGenres(args) {
    const sql = 'SELECT * FROM Genre ORDER BY Name';
    return this.db.retrieveList(sql);
  }

  retrieveGenre(args) {
    const sql = 'SELECT * FROM Genre WHERE GenreId = ?';
    const id = args.genreId;

    return this.db.retrieveRowByFields(sql, [id]);
  }

  setGenre(args) {
    const genreId = args.genreId;
    const genreName = args.genreName;

    if (genreId) {
      this.updateGenre(genreId, genreName);
    } else {
      if (this.addGenre(genreName)) {
        
      }
    }
  }

  updateGenre(genreId, genreName) {
    const sql = `
      UPDATE Genre
      SET Name = ?
      WHERE GenreId = ?;
      `;

    return this.db.runSql(sql, [genreName, genreId]);
  }

  addGenre(genreName) {
    const maxSql = `
      SELECT MAX(GenreID)+1 as GenreId FROM Genre;
    `;

    const i = this.db.retrieveRowByFields(maxSql, [])
      .then(x => {

        const sql = `
          INSERT INTO Genre (GenreId, Name)
          VALUES (
            ?, ?);
        `;

        this.db.runSql(sql, [x.GenreId, genreName.genreName]);
      });
  }

  deleteGenre(args) {
    const genreId = args.genreId;
    const sql = `
      DELETE FROM Genre WHERE GenreId=?;
    `;

    this.db.runSql(sql, [genreId]);
  }
}

exports.Genre = Genre;

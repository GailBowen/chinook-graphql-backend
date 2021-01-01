const express = require('express');
const graphqlHTTP = require('express-graphql');
const cors = require('cors');

const { schema } = require('./schema.js');
const { Db } = require('./Db.js');

const db = new Db();

const retrieveAlbums = (args) => {
  console.debug('boogie woogie woogie');
  const sql = 'SELECT * FROM Album ORDER BY Title';
  return db.retrieveList(sql);
}

const retrieveArtists = (args) => {
  const sql = 'SELECT * FROM Artist ORDER BY Name';
  return db.retrieveList(sql);
}

const retrieveCustomers = (args) => {
  const sql = 'SELECT * FROM Customer ORDER BY LastName';
  return db.retrieveList(sql);
}

const retrieveEmployees = (args) => {
  const sql = 'SELECT * FROM Employee ORDER BY LastName';
  return db.retrieveList(sql);
}

const retrieveMediaTypes = (args) => {
  const sql = 'SELECT * FROM MediaType ORDER BY Name';
  return db.retrieveList(sql);
}

const retrievePlaylists = (args) => {
  const sql = 'SELECT * FROM Playlist ORDER BY Name';
  return db.retrieveList(sql);
}

const retrieveGenres = (args) => {
  const sql = 'SELECT * FROM Genre ORDER BY Name';
  return db.retrieveList(sql);
}

const retrieveTracks = (args) => {
  const sql = `
    SELECT t.*, ar.Name AS ArtistName, ar.ArtistId
    FROM Track t
    JOIN Album al ON t.AlbumId=al.AlbumId
    JOIN Artist ar ON al.ArtistId=ar.ArtistId
    ORDER BY Name`;
  return db.retrieveList(sql);
}

const retrieveAlbumsByArtist = (args) => {
  const sql = 'SELECT * FROM Album WHERE ArtistId = ?';
  const id = args.artistId;
  return db.retrieveListByFields(sql, [id]);
}

const retrieveInvoicesByCustomer = (args) => {
  const sql = 'SELECT * FROM Invoice WHERE CustomerId = ?';
  const id = args.customerId;

  return db.retrieveListByFields(sql, [id]);
}

const retrieveInvoiceLines = (args) => {
  const sql = `
    SELECT il.*, t.Name AS TrackName
    FROM InvoiceLine il
    JOIN Track t ON il.TrackId=t.TrackId
    WHERE il.InvoiceId = ?`;
  const id = args.invoiceId;

  return db.retrieveListByFields(sql, [id]);
}

const retrievePlaylistTracks = (args) => {
  const sql = 'SELECT * FROM PlaylistTrack WHERE PlaylistId = ?';
  const id = args.playListId;

  return db.retrieveListByFields(sql, [id]);
}

const retrieveTrackPlaylists = (args) => {
  const sql = 'SELECT * FROM PlaylistTrack WHERE TrackId = ?';
  const id = args.trackId;

  return db.retrieveListByFields(sql, [id]);
}

const retrieveTracksByAlbum = (args) => {
  const sql = 'SELECT * FROM Track WHERE AlbumId = ?';
  const id = args.albumId;

  return db.retrieveListByFields(sql, [id]);
}

const retrieveTracksByGenre = (args) => {
  const sql = 'SELECT * FROM Track WHERE GenreId = ?';
  const id = args.genreId;

  return db.retrieveListByFields(sql, [id]);
}

const retrieveTracksByMediaType = (args) => {
  const sql = 'SELECT * FROM Track WHERE MediaTypeId = ?';
  const id = args.mediaTypeId;

  return db.retrieveListByFields(sql, [id]);
}

const retrieveAlbum = (args) => {
  const sql = `
  SELECT Album.*, Artist.Name AS ArtistName
  FROM Album 
  JOIN Artist ON Album.ArtistId=Artist.ArtistId
  WHERE Album.AlbumId = ?`;
  const id = args.albumId;

  return db.retrieveRowByFields(sql, [id]);
}

const retrieveArtist = (args) => {
  const sql = 'SELECT * FROM Artist WHERE ArtistId = ?';
  const id = args.artistId;

  return db.retrieveRowByFields(sql, [id]);
}

const retrieveCustomer = (args) => {
  const sql = `
    SELECT c.*, e.FirstName AS SupportRepFirstName, e.LastName AS SupportRepLastName
    FROM Customer c
    LEFT JOIN Employee e ON c.SupportRepId=e.EmployeeId
    WHERE c.CustomerId = ?`;
  const id = args.customerId;

  return db.retrieveRowByFields(sql, [id]);
}

const retrieveEmployee = (args) => {
  const sql = `
    SELECT e1.*, e2.FirstName as ReportsToFirstName, e2.LastName as ReportsToLastName 
    FROM Employee AS e1
    LEFT JOIN Employee AS e2 ON e1.ReportsTo=e2.EmployeeId
    WHERE e1.EmployeeId = ?`;
  const id = args.employeeId;

  return db.retrieveRowByFields(sql, [id]);
}

const retrieveGenre = (args) => {
  const sql = 'SELECT * FROM Genre WHERE GenreId = ?';
  const id = args.genreId;

  return db.retrieveRowByFields(sql, [id]);
}

const retrieveInvoice = (args) => {
  const sql = 'SELECT * FROM Invoice WHERE InvoiceId = ?';
  const id = args.invoiceId;

  return db.retrieveRowByFields(sql, [id]);
}

const retrieveMediaType = (args) => {
  const sql = 'SELECT * FROM MediaType WHERE MediaTypeId = ?';
  const mediaTypeId = args.mediaTypeId;
  return db.retrieveRowByFields(sql, mediaTypeId);
}

const retrievePlaylist = (args) => {
  const sql = 'SELECT * FROM Playlist WHERE PlaylistId = ?';
  const playListId = args.playListId;
  return db.retrieveRowByFields(sql, playListId);
} 

const retrieveTrack = (args) => {
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
  return db.retrieveRowByFields(sql, trackId);
}
const setArtist = (args) => {
  const artistId = args.artistId;
  const artistName = args.artistName;

  if (artistId) {
    updateArtist(artistId, artistName);
  }
}

const updateArtist = (artistId, artistName) => {
  const sql = `
    UPDATE Artist
    SET Name = ?
    WHERE ArtistId = ?;
  `

  return db.runSql(sql, [artistName, artistId]);
}

const addArtist = (artist) => {
  const maxSql = `
    SELECT MAX(ArtistId)+1 AS ArtistId FROM Artist;
  `;


  const i = db.retrieveRowByFields(maxSql, [])
    .then(x => {
      const sql = `
        INSERT INTO Artist (ArtistId, Name) VALUES (?, ?);
      `;
      db.runSql(sql, [x.ArtistId, artist.artistName]);

    });
}

const deleteArtist = (args) => {
  const artistId = args.artistId;

  const sql = `
    DELETE FROM Artist WHERE ArtistId = ?;
  `;

  db.runSql(sql, [artistId]);

};

const setAlbum = (args) => {
  const albumId = args.albumId;
  const albumName = args.albumName;
  const albumArtist = args.albumArtist;

  const sql = `
    UPDATE Album
    SET Title = ?, ArtistId = ?
    WHERE AlbumId = ?;
  `;

  return db.runSql(sql, [albumName, albumArtist, albumId]);
};

const addAlbum = (args) => {
  const albumName = args.albumName;
  const albumArtist = args.albumArtist;

  const maxSql = `
    SELECT MAX(AlbumId)+1 AS AlbumId FROM Album;
  `;

  db.retrieveRowByFields(maxSql, [])
    .then(x => {
      const sql = `
        INSERT INTO Album (AlbumId, Title, ArtistId)
        VALUES (?, ?, ?);
      `;

      db.runSql(sql, [x.AlbumId, albumName, albumArtist]);
    })
};

const deleteAlbum = (args) => {
  const albumId = args.albumId;

  const sql = `
    DELETE FROM Album WHERE AlbumId = ?;
  `;

  db.runSql(sql, [albumId]);
};

const setGenre = (args) => {
  const genreId = args.genreId;
  const genreName = args.genreName;

  if (genreId) {
    updateGenre(genreId, genreName);
  } else {
    if (addGenre(genreName)) {
      
    }
  }
}

const updateGenre = (genreId, genreName) => {
  const sql = `
    UPDATE Genre
    SET Name = ?
    WHERE GenreId = ?;
    `;

  return db.runSql(sql, [genreName, genreId]);
}

const addGenre = (genreName) => {
  const maxSql = `
    SELECT MAX(GenreID)+1 as GenreId FROM Genre;
  `;

  const i = db.retrieveRowByFields(maxSql, [])
    .then(x => {

      const sql = `
        INSERT INTO Genre (GenreId, Name)
        VALUES (
          ?, ?);
      `;

      db.runSql(sql, [x.GenreId, genreName.genreName]);
    });
}

const deleteGenre = (args) => {
  const genreId = args.genreId;
  const sql = `
    DELETE FROM Genre WHERE GenreId=?;
  `;

  db.runSql(sql, [genreId]);
}

// Root resolver
const root = {
  getAlbums: retrieveAlbums,
  getAlbum: retrieveAlbum,
  getAlbumsByArtist: retrieveAlbumsByArtist,
  setAlbum: setAlbum,
  addAlbum: addAlbum,
  deleteAlbum: deleteAlbum,

  getArtists: retrieveArtists,
  getArtist: retrieveArtist,
  setArtist: setArtist,
  addArtist: addArtist,
  deleteArtist: deleteArtist,

  getCustomers: retrieveCustomers,
  getCustomer: retrieveCustomer,

  getEmployees: retrieveEmployees,
  getEmployee: retrieveEmployee,

  getGenres: retrieveGenres,
  getGenre: retrieveGenre,
  addGenre: addGenre,
  setGenre: setGenre,
  deleteGenre: deleteGenre,

  getInvoice: retrieveInvoice,
  getInvoiceByCustomer: retrieveInvoicesByCustomer,
  getInvoiceLines: retrieveInvoiceLines,

  getMediaTypes: retrieveMediaTypes,
  getMediaType: retrieveMediaType,

  getPlaylists: retrievePlaylists,
  getPlaylist: retrievePlaylist,
  getPlaylistTracks: retrievePlaylistTracks,
  getTrackPlaylists: retrieveTrackPlaylists,

  getTracks: retrieveTracks,
  getTrack: retrieveTrack,
  getTracksByAlbum: retrieveTracksByAlbum,
  getTracksByMediaType: retrieveTracksByMediaType,
  getTracksByGenre: retrieveTracksByGenre
};

var app = express();
app.use(cors());
app.use('/graphql', graphqlHTTP.graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));
app.listen(4000, () => console.log('Now browse to localhost:4000/graphql'));


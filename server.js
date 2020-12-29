const express = require('express');
const graphqlHTTP = require('express-graphql');
const { buildSchema } = require('graphql');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

let db = new sqlite3.Database('chinook.db', (err) => {
  if (err) {
    console.error(err.message);
  }

  console.log('Opened database');
});

// Schema
const schema = buildSchema(`
  type Query {
    getAlbums: [Album],
    getAlbum(albumId: Int!): Album,
    getAlbumsByArtist(artistId: Int!): [Album],

    getArtists: [Artist],
    getArtist(artistId: Int!): Artist,

    getCustomers: [Customer],
    getCustomer(customerId: Int!): Customer,

    getEmployees: [Employee],
    getEmployee(employeeId: Int!): Employee,

    getGenres: [Genre],
    getGenre(genreId: Int!): Genre,

    getInvoice(invoiceId: Int!): Invoice,
    getInvoiceByCustomer(customerId: Int!): [Invoice]
    getInvoiceLines(invoiceId: Int!): [InvoiceLine]

    getMediaTypes: [MediaType]
    getMediaType(mediaTypeId: Int!): MediaType

    getPlaylists: [Playlist]
    getPlaylist(playListId: Int!): Playlist

    getPlaylistTracks(playListId: Int!): [PlaylistTrack]
    getTrackPlaylists(trackId: Int!): [PlaylistTrack]

    getTracks: [Track]
    getTrack(trackId: Int!): Track
    getTracksByAlbum(albumId: Int!): [Track]
    getTracksByMediaType(mediaTypeId: Int!): [Track]
    getTracksByGenre(genreId: Int!): [Track]
  },
  type Mutation {
    setGenre(genreId: Int, genreName: String!): Genre
    addGenre(genreName: String!): Genre
    deleteGenre(genreId: Int!) : Int
  }
  type Album {
    AlbumId: Int
    Title: String
    ArtistId: Int
    ArtistName: String
  },
  type Artist {
    ArtistId: Int
    Name: String
  },
  type Customer {
    CustomerId: Int
    FirstName: String
    LastName: String
    Company: String
    Address: String
    City: String
    State: String
    Country: String
    PostalCode: String
    Phone: String
    Fax: String
    Email: String
    SupportRepId: String
    SupportRepFirstName: String
    SupportRepLastName: String
  },
  type Genre {
    GenreId: Int
    Name: String
  }
  type Employee {
    EmployeeId: Int
    LastName: String
    FirstName: String
    Title: String
    ReportsTo: Int
    BirthDate: String
    HireDate: String
    Address: String
    City: String
    State: String
    Country: String
    PostalCode: String
    Phone: String
    Fax: String
    Email: String
    ReportsToFirstName: String
    ReportsToLastName: String
  },
  type Invoice {
    InvoiceId: Int
    CustomerId: Int
    InvoiceDate: String
    BillingAddress: String
    BillingCity: String
    BillingState: String
    BillingCountry: String
    BillingPostalCode: String
    Total: Float
  }
  type InvoiceLine {
    InvoiceLineId: Int
    InvoiceId: Int
    TrackId: Int
    UnitPrice: Float
    Quantity: Int
    TrackName: String
  }
  type MediaType {
    MediaTypeId: Int
    Name: String
  }
  type Playlist {
    PlaylistId: Int
    Name: String
  }
  type PlaylistTrack {
    PlaylistId: Int
    Track: Int
  }
  type Track {
    TrackId: Int
    Name: String
    AlbumId: Int
    MediaTypeId: Int
    GenreId: Int
    Composer: String
    Milliseconds: Int
    Bytes: Int
    UnitPrice: Float
    AlbumTitle: String
    MediaTypeName: String
    GenreName: String
  }
`);


const retrieveAlbums = (args) => {
  const sql = 'SELECT * FROM Album ORDER BY Title';
  return retrieveList(sql);
}

const retrieveArtists = (args) => {
  const sql = 'SELECT * FROM Artist ORDER BY Name';
  return retrieveList(sql);
}

const retrieveCustomers = (args) => {
  const sql = 'SELECT * FROM Customer';
  return retrieveList(sql);
}

const retrieveEmployees = (args) => {
  const sql = 'SELECT * FROM Employee';
  return retrieveList(sql);
}

const retrieveMediaTypes = (args) => {
  const sql = 'SELECT * FROM MediaType';
  return retrieveList(sql);
}

const retrievePlaylists = (args) => {
  const sql = 'SELECT * FROM Playlist';
  return retrieveList(sql);
}

const retrieveGenres = (args) => {
  const sql = 'SELECT * FROM Genre';
  return retrieveList(sql);
}

const retrieveTracks = (args) => {
  const sql = 'SELECT * FROM Track';
  return retrieveList(sql);
}

const retrieveList = (sql) => retrieveListByFields(sql, []);

const retrieveAlbumsByArtist = (args) => {
  const sql = 'SELECT * FROM Album WHERE ArtistId = ?';
  const id = args.artistId;
  return retrieveListByFields(sql, [id]);
}

const retrieveInvoicesByCustomer = (args) => {
  const sql = 'SELECT * FROM Invoice WHERE CustomerId = ?';
  const id = args.customerId;

  return retrieveListByFields(sql, [id]);
}

const retrieveInvoiceLines = (args) => {
  const sql = `
    SELECT il.*, t.Name AS TrackName
    FROM InvoiceLine il
    JOIN Track t ON il.TrackId=t.TrackId
    WHERE il.InvoiceId = ?`;
  const id = args.invoiceId;

  return retrieveListByFields(sql, [id]);
}

const retrievePlaylistTracks = (args) => {
  const sql = 'SELECT * FROM PlaylistTrack WHERE PlaylistId = ?';
  const id = args.playListId;

  return retrieveListByFields(sql, [id]);
}

const retrieveTrackPlaylists = (args) => {
  const sql = 'SELECT * FROM PlaylistTrack WHERE TrackId = ?';
  const id = args.trackId;

  return retrieveListByFields(sql, [id]);
}

const retrieveTracksByAlbum = (args) => {
  const sql = 'SELECT * FROM Track WHERE AlbumId = ?';
  const id = args.albumId;

  return retrieveListByFields(sql, [id]);
}

const retrieveTracksByGenre = (args) => {
  const sql = 'SELECT * FROM Track WHERE GenreId = ?';
  const id = args.genreId;

  return retrieveListByFields(sql, [id]);
}

const retrieveTracksByMediaType = (args) => {
  const sql = 'SELECT * FROM Track WHERE MediaTypeId = ?';
  const id = args.mediaTypeId;

  return retrieveListByFields(sql, [id]);
}

const retrieveListByFields = (sql, fields) => {
  const p = new Promise((resolve, reject) => {
    db.all(sql, fields, (err, rows) => {

      if (err) {
        reject(err);
      }

      resolve(rows);
    });
  });

  return p;
}

const retrieveAlbum = (args) => {
  const sql = `
  SELECT Album.*, Artist.Name AS ArtistName
  FROM Album 
  JOIN Artist ON Album.ArtistId=Artist.ArtistId
  WHERE Album.AlbumId = ?`;
  const id = args.albumId;

  return retrieveRowByFields(sql, [id]);
}

const retrieveArtist = (args) => {
  const sql = 'SELECT * FROM Artist WHERE ArtistId = ?';
  const id = args.artistId;

  return retrieveRowByFields(sql, [id]);
}

const retrieveCustomer = (args) => {
  const sql = `
    SELECT c.*, e.FirstName AS SupportRepFirstName, e.LastName AS SupportRepLastName
    FROM Customer c
    LEFT JOIN Employee e ON c.SupportRepId=e.EmployeeId
    WHERE c.CustomerId = ?`;
  const id = args.customerId;

  return retrieveRowByFields(sql, [id]);
}

const retrieveEmployee = (args) => {
  const sql = `
    SELECT e1.*, e2.FirstName as ReportsToFirstName, e2.LastName as ReportsToLastName 
    FROM Employee AS e1
    LEFT JOIN Employee AS e2 ON e1.ReportsTo=e2.EmployeeId
    WHERE e1.EmployeeId = ?`;
  const id = args.employeeId;

  return retrieveRowByFields(sql, [id]);
}

const retrieveGenre = (args) => {
  const sql = 'SELECT * FROM Genre WHERE GenreId = ?';
  const id = args.genreId;

  return retrieveRowByFields(sql, [id]);
}

const retrieveInvoice = (args) => {
  const sql = 'SELECT * FROM Invoice WHERE InvoiceId = ?';
  const id = args.invoiceId;

  return retrieveRowByFields(sql, [id]);
}

const retrieveMediaType = (args) => {
  const sql = 'SELECT * FROM MediaType WHERE MediaTypeId = ?';
  const mediaTypeId = args.mediaTypeId;
  return retrieveRowByFields(sql, mediaTypeId);
}

const retrievePlaylist = (args) => {
  const sql = 'SELECT * FROM Playlist WHERE PlaylistId = ?';
  const playListId = args.playListId;
  return retrieveRowByFields(sql, playListId);
} 

const retrieveTrack = (args) => {
  const sql = `
    SELECT t.*, a.Title AS AlbumTitle, mt.Name as MediaTypeName, g.Name as GenreName
    FROM Track t
    JOIN Album a ON t.AlbumId=a.AlbumId
    JOIN MediaType mt ON t.MediaTypeId=mt.MediaTypeId
    JOIN Genre g ON t.GenreId=g.GenreId
    WHERE t.TrackId = ?`;
  const trackId = args.trackId;
  return retrieveRowByFields(sql, trackId);
}

const retrieveRowByFields = (sql, fields) => {
  const p = new Promise((resolve, reject) => {
    db.get(sql, fields, (err, row) => {
      if (err) {
        reject(err);
      }

      resolve(row);
    })
  });

  return p;
}

const setGenre = (args) => {
  const genreId = args.genreId;
  const genreName = args.genreName;

  if (genreId) {
    if (updateGenre(genreId, genreName)) {
      return retrieveGenre({ genreId: genreId});
    }
  } else {
    if (addGenre(genreName)) {
      
    }
  }
}

const updateGenre = (genreId, genreName) => {
  const sql = `
    UPDATE Genre
    SET Name = ?
    WHERE GenreID = ?;
    `;

  return runSql(sql, [genreId, genreName]);
}

const addGenre = (genreName) => {
  const maxSql = `
    SELECT MAX(GenreID)+1 as GenreId FROM Genre;
  `
  const i = retrieveRowByFields(maxSql, [])
    .then(x => {

      const sql = `
        INSERT INTO Genre (GenreId, Name)
        VALUES (
          ?, ?);
      `;

      runSql(sql, [x.GenreId, genreName.genreName]);
    });
}

const deleteGenre = (args) => {
  const genreId = args.genreId;
  const sql = `
    DELETE FROM Genre WHERE GenreId=?;
  `;

  runSql(sql, [genreId]);
}

const runSql = (sql, params) => {
  const p = new Promise((resolve, reject) => {
    db.run(sql, params, (err) =>  {

      if (err) {
        reject(err);
      }
    });
  });
  return p;
}

// Root resolver
const root = {
  getAlbums: retrieveAlbums,
  getAlbum: retrieveAlbum,
  getAlbumsByArtist: retrieveAlbumsByArtist,

  getArtists: retrieveArtists,
  getArtist: retrieveArtist,

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


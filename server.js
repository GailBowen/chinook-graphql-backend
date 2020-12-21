const express = require('express');
const graphqlHTTP = require('express-graphql');
const { buildSchema } = require('graphql');
const sqlite3 = require('sqlite3').verbose();

let db = new sqlite3.Database('chinook.db', (err) => {
  if (err) {
    console.error(err.message);
  }

  console.log('Opened database');
});

// Schema
const schema = buildSchema(`
  type Query {
    albums: [Album],
    getAlbum(albumId: Int!): Album,
    getArtists: [Artist],
    getArtist(artistId: Int!): Artist
  },
  type Album {
    AlbumId: Int
    Title: String
    ArtistId: Int
  },
  type Artist {
    ArtistId: Int
    Name: String
  }
`);


const retrieveAlbums = (args) => {
  const sql = 'SELECT * FROM Album';
  return retrieveList(sql);
}

const retrieveArtists = (args) => {
  const sql = 'SELECT * FROM Artist';
  return retrieveList(sql);
}

const retrieveList = (sql) => {
  const p = new Promise((resolve, reject) => {
    db.all(sql, [], (err, rows) => {

      if (err) {
        reject(err);
      }

      resolve(rows);
    });
  });

  return p;

}

const retrieveAlbum = (args) => {
  const sql = 'SELECT * FROM Album WHERE AlbumId = ?';
  const id = args.albumId;

  return retrieveRowByFields(sql, [id]);
}

const retrieveArtist = (args) => {
  const sql = 'SELECT * FROM Artist WHERE ArtistId = ?';
  const id = args.artistId;

  return retrieveRowByFields(sql, [id]);
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

// Root resolver
const root = {
  albums: retrieveAlbums,
  getAlbum: retrieveAlbum,
  getArtists: retrieveArtists,
  getArtist: retrieveArtist
};

var app = express();
app.use('/graphql', graphqlHTTP.graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));
app.listen(4000, () => console.log('Now browse to localhost:4000/graphql'));


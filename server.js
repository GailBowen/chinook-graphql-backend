const express = require('express');
const graphqlHTTP = require('express-graphql');
const cors = require('cors');

const { schema } = require('./schema.js');
const { Db } = require('./Db.js');
const { Album } = require('./Album.js');
const { Artist } = require('./Artist.js');
const { Customer } = require('./Customer.js');
const { Employee } = require('./Employee.js');
const { MediaType } = require('./MediaType.js');
const { Playlist } = require('./Playlist.js');
const { Genre } = require('./Genre.js');
const { Track } = require('./Track.js');
const { Invoice } = require('./Invoice.js');
const { InvoiceLine } = require('./InvoiceLine.js');
const { PlaylistTrack } = require('./PlaylistTrack.js');
const { SpotifyLink } = require('./SpotifyLink.js');

const db = new Db();
const album = new Album(db);
const artist = new Artist(db);
const customer = new Customer(db);
const employee = new Employee(db);
const mediaType = new MediaType(db);
const playlist = new Playlist(db);
const genre = new Genre(db);
const track = new Track(db);
const invoice = new Invoice(db);
const invoiceLine = new InvoiceLine(db);
const playlistTrack = new PlaylistTrack(db);
const spotifyLink = new SpotifyLink(db);

// Root resolver
const root = {
  getAlbums: () => album.retrieveAlbums(),
  getAlbum: (args) => album.retrieveAlbum(args),
  getAlbumsByArtist: (args) => album.retrieveAlbumsByArtist(args),
  setAlbum: (args) => album.setAlbum(args),
  addAlbum: (args) => album.addAlbum(args),
  deleteAlbum: (args) => album.deleteAlbum(args),

  getArtists: () => artist.retrieveArtists(),
  getArtist: (args) => artist.retrieveArtist(args),
  getArtistByName: (args) => artist.retrieveArtistByName(args),
  setArtist: (args) => artist.setArtist(args),
  addArtist: (args) => artist.addArtist(args),
  deleteArtist: (args) => artist.deleteArtist(args),

  getCustomers: () => customer.retrieveCustomers(),
  getCustomer: (args) => customer.retrieveCustomer(args),
  setCustomer: (args) => customer.setCustomer(args),
  addCustomer: (args) => customer.addCustomer(args),
  deleteCustomer: (args) => customer.deleteCustomer(args),

  getEmployees: () => employee.retrieveEmployees(),
  getEmployee: (args) => employee.retrieveEmployee(args),

  getGenres: () => genre.retrieveGenres(),
  getGenre: (args) => genre.retrieveGenre(args),
  addGenre: (args) => genre.addGenre(args),
  setGenre: (args) => genre.setGenre(args),
  deleteGenre: (args) => genre.deleteGenre(args),

  getInvoice: (args) => invoice.retrieveInvoice(args),
  getInvoiceByCustomer: (args) => invoice.retrieveInvoicesByCustomer(args),
  getInvoiceLines: (args) => invoiceLine.retrieveInvoiceLines(args),

  getMediaTypes: () => mediaType.retrieveMediaTypes(),
  getMediaType: (args) => mediaType.retrieveMediaType(args),

  getPlaylists: () => playlist.retrievePlaylists(),
  getPlaylist: (args) => playlist.retrievePlaylist(args),
  getPlaylistTracks: (args) => playlistTrack.retrievePlaylistTracks(args),
  getTrackPlaylists: (args) => playlistTrack.retrieveTrackPlaylists(args),

  getTracks: () => track.retrieveTracks(),
  getTrack: (args) => track.retrieveTrack(args),
  getTracksByAlbum: (args) => track.retrieveTracksByAlbum(args),
  getTracksByMediaType: (args) => track.retrieveTracksByMediaType(args),
  getTracksByGenre: (args) => track.retrieveTracksByGenre(args),

  getSpotifyLinks: () => spotifyLink.retrieveLinks(),
  getSpotifyLink: (args) => spotifyLink.retrieveLink(args),

};

var app = express();
app.use(cors());
app.use('/graphql', graphqlHTTP.graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));
app.listen(4000, () => console.log('Now browse to localhost:4000/graphql'));


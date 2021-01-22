const { buildSchema } = require('graphql');

exports.schema = buildSchema(`
  type Query {
    getAlbums: [Album],
    getAlbum(albumId: Int!): Album,
    getAlbumsByArtist(artistId: Int!): [Album],

    getArtists: [Artist],
    getArtist(artistId: Int!): Artist,
    getArtistByName(name: String!): Artist,

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

    getSpotifyLinks: [SpotifyLink]
    getSpotifyLink(spotifyLinkId: Int!): SpotifyLink
  },
  type Mutation {
    setGenre(genreId: Int, genreName: String!): Genre
    addGenre(genreName: String!): Genre
    deleteGenre(genreId: Int!) : Int

    setArtist(artistId: Int, artistName: String!): Artist
    addArtist(artistName: String!): Artist
    deleteArtist(artistId: Int!): Int

    setAlbum(albumId: Int, albumName: String!, albumArtist: Int!) : Album
    addAlbum(albumName: String!, albumArtist: Int!) : Album
    deleteAlbum(albumId: Int!) : Int


    setCustomer(customerId: Int!, firstName: String!, lastName: String!, address: String!, 
      city: String!, state: String!, postalCode: String!, country: String!, email: String!, 
      supportRepId: Int!) : Customer

    addCustomer(firstName: String!, lastName: String!, address: String!, 
      city: String!, state: String!, postalCode: String!, country: String!, email: String!,
      supportRepId: Int!) : Customer

    deleteCustomer(customerId: Int!) : Int
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
    SupportRepId: Int
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
    TrackId: Int
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
    ArtistId: Int
    ArtistName: String
  }
  type SpotifyLink {
    SpotifyLinkId: Int
    Description: String
    Link: String
  },
`);


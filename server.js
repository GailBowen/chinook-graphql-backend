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
  },
  type Album {
    AlbumId: Int
    Title: String
    ArtistId: Int
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
  }
  type MediaType {
    MediaTypeId: Int
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

const retrieveGenres = (args) => {
  const sql = 'SELECT * FROM Genre';
  return retrieveList(sql);
}

const retrieveList = (sql) => retrieveListByFields(sql, []);

const retrieveInvoicesByCustomer = (args) => {
  const sql = 'SELECT * FROM Invoice WHERE CustomerId = ?';
  const id = args.customerId;

  return retrieveListByFields(sql, [id]);
}

const retrieveInvoiceLines = (args) => {
  const sql = 'SELECT * FROM InvoiceLine WHERE InvoiceId = ?';
  const id = args.invoiceId;

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
  const sql = 'SELECT * FROM Album WHERE AlbumId = ?';
  const id = args.albumId;

  return retrieveRowByFields(sql, [id]);
}

const retrieveArtist = (args) => {
  const sql = 'SELECT * FROM Artist WHERE ArtistId = ?';
  const id = args.artistId;

  return retrieveRowByFields(sql, [id]);
}

const retrieveCustomer = (args) => {
  const sql = 'SELECT * FROM Customer WHERE CustomerId = ?';
  const id = args.customerId;

  return retrieveRowByFields(sql, [id]);
}

const retrieveEmployee = (args) => {
  const sql = 'SELECT * FROM Employee WHERE EmployeeId = ?';
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
  getArtist: retrieveArtist,
  getCustomers: retrieveCustomers,
  getCustomer: retrieveCustomer,
  getEmployees: retrieveEmployees,
  getEmployee: retrieveEmployee,
  getGenres: retrieveGenres,
  getGenre: retrieveGenre,
  getInvoice: retrieveInvoice,
  getInvoiceByCustomer: retrieveInvoicesByCustomer,
  getInvoiceLines: retrieveInvoiceLines,
  getMediaTypes: retrieveMediaTypes
};

var app = express();
app.use('/graphql', graphqlHTTP.graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));
app.listen(4000, () => console.log('Now browse to localhost:4000/graphql'));


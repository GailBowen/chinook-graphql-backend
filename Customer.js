class Customer {
  constructor(db) {
    this.db = db;
  }

  retrieveCustomers(args) {
    const sql = 'SELECT * FROM Customer ORDER BY LastName';
    return this.db.retrieveList(sql);
  }

  retrieveCustomer(args) {
    const id = args.customerId;

    const sql = `
      SELECT c.*, e.FirstName AS SupportRepFirstName, e.LastName AS SupportRepLastName
      FROM Customer c
      LEFT JOIN Employee e ON c.SupportRepId=e.EmployeeId
      WHERE c.CustomerId = ?`;

    return this.db.retrieveRowByFields(sql, [id]);
  }

  setCustomer(args) {
    const customerId = args.customerId;
    const firstName = args.firstName;
    const lastName = args.lastName;
    const address = args.address;
    const city = args.city;
    const state = args.state;
    const postalCode = args.postalCode;
    const country = args.country;
    const email = args.email;
    const supportRepId = args.supportRepId;
    
    const sql = `
      UPDATE Customer
      SET FirstName = ?, LastName = ?, Address = ?, City = ?, State = ?, PostalCode = ?, 
        Country = ?, Email = ?, SupportRepId = ?
      WHERE CustomerId = ?;
    `;

    return this.db.runSql(
      sql,
      [firstName, lastName, address, city, state, postalCode, country, email, supportRepId, customerId]);
  }

  addCustomer(args) {
    const firstName = args.firstName;
    const lastName = args.lastName;
    const address = args.address;
    const city = args.city;
    const state = args.state;
    const postalCode = args.postalCode;
    const country = args.country;
    const email = args.email;
    const supportRepId = args.supportRepId;
    
    const maxSql = 'SELECT MAX(CustomerId)+1 AS CustomerId FROM Customer;';

    this.db.retrieveRowByFields(maxSql, [])
      .then((x) => {

        const sql = `
          INSERT INTO Customer (CustomerId, FirstName, LastName, Address, City, State, PostalCode, Country, Email, 
            SupportRepId)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
        `

        this.db.runSql(
          sql, 
          [x.CustomerId, firstName, lastName, address, city, state, postalCode, country, email, supportRepId]);
      });
  }

  deleteCustomer(args) {
    const customerId = args.customerId;

    const sql = `
      DELETE FROM Customer WHERE CustomerId = ?;
    `;

    this.db.runSql(sql, [customerId]);
  }
}

exports.Customer = Customer;

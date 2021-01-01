class Customer {
  constructor(db) {
    this.db = db;
  }

  retrieveCustomers(args) {
    const sql = 'SELECT * FROM Customer ORDER BY LastName';
    return this.db.retrieveList(sql);
  }

  retrieveCustomer(args) {
    const sql = `
      SELECT c.*, e.FirstName AS SupportRepFirstName, e.LastName AS SupportRepLastName
      FROM Customer c
      LEFT JOIN Employee e ON c.SupportRepId=e.EmployeeId
      WHERE c.CustomerId = ?`;
    const id = args.customerId;

    return this.db.retrieveRowByFields(sql, [id]);
  }
}

exports.Customer = Customer;

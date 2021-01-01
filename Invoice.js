class Invoice {
  constructor(db) {
    this.db = db;
  }

  retrieveInvoicesByCustomer(args) {
    const sql = 'SELECT * FROM Invoice WHERE CustomerId = ?';
    const id = args.customerId;

    return this.db.retrieveListByFields(sql, [id]);
  }

  retrieveInvoice(args) {
    const sql = 'SELECT * FROM Invoice WHERE InvoiceId = ?';
    const id = args.invoiceId;

    return this.db.retrieveRowByFields(sql, [id]);
  }
}

exports.Invoice = Invoice;

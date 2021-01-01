class InvoiceLine {
  constructor(db) {
    this.db = db;
  }

  retrieveInvoiceLines(args) {
    const sql = `
      SELECT il.*, t.Name AS TrackName
      FROM InvoiceLine il
      JOIN Track t ON il.TrackId=t.TrackId
      WHERE il.InvoiceId = ?`;
    const id = args.invoiceId;

    return this.db.retrieveListByFields(sql, [id]);
  }
}

exports.InvoiceLine = InvoiceLine;

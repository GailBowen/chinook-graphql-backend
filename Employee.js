class Employee {
  constructor(db) {
    this.db = db;
  }

  retrieveEmployees(args) {
    const sql = 'SELECT * FROM Employee ORDER BY LastName';
    return this.db.retrieveList(sql);
  }

  retrieveEmployee(args) {
    const sql = `
      SELECT e1.*, e2.FirstName as ReportsToFirstName, e2.LastName as ReportsToLastName 
      FROM Employee AS e1
      LEFT JOIN Employee AS e2 ON e1.ReportsTo=e2.EmployeeId
      WHERE e1.EmployeeId = ?`;
    const id = args.employeeId;

    return this.db.retrieveRowByFields(sql, [id]);
  }
}

exports.Employee = Employee;

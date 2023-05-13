INSERT INTO departments (name)
VALUES ("Productions"),
        ("Marketing"),
        ("Sales");

INSERT INTO roles (title, salary, department_id)
VALUES ("Head of Productions", 105000.00, 1),
        ("Productions Associate", 95000.00, 1),
        ("Head of Marketing", 120000.00, 2),
        ("Marketing Associate", 100000.00, 2),
        ("Head of Sales", 110000.00, 3),
        ("Sales Associate", 80000.00, 3);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES ("John", "Neilsen", 5, NULL),
        ("Kevin", "Naylor", 1, NULL),
        ("Emily", "Shaw", 3, NULL),
        ("Jenna", "Hanson", 2, 1),
        ("Steven", "Kerr", 4, 3),
        ("Eric", "Roth", 6, 2);
        

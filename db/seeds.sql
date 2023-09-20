INSERT INTO departments (departmentName)
VALUES ("sales"),
        ("implementation"),
        ("IT"),
        ("customer service");

INSERT INTO roles (title,salary,department_id)
VALUES  ("sales Rep", 40.00, 1),
        ("support Rep", 50.00, 4),
        ("tech support", 30.00, 3),
        ("rep", 45.00, 4),
        ("Advanced support", 65.00, 2);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES  ("mike", "jackson", 2, NULL),
        ("jake", "Roberto", 4, 1),
        ("bob", "Marks", 1, 1);

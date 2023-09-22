INSERT INTO departments (departmentName)
VALUES ("sales"),
        ("implementation"),
        ("IT"),
        ("customer service");

INSERT INTO roles (title,salary,department_id)
VALUES  ("sales Rep", 4000, 1),
        ("support Rep", 5000, 4),
        ("tech support", 3000, 3),
        ("rep", 4500, 4),
        ("Advanced support", 6500, 2);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES  ("mike", "jackson", 2, NULL),
        ("jake", "Rifkin", 4, 1),
        ("bob", "Marks", 1, 1);

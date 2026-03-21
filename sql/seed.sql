-- Tabla usuarios
CREATE TABLE IF NOT EXISTS usuarios (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100),
  email VARCHAR(100) UNIQUE,
  telefono VARCHAR(20)
);

-- 15 registros
INSERT INTO usuarios (nombre, email, telefono) VALUES
('Juan Perez', 'juan1@gmail.com', '99990001'),
('Maria Lopez', 'maria2@gmail.com', '99990002'),
('Carlos Gomez', 'carlos3@gmail.com', '99990003'),
('Ana Torres', 'ana4@gmail.com', '99990004'),
('Luis Martinez', 'luis5@gmail.com', '99990005'),
('Sofia Ramirez', 'sofia6@gmail.com', '99990006'),
('Pedro Sanchez', 'pedro7@gmail.com', '99990007'),
('Laura Diaz', 'laura8@gmail.com', '99990008'),
('Diego Herrera', 'diego9@gmail.com', '99990009'),
('Elena Castro', 'elena10@gmail.com', '99990010'),
('Miguel Vargas', 'miguel11@gmail.com', '99990011'),
('Paula Rojas', 'paula12@gmail.com', '99990012'),
('Andres Mejia', 'andres13@gmail.com', '99990013'),
('Lucia Flores', 'lucia14@gmail.com', '99990014'),
('Fernando Cruz', 'fernando15@gmail.com', '99990015');
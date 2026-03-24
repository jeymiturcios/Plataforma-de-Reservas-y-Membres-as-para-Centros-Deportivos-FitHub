INSERT INTO persona (
  nombre,
  correo,
  fecha_nacimiento,
  telefono,
  dir_departamento,
  dir_ciudad,
  dir_colonia,
  dir_calle_ave
)
VALUES
('Elmer Izaguirre', 'elmer1@gmail.com', '2005-06-05', '90000001', 'Francisco Morazan', 'Tegucigalpa', 'Palmira', 'Avenida La Paz'),
('Carlos Perez', 'carlos2@gmail.com', '2000-01-10', '90000002', 'Cortes', 'San Pedro Sula', 'Colonia Centro', '3 Avenida'),
('Maria Lopez', 'maria3@gmail.com', '1999-02-15', '90000003', 'Atlantida', 'La Ceiba', 'Barrio Ingles', 'Calle 8'),
('Juan Torres', 'juan4@gmail.com', '2001-03-20', '90000004', 'Olancho', 'Juticalpa', 'Colonia Moderna', 'Avenida Principal'),
('Ana Martinez', 'ana5@gmail.com', '2002-04-25', '90000005', 'Choluteca', 'Choluteca', 'Barrio Abajo', '2 Calle'),
('Luis Ramirez', 'luis6@gmail.com', '1998-05-18', '90000006', 'Yoro', 'El Progreso', 'Colonia San Jose', '5 Avenida'),
('Sofia Castro', 'sofia7@gmail.com', '2003-07-12', '90000007', 'Comayagua', 'Comayagua', 'Residencial Santa Lucia', 'Boulevard Centro'),
('Pedro Gomez', 'pedro8@gmail.com', '1997-08-30', '90000008', 'Cortes', 'Puerto Cortes', 'Barrio El Faro', '1 Avenida');

INSERT INTO cliente (persona_id, fecha_registro, estado_cliente)
SELECT persona_id, CURRENT_DATE, 'activo'
FROM persona
WHERE correo IN (
  'elmer1@gmail.com',
  'carlos2@gmail.com',
  'maria3@gmail.com',
  'juan4@gmail.com',
  'ana5@gmail.com'
);

INSERT INTO entrenador (persona_id, especialidad, fecha_contratacion, estado_entrenador)
SELECT persona_id, 'Funcional', CURRENT_DATE, 'activo'
FROM persona
WHERE correo = 'luis6@gmail.com';

INSERT INTO sede (
  nombre_sede,
  telefono_sede,
  horario_apertura,
  dir_ciudad,
  dir_colonia,
  dir_calle_ave
)
VALUES
('FitHub Central', '22223333', '06:00:00', 'Tegucigalpa', 'Palmira', 'Avenida La Paz');

--1) Tabla Persona
CREATE TABLE IF NOT EXISTS persona(
  persona_id BIGSERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  correo VARCHAR(120) NOT NULL UNIQUE,
  fecha_nacimiento DATE NOT NULL,
  telefono VARCHAR(20),
--DIRECCION: Atributo Compuesto
  dir_departamento VARCHAR(60) NOT NULL,
  dir_ciudad  VARCHAR(60) NOT NULL,
  dir_colonia VARCHAR(60) NOT NULL,
  dir_calle_ave VARCHAR(120) NOT NULL,
  creado_en TIMESTAMP NOT NULL DEFAULT NOW()
);

--2) Supertipo Cliente (Heredad de Persona)
CREATE TABLE IF NOT EXISTS cliente(
  persona_id BIGINT PRIMARY KEY,
  fecha_registro DATE NOT NULL DEFAULT CURRENT_DATE,
  estado_cliente VARCHAR(20) NOT NULL DEFAULT 'Activo',
  CONSTRAINT fk_cliente_persona FOREIGN KEY (persona_id)
  REFERENCES persona(persona_id) ON DELETE CASCADE
);

--3) SUBTIPO ENTRENADOR
CREATE TABLE IF NOT EXISTS entrenador(
 persona_id BIGINT PRIMARY KEY,
 especialidad VARCHAR(120) NOT NULL,
 fecha_contratacion DATE NOT NULL,
 estado_entrenador VARCHAR(20) NOT NULL DEFAULT 'Activo',
 CONSTRAINT fk_entrenador_personaa FOREIGN KEY (persona_id)
 REFERENCES persona(persona_id) ON DELETE CASCADE
);

--4) SEDE
CREATE TABLE IF NOT EXISTS sede(
  sede_id BIGSERIAL PRIMARY KEY,
  nombre_sede VARCHAR(100) NOT NULL,
  telefono_sede VARCHAR(20),
  horario_apertura TIME NOT NULL,
--DIRECCION DE SEDE: compuesta
  dir_ciudad VARCHAR(60) NOT NULL,
  dir_colonia VARCHAR(60) NOT NULL,
  dir_calle_ave VARCHAR(60) NOT NULL
);

--5) Actividad (Relacion N:1 con Sede y Entrenador)
CREATE TABLE IF NOT EXISTS actividad(
  actividad_id BIGSERIAL PRIMARY KEY,
  sede_id BIGINT NOT NULL,
  entrenador_id BIGINT NOT NULL,
  nombre_actividad VARCHAR(100) NOT NULL,
  tipo_actividad VARCHAR(100) NOT NULL,
  descripcion TEXT,
  cupo_maximo INT NOT NULL CHECK(cupo_maximo> 0),
  costo NUMERIC(10,2) NOT NULL DEFAULT 0.00,
  fecha_hora_inicio TIMESTAMP NOT NULL,
  fecha_hora_fin TIMESTAMP NOT NULL,
  estado_actividad VARCHAR(20) NOT NULL DEFAULT 'Programada',

  CONSTRAINT fk_actividad_sede FOREIGN KEY (sede_id) REFERENCES sede(sede_id),
  CONSTRAINT fk_actividad_entrenador FOREIGN KEY (entrenador_id) REFERENCES entrenador(persona_id)
);

--6) MEMBRESIA (RELACION CON CLIENTE)
CREATE TABLE IF NOT EXISTS membresia(
  membresia_id BIGSERIAL PRIMARY KEY,
  cliente_id BIGINT NOT NULL,
  tipo_plan VARCHAR(50) NOT NULL,
  fecha_inicio DATE NOT NULL,
  fecha_vencimiento DATE NOT NULL,
  estado_membresia VARCHAR(20) NOT NULL,
  CONSTRAINT fk_membresia_cliente FOREIGN KEY (cliente_id) REFERENCES cliente(persona_id)
);

--7) RESERVA (RELACION N:M ENTRE CLIENTE Y ACTIVIDAD)
CREATE TABLE IF NOT EXISTS reserva(
  reserva_id BIGSERIAL PRIMARY KEY,
  cliente_id BIGINT NOT NULL,
  actividad_id BIGINT NOT NULL,
  fecha_reserva TIMESTAMP NOT NULL DEFAULT NOW(),
  precio_aplicado NUMERIC(10,2) NOT NULL,
  estado_reserva VARCHAR(30) NOT NULL DEFAULT 'Creada',
  observacion TEXT,

  CONSTRAINT uq_cliente_reserva UNIQUE (cliente_id, actividad_id, fecha_reserva),
  CONSTRAINT fk_reserva_cliente FOREIGN KEY(cliente_id) REFERENCES cliente(persona_id),
  CONSTRAINT fk_reserva_actividad FOREIGN KEY (actividad_id) REFERENCES actividad(actividad_id)
);

--8) PAGO (ENTIDAD QUE SE RELACIONA CON RESERVA Y MEMBRESIA)
CREATE TABLE IF NOT EXISTS pago(
  pago_id BIGSERIAL PRIMARY KEY,
  reserva_id BIGINT,
  membresia_id BIGINT,
  monto NUMERIC(10,2) NOT NULL CHECK(monto>0),
  fecha_pago VARCHAR(20) NOT NULL,
  metodo_pago VARCHAR(20) NOT NULL,
  tipo_pago VARCHAR(200) NOT NULL,
  referencia VARCHAR(20),

  CONSTRAINT fk_pago_reserva FOREIGN KEY (reserva_id) REFERENCES reserva(reserva_id),
  CONSTRAINT fk_pago_membresia FOREIGN KEY(membresia_id) REFERENCES membresia(membresia_id)
);
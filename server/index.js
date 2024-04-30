const express = require("express");
const app = express();
const cors = require("cors");
const oracledb = require("oracledb");

app.use(cors());
app.use(express.json());

const dbConfig = {
    user: "vet_1",
    password: "1234",
    connectString: "localhost:1521/xe",
    poolMax: 10,
    poolMin: 2,
    poolIncrement: 5,
    poolTimeout: 60,
    queueTimeout: 120000, // Aumenta este valor según sea necesario
};

// Establecemos la conexión
async function initialize() {
    try {
        await oracledb.createPool(dbConfig);
        console.log("Conexión a Oracle establecida");
    } catch (err) {
        console.error("Error al conectar", err);
    }
}

initialize();

// Registrando un cliente
app.post("/create-cliente", async (req, res) => {
    const { nombre, apellido, telefono, direccion_id_direccion } = req.body;

    let connection;

    try {
        connection = await oracledb.getConnection();

        const result = await connection.execute(
            `INSERT INTO cliente (nombre, apellido, telefono, direccion_id_direccion) VALUES (:1, :2, :3, :4)`,
            [nombre, apellido, telefono, direccion_id_direccion],
            { autoCommit: true } // Auto confirmar la transacción
        );
        
        res.json({ mensaje: "Cliente agregado" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error interno del servidor al insertar cliente", detalle: err.message });
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error("Error al cerrar la conexión a Oracle:", err);
            }
        }
    }
});

// Método para obtener clientes

app.get("/obtenerClientes", async (req, res) => {
    let connection;

    try {
        connection = await oracledb.getConnection();
        const result = await connection.execute('select * from cliente');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error interno del servidor al obtener clientes", detalle: err.message });
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error("Error al cerrar la conexión a Oracle:", err);
            }
        }
    }
});



//METODO PARA UPDATE 
app.put("/updateCliente", async (req, res) => {
    let connection;
    const { id_cliente, nombre, apellido, telefono, direccion_id_direccion } = req.body;
    try {
        connection = await oracledb.getConnection();
        const result = await connection.execute(
            'UPDATE cliente SET nombre=:nombre, apellido=:apellido, telefono=:telefono, direccion_id_direccion=:direccion_id_direccion WHERE id_cliente=:id_cliente',
            [nombre, apellido, telefono, direccion_id_direccion, id_cliente],
            { autoCommit: true } // Auto confirmar la transacción
        );
        await connection.commit();

        res.json({ mensaje: "Cliente actualizado" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error interno del servidor al actualizar cliente", detalle: err.message });
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error("Error al cerrar la conexión a Oracle:", err);
            }
        }
    }
});

/**eliminar un cliente */
app.delete("/deleteCliente/:id_cliente", async (req, res) => {
    let connection;
    const id_cliente = req.params.id_cliente;
  
    // Validar que id_cliente sea un número
    if (!id_cliente || isNaN(id_cliente) || id_cliente === '0') {
        console.error('ID del cliente no es un número válido:', id_cliente);
        return res.status(400).json({ error: "ID de cliente no válido" });
      }
  
    try {
      connection = await oracledb.getConnection();
      console.log("ID del cliente a eliminar:", id_cliente);
      const result = await connection.execute(
        'DELETE FROM cliente WHERE id_cliente = :id_cliente',
        { id_cliente: id_cliente },
        { autoCommit: true }
      );
      await connection.commit();
  
      res.json({ mensaje: "Cliente eliminado" });
    } catch (err) {
      console.error(err);
      res
        .status(500)
        .json({
          error: "Error interno del servidor al eliminar cliente",
          detalle: err.message,
        });
    } finally {
      if (connection) {
        try {
          await connection.close();
        } catch (err) {
          console.error("Error al cerrar la conexión a Oracle:", err);
        }
      }
    }
  });
  
  
  
  /*******************MASCOTA *****************/
  /**crear mascota */
  app.post("/create-mascota", async (req, res) => {
    const { nombre, edad, peso, raza_id_raza,cliente_id_cliente } = req.body;

    let connection;

    try {
        connection = await oracledb.getConnection();

        const result = await connection.execute(
            `INSERT INTO mascota (nombre, edad, peso, raza_id_raza,cliente_id_cliente) VALUES (:1, :2, :3, :4, :5)`,
            [nombre, edad, peso, raza_id_raza,cliente_id_cliente],
            { autoCommit: true } // Auto confirmar la transacción
        );
        
        res.json({ mensaje: "mascota agregada" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error interno del servidor al insertar mascota", detalle: err.message });
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error("Error al cerrar la conexión a Oracle:", err);
            }
        }
    }
});
/**obtener mascota */
app.get("/obtenerMascotas", async (req, res) => {
    let connection;

    try {
        connection = await oracledb.getConnection();
        const result = await connection.execute('SELECT m.id_mascota,m.nombre,m.edad,m.peso,m.raza_id_raza,m.cliente_id_cliente,cli.nombre from mascota m join cliente cli on m.cliente_id_cliente = cli.id_cliente');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error interno del servidor al obtener mascota", detalle: err.message });
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error("Error al cerrar la conexión a Oracle:", err);
            }
        }
    }
});
/**editar mascota */

app.put("/updateMascota", async (req, res) => {
    let connection;
    const { id_mascota, nombre, edad, peso, raza_id_raza,cliente_id_cliente } = req.body;
    try {
        connection = await oracledb.getConnection();
        const result = await connection.execute(
            'UPDATE mascota SET nombre=:nombre, edad=:edad, peso=:peso, raza_id_raza=:raza_id_raza, cliente_id_cliente=:cliente_id_cliente WHERE id_mascota=:id_mascota',
            [nombre, edad, peso, raza_id_raza, cliente_id_cliente,id_mascota],
            { autoCommit: true } // Auto confirmar la transacción
        );
        await connection.commit();

        res.json({ mensaje: "Cliente actualizado" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error interno del servidor al actualizar mascota", detalle: err.message });
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error("Error al cerrar la conexión a Oracle:", err);
            }
        }
    }
});

/*eliminar mascota*/
app.delete("/deleteMascota/:id_mascota", async (req, res) => {
    let connection;
    const id_mascota = req.params.id_mascota;
  
    // Validar que id_cliente sea un número
    if (!id_mascota || isNaN(id_mascota) || id_mascota === '0') {
        console.error('ID de las mascota no es un número válido:', id_mascota);
        return res.status(400).json({ error: "ID de la mascota no válido" });
      }
  
    try {
      connection = await oracledb.getConnection();
      console.log("ID de la mascota a eliminar:", id_mascota);
      const result = await connection.execute(
        'DELETE FROM mascota WHERE id_mascota = :id_mascota',
        { id_mascota: id_mascota },
        { autoCommit: true }
      );
      await connection.commit();
  
      res.json({ mensaje: "mascota eliminada" });
    } catch (err) {
      console.error(err);
      res
        .status(500)
        .json({
          error: "Error interno del servidor al eliminar mascota",
          detalle: err.message,
        });
    } finally {
      if (connection) {
        try {
          await connection.close();
        } catch (err) {
          console.error("Error al cerrar la conexión a Oracle:", err);
        }
      }
    }
  });

  /************************************************************** */
  /****citas */
    app.post("/create-cita", async (req, res) => {
        const { fecha, mascota_id_mascota, clinica_id_clinica } = req.body;

        let connection;

        try {
            connection = await oracledb.getConnection();

            const result = await connection.execute(
                `INSERT INTO cita (fecha, mascota_id_mascota, clinica_id_clinica) VALUES (TO_DATE(:1, 'DD-MON-YY'), :2, :3)`,
                [fecha, mascota_id_mascota, clinica_id_clinica],
                { autoCommit: true } // Auto confirmar la transacción
            
            );
            
            res.json({ mensaje: "cita agregada" });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Error interno del servidor al insertar citar", detalle: err.message });
        } finally {
            if (connection) {
                try {
                    await connection.close();
                } catch (err) {
                    console.error("Error al cerrar la conexión a Oracle:", err);
                }
            }
        }
    });
    app.get("/obtenerCitas", async (req, res) => {
        let connection;
    
        try {
            connection = await oracledb.getConnection();
            const result = await connection.execute('SELECT c.id_cita,c.fecha,c.mascota_id_mascota,c.clinica_id_clinica,m.nombre from cita c join mascota m on c.mascota_id_mascota = m.id_mascota');
            res.json(result.rows);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Error interno del servidor al obtener citas", detalle: err.message });
        } finally {
            if (connection) {
                try {
                    await connection.close();
                } catch (err) {
                    console.error("Error al cerrar la conexión a Oracle:", err);
                }
            }
        }
    });

    /**updateCitas */
    app.put("/updateCitas", async (req, res) => {
        let connection;
        const { id_cita, fecha,mascota_id_mascota,clinica_id_clinica} = req.body;
    
        try {
            connection = await oracledb.getConnection();
            const result = await connection.execute(
                `UPDATE cita SET fecha=TO_DATE(:fecha,'DD-MON-YY'),mascota_id_mascota=:mascota_id_mascota,clinica_id_clinica=:clinica_id_clinica WHERE id_cita=:id_cita`,
                [fecha,mascota_id_mascota,clinica_id_clinica,id_cita],
                { autoCommit: true } // Auto confirmar la transacción
            );
            await connection.commit();
    
            res.json({ mensaje: "cita actualizado" });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Error interno del servidor al actualizar cita", detalle: err.message });
        } finally {
            if (connection) {
                try {
                    await connection.close();
                } catch (err) {
                    console.error("Error al cerrar la conexión a Oracle:", err);
                }
            }
        }
    });


    /**************************** */
    /**direcciones**/
    app.get("/obtenerDirecciones", async (req, res) => {
        let connection;
    
        try {
            connection = await oracledb.getConnection();
            const result = await connection.execute('select * from direccion');
            res.json(result.rows);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Error interno del servidor al obtener direcciones", detalle: err.message });
        } finally {
            if (connection) {
                try {
                    await connection.close();
                } catch (err) {
                    console.error("Error al cerrar la conexión a Oracle:", err);
                }
            }
        }
    });
    app.post("/create-direccion", async (req, res) => {
        const {calle,numero_interior,numero_exterior,alcaldia,colonia,cp} = req.body;
        let connection;

        try {
            connection = await oracledb.getConnection();

            const result = await connection.execute(
                `INSERT INTO direccion (calle,numero_interior,numero_exterior,alcaldia,colonia,cp ) VALUES (:1,:2,:3,:4,:5,:6)`,
                [calle,numero_interior,numero_exterior,alcaldia,colonia,cp],
                { autoCommit: true } // Auto confirmar la transacción
            
            );
            
            res.json({ mensaje: "direccion agregada" });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Error interno del servidor al insertar direccion", detalle: err.message });
        } finally {
            if (connection) {
                try {
                    await connection.close();
                } catch (err) {
                    console.error("Error al cerrar la conexión a Oracle:", err);
                }
            }
        }
    });
    app.put("/updateDireccion", async (req, res) => {
        let connection;
        const { id_direccion,calle,numero_interior,numero_exterior,alcaldia,colonia,cp} = req.body;
    
        try {
            connection = await oracledb.getConnection();
            const result = await connection.execute(
                `UPDATE direccion SET calle=:calle,numero_interior=:numero_interior,numero_exterior=:numero_exterior,alcaldia=:alcaldia,colonia=:colonia,cp=:cp where id_direccion=:id_direccion`,
                [calle,numero_interior,numero_exterior,alcaldia,colonia,cp,id_direccion],
                { autoCommit: true } // Auto confirmar la transacción
            );
            await connection.commit();
    
            res.json({ mensaje: "direccion actualizado" });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Error interno del servidor al actualizar direccion", detalle: err.message });
        } finally {
            if (connection) {
                try {
                    await connection.close();
                } catch (err) {
                    console.error("Error al cerrar la conexión a Oracle:", err);
                }
            }
        }
    });
    

    /***************************************************** */
    /**Raza */
    app.get("/obtenerRazas", async (req, res) => {
        let connection;
    
        try {
            connection = await oracledb.getConnection();
            const result = await connection.execute('select * from raza');
            res.json(result.rows);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Error interno del servidor al obtener razas", detalle: err.message });
        } finally {
            if (connection) {
                try {
                    await connection.close();
                } catch (err) {
                    console.error("Error al cerrar la conexión a Oracle:", err);
                }
            }
        }
    });
    app.post("/create-raza", async (req, res) => {
        const {nombre} = req.body;
        let connection;

        try {
            connection = await oracledb.getConnection();

            const result = await connection.execute(
                `INSERT INTO raza (nombre ) VALUES (:1)`,
                [nombre],
                { autoCommit: true } // Auto confirmar la transacción
            
            );
            
            res.json({ mensaje: "raza agregada" });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Error interno del servidor al insertar raza", detalle: err.message });
        } finally {
            if (connection) {
                try {
                    await connection.close();
                } catch (err) {
                    console.error("Error al cerrar la conexión a Oracle:", err);
                }
            }
        }
    });

    app.put("/updateRaza", async (req, res) => {
        let connection;
        const { id_raza,nombre} = req.body;
    
        try {
            connection = await oracledb.getConnection();
            const result = await connection.execute(
                `UPDATE raza SET nombre=:nombre where id_raza=:id_raza`,
                [nombre,id_raza],
                { autoCommit: true } // Auto confirmar la transacción
            );
            await connection.commit();
    
            res.json({ mensaje: "raza actualizado" });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Error interno del servidor al actualizar raza", detalle: err.message });
        } finally {
            if (connection) {
                try {
                    await connection.close();
                } catch (err) {
                    console.error("Error al cerrar la conexión a Oracle:", err);
                }
            }
        }
    });
    
    app.delete("/deleteRaza/:id_raza", async (req, res) => {
        let connection;
        const id_raza = req.params.id_raza;
      
        // Validar que id_cliente sea un número
        if (!id_raza || isNaN(id_raza) || id_raza === '0') {
            console.error('ID de raza  no es un número válido:', id_raza);
            return res.status(400).json({ error: "ID de raza" });
          }
      
        try {
          connection = await oracledb.getConnection();
          console.log("ID del tipo de operacion  a eliminar:", id_raza);
          const result = await connection.execute(
            'DELETE FROM raza WHERE id_raza = :id_raza',
            { id_raza: id_raza },
            { autoCommit: true }
          );
          await connection.commit();
      
          res.json({ mensaje: "tipo de raza eliminado" });
        } catch (err) {
          console.error(err);
          res
            .status(500)
            .json({
              error: "Error interno del servidor al eliminar tipo de raza",
              detalle: err.message,
            });
        } finally {
          if (connection) {
            try {
              await connection.close();
            } catch (err) {
              console.error("Error al cerrar la conexión a Oracle:", err);
            }
          }
        }
      });

      /**diagnostico */
      app.get("/obtenerDiagnosticos", async (req, res) => {
        let connection;
    
        try {
            connection = await oracledb.getConnection();
            const result = await connection.execute('select d.id_diagnostico,d.cita_id_cita,d.diagnostico, m.nombre from diagnostico d join cita c on d.cita_id_cita = c.id_cita join mascota m on c.mascota_id_mascota = m.id_mascota');
    
            // Personaliza los datos antes de enviarlos como respuesta JSON
            const dataToSend = result.rows.map(row => ({
                id_diagnostico: row[0],
                cita_id_cita: row[1],
                diagnostico: row[2],
                nombre: row[3]
                // Asegúrate de agregar solo los campos necesarios y evitar referencias circulares
            }));
    
            res.json(dataToSend);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Error interno del servidor al obtener", detalle: err.message });
        } finally {
            if (connection) {
                try {
                    await connection.close();
                } catch (err) {
                    console.error("Error al cerrar la conexión a Oracle:", err);
                }
            }
        }
    });
    app.post("/create-diagnostico", async (req, res) => {
        const { cita_id_cita , diagnostico} = req.body;

        let connection;

        try {
            connection = await oracledb.getConnection();

            const result = await connection.execute(
                `INSERT INTO diagnostico (cita_id_cita,diagnostico ) VALUES (:1,:2)`,
                [cita_id_cita,diagnostico],
                { autoCommit: true } // Auto confirmar la transacción
            
            );
            
            res.json({ mensaje: "diagnostico agregada" });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Error interno del servidor al insertar diagnostico", detalle: err.message });
        } finally {
            if (connection) {
                try {
                    await connection.close();
                } catch (err) {
                    console.error("Error al cerrar la conexión a Oracle:", err);
                }
            }
        }
    });    
    app.put("/updateDiagnostico", async (req, res) => {
        let connection;
        const { id_diagnostico,cita_id_cita,diagnostico} = req.body;
    
        try {
            connection = await oracledb.getConnection();
            const result = await connection.execute(
                `UPDATE diagnostico SET cita_id_cita=:cita_id_cita,diagnostico=:diagnostico where id_diagnostico=:id_diagnostico`,
                [cita_id_cita,diagnostico,id_diagnostico],
                { autoCommit: true } // Auto confirmar la transacción
            );
            await connection.commit();
    
            res.json({ mensaje: "diagnostico actualizado" });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Error interno del servidor al actualizar diagnostico", detalle: err.message });
        } finally {
            if (connection) {
                try {
                    await connection.close();
                } catch (err) {
                    console.error("Error al cerrar la conexión a Oracle:", err);
                }
            }
        }
    });

      /**termina diagnostico */



    /**operaciones */
    const CircularJSON = require('circular-json');

    app.get("/obtenerOperaciones", async (req, res) => {
        let connection;

        try {
            connection = await oracledb.getConnection();
            const result = await connection.execute('select op.id,op.observaciones,op.fecha_hora,op.mascota_id_mascota,op.medico_id_medico,op.tipo_operacion_id_tipo_operacion,m.nombre from operacion_mascota op join mascota m on op.mascota_id_mascota = m.id_mascota');

            // Mapear los resultados a un formato simple
            const operaciones = result.rows.map(row => {
                return {
                    id: row[0],
                    observaciones: row[1],
                    fecha_hora: row[2],
                    mascota_id_mascota: row[3],
                    medico_id_medico: row[4],
                    tipo_operacion_id_tipo_operacion: row[5],
                    nombre : row[6]
                    // Agrega más propiedades según sea necesario
                };
            });

            // Usar CircularJSON.stringify para manejar referencias circulares
           // const operacionesJSON = CircularJSON.stringify(operaciones);

            res.json(operaciones);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Error interno del servidor al obtener operacion", detalle: err.message });
        } finally {
            if (connection) {
                try {
                    await connection.close();
                } catch (err) {
                    console.error("Error al cerrar la conexión a Oracle:", err);
                }
            }
        }
    });

    app.post("/create-operacion", async (req, res) => {
        const { observaciones, fecha_hora,mascota_id_mascota, medico_id_medico, tipo_operacion_id_tipo_operacion} = req.body;

        let connection;

        try {
            connection = await oracledb.getConnection();

            const result = await connection.execute(
                `INSERT INTO operacion_mascota (observaciones,fecha_hora,mascota_id_mascota,medico_id_medico,tipo_operacion_id_tipo_operacion ) VALUES (:1,(TO_DATE(:2, 'DD-MON-YY')), :3, :4,:5)`,
                [ observaciones, fecha_hora,mascota_id_mascota ,medico_id_medico, tipo_operacion_id_tipo_operacion],
                { autoCommit: true } // Auto confirmar la transacción
            
            );
            
            res.json({ mensaje: "operacion agregada" });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Error interno del servidor al insertar operacion", detalle: err.message });
        } finally {
            if (connection) {
                try {
                    await connection.close();
                } catch (err) {
                    console.error("Error al cerrar la conexión a Oracle:", err);
                }
            }
        }
    });
    

    /**actualizar operaciones */

    /**TIPO OPERACIONES */

    app.get("/obtenerTipoOperaciones", async (req, res) => {
        let connection;
    
        try {
            connection = await oracledb.getConnection();
            const result = await connection.execute('select * from tipo_operacion');
            res.json(result.rows);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Error interno del servidor al obtener operaciones", detalle: err.message });
        } finally {
            if (connection) {
                try {
                    await connection.close();
                } catch (err) {
                    console.error("Error al cerrar la conexión a Oracle:", err);
                }
            }
        }
    });
    app.put("/updateTipoOperaciones", async (req, res) => {
        let connection;
        const { id_tipo_operacion,tipo,costo} = req.body;
    
        try {
            connection = await oracledb.getConnection();
            const result = await connection.execute(
                `UPDATE tipo_operacion SET tipo=:tipo,costo=:costo where id_tipo_operacion=:id_tipo_operacion`,
                [tipo,costo,id_tipo_operacion],
                { autoCommit: true } // Auto confirmar la transacción
            );
            await connection.commit();
    
            res.json({ mensaje: "tipo de operacion actualizado" });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Error interno del servidor al actualizar tipo de operacion", detalle: err.message });
        } finally {
            if (connection) {
                try {
                    await connection.close();
                } catch (err) {
                    console.error("Error al cerrar la conexión a Oracle:", err);
                }
            }
        }
    });
    app.post("/create-tipoOperacion", async (req, res) => {
        const {tipo,costo} = req.body;

        let connection;

        try {
            connection = await oracledb.getConnection();

            const result = await connection.execute(
                `INSERT INTO tipo_operacion (tipo,costo ) VALUES (:1,:2)`,
                [ tipo,costo],
                { autoCommit: true } // Auto confirmar la transacción
            
            );
            
            res.json({ mensaje: "tipo de operacion agregada" });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Error interno del servidor al insertar tipo operacion", detalle: err.message });
        } finally {
            if (connection) {
                try {
                    await connection.close();
                } catch (err) {
                    console.error("Error al cerrar la conexión a Oracle:", err);
                }
            }
        }
    });

    app.delete("/deleteTipoOperacion/:id_tipo_operacion", async (req, res) => {
        let connection;
        const id_tipo_operacion = req.params.id_tipo_operacion;
      
        // Validar que id_cliente sea un número
        if (!id_tipo_operacion || isNaN(id_tipo_operacion) || id_tipo_operacion === '0') {
            console.error('ID del tipo de operacion  no es un número válido:', id_tipo_operacion);
            return res.status(400).json({ error: "ID de tipo operacion no es valido" });
          }
      
        try {
          connection = await oracledb.getConnection();
          console.log("ID del tipo de operacion  a eliminar:", id_tipo_operacion);
          const result = await connection.execute(
            'DELETE FROM tipo_operacion WHERE id_tipo_operacion = :id_tipo_operacion',
            { id_tipo_operacion: id_tipo_operacion },
            { autoCommit: true }
          );
          await connection.commit();
      
          res.json({ mensaje: "tipo de operacion eliminado" });
        } catch (err) {
          console.error(err);
          res
            .status(500)
            .json({
              error: "Error interno del servidor al eliminar tipo de operacion",
              detalle: err.message,
            });
        } finally {
          if (connection) {
            try {
              await connection.close();
            } catch (err) {
              console.error("Error al cerrar la conexión a Oracle:", err);
            }
          }
        }
      });

    /*termina tipo operaciones*/

    /**servicios*/
    app.get("/obtenerServicios", async (req, res) => {
        let connection;
    
        try {
            connection = await oracledb.getConnection();
            const result = await connection.execute('select * from servicio');
            res.json(result.rows);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Error interno del servidor al obtener servicios", detalle: err.message });
        } finally {
            if (connection) {
                try {
                    await connection.close();
                } catch (err) {
                    console.error("Error al cerrar la conexión a Oracle:", err);
                }
            }
        }
    });
    app.put("/updateServicios", async (req, res) => {
        let connection;
        const { id_servicio,tipo_servicio,costo} = req.body;
    
        try {
            connection = await oracledb.getConnection();
            const result = await connection.execute(
                `UPDATE servicio SET tipo_servicio=:tipo_servicio,costo=:costo where id_servicio=:id_servicio`,
                [tipo_servicio,costo,id_servicio],
                { autoCommit: true } // Auto confirmar la transacción
            );
            await connection.commit();
    
            res.json({ mensaje: "tipo de servicio actualizado" });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Error interno del servidor al actualizar tipo de servicio", detalle: err.message });
        } finally {
            if (connection) {
                try {
                    await connection.close();
                } catch (err) {
                    console.error("Error al cerrar la conexión a Oracle:", err);
                }
            }
        }
    });
    app.post("/create-servicio", async (req, res) => {
        const {tipo_servicio,costo} = req.body;

        let connection;

        try {
            connection = await oracledb.getConnection();

            const result = await connection.execute(
                `INSERT INTO servicio (tipo_servicio,costo ) VALUES (:1,:2)`,
                [ tipo_servicio,costo],
                { autoCommit: true } // Auto confirmar la transacción
            
            );
            
            res.json({ mensaje: "tipo de servicio agregada" });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Error interno del servidor al insertar tipo servicio", detalle: err.message });
        } finally {
            if (connection) {
                try {
                    await connection.close();
                } catch (err) {
                    console.error("Error al cerrar la conexión a Oracle:", err);
                }
            }
        }
    });

    app.delete("/deleteTipoServicio/:id_servicio", async (req, res) => {
        let connection;
        const id_servicio = req.params.id_servicio;
      
        // Validar que id_cliente sea un número
        if (!id_servicio || isNaN(id_servicio) || id_servicio === '0') {
            console.error('ID del tipo de servicio  no es un número válido:', id_servicio);
            return res.status(400).json({ error: "ID de tipo servicio no es valido" });
          }
      
        try {
          connection = await oracledb.getConnection();
          console.log("ID del tipo de servicio  a eliminar:", id_servicio);
          const result = await connection.execute(
            'DELETE FROM servicio WHERE id_servicio = :id_servicio',
            { id_servicio: id_servicio },
            { autoCommit: true }
          );
          await connection.commit();
      
          res.json({ mensaje: "tipo de servicio eliminado" });
        } catch (err) {
          console.error(err);
          res
            .status(500)
            .json({
              error: "Error interno del servidor al eliminar tipo de servicio",
              detalle: err.message,
            });
        } finally {
          if (connection) {
            try {
              await connection.close();
            } catch (err) {
              console.error("Error al cerrar la conexión a Oracle:", err);
            }
          }
        }
      });

    /**termina servicios */ /******************************************* */

    /**detalles del servicio */
    app.get("/obtenerDetalles", async (req, res) => {
        let connection;
    
        try {
            connection = await oracledb.getConnection();
            const result = await connection.execute(' select ds.id_detalle_servicio,ds.detalle,ds.servicio_id_servicio,ds.cita_id_cita,m.nombre from detalle_servicio ds   join cita c on ds.cita_id_cita = c.id_cita join mascota m on c.mascota_id_mascota = m.id_mascota');
            res.json(result.rows);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Error interno del servidor al obtener servicios", detalle: err.message });
        } finally {
            if (connection) {
                try {
                    await connection.close();
                } catch (err) {
                    console.error("Error al cerrar la conexión a Oracle:", err);
                }
            }
        }
    });

    app.post("/create-detalleServicio", async (req, res) => {
        const { detalle, servicio_id_servicio, cita_id_cita} = req.body;

         let connection;

        try {
             connection = await oracledb.getConnection();

           const result = await connection.execute(
                `INSERT INTO detalle_servicio (detalle,servicio_id_servicio,cita_id_cita ) VALUES (:1, :2, :3)`,
             [ detalle, servicio_id_servicio,cita_id_cita],
             { autoCommit: true } // Auto confirmar la transacción
            
             );
            
             res.json({ mensaje: "detalle agregada" });
         } catch (err) {
             console.error(err);
             res.status(500).json({ error: "Error interno del servidor al insertar detalle", detalle: err.message });
         } finally {
             if (connection) {
                 try {
                     await connection.close();
                 } catch (err) {
                     console.error("Error al cerrar la conexión a Oracle:", err);
                 }
            }
         }
     });
     /******************************************************** */
     /**medico */
     app.get("/obtenerMedico", async (req, res) => {
        let connection;
    
        try {
            connection = await oracledb.getConnection();
            const result = await connection.execute('select * from medico');
            res.json(result.rows);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Error interno del servidor al obtener medico", detalle: err.message });
        } finally {
            if (connection) {
                try {
                    await connection.close();
                } catch (err) {
                    console.error("Error al cerrar la conexión a Oracle:", err);
                }
            }
        }
    });
    app.post("/create-medico", async (req, res) => {
        const {nombre,apellido_p,cedula_profesional,clinica_id_clinia} = req.body;
        let connection;

        try {
            connection = await oracledb.getConnection();

            const result = await connection.execute(
                `INSERT INTO medico (nombre,apellido_p,cedula_profesional,clinica_id_clinia ) VALUES (:1,:2,:3,:4)`,
                [nombre,apellido_p,cedula_profesional,clinica_id_clinia],
                { autoCommit: true } // Auto confirmar la transacción
            
            );
            
            res.json({ mensaje: "medico agregado" });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Error interno del servidor al insertar medico", detalle: err.message });
        } finally {
            if (connection) {
                try {
                    await connection.close();
                } catch (err) {
                    console.error("Error al cerrar la conexión a Oracle:", err);
                }
            }
        }
    });

    app.put("/updateMedico", async (req, res) => {
        let connection;
        const { id_medico,nombre,apellido_p,cedula_profesional,clinica_id_clinia} = req.body;
    
        try {
            connection = await oracledb.getConnection();
            const result = await connection.execute(
                `UPDATE medico SET nombre=:nombre,apellido_p=:apellido_p,cedula_profesional=:cedula_profesional,clinica_id_clinia=:clinica_id_clinia where id_medico=:id_medico`,
                [nombre,apellido_p,cedula_profesional,clinica_id_clinia,id_medico],
                { autoCommit: true } // Auto confirmar la transacción
            );
            await connection.commit();
    
            res.json({ mensaje: "medico actualizado" });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Error interno del servidor al actualizar medico", detalle: err.message });
        } finally {
            if (connection) {
                try {
                    await connection.close();
                } catch (err) {
                    console.error("Error al cerrar la conexión a Oracle:", err);
                }
            }
        }
    });
    
    app.delete("/deleteMedico/:id_medico", async (req, res) => {
        let connection;
        const id_medico = req.params.id_medico;
      
        // Validar que id_cliente sea un número
        if (!id_medico || isNaN(id_medico) || id_medico === '0') {
            console.error('ID de medico  no es un número válido:', id_medico);
            return res.status(400).json({ error: "ID de medico" });
          }
      
        try {
          connection = await oracledb.getConnection();
          console.log("ID del tipo de medico  a eliminar:", id_medico);
          const result = await connection.execute(
            'DELETE FROM medico WHERE id_medico = :id_medico',
            { id_medico: id_medico },
            { autoCommit: true }
          );
          await connection.commit();
      
          res.json({ mensaje: "medico eliminado" });
        } catch (err) {
          console.error(err);
          res
            .status(500)
            .json({
              error: "Error interno del servidor al eliminar medico",
              detalle: err.message,
            });
        } finally {
          if (connection) {
            try {
              await connection.close();
            } catch (err) {
              console.error("Error al cerrar la conexión a Oracle:", err);
            }
          }
        }
      });

     /**clinica */
     app.get("/obtenerClinica", async (req, res) => {
        let connection;
    
        try {
            connection = await oracledb.getConnection();
            const result = await connection.execute('select c.id_clinica,c.direccion_id_direccion,d.calle,d.colonia,d.alcaldia from clinica c join direccion d on c.direccion_id_direccion = d.id_direccion');
            res.json(result.rows);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Error interno del servidor al obtener clinica", detalle: err.message });
        } finally {
            if (connection) {
                try {
                    await connection.close();
                } catch (err) {
                    console.error("Error al cerrar la conexión a Oracle:", err);
                }
            }
        }
    });
    app.post("/create-clinica", async (req, res) => {
        const {direccion_id_direccion} = req.body;
        let connection;

        try {
            connection = await oracledb.getConnection();

            const result = await connection.execute(
                `INSERT INTO clinica (direccion_id_direccion) VALUES (:direccion_id_direccion)`,
                [direccion_id_direccion],
                { autoCommit: true } // Auto confirmar la transacción
            
            );
            
            res.json({ mensaje: "clinica agregado" });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Error interno del servidor al insertar clinica", detalle: err.message });
        } finally {
            if (connection) {
                try {
                    await connection.close();
                } catch (err) {
                    console.error("Error al cerrar la conexión a Oracle:", err);
                }
            }
        }
    });

    app.put("/updateClinica", async (req, res) => {
        let connection;
        const { id_clinica,direccion_id_direccion} = req.body;
    
        try {
            connection = await oracledb.getConnection();
            const result = await connection.execute(
                `UPDATE clinica SET direccion_id_direccion=:direccion_id_direccion where id_clinica=:id_clinica`,
                [direccion_id_direccion,id_clinica],
                { autoCommit: true } // Auto confirmar la transacción
            );
            await connection.commit();
    
            res.json({ mensaje: "clinica actualizado" });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Error interno del servidor al actualizar clinica", detalle: err.message });
        } finally {
            if (connection) {
                try {
                    await connection.close();
                } catch (err) {
                    console.error("Error al cerrar la conexión a Oracle:", err);
                }
            }
        }
    });
    
    app.delete("/deleteClinica/:id_clinica", async (req, res) => {
        let connection;
        const id_clinica = req.params.id_clinica;
      
        // Validar que id_cliente sea un número
        if (!id_clinica || isNaN(id_clinica) || id_clinica === '0') {
            console.error('ID de clinica  no es un número válido:', id_clinica);
            return res.status(400).json({ error: "ID de clinica" });
          }
      
        try {
          connection = await oracledb.getConnection();
          console.log("ID del tipo de medico  a eliminar:", id_clinica);
          const result = await connection.execute(
            'DELETE FROM clinica WHERE id_clinica = :id_clinica',
            { id_clinica: id_clinica },
            { autoCommit: true }
          );
          await connection.commit();
      
          res.json({ mensaje: "clinica eliminado" });
        } catch (err) {
          console.error(err);
          res
            .status(500)
            .json({
              error: "Error interno del servidor al eliminar medico",
              detalle: err.message,
            });
        } finally {
          if (connection) {
            try {
              await connection.close();
            } catch (err) {
              console.error("Error al cerrar la conexión a Oracle:", err);
            }
          }
        }
      });
    

      /**examen**/
      app.get("/buscarPorNombre", async (req, res) => {
        const nombre = req.query.nombre;
        let connection;
    
        try {
            connection = await oracledb.getConnection();
            const result = await connection.execute( `SELECT m.nombre, s.tipo_servicio
            FROM mascota m
            JOIN cita c ON m.id_mascota = c.mascota_id_mascota
            JOIN detalle_servicio d ON c.id_cita = d.cita_id_cita
            JOIN servicio s ON d.servicio_id_servicio = s.id_servicio
            WHERE m.nombre =:nombre`,
            [nombre]
        );
            res.json(result.rows);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Error interno del servidor al obtener medico", detalle: err.message });
        } finally {
            if (connection) {
                try {
                    await connection.close();
                } catch (err) {
                    console.error("Error al cerrar la conexión a Oracle:", err);
                }
            }
        }
    });

    app.get("/buscarPorDia", async (req, res) => {
        const dia = req.query.dia;
        let connection;
    
        try {
            connection = await oracledb.getConnection();
            const result = await connection.execute( `select s.tipo_servicio,s.costo
            from servicio s
            join detalle_servicio d on s.id_servicio = d.servicio_id_servicio
            join cita c  on d.cita_id_cita = c.id_cita
            where extract (day from c.fecha)=:dia`,
            [dia]
        );
            res.json(result.rows);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Error interno del servidor al obtener medico", detalle: err.message });
        } finally {
            if (connection) {
                try {
                    await connection.close();
                } catch (err) {
                    console.error("Error al cerrar la conexión a Oracle:", err);
                }
            }
        }
    });
    app.get("/cantidadCitasPorClinica", async (req, res) => {
        const dia = req.query.dia;
        let connection;
    
        try {
            connection = await oracledb.getConnection();
            const result = await connection.execute( `select c.id_clinica, count(ci.id_cita) as cantidad_citas
            from clinica c
            join cita ci on c.id_clinica = ci.clinica_id_clinica
            group by c.id_clinica`,
            
        );
            res.json(result.rows);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Error interno del servidor al obtener medico", detalle: err.message });
        } finally {
            if (connection) {
                try {
                    await connection.close();
                } catch (err) {
                    console.error("Error al cerrar la conexión a Oracle:", err);
                }
            }
        }
    });

    app.get("/servicioMasContratado", async (req, res) => {
       
        let connection;
    
        try {
            connection = await oracledb.getConnection();
            const result = await connection.execute( `select s.tipo_servicio, count(s.id_servicio) "cantidad de veces usado"
            from servicio s
            join detalle_servicio ds on s.id_servicio = ds.servicio_id_servicio
            group by s.tipo_servicio
            having count(s.id_servicio) = (
                select max(cantidad_veces_usado) from (
                    select count (s.id_servicio) cantidad_veces_usado
                    from servicio s 
                    join detalle_servicio ds on s.id_servicio = ds.servicio_id_servicio
                    group by s.id_servicio
                )
            )`,
            
        );
            res.json(result.rows);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Error interno del servidor al obtener servicio mas contratado", detalle: err.message });
        } finally {
            if (connection) {
                try {
                    await connection.close();
                } catch (err) {
                    console.error("Error al cerrar la conexión a Oracle:", err);
                }
            }
        }
    });
     
     

const PORT = 3001;

app.listen(PORT, () => {
    console.log(`Ejecución en el puerto ${PORT}`);
});

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
        const result = await connection.execute('select * from mascota');
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

const PORT = 3001;

app.listen(PORT, () => {
    console.log(`Ejecución en el puerto ${PORT}`);
});

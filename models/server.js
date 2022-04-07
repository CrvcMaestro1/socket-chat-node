const cors = require('cors')
const express = require('express');
const fileUpload = require('express-fileupload')
const { createServer } = require('http')
const { dbConnection } = require('../database/config');
const { socketController } = require('../sockets/controller.sockets');


class Server {
    constructor() {
        this.app = express();
        this.port = process.env.PORT;

        this.server = createServer(this.app)
        this.io = require('socket.io')(this.server)

        this.path = {
            auth: '/api/auth',
            categorias: '/api/categorias',
            usuarios: '/api/usuarios',
            productos: '/api/productos',
            buscar: '/api/buscar',
            uploads: '/api/uploads'
        }
        // BD
        this.conectarDB();
        // Middlewares
        this.middlewares();
        // Rutas
        this.routes();
        // Sockets
        this.sockets();
    }

    async conectarDB() {
        await dbConnection();
    }

    middlewares() {
        // CORS
        this.app.use(cors());
        // Lectura y parser del body
        this.app.use(express.json());
        // Directorio público
        this.app.use(express.static('public'));
        // Subida de archivos
        this.app.use(fileUpload({
            useTempFiles: true,
            tempFileDir: '/tmp/',
            createParentPath: true
        }));
    }

    routes() {
        this.app.use(this.path.auth, require('../routes/auth'));
        this.app.use(this.path.usuarios, require('../routes/usuarios'));
        this.app.use(this.path.categorias, require('../routes/categorias'));
        this.app.use(this.path.productos, require('../routes/productos'));
        this.app.use(this.path.buscar, require('../routes/buscar'));
        this.app.use(this.path.uploads, require('../routes/uploads'));
    }

    sockets() {
        this.io.on('connection', (socket) => socketController(socket, this.io))
    }

    listener() {
        this.server.listen(this.port, () => {
            console.log(`Server listening at http://localhost:${this.port}`)
        })
    }
}

module.exports = Server;
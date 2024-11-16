import os
from flask import Flask
from flask_session import Session
from flask_migrate import Migrate
from api.models import db
from api.admin import setup_admin
from api.commands import setup_commands
from api.webhook import webhook
from api.users import users
from api.vehicles import vehicles
from api.transaction import transaction
from api.reservations import reservations
from api.auth import auth
from flask_cors import CORS



app = Flask(__name__)

CORS(app, supports_credentials=True)

# Configuración de la base de datos 
db_url = os.getenv("DATABASE_URL")
if db_url is not None:
    app.config['SQLALCHEMY_DATABASE_URI'] = db_url.replace("postgres://", "postgresql://")
else:
    app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:///renting.db"

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Inicialización de la base de datos y migraciones
db.init_app(app)
MIGRATE = Migrate(app, db)

# Configurar el admin
setup_admin(app)

# Configurar los comandos
setup_commands(app)

# Registrar el blueprint para las rutas
app.register_blueprint(users, url_prefix='/api')
app.register_blueprint(vehicles, url_prefix='/api')
app.register_blueprint(reservations, url_prefix='/api')
app.register_blueprint(webhook, url_prefix='/api')
app.register_blueprint(auth, url_prefix='/api')
app.register_blueprint(transaction, url_prefix='/api')


# Ruta principal
@app.route('/')
def home():
    return "Bienvenido al sistema de renting de vehiculos"

# Configurar la clave secreta y el tipo de sesión
app.config['SECRET_KEY'] = 'ClaveTopSecret'  # Clave secreta 
app.config['SESSION_TYPE'] = 'filesystem'  # Usar sistema de archivos para manejar sesiones
app.config['SESSION_PERMANENT'] = False #que la sesion se cierre con el navegador
app.config['SESSION_COOKIE_HTTPONLY'] = True  # Asegúrate de que la cookie es segura
app.config['SESSION_COOKIE_SAMESITE'] = 'None'  # Permite solicitudes cross-site
app.config['SESSION_COOKIE_SECURE'] = True  # Requiere HTTPS


Session(app)

# Ejecutar la aplicación si se ejecuta directamente
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3001, debug=True)

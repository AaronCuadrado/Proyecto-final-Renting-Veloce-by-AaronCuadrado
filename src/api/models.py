from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
# werkzeug.security es un modulo de werkzeug para trabajar con contraseñas de manera mas segura

db = SQLAlchemy()

# Integer = numero  entero
# String = cadena de texto
# Boolean = valor booleano
# Float = numero decimal
# DateTime = fecha y hora
# Text = cadena de texto mas larga que string
# Enum = conjunto de valores predefinidos como roles o estados
# ForeignKey = establecer relaciones entre tablas
# relationship = definir relaciones entre tablas

# primary_key=True: Define una clave primaria para identificar registros únicos.
# unique=True: Garantiza que no se repitan valores en la columna.
# nullable=False: Indica que no se permiten valores nulos (vacíos).
# default=value: Define un valor predeterminado para la columna.

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    is_active = db.Column(db.Boolean(), default=True, nullable=False)
    balance = db.Column(db.Float, default=0.00)
    birthdate = db.Column(db.Date, nullable=False)
    registration_date = db.Column(db.DateTime, default=datetime.utcnow)
    bookings = db.relationship('Booking', backref='user', lazy=True)
    is_admin = db.Column(db.Boolean, default=False)

    # Metodo para establecer la contraseña encriptada
    def set_password(self, password):
        # Establecer la contraseña encriptada
        self.password_hash = generate_password_hash(password)

    # Metodo para verificar la contraseña en la autenticacion
    def check_password(self, password):
        # Verifica si la contraseña ingresada coincide con el hash almacenado
        return check_password_hash(self.password_hash, password)
    
    # Metodo para serializar los datos del usuario en un formato adecuado
    def serialize(self):
        return {
             "id": self.id,
            "username": self.username, 
            "email": self.email,
            "balance": self.balance,
            "is_admin": self.is_admin,
            # No se incluye la contraseña por seguridad
        }

# Clase Vehiculo que define el modelo de vehiculo en la base de datos
class Vehicle(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    brand = db.Column(db.String(100), nullable=False)
    model = db.Column(db.String(100), nullable=False)
    year = db.Column(db.Integer, nullable=False)
    color = db.Column(db.String(50), nullable=False)
    monthly_price = db.Column(db.Float, nullable=False)
    availability = db.Column(db.Boolean, default=True)
    image_url = db.Column(db.String(255))
    bookings = db.relationship('Booking', backref='vehicle', lazy=True)

    # Metodo para serializar los datos del vehiculo
    def serialize(self):
        return {
           "id": self.id,
            "brand": self.brand,
            "model": self.model,
            "year": self.year,
            "color": self.color,
            "monthly_price": self.monthly_price,
            "availability": self.availability,
            "image_url": self.image_url, 
        }

# Reserva que define el modelo de reservas de vehculos
class Booking(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    vehicle_id = db.Column(db.Integer, db.ForeignKey('vehicle.id'), nullable=False)
    start_date = db.Column(db.DateTime, nullable=False)
    end_date = db.Column(db.DateTime, nullable=False)
    status = db.Column(db.String(50), default="pending")
    payment_completed = db.Column(db.Boolean, default=False)
    total_amount = db.Column(db.Float, nullable=False)

    #Serializar los datos de la reserva
    def serialize(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "vehicle_id": self.vehicle_id,
            "start_date": self.start_date,
            "end_date": self.end_date,
            "status": self.status,
            "payment_completed": self.payment_completed,
            "total_amount": self.total_amount,
        }
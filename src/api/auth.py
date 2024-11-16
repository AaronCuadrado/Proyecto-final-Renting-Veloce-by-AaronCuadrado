from flask import Blueprint, request, jsonify, session
from api.models import db, User, Vehicle
from werkzeug.security import generate_password_hash
from datetime import datetime

auth = Blueprint('auth', __name__)


# Ruta de registro
@auth.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    birthdate_str = data.get('birthdate') #_str extrae la fecha como cadena de texto
    is_admin = data.get('is_admin', False)

    # Verificación de datos obligatorios
    if not username or not email or not password or not birthdate_str:
        return jsonify({"error": "Todos los campos son obligatorios"}), 400

    # Validar formato de email
    if "@" not in email or "." not in email:
        return jsonify({"error": "Correo electrónico no válido"}), 400

    # Validacion de contraseña con al menos 6 caracteres
    if len(password) < 6:
        return jsonify({"error": "La contraseña debe tener al menos 6 caracteres"}), 400

    # Convertir el string birthdate en un objeto datetime.date
    try:
        birthdate = datetime.strptime(birthdate_str, "%Y-%m-%d").date()
    except ValueError:
        return jsonify({"error": "Formato de fecha no válido. Debe ser YYYY-MM-DD"}), 400

    # Verificar si el correo o username ya están registrados
    if User.query.filter((User.email == email) | (User.username == username)).first():
        return jsonify({"error": "El usuario o correo ya están en uso"}), 400

    # Crear nuevo usuario con contraseña encriptada
    new_user = User(
        username=username,
        email=email,
        password_hash=generate_password_hash(password),
        birthdate=birthdate,
        is_admin=is_admin
    )

    db.session.add(new_user)
    db.session.commit()
    return jsonify({"message": "Usuario registrado con éxito"}), 201


# Ruta para iniciar sesion
@auth.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    # Verificar que se envíen las credenciales
    if not email or not password:
        return jsonify({"error": "Correo y contraseña son obligatorios"}), 400

    # Verificar si el usuario existe
    user = User.query.filter_by(email=email).first()
    if not user or not user.check_password(password):
        return jsonify({"error": "Correo o contraseña incorrectos"}), 401

    # Crear la sesion
    session['user_id'] = user.id
    session['is_admin'] = user.is_admin
    return jsonify({"message": "Inicio de sesión exitoso", "user": user.serialize()}), 200

# Cerrar la sesion
@auth.route('/logout', methods=['POST'])
def logout():
    if 'user_id' in session:
        session.pop('user_id')
        return jsonify({"message": "Sesión cerrada con éxito"}), 200
    return jsonify({"error": "No hay una sesión activa"}), 400

# Ruta para que el admin vea los vehiculos
@auth.route('/admin/vehicles', methods=['POST'])
def admin_add_vehicle():
    if 'user_id' not in session:
        return jsonify({"error": "Acceso no autorizado"}), 403

    # Verificar si el usuario es admin
    admin_user = User.query.get(session['user_id'])
    if not admin_user or not getattr(admin_user, "is_admin", False):
        return jsonify({"error": "Solo el admin puede realizar esta acción"}), 403

    data = request.get_json()
    brand = data.get('brand')
    model = data.get('model')
    year = data.get('year')
    color = data.get('color')
    monthly_price = data.get('monthly_price')
    image_url = data.get('image_url')

    # Validar datos obligatorios
    if not brand or not model or not year or not color or not monthly_price:
        return jsonify({"error": "Todos los campos son obligatorios"}), 400

    # Crear el nuevo vehículo
    new_vehicle = Vehicle(
        brand=brand,
        model=model,
        year=year,
        color=color,
        monthly_price=monthly_price,
        image_url=image_url
    )

    db.session.add(new_vehicle)
    db.session.commit()
    return jsonify({"message": "Vehículo agregado con éxito"}), 201

# Ruta para comprobar si esta la sesion bien iniciada
@auth.route('/session-info', methods=['GET'])
def session_info():
    if 'user_id' in session:  
        user = User.query.get(session['user_id'])
        if user:
            return jsonify(user.serialize()), 200
    return jsonify({"error": "Sesión no iniciada"}), 404

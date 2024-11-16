from flask import Blueprint, jsonify, request, session
from api.models import db, User
from werkzeug.security import check_password_hash

users = Blueprint('users', __name__)

# RUTA PARA OBTENER LA LISTA DE USUARIOS
@users.route('/users', methods=['GET'])
def get_users():
    # Verificación de autenticación 
    if 'user_id' not in session:
        return jsonify({"error": "Acceso no autorizado"}), 403

    # Obtener todos los usuarios de la base de datos
    users = User.query.all()
    users_list = [user.serialize() for user in users]

    return jsonify(users_list), 200

# RUTA PARA OBTENER LOS DATOS DE UN USUARIO ESPECÍFICO
@users.route('/users/<int:user_id>', methods=['GET'])
def get_user(user_id):
    # Verificación de autenticación
    if 'user_id' not in session:
        return jsonify({"error": "Acceso no autorizado"}), 403

    # Obtener el usuario por su ID
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "Usuario no encontrado"}), 404

    return jsonify(user.serialize()), 200

@users.route('/users/<int:user_id>', methods=['PUT'])
def update_username(user_id):
    # Verificación de autenticación
    if 'user_id' not in session:
        return jsonify({"error": "Acceso no autorizado"}), 403
    
    # Verificar si el usuario autenticado coincide con el usuario a actualizar
    if session['user_id'] != user_id:
        return jsonify({"error": "No puedes actualizar otro usuario"}), 403

    # Obtener los datos enviados en la solicitud
    data = request.get_json()
    new_username = data.get('username')

    # Verificar que se envía un nombre de usuario
    if not new_username:
        return jsonify({"error": "Nombre de usuario requerido"}), 400

    # Verificar si el nombre de usuario ya está en uso
    existing_user = User.query.filter_by(username=new_username).first()
    if existing_user:
        return jsonify({"error": "Nombre de usuario ya en uso"}), 400

    # Actualizar el nombre de usuario
    user = User.query.get(user_id)
    user.username = new_username
    db.session.commit()

    return jsonify({"message": "Nombre de usuario actualizado con éxito"}), 200


# RUTA PARA ACTUALIZAR LA CONTRASEÑA
@users.route('/users/<int:user_id>/update-password', methods=['PUT'])
def update_password(user_id):
    # Verificación de autenticación
    if 'user_id' not in session:
        return jsonify({"error": "Acceso no autorizado"}), 403

    # Verificar si el usuario autenticado coincide con el usuario a actualizar
    if session['user_id'] != user_id:
        return jsonify({"error": "No puedes actualizar la contraseña de otro usuario"}), 403

    # Obtener los datos enviados en la solicitud
    data = request.get_json()
    current_password = data.get('currentPassword')
    new_password = data.get('newPassword')

    # Verificar que se envíen ambos campos
    if not current_password or not new_password:
        return jsonify({"error": "Ambos campos son obligatorios"}), 400

    # Obtener el usuario
    user = User.query.get(user_id)

    # Verificar que la contraseña actual es correcta
    if not user.check_password(current_password):
        return jsonify({"error": "Contraseña actual incorrecta"}), 400

    # Validar que la nueva contraseña cumpla con los requisitos
    if len(new_password) < 6:
        return jsonify({"error": "La nueva contraseña debe tener al menos 6 caracteres"}), 400

    # Establecer la nueva contraseña
    user.set_password(new_password)
    db.session.commit()

    return jsonify({"message": "Contraseña actualizada con éxito"}), 200

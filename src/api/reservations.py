from flask import Blueprint, jsonify, request, session
from api.models import db, Booking, Vehicle, User
from datetime import datetime

reservations = Blueprint('reservations', __name__)

#Ruta para obtener todas las reservas
@reservations.route('/bookings', methods=['GET'])
def get_bookings():
    
    if 'user_id' not in session:
        return jsonify({"error": "Acceso no autorizado"}), 403
    
    #Obtener las reservas de la base de datos
    bookings = Booking.query.all()
    bookings_list = [booking.serialize() for booking in bookings]

    return jsonify(bookings_list), 200

#Ruta para obtener los datos de una reserva en especifico
@reservations.route('/bookings/<int:booking_id>', methods=['GET'])
def get_booking(booking_id):

    if 'user_id' not in session:
        return jsonify({"error": "Reserva no encontrada"}), 404
    
    return jsonify(booking.serialize()), 200

#Ruta para crear una nueva reserva
@reservations.route('/bookings', methods=['POST'])
def create_booking():

    if 'user_id' not in session:
        return jsonify({"error": "Acceso no autorizado"}), 403
    
    data = request.get_json()
    vehicle_id = data.get('vehicle_id')
    start_date = data.get('start_date')
    end_date = data.get('end_date')

    if not vehicle_id or not start_date or not end_date:
        return jsonify({"error":"Todos los campos son obligatorios"}), 400
    
    #Verificar la disponibilidad del vehiculo
    vehicle = Vehicle.query.get(vehicle_id)
    if not vehicle or not vehicle.availability:
        return jsonify({"error": "Vehiculo no disponible"}), 400
    
    #Crear la reserva
    new_booking = Booking(
        user_id=session['user_id'],
        vehicle_id=vehicle_id,
        start_date=datetime.strptime(start_date, "%Y-%m-%d %H:%M:%S"),
        end_date=datetime.strptime(end_date, "%Y-%m-%d %H:%M:%S"),
        status="pending", #Estado inicial "pendiente"
        payment_completed=False, #Pago no realizado
        total_amount=vehicle.daily_rate * ((datetime.strptime(end_date, "%Y-%m-%d %H:%M:%S") - datetime.strptime(start_date, "%Y-%m-%d %H:%M:%S")).days)
    )
    db.session.add(new_booking)
    db.session.commit()

    return jsonify({"message":"Reserva realizada con exito", "booking": new_booking.serialize()}), 201


#Ruta para cancelar una reserva
@reservations.route('/bookings/<int:booking_id>/cancel', methods=['PUT'])
def cancel_booking(booking_id):

    if 'user_id' not in session:
        return jsonify({"error": "Acceso no autorizado"}), 403
    
    #Obtener la reserva por su id
    booking = Booking.query.get(booking_id)
    if not booking:
        return jsonify({"error": "Reserva no encontrada"}), 404
    
    #Verificar si el usuario es el propietario de la reserva
    if booking.user_id != session['user_id']:
        return jsonify({"error":"No puedes cancelar una reserva que no te pertenece"}), 403
    
    #Actualizar el estado a cancelada
    booking.status = "cancelled"
    db.session.commit()

    return jsonify({"message":"Reserva cancelada con exito"}), 200

#Ruta para realizar el pago de al reserva
@reservations.route('/bookings/<int:booking_id>/pay', methods=['PUT'])
def pay_booking(booking_id):

    if 'user_id' not in session:
        return jsonify({"error": "Acceso no autorizado"}), 403
    
    booking = Booking.query.get(booking_id)
    if not booking:
        return jsonify({"error":"Reserva no encontrada"}), 404
    
    #verificar si el usuario es el propietario de la reserva
    if booking.user_id != session['user_id']:
        return jsonify({"error": "No puedes pagar una reserva que no es tuya"}), 403
    
    #Verificar si el pago ya se ha completado
    if booking.payment_completed:
        return jsonify({"error":"El pago ya ha sido realizado"}), 400
    
    #Marcar el pago como completado
    booking.payment_completed = True
    db.session.commit()

    return jsonify({"message":"Pago realizado con exito", "booking": booking.serialize()}), 200


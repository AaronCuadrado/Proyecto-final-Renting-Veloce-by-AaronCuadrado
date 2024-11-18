from flask import Blueprint, jsonify, request, session
from api.models import db, User, Booking, Vehicle
import stripe
from datetime import datetime


transaction = Blueprint('transaction', __name__)

#Clave de API de Stripe
stripe.api_key = 'sk_test_51QChOk2LySc2UsGFgu1RKTF6bMDw3S2mVy6XKJXTgHNNAtH1atJLsazX43l1XBR4UqR5zFqqLBY23GKFymypK7Za00NvNwNXaP'

#Ruta para realizar el pago de la reserva
@transaction.route('/reserve-vehicle', methods=['POST'])
def reserve_vehicle():
    
    if 'user_id' not in session:
        return jsonify({"error":"Debes iniciar sesion para realizar esta accion"}), 403
    
    data = request.get_json()
    vehicle_id = data.get('vehicle_id')
    start_date_str = data.get('start_date')
    end_date_str = data.get('end_date')
    total_amount = data.get('total_amount')

    #Verificar todos los datos requeridos
    if not vehicle_id or not start_date_str or not end_date_str or not total_amount:
        return jsonify({"error": "Faltan datos obligatorios para la reserva"}), 400
    
    try:
        # Convertir las fechas a objetos datetime
        start_date = datetime.strptime(start_date_str, '%Y-%m-%d')
        end_date = datetime.strptime(end_date_str, '%Y-%m-%d')
    except ValueError:
        return jsonify({"error": "Formato de fecha no válido. Use YYYY-MM-DD"}), 400

    if start_date >= end_date:
        return jsonify({"error": "La fecha de inicio debe ser anterior a la fecha de fin"}), 400



    #Verificar disponibilidad del vehiculo
    vehicle = Vehicle.query.get(vehicle_id)
    if not vehicle or not vehicle.availability:
        return jsonify({"error":"El vehiculo no esta disponible para la reserva"}), 400
    
    #Crear la reserva en estado pendiente
    booking = Booking(
        user_id=session['user_id'],
        vehicle_id=vehicle_id,
        start_date=start_date,
        end_date=end_date,
        total_amount=total_amount,
        status="pending",
        payment_completed=False,
    )
    db.session.add(booking)
    db.session.commit()

    #Crear una sesion de pago en stripe
    stripe_session = stripe.checkout.Session.create(
        payment_method_types=['card'],
        line_items=[{
            'price_data': {
                'currency': 'eur',
                'product_data': {
                    'name': f'Reserva de vehiculo: {vehicle.brand} {vehicle.model}',
                },
                'unit_amount': int(float(total_amount) * 100),
            },
            'quantity': 1,
        }],
        mode='payment',
        success_url='https://proyecto-final-renting-veloce-by-54rh.onrender.com/reserve-vehicle/success?booking_id=' + str(booking.id),
        cancel_url='https://proyecto-final-renting-veloce-by-54rh.onrender.com/reserve-vehicle/cancel',
        metadata={
            'user_id': session['user_id'],
            'booking_id': booking.id
        }
    )

    return jsonify({
        "message":"Redirigiendo a Stripe para procesar el pago",
        "stripe_url": stripe_session.url
    }), 200

#Ruta para confirmar el pago
@transaction.route('/reserve-vehicle/success', methods=['GET'])
def payment_success():
    booking_id = request.args.get('booking_id')
    booking = Booking.query.get(booking_id)

    if not booking:
        return jsonify({"error":"Reserva no encontrada"}), 404
    
    #Confirmar la reserva y actualizar el estado
    booking.status = "confirmed"
    booking.payment_completed = True
    db.session.commit()

    #Actualizar el saldo del usuario
    user = User.query.get(booking.user_id)
    if user:
        user.balance -= booking.total_amount
        db.session.commit()

    return "<h1>Reserva confirmada con exito</h1><p>Tu pago ha sido procesado y la reserva ha sido validada</p>", 200

#Ruta para manejar la cancelacion del pago
@transaction.route('/reserve-vehicle/cancel', methods=['GET'])
def payment_cancel():
    return "<h1>Pago cancelado</h1><p>No se realizó ninguna transacción. Vuelve a intentarlo si lo deseas.</p>", 400

#Ruta para ver las reservas del usuario
@transaction.route('/my-reservations', methods=['GET'])
def get_user_reservations():
    if 'user_id' not in session:
        return jsonify({"error":"Debes iniciar sesion para ver tus reservas"}), 403
    
    user_id = session['user_id']
    bookings = Booking.query.filter_by(user_id=user_id).all()

    if not bookings:
        return jsonify({"message":"No tienes reservas realizadas"}), 404
    
    serialized_bookings = [booking.serialize() for booking in bookings]
    return jsonify(serialized_bookings), 200
from flask import Blueprint, request, jsonify
import stripe
from api.models import db, User

webhook = Blueprint('webhook', __name__)

# Clave secreta de Stripe 
stripe.api_key = 'sk_test_51QChOk2LySc2UsGFgu1RKTF6bMDw3S2mVy6XKJXTgHNNAtH1atJLsazX43l1XBR4UqR5zFqqLBY23GKFymypK7Za00NvNwNXaP'
endpoint_secret = 'whsec_osM6Tq6TZliF8HjxzwgbTTqvYTvucY1g'  # clave secreta webhook de Stripe

# RUTA PARA MANEJAR EL WEBHOOK DE STRIPE
@webhook.route('/stripe-webhook', methods=['POST'])
def stripe_webhook():
    payload = request.get_data(as_text=True)  # Obtener el contenido del webhook como texto
    sig_header = request.headers.get('Stripe-Signature')  # Obtener la firma de Stripe desde los encabezados

    # Verificar la validez de la firma del webhook
    try:
        event = stripe.webhook.construct_event(payload, sig_header, endpoint_secret)
    except ValueError as e:
        # Error en el payload
        return jsonify({"error": "Payload inválido"}), 400
    except stripe.error.SignatureVerificationError as e:
        # Firma del webhook inválida
        return jsonify({"error": "Firma inválida"}), 400

    # Procesar el evento 'checkout.session.completed'
    if event['type'] == 'checkout.session.completed':
        stripe_session = event['data']['object']  # Obtener los datos de la sesión de Stripe
        user_id = stripe_session['metadata']['user_id']  # ID del usuario desde los metadatos de Stripe
        amount = stripe_session['amount_total'] / 100  # Convertir el monto de céntimos a euros

        # Obtener el usuario y actualizar su saldo
        user = User.query.get(user_id)
        if user:
            user.balance += amount  # Sumar el monto al saldo del usuario
            db.session.commit()
            print(f"Saldo actualizado para el usuario {user_id}: {user.balance} €")
        else:
            print(f"Usuario con ID {user_id} no encontrado")

    return '', 200

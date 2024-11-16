import React from "react";
import "../../styles/footer.css"; 

export const Footer = () => (
	<footer>
		<div className="footer-container">
			<div className="footer-column">
				<h4>Contacto</h4>
				<address>
					<p>atencion@velocerenting.com</p>
					<p>Tel: +34 112 112 112</p>
				</address>
			</div>

			<div className="footer-column">
				<h4>Redes Sociales</h4>
				<div className="social-icons">
					<a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><i className="fab fa-facebook-f"></i></a>
					<a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter"><i className="fab fa-twitter"></i></a>
					<a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
				</div>
			</div>

			<div className="footer-column">
				<h4>Dirección</h4>
				<address>
					<p>Calle no se me ocurre, Barakaldo, Bizkaia</p>
				</address>
			</div>
		</div>
		<div className="copyright">
			&copy; 2024 Hecho por Aaron Cuadrado. Todos los derechos reservados.
		</div>
	</footer>
);

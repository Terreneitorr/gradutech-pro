/**
 * Middleware Global de Manejo de Errores
 * --------------------------------------
 * Este middleware captura y maneja errores no controlados en la aplicación Express.
 * Proporciona respuestas consistentes y seguras para errores, diferenciando entre
 * entornos de desarrollo y producción.
 *
 * Funcionamiento:
 * - Captura errores pasados con next(err) o lanzados en rutas/middlewares
 * - Establece código de estado 500 por defecto si no se especifica
 * - Devuelve mensaje de error claro en formato JSON
 * - Incluye stack trace solo en desarrollo para debugging
 * - Oculta información sensible en producción por seguridad
 */

const errorHandler = (err, req, res, next) => {
  // Determinar el código de estado HTTP
  // Si el error tiene un statusCode definido, úsalo; de lo contrario, 500
  const statusCode = err.statusCode || 500;

  // Preparar la respuesta de error
  // Siempre incluir el mensaje de error
  const response = {
    error: err.message || 'Error interno del servidor'
  };

  // En modo desarrollo, incluir el stack trace para facilitar debugging
  // En producción, omitir el stack para no exponer información sensible
  if (process.env.NODE_ENV === 'development') {
    response.stack = err.stack;
  }

  // Enviar la respuesta con el código de estado apropiado
  res.status(statusCode).json(response);
};

module.exports = errorHandler;
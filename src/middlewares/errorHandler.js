function errorHandler(err, req, res, next) {
  
  // Mapa de errores personalizados → códigos HTTP
  const errorMap = {
    EVENT_NOT_FOUND: 404,
    PARTICIPANT_NOT_FOUND: 404,
    ATTENDANCE_NOT_FOUND: 404,
    ALREADY_REGISTERED: 409,
    EVENT_FULL: 400,  
    CAPACITY_FULL: 400,
    INVALID_DATA: 400
  };

  // Si el error es uno que reconocemos
  if (errorMap[err.message]) {
    return res.status(errorMap[err.message]).json({
      error: err.message
    });
  }

  // Si es error Sequelize de validación
  if (err.name === "SequelizeValidationError") {
    return res.status(400).json({
      error: "VALIDATION_ERROR",
      details: err.errors.map(e => e.message)
    });
  }

  // Si es error Sequelize de clave única (email duplicado por ejemplo)
  if (err.name === "SequelizeUniqueConstraintError") {
    return res.status(409).json({
      error: "UNIQUE_CONSTRAINT_ERROR",
      fields: err.fields
    });
  }

  // Error inesperado
  console.error(err);
  return res.status(500).json({
    error: "INTERNAL_SERVER_ERROR"
  });
}

module.exports = errorHandler;

/**
 * Utilidades para validación de métodos de pago
 * Sistema de validación realista para proyecto universitario
 */

/**
 * Valida el número de tarjeta usando el algoritmo de Luhn
 * @param {string} cardNumber - Número de tarjeta
 * @returns {boolean} - True si es válido
 */
export const validateCardNumber = (cardNumber) => {
  // Remover espacios y guiones
  const number = cardNumber.replace(/[\s-]/g, '');

  // Verificar que solo contenga números
  if (!/^\d+$/.test(number)) {
    return false;
  }

  // Verificar longitud (13-19 dígitos)
  if (number.length < 13 || number.length > 19) {
    return false;
  }

  // Algoritmo de Luhn
  let sum = 0;
  let shouldDouble = false;

  // Recorrer de derecha a izquierda
  for (let i = number.length - 1; i >= 0; i--) {
    let digit = parseInt(number.charAt(i), 10);

    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    shouldDouble = !shouldDouble;
  }

  return sum % 10 === 0;
};

/**
 * Detecta el tipo de tarjeta basado en el número
 * @param {string} cardNumber - Número de tarjeta
 * @returns {string} - Tipo de tarjeta
 */
export const detectCardType = (cardNumber) => {
  const number = cardNumber.replace(/[\s-]/g, '');

  /*
   Patrones de tarjetas peruanas e internacionales
  */
  const patterns = {
    visa: /^4[0-9]{12}(?:[0-9]{3})?$/,
    mastercard: /^5[1-5][0-9]{14}$|^2(?:2(?:2[1-9]|[3-9][0-9])|[3-6][0-9][0-9]|7(?:[01][0-9]|20))[0-9]{12}$/,
    amex: /^3[47][0-9]{13}$/,
    discover: /^6(?:011|5[0-9]{2})[0-9]{12}$/,
    diners: /^3[0689][0-9]{11}$/,
    jcb: /^(?:2131|1800|35\d{3})\d{11}$/
  };

  for (const [type, pattern] of Object.entries(patterns)) {
    if (pattern.test(number)) {
      return type;
    }
  }

  return 'unknown';
};

/**
 * Valida la fecha de expiración
 * @param {string} expiryDate - Fecha en formato MM/YY o MM/YYYY
 * @returns {boolean} - True si es válida
 */
export const validateExpiryDate = (expiryDate) => {
  const cleaned = expiryDate.replace(/\D/g, '');

  if (cleaned.length !== 4) {
    return false;
  }

  const month = parseInt(cleaned.substring(0, 2), 10);
  const year = parseInt(cleaned.substring(2, 4), 10);

  // Validar mes
  if (month < 1 || month > 12) {
    return false;
  }

  // Convertir año de 2 dígitos a 4 dígitos
  const currentYear = new Date().getFullYear();
  const currentCentury = Math.floor(currentYear / 100) * 100;
  const fullYear = currentCentury + year;

  // Verificar que no esté vencida
  const currentDate = new Date();
  const expiryDateObj = new Date(fullYear, month - 1);

  return expiryDateObj > currentDate;
};

/**
 * Valida el código CVV
 * @param {string} cvv - Código CVV
 * @param {string} cardType - Tipo de tarjeta
 * @returns {boolean} - True si es válido
 */
export const validateCVV = (cvv, cardType = 'visa') => {
  const cleaned = cvv.replace(/\D/g, '');

  // American Express usa 4 dígitos, otras tarjetas 3
  const expectedLength = cardType === 'amex' ? 4 : 3;

  return cleaned.length === expectedLength;
};

/**
 * Valida el nombre del titular
 * @param {string} name - Nombre del titular
 * @returns {boolean} - True si es válido
 */
export const validateCardholderName = (name) => {
  // Al menos 2 caracteres, solo letras, espacios y algunos caracteres especiales
  const namePattern = /^[a-zA-ZÀ-ÿ\u00f1\u00d1\s.'-]{2,50}$/;
  return namePattern.test(name.trim());
};

/**
 * Formatea el número de tarjeta con espacios
 * @param {string} cardNumber - Número de tarjeta
 * @returns {string} - Número formateado
 */
export const formatCardNumber = (cardNumber) => {
  const cleaned = cardNumber.replace(/\D/g, '');
  const chunks = cleaned.match(/.{1,4}/g) || [];
  return chunks.join(' ').substr(0, 19); // Máximo 16 dígitos + 3 espacios
};

/**
 * Formatea la fecha de expiración
 * @param {string} expiryDate - Fecha de expiración
 * @returns {string} - Fecha formateada MM/YY
 */
export const formatExpiryDate = (expiryDate) => {
  const cleaned = expiryDate.replace(/\D/g, '');
  if (cleaned.length >= 2) {
    return cleaned.substring(0, 2) + (cleaned.length > 2 ? '/' + cleaned.substring(2, 4) : '');
  }
  return cleaned;
};

/**
 * Números de tarjeta de prueba para desarrollo
 * Estos números pasan la validación de Luhn pero son ficticios
 */
export const TEST_CARDS = {
  visa: {
    number: '4111111111111111',
    cvv: '123',
    expiry: '12/25',
    name: 'Juan Pérez'
  },
  mastercard: {
    number: '5555555555554444',
    cvv: '456',
    expiry: '11/26',
    name: 'María García'
  },
  amex: {
    number: '378282246310005',
    cvv: '1234',
    expiry: '10/27',
    name: 'Carlos López'
  },
  declined: {
    number: '4000000000000002',
    cvv: '123',
    expiry: '12/25',
    name: 'Tarjeta Rechazada'
  },
  insufficient_funds: {
    number: '4000000000009995',
    cvv: '123',
    expiry: '12/25',
    name: 'Sin Fondos'
  }
};

/**
 * Simula el procesamiento de pago
 * @param {Object} paymentData - Datos de pago
 * @returns {Promise} - Resultado del procesamiento
 */
export const simulatePaymentProcessing = async (paymentData) => {
  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 3000));

  const { cardNumber, amount } = paymentData;
  const cleanedNumber = cardNumber.replace(/\s/g, '');

  // Simular diferentes escenarios basados en el número de tarjeta
  if (cleanedNumber === TEST_CARDS.declined.number.replace(/\s/g, '')) {
    throw new Error('CARD_DECLINED');
  }

  if (cleanedNumber === TEST_CARDS.insufficient_funds.number.replace(/\s/g, '')) {
    throw new Error('INSUFFICIENT_FUNDS');
  }

  // Simular falla aleatoria del 5%
  if (Math.random() < 0.05) {
    throw new Error('PROCESSING_ERROR');
  }

  // Éxito
  return {
    success: true,
    transactionId: 'TXN_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
    amount: amount,
    currency: 'PEN',
    timestamp: new Date().toISOString(),
    last4: cleanedNumber.slice(-4),
    cardType: detectCardType(cleanedNumber)
  };
};

/**
 * Obtiene mensaje de error legible para el usuario
 * @param {string} errorCode - Código de error
 * @returns {string} - Mensaje de error
 */
export const getPaymentErrorMessage = (errorCode) => {
  const messages = {
    'CARD_DECLINED': 'Tu tarjeta fue rechazada. Por favor, verifica los datos o usa otra tarjeta.',
    'INSUFFICIENT_FUNDS': 'Fondos insuficientes en tu tarjeta. Por favor, usa otra tarjeta.',
    'PROCESSING_ERROR': 'Error al procesar el pago. Por favor, intenta nuevamente.',
    'INVALID_CARD': 'El número de tarjeta no es válido.',
    'INVALID_EXPIRY': 'La fecha de expiración no es válida.',
    'INVALID_CVV': 'El código CVV no es válido.',
    'INVALID_NAME': 'El nombre del titular no es válido.',
    'EXPIRED_CARD': 'Tu tarjeta ha expirado.',
    'NETWORK_ERROR': 'Error de conexión. Por favor, verifica tu internet.'
  };

  return messages[errorCode] || 'Error desconocido. Por favor, contacta al soporte.';
};

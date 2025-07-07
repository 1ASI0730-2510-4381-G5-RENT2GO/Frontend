// Corrección para checkout-view.component.vue
// Agregar esta función después de la función placeOrder existente

// Procesar la orden con validaciones y crear reserva en el backend
const placeOrder = async () => {
  if (!isFormValid.value) {
    paymentErrors.value = ['Por favor, completa todos los campos requeridos correctamente.'];
    return;
  }

  isProcessing.value = true;
  paymentErrors.value = [];

  try {
    // 1. Procesar el pago (si es con tarjeta)
    if (paymentMethod.value === 'card') {
      // Simular procesamiento de pago
      const paymentData = {
        cardNumber: selectedSavedMethod.value ?
          savedPaymentMethods.value.find(m => m.id === selectedSavedMethod.value)?.last4 || '4242' :
          paymentInfo.value.cardNumber,
        amount: totalPrice.value,
        currency: 'PEN'
      };

      const paymentResult = await simulatePaymentProcessing(paymentData);
      console.log('Pago procesado:', paymentResult);

      // Si se debe guardar la tarjeta
      if (!selectedSavedMethod.value && paymentInfo.value.saveCard) {
        const newCard = {
          id: 'pm_' + Date.now(),
          type: detectedCardType.value,
          last4: paymentInfo.value.cardNumber.replace(/\s/g, '').slice(-4),
          expMonth: paymentInfo.value.expiryDate.substring(0, 2),
          expYear: paymentInfo.value.expiryDate.substring(3, 5),
          isDefault: savedPaymentMethods.value.length === 0
        };

        savedPaymentMethods.value.push(newCard);
        console.log('Tarjeta guardada:', newCard);
      }
    }

    // 2. Crear la reserva en el backend
    console.log('Creando reserva en el backend...');
    
    const reservationData = {
      vehicleId: car.value.id,
      startDate: new Date(bookingDetails.value.pickupDate).toISOString(),
      endDate: new Date(bookingDetails.value.returnDate).toISOString(),
      paymentMethod: paymentMethod.value === 'card' ? 'credit_card' : 'cash',
      location: customerInfo.value.address,
      notes: `Reserva para ${customerInfo.value.firstName} ${customerInfo.value.lastName}. Teléfono: ${customerInfo.value.phone}`
    };

    console.log('Datos de reserva a enviar:', reservationData);

    // Llamar al servicio de reservas del backend
    const createdReservation = await reservationsService.createReservation(reservationData);
    
    console.log('Reserva creada exitosamente:', createdReservation);
    
    // Actualizar el ID de reserva con el real del backend
    reservationId.value = createdReservation.id || reservationId.value;

    // Simular delay adicional para realismo
    await new Promise(resolve => setTimeout(resolve, 1000));

    isProcessing.value = false;
    showConfirmation.value = true;

  } catch (error) {
    isProcessing.value = false;
    
    console.error('Error completo:', error);
    
    // Manejar diferentes tipos de errores
    if (error.response) {
      // Error del servidor
      const serverError = error.response.data;
      console.error('Error del servidor:', serverError);
      
      if (serverError.message) {
        paymentErrors.value = [serverError.message];
      } else {
        paymentErrors.value = ['Error al procesar la reserva. Por favor, intenta nuevamente.'];
      }
    } else if (error.message && error.message.includes('payment')) {
      // Error de pago
      const errorMessage = getPaymentErrorMessage(error.message);
      paymentErrors.value = [errorMessage];
    } else {
      // Error general
      paymentErrors.value = ['Error al crear la reserva. Por favor, verifica tu conexión e intenta nuevamente.'];
    }

    console.error('Error en el procesamiento:', error);
  }
};

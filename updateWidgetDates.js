// Obtener fechas del usuario
const fecha1 = await promptForDate("Cierre actual");
const fecha2 = await promptForDate("Vencimiento actual");
const fecha3 = await promptForDate("Próximo cierre");
const fecha4 = await promptForDate("Próximo vencimiento");

// Guardar fechas en el Keychain
if (fecha1) Keychain.set("fecha1", fecha1);
if (fecha2) Keychain.set("fecha2", fecha2);
if (fecha3) Keychain.set("fecha3", fecha3);
if (fecha4) Keychain.set("fecha4", fecha4);

// Mensaje de confirmación
const alert = new Alert();
alert.title = "Fechas actualizadas";
alert.message = "Las fechas se han guardado correctamente.";
alert.addAction("OK");
await alert.present();

Script.complete();

// Solicita fecha al usuario
async function promptForDate(label) {
  const alert = new Alert();
  alert.title = `Actualizar ${label}`;
  alert.addTextField("YYYY-MM-DD", "");
  alert.addAction("Guardar");
  alert.addCancelAction("Cancelar");
  const response = await alert.present();

  if (response === -1) return null; // Cancelar
  const input = alert.textFieldValue(0);
  return validateDate(input) ? input : null;
}

// Validar formato de fecha
function validateDate(date) {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  return regex.test(date);
}

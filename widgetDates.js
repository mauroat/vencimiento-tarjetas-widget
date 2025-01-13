// Configuración inicial
const widget = new ListWidget();
widget.backgroundColor = new Color("#1a1a1a");

// Títulos
const title = widget.addText("Tarjetas BNA 💳");
title.textColor = Color.white();
title.font = Font.boldSystemFont(22);
title.centerAlignText();
widget.addSpacer(10);

// Obtener fechas almacenadas
let date1 = getStoredDate("fecha1") || "No definida";
let date2 = getStoredDate("fecha2") || "No definida";
let date3 = getStoredDate("fecha3") || "No definida";
let date4 = getStoredDate("fecha4") || "No definida";

// Esta verificación se realiza para resetear las fechas actuales de cierre y vencimiento si son pasadas
if (date2 !== "No definida" && isDateNegative(date2)) {
  // Reemplazar fechas 1 y 2 con fechas 3 y 4
  date1 = date3;
  date2 = date4;

  // Borrar fechas 3 y 4
  date3 = "No definida";
  date4 = "No definida";

  // Guardar los cambios
  storeDate("fecha1", date1 === "No definida" ? "" : date1);
  storeDate("fecha2", date2 === "No definida" ? "" : date2);
  storeDate("fecha3", "");
  storeDate("fecha4", "");
}

// Mostrar fechas en el widget
addDateToWidget(widget, "Cierre", date1, true);
addDateToWidget(widget, "Vencimiento", date2, true);
addDateToWidget(widget, "Próx. cierre", date3, false);
addDateToWidget(widget, "Próx. vto", date4, false);

// Botón para actualizar fechas
widget.addSpacer(10);
const updateButton = widget.addText("Actualizar 🔄");
updateButton.url = "scriptable:///run/UpdateWidgetDates";
updateButton.textColor = Color.blue();
updateButton.font = Font.systemFont(12); // Fuente más chica
updateButton.centerAlignText();

// Actualización automática diaria
widget.refreshAfterDate = new Date(Date.now() + 24 * 60 * 60 * 1000); // Actualizar en 24 horas

if (config.runsInWidget) {
  Script.setWidget(widget);
  Script.complete();
} else {
  widget.presentMedium(); // Vista previa en el editor
}

// Función para agregar fechas al widget
function addDateToWidget(widget, label, date, calculateDays) {
  const stack = widget.addStack();
  stack.layoutHorizontally();

  const labelElement = stack.addText(`${label}: `);
  labelElement.textColor = Color.gray();
  labelElement.font = Font.mediumSystemFont(14);

  if (date === "No definida") {
    const dateElement = stack.addText(date);
    dateElement.textColor = Color.red();
    dateElement.font = Font.mediumSystemFont(14);
    return;
  }

  // Formatear y calcular días restantes
  const { formattedDate, daysRemaining } = formatDateWithDaysRemaining(date, calculateDays);

  // Fecha principal
  const dateElement = stack.addText(formattedDate);
  dateElement.textColor = Color.white();
  dateElement.font = Font.mediumSystemFont(14);

  // Días restantes
  if (daysRemaining !== null) {
    const daysElement = stack.addText(` (${daysRemaining} días)`);
    daysElement.textColor = Color.green();
    daysElement.font = Font.mediumSystemFont(14);
  }
}

// Función para obtener fechas almacenadas
function getStoredDate(key) {
  return Keychain.contains(key) ? Keychain.get(key) : null;
}

// Función para guardar fechas
function storeDate(key, value) {
    value ? Keychain.set(key, value) : Keychain.remove(key);
}

// Función para verificar si la diferencia de días es negativa
function isDateNegative(date) {
  const targetDate = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Ignorar horas en el cálculo
  return targetDate < today;
}

// Formateo de fecha y calculo de días restantes
function formatDateWithDaysRemaining(date, calculateDays) {
  if (date === "No definida") return { formattedDate: date, daysRemaining: null };

  const targetDate = new Date(date);
  if (isNaN(targetDate.getTime())) return { formattedDate: "Formato inválido", daysRemaining: null };

  // Ajustar la zona horaria para evitar desajustes de un día
  targetDate.setMinutes(targetDate.getMinutes() + targetDate.getTimezoneOffset());

  // Formatear fecha como "DD/MM"
  const day = targetDate.getDate().toString().padStart(2, "0");
  const month = (targetDate.getMonth() + 1).toString().padStart(2, "0");

  if (!calculateDays) return { formattedDate: `${day}/${month}`, daysRemaining: null };

  // Calcular días restantes
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Ignorar horas en el cálculo
  const diffTime = targetDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return { formattedDate: `${day}/${month}`, daysRemaining: diffDays >= 0 ? diffDays : null };
}
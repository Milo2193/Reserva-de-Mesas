const availableTables = [ 
    {number: 1, reserved: false}, 
    {number: 2, reserved: false}, 
    {number: 3, reserved: false}, 
    {number: 4, reserved: false}, 
    {number: 5, reserved: false}, 
    {number: 6, reserved: false}, 
    {number: 7, reserved: false}, 
    {number: 8, reserved: false}, 
    {number: 9, reserved: false}, 
    {number: 10, reserved: false}, 
    {number: 11, reserved: false}, 
    {number: 12, reserved: false}, 
];  

const occupiedTables = [];  
const reservations = []; 

document.addEventListener('DOMContentLoaded', () => { 
    renderTables(); 
    document.getElementById('reserveButton').addEventListener('click', reserveTable); 
    document.getElementById('reportButton').addEventListener('click', generateReport);
    
    const today = new Date();
    const todayString = today.getFullYear() + '-' + 
                      String(today.getMonth() + 1).padStart(2, '0') + '-' + 
                      String(today.getDate()).padStart(2, '0');
    document.getElementById('reserveDate').min = todayString;
});

function renderTables() {     
    const availableTablesDiv = document.getElementById('availableTables');     
    const occupiedTablesDiv = document.getElementById('occupiedTables');
     
    availableTablesDiv.innerHTML = '';     
    occupiedTablesDiv.innerHTML = '';  

    availableTables.forEach(table => {     
        const tableDiv = document.createElement('div');     
        tableDiv.className = 'table';     
        tableDiv.innerHTML = `<img src="imagenes/mesas.png" alt="Mesa ${table.number}"><div class="table-name">Mesa ${table.number}</div>`;       


        const tableReservations = reservations.filter(r => r.tableNumber === table.number);
        
        if (tableReservations.length === 0) {
            const reserveButton = document.createElement('button');         
            reserveButton.className = 'button';         
            reserveButton.textContent = 'Reservar';         
            reserveButton.onclick = () => reserveSpecificTable(table.number);
            tableDiv.appendChild(reserveButton);
            availableTablesDiv.appendChild(tableDiv);
        } else {
            const customerInfo = document.createElement('div');
            customerInfo.className = 'customer-info';
            customerInfo.textContent = `${tableReservations.length} reserva(s)`;
            tableDiv.appendChild(customerInfo);
            
            const reserveButton = document.createElement('button');
            reserveButton.className = 'button';
            reserveButton.textContent = 'Más Reservas';
            reserveButton.onclick = () => reserveSpecificTable(table.number);
            tableDiv.appendChild(reserveButton);
            
            occupiedTablesDiv.appendChild(tableDiv);
        }     
    });  
}

function reserveSpecificTable(tableNumber) {
    const customerName = prompt('Ingresa el nombre del cliente:');
    const reserveDate = prompt('Ingresa la fecha :');
    const reserveTime = prompt('Ingresa la hora :');
    
    if (!customerName || customerName.trim() === '') {
        alert('Nombre del cliente requerido');
        return;
    }
    
    if (!reserveDate || !reserveTime) {
        alert('Fecha y hora requeridas');
        return;
    }
    
    if (!checkTimeConflict(tableNumber, reserveDate, reserveTime)) {
        return;
    }
    
    reservations.push({
        tableNumber: tableNumber,
        customerName: customerName.trim(),
        date: reserveDate,
        time: reserveTime
    });
    
    renderTables();
    alert(`Mesa ${tableNumber} reservada exitosamente para ${customerName} el ${reserveDate} a las ${reserveTime}`);
}

function releaseTable(tableNumber) {
    const tableReservations = reservations.filter(r => r.tableNumber === tableNumber);
    
    if (tableReservations.length === 0) {
        alert('Esta mesa no tiene reservas');
        return;
    }
    
    let reservationList = 'Reservas para Mesa' + tableNumber + ':\n\n';
    tableReservations.forEach((res, index) => {
        reservationList += `${index + 1}. ${res.customerName} - ${res.date} ${res.time}\n`;
    });
    
    const choice = prompt(reservationList + '\n¿Qué reserva quieres cancelar? (ingresa el número)');
    const choiceIndex = parseInt(choice) - 1;
    
    if (choiceIndex >= 0 && choiceIndex < tableReservations.length) {
        const reservationToRemove = tableReservations[choiceIndex];
        const globalIndex = reservations.findIndex(r => 
            r.tableNumber === reservationToRemove.tableNumber && 
            r.date === reservationToRemove.date && 
            r.time === reservationToRemove.time &&
            r.customerName === reservationToRemove.customerName
        );
        
        if (globalIndex > -1) {
            reservations.splice(globalIndex, 1);
            renderTables();
            alert(`Reserva cancelada: ${reservationToRemove.customerName} - ${reservationToRemove.date} ${reservationToRemove.time}`);
        }
    } else {
        alert('Selección no válida');
    }
}

function checkTimeConflict(tableNumber, date, time) {
    for (let i = 0; i < reservations.length; i++) {
        const existing = reservations[i];
        if (existing.tableNumber == tableNumber && existing.date == date) {
            
            const existingHour = parseInt(existing.time.split(':')[0]);
            const existingMin = parseInt(existing.time.split(':')[1]);
            const newHour = parseInt(time.split(':')[0]);
            const newMin = parseInt(time.split(':')[1]);
            
            const existingTotalMin = existingHour * 60 + existingMin;
            const newTotalMin = newHour * 60 + newMin;
            
            const difference = Math.abs(newTotalMin - existingTotalMin);
            
            if (difference < 180) {
                alert(`Error: Ya hay una reserva a las ${existing.time}. Debe haber mínimo 3 horas de diferencia entre reservas de la misma mesa en el mismo día`);
                return false;
            }
        }
    }
    return true;
}

function reserveTable() {
    const customerName = document.getElementById('customerName').value.trim();
    const tableNumber = parseInt(document.getElementById('tableNumber').value);
    const reserveDate = document.getElementById('reserveDate').value;
    const reserveTime = document.getElementById('reserveTime').value;

    if (!customerName) {
        alert('Por favor, ingresa el nombre del cliente');
        return;
    }
    
    if (!tableNumber || tableNumber < 1 || tableNumber > 12) {
        alert('Por favor, ingresa un número de mesa válido (1-12)');
        return;
    }
    
    if (!reserveDate) {
        alert('Por favor, selecciona una fecha');
        return;
    }
    
    if (!reserveTime) {
        alert('Por favor, selecciona una hora');
        return;
    }
    
    if (!checkTimeConflict(tableNumber, reserveDate, reserveTime)) {
        return;
    }
    
    reservations.push({
        tableNumber: tableNumber,
        customerName: customerName,
        date: reserveDate,
        time: reserveTime
    });
    
    document.getElementById('customerName').value = '';
    document.getElementById('tableNumber').value = '';
    document.getElementById('reserveDate').value = '';
    document.getElementById('reserveTime').value = '';
    
    renderTables();
    alert(`Mesa ${tableNumber} reservada exitosamente para ${customerName} el ${reserveDate} a las ${reserveTime}`);
}

function generateReport() {
    const reportOutput = document.getElementById('reportOutPut');
    
    let report = `=== REPORTE DE RESERVAS ===\n\n`;
    report += `Total de reservas: ${reservations.length}\n\n`;
    
    if (reservations.length > 0) {
        report += `=== TODAS LAS RESERVAS ===\n`;
        
        const reservationsByTable = {};
        reservations.forEach(reservation => {
            if (!reservationsByTable[reservation.tableNumber]) {
                reservationsByTable[reservation.tableNumber] = [];
            }
            reservationsByTable[reservation.tableNumber].push(reservation);
        });
        

        Object.keys(reservationsByTable).sort((a, b) => parseInt(a) - parseInt(b)).forEach(tableNumber => {
            report += `\nMesa ${tableNumber}:\n`;
            reservationsByTable[tableNumber].forEach(reservation => {
                report += `  - ${reservation.customerName}: ${reservation.date} ${reservation.time}\n`;
            });
        });
        
        report += `\n=== MESAS SIN RESERVAS ===\n`;
        const tablesWithReservations = Object.keys(reservationsByTable).map(num => parseInt(num));
        availableTables.forEach(table => {
            if (!tablesWithReservations.includes(table.number)) {
                report += `Mesa ${table.number}\n`;
            }
        });
    } else {
        report += `No hay reservas actualmente.\n\n`;
        report += `=== TODAS LAS MESAS DISPONIBLES ===\n`;
        availableTables.forEach(table => {
            report += `Mesa ${table.number}\n`;
        });
    }
    
    reportOutput.textContent = report;
}
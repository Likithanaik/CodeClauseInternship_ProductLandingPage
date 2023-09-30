document.querySelector('form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = e.target;

    const formData = new FormData(form);
    const dateInput = formData.get('date');
    const timeInput = formData.get('time');
    const tableNumberInput = formData.get('tableNumber');
    const selectedDate = new Date(dateInput);

    console.log('Date:', dateInput);
    console.log('Time:', timeInput);
    console.log('Table Number:', formData.get('tableNumber'));
    console.log('Username:', formData.get('username'));
    console.log('Number of Persons:', formData.get('numberOfPersons'));


    const openingTime = new Date("1970-01-01T09:00:00"); // Opening time in 24-hour format
    const closingTime = new Date("1970-01-01T22:00:00"); // Closing time in 24-hour format
    const currentDate = new Date();

    // Check if the selected date is today or a future date
    if (selectedDate < currentDate) {
        alert('Invalid date selected.');
        return;
    }

    // Check if the selected date is a Sunday (day 0)
    if (selectedDate.getDay() === 0) {
        alert('You cannot book on Sundays.');
        return;
    }

    // Check if the selected time is within opening and closing hours
    const selectedTime = new Date(`1970-01-01T${timeInput}:00`);
    if (selectedTime < openingTime || selectedTime > closingTime) {
        alert('Invalid time selected.');
        return;
    }

    try {
        const response = await fetch('/book-table', {
            method: 'POST',
            body: formData,
        });

        if (response.status === 200) {
            // Booking successful, display a success message
            const data = await response.json();
            alert(`Thank you for booking table ${data.tableNumber} at ${data.time}`);
            form.reset(); // Clear the form
        } else if (response.status === 400) {
            // Booking failed, display an error message
            const data = await response.json();
            alert(data.error);
        } else {
            alert('Booking failed. Please try again.');
        }
    } catch (error) {
        console.error(error);
        alert('An error occurred. Please try again later.');
    }
});

console.log('Date:', dateInput);
console.log('Time:', timeInput);
console.log('Table Number:', tableNumberInput);
console.log('Username:', usernameInput);
console.log('Number of Persons:', numberOfPersonsInput);

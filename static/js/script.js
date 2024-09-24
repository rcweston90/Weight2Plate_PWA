document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('calculatorForm');
    const result = document.getElementById('result');
    const platesList = document.getElementById('platesList');
    const error = document.getElementById('error');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const weight = document.getElementById('weight').value;
        const barWeight = document.getElementById('barWeight').value;

        try {
            const response = await fetch('/calculate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ weight, barWeight }),
            });

            if (!response.ok) {
                throw new Error('Invalid input');
            }

            const data = await response.json();
            displayResult(data.plates);
        } catch (err) {
            displayError(err.message);
        }
    });

    function displayResult(plates) {
        error.classList.add('hidden');
        result.classList.remove('hidden');
        platesList.textContent = plates.join(', ') + ' lbs';
    }

    function displayError(message) {
        result.classList.add('hidden');
        error.classList.remove('hidden');
        error.textContent = message;
    }
});

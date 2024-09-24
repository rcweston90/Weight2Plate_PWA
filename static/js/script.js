document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('calculatorForm');
    const result = document.getElementById('result');
    const platesList = document.getElementById('platesList');
    const dropSetResults = document.getElementById('dropSetResults');
    const error = document.getElementById('error');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const weight = document.getElementById('weight').value;
        const barWeight = document.getElementById('barWeight').value;
        const finalSideWeight = document.getElementById('finalSideWeight').value;
        const percentDrop = document.getElementById('percentDrop').value;

        try {
            const response = await fetch('/calculate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ weight, barWeight, finalSideWeight, percentDrop }),
            });

            if (!response.ok) {
                throw new Error('Invalid input');
            }

            const data = await response.json();
            displayResult(data);
        } catch (err) {
            displayError(err.message);
        }
    });

    function displayResult(data) {
        error.classList.add('hidden');
        result.classList.remove('hidden');
        platesList.textContent = data.plates.join(', ') + ' lbs';

        if (data.final_set_weight) {
            dropSetResults.classList.remove('hidden');
            document.getElementById('finalSetWeight').textContent = `Final Set Weight: ${data.final_set_weight.toFixed(2)} lbs`;
            document.getElementById('dropSideWeight').textContent = `Drop Side Weight: ${data.drop_side_weight.toFixed(2)} lbs`;
            document.getElementById('remainingWeight').textContent = `Remaining Weight: ${data.remaining_weight.toFixed(2)} lbs`;
            document.getElementById('remainingWeightPerSide').textContent = `Remaining Weight Per Side: ${data.remaining_weight_per_side.toFixed(2)} lbs`;
        } else {
            dropSetResults.classList.add('hidden');
        }
    }

    function displayError(message) {
        result.classList.add('hidden');
        error.classList.remove('hidden');
        error.textContent = message;
    }
});

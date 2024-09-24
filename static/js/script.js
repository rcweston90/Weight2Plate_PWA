document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('calculatorForm');
    const result = document.getElementById('result');
    const error = document.getElementById('error');
    const unitRadios = document.querySelectorAll('input[name="unit"]');
    const unitLabels = document.querySelectorAll('.unit');
    const barWeightInput = document.getElementById('barWeight');

    unitRadios.forEach(radio => {
        radio.addEventListener('change', () => {
            const selectedUnit = radio.value;
            unitLabels.forEach(label => label.textContent = selectedUnit);
            barWeightInput.value = selectedUnit === 'lbs' ? '45' : '20';
        });
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const barWeight = document.getElementById('barWeight').value;
        const finalSideWeight = document.getElementById('finalSideWeight').value;
        const percentDrop = document.getElementById('percentDrop').value;
        const unit = document.querySelector('input[name="unit"]:checked').value;

        if (!barWeight || !finalSideWeight || !percentDrop) {
            displayError('All fields are required');
            return;
        }

        try {
            const response = await fetch('/calculate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ barWeight, finalSideWeight, percentDrop, unit }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'An error occurred');
            }

            displayResult(data);
        } catch (err) {
            displayError(err.message);
        }
    });

    function displayResult(data) {
        error.classList.add('hidden');
        result.classList.remove('hidden');
        document.getElementById('finalSetWeight').textContent = `Final Set Weight: ${data.final_set_weight} ${data.unit}`;
        document.getElementById('dropSideWeight').textContent = `Drop Side Weight: ${data.drop_side_weight} ${data.unit}`;
        document.getElementById('remainingWeight').textContent = `Remaining Weight: ${data.remaining_weight} ${data.unit}`;
        document.getElementById('remainingWeightPerSide').textContent = `Remaining Weight Per Side: ${data.remaining_weight_per_side} ${data.unit}`;
    }

    function displayError(message) {
        result.classList.add('hidden');
        error.classList.remove('hidden');
        error.textContent = message;
    }
});

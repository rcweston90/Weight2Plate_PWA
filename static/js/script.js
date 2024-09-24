document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('calculatorForm');
    const result = document.getElementById('result');
    const error = document.getElementById('error');
    const unitRadios = document.querySelectorAll('input[name="unit"]');
    const unitLabels = document.querySelectorAll('.unit');
    const barWeightSelect = document.getElementById('barWeight');
    const percentDropSlider = document.getElementById('percentDrop');
    const percentDropValue = document.getElementById('percentDropValue');

    function updateBarWeightOptions(unit) {
        const options = [
            { lbs: 45, kg: 20.4 },
            { lbs: 35, kg: 15.9 },
            { lbs: 33, kg: 15 },
            { lbs: 25, kg: 11.3 },
            { lbs: 15, kg: 6.8 }
        ];

        barWeightSelect.innerHTML = '';
        options.forEach(option => {
            const optionElement = document.createElement('option');
            optionElement.value = option[unit];
            optionElement.textContent = `${option[unit]} ${unit} (${option[unit === 'lbs' ? 'kg' : 'lbs']} ${unit === 'lbs' ? 'kg' : 'lbs'})`;
            barWeightSelect.appendChild(optionElement);
        });
    }

    unitRadios.forEach(radio => {
        radio.addEventListener('change', () => {
            const selectedUnit = radio.value;
            unitLabels.forEach(label => label.textContent = selectedUnit);
            updateBarWeightOptions(selectedUnit);
        });
    });

    percentDropSlider.addEventListener('input', () => {
        percentDropValue.textContent = percentDropSlider.value;
    });

    updateBarWeightOptions('lbs');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const barWeight = barWeightSelect.value;
        const finalSideWeight = document.getElementById('finalSideWeight').value;
        const percentDrop = percentDropSlider.value;
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

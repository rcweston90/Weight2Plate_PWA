document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('calculatorForm');
    const result = document.getElementById('result');
    const error = document.getElementById('error');
    const unitRadios = document.querySelectorAll('input[name="unit"]');
    const unitLabels = document.querySelectorAll('.unit');
    const barWeightInput = document.getElementById('barWeight');
    const canvas = document.getElementById('barbellCanvas');
    const ctx = canvas.getContext('2d');

    function resizeCanvas() {
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
        if (result.classList.contains('hidden')) return;
        const data = JSON.parse(result.dataset.calculationResult);
        visualizeBarbell(data);
    }

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

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
            visualizeBarbell(data);
        } catch (err) {
            displayError(err.message);
        }
    });

    function displayResult(data) {
        error.classList.add('hidden');
        result.classList.remove('hidden');
        result.dataset.calculationResult = JSON.stringify(data);
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

    function visualizeBarbell(data) {
        const weights = calculatePlates(data.remaining_weight_per_side, data.unit);
        drawLoadedBarbell(ctx, canvas.width, canvas.height, weights, data.unit);
    }

    function calculatePlates(weight, unit) {
        const availablePlates = unit === 'lbs' ? [45, 35, 25, 10, 5, 2.5] : [20, 15, 10, 5, 2.5, 1.25];
        const plates = [];
        let remainingWeight = weight;

        for (const plate of availablePlates) {
            while (remainingWeight >= plate) {
                plates.push(plate);
                remainingWeight -= plate;
            }
        }

        return plates;
    }
});

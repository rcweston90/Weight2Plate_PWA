document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('calculatorForm');
    const result = document.getElementById('result');
    const error = document.getElementById('error');
    const unitRadios = document.querySelectorAll('input[name="unit"]');
    const unitLabels = document.querySelectorAll('.unit');
    const barWeightTiles = document.getElementById('barWeightTiles');
    const percentDropSlider = document.getElementById('percentDrop');
    const percentDropValue = document.getElementById('percentDropValue');

    const barWeightOptions = [
        { lbs: 45, kg: 20 },
        { lbs: 35, kg: 15 },
        { lbs: 33, kg: 15 },
        { lbs: 25, kg: 10 },
        { lbs: 15, kg: 7 }
    ];

    let selectedBarWeight = barWeightOptions[0].lbs;

    function createBarWeightTiles(unit) {
        console.log(`Creating bar weight tiles for unit: ${unit}`);
        barWeightTiles.innerHTML = '';
        barWeightOptions.forEach(option => {
            const tile = document.createElement('div');
            tile.className = 'bar-weight-tile';
            tile.textContent = `${option[unit]} ${unit}`;
            tile.dataset.weight = option[unit];
            tile.addEventListener('click', () => selectBarWeight(tile));
            barWeightTiles.appendChild(tile);
            console.log(`Created tile: ${tile.textContent}`);
        });
        selectBarWeight(barWeightTiles.children[0]);
    }

    function selectBarWeight(tile) {
        console.log(`Selecting bar weight: ${tile.dataset.weight}`);
        barWeightTiles.querySelectorAll('.bar-weight-tile').forEach(t => t.classList.remove('selected'));
        tile.classList.add('selected');
        selectedBarWeight = parseFloat(tile.dataset.weight);
        console.log(`Selected bar weight: ${selectedBarWeight}`);
    }

    unitRadios.forEach(radio => {
        radio.addEventListener('change', () => {
            const selectedUnit = radio.value;
            console.log(`Unit changed to: ${selectedUnit}`);
            unitLabels.forEach(label => label.textContent = selectedUnit);
            createBarWeightTiles(selectedUnit);
        });
    });

    percentDropSlider.addEventListener('input', () => {
        percentDropValue.textContent = percentDropSlider.value;
    });

    createBarWeightTiles('lbs');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const finalSideWeight = document.getElementById('finalSideWeight').value;
        const percentDrop = percentDropSlider.value;
        const unit = document.querySelector('input[name="unit"]:checked').value;

        console.log(`Submitting form with: barWeight=${selectedBarWeight}, finalSideWeight=${finalSideWeight}, percentDrop=${percentDrop}, unit=${unit}`);

        if (!selectedBarWeight || !finalSideWeight || !percentDrop) {
            displayError('All fields are required');
            return;
        }

        try {
            const response = await fetch('/calculate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ barWeight: selectedBarWeight, finalSideWeight, percentDrop, unit }),
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

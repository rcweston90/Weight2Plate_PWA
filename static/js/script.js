document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('calculatorForm');
    const result = document.getElementById('result');
    const error = document.getElementById('error');
    const unitButtons = document.querySelectorAll('.unit-button');
    const unitLabels = document.querySelectorAll('.unit');
    const barWeightTiles = document.getElementById('barWeightTiles');
    const percentDropValue = document.getElementById('percentDropValue');
    const finalSideWeightSlider = document.getElementById('finalSideWeight');
    const finalSideWeightValue = document.getElementById('finalSideWeightValue');

    const barWeightOptions = [
        { lbs: 45, kg: 20 },
        { lbs: 35, kg: 15 },
        { lbs: 33, kg: 15 },
        { lbs: 25, kg: 10 },
        { lbs: 15, kg: 7 }
    ];

    let selectedBarWeight = barWeightOptions[0].lbs;
    let selectedUnit = 'lbs';

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

    unitButtons.forEach(button => {
        button.addEventListener('click', () => {
            const newUnit = button.textContent.toLowerCase();
            if (newUnit !== selectedUnit) {
                selectedUnit = newUnit;
                unitButtons.forEach(btn => btn.classList.toggle('selected'));
                unitLabels.forEach(label => label.textContent = selectedUnit);
                createBarWeightTiles(selectedUnit);
                updateFinalSideWeightSlider();
            }
        });
    });

    $("#slider2").roundSlider({
        sliderType: "min-range",
        circleShape: "pie",
        startAngle: "315",
        lineCap: "round",
        radius: 130,
        width: 20,
        min: 0,
        max: 100,
        svgMode: true,
        pathColor: "#eee",
        borderWidth: 0,
        startValue: 10,
        valueChange: function (e) {
            var color = e.isInvertedRange ? "#FF5722" : "#8BC34A";
            $("#slider2").roundSlider({ "rangeColor": color, "tooltipColor": color });
            document.getElementById('percentDropValue').textContent = e.value;
        }
    });

    finalSideWeightSlider.addEventListener('input', () => {
        finalSideWeightValue.textContent = finalSideWeightSlider.value;
    });

    function updateFinalSideWeightSlider() {
        const maxWeight = selectedUnit === 'lbs' ? 500 : 225;
        finalSideWeightSlider.max = maxWeight;
        finalSideWeightSlider.value = Math.min(finalSideWeightSlider.value, maxWeight);
        finalSideWeightValue.textContent = finalSideWeightSlider.value;
    }

    createBarWeightTiles('lbs');
    updateFinalSideWeightSlider();

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const finalSideWeight = finalSideWeightSlider.value;
        const percentDrop = $("#slider2").roundSlider("getValue");

        console.log(`Submitting form with: barWeight=${selectedBarWeight}, finalSideWeight=${finalSideWeight}, percentDrop=${percentDrop}, unit=${selectedUnit}`);

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
                body: JSON.stringify({ barWeight: selectedBarWeight, finalSideWeight, percentDrop, unit: selectedUnit }),
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

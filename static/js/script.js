document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('calculatorForm');
    const result = document.getElementById('result');
    const error = document.getElementById('error');
    const unitButtons = document.querySelectorAll('.unit-button');
    const unitLabels = document.querySelectorAll('.unit');
    const barWeightTiles = document.getElementById('barWeightTiles');
    const finalSideWeightSlider = document.getElementById('finalSideWeight');
    const finalSideWeightNumber = document.getElementById('finalSideWeightNumber');
    const calculateButton = document.getElementById('calculateButton');
    const resetButton = document.getElementById('resetButton');

    const barWeightOptions = [
        { lbs: 45, kg: 20 },
        { lbs: 35, kg: 15 },
        { lbs: 33, kg: 15 },
        { lbs: 25, kg: 10 },
        { lbs: 15, kg: 7 }
    ];

    let selectedBarWeight = barWeightOptions[0].lbs;
    let selectedUnit = 'lbs';

    function createBarWeightTiles() {
        console.log(`Creating bar weight tiles`);
        barWeightTiles.innerHTML = '';
        barWeightOptions.forEach(option => {
            const tile = document.createElement('div');
            tile.className = 'bar-weight-tile';
            tile.innerHTML = `
                <span class="lbs-value">${option.lbs} lbs</span>
                <span class="kg-value">${option.kg} kg</span>
            `;
            tile.dataset.lbs = option.lbs;
            tile.dataset.kg = option.kg;
            tile.addEventListener('click', () => selectBarWeight(tile));
            barWeightTiles.appendChild(tile);
            console.log(`Created tile: ${tile.textContent}`);
        });
        selectBarWeight(barWeightTiles.children[0]);
        updateBarWeightTilesVisibility();
    }

    function selectBarWeight(tile) {
        console.log(`Selecting bar weight: ${tile.dataset[selectedUnit]}`);
        barWeightTiles.querySelectorAll('.bar-weight-tile').forEach(t => t.classList.remove('selected'));
        tile.classList.add('selected');
        selectedBarWeight = parseFloat(tile.dataset[selectedUnit]);
        console.log(`Selected bar weight: ${selectedBarWeight}`);
    }

    function updateBarWeightTilesVisibility() {
        barWeightTiles.querySelectorAll('.bar-weight-tile').forEach(tile => {
            tile.querySelector('.lbs-value').style.display = selectedUnit === 'lbs' ? 'inline' : 'none';
            tile.querySelector('.kg-value').style.display = selectedUnit === 'kg' ? 'inline' : 'none';
        });
    }

    unitButtons.forEach(button => {
        button.addEventListener('click', () => {
            const newUnit = button.textContent.toLowerCase();
            if (newUnit !== selectedUnit) {
                selectedUnit = newUnit;
                unitButtons.forEach(btn => btn.classList.toggle('selected'));
                unitLabels.forEach(label => label.textContent = selectedUnit);
                updateBarWeightTilesVisibility();
                updateFinalSideWeightSlider();
                // Update selected bar weight based on the new unit
                const selectedTile = barWeightTiles.querySelector('.selected');
                if (selectedTile) {
                    selectedBarWeight = parseFloat(selectedTile.dataset[selectedUnit]);
                }
            }
        });
    });

    $("#slider2").roundSlider({
        sliderType: "min-range",
        circleShape: "pie",
        startAngle: "315",
        lineCap: "round",
        radius: 100,
        width: 20,
        min: 0,
        max: 100,
        svgMode: true,
        pathColor: "#eee",
        borderWidth: 0,
        startValue: 0,
        valueChange: function (e) {
            var color = e.value > 0 ? "#8BC34A" : "#FF5722";
            $("#slider2").roundSlider({ "rangeColor": color, "tooltipColor": color });
        },
        tooltipFormat: function (e) {
            return Math.abs(e.value) + "%";
        }
    });

    finalSideWeightSlider.addEventListener('input', updateFinalSideWeight);
    finalSideWeightNumber.addEventListener('input', updateFinalSideWeight);

    function updateFinalSideWeight(e) {
        const value = e.target.value;
        finalSideWeightSlider.value = value;
        finalSideWeightNumber.value = value;
    }

    function updateFinalSideWeightSlider() {
        const maxWeight = selectedUnit === 'lbs' ? 500 : 225;
        finalSideWeightSlider.max = maxWeight;
        finalSideWeightNumber.max = maxWeight;
        finalSideWeightSlider.value = Math.min(finalSideWeightSlider.value, maxWeight);
        finalSideWeightNumber.value = finalSideWeightSlider.value;
    }

    createBarWeightTiles();
    updateFinalSideWeightSlider();

    calculateButton.addEventListener('click', async (e) => {
        e.preventDefault();
        const finalSideWeight = finalSideWeightSlider.value;
        const percentDrop = Math.abs($("#slider2").roundSlider("getValue"));

        console.log(`Calculating with: barWeight=${selectedBarWeight}, finalSideWeight=${finalSideWeight}, percentDrop=${percentDrop}, unit=${selectedUnit}`);

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

    function resetCalculator() {
        // Reset form inputs
        finalSideWeightSlider.value = 45;
        finalSideWeightNumber.value = 45;
        $("#slider2").roundSlider("setValue", 0);

        // Reset unit to lbs
        selectedUnit = 'lbs';
        unitButtons.forEach(btn => {
            btn.classList.toggle('selected', btn.textContent.toLowerCase() === 'lbs');
        });
        unitLabels.forEach(label => label.textContent = 'lbs');

        // Reset bar weight
        const defaultBarWeightTile = document.querySelector('.bar-weight-tile[data-lbs="45"]');
        if (defaultBarWeightTile) {
            selectBarWeight(defaultBarWeightTile);
        }
        updateBarWeightTilesVisibility();

        // Clear results and errors
        result.classList.add('hidden');
        error.classList.add('hidden');

        // Update UI
        updateFinalSideWeightSlider();
        
        console.log('Calculator reset');
    }

    resetButton.addEventListener('click', resetCalculator);
});

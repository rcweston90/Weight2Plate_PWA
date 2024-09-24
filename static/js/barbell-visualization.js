// Barbell Visualization

// Color mapping for different plate weights
const plateColors = {
    '45': '#FF0000', // Red
    '35': '#0000FF', // Blue
    '25': '#00FF00', // Green
    '10': '#FFFF00', // Yellow
    '5': '#FFA500',  // Orange
    '2.5': '#800080' // Purple
};

function drawBarbell(ctx, canvasWidth, canvasHeight) {
    const barLength = canvasWidth * 0.8;
    const barHeight = 10;
    const startX = (canvasWidth - barLength) / 2;
    const startY = canvasHeight / 2 - barHeight / 2;

    ctx.fillStyle = '#808080'; // Gray color for the bar
    ctx.fillRect(startX, startY, barLength, barHeight);
}

function drawPlate(ctx, x, y, width, height, weight, unit) {
    const color = plateColors[weight] || '#CCCCCC'; // Default to gray if weight not in mapping
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);

    // Add weight label
    ctx.fillStyle = '#000000';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${weight} ${unit}`, x + width / 2, y + height / 2);
}

function drawLoadedBarbell(ctx, canvasWidth, canvasHeight, weights, unit) {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    drawBarbell(ctx, canvasWidth, canvasHeight);

    const centerX = canvasWidth / 2;
    const centerY = canvasHeight / 2;
    const plateWidth = 20;
    let currentX = centerX + 100; // Start position for right side plates

    weights.forEach(weight => {
        const plateHeight = weight * 2; // Scale plate height based on weight
        const y = centerY - plateHeight / 2;
        drawPlate(ctx, currentX, y, plateWidth, plateHeight, weight, unit);
        currentX += plateWidth + 2; // Add a small gap between plates

        // Draw the same plate on the left side
        const leftX = canvasWidth - currentX;
        drawPlate(ctx, leftX, y, plateWidth, plateHeight, weight, unit);
    });
}

// Export functions to be used in other scripts
window.drawLoadedBarbell = drawLoadedBarbell;

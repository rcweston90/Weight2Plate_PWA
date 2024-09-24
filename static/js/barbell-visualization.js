// Barbell Visualization

// Color mapping for different plate weights
const plateColors = {
    '45': '#FF0000', // Red
    '35': '#0000FF', // Blue
    '25': '#00FF00', // Green
    '10': '#FFFF00', // Yellow
    '5': '#FFA500',  // Orange
    '2.5': '#800080', // Purple
    '20': '#FF1493', // Deep Pink (for kg)
    '15': '#00FFFF', // Cyan (for kg)
    '1.25': '#8B4513' // Saddle Brown (for kg)
};

function drawBarbell(ctx, canvasWidth, canvasHeight) {
    const barLength = canvasWidth * 0.8;
    const barHeight = 20; // Increased bar height for better visibility
    const startX = (canvasWidth - barLength) / 2;
    const startY = canvasHeight / 2 - barHeight / 2;

    // Draw bar
    ctx.fillStyle = '#4A4A4A'; // Darker gray for the bar
    ctx.fillRect(startX, startY, barLength, barHeight);

    // Draw bar ends
    ctx.fillStyle = '#2F2F2F'; // Even darker for bar ends
    ctx.fillRect(startX - 10, startY - 5, 20, barHeight + 10);
    ctx.fillRect(startX + barLength - 10, startY - 5, 20, barHeight + 10);

    // Add labels
    ctx.fillStyle = '#000000';
    ctx.font = '14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Left Side', startX, canvasHeight - 10);
    ctx.fillText('Bar', canvasWidth / 2, canvasHeight - 10);
    ctx.fillText('Right Side', startX + barLength, canvasHeight - 10);
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

    const maxWeight = Math.max(...weights, 45); // Use 45 as minimum for scaling
    const heightScale = (canvasHeight * 0.6) / maxWeight; // Adjust scale factor

    weights.forEach(weight => {
        const plateHeight = weight * heightScale; // Scale plate height based on weight
        const y = centerY - plateHeight / 2;
        drawPlate(ctx, currentX, y, plateWidth, plateHeight, weight, unit);
        currentX += plateWidth + 2; // Add a small gap between plates

        // Draw the same plate on the left side
        const leftX = canvasWidth - currentX;
        drawPlate(ctx, leftX, y, plateWidth, plateHeight, weight, unit);
    });

    // Draw legend
    drawLegend(ctx, canvasWidth, canvasHeight, unit);
}

function drawLegend(ctx, canvasWidth, canvasHeight, unit) {
    const legendX = 10;
    const legendY = 10;
    const legendWidth = 150;
    const legendHeight = Object.keys(plateColors).length * 25 + 30;

    // Draw legend background
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.fillRect(legendX, legendY, legendWidth, legendHeight);
    ctx.strokeStyle = '#000000';
    ctx.strokeRect(legendX, legendY, legendWidth, legendHeight);

    // Draw legend title
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('Plate Legend', legendX + 5, legendY + 20);

    // Draw color boxes and labels
    ctx.font = '12px Arial';
    let yOffset = 40;
    for (const [weight, color] of Object.entries(plateColors)) {
        if ((unit === 'lbs' && ['20', '15', '1.25'].includes(weight)) ||
            (unit === 'kg' && ['45', '35', '25'].includes(weight))) {
            continue; // Skip weights not used in the current unit system
        }
        ctx.fillStyle = color;
        ctx.fillRect(legendX + 5, legendY + yOffset, 20, 20);
        ctx.fillStyle = '#000000';
        ctx.fillText(`${weight} ${unit}`, legendX + 30, legendY + yOffset + 15);
        yOffset += 25;
    }
}

// Export functions to be used in other scripts
window.drawLoadedBarbell = drawLoadedBarbell;

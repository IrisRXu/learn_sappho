function submitSearch(query) {
    const form = document.createElement('form');
    form.action = '/create';
    form.method = 'get';

    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = 'query';
    input.value = query;

    form.appendChild(input);
    document.body.appendChild(form);
    form.submit();
}
// Array to store quote positions
const quotePositions = [];

// Function to download the canvas content as an image
function downloadImage() {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas for the final render

    // Fill the canvas with the background color
    ctx.fillStyle = getComputedStyle(canvas).backgroundColor || 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw all quotes at their stored positions
    quotePositions.forEach(({ quoteId, x, y }) => {
        const quoteElement = document.getElementById(quoteId);
        const quoteText = quoteElement.textContent;

        // Dynamically retrieve the computed font size and style
        const computedStyle = window.getComputedStyle(quoteElement);
        ctx.font = `${computedStyle.fontSize} ${computedStyle.fontFamily}`;
        ctx.fillStyle = computedStyle.color || 'black';

        ctx.fillText(quoteText, x, y); // Draw the quote text at the stored position
    });

    // Create a download link for the canvas as an image
    const link = document.createElement('a');
    link.download = 'my_poem.png';
    link.href = canvas.toDataURL('image/png'); // Convert the canvas to a data URL
    link.click(); // Trigger the download
}

document.addEventListener('DOMContentLoaded', () => {
    

    // Function to handle drag start
    document.querySelectorAll('.quote').forEach((quote) => {
        quote.addEventListener('dragstart', (event) => {
            event.dataTransfer.setData('text/plain', event.target.id);
            event.target.classList.add('quote-dragging');
        });

        quote.addEventListener('dragend', (event) => {
            event.target.classList.remove('quote-dragging');
        });
    });

    // Function to handle drop onto the canvas
    const canvas = document.getElementById('canvas');
    canvas.addEventListener('dragover', (event) => {
        event.preventDefault();
    });

    canvas.addEventListener('drop', (event) => {
        event.preventDefault();
        const quoteId = event.dataTransfer.getData('text/plain');
        const quote = document.getElementById(quoteId);
        const canvasRect = canvas.getBoundingClientRect();

        // Get mouse position relative to canvas
        const mouseX = event.clientX - canvasRect.left;
        const mouseY = event.clientY - canvasRect.top;

        // Store the dropped position of the quote
        quotePositions.push({ quoteId, x: mouseX, y: mouseY });

        drawCanvas();
    });

    // Function to draw the quotes on the canvas
    function drawCanvas() {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas

        // Fill the canvas with the background color
        ctx.fillStyle = getComputedStyle(canvas).backgroundColor || 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        quotePositions.forEach(({ quoteId, x, y }) => {
            const quoteElement = document.getElementById(quoteId);
            const quoteText = quoteElement.textContent;

            // Dynamically retrieve the computed font size and style
            const computedStyle = window.getComputedStyle(quoteElement);
            ctx.font = `${computedStyle.fontSize} ${computedStyle.fontFamily}`;
            ctx.fillStyle = computedStyle.color || 'black';

            ctx.fillText(quoteText, x, y); // Draw the quote text at the stored position
        });
    }   
});
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



$(function(){
    const canvas = document.getElementById('canvas');
    canvas.style.display = 'block';

    // Make the canvas droppable
    $(canvas).droppable({
        drop: function(event, ui) {
            const droppedElement = ui.helper.clone();
            const canvasOffset = $(this).offset();
            const elementOffset = ui.offset;

            // Adjust position relative to the canvas
            droppedElement.css({
                position: 'absolute',
                top: elementOffset.top - canvasOffset.top,
                left: elementOffset.left - canvasOffset.left
            });

            $(this).append(droppedElement);
        }
    });

    // Make quotes draggable
    $('.draggable').draggable({
        helper: function() {
            const clone = $(this).clone();
            clone.css('width', $(this).outerWidth()); // Preserve original width
            return clone;
        },
        revert: 'invalid'
    });
})
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
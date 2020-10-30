function randInt(max, min = 0) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

exports.randInt = randInt;

function randFloat(max, min = 0) {
    return Math.random() * (max - min) + min;
}

exports.randFloat = randFloat;

function randWords(nb) {
    let name = [];
    const words = ['lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit', 'nullam', 'sodales', 'aliquet', 'massa', 'quis', 'mattis', 'quam', 'molestie', 'a', 'donec', 'lacinia', 'pretium', 'mi', 'in', 'luctus', 'vivamus', 'pellentesque', 'metus', 'in', 'mi', 'venenatis', 'sit', 'amet', 'cursus', 'leo', 'dignissim', 'nunc', 'convallis', 'eu', 'sem', 'a', 'aliquet', 'nunc', 'a', 'ex', 'dictum', 'sagittis', 'neque', 'non', 'mattis', 'purus', 'donec', 'ut', 'lorem', 'in', 'tortor', 'porttitor', 'tempor', 'in', 'sed', 'orci', 'maecenas', 'egestas', 'ante', 'id', 'euismod', 'fringilla', 'nunc', 'bibendum', 'nulla', 'velit', 'congue', 'ornare', 'magna', 'fermentum', 'ac', 'etiam', 'ut', 'porttitor', 'ligula', 'a', 'sollicitudin', 'mauris', 'interdum', 'et', 'malesuada', 'fames', 'ac', 'ante', 'ipsum', 'primis', 'in', 'faucibus', 'pellentesque', 'nunc', 'nibh', 'vestibulum', 'quis', 'dictum', 'id', 'scelerisque', 'a', 'nisl', 'quisque', 'ac', 'mi', 'sed', 'ligula', 'molestie', 'gravida', 'sed', 'ut', 'ligula', 'nullam', 'feugiat', 'turpis', 'vel', 'dui', 'consequat', 'sed', 'accumsan', 'lectus', 'hendrerit', 'donec', 'posuere', 'massa', 'vel', 'augue', 'mollis', 'ac', 'rhoncus', 'turpis', 'pellentesque', 'praesent', 'id', 'feugiat', 'quam'];
    for (let i = 0; i < nb; i++) {
        const int = randInt(words.length - 1);
        name.push(words[int]);
    }
    return name.join(' ')
}

exports.randWords = randWords;
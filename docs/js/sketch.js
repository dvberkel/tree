function setup() {
    createCanvas(640, 480);
}

function draw() {
    ellipse(mouseX, mouseY, 80, 80);
}

var tree_system = {
    start: 'S',
    rules: {
        'S': [[1, 'FF'],
              [2, 'G']],
        'F': [[1, 'FF']],
        'G': [[1, 'GF']]
    }
}

function expand(system, n) {
    var word = system.start;
    for (var index = 0; index < n; index++) {
        word = substitute(system.rules, word);
    }
    return word;
}

function substitute(rules, word) {
    var result = '';
    for (var index = 0; index < word.length; index++) {
        var symbol = word[index];
        if (rules[symbol]) {
            result += select_one(rules[symbol]);
        } else {
            result += symbol;
        }
    }
    return result;
}

function select_one(options) {
    var total_weight = options.map(function (option) { return option[0]; }).reduce(function (sum, v) { return sum + v; });
    var target = total_weight * Math.random();
    var accumulated_weight = 0;
    for (var index = 0; index < options.length; index++) {
        accumulated_weight += options[index][0];
        if (accumulated_weight > target) {
            return options[index][1];
        }
    }
    return options[options.length - 1][1];
}
var tree_system = {
    configuration: {
        angle: Math.PI / 12,
        step: 2,
        iterations: 8,
        duration: 1000
    },
    start: 'T',
    rules: {
        'T': [
            [1, 'FT'],
            [3, 'FST'],
        ],
        'S': [
            [1, '[--T][++T]'],
            [3, '[-----T][--T][++T][+++++T]'],
            [1, '[-----T][--T][-S][+S][++T][+++++T]']
         ],
        'F': [[1, 'FF']],
    }
}

var system = document.getElementById('system');
system.value = JSON.stringify(tree_system, null, 2);

var command, last_time;

function setup() {
    var canvast = createCanvas(640, 640);
    canvast.parent('sketch-container');
    strokeWeight(4);
    stroke(125);
    last_time = millis();
    command = expand(tree_system);
}

function draw() {
    translate(width / 2, height);
    scale(1, -1);
    rotate(Math.PI / 2);
    try {
        tree_system = JSON.parse(system.value);
        system.classList.remove('error');
    } catch (e) {
        system.classList.add('error');
    }
    var time = millis()
    if ((time - last_time) > tree_system.configuration.duration) {
        command = expand(tree_system);
        last_time = time;
    }
    background(255);
    interpret(tree_system.configuration, command);
}

function interpret(configuration, word) {
    for (var index = 0; index < word.length; index++) {
        var symbol = word[index];
        switch (symbol) {
            case 'F':
                translate(configuration.step, 0);
                line(0, 0, -configuration.step, 0);
                break;
            case '-':
                rotate(-1 * configuration.angle);
                break;
            case '+':
                rotate(configuration.angle);
                break;
            case '[':
                push();
                break;
            case ']':
                pop();
                break;
            default:
                /* do nothing */
                break;
        }
    }
}

function expand(system) {
    var n = system.configuration.iterations;
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
    var target = total_weight * random();
    var accumulated_weight = 0;
    for (var index = 0; index < options.length; index++) {
        accumulated_weight += options[index][0];
        if (accumulated_weight > target) {
            return options[index][1];
        }
    }
    return options[options.length - 1][1];
}
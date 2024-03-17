import forever from 'forever';

var child = new forever.Forever('./taskmaster.js', {
    max: 1,
    silent: false,
    args: []
});

child.start(); 
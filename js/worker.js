self.postMessage("Thread initialized...");

self.addEventListener('message', function (e) {
    var command = e.data;
    switch (command) {
        case 'initialize':
            thread.initialize();
            break;
    }
}, false);

let thread = {
    fps: 30,
    running: false,

    initialize: function () {
        this.running = true;
        this.run();
    },

    run: function () {
        while (this.running) {
            this.render();
        }
    },

    render: function () {
        this.sleep(1000 / this.fps);
        postMessage("render");
    },

    sleep: function (milliseconds) {
        var start = new Date().getTime();
        for (var i = 0; i < 1e7; i++) {
            if ((new Date().getTime() - start) > milliseconds) {
                break;
            }
        }
    }

}
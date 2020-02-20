function Stopwatch(input, output) {
    // Page elements
    let button = input;
    let clockHolder = output;
    let clock = null;
    let tenthsOuter = null;
    let tenthsInner = null;

    let startedTime = 0;
    let elapsed = 0;

    this.running = false;

    //this.output = results;

    this.results = [];

    this.roundTenths = function (number) {
        return Math.floor(number * 10) / 10;
    }

    this.start = function () {
        //console.log("start", this.running, startedTime, elapsed);
        if (!startedTime) startedTime = Date.now();
        if (!this.running) { this.running = true; }
        //tenthsOuter.innerText = "";
    }

    this.stop = function () {
        //console.log("stop", this.running, startedTime, elapsed);
        this.running = false;
        startedTime = 0;
        //tenthsOuter.innerText = "8";
    }

    this.recordResult = function () {

        this.results.push(this.roundTenths(elapsed));
        //console.log(this.results);
    }

    this.startstop = function () {
        //console.log("startstop", this.running, startedTime, elapsed);

        if (this.running) {
            this.recordResult();
            this.stop();
            // emit event
            $(this).trigger("resultAdded");
        } else { this.start() }
    }

    this.clearResults = function () {
        if (!this.running && this.results.length > 0) {
            this.results = [];
            $(this).trigger("resultsCleared");

        }
    }

    this.updateDisplay = function () {
        //console.log("updateDisplay");
        let fraction = (elapsed - Math.floor(elapsed));

        let displayTime = formatTime(elapsed, false);


        /*  <div class="fullcolumn">
          <div id="stopwatch">00:00 </div>
          <div id="tenths_outer"
            style="position: absolute; right: 5%; margin:  2.5vh 0 0 0; padding: 0px; height: 10vh; width: 20%; border: 6px solid green">
            <div id="sw_tenths"></div>
          </div>
        </div>*/
        if (!clock) {
            //Create DIV for clock display
            clock = document.createElement('div');
            clock.id = "stopwatch";
            clock.innerText = displayTime;
            clockHolder.innerText = "";
            clockHolder.appendChild(clock);
        } else {
            clock.innerText = displayTime;
        }

        if (!tenthsOuter || !tenthsInner) {
            //Create DIVs for tenths display
            tenthsOuter = document.createElement('div');
            tenthsOuter.style = "position: absolute; right: 5%; margin:  2.5vh 0 0 0; padding: 0px; height: 10vh; width: 20%; border: 6px solid green";
            tenthsInner = document.createElement('div');
            tenthsInner.id = "sw_tenths";
            tenthsOuter.appendChild(tenthsInner);
            clockHolder.appendChild(tenthsOuter);
        } else {
            // Update tenths display
            newHeight = tenthsOuter.clientHeight * fraction;
            tenthsInner.style.height = `${newHeight}px`;
        }



    }

    this.step = function () {
        //console.log("step");
        if (!this.running) return;
        elapsed = (Date.now() - startedTime) / 1000;
        this.updateDisplay();
    }

    // Set up DIVs etc
    this.updateDisplay();

    var ua = window.navigator.userAgent;
    var iOS = !!ua.match(/iPad/i) || !!ua.match(/iPhone/i);
    var webkit = !!ua.match(/WebKit/i);
    var iOSSafari = iOS && webkit && !ua.match(/CriOS/i);

    if (iOS || iOSSafari) {
        Pressure.set(button, {
            startDeepPress: (event) => {
                let oldClockBack = clockHolder.style.background;
                let oldButtonBack = button.style.background;
                clockHolder.style.background = "#339933";
                button.style.background = "#339933";
                this.startstop();
                // When touch event fires, this is needed to prevent the click
                // event from firing as well
                event.preventDefault();
                event.stopPropagation();

                setTimeout(function () {
                    clockHolder.style.background = oldClockBack;
                    button.style.background = oldButtonBack;
                }, 110);
            }
        }, { only: 'touch', preventSelect: true });
    } else {
        button.addEventListener("click", (event) => {
            clockHolder.style.background = "#339933";
            this.startstop();
            // When touch event fires, this is needed to prevent the click
            // event from firing as well
            event.preventDefault();
            event.stopPropagation();
            setTimeout(function () {
                clockHolder.style.background = "#ffffb3";
            }, 110);

        }, false);
    }



}
const ts = timesync.create({
  server: '/api/timesync',
  interval: 23000
});

function pad0(value, count) {
  var result = value.toString();
  for (; result.length < count; --count)
    result = '0' + result;
  return result;
}

function formatTime(time, showTenths = true) {

  let minutes = Math.floor(time / 60);
  let seconds = Math.floor(time % 60);
  //let fraction = (displayTime - Math.floor(displayTime)) * 10; // Leads to some floating point inconsistencies
  let fraction = (time * 10) % 10;
  if (showTenths) { return `${pad0(minutes, 2)}:${pad0(seconds, 2)}.${Math.floor(fraction)}` }
  else { return `${pad0(minutes, 2)}:${pad0(seconds, 2)}` }
}

function SlotTimer(output, uri) {

  this.canFly = false;
  this.slotLabel = null;
  this.dataSource = uri;

  // Page elements
  let countdown = output;
  let updating = false;
  //let dataSource = uri;

  let updater = null;

  this.finishTime = Date.now();

  this.updateSlotInfo = function () {
    //console.log("update", this.updating, this.finishTime);
    //console.log(this);

    $.getJSON(this.dataSource, (data) => {
      //console.log("Getting data");
      //console.log(this);
      this.finishTime = new Date(data.endTime);
      //console.log("New", this.finishTime);
      this.slotLabel = data.type;
      this.group = data.group;
      this.round = data.round;
      this.canFly = data.canFly;
      this.updating = false;
      //console.log("update finished", this.updating);
      $(this).trigger("slotUpdated");
    });

  };

  this.step = function (timestamp) {
    //console.log("step", this.updating, this.finishTime);
    // Slot Timer
    if (!this.finishTime) { //Not initialised
      return
    }
    else {
      const now = new Date(ts.now());
      var current = this.finishTime - now;
      var interval = null;
      current = current / 1000; // convert to seconds
      if (current <= 0) {
        current = 0;
        if (!this.updating) {
          this.updating = true;
          setTimeout(() => { slotTimer.updateSlotInfo() }, 1000);
          //console.log("settimeout called", this.updating, this.finishTime)
        }
        //console.log("continuing", this.updating, this.finishTime);
      }
    }
    
    if (this.slotLabel == "Error" || this.slotLabel == "- - -" ) countdown.innerText = "--:--"
    else countdown.innerText = formatTime(current, false);
  }
}


const ts = timesync.create({
  server: '/api/timesync',
  interval: 23000
});

refreshTime = 2000; //ms

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
  let updating = true;
  //let dataSource = uri;

  let updater = null;

  this.finishTime = Date.now();

  this.updateSlotInfo = function () {

    $.getJSON(this.dataSource, (data) => {
      this.finishTime = new Date(data.endTime);
      this.slotLabel = data.type;
      this.group = data.group;
      this.round = data.round;
      this.canFly = data.canFly;
      $(this).trigger("slotUpdated");
    })
      .done(() => { updating = false })
  };

  this.step = async function (timestamp) {
    if (!this.finishTime) { //Not initialised
      return
    }
    else {
      const now = new Date(ts.now());
      var current = this.finishTime - now;
      current = current / 1000; // convert to seconds
      if (current <= 0) { // Countdown has ended
        current = 0;
        if (!updating) { // Update explicitly
          updating = true;
          setTimeout(() => { slotTimer.updateSlotInfo() }, 200);
        }
      }
      if (this.slotLabel == "Error" || this.slotLabel == "- - -") countdown.innerText = "--:--"
      else countdown.innerText = formatTime(current, false);
    }
  }
}


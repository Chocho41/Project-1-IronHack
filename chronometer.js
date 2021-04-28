export class Chronometer {
    constructor() {
      this.currentTime = 20;
      this.currentMillis = 0;
      this.intervalId = null;
    }
    startClick(clbk) {
        var running = 0;
    
        this.intervalId = window.setInterval(() => {
          running += 10;
          this.currentMillis += 1;
          if (this.currentMillis === 100) this.currentMillis = 0;
    
          if (running === 1000) {
            this.currentTime -= 1;
            running = 0;
          }
    
          if (clbk) clbk(); // the if statement is only there to please Jasmine ;P
    
        }, 10);
      }
    getSeconds = () => this.currentTime % 60;
    
    getMilliSeconds = () => this.currentMillis;
    
    twoDigitsNumber = (nb) => nb >= 10 ? String(nb) : "0" + nb;

    stopClick = () => window.clearInterval(this.intervalId);
}
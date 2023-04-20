export class Timer {

    public startTime: number = 0;
    public endTime: number = 0;

    public Timer() {
        this.resetTimer()
    }

    public resetTimer() {
        this.startTime = 0;
        this.endTime = 0;
    }

    public start() {
        this.startTime = new Date().getTime()
    }

    public stop() {
        this.endTime = new Date().getTime()
    }

    public getElapsedTime() {
        return this.endTime - this.startTime;
    }

    public printElapsedTime(identifier?: string) {
        let prefix = identifier ? `${identifier}: ` : "";
        console.log(`${prefix}Elapsed time: ${this.toString()}`);
    }

    public toString() {
        // print in format: HH:MM:SS.mmm
        let duration = this.getElapsedTime();
        let milliseconds = Math.floor(duration % 1000);
        let seconds = Math.floor((duration / 1000) % 60);
        let minutes = Math.floor((duration / (1000 * 60)) % 60);
        let hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

        // pad with zeros
        let hoursStr = hours.toString().padStart(2, "0");
        let minutesStr = minutes.toString().padStart(2, "0");
        let secondsStr = seconds.toString().padStart(2, "0");
        let millisecondsStr = milliseconds.toString().padStart(3, "0");

        // print in format: HH:MM:SS.mmm
        return `${hoursStr}:${minutesStr}:${secondsStr}.${millisecondsStr}`;
    }

}

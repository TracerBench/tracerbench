import { spawn, ChildProcess } from "child_process";
import * as fs from "fs";
import * as path from "path";
import * as mktemp from "mktemp";
import * as rimraf from "rimraf";
import Trace from "../trace/trace";
import { TraceEvent } from "../trace/trace_event";
import { EventEmitter } from "events";

const CHROME = "/Applications/Google Chrome Canary.app/Contents/MacOS/Google Chrome Canary"
const ITERATIONS = 2;

function startChrome(url: string, categories: string, tracefile: string, duration: number = 5) : ChildProcess {
  let userDataDir = mktemp.createDirSync(path.join(process.env.TMPDIR, "user_profile_XXXXXX"));
  let args = [
    "--user-data-dir="+userDataDir,
    "--no-sandbox",
    "--no-experiments",
    "--disable-extensions",
    "--disable-default-apps",
    "--no-first-run",
    "--noerrdialogs",
    "--window-size=320,640",
    "--trace-startup=" + categories,
    "--trace-startup-duration=" + duration,
    "--trace-startup-file=" + tracefile,
    url
  ];
  let chrome = spawn(CHROME, args, { stdio: 'inherit' });
  chrome.on("close", () => {
    rimraf.sync(userDataDir);
  });
  let start = Date.now();
  let intervalId = setInterval(() => {
    let stat = statSync(tracefile);
    if (stat && stat.size) {
      clearInterval(intervalId);
      chrome.kill();
    }
  }, 200);
  return chrome;
}

function statSync(filename) {
  try {
    return fs.statSync(filename);
  } catch (err) {
    return;
  }
}

function pad(n: number): string {
  if (n < 10) {
    return "0" + n;
  }
  return "" + n;
}

function dateString(): string {
  let date = new Date();
  return date.getUTCFullYear() + pad(date.getUTCMonth() + 1) + pad(date.getUTCDate()) +
         pad(date.getUTCHours()) + pad(date.getUTCMinutes()) + pad(date.getUTCSeconds());
}

export default class ColdStart extends EventEmitter {
  count: number = 0;
  samples: number[] = [];
  dateString: string = dateString();
  url: string;
  constructor(url: string) {
    super();
    this.url = url;
  }
  run() {
    let tracefile = path.join(process.env.TMPDIR, "sample-app-trace-" + this.dateString + "-" + this.count + ".json");
    let chrome = startChrome(this.url, "blink.user_timing", tracefile, 3);
    chrome.on("close", () => {
      let trace = new Trace();
      console.log(tracefile);
      let data = JSON.parse(fs.readFileSync(tracefile,"utf8"));
      trace.addEvents(data.traceEvents);
      let process = trace.findProcess((process) => {
        return process.labels === "Sample App";
      });
      let thread = process.findThread((thread) => {
        return thread.name === "CrRendererMain";
      });
      let navigationStart;
      let firstContentfulPaint;
      thread.markers.forEach((event) => {
        if (event.name === "navigationStart") {
          navigationStart = event.ts;
        } else if (event.name === "firstContentfulPaint") {
          firstContentfulPaint = event.ts;
        }
      });
      this.samples.push(firstContentfulPaint - navigationStart);
      if (this.count < ITERATIONS) {
        this.count++;
        this.run();
      } else {
        this.emit("end", this.samples);
      }
    });
    chrome.on("error", (err) => {
      this.emit("error", err);
    });
  }
}

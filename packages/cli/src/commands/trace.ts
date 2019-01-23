import { Command, flags } from "@oclif/command";
import * as fs from "fs-extra";
import { liveTrace, networkConditions } from "parse-profile";
import { getCookiesFromHAR } from "../utils";

export default class Trace extends Command {
  public static description =
    "Does an automated trace of a webpage. Also takes network conditioner and CPU throttling options.";
  public static flags = {
    cpu: flags.integer({
      char: "c",
      default: 1,
      description: "cpu throttle multiplier",
      required: true
    }),
    har: flags.string({
      char: "h",
      description: "filepath to the HAR file",
      required: true
    }),
    network: flags.string({
      char: "n",
      description: `simulated network conditions for ${Object.keys(
        networkConditions
      ).join(", ")}`
    }),
    output: flags.string({
      char: "o",
      default: "trace.json",
      description: "the filename to save the trace to",
      required: true
    }),
    url: flags.string({
      char: "u",
      description: "url to visit",
      required: true
    })
  };

  public async run() {
    const { flags } = this.parse(Trace);
    const url = flags.url;
    const har = flags.har;
    const output = flags.output;
    const cpu = flags.cpu;
    const network = "none";

    let cookies: any = "";

    try {
      cookies = JSON.parse(fs.readFileSync("cookies.json", "utf8"));
    } catch (error) {
      try {
        cookies = getCookiesFromHAR(JSON.parse(fs.readFileSync(har, "utf8")));
      } catch (error) {
        this.error(
          `Error extracting cookies from HAR file at path ${har}, ${error}`
        );
        this.exit(1);
      }
    }

    liveTrace(url, output, cookies, { cpu, network });
  }
}

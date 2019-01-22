import { Command, flags } from "@oclif/command";
import { Profile } from "parse-profile/src/index";

export default class Trace extends Command {
  public cookies: any;
  public conditions = {
    cpu: 1,
    network: undefined
  };

  public static description =
    "Does an automated trace of a webpage. Also takes network conditioner and CPU throttling options.";

  public networkConditions = Object.keys(Profile.networkConditions).join(", ");

  public static flags = {
    cpu: flags.string({ char: "c", description: "cpu throttle multiplier" }),
    force: flags.boolean({ char: "f" }),
    har: flags.string({ char: "h", description: "filepath to the HAR file" }),
    name: flags.string({ char: "n", description: "name to print" }),
    network: flags.string({
      char: "n",
      description: `simulated network conditions for ${networkConditions}`
    }),
    output: flags.string({
      char: "o",
      description: "the file to save the trace to"
    }),
    url: flags.string({ char: "u", description: "url to visit" })
  };

  public static args = [{ name: "file" }];

  public async run() {
    const { args, flags } = this.parse(Trace);

    const name = flags.name || "world";
    const url = flags.url;
    const har = flags.har;

    this.log(`url ${url} : har ${har}`);
  }
}
// if (ui.network) {
//   conditions.network = ui.network;
// }

// if (ui.cpu) {
//   conditions.cpu = parseInt(ui.cpu, 10);
// }

// if (!ui.output) {
//   ui.output = "trace.json";
// }

// if (!ui.url) {
//   Profile.showError("You must pass a URL using the --url option");
//   process.exit(1);
// }

// if (!ui.har) {
//   Profile.showError(
//     "You must pass a filepath to the HAR file with the --har option"
//   );
//   process.exit(1);
// }

// try {
//   cookies = JSON.parse(fs.readFileSync("cookies.json", "utf8"));
// } catch (error) {
//   try {
//     cookies = getCookiesFromHAR(JSON.parse(fs.readFileSync(ui.har, "utf8")));
//   } catch (error) {
//     Profile.showError(
//       `Error extracting cookies from HAR file at path ${ui.har}`
//     );
//     process.exit(1);
//   }
// }

// Profile.liveTrace(ui.url, ui.output, cookies, conditions);

// function getCookiesFromHAR(har) {
//   let cookies = [];
//   har.log.entries.forEach(entry => {
//     if (entry.response.cookies.length > 0) {
//       cookies.push(entry.response.cookies);
//     }
//   });
//   return (cookies = [].concat.apply([], cookies));
// }

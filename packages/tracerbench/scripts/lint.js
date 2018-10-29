const path = require("path");
const ts = require("typescript");
const { Linter, Configuration } = require("tslint");

let src = build(path.resolve(__dirname, "../src"));
let test = build(path.resolve(__dirname, "../test"));
lint(src);
lint(test);

function build(project) {
  let configFileName = ts.findConfigFile(project, ts.sys.fileExists);
  let configFile = ts.readJsonConfigFile(configFileName, ts.sys.readFile);
  let basePath = ts.getDirectoryPath(configFileName);
  let parsedConfig = ts.parseJsonSourceFileConfigFileContent(
    configFile,
    ts.sys,
    basePath,
    undefined,
    configFileName
  );

  let p = ts.createProgram({
    configFileParsingDiagnostics: parsedConfig.errors,
    rootNames: parsedConfig.fileNames,
    options: parsedConfig.options
  });

  let diagnostics = ts.getPreEmitDiagnostics(p);
  if (diagnostics.length > 0) {
    console.log(
      ts.formatDiagnosticsWithColorAndContext(
        diagnostics,
        ts.createCompilerHost({})
      )
    );
    process.exit(1);
  }

  p.emit();

  return p;
}

function lint(program) {
  let linter = new Linter(
    {
      formatter: "codeFrame"
    },
    program
  );
  const files = Linter.getFileNames(program);
  files.forEach(file => {
    const fileContents = program.getSourceFile(file).getFullText();
    const configuration = Configuration.findConfiguration("tslint.json", file)
      .results;
    linter.lint(file, fileContents, configuration);
  });

  const results = linter.getResult();
  if (results.errorCount > 0 || results.warningCount > 0) {
    console.log(results.output);
    process.exit(1);
  }
}

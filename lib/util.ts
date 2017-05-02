export function runtimeCallStatGroup(name: string) {
  if (/IC_/.test(name)) {
    return "IC";
  }
  if (/StackGuard|Optimize|Deoptimize|Recompile/.test(name)) {
    return "Optimize";
  }
  if (/CompileBackground/.test(name)) {
    return "Compile-Background";
  }
  if (/Compile|_Compile/.test(name)) {
    return "Compile";
  }
  if (/ParseBackground/.test(name)) {
    return "Parse-Background";
  }
  if (/Parse/.test(name)) {
    return "Parse";
  }
  if (/Callback/.test(name)) {
    return "Blink C++";
  }
  if (/API/.test(name)) {
    return "API";
  }
  if (/GC|AllocateInTargetSpace/.test(name)) {
    return "GC";
  }
  if (/JS_Execution/.test(name)) {
    return "JavaScript";
  }
  return "V8 C++";
}

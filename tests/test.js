import { readFileSync } from "fs";
import { WASI } from "wasi";

const wasm = readFileSync(`tests/build/${process.argv[process.argv.indexOf("--suite") + 1]}.spec.wasm`);

const wasi = new WASI({
  version: "preview1",
  preopens: {},
  args: process.argv,
});

const mod = new WebAssembly.Module(wasm);
const instance = new WebAssembly.Instance(mod, {
  ...wasi.getImportObject(),
});

wasi.start(instance);

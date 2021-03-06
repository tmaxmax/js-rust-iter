import { bench, runBenchmarks } from "https://deno.land/std/testing/bench.ts";

import Iter from "./mod.ts";
import { parseIntegral, range } from "./util.ts";

const rand = (v: number) => Math.random() * v % 100 | 0;

const RUNS = parseIntegral(Deno.args[0]) ?? (() => {
  throw new Error("Run count unspecified or invalid");
})();
const ONLY = new RegExp(Deno.args[1]);
const COUNT = 1000000;

bench({
  name: "max with Iter",
  runs: RUNS,
  func(b) {
    b.start();
    const _v = new Iter(range(COUNT)).map(rand).max();
    b.stop();
    void _v;
  },
});

bench({
  name: "max with vanilla JS array methods",
  runs: RUNS,
  func(b) {
    b.start();
    const _v = [...range(COUNT)].map(rand).reduce((max, v) => {
      if (v > max) {
        return v;
      }
      return max;
    });
    b.stop();
    void _v;
  },
});

bench({
  name: "max with for loop",
  runs: RUNS,
  func(b) {
    b.start();
    let max = 0;
    for (let elem of range(COUNT)) {
      elem = rand(elem);
      if (elem > max) {
        max = elem;
      }
    }
    b.stop();
    void max;
  },
});

bench({
  name: "enumerate",
  runs: RUNS,
  func(b) {
    b.start();
    for (const _ of new Iter(range(COUNT)).enumerate());
    b.stop();
  },
});

runBenchmarks({ only: ONLY });

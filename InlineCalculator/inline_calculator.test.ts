import {
  assertEquals,
  assertArrayContains,
  assertMatch,
  assertThrows,
} from "https://deno.land/std/testing/asserts.ts";
import { InlineCalculator } from "./inline_calculator.ts";

Deno.test("test inline calculator", () => {
  const test: string[] = [
    "5",
    "3+5",
    "7/2",
    "(3-2)*7",
    "3%5",
    "(1+((2+3)*(4*5)))",
    "0+0/0",
    "0/0",
    "(55-64)%(12)%(17)-104*(82)%(17)%(55)",
  ];

  const expectResult: number[] = [
    5,
    8,
    3.5,
    7,
    3,
    101,
    0,
    0,
    -8,
  ];

  const result: number[] = test.map((element) => {
    return InlineCalculator.getResult(element);
  });

  assertArrayContains(result, expectResult, "Expect correct result");
});

Deno.test("test operation not supported", () => {
  assertThrows(() => {
    InlineCalculator.getResult("3&5");
  });

  assertThrows(() => {
    InlineCalculator.getResult("3^5");
  });

  assertThrows(() => {
    InlineCalculator.getResult("3#5$");
  });
});

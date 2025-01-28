import { pluralise } from "@/utils/pluralise";
import { it } from "vitest";

it(`adds an "s"`, () => {
  expect(pluralise("thing", 2)).toBe("things");
});

it(`returns the provided irregular plural word`, () => {
  expect(pluralise("person", 2, "people")).toBe("people");
});

it(`returns the word if count is 1`, () => {
  expect(pluralise("thing", 1)).toBe("thing");
  expect(pluralise("person", 1, "people")).toBe("person");
});

it(`returns the plural form if count is 0`, () => {
  expect(pluralise("thing", 0)).toBe("things");
  expect(pluralise("person", 0, "people")).toBe("people");
});

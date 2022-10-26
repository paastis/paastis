import { describe, it, expect } from "@jest/globals";
import RunningApp from "../../src/registry/RunningApp.js";

describe("RunningApp", function () {
  describe("#hasLinkedApps", () => {
    it('should return "true" when app has at least on linked app', () => {
      // given
      const app = new RunningApp(
        "scalingo",
        "osc-fr1",
        "my-testing-app-front",
        15,
        ["my-testing-app-back"]
      );

      // when
      const actual = app.hasLinkedApps;

      // then
      expect(actual).toStrictEqual(true);
    });

    it('should return "false" when app does not have any linked app', () => {
      // given
      const app = new RunningApp(
        "scalingo",
        "osc-fr1",
        "my-testing-app-front",
        15
      );

      // when
      const actual = app.hasLinkedApps;

      // then
      expect(actual).toStrictEqual(false);
    });
  });
});

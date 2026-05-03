import { describe, expect, test } from "bun:test";
import { rewriteToTcy } from "../src/lib/tcy-redirects";

function rewrite(input: string): string | null {
  return rewriteToTcy(new URL(input, "https://love-rox.cc"));
}

describe("rewriteToTcy", () => {
  describe("locale-prefixed package pages", () => {
    test("ja landing → tcy root (no /ja prefix)", () => {
      expect(rewrite("/ja/packages/tate-chu-yoko")).toBe("https://tcy.love-rox.cc/");
    });

    test("ja per-page → tcy /<page>", () => {
      expect(rewrite("/ja/packages/tate-chu-yoko/demo")).toBe("https://tcy.love-rox.cc/demo");
      expect(rewrite("/ja/packages/tate-chu-yoko/react")).toBe("https://tcy.love-rox.cc/react");
      expect(rewrite("/ja/packages/tate-chu-yoko/astro")).toBe("https://tcy.love-rox.cc/astro");
    });

    test("en landing → tcy /en", () => {
      expect(rewrite("/en/packages/tate-chu-yoko")).toBe("https://tcy.love-rox.cc/en");
    });

    test("en per-page → tcy /en/<page>", () => {
      expect(rewrite("/en/packages/tate-chu-yoko/demo")).toBe("https://tcy.love-rox.cc/en/demo");
      expect(rewrite("/en/packages/tate-chu-yoko/rehype")).toBe(
        "https://tcy.love-rox.cc/en/rehype",
      );
    });
  });

  describe("language-less package pages (base)", () => {
    test("landing → tcy root", () => {
      expect(rewrite("/packages/tate-chu-yoko")).toBe("https://tcy.love-rox.cc/");
    });

    test("per-page → tcy /<page>", () => {
      expect(rewrite("/packages/tate-chu-yoko/demo")).toBe("https://tcy.love-rox.cc/demo");
      expect(rewrite("/packages/tate-chu-yoko/vue")).toBe("https://tcy.love-rox.cc/vue");
    });
  });

  describe("blog posts", () => {
    test("ja blog post → tcy /blog/<slug> (no /ja prefix)", () => {
      expect(rewrite("/ja/blog/tate-chu-yoko-release")).toBe(
        "https://tcy.love-rox.cc/blog/tate-chu-yoko-release",
      );
      expect(rewrite("/ja/blog/tate-chu-yoko-v0-2-0")).toBe(
        "https://tcy.love-rox.cc/blog/tate-chu-yoko-v0-2-0",
      );
    });

    test("en blog post → tcy /en/blog/<slug>", () => {
      expect(rewrite("/en/blog/tate-chu-yoko-rehype")).toBe(
        "https://tcy.love-rox.cc/en/blog/tate-chu-yoko-rehype",
      );
      expect(rewrite("/en/blog/tate-chu-yoko-astro")).toBe(
        "https://tcy.love-rox.cc/en/blog/tate-chu-yoko-astro",
      );
    });

    test("language-less blog post → tcy /blog/<slug>", () => {
      expect(rewrite("/blog/tate-chu-yoko-release")).toBe(
        "https://tcy.love-rox.cc/blog/tate-chu-yoko-release",
      );
    });
  });

  describe("query string preservation", () => {
    test("retains query params on redirect", () => {
      expect(rewrite("/ja/packages/tate-chu-yoko/demo?ref=twitter")).toBe(
        "https://tcy.love-rox.cc/demo?ref=twitter",
      );
      expect(rewrite("/blog/tate-chu-yoko-release?utm_source=hn")).toBe(
        "https://tcy.love-rox.cc/blog/tate-chu-yoko-release?utm_source=hn",
      );
    });
  });

  describe("non-matching paths return null", () => {
    test("rox-homepage routes are passed through", () => {
      expect(rewrite("/")).toBeNull();
      expect(rewrite("/en")).toBeNull();
      expect(rewrite("/ja")).toBeNull();
      expect(rewrite("/en/docs")).toBeNull();
      expect(rewrite("/ja/docs/getting-started")).toBeNull();
      expect(rewrite("/en/blog/welcome-to-rox")).toBeNull();
      expect(rewrite("/blog/welcome-to-rox")).toBeNull();
      expect(rewrite("/en/contact")).toBeNull();
    });

    test("partial matches (not the tcy slug pattern) pass through", () => {
      expect(rewrite("/blog/tate-chu-yoko")).toBeNull(); // no slug suffix
      expect(rewrite("/ja/blog/tate-chu-yoko-")).toBeNull(); // empty slug
      expect(rewrite("/packages")).toBeNull();
      expect(rewrite("/en/packages")).toBeNull();
      expect(rewrite("/packages/something-else")).toBeNull();
    });

    test("api routes pass through", () => {
      expect(rewrite("/api/og?title=hello")).toBeNull();
      expect(rewrite("/api/submit")).toBeNull();
    });
  });
});

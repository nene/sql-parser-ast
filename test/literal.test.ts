import { parseExpr, dialect } from "./test_utils";

describe("literal", () => {
  it("parses string", () => {
    expect(parseExpr("'Hello'")).toMatchInlineSnapshot(`
      {
        "type": "string_literal",
        "value": "Hello",
      }
    `);
  });

  it("parses number", () => {
    expect(parseExpr("12.5")).toMatchInlineSnapshot(`
      {
        "type": "number_literal",
        "value": 12.5,
      }
    `);
  });

  it("parses blob", () => {
    expect(parseExpr(`x'3132332D414243'`)).toMatchInlineSnapshot(`
      {
        "type": "blob_literal",
        "value": [
          49,
          50,
          51,
          45,
          65,
          66,
          67,
        ],
      }
    `);
  });

  it("parses boolean", () => {
    expect(parseExpr("TRUE")).toMatchInlineSnapshot(`
      {
        "type": "boolean_literal",
        "value": true,
      }
    `);
  });

  it("parses null", () => {
    expect(parseExpr("NULL")).toMatchInlineSnapshot(`
      {
        "type": "null_literal",
        "value": null,
      }
    `);
  });

  dialect("bigquery", () => {
    it("parses date", () => {
      expect(parseExpr("DATE '1987-02-17'")).toMatchInlineSnapshot(`
        {
          "type": "date_literal",
          "value": "1987-02-17",
        }
      `);
    });

    it("parses time", () => {
      expect(parseExpr("TIME '12:30:11'")).toMatchInlineSnapshot(`
        {
          "type": "time_literal",
          "value": "12:30:11",
        }
      `);
    });

    it("parses datetime", () => {
      expect(parseExpr("DATETIME '1987-02-17 12:30:11'")).toMatchInlineSnapshot(`
        {
          "type": "datetime_literal",
          "value": "1987-02-17 12:30:11",
        }
      `);
    });

    it("parses timestamp", () => {
      expect(parseExpr("TIMESTAMP '1987-02-17 12:30:11 America/Los_Angeles'"))
        .toMatchInlineSnapshot(`
        {
          "type": "timestamp_literal",
          "value": "1987-02-17 12:30:11 America/Los_Angeles",
        }
      `);
    });
  });

  dialect("bigquery", () => {
    it("parses json", () => {
      expect(parseExpr(`JSON '{"foo": 10}'`)).toMatchInlineSnapshot(`
        {
          "type": "json_literal",
          "value": "{"foo": 10}",
        }
      `);
    });

    it("parses numeric", () => {
      expect(parseExpr(`NUMERIC '123465'`)).toMatchInlineSnapshot(`
        {
          "type": "numeric_literal",
          "value": "123465",
        }
      `);
    });

    it("parses bignumeric", () => {
      expect(parseExpr(`BIGNUMERIC '123456789'`)).toMatchInlineSnapshot(`
        {
          "type": "bignumeric_literal",
          "value": "123456789",
        }
      `);
    });
  });
});

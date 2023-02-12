import { parseAstSelect } from "./ast_test_utils";

describe("select", () => {
  it("parses SELECT with standard clauses", () => {
    expect(
      parseAstSelect(`
        SELECT col1, col2
        FROM tbl
        WHERE true
        GROUP BY col3
        HAVING false
        ORDER BY col4
        LIMIT 100
      `)
    ).toMatchInlineSnapshot(`
      {
        "columns": [
          {
            "name": "col1",
            "type": "identifier",
          },
          {
            "name": "col2",
            "type": "identifier",
          },
        ],
        "from": {
          "name": "tbl",
          "type": "identifier",
        },
        "groupBy": [
          {
            "name": "col3",
            "type": "identifier",
          },
        ],
        "having": {
          "type": "boolean_literal",
          "value": false,
        },
        "limit": {
          "type": "number_literal",
          "value": 100,
        },
        "orderBy": [
          {
            "name": "col4",
            "type": "identifier",
          },
        ],
        "type": "select_stmt",
        "where": {
          "type": "boolean_literal",
          "value": true,
        },
      }
    `);
  });

  it("parses SELECT ALL/DISTINCT", () => {
    expect(parseAstSelect("SELECT DISTINCT *").distinct).toBe("distinct");
    expect(parseAstSelect("SELECT ALL *").distinct).toBe("all");
  });

  it("parses aliases", () => {
    expect(parseAstSelect("SELECT x AS foo").columns).toMatchInlineSnapshot(`
      [
        {
          "alias": {
            "name": "foo",
            "type": "identifier",
          },
          "expr": {
            "name": "x",
            "type": "identifier",
          },
          "type": "alias",
        },
      ]
    `);
  });

  it("parses ORDER BY sort specifiers", () => {
    expect(parseAstSelect("SELECT * FROM t ORDER BY foo ASC, bar DESC").orderBy)
      .toMatchInlineSnapshot(`
      [
        {
          "expr": {
            "name": "foo",
            "type": "identifier",
          },
          "order": "asc",
          "type": "sort_specification",
        },
        {
          "expr": {
            "name": "bar",
            "type": "identifier",
          },
          "order": "desc",
          "type": "sort_specification",
        },
      ]
    `);
  });
});

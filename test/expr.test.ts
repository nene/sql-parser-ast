import { parseExpr } from "./test_utils";

describe("expr", () => {
  it("parses binary expr", () => {
    expect(parseExpr("'hello' + 1")).toMatchInlineSnapshot(`
      {
        "left": {
          "type": "string_literal",
          "value": "hello",
        },
        "operator": "+",
        "right": {
          "type": "number_literal",
          "value": 1,
        },
        "type": "binary_expr",
      }
    `);
  });

  it("parses binary expr with keyword-operators", () => {
    expect(parseExpr("true AND false")).toMatchInlineSnapshot(`
      {
        "left": {
          "type": "boolean_literal",
          "value": true,
        },
        "operator": "and",
        "right": {
          "type": "boolean_literal",
          "value": false,
        },
        "type": "binary_expr",
      }
    `);
  });

  it("parses IN operator", () => {
    expect(parseExpr("foo IN (1, 2, 3)")).toMatchInlineSnapshot(`
      {
        "left": {
          "name": "foo",
          "type": "identifier",
        },
        "operator": "in",
        "right": {
          "items": [
            {
              "type": "number_literal",
              "value": 1,
            },
            {
              "type": "number_literal",
              "value": 2,
            },
            {
              "type": "number_literal",
              "value": 3,
            },
          ],
          "type": "list_expr",
        },
        "type": "binary_expr",
      }
    `);
  });

  it("parses prefix operator", () => {
    expect(parseExpr("NOT false")).toMatchInlineSnapshot(`
      {
        "expr": {
          "type": "boolean_literal",
          "value": false,
        },
        "operator": "not",
        "type": "prefix_op_expr",
      }
    `);

    expect(parseExpr("-x")).toMatchInlineSnapshot(`
      {
        "expr": {
          "name": "x",
          "type": "identifier",
        },
        "operator": "-",
        "type": "prefix_op_expr",
      }
    `);
  });

  it("parses postfix operator", () => {
    expect(parseExpr("x NOT NULL")).toMatchInlineSnapshot(`
      {
        "expr": {
          "name": "x",
          "type": "identifier",
        },
        "operator": "not null",
        "type": "postfix_op_expr",
      }
    `);
  });

  it("parses simple func call", () => {
    expect(parseExpr("my_func(1, 2)")).toMatchInlineSnapshot(`
      {
        "args": [
          {
            "type": "number_literal",
            "value": 1,
          },
          {
            "type": "number_literal",
            "value": 2,
          },
        ],
        "name": {
          "name": "my_func",
          "type": "identifier",
        },
        "type": "func_call",
      }
    `);
  });

  it("parses func call with DISTINCT", () => {
    expect(parseExpr("count(DISTINCT id)")).toMatchInlineSnapshot(`
      {
        "args": [
          {
            "name": "id",
            "type": "identifier",
          },
        ],
        "distinct": true,
        "name": {
          "name": "count",
          "type": "identifier",
        },
        "type": "func_call",
      }
    `);
  });

  it("parses window function call", () => {
    expect(parseExpr("sum(price) OVER myWin")).toMatchInlineSnapshot(`
      {
        "args": [
          {
            "name": "price",
            "type": "identifier",
          },
        ],
        "name": {
          "name": "sum",
          "type": "identifier",
        },
        "over": {
          "name": "myWin",
          "type": "identifier",
        },
        "type": "func_call",
      }
    `);
  });

  it("parses function call with filter", () => {
    expect(parseExpr("sum(price) FILTER (WHERE x > 10)")).toMatchInlineSnapshot(`
      {
        "args": [
          {
            "name": "price",
            "type": "identifier",
          },
        ],
        "filter": {
          "left": {
            "name": "x",
            "type": "identifier",
          },
          "operator": ">",
          "right": {
            "type": "number_literal",
            "value": 10,
          },
          "type": "binary_expr",
        },
        "name": {
          "name": "sum",
          "type": "identifier",
        },
        "type": "func_call",
      }
    `);
  });

  it("parses CAST() expression", () => {
    expect(parseExpr("CAST(42 AS NUMERIC(10, 2))")).toMatchInlineSnapshot(`
      {
        "dataType": {
          "name": "numeric",
          "params": [
            {
              "type": "number_literal",
              "value": 10,
            },
            {
              "type": "number_literal",
              "value": 2,
            },
          ],
          "type": "data_type",
        },
        "expr": {
          "type": "number_literal",
          "value": 42,
        },
        "type": "cast_expr",
      }
    `);
  });

  it("parses BETWEEN expr", () => {
    expect(parseExpr("price BETWEEN 25 AND 100")).toMatchInlineSnapshot(`
      {
        "begin": {
          "type": "number_literal",
          "value": 25,
        },
        "end": {
          "type": "number_literal",
          "value": 100,
        },
        "left": {
          "name": "price",
          "type": "identifier",
        },
        "operator": "between",
        "type": "between_expr",
      }
    `);
  });

  it("parses NOT BETWEEN expr", () => {
    expect(parseExpr("price NOT BETWEEN 25 AND 100")).toMatchInlineSnapshot(`
      {
        "begin": {
          "type": "number_literal",
          "value": 25,
        },
        "end": {
          "type": "number_literal",
          "value": 100,
        },
        "left": {
          "name": "price",
          "type": "identifier",
        },
        "operator": "not between",
        "type": "between_expr",
      }
    `);
  });

  it("parses member expr", () => {
    expect(parseExpr("proj.schema.col")).toMatchInlineSnapshot(`
      {
        "object": {
          "object": {
            "name": "proj",
            "type": "identifier",
          },
          "property": {
            "name": "schema",
            "type": "identifier",
          },
          "type": "member_expr",
        },
        "property": {
          "name": "col",
          "type": "identifier",
        },
        "type": "member_expr",
      }
    `);
  });

  it("parses CASE", () => {
    expect(
      parseExpr(`
        CASE foo
          WHEN 1 THEN 'one'
          WHEN 2 THEN 'two'
          ELSE 'three'
        END`)
    ).toMatchInlineSnapshot(`
      {
        "clauses": [
          {
            "condition": {
              "type": "number_literal",
              "value": 1,
            },
            "result": {
              "type": "string_literal",
              "value": "one",
            },
            "type": "case_when",
          },
          {
            "condition": {
              "type": "number_literal",
              "value": 2,
            },
            "result": {
              "type": "string_literal",
              "value": "two",
            },
            "type": "case_when",
          },
          {
            "result": {
              "type": "string_literal",
              "value": "three",
            },
            "type": "case_else",
          },
        ],
        "expr": {
          "name": "foo",
          "type": "identifier",
        },
        "type": "case_expr",
      }
    `);
  });

  it("parses raise expr", () => {
    expect(parseExpr("RAISE(ABORT, 'Error happened')")).toMatchInlineSnapshot(`
      {
        "args": [
          "abort",
          {
            "type": "string_literal",
            "value": "Error happened",
          },
        ],
        "type": "raise_expr",
      }
    `);
  });
});

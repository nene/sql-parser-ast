import { parseAstExpr } from "./ast_test_utils";
import { dialect } from "../test_utils";

describe("expr", () => {
  it("parses binary expr", () => {
    expect(parseAstExpr("'hello' + 1")).toMatchInlineSnapshot(`
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
    expect(parseAstExpr("true AND false")).toMatchInlineSnapshot(`
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

  it("parses prefix operator", () => {
    expect(parseAstExpr("NOT false")).toMatchInlineSnapshot(`
      {
        "expr": {
          "type": "boolean_literal",
          "value": false,
        },
        "operator": "not",
        "type": "prefix_op_expr",
      }
    `);

    expect(parseAstExpr("-x")).toMatchInlineSnapshot(`
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

  dialect("sqlite", () => {
    it("parses postfix operator", () => {
      expect(parseAstExpr("x NOT NULL")).toMatchInlineSnapshot(`
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
  });

  it("parses simple func call", () => {
    expect(parseAstExpr("my_func(1, 2)")).toMatchInlineSnapshot(`
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
    expect(parseAstExpr("count(DISTINCT id)")).toMatchInlineSnapshot(`
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
    expect(parseAstExpr("sum(price) OVER myWin")).toMatchInlineSnapshot(`
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

  it("parses CAST() expression", () => {
    expect(parseAstExpr("CAST(42 AS NUMERIC(10, 2))")).toMatchInlineSnapshot(`
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
    expect(parseAstExpr("price BETWEEN 25 AND 100")).toMatchInlineSnapshot(`
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
    expect(parseAstExpr("price NOT BETWEEN 25 AND 100")).toMatchInlineSnapshot(`
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
    expect(parseAstExpr("proj.schema.col")).toMatchInlineSnapshot(`
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
});

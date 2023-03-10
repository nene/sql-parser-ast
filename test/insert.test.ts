import { createParseSpecificStmt } from "./test_utils";

describe("insert", () => {
  const parseInsert = createParseSpecificStmt("insert_stmt");

  it("parses basic INSERT", () => {
    expect(
      parseInsert(`
        INSERT INTO tbl (col1, col2)
        VALUES (1, 2), (3, 4)
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
        "table": {
          "name": "tbl",
          "type": "identifier",
        },
        "type": "insert_stmt",
        "values": {
          "type": "values_clause",
          "values": [
            [
              {
                "type": "number_literal",
                "value": 1,
              },
              {
                "type": "number_literal",
                "value": 2,
              },
            ],
            [
              {
                "type": "number_literal",
                "value": 3,
              },
              {
                "type": "number_literal",
                "value": 4,
              },
            ],
          ],
        },
      }
    `);
  });

  it("parses WITH..INSERT", () => {
    expect(
      parseInsert(`
        WITH foo AS (SELECT 1)
        INSERT INTO tbl
        VALUES (1)
      `).with
    ).toMatchInlineSnapshot(`
      {
        "tables": [
          {
            "expr": {
              "columns": [
                {
                  "type": "number_literal",
                  "value": 1,
                },
              ],
              "type": "select_stmt",
            },
            "table": {
              "name": "foo",
              "type": "identifier",
            },
            "type": "common_table_expression",
          },
        ],
        "type": "with_clause",
      }
    `);
  });

  it("parses INSERT OR REPLACE", () => {
    expect(parseInsert(`INSERT OR REPLACE INTO tbl VALUES (1)`).orAction).toBe("replace");
  });

  it("parses REPLACE INTO statement the same as INSERT OR REPLACE INTO", () => {
    expect(parseInsert(`REPLACE INTO tbl VALUES (1)`).orAction).toBe("replace");
  });

  it("parses INSERT .. DEFAULT VALUES", () => {
    expect(parseInsert(`INSERT INTO tbl DEFAULT VALUES`).values).toMatchInlineSnapshot(`
      {
        "type": "default_values",
      }
    `);
  });

  it("parses INSERT .. SELECT", () => {
    expect(parseInsert(`INSERT INTO tbl SELECT 1`).values).toMatchInlineSnapshot(`
      {
        "columns": [
          {
            "type": "number_literal",
            "value": 1,
          },
        ],
        "type": "select_stmt",
      }
    `);
  });

  it("parses INSERT .. SELECT UNION SELECT", () => {
    expect(parseInsert(`INSERT INTO tbl SELECT 1 UNION ALL SELECT 2`).values)
      .toMatchInlineSnapshot(`
      {
        "left": {
          "columns": [
            {
              "type": "number_literal",
              "value": 1,
            },
          ],
          "type": "select_stmt",
        },
        "operator": "union all",
        "right": {
          "columns": [
            {
              "type": "number_literal",
              "value": 2,
            },
          ],
          "type": "select_stmt",
        },
        "type": "compound_select_stmt",
      }
    `);
  });

  it("parses RETURNING clause", () => {
    expect(parseInsert(`INSERT INTO tbl VALUES (1) RETURNING id`).returning).toMatchInlineSnapshot(`
      [
        {
          "name": "id",
          "type": "identifier",
        },
      ]
    `);
  });
});

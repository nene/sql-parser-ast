# SQL Parser AST

Uses [sql-parser-cst][] to parse SQL first into Concrete Syntax Tree (CST)
and then converts the result to Abstract Syntax Tree (AST).

## Synopsis

```ts
import { parse } from "sql-parser-ast";

parse("SELECT * FROM customer WHERE age > 10", { dialect: "sqlite" });
```

The `parse()` function returns the following AST:

```json
{
  "type": "program",
  "statements": [
    {
      "type": "select_stmt",
      "columns": [{ "type": "all_columns" }],
      "from": {
        "type": "identifier",
        "name": "customer"
      },
      "where": {
        "type": "binary_expr",
        "left": {
          "type": "identifier",
          "name": "age"
        },
        "operator": ">",
        "right": {
          "type": "number_literal",
          "value": 10
        }
      }
    }
  ]
}
```

For now it takes the exact same parameters as [sql-parser-cst][].
But the `includeSpaces`, `includeNewlines`, `includeComments` options have no effect.

## Development status

This project is still in very early stages of development.

It supports a fair amount of SQLite syntax, but a lot of stuff is still missing.

Don't use it in production.

[sql-parser-cst]: https://github.com/nene/sql-parser-cst

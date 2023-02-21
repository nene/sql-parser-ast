import { FullTransformMap, Program } from "sql-parser-cst";
import { Node as AstNode } from "../ast/Node";
import { cstToAst } from "../cstToAst";

export const programMap: FullTransformMap<AstNode, Program> = {
  program: (node) => ({
    type: "program",
    statements: cstToAst(node.statements),
  }),
};

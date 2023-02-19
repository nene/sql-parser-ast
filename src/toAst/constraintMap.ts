import { TransformMap } from "../cstTransformer";
import { AllConstraintNodes } from "../cst/Node";
import { Node as AstNode } from "../ast/Node";
import { cstToAst } from "../cstToAst";

export const constraintMap: TransformMap<AstNode, AllConstraintNodes> = {
  constraint: (node) => ({
    type: "constraint",
    name: cstToAst(node.name?.name),
    constraint: cstToAst(node.constraint),
  }),
  constraint_primary_key: (node) => ({
    type: "constraint_primary_key",
    columns: cstToAst(node.columns?.expr.items),
  }),
  constraint_unique: (node) => ({
    type: "constraint_unique",
    columns: cstToAst(node.columns?.expr.items),
  }),
  constraint_index: (node) => ({
    type: "constraint_index",
    columns: cstToAst(node.columns?.expr.items),
  }),
  constraint_check: (node) => ({
    type: "constraint_check",
    expr: cstToAst(node.expr.expr),
  }),
  constraint_foreign_key: (node) => ({
    type: "constraint_foreign_key",
    columns: cstToAst(node.columns?.expr.items),
    references: cstToAst(node.references),
  }),
  references_specification: (node) => ({
    type: "references_specification",
    table: cstToAst(node.table),
    columns: cstToAst(node.columns?.expr.items),
    options: cstToAst(node.options),
  }),
};

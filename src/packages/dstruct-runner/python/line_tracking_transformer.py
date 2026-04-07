"""Insert execution-line probes before statements in every function body."""

from __future__ import annotations

import ast


class LineTrackingTransformer(ast.NodeTransformer):
    def visit_FunctionDef(self, node: ast.FunctionDef) -> ast.FunctionDef:
        self.generic_visit(node)
        node.body = self._instrument_body(node.body)
        return node

    def visit_AsyncFunctionDef(self, node: ast.AsyncFunctionDef) -> ast.AsyncFunctionDef:
        self.generic_visit(node)
        node.body = self._instrument_body(node.body)
        return node

    def _instrument_body(self, body: list[ast.stmt]) -> list[ast.stmt]:
        new_body: list[ast.stmt] = []
        for stmt in body:
            lineno = getattr(stmt, "lineno", None)
            col_offset = getattr(stmt, "col_offset", None)
            if lineno is not None:
                probe = ast.Expr(
                    value=ast.Call(
                        func=ast.Name(id="set_execution_source", ctx=ast.Load()),
                        args=[
                            ast.Constant(value=lineno),
                            ast.Constant(value=0 if col_offset is None else col_offset),
                        ],
                        keywords=[],
                    )
                )
                ast.copy_location(probe, stmt)
                new_body.append(probe)
            new_body.append(stmt)
        return new_body

// Descobrir uma forma melhor de fazer um get da tipagem,
// mais declarativo e menos procedural:

// Há uma orientação para não usar traverses aninhados, pq o babel fica redeclarando
// a função. Fazer a alteração sugerida aqui. 

export default function (babel) {
    const { types: t } = babel;
    function isMiniComponent(node) {
      if (!node || !node.declarations) return false;
      return node.declarations.some((declaration) => {
          if (!declaration.id || !declaration.id.typeAnnotation) return false;
          const typeAnnotation = declaration.id.typeAnnotation.typeAnnotation;
          if (!typeAnnotation || !typeAnnotation.id) return false;
          const interfaceName = typeAnnotation.id.qualification;
          const interfaceAttr = typeAnnotation.id.id;
          if (!interfaceName || !interfaceAttr) return false;
          if (interfaceName.name === "Mini" && interfaceAttr.name === "Component") {
              return true;
          }
  
      });
    }
    return {
      name: "ast-transform", // not required
      visitor: {
        VariableDeclaration(path) {
          if (isMiniComponent(path.node)) {
            path.traverse({
              ArrowFunctionExpression(path) {
                path.get('body').unshiftContainer('body', t.expressionStatement(t.stringLiteral('before')));
              }
            });
          }
        }
      }
    };
}

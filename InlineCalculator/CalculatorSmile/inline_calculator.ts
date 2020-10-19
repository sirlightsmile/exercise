export class InlineCalculator {
  private static operationWeight: { [operation: string]: number } = {
    ["+"]: 2,
    ["-"]: 2,
    ["*"]: 3,
    ["/"]: 3,
    ["%"]: 3,
  };

  static getResult(infixExpression: string): number {
    const expArray: string[] = InlineCalculator.getPostfixArray(
      infixExpression,
    );
    const resultStack: number[] = [];
    const getValues = (stack: number[]): { v1: number; v2: number } => {
      const v2 = stack.pop() ?? 0;
      const v1 = stack.pop() ?? 0;
      return {
        v1: v1,
        v2: v2,
      };
    };

    expArray.forEach((element) => {
      const number = Number(element);
      if (!isNaN(number)) {
        resultStack.push(number);
      } else {
        const v = getValues(resultStack);
        switch (element) {
          case "+":
            resultStack.push(v.v1 + v.v2);
            console.log(`[${v.v1} + ${v.v2}] = ${v.v1 + v.v2}`);
            break;
          case "-":
            resultStack.push(v.v1 - v.v2);
            console.log(`[${v.v1} - ${v.v2}] = ${v.v1 - v.v2}`);
            break;
          case "*":
            resultStack.push(v.v1 * v.v2);
            console.log(`[${v.v1} * ${v.v2}] = ${v.v1 * v.v2}`);
            break;
          case "/":
            resultStack.push(v.v1 / v.v2);
            console.log(`[${v.v1} / ${v.v2}] = ${v.v1 / v.v2}`);
            break;
          case "%":
            resultStack.push(InlineCalculator.mod(v.v1, v.v2));
            console.log(
              `[${v.v1} mod ${v.v2}] = ${InlineCalculator.mod(v.v1, v.v2)}`,
            );
            break;
          default:
            console.log(element);
            throw new Error("OPERATION_NOT_SUPPORTED");
        }
        console.log(resultStack);
      }
    });

    const result = resultStack.pop() ?? -Infinity;
    console.log(`answer : ${result}`);
    return result;
  }

  private static mod(x: number, m: number) {
    return (x % m + m) % m;
  }

  private static getPostfixArray(infixExpression: string): string[] {
    console.log("infix expression ", infixExpression);
    const rexExp: RegExp = new RegExp("(?<=[-+*/%()])|(?=[-+*/%()])");
    const expression = infixExpression.trim().split(rexExp);
    const queue: string[] = [];
    const stack: string[] = [];

    expression.forEach((element) => {
      if (Number.parseInt(element)) {
        queue.push(element);
      } else {
        if (element === ")") {
          let pop = stack.pop();
          while (pop && pop !== "(") {
            queue.push(pop);
            pop = stack.pop();
          }
        } else {
          const shouldCheckStack = element !== "(" && stack.length > 0;
          let lastStack = shouldCheckStack ? stack[stack.length - 1] : null;
          if (lastStack) {
            let lastStackWeight = this.operationWeight[lastStack];
            const currentWeight = this.operationWeight[element];
            while (lastStackWeight >= currentWeight) {
              const pop = stack.pop();
              if (pop) {
                queue.push(pop);
              }

              lastStack = stack[stack.length - 1];
              lastStackWeight = lastStack && lastStack !== "("
                ? this.operationWeight[lastStack]
                : 0;
            }
          }
          stack.push(element);
        }
      }
    });

    const left = stack.length;
    for (let i = 0; i < left; i++) {
      const pop = stack.pop();
      if (pop) {
        queue.push(pop);
      }
    }
    console.log("postfix expression : ", queue.join(" "));
    return queue;
  }
}

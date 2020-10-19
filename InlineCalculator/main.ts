import { InlineCalculator } from "./inline_calculator.ts";
import { exists } from "https://deno.land/std/fs/mod.ts";
import * as path from "https://deno.land/std/path/mod.ts";

class Main {
  constructor() {
    this.start();
  }

  async start() {
    const filePath = Deno.args[0];
    const resultPath = Deno.args[1];
    console.log(`check question from : ${filePath}`);
    const qStr = await this.readFileAsync(filePath);
    const answerStr = this.getAnswer(qStr);
    await this.writeFileAsync(answerStr, resultPath);
  }

  getAnswer(propositionStr: string): string {
    const proposition = propositionStr.split("\n");
    let answerStr = "";
    proposition.forEach((o) => {
      if (answerStr) {
        answerStr += "\n";
      }
      answerStr += InlineCalculator.getResult(o);
    });
    return answerStr;
  }

  private async readFileAsync(filePath: string): Promise<string> {
    if (!filePath) {
      throw new Error("PATH_NOT_FOUND");
    }
    const decoder = new TextDecoder("utf-8");
    const data = await Deno.readFile(filePath);
    const text = decoder.decode(data);
    return text;
  }

  private async writeFileAsync(str: string, filePath: string) {
    const pathExist = filePath ? await exists(filePath) : false;
    const basePath = pathExist ? filePath : ".";
    const savePath = path.join(basePath, "answer.txt");
    await Deno.writeTextFile(savePath, str);
    console.log(
      pathExist
        ? `Save answer to ${savePath}`
        : "Result path not found. save answer to original folder",
    );
  }
}

export const main = new Main();

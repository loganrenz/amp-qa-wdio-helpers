import { SpecFileEnumCreator } from "@src/index"
import { expect } from "chai";

describe("Constants", () => {
    it("should return the correct value", () => {
        const creator = new SpecFileEnumCreator('/Users/narduk/VSCODE/chromecast-selenium-node/test/**/*.spec.ts', )
        const output = creator.toString()
        console.log(output)
        expect(output).to.contain('export enum SpecFiles {')
    });
});
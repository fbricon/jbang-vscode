import axios, { AxiosRequestConfig } from "axios";
import { CancellationToken, CompletionContext, CompletionItemKind, CompletionList, Position, Range, TextDocument } from "vscode";
import { version } from "../extension";
import { compareVersionsDesc } from "../models/Version";
import { CompletionParticipant, EMPTY_LIST } from "./CompletionParticipant";
import { TextHelper } from "./TextHelper";

const GROOVY_PREFIX = "//GROOVY ";
const SEARCH_API = `https://api.sdkman.io/2/candidates/groovy/linux/versions/list`;
const UPDATE_PERIOD = 60 * 60 * 1000; // 1h
const axiosConfig: AxiosRequestConfig<any> = {
    httpsAgent: 'jbang-vscode v' + version
};

let VERSIONS: string[];
let lastUpdate = 0;

export class GroovyVersionCompletion implements CompletionParticipant {

    applies(lineText: string, _position: Position): boolean {
        return lineText.startsWith(GROOVY_PREFIX);
    }

    async provideCompletionItems(document: TextDocument, position: Position, token: CancellationToken, context: CompletionContext): Promise<CompletionList> {
        const line = document.lineAt(position);
        const lineText = line.text;
        if (!this.applies(lineText, position)) {
            return EMPTY_LIST;
        }
        if (!VERSIONS || itsBeenAWhile()) {
            VERSIONS = await searchVersions();
            lastUpdate = new Date().getTime();
        }
        if (!VERSIONS.length) {
            return EMPTY_LIST;
        }
        const start = TextHelper.findStartPosition(lineText, position, GROOVY_PREFIX);
        const end = TextHelper.findEndPosition(lineText, position);
        let result = toCompletionList(new Range(start, end));
        return result;
    }

}

async function searchVersions(): Promise<string[]> {
    console.log("Fetching Groovy versions");
    const response = await axios.get(SEARCH_API, axiosConfig);
    const text = response?.data as string;
    const versions:string[] = [];
    if (text) { //Already sorted by decreasing versions
        const lines = text.split(/\r?\n/);
        lines.forEach(line => {
            if (line.startsWith(' ')){
                versions.push(...line.split(' '));
            }
        });
    }
    return versions.sort(compareVersionsDesc);
}

function toCompletionList(range: Range): CompletionList {
    const items = VERSIONS.map((v: string, index: number) => {
        return {
            label: v,
            kind: CompletionItemKind.Value,
            insertText: v,
            sortText: `${index}`.padStart(4, '0'),
            range
        };
    });
    return new CompletionList(items);
}

function itsBeenAWhile(): boolean {
    return (lastUpdate === 0 || (new Date().getTime() - lastUpdate) > UPDATE_PERIOD);
}


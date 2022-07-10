// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below

import { ExtensionContext, window } from "vscode";
import CommandManager from "./CommandManager";
import EditorListener from "./EditorListener";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: ExtensionContext) {

	CommandManager.initialize(context);
	EditorListener.initialize(context);

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "vscode-jbang" is now active!');
}


// this method is called when your extension is deactivated
export function deactivate() {}

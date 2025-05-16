// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import path = require("path");
import * as vscode from "vscode";
import * as fs from "fs";

async function uriExists(uri: string) {
  try {
    await fs.promises.access(uri, fs.constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

async function isDirectory(uri: string) {
  return (await fs.promises.lstat(uri)).isDirectory();
}

async function findSelectedFolder(args: any) {
  const found =
    args?.fsPath ?? vscode.window.activeTextEditor?.document.fileName;

  if (!!!found) {
    throw new Error("Could not find a selected folder!");
  }

  return (await isDirectory(found)) ? found : path.dirname(found);
}

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Extension "pastinator" is now active!');

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand(
    "pastinator.createFile",
    async (args) => {
      const clipboardContent = await vscode.env.clipboard.readText();

      if (!!!clipboardContent) {
        throw new Error("Empty clipboard! Please copy something first.");
      }

      const selectedFolder = await findSelectedFolder(args);

      const filename = await vscode.window.showInputBox({
        prompt: "What filename do you want for this file?",
      });

      if (!filename) {
        return;
      }

      const newFileWithPath = `${selectedFolder}/${filename}`;
      if (await uriExists(newFileWithPath)) {
        throw new Error("This file already exists");
      }

      const newPath = path.dirname(newFileWithPath);
      await fs.promises.mkdir(newPath, { recursive: true });
      await fs.promises.appendFile(newFileWithPath, clipboardContent);

      const openPath = vscode.Uri.file(newFileWithPath);
      const doc = await vscode.workspace.openTextDocument(openPath);
      await vscode.window.showTextDocument(doc);
    }
  );

  context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}

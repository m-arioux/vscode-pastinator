import * as vscode from "vscode";
import { findSelectedFolder } from "./findSelectedFolder";
import { uriExists } from "./infrastructure/uriExists";
import { CreateFileCommand } from "./createFileCommand.model";
import { createFileAndParentFolders } from "./infrastructure/createFileAndParentFolders";

export async function createFileCommandHandler(command: CreateFileCommand) {
  const clipboardContent = await vscode.env.clipboard.readText();

  if (!!!clipboardContent) {
    throw new Error("Empty clipboard! Please copy something first.");
  }

  const selectedFolder = await findSelectedFolder(
    command.selectedElementInExplorer,
    vscode.window.activeTextEditor?.document.fileName
  );

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

  await createFileAndParentFolders(newFileWithPath, clipboardContent);

  const openPath = vscode.Uri.file(newFileWithPath);
  const doc = await vscode.workspace.openTextDocument(openPath);
  await vscode.window.showTextDocument(doc);
}

import * as vscode from "vscode";
import * as cp from "child_process";

const haskellLangId = "haskell";

export function activate(context: vscode.ExtensionContext) {
  // Create output channel
  let log = vscode.window.createOutputChannel("Ormolu VSCode");

  vscode.languages.registerDocumentRangeFormattingEditProvider(haskellLangId, {
    provideDocumentRangeFormattingEdits(document, range, options, token) {
      const text = document.getText(range);
      try {
        const config = vscode.workspace.getConfiguration("ormolu");
        const args = config.args.join(" ");
        var cmd = config.path
        if (config.args.length > 0) {
          cmd = config.path + " " + args;
        }
        log.appendLine("Calling: " + cmd);
        const ormolu = cp.execSync(cmd, { input: text, cwd: vscode.workspace.getWorkspaceFolder(document.uri).uri.path });
        const formattedText = ormolu.toString();
        return [vscode.TextEdit.replace(range, formattedText)];
      } catch (e) {
        log.appendLine(e.stderr.toString());
        if (vscode.workspace.getConfiguration('ormolu').get('notifyOnParseError')) {
          vscode.window.showErrorMessage(
            " ormolu failed to format the code. " + e.stderr.toString()
          );
        }
      }
    }
  });
}

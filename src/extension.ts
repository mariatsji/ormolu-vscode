import * as vscode from "vscode";
import * as cp from "child_process";

const haskellLangId = "haskell";

export function activate(context: vscode.ExtensionContext) {
  vscode.languages.registerDocumentRangeFormattingEditProvider(haskellLangId, {
    provideDocumentRangeFormattingEdits(document, range, options, token) {
      const text = document.getText(range);
      try {
        const config = vscode.workspace.getConfiguration("ormolu");
        const ormolu = cp.execSync(config.path, { input: text });
        const formattedText = ormolu.toString();
        return [vscode.TextEdit.replace(range, formattedText)];
      } catch (e) {
        if (vscode.workspace.getConfiguration('ormolu').get('notifyOnParseError')) {
          vscode.window.showErrorMessage(
            " ormolu failed to format the code. " + e.stderr.toString()
          );
        }
        console.log(e.stdout.toString());
      }
    }
  });
}

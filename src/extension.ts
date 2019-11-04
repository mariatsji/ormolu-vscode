import * as vscode from 'vscode';
import * as cp from 'child_process';

const haskellLangId = 'haskell';

export function activate(context: vscode.ExtensionContext) {
  vscode.languages.registerDocumentRangeFormattingEditProvider(haskellLangId, {
    provideDocumentRangeFormattingEdits(document, range, options, token) {
      const text = document.getText(range);
      try {
        const ormolu = cp.execSync('ormolu', { input: text });
        const formattedText = ormolu.toString();
        return [vscode.TextEdit.replace(range, formattedText)];
      } catch (e) {
        vscode.window.showErrorMessage("ormolu failed to format the code. " + e.stderr.toString());
        console.log(e.stdout.toString());
      }
    }
  });
}

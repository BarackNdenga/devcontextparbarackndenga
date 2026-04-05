import * as vscode from 'vscode';

// Interface pour le stockage des états d'éditeur
interface EditorState {
    filePath: string;
    viewColumn: number;
    selections: vscode.Selection[];
    visibleRanges: vscode.Range[];
    scrollPosition?: { line: number; character: number };
}

// Interface pour le stockage complet de l'espace de travail
interface WorkspaceState {
    timestamp: number;
    editorStates: EditorState[];
    activeEditorIndex: number;
    layout: {
        groups: number[];
        orientation: vscode.ViewColumn | undefined;
    };
}

export function activate(context: vscode.ExtensionContext) {
    console.log('Extension DevContext activée');

    // Commande pour sauvegarder l'état actuel
    const saveCommand = vscode.commands.registerCommand('devcontext.save', async () => {
        try {
            await saveWorkspaceState(context.workspaceState);
            vscode.window.showInformationMessage('État de l\'espace de travail sauvegardé avec succès');
        } catch (error) {
            vscode.window.showErrorMessage(`Erreur lors de la sauvegarde: ${error}`);
        }
    });

    // Commande pour restaurer l'état précédent
    const restoreCommand = vscode.commands.registerCommand('devcontext.restore', async () => {
        try {
            await restoreWorkspaceState(context.workspaceState);
            vscode.window.showInformationMessage('État de l\'espace de travail restauré avec succès');
        } catch (error) {
            vscode.window.showErrorMessage(`Erreur lors de la restauration: ${error}`);
        }
    });

    // Commande pour lister les sauvegardes
    const listCommand = vscode.commands.registerCommand('devcontext.list', async () => {
        try {
            await listSavedStates(context.workspaceState);
        } catch (error) {
            vscode.window.showErrorMessage(`Erreur lors de la liste des sauvegardes: ${error}`);
        }
    });

    // Commande pour effacer toutes les sauvegardes
    const clearCommand = vscode.commands.registerCommand('devcontext.clear', async () => {
        try {
            await clearAllStates(context.workspaceState);
            vscode.window.showInformationMessage('Toutes les sauvegardes ont été effacées');
        } catch (error) {
            vscode.window.showErrorMessage(`Erreur lors du nettoyage: ${error}`);
        }
    });

    // Ajouter toutes les commandes au contexte
    context.subscriptions.push(saveCommand, restoreCommand, listCommand, clearCommand);
}

export function deactivate() {
    console.log('Extension DevContext désactivée');
}

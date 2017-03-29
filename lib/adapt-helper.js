'use babel';

import AdaptHelperView from './adapt-helper-view';
import { CompositeDisposable } from 'atom';

export default {

  adaptHelperView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    this.adaptHelperView = new AdaptHelperView(state.adaptHelperViewState);
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.adaptHelperView.getElement(),
      visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
        'adapt-helper:clean-text': () => this.clean(),
        'adapt-helper:paste-clean-text': () => this.paste()
    }));
  },

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.adaptHelperView.destroy();
  },

  serialize() {
    return {
      adaptHelperViewState: this.adaptHelperView.serialize()
    };
  },

  cleanText(text) {
    // Clean out all the MS Word chars
    return text
      .split(' ').join(' ')
      .split('‘').join("'")
      .split('’').join("'")
      // Escape the double quotes
      .split('“').join('\\"')
      .split('”').join('\\"')
      .split('•').join('')
      .trim();
  },

  clean() {

    let editor;

    if (editor = atom.workspace.getActiveTextEditor()) {
      let selection = editor.getSelectedText();
      let cleansed = this.cleanText(selection);
      editor.insertText(cleansed);
    }
  },

  paste() {

    let editor;

    if (editor = atom.workspace.getActiveTextEditor()) {
      let clipboard = atom.clipboard.read();
      let cleansed = this.cleanText(clipboard);
      editor.insertText(cleansed);
    }
  }

};

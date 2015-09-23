/**
 * FileManager: Holds the editor's state of each file
 */
function FileManager () {
  this.state = {};
}

/**
 * Filemanager's operations
 */
FileManager.prototype.addFile = function (filename, createSession) {
  if (filename.length == 0) {
    return false;
  }

  if (this.state.hasOwnProperty(filename)) {
    return false;
  }

  this.state[filename] = createSession();
  return true;
};

FileManager.prototype.removeFile = function (filename) {
  if (!this.state.hasOwnProperty(filename)) {
    return false;
  }

  delete this.state[filename];

  return true;
};

FileManager.prototype.renameFile = function (oldFilename, newFilename) {
  if (newFilename.length <= 0) {
    return false;
  }

  if (oldFilename == newFilename) {
    return false;
  }

  if (!this.state.hasOwnProperty(oldFilename)) {
    return false;
  }

  this.state[newFilename] = this.state[oldFilename];
  delete this.state[oldFilename];

  return true;
}

FileManager.prototype.selectFile = function (filename) {
  if (!this.state.hasOwnProperty(filename)) {
    return false;
  }

  return this.state[filename];
};

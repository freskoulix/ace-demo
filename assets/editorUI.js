/**
 * editorUI: Holds the editor's UI managment
 */
window.editorUI = {
  createFile: function (filename) {
    var $file = $('<li class="file" data-name="'+ filename +'">');
    var $fileLink = $('<a class="filename" href="javascript:void(0);" data-name="'+ filename +'"></a>');
    $fileLink.text(filename);
    var $removeButton = $('<a class="remove-file" href="javascript:void(0);">&times;</a>');
    var $renameButton = $('<a class="rename-file" href="javascript:void(0);">&#x21c6;</a>');

    $file.append($fileLink);
    $file.append($renameButton);
    $file.append($removeButton);
    $('#file-list').append($file);
  },
  selectFile: function (filename) {
    $('#file-list').find('.file-selected').removeClass('file-selected');
    $('#file-list').find('a[data-name="' + filename + '"]').addClass('file-selected');
    this.showEditor();
  },
  restoreElements: function ($file) {
    $file.find('input').remove();
    $file.find('.accept-rename').remove();
    $file.find('.cancel-rename').remove();
    $file.find('.filename').show();
    $file.find('.remove-file').show();
    $file.find('.rename-file').show();
  },
  showEditor: function () {
    $('#editor').css({ 'visibility': 'visible' });
  },
  hideEditor: function () {
    $('#editor').css({ 'visibility': 'hidden' });
  },
  startEventListeners: function () {
    editorUI.hideEditor();
    // Add file
    $('#editor-container').on('click', '#create-file-button', function () {
      var filename = $('#create-file-input').val().trim();
      $('#create-file-input').val(''); // Clear new file input
      var check = editor.addFile(filename);
      if (check) {
        editor.selectFile(filename);
      }
    })
    // Rename file
    .on('click', '.rename-file', function renameFile () {
      var $file = $(this).parent();
      var oldFilename = $file.find('.filename').attr('data-name');

      $file.append('<input placeholder="New filename">');
      $file.find('input').val(oldFilename);
      $file.append('<a class="accept-rename" href="javascript:void(0);">&#10003;</a>');
      $file.append('<a class="cancel-rename" href="javascript:void(0);">&times;</a>');

      $file.find('.filename').hide();
      $file.find('.remove-file').hide();
      $file.find('.rename-file').hide();
    })
    .on('click', '.accept-rename', function () {
        var $file = $(this).parent();
        var oldFilename = $file.find('.filename').attr('data-name');
        var newFilename = $file.find('input').val();
        var check = editor.renameFile(oldFilename, newFilename);

        if (!check) {
          return;
        }

        $file.attr('data-name', newFilename);
        $file.find('.filename').attr('data-name', newFilename);
        $file.find('.filename').text(newFilename);

        editorUI.restoreElements($file);
    })
    .on('click', '.cancel-rename', function () {
        var $file = $(this).parent();
        var newFilename = $file.find('input').val();
        var check = editor.renameFile(oldFilename, newFilename);

        $file.find('.filename').html('<a class="filename" href="javascript:void(0);" data-name="'+ oldFilename +'"></a>');
        $file.find('.filename').text(oldFilename);

        editorUI.restoreElements($file);
    })
    // Remove file
    .on('click', '.remove-file', function removeFile () {
      var filename = $(this).parent().find('.filename').attr('data-name');
      var check = editor.removeFile(filename);

      if (!check) {
        return;
      }

      $(this).parent().remove();

      filename = $('#editor-container').find('li').first().find('.filename').text().trim();
      // Hide the editor when no file available
      if (filename.length == 0) {
        editorUI.hideEditor();
        return;
      }

      editor.selectFile(filename);
    })
    // Select file
    .on('click', '.filename', function selectFile () {
      var filename = $(this).attr('data-name');

      editor.selectFile(filename);
    });
  }
}

var settings = require('../tests/settings.json');

casper.test.begin('editor tests', function(test) {
    casper.start(settings.baseUrl, function() {
        this.echo('Visiting: ' + settings.baseUrl, 'INFO');
        test.assertHttpStatus(200);

        casper.echo('Changing viewport to: ' + settings.viewport.width + 'x' + settings.viewport.height);
        casper.viewport(settings.viewport.width, settings.viewport.height);

        // Files to test
        var files = ['alpha', 'beta', 'gamma'];
        var prefix = 'new-'; // prefix for renamed file
        var filename;
        casper.eachThen(files, function (file) {
            filename = file.data;

            casper.echo('Creating file: ' + filename, 'INFO');

            // Create file
            casper.then(function () {
                this.waitForSelector('#create-file-input', function () {
                    this.sendKeys('#create-file-input', filename);
                });
            });
            casper.then(function () {
                this.waitForSelector('#create-file-button', function () {
                    this.click('#create-file-button');
                });
            });
            casper.then(function () {
                test.assertExists('#file-list a[data-name="' + filename + '"]', 'File: ' + filename + ' appeared in filelist');
                var selectedFileCheck = this.evaluate(function (filename) {
                    return $('#file-list a.file-selected').data('name') == filename;
                }, filename);
                test.assert(selectedFileCheck, 'File ' + filename + ' selected in filelist');
            });

            var newFilename = prefix + filename;
            // Rename file
            casper.then(function () {
                this.click('li[data-name="' + filename + '"] .rename-file');
            });
            casper.then(function () {
                this.waitForSelector('#file-list input[placeholder="New filename"]', function () {
                    this.sendKeys('#file-list input[placeholder="New filename"]', newFilename, {reset: true});
                });
            });
            casper.then(function () {
                var fname = this.evaluate(function () {
                    return $('#file-list').text();
                });
                this.click('#file-list li[data-name="' + filename + '"] .accept-rename');
            });
            casper.then(function () {
                this.waitWhileVisible('#file-list input[placeholder="New filename"]', function () {
                    test.assertExists('#file-list li[data-name="' + newFilename + '"]', 'File: ' + newFilename + ' renamed successfully');
                });
            });

            // Edit
            var testText = '// Great news today\n// We even have tests with casperjs\n\n// File: ' + newFilename;
            casper.then(function () {
                this.evaluate(function (testText) {
                    window.editor.editor.getSession().setValue(testText);
                }, testText);
            });
            casper.then(function () {
                var editorText = this.evaluate(function () {
                    return window.editor.editor.getSession().getValue();
                });
                test.assertEquals(editorText, testText, 'Editor contains the entered text');
            });
        });

        // Remove all files
        casper.then(function () {
            this.echo('Removing all files', 'INFO');
        });
        var newFiles = files.map(function (filename) {
            return prefix + filename;
        });
        casper.eachThen(newFiles, function (file) {
            filename = file.data;

            casper.echo('Selecting file: ' + filename, 'INFO');
            casper.then(function () {
                this.click('#file-list li[data-name="' + filename + '"] .filename');
                this.waitForSelector('#file-list li[data-name="' + filename + '"] .file-selected', function () {
                    test.assertExists('#file-list li[data-name="' + filename + '"] .file-selected', 'File selected successfully');
                });
            });

            casper.echo('Removing file: ' + filename, 'INFO');
            // Remove file
            casper.then(function () {
                this.waitForSelector('#file-list li[data-name="' + filename + '"] .remove-file', function () {
                    casper.click('#file-list li[data-name="' + filename + '"] .remove-file');
                });
            });
            casper.then(function () {
                this.waitWhileSelector('#file-list li[data-name="' + filename + '"]', function () {
                    test.assertDoesntExist('#file-list li[data-name="' + filename + '"]', 'File: ' + filename + ' removed successfully');
                });
            });
        });
    }).run(function() {
        test.done();
    });
});

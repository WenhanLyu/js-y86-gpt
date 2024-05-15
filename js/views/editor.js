var EditorView = Backbone.View.extend({
    initialize: function () {
        this.template = _.template($('#tmpl_editor').html());
        this.annotate = this._annotate.bind(this);
        $(window).on('resize', this.resizeEditor.bind(this));
        this.render();
        _.bindAll(this, 'showExplanation', 'hideExplanation');
        vent.on('explanation:received', this.showExplanation);
        this.delegateEvents({
            'click .close-explanation': 'hideExplanation'
        });
    },

    render: function () {
        this.$el.empty().append(this.template({
            code: localStorage.y86_64_sim_src || $('#default_y86_code').html()
        }));

        this.$explanation = this.$('.explanation');

        this.$editor = this.$('.code');
        this.$translatedCode = this.$('.translated-code');
        this.editor = ace.edit(this.$editor.get(0));
        this.translateCode = ace.edit(this.$translatedCode.get(0));
        this.editor.setTheme('ace/theme/textmate');
        this.translateCode.setTheme('ace/theme/textmate');
        this.editor.getSession().setMode('ace/mode/y86');
        this.translateCode.getSession().setMode('ace/mode/c_cpp');
        this.editor.on('change', this.deferredRecompile.bind(this));
        this.resizeEditor();
    },

    getSource: function () {
        return this.editor.getValue();
    },

    resizeEditor: function () {
        var availableHeight = $(window).height() - this.$editor.position().top;
        this.$editor.height(availableHeight / 2); // Assign half of the available height
        this.$translatedCode.height(availableHeight / 2); // Assign the other half
    },

    deferredRecompile: function () {
        if (this.recompileTimeout)
            window.clearTimeout(this.recompileTimeout);
        this.recompileTimeout = window.setTimeout(this.annotate, 500);
    },

    _annotate: function () {
        var value = this.getSource();

        var errors = ASSEMBLE(value, true).errors;

        var errorObjs = _.map(errors, function (error) {
            return {
                row: error[0] - 1,
                column: 0, // not supported
                text: error[1],
                type: 'error'
            }
        });

        this.editor.getSession().setAnnotations(errorObjs);

        // API call to get translated code
        $.ajax({
            url: '/api/translate', // The API endpoint
            method: 'POST',
            contentType: 'application/json', // Set the content type to JSON
            data: JSON.stringify({code: value}), // Convert data to JSON string
            dataType: 'json',
            success: function (response) {
                const formattedCode = response.translatedCode.replace(/```c\n|```/g, '');
                this.translateCode.setValue(formattedCode);
            }.bind(this),
            error: function () {
                this.$translatedCode.text('Error translating code.');
            }.bind(this)
        });
    },

    showExplanation: function (explanation) {
        var availableHeight = $(window).height() - this.$editor.position().top;
        this.$('.code').hide();  // Hide the code sections
        this.$('.explanation').show();            // Show the explanation section
        this.$('.explanation-content').html(explanation);
        this.$explanation.height(availableHeight / 2);
    },

    hideExplanation: function () {
        this.$('.code').show();   // Show the code sections
        this.$('.explanation').hide();              // Hide the explanation section
    },

    remove: function () {
        vent.off('explanation:received', this.showExplanation);
        Backbone.View.prototype.remove.call(this);
    }
});

var vent = _.extend({}, Backbone.Events);


var RegistersView = Backbone.View.extend({
    className: 'registers',

    initialize: function () {
        this.template = _.template($('#tmpl_registers').html());
        this.render();
        _.bindAll(this, 'logRegisters');
        vent.on('log:registers', this.logRegisters);
        this.delegateEvents({
            'click .close-explanation': 'hideExplanation'
        });
    },

    render: function () {
        this.registers = {
            rax_hex: '0x' + padHex(REG[0].toUnsigned().toString(16), 16),
            rax_dec: REG[0].toSigned().toString(10),
            rcx_hex: '0x' + padHex(REG[1].toUnsigned().toString(16), 16),
            rcx_dec: REG[1].toSigned().toString(10),
            rdx_hex: '0x' + padHex(REG[2].toUnsigned().toString(16), 16),
            rdx_dec: REG[2].toSigned().toString(10),
            rbx_hex: '0x' + padHex(REG[3].toUnsigned().toString(16), 16),
            rbx_dec: REG[3].toSigned().toString(10),
            rsp_hex: '0x' + padHex(REG[4].toUnsigned().toString(16), 16),
            rsp_dec: REG[4].toSigned().toString(10),
            rbp_hex: '0x' + padHex(REG[5].toUnsigned().toString(16), 16),
            rbp_dec: REG[5].toSigned().toString(10),
            rsi_hex: '0x' + padHex(REG[6].toUnsigned().toString(16), 16),
            rsi_dec: REG[6].toSigned().toString(10),
            rdi_hex: '0x' + padHex(REG[7].toUnsigned().toString(16), 16),
            rdi_dec: REG[7].toSigned().toString(10),
            r8_hex: '0x' + padHex(REG[8].toUnsigned().toString(16), 16),
            r8_dec: REG[8].toSigned().toString(10),
            r9_hex: '0x' + padHex(REG[9].toUnsigned().toString(16), 16),
            r9_dec: REG[9].toSigned().toString(10),
            r10_hex: '0x' + padHex(REG[10].toUnsigned().toString(16), 16),
            r10_dec: REG[10].toSigned().toString(10),
            r11_hex: '0x' + padHex(REG[11].toUnsigned().toString(16), 16),
            r11_dec: REG[11].toSigned().toString(10),
            r12_hex: '0x' + padHex(REG[12].toUnsigned().toString(16), 16),
            r12_dec: REG[12].toSigned().toString(10),
            r13_hex: '0x' + padHex(REG[13].toUnsigned().toString(16), 16),
            r13_dec: REG[13].toSigned().toString(10),
            r14_hex: '0x' + padHex(REG[14].toUnsigned().toString(16), 16),
            r14_dec: REG[14].toSigned().toString(10),
            sf: SF,
            zf: ZF,
            of: OF,
            stat: STAT,
            err: ERR,
            pc: '0x' + padHex(PC.toString(16), 4)
        };

        this.$el.empty().append(this.template(this.registers));

        // Call the separate function to log the registers
        // this.logRegisters();
    },

    logRegisters: function (lines) {
        var lineOutputs = lines.map(function ($line, index) {
            var isHighlighted = $line.$el.hasClass('highlighted');
            var isError = $line.$el.hasClass('object-code-line-error');
            var lineText = $line.$el.text();

            if (isHighlighted && isError) {
                return '<Error Current> ' + lineText + ' </Error Current>';
            } else if (isError) {
                return '<Error> ' + lineText + ' </Error>';
            } else if (isHighlighted) {
                return '<Current> ' + lineText + ' </Current>';
            } else {
                return lineText;
            }
        });

        var registerData = Object.keys(this.registers).reduce((acc, key) => {
            acc[key] = this.registers[key];
            return acc;
        }, {});


        $.ajax({
            url: '/api/explain',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                codeLines: lineOutputs,
                registers: registerData
            }),
            dataType: 'json',
            success: function (response) {
                vent.trigger('explanation:received', response.explanation);
            }.bind(this),
            error: function () {
                console.log('Error getting explanation.');
            }.bind(this)
        });
    },


    remove: function () {
        vent.off('log:registers', this.logRegisters);
        Backbone.View.prototype.remove.call(this);
    }
});

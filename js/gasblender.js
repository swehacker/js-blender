var Blender = {
    Nitrox: {
        continuous: function(havePO2, havePressure, wantPO2, wantPressure) {
            return Math.floor(((wantPO2 * wantPressure) - (havePO2 * havePressure)) / (wantPressure - havePressure));
        },

        partial: function(havePO2, havePressure, wantPO2, wantPressure) {
            var need = ((((wantPO2/100) - 0.21) / 0.79) * wantPressure);
            var have = 0;
            if ( havePO2 > 21 ) {
                have = ((((havePO2/100) - 0.21) / 0.79) * havePressure);
            }

            return Math.floor( need - have);
        },

        formatPartial: function(havePO2, havePressure, wantPO2, wantPressure, oxygenPressure) {
            return "<div>" +
                "   <div style='float: left; width: 113px;'><b>Have</b><br>" + havePO2 + "% " + havePressure + " bar</div>" +
                "   <div style='float: left; width: 113px;'><b>Want</b><br>" + wantPO2 + "% " + wantPressure + " bar</div>" +
                "   <div><b>Need</b><br>Add " + oxygenPressure + " bar Oxygen and top up with air to " + wantPressure + " bar</div>"
                "</div>"
        },

        formatContinuous: function(havePO2, havePressure, wantPO2, wantPressure, nitrox) {
            return "<div>" +
                "   <div style='float: left; width: 113px;'><b>Have</b><br>" + havePO2 + "% " + havePressure + " bar</div>" +
                "   <div style='float: left; width: 113px;'><b>Want</b><br>" + wantPO2 + "% " + wantPressure + " bar</div>" +
                "   <div><b>Need</b><br>Add EAN" + nitrox + " to " + wantPressure + " bar</div>"
            "</div>"
        }
    },

    Trimix: {
        partial: function(havePO2, haveHe, havePressure, wantPO2, wantHe, wantPressure) {
            var need = ((((wantPO2/100) - 0.21) / 0.79) * wantPressure);
            var have = 0;
            if ( havePO2 > 21 ) {
                have = ((((havePO2/100) - 0.21) / 0.79) * havePressure);
            }

            return Math.floor( need - have);
        },

        formatPartial: function(havePO2, haveTx, havePressure, wantPO2, wantHe, wantPressure, oxygenPressure, heliumPressure) {
            return "<div>" +
                "   <div style='float: left; width: 113px;'><b>Have</b><br>" + havePO2 + "% " + havePressure + " bar</div>" +
                "   <div style='float: left; width: 113px;'><b>Want</b><br>" + wantPO2 + "% " + wantPressure + " bar</div>" +
                "   <div><b>Need</b><br>Add " + oxygenPressure + " bar Oxygen and top up with air to " + wantPressure + " bar</div>"
            "</div>"
        }
    }
};

function calcNitrox() {
    var havePO2 = $('#havePO2').attr('value');
    var havePressure = $('#havePressure').attr('value');
    var wantPO2 = $('#wantPO2').attr('value');
    var wantPressure = $('#wantPressure').attr('value');
    var fillmethod = $('input:radio[name=Fillmethod]:checked').val();

    $("#mixContentPage").find('div[data-collapsed=false]').trigger("collapse");

    if (fillmethod == 'partial') {
        var oxygenPressure = Blender.Nitrox.partial(havePO2, havePressure, wantPO2, wantPressure)
        if (oxygenPressure < 0) {
            displayError("You need either to drain some gas or change the mix!");
        } else if (wantPressure > oxygenPressure + havePressure) {
            displayError("You need either to drain some gas or change the mix!");
        } else {
            clearError();

            var $newCollapsible = $('<div data-role="collapsible" data-collapsed="false" data-mini="true" data-content-theme="c"><h3>Partial Pressure: ' + formatDateTime(new Date()) + '</h3><p>' +
                Blender.Nitrox.formatPartial(havePO2, havePressure, wantPO2, wantPressure, oxygenPressure) + '</p></div>');
            $('#mixContentPage').prepend($newCollapsible);
            $newCollapsible.collapsible();
        }
    } else {
        var PO2 = Blender.Nitrox.continuous(havePO2, havePressure, wantPO2, wantPressure);

        if (PO2 < 21) {
            displayError("The mix you are starting with have too much Oxygen, you need to drain some gas!");
        } else if (PO2 > 40) {
            displayError("There is to much gas in the tanks, you need to drain some gas!");
        } else {
            clearError();

            var $newCollapsible = $('<div data-role="collapsible" data-collapsed="false" data-mini="true" data-content-theme="c"><h3>Continuous Fill: ' + formatDateTime(new Date()) + '</h3><p>' +
                Blender.Nitrox.formatContinuous(havePO2, havePressure, wantPO2, wantPressure, PO2) + '</p></div>');
            $('#mixContentPage').prepend($newCollapsible);
            $newCollapsible.collapsible();
        }
    }
}

function calcTrimix() {
    var havePO2 = $('#havePO2').attr('value');
    var havePressure = $('#havePressure').attr('value');
    var wantPO2 = $('#wantPO2').attr('value');
    var wantPressure = $('#wantPressure').attr('value');

    $("#mixContentPage").find('div[data-collapsed=false]').trigger("collapse");

    if (fillmethod == 'partial') {
        var oxygenPressure = Blender.Trimix.partial(havePO2, havePressure, wantPO2, wantPressure)
        if (oxygenPressure < 0) {
            displayError("You need either to drain some gas or change the mix!");
        } else if (wantPressure > oxygenPressure + havePressure) {
            displayError("You need either to drain some gas or change the mix!");
        } else {
            clearError();

            var $newCollapsible = $('<div data-role="collapsible" data-collapsed="false" data-mini="true" data-content-theme="c"><h3>Partial Pressure: ' + formatDateTime(new Date()) + '</h3><p>' +
                Blender.Nitrox.formatPartial(havePO2, havePressure, wantPO2, wantPressure, oxygenPressure) + '</p></div>');
            $('#mixContentPage').prepend($newCollapsible);
            $newCollapsible.collapsible();
        }
    } else {
        var PO2 = Blender.Nitrox.continuous(havePO2, havePressure, wantPO2, wantPressure);

        if (PO2 < 21) {
            displayError("The mix you are starting with have too much Oxygen, you need to drain some gas!");
        } else if (PO2 > 40) {
            displayError("There is to much gas in the tanks, you need to drain some gas!");
        } else {
            clearError();

            var $newCollapsible = $('<div data-role="collapsible" data-collapsed="false" data-mini="true" data-content-theme="c"><h3>Continuous Fill: ' + formatDateTime(new Date()) + '</h3><p>' +
                Blender.Nitrox.formatContinuous(havePO2, havePressure, wantPO2, wantPressure, PO2) + '</p></div>');
            $('#mixContentPage').prepend($newCollapsible);
            $newCollapsible.collapsible();
        }
    }


}

function displayError(msg) {
    $("#errors")
        .html(msg)
        .css("display", true ? "block" : "none");
}

function clearError() {
    $("#errors")
        .html("")
        .css("display", false ? "block" : "none");
}

function formatDateTime(date) {
    return $.datepicker.formatDate('yy-mm-dd', date) + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
}
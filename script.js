
/**@type {number[]} */
var latencies = [];

$(function(){

    document.addEventListener('jspsych-hardware-message',function(evt){
        latencies.push(parseInt(evt.detail.value, 10));
    });


    var loop_node = {
        timeline : [{
            type: 'categorize',
            trial_duration: 50,
            stimulus: '<div class="stim"> </div>'
        }],
        loop_function: function(dat){
            jsPsych.pluginAPI.hardware({
                'target': 'serial',
                'action': 'read',
                'payload': 12
            });
            return !latencies.length > 1000;
        }
    }
});

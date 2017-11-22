
/**@type {number[]} */
var latencies = [];

$(function(){

    document.addEventListener('jspsych-hardware-message',function(evt){
        latencies.push(parseInt(evt.detail.value, 10));
    });


    var loop_node = {
        timeline : [{
            type: 'categorize-html',
            trial_duration: 100,
            stimulus: '<div class="stim"> </div>',
            key_answer:76,
            feedback_duration:0
        }],
        loop_function: function(dat){
            jsPsych.pluginAPI.hardware({
                'target': 'serial',
                'action': 'read',
                'payload': 12
            });
            return !(latencies.length > 1000);
        }
    }

    jsPsych.init({
        timeline: [loop_node]
    })
});

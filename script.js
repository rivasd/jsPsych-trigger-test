
/**@type {number[]} */
var latencies = [];

$(function(){

    document.addEventListener('jspsych-hardware-message',function(evt){
        if(evt.detail.result){
            latencies.push(parseInt(evt.detail.value, 10));
            jsPsych.data.get().addToLast({latency: parseInt(evt.detail.value, 10)});
        }
        
    });


    var loop_node = {
        timeline : [{
            type: 'categorize-html',
            trial_duration: 200,
            stimulus: '<div class="stim"> </div>',
            key_answer:76,
            feedback_duration:300,
            on_finish: function(data){

            }
        }],
        loop_function: function(dat){
            jsPsych.pluginAPI.hardware({
                'target': 'serial',
                'action': 'read',
                'payload': 12
            });
            return !(latencies.length > 10);
        }
    }

    document.querySelector("#start").addEventListener('click', function(evt){
        jsPsych.init({
            timeline: [loop_node],
            on_finish: function(data){
                data.localSave('LPT_latency.csv', 'csv');
            }
        });
    });

    document.querySelector("#pure").addEventListener('click', function(evt){

        var limit=0;

        function recurs(){

            jsPsych.pluginAPI.hardware({
                target:'serial',
                action: 'send',
                payload: 'r'
            });
            jsPsych.pluginAPI.hardware({
                target:'parallel',
                action:'trigger',
                payload: 255
            });
            jsPsych.pluginAPI.hardware({
                target:'serial',
                action:'read',
                payload:12
            });
            limit++;
            if(limit < 100){
                setTimeout(recurs, 200);
            }
            else{
                console.log(latencies);
            }
            
        }

        recurs();
    });

    
});

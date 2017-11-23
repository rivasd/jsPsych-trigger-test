
/**@type {number} */
var len = 0;

$(function(){

    document.addEventListener('jspsych-hardware-message',function(evt){
        if(evt.detail.result && evt.detail.result!="connected"){
            //latencies.push(parseInt(evt.detail.value, 10));
            jsPsych.data.get().addToLast({latency: parseInt(evt.detail.result, 10)});
        }
        
    });


    var loop_node = {
        timeline : [{
            type: 'categorize-html',
            trial_duration: 200,
            stimulus: '<div class="stim"> </div>',
            key_answer:76,
            feedback_duration:500,
            on_finish: function(data){
                jsPsych.pluginAPI.hardware({
                    'target': 'serial',
                    'action': 'read',
                    'payload': 12
                });
            }
        }],
        loop_function: function(dat){
            len++;
            
            return len < 10;
        }
    }

    document.querySelector("#start").addEventListener('click', function(evt){
        jsPsych.init({
            timeline: [loop_node],
            on_finish: function(data){
                data.localSave('csv', 'LPT_latencies');
            },
            default_iti:500
        });
    });

    document.querySelector("#pure").addEventListener('click', function(evt){

        var limit=0;

        function recurs(){

            jsPsych.pluginAPI.hardware({
                target:'serial',
                action:'read',
                payload:12
            });
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
            
            limit++;
            if(limit < 100){
                setTimeout(recurs, 1000);
            }
            else{
                console.log(latencies);
            }
            
        }

        recurs();
    });

    
});

function isEmail(email){ //Check for valid email addresses
	let regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
	return regex.test(email);
}

function toStep(step,stepType){
    if(stepType != "prev" && stepType != "next"){stepType="next"} //set default step type to "next"
    $(".step").addClass("d-none").removeClass("slide-in-left slide-in-right"); //hide all steps and remove animations
    $(".step-indicator").removeClass("current") // remove highlights from sidebar indicators
    let id = $("#"+step).prop("id").replace("step",""); //get number id for target step
    $("#"+step).addClass(((stepType=="prev")?"slide-in-left":"slide-in-right")).removeClass("d-none"); //add slide animation to the step
    $("#indicator"+id).addClass("current"); // highlight corresponding indicator for the targetted step
}

$("input[type=tel]").mask("+0#"); //E.164 standard formatting for international phone numbers

let billType = "mo";
let plan = "";
const package = {
    Arcade:{mo:9,yr:90},
    Advanced:{mo:12,yr:120},
    Pro:{mo:15,yr:150},
    Onlineservice:{mo:1,yr:10},
    Largerstorage:{mo:2,yr:20},
    Customizableprofile:{mo:2,yr:20}
}
let addOns = [];
let finalCost = 0;

$(document).ready(function(){
    /*********** STEP ONE ***********/
    $("#to-step2-btn").click(function(){
        let errors = 0;
        $(".needed").each(function(){
            $(this).parent().removeClass("error");
            if($(this).val()==""){
                errors++;
                $(this).parent().addClass("error");
                if($(this).prop("id")=="email"){
                    $(this).parent().children("label").children(".form-text").html("This field is required");
                }
            }else if($(this).prop("id")=="email" && $(this).val()!=""){
                if(isEmail($(this).val())==false){
                    errors++;
                    $(this).parent().addClass("error");
                    $(this).parent().children("label").children(".form-text").html("Invalid email");
                }
            }else if($(this).prop("id")=="phone" && $(this).val()!="" && $(this).val().length<12){
                errors++;
                $(this).parent().addClass("error");
                $(this).parent().children("label").children(".form-text").html("Invalid phone number");
            }
        });

        if(errors===0){toStep("step2","next");}
    });

    /*********** STEP TWO ***********/
    $("#the-switch").change(function(){
        $(".billing-type").removeClass("selected-bill");
        if($(this).is(":checked")){
            $(".billing-type").last().addClass("selected-bill");
            $(".plan-info small").removeClass("d-none");
            billType = "yr";
        }else{
            $(".billing-type").first().addClass("selected-bill");
            $(".plan-info small").addClass("d-none");
            billType = "mo";
        }
        $(".plan-info").each(function(){
            let plan = $(this).children("p").first().html();
            $(this).children("p").last().html("$"+package[plan][billType]+"/"+billType);
        })
    });

    $("#to-step3-btn").click(function(){
        if($("input[name=plan-radio]").is(":checked")==false){
            $("#plan-notice").removeClass("d-none");
        }else{
            plan = $("input[name=plan-radio]:checked").val();
            $("#plan-notice").addClass("d-none");
            toStep("step3","next");
        }
    });

    /*********** STEP THREE ***********/
    $("#to-step4-btn").click(function(){
        addOns = [];
        $(".add-on input[type=checkbox]").each(function(){
            if($(this).is(":checked")){
                addOns.push($(this).val());
            }
        });
        $("#plan-bill").children("span").first().html(plan);
        $("#plan-bill").children("span").last().html(((billType=="mo")?"(Monthly)":"(Yearly)"));
        $("#plan-bill-price").html("$"+package[plan][billType]+"/"+billType);
        $("#the-add-ons").html("");
        finalCost = Number(package[plan][billType]);
        if(addOns.length==0){
            $("#the-add-ons").html("<small>No Add-Ons <span>$0/"+billType+"</span></small>");
        }else{
            for(let x=0;x<addOns.length;x++){
                finalCost += Number(package[addOns[x].replace(" ","")][billType]);
                $("#the-add-ons").append("<small>"+addOns[x]+" <span>$"+package[addOns[x].replace(" ","")][billType]+"/"+billType+"</span></small>");
            }
        }
        $("#final-cost").html("$"+finalCost+"/"+billType);
        toStep("step4","next");
    })
})
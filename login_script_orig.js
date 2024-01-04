// Setting regex for validating phone number
var regex;
var showerror = 1;
regex = /^s*(0?\d{3})?([-. (]*(\d{3})[-. )]*)[-](\d{3})\s*$/gm;
// Positive:
// 302-555-1234
// (302)555-1234
// (302) 555-1234
// 302 555 1234
// 3025551234
// 1 302 555 1234

// Negative:
// 302 1 2
// 1 800 THIS-IS-IT
// todo: disable the save mobile number btn and only enable it when the phone number is verified as being from safaricom courier

// Adding in dashes to the encourage 10-digit US mobile number formatting
$('#mobile-phone-number').keydown(function (e) {
var key = e.charCode || e.keyCode || 0;
$text = $(this);

if (key !== 8 && key !== 9) {
    // if($text.val().length >= 11 and $text.val().length <= 12)
    // {
    //     verify_phone();
    // }
    if ( ($text.val().length > 0) &&  $text.val()[0] == 0  )
    {
        // alert($text.val());
        if ($text.val().length === 4) {
            $text.val($text.val() + '-');
        }
        if ($text.val().length === 8) {
            $text.val($text.val() + '-');
        }
    }
    else
    {
        if ($text.val().length === 3) {
            $text.val($text.val() + '-');
        }
        if ($text.val().length === 7) {
            $text.val($text.val() + '-');
        }
    }



}
return;
})


// Setting alerts if not a valid phone number
$('input').on('input', function() {
/* When the phone number entered by the user matches the expected regex we need to initiate a json call that will verify the phone number courier*/
if (($(this).val().length >= 11) && regex.test( $(this).val() )) {
    /*
    Perform an ajax call that will validate the courier and return a json
    response that will be parsed.
    Once the valid courier is matched save the formatted text to an input field as being hidden and
    display a small textbox with the completed formatted text 254712345678 safaricom [check/ticked emoji]


     */


        purchasetimer = setInterval(function () {
            // $.post( "RealTimePurchaseUpdate/test.php", { uuid: "55a645b7-3395-4d6b-8594-b628f1cd4ce0", biuid: "3", mac:"80-CE-B9-70-42-BD", ip:"10.1.0.2" })
            $.post( "RealTimeVerifyPhoneNumberCourier/verify_courier.php", { contact_number: $text.val()/*,mac:mac, ip:ip*/ })
                .done(function( data ) {
                    data = $.parseJSON(data);
                    data_len = data.length;
                    if (data_len <= 0)
                    {
                        // Data record was not inserted properly silently try to reinsert
                        // by calling the appropriate routine this will be important when
                        // Server is being restarted or the mysql server is being taken offline
                        // clearInterval(purchasetimer);
                    }
                    else
                    {
                        console.log(data);
                        // console.log(data.courier);
                        let courier = data.courier;
                        let formatted_phone = data.phone_number;
                        if (courier == "Invalid Operator" || formatted_phone == "Invalid Phone Number ")
                        {
                            //disable the send button
                            console.log("invalid "+ courier);
                            console.log("invalid " + formatted_phone);
                            document.getElementById("disable_me").disabled = true;
                            $('.result').text('This phone number does NOT appear to be valid.')
                            document.getElementById("disable_me").style.display = "none";
                            $('.result').addClass('alert alert-danger')
                            $('.result').removeClass('alert-success')

                        }
                        else
                        {
                            console.log("correct " +formatted_phone);
                            console.log("correct " + courier);
                            //re-enaable the submit button
                            // document.getElementById("disable_me").removeAttribute('disabled');
                            // document.getElementById("disable_me").style.display = "block";
                            if (courier != "safaricom")
                            {
                                document.getElementById("disable_me").disabled = true;
                                $('.result').text('Mobile Operator Must be a Safaricom Line')
                                document.getElementById("disable_me").style.display = "none";
                                document.getElementById("pwd").style.display = "none";
                                $('.result').removeClass('alert-success')
                                $('.result').addClass('alert alert-danger')
                            }
                            else
                            {
                                $('.result').text('The phone number appears valid.')
                                $('.result').addClass('alert alert-success')
                                document.getElementById("pwd").style.display = "block";
                                document.getElementById("mobile-phone-number").value=formatted_phone;
                                // document.getElementById("mobile-phone-number").inn=formatted_phone;
                                document.getElementById("mobile-phone-number").readOnly = true;
                                $('.result').removeClass('alert-danger')
                                clearInterval(purchasetimer);
                            }

                        }


                    }


                    // alert( "Data Loaded: " + $.parseJSON(data;
                });
        }, 2500);




$('.result').text('The phone number appears valid.')
$('.result').addClass('alert alert-success')
$('.result').removeClass('alert-danger')
}

else {
// $('.result').text('This phone number does NOT appear to be valid.')
// $('.result').addClass('alert alert-danger')
// $('.result').removeClass('alert-success')
}

if ($(this).val().length < 11 )  {
$('.result').text('')
$('.result').removeClass('alert alert-danger alert-success')
}

});

$('#password').keyup(function (e) {
    $texts = $(this);


        if ( ($texts.val().length > 0 )   )
        {
            // alert($text.val());
            //re-enaable the submit button
            document.getElementById("disable_me").removeAttribute('disabled');
            document.getElementById("disable_me").style.display = "block";
            $('.result').addClass('alert alert-success');

        }
        else
        {
            //disable the submit button
            document.getElementById("disable_me").style.display = "none";
            document.getElementById("disable_me").disabled = true;
        }



    return;
})

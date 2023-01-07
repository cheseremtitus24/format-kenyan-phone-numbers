// Setting regex for validating phone number
var regex;
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

if (($(this).val().length >= 11) && regex.test( $(this).val() )) {
    /*
    Perform an ajax call that will validate the courier and return a json
    response that will be parsed.
    Once the valid courier is matched save the formatted text to an input field as being hidden and
    display a small textbox with the completed formatted text 254712345678 safaricom [check/ticked emoji]


     */


        purchasetimer = setInterval(function () {
            // $.post( "RealTimePurchaseUpdate/test.php", { uuid: "55a645b7-3395-4d6b-8594-b628f1cd4ce0", biuid: "3", mac:"80-CE-B9-70-42-BD", ip:"10.1.0.2" })
            $.post( "RealTimeVerifyPhoneNumberCourier/test.php", { uuid: keycloak_id, biuid: billing_plan_id, mac:mac, ip:ip })
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
                        // console.log(data);
                        for (i = 0; i < data_len; i++) {
                            /**
                             * Handle serious bug that can occur when an empty string is received
                             * sice an empty string in comparison results to zero
                             * # An empty string converts to 0
                             *
                             */


                            let used = parseInt(data[i]['used']);
                            if (isNaN(used))
                            {
                                used = -1;
                            }
                            let mpesa_pay_status = parseInt(data[i]['status_code']);
                            if (isNaN(mpesa_pay_status))
                            {
                                mpesa_pay_status = -1;
                            }
                            /* Successful account activation + funds received*/
                            if (mpesa_pay_status == 0 && used == 1)
                            {
                                // todo: load a success page and display
                                document.getElementById("WaitingPay").style.display = "none";
                                console.log(mpesa_pay_status + " "+ used);
                                /* Clear the interval execute of ajax check for mpesa callback*/
                                clearInterval(purchasetimer);
                                document.getElementById("successpay").style.display = "block";
                                activ_timer = setTimeout(activationloader, 3000);


                            }
                            /* Wrong Mpesa Pin Entered*/
                            else if(mpesa_pay_status ==2001 && used == 0)
                            {
                                //todo: display fail reason and offer resend only to point of failure do not
                                // rewrite db rows.
                                document.getElementById("WaitingPay").style.display = "none";
                                console.log(mpesa_pay_status + " "+ used);
                                /* Clear the interval execute of ajax check for mpesa callback*/
                                clearInterval(purchasetimer);
                                mpesa_wrong_pin();
                                document.getElementById("successpay").style.display = "block";

                            }
                            /* Mpesa timedout Waiting for user input*/
                            else if (mpesa_pay_status == 1037 && used == 0)
                            {
                                //todo: display fail reason and offer resend only to point of failure do not
                                // rewrite db rows.
                                document.getElementById("WaitingPay").style.display = "none";
                                console.log(mpesa_pay_status + " "+ used);
                                /* Clear the interval execute of ajax check for mpesa callback*/
                                clearInterval(purchasetimer);
                                mpesa_timedout();
                                document.getElementById("successpay").style.display = "block";

                            }
                            /* User Cancelled the stk push request */
                            else if (mpesa_pay_status == 1032 && used == 0)
                            {
                                //todo: display fail reason and offer resend only to point of failure do not
                                // Warn of the risk of device being suspended for a specified time that will be
                                // incremental and resets monthly
                                document.getElementById("WaitingPay").style.display = "none";
                                console.log(mpesa_pay_status + " "+ used);
                                /* Clear the interval execute of ajax check for mpesa callback*/
                                clearInterval(purchasetimer);
                                pay_cancelled();
                                document.getElementById("successpay").style.display = "block";

                            }
                            /* User account has insufficient balance*/
                            else if (mpesa_pay_status == 1 && used == 0)
                            {
                                // todo: load affordably priced bundles to be purchased
                                document.getElementById("WaitingPay").style.display = "none";
                                console.log(mpesa_pay_status + " "+ used);
                                /* Clear the interval execute of ajax check for mpesa callback*/
                                clearInterval(purchasetimer);
                                mpesa_insuffient_bal();
                                document.getElementById("successpay").style.display = "block";

                            }
                            /* Other unhandled mpesa Error */
                            else
                            {
                                // todo: report to technical staff at given telegram number that on
                                // click loads up Telegram/Whatsapp Number.

                            }

                            /**
                             *
                             */
                            // console.log(used);
                            // console.log(mpesa_pay_status);
                            //todo Handle case when there is a timout on pay which should be 10 seconds.
                            // show to client that they should

                            break; /* only handle item at first index- */

                        }
                    }


                    // alert( "Data Loaded: " + $.parseJSON(data;
                });
        }, 2500);




$('.result').text('The phone number appears valid.')
$('.result').addClass('alert alert-success')
$('.result').removeClass('alert-danger')
} else {
$('.result').text('This phone number does NOT appear to be valid.')
$('.result').addClass('alert alert-danger')
$('.result').removeClass('alert-success')
}

if ($(this).val().length < 11)  {
$('.result').text('')
$('.result').removeClass('alert alert-danger alert-success')
}

});
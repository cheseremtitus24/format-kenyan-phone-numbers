<?php

require "Identifier.php";
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    /**
     * Capture client identifying information
     * 1. keycloak pk row id
     * 2. purchase_uuid/ billing_plan_id
     * 3. user_mac
     * 4. user_ip
     */
    $phone_number = $_POST["contact_number"];
    if (isset($phone_number))
        courier_formatted_number($phone_number);
}
/**
 * This module captures a http post request
 * of a phone number and the module
 * perfoms 2 actions on the input data.
 * 1. formats the number
 * 2. crosschecks and returns the courier
 * 3. sends an Mpesa deposit and then reverses the amount to confirm that the number is truly a safaricom number
 * 4. Returns the appropriate error message that is read from json and displayed on web application.
 *
 */
function courier_formatted_number($probe_phone_number)
{
    $newClass = new Identifier;

    // your logic

    # Format phone numbers
    $formatted_number = $newClass->formatted_phone_number($probe_phone_number);
//    echo $formatted_number;
//    echo "<br>";

    # Check ISP
    $isp = $newClass->check_operator($formatted_number);
//    echo "<br>".$isp;

    /* Create an associative array that will hold the formatted phone number and the isp*/
    $assoc_array = array("phone_number" => $formatted_number, "courier" => $isp);
//    print_r($assoc_array);
//    print($assoc_array['courier']);
    echo json_encode($assoc_array);
}


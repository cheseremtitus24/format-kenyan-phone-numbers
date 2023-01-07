<?php
require "Identifier.php";
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
$newClass = new Identifier;

       // your logic

       # Format phone numbers
       $formatted_number = $newClass->formatted_phone_number('0720-595-663');
       echo $formatted_number . "\n";
       echo "<br>";

       # Check ISP
       $isp = $newClass->check_operator($formatted_number);
       echo "<br>".$isp;

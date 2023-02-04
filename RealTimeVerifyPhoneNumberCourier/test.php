<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    /**
     * Capture client identifying information
     * 1. keycloak pk row id
     * 2. purchase_uuid/ billing_plan_id
     * 3. user_mac
     * 4. user_ip
     */
    $keycloak_uid = sanitize_input($_POST["uuid"]);
    $billing_plan_id = sanitize_input($_POST["biuid"]);
    $client_mac = sanitize_input($_POST["mac"]);
    $client_ip = sanitize_input($_POST["ip"]);

    /**
     * Capture the utilized_topup status flag
     * Also Capture the mpesaResultCode
     */
    require 'configs.php';
    global $configValues;
    $dbName = $configValues['CONFIG_DB_NAME'];
    $dbHost = $configValues['CONFIG_DB_HOST'];
    $dbUser = $configValues['CONFIG_DB_USER'];
    /** @var TYPE_NAME $dbPass */
    $dbPass = $configValues['CONFIG_DB_PASS'];

    $last_session_id = null;
    $retarray = null;

# 1.1.1 establish a connection
    try {
        $con = new PDO("mysql:dbhost=$dbHost;dbname=$dbName", $dbUser, $dbPass);
//    echo "Connection was successful";
    } catch (PDOException $e) {
        die("Error Connecting " . $e->getMessage());
    }
    try {
        $con->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $stmt = $con->prepare("SELECT id,utilized_topup as used ,MpesaResultCode as status_code from purchase_queue where

keycloak_fk_id = :keycloak_row_id and purchase_uuid = :purchase_uuid and user_mac = :u_mac and user_ip = :u_ip
");
        $stmt->bindParam(':keycloak_row_id', $keycloak_uid);
        $stmt->bindParam(':purchase_uuid', $billing_plan_id);
        $stmt->bindParam(':u_mac', $client_mac);
        $stmt->bindParam(':u_ip', $client_ip);
        $stmt->execute();

        // set the resulting array to associative
//        $result = $stmt->setFetchMode(PDO::FETCH_ASSOC);
        $counter = $stmt->fetchAll(PDO::FETCH_ASSOC);
        /**
         * Scenario:
         * A user attempts to purchase a bundle. He clicks on multiple packages that are inserted into the
         * purchase_queue and there is a delay in the reception of the stk push.
         * and finally when the stkpush is received and the selected amount is paid. The program needs to
         * perform a matching with the most recent and likely purchased package and select that one.
         * The selected purchase_queue entry should be one that was selected within a 10 minute window
         * from the current timestamp.
         *
         *
         *
         * TODO: When someone Cancels the Mpesa Stkpush bann them for the next 5 minutes before they are allowed to try again.
         */


//        echo "Total rows" .count($counter);
//        $rows = count($counter);
        if (is_null($counter)) {
            $con = null;
        } else {
//            echo "Records returned for " . $stkpush_payments_insert_row_id. " " .print_r($counter);
//            $keycloak_id = $counter[0];
//            $Purchase_Profile_id = $counter[1];
            $retarray = $counter;
//        echo "Something returnd";
            echo json_encode($retarray);
            $con = null;
        }
    } catch (PDOException $e) {
        echo "Error: " . $e->getMessage();
        $con = null;
    }


}

function sanitize_input($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    return $data;
}
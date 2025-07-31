<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (empty($data['full_name']) || empty($data['email']) || empty($data['phone'])) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Please fill in all required fields']);
        exit;
    }

    $to = "dmitriy.f@lotatech.com";
    $subject = "New Form Submission: " . htmlspecialchars($data['full_name']);
    
    $message = "Name: " . htmlspecialchars($data['full_name']) . "\n";
    $message .= "Email: " . htmlspecialchars($data['email']) . "\n";
    $message .= "Phone: " . htmlspecialchars($data['phone']) . "\n";
    $message .= "Position: " . (!empty($data['position']) ? htmlspecialchars($data['position']) : 'Not specified') . "\n";
    $message .= "Agency: " . (!empty($data['agency']) ? htmlspecialchars($data['agency']) : 'Not specified') . "\n";
    $message .= "Company Size: " . (!empty($data['company_size']) ? htmlspecialchars($data['company_size']) : 'Not specified') . "\n";
    $message .= "Message: " . (!empty($data['message']) ? htmlspecialchars($data['message']) : 'No message provided');
    
    $headers = "From: no-reply@yourdomain.com\r\n";
    $headers .= "Reply-To: " . htmlspecialchars($data['email']) . "\r\n";
    $headers .= "X-Mailer: PHP/" . phpversion();

    if (mail($to, $subject, $message, $headers)) {
        echo json_encode(['status' => 'success']);
    } else {
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'Failed to send email']);
    }
} else {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Method not allowed']);
}
?>
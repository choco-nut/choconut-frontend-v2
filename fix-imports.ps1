$files = @(
    "src\pages_temp\ShipmentPage.jsx",
    "src\pages_temp\PaymentPage.jsx",
    "src\pages_temp\OTPVerify.jsx",
    "src\pages_temp\OrdersPage.jsx",
    "src\pages_temp\OrderConfirmation.jsx",
    "src\pages_temp\ForgotPassword.jsx",
    "src\pages_temp\ForgotPasswordConfirm.jsx",
    "src\pages_temp\ChangePassword.jsx",
    "src\pages_temp\Cart.jsx",
    "src\pages_temp\AddFeedback.jsx",
    "src\components_temp\Products\PremiumProducts.jsx",
    "src\components_temp\admin\pages\UserDetails.jsx",
    "src\components_temp\admin\pages\AdminNotificationManagerPage.jsx"
)

foreach ($file in $files) {
    $content = Get-Content $file -Raw
    $content = $content -replace 'from "\.\.\/shared\/api_temp\/axios"', 'from "../shared/api/apiClient"'
    $content = $content -replace 'from "\.\.\/\.\.\/shared\/api_temp\/axios"', 'from "../../shared/api/apiClient"'
    $content = $content -replace 'from "\.\.\/\.\.\/\.\.\/shared\/api_temp\/axios"', 'from "../../../shared/api/apiClient"'
    $content = $content -replace 'import \{ setAccessToken \} from "\.\.\/shared\/api_temp\/auth";', 'import { setAccessToken } from "../shared/api/apiClient";'
    Set-Content -Path $file -Value $content -NoNewline
    Write-Host "Updated: $file"
}

Write-Host "All files updated successfully!"

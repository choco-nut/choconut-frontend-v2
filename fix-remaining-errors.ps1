# Fix remaining issues in all files
$errorFiles = @(
    "src/pages_temp/Login.jsx",
    "src/pages_temp/SignUp.jsx",
    "src/components_temp/admin/AdminHeader.jsx",
    "src/components_temp/Navbar.jsx",
    "src/components_temp/Products/ProductCard.jsx"
)

foreach ($filePath in $errorFiles) {
    if (Test-Path $filePath) {
        $content = Get-Content $filePath -Raw
        
        # Remove duplicate imports
        $lines = $content -split "`r?`n"
        $seen = @{}
        $filtered = $lines | Where-Object {
            if ($_ -match 'import.*from') {
               if ($seen[$_]) {
                    $false
                } else {
                    $seen[$_] = $true
                    $true
                }
            } else {
                $true
            }
        }
        $content = $filtered -join "`r`n"
        
        # Fix API imports - update to shared/api_temp
        $content = $content -replace 'import\s+api\s+from\s+[''"]\.\.\/api\/axios[''"];?', 'import api from "../shared/api_temp/axios";'
        $content = $content -replace 'import\s+api\s+from\s+[''"]\.\.\/\.\.\/api\/axios[''"];?', 'import api from "../../shared/api_temp/axios";'
        
        Set-Content -Path $filePath -Value $content -NoNewline
    }
}

Write-Host "Fixed duplicate imports and API paths!"

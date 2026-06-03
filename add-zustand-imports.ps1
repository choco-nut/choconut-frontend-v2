# PowerShell script to add Zustand store imports to refactored files
$files = Get-ChildItem -Path "src\pages_temp","src\components_temp" -Filter "*.jsx" -Recurse

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    
    # Skip if already has zustand imports
    if ($content -match "useUserStore|useAdminStore|useNotificationStore|useChatStore") {
        
        # Fix API imports
        $content = $content -replace 'import\s+api\s+from\s+[''"]\.\.\/api\/axios[''"];?', 'import api from "../shared/api_temp/axios";'
        $content = $content -replace 'import\s+api\s+from\s+[''"]\.\.\/\.\.\/api\/axios[''"];?', 'import api from "../../shared/api_temp/axios";'
        $content = $content -replace 'import\s+api\s+from\s+[''"]\.\.\/\.\.\/\.\.\/api\/axios[''"];?', 'import api from "../../../shared/api_temp/axios";'
        
        $needsImports = @()
        
        # Check which stores are used
        if ($content -match "useUserStore\(\)") {
            $needsImports += 'import { useUserStore } from "../entities/user/model/useUserStore";'
        }
        if ($content -match "useAdminStore\(\)") {
            $needsImports += 'import { useAdminStore } from "../entities/admin/model/useAdminStore";'
        }
        if ($content -match "useNotificationStore\(\)") {
            $needsImports += 'import { useNotificationStore } from "../entities/notification/model/useNotificationStore";'
        }
        if ($content -match "useChatStore\(\)") {
            $needsImports += 'import { useChatStore } from "../features/chat/model/useChatStore";'
        }
        
        # Add imports after the first import statement
        if ($needsImports.Count -gt 0) {
            # Find the position after the first few imports
            $importSection = ($content -split "`n" | Select-Object -First 15) -join "`n"
            
            if ($importSection -match '(import.*?\r?\n)+') {
                $lastImportIndex = $content.IndexOf(";", $Matches[0].Length)
                if ($lastImportIndex -gt 0) {
                    $zustandImports = "`n" + ($needsImports -join "`n")
                    $content = $content.Insert($lastImportIndex + 1, $zustandImports)
                }
            }
        }
        
        Set-Content -Path $file.FullName -Value $content -NoNewline
    }
}

Write-Host "Zustand imports added successfully!"

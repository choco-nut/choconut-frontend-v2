# PowerShell script to remove unused useContext imports
$files = Get-ChildItem -Path "src" -Filter "*.jsx" -Recurse

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    
    # Remove useContext from named imports
    if ($content -match 'import\s*{[^}]*useContext[^}]*}\s*from\s*["'']react["'']') {
        # Case 1: import { useContext } from "react"; -> import React from "react"; (if empty) or remove line
        $content = $content -replace ', useContext', ''
        $content = $content -replace 'useContext, ', ''
        $content = $content -replace 'import { useContext } from "react";', ''
        $content = $content -replace "import { useContext } from 'react';", ""
        
        # Cleanup empty imports if any remained (optional refinement)
        $content = $content -replace 'import {\s*} from "react";', ''
        
        Set-Content -Path $file.FullName -Value $content -NoNewline
        Write-Host "Cleaned $file"
    }
}

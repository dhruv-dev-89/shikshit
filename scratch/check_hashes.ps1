$frozen = @(
    'ns-mas.html',
    'scholarship.html',
    'registration.html',
    'how-it-works.html',
    'privacypolicy.html',
    'termsandservice.html',
    'components/nsmas_navbar.html',
    'components/nsmas-floating-button.html',
    'css/floating-buttons.css',
    'js/floating-buttons.js'
)

Write-Host "=== CHECKING SHA-256 CHECKSUMS AGAINST public_html_backup ==="
$allFrozenMatch = $true
foreach ($f in $frozen) {
    $backupPath = Join-Path 'public_html_backup' $f
    $p1Path = Join-Path 'public_html' $f
    $p2Path = Join-Path 'public_html (77)' $f
    
    $hBackup = (Get-FileHash -Path $backupPath -Algorithm SHA256).Hash
    $hP1 = (Get-FileHash -Path $p1Path -Algorithm SHA256).Hash
    $hP2 = (Get-FileHash -Path $p2Path -Algorithm SHA256).Hash
    
    if ($hBackup -eq $hP1 -and $hBackup -eq $hP2) {
        Write-Host "OK: $f"
        Write-Host "    SHA-256: $hBackup"
    } else {
        Write-Host "MISMATCH: $f"
        Write-Host "    Backup: $hBackup"
        Write-Host "    P1:     $hP1"
        Write-Host "    P2:     $hP2"
        $allFrozenMatch = $false
    }
}
Write-Host "Result: All frozen files match = $allFrozenMatch"

Write-Host "`n=== CHECKING MODIFIED FILES MATCH ACROSS public_html AND public_html (77) ==="
$modified = @(
    'index.html',
    'product-services.html',
    'become-a-member.html',
    'donate.html',
    'contact.html',
    'css/shikshit/contact.css',
    'css/shikshit/products.css'
)
$allModMatch = $true
foreach ($m in $modified) {
    $p1Path = Join-Path 'public_html' $m
    $p2Path = Join-Path 'public_html (77)' $m
    
    $hP1 = (Get-FileHash -Path $p1Path -Algorithm SHA256).Hash
    $hP2 = (Get-FileHash -Path $p2Path -Algorithm SHA256).Hash
    
    if ($hP1 -eq $hP2) {
        Write-Host "OK (Identical): $m"
        Write-Host "    SHA-256: $hP1"
    } else {
        Write-Host "MISMATCH: $m"
        Write-Host "    P1: $hP1"
        Write-Host "    P2: $hP2"
        $allModMatch = $false
    }
}
Write-Host "Result: All modified files identical = $allModMatch"

Add-Type -AssemblyName System.Drawing
$orig = [System.Drawing.Bitmap]::FromFile('public_html/images/student_happy.png')
$minX = $orig.Width; $maxX = 0; $minY = $orig.Height; $maxY = 0
for ($y = 0; $y -lt $orig.Height; $y += 2) {
    for ($x = 0; $x -lt $orig.Width; $x += 2) {
        if ($orig.GetPixel($x, $y).A -gt 25) {
            if ($x -lt $minX) { $minX = $x }
            if ($x -gt $maxX) { $maxX = $x }
            if ($y -lt $minY) { $minY = $y }
            if ($y -gt $maxY) { $maxY = $y }
        }
    }
}
Write-Host "Happy bounds: X=[$minX, $maxX], Y=[$minY, $maxY]"

$cropX = [Math]::Max(0, $minX - 8)
$cropY = [Math]::Max(0, $minY - 8)
$cropW = [Math]::Min($orig.Width - $cropX, ($maxX - $minX) + 16)
$cropH = [Math]::Min($orig.Height - $cropY, ($maxY - $minY) + 16)

$rect = New-Object System.Drawing.Rectangle($cropX, $cropY, $cropW, $cropH)
$cropped = $orig.Clone($rect, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$orig.Dispose()

$cropped.Save('public_html/images/student_happy.png', [System.Drawing.Imaging.ImageFormat]::Png)
$cropped.Dispose()
Write-Host "Cropped student_happy.png tightly! Dimensions: ${cropW}x${cropH}"


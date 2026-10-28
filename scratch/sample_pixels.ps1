Add-Type -AssemblyName System.Drawing
$bmp = [System.Drawing.Bitmap]::FromFile('public_html/images/student_sad.png')
# Sample some points
$w = $bmp.Width
$h = $bmp.Height
Write-Host "Corner pixels alpha: (0,0)=$($bmp.GetPixel(0,0).A), (1023,0)=$($bmp.GetPixel(1023,0).A), (0,1023)=$($bmp.GetPixel(0,1023).A), (1023,1023)=$($bmp.GetPixel(1023,1023).A)"
# Let's see at Y=500 across X
for ($x = 0; $x -lt $w; $x += 64) {
    $p = $bmp.GetPixel($x, 500)
    Write-Host "X=$x, Y=500: A=$($p.A), R=$($p.R), G=$($p.G), B=$($p.B)"
}
$bmp.Dispose()


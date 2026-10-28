Add-Type -AssemblyName System.Drawing
$bmp = [System.Drawing.Bitmap]::FromFile('public_html/images/student_sad.png')
$minX = $bmp.Width; $maxX = 0; $minY = $bmp.Height; $maxY = 0
for ($y = 0; $y -lt $bmp.Height; $y += 2) {
    for ($x = 0; $x -lt $bmp.Width; $x += 2) {
        if ($bmp.GetPixel($x, $y).A -gt 25) {
            if ($x -lt $minX) { $minX = $x }
            if ($x -gt $maxX) { $maxX = $x }
            if ($y -lt $minY) { $minY = $y }
            if ($y -gt $maxY) { $maxY = $y }
        }
    }
}
$w = $bmp.Width
$h = $bmp.Height
$bmp.Dispose()
Write-Host "Image: ${w}x${h}, Bounds: X=[$minX, $maxX], Y=[$minY, $maxY], CharacterHeight=$($maxY - $minY), CharacterWidth=$($maxX - $minX)"


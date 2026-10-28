Add-Type -AssemblyName System.Drawing
$bmp = [System.Drawing.Bitmap]::FromFile('public_html/images/student_sad.png')
$w = $bmp.Width
$h = $bmp.Height
for ($y = 0; $y -lt $h; $y += 32) {
    for ($x = 0; $x -lt $w; $x += 32) {
        $p = $bmp.GetPixel($x, $y)
        if ($p.A -gt 25 -and ($x -lt 300 -or $x -gt 720)) {
            Write-Host "Stray non-transparent at ($x, $y): A=$($p.A), R=$($p.R), G=$($p.G), B=$($p.B)"
        }
    }
}
$bmp.Dispose()


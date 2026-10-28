Add-Type -AssemblyName System.Drawing

function Remove-Background([string]$inputPath, [string]$outputPath) {
    Write-Host "Processing $inputPath -> $outputPath..."
    $orig = [System.Drawing.Bitmap]::FromFile($inputPath)
    $w = $orig.Width
    $h = $orig.Height

    # Create 32-bit ARGB bitmap
    $bmp = New-Object System.Drawing.Bitmap($w, $h, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.DrawImage($orig, 0, 0, $w, $h)
    $g.Dispose()
    $orig.Dispose()

    # Lock bits for fast memory access
    $rect = New-Object System.Drawing.Rectangle(0, 0, $w, $h)
    $bmpData = $bmp.LockBits($rect, [System.Drawing.Imaging.ImageLockMode]::ReadWrite, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $totalBytes = [Math]::Abs($bmpData.Stride) * $h
    $bytes = New-Object byte[] $totalBytes
    [System.Runtime.InteropServices.Marshal]::Copy($bmpData.Scan0, $bytes, 0, $totalBytes)

    # Array to track visited background pixels
    $isBg = New-Object bool[] ($w * $h)
    $queue = New-Object System.Collections.Generic.Queue[int]

    # Helper function to check if pixel is background color (near white)
    # Format32bppArgb stores B, G, R, A (4 bytes per pixel)
    for ($x = 0; $x -lt $w; $x++) {
        $topIdx = $x
        $botIdx = ($h - 1) * $w + $x
        
        $b1 = $bytes[$topIdx * 4]; $g1 = $bytes[$topIdx * 4 + 1]; $r1 = $bytes[$topIdx * 4 + 2]
        if ($r1 -gt 225 -and $g1 -gt 225 -and $b1 -gt 225) { $isBg[$topIdx] = $true; $queue.Enqueue($topIdx) }

        $b2 = $bytes[$botIdx * 4]; $g2 = $bytes[$botIdx * 4 + 1]; $r2 = $bytes[$botIdx * 4 + 2]
        if ($r2 -gt 225 -and $g2 -gt 225 -and $b2 -gt 225) { $isBg[$botIdx] = $true; $queue.Enqueue($botIdx) }
    }
    for ($y = 0; $y -lt $h; $y++) {
        $leftIdx = $y * $w
        $rightIdx = $y * $w + ($w - 1)

        $b1 = $bytes[$leftIdx * 4]; $g1 = $bytes[$leftIdx * 4 + 1]; $r1 = $bytes[$leftIdx * 4 + 2]
        if ($r1 -gt 225 -and $g1 -gt 225 -and $b1 -gt 225) { $isBg[$leftIdx] = $true; $queue.Enqueue($leftIdx) }

        $b2 = $bytes[$rightIdx * 4]; $g2 = $bytes[$rightIdx * 4 + 1]; $r2 = $bytes[$rightIdx * 4 + 2]
        if ($r2 -gt 225 -and $g2 -gt 225 -and $b2 -gt 225) { $isBg[$rightIdx] = $true; $queue.Enqueue($rightIdx) }
    }

    # BFS Flood fill from perimeter
    while ($queue.Count -gt 0) {
        $curr = $queue.Dequeue()
        $cx = $curr % $w
        $cy = [Math]::Floor($curr / $w)

        if ($cx -gt 0) {
            $n = $curr - 1
            if (-not $isBg[$n]) {
                $b = $bytes[$n * 4]; $g = $bytes[$n * 4 + 1]; $r = $bytes[$n * 4 + 2]
                if ($r -gt 225 -and $g -gt 225 -and $b -gt 225) { $isBg[$n] = $true; $queue.Enqueue($n) }
            }
        }
        if ($cx -lt ($w - 1)) {
            $n = $curr + 1
            if (-not $isBg[$n]) {
                $b = $bytes[$n * 4]; $g = $bytes[$n * 4 + 1]; $r = $bytes[$n * 4 + 2]
                if ($r -gt 225 -and $g -gt 225 -and $b -gt 225) { $isBg[$n] = $true; $queue.Enqueue($n) }
            }
        }
        if ($cy -gt 0) {
            $n = $curr - $w
            if (-not $isBg[$n]) {
                $b = $bytes[$n * 4]; $g = $bytes[$n * 4 + 1]; $r = $bytes[$n * 4 + 2]
                if ($r -gt 225 -and $g -gt 225 -and $b -gt 225) { $isBg[$n] = $true; $queue.Enqueue($n) }
            }
        }
        if ($cy -lt ($h - 1)) {
            $n = $curr + $w
            if (-not $isBg[$n]) {
                $b = $bytes[$n * 4]; $g = $bytes[$n * 4 + 1]; $r = $bytes[$n * 4 + 2]
                if ($r -gt 225 -and $g -gt 225 -and $b -gt 225) { $isBg[$n] = $true; $queue.Enqueue($n) }
            }
        }
    }

    # Apply alpha: background pixels become completely transparent (A = 0)
    for ($i = 0; $i -lt ($w * $h); $i++) {
        $byteOffset = $i * 4
        if ($isBg[$i]) {
            $bytes[$byteOffset + 3] = 0 # Alpha = 0
        } else {
            # Check if this pixel borders a background pixel for soft edge anti-aliasing
            $px = $i % $w
            $py = [Math]::Floor($i / $w)
            $bordersBg = $false
            if ($px -gt 0 -and $isBg[$i - 1]) { $bordersBg = $true }
            elseif ($px -lt ($w - 1) -and $isBg[$i + 1]) { $bordersBg = $true }
            elseif ($py -gt 0 -and $isBg[$i - $w]) { $bordersBg = $true }
            elseif ($py -lt ($h - 1) -and $isBg[$i + $w]) { $bordersBg = $true }

            if ($bordersBg) {
                $b = [int]$bytes[$byteOffset]
                $g = [int]$bytes[$byteOffset + 1]
                $r = [int]$bytes[$byteOffset + 2]
                $brightness = ($r + $g + $b) / 3.0
                if ($brightness -gt 220) {
                    $alphaFactor = [Math]::Max(0.1, [Math]::Min(1.0, (255.0 - $brightness) / 35.0))
                    $bytes[$byteOffset + 3] = [byte]($alphaFactor * 255.0)
                }
            }
        }
    }

    # Copy back and unlock
    [System.Runtime.InteropServices.Marshal]::Copy($bytes, 0, $bmpData.Scan0, $totalBytes)
    $bmp.UnlockBits($bmpData)

    # Save as 32-bit PNG
    $bmp.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $bmp.Dispose()
    Write-Host "Saved transparent PNG: $outputPath"
}

Remove-Background "public_html/images/student_calm.jpg" "public_html/images/student_sad.png"
Remove-Background "public_html/images/student_happy.jpg" "public_html/images/student_happy.png"


Add-Type -AssemblyName System.Drawing
$orig = [System.Drawing.Bitmap]::FromFile('public_html/images/student_sad.png')
# Character bounds were X=[308, 678], Y=[44, 996]
$cropX = 300
$cropY = 36
$cropW = 388
$cropH = 968

$rect = New-Object System.Drawing.Rectangle($cropX, $cropY, $cropW, $cropH)
$cropped = $orig.Clone($rect, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$orig.Dispose()

$cropped.Save('public_html/images/student_sad.png', [System.Drawing.Imaging.ImageFormat]::Png)
$cropped.Dispose()
Write-Host "Cropped student_sad.png tightly! Dimensions: ${cropW}x${cropH}"


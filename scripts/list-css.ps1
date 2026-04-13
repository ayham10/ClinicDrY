$r = Invoke-WebRequest -Uri "https://jacksonfamilydentalonline.com/" -UseBasicParsing
$r.Links | Where-Object { $_.href -match '\.css' } | Select-Object -ExpandProperty href -First 20

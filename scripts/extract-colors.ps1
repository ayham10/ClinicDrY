$r = Invoke-WebRequest -Uri "https://jacksonfamilydentalonline.com/" -UseBasicParsing
[regex]::Matches($r.Content, "#[0-9a-fA-F]{6}") | ForEach-Object { $_.Value } | Sort-Object -Unique

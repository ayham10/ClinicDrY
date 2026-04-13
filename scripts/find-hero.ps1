$r = Invoke-WebRequest -Uri "https://jacksonfamilydentalonline.com/" -UseBasicParsing
$c = $r.Content
$i = $c.IndexOf("your trusted")
"index $i"
if ($i -ge 0) { $c.Substring([Math]::Max(0,$i-400), [Math]::Min(2000, $c.Length - [Math]::Max(0,$i-400))) }

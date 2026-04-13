$r = Invoke-WebRequest -Uri "https://jacksonfamilydentalonline.com/" -UseBasicParsing
$c = $r.Content
$idx = $c.IndexOf(".et_pb_text_1")
if ($idx -ge 0) { $c.Substring([Math]::Max(0,$idx-100), [Math]::Min(1200, $c.Length - [Math]::Max(0,$idx-100))) }

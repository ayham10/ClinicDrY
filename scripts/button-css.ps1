$r = Invoke-WebRequest -Uri "https://jacksonfamilydentalonline.com/" -UseBasicParsing
$c = $r.Content
$idx = $c.IndexOf("dsm_button_0")
if ($idx -ge 0) { $c.Substring([Math]::Max(0,$idx-50), [Math]::Min(2000, $c.Length - [Math]::Max(0,$idx-50))) }

$r = Invoke-WebRequest -Uri "https://jacksonfamilydentalonline.com/" -UseBasicParsing
$c = $r.Content
$idx = $c.IndexOf("et_pb_section_2")
if ($idx -lt 0) { "not found"; exit }
$start = [Math]::Max(0, $idx - 500)
$len = [Math]::Min(3000, $c.Length - $start)
$c.Substring($start, $len)

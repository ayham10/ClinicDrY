$r = Invoke-WebRequest -Uri "https://jacksonfamilydentalonline.com/" -UseBasicParsing
$c = $r.Content
# hero content section often et_pb_section_2 without tb_header
$patterns = @("et_pb_section_2\.et_pb_section","hero-section","et_pb_row_1")
foreach ($p in $patterns) {
  $m = [regex]::Match($c, $p)
  if ($m.Success) {
    "=== $p at $($m.Index) ==="
    $start = [Math]::Max(0, $m.Index - 200)
    $c.Substring($start, [Math]::Min(2500, $c.Length - $start))
    break
  }
}

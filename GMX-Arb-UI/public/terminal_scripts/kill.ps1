$process = Get-NetTCPConnection -LocalPort 6969 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess

if ($process) {
    Write-Host "Killing process $process using port 6969"
    Stop-Process -Id $process -Force
    Write-Host "Process killed"
} else {
    Write-Host "No process found using port 6969"
}
$ErrorActionPreference = 'Stop'
$root = Split-Path $PSScriptRoot -Parent
$user = [System.Security.Principal.WindowsIdentity]::GetCurrent().Name
$script = Join-Path $PSScriptRoot 'AutoStart-Dev.ps1'
$arguments = '-NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File "' + $script + '"'
$shell = Join-Path $env:SystemRoot 'System32\WindowsPowerShell\v1.0\powershell.exe'
$action = New-ScheduledTaskAction -Execute $shell -Argument $arguments -WorkingDirectory $root
$trigger = New-ScheduledTaskTrigger -AtLogOn -User $user
$principal = New-ScheduledTaskPrincipal -UserId $user -LogonType Interactive -RunLevel Limited
$settings = New-ScheduledTaskSettingsSet -StartWhenAvailable -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -MultipleInstances IgnoreNew -ExecutionTimeLimit ([TimeSpan]::Zero) -RestartCount 3 -RestartInterval (New-TimeSpan -Minutes 1)
Register-ScheduledTask -TaskName 'MohaDev-Local' -Action $action -Trigger $trigger -Principal $principal -Settings $settings -Description 'Start and recover MohaDev LocalDB, API, portal, admin and build preview after user logon.' -Force | Out-Null
Start-ScheduledTask -TaskName 'MohaDev-Local'
Write-Output "Registered and started MohaDev-Local for $user (no stored password; limited privileges)."

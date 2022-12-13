---
layout: "@/layouts/MarkdownLayout"
date: 2022-12-12
title: Windows Update Powershell Tricks
author: redanthrax
tags: ["powershell", "windows", "windows update"]
description: Windows Update Powershell tips and tricks
---

## Consolidate Windows Update log
```powershell
Get-WindowsUpdateLog
```
Log location at the root of C:

## Trigger Troubleshooting Pack
```powershell
Get-TroubleshootingPack -Path C:\Windows\diagnostics\system\WindowsUpdate | Invoke-TroubleshootingPack
```
## Check Windows Update Settings
```powershell
Get-Item -Path Registry::HKEY_LOCAL_MACHINE\SOFTWARE\Policies\Microsoft\Windows\WindowsUpdate
```
## Remove Version Restriction
```powershell
Remove-ItemProperty -Path "HKLM:\SOFTWARE\Policies\Microsoft\Windows\WindowsUpdate" -Name "TargetReleaseVersion" -ErrorAction SilentlyContinue
Remove-ItemProperty -Path "HKLM:\SOFTWARE\Policies\Microsoft\Windows\WindowsUpdate" -Name "TargetReleaseVersionInfo" -ErrorAction SilentlyContinue
```

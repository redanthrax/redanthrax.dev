---
layout: "@/layouts/MarkdownLayout"
date: 2022-05-16
title: Powershell Script Template
author: redanthrax
tags: ["powershell","rmm", "template"]
description: Powershell script template for RMM and general use.
---

Recently I've been running [Tactical RMM](https://github.com/amidaware/tacticalrmm) and luckily for most of my scripts
I have taken an "RMM Agnostic" approach to my scripting techniques. From using that technique a type of template has 
emerged which I will immortalize here.

## Powershell Script Template
```
Script_Full_Name.ps1
```

```powershell
<#
.Synopsis
    Write a basic summary of the script.
.DESCRIPTION
    Write a detailed description of the script.
.EXAMPLE
    Example script usage here. Use multiple .EXAMPLE annotation for multi usage.
.INSTRUCTIONS
    Write detailed inscrutions here for setup/rmm usage.
.NOTES
   Version:
   Author:
   Creation Date:
#>

Param(
    [Parameter(Mandatory)]
    [string]$MyParam1
)

function Script_Full_Name {
    [CmdletBinding()]
    Param(
        [Parameter(Mandatory)]
        [string]$MyParam1
    )

    Begin {
        [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
        #Do script setup/checks for services/software and folder creation here
    }

    Process {
        Try {
            #Main Script Process here
        }
        Catch {
            $exception = $_.Exception
            Write-Output "Error: $exception"
        }
    }

    End {
        #Script cleanup and final checks here
        #Check for last errors and exit
        if($error) {
            Exit 1
        }

        Exit 0
    }
}

if (-not(Get-Command 'Script_Full_Name' -errorAction SilentlyContinue)) {
    . $MyInvocation.MyCommand.Path
}
 
$scriptArgs = @{
    MyParam1 = $MyParam1
}
 
Script_Full_Name @scriptArgs
```

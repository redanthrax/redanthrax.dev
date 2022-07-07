---
date: 2022-07-05
title: SELinux on Debian
author: redanthrax
tags: ["debian", "selinux", "security", "azure"]
---

SELinux on Debian - Instructions and commentary

---

# SELinux on Debian

## 1. Azure Virtual Machine Setup

- Login to your Azure tenant and create an aptly name resource group. I prefer something like
"Company-DEPARTMENT-Function". Ex. Hoth-ENG-Logshipper
- Create a new virtual machine in that resource group. Choose options appropriate to you and select Debian as the Image.
- Be sure to provide an SSH public key for login or use the Azure generated one. Password login is not preferred.
- For now we will allow port 22 ssh and lock it down to our IP later.
- No additional disks are needed for the setup.
- Create a new virtual network, subnet, and public ip. Be sure the subnet doesn't collide with any client subnets.

## 2. Azure Post Configuration

- Navigate to the network security group for your new VM and change the SSH inbound rule to only accept connections
from your IP.
- Navigate to the network interface of the new VM and disassociate it from the Public IP.
- Navigate to the Public IP and change the configuration from Dynamic to Static.
- Reassociate the Public IP with the network interface.

## 3. Connecting and Setup

- Connect to your new VM via SSH.
- Run the following commands to ensure the system is up-to-date.
```
sudo apt update && sudo apt upgrade -y
```
Validate the filesystem is the correct type. The standard Debian image on Azure comes with ext4 but validate anyway.
The root / filesystem should say ext4.

```bash
df -Th | grep "^/dev"
```
```bash
/dev/sda1      ext4       30G  823M   27G   3% /
```
---
With the system up-to-date and the filesystem validated we can setup SELinux.

- Get the default policy and the basic set of SELinux utilities.
```
sudo apt-get install selinux-basics selinux-policy-default auditd
```
- Run the following command to configure GRUB and PAM.
```
sudo selinux-activate
```
- Reboot the system, it will label the filesystem on boot then automatically reboot again. This may take some time so
you may not be able to connect again for a while.
```
sudo reboot
```
- Check the SELinux installation to validate there are no issue.
```
sudo check-selinux-installation
```
## 4. Permissive Mode to Enforce Mode

SELinux should now be working in permissive mode. 
- Any denials are logged and all would be denials are available with the following command.
```
sudo audit2why -al
```

This will likely be a large list.

- Use audit2allow to allow rules based on the comm="" name. One example with Azure is NetworkWatcherA
```
sudo audit2allow -a -M NetworkWatcherA
```
- This will create a .pp (hehe) policy package module file that can be installed.
```
sudo semodule -i NetworkWatcherA.pp
```
- In order to create a custom policy to narrow down input for NetworkWatcherA use the following command.
```
grep NetworkWatcherA /var/log/audit/audit.log | audit2allow -M NetworkWatcherA
```
Use the same command above to install the module.

Continue using audit2why to narrow down your rules until you're satisfied with what's allowed and setup services and
processes you expect the server to run (nginx, vpn, etc).

## 5. Persistence

- Edit the kernel command line in /etc/default/grub and add the following to the end:
```
enforcing=1
```

- Reboot
```
sudo reboot
```

Use the following documentation for more info: [SELinux Wiki](https://fedoraproject.org/wiki/SELinux)
---
date: 2022-05-20
title: K3S Debian Server
author: redanthrax
tags: ["debian", "k3s", "kubernetes", "kvm", "bash"]
---

Setting up a k3s Debian server.

---
# K3S Debian Server

## Initial Validation

Verify virtualization technology is enabled.

```bash
egrep -c '(vmx|svm)' /proc/cpuinfo
```

The output should be more than 0. If it's not you need to validate your virtualization feature in the BIOS.

## Software Installation and System Configuration

Run the following command to setup the required software.

```bash
sudo apt install qemu-kvm libvirt-clients libvirt-daemon-system bridge-utils virtinst libvirt-daemon virt-manager -y
```

Enable the libvirtd service.

```bash
sudo systemctl status libvirtd.service
```

Setup the default network and enable the vhost_net module.

```bash
sudo virsh net-list --all
sudo virsh net-start default
sudo virsh net-autostart default
sudo modprobe vhost_net
echo "vhost_net" | sudo  tee -a /etc/modules
lsmod | grep vhost
```

Allow your user account to use virsh commands.

```bash
sudo adduser red libvirt
sudo adduser red libvirt-qemu
```

Refresh the group.

```bash
newgrp libvirt
newgrp libvirt-qemu
```

When you install KVM a linux bridge is created likely named "virbr0". We will use this bridge.
My interface is enp3s0 with my 192.168.11.0/24 subnet.

```bash
sudo vi /etc/network/interfaces
```

```bash
# This file describes the network interfaces available on your system
# and how to activate them. For more information, see interfaces(5).

source /etc/network/interfaces.d/*

# The loopback network interface
auto lo
iface lo inet loopback

auto enp3s0
iface enp3s0 inet manual

auto virbr0
iface virbr0 inet static
	address 192.168.11.4
	broadcast 192.168.11.255
	netmask 255.255.255.0
	network 192.168.11.1
	gateway 192.168.11.1
	bridge_ports enp3s0
	bridge_stp off
	bridge_fd 0
	bridge_maxwait 0
```

Reboot the system.

After the system reboots you are now ready to connect with virt-manager as a gui or virt-install on the terminal.

## Virtual Machine Setup and Configuration

Virt-manager connects over ssh. Open virt-manager and connect to your remote system.
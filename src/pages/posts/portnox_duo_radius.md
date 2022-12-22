---
layout: "@/layouts/MarkdownLayout"
date: 2022-12-21
title: Azure Auth Portnox Radius Service with Duo Push
author: redanthrax
tags: ["azure", "portnox", "duo", "radius"]
description: Using Portnox Radius with Azure and Duo Push
---

# Cloud Radius Auth

The purpose of this document is to show cloud radius auth with mfa push hosted
in the cloud so a client doesn't need on-prem servers. The vpn connection in
our case is radius auth with a meraki firewall.

## Required Services

[Portnox Clear](https://www.portnox.com/portnox-clear/)

[Azure Active Directory](https://portal.azure.com/)

[Duo](https://duo.com/)

[VM Host Azure In Our Case](https://portal.azure.com) For Duo Auth Proxy

## Portnox Clear

Add a new organization on the 
[Clear MSP Page](https://clear.portnox.com/msp/organizations).

Connect to the new organization and go to Settings.

In Authentication Repositories select Azure Active Directory Integration
Service.

Follow the instructions to authenticate with Azure AD.

Navigate to Groups and create a new group. I call mine OrgName Access.

Edit the group and enable VPN Access.

In order to authenticate without the Agent P software be sure to uncheck the
Validate Risk Score for all managed devices.

Go to Members in the group and select AZURE AD.

Select the Azure AD group that will have VPN access.

Navigate to Settings. Click Services. Expand CLEAR RADIUS SERVICE.

Create new CLEAR RADIUS Instance.

Select Location and Create.

This will give you a new RADIUS endpoint that Duo will use to authenticate.

Expand the endpoint to get the details.

NOTE: Users will not show up in Portnox until they attempt authentication.

## Client Azure Tenant

Portnox does not complete admin consent for all the Enterprise Applications
that it needs.

- Navigate to Enterprise Applications in the clients Azure Tenant.
- Find the application "Portnox CLEAR AgentP Enrollment".
- Click Permissions.
- Grant Admin Consent

Double-check any other Portnox apps to validate they have admin consent.

If you have Conditional Access Policies restricting login make sure you add
the Portnox IP to the policy since it will be single factor login from portnox
on the clients behalf.

## Duo

Create a new Account for the company then switch to that account in Duo.

Click on Applications then Protect an Application.

Search for RADIUS in the list and select.

Be sure to select Username Normalization and save.

Make note of the IKEY SKEY and API Hostname at the top.

## Meraki Firewall Configuration

Navigate to Security & SD-WAN.

Client VPN.

Under IPSec Settings select Radius for Authentication.

- Host: Your Duo Auth Proxy Public IP.
- Port: The port you specify in the authproxy.cfg. Default is 1812.
- Secret: Create a randomly generated secret.

Be sure to set a radius timeout to a reasonable value based on how long it would
take a user to respond to an MFA request.

- Radius Timeout: 30

If you have the updated firmware duplicate these settings for AnyConnect Settings.

## Cloud Hosted VM

Create a Linux VM with your favorite cloud host. Make sure you follow security 
best practices when you setup your server.

[Duo Radius Docs](https://duo.com/docs/radius)

Follow the Duo installation instructions for the distro you are using.
```bash
sudo vim /opt/duoauthproxy/conf/authproxy.cfg
```
```bash
[radius_client]
host=Portnox Cloud Radius IP
secret=Portnox Shared Secret
port=Portnox Authentication Port

[radius_server_auto]
ikey=Duo RADIUS IKey
skey=Duo RADIUS SKey
api_host=Duo RADIUS API Host
radius_ip_1=Firewall IP To Listen For (Our case a meraki FW)
radius_secret_1=Meraki Client VPN Share Secret
failmode=secure
client=radius_client
port=Port to Listen On For Authentication Requests
```
```bash
sudo systemctl restart duoauthproxy
```
## Supporting multiple clients

Copy the duo auth installation.
```bash
sudo cp -r /opt/duoauthproxy /opt/client_authproxy
```
Copy the service file.
```bash
sudo cp /etc/systemd/system/duoauthproxy.service /etc/systemd/system/client_authproxy.service
```
Update the service file for the new directory.
```bash
[Unit]
Description=Duo Security Authentication Proxy for Client
After=network.target

[Service]
Type=forking
ExecStart=/opt/client_authproxy/usr/local/bin/authproxyctl start
ExecStop=/opt/client_authproxy/usr/local/bin/authproxyctl stop
StandardOutput=journal
RemainAfterExit=true

[Install]
WantedBy=multi-user.target
```
Enable the service.
```bash
sudo systemctl enable client_authproxy
```
Edit the configuration file.
```bash
sudo vim /opt/client_authproxy/conf/authproxy.cfg
```
Update the radius client values for the new Portnox clear setup and the radius
server info for the new client in duo and meraki info.

NOTE: Be sure to change/increment the port under radius_server_auto and open
it on your VM.

Start the auth proxy for the client.
```bash
sudo systemct start client_authproxy
```
## Follow up

Be sure to test the configuration.

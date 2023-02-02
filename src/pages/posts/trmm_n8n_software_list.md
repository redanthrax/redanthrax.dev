---
layout: "@/layouts/MarkdownLayout"
date: 2023-02-01
title: Using TacticalRMM to generate a Software List with n8n
author: redanthrax
tags: ["tactical rmm", "rmm", "n8n", "automation"]
description: Use n8n to generate a software list from Tactical RMM
---

# Setup

In order to utilize this article you must take several steps.
- Setup Tactical RMM.
- Setup n8n on a server or cluster.
- Install the Tactical RMM community module.

I will be using my dev instance of Tactical RMM and n8n running on minikube.

[Tactical RMM Install](https://docs.tacticalrmm.com/install_server/)

[n8n Docs](https://docs.n8n.io/)

## Tactical RMM

- Create an API Key
    - Navigate to Settings > Global Settings > API Key
    - Add Key
    - Give the Key a name and user to operate under
    - Save the Key for later

## n8n
- Install Community Node
    - Navigate to Settings > Community Nodes
    - Click Install a community node
    - Use NPM Package "n8n-nodes-tacticalrmm"
    - Check the risk box and click Install
- Setup Credentials
    - Navigate to Credentials > Add Credential
    - Search for TacticalRMM
    - Select Tactical RMM API Credentials API
    - Click Continue
    - Fill out the details and save

# Workflows

## Utilize the TacticalRMM Node

You are now ready to setup your first workflow utilizing the API.

NOTE: Make sure you are naming your nodes to keep track of what is happening.
Get Agents, Get Software, etc.

- Start a workflow from scratch.
- Select add your first step.
    - Here you can pick many options. For this example select Manually.
- Once that's added click the plus button to add another node.
- Search for Tactical.
- Select the Tactical Node.
- Ensure the TacticalRMM API Credentials are selected.
- Select Agent as the Resource
- Select Get By Client as the Operation and select your Client
- Click Execute Node to ensure you're getting client Agents.

![Screenshot 1](/sc/trmmn8n_1.png)

- Go back to the canvas and add another TacticalRMM node by clicking the plus
button to link it to the current TacticalRMM node.
- Select Software from the Resource.
- Select Get By Agent from Operation.
- Drag agent_id from the left side into Get By Agent.

![Screen Gif 1](/sc/trmmn8n_2.gif)

- Clicking Execute Node should list software for each agent from the previous
node.

## Merge Data

At this point you need to merge the agents with the software so you have nice
output for your report.

- Click the plus button next to the last node and search for Merge.
- Select the Combine Mode.
- Select the Merge by Fields Combo Mode.
- Set input 1 and input 2 to the value 'agent_id'.
- Set Output to Enrich Input 1.
- Go back to the canvas and add a link from the Agents TacticalRMM node to the
Input 2 on the Merge Node.
- Execute the node and ensure the result is a list of agents with a software list.

## Format Data

- Add a Code node to the Merge node.
- Replace the code with the following snippet.
```typescript
let output = []
for (const item of $input.all()) {
  let sftstr = ''
  for(const software of item.json.software) {
    sftstr += software.name + ','
  }

  output.push({
    hostname: item.json.hostname,
    software:  sftstr
  })
}

return output
```
![Screenshot 3](/sc/trmmn8n_3.png)

## Create Spreadsheet

- Add a Spreadsheet File node to the Code node.
- Select the Write to File Operation.
- Select your desired format.
- Execute the node.

![Screenshot 4](/sc/trmmn8n_4.png)

![Screenshot 5](/sc/trmmn8n_5.png)

![Screenshot 6](/sc/trmmn8n_6.png)

# Conclusion

Explore additional nodes to get the desired output. There are SMTP and Office365
nodes that will help you email reports and additional nodes for formatting or 
activating at specific times of days etc.

Feel free to submit PRs to the [TacticalRMM Github Node Repo](https://github.com/redanthrax/tacticalrmm-node)
with bugs or feature requests.
